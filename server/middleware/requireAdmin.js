const jwt = require("jsonwebtoken");

/**
 * Admin guard middleware.
 * Accepts:
 *   1. Authorization: Bearer <jwt>  (verified against JWT_SECRET, role=admin)
 *   2. x-admin-key header           (matches ADMIN_API_KEY) — server-to-server / tests
 *   3. Authorization: Bearer <ADMIN_API_KEY>  — legacy fallback for tests
 */
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  const jwtSecret = process.env.JWT_SECRET || adminKey;

  if (!adminKey && !jwtSecret) {
    return res.status(403).json({ error: "admin access not configured" });
  }

  const authHeader = (req.headers.authorization || "").toString();
  const bearer = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";
  const headerKey = (req.headers["x-admin-key"] || "").toString();

  if (adminKey && headerKey && headerKey === adminKey) return next();
  if (adminKey && bearer && bearer === adminKey) return next();

  if (bearer && jwtSecret) {
    try {
      const payload = jwt.verify(bearer, jwtSecret);
      if (payload && payload.role === "admin") {
        req.admin = payload;
        return next();
      }
    } catch (_err) {
      // fall through to 401
    }
  }

  return res.status(403).json({ error: "forbidden" });
}

module.exports = requireAdmin;
