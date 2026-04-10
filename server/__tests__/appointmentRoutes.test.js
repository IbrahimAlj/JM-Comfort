const express = require("express");

// Mock the database module before requiring the route
jest.mock("../config/database", () => ({
  query: jest.fn(),
  getConnection: jest.fn(),
}));

const db = require("../config/database");
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

describe("GET /api/appointments", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test("returns array of appointments", async () => {
    const mockAppointments = [
      { id: 1, customer_name: "John Doe", status: "pending" },
      { id: 2, customer_name: "Jane Smith", status: "approved" },
    ];
    db.query.mockResolvedValueOnce([mockAppointments]);

    const res = await makeRequest(app, "GET", "/api/appointments");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAppointments);
    expect(res.body).toHaveLength(2);
  });

  test("returns empty array when no appointments exist", async () => {
    db.query.mockResolvedValueOnce([[]]);

    const res = await makeRequest(app, "GET", "/api/appointments");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(res.body).toHaveLength(0);
  });

  test("returns 500 on database error", async () => {
    db.query.mockRejectedValueOnce(new Error("Connection lost"));

    const res = await makeRequest(app, "GET", "/api/appointments");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to fetch appointments");
  });
});

describe("GET /api/appointments/status/:status", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test("returns filtered appointments for valid status", async () => {
    const mockAppointments = [
      { id: 1, customer_name: "John Doe", status: "pending" },
    ];
    db.query.mockResolvedValueOnce([mockAppointments]);

    const res = await makeRequest(app, "GET", "/api/appointments/status/pending");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAppointments);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining("WHERE a.status = ?"),
      ["pending"]
    );
  });

  test("returns 400 for invalid status", async () => {
    const res = await makeRequest(app, "GET", "/api/appointments/status/invalid_status");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid status");
  });

  test("returns 500 on database error", async () => {
    db.query.mockRejectedValueOnce(new Error("Connection lost"));

    const res = await makeRequest(app, "GET", "/api/appointments/status/pending");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to fetch appointments");
  });
});

describe("DELETE /api/appointments/:id", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test("valid delete returns 200", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

    const res = await makeRequest(app, "DELETE", "/api/appointments/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Appointment deleted successfully");
    expect(db.query).toHaveBeenCalledWith(
      "DELETE FROM appointments WHERE id = ?",
      ["1"]
    );
  });

  test("non-existent ID returns 404", async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

    const res = await makeRequest(app, "DELETE", "/api/appointments/999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Appointment not found");
  });

  test("database error returns 500", async () => {
    db.query.mockRejectedValueOnce(new Error("Connection lost"));

    const res = await makeRequest(app, "DELETE", "/api/appointments/1");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to delete appointment");
  });
});
