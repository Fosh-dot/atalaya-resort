import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./DiningNavbar.css";

function DiningNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleHomeClick = (event) => {
    if (location.pathname === "/dining") {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`dining-navbar ${isScrolled ? "dining-navbar-scrolled" : ""}`}
    >
      {/* Restaurant Logo */}
      <Link
        to="/dining"
        className="dining-brand"
        onClick={handleHomeClick}
        aria-label="Atalaya Restaurant home"
      >
        <span className="dining-brand-name">ATALAYA</span>
        <span className="dining-brand-subtitle">RESTAURANT</span>
      </Link>

      {/* Navigation */}
      <nav className="dining-navigation" aria-label="Restaurant navigation">
        {/* HOME */}
        <Link
          className={location.pathname === "/dining" ? "active" : ""}
          to="/dining"
          onClick={handleHomeClick}
        >
          HOME
        </Link>

        {/* MENU */}
        <Link
          className={location.pathname === "/dining/menu" ? "active" : ""}
          to="/dining/menu"
        >
          MENU
        </Link>

        {/* JOURNAL */}
        <Link
          className={
            location.pathname.startsWith("/dining/journal") ? "active" : ""
          }
          to="/dining/journal"
        >
          JOURNAL
        </Link>

        {/* RESERVATIONS */}
        <Link
          className={
            location.pathname === "/dining/reservations" ? "active" : ""
          }
          to="/dining/reservations"
        >
          RESERVATIONS
        </Link>
      </nav>
    </header>
  );
}

export default DiningNavbar;
