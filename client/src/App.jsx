import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useEffect } from 'react';
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Confirmation from "./pages/Confirmation";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";
import Gallery from './pages/Gallery';
import ServiceDetail from './components/ServiceDetail';
import SentryTestPage from './pages/SentryTestPage';
import UATFeedback from './pages/UATFeedback';
import { Helmet } from 'react-helmet-async';
import homeMeta from "./seo/homeMeta";
import CTAFloatingButton from "./components/CallToActionBanner";
import AdminRoutes from "./admin/AdminRoutes";

// Initialize GA4 only if the ID exists
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

function GATracker() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID) return; // Skip if no ID
    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
    });
  }, [location]);

  return null;
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "" : "flex flex-col min-h-screen"}>
      <GATracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/quote" element={<RequestQuote />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sentry-test" element={<SentryTestPage />} />
        <Route path="/uat-feedback" element={<UATFeedback />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
      {!isAdmin && <CTAFloatingButton />}
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;