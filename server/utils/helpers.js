const xss = require("xss");

function sanitizeInput(value) {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") return value;
  return xss(value).trim();
}

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

module.exports = { sanitizeInput, isValidEmail, formatDate };