const express = require("express");

// Mock mailer before requiring routes
jest.mock("../config/mailer", () => ({
  sendEmail: jest.fn().mockResolvedValue({ messageId: "test-id" }),
  validateEmailConfig: jest.fn(),
  createTransporter: jest.fn(),
}));

// Mock db pool (used by leads route and appointments route)
jest.mock("../config/db", () => ({
  execute: jest.fn(),
}));

// Mock database (used by appointmentController)
jest.mock("../config/database", () => {
  const mockConnection = {
    beginTransaction: jest.fn().mockResolvedValue(undefined),
    query: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
    rollback: jest.fn().mockResolvedValue(undefined),
    release: jest.fn(),
  };
  return {
    getConnection: jest.fn().mockResolvedValue(mockConnection),
    query: jest.fn(),
    __mockConnection: mockConnection,
  };
});

// Mock logger to avoid file system side effects
jest.mock("../config/logger", () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  add: jest.fn(),
}));

const pool = require("../config/db");
const database = require("../config/database");
const { sendEmail } = require("../config/mailer");
const leadsRoutes = require("../routes/leads");
const appointmentRoutes = require("../routes/appointments");

const mockConnection = database.__mockConnection;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/leads", leadsRoutes);
  app.use("/api/appointments", appointmentRoutes);
  return app;
}

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

describe("Email Notifications", () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    // Re-apply default implementations after clearAllMocks
    sendEmail.mockResolvedValue({ messageId: "test-id" });
    mockConnection.beginTransaction.mockResolvedValue(undefined);
    mockConnection.commit.mockResolvedValue(undefined);
    mockConnection.rollback.mockResolvedValue(undefined);
    database.getConnection.mockResolvedValue(mockConnection);
    process.env.EMAIL_FROM = "admin@jmcomfort.com";
  });

  const validLead = {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    lead_type: "contact",
    message: "I need HVAC service",
  };

  describe("POST /api/leads", () => {
    test("calls sendEmail twice on successful lead submission", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await makeRequest(app, "POST", "/api/leads", validLead);

      expect(res.status).toBe(201);
      expect(sendEmail).toHaveBeenCalledTimes(2);
    });

    test("sends admin notification to EMAIL_FROM address", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/leads", validLead);

      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "admin@jmcomfort.com",
          subject: "New Lead Received",
        })
      );
    });

    test("sends customer confirmation to lead email address", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);

      await makeRequest(app, "POST", "/api/leads", validLead);

      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "john@example.com",
          subject: "Thank you for contacting JM Comfort",
        })
      );
    });

    test("still returns 201 when sendEmail throws", async () => {
      pool.execute.mockResolvedValueOnce([{ insertId: 1 }]);
      sendEmail
        .mockRejectedValueOnce(new Error("SMTP connection failed"))
        .mockRejectedValueOnce(new Error("SMTP connection failed"));

      const res = await makeRequest(app, "POST", "/api/leads", validLead);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Lead created successfully");
    });
  });

  describe("PATCH /api/appointments/:id/approve", () => {
    test("calls sendEmail with confirmation email on approval", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1, status: "pending", customer_id: 1 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[{
          id: 1,
          status: "approved",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          scheduled_at: "2030-06-15T10:00:00",
        }]]);

      const res = await makeRequest(app, "PATCH", "/api/appointments/1/approve", {
        approved_by: "admin",
      });

      expect(res.status).toBe(200);
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "john@example.com",
          subject: "JM Comfort - Appointment Confirmation",
        })
      );
    });

    test("still returns 200 when sendEmail throws", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1, status: "pending", customer_id: 1 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[{
          id: 1,
          status: "approved",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          scheduled_at: "2030-06-15T10:00:00",
        }]]);
      sendEmail.mockRejectedValueOnce(new Error("SMTP connection failed"));

      const res = await makeRequest(app, "PATCH", "/api/appointments/1/approve", {
        approved_by: "admin",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Appointment approved successfully");
    });
  });

  describe("PATCH /api/appointments/:id/reject", () => {
    test("calls sendEmail with rejection email including rejection_reason", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1, status: "pending", customer_id: 1 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[{
          id: 1,
          status: "rejected",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          scheduled_at: "2030-06-15T10:00:00",
          rejection_reason: "Schedule conflict",
        }]]);

      const res = await makeRequest(app, "PATCH", "/api/appointments/1/reject", {
        approved_by: "admin",
        rejection_reason: "Schedule conflict",
      });

      expect(res.status).toBe(200);
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "john@example.com",
        })
      );
      const emailCall = sendEmail.mock.calls[0][0];
      expect(emailCall.text).toContain("Schedule conflict");
      expect(emailCall.html).toContain("Schedule conflict");
    });

    test("still returns 200 when sendEmail throws", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1, status: "pending", customer_id: 1 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[{
          id: 1,
          status: "rejected",
          customer_name: "John Doe",
          customer_email: "john@example.com",
          scheduled_at: "2030-06-15T10:00:00",
          rejection_reason: "Schedule conflict",
        }]]);
      sendEmail.mockRejectedValueOnce(new Error("SMTP connection failed"));

      const res = await makeRequest(app, "PATCH", "/api/appointments/1/reject", {
        approved_by: "admin",
        rejection_reason: "Schedule conflict",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Appointment rejected successfully");
    });
  });

  describe("Email subject snapshots", () => {
    test("admin notification email subject", () => {
      const { buildAdminNotificationEmail } = require("../templates/adminNotificationEmail");
      const result = buildAdminNotificationEmail({
        name: "Test User",
        email: "test@example.com",
        phone: "555-0000",
        lead_type: "quote",
        message: "Test message",
      });
      expect(result.subject).toMatchSnapshot();
    });

    test("confirmation email subject", () => {
      const { buildConfirmationEmail } = require("../templates/confirmationEmail");
      const result = buildConfirmationEmail({
        customerName: "Test User",
        scheduledAt: "2030-06-15T10:00:00",
        status: "approved",
      });
      expect(result.subject).toMatchSnapshot();
    });
  });
});
