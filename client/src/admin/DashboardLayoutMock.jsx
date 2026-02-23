/**
 * DashboardLayoutMock.jsx
 * JMHABIBI-164 - Design-only mock component
 *
 * This is a visual wireframe of the admin dashboard layout.
 * It is NOT connected to routes or real data.
 * Use this for design review and approval only.
 */

const sidebarItems = [
  { label: "Dashboard", active: true },
  { label: "Leads", active: false },
  { label: "Projects", active: false },
  { label: "Appointments", active: false },
  { label: "Services", active: false },
  { label: "Reviews", active: false },
  { label: "Upload Pictures", active: false },
];

const dashboardCards = [
  "Leads",
  "Services",
  "Projects",
  "Appointments",
  "Reviews",
  "Gallery Upload",
];

export default function DashboardLayoutMock() {
  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="flex flex-col w-[220px] min-h-full bg-black text-white shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-800">
          <span className="text-base font-semibold">JM Comfort</span>
          <p className="text-[11px] text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className={`block px-3 py-2 rounded-md text-sm font-medium mb-0.5 ${
                item.active
                  ? "bg-gray-800 text-white"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-800">
          <div className="px-3 py-2 rounded-md text-sm font-medium text-gray-400">
            Logout
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-end px-6 h-14 bg-white border-b border-gray-200 shrink-0">
          <span className="text-[13px] text-gray-500">admin@jmcomfort.com</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-[13px] text-gray-500 mb-7">Signed in as admin@jmcomfort.com</p>

          {/* Cards Grid */}
          <div className="flex flex-wrap gap-4">
            {dashboardCards.map((card) => (
              <div
                key={card}
                className="bg-white border border-gray-200 rounded-lg p-6 min-w-[160px] hover:border-gray-400 transition-colors"
              >
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Manage
                </p>
                <p className="text-lg font-semibold text-gray-800">{card}</p>
              </div>
            ))}
          </div>

          {/* Placeholder content sections */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Content Area Preview
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              This area supports tables, forms, and card layouts depending on the active page.
            </p>

            {/* Mock Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex gap-16">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Column A</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Column B</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Column C</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                </div>
              </div>
              {[1, 2, 3].map((row) => (
                <div key={row} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex gap-16">
                    <span className="text-sm text-gray-700">Sample row {row}</span>
                    <span className="text-sm text-gray-500">Data</span>
                    <span className="text-sm text-gray-500">Value</span>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Edit</span>
                      <span className="px-3 py-1 bg-red-600 text-white rounded text-xs">Delete</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Form */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-xl">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Form Preview</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Field A *</span>
                <div className="h-9 rounded border border-gray-300 bg-white" />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Field B</span>
                <div className="h-9 rounded border border-gray-300 bg-white" />
              </div>
            </div>
            <div className="mt-3">
              <span className="block text-sm font-medium text-gray-700 mb-1">Text Area</span>
              <div className="h-20 rounded border border-gray-300 bg-white" />
            </div>
            <div className="mt-4">
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded text-sm">Submit</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
