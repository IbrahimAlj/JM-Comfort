import { useState, useEffect, useCallback } from "react";
import { LuTrash2, LuCalendarClock, LuPlus } from "react-icons/lu";
import {
  PageHeader,
  SectionCard,
  Table,
  TH,
  TD,
  Pill,
  Button,
  Field,
  inputClass,
  ErrorBanner,
  SuccessBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

const EMPTY_FORM = {
  slot_date: "",
  start_time: "",
  end_time: "",
  capacity: "1",
  notes: "",
};

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtTime(t) {
  if (!t) return "";
  const [hh, mm] = String(t).split(":");
  const h = Number(hh);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${ampm}`;
}

export default function AdminAvailabilityPage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [rowLoading, setRowLoading] = useState({});
  const [rowError, setRowError] = useState({});

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/availability/admin`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to load availability");
      const data = await res.json();
      setSlots(data.slots || []);
    } catch (err) {
      setError(err.message || "Could not load availability");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    if (!formData.slot_date) return setFormError("Date is required");
    if (!formData.start_time) return setFormError("Start time is required");
    if (!formData.end_time) return setFormError("End time is required");
    if (formData.end_time <= formData.start_time)
      return setFormError("End time must be after start time");

    setFormLoading(true);
    setFormError("");
    try {
      const res = await fetch(`${API_BASE}/api/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({
          slot_date: formData.slot_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          capacity: Number(formData.capacity) || 1,
          notes: formData.notes.trim() || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.details?.[0] || data?.error || "Failed to create slot"
        );
      }
      setSlots((prev) =>
        [...prev, data.slot].sort((a, b) => {
          if (a.slot_date !== b.slot_date) return a.slot_date < b.slot_date ? -1 : 1;
          return a.start_time < b.start_time ? -1 : 1;
        })
      );
      setFormData(EMPTY_FORM);
      setSuccessMsg("Slot added");
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setFormLoading(false);
    }
  }

  async function toggleActive(slot) {
    setRowLoading((p) => ({ ...p, [slot.id]: "toggle" }));
    setRowError((p) => ({ ...p, [slot.id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/availability/${slot.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": ADMIN_KEY,
        },
        body: JSON.stringify({ is_active: !slot.is_active }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to update slot");
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? data.slot : s)));
    } catch (err) {
      setRowError((p) => ({ ...p, [slot.id]: err.message }));
    } finally {
      setRowLoading((p) => ({ ...p, [slot.id]: null }));
    }
  }

  async function deleteSlot(slot) {
    if (
      !window.confirm(
        `Delete ${fmtDate(slot.slot_date)} ${fmtTime(slot.start_time)}?`
      )
    )
      return;
    setRowLoading((p) => ({ ...p, [slot.id]: "delete" }));
    setRowError((p) => ({ ...p, [slot.id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/availability/${slot.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to delete slot");
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } catch (err) {
      setRowError((p) => ({ ...p, [slot.id]: err.message }));
    } finally {
      setRowLoading((p) => ({ ...p, [slot.id]: null }));
    }
  }

  return (
    <div>
      <PageHeader
        title="Availability"
        subtitle="Configure the time slots customers can pick when requesting a quote. Booking a slot creates a pending appointment."
      />

      {successMsg && (
        <div className="mb-4">
          <SuccessBanner>{successMsg}</SuccessBanner>
        </div>
      )}

      <SectionCard className="mb-6" title="Add a slot">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Date" required>
              <input
                type="date"
                name="slot_date"
                value={formData.slot_date}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
            <Field label="Start time" required>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
            <Field label="End time" required>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
            <Field label="Capacity" hint="How many quote requests can share this slot.">
              <input
                type="number"
                min={1}
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                disabled={formLoading}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={formLoading}
              maxLength={255}
              placeholder="e.g. Holiday hours"
              className={inputClass}
            />
          </Field>

          {formError && <ErrorBanner>{formError}</ErrorBanner>}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={formLoading}
              leftIcon={<LuPlus size={16} />}
            >
              {formLoading ? "Adding..." : "Add slot"}
            </Button>
          </div>
        </form>
      </SectionCard>

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchSlots}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading slots...
          </div>
        </Card>
      ) : slots.length === 0 ? (
        <EmptyState
          icon={<LuCalendarClock size={22} />}
          title="No availability yet"
          description="Add slots above to start accepting quote bookings."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Date</TH>
              <TH>Time</TH>
              <TH>Capacity</TH>
              <TH>Status</TH>
              <TH>Notes</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {slots.map((slot) => {
              const busy = !!rowLoading[slot.id];
              return (
                <tr key={slot.id} className="hover:bg-gray-50">
                  <TD className="whitespace-nowrap font-medium text-gray-900">
                    {fmtDate(slot.slot_date)}
                  </TD>
                  <TD className="whitespace-nowrap text-gray-700">
                    {fmtTime(slot.start_time)} – {fmtTime(slot.end_time)}
                  </TD>
                  <TD className="whitespace-nowrap text-gray-700">
                    {slot.booked_count} / {slot.capacity}
                  </TD>
                  <TD>
                    <div className="flex flex-col gap-1">
                      <Pill tone={slot.is_active ? "green" : "slate"}>
                        {slot.is_active ? "Active" : "Inactive"}
                      </Pill>
                      {slot.is_full && <Pill tone="red">Full</Pill>}
                    </div>
                  </TD>
                  <TD className="max-w-[240px] text-gray-600">{slot.notes || "—"}</TD>
                  <TD>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleActive(slot)}
                        disabled={busy}
                      >
                        {rowLoading[slot.id] === "toggle"
                          ? "Saving..."
                          : slot.is_active
                            ? "Deactivate"
                            : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<LuTrash2 size={14} />}
                        onClick={() => deleteSlot(slot)}
                        disabled={busy}
                        title={
                          slot.booked_count > 0
                            ? "Deactivate instead — this slot already has bookings"
                            : "Delete slot"
                        }
                      >
                        {rowLoading[slot.id] === "delete" ? "..." : "Delete"}
                      </Button>
                    </div>
                    {rowError[slot.id] && (
                      <p className="mt-1 text-right text-xs text-red-600">
                        {rowError[slot.id]}
                      </p>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
