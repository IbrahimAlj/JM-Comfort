import { useState } from 'react';

export default function SentryTestPage() {
  const [renderError, setRenderError] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  if (renderError) {
    throw new Error('Sentry test error from React render');
  }

  async function triggerApiError() {
    try {
      const res = await fetch('http://localhost:5000/api/sentry/test-error');
      const data = await res.json().catch(() => null);
      setApiResult(data ? JSON.stringify(data) : `Status: ${res.status}`);
    } catch (err) {
      setApiResult(`Network error: ${err.message}`);
    }
  }

  async function triggerApiOk() {
    try {
      const res = await fetch('http://localhost:5000/api/sentry/test-ok');
      const data = await res.json();
      setApiResult(JSON.stringify(data));
    } catch (err) {
      setApiResult(`Network error: ${err.message}`);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Sentry Verification</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        Use these buttons to trigger test errors and verify they appear in Sentry.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => setRenderError(true)}
          style={{ padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Trigger React Render Error
        </button>

        <button
          onClick={triggerApiError}
          style={{ padding: '10px 20px', background: '#ea580c', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Trigger Server API Error
        </button>

        <button
          onClick={triggerApiOk}
          style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Test OK Route
        </button>
      </div>

      {apiResult && (
        <pre style={{ marginTop: 20, padding: 12, background: '#f3f4f6', borderRadius: 6, fontSize: 13, overflowX: 'auto' }}>
          {apiResult}
        </pre>
      )}

      <div style={{ marginTop: 30, padding: 16, background: '#fefce8', borderRadius: 8, fontSize: 14 }}>
        <h3 style={{ margin: '0 0 8px 0' }}>Verification Steps</h3>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>Ensure SENTRY_DSN and VITE_SENTRY_DSN are set in .env</li>
          <li>Click "Trigger React Render Error" — confirm event in Sentry with React stack trace</li>
          <li>Click "Trigger Server API Error" — confirm event in Sentry with Express stack trace</li>
          <li>In Sentry, verify environment and release tags match your .env values</li>
          <li>Click "Test OK Route" to confirm the non-error path works</li>
        </ol>
      </div>
    </div>
  );
}
