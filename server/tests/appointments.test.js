const { describe, it, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert");

describe("POST /api/appointments", () => {
  let sendEmailMock;
  let originalSendEmail;
  let poolExecuteMock;
  let originalPoolExecute;
  let appointmentsRouter;

  beforeEach(() => {
    // Clear module cache so we get fresh imports
    delete require.cache[require.resolve("../routes/appointments")];
    delete require.cache[require.resolve("../config/mailer")];
    delete require.cache[require.resolve("../config/db")];

    // Mock the mailer module before loading appointments route
    const mailer = require("../config/mailer");
    originalSendEmail = mailer.sendEmail;
    sendEmailMock = mock.fn(async () => ({ messageId: "test-message-id" }));
    mailer.sendEmail = sendEmailMock;

    // Mock the db pool
    const pool = require("../config/db");
    originalPoolExecute = pool.execute;
    poolExecuteMock = mock.fn(async () => [{ insertId: 1 }]);
    pool.execute = poolExecuteMock;

    appointmentsRouter = require("../routes/appointments");
  });

  afterEach(() => {
    // Restore originals
    const mailer = require("../config/mailer");
    mailer.sendEmail = originalSendEmail;
    sendEmailMock.mock.resetCalls();

    const pool = require("../config/db");
    pool.execute = originalPoolExecute;
  });

  it("should call sendEmail when appointment is created with email", async () => {
    const req = {
      body: {
        customer_id: 1,
        scheduled_at: "2030-06-15T10:00:00",
        end_at: "2030-06-15T11:00:00",
        customerName: "Jane Smith",
        email: "jane@example.com",
      },
    };

    let responseStatus = null;
    let responseBody = null;

    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    const postHandler = appointmentsRouter.stack.find(
      (layer) => layer.route && layer.route.methods.post
    );
    assert.ok(postHandler, "POST route should exist");

    await postHandler.route.stack[0].handle(req, res);

    assert.strictEqual(responseStatus, 201, "should respond with 201 status");
    assert.strictEqual(sendEmailMock.mock.callCount(), 1, "sendEmail should be called once");

    const emailArgs = sendEmailMock.mock.calls[0].arguments[0];
    assert.strictEqual(emailArgs.to, "jane@example.com", "email should be sent to customer");
    assert.ok(emailArgs.subject.includes("Confirmation"), "subject should mention confirmation");
    assert.ok(emailArgs.html.includes("Jane Smith"), "html should contain customer name");
    assert.ok(emailArgs.text, "plain text fallback should exist");
  });

  it("should return 400 when required fields are missing", async () => {
    const req = {
      body: { customerName: "Jane Smith" },
    };

    let responseStatus = null;
    let responseBody = null;

    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    const postHandler = appointmentsRouter.stack.find(
      (layer) => layer.route && layer.route.methods.post
    );

    await postHandler.route.stack[0].handle(req, res);

    assert.strictEqual(responseStatus, 400, "should respond with 400 status");
    assert.ok(responseBody.error, "should return error message");
  });

  it("should still return 201 when sendEmail fails", async () => {
    // Make sendEmail throw
    const mailer = require("../config/mailer");
    mailer.sendEmail = mock.fn(async () => {
      throw new Error("SMTP connection refused");
    });

    // Re-require to pick up the mock
    delete require.cache[require.resolve("../routes/appointments")];
    const pool = require("../config/db");
    pool.execute = mock.fn(async () => [{ insertId: 1 }]);
    const freshRouter = require("../routes/appointments");

    const req = {
      body: {
        customer_id: 1,
        scheduled_at: "2030-06-15T10:00:00",
        end_at: "2030-06-15T11:00:00",
        customerName: "Bob Jones",
        email: "bob@example.com",
      },
    };

    let responseStatus = null;
    let responseBody = null;

    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    const postHandler = freshRouter.stack.find(
      (layer) => layer.route && layer.route.methods.post
    );

    await postHandler.route.stack[0].handle(req, res);

    assert.strictEqual(responseStatus, 201, "should still return 201 even when email fails");
    assert.ok(responseBody.appointment_id, "should still return the appointment_id");
  });

  it("should include project name in email when provided", async () => {
    const req = {
      body: {
        customer_id: 1,
        scheduled_at: "2030-06-15T10:00:00",
        end_at: "2030-06-15T11:00:00",
        customerName: "Alice Park",
        email: "alice@example.com",
      },
    };

    let responseStatus = null;

    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json() {
        return this;
      },
    };

    const postHandler = appointmentsRouter.stack.find(
      (layer) => layer.route && layer.route.methods.post
    );

    await postHandler.route.stack[0].handle(req, res);

    assert.strictEqual(responseStatus, 201);
    const emailArgs = sendEmailMock.mock.calls[0].arguments[0];
    assert.ok(emailArgs.html.includes("Alice Park"), "email should contain customer name");
  });
});
