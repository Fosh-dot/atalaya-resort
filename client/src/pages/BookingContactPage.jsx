import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BookingContactPage.css";

const BookingContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    promotionalEmails: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  useEffect(() => {
    document.title = "Atalaya Resort - Contact";
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFeedback("");
    setFeedbackType("");
    setSubmitting(true);

    const API_BASE_URL = (
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
    ).replace(/\/+$/, "");

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          promotionalEmails: formData.promotionalEmails,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Unable to send your enquiry. Please try again.",
        );
      }

      setFeedback("Message sent successfully!");
      setFeedbackType("success");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        promotionalEmails: false,
      });
    } catch (error) {
      console.error("Contact form submission failed:", error);

      setFeedback(
        error.message || "Unable to send your enquiry. Please try again.",
      );
      setFeedbackType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="booking-contact-page">
      <header className="booking-navbar">
        <Link to="/" className="booking-brand">
          Atalaya Resort
        </Link>

        <nav className="booking-navigation">
          <Link to="/booking">Availability</Link>
          <Link to="/booking/about">About</Link>
          <Link to="/booking/contact" className="booking-nav-active">
            Contact
          </Link>
          <Link to="/booking/policies">Policies</Link>
        </nav>

        <span className="booking-currency">PHP</span>
      </header>

      <section className="booking-contact-content">
        <div className="booking-contact-card">
          <div className="booking-contact-map">
            <iframe
              title="Atalaya Resort location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=119.35%2C11.15%2C119.65%2C11.35&layer=mapnik"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="booking-contact-details">
            <h1>Contact</h1>

            <p>
              <strong>Address:</strong> Lamoro, El Nido, Palawan 5313,
              Philippines
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+639565667480">+63 9640954036</a>
            </p>

            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:reservations@atalaya.ph">
                atalayaresortelnido@outlook.com
              </a>
            </p>

            <p>
              <strong>Airport Shuttle:</strong> Please contact us to arrange
              your transfer.
            </p>
          </div>

          <section className="booking-contact-form-section">
            <h2>Get in touch</h2>

            <form onSubmit={handleSubmit} className="booking-contact-form">
              <div className="booking-contact-form-grid">
                <label>
                  First Name <span>*</span>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Last Name <span>*</span>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Email <span>*</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    maxLength={254}
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    maxLength={40}
                  />
                </label>
              </div>

              <label className="booking-contact-message">
                Message <span>*</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="7"
                  maxLength={5000}
                  required
                />
              </label>

              <label className="booking-contact-consent">
                <input
                  type="checkbox"
                  name="promotionalEmails"
                  checked={formData.promotionalEmails}
                  onChange={handleChange}
                />

                <span>
                  I agree to receive promotional emails and updates from Atalaya
                  Resort.
                </span>
              </label>

              <div className="booking-contact-submit-row">
                <button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send enquiry"}
                </button>
              </div>

              {feedback && (
                <p
                  className="booking-contact-feedback"
                  role="status"
                  aria-live="polite"
                  style={{
                    color: feedbackType === "success" ? "green" : "red",
                  }}
                >
                  {feedback}
                </p>
              )}
            </form>
          </section>
        </div>
      </section>

      <footer className="booking-contact-footer" id="booking-contact-policies">
        <a href="#booking-contact-policies">Policies</a>

        <div className="booking-contact-footer-bottom">
          <span>Copyright © 2026</span>
          <span>ABN 62918739900000</span>
          <span>This site is protected by reCAPTCHA.</span>
          <a href="#cookie-settings">Cookie settings</a>
        </div>
      </footer>

      <button
        type="button"
        className="booking-contact-back-to-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </main>
  );
};
export default BookingContactPage;
