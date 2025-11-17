import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../Auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || "/admin";

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
    <div className="min-h-screen flex justify-center bg-gray-50 p-12"> 


      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full mb-3 border rounded px-3 py-2" type="email"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="block text-sm mb-1">Password</label>
        <input className="w-full mb-4 border rounded px-3 py-2" type="password"
               value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={busy} className="w-full bg-indigo-600 text-white py-2 rounded">
          {busy ? "Signing in…" : "Sign In"}
        </button>
        <p className="mt-3 text-xs text-gray-500">
        </p>
      </form>
    </div>
  );
}