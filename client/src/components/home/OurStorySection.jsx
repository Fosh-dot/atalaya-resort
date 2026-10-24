import "./OurStorySection.css";
import villasImage from "../../assets/images/main-villas.webp";

function OurStorySection() {
  return (
    <section className="our-story-section" id="story">
      <div className="our-story-content">
        <div className="our-story-text">
          <h2>
            Built with purpose,
            <br />
            kept close to nature.
          </h2>

          <p className="our-story-intro">
            "Atalaya" means Watchtower, a place to look out, breathe deep, and
            lose the noise.
          </p>

          <p>
            Perched on a forested hillside in Lamoro, just minutes from El Nido
            town, Atalaya is a boutique eco-resort of thatched ocean-view
            villas, an infinity pool that meets the horizon, and a kitchen built
            around the island's own harvest.
          </p>

          <p className="our-story-closing">
            Small by design, quiet by intention.
          </p>
        </div>

        <div className="our-story-image-wrapper">
          <img
            src={villasImage}
            alt="Atalaya Resort villas surrounded by tropical greenery"
            className="our-story-image"
          />
        </div>
      </div>
    </section>
  );
}

export default OurStorySection;
