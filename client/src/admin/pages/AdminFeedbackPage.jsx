import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/feedback`);
      if (!res.ok) throw new Error('Failed to load feedback.');
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      setError(err.message || 'Could not load feedback.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
          Client Feedback
        </h1>
        <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '16px' }}>Loading feedback...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1F2937', margin: '0 0 16px 0' }}>
          Client Feedback
        </h1>
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#DC2626',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
        <button
          onClick={fetchFeedback}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: '#000000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
        Client Feedback
      </h1>
      <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px 0' }}>
        UAT feedback submitted by clients during testing.
      </p>

      {feedback.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#6B7280' }}>No feedback has been submitted yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    width: '1%',
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Feedback
                </th>
                <th
                  style={{
                    padding: '10px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((entry, index) => (
                <tr
                  key={entry.id}
                  style={{
                    borderBottom: '1px solid #E5E7EB',
                    backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB',
                  }}
                >
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#9CA3AF',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                    }}
                  >
                    {entry.id}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#1F2937',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      verticalAlign: 'top',
                    }}
                  >
                    {entry.feedback_text}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'top',
                      fontSize: '13px',
                    }}
                  >
                    {formatDate(entry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '12px' }}>
            {feedback.length} {feedback.length === 1 ? 'entry' : 'entries'} total
          </p>
        </div>
      )}
    </div>
  );
}
