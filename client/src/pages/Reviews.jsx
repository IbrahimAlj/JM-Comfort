import { useState } from "react";
import { LuStar, LuSend } from "react-icons/lu";
import Navbar from "../components/Navbar";
import CustomerReviews from "../components/CustomerReviews";
import PageMeta from "../components/PageMeta";

const initial = { name: "", email: "", rating: 0, comment: "" };

export default function Reviews() {
  const [formData, setFormData] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  function handleRating(value) {
    setFormData({ ...formData, rating: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.details?.join(", ") || data.error || "Submission failed"
        );
      }
      setSuccess(true);
      setFormData(initial);
    } catch (err) {
      setError(err.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  const disabled = submitting || formData.rating === 0;
  const inputClass =
    "block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

  return (
    <>
      <PageMeta
        title="Customer Reviews | JM Comfort Sacramento HVAC"
        description="Read verified customer reviews for JM Comfort HVAC services in Sacramento. Rated 4.9 stars by local homeowners and businesses. See why neighbors trust us."
      />
      <Navbar />

      <main>
        <CustomerReviews />

        {/* Submission section */}
        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Share your experience
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Leave a review
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your honest feedback helps neighbors pick the right team.
                </p>
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                {success && (
                  <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Thanks — your review has been submitted and is pending approval.
                  </div>
                )}

                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="review-name"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="review-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={120}
                        className={inputClass}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="review-email"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="review-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-gray-700">
                      Rating <span className="text-red-500">*</span>
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= formData.rating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRating(star)}
                            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                            className="rounded-lg p-1 transition-transform hover:scale-110"
                          >
                            <LuStar
                              size={28}
                              className={
                                active
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }
                            />
                          </button>
                        );
                      })}
                      {formData.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          {formData.rating} / 5
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="review-comment"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="review-comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={inputClass}
                      placeholder="Tell others how we did..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={disabled}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-colors sm:w-auto ${
                      disabled
                        ? "cursor-not-allowed bg-gray-200 text-gray-500"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    <LuSend size={16} />
                    {submitting ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
