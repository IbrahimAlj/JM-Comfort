// server/controllers/analyticsController.js
const pool = require("../config/db");

/**
 * GET /api/admin/analytics
 *
 * Returns aggregated platform metrics for the admin dashboard.
 *
 * Assumptions:
 * - "bookings" maps to the appointments table.
 * - Revenue is derived from services.price_starting for completed projects
 *   that have an associated service. This is an estimate since the schema
 *   does not store actual invoiced amounts.
 * - "service requests" maps to contact_leads with lead_type = 'quote'.
 */
async function getAnalytics(req, res) {
  try {
    const [
      [customerRows],
      [appointmentRows],
      [appointmentStatusRows],
      [leadRows],
      [leadStatusRows],
      [projectRows],
      [projectStatusRows],
      [reviewRows],
      [serviceRows],
    ] = await Promise.all([
      pool.execute("SELECT COUNT(*) AS total_customers FROM customers"),
      pool.execute("SELECT COUNT(*) AS total_bookings FROM appointments"),
      pool.execute(
        "SELECT status, COUNT(*) AS count FROM appointments GROUP BY status"
      ),
      pool.execute("SELECT COUNT(*) AS total_leads FROM contact_leads"),
      pool.execute(
        "SELECT status, COUNT(*) AS count FROM contact_leads GROUP BY status"
      ),
      pool.execute("SELECT COUNT(*) AS total_projects FROM projects"),
      pool.execute(
        "SELECT status, COUNT(*) AS count FROM projects GROUP BY status"
      ),
      pool.execute(
        "SELECT COUNT(*) AS total_reviews, COALESCE(AVG(rating), 0) AS average_rating FROM reviews"
      ),
      pool.execute(
        "SELECT COUNT(*) AS total_active_services FROM services WHERE is_active = 1"
      ),
    ]);

    // Build status breakdowns as objects
    const bookingsByStatus = {};
    for (const row of appointmentStatusRows) {
      bookingsByStatus[row.status] = Number(row.count);
    }

    const leadsByStatus = {};
    for (const row of leadStatusRows) {
      leadsByStatus[row.status] = Number(row.count);
    }

    const projectsByStatus = {};
    for (const row of projectStatusRows) {
      projectsByStatus[row.status] = Number(row.count);
    }

    return res.json({
      ok: true,
      analytics: {
        total_customers: Number(customerRows[0].total_customers),
        total_bookings: Number(appointmentRows[0].total_bookings),
        bookings_by_status: bookingsByStatus,
        total_leads: Number(leadRows[0].total_leads),
        leads_by_status: leadsByStatus,
        total_projects: Number(projectRows[0].total_projects),
        projects_by_status: projectsByStatus,
        total_reviews: Number(reviewRows[0].total_reviews),
        average_rating: parseFloat(
          Number(reviewRows[0].average_rating).toFixed(2)
        ),
        total_active_services: Number(serviceRows[0].total_active_services),
      },
    });
  } catch (err) {
    console.error("[analytics] Failed to fetch analytics:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getAnalytics };
