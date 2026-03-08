import React from 'react';

const HeroBanner = () => {
  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingBottom: '80px'
      }}
      role="banner"
      aria-label="Homepage hero section"
    >
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white'
        }}
        aria-hidden="true"
      />

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        paddingLeft: '80px',
        paddingTop: '180px',
        paddingRight: '80px'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: '48px',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            Your Trusted Partner in Home Comfort Solutions
          </h1>

          <p style={{
            color: 'black',
            fontSize: '18px',
            lineHeight: '1.7',
            marginBottom: '60px'
          }}>
            At JM Comfort, we deliver reliable heating, cooling, and ventilation services for homes and businesses. Experience year-round comfort with certified technicians and transparent pricing.
          </p>
        </div>

        <div style={{ marginTop: '80px', maxWidth: '100%' }}>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: '32px'
            }}
          >
            Latest reviews
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              maxWidth: '1200px'
            }}
          >
            {/* Review 1 */}
            <article style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', fontSize: '18px' }} role="img" aria-label="4 out of 5 stars">
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#E5E7EB' }}>★</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>Excellent Service!</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', marginBottom: '16px' }}>
                They installed my new AC quickly and left everything spotless. Highly recommend.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div aria-hidden="true" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px' }}>FO</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0, color: '#1F2937' }}>
                    Frank ocean
                  </p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>10/03/2023</p>
                </div>
              </div>
            </article>

            {/* Review 2 */}
            <article style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', fontSize: '18px' }} role="img" aria-label="5 out of 5 stars">
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>Fast & Fair</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', marginBottom: '16px' }}>
                Diagnosed the issue in minutes and had cool air back the same day.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div aria-hidden="true" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px' }}>D</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0, color: '#1F2937' }}>
                    Drake
                  </p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>04/02/2019</p>
                </div>
              </div>
            </article>
            
            {/* Review 3 */}
            <article style={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', fontSize: '18px' }} role="img" aria-label="5 out of 5 stars">
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
                <span aria-hidden="true" style={{ color: '#FBBF24' }}>★</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px' }}>Very Helpful</h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', marginBottom: '16px' }}>
                Explained maintenance tips and saved us money on our bill.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div aria-hidden="true" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600', fontSize: '12px' }}>Y</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0, color: '#1F2937' }}>
                    Yaet
                  </p>
                  <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>19/11/2001</p>
                </div>
              </div>
            </article>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
