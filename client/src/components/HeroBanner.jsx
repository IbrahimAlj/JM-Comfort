import { Link } from 'react-router-dom';
import {
  LuPhone,
  LuArrowRight,
  LuShieldCheck,
  LuClock,
  LuStar,
  LuWrench,
} from 'react-icons/lu';
import JMcomfort2 from '../assets/JMcomfort2.webp';

const TRUST_CHIPS = [
  { icon: LuShieldCheck, label: 'Licensed & Insured' },
  { icon: LuClock, label: 'Same-Day Service' },
  { icon: LuStar, label: '4.9★ Rated' },
  { icon: LuWrench, label: 'Certified Techs' },
];

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50"
      aria-label="Homepage hero"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 10%, rgba(59,130,246,0.10) 0, transparent 45%), radial-gradient(circle at 15% 90%, rgba(251,191,36,0.10) 0, transparent 40%)',
        }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20 lg:gap-16 lg:px-8 lg:py-28">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Serving the Greater Sacramento area
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your trusted partner in <span className="text-blue-600">home comfort</span>.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-gray-600 sm:text-xl">
            Honest heating, cooling, and ventilation for homes and small businesses.
            Certified technicians. Transparent pricing. Year-round peace of mind.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-gray-900/10 transition-colors hover:bg-gray-800"
            >
              Request a free quote
              <LuArrowRight size={18} />
            </Link>
            <a
              href="tel:+19165551234"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
            >
              <LuPhone size={18} />
              (916) 555-1234
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST_CHIPS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700"
              >
                <Icon size={16} className="text-blue-600" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">
            <img
              src={JMcomfort2}
              alt="JM Comfort HVAC technician at work"
              className="aspect-[4/5] w-full object-cover md:aspect-[4/4.5]"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <LuStar size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-gray-900">4.9 / 5</p>
                <p className="text-xs text-gray-500">Avg. customer rating</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl md:block">
            <p className="text-2xl font-bold leading-none text-gray-900">500+</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
              Local jobs completed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
