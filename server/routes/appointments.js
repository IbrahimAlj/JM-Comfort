const express = require("express");
const { sendEmail } = require("../config/mailer");
const { buildConfirmationEmail } = require("../templates/confirmationEmail");

const router = express.Router();

/**
 * POST /api/appointments
 * Create a new appointment and send a confirmation email.
 *
 * Expected body:
 *   customerName  - Full name of the customer
 *   email         - Customer email address
 *   scheduledAt   - Appointment date and time (ISO string or parseable date)
 *   projectName   - (optional) Name of the associated project
 */
router.post("/", async (req, res) => {
  const { customerName, email, scheduledAt, projectName } = req.body;

  if (!customerName || !email || !scheduledAt) {
    return res.status(400).json({
      error: "Missing required fields: customerName, email, scheduledAt",
    });
  }

  // Appointment creation placeholder
  // In a full implementation this would insert into the MySQL appointments table
  const appointment = {
    customerName,
    email,
    scheduledAt,
    projectName: projectName || null,
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  };

  // Send confirmation email after successful appointment creation
  // Email failure must not break the booking flow
  try {
    const { subject, html, text } = buildConfirmationEmail(appointment);

    await sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error("[appointments] Failed to send confirmation email:", err.message);
  }

  return res.status(201).json({
    message: "Appointment created successfully",
    appointment,
  });
});

module.exports = router;
