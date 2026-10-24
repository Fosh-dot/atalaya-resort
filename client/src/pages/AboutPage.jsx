import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AboutPage.css";

const amenities = [
  "Day Spa",
  "Tour Desk",
  "WiFi Internet",
  "Air-Conditioning",
  "Room Service",
  "Smart TV",
  "24-hour security",
  "Laundry/Valet service",
  "Pool",
  "Accessible parking",
  "Communal bar area",
  "Wireless internet connection in public areas",
  "High speed wireless",
  "Coffee/tea",
  "On Site Restaurant",
  "Broadband Internet Access",
  "Non-Smoking Rooms",
  "Mini Fridge",
  "Shuttle Service",
  "Terrace",
  "Housekeeping - daily",
  "Massage services",
  "Travel agency",
  "Front desk",
  "Full service housekeeping",
  "Hair dryer",
  "Kitchenette",
  "Coffee lounge",
];

function AboutPage() {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    document.title = "Atalaya Resort - About";
  }, []);

  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 18);

  return (
    <main className="booking-about-page">
      {/* BOOKING WEBSITE NAVIGATION */}
      <header className="booking-navbar">
        <Link to="/" className="booking-brand">
          Atalaya Resort
        </Link>

        <nav className="booking-navigation">
          <Link to="/booking">Availability</Link>

          <Link to="/booking/about" className="booking-nav-active">
            About
          </Link>

          <Link to="/booking/contact">Contact</Link>

          <Link to="/booking/policies">Policies</Link>
        </nav>

        <span className="booking-currency">PHP</span>
      </header>

      {/* ABOUT CONTENT */}
      <section className="booking-about-content">
        <div className="booking-about-card">
          <section className="booking-about-intro">
            <h1>About us</h1>

            <p>
              Atalaya was born from a vision to create more than just a place to
              stay. It's a retreat where design, nature, and purposeful travel
              come together. Nestled in a secluded corner of El Nido, Palawan,
              our boutique resort is a sanctuary of serenity. Surrounded by lush
              landscapes and uninterrupted views, Atalaya invites you to slow
              down and experience mindful living.
            </p>
          </section>

          <hr className="booking-about-divider" />

          <section className="booking-about-amenities">
            <h2>Amenities</h2>

            <div className="booking-about-amenities-grid">
              {displayedAmenities.map((amenity) => (
                <div className="booking-about-amenity" key={amenity}>
                  {amenity}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="booking-about-toggle"
              onClick={() => setShowAllAmenities((previous) => !previous)}
            >
              {showAllAmenities
                ? "Show less amenities"
                : "Show all 28 amenities"}
            </button>
          </section>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="booking-about-footer">
        <div className="booking-about-footer-inner">
          <Link to="/booking/policies">Policies</Link>

          <div className="booking-about-footer-bottom">
            <span>Copyright © 2026</span>
            <span>ABN 62918739900000</span>
            <span>This site is protected by reCAPTCHA.</span>
            <a href="#cookie-settings">Cookie settings</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default AboutPage;
