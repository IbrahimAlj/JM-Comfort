import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Installation",
      description: "Professional AC and heating installs sized and tuned for your space.",
      image: "/placeholder-installation.jpg"
    },
    {
      id: 2,
      title: "Repairs",
      description: "Fast diagnostics and fixes for leaks, no-cool, airflow, and more.",
      image: "/placeholder-repairs.jpg"
    },
    {
      id: 3,
      title: "Maintenance",
      description: "Seasonal tune-ups to improve efficiency and extend equipment life.",
      image: "/placeholder-maintenance.jpg"
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
              {/* Service Image */}
              <div style={{
                width: '150px',
                height: '150px',
                flexShrink: 0,
                backgroundColor: '#D1D5DB',
                borderRadius: '4px'
              }}>
                {/* Placeholder for service image */}
              </div>

              {/* Service Content */}
              <div style={{ flex: 1 }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#000000',
                  marginBottom: '12px'
                }}>
                  {service.title}
                </h2>

                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  {service.description}
                </p>

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
                    Request
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}