import React from 'react';

const CustomerReviews = () => {
  // Customer reviews data - can be loaded dynamically from backend or JSON file
  const reviews = [
    {
      id: 1,
      quote: "Excellent service! Quick, friendly, and professional!",
      name: "Sarah M.",
      role: "Description",
      avatar: "SM",
      rating: 5
    },
    {
      id: 2,
      quote: "They explained everything clearly and delivered great results.",
      name: "James R.",
      role: "Description",
      avatar: "JR",
      rating: 5
    },
    {
      id: 3,
      quote: "Super responsive and reliable. Highly recommend!",
      name: "Olivia T.",
      role: "Description",
      avatar: "OT",
      rating: 5
    },
    {
      id: 4,
      quote: "Affordable, honest, and on time. Couldn't ask for better!",
      name: "Michael D.",
      role: "Description",
      avatar: "MD",
      rating: 5
    },
    {
      id: 5,
      quote: "Great experience from start to finish. I'll definitely use them again.",
      name: "Emily S.",
      role: "Description",
      avatar: "ES",
      rating: 5
    },
    {
      id: 6,
      quote: "The team went above and beyond to ensure quality work.",
      name: "Daniel K.",
      role: "Description",
      avatar: "DK",
      rating: 5
    }
  ];

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              color: star <= rating ? '#FBBF24' : '#E5E7EB',
              fontSize: '16px'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section
      style={{
        backgroundColor: 'white',
        padding: '80px 64px',
        width: '100%'
      }}
      role="region"
      aria-label="Customer reviews"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Heading */}
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '48px'
        }}>
          Customer Reviews
        </h1>

        {/* Reviews Grid - Responsive 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Star Rating */}
              <StarRating rating={review.rating} />

              {/* Review Quote */}
              <p style={{
                fontSize: '16px',
                color: '#1F2937',
                lineHeight: '1.6',
                marginBottom: '20px',
                flex: 1,
                fontWeight: '500'
              }}>
                "{review.quote}"
              </p>

              {/* Reviewer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {review.avatar}
                </div>

                {/* Name and Role */}
                <div>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1F2937',
                    margin: 0
                  }}>
                    {review.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: 0
                  }}>
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;