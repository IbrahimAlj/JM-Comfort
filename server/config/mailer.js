const nodemailer = require("nodemailer");

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "EMAIL_FROM",
];

/**
 * Validate that all required SMTP environment variables are set.
 * Throws in production if any are missing. Logs a warning in development.
 */
function validateEmailConfig() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const message = `Missing required email environment variables: ${missing.join(", ")}`;

    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }

    console.warn(`[mailer] WARNING: ${message}`);
    return false;
  }

  return true;
}

/**
 * Create and return a Nodemailer transporter using SMTP env vars.
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send an email using the configured SMTP transport.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body content
 * @param {string} [options.text] - Plain text fallback
 * @returns {Promise<Object>} Nodemailer send result
 */
async function sendEmail({ to, subject, html, text }) {
  const configValid = validateEmailConfig();

  if (!configValid) {
    console.warn("[mailer] Email not sent due to missing configuration");
    return null;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text: text || "",
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(`[mailer] Email sent to ${to} - messageId: ${result.messageId}`);
  return result;
}

module.exports = {
  sendEmail,
  validateEmailConfig,
  createTransporter,
};
