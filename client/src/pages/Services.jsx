import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Installation",
      description: "Professional AC and heating installs sized and tuned for your space.",
      image: "/placeholder-installation.jpg",
      fullDescription: "Our expert technicians provide complete HVAC installation services tailored to your home or business. We assess your space, recommend the right system size, and ensure optimal performance from day one.",
      features: [
        "Free in-home consultation",
        "Energy-efficient system recommendations",
        "Professional installation by certified technicians",
        "System testing and optimization",
        "Warranty registration and support"
      ],
      price: "Starting at $3,500"
    },
    {
      id: 2,
      title: "Repairs",
      description: "Fast diagnostics and fixes for leaks, no-cool, airflow, and more.",
      image: "/placeholder-repairs.jpg",
      fullDescription: "When your HVAC system breaks down, our skilled technicians respond quickly to diagnose and fix the problem. We handle everything from minor repairs to major component replacements.",
      features: [
        "24/7 emergency service available",
        "Accurate diagnostics",
        "Transparent pricing",
        "Quality replacement parts",
        "90-day repair warranty"
      ],
      price: "Starting at $150"
    },
    {
      id: 3,
      title: "Maintenance",
      description: "Seasonal tune-ups to improve efficiency and extend equipment life.",
      image: "/placeholder-maintenance.jpg",
      fullDescription: "Regular maintenance keeps your HVAC system running efficiently and prevents costly breakdowns. Our comprehensive tune-ups include cleaning, inspection, and performance optimization.",
      features: [
        "Complete system inspection",
        "Filter replacement",
        "Coil cleaning",
        "Refrigerant level check",
        "Priority scheduling for members"
      ],
      price: "Starting at $99"
    }
  ];

  return (
    <>
      <PageMeta
        title="HVAC Services | Installation, Repairs & Maintenance | JM Comfort"
        description="JM Comfort offers professional HVAC installation, repairs, and seasonal maintenance in Sacramento, CA. Certified technicians, transparent pricing, and same-day service available."
      />
      <Navbar />

      <main>

      <section className="w-full max-w-screen-xl mx-auto px-4 py-12 md:px-16 md:py-20">
        {/* Page Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-black mb-10 md:mb-16">
          Our Services
        </h1>

        {/* Services List */}
        <div className="flex flex-col gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col md:flex-row items-start gap-6 md:gap-8 p-6 md:p-8 border border-gray-200 rounded-lg bg-white overflow-hidden"
            >
              {/* Service Image - Now clickable */}
              <Link to={`/services/${service.id}`} className="no-underline w-full md:w-auto">
                <div className="w-full md:w-[150px] h-[150px] shrink-0 bg-gray-300 rounded cursor-pointer transition-opacity hover:opacity-80">
                  {/* Placeholder for service image */}
                </div>
              </Link>

              {/* Service Content */}
              <div className="flex-1 min-w-0">
                {/* Title - Now clickable */}
                <Link to={`/services/${service.id}`} className="no-underline">
                  <h2 className="text-xl md:text-[28px] font-semibold text-black mb-3 cursor-pointer transition-colors hover:text-gray-700">
                    {service.title}
                  </h2>
                </Link>

                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Buttons Container */}
                <div className="flex flex-wrap gap-3">
                  {/* Learn More - Styled Link */}
                  <Link
                    to={`/services/${service.id}`}
                    className="px-6 py-2.5 text-base font-medium rounded-md bg-black text-white no-underline inline-block transition-colors hover:bg-gray-700"
                  >
                    Learn More
                  </Link>

                  {/* Request Quote - Styled Link */}
                  <Link
                    to="/request-quote"
                    className="px-6 py-2.5 text-base font-medium rounded-md bg-white text-gray-700 border-2 border-gray-400 no-underline inline-block transition-colors hover:bg-gray-100"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
