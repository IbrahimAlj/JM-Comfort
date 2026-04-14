# Image Storage Review

**JIRA:** JMHABIBI-138
**Date:** 2026-03-08

---

## 1. Current Upload Flow

```
User (browser)
  └─► AdminUpload component (/admin/upload)
        └─► POST /api/projects/gallery  (multipart/form-data, field: "images")
              └─► Multer middleware (memory storage)
                    ├─► File type validation (MIME check)
                    ├─► File size validation (≤ 5 MB)
                    └─► S3 PutObjectCommand
                          └─► MySQL INSERT into images table
```

**Client-side validation** (`client/src/admin/AdminRoutes.jsx`):
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Max file size: 5 MB per file
- Errors are displayed inline before the upload is submitted

**Server-side validation** (`server/routes/gallery.js`):
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
- Max file size: 5 MB (enforced by Multer `limits.fileSize`)
- Max files per request: 20

**S3 upload** (`server/config/s3.js`):
- SDK: `@aws-sdk/client-s3`
- Region: `AWS_REGION` env var (default `us-west-1`)
- Bucket: `S3_BUCKET_NAME` env var
- Command: `PutObjectCommand` — synchronous per file, no streaming

**Database insert** (`server/routes/gallery.js`, line 77):
- Table: `images` (MySQL, `jm_comfort` database)
- Columns: `s3_key`, `s3_url`, `original_name`, `mime_type`, `file_size`, `uploaded_at`

---

## 2. Storage Location

All user-uploaded images are stored in **AWS S3** under the `gallery/` prefix.
Static site assets (logo, screenshots) live in the repository under `client/public/` and `client/src/assets/`.

| Category | Location | Access |
|---|---|---|
| Uploaded gallery images | S3 bucket / `gallery/` prefix | Public S3 URL |
| Logo | `client/public/logo.png` | Served by Vite static |
| About-page images | `client/src/assets/JMcomfort1.jpeg`, `JMcomfort2.jpeg` | Bundled by Vite |
| Documentation screenshots | `client/public/*.png` | Not referenced by app pages |
| ERD diagrams | `client/public/ERD.png.png` | Not referenced by app pages |

---

## 3. File Naming Strategy

S3 keys for uploaded images are generated in `generateS3Key()` (`server/routes/gallery.js`, line 24):

```
gallery/{timestamp}-{uuid}-{sanitized-basename}.{ext}
```

- **timestamp** — `Date.now()` milliseconds, ensures chronological ordering
- **uuid** — `crypto.randomUUID()`, prevents collisions
- **sanitized-basename** — non-alphanumeric characters replaced with `_`, capped at 50 chars
- **ext** — lowercased original extension

This strategy is safe against path traversal and collisions.

---

## 4. Issues Discovered

### 4.1 Oversized Static Assets

The following repository-tracked files are larger than necessary for web delivery:

| File | Size | Notes |
|---|---|---|
| `client/public/About.png` | 1.4 MB | Not used by any app page — appears to be a documentation screenshot |
| `client/public/ERD.png.png` | 984 KB | Not referenced in app; double extension (`.png.png`) |
| `client/public/logo.png` | 236 KB | Used in Navbar and AdminLogin — too large for a logo |
| `client/src/assets/JMcomfort1.jpeg` | 908 KB | Used in About page — oversized for web |
| `client/src/assets/JMcomfort2.jpeg` | 808 KB | Used in About page — oversized for web |

### 4.2 Unused Public Assets

The following files in `client/public/` are not referenced by any source file:

- `About.png` — 1.4 MB
- `ERD.png.png` — 984 KB (also has double extension)
- `Home.png` — 132 KB
- `Reviews.png` — 108 KB
- `Services.png` — 112 KB
- `Senior_Project_MD_ERD.png` — 48 KB
- `Inital Login Screen.png` — 20 KB (typo in filename: "Inital")
- `login successful.png` — 60 KB

These appear to be documentation screenshots that were placed in `public/` but belong in `docs/screenshots/`.

### 4.3 Double Extension

`ERD.png.png` has a double `.png` extension, indicating it was saved incorrectly.

### 4.4 No Server-Side Image Resizing or Compression

Images are uploaded to S3 without any server-side resize or recompress step. A 5 MB JPEG is stored and served as-is. There is no conversion to WebP for better compression ratios.

### 4.5 No Cache-Control Headers on S3 Objects

`PutObjectCommand` does not set `CacheControl` metadata, so browser and CDN caching for S3-hosted images relies entirely on S3 default behavior.

### 4.6 No Duplicate Detection

There is no hash-based deduplication. Uploading the same image twice creates two separate S3 objects and two database rows.

---

## 5. Suggested Improvements

### 5.1 Compress and Resize Static Assets (Quick Win)
- Resize `JMcomfort1.jpeg` and `JMcomfort2.jpeg` to ≤ 1920 px wide at 80% JPEG quality — expected reduction from ~900 KB to ~150–250 KB each.
- Resize `logo.png` to its display dimensions (approx 120×40 px) — expected reduction from 236 KB to < 10 KB.
- Convert large PNGs to WebP where supported.

### 5.2 Move Documentation Screenshots out of `public/`
- Move `About.png`, `ERD.png.png`, `Home.png`, `Reviews.png`, `Services.png`, `Senior_Project_MD_ERD.png`, `Inital Login Screen.png`, `login successful.png` to `docs/screenshots/`.
- This removes ~2.9 MB from the Vite build output.

### 5.3 Add Server-Side Resize on Upload
- Integrate `sharp` into the upload route to resize images server-side before pushing to S3 (e.g., max 1920 px wide, 80% quality).
- Optionally convert to WebP automatically.

### 5.4 Add Hash-Based Deduplication
- Compute an MD5 or SHA-256 hash of the file buffer before uploading.
- Check the `images` table for an existing `file_hash` column before inserting.

### 5.5 Set Cache-Control on S3 Uploads
- Add `CacheControl: "public, max-age=31536000, immutable"` to `PutObjectCommand` for gallery images (filenames include timestamp + UUID so they are cache-safe).

### 5.6 Fix Double Extension
- Rename `ERD.png.png` → `ERD.png` in `docs/screenshots/` after moving.
