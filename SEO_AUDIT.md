# JM Comfort — On-Page SEO Audit
**Branch:** JMHABIBI-193-audit-on-page-seo-basics
**Date:** 2026-03-06
**Auditor:** Claude Code (JMHABIBI-193)

---

## 1. Implementation Overview

The app is a React 19 + Vite SPA with client-side routing via react-router-dom.

- `react-helmet-async` is installed and `HelmetProvider` wraps the app correctly in `main.jsx`.
- `client/src/seo/homeMeta.js` contains a well-structured metadata object for the home page (title, description, OG, Twitter).
- **Critical gap:** `homeMeta.js` is imported in `App.jsx` but the data is never passed to a `<Helmet>` component anywhere. No page in the app renders any `<Helmet>` tag.
- Because there is no SSR or pre-rendering, search crawlers that do not execute JavaScript will see only the shell `index.html`, which had the Vite default `<title>client</title>` (fixed in this branch — see Section 8).

---

## 2. Page-by-Page SEO Checklist

### 2.1 Home (`/`) — `pages/Home.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | Falls back to index.html default. `homeMeta.js` data exists but is never rendered via `<Helmet>`. |
| Meta description | MISSING | Same as above. |
| H1 | PASS | "Your Trusted Partner in Home Comfort Solutions" in `HeroBanner.jsx` |
| H2 | PASS | "Latest reviews" in `HeroBanner.jsx`, "Why Choose JM Comfort" in `WhyChooseUs.jsx` |
| H3 | PASS | Review card headings in `HeroBanner.jsx` |
| Image alt text | N/A | No `<img>` tags in the hero or WhyChooseUs sections |
| Internal links | PASS | Navbar links to all main pages |
| Canonical URL | MISSING | No canonical tag rendered |

**Priority: CRITICAL** — The home page has the most SEO value and has zero metadata rendered.

---

### 2.2 Services (`/services`) — `pages/Services.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | PASS | "Our Services" |
| H2 | PASS | Each service uses `<h2>` for its title |
| Image alt text | FAIL | Service images are empty `<div>` placeholders, not `<img>` elements — no images rendered at all |
| Internal links | PASS | Links to `/services/:id` and `/request-quote` |
| Canonical URL | MISSING | No canonical tag |

**Priority: HIGH**

---

### 2.3 Contact (`/contact`) — `pages/Contact.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | PASS | "Contact Us" |
| Content | WEAK | Page body is a placeholder: "Your contact form goes here..." — no real content or form |
| Canonical URL | MISSING | No canonical tag |

**Priority: HIGH** — Page has no real content. This also affects SEO value beyond just metadata.

---

### 2.4 About (`/about`) — `pages/About.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | WEAK | "About" — too generic. Should be "About JM Comfort" or similar. |
| H2/H3 | MISSING | No subheadings under the H1 |
| Image alt text | PASS | `alt="JM Comfort HVAC technician installing heating and cooling system"` — good descriptive alt |
| Canonical URL | MISSING | No canonical tag |

**Priority: HIGH**

---

### 2.5 Reviews (`/reviews`) — `pages/Reviews.jsx` + `components/CustomerReviews.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | PASS | "Customer Reviews" rendered by `CustomerReviews` component |
| Structured data | MISSING | No JSON-LD `Review` or `AggregateRating` schema — a significant missed opportunity |
| Review content | WEAK | Reviews are hardcoded placeholder data with fake names (Frank Ocean, Drake, Yaet) and placeholder roles ("Description") |
| Canonical URL | MISSING | No canonical tag |

**Priority: HIGH**

---

### 2.6 Gallery (`/gallery`) — `pages/Gallery.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | PASS | "Our Project Gallery" |
| Image alt text | PARTIAL | Uses `alt={img.title \|\| "Project Image"}` — "Project Image" fallback is too generic; relies on backend `title` field |
| API hardcoding | ISSUE | Fetches from `http://localhost:5000` — will not work in production |
| Canonical URL | MISSING | No canonical tag |

**Priority: MEDIUM**

---

### 2.7 Request Quote (`/request-quote`) — `pages/RequestQuote.jsx`

| Check | Status | Notes |
|---|---|---|
| Title tag | MISSING | No `<Helmet>` |
| Meta description | MISSING | No `<Helmet>` |
| H1 | PASS | "Request a Quote" |
| Form labels | PASS | All inputs have associated `<label>` elements with correct `htmlFor` |
| Canonical URL | MISSING | No canonical tag |

**Priority: MEDIUM** — Conversion page; title and meta are still needed.

---

### 2.8 Service Detail (`/services/:id`) — `pages/ServiceDetail.jsx`

| Check | Status | Notes |
|---|---|---|
| Route | FAIL | `ServiceDetail.jsx` exists but has no route registered in `App.jsx`. The file is also empty (0 bytes). |
| Title tag | MISSING | File is empty |
| Meta description | MISSING | File is empty |

**Priority: HIGH** — Route is broken/unimplemented.

---

## 3. Global Issues

### 3.1 index.html — FIXED in this branch
- **Before:** `<title>client</title>` (Vite default placeholder)
- **Before:** Favicon was `vite.svg` (Vite default)
- **After:** Title updated to `JM Comfort | HVAC Services in Sacramento, CA`
- **After:** Favicon updated to `/logo.png`

### 3.2 No page-level `<Helmet>` rendering anywhere
- `react-helmet-async` and `HelmetProvider` are set up correctly.
- `homeMeta.js` has proper data.
- But no `<Helmet>` component is placed in any page component.
- **Result:** Every page shows the same `index.html` title/description.
- **Fix needed:** Each page component needs a `<Helmet>` block with its own title and description.

### 3.3 SPA + No SSR = crawler risk
- Google's crawler executes JavaScript and should index SPA content.
- Other crawlers (social media previews, Bing, older bots) may not.
- Because `<Helmet>` is never rendered, even Google will read the fallback `<title>` from index.html.
- **Future consideration (out of scope for this ticket):** Pre-rendering or SSR for critical pages.

### 3.4 No robots.txt
- No `client/public/robots.txt` file exists.
- Without it, crawlers apply default behavior (allow all).
- **Recommendation:** Add a `robots.txt` in a follow-up ticket.

### 3.5 No sitemap.xml
- No `client/public/sitemap.xml` exists.
- **Recommendation:** Add a sitemap in a follow-up ticket.

### 3.6 No structured data / JSON-LD
- No `LocalBusiness`, `HVACBusiness`, `Review`, or `AggregateRating` schema.
- This is a significant missed opportunity for a local service business.
- **Recommendation:** Implement in a follow-up ticket.

### 3.7 URL structure
- All routes are clean and human-readable: `/`, `/about`, `/services`, `/contact`, `/reviews`, `/gallery`, `/request-quote`.
- No issues with URL structure.
- `/services/:id` pattern is correct but the route and page are not implemented.

### 3.8 Navbar — Contact page missing
- Navbar links: Home, Services, Reviews, About, Gallery, Request Quote.
- **No link to `/contact`** — the Contact page is not reachable from the navbar.

### 3.9 Footer — Social links are placeholder `#` hrefs
- Facebook, Instagram, Twitter links all point to `#`.
- Privacy and Terms links are unlinked spans with no `href`.
- These are content/UX gaps, not blocking SEO issues.

---

## 4. Priority Summary

| Priority | Issue |
|---|---|
| CRITICAL | `<Helmet>` never rendered — all pages missing title + meta description |
| CRITICAL | `index.html` title was "client" (fixed in this branch) |
| HIGH | `/contact` page is a placeholder with no real content |
| HIGH | `ServiceDetail.jsx` is empty and has no route in `App.jsx` |
| HIGH | About H1 is too generic ("About") |
| HIGH | Reviews use placeholder/fake data and lack Review schema |
| HIGH | Contact page not linked in Navbar |
| MEDIUM | Gallery API hardcoded to `localhost:5000` |
| MEDIUM | Gallery image alt fallback too generic ("Project Image") |
| MEDIUM | No `robots.txt` |
| MEDIUM | No `sitemap.xml` |
| LOW | No JSON-LD structured data (LocalBusiness, Review schema) |
| LOW | Footer social links are placeholder `#` |
| LOW | No canonical tags on any page |

---

## 5. What Was Fixed in This Branch

1. **`client/index.html` title** — Changed from `"client"` to `"JM Comfort | HVAC Services in Sacramento, CA"`.
2. **`client/index.html` favicon** — Changed from `vite.svg` to `logo.png`.

These are the only low-risk, audit-appropriate fixes made. All other items are documented above for implementation in follow-up tickets.
