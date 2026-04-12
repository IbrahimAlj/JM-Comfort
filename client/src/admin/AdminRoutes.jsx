// src/admin/AdminRoutes.jsx
import { useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Protected from "./Protected";
import AdminLogin from "./pages/AdminLogin";
import { captureError } from "../utils/captureError";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AdminNotFound from "./pages/AdminNotFound";
import AdminLayout from "./AdminLayout";
import AdminProjectsPage from "./pages/AdminProjectsPage";
import AdminAppointmentsPage from "./pages/AdminAppointmentsPage";
import AdminServicesPage from "./pages/AdminServicesPage";
import AdminFeedbackPage from "./pages/AdminFeedbackPage";
import { getUser, logout } from "./Auth";
import AnalyticsSummaryCards from "./components/AnalyticsSummaryCards";

function AdminDashboard() {
  const user = getUser();
  return (
    <div>
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#1F2937", margin: "0 0 4px 0" }}>Dashboard</h1>
      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 28px 0" }}>Signed in as {user?.email}</p>
      <AnalyticsSummaryCards />
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Link
          to="/admin/leads"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manage</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Leads</p>
        </Link>
        <Link
          to="/admin/upload"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manage</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Gallery Upload</p>
        </Link>
        <Link
          to="/admin/projects"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manage</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Projects</p>
        </Link>
        <Link
          to="/admin/appointments"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manage</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Appointments</p>
        </Link>
        <Link
          to="/admin/services"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Manage</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Services</p>
        </Link>
        <Link
          to="/admin/feedback"
          style={{
            display: "block",
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            padding: "24px",
            minWidth: "160px",
            textDecoration: "none",
            transition: "border-color 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
        >
          <p style={{ fontSize: "12px", fontWeight: "500", color: "#6B7280", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Review</p>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", margin: 0 }}>Client Feedback</p>
        </Link>
      </div>
    </div>
  );
}

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function validateFiles(files) {
  const errors = [];
  for (const file of files) {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${file.name}: File type "${ext}" is not allowed. Use jpg, jpeg, png, or webp.`);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      errors.push(`${file.name}: File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
    }
  }
  return errors;
}

function AdminUpload() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setResult(null);
    setError(null);
    setValidationErrors(validateFiles(files));
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

    const errors = validateFiles(selectedFiles);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setUploading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setResult(data);
        setSelectedFiles([]);
      }
    } catch (err) {
      captureError(err, { page: 'AdminUpload', action: 'uploadFiles' });
      setError("Could not connect to server");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "600", color: "#1F2937", margin: "0 0 4px 0" }}>Upload Pictures</h1>
      <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 24px 0" }}>
        Select one or more images to upload to the gallery.
      </p>

      <div style={{ marginBottom: "16px" }}>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          style={{ display: "block", width: "100%", fontSize: "14px", color: "#374151" }}
        />
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
          Allowed: JPG, JPEG, PNG, WEBP. Max {MAX_FILE_SIZE_MB}MB per file.
        </p>
      </div>

      {validationErrors.length > 0 && (
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "6px", padding: "12px", marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", fontWeight: "500", color: "#DC2626", margin: "0 0 6px 0" }}>Validation errors:</p>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#DC2626" }}>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 4px 0" }}>
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected:
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#6B7280" }}>
            {selectedFiles.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0 || validationErrors.length > 0}
        style={{
          marginTop: "16px",
          padding: "10px 24px",
          fontSize: "14px",
          fontWeight: "500",
          color: "white",
          backgroundColor: "#000000",
          border: "none",
          borderRadius: "8px",
          cursor: uploading || selectedFiles.length === 0 || validationErrors.length > 0 ? "not-allowed" : "pointer",
          opacity: uploading || selectedFiles.length === 0 || validationErrors.length > 0 ? 0.5 : 1,
          transition: "background-color 0.2s",
        }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ fontSize: "13px", color: "#DC2626", marginTop: "12px" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "12px" }}>
          {result.uploaded && result.uploaded.length > 0 && (
            <p style={{ fontSize: "13px", color: "#16A34A", margin: "0 0 6px 0" }}>
              {result.uploaded.length} image{result.uploaded.length > 1 ? "s" : ""} uploaded successfully.
            </p>
          )}
          {result.failed && result.failed.length > 0 && (
            <div style={{ marginTop: "4px" }}>
              <p style={{ fontSize: "13px", color: "#DC2626", margin: "0 0 4px 0" }}>Some files failed:</p>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#DC2626" }}>
                {result.failed.map((f, i) => (
                  <li key={i}>{f.name}: {f.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Public admin route */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Protected admin section wrapped in AdminLayout */}
      <Route element={<Protected />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/leads" element={<AdminLeadsPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          {/* Unknown admin routes */}
          <Route path="*" element={<AdminNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
