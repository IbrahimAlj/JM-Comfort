import { useState, useEffect } from "react";
import {
  LuCalendarDays,
  LuUserPlus,
  LuFolderCheck,
  LuStar,
} from "react-icons/lu";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

const CARDS = [
  {
    key: "appointmentsThisWeek",
    label: "Appointments This Week",
    icon: LuCalendarDays,
    accent: "bg-blue-50 text-blue-600 ring-blue-200",
  },
  {
    key: "newLeadsThisWeek",
    label: "New Leads This Week",
    icon: LuUserPlus,
    accent: "bg-violet-50 text-violet-600 ring-violet-200",
  },
  {
    key: "completedProjects",
    label: "Completed Projects",
    icon: LuFolderCheck,
    accent: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  },
  {
    key: "averageRating",
    label: "Average Rating",
    icon: LuStar,
    accent: "bg-amber-50 text-amber-600 ring-amber-200",
    format: (v) => (v == null ? "—" : `${Number(v).toFixed(1)} ★`),
  },
];

export default function AnalyticsSummaryCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/analytics/summary", {
      signal: controller.signal,
      headers: ADMIN_KEY ? { "x-admin-key": ADMIN_KEY } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <div
        data-testid="analytics-error"
        className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        Unable to load analytics
      </div>
    );
  }

  return (
    <div
      className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      data-testid={loading ? "analytics-loading" : "analytics-cards"}
    >
      {CARDS.map((card) => {
        const Icon = card.icon;
        const raw = data ? data[card.key] : null;
        const value =
          loading || raw == null
            ? null
            : card.format
              ? card.format(raw)
              : raw;
        return (
          <div
            key={card.key}
            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${card.accent}`}
            >
              <Icon size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {loading ? (
                  <span className="inline-block h-7 w-16 animate-pulse rounded bg-gray-100" />
                ) : value == null ? (
                  <span className="text-gray-300">N/A</span>
                ) : (
                  value
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
