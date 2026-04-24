import { Link } from 'react-router-dom';
import {
  LuWrench,
  LuFlame,
  LuSnowflake,
  LuArrowRight,
  LuPhone,
} from 'react-icons/lu';
import HeroBanner from '../components/HeroBanner';
import Navbar from '../components/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';
import PageMeta from '../components/PageMeta';

const SERVICE_TEASERS = [
  {
    icon: LuWrench,
    title: 'Installation',
    blurb:
      'Right-sized, right-tuned HVAC installs for your space and budget.',
    tone: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  {
    icon: LuSnowflake,
    title: 'AC Repair',
    blurb:
      'Fast diagnostics for leaks, no-cool calls, airflow issues, and more.',
    tone: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
  },
  {
    icon: LuFlame,
    title: 'Heating & Maintenance',
    blurb:
      'Seasonal tune-ups that extend equipment life and lower energy bills.',
    tone: 'bg-orange-50 text-orange-600 ring-orange-100',
  },
];

export default function Home() {
  return (
    <>
      <PageMeta
        title="JM Comfort | Trusted HVAC Services in Sacramento, CA"
        description="Reliable, energy-efficient heating and cooling for Sacramento homes and businesses. Family-owned JM Comfort—trusted service, honest pricing, comfort and care."
      />
      <Navbar />

      <main>
        <HeroBanner />

        {/* Services teaser */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  What we do
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Complete HVAC service, from install to tune-up.
                </h2>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Browse all services
                <LuArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SERVICE_TEASERS.map(({ icon: Icon, title, blurb, tone }) => (
                <Link
                  key={title}
                  to="/services"
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-0.5">
                    Learn more <LuArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <WhyChooseUs />

        {/* CTA banner */}
        <section className="relative overflow-hidden bg-gray-950 py-16 text-white sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 10% 20%, rgba(59,130,246,0.25) 0, transparent 40%), radial-gradient(circle at 90% 80%, rgba(251,191,36,0.15) 0, transparent 40%)',
            }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready for a more comfortable home?
              </h2>
              <p className="mt-3 text-lg text-gray-300">
                Free estimates, same-day service, and a neighbor you can trust.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/request-quote"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-900 shadow-lg transition-colors hover:bg-gray-100"
              >
                Request a quote
                <LuArrowRight size={18} />
              </Link>
              <a
                href="tel:+19165551234"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <LuPhone size={18} />
                Call now
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
