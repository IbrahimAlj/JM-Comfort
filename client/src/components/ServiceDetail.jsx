import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetch(`/api/services/${encodeURIComponent(id)}`)
      .then((res) => {
        if (!mounted) return;
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data) setService(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Unknown error");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div role="status" className="flex items-center justify-center py-20 text-gray-500">
        Loading service...
      </div>
    );
  }

  if (notFound || (!loading && !service && !error)) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-gray-200 bg-white p-8 text-center"
      >
        <p className="text-lg font-medium text-gray-900">Service not found</p>
        <p className="mt-2 text-sm text-gray-600">
          It may have been removed or is no longer available.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800"
      >
        Error loading service: {error}
      </div>
    );
  }

  const title = service.name || service.title;
  const image = service.image || service.image_url;
  const fullDescription =
    service.full_description || service.description || "";
  const shortDescription = service.short_description;
  const priceLabel =
    service.price ||
    (service.price_description
      ? service.price_description
      : service.price_starting != null
        ? `Starting at $${Number(service.price_starting).toFixed(2)}`
        : null);
  const quoteHref = `/quote?service=${encodeURIComponent(title || "")}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[16/7] w-full bg-gradient-to-br from-gray-100 to-gray-200">
        {image ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.25}
              stroke="currentColor"
              className="h-16 w-16"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="p-6 sm:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {title}
          </h1>
          {priceLabel && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white">
              {priceLabel}
            </span>
          )}
        </div>

        {shortDescription && shortDescription !== fullDescription && (
          <p className="mt-4 text-lg text-gray-700">{shortDescription}</p>
        )}

        {fullDescription && (
          <div className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 whitespace-pre-line">
            {fullDescription}
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={quoteHref}
            className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
          >
            Request a Quote
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-800 transition-colors hover:bg-gray-50"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </article>
  );
}
