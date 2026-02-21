import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { getUser } from "./Auth";

export default function AdminLayout() {
  const user = getUser();

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      backgroundColor: "#F9FAFB",
      overflow: "hidden",
    }}>
      {/* Sidebar — always visible */}
      <AdminSidebar />

      {/* Main area */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
      }}>
        {/* Top bar */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 24px",
          height: "56px",
          backgroundColor: "white",
          borderBottom: "1px solid #E5E7EB",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "13px", color: "#6B7280" }}>
            {user?.email}
          </span>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
