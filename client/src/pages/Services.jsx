import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowRight, LuWrench, LuImage } from 'react-icons/lu';
import Navbar from '../components/Navbar';
import PageMeta from '../components/PageMeta';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to load services');
        const data = await res.json();
        if (!cancelled) {
          const active = Array.isArray(data)
            ? data.filter((s) => s.is_active !== false)
            : [];
          setServices(active);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load services');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <PageMeta
        title="HVAC Services | Installation, Repairs & Maintenance | JM Comfort"
        description="JM Comfort offers professional HVAC installation, repairs, and seasonal maintenance in Sacramento, CA. Certified technicians, transparent pricing, and same-day service available."
      />
      <Navbar />

      <main>
        {/* Page header */}
        <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What we offer
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              HVAC services
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Installation, repair, and maintenance — delivered by certified techs with
              transparent pricing and same-day availability.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                  />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && services.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
                <LuWrench className="mb-3 h-10 w-10 text-gray-400" aria-hidden="true" />
                <h3 className="text-base font-semibold text-gray-900">
                  Services coming soon
                </h3>
                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Services haven't been published yet. Check back shortly.
                </p>
              </div>
            )}

            {!loading && !error && services.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => {
                  const title = service.title || service.name;
                  const description =
                    service.description ||
                    service.short_description ||
                    service.full_description ||
                    '';
                  const image = service.image || service.image_url;
                  const price = service.price || service.price_description;
                  return (
                    <article
                      key={service.id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Link
                        to={`/services/${service.id}`}
                        className="block aspect-[4/3] overflow-hidden bg-gray-100"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <LuImage size={28} aria-hidden="true" />
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-3">
                          <Link
                            to={`/services/${service.id}`}
                            className="text-xl font-semibold text-gray-900 hover:text-blue-700"
                          >
                            {title}
                          </Link>
                          {price && (
                            <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                              {price}
                            </span>
                          )}
                        </div>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                          {description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                          <Link
                            to={`/services/${service.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                          >
                            Learn more
                            <LuArrowRight size={14} />
                          </Link>
                          <Link
                            to={`/quote?service=${encodeURIComponent(title || '')}`}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                          >
                            Get a quote
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
