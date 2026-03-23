const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const pool = require("../config/db");
const { s3Client, PutObjectCommand, BUCKET_NAME } = require("../config/s3");

const router = express.Router();

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

function generateS3Key(originalName) {
  const timestamp = Date.now();
  const uniqueId = crypto.randomUUID();
  const ext = path.extname(originalName).toLowerCase();
  const safeName = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 50);
  return `gallery/${timestamp}-${uniqueId}-${safeName}${ext}`;
}

/**
 * POST /api/projects/gallery
 * Upload one or multiple images to S3 and store metadata.
 */
router.post("/", (req, res, next) => {
  upload.array("images", MAX_FILE_COUNT)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: "Validation failed",
          details: [`One or more files exceed the maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`],
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          error: "Validation failed",
          details: [`Too many files. A maximum of ${MAX_FILE_COUNT} files may be uploaded at once.`],
        });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          error: "Validation failed",
          details: [`Unexpected field name in upload request. Use the field name "images".`],
        });
      }
      return res.status(400).json({
        error: "Validation failed",
        details: [err.message],
      });
    }
    next();
  });
}, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files provided" });
  }

  const uploaded = [];
  const failed = [];

  for (const file of req.files) {
    const s3Key = generateS3Key(file.originalname);
    const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-west-1"}.amazonaws.com/${s3Key}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
          CacheControl: "public, max-age=31536000, immutable",
        })
      );

      await pool.execute(
        `INSERT INTO images (s3_key, s3_url, original_name, mime_type, file_size, uploaded_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [s3Key, s3Url, file.originalname, file.mimetype, file.size]
      );

      uploaded.push({
        url: s3Url,
        title: file.originalname,
        s3_key: s3Key,
      });
    } catch (err) {
      console.error(`[gallery] Failed to upload ${file.originalname}:`, err.message);
      failed.push({ name: file.originalname, error: "Upload failed" });
    }
  }

  if (uploaded.length === 0) {
    return res.status(500).json({
      error: "All uploads failed",
      failed,
    });
  }

  const status = failed.length > 0 ? 207 : 201;
  return res.status(status).json({ uploaded, failed });
});

/**
 * GET /api/projects/gallery
 * Return all active gallery images for the frontend.
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT s3_url AS url, original_name AS title
       FROM images
       WHERE is_active = TRUE
       ORDER BY uploaded_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error("[gallery] Failed to fetch images:", err.message);
    return res.status(500).json({ error: "Failed to load gallery" });
  }
});

module.exports = router;
