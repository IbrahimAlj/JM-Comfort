import {
  LuBadgeCheck,
  LuDollarSign,
  LuZap,
  LuSun,
} from 'react-icons/lu';

const features = [
  {
    icon: LuBadgeCheck,
    title: 'Certified Technicians',
    description:
      'Industry-certified, continuously trained, and background-checked. Precise work on every visit.',
    tone: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  {
    icon: LuDollarSign,
    title: 'Transparent Pricing',
    description:
      'Clear, itemized quotes before any work begins. No surprises, no upsells, no hidden fees.',
    tone: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
  {
    icon: LuZap,
    title: 'Same-Day Service',
    description:
      'Systems fail at the worst times. Our dispatch keeps a same-day slot open for emergencies.',
    tone: 'bg-amber-50 text-amber-600 ring-amber-100',
  },
  {
    icon: LuSun,
    title: 'Year-Round Support',
    description:
      'Summer heat waves, mid-winter breakdowns — we show up, fix it, and keep you comfortable.',
    tone: 'bg-orange-50 text-orange-600 ring-orange-100',
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="w-full bg-gray-50 py-20 sm:py-24"
      aria-labelledby="why-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why JM Comfort
          </p>
          <h2
            id="why-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            Comfort you can count on.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Family-owned in Sacramento, built on honest work and happy neighbors.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description, tone }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}
              >
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
  );
}
