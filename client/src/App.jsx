import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";
import { Helmet } from 'react-helmet-async';
import homeMeta from "./seo/homeMeta";
import CTAFloatingButton from "./components/CallToActionBanner";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Main content wrapper - grows to fill space */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-quote" element={<RequestQuote />} />
          </Routes>
        </div>

        {/* Floating CTA button */}
        <CTAFloatingButton />

        {/* Footer - Sticks to bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;