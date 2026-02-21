const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert");

describe("Appointment approve/reject controllers", () => {
  let controller;
  let mockDb;
  let mockConnection;

  beforeEach(() => {
    delete require.cache[require.resolve("../controllers/appointmentController")];
    delete require.cache[require.resolve("../config/database")];

    mockConnection = {
      beginTransaction: mock.fn(async () => {}),
      commit: mock.fn(async () => {}),
      rollback: mock.fn(async () => {}),
      release: mock.fn(() => {}),
      query: mock.fn(async () => [[]]),
    };

    mockDb = require("../config/database");
    mockDb.getConnection = mock.fn(async () => mockConnection);
    mockDb.query = mock.fn(async () => [[]]);

    controller = require("../controllers/appointmentController");
  });

  describe("approveAppointment", () => {
    it("should approve a pending appointment", async () => {
      mockConnection.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT * FROM appointments")) {
          return [[{ id: 1, status: "pending" }]];
        }
        if (sql.includes("UPDATE appointments")) {
          return [{ affectedRows: 1 }];
        }
        if (sql.includes("SELECT") && sql.includes("JOIN")) {
          return [[{ id: 1, status: "approved", customer_name: "John Doe" }]];
        }
        return [[]];
      });

      let responseStatus = null;
      let responseBody = null;
      const req = { params: { id: "1" }, body: { approved_by: "admin" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.approveAppointment(req, res);

      assert.ok(responseBody.message.includes("approved"), "should return success message");
      assert.strictEqual(responseBody.appointment.status, "approved");
      assert.strictEqual(mockConnection.commit.mock.callCount(), 1, "should commit transaction");
    });

    it("should reject approval for non-pending appointment", async () => {
      mockConnection.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT * FROM appointments")) {
          return [[{ id: 1, status: "approved" }]];
        }
        return [[]];
      });

      let responseStatus = null;
      let responseBody = null;
      const req = { params: { id: "1" }, body: { approved_by: "admin" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.approveAppointment(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("Cannot approve"));
    });

    it("should return 404 for nonexistent appointment", async () => {
      mockConnection.query = mock.fn(async () => [[]]);

      let responseStatus = null;
      let responseBody = null;
      const req = { params: { id: "999" }, body: { approved_by: "admin" } };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.approveAppointment(req, res);

      assert.strictEqual(responseStatus, 404);
      assert.ok(responseBody.error.includes("not found"));
    });
  });

  describe("rejectAppointment", () => {
    it("should reject a pending appointment with a reason", async () => {
      mockConnection.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT * FROM appointments")) {
          return [[{ id: 1, status: "pending" }]];
        }
        if (sql.includes("UPDATE appointments")) {
          return [{ affectedRows: 1 }];
        }
        if (sql.includes("SELECT") && sql.includes("JOIN")) {
          return [[{ id: 1, status: "rejected", customer_name: "John Doe" }]];
        }
        return [[]];
      });

      let responseBody = null;
      const req = {
        params: { id: "1" },
        body: { approved_by: "admin", rejection_reason: "Schedule conflict" },
      };
      const res = {
        status(code) { return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.rejectAppointment(req, res);

      assert.ok(responseBody.message.includes("rejected"));
      assert.strictEqual(responseBody.appointment.status, "rejected");
      assert.strictEqual(mockConnection.commit.mock.callCount(), 1);
    });

    it("should require rejection_reason", async () => {
      let responseStatus = null;
      let responseBody = null;
      const req = {
        params: { id: "1" },
        body: { approved_by: "admin" },
      };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.rejectAppointment(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("Rejection reason is required"));
    });

    it("should reject rejection for non-pending appointment", async () => {
      mockConnection.query = mock.fn(async (sql) => {
        if (sql.includes("SELECT * FROM appointments")) {
          return [[{ id: 1, status: "completed" }]];
        }
        return [[]];
      });

      let responseStatus = null;
      let responseBody = null;
      const req = {
        params: { id: "1" },
        body: { approved_by: "admin", rejection_reason: "Not needed" },
      };
      const res = {
        status(code) { responseStatus = code; return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.rejectAppointment(req, res);

      assert.strictEqual(responseStatus, 400);
      assert.ok(responseBody.error.includes("Cannot reject"));
    });
  });

  describe("getAllAppointments", () => {
    it("should return all appointments", async () => {
      mockDb.query = mock.fn(async () => [
        [
          { id: 1, customer_name: "John", status: "pending" },
          { id: 2, customer_name: "Jane", status: "approved" },
        ],
      ]);

      let responseBody = null;
      const req = {};
      const res = {
        status(code) { return this; },
        json(body) { responseBody = body; return this; },
      };

      await controller.getAllAppointments(req, res);

      assert.strictEqual(responseBody.length, 2);
      assert.strictEqual(responseBody[0].customer_name, "John");
    });
  });
});
