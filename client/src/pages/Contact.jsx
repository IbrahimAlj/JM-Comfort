import Navbar from '../components/Navbar';
import PageMeta from '../components/PageMeta';

export default function Contact() {
  return (
    <>
      <PageMeta
        title="Contact JM Comfort | Sacramento HVAC Service"
        description="Contact JM Comfort for HVAC service, repairs, or questions in Sacramento, CA. We offer fast response times, honest pricing, and same-day service availability."
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your contact form goes here...
        </p>
      </main>
    </>
  );
}