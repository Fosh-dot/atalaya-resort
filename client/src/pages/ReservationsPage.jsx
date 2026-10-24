import DiningNavbar from "../components/dining/DiningNavbar";
import DiningFooter from "../components/dining/DiningFooter";
import "./ReservationsPage.css";

import reservationsImage from "../assets/images/reservations.jpg";

function ReservationsPage() {
  return (
    <main className="reservations-page">
      {/* Navbar */}
      <DiningNavbar />

      {/* Reservations Hero */}
      <section
        className="reservations-hero"
        style={{ backgroundImage: `url(${reservationsImage})` }}
      >
        <div className="reservations-hero-overlay"></div>

        <div className="reservations-hero-content">
          <p className="reservations-eyebrow">JOIN US OVERLOOKING BACUIT BAY</p>

          <h1>Reservations &amp; Location</h1>

          <p className="reservations-description">
            Secure your dining spot for sunset cocktails and
            <br className="reservations-desktop-break" />
            Argentinian fire-grill dining in El Nido, Palawan.
          </p>
        </div>
      </section>

      {/* WhatsApp Booking Section */}
      <section className="reservations-booking">
        <div className="reservations-booking-content">
          <p className="reservations-booking-eyebrow">YOUR TABLE AWAITS</p>

          <h2>Join Us at Atalaya</h2>

          <p>
            Planning a sunset dinner or a special evening overlooking Bacuit
            Bay? Contact our team to arrange your visit.
          </p>

          <a
            href="https://wa.me/"
            className="reservations-whatsapp-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.16 1.6 5.97L.05 24l6.27-1.64a11.92 11.92 0 0 0 5.74 1.46h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.07 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.85 9.85 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.91-9.92a9.86 9.86 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.93 9.92Zm5.44-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
            </svg>
            Book a table on WhatsApp
          </a>
        </div>
      </section>
      {/* Google Maps Location */}
      <section className="reservations-map-section">
        <div className="reservations-map-container">
          <iframe
            title="Atalaya Restaurant location in El Nido, Palawan"
            src="https://maps.google.com/maps?q=Atalaya%20Restaurant%20and%20Cocktail%20Bar%20El%20Nido%20Palawan&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Footer */}
      <DiningFooter />
    </main>
  );
}

export default ReservationsPage;
