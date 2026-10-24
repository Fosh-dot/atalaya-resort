import { Link } from "react-router-dom";
import "./ExperiencesSection.css";

import lagoonImage from "../../assets/images/main-lagoon.webp";
import yogaImage from "../../assets/images/main-yoga.webp";
import cuisineImage from "../../assets/images/main-cuisine.webp";

const experiences = [
  {
    category: "EXPERIENCES",
    title: "Moments Made\non the Water",
    description:
      "Let the tides guide your day from sunrise kayaking to sunset swims.",
    image: lagoonImage,
    alt: "Turquoise lagoon surrounded by lush island cliffs",
  },
  {
    category: "WELLNESS",
    title: "Take a Deep Breath",
    description:
      "Step into stillness and surrender to the island's slow, healing rhythm.",
    image: yogaImage,
    alt: "A peaceful yoga session in a tropical setting",
  },
  {
    category: "DINING",
    title: "Flavours of the Island",
    description:
      "Every dish is made with care, inspired by Palawan's land and sea.",
    image: cuisineImage,
    alt: "Island-inspired cuisine served at Atalaya Resort",
  },
];

function ExperiencesSection() {
  return (
    <section className="experiences-section" id="experiences">
      <div className="experiences-container">
        <h2 className="experiences-heading">Escape the Ordinary.</h2>

        <div className="experiences-grid">
          {experiences.map((experience) => (
            <article className="experience-card" key={experience.category}>
              <div className="experience-image-wrapper">
                <img
                  src={experience.image}
                  alt={experience.alt}
                  className="experience-image"
                />
              </div>

              <div className="experience-card-content">
                <p className="experience-category">{experience.category}</p>

                <h3>
                  {experience.title.split("\n").map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h3>

                <p className="experience-description">
                  {experience.description}
                </p>

                <Link to="/experiences" className="experience-link">
                  DISCOVER MORE
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExperiencesSection;
