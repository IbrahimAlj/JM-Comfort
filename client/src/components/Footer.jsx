import { Link } from "react-router-dom";
import {
  LuPhone,
  LuMail,
  LuMapPin,
  LuClock,
  LuFacebook,
  LuInstagram,
  LuTwitter,
} from "react-icons/lu";

const socials = [
  { icon: LuFacebook, href: "#", label: "Facebook" },
  { icon: LuInstagram, href: "#", label: "Instagram" },
  { icon: LuTwitter, href: "#", label: "Twitter" },
];

const siteLinks = [
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/request-quote", label: "Request Quote" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-900">
              JM
            </div>
            <div>
              <p className="text-lg font-semibold text-white">JM Comfort</p>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Heating · Cooling · Comfort
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-400">
            Family-owned HVAC for the Greater Sacramento area. Honest service,
            transparent pricing, and long-term comfort for every home and business.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {siteLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-2.5">
              <LuMapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
              <span>1234 Elm St, Sacramento CA 95819</span>
            </li>
            <li>
              <a
                href="tel:+19165551234"
                className="flex items-start gap-2.5 text-gray-400 hover:text-white"
              >
                <LuPhone size={16} className="mt-0.5 shrink-0 text-gray-500" />
                (916) 555-1234
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@jmcomfort.example"
                className="flex items-start gap-2.5 text-gray-400 hover:text-white"
              >
                <LuMail size={16} className="mt-0.5 shrink-0 text-gray-500" />
                hello@jmcomfort.example
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <LuClock size={16} className="mt-0.5 shrink-0 text-gray-500" />
              <div className="space-y-0.5 text-xs">
                <p>Mon–Fri · 8 AM – 6 PM</p>
                <p>Sat · 9 AM – 2 PM</p>
                <p>Sun · Closed</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} JM Comfort. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Privacy</span>
            <span aria-hidden="true">·</span>
            <span>Terms</span>
            <span aria-hidden="true">·</span>
            <Link to="/admin/login" className="hover:text-gray-300">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
