const express = require("express");

// Mock the db pool before requiring the route
jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

const pool = require("../config/db");
const appointmentRoutes = require("../routes/appointments");

// Minimal Express app for testing
function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/appointments", appointmentRoutes);
  return app;
}

// Simple test helper to make requests without supertest
function makeRequest(app, method, path, body) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const url = `http://localhost:${port}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) options.body = JSON.stringify(body);

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

describe("POST /api/appointments", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe("Validation", () => {
    test("returns 400 when customer_id is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toContain("customer_id is required");
    });

    test("returns 400 when scheduled_at is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("scheduled_at is required");
    });

    test("returns 400 when end_at is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T10:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("end_at is required");
    });

    test("returns 400 when scheduled_at is invalid datetime", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "not-a-date",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("scheduled_at must be a valid datetime");
    });

    test("returns 400 when end_at is before scheduled_at", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T11:00:00",
        end_at: "2026-03-01T10:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("end_at must be after scheduled_at");
    });

    test("returns 400 when customer_id is not a positive integer", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: -5,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("customer_id must be a positive integer");
    });

    test("returns 400 when status is invalid", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
        status: "invalid_status",
      });
      expect(res.status).toBe(400);
      expect(res.body.details[0]).toContain("status must be one of");
    });

    test("returns 400 with multiple errors", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {});
      expect(res.status).toBe(400);
      expect(res.body.details.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Success", () => {
    test("returns 201 with appointment_id on success", async () => {
      pool.execute.mockResolvedValue([{ insertId: 42 }]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Appointment created successfully");
      expect(res.body.appointment_id).toBe(42);
    });

    test("passes correct parameters to database", async () => {
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 5,
        project_id: 3,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
        status: "scheduled",
        notes: "Test note",
      });

      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO appointments"),
        [5, 3, "2026-03-01T10:00:00", "2026-03-01T11:00:00", "scheduled", "Test note"]
      );
    });

    test("defaults status to scheduled and notes to null", async () => {
      pool.execute.mockResolvedValue([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });

      expect(pool.execute).toHaveBeenCalledWith(
        expect.any(String),
        [1, null, "2026-03-01T10:00:00", "2026-03-01T11:00:00", "scheduled", null]
      );
    });
  });

  describe("Database errors", () => {
    test("returns 400 for foreign key constraint violation", async () => {
      pool.execute.mockRejectedValue({ code: "ER_NO_REFERENCED_ROW_2", message: "FK error" });

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 999,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid reference");
    });

    test("returns 500 for unexpected database errors", async () => {
      pool.execute.mockRejectedValue(new Error("Connection lost"));

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2026-03-01T10:00:00",
        end_at: "2026-03-01T11:00:00",
      });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});
