import { Link } from 'react-router-dom';

export default function Navbar() {
  const buttonStyle = {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '500',
    border: '2px solid #000000ff',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#000000ff',
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

  return (
    <header className="w-full bg-white">
      <nav className="mx-auto max-w-7xl px-6 lg:px-16">
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
            <span className="hidden text-2xl font-bold text-gray-900">JM Comfort</span>
          </Link>

          {/* Navigation Links - Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={buttonStyle}>
              Home
            </Link>
            <Link to="/services" style={buttonStyle}>
              Services
            </Link>
            <Link to="/reviews" style={buttonStyle}>
              Reviews
            </Link>
            <Link to="/about" style={buttonStyle}>
              About
            </Link>
            {/* Gallery Button Added */}
            <Link to="/gallery" style={buttonStyle}>
              Gallery
            </Link>
            <Link to="/request-quote" style={darkButtonStyle}>
              Request Quote
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
