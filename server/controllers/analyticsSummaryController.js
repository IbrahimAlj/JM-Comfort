const pool = require("../config/db");

/**
 * GET /api/analytics/summary
 * Returns focused dashboard summary metrics.
 */
async function getSummary(req, res) {
  try {
    // Get current week boundaries (Monday 00:00:00 to Sunday 23:59:59)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const mondayStr = monday.toISOString().slice(0, 19).replace('T', ' ');
    const sundayStr = sunday.toISOString().slice(0, 19).replace('T', ' ');

    const [
      [appointmentRows],
      [leadRows],
      [projectRows],
      [reviewRows],
    ] = await Promise.all([
      pool.execute(
        "SELECT COUNT(*) AS count FROM appointments WHERE scheduled_at >= ? AND scheduled_at <= ?",
        [mondayStr, sundayStr]
      ),
      pool.execute(
        "SELECT COUNT(*) AS count FROM contact_leads WHERE created_at >= ? AND created_at <= ?",
        [mondayStr, sundayStr]
      ),
      pool.execute(
        "SELECT COUNT(*) AS count FROM projects WHERE status = 'completed'"
      ),
      pool.execute(
        "SELECT AVG(rating) AS average_rating FROM reviews"
      ),
    ]);

    const avgRating = reviewRows[0].average_rating;

    return res.json({
      appointmentsThisWeek: Number(appointmentRows[0].count),
      newLeadsThisWeek: Number(leadRows[0].count),
      completedProjects: Number(projectRows[0].count),
      averageRating: avgRating !== null ? parseFloat(Number(avgRating).toFixed(1)) : null,
    });
  } catch (err) {
    console.error("[analytics-summary] Failed:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getSummary };
