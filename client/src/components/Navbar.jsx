import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const buttonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    border: '2px solid #000000',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#000000',
    textDecoration: 'none',
    transition: 'all 0.2s',
    display: 'inline-block',
  };

  const darkButtonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '8px',
    backgroundColor: '#000000',
    color: 'white',
    textDecoration: 'none',
    transition: 'all 0.2s',
    display: 'inline-block',
  };

  const mobileButtonStyle = {
    ...buttonStyle,
    display: 'block',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  const mobileDarkButtonStyle = {
    ...darkButtonStyle,
    display: 'block',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <header style={{ width: '100%', backgroundColor: 'white' }}>
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '96px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo.png"
              alt="JM Comfort Logo"
    <header className="w-full bg-white">
      <nav className="mx-auto max-w-7xl px-6 lg:px-16" aria-label="Main navigation">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Left Side with proper sizing */}
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
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '28px',
              }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/" style={buttonStyle}>Home</Link>
              <Link to="/services" style={buttonStyle}>Services</Link>
              <Link to="/reviews" style={buttonStyle}>Reviews</Link>
              <Link to="/about" style={buttonStyle}>About</Link>
              <Link to="/gallery" style={buttonStyle}>Gallery</Link>
              <Link to="/request-quote" style={darkButtonStyle}>Request Quote</Link>
            </div>
          )}
        </div>

        {isOpen && isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            <Link to="/" style={mobileButtonStyle} onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/services" style={mobileButtonStyle} onClick={() => setIsOpen(false)}>Services</Link>
            <Link to="/reviews" style={mobileButtonStyle} onClick={() => setIsOpen(false)}>Reviews</Link>
            <Link to="/about" style={mobileButtonStyle} onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/gallery" style={mobileButtonStyle} onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/request-quote" style={mobileDarkButtonStyle} onClick={() => setIsOpen(false)}>Request Quote</Link>
          </div>
        )}
      </nav>
    </header>
  );
}