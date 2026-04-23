import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState({});

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/reviews/admin`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message || "Could not load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(id) {
    setActionLoading((prev) => ({ ...prev, [id]: "publish" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/publish`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to publish review");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, published: true } : r))
      );
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function handleUnpublish(id) {
    setActionLoading((prev) => ({ ...prev, [id]: "unpublish" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/unpublish`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to unpublish review");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, published: false } : r))
      );
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  async function handleDelete(id) {
    setActionLoading((prev) => ({ ...prev, [id]: "delete" }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Reviews</h1>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
        <button
          onClick={fetchReviews}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {review.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-700"
                    style={{ maxWidth: "300px", wordBreak: "break-word" }}
                  >
                    {review.comment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {review.published ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(review.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {!review.published ? (
                        <button
                          onClick={() => handlePublish(review.id)}
                          disabled={!!actionLoading[review.id]}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading[review.id] === "publish"
                            ? "Publishing..."
                            : "Publish"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(review.id)}
                          disabled={!!actionLoading[review.id]}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading[review.id] === "unpublish"
                            ? "Unpublishing..."
                            : "Unpublish"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={!!actionLoading[review.id]}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[review.id] === "delete"
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                    {actionError[review.id] && (
                      <p className="mt-1 text-xs text-red-600">
                        {actionError[review.id]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
