# Sentry Monitoring Setup and Triage Workflow

## Overview

JM Comfort uses Sentry for error monitoring on both the React frontend and Express backend.

## Where the Integration Lives

| Component | File | Purpose |
|-----------|------|---------|
| Client init | `client/src/sentry.js` | Initializes `@sentry/react` with DSN, environment, release, and browser tracing |
| Client entry | `client/src/main.jsx` | Calls `initSentry()` before rendering; wraps `<App>` in `<ErrorBoundary>` |
| Error boundary | `client/src/components/ErrorBoundary.jsx` | Catches React render errors, reports to Sentry, shows fallback UI |
| Manual capture | `client/src/utils/captureError.js` | `captureError()` and `captureMessage()` helpers for handled exceptions |
| Server init | `server/config/sentry.js` | Initializes `@sentry/node` with DSN, environment, release; sets up Express error handler |
| Server entry | `server/index.js` | Calls `initSentry(app)` after routes, before global error handler |
| Test routes | `server/routes/sentryTest.js` | `/api/sentry/test-error` and `/api/sentry/test-ok` for verification |
| Test page | `client/src/pages/SentryTestPage.jsx` | UI at `/sentry-test` to trigger test errors |

## Environment Variables

Add these to your `.env` file (see `.env.example`):

```
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_ENVIRONMENT="development"     # or staging, production
SENTRY_RELEASE=""                    # optional, e.g. git SHA

VITE_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
VITE_SENTRY_ENVIRONMENT="development"
VITE_SENTRY_RELEASE=""
```

If DSN is not set, Sentry is disabled and the app runs normally.

## Setup for New Developers

1. Get the Sentry DSN from the project admin
2. Add DSN values to your local `.env`
3. Start the app normally (`npm run dev` in both client and server)
4. Navigate to `/sentry-test` and trigger a test error
5. Confirm the event appears in Sentry dashboard

## Triage Workflow

### 1. Acknowledge

- When a new Sentry alert arrives, assign it to yourself in the Sentry dashboard
- Change the issue status from **Unresolved** to **Ongoing**

### 2. Assess

- Check the stack trace and error context
- Check the environment tag (production vs development)
- Check how many users are affected (Events and Users count)
- Determine severity: critical (app crash), high (feature broken), low (cosmetic)

### 3. Reproduce

- Use the stack trace and breadcrumbs to identify the failing code path
- Reproduce locally using the same steps or test routes
- For frontend errors, check the component stack in Sentry

### 4. Fix

- Create a branch for the fix
- Write a test that reproduces the error if possible
- Deploy the fix

### 5. Verify

- After deploying, mark the Sentry issue as **Resolved**
- Monitor for regressions (Sentry will reopen if the same error recurs)

## Reproducing the Test Event

1. Start the client and server locally
2. Navigate to `http://localhost:5173/sentry-test`
3. Click **"Trigger React Render Error"** for a frontend error
4. Click **"Trigger Server API Error"** for a backend error
5. Check Sentry dashboard for the new events
6. Verify stack trace, environment, and release tags are correct

See `docs/sentry-verification.md` for the full verification checklist.
