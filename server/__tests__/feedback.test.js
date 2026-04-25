const express = require("express");

jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const feedbackRoutes = require("../routes/feedback");

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/feedback", feedbackRoutes);
  return app;
}

function makeRequest(app, method, path, body) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const opts = { method, headers: {} };
      if (body) {
        opts.body = JSON.stringify(body);
        opts.headers["Content-Type"] = "application/json";
      }
      fetch(url, opts)
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
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

describe("Feedback API", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe("GET /api/feedback", () => {
    test("returns feedback list newest first", async () => {
      pool.execute.mockResolvedValueOnce([
        [
          { id: 3, feedback_text: "Great site", created_at: "2026-04-20T10:00:00Z" },
          { id: 2, feedback_text: "Works well", created_at: "2026-04-15T10:00:00Z" },
          { id: 1, feedback_text: "Easy", created_at: "2026-04-10T10:00:00Z" },
        ],
      ]);

      const res = await makeRequest(app, "GET", "/api/feedback");
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.feedback).toHaveLength(3);
      expect(res.body.feedback[0].id).toBe(3);

      const sql = pool.execute.mock.calls[0][0];
      expect(sql).toMatch(/ORDER BY created_at DESC/);
    });

    test("returns 500 when DB throws", async () => {
      pool.execute.mockRejectedValueOnce(new Error("db down"));
      const res = await makeRequest(app, "GET", "/api/feedback");
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Internal/i);
    });

    test("returns empty array when no feedback exists", async () => {
      pool.execute.mockResolvedValueOnce([[]]);
      const res = await makeRequest(app, "GET", "/api/feedback");
      expect(res.status).toBe(200);
      expect(res.body.feedback).toEqual([]);
    });
  });

  describe("POST /api/feedback", () => {
    test("creates feedback with valid text", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 42 }]);
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: "Loved the redesign",
      });
      expect(res.status).toBe(201);
      expect(res.body.feedback_id).toBe(42);

      const params = pool.execute.mock.calls[0][1];
      expect(params).toEqual(["Loved the redesign"]);
    });

    test("trims whitespace before saving", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 5 }]);
      await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: "   spaced out   ",
      });
      const params = pool.execute.mock.calls[0][1];
      expect(params[0]).toBe("spaced out");
    });

    test("rejects empty feedback", async () => {
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: "",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.stringMatching(/required/i)])
      );
      expect(pool.execute).not.toHaveBeenCalled();
    });

    test("rejects whitespace-only feedback", async () => {
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: "     ",
      });
      expect(res.status).toBe(400);
      expect(pool.execute).not.toHaveBeenCalled();
    });

    test("rejects missing feedback_text field", async () => {
      const res = await makeRequest(app, "POST", "/api/feedback", {});
      expect(res.status).toBe(400);
    });

    test("rejects feedback over 5000 chars", async () => {
      const tooLong = "x".repeat(5001);
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: tooLong,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toEqual(
        expect.arrayContaining([expect.stringMatching(/5000/)])
      );
    });

    test("accepts feedback exactly 5000 chars", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      const text = "x".repeat(5000);
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: text,
      });
      expect(res.status).toBe(201);
    });

    test("returns 500 when DB throws", async () => {
      pool.execute.mockRejectedValueOnce(new Error("connection lost"));
      const res = await makeRequest(app, "POST", "/api/feedback", {
        feedback_text: "valid text",
      });
      expect(res.status).toBe(500);
    });
  });
});
