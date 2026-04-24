import { useState, useEffect } from "react";
import { LuCheck, LuX, LuCalendarDays } from "react-icons/lu";
import {
  PageHeader,
  Table,
  TH,
  TD,
  Pill,
  Button,
  inputClass,
  ErrorBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const STATUS_TONE = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
  scheduled: "blue",
  completed: "slate",
  cancelled: "gray",
  no_show: "red",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString();
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});
  const [actioned, setActioned] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [showRejectForm, setShowRejectForm] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Could not load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActionLoading((prev) => ({ ...prev, [id]: "approve" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/appointments/${id}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by: "admin" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to approve appointment");
      }
      const data = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.appointment } : a))
      );
      setActioned((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message || "Failed to approve" }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function handleReject(id) {
    const reason = rejectionReasons[id]?.trim();
    if (!reason) {
      setActionError((prev) => ({ ...prev, [id]: "Rejection reason is required" }));
      return;
    }
    setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/appointments/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by: "admin", rejection_reason: reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to reject appointment");
      }
      const data = await res.json();
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data.appointment } : a))
      );
      setActioned((prev) => ({ ...prev, [id]: true }));
      setShowRejectForm((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message || "Failed to reject" }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Approve or reject booking requests from customers."
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchAppointments}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading appointments...
          </div>
        </Card>
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={<LuCalendarDays size={22} />}
          title="No appointments yet"
          description="Incoming appointment requests will show here."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Customer</TH>
              <TH>Scheduled</TH>
              <TH>Project</TH>
              <TH>Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <TD>
                  <div className="font-medium text-gray-900">{appt.customer_name}</div>
                  <div className="text-xs text-gray-500">{appt.customer_email}</div>
                </TD>
                <TD className="whitespace-nowrap text-gray-600">
                  {formatDate(appt.scheduled_at)}
                </TD>
                <TD className="text-gray-600">{appt.project_name || "—"}</TD>
                <TD>
                  <Pill tone={STATUS_TONE[appt.status] || "gray"}>{appt.status}</Pill>
                </TD>
                <TD>
                  {appt.status === "pending" && !actioned[appt.id] ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          leftIcon={<LuCheck size={14} />}
                          onClick={() => handleApprove(appt.id)}
                          disabled={!!actionLoading[appt.id]}
                        >
                          {actionLoading[appt.id] === "approve" ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<LuX size={14} />}
                          onClick={() =>
                            setShowRejectForm((prev) => ({
                              ...prev,
                              [appt.id]: !prev[appt.id],
                            }))
                          }
                          disabled={!!actionLoading[appt.id]}
                        >
                          Reject
                        </Button>
                      </div>

                      {showRejectForm[appt.id] && (
                        <div className="flex w-full max-w-sm flex-col items-end gap-2">
                          <input
                            type="text"
                            placeholder="Rejection reason"
                            value={rejectionReasons[appt.id] || ""}
                            onChange={(e) =>
                              setRejectionReasons((prev) => ({
                                ...prev,
                                [appt.id]: e.target.value,
                              }))
                            }
                            className={`${inputClass} text-xs`}
                          />
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(appt.id)}
                            disabled={!!actionLoading[appt.id]}
                          >
                            {actionLoading[appt.id] === "reject"
                              ? "Rejecting..."
                              : "Confirm reject"}
                          </Button>
                        </div>
                      )}

                      {actionError[appt.id] && (
                        <p className="text-xs text-red-600">{actionError[appt.id]}</p>
                      )}
                    </div>
                  ) : (
                    <span className="block text-right text-xs text-gray-400">
                      {actioned[appt.id] ? "Action completed" : "No actions"}
                    </span>
                  )}
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
