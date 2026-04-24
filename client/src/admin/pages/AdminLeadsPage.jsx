import { useState, useEffect, useCallback } from "react";
import { LuChevronLeft, LuChevronRight, LuSearch, LuInbox } from "react-icons/lu";
import {
  PageHeader,
  Table,
  TH,
  TD,
  Pill,
  Button,
  Field,
  inputClass,
  ErrorBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";
const PAGE_SIZE = 25;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatPreferredDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_TONE = {
  new: "blue",
  reviewed: "yellow",
  closed: "slate",
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "closed", label: "Closed" },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", String(page * PAGE_SIZE));

      const res = await fetch(
        `${API_BASE}/api/leads/admin/leads?${params.toString()}`,
        { headers: { "x-admin-key": ADMIN_KEY } }
      );
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      setError(err.message || "Could not load leads");
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const hasMore = leads.length === PAGE_SIZE;

  const filteredLeads = query.trim()
    ? leads.filter((lead) => {
        const q = query.toLowerCase();
        const name =
          lead.name ||
          [lead.first_name, lead.last_name].filter(Boolean).join(" ");
        return (
          (name && name.toLowerCase().includes(q)) ||
          (lead.email && lead.email.toLowerCase().includes(q)) ||
          (lead.phone && lead.phone.toLowerCase().includes(q)) ||
          (lead.service_type && lead.service_type.toLowerCase().includes(q))
        );
      })
    : leads;

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Quote requests and contact form submissions from customers."
      />

      <Card className="mb-5 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Status" className="w-full sm:w-auto">
            <select
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value);
              }}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Search" className="flex-1">
            <div className="relative">
              <LuSearch
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, phone, service..."
                className={`${inputClass} pl-9`}
              />
            </div>
          </Field>
        </div>
      </Card>

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchLeads}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading leads...
          </div>
        </Card>
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          icon={<LuInbox size={22} />}
          title="No leads yet"
          description={
            query || status
              ? "Try clearing filters to see all leads."
              : "Once customers submit the contact or quote form, they'll appear here."
          }
        />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <TH>Name</TH>
                <TH>Email</TH>
                <TH>Phone</TH>
                <TH>Type</TH>
                <TH>Address</TH>
                <TH>Preferred</TH>
                <TH>Status</TH>
                <TH>Submitted</TH>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const name =
                  lead.name ||
                  [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
                  "—";
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <TD className="font-medium text-gray-900">{name}</TD>
                    <TD>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-gray-700 hover:text-gray-900 hover:underline"
                      >
                        {lead.email}
                      </a>
                    </TD>
                    <TD>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="text-gray-700 hover:text-gray-900 hover:underline"
                        >
                          {lead.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </TD>
                    <TD>
                      <Pill tone={lead.lead_type === "quote" ? "purple" : "blue"}>
                        {lead.lead_type}
                      </Pill>
                    </TD>
                    <TD className="max-w-[220px]">
                      <span className="block truncate">{lead.address || "—"}</span>
                    </TD>
                    <TD className="whitespace-nowrap">
                      <span>{formatPreferredDate(lead.preferred_date)}</span>
                      {lead.preferred_time_slot && (
                        <span className="block text-xs text-gray-400">
                          {lead.preferred_time_slot}
                        </span>
                      )}
                    </TD>
                    <TD>
                      <Pill tone={STATUS_TONE[lead.status] || "gray"}>
                        {lead.status || "new"}
                      </Pill>
                    </TD>
                    <TD className="whitespace-nowrap text-gray-500">
                      {formatDate(lead.created_at)}
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-gray-500">
              Page {page + 1} · {filteredLeads.length}{" "}
              {filteredLeads.length === 1 ? "lead" : "leads"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<LuChevronLeft size={14} />}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<LuChevronRight size={14} />}
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasMore}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
