import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
  ];

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

  const mobileButtonStyle = {
    display: 'block',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  };

  const darkButtonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '8px',
    border: '2px solid #000000',
    backgroundColor: '#000000',
    color: 'white',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const mobileDarkButtonStyle = {
    ...darkButtonStyle,
    width: '100%',
    textAlign: 'center',
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header style={{ width: '100%', backgroundColor: 'white', position: 'relative', zIndex: 1000 }}>
      <nav style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '96px' }}>
          <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/logo.png"
              alt="JM Comfort"
              style={{ height: '48px', width: 'auto' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.insertAdjacentText('afterend', 'JM Comfort'); }}
            />
          </Link>

          {isMobile ? (
            <button
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} style={getLinkStyle(to)}>
                  {label}
                </Link>
              ))}
              <Link to="/request-quote" style={darkButtonStyle}>
                Request Quote
              </Link>
            </div>
          )}
        </div>

        {isOpen && isMobile && (
          <div>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ ...getLinkStyle(to), ...mobileButtonStyle }} onClick={closeMenu}>
                {label}
              </Link>
            ))}
            <Link to="/request-quote" style={mobileDarkButtonStyle} onClick={closeMenu}>
              Request Quote
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}