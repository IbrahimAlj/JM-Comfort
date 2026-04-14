# Manual Test Cases - JM Comfort Web Application

**Project:** JM Comfort (HVAC Services)
**Date:** 2026-03-06
**Version:** 1.0
**Ticket:** JMHABIBI-178

---

## Table of Contents

1. [Navigation Flow](#1-navigation-flow)
2. [Request Quote Form Submission](#2-request-quote-form-submission)
3. [Contact Form Submission](#3-contact-form-submission)
4. [Gallery Viewing](#4-gallery-viewing)
5. [Admin Login](#5-admin-login)
6. [Admin Appointments Management](#6-admin-appointments-management)
7. [Admin Projects Management](#7-admin-projects-management)
8. [Admin Services Management](#8-admin-services-management)
9. [Admin Gallery Upload](#9-admin-gallery-upload)
10. [Admin Leads Management](#10-admin-leads-management)

---

## 1. Navigation Flow

### TC-NAV-001: Navbar links navigate to correct pages

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the home page is loaded in the browser. |
| **Priority**     | High |

**Steps:**

1. Open the application in a browser.
2. Observe the navigation bar at the top of the page.
3. Click the "Home" link in the navbar.
4. Verify the home page loads with the hero banner and "Why Choose Us" section.
5. Click the "Services" link in the navbar.
6. Verify the services page loads with a list of HVAC services.
7. Click the "Reviews" link in the navbar.
8. Verify the reviews page loads with customer review cards.
9. Click the "About" link in the navbar.
10. Verify the about page loads with company information.
11. Click the "Gallery" link in the navbar.
12. Verify the gallery page loads with project images.

**Expected Result:** Each navbar link navigates to its corresponding page. The page content loads without errors. The active page is visually indicated in the navbar.

**Pass / Fail:** ___

---

### TC-NAV-002: Logo click returns to home page

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and any page other than home is loaded. |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the Services page using the navbar.
2. Click the JM Comfort logo in the top-left corner of the navbar.
3. Verify the browser navigates back to the home page.

**Expected Result:** Clicking the logo from any page returns the user to the home page.

**Pass / Fail:** ___

---

### TC-NAV-003: Request Quote CTA button in navbar

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the home page is loaded. |
| **Priority**     | High |

**Steps:**

1. Locate the "Request Quote" button in the navbar (dark-colored button on the right side).
2. Click the "Request Quote" button.
3. Verify the browser navigates to the `/request-quote` page.
4. Verify the Request Quote form is displayed.

**Expected Result:** The "Request Quote" button navigates to the quote request form page.

**Pass / Fail:** ___

---

### TC-NAV-004: Floating CTA button visibility and navigation

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the home page.
2. Verify a floating "Request a Quote Today!" button appears in the bottom-right corner of the screen.
3. Click the floating button.
4. Verify the browser navigates to the `/request-quote` page.
5. On the Request Quote page, verify the floating button is NOT visible.
6. Navigate to the About page.
7. Verify the floating button is visible again.

**Expected Result:** The floating CTA button appears on all public pages except the Request Quote page and admin pages. Clicking it navigates to the Request Quote page.

**Pass / Fail:** ___

---

### TC-NAV-005: Footer links and information display

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and any public page is loaded. |
| **Priority**     | Medium |

**Steps:**

1. Scroll to the bottom of any public page.
2. Verify the footer displays the company name "JM Comfort".
3. Verify the footer shows contact information: address (1234 Elm St, Sacramento, CA 95819), phone ((916) 555-1234), and email.
4. Verify operating hours are displayed: Mon-Fri 8 AM - 6 PM, Sat 9 AM - 2 PM, Sun Closed.
5. Verify social media icons (Facebook, Instagram, Twitter) are present.
6. Locate the "Admin Login" link in the footer.
7. Click the "Admin Login" link.
8. Verify the browser navigates to the `/admin/login` page.

**Expected Result:** The footer displays all company information correctly and the Admin Login link navigates to the admin login page.

**Pass / Fail:** ___

---

### TC-NAV-006: Error scenario - Navigate to a non-existent page

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. |
| **Priority**     | Medium |

**Steps:**

1. In the browser address bar, type the application URL followed by `/nonexistent-page` (e.g., `http://localhost:3000/nonexistent-page`).
2. Press Enter.
3. Observe the page that loads.

**Expected Result:** The application displays a 404 or "page not found" message, or redirects to the home page. The application does not crash or show an unhandled error.

> **Note:** If the application does not have a custom 404 page, this should be flagged as a potential improvement. Document the actual behavior observed.

**Pass / Fail:** ___

---

## 2. Request Quote Form Submission

### TC-QUOTE-001: Successful quote request submission

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. The backend server is running and the `/api/appointments` endpoint is available. |
| **Priority**     | Critical |

**Steps:**

1. Navigate to the `/request-quote` page via the navbar or floating CTA button.
2. Verify the form displays four fields: Name, Email, Phone, and Address.
3. Enter a valid name in the Name field (e.g., "John Smith").
4. Enter a valid email in the Email field (e.g., "john@example.com").
5. Enter a valid phone number in the Phone field (e.g., "916-555-0000").
6. Enter a valid address in the Address field (e.g., "123 Main St, Sacramento, CA").
7. Click the "Submit" button.
8. Observe the button text changes to "Submitting..." while the request is in progress.
9. Wait for the submission to complete.

**Expected Result:** A green success alert appears confirming the submission. The form fields are cleared after successful submission. The submit button returns to its normal state.

**Pass / Fail:** ___

---

### TC-QUOTE-002: Validation - Submit with empty required fields

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Request Quote page is loaded. |
| **Priority**     | Critical |

**Steps:**

1. Navigate to the `/request-quote` page.
2. Leave all form fields empty.
3. Click the "Submit" button.
4. Observe the validation messages.

**Expected Result:** The form does not submit. Validation error messages appear indicating that all fields are required. Each empty required field displays a red border or inline error message.

**Pass / Fail:** ___

---

### TC-QUOTE-003: Validation - Invalid email format

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Request Quote page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to the `/request-quote` page.
2. Enter "John Smith" in the Name field.
3. Enter "not-an-email" in the Email field (invalid format, no @ symbol).
4. Enter "916-555-0000" in the Phone field.
5. Enter "123 Main St" in the Address field.
6. Click the "Submit" button.

**Expected Result:** The form does not submit. An error message appears indicating the email format is invalid. The Email field is highlighted with a red border.

**Pass / Fail:** ___

---

### TC-QUOTE-004: Validation - Invalid phone number format

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Request Quote page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to the `/request-quote` page.
2. Enter "John Smith" in the Name field.
3. Enter "john@example.com" in the Email field.
4. Enter "123" in the Phone field (too short, must be 7-20 characters).
5. Enter "123 Main St" in the Address field.
6. Click the "Submit" button.

**Expected Result:** The form does not submit. An error message appears indicating the phone number format is invalid. The Phone field is highlighted with a red border.

**Pass / Fail:** ___

---

### TC-QUOTE-005: Error scenario - Server unavailable during submission

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running but the backend server is stopped or the `/api/appointments` endpoint is unreachable. |
| **Priority**     | High |

**Steps:**

1. Stop the backend server (or disconnect the network).
2. Navigate to the `/request-quote` page.
3. Fill in all fields with valid data.
4. Click the "Submit" button.
5. Wait for the submission attempt to complete.

**Expected Result:** A red error alert appears with a message such as "Something went wrong. Please check your connection and try again." The form data is preserved so the user can retry without re-entering information.

**Pass / Fail:** ___

---

## 3. Contact Form Submission

### TC-CONTACT-001: Successful contact form submission

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Contact page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to the `/contact` page.
2. Locate the contact form.
3. Enter "Jane Doe" in the Name field.
4. Enter "jane@example.com" in the Email field.
5. Optionally enter "916-555-1111" in the Phone field.
6. Enter "I would like information about your HVAC maintenance plans." in the Message field.
7. Click the "Submit" button.

**Expected Result:** A green success banner appears with the message "Thanks! Your message has been submitted." The form fields are cleared after submission.

> **Note:** The contact form currently uses a placeholder backend with a simulated delay. The actual API integration may not be complete. Document the observed behavior.

**Pass / Fail:** ___

---

### TC-CONTACT-002: Validation - Submit with empty required fields

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Contact page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to the `/contact` page.
2. Leave the Name field empty.
3. Leave the Email field empty.
4. Enter "Hello" in the Message field.
5. Click the "Submit" button.

**Expected Result:** The form does not submit. Validation errors appear for the Name and Email fields, indicating they are required.

**Pass / Fail:** ___

---

### TC-CONTACT-003: Validation - Invalid email in contact form

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the Contact page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to the `/contact` page.
2. Enter "Jane Doe" in the Name field.
3. Enter "invalid-email" in the Email field.
4. Enter "Test message" in the Message field.
5. Click the "Submit" button.

**Expected Result:** The form does not submit. An error message appears indicating the email format is invalid.

**Pass / Fail:** ___

---

### TC-CONTACT-004: Error scenario - Contact form with network failure

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. Network connectivity is disrupted or the backend is unavailable. |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the `/contact` page.
2. Open browser developer tools and go to the Network tab.
3. Enable "Offline" mode or disconnect the network.
4. Fill in all required fields with valid data.
5. Click the "Submit" button.
6. Observe the result.

**Expected Result:** An error message is displayed to the user indicating the submission failed. The form data is preserved.

> **Note:** Since the contact form currently uses a placeholder backend, this test may behave differently once the real API is integrated. Document the actual behavior.

**Pass / Fail:** ___

---

## 4. Gallery Viewing

### TC-GAL-001: Gallery page loads and displays images

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. The backend server is running and gallery images exist in the database. |
| **Priority**     | High |

**Steps:**

1. Click the "Gallery" link in the navbar.
2. Wait for the gallery page to load.
3. Verify that project images are displayed in a grid layout.
4. Verify each image has a title or caption.

**Expected Result:** The gallery page loads successfully and displays all available project images in an organized grid. Each image is clearly visible.

**Pass / Fail:** ___

---

### TC-GAL-002: Gallery image modal (lightbox) interaction

| Field           | Value |
|-----------------|-------|
| **Precondition** | Gallery page is loaded and at least one image is displayed. |
| **Priority**     | High |

**Steps:**

1. On the Gallery page, click on any project image.
2. Verify a modal (lightbox) opens displaying the image in a larger view.
3. Click the "X" button or close icon on the modal.
4. Verify the modal closes and the gallery grid is visible again.
5. Click on another image to open the modal again.
6. Click on the dark background area outside the image.
7. Verify the modal closes.

**Expected Result:** Clicking an image opens it in a modal overlay. The modal can be closed by clicking the X button or by clicking the background outside the image.

**Pass / Fail:** ___

---

### TC-GAL-003: Error scenario - Gallery fails to load images

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running but the backend server is stopped or the gallery API endpoint is unavailable. |
| **Priority**     | Medium |

**Steps:**

1. Stop the backend server or block the `/api/projects/gallery` endpoint.
2. Navigate to the Gallery page.
3. Observe the error state.
4. Verify an error message is displayed.
5. If a "Retry" button appears, click it after restarting the backend.

**Expected Result:** The page displays an error message such as "Unable to load gallery images. Please try again later." with a Retry button. Clicking Retry after restoring the backend loads the images successfully.

**Pass / Fail:** ___

---

## 5. Admin Login

### TC-LOGIN-001: Successful admin login

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the admin login page is loaded. |
| **Priority**     | Critical |

**Steps:**

1. Navigate to `/admin/login` (or click the "Admin Login" link in the footer).
2. Verify the login form displays Email and Password fields.
3. Enter "admin@example.com" in the Email field.
4. Enter "password123" in the Password field.
5. Click the "Sign In" button.
6. Observe the button text changes to "Signing in..." during the request.

**Expected Result:** The user is redirected to the `/admin/dashboard` page. The admin dashboard displays navigation cards for Leads, Gallery Upload, Projects, Appointments, and Services.

**Pass / Fail:** ___

---

### TC-LOGIN-002: Validation - Login with invalid credentials

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the admin login page is loaded. |
| **Priority**     | Critical |

**Steps:**

1. Navigate to `/admin/login`.
2. Enter "wrong@example.com" in the Email field.
3. Enter "wrongpassword" in the Password field.
4. Click the "Sign In" button.

**Expected Result:** A red error banner appears indicating the credentials are invalid. The user remains on the login page. The password field is cleared.

**Pass / Fail:** ___

---

### TC-LOGIN-003: Validation - Login with empty fields

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running and the admin login page is loaded. |
| **Priority**     | High |

**Steps:**

1. Navigate to `/admin/login`.
2. Leave both Email and Password fields empty.
3. Click the "Sign In" button.

**Expected Result:** The form does not submit. Validation errors appear indicating that both fields are required.

**Pass / Fail:** ___

---

### TC-LOGIN-004: Error scenario - Access admin page without authentication

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is not logged in (no active admin session). |
| **Priority**     | Critical |

**Steps:**

1. Clear browser cookies and session storage.
2. Navigate directly to `/admin/dashboard` in the browser address bar.
3. Observe the result.
4. Try navigating to `/admin/leads`.
5. Observe the result.

**Expected Result:** The user is redirected to the `/admin/login` page. No admin content is visible without authentication.

**Pass / Fail:** ___

---

### TC-LOGIN-005: Admin logout

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and the dashboard is displayed. |
| **Priority**     | High |

**Steps:**

1. Log in as admin using valid credentials.
2. Verify the admin dashboard is displayed.
3. Locate and click the "Logout" button in the admin sidebar.
4. Observe the result.

**Expected Result:** The user is logged out and redirected to the login page. Attempting to navigate to any admin page redirects back to the login page.

**Pass / Fail:** ___

---

## 6. Admin Appointments Management

### TC-APPT-001: View appointments list

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one appointment exists in the system (submitted via the Request Quote form). |
| **Priority**     | High |

**Steps:**

1. From the admin dashboard, click the "Appointments" card or sidebar link.
2. Wait for the appointments page to load.
3. Verify a table or list of appointments is displayed.
4. Verify each appointment shows the customer name, email, phone, and status.

**Expected Result:** The appointments page loads and displays all submitted appointments with their details and current status.

**Pass / Fail:** ___

---

### TC-APPT-002: Approve an appointment

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one appointment with "pending" status exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Appointments admin page.
2. Locate an appointment with "pending" status.
3. Click the "Approve" button for that appointment.
4. Observe the status change.

**Expected Result:** The appointment status changes from "pending" to "approved". A success message may appear. The updated status is reflected in the list immediately.

**Pass / Fail:** ___

---

### TC-APPT-003: Reject an appointment with reason

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one appointment with "pending" status exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Appointments admin page.
2. Locate an appointment with "pending" status.
3. Click the "Reject" button for that appointment.
4. Verify an input field or form appears requesting a rejection reason.
5. Enter a reason such as "Service area not covered."
6. Confirm the rejection.

**Expected Result:** The appointment status changes from "pending" to "rejected". The rejection reason is saved and visible. A success message may appear.

**Pass / Fail:** ___

---

### TC-APPT-004: Error scenario - Appointments page fails to load

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. The backend API for appointments is unreachable. |
| **Priority**     | Medium |

**Steps:**

1. Stop the backend server or block the appointments API endpoint.
2. Navigate to the Appointments admin page.
3. Observe the error state.

**Expected Result:** An error banner is displayed with a message indicating the data could not be loaded. A "Retry" button is available. The page does not crash.

**Pass / Fail:** ___

---

### TC-APPT-005: Validation - Empty appointments list

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. No appointments exist in the system. |
| **Priority**     | Low |

**Steps:**

1. Navigate to the Appointments admin page.
2. Observe the page when no appointments exist.

**Expected Result:** The page displays a message such as "No appointments found" instead of an empty table or error.

**Pass / Fail:** ___

---

## 7. Admin Projects Management

### TC-PROJ-001: Create a new project

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Projects admin page. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Projects admin page from the dashboard or sidebar.
2. Locate the project creation form.
3. Enter "New HVAC Installation" in the Project Name field.
4. Enter a Customer ID value.
5. Select "planned" from the Status dropdown.
6. Enter a Start Date.
7. Enter an End Date after the Start Date.
8. Click the "Create" or "Submit" button.

**Expected Result:** The new project appears in the projects table with the entered details. A success message is displayed.

**Pass / Fail:** ___

---

### TC-PROJ-002: Edit an existing project

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one project exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Projects admin page.
2. Locate an existing project in the table.
3. Click the "Edit" button for that project.
4. Verify the form fields populate with the existing project data.
5. Change the Status to "in_progress".
6. Click "Save" or "Update".

**Expected Result:** The project is updated with the new status. The updated information is reflected in the table. A success message is displayed.

**Pass / Fail:** ___

---

### TC-PROJ-003: Delete a project

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one project exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Projects admin page.
2. Locate an existing project in the table.
3. Click the "Delete" button for that project.
4. Verify a confirmation prompt appears (e.g., a "Confirm" button).
5. Click "Confirm" to proceed with deletion.

**Expected Result:** The project is removed from the table. A success message is displayed. The deleted project no longer appears in the list.

**Pass / Fail:** ___

---

### TC-PROJ-004: Validation - Create project with missing required fields

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Projects admin page. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Projects admin page.
2. Leave the Project Name field empty.
3. Leave the Customer ID field empty.
4. Click the "Create" or "Submit" button.

**Expected Result:** The form does not submit. Validation errors appear for the Project Name and Customer ID fields, indicating they are required.

**Pass / Fail:** ___

---

### TC-PROJ-005: Error scenario - Project creation fails due to server error

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. The backend server is stopped or the projects API is unreachable. |
| **Priority**     | Medium |

**Steps:**

1. Stop the backend server.
2. On the Projects admin page, fill in all required fields with valid data.
3. Click the "Create" or "Submit" button.

**Expected Result:** An error message appears indicating the project could not be created. The form data is preserved so the user can retry.

**Pass / Fail:** ___

---

## 8. Admin Services Management

### TC-SVC-001: Create a new service

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Services admin page. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Services admin page from the dashboard or sidebar.
2. Locate the service creation form.
3. Enter "Emergency HVAC Repair" in the Title field.
4. Enter "24/7 emergency repair service for heating and cooling systems." in the Description field.
5. Enter "199.99" in the Price field.
6. Click the "Create" or "Submit" button.

**Expected Result:** The new service appears in the services table with the entered details. A success message is displayed.

**Pass / Fail:** ___

---

### TC-SVC-002: Edit an existing service

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one service exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Services admin page.
2. Locate an existing service in the table.
3. Click the "Edit" button for that service.
4. Change the Price to "249.99".
5. Click "Save" or "Update".

**Expected Result:** The service is updated with the new price. The updated information is reflected in the table. A success message is displayed.

**Pass / Fail:** ___

---

### TC-SVC-003: Delete a service

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one service exists. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Services admin page.
2. Locate an existing service in the table.
3. Click the "Delete" button for that service.
4. Verify a confirmation prompt appears.
5. Click "Confirm" to proceed with deletion.

**Expected Result:** The service is removed from the table. A success message is displayed.

**Pass / Fail:** ___

---

### TC-SVC-004: Validation - Create service with missing required fields

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Services admin page. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Services admin page.
2. Leave the Title field empty.
3. Leave the Description field empty.
4. Enter "100" in the Price field.
5. Click the "Create" or "Submit" button.

**Expected Result:** The form does not submit. Validation errors appear for the Title and Description fields, indicating they are required.

**Pass / Fail:** ___

---

### TC-SVC-005: Error scenario - Service deletion fails due to server error

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. The backend server is stopped. At least one service is visible in the table from a previously cached load. |
| **Priority**     | Medium |

**Steps:**

1. Load the Services admin page while the backend is running.
2. Stop the backend server.
3. Click "Delete" on a service and confirm.
4. Observe the result.

**Expected Result:** An error message appears indicating the deletion failed. The service remains in the table.

**Pass / Fail:** ___

---

## 9. Admin Gallery Upload

### TC-UPLOAD-001: Successful image upload

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Gallery Upload page. A valid JPG, PNG, or WEBP image file under 5MB is available on the local machine. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Gallery Upload page from the dashboard or sidebar.
2. Click the file input or "Choose Files" button.
3. Select one or more valid image files (JPG, PNG, or WEBP, each under 5MB).
4. Verify the selected file names are displayed.
5. Click the "Upload" button.
6. Observe the upload progress.

**Expected Result:** The images are uploaded successfully. A success message is displayed showing which files were uploaded. The uploaded images should appear in the public Gallery page.

**Pass / Fail:** ___

---

### TC-UPLOAD-002: Validation - Upload file exceeding size limit

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Gallery Upload page. An image file larger than 5MB is available. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Gallery Upload page.
2. Select an image file that exceeds 5MB.
3. Attempt to upload the file.

**Expected Result:** A validation error appears indicating the file exceeds the maximum allowed size of 5MB. The file is not uploaded.

**Pass / Fail:** ___

---

### TC-UPLOAD-003: Validation - Upload unsupported file type

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin and on the Gallery Upload page. A non-image file (e.g., .pdf, .txt, .gif) is available. |
| **Priority**     | High |

**Steps:**

1. Navigate to the Gallery Upload page.
2. Attempt to select a file with an unsupported format (e.g., a .pdf or .txt file).
3. Observe the result.

**Expected Result:** The file is either not selectable (filtered by the file input) or a validation error appears indicating only JPG, JPEG, PNG, and WEBP files are accepted.

**Pass / Fail:** ___

---

### TC-UPLOAD-004: Error scenario - Upload fails due to server error

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. The backend server or S3 storage is unreachable. |
| **Priority**     | Medium |

**Steps:**

1. Stop the backend server or disconnect S3 storage.
2. Select a valid image file on the Gallery Upload page.
3. Click the "Upload" button.
4. Observe the result.

**Expected Result:** An error message appears indicating the upload failed. The page displays which files failed to upload. The user can retry after restoring connectivity.

**Pass / Fail:** ___

---

### TC-UPLOAD-005: Partial success - Some files upload, some fail

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. Multiple image files are selected, but one or more may cause a server-side failure (e.g., corrupt file or exceeding storage quota). |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the Gallery Upload page.
2. Select multiple image files (mix of valid and potentially problematic files).
3. Click the "Upload" button.
4. Observe the result.

**Expected Result:** The page displays separate lists showing which files uploaded successfully and which files failed. The response status is 207 (partial success). The user can see exactly which files need to be retried.

> **Note:** This scenario may be difficult to reproduce without specific backend conditions. Document the actual behavior observed.

**Pass / Fail:** ___

---

## 10. Admin Leads Management

### TC-LEADS-001: View submitted leads

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. At least one lead exists in the system (submitted via the contact form). |
| **Priority**     | High |

**Steps:**

1. From the admin dashboard, click the "Leads" card or sidebar link.
2. Wait for the leads page to load.
3. Verify a table of leads is displayed.
4. Verify each lead shows the name, email, phone, submission date, and status.

**Expected Result:** The leads page loads and displays all submitted leads with their details in a table format.

**Pass / Fail:** ___

---

### TC-LEADS-002: Leads pagination

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. More leads exist than the default page limit. |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the Leads admin page.
2. Verify the initial set of leads is displayed.
3. If pagination controls exist, click "Next" or page 2.
4. Verify the next set of leads loads.

**Expected Result:** Leads are displayed in paginated format. Navigation between pages works correctly and displays different sets of leads.

> **Note:** If pagination is not yet implemented, document this and note that only the first page of results is shown.

**Pass / Fail:** ___

---

### TC-LEADS-003: Error scenario - Leads page fails to load

| Field           | Value |
|-----------------|-------|
| **Precondition** | The user is logged in as admin. The backend API for leads is unreachable. |
| **Priority**     | Medium |

**Steps:**

1. Stop the backend server.
2. Navigate to the Leads admin page.
3. Observe the error state.

**Expected Result:** An error message is displayed indicating the leads could not be loaded. A "Retry" button is available. The page does not crash.

**Pass / Fail:** ___

---

### TC-LEADS-004: Validation - Duplicate lead submission prevention

| Field           | Value |
|-----------------|-------|
| **Precondition** | Application is running. The contact form is accessible. |
| **Priority**     | Medium |

**Steps:**

1. Navigate to the Contact page.
2. Submit the contact form with specific data (e.g., Name: "Test User", Email: "test@example.com", Message: "Test message").
3. After successful submission, submit the exact same data again.
4. Log in to the admin panel and navigate to the Leads page.
5. Check how many entries exist for "test@example.com".

**Expected Result:** The system detects the duplicate submission using hash-based deduplication. Only one lead entry exists for the duplicate data. The second submission returns a 200 status (already exists) rather than creating a new entry.

**Pass / Fail:** ___

---

## Appendix: Test Environment Setup

| Item | Details |
|------|---------|
| **Frontend URL** | http://localhost:3000 (or deployed Vercel URL) |
| **Backend URL** | http://localhost:5000 (or deployed server URL) |
| **Admin Credentials** | Email: admin@example.com / Password: password123 |
| **Supported Browsers** | Chrome (latest), Firefox (latest), Edge (latest) |
| **Test Data Cleanup** | After testing, remove any test projects, services, and leads created during test execution. |

---

## Test Summary Template

| Section | Total Cases | Passed | Failed | Blocked |
|---------|-------------|--------|--------|---------|
| Navigation Flow | 6 | ___ | ___ | ___ |
| Request Quote Form | 5 | ___ | ___ | ___ |
| Contact Form | 4 | ___ | ___ | ___ |
| Gallery Viewing | 3 | ___ | ___ | ___ |
| Admin Login | 5 | ___ | ___ | ___ |
| Admin Appointments | 5 | ___ | ___ | ___ |
| Admin Projects | 5 | ___ | ___ | ___ |
| Admin Services | 5 | ___ | ___ | ___ |
| Admin Gallery Upload | 5 | ___ | ___ | ___ |
| Admin Leads | 4 | ___ | ___ | ___ |
| **Total** | **47** | ___ | ___ | ___ |
