// src/admin/AdminRoutes.jsx
import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
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

function AdminUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setSelectedFiles(Array.from(e.target.files));
    setResult(null);
    setError(null);
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return;

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
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
        />
      </div>

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
        disabled={uploading || selectedFiles.length === 0}
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
          <Link to="/gallery" className="inline-block mt-2 text-blue-600 underline text-sm">
            View Gallery
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