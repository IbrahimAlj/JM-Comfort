// server/routes/leads.js
const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");

const router = express.Router();

/**
 * Basic admin guard.
 * If ADMIN_API_KEY not set, admin endpoints are disabled (403).
 * Admin may supply header: x-admin-key: <key> OR Authorization: Bearer <key>
 */
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(403).json({ error: "admin access not configured" });
  }

  const headerKey =
    (req.headers["x-admin-key"] || "").toString() ||
    ((req.headers.authorization || "").toString().startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : "");

  if (headerKey === adminKey) return next();

  return res.status(403).json({ error: "forbidden" });
}

/** Normalizers */
function normStr(v) {
  return (v ?? "").toString().trim();
}
function normLower(v) {
  return normStr(v).toLowerCase();
}
function normalizeLead(body) {
  const phone = normStr(body.phone).replace(/[^\d+]/g, "");
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
  };
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

    // Minimal validation
    if (!lead.email) {
      return res.status(400).json({ error: "email is required" });
    }

    const dedupe_hash = computeDedupeHash(lead);

    const sql = `
      INSERT INTO contact_leads
        (first_name, last_name, name, email, phone, lead_type, service_type, message, dedupe_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE id = id
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
      dedupe_hash,
    ];

    const [result] = await pool.execute(sql, params);

    // Insert created
    if (result.insertId && result.insertId > 0) {
      return res.status(201).json({
        message: "Lead created successfully",
        lead_id: result.insertId,
      });
    }

    // Duplicate case -> idempotent
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

    params.push(limit, offset);

    const sql = `
      SELECT id, first_name, last_name, name, email, phone, lead_type, service_type, message, source, status, created_at, updated_at
      FROM contact_leads
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
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
