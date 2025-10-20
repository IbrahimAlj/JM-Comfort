import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaClock } from "react-icons/fa";

// Import your page components
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Reviews from "../pages/Reviews";
import Contact from "../pages/Contact";
import RequestQuote from "../pages/RequestQuote";

export default function Footer() {
  const [currentPage, setCurrentPage] = useState("home");

  // Function to render the selected page
  const renderPage = () => {
    switch (currentPage) {
      case "home": return <Home />;
      case "about": return <About />;
      case "services": return <Services />;
      case "reviews": return <Reviews />;
      case "contact": return <Contact />;
      case "requestquote": return <RequestQuote />;
      default: return <Home />;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="w-full bg-gray-100 border-b border-gray-300 sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 py-4">
          <ul className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-sm font-medium">
            <li>
              <button onClick={() => setCurrentPage("home")} className="px-3 py-1 hover:text-gray-700">Home</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("about")} className="px-3 py-1 hover:text-gray-700">About</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("services")} className="px-3 py-1 hover:text-gray-700">Services</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("reviews")} className="px-3 py-1 hover:text-gray-700">Reviews</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("contact")} className="px-3 py-1 hover:text-gray-700">Contact</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("requestquote")} className="px-3 py-1 hover:text-gray-700">Request Quote</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main content: dynamically render page */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        {renderPage()}
      </main>

      {/* Footer */}
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
              <button onClick={() => setCurrentPage("privacy")} className="hover:text-white">Privacy</button> · 
              <button onClick={() => setCurrentPage("terms")} className="hover:text-white">Terms</button>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
