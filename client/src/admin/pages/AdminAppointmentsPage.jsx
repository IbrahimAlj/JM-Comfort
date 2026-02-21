import { useState, useEffect } from "react";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-gray-100 text-gray-500",
  no_show: "bg-orange-100 text-orange-800",
};

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
      setActionError((prev) => ({
        ...prev,
        [id]: err.message || "Failed to approve",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function handleReject(id) {
    const reason = rejectionReasons[id]?.trim();
    if (!reason) {
      setActionError((prev) => ({
        ...prev,
        [id]: "Rejection reason is required",
      }));
      return;
    }
    setActionLoading((prev) => ({ ...prev, [id]: "reject" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`/api/appointments/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved_by: "admin",
          rejection_reason: reason,
        }),
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
      setActionError((prev) => ({
        ...prev,
        [id]: err.message || "Failed to reject",
      }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Appointments</h1>
        <p className="text-gray-500">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Appointments</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
        <button
          onClick={fetchAppointments}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appt.customer_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appt.customer_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(appt.scheduled_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {appt.project_name || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        STATUS_STYLES[appt.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {appt.status === "pending" && !actioned[appt.id] ? (
                      <div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(appt.id)}
                            disabled={!!actionLoading[appt.id]}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading[appt.id] === "approve"
                              ? "Approving..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() =>
                              setShowRejectForm((prev) => ({
                                ...prev,
                                [appt.id]: !prev[appt.id],
                              }))
                            }
                            disabled={!!actionLoading[appt.id]}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </div>
                        {showRejectForm[appt.id] && (
                          <div className="mt-2">
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
                              className="block w-full rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                            <button
                              onClick={() => handleReject(appt.id)}
                              disabled={!!actionLoading[appt.id]}
                              className="mt-1 px-3 py-1 bg-red-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading[appt.id] === "reject"
                                ? "Rejecting..."
                                : "Confirm Reject"}
                            </button>
                          </div>
                        )}
                        {actionError[appt.id] && (
                          <p className="mt-1 text-xs text-red-600">
                            {actionError[appt.id]}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        {actioned[appt.id]
                          ? "Action completed"
                          : "No actions available"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
