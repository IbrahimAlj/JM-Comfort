import { Link } from "react-router-dom";

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Error 404
      </p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        The admin page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/admin/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
