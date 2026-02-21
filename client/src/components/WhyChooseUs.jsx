import React from 'react';

const featureCards = [
  {
    icon: '✓',
    title: 'Certified Technicians',
    description:
      'Our technicians hold industry certifications and receive ongoing training to deliver precise, dependable service on every job.',
  },
  {
    icon: '$',
    title: 'Transparent Pricing',
    description:
      'No hidden fees or unexpected charges. We provide clear, itemized quotes before work begins so you can plan with confidence.',
  },
  {
    icon: '⚡',
    title: 'Same-Day Service',
    description:
      'When your system fails, every hour matters. We offer same-day and emergency appointments to restore your comfort quickly.',
  },
  {
    icon: '☀',
    title: 'Year-Round Support',
    description:
      'Whether it is peak summer heat or a mid-winter breakdown, our team is available to keep your home comfortable all year long.',
  },
];

const WhyChooseUs = () => {
  return (
    <section
      style={{
        width: '100%',
        backgroundColor: '#F9FAFB',
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '80px',
        paddingRight: '80px',
        boxSizing: 'border-box',
      }}
      aria-labelledby="why-choose-us-heading"
    >
      <h2
        id="why-choose-us-heading"
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1F2937',
          marginBottom: '12px',
          marginTop: 0,
        }}
      >
        Why Choose JM Comfort
      </h2>

      <p
        style={{
          fontSize: '16px',
          color: '#6B7280',
          marginBottom: '48px',
          marginTop: 0,
          maxWidth: '560px',
          lineHeight: '1.6',
        }}
      >
        We are committed to delivering exceptional HVAC service with honesty,
        speed, and expertise you can count on.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
        }}
      >
        {featureCards.map((card) => (
          <div
            key={card.title}
            style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '32px 24px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#2563EB',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
              aria-hidden="true"
            >
              {card.icon}
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1F2937',
                marginBottom: '10px',
                marginTop: 0,
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                fontSize: '14px',
                color: '#6B7280',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
