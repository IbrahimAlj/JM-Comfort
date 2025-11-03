import Navbar from '../components/Navbar';
import JMcomfort1 from '../assets/JMcomfort1.jpeg';
import JMcomfort2 from '../assets/JMcomfort2.jpeg';

export default function About() {
  return (
    <>
      <Navbar />

      {/* Main About Section */}
      <section 
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 64px',
          display: 'flex',
          gap: '64px',
          alignItems: 'flex-start'
        }}
        role="region"
        aria-label="About JM Comfort"
      >
        {/* Left Column - Single Large Image */}
        <div style={{ flex: '0 0 500px' }}>
          <div style={{
            backgroundColor: '#E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={JMcomfort2}
              alt="JM Comfort HVAC technician installing heating and cooling system"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column - All Content */}
        <div style={{ flex: '1' }}>
          {/* Heading */}
          <h1 style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#1F2937',
            margin: '0 0 24px 0',
            lineHeight: '1.2'
          }}>
            About
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: '20px',
            color: '#6B7280',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Your home's comfort team for heating, cooling, and clean air.
          </p>

          {/* Main Description */}
          <p style={{
            fontSize: '16px',
            color: '#4B5563',
            lineHeight: '1.7',
            marginBottom: '32px'
          }}>
            JM Comfort is a Sacramento-based HVAC company focused on honest work and year-round comfort. We install, repair, and maintain heating and cooling systems for homes and small businesses—no upsells, just the right fix at a fair price. Our certified techs show up on time, explain options in plain language, and leave your space cleaner than we found it. From emergency AC repairs to seasonal tune-ups and smart thermostat upgrades, we deliver efficient, long-lasting results backed by clear communication and transparent pricing.
          </p>

          {/* Key Points List */}
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            <li style={{
              fontSize: '16px',
              color: '#4B5563',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: '8px' }}>•</span>
              <span>Licensed & Insured • CSLB #123456</span>
            </li>
            <li style={{
              fontSize: '16px',
              color: '#4B5563',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: '8px' }}>•</span>
              <span>Same-Day Service Available</span>
            </li>
            <li style={{
              fontSize: '16px',
              color: '#4B5563',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: '8px' }}>•</span>
              <span>500+ Local Jobs Completed</span>
            </li>
            <li style={{
              fontSize: '16px',
              color: '#4B5563',
              display: 'flex',
              alignItems: 'flex-start'
            }}>
              <span style={{ marginRight: '8px' }}>•</span>
              <span>4.9★ Customer Rating</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}