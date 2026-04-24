const express = require("express");
const pool = require("../config/db");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function parseDateString(v) {
  if (!v) return null;
  const s = String(v).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

function parseTimeString(v) {
  if (!v) return null;
  const s = String(v).trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
  return null;
}

function formatSlot(row) {
  return {
    id: row.id,
    slot_date: row.slot_date instanceof Date
      ? row.slot_date.toISOString().slice(0, 10)
      : row.slot_date,
    start_time: row.start_time,
    end_time: row.end_time,
    capacity: row.capacity,
    booked_count: row.booked_count,
    is_active: !!row.is_active,
    is_full: row.booked_count >= row.capacity,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * GET /api/availability
 * Public: list upcoming active slots that still have capacity.
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM availability_slots
        WHERE is_active = TRUE
          AND booked_count < capacity
          AND slot_date >= CURDATE()
        ORDER BY slot_date ASC, start_time ASC
        LIMIT 200`
    );
    return res.json({ slots: rows.map(formatSlot) });
  } catch (err) {
    console.error("[availability] list failed:", err.message);
    return res.status(500).json({ error: "Failed to load availability" });
  }
});

/**
 * GET /api/availability/admin
 * Admin: list all slots regardless of status.
 */
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM availability_slots
        ORDER BY slot_date DESC, start_time ASC
        LIMIT 500`
    );
    return res.json({ slots: rows.map(formatSlot) });
  } catch (err) {
    console.error("[availability] admin list failed:", err.message);
    return res.status(500).json({ error: "Failed to load availability" });
  }
});

/**
 * POST /api/availability (admin)
 * body: { slot_date, start_time, end_time, capacity?, notes? }
 */
router.post("/", requireAdmin, async (req, res) => {
  const slot_date = parseDateString(req.body.slot_date);
  const start_time = parseTimeString(req.body.start_time);
  const end_time = parseTimeString(req.body.end_time);
  const capacityRaw = req.body.capacity;
  const capacity = capacityRaw == null || capacityRaw === "" ? 1 : Number(capacityRaw);
  const notes = req.body.notes ? String(req.body.notes).trim().slice(0, 255) : null;

  const errors = [];
  if (!slot_date) errors.push("slot_date must be YYYY-MM-DD");
  if (!start_time) errors.push("start_time must be HH:MM");
  if (!end_time) errors.push("end_time must be HH:MM");
  if (start_time && end_time && end_time <= start_time) errors.push("end_time must be after start_time");
  if (!Number.isFinite(capacity) || capacity < 1) errors.push("capacity must be >= 1");
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });

  try {
    const [result] = await pool.execute(
      `INSERT INTO availability_slots (slot_date, start_time, end_time, capacity, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [slot_date, start_time, end_time, capacity, notes]
    );
    const [rows] = await pool.execute(
      `SELECT * FROM availability_slots WHERE id = ?`,
      [result.insertId]
    );
    return res.status(201).json({ slot: formatSlot(rows[0]) });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "A slot already exists for that date and start time" });
    }
    console.error("[availability] create failed:", err.message);
    return res.status(500).json({ error: "Failed to create slot" });
  }
});

/**
 * PATCH /api/availability/:id (admin)
 * body: { capacity?, is_active?, notes?, slot_date?, start_time?, end_time? }
 */
router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "invalid id" });
  }

  const [existing] = await pool.execute(
    `SELECT * FROM availability_slots WHERE id = ?`,
    [id]
  );
  if (existing.length === 0) return res.status(404).json({ error: "Slot not found" });

  const updates = [];
  const values = [];
  const has = (k) => Object.prototype.hasOwnProperty.call(req.body, k);

  if (has("slot_date")) {
    const d = parseDateString(req.body.slot_date);
    if (!d) return res.status(400).json({ error: "slot_date must be YYYY-MM-DD" });
    updates.push("slot_date = ?");
    values.push(d);
  }
  if (has("start_time")) {
    const t = parseTimeString(req.body.start_time);
    if (!t) return res.status(400).json({ error: "start_time must be HH:MM" });
    updates.push("start_time = ?");
    values.push(t);
  }
  if (has("end_time")) {
    const t = parseTimeString(req.body.end_time);
    if (!t) return res.status(400).json({ error: "end_time must be HH:MM" });
    updates.push("end_time = ?");
    values.push(t);
  }
  if (has("capacity")) {
    const c = Number(req.body.capacity);
    if (!Number.isFinite(c) || c < 1) return res.status(400).json({ error: "capacity must be >= 1" });
    updates.push("capacity = ?");
    values.push(c);
  }
  if (has("is_active")) {
    const v = req.body.is_active;
    updates.push("is_active = ?");
    values.push(v === true || v === "true" || v === 1 || v === "1");
  }
  if (has("notes")) {
    updates.push("notes = ?");
    values.push(req.body.notes ? String(req.body.notes).trim().slice(0, 255) : null);
  }

  if (updates.length === 0) return res.status(400).json({ error: "No valid fields provided" });

  values.push(id);
  try {
    await pool.execute(`UPDATE availability_slots SET ${updates.join(", ")} WHERE id = ?`, values);
    const [rows] = await pool.execute(`SELECT * FROM availability_slots WHERE id = ?`, [id]);
    return res.json({ slot: formatSlot(rows[0]) });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Another slot already uses that date and start time" });
    }
    console.error("[availability] update failed:", err.message);
    return res.status(500).json({ error: "Failed to update slot" });
  }
});

/**
 * DELETE /api/availability/:id (admin)
 */
router.delete("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "invalid id" });
  }
  try {
    const [existing] = await pool.execute(
      `SELECT booked_count FROM availability_slots WHERE id = ?`,
      [id]
    );
    if (existing.length === 0) return res.status(404).json({ error: "Slot not found" });
    if (existing[0].booked_count > 0) {
      return res.status(409).json({
        error: "This slot has bookings. Deactivate it instead to hide it from customers.",
      });
    }
    await pool.execute(`DELETE FROM availability_slots WHERE id = ?`, [id]);
    return res.json({ message: "Slot deleted" });
  } catch (err) {
    console.error("[availability] delete failed:", err.message);
    return res.status(500).json({ error: "Failed to delete slot" });
  }
});

module.exports = router;
