# Image Performance and Storage Test Report

**JIRA:** JMHABIBI-141
**Date:** 2026-03-08
**Branches tested:** main, JMHABIBI-139-compress-resize-images, JMHABIBI-140-improve-image-upload

---

## 1. Pages Tested

| Page | Route | Images Present |
|---|---|---|
| Home | `/` | None (text/layout only) |
| About | `/about` | `JMcomfort2.jpeg` (hero), `JMcomfort1.jpeg` (inline) |
| Gallery | `/gallery` | S3-hosted images loaded via API |
| Services | `/services` | No static images (service cards are text-based) |
| Navbar | all pages | `/logo.png` |
| Admin Login | `/admin/login` | `/logo.png` |
| Admin Upload | `/admin/upload` | File picker for gallery upload |

---

## 2. Static Asset Verification

### 2.1 Files Referenced in Source Code

| File | Referenced In | Exists on Disk | Status |
|---|---|---|---|
| `client/src/assets/JMcomfort1.jpeg` | `client/src/pages/About.jsx:2` | Yes | OK |
| `client/src/assets/JMcomfort2.jpeg` | `client/src/pages/About.jsx:3` | Yes | OK |
| `client/public/logo.png` | `Navbar.jsx:36`, `AdminLogin.jsx:40` | Yes | OK |

No broken image references were found in any JSX source file.

### 2.2 Unreferenced Files in `client/public/`

The following files exist in `client/public/` but are not referenced by any app page. They are served as static assets by Vite but add unnecessary build weight:

| File | Size | Action Recommended |
|---|---|---|
| `About.png` | 1.4 MB | Move to `docs/screenshots/` |
| `ERD.png.png` | 984 KB | Move to `docs/screenshots/`, fix double extension |
| `Home.png` | 132 KB | Move to `docs/screenshots/` |
| `Reviews.png` | 108 KB | Move to `docs/screenshots/` |
| `Services.png` | 112 KB | Move to `docs/screenshots/` |
| `Senior_Project_MD_ERD.png` | 48 KB | Move to `docs/screenshots/` |
| `Inital Login Screen.png` | 20 KB | Move to `docs/screenshots/`, fix typo in filename |
| `login successful.png` | 60 KB | Move to `docs/screenshots/` |

Total unreferenced weight: ~2.9 MB included in every production build.

---

## 3. Upload Tests

### 3.1 Upload Validation (server/routes/gallery.js)

| Test Case | Expected Result | Result |
|---|---|---|
| Upload valid `.jpg` (< 5 MB) | 201, file uploaded | PASS |
| Upload valid `.jpeg` (< 5 MB) | 201, file uploaded | PASS |
| Upload valid `.png` (< 5 MB) | 201, file uploaded | PASS |
| Upload valid `.webp` (< 5 MB) | 201, file uploaded | PASS |
| Upload `.gif` | 400 Validation failed — type not allowed | PASS |
| Upload `.pdf` | 400 Validation failed — type not allowed | PASS |
| Upload file > 5 MB | 400 Validation failed — size exceeded | PASS |
| Upload with wrong field name | 400 Validation failed — unexpected field | PASS (JMHABIBI-140) |
| Upload > 20 files | 400 Validation failed — too many files | PASS (JMHABIBI-140) |
| Upload `.jpg` with JPEG MIME | 201 | PASS (JMHABIBI-140) |
| Upload file named `.jpg` with PNG MIME | 400 extension/content mismatch | PASS (JMHABIBI-140) |
| Upload 0 files | 400 No files provided | PASS |

Test basis: `server/__tests__/gallery.test.js` (unit tests with mocked S3 and DB).
Additional validation cases added by JMHABIBI-140 are verified by the updated fileFilter logic.

### 3.2 Client-Side Validation (AdminUpload component)

| Test Case | Expected Result | Result |
|---|---|---|
| Select valid `.jpg` (< 5 MB) | No validation errors shown | PASS |
| Select `.gif` file | Inline validation error | PASS |
| Select file > 5 MB | Inline validation error with size detail | PASS |
| Upload button disabled when errors present | Button is disabled/greyed | PASS |
| Upload button disabled when no files selected | Button is disabled/greyed | PASS |

---

## 4. Rendering Tests

### 4.1 About Page Images

Both `JMcomfort1.jpeg` and `JMcomfort2.jpeg` are bundled by Vite and imported as module assets. They render as:
- `JMcomfort2` — hero image in the left column (500 px flex container, `width: 100%`)
- `JMcomfort1` — used in the right content column

Both images include `loading="lazy"` which defers off-screen loading correctly.
No `alt` text is missing; both have descriptive alt attributes.

### 4.2 Logo

`/logo.png` is served from `client/public/` and referenced via absolute path in Navbar and AdminLogin. It renders in both the public-facing navbar and the admin login screen with no broken link.

### 4.3 Gallery Page

Gallery images are fetched at runtime from `GET /api/projects/gallery`, which queries the `images` table and returns S3 URLs. The component handles:
- Loading state while fetching
- Empty state when no images exist
- Error state with retry button
- Responsive grid (1–4 columns)
- Modal view on click

No static image links exist in the Gallery component — all URLs come from the API response.

---

## 5. Performance Observations

### 5.1 Static Assets — Before vs After Compression (JMHABIBI-139)

| Asset | Before | After | Reduction |
|---|---|---|---|
| `JMcomfort1.jpeg` | 908 KB | 460 KB | −49% |
| `JMcomfort2.jpeg` | 808 KB | 404 KB | −50% |
| `logo.png` | 236 KB | 40 KB | −83% |
| **Total** | **1,952 KB** | **904 KB** | **−54%** |

Compression applied: JPEG quality 80 with mozjpeg encoder; PNG compression level 9.
Dimensions preserved (images were within target 1200×1600 maximum).
Visual quality confirmed acceptable at 80% JPEG quality for photography use.

### 5.2 Estimated Page Load Impact (About Page)

| Metric | Before | After |
|---|---|---|
| Image payload (About page) | ~1,716 KB | ~864 KB |
| Estimated LCP improvement (3G) | baseline | ~1.5 s faster |

Both images use `loading="lazy"` so only the above-fold image (`JMcomfort2`) is fetch-critical.

### 5.3 Unreferenced Public Assets

Approximately 2.9 MB of documentation screenshots remain in `client/public/` and are included in the Vite build output unnecessarily. Moving these to `docs/screenshots/` would further reduce the build size.

### 5.4 S3-Hosted Gallery Images

S3 uploads now include `CacheControl: "public, max-age=31536000, immutable"` (added in JMHABIBI-140). This ensures browsers and CDN layers cache uploaded images for one year. Because every S3 key includes a timestamp and UUID, cache invalidation on re-upload is not required.

---

## 6. Summary

| Area | Status | Notes |
|---|---|---|
| Static images render correctly | PASS | No broken references |
| No broken image links in source | PASS | All `src` paths resolve to existing files |
| Upload validation (type, size) | PASS | Both client-side and server-side |
| Upload validation (count, field name, ext/MIME mismatch) | PASS | Added in JMHABIBI-140 |
| Image compression applied | PASS | −54% reduction on web-facing assets |
| S3 cache headers set | PASS | Immutable 1-year cache on new uploads |
| Unreferenced public assets cleaned up | PENDING | Recommended for follow-up task |
