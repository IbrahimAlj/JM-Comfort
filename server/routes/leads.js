// server/routes/leads.js
const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");
const requireAdmin = require("../middleware/requireAdmin");
const { sendEmail } = require("../config/mailer");
const { buildAdminNotificationEmail } = require("../templates/adminNotificationEmail");
const logger = require("../config/logger");

const router = express.Router();

/** Normalizers */
function normStr(v) {
  return (v ?? "").toString().trim();
}
function normLower(v) {
  return normStr(v).toLowerCase();
}
function normalizeLead(body) {
  const phone = normStr(body.phone).replace(/[^\d+]/g, "");
  const slotIdRaw = body.availability_slot_id;
  const availability_slot_id =
    slotIdRaw == null || slotIdRaw === "" ? null : Number(slotIdRaw);
  return {
    first_name: normStr(body.first_name) || null,
    last_name: normStr(body.last_name) || null,
    name: normStr(body.name) || null,
    email: normLower(body.email || ""),
    phone,
    lead_type: normStr(body.lead_type) || "contact",
    service_type: normStr(body.service_type) || null,
    message: normStr(body.message) || null,
    source: normStr(body.source) || null,
    preferred_date: normStr(body.preferred_date) || null,
    preferred_time_slot: normStr(body.preferred_time_slot) || null,
    address: normStr(body.address) || null,
    zip: normStr(body.zip) || null,
    availability_slot_id: Number.isInteger(availability_slot_id) ? availability_slot_id : null,
  };
}

function splitName(fullName) {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "Customer", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}
function computeDedupeHash(lead) {
  // Deterministic hash over canonicalized lead fields
  const payload = JSON.stringify({
    email: lead.email,
    phone: lead.phone,
    name: lead.name,
    first_name: lead.first_name,
    last_name: lead.last_name,
    lead_type: lead.lead_type,
    service_type: lead.service_type,
    message: lead.message,
    source: lead.source,
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

/**
 * POST /api/leads
 * Public endpoint to create a lead.
 */
router.post("/", async (req, res) => {
  try {
    const lead = normalizeLead(req.body);
    const errors = [];

    // Validation
    const validLeadTypes = ["contact", "quote"];

    if (!lead.email) {
      errors.push("email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      errors.push("email must be valid");
    } else if (lead.email.length > 100) {
      errors.push("email must not exceed 100 characters");
    }

    if (lead.name && lead.name.length > 120) {
      errors.push("name must not exceed 120 characters");
    }

    if (lead.first_name && lead.first_name.length > 50) {
      errors.push("first_name must not exceed 50 characters");
    }

    if (lead.last_name && lead.last_name.length > 50) {
      errors.push("last_name must not exceed 50 characters");
    }

    if (lead.phone && lead.phone.length > 50) {
      errors.push("phone must not exceed 50 characters");
    }

    if (lead.service_type && lead.service_type.length > 80) {
      errors.push("service_type must not exceed 80 characters");
    }

    if (lead.source && lead.source.length > 100) {
      errors.push("source must not exceed 100 characters");
    }

    if (lead.message && lead.message.length > 5000) {
      errors.push("message must not exceed 5000 characters");
    }

    if (!validLeadTypes.includes(lead.lead_type)) {
      errors.push("lead_type must be one of: contact, quote");
    }

    // Optional rule: require at least one identifying name field
    if (!lead.name && !lead.first_name && !lead.last_name) {
      errors.push("name or first_name/last_name is required");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    // If the lead picked a slot, validate it before anything else.
    let chosenSlot = null;
    if (lead.availability_slot_id) {
      const [slotRows] = await pool.execute(
        `SELECT * FROM availability_slots WHERE id = ? LIMIT 1`,
        [lead.availability_slot_id]
      );
      if (slotRows.length === 0) {
        return res.status(400).json({ error: "Selected time slot is not available" });
      }
      const s = slotRows[0];
      if (!s.is_active) {
        return res.status(400).json({ error: "Selected time slot is no longer offered" });
      }
      if (s.booked_count >= s.capacity) {
        return res.status(409).json({ error: "Selected time slot is already full" });
      }
      chosenSlot = s;
    }

    const dedupe_hash = computeDedupeHash(lead);

    // Window-based dedupe: reject identical submissions within the last 15 min,
    // but allow legitimate resubmissions after that window.
    const DEDUPE_WINDOW_MINUTES = 15;
    const [dupRows] = await pool.execute(
      `SELECT id FROM contact_leads
        WHERE dedupe_hash = ?
          AND created_at >= (NOW() - INTERVAL ? MINUTE)
        LIMIT 1`,
      [dedupe_hash, DEDUPE_WINDOW_MINUTES]
    );
    if (dupRows.length > 0) {
      return res.status(200).json({ ok: true, deduped: true });
    }

    const sql = `
      INSERT INTO contact_leads
        (first_name, last_name, name, email, phone, lead_type, service_type, message, preferred_date, preferred_time_slot, address, zip, availability_slot_id, dedupe_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      lead.first_name,
      lead.last_name,
      lead.name,
      lead.email,
      lead.phone || null,
      lead.lead_type,
      lead.service_type || null,
      lead.message || null,
      lead.preferred_date || null,
      lead.preferred_time_slot || null,
      lead.address || null,
      lead.zip || null,
      chosenSlot ? chosenSlot.id : null,
      dedupe_hash,
    ];

    const [result] = await pool.execute(sql, params);

    // If they booked a slot, record the slot usage + create a pending appointment
    // tied to the lead so the admin approval flow picks it up.
    if (chosenSlot && result.insertId) {
      try {
        await pool.execute(
          `UPDATE availability_slots
             SET booked_count = booked_count + 1
           WHERE id = ? AND booked_count < capacity`,
          [chosenSlot.id]
        );

        const { first, last } = splitName(lead.name || `${lead.first_name || ""} ${lead.last_name || ""}`);
        const firstName = lead.first_name || first;
        const lastName = lead.last_name || last;

        const [custRows] = await pool.execute(
          `SELECT id FROM customers WHERE email = ? LIMIT 1`,
          [lead.email]
        );
        let customerId;
        if (custRows.length > 0) {
          customerId = custRows[0].id;
          await pool.execute(
            `UPDATE customers SET first_name = ?, last_name = ?, phone = ? WHERE id = ?`,
            [firstName || "Customer", lastName || "", lead.phone || null, customerId]
          );
        } else {
          const [ins] = await pool.execute(
            `INSERT INTO customers (first_name, last_name, email, phone)
             VALUES (?, ?, ?, ?)`,
            [firstName || "Customer", lastName || "", lead.email, lead.phone || null]
          );
          customerId = ins.insertId;
        }

        const slotDate = chosenSlot.slot_date instanceof Date
          ? chosenSlot.slot_date.toISOString().slice(0, 10)
          : chosenSlot.slot_date;
        const scheduledAt = `${slotDate} ${chosenSlot.start_time}`;
        const endAt = `${slotDate} ${chosenSlot.end_time}`;

        await pool.execute(
          `INSERT INTO appointments
             (customer_id, scheduled_at, end_at, status, notes, lead_id)
           VALUES (?, ?, ?, 'pending', ?, ?)`,
          [
            customerId,
            scheduledAt,
            endAt,
            `Quote request #${result.insertId}${lead.service_type ? ` — ${lead.service_type}` : ""}${lead.message ? `\n${lead.message}` : ""}`.slice(0, 2000),
            result.insertId,
          ]
        );
      } catch (bookingErr) {
        logger.error("[leads] failed to create appointment from slot", { error: bookingErr.message });
      }
    }

    if (result.insertId && result.insertId > 0) {
      // Send admin notification email
      try {
        const adminEmailContent = buildAdminNotificationEmail({
          name: lead.name || [lead.first_name, lead.last_name].filter(Boolean).join(" "),
          email: lead.email,
          phone: lead.phone,
          lead_type: lead.lead_type,
          service_type: lead.service_type,
          message: lead.message,
          address: lead.address,
          zip: lead.zip,
          preferred_date: lead.preferred_date,
          preferred_time_slot: lead.preferred_time_slot,
        });
        const adminTo = process.env.ADMIN_NOTIFICATION_EMAIL;
        if (!adminTo) {
          logger.warn("[leads] ADMIN_NOTIFICATION_EMAIL not set — skipping admin notification");
        } else {
          await sendEmail({
            to: adminTo,
            subject: adminEmailContent.subject,
            html: adminEmailContent.html,
            text: adminEmailContent.text,
          });
        }
      } catch (emailErr) {
        logger.error("[leads] Failed to send admin notification email", { error: emailErr.message });
      }

      // Send customer confirmation email
      try {
        await sendEmail({
          to: lead.email,
          subject: "Thank you for contacting JM Comfort",
          html: "<p>Thank you for reaching out to JM Comfort. We have received your request and will get back to you shortly.</p>",
          text: "Thank you for reaching out to JM Comfort. We have received your request and will get back to you shortly.",
        });
      } catch (emailErr) {
        logger.error("[leads] Failed to send customer confirmation email", { error: emailErr.message });
      }

      return res.status(201).json({
        message: "Lead created successfully",
        lead_id: result.insertId,
      });
    }

    return res.status(200).json({ ok: true, deduped: true });
  } catch (err) {
    console.error("[leads] Failed to create lead:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/leads/admin/leads
 * Admin list endpoint.
 * Query params: status, limit, offset
 */
router.get("/admin/leads", requireAdmin, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
    const status = (req.query.status || "").trim();

    const where = [];
    const params = [];

    if (status) {
      where.push("status = ?");
      params.push(status);
    }

    const sql = `
      SELECT id, first_name, last_name, name, email, phone, lead_type, service_type, message, source, status, preferred_date, preferred_time_slot, address, zip, created_at, updated_at
      FROM contact_leads
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [rows] = await pool.execute(sql, params);
    return res.json({ ok: true, leads: rows });
  } catch (err) {
    console.error("[leads] Failed to list leads:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/leads/admin/leads/:id
 * Admin get-by-id.
 */
router.get("/admin/leads/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "invalid id" });
    }

    const [rows] = await pool.execute(
      `SELECT * FROM contact_leads WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    return res.json({ ok: true, lead: rows[0] });
  } catch (err) {
    console.error("[leads] Failed to fetch lead:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
