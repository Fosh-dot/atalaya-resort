import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ContactPage.css";

import contactImage from "../assets/images/contact.webp";

function ContactPage() {
  return (
    <main className="contact-page">
      {/* Contact Hero */}
      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${contactImage})` }}
      >
        <div className="contact-hero-overlay"></div>
        <Navbar />
      </section>

      {/* Come Find the Quiet */}
      <section className="contact-information">
        <div className="contact-information-container">
          <div className="contact-information-left">
            <h1>
              Come find
              <br />
              the quiet.
            </h1>

            <p className="contact-information-description">
              We'd love to help plan your stay. Transfers, tours, and special
              occasions included.
            </p>

            {/* Reservations */}
            <div className="contact-detail-group">
              <h2>Reservations</h2>

              <a href="tel:+639565667480">+63 9640954036</a>

              <a href="mailto:reservations@atalaya.ph">
                atalayaresortelnido@outlook.com
              </a>
            </div>

            {/* Address */}
            <div className="contact-detail-group">
              <h2>Address</h2>

              <p>
                Lamoro, El Nido,
                <br />
                Palawan 5313, Philippines
              </p>
            </div>

            {/* Booking Navigation */}
            <Link to="/booking" className="contact-availability-button">
              Check Availability
            </Link>
          </div>
        </div>
      </section>
      {/* Frequently Asked Questions */}
      <section className="contact-faq-section">
        <div className="contact-faq-container">
          <div className="contact-faq-heading">
            <span className="contact-faq-eyebrow">
              <span></span>
              FAQS
            </span>

            <h2>Good to know</h2>
          </div>

          <div className="contact-faq-list">
            <details className="contact-faq-item" open>
              <summary>Where is Atalaya Resort?</summary>
              <div className="contact-faq-answer">
                <p>
                  Atalaya sits on a forested hillside in Lamoro, El Nido,
                  Palawan, minutes from El Nido town.
                </p>
              </div>
            </details>

            <details className="contact-faq-item">
              <summary>How can I book a stay?</summary>
              <div className="contact-faq-answer">
                <p>
                  Visit our booking page to explore your accommodation options
                  and submit your reservation request.
                </p>
                <Link to="/booking" className="contact-faq-booking-link">
                  Explore availability
                </Link>
              </div>
            </details>

            <details className="contact-faq-item">
              <summary>Can you arrange transfers and tours?</summary>
              <div className="contact-faq-answer">
                <p>
                  Contact our reservations team to discuss transfers, tours, and
                  special arrangements for your stay.
                </p>
              </div>
            </details>

            <details className="contact-faq-item">
              <summary>How can I contact the resort?</summary>
              <div className="contact-faq-answer">
                <p>
                  Call +63 932 139 6258 or email
                  :atalayaresortelnido@outlook.com
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default ContactPage;
