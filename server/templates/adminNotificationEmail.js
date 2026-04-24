/**
 * Build the HTML and plain text content for an admin notification email
 * when a new lead is submitted.
 *
 * @param {Object} lead
 * @returns {{ subject: string, html: string, text: string }}
 */
function buildAdminNotificationEmail(lead) {
  const {
    name,
    email,
    phone,
    lead_type,
    service_type,
    message,
    address,
    zip,
    preferred_date,
    preferred_time_slot,
  } = lead;

  const esc = (v) =>
    String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const subject = "New Lead Received";

  const row = (label, value) => {
    const v = value && String(value).trim() ? esc(value) : "N/A";
    return `
      <tr>
        <td style="padding:8px 12px;color:#555;white-space:nowrap;">${label}</td>
        <td style="padding:8px 12px;font-weight:bold;">${v}</td>
      </tr>`;
  };

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
                    Contact Details
                  </td>
                </tr>
                ${row("Name", name)}
                ${row("Email", email)}
                ${row("Phone", phone)}
                ${row("Lead Type", lead_type)}
                ${row("Service", service_type)}
                <tr style="background-color:#f9f9f9;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#333;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;">
                    Location
                  </td>
                </tr>
                ${row("Address", address)}
                ${row("ZIP", zip)}
                <tr style="background-color:#f9f9f9;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#333;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;">
                    Scheduling
                  </td>
                </tr>
                ${row("Preferred Date", preferred_date)}
                ${row("Preferred Time Slot", preferred_time_slot)}
                <tr style="background-color:#f9f9f9;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#333;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;">
                    Message
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:12px;color:#333;white-space:pre-wrap;">${message && String(message).trim() ? esc(message) : "N/A"}</td>
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

  const line = (label, value) => `${label}: ${value && String(value).trim() ? value : "N/A"}`;
  const text = `New Lead Received

Contact Details
-------------------
${line("Name", name)}
${line("Email", email)}
${line("Phone", phone)}
${line("Lead Type", lead_type)}
${line("Service", service_type)}

Location
-------------------
${line("Address", address)}
${line("ZIP", zip)}

Scheduling
-------------------
${line("Preferred Date", preferred_date)}
${line("Preferred Time Slot", preferred_time_slot)}

Message
-------------------
${message && String(message).trim() ? message : "N/A"}`;

  return { subject, html, text };
}

module.exports = { buildAdminNotificationEmail };
