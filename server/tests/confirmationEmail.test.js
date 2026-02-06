const { describe, it } = require("node:test");
const assert = require("node:assert");
const { buildConfirmationEmail } = require("../templates/confirmationEmail");

describe("buildConfirmationEmail", () => {
  const baseAppointment = {
    customerName: "John Doe",
    email: "john@example.com",
    scheduledAt: "2026-03-15T10:00:00.000Z",
    status: "Scheduled",
  };

  it("should return subject, html, and text fields", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(result.subject, "subject should be defined");
    assert.ok(result.html, "html should be defined");
    assert.ok(result.text, "text should be defined");
  });

  it("should include the customer name in html and text", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(result.html.includes("John Doe"), "html should contain customer name");
    assert.ok(result.text.includes("John Doe"), "text should contain customer name");
  });

  it("should include the formatted date in html and text", () => {
    const result = buildConfirmationEmail(baseAppointment);

    // The date should be formatted as a readable string, not the raw ISO string
    assert.ok(result.html.includes("2026"), "html should contain the year");
    assert.ok(result.text.includes("2026"), "text should contain the year");
  });

  it("should include the appointment status", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(result.html.includes("Scheduled"), "html should contain status");
    assert.ok(result.text.includes("Scheduled"), "text should contain status");
  });

  it("should include the subject line", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.strictEqual(result.subject, "JM Comfort - Appointment Confirmation");
  });

  it("should include project name when provided", () => {
    const appointment = { ...baseAppointment, projectName: "AC Installation" };
    const result = buildConfirmationEmail(appointment);

    assert.ok(result.html.includes("AC Installation"), "html should contain project name");
    assert.ok(result.text.includes("AC Installation"), "text should contain project name");
  });

  it("should omit project line when projectName is not provided", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(!result.html.includes("Project"), "html should not contain Project label without project name");
    assert.ok(!result.text.includes("Project:"), "text should not contain Project: without project name");
  });

  it("should default status to Scheduled when not provided", () => {
    const appointment = { ...baseAppointment };
    delete appointment.status;
    const result = buildConfirmationEmail(appointment);

    assert.ok(result.html.includes("Scheduled"), "html should default to Scheduled");
    assert.ok(result.text.includes("Scheduled"), "text should default to Scheduled");
  });

  it("should produce valid HTML structure", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(result.html.includes("<!DOCTYPE html>"), "should start with doctype");
    assert.ok(result.html.includes("</html>"), "should end with closing html tag");
    assert.ok(result.html.includes("Appointment Summary"), "should contain summary heading");
  });

  it("should produce a plain text fallback without HTML tags", () => {
    const result = buildConfirmationEmail(baseAppointment);

    assert.ok(!result.text.includes("<"), "text should not contain HTML tags");
  });
});
