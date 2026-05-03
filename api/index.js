// Vercel serverless entry: re-export the Express app from /server.
// Vercel routes every /api/* request here via vercel.json.
module.exports = require('../server/app');
