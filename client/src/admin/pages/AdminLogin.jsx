import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../Auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/admin/dashboard";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <img
          src="/logo.png"
          alt="JM Comfort"
          style={{ height: "72px", width: "auto" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "40px 32px",
      }}>
        <h1 style={{
          fontSize: "22px",
          fontWeight: "600",
          color: "#1F2937",
          margin: "0 0 8px 0",
        }}>
          Admin Login
        </h1>
        <p style={{
          fontSize: "14px",
          color: "#6B7280",
          margin: "0 0 28px 0",
        }}>
          Sign in to the JM Comfort admin panel.
        </p>

        {error && (
          <div style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: "6px",
            padding: "10px 14px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#DC2626",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "6px",
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              fontSize: "14px",
              color: "#1F2937",
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              marginBottom: "16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#1F2937"; }}
            onBlur={(e) => { e.target.style.borderColor = "#D1D5DB"; }}
          />

          <label style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
            marginBottom: "6px",
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "10px 12px",
              fontSize: "14px",
              color: "#1F2937",
              backgroundColor: "white",
              border: "1px solid #D1D5DB",
              borderRadius: "6px",
              marginBottom: "24px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#1F2937"; }}
            onBlur={(e) => { e.target.style.borderColor = "#D1D5DB"; }}
          />

          <button
            type="submit"
            disabled={busy}
            style={{
              display: "block",
              width: "100%",
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: "500",
              color: "white",
              backgroundColor: busy ? "#374151" : "#000000",
              border: "none",
              borderRadius: "8px",
              cursor: busy ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              opacity: busy ? 0.7 : 1,
            }}
            onMouseOver={(e) => { if (!busy) e.target.style.backgroundColor = "#374151"; }}
            onMouseOut={(e) => { if (!busy) e.target.style.backgroundColor = "#000000"; }}
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
