import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

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
      <Navbar />
      
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '80px 64px'
      }}>
        {/* Page Title */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '64px'
        }}>
          Our Services
        </h1>

        {/* Services List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '32px',
                padding: '32px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            >
              {/* Service Image - Now clickable */}
              <Link to={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  flexShrink: 0,
                  backgroundColor: '#D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}>
                  {/* Placeholder for service image */}
                </div>
              </Link>

              {/* Service Content */}
              <div style={{ flex: 1 }}>
                {/* Title - Now clickable */}
                <Link to={`/services/${service.id}`} style={{ textDecoration: 'none' }}>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#000000',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#374151';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#000000';
                  }}>
                    {service.title}
                  </h2>
                </Link>

                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  {service.description}
                </p>

                {/* Buttons Container */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Learn More Button - Goes to Service Detail */}
                  <Link to={`/services/${service.id}`}>
                    <button style={{
                      padding: '10px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#374151';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#000000';
                    }}>
                      Learn More
                    </button>
                  </Link>

                  {/* Request Button */}
                  <Link to="/request-quote">
                    <button style={{
                      padding: '10px 24px',
                      fontSize: '16px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '2px solid #D1D5DB',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#F3F4F6';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}>
                      Request Quote
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}