import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LuMenu, LuX, LuPhone } from 'react-icons/lu';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

<<<<<<< HEAD
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
    boxSizing: 'border-box',
  };

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
=======
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
>>>>>>> 1bc0b175330205b531f59063f2b178ffe249b5f5
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <header
<<<<<<< HEAD
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
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <img
              src="/logo.png"
              alt="JM Comfort Logo"
              style={{ height: '72px', width: 'auto' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <span
              style={{
                display: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
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
              }}
            >
              {isOpen ? '✕' : '☰'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{ ...getLinkStyle(to), ...mobileButtonStyle }}
                onClick={closeMenu}
              >
                {label}
              </Link>
            ))}
            <Link to="/request-quote" style={mobileDarkButtonStyle} onClick={closeMenu}>
              Request Quote
            </Link>
          </div>
        )}
=======
      className={`sticky top-0 z-50 w-full border-b transition-all ${
        scrolled
          ? 'border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75'
          : 'border-transparent bg-white'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link to="/" className="flex items-center gap-2" aria-label="JM Comfort — home">
          <img
            src="/logo.png"
            alt="JM Comfort"
            className="h-9 w-auto lg:h-11"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.insertAdjacentHTML(
                'afterend',
                '<span class="text-lg font-bold tracking-tight text-gray-900">JM Comfort</span>'
              );
            }}
          />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gray-900 transition-opacity ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+19165551234"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <LuPhone size={14} /> (916) 555-1234
          </a>
          <Link
            to="/request-quote"
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
          >
            Request Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>
>>>>>>> 1bc0b175330205b531f59063f2b178ffe249b5f5
      </nav>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-base font-medium ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/request-quote"
                className="block rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Request Quote
              </Link>
            </li>
            <li>
              <a
                href="tel:+19165551234"
                className="mt-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-800"
              >
                <LuPhone size={14} /> (916) 555-1234
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
