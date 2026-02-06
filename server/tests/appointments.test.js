const { describe, it, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert");

describe("POST /api/appointments", () => {
  let sendEmailMock;
  let originalSendEmail;
  let appointmentsRouter;

  beforeEach(() => {
    // Clear module cache so we get fresh imports
    delete require.cache[require.resolve("../routes/appointments")];
    delete require.cache[require.resolve("../config/mailer")];

    // Mock the mailer module before loading appointments route
    const mailer = require("../config/mailer");
    originalSendEmail = mailer.sendEmail;
    sendEmailMock = mock.fn(async () => ({ messageId: "test-message-id" }));
    mailer.sendEmail = sendEmailMock;

    appointmentsRouter = require("../routes/appointments");
  });

  afterEach(() => {
    // Restore original sendEmail
    const mailer = require("../config/mailer");
    mailer.sendEmail = originalSendEmail;
    sendEmailMock.mock.resetCalls();
  });

  it("should call sendEmail when appointment is created", async () => {
    // Simulate a request/response cycle
    const req = {
      body: {
        customerName: "Jane Smith",
        email: "jane@example.com",
        scheduledAt: "2026-04-20T14:00:00.000Z",
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

    // Extract the route handler from the router stack
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
    const freshRouter = require("../routes/appointments");

    const req = {
      body: {
        customerName: "Bob Jones",
        email: "bob@example.com",
        scheduledAt: "2026-05-10T09:00:00.000Z",
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
    assert.ok(responseBody.appointment, "should still return the appointment");
  });

  it("should include project name in email when provided", async () => {
    const req = {
      body: {
        customerName: "Alice Park",
        email: "alice@example.com",
        scheduledAt: "2026-06-01T11:00:00.000Z",
        projectName: "Furnace Repair",
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
    assert.ok(emailArgs.html.includes("Furnace Repair"), "email should contain project name");
  });
});
