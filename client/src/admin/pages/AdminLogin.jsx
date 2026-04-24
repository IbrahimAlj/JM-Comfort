import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuMail, LuLock } from "react-icons/lu";
import { login } from "../Auth";
import { Button, inputClass, ErrorBanner } from "../ui";

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
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, #e5e7eb 0, transparent 40%), radial-gradient(circle at 90% 80%, #f3f4f6 0, transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-900 text-lg font-bold text-white shadow-md">
            JM
          </div>
          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            JM Comfort Admin
          </h1>
          <p className="text-sm text-gray-500">Sign in to continue</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
          {error && (
            <div className="mb-4">
              <ErrorBanner>{error}</ErrorBanner>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <LuMail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`${inputClass} pl-9`}
                  placeholder="you@jmcomfort.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <LuLock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${inputClass} pl-9`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={busy}
              size="lg"
              className="w-full"
            >
              {busy ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
