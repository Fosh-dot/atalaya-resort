import "./ResortStorySection.css";
import sunsetDining from "../../assets/images/main-sunset-dining.webp";
import { Link } from "react-router-dom";

function ResortStorySection() {
  return (
    <section className="resort-story-section">
      <div className="resort-story-content">
        <div className="resort-story-text">
          <h2>Rooted in Palawan</h2>

          <p>
            Inspired by the raw beauty of Palawan, our space is grounded in
            simplicity, intention, and deep connection to the land. See how it
            all came to life.
          </p>

          <Link to="/our-story" className="resort-story-button">
            Our Story
          </Link>
        </div>

        <div className="resort-story-image-wrapper">
          <img
            src={sunsetDining}
            alt="Sunset dining overlooking the beautiful landscape of Palawan"
            className="resort-story-image"
          />
        </div>
      </div>
    </section>
  );
}

export default ResortStorySection;
