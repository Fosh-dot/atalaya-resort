import "./EscapeSection.css";

function EscapeSection() {
  return (
    <section className="escape-section">
      <div className="escape-content">
        <h2>Your Escape Awaits</h2>

        <div className="escape-description">
          <p>Book directly with the resort.</p>
          <p>
            Best available rates, no booking fees, and every detail handled by
            our team.
          </p>
        </div>

        <div className="escape-actions">
          <a href="/booking" className="escape-button escape-button-primary">
            Check Availability
          </a>

          <a
            href="tel:+639565667480"
            className="escape-button escape-button-secondary"
          >
            Call +63 956 566 7480
          </a>
        </div>
      </div>
    </section>
  );
}

export default EscapeSection;
