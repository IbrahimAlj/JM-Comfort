import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Confirmation() {
  const location = useLocation();
  const submittedData = location.state || {};

  return (
    <>
      <Navbar />
      
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg 
              style={{ width: '48px', height: '48px' }} 
              fill="none" 
              stroke="white" 
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            Thank You!
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            marginBottom: '32px'
          }}>
            Your request has been successfully submitted.
          </p>

          {/* Submitted Data Display */}
          {Object.keys(submittedData).length > 0 && (
            <div style={{
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Submitted Information:
              </h2>

              {submittedData.name && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Name: </span>
                  <span style={{ color: '#6b7280' }}>{submittedData.name}</span>
                </div>
              )}

              {submittedData.email && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Email: </span>
                  <span style={{ color: '#6b7280' }}>{submittedData.email}</span>
                </div>
              )}

              {submittedData.phone && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Phone: </span>
                  <span style={{ color: '#6b7280' }}>{submittedData.phone}</span>
                </div>
              )}

              {submittedData.service && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Service: </span>
                  <span style={{ color: '#6b7280' }}>{submittedData.service}</span>
                </div>
              )}

              {submittedData.message && (
                <div>
                  <span style={{ fontWeight: '600', color: '#374151' }}>Message: </span>
                  <p style={{ color: '#6b7280', marginTop: '8px' }}>{submittedData.message}</p>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '8px'
            }}>
              What Happens Next?
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: '#374151',
              fontSize: '14px'
            }}>
              <li style={{ marginBottom: '8px' }}>✓ We&apos;ll review your request within 24 hours</li>
              <li style={{ marginBottom: '8px' }}>✓ A team member will contact you to confirm details</li>
              <li style={{ marginBottom: '8px' }}>✓ Check your email for confirmation</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <Link to="/">
              <button style={{
                width: '100%',
                padding: '14px 32px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Return to Home
              </button>
            </Link>

            <Link to="/services">
              <button style={{
                width: '100%',
                padding: '14px 32px',
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                View Our Services
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}