const express = require("express");

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const analyticsRoutes = require("../routes/analytics");
const leadsRoutes = require("../routes/leads");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/admin/analytics", analyticsRoutes);
  app.use("/api/leads", leadsRoutes);
  return app;
}

function makeRequest(app, method, path, { headers } = {}) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
      };

      fetch(url, options)
        .then(async (res) => {
          const data = await res.json();
          server.close();
          resolve({ status: res.status, body: data });
        })
        .catch((err) => {
          server.close();
          resolve({ status: 500, body: { error: err.message } });
        });
    });
  });
}

const ADMIN_KEY = "test-admin-key-123";

/** Mock all 9 analytics DB queries so the endpoint returns 200. */
function mockAnalyticsQueries() {
  pool.execute
    .mockResolvedValueOnce([[{ total_customers: 1 }]])
    .mockResolvedValueOnce([[{ total_bookings: 1 }]])
    .mockResolvedValueOnce([[{ status: "scheduled", count: 1 }]])
    .mockResolvedValueOnce([[{ total_leads: 1 }]])
    .mockResolvedValueOnce([[{ status: "new", count: 1 }]])
    .mockResolvedValueOnce([[{ total_projects: 1 }]])
    .mockResolvedValueOnce([[{ status: "planned", count: 1 }]])
    .mockResolvedValueOnce([[{ total_reviews: 1, average_rating: 5 }]])
    .mockResolvedValueOnce([[{ total_active_services: 1 }]]);
}

/** Mock leads list DB query so the endpoint returns 200. */
function mockLeadsListQuery() {
  pool.execute.mockResolvedValueOnce([[]]);
}

/** Mock leads get-by-id DB query so the endpoint returns 200. */
function mockLeadsGetByIdQuery() {
  pool.execute.mockResolvedValueOnce([
    [{ id: 1, first_name: "Test", last_name: "User", email: "t@t.com" }],
  ]);
}

describe("Admin Auth – comprehensive tests", () => {
  let app;

  beforeEach(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
    app = createApp();
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ADMIN_API_KEY;
  });

  // ─── Valid credentials ───────────────────────────────────────────

  describe("Admin login with valid credentials", () => {
    test("x-admin-key header grants access to /api/admin/analytics (200)", async () => {
      mockAnalyticsQueries();
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(200);
    });

    test("Authorization: Bearer token grants access to /api/admin/analytics (200)", async () => {
      mockAnalyticsQueries();
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
      });
      expect(res.status).toBe(200);
    });

    test("x-admin-key header grants access to /api/leads/admin/leads (200)", async () => {
      mockLeadsListQuery();
      const res = await makeRequest(app, "GET", "/api/leads/admin/leads", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(200);
    });

    test("Authorization: Bearer token grants access to /api/leads/admin/leads (200)", async () => {
      mockLeadsListQuery();
      const res = await makeRequest(app, "GET", "/api/leads/admin/leads", {
        headers: { Authorization: `Bearer ${ADMIN_KEY}` },
      });
      expect(res.status).toBe(200);
    });
  });

  // ─── Invalid credentials ─────────────────────────────────────────

  describe("Admin login with invalid credentials", () => {
    test("wrong x-admin-key returns 403 with 'forbidden'", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": "wrong-key" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("wrong Bearer token returns 403 with 'forbidden'", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { Authorization: "Bearer wrong-key" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("empty x-admin-key returns 403", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": "" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("empty Authorization header returns 403", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { Authorization: "" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("no auth headers at all returns 403 with 'forbidden'", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });
  });

  // ─── ADMIN_API_KEY not configured ────────────────────────────────

  describe("ADMIN_API_KEY not configured", () => {
    test("returns 403 with 'admin access not configured' when env var not set", async () => {
      delete process.env.ADMIN_API_KEY;
      const res = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("admin access not configured");
    });
  });

  // ─── Unauthorized access to admin routes ─────────────────────────

  describe("Unauthorized access to admin routes", () => {
    test("GET /api/admin/analytics without auth returns 403", async () => {
      const res = await makeRequest(app, "GET", "/api/admin/analytics");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("GET /api/leads/admin/leads without auth returns 403", async () => {
      const res = await makeRequest(app, "GET", "/api/leads/admin/leads");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("GET /api/leads/admin/leads/:id without auth returns 403", async () => {
      const res = await makeRequest(app, "GET", "/api/leads/admin/leads/1");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });
  });

  // ─── Session behavior (stateless API key model) ──────────────────

  describe("Session behavior (API key model)", () => {
    test("each request is independently authenticated (no session state)", async () => {
      // First request succeeds with valid key
      mockAnalyticsQueries();
      const res1 = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res1.status).toBe(200);

      // Second request without key fails — no session carry-over
      const res2 = await makeRequest(app, "GET", "/api/admin/analytics");
      expect(res2.status).toBe(403);
      expect(res2.body.error).toBe("forbidden");
    });

    test("valid key in one request does not carry over (stateless)", async () => {
      // Authenticated request to analytics
      mockAnalyticsQueries();
      const res1 = await makeRequest(app, "GET", "/api/admin/analytics", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res1.status).toBe(200);

      // Unauthenticated request to leads — must still fail
      const res2 = await makeRequest(app, "GET", "/api/leads/admin/leads");
      expect(res2.status).toBe(403);
      expect(res2.body.error).toBe("forbidden");
    });
  });
});
