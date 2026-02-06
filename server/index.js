require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const { validateEmailConfig } = require("./config/mailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Validate email config on startup
validateEmailConfig();

// Dev-only email test route
if (process.env.NODE_ENV !== "production") {
  const emailTestRoutes = require("./routes/emailTest");
  app.use("/api/email", emailTestRoutes);
}

// Appointment routes
const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
});
