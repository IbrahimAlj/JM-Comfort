const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const { body, param } = require('express-validator');
const { s3Client, PutObjectCommand, BUCKET_NAME } = require('../config/s3');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MIME_TO_EXT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error(`File type not allowed. Only jpg, jpeg, png, and webp are accepted.`));
    }
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`File extension not allowed. Rename to .jpg, .jpeg, .png, or .webp.`));
    }
    const validExts = MIME_TO_EXT[file.mimetype];
    if (!validExts.includes(ext)) {
      return cb(new Error(`File extension does not match content type.`));
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
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 50);
  return `services/${timestamp}-${uniqueId}-${safeName}${ext}`;
}

function uploadServiceImage(req, res, next) {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'Validation failed',
          details: [`File exceeds the maximum size of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`],
        });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          error: 'Validation failed',
          details: [`Unexpected field name in upload. Use the field name "image".`],
        });
      }
      return res.status(400).json({ error: 'Validation failed', details: [err.message] });
    }

    if (!req.file) return next();

    if (!BUCKET_NAME) {
      console.error('[services] S3_BUCKET_NAME not configured; rejecting upload');
      return res.status(500).json({ error: 'Image uploads are not configured on the server' });
    }

    try {
      const s3Key = generateS3Key(req.file.originalname);
      const s3Url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-west-1'}.amazonaws.com/${s3Key}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );

      req.uploadedImageUrl = s3Url;
      return next();
    } catch (uploadErr) {
      console.error('[services] S3 upload failed:', uploadErr.message);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  });
}

router.get('/', servicesController.getAllServices);

router.get(
  '/:id',
  [param('id').isInt().withMessage('ID must be number')],
  servicesController.getServiceById
);

router.post('/', uploadServiceImage, servicesController.createService);

router.put(
  '/:id',
  uploadServiceImage,
  [param('id').isInt().withMessage('id must be an integer')],
  servicesController.updateService
);

router.delete(
  '/:id',
  [param('id').isInt().withMessage('id must be an integer')],
  servicesController.deleteService
);

module.exports = router;
