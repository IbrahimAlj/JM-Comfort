const express = require("express");
const { getSummary } = require("../controllers/analyticsSummaryController");

const router = express.Router();

function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(403).json({ error: "admin access not configured" });
  }
  const headerKey =
    (req.headers["x-admin-key"] || "").toString() ||
    ((req.headers.authorization || "").toString().startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : "");
  if (headerKey === adminKey) return next();
  return res.status(403).json({ error: "forbidden" });
}

router.get("/", requireAdmin, getSummary);

module.exports = router;
