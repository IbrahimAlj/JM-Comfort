import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "./Auth";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Leads", to: "/admin/leads" },
  { label: "Projects", to: "/admin/projects" },
  { label: "Appointments", to: "/admin/appointments" },
  { label: "Services", to: "/admin/services" },
  { label: "Upload Pictures", to: "/admin/upload" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <aside style={{
      display: "flex",
      flexDirection: "column",
      width: "220px",
      minHeight: "100%",
      backgroundColor: "#000000",
      color: "white",
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid #1F2937",
      }}>
        <span style={{ fontSize: "16px", fontWeight: "600" }}>
          JM Comfort
        </span>
        <p style={{ fontSize: "11px", color: "#6B7280", margin: "4px 0 0 0" }}>Admin Panel</p>
      </div>

      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }} aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            style={({ isActive }) => ({
              display: "block",
              padding: "9px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none",
              color: isActive ? "white" : "#9CA3AF",
              backgroundColor: isActive ? "#1F2937" : "transparent",
              marginBottom: "2px",
              transition: "background-color 0.15s, color 0.15s",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #1F2937" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "block",
            width: "100%",
            padding: "9px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#9CA3AF",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background-color 0.15s, color 0.15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#1F2937";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#9CA3AF";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}