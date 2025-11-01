import React from 'react';

const HeroBanner = () => {
  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        backgroundColor: 'white'
      }}
      role="banner"
      aria-label="Homepage hero section"
    >
      {/* Background - White */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white'
        }}
        aria-hidden="true"
      >
      
      </div>

      {/* Content - Positioned higher with black text */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        paddingLeft: '80px',
        paddingTop: '180px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          {/* Main Heading */}
          <h1 style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: '48px',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            Your Trusted Partner in Home Comfort Solutions
          </h1>

          {/* Subtext */}
          <p style={{
            color: 'black',
            fontSize: '18px',
            lineHeight: '1.7'
          }}>
            At JM Comfort, we deliver reliable heating, cooling, and ventilation services for homes and businesses. Experience year-round comfort with certified technicians and transparent pricing.
          </p>

          {/* CTA Buttons - Placeholder for another team member */}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;