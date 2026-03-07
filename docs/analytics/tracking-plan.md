# Google Analytics Tracking Plan
**Project:** JM Comfort HVAC Website  
**Version:** 1.0  
**Date:** March 5, 2026  
**Author:** Faizan Tariq

---

## Overview
This document defines all user interactions and events to be tracked using Google Analytics 4 (GA4) for the JM Comfort website.

## Tracking Objectives
- Understand user journey and behavior
- Measure conversion funnel effectiveness
- Identify popular services and content
- Track form submissions and quote requests
- Measure CTA (Call-to-Action) performance

---

## 1. Page Views

### Automatic Page Tracking
All page views will be automatically tracked by GA4.

**Key Pages to Monitor:**
- `/` - Homepage
- `/services` - Services overview
- `/services/hvac-repair` - Service detail page
- `/services/hvac-maintenance` - Service detail page
- `/services/hvac-installation` - Service detail page
- `/about` - About page
- `/contact` - Contact page
- `/request-quote` - Quote request page
- `/reviews` - Reviews page
- `/confirmation` - Form submission confirmation

**Parameters Tracked:**
- `page_location` - Full URL
- `page_title` - Page title
- `page_referrer` - Previous page

---

## 2. Form Submissions

### 2.1 Contact Form Submission
**Event Name:** `contact_form_submit`

**Trigger:** When user submits the contact form

**Parameters:**
- `form_name`: "contact_form"
- `form_location`: Page URL where form was submitted
- `user_type`: "new" or "returning" (optional)

**Success Criteria:** Form validation passes and submission is successful

---

### 2.2 Quote Request Form Submission
**Event Name:** `quote_request_submit`

**Trigger:** When user submits a service quote request

**Parameters:**
- `form_name`: "quote_request_form"
- `service_type`: Selected service (e.g., "HVAC Repair", "Installation")
- `form_location`: Page URL
- `quote_value`: Estimated service value (if available)

**Success Criteria:** Form data sent successfully

---

### 2.3 Schedule Service Form Submission
**Event Name:** `schedule_service_submit`

**Trigger:** When user schedules a service appointment

**Parameters:**
- `form_name`: "schedule_service_form"
- `service_type`: Selected service
- `appointment_date`: Requested date
- `form_location`: Page URL

**Success Criteria:** Appointment request submitted

---

## 3. Call-to-Action (CTA) Clicks

### 3.1 Primary CTA Buttons
**Event Name:** `cta_click`

**Triggers:**
- "Book This Service" button clicks
- "Contact Us" button clicks
- "Request Quote" button clicks
- "Get a Free Consultation" button clicks
- "View Our Services" button clicks

**Parameters:**
- `cta_text`: Button text (e.g., "Book This Service")
- `cta_location`: Section of page (e.g., "hero", "service_detail", "footer")
- `page_location`: Current page URL
- `destination_url`: Where button navigates to

---

### 3.2 Phone Number Clicks
**Event Name:** `phone_click`

**Trigger:** When user clicks phone number links

**Parameters:**
- `phone_number`: Phone number clicked
- `click_location`: Where on page (e.g., "header", "footer", "contact_section")

---

### 3.3 Email Link Clicks
**Event Name:** `email_click`

**Trigger:** When user clicks email address links

**Parameters:**
- `email_address`: Email clicked
- `click_location`: Where on page

---

## 4. Service Interactions

### 4.1 Service Card Clicks
**Event Name:** `service_card_click`

**Trigger:** When user clicks on a service card from services overview

**Parameters:**
- `service_name`: Service clicked (e.g., "HVAC Repair")
- `service_slug`: URL slug
- `card_position`: Position in list (1, 2, 3)

---

### 4.2 Service Detail Views
**Event Name:** `service_view`

**Trigger:** When user views a service detail page

**Parameters:**
- `service_name`: Service name
- `service_slug`: URL slug
- `price_starting`: Starting price displayed

---

## 5. Navigation Events

### 5.1 Navigation Menu Clicks
**Event Name:** `nav_click`

**Trigger:** When user clicks navigation menu items

**Parameters:**
- `nav_item`: Menu item text
- `nav_destination`: Destination URL
- `nav_location`: "header" or "footer"

---

### 5.2 Back to Services Click
**Event Name:** `back_navigation`

**Trigger:** When user clicks "Back to Services" on service detail pages

**Parameters:**
- `from_page`: Current page
- `to_page`: Destination

---

## 6. Engagement Events

### 6.1 Scroll Depth
**Event Name:** `scroll`

**Trigger:** Automatically at 25%, 50%, 75%, 90% scroll depth

**Parameters:**
- `percent_scrolled`: Scroll percentage (25, 50, 75, 90)
- `page_location`: Current page URL

---

### 6.2 Video Play (if applicable)
**Event Name:** `video_start`

**Trigger:** When user plays a video

**Parameters:**
- `video_title`: Video title/name
- `video_url`: Video source URL
- `video_provider`: "youtube", "vimeo", or "self-hosted"

---

## 7. Error Tracking

### 7.1 Form Validation Errors
**Event Name:** `form_error`

**Trigger:** When form validation fails

**Parameters:**
- `form_name`: Which form
- `error_type`: Type of error (e.g., "missing_required", "invalid_email")
- `field_name`: Field that has error

---

### 7.2 404 Page Not Found
**Event Name:** `page_not_found`

**Trigger:** When user lands on 404 page

**Parameters:**
- `requested_url`: URL that wasn't found
- `referrer`: Where user came from

---

## 8. Social Media Clicks

### 8.1 Social Media Links
**Event Name:** `social_click`

**Trigger:** When user clicks social media icons

**Parameters:**
- `social_platform`: "facebook", "twitter", "instagram", "linkedin"
- `link_location`: "header", "footer", or page section

---

## 9. Review Interactions

### 9.1 Review Submission
**Event Name:** `review_submit`

**Trigger:** When user submits a review

**Parameters:**
- `rating`: Star rating given
- `review_length`: Character count
- `has_text`: Boolean

---

## 10. File Downloads (if applicable)

### 10.1 PDF/Document Downloads
**Event Name:** `file_download`

**Trigger:** When user downloads files (e.g., service brochures)

**Parameters:**
- `file_name`: Name of downloaded file
- `file_type`: Extension (pdf, docx, etc.)
- `download_location`: Page where download initiated

---

## Event Naming Conventions

**Format:** `category_action`

**Examples:**
- `form_submit`
- `cta_click`
- `service_view`

**Guidelines:**
- Use lowercase with underscores
- Be descriptive but concise
- Be consistent across similar events

---

## Testing & Validation

### Testing Checklist
- [ ] Events fire on staging environment
- [ ] Parameters are captured correctly
- [ ] No duplicate events
- [ ] Events appear in GA4 DebugView
- [ ] Custom dimensions configured if needed

### Tools for Testing
- Google Analytics DebugView
- Google Tag Assistant
- Browser Developer Console
- GA4 Realtime Reports

---

## Implementation Priority

### Phase 1 (MVP - Immediate)
1. Page views (automatic)
2. Contact form submission
3. Quote request submission
4. Primary CTA clicks
5. Phone/email clicks

### Phase 2 (High Priority)
6. Service card clicks
7. Service detail views
8. Navigation clicks
9. Form validation errors

### Phase 3 (Nice to Have)
10. Scroll depth
11. Video engagement
12. Social media clicks
13. Review submissions
14. File downloads

---

## Notes
- All events should include timestamp (automatic in GA4)
- User ID should be tracked when available (post-login features)
- Conversion events to be defined after baseline tracking established
- Privacy compliance: No PII (Personally Identifiable Information) in event parameters

---

## Approval

**Submitted by:** Faizan Tariq  
**Date:** March 5, 2026  
**Status:** Pending Team Review

**Reviewed by:** _______________  
**Date:** _______________  
**Approved:** [ ] Yes [ ] No

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 5, 2026 | Faizan Tariq | Initial tracking plan created |