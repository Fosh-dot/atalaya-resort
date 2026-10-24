import "./ResortFacilitiesSection.css";
import poolLoungers from "../../assets/images/main-pool-loungers.webp";

const facilities = [
  "Cliff-edge infinity pool",
  "Ocean-view dining pavilion",
  "Private balconies & jacuzzis",
  "Airport & port transfers",
  "Concierge & island tours",
  "Farm-to-table kitchen",
];

function ResortFacilitiesSection() {
  return (
    <section className="resort-facilities-section">
      <div className="resort-facilities-content">
        <div className="resort-facilities-image-wrapper">
          <img
            src={poolLoungers}
            alt="Pool loungers overlooking the resort landscape"
            className="resort-facilities-image"
          />
        </div>

        <div className="resort-facilities-text">
          <h2>Everything you need</h2>

          <p className="resort-facilities-subtitle">
            Considered comforts, quietly delivered.
          </p>

          <ul className="resort-facilities-list">
            {facilities.map((facility) => (
              <li key={facility}>
                <span className="resort-facilities-star">✦</span>
                <span>{facility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ResortFacilitiesSection;
