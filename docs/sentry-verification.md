# Sentry Event Capture Verification

## Prerequisites

1. Sentry project created at https://sentry.io
2. DSN values set in `.env`:
   ```
   SENTRY_DSN="https://your-dsn@sentry.io/project-id"
   VITE_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
   SENTRY_ENVIRONMENT="development"
   VITE_SENTRY_ENVIRONMENT="development"
   ```
3. Both client and server running locally

## Verification Steps

### 1. Frontend Error (React render crash)

- Navigate to `http://localhost:5173/sentry-test`
- Click **"Trigger React Render Error"**
- The error boundary fallback should appear
- In Sentry, confirm a new event with:
  - Error message: `Sentry test error from React render`
  - Stack trace pointing to `SentryTestPage.jsx`
  - Environment tag matching `VITE_SENTRY_ENVIRONMENT`
  - Release tag matching `VITE_SENTRY_RELEASE` (if set)

### 2. Backend Error (Express route)

- Navigate to `http://localhost:5173/sentry-test`
- Click **"Trigger Server API Error"**
- Response should show status 500
- In Sentry, confirm a new event with:
  - Error message: `Sentry test error from Express server`
  - Stack trace pointing to `server/routes/sentryTest.js`
  - Environment tag matching `SENTRY_ENVIRONMENT`

### 3. Confirm OK Route

- Click **"Test OK Route"**
- Should display `{"status":"ok","message":"Sentry test route is working"}`
- No new error events in Sentry

## Alerting Verification (Sentry UI)

1. Go to **Alerts** in your Sentry project
2. Confirm a default alert rule exists (created automatically for new projects)
3. If no alert rule exists, create one:
   - **When:** A new issue is created
   - **Then:** Send notification to project members
4. Trigger a test error and confirm you receive the alert notification

## Checklist

- [ ] Frontend render error appears in Sentry with stack trace
- [ ] Backend error appears in Sentry with stack trace
- [ ] Environment tags are correct
- [ ] Release tags are present (if configured)
- [ ] Alert notification received for new issues
