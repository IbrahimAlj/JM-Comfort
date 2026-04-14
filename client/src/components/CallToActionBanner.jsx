import { Link, useLocation } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

export default function CTAFloatingButton() {
  const { pathname } = useLocation();

  if (pathname === "/request-quote" || pathname.startsWith("/admin")) return null;

  const handleCTAClick = () => {
    trackEvent("cta_click", {
      button_name: "Request a Quote Today",
      location: "floating_banner",
      page: pathname,
    });
  };

  return (
    <div
      role="region"
      aria-label="Call to action: request a quote"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
      }}
    >
      <Link
        to="/request-quote"
        aria-label="Request a quote"
        onClick={handleCTAClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
          borderRadius: "9999px",
          backgroundColor: "#202020ff",
          color: "white",
          fontWeight: "600",
          fontSize: "16px",
          textDecoration: "none",
          boxShadow:
            "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
          cursor: "pointer",
        }}
      >
        Request a Quote Today!
      </Link>
    </div>
  );
}