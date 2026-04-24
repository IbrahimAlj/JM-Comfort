import { Link } from "react-router-dom";
import {
  LuUsers,
  LuImagePlus,
  LuFolderKanban,
  LuCalendarDays,
  LuWrench,
  LuStar,
  LuMessageSquareText,
  LuArrowRight,
} from "react-icons/lu";
import { getUser } from "../Auth";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import { PageHeader } from "../ui";

const QUICK_ACTIONS = [
  {
    to: "/admin/leads",
    label: "Leads",
    kicker: "Manage",
    description: "Follow up on quote and contact requests.",
    icon: LuUsers,
    tone: "bg-violet-50 text-violet-600 ring-violet-100",
  },
  {
    to: "/admin/appointments",
    label: "Appointments",
    kicker: "Schedule",
    description: "Approve or reject booking requests.",
    icon: LuCalendarDays,
    tone: "bg-blue-50 text-blue-600 ring-blue-100",
  },
  {
    to: "/admin/projects",
    label: "Projects",
    kicker: "Track",
    description: "Update project status and dates.",
    icon: LuFolderKanban,
    tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  {
    to: "/admin/services",
    label: "Services",
    kicker: "Catalog",
    description: "Edit public service descriptions and photos.",
    icon: LuWrench,
    tone: "bg-orange-50 text-orange-600 ring-orange-100",
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    kicker: "Moderate",
    description: "Publish or feature customer reviews.",
    icon: LuStar,
    tone: "bg-amber-50 text-amber-600 ring-amber-100",
  },
  {
    to: "/admin/feedback",
    label: "Client Feedback",
    kicker: "Review",
    description: "Read UAT feedback submitted by testers.",
    icon: LuMessageSquareText,
    tone: "bg-slate-100 text-slate-600 ring-slate-200",
  },
  {
    to: "/admin/upload",
    label: "Gallery Upload",
    kicker: "Media",
    description: "Add before/after photos to the gallery.",
    icon: LuImagePlus,
    tone: "bg-pink-50 text-pink-600 ring-pink-100",
  },
];

export default function AdminDashboard() {
  const user = getUser();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={user?.email ? `Welcome back, ${user.email}` : "Welcome back"}
      />

      <AnalyticsSummaryCards />

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Quick actions
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="group relative flex items-start gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ${item.tone}`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {item.kicker}
                </p>
                <p className="mt-0.5 text-base font-semibold text-gray-900">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
              <LuArrowRight
                size={18}
                className="absolute right-5 top-5 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-600"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
