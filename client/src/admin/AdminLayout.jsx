import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";
import AdminSidebar from "./AdminSidebar";
import { getUser } from "./Auth";

export default function AdminLayout() {
  const user = getUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initial = (user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 flex bg-gray-100">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 md:hidden">
            <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Signed in as
              </p>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
              {initial}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
