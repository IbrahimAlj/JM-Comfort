import { Link } from "react-router-dom";

export default function AdminNotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "320px",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "48px", fontWeight: "700", color: "#1F2937", margin: "0 0 8px 0" }}>404</h1>
      <p style={{ fontSize: "16px", color: "#6B7280", margin: "0 0 28px 0" }}>
        This admin page does not exist.
      </p>
      <Link
        to="/admin/dashboard"
        style={{
          display: "inline-block",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "500",
          color: "white",
          backgroundColor: "#000000",
          borderRadius: "8px",
          textDecoration: "none",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => { e.target.style.backgroundColor = "#374151"; }}
        onMouseOut={(e) => { e.target.style.backgroundColor = "#000000"; }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
