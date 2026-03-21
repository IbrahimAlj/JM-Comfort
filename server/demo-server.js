/**
 * demo-server.js
 * Standalone mock server for demo purposes.
 * Mimics the real gallery API without needing AWS or DB credentials.
 * Run with: node demo-server.js
 */

const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- Validation constants (same as real server) ---
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 20;

const MIME_TO_EXT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILE_COUNT },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error(
          `File type not allowed: ${file.originalname}. Only jpg, jpeg, png, and webp are accepted.`
        )
      );
    }
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(
        new Error(
          `File extension not allowed: ${file.originalname}. Rename the file to .jpg, .jpeg, .png, or .webp.`
        )
      );
    }
    const validExts = MIME_TO_EXT[file.mimetype];
    if (!validExts.includes(ext)) {
      return cb(
        new Error(
          `File extension does not match content type for: ${file.originalname}.`
        )
      );
    }
    cb(null, true);
  },
});

// In-memory store of "uploaded" images
const mockGallery = [
  {
    url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800",
    title: "hvac-installation-demo.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    title: "comfort-system-demo.jpg",
  },
];

// POST /api/projects/gallery — mock upload
app.post("/api/projects/gallery", (req, res, next) => {
  upload.array("images", MAX_FILE_COUNT)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Validation failed",
          details: [`One or more files exceed the 5MB limit.`],
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "Validation failed",
          details: [`Max ${MAX_FILE_COUNT} files at once.`],
        });
      }
      return res.status(400).json({
        error: "Validation failed",
        details: [err.message],
      });
    }
    next();
  });
}, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files provided" });
  }

  const uploaded = [];

  for (const file of req.files) {
    const uniqueId = crypto.randomUUID();
    const ext = path.extname(file.originalname).toLowerCase();
    const s3Key = `gallery/${Date.now()}-${uniqueId}${ext}`;

    // Mock S3 URL (not a real upload)
    const mockUrl = `https://mock-jm-comfort-bucket.s3.us-west-1.amazonaws.com/${s3Key}`;

    // Save to in-memory gallery
    mockGallery.unshift({ url: mockUrl, title: file.originalname });

    uploaded.push({
      url: mockUrl,
      title: file.originalname,
      s3_key: s3Key,
    });

    console.log(`[MOCK] Uploaded: ${file.originalname} (${(file.size / 1024).toFixed(1)} KB) → ${s3Key}`);
  }

  return res.status(201).json({ uploaded, failed: [] });
});

// GET /api/projects/gallery — return mock gallery
app.get("/api/projects/gallery", (req, res) => {
  console.log(`[MOCK] Gallery fetch — returning ${mockGallery.length} images`);
  return res.json(mockGallery);
});

// In-memory services store
let mockServices = [
  { id: 1, title: "AC Installation", description: "Professional air conditioning installation for residential and commercial spaces.", price: "1200" },
  { id: 2, title: "Heating Repair", description: "Fast and reliable heating system diagnostics and repair.", price: "150" },
  { id: 3, title: "Duct Cleaning", description: "Full duct cleaning service to improve air quality and system efficiency.", price: "300" },
];
let nextServiceId = 4;

// GET /api/services
app.get("/api/services", (req, res) => {
  res.json(mockServices);
});

// POST /api/services
app.post("/api/services", (req, res) => {
  const { title, description, price } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }
  const newService = { id: nextServiceId++, title, description, price: price || "" };
  mockServices.push(newService);
  console.log(`[MOCK] Created service: ${title}`);
  res.status(201).json(newService);
});

// PUT /api/services/:id
app.put("/api/services/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Service not found" });
  const { title, description, price } = req.body;
  mockServices[index] = { id, title, description, price: price || "" };
  console.log(`[MOCK] Updated service: ${title}`);
  res.json(mockServices[index]);
});

// DELETE /api/services/:id
app.delete("/api/services/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockServices.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: "Service not found" });
  const deleted = mockServices.splice(index, 1)[0];
  console.log(`[MOCK] Deleted service: ${deleted.title}`);
  res.json({ message: "Deleted successfully" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Demo server running" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Demo server running at http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/projects/gallery  (upload)`);
  console.log(`   GET  http://localhost:${PORT}/api/projects/gallery  (gallery)\n`);
});
