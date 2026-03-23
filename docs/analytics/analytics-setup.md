# Analytics Setup Notes

## Overview
Google Analytics 4 (GA4) is integrated into the JM Comfort website using the `react-ga4` package.

## Setup
1. Install package: `npm install react-ga4 --legacy-peer-deps`
2. Add your GA4 Measurement ID to `client/.env`:
```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```
3. Get the real Measurement ID from Ibrahim Aljanabi (project reporter)

## How It Works
- **Page views** — tracked automatically on every route change via `GATracker` component in `App.jsx`
- **CTA clicks** — tracked in `CallToActionBanner.jsx` when user clicks "Request a Quote Today!"
- **Contact form** — tracked in `ContactForm.jsx` when user successfully submits the form

## Files Modified
- `client/src/App.jsx` — GA initialization + GATracker component
- `client/src/utils/analytics.js` — reusable trackEvent helper
- `client/src/components/CallToActionBanner.jsx` — CTA click tracking
- `client/src/components/ContactForm.jsx` — form submission tracking

## To Add More Events
Use the `trackEvent` helper from `analytics.js`:
```js
import { trackEvent } from '../utils/analytics';
trackEvent('event_name', { param: 'value' });
```

## Verification
To verify events are firing, check browser console for `[GA Event]` logs during development.
Once real GA ID is added, verify in GA4 Realtime dashboard.