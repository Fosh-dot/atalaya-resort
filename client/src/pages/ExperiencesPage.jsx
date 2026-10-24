import { Link } from "react-router-dom";
import "./ExperiencesPage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import beachImage from "../assets/images/beach1.webp";
import villasImage from "../assets/images/main-villas.webp";
import adventureImage from "../assets/images/book2.jpg";
import yogaClassImage from "../assets/images/yoga-class7.webp";
import accommodationImage from "../assets/images/accommodations-hero.webp";
import yogaImage from "../assets/images/yoga-class2.webp";
import mainYogaImage from "../assets/images/main-yoga.webp";

const experiences = [
  {
    title: "Dive Into El Nido",
    image: beachImage,
    description:
      "Discover the underwater world of El Nido and the magic of Bacuit Bay beneath the surface. This package is designed for certified beginner divers seeking a confidence-building experience. This dive takes you through some of the bay's most accessible and vibrant reefs.",
  },
  {
    title: "Inland El Nido Adventure",
    image: villasImage,
    description:
      "Discover waterfalls, scenic hikes, and serene forest trails just minutes away from the resort with this special package.",
  },
  {
    title: "Skydive into the Blue",
    image: adventureImage,
    description:
      "Take your El Nido adventure to the next level with an unforgettable skydiving experience over one of the world's most breathtaking island landscapes. Enjoy panoramic views of limestone cliffs, turquoise waters, and tropical islands as you freefall above paradise.",
  },
  {
    title: "Sunset Magic",
    image: yogaClassImage,
    description:
      "Enjoy a relaxing afternoon on our Sunset Magic package, ideal for special or romantic occasions. Spend unhurried time at a semi-private beach, savor light snacks and refreshing drinks, and watch the sun set slowly over the water as the day winds down.",
  },
  {
    title: "Build Your Adventure",
    image: accommodationImage,
    description:
      "We'll help you create a custom dirt bike experience with Lakwa, our trusted local partner. Explore hidden trails, remote beaches, coastal roads, and scenic viewpoints for a unique adventure beyond the usual El Nido routes.",
  },
  {
    title: "Taste of Atalaya",
    image: yogaImage,
    description:
      "From private dinners under the stars to intimate weddings and milestone celebrations, we create bespoke gastronomic experiences crafted just for you. Each menu is thoughtfully designed by our resident chef.",
  },
  {
    title: "Wellness & Slow Living",
    image: mainYogaImage,
    description:
      "Start your day with sunrise meditations that set a calm tone for your stay. In-room massages are available by request for a deeper sense of relaxation. You can also enjoy peaceful time by the pool and let the serenity of the surroundings take over.",
  },
];

function ExperiencesPage() {
  return (
    <main className="experiences-page">
      <section
        className="experiences-hero"
        style={{ backgroundImage: `url(${beachImage})` }}
      >
        <div className="experiences-hero-overlay" />
        <Navbar />

        <div className="experiences-hero-content">
          <h1>EXPERIENCES</h1>
          <p>
            El Nido, at your pace. The wild beauty of Bacuit Bay on your
            doorstep and a hillside to retreat to.
          </p>
        </div>
      </section>

      <section className="experiences-list" aria-label="Resort experiences">
        {experiences.map((experience) => (
          <article className="experience-card" key={experience.title}>
            <img
              className="experience-card-image"
              src={experience.image}
              alt={experience.title}
            />
            <h2>{experience.title}</h2>
            <p>{experience.description}</p>
          </article>
        ))}
      </section>

      <div className="experiences-cta">
        <Link to="/booking" className="experiences-plan-button">
          PLAN YOUR STAY
        </Link>
      </div>

      <Footer />
    </main>
  );
}

export default ExperiencesPage;
