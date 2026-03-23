cat > client/src/pages/Services.jsx << 'EOF'
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

      <section className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-20">
      <main>

      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 64px'
      }}>
        {/* Page Title */}
        <h1 className="text-3xl md:text-5xl font-bold text-black mb-10 md:mb-16">
          Our Services
        </h1>

        {/* Services List */}
        <div className="flex flex-col gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 p-6 sm:p-8 border border-gray-200 rounded-lg bg-white"
            >
              {/* Service Image */}
              <Link to={`/services/${service.id}`} className="no-underline">
                <div className="w-full sm:w-[150px] h-40 sm:h-[150px] flex-shrink-0 bg-gray-300 rounded cursor-pointer transition-opacity duration-200 hover:opacity-80" />
              </Link>

              {/* Service Content */}
              <div className="flex-1">
                {/* Title */}
                <Link to={`/services/${service.id}`} className="no-underline">
                  <h2 className="text-xl md:text-2xl font-semibold text-black mb-3 cursor-pointer transition-colors duration-200 hover:text-gray-700">
                    {service.title}
                  </h2>
                </Link>

                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link to={`/services/${service.id}`}>
                    <button className="px-6 py-2.5 text-base font-medium rounded-md bg-black text-white border-none cursor-pointer transition-all duration-200 hover:bg-gray-700">
                {/* Buttons Container */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Learn More - Styled Link */}
                  <Link to={`/services/${service.id}`} style={{
                      padding: '10px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#000000';
                    }}>
                      Learn More
                  </Link>

                  <Link to="/request-quote">
                    <button className="px-6 py-2.5 text-base font-medium rounded-md bg-white text-gray-700 border-2 border-gray-400 cursor-pointer transition-all duration-200 hover:bg-gray-100">
                  {/* Request Quote - Styled Link */}
                  <Link to="/request-quote" style={{
                      padding: '10px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '2px solid #9CA3AF',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#F3F4F6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}>
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
EOF