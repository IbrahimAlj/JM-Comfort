import { useState, useEffect } from "react";
import { LuMessageSquareText } from "react-icons/lu";
import {
  PageHeader,
  Table,
  TH,
  TD,
  ErrorBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const API_BASE = import.meta.env.VITE_API_URL || "";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/feedback`);
      if (!res.ok) throw new Error("Failed to load feedback.");
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      setError(err.message || "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Client Feedback"
        subtitle="UAT feedback submitted by clients during testing."
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchFeedback}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading feedback...
          </div>
        </Card>
      ) : feedback.length === 0 ? (
        <EmptyState
          icon={<LuMessageSquareText size={22} />}
          title="No feedback yet"
          description="When testers submit UAT feedback it will appear here."
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <TH className="w-16">#</TH>
                <TH>Feedback</TH>
                <TH className="whitespace-nowrap">Submitted</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedback.map((entry) => (
                <tr key={entry.id} className="align-top hover:bg-gray-50">
                  <TD className="text-xs text-gray-400">{entry.id}</TD>
                  <TD>
                    <p className="whitespace-pre-wrap break-words text-gray-800">
                      {entry.feedback_text}
                    </p>
                  </TD>
                  <TD className="whitespace-nowrap text-gray-500">
                    {formatDate(entry.created_at)}
                  </TD>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="mt-3 text-xs text-gray-400">
            {feedback.length} {feedback.length === 1 ? "entry" : "entries"} total
          </p>
        </>
      )}
    </div>
  );
}
