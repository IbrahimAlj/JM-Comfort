import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaClock } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold">JM Comfort</h3>
          <p className="mt-3 text-sm text-gray-400">Heating • Cooling • Comfort</p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-0.5" />
              <span>1234 Elm St, Sacramento CA 95819</span>
            </li>
            <li className="flex items-start gap-2">
              <FaPhone className="mt-0.5" />
              <a href="tel:+19165551234" className="hover:text-white">(916) 555-1234</a>
            </li>
            <li className="flex items-start gap-2">
              <FaEnvelope className="mt-0.5" />
              <a href="mailto:hello@jmcomfort.example" className="hover:text-white">hello@jmcomfort.example</a>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="font-semibold mb-3">Operating Hours</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaClock /> Mon–Fri 8 AM – 6 PM</li>
            <li className="flex items-center gap-2"><FaClock /> Sat 9 AM – 2 PM</li>
            <li className="flex items-center gap-2"><FaClock /> Sun Closed</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white"><FaFacebook /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} JM Comfort. All rights reserved.</p>
          <p>
            <a href="/privacy" className="hover:text-white">Privacy</a> · 
            <a href="/terms" className="hover:text-white">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
