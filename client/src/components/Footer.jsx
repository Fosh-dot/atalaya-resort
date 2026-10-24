import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-column footer-brand">
          <a href="/" className="footer-logo">
            <span className="footer-logo-name">ATALAYA</span>
            <span className="footer-logo-subtitle">RESORT</span>
          </a>

          <div className="footer-brand-description">
            <p>Escape the Ordinary.</p>
            <p>
              A hillside boutique resort in El Nido, Palawan overlooking Bacuit
              Bay.
            </p>
          </div>
        </div>

        {/* Visit Us */}
        <div className="footer-column footer-visit">
          <h3>VISIT US</h3>

          <address>
            Lamoro, El Nido,
            <br />
            Palawan, Philippines
          </address>

          <div className="footer-review-links">
            <a href="#google-reviews">
              <span>4.9 ★</span> Google Reviews
            </a>

            <a href="#google-reviews">
              <span>4.9 ★</span> TripAdvisor
            </a>
          </div>
        </div>

        {/* Contact Us */}
        <div className="footer-column footer-contact">
          <h3>CONTACT US</h3>

          <div className="footer-contact-details">
            <a href="tel:+639565667480">+63 9640954036</a>

            <a href="mailto:reservations@atalaya.ph">
              atalayaresortelnido@outlook.com
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="footer-social-icon"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="footer-social-icon"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="footer-social-icon"
            >
              <FaTiktok />
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="footer-social-icon"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2026 Atalaya Resort. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
