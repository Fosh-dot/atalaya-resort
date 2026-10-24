import "./DiningFooter.css";

function DiningFooter() {
  return (
    <footer className="dining-footer">
      <div className="dining-footer-columns">
        {/* Restaurant information */}
        <div className="dining-footer-about">
          <a
            href="/dining"
            className="dining-footer-brand"
            aria-label="Atalaya Restaurant home"
          >
            <span>ATALAYA</span>
            <small>RESTAURANT</small>
          </a>

          <p>
            Argentinian fire-grill and Mediterranean fusion, an emerging
            eco-food ethos, and botanical cocktails, overlooking the Bacuit Bay
            sunset.
          </p>
        </div>

        {/* Opening hours and location */}
        <div className="dining-footer-hours">
          <h2>DINE WITH US</h2>

          <p>
            Breakfast: 7:00 AM - 10:30 AM
            <br />
            Lunch &amp; Dinner: 12:00 PM - 10:00 PM
            <br />
            Bar: 12:00 PM - 11:30 PM
          </p>

          <p>
            Lamoro, El Nido,
            <br />
            Palawan, Philippines
          </p>
        </div>

        {/* Contact information */}
        <div className="dining-footer-contact">
          <h2>CONTACT US</h2>

          <p>
            <a href="tel:+639567159903">+63 9640954036</a>
            <br />

            <a href="mailto:fandb@atalaya.ph">
              atalayaresortelnido@outlook.com
            </a>
          </p>

          <div className="dining-social-links" aria-label="Social media">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              f
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              ◎
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              ♪
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              ▶
            </a>
          </div>
        </div>
      </div>

      <div className="dining-footer-bottom">
        <p>
          © 2026 Atalaya Restaurant &amp; Cocktail Bar. All Rights Reserved.
        </p>

        <p>Site by LocalEnhance</p>
      </div>
    </footer>
  );
}

export default DiningFooter;
