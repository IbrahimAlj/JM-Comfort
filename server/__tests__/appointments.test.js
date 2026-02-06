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

// Future dates for testing (far enough in the future to never be "in the past")
const FUTURE_START = "2030-06-15T10:00:00";
const FUTURE_END = "2030-06-15T11:00:00";
const PAST_START = "2020-01-01T10:00:00";
const PAST_END = "2020-01-01T11:00:00";

describe("POST /api/appointments", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe("Validation", () => {
    test("returns 400 when customer_id is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toContain("customer_id is required");
    });

    test("returns 400 when scheduled_at is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("scheduled_at is required");
    });

    test("returns 400 when end_at is missing", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("end_at is required");
    });

    test("returns 400 when scheduled_at is invalid datetime", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "not-a-date",
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("scheduled_at must be a valid datetime");
    });

    test("returns 400 when end_at is before scheduled_at", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2030-06-15T11:00:00",
        end_at: "2030-06-15T10:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("end_at must be after scheduled_at");
    });

    test("returns 400 when customer_id is not a positive integer", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: -5,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("customer_id must be a positive integer");
    });

    test("returns 400 when status is invalid", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
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

  describe("Availability validation", () => {
    test("rejects appointments in the past", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: PAST_START,
        end_at: PAST_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain("scheduled_at must not be in the past");
    });

    test("rejects appointments shorter than 15 minutes", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2030-06-15T10:00:00",
        end_at: "2030-06-15T10:10:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain(
        "Appointment must be at least 15 minutes long"
      );
    });

    test("rejects appointments longer than 8 hours", async () => {
      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2030-06-15T08:00:00",
        end_at: "2030-06-15T17:00:00",
      });
      expect(res.status).toBe(400);
      expect(res.body.details).toContain(
        "Appointment must not exceed 8 hours"
      );
    });

    test("accepts appointments exactly 15 minutes long", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2030-06-15T10:00:00",
        end_at: "2030-06-15T10:15:00",
      });
      expect(res.status).toBe(201);
    });

    test("accepts appointments exactly 8 hours long", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: "2030-06-15T08:00:00",
        end_at: "2030-06-15T16:00:00",
      });
      expect(res.status).toBe(201);
    });
  });

  describe("Overlap detection", () => {
    test("returns 409 when appointment overlaps with existing", async () => {
      pool.execute.mockResolvedValueOnce([
        [{ id: 10, scheduled_at: "2030-06-15T09:00:00", end_at: "2030-06-15T10:30:00" }],
      ]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(409);
      expect(res.body.error).toBe("Scheduling conflict");
      expect(res.body.details).toContain(
        "This appointment overlaps with an existing appointment for this customer"
      );
      expect(res.body.conflicting_appointment_id).toBe(10);
    });

    test("allows appointment when no overlaps exist", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 55 }]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(201);
      expect(res.body.appointment_id).toBe(55);
    });

    test("overlap query uses correct parameters", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 7,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });

      // First call is the overlap check
      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id"),
        [7, FUTURE_END, FUTURE_START]
      );
    });
  });

  describe("Success", () => {
    test("returns 201 with appointment_id on success", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 42 }]);

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Appointment created successfully");
      expect(res.body.appointment_id).toBe(42);
    });

    test("passes correct parameters to database insert", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 5,
        project_id: 3,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
        status: "scheduled",
        notes: "Test note",
      });

      // Second call is the insert
      expect(pool.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO appointments"),
        [5, 3, FUTURE_START, FUTURE_END, "scheduled", "Test note"]
      );
    });

    test("defaults status to scheduled and notes to null", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });

      // Second call is the insert
      const insertCall = pool.execute.mock.calls[1];
      expect(insertCall[1]).toEqual([1, null, FUTURE_START, FUTURE_END, "scheduled", null]);
    });
  });

  describe("Database errors", () => {
    test("returns 400 for foreign key constraint violation", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockRejectedValueOnce({ code: "ER_NO_REFERENCED_ROW_2", message: "FK error" });

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 999,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid reference");
    });

    test("returns 500 for unexpected database errors", async () => {
      pool.execute
        .mockResolvedValueOnce([[]])
        .mockRejectedValueOnce(new Error("Connection lost"));

      const res = await makeRequest(app, "POST", "/api/appointments", {
        customer_id: 1,
        scheduled_at: FUTURE_START,
        end_at: FUTURE_END,
      });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error");
    });
  });
});
