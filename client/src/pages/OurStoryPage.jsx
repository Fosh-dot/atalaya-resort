import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OurStoryPage.css";

import storyImage from "../assets/images/story.webp";
import poolLoungers from "../assets/images/main-pool-loungers.webp";
import storyGuest from "../assets/images/story-guest.webp";
import hillsideVillas from "../assets/images/villas-hillside.webp";
import sunsetTerrace from "../assets/images/sunset-terrace.webp";

function OurStoryPage() {
  return (
    <main className="our-story-page">
      <section
        className="our-story-hero"
        style={{ backgroundImage: `url(${storyImage})` }}
      >
        <div className="our-story-overlay"></div>

        <Navbar />

        <div className="our-story-hero-content">
          <h1>OUR STORY</h1>
        </div>
      </section>

      {/* Our Story Introduction */}
      <section className="our-story-introduction">
        <div className="our-story-introduction-content">
          <h2>Nature meets thoughtful design.</h2>

          <p>
            Atalaya was born from a vision to create more than just a place to
            stay. It's a retreat where design, nature, and purposeful travel
            come together. Nestled in a secluded corner of El Nido, Palawan, our
            boutique resort is a sanctuary of serenity. Surrounded by lush
            landscapes and uninterrupted views, Atalaya invites you to slow down
            and experience mindful living.
          </p>
        </div>
      </section>
      {/* Resort Image Gallery */}
      <section className="our-story-gallery">
        <div className="our-story-gallery-grid">
          <div className="our-story-gallery-item">
            <img src={poolLoungers} alt="Poolside loungers at Atalaya Resort" />
          </div>

          <div className="our-story-gallery-item">
            <img
              src={storyGuest}
              alt="A guest enjoying the natural surroundings of Atalaya Resort"
            />
          </div>

          <div className="our-story-gallery-item">
            <img
              src={hillsideVillas}
              alt="Atalaya Resort villas nestled into the hillside"
            />
          </div>
        </div>
      </section>
      {/* Inspired by Nature Section */}
      <section className="inspired-nature-section">
        <div className="inspired-nature-content">
          <h2>Inspired by nature.</h2>

          <p>
            From the architecture to the textures underfoot, every detail at
            Atalaya reflects our philosophy, "Quiet elegance and intentional
            simplicity". We took cues from tropical modernism, blending muted
            tones, warm textures, and large, open spaces that blur the lines
            between indoors and out. The result is a space that feels both
            grounded and elevated.
          </p>
        </div>
      </section>
      {/* Built for Travelers Section */}
      <section
        className="built-for-travelers"
        style={{ backgroundImage: `url(${sunsetTerrace})` }}
      >
        <div className="built-for-travelers-overlay"></div>

        <div className="built-for-travelers-content">
          <h2>
            Built for travelers
            <br />
            who seek relaxation.
          </h2>

          <p>
            Atalaya is designed for travelers who value meaningful experiences,
            those who appreciate privacy, eco-conscious choices, and
            personalized luxury.
          </p>

          <Link to="/booking" className="built-for-travelers-button">
            Stay With Us
          </Link>
        </div>
      </section>
      {/* A Story Still Being Written */}
      <section className="story-still-being-written">
        <div className="story-still-being-written-content">
          <h2>A Story still being written.</h2>

          <p>
            We believe that every guest leaves a mark on Atalaya's story. Our
            team, deeply rooted in Filipino hospitality, takes pride in creating
            immersive stays that linger in memory long after you've left. Each
            visit is part of an unfolding narrative, one of connection,
            restoration, and discovery.
          </p>

          <h3>Welcome to Atalaya. Your quiet luxury escape awaits.</h3>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default OurStoryPage;
