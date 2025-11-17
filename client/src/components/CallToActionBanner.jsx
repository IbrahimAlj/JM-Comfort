import { Link, useLocation } from "react-router-dom";

export default function CTAFloatingButton() { // can change function name, but changing it in App.jsx will break 
    const { pathname } = useLocation();

    // avoid redundancy, so it doesn't appear on the request-quote page
    if (pathname === "/request-quote" || pathname.startsWith("/admin")) return null; 

    return (
    <div
        role="region"
        aria-label="Call to action: request a quote"
        style={
            {
            position: "fixed", // doesn't change as we scroll across the screen
            bottom: "24px", // moves it down
            right: "24px",  // moves it to the right
            zIndex: 9999,   // keeps it above everything (transparency)
            }
        }
    >
    
    <Link
        to="/request-quote"
        aria-label="Request a quote"
        style={
            {
            display: "inline-flex", // Keeps text centered and lets padding wrap tightly
            alignItems: "center",   // allignment of text
            justifyContent: "center",   // allignment of text
            padding: "12px 24px",   // button padding
            borderRadius: "9999px", // fully rounded (pill shaped), can make it different if needed
            backgroundColor: "#202020ff", // consistent color of banner
            color: "white", // Color of text in call to action banner
            fontWeight: "600",
            fontSize: "16px",
            textDecoration: "none", // underline for link, can add if want 
            boxShadow: // depth 
                "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                cursor: "pointer", // when the user hovers over the box, it changes cursor to pointer. 
            }
        }
    >
            {/* To change the name of the CTA button */}
            Request a Quote Today!
        </Link>
    </div>
    );
}