// src/admin/AdminRoutes.jsx
import { useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Protected from "./Protected";
import AdminLogin from "./pages/AdminLogin";
import { getUser, logout } from "./Auth";

function AdminDashboard() {
  const user = getUser();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Signed in as {user?.email}</p>
      <div className="mt-4 flex gap-3">
        <Link className="underline" to="/admin/upload">Change Pictures</Link>
        <button
          className="border rounded px-3 py-1"
          onClick={() => { logout(); window.location.href = "/admin/login"; }}
        >
          Logout
        </button>
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
      const res = await fetch("http://localhost:5000/api/projects/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setResult(data);
        setSelectedFiles([]);
        // Auto-navigate to gallery after successful upload so it shows fresh images
        setTimeout(() => navigate("/gallery"), 1500);
      }
    } catch (err) {
      setError("Could not connect to server");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Upload / Change Pictures</h1>
      <p className="text-gray-600 mt-2">
        Select one or more images to upload to the gallery.
      </p>

      <div className="mt-4">
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">
          Allowed: JPG, JPEG, PNG, WEBP. Max {MAX_FILE_SIZE_MB}MB per file.
        </p>
      </div>

      {validationErrors.length > 0 && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm font-medium">Validation errors:</p>
          <ul className="list-disc list-inside text-sm text-red-600 mt-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 mt-1">
            {selectedFiles.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0 || validationErrors.length > 0}
        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && (
        <p className="mt-3 text-red-600 text-sm">{error}</p>
      )}

      {result && (
        <div className="mt-3">
          {result.uploaded && result.uploaded.length > 0 && (
            <p className="text-green-600 text-sm">
              {result.uploaded.length} image{result.uploaded.length > 1 ? "s" : ""} uploaded successfully.
            </p>
          )}
          {result.failed && result.failed.length > 0 && (
            <div className="mt-1">
              <p className="text-red-600 text-sm">Some files failed:</p>
              <ul className="list-disc list-inside text-sm text-red-500">
                {result.failed.map((f, i) => (
                  <li key={i}>{f.name}: {f.error}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-gray-500 text-sm mt-1">Redirecting to gallery...</p>
          <Link to="/gallery" className="inline-block mt-2 text-blue-600 underline text-sm">
            View Gallery Now
          </Link>
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

      {/* Protected admin section */}
      <Route element={<Protected />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<AdminUpload />} />
      </Route>

      {/* Optional fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}