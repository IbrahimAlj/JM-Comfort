import { useEffect, useState } from 'react';
import { LuStar, LuMessageCircle } from 'react-icons/lu';

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <LuStar
          key={s}
          size={16}
          className={
            s <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function initialsOf(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  );
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load reviews');
    } finally {
      setLoading(false);
    }
  }

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
      : null;

  return (
    <section className="relative bg-white py-20 sm:py-24" aria-label="Customer reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Real customers
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Sacramento is saying.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-gray-600">
              Verified reviews from homeowners and businesses we've served across the region.
            </p>
          </div>

          {avg != null && (
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3">
              <div>
                <p className="text-3xl font-bold leading-none text-gray-900">
                  {avg.toFixed(1)}
                </p>
                <Stars rating={Math.round(avg)} />
              </div>
              <div className="h-10 w-px bg-gray-200" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{reviews.length}</p>
                <p className="text-xs text-gray-500">
                  review{reviews.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchReviews}
              className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
            <LuMessageCircle className="mb-3 h-10 w-10 text-gray-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-gray-900">No reviews yet</h3>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Be the first — your honest feedback helps neighbors pick a trusted team.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <Stars rating={review.rating} />

                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-gray-800">
                  <span className="select-none text-3xl font-serif leading-none text-blue-300">
                    &ldquo;
                  </span>
                  <span className="ml-1 align-middle">{review.comment}</span>
                </blockquote>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white">
                    {initialsOf(review.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-500">Verified customer</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
