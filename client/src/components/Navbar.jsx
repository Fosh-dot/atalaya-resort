import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = (event) => {
    if (location.pathname === "/") {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`hero-navbar ${isScrolled ? "navbar-scrolled" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999999,
      }}
    >
      {/* Resort Logo */}
      <Link
        to="/"
        className="hero-logo"
        aria-label="Atalaya Resort home"
        onClick={handleLogoClick}
      >
        <span className="hero-logo-name">ATALAYA</span>
        <span className="hero-logo-subtitle">RESORT</span>
      </Link>

      {/* Main Navigation */}
      <nav className="hero-navigation" aria-label="Main navigation">
        <Link
          to="/booking"
          className={location.pathname === "/booking" ? "active" : ""}
        >
          ACCOMMODATIONS
        </Link>

        <Link
          to="/dining"
          className={location.pathname.startsWith("/dining") ? "active" : ""}
        >
          DINING
        </Link>

        <Link
          to="/experiences"
          className={location.pathname === "/experiences" ? "active" : ""}
        >
          EXPERIENCES
        </Link>

        {/* Our Story */}
        <Link
          to="/our-story"
          className={location.pathname === "/our-story" ? "active" : ""}
        >
          OUR STORY
        </Link>

        {/* Contact */}
        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
        >
          CONTACT
        </Link>
      </nav>

      {/* Phone Number */}
      <a className="hero-phone" href="tel:+639565667480">
        Call ++63 932 139 6258
      </a>

      {/* Reserve Button */}
      <Link to="/booking" className="hero-reserve">
        RESERVE
      </Link>
    </header>
  );
}

export default Navbar;
