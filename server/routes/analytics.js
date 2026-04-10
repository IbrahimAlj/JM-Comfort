// server/routes/analytics.js
const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

/**
 * GET /api/admin/analytics
 * Returns aggregated platform metrics for the admin dashboard.
 */
router.get("/", requireAdmin, getAnalytics);

module.exports = router;
