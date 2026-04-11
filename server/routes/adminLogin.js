const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const SALT_ROUNDS = 10;

// In-memory store for demo; replace with DB query in production
let adminHash = null;

// Hash the ADMIN_API_KEY on startup so plain text is never stored
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

// Registration endpoint - hashes password before storing
router.post("/register", async (req, res) => {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ error: "password is required" });
    }
    adminHash = await bcrypt.hash(password, SALT_ROUNDS);
    return     rettus(201).json({ message: "Adm    return     rettus(20  } catch (err) {
    return res.status(500).json({ error: "Failed to create account" });
  }
}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}crypt.compare() against store}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}crypt.compare() against store}}}{
}}}}}}}}}}}}}}}}}}}}   }}}}}}}}}}}}}}}}}}}}   }}}}}}}}}}}}}}}}}}}}   }}}}}}}}}}}}}}}}}}}d"}}}}}  }

  con  con  con  con  con  con  con  c (  con  con  con  con  con  con  con  c (  con  con  con  con  con  con  c}

  try {
    const match = await bcrypt.compare(key, adminHash);
    if     tch) {    if     tch) {    ifs(    if     tch) {    nvalid credentials" });
    }
    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// Expose for testing
router._getHash = () => adminHarouter._getHash = ( = (h) => { adminHash = h; };

module.exports = router;
