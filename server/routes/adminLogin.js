const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts please try again later" },
});

router.post("/login", loginLimiter, (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    return res.status(403).json({ error: "admin access not configured" });
  }

  const { key } = req.body || {};
  if (!key) {
    return res.status(400).json({ error: "key is required" });
  }

  if (key !== adminKey) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  return res.status(200).json({ message: "Login successful" });
});

module.exports = router;
