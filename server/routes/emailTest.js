const express = require("express");
const { sendEmail } = require("../config/mailer");

const router = express.Router();

/**
 * POST /api/email/test
 * Dev-only route to verify SMTP configuration works.
 * Sends a test email to the address provided in the request body.
 */
router.post("/test", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "This route is not available in production" });
  }

  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Missing required field: to" });
  }

  try {
    const result = await sendEmail({
      to,
      subject: "JM Comfort - Test Email",
      html: "<h1>Test Email</h1><p>SMTP configuration is working correctly.</p>",
      text: "Test Email - SMTP configuration is working correctly.",
    });

    if (!result) {
      return res.status(500).json({ error: "Email not sent due to missing SMTP configuration" });
    }

    return res.json({
      message: "Test email sent successfully",
      messageId: result.messageId,
    });
  } catch (err) {
    console.error("[emailTest] Failed to send test email:", err.message);
    return res.status(500).json({ error: "Failed to send test email", details: err.message });
  }
});

module.exports = router;
