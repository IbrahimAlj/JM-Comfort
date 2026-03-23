import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#000000',
      color: '#E5E7EB',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      marginTop: 'auto',
      marginBottom: 0,
      padding: 0,
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', margin: 0, color: 'white' }}>JM Comfort</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#B0B5BD' }}>
              Heating • Cooling • Comfort
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '20px' }}>
            <a href="#" aria-label="Facebook" style={{ color: '#E5E7EB', transition: 'color 0.2s' }}>
              <FaFacebook />
            </a>
            <a href="#" aria-label="Instagram" style={{ color: '#E5E7EB', transition: 'color 0.2s' }}>
              <FaInstagram />
            </a>
            <a href="#" aria-label="Twitter" style={{ color: '#E5E7EB', transition: 'color 0.2s' }}>
              <FaTwitter />
            </a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          fontSize: '14px',
          color: '#E5E7EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaMapMarkerAlt style={{ fontSize: '16px', flexShrink: 0 }} />
            <span>1234 Elm St, Sacramento CA 95819</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaPhone style={{ fontSize: '16px', flexShrink: 0 }} />
            <a href="tel:+19165551234" style={{ color: '#E5E7EB', textDecoration: 'none' }}>(916) 555-1234</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaEnvelope style={{ fontSize: '16px', flexShrink: 0 }} />
            <a href="mailto:hello@jmcomfort.example" style={{ color: '#E5E7EB', textDecoration: 'none' }}>hello@jmcomfort.example</a>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '14px',
          flexWrap: 'wrap',
          color: '#E5E7EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaClock />
            <span style={{ fontWeight: '600' }}>Hours:</span>
          </div>
          <span>Mon–Fri 8 AM – 6 PM</span>
          <span>•</span>
          <span>Sat 9 AM – 2 PM</span>
          <span>•</span>
          <span>Sun Closed</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #374151', width: '100%' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#B0B5BD',
          flexWrap: 'wrap',
          gap: '12px',
          boxSizing: 'border-box',
        }}>
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} JM Comfort. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ color: '#B0B5BD' }}>Privacy</span>
            <span>•</span>
            <span style={{ color: '#B0B5BD' }}>Terms</span>
            <span>•</span>
            <Link to="/admin/login" style={{ color: '#B0B5BD', textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}