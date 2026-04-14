const express = require("express");

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const analyticsSummaryRoutes = require("../routes/analyticsSummary");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/analytics/summary", analyticsSummaryRoutes);
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

describe("GET /api/analytics/summary", () => {
  let app;

  beforeEach(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
    app = createApp();
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ADMIN_API_KEY;
  });

  describe("Authentication", () => {
    test("returns 403 when no auth header provided", async () => {
      const res = await makeRequest(app, "GET", "/api/analytics/summary");
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("returns 403 when wrong admin key provided", async () => {
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": "wrong-key" },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("forbidden");
    });

    test("returns 403 when ADMIN_API_KEY env not set", async () => {
      delete process.env.ADMIN_API_KEY;
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(403);
      expect(res.body.error).toBe("admin access not configured");
    });
  });

  describe("Correct counts with mocked DB data", () => {
    test("returns correct summary metrics", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        appointmentsThisWeek: 5,
        newLeadsThisWeek: 3,
        completedProjects: 12,
        averageRating: 4.6,
      });
    });

    test("returns correct appointmentsThisWeek count", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.body.appointmentsThisWeek).toBe(5);
    });

    test("returns correct newLeadsThisWeek count", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.body.newLeadsThisWeek).toBe(3);
    });

    test("returns correct completedProjects count", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.body.completedProjects).toBe(12);
    });

    test("returns correct averageRating rounded to 1 decimal", async () => {
      mockSuccessfulQueries();
      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.body.averageRating).toBe(4.6);
    });
  });

  describe("Zero counts when no data", () => {
    test("returns zeros and null rating when no data exists", async () => {
      pool.execute
        .mockResolvedValueOnce([[{ count: 0 }]])
        .mockResolvedValueOnce([[{ count: 0 }]])
        .mockResolvedValueOnce([[{ count: 0 }]])
        .mockResolvedValueOnce([[{ average_rating: null }]]);

      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        appointmentsThisWeek: 0,
        newLeadsThisWeek: 0,
        completedProjects: 0,
        averageRating: null,
      });
    });
  });

  describe("Null rating when no reviews", () => {
    test("returns null averageRating when no reviews exist", async () => {
      pool.execute
        .mockResolvedValueOnce([[{ count: 5 }]])
        .mockResolvedValueOnce([[{ count: 3 }]])
        .mockResolvedValueOnce([[{ count: 12 }]])
        .mockResolvedValueOnce([[{ average_rating: null }]]);

      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      expect(res.status).toBe(200);
      expect(res.body.averageRating).toBeNull();
    });
  });

  describe("Database errors", () => {
    test("returns 500 when database query fails", async () => {
      pool.execute.mockRejectedValueOnce(new Error("Connection lost"));

      const res = await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });

  describe("Week scoping", () => {
    test("passes date parameters for appointments and leads queries", async () => {
      mockSuccessfulQueries();
      await makeRequest(app, "GET", "/api/analytics/summary", {
        headers: { "x-admin-key": ADMIN_KEY },
      });

      // Appointments query (first call) should have date parameters
      const appointmentsCall = pool.execute.mock.calls[0];
      expect(appointmentsCall[0]).toContain("appointments");
      expect(appointmentsCall[1]).toHaveLength(2);
      expect(appointmentsCall[1][0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(appointmentsCall[1][1]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

      // Leads query (second call) should have date parameters
      const leadsCall = pool.execute.mock.calls[1];
      expect(leadsCall[0]).toContain("contact_leads");
      expect(leadsCall[1]).toHaveLength(2);
      expect(leadsCall[1][0]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
      expect(leadsCall[1][1]).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });
});

function mockSuccessfulQueries() {
  pool.execute
    .mockResolvedValueOnce([[{ count: 5 }]])
    .mockResolvedValueOnce([[{ count: 3 }]])
    .mockResolvedValueOnce([[{ count: 12 }]])
    .mockResolvedValueOnce([[{ average_rating: 4.567 }]]);
}
