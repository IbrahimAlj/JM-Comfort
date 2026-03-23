import Navbar from '../components/Navbar';
// import JMcomfort1 from '../assets/JMcomfort1.jpeg';
import JMcomfort2 from '../assets/JMcomfort2.webp';
import PageMeta from '../components/PageMeta';

export default function About() {
  return (
    <>
      <PageMeta
        title="About JM Comfort | Sacramento HVAC Experts"
        description="Learn about JM Comfort, Sacramento's trusted HVAC company. Licensed, insured, with 500+ local jobs completed and a 4.9-star customer rating. Honest work, fair prices."
      />
      <Navbar />

      {/* Main About Section */}
      <main>
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '48px',
          alignItems: 'flex-start',
          boxSizing: 'border-box',
        }}
        role="region"
        aria-label="About JM Comfort"
      >
        {/* Left Column - Image */}
        <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
          <div style={{
            backgroundColor: '#E5E7EB',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <img
              src={JMcomfort2}
              alt="JM Comfort HVAC technician installing heating and cooling system"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              // loading="lazy"
              // instead of loading lazily, the following below loads immdiately. 
              loading="eager" 
              decoding="async"
              fetchpriority="high"
            />
          </div>
        </div>

        {/* Right Column - Content */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 'bold',
            color: '#1F2937',
            margin: '0 0 24px 0',
            lineHeight: '1.2',
          }}>
            About JM Comfort
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#6B7280',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}>
            Your home's comfort team for heating, cooling, and clean air.
          </p>

          <p style={{
            fontSize: '16px',
            color: '#4B5563',
            lineHeight: '1.7',
            marginBottom: '32px',
          }}>
            JM Comfort is a Sacramento-based HVAC company focused on honest work and year-round comfort. We install, repair, and maintain heating and cooling systems for homes and small businesses—no upsells, just the right fix at a fair price. Our certified techs show up on time, explain options in plain language, and leave your space cleaner than we found it. From emergency AC repairs to seasonal tune-ups and smart thermostat upgrades, we deliver efficient, long-lasting results backed by clear communication and transparent pricing.
          </p>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}>
            {[
              'Licensed & Insured • CSLB #123456',
              'Same-Day Service Available',
              '500+ Local Jobs Completed',
              '4.9★ Customer Rating',
            ].map((item, i) => (
              <li key={i} style={{
                fontSize: '16px',
                color: '#4B5563',
                marginBottom: i < 3 ? '12px' : 0,
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <span style={{ marginRight: '8px' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </main>
    </>
  );
}
