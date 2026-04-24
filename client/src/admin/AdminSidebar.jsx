import { NavLink, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuFolderKanban,
  LuCalendarDays,
  LuCalendarClock,
  LuWrench,
  LuStar,
  LuMessageSquareText,
  LuImagePlus,
  LuLogOut,
} from "react-icons/lu";
import { logout } from "./Auth";
import { cn } from "./ui";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LuLayoutDashboard },
  { label: "Leads", to: "/admin/leads", icon: LuUsers },
  { label: "Projects", to: "/admin/projects", icon: LuFolderKanban },
  { label: "Appointments", to: "/admin/appointments", icon: LuCalendarDays },
  { label: "Availability", to: "/admin/availability", icon: LuCalendarClock },
  { label: "Services", to: "/admin/services", icon: LuWrench },
  { label: "Reviews", to: "/admin/reviews", icon: LuStar },
  { label: "Client Feedback", to: "/admin/feedback", icon: LuMessageSquareText },
  { label: "Upload Pictures", to: "/admin/upload", icon: LuImagePlus },
];

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-gray-950 text-gray-200">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-900">
          JM
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">JM Comfort</p>
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Admin Panel
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/10 text-white shadow-inner"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    )
                  }
                >
                  <Icon
                    size={18}
                    className="shrink-0 text-current opacity-90"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LuLogOut size={18} aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
