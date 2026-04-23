/**
 * Build the HTML and plain text content for an appointment rejection email.
 *
 * @param {Object} appointment
 * @param {string} appointment.customerName - Full name of the customer
 * @param {string} appointment.scheduledAt - Appointment date and time string
 * @param {string} appointment.rejectionReason - Reason for rejection
 * @returns {{ subject: string, html: string, text: string }}
 */
function buildRejectionEmail(appointment) {
  const { customerName, scheduledAt, rejectionReason } = appointment;

  const dateFormatted = new Date(scheduledAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const subject = "JM Comfort - Appointment Update";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#1a73e8;padding:24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;">JM Comfort</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <h2 style="margin:0 0 16px;color:#333;">Appointment Update</h2>
              <p style="color:#555;line-height:1.6;">
                Hello ${customerName}, we regret to inform you that your appointment has been declined.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e0e0e0;border-radius:4px;">
                <tr style="background-color:#f9f9f9;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#333;border-bottom:1px solid #e0e0e0;">
                    Appointment Details
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Customer</td>
                  <td style="padding:8px 12px;font-weight:bold;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Scheduled Date</td>
                  <td style="padding:8px 12px;font-weight:bold;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Reason</td>
                  <td style="padding:8px 12px;font-weight:bold;">${rejectionReason}</td>
                </tr>
              </table>
              <p style="color:#555;line-height:1.6;">
                If you have any questions or would like to reschedule, please contact us directly.
              </p>
              <p style="color:#555;line-height:1.6;">
                Thank you for your understanding.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:16px 24px;text-align:center;color:#999;font-size:12px;">
              JM Comfort - Heating, Ventilation, and Air Conditioning
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const text = `JM Comfort - Appointment Update

Hello ${customerName}, we regret to inform you that your appointment has been declined.

Appointment Details
-------------------
Customer: ${customerName}
Scheduled Date: ${dateFormatted}
Reason: ${rejectionReason}

If you have any questions or would like to reschedule, please contact us directly.

Thank you for your understanding.`;

  return { subject, html, text };
}

module.exports = { buildRejectionEmail };
