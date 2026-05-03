const express = require("express");
const { getSummary } = require("../controllers/analyticsSummaryController");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/", requireAdmin, getSummary);

module.exports = router;
