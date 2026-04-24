import { useState, useEffect } from "react";
import { LuStar, LuTrash2 } from "react-icons/lu";
import {
  PageHeader,
  Table,
  TH,
  TD,
  Pill,
  Button,
  ErrorBanner,
  EmptyState,
  Spinner,
  Card,
} from "../ui";

const API_BASE = import.meta.env.VITE_API_URL || "";
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleString();
}

function Stars({ value }) {
  return (
    <span className="text-amber-500" aria-label={`${value} out of 5`}>
      {"★".repeat(value)}
      <span className="text-gray-300">{"★".repeat(Math.max(0, 5 - value))}</span>
    </span>
  );
}

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

  async function patch(id, path, updater) {
    setActionLoading((prev) => ({ ...prev, [id]: path }));
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${id}/${path}`, {
        method: "PATCH",
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Failed to ${path} review`);
      setReviews((prev) => prev.map((r) => (r.id === id ? updater(r) : r)));
    } catch (err) {
      setActionError((prev) => ({ ...prev, [id]: err.message }));
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  }

  const handlePublish = (id) => patch(id, "publish", (r) => ({ ...r, published: true }));
  const handleUnpublish = (id) =>
    patch(id, "unpublish", (r) => ({ ...r, published: false, featured: false }));
  const handleFeature = (id) => patch(id, "feature", (r) => ({ ...r, featured: true }));
  const handleUnfeature = (id) => patch(id, "unfeature", (r) => ({ ...r, featured: false }));

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

  const featuredCount = reviews.filter((r) => r.featured).length;

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle={
          <>
            Moderate customer reviews. Featured on homepage:{" "}
            <span className="font-semibold text-gray-800">{featuredCount} / 3</span>. Only
            published reviews can be featured.
          </>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorBanner onRetry={fetchReviews}>{error}</ErrorBanner>
        </div>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Loading reviews...
          </div>
        </Card>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<LuStar size={22} />}
          title="No reviews yet"
          description="Customer reviews will show here once submitted."
        />
      ) : (
        <Table>
          <thead>
            <tr>
              <TH>Customer</TH>
              <TH>Rating</TH>
              <TH>Comment</TH>
              <TH>Status</TH>
              <TH>Date</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reviews.map((review) => {
              const busy = !!actionLoading[review.id];
              return (
                <tr key={review.id} className="hover:bg-gray-50">
                  <TD>
                    <div className="font-medium text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.email}</div>
                  </TD>
                  <TD>
                    <Stars value={review.rating} />
                  </TD>
                  <TD className="max-w-[320px]">
                    <p className="whitespace-pre-wrap break-words text-gray-700">
                      {review.comment}
                    </p>
                  </TD>
                  <TD>
                    <div className="flex flex-col gap-1">
                      <Pill tone={review.published ? "green" : "yellow"}>
                        {review.published ? "Published" : "Pending"}
                      </Pill>
                      {review.featured && (
                        <Pill tone="blue">★ Featured</Pill>
                      )}
                    </div>
                  </TD>
                  <TD className="whitespace-nowrap text-gray-500">
                    {formatDate(review.created_at)}
                  </TD>
                  <TD>
                    <div className="flex flex-wrap justify-end gap-2">
                      {!review.published ? (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handlePublish(review.id)}
                          disabled={busy}
                        >
                          {actionLoading[review.id] === "publish"
                            ? "Publishing..."
                            : "Publish"}
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleUnpublish(review.id)}
                          disabled={busy}
                        >
                          {actionLoading[review.id] === "unpublish"
                            ? "Unpublishing..."
                            : "Unpublish"}
                        </Button>
                      )}
                      {review.published &&
                        (review.featured ? (
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleUnfeature(review.id)}
                            disabled={busy}
                          >
                            {actionLoading[review.id] === "unfeature"
                              ? "Unfeaturing..."
                              : "Unfeature"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleFeature(review.id)}
                            disabled={busy || featuredCount >= 3}
                            title={featuredCount >= 3 ? "Unfeature one first (max 3)" : ""}
                          >
                            {actionLoading[review.id] === "feature"
                              ? "Featuring..."
                              : "Feature"}
                          </Button>
                        ))}
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<LuTrash2 size={14} />}
                        onClick={() => handleDelete(review.id)}
                        disabled={busy}
                      >
                        {actionLoading[review.id] === "delete" ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                    {actionError[review.id] && (
                      <p className="mt-1 text-right text-xs text-red-600">
                        {actionError[review.id]}
                      </p>
                    )}
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
