// Import libraries
const { body, validationResult, checkSchema } = require('express-validator');
const xss = require('xss');

// Middleware to sanitize all inputs and validate
const sanitizeInput = [
  // Example: sanitize all fields in req.body
  body('*').customSanitizer(value => {
    if (typeof value === 'string') {
      return xss(value); // remove/neutralize XSS payloads
    }
    return value;
  }),

  // Validation check: returns error if input fails
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = sanitizeInput;
