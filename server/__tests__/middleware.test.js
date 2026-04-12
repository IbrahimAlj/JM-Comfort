const requireAdmin = require("../middleware/requireAdmin");

describe("requireAdmin middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("returns 403 if ADMIN_API_KEY is not set", () => {
    delete process.env.ADMIN_API_KEY;
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "admin access not configured" });
  });

  test("calls next() if x-admin-key header matches", () => {
    process.env.ADMIN_API_KEY = "test-key";
    req.headers["x-admin-key"] = "test-key";
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("calls next() if Authorization Bearer token matches", () => {
    process.env.ADMIN_API_KEY = "test-key";
    req.headers.authorization = "Bearer test-key";
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("returns 403 if key does not match", () => {
    process.env.ADMIN_API_KEY = "test-key";
    req.headers["x-admin-key"] = "wrong-key";
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "forbidden" });
  });

  test("returns 403 if no key is provided", () => {
    process.env.ADMIN_API_KEY = "test-key";
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  afterEach(() => {
    delete process.env.ADMIN_API_KEY;
  });
});