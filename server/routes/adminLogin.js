const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const SALT_ROUNDS = 10;
let adminHash = null;

(async () => {
  if (process.env.ADMIN_API_KEY) {
    adminHash = await bcrypt.hash(process.env.ADMIN_API_KEY, SALT_ROUNDS);
  }
})();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts please try again later" },
});

router.post("/register", async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ error: "password is required" });
    }
    adminHash = await bcrypt.hash(password, SALT_ROUNDS);
    return res.status(201).json({ message: "Admin account created" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  if (!adminHash) {
    return res.status(403).json({ error: "admin access not configured" });
  }
  const { key } = req.body || {};
  if (!key) {
    return res.status(400).json({ error: "key is required" });
  }
  try {
    const match = await bcrypt.compare(key, adminHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router._getHash = () => adminHash;
router._setHash = (h) => { adminHash = h; };

module.exports = router;