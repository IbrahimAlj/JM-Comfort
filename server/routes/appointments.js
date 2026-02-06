const express = require("express");
const pool = require("../config/db");
const { sendEmail } = require("../config/mailer");
const { buildConfirmationEmail } = require("../templates/confirmationEmail");

const router = express.Router();

/**
 * POST /api/appointments
 * Create a new appointment.
 */
router.post("/", async (req, res) => {
  const { customer_id, project_id, scheduled_at, end_at, status, notes, email, customerName } = req.body;

  // Validate required fields
  const errors = [];

  if (!customer_id) {
    errors.push("customer_id is required");
  } else if (!Number.isInteger(Number(customer_id)) || Number(customer_id) <= 0) {
    errors.push("customer_id must be a positive integer");
  }

  if (!scheduled_at) {
    errors.push("scheduled_at is required");
  } else if (isNaN(Date.parse(scheduled_at))) {
    errors.push("scheduled_at must be a valid datetime");
  }

  if (!end_at) {
    errors.push("end_at is required");
  } else if (isNaN(Date.parse(end_at))) {
    errors.push("end_at must be a valid datetime");
  }

  if (scheduled_at && end_at && !isNaN(Date.parse(scheduled_at)) && !isNaN(Date.parse(end_at))) {
    if (new Date(end_at) <= new Date(scheduled_at)) {
      errors.push("end_at must be after scheduled_at");
    }
  }

  if (project_id !== undefined && project_id !== null) {
    if (!Number.isInteger(Number(project_id)) || Number(project_id) <= 0) {
      errors.push("project_id must be a positive integer");
    }
  }

  const validStatuses = ["scheduled", "completed", "cancelled", "no_show"];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO appointments (customer_id, project_id, scheduled_at, end_at, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        project_id || null,
        scheduled_at,
        end_at,
        status || "scheduled",
        notes || null,
      ]
    );

    // Send confirmation email if email is provided
    // Email failure must not break the booking flow
    if (email) {
      try {
        const appointment = {
          customerName: customerName || "Customer",
          email,
          scheduledAt: scheduled_at,
          projectName: null,
          status: status || "Scheduled",
        };
        const { subject, html, text } = buildConfirmationEmail(appointment);
        await sendEmail({ to: email, subject, html, text });
      } catch (emailErr) {
        console.error("[appointments] Failed to send confirmation email:", emailErr.message);
      }
    }

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment_id: result.insertId,
    });
  } catch (err) {
    console.error("[appointments] Failed to create appointment:", err.message);

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "Invalid reference",
        details: ["Referenced customer_id or project_id does not exist"],
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
