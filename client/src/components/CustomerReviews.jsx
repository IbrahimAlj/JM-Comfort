import React, { useState, useEffect } from 'react';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      setError(err.message || 'Could not load reviews');
    } finally {
      setLoading(false);
    }
  }

  // Star rating component
  const StarRating = ({ rating }) => {
    return (
      <div
        style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}
        aria-label={`Rated ${rating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            aria-hidden="true"
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

  if (loading) {
    return (
      <section
        style={{ backgroundColor: 'white', padding: '80px 24px', width: '100%', boxSizing: 'border-box' }}
        role="region"
        aria-label="Customer reviews"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '48px',
          }}>
            Customer Reviews
          </h1>
          <p style={{ color: '#6B7280' }}>Loading reviews...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{ backgroundColor: 'white', padding: '80px 24px', width: '100%', boxSizing: 'border-box' }}
        role="region"
        aria-label="Customer reviews"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '48px',
          }}>
            Customer Reviews
          </h1>
          <p style={{ color: '#DC2626' }}>{error}</p>
          <button
            onClick={fetchReviews}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{ backgroundColor: 'white', padding: '80px 24px', width: '100%', boxSizing: 'border-box' }}
      role="region"
      aria-label="Customer reviews"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: 'bold',
          color: '#000000',
          marginBottom: '48px',
        }}>
          Customer Reviews
        </h1>

        {reviews.length === 0 ? (
          <p style={{ color: '#6B7280' }}>No reviews yet. Be the first to leave a review!</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {reviews.map((review) => {
              const initials = (review.name || '')
                .split(' ')
                .map(w => w[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
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
                    cursor: 'default',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <StarRating rating={review.rating} />

                  <p style={{
                    fontSize: '16px',
                    color: '#1F2937',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    flex: 1,
                    fontWeight: '500',
                  }}>
                    "{review.comment}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', margin: 0 }}>{review.name}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;
