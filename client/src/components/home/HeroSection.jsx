import "./HeroSection.css";
import { Link, useNavigate } from "react-router-dom";

import heroImage from "../../assets/images/main-hero.webp";
import Navbar from "../Navbar";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="hero-section"
      id="home"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay" />
      <Navbar />

      <div className="hero-center">
        <h1>ATALAYA</h1>
        <p className="hero-center-subtitle">RESORT</p>
        <p className="hero-location">EL NIDO · PALAWAN</p>

        <div className="hero-buttons">
          <button
            type="button"
            className="hero-button hero-button-primary"
            onClick={() => navigate("/booking")}
          >
            Check Availability
          </button>

          <Link to="/villas" className="hero-button hero-button-outline">
            View the Villas
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
