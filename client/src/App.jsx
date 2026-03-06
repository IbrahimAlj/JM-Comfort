import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Confirmation from "./pages/Confirmation";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import RequestQuote from "./pages/RequestQuote";
import Gallery from './pages/Gallery';
import SentryTestPage from './pages/SentryTestPage';
import { Helmet } from 'react-helmet-async';
import homeMeta from "./seo/homeMeta";
import CTAFloatingButton from "./components/CallToActionBanner";
import AdminRoutes from "./admin/AdminRoutes";

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "" : "flex flex-col min-h-screen"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/sentry-test" element={<SentryTestPage />} />
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
