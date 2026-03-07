# Functional Test Coverage Matrix

**Project:** JM Comfort (Kuorbit)
**Date:** 2026-03-06
**Branch:** JMHABIBI-177-define-test-coverage-matrix

---

## Public Pages

### 1. Home Page (`/`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| H-01 | Page Load | Positive | Navigate to `/` | Home page renders with hero banner, customer reviews, why-choose-us section, and CTA floating button |
| H-02 | Page Load | Negative | Navigate to `/` with JavaScript disabled | Page content is not visible; user sees blank or fallback content |
| H-03 | Hero Banner | Positive | View hero banner section | Hero banner displays with correct imagery, heading text, and call-to-action button |
| H-04 | Hero Banner CTA | Positive | Click the hero banner call-to-action button | User is navigated to the request quote or contact page |
| H-05 | Customer Reviews | Positive | Scroll to reviews section | Customer reviews section renders with review cards and ratings |
| H-06 | Why Choose Us | Positive | Scroll to why-choose-us section | Feature cards display with correct icons and descriptions |
| H-07 | CTA Floating Button | Positive | Scroll down the page | Floating CTA button remains visible and clickable |
| H-08 | CTA Floating Button | Negative | Click CTA button when target page is unavailable | User sees an error or is redirected gracefully |
| H-09 | Footer | Positive | Scroll to bottom of page | Footer displays with contact info and business hours |
| H-10 | Navbar | Positive | View top of page | Navbar renders with links to all public pages |

---

### 2. About Page (`/about`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| A-01 | Page Load | Positive | Navigate to `/about` | About page renders with company information |
| A-02 | Page Load | Negative | Navigate to `/about` with a broken route (e.g. `/abou`) | Page does not render; user sees admin not-found or blank page (NOTE: no public 404 page exists) |
| A-03 | Navigation | Positive | Click "About" link in navbar | User is navigated to the about page |

---

### 3. Services Page (`/services`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| S-01 | Page Load | Positive | Navigate to `/services` | Services overview page renders with list of available services |
| S-02 | Service Cards | Positive | View service cards | Each service displays a title, description, and relevant details |
| S-03 | Service Cards | Negative | Services data fails to load from backend | Page displays an error state or empty state message |
| S-04 | Navigation | Positive | Click a service card or detail link | User is navigated to the corresponding service detail view |

---

### 4. Service Detail Page (dynamic route)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| SD-01 | Page Load | Positive | Navigate to a valid service detail URL | Service detail page renders with full service information |
| SD-02 | Page Load | Negative | Navigate to a service detail URL with an invalid or nonexistent service ID | Page displays an error or not-found message |

---

### 5. Contact Page (`/contact`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| C-01 | Page Load | Positive | Navigate to `/contact` | Contact page renders with the contact form |
| C-02 | Form Submission | Positive | Fill in all required fields (name, email, message) and submit | Success message appears: "Thanks! Your message has been submitted." |
| C-03 | Form Validation - Empty Fields | Negative | Submit form with all fields empty | Validation errors appear for name, email, and message fields |
| C-04 | Form Validation - Invalid Email | Negative | Enter an invalid email format (e.g. "notanemail") and submit | Validation error appears: "Enter a valid email." |
| C-05 | Form Validation - Invalid Phone | Negative | Enter an invalid phone number (e.g. "abc") with valid required fields | Validation error appears: "Invalid phone." |
| C-06 | Form - Optional Phone | Positive | Submit form with valid required fields and empty phone field | Form submits successfully without phone validation error |
| C-07 | Form - Button State | Positive | Fill in all required fields correctly | Submit button becomes enabled (no longer grayed out) |
| C-08 | Form - Button State | Negative | Leave required fields empty | Submit button remains disabled and shows cursor-not-allowed |
| C-09 | Form - Sending State | Positive | Click submit with valid data | Button text changes to "Sending..." while request is in progress |

---

### 6. Request Quote Page (`/request-quote`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| RQ-01 | Page Load | Positive | Navigate to `/request-quote` | Request quote page renders with a quote request form |
| RQ-02 | Form Submission | Positive | Fill in all required fields and submit | User is redirected to confirmation page or sees success feedback |
| RQ-03 | Form Submission | Negative | Submit form with missing required fields | Validation errors are displayed for each missing field |
| RQ-04 | Form Submission | Negative | Backend is unreachable during form submission | User sees a connection error message |

---

### 7. Confirmation Page (`/confirmation`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| CF-01 | Page Load | Positive | Navigate to `/confirmation` after successful quote submission | Confirmation message displays indicating submission was received |
| CF-02 | Page Load | Negative | Navigate directly to `/confirmation` without prior submission | Page still renders (NOTE: may need guard logic in the future) |

---

### 8. Reviews Page (`/reviews`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| R-01 | Page Load | Positive | Navigate to `/reviews` | Reviews page renders with customer review entries |
| R-02 | Reviews Display | Positive | Reviews data loads successfully | All review cards display with name, rating, and review text |
| R-03 | Reviews Display | Negative | Reviews data fails to load | Page shows an error state or empty state message |

---

### 9. Gallery Page (`/gallery`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| G-01 | Page Load | Positive | Navigate to `/gallery` | Gallery page renders with project images |
| G-02 | Image Display | Positive | Images load successfully from backend | All gallery images display in a grid or layout |
| G-03 | Image Display | Negative | Image files fail to load (broken URLs or backend down) | Broken image placeholders or error message is shown |

---

## Authentication

### 10. Admin Login (`/admin/login`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AL-01 | Page Load | Positive | Navigate to `/admin/login` | Login form renders with email and password fields |
| AL-02 | Login | Positive | Enter valid admin credentials and submit | User is authenticated and redirected to `/admin/dashboard` |
| AL-03 | Login | Negative | Enter invalid credentials and submit | Error message appears indicating invalid login |
| AL-04 | Login | Negative | Submit login form with empty fields | Validation errors are displayed |
| AL-05 | Auth Redirect | Positive | Authenticated user navigates to `/admin/login` | User is redirected to the admin dashboard (if PublicRoute guard is active) |

---

### 11. Protected Route Guard

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| PR-01 | Auth Check | Positive | Authenticated user accesses a protected admin route | Page renders normally within AdminLayout |
| PR-02 | Auth Check | Negative | Unauthenticated user accesses a protected admin route (e.g. `/admin/dashboard`) | User is redirected to `/admin/login` |
| PR-03 | Token Expiry | Negative | User session token expires while on an admin page | On next navigation, user is redirected to login |

---

## Admin Pages (Protected)

### 12. Admin Dashboard (`/admin/dashboard`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AD-01 | Page Load | Positive | Navigate to `/admin/dashboard` while authenticated | Dashboard renders with greeting showing admin email and navigation cards for Leads, Gallery Upload, Projects, Appointments, and Services |
| AD-02 | Navigation Cards | Positive | Click "Leads" card | User is navigated to `/admin/leads` |
| AD-03 | Navigation Cards | Positive | Click "Gallery Upload" card | User is navigated to `/admin/upload` |
| AD-04 | Navigation Cards | Positive | Click "Projects" card | User is navigated to `/admin/projects` |
| AD-05 | Navigation Cards | Positive | Click "Appointments" card | User is navigated to `/admin/appointments` |
| AD-06 | Navigation Cards | Positive | Click "Services" card | User is navigated to `/admin/services` |
| AD-07 | Admin Redirect | Positive | Navigate to `/admin` | User is redirected to `/admin/dashboard` |

---

### 13. Admin Leads Page (`/admin/leads`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| LE-01 | Page Load | Positive | Navigate to `/admin/leads` | Leads page renders with a table of leads and status badges |
| LE-02 | Leads Table | Positive | Leads data loads from backend | Table displays lead entries with relevant columns |
| LE-03 | Leads Table | Negative | Backend fails to return leads data | Error message or empty state is displayed |
| LE-04 | Status Badge | Positive | View a lead with a specific status | Correct status badge color and label is shown |

---

### 14. Admin Gallery Upload (`/admin/upload`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| GU-01 | Page Load | Positive | Navigate to `/admin/upload` | Upload page renders with file input and upload button |
| GU-02 | File Selection | Positive | Select valid image files (JPG, PNG, WEBP under 5MB) | Files appear in the selected files list with no validation errors |
| GU-03 | File Validation | Negative | Select a file with an unsupported extension (e.g. `.gif`, `.bmp`) | Validation error appears indicating the file type is not allowed |
| GU-04 | File Validation | Negative | Select a file exceeding 5MB | Validation error appears indicating the file exceeds the size limit |
| GU-05 | Upload | Positive | Click upload with valid files selected | Files upload successfully; success message shows count of uploaded images |
| GU-06 | Upload | Negative | Click upload when backend server is unreachable | Error message appears: "Could not connect to server" |
| GU-07 | Upload Button State | Negative | No files are selected | Upload button is disabled with reduced opacity |
| GU-08 | Partial Upload Failure | Negative | Some files succeed and some fail during upload | Success count and failure details are both displayed |

---

### 15. Admin Projects Page (`/admin/projects`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AP-01 | Page Load | Positive | Navigate to `/admin/projects` | Projects management page renders with project data |
| AP-02 | Projects Data | Negative | Backend fails to return project data | Error message or empty state is displayed |

---

### 16. Admin Appointments Page (`/admin/appointments`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AA-01 | Page Load | Positive | Navigate to `/admin/appointments` | Appointments management page renders with appointment data |
| AA-02 | Appointments Data | Negative | Backend fails to return appointment data | Error message or empty state is displayed |

---

### 17. Admin Services Page (`/admin/services`)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AS-01 | Page Load | Positive | Navigate to `/admin/services` | Services management page renders with editable service data |
| AS-02 | Services Data | Negative | Backend fails to return services data | Error message or empty state is displayed |

---

### 18. Admin Not Found (`/admin/*` unknown routes)

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| AN-01 | Unknown Route | Positive | Navigate to an unknown admin route (e.g. `/admin/xyz`) while authenticated | Admin not-found page renders with a message indicating the page does not exist |
| AN-02 | Unknown Route | Negative | Navigate to an unknown admin route while unauthenticated | User is redirected to `/admin/login` before seeing the not-found page |

---

## Shared Components

### 19. Navbar

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| NV-01 | Rendering | Positive | Load any public page | Navbar renders with navigation links |
| NV-02 | Active Link | Positive | Navigate to a page | Corresponding navbar link shows active styling |
| NV-03 | Admin Pages | Negative | Load an admin page | Navbar is not displayed (admin uses AdminSidebar) |

---

### 20. Footer

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| FT-01 | Rendering | Positive | Load any public page | Footer renders with contact information and business hours |
| FT-02 | Admin Pages | Negative | Load an admin page | Footer is not displayed |

---

### 21. Admin Sidebar

| ID | Feature | Test Type | Scenario | Expected Result |
|----|---------|-----------|----------|-----------------|
| SB-01 | Rendering | Positive | Load any protected admin page | Admin sidebar renders with navigation links |
| SB-02 | Navigation | Positive | Click a sidebar link | User is navigated to the corresponding admin page |
| SB-03 | Logout | Positive | Click the logout button or link | User is logged out and redirected to `/admin/login` |

---

## Summary

| Category | Total Test Cases | Positive | Negative |
|----------|-----------------|----------|----------|
| Home Page | 10 | 7 | 3 |
| About Page | 3 | 2 | 1 |
| Services Page | 4 | 2 | 2 |
| Service Detail | 2 | 1 | 1 |
| Contact Page | 9 | 5 | 4 |
| Request Quote | 4 | 2 | 2 |
| Confirmation Page | 2 | 1 | 1 |
| Reviews Page | 3 | 2 | 1 |
| Gallery Page | 3 | 2 | 1 |
| Admin Login | 5 | 2 | 3 |
| Protected Route Guard | 3 | 1 | 2 |
| Admin Dashboard | 7 | 7 | 0 |
| Admin Leads | 4 | 2 | 2 |
| Admin Gallery Upload | 8 | 3 | 5 |
| Admin Projects | 2 | 1 | 1 |
| Admin Appointments | 2 | 1 | 1 |
| Admin Services | 2 | 1 | 1 |
| Admin Not Found | 2 | 1 | 1 |
| Navbar | 3 | 2 | 1 |
| Footer | 2 | 1 | 1 |
| Admin Sidebar | 3 | 3 | 0 |
| **Total** | **83** | **49** | **34** |
