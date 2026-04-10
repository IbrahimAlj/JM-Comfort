/**
 * Admin guard middleware.
 * Requires ADMIN_API_KEY env var to be set.
 * Accepts x-admin-key header or Authorization: Bearer <key>.
 */
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

module.exports = requireAdmin;
