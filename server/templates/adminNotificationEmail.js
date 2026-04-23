/**
 * Build the HTML and plain text content for an admin notification email
 * when a new lead is submitted.
 *
 * @param {Object} lead
 * @param {string} lead.name - Lead name
 * @param {string} lead.email - Lead email address
 * @param {string} lead.phone - Lead phone number
 * @param {string} lead.lead_type - Type of lead (contact, quote)
 * @param {string} lead.message - Lead message
 * @returns {{ subject: string, html: string, text: string }}
 */
function buildAdminNotificationEmail(lead) {
  const { name, email, phone, lead_type, message } = lead;

  const subject = "New Lead Received";

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
              <h2 style="margin:0 0 16px;color:#333;">New Lead Received</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border:1px solid #e0e0e0;border-radius:4px;">
                <tr style="background-color:#f9f9f9;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#333;border-bottom:1px solid #e0e0e0;">
                    Lead Details
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Name</td>
                  <td style="padding:8px 12px;font-weight:bold;">${name || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Email</td>
                  <td style="padding:8px 12px;font-weight:bold;">${email || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Phone</td>
                  <td style="padding:8px 12px;font-weight:bold;">${phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Lead Type</td>
                  <td style="padding:8px 12px;font-weight:bold;">${lead_type || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:8px 12px;color:#555;">Message</td>
                  <td style="padding:8px 12px;font-weight:bold;">${message || "N/A"}</td>
                </tr>
              </table>
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

  const text = `New Lead Received

Lead Details
-------------------
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Phone: ${phone || "N/A"}
Lead Type: ${lead_type || "N/A"}
Message: ${message || "N/A"}`;

  return { subject, html, text };
}

module.exports = { buildAdminNotificationEmail };
