// src/admin/AdminRoutes.jsx
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
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Upload / Change Pictures</h1>
      <p className="text-gray-600 mt-2">Wire this to your uploader when ready.</p>
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