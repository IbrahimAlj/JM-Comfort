import { Link } from "react-router-dom";
import {
  LuPhone,
  LuMail,
  LuMapPin,
  LuClock,
  LuArrowRight,
} from "react-icons/lu";
import Navbar from "../components/Navbar";
import PageMeta from "../components/PageMeta";
import ContactForm from "../components/ContactForm";

const INFO = [
  {
    icon: LuPhone,
    label: "Phone",
    value: "(916) 555-1234",
    href: "tel:+19165551234",
  },
  {
    icon: LuMail,
    label: "Email",
    value: "hello@jmcomfort.example",
    href: "mailto:hello@jmcomfort.example",
  },
  {
    icon: LuMapPin,
    label: "Service Area",
    value: "Sacramento, CA & surrounding",
  },
  {
    icon: LuClock,
    label: "Hours",
    value: "Mon–Fri 8–6 · Sat 9–2",
  },
];

export default function Contact() {
  return (
    <>
      <PageMeta
        title="Contact JM Comfort | Sacramento HVAC Service"
        description="Contact JM Comfort for HVAC service, repairs, or questions in Sacramento, CA. We offer fast response times, honest pricing, and same-day service availability."
      />
      <Navbar />

      <main>
        {/* Page header */}
        <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Get in touch
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Let's talk comfort.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Questions, service, or a free estimate — reach us however works best.
              Most messages are answered the same day.
            </p>
          </div>
        </section>

        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
            {/* Info cards */}
            <div className="space-y-6 lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {INFO.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {label}
                        </p>
                        <p className="mt-1 text-base font-medium text-gray-900">
                          {value}
                        </p>
                      </div>
                    </>
                  );
                  const className =
                    "block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-gray-300";
                  return href ? (
                    <a key={label} href={href} className={className}>
                      {content}
                    </a>
                  ) : (
                    <div key={label} className={className}>
                      {content}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Prefer to schedule online?
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  Request a quote in under a minute.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Pick a time slot and a technician will reach out to confirm.
                </p>
                <Link
                  to="/request-quote"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Request a quote
                  <LuArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Contact form card */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-5 sm:px-8">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Send us a message
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    We'll get back to you within one business day.
                  </p>
                </div>
                <div className="px-2 py-2 sm:px-4 sm:py-4">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
