import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (path) => ({
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

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
  ];

  return (
    <header style={{ width: '100%', backgroundColor: 'white' }}>
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '96px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', marginLeft: '60px' }}>
            <img
              src="/logo.png"
              alt="JM Comfort Logo"
              style={{ height: '90px', width: 'auto' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <span style={{ display: 'none', fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>JM Comfort</span>
          </Link>

          {isMobile ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px' }}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={getMobileLinkStyle(to)} onClick={() => setIsOpen(false)}>{label}</Link>
            ))}
            <Link to="/request-quote" style={mobileDarkButtonStyle} onClick={() => setIsOpen(false)}>Request Quote</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
