// client/src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom"; // if you're using react-router for page links

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo and site name */}
        <Link to="/" style={styles.logoContainer}>
          <img
            src="/logo192.png" // this file is inside public/
            alt="JM Comfort Logo"
            style={styles.logo}
          />
          <span style={styles.title}>JM Comfort</span>
        </Link>

        {/* Navigation links */}
        <nav style={styles.nav}>
          <Link to="/about" style={styles.navLink}>About</Link>
          <Link to="/services" style={styles.navLink}>Services</Link>
          <Link to="/reviews" style={styles.navLink}>Reviews</Link>
          <Link to="/requestquote" style={styles.navLink}>Quote</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e5e5",
    padding: "10px 0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  logo: {
    height: "45px",
    width: "45px",
    marginRight: "10px",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#333",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
};
