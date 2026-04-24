import { Link } from 'react-router-dom';
import {
  LuShieldCheck,
  LuClock,
  LuUsers,
  LuStar,
  LuArrowRight,
  LuHandshake,
  LuHouse,
  LuSparkles,
} from 'react-icons/lu';
import Navbar from '../components/Navbar';
import JMcomfort2 from '../assets/JMcomfort2.webp';
import PageMeta from '../components/PageMeta';

const STATS = [
  { value: '500+', label: 'Local jobs completed' },
  { value: '4.9★', label: 'Customer rating' },
  { value: '24/7', label: 'Emergency support' },
  { value: '10+ yrs', label: 'In the Sacramento area' },
];

const VALUES = [
  {
    icon: LuHandshake,
    title: 'Honest work',
    description:
      'We tell you what needs fixing — and what doesn\'t. No upsells, no hidden fees.',
  },
  {
    icon: LuSparkles,
    title: 'Clean craft',
    description:
      'We protect your floors, vacuum our debris, and leave your space better than we found it.',
  },
  {
    icon: LuHouse,
    title: 'Family-owned',
    description:
      'Sacramento-local since day one. Your comfort is literally our neighborhood.',
  },
];

const CREDENTIALS = [
  { icon: LuShieldCheck, text: 'Licensed & Insured · CSLB #123456' },
  { icon: LuClock, text: 'Same-day service available' },
  { icon: LuUsers, text: 'Background-checked technicians' },
  { icon: LuStar, text: '4.9★ verified customer rating' },
];

export default function About() {
  return (
    <>
      <PageMeta
        title="About JM Comfort | Sacramento HVAC Experts"
        description="Learn about JM Comfort, Sacramento's trusted HVAC company. Licensed, insured, with 500+ local jobs completed and a 4.9-star customer rating. Honest work, fair prices."
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
            <div className="md:col-span-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600 shadow-sm">
                About
              </span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Your home's comfort team.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                JM Comfort is a Sacramento-based HVAC company focused on honest work
                and year-round comfort. We install, repair, and maintain heating and
                cooling systems for homes and small businesses — no upsells, just the
                right fix at a fair price.
              </p>

              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {CREDENTIALS.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <Icon
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                      aria-hidden="true"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/request-quote"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
                >
                  Request a quote <LuArrowRight size={18} />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50"
                >
                  See services
                </Link>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10">
                <img
                  src={JMcomfort2}
                  alt="JM Comfort HVAC technician installing heating and cooling system"
                  className="aspect-[4/5] w-full object-cover"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-200 bg-gray-50 py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                How we work
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Built on three simple principles.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We keep it boring so your comfort stays reliable.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
