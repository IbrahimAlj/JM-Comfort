import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const buttonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    border: isActive(path) ? '2px solid #000000' : '2px solid transparent',
    borderRadius: '8px',
    backgroundColor: isActive(path) ? '#f3f4f6' : 'white',
    color: '#000000',
    textDecoration: 'none',
    transition: 'background-color 0.2s, border-color 0.2s',
    display: 'inline-block',
  });

  const darkButtonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '8px',
    border: '2px solid #000000',
    backgroundColor: '#000000',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  };

  const getMobileLinkStyle = (path) => ({
    ...getLinkStyle(path),
    display: 'block',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  });

  const mobileDarkButtonStyle = {
    ...darkButtonStyle,
    display: 'block',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header
      style={{
        width: '100%',
        backgroundColor: 'white',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      <nav
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '96px',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', marginLeft: '60px' }} onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="JM Comfort Logo"
              style={{ height: '90px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <span style={{ display: 'none', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
              JM Comfort
            </span>
          </Link>

          {isMobile ? (
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '28px',
                zIndex: 1101,
              }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} style={getLinkStyle(to)}>{label}</Link>
              ))}
              <Link to="/request-quote" style={darkButtonStyle}>Request Quote</Link>
            </div>
          )}
        </div>

        {isOpen && isMobile && (
          <div
            id="mobile-navigation-menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              padding: '16px',
              position: 'absolute',
              top: '96px',
              left: '16px',
              right: '16px',
              backgroundColor: 'white',
              zIndex: 1100,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              borderRadius: '12px',
            }}
          >
            <Link to="/" style={mobileButtonStyle} onClick={closeMenu}>Home</Link>
            <Link to="/services" style={mobileButtonStyle} onClick={closeMenu}>Services</Link>
            <Link to="/reviews" style={mobileButtonStyle} onClick={closeMenu}>Reviews</Link>
            <Link to="/about" style={mobileButtonStyle} onClick={closeMenu}>About</Link>
            <Link to="/gallery" style={mobileButtonStyle} onClick={closeMenu}>Gallery</Link>
            <Link to="/request-quote" style={mobileDarkButtonStyle} onClick={closeMenu}>
              Request Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
