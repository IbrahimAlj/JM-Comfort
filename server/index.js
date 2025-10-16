import express from "express";

const app = express();
const PORT = 5000;

// Middleware (optional)
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("✅ Express backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from Express backend!" });
});