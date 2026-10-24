import { Link } from "react-router-dom";
import DiningNavbar from "../components/dining/DiningNavbar";
import DiningFooter from "../components/dining/DiningFooter";
import "./DiningPage.css";

import heroImage from "../assets/images/hero.jpg";
import breakfastImage from "../assets/images/break.jpg";
import foodImage2 from "../assets/images/break2.jpg";
import foodImage3 from "../assets/images/break3.jpg";
import farmImage from "../assets/images/farm.jpg";
import farmImage2 from "../assets/images/farm2.jpg";

import gallery1 from "../assets/images/gallery1.jpg";
import gallery2 from "../assets/images/gallery2.jpg";
import gallery3 from "../assets/images/gallery3.jpg";
import gallery4 from "../assets/images/gallery4.jpg";
import gallery5 from "../assets/images/gallery5.jpg";

import food1 from "../assets/images/food1.jpg";
import food2 from "../assets/images/food2.jpg";
import food3 from "../assets/images/food3.jpg";
import food4 from "../assets/images/food4.jpg";
import food5 from "../assets/images/food5.jpg";

function DiningPage() {
  const galleryImages = [
    { src: gallery1, name: "Poolside Serenity" },
    { src: gallery2, name: "Bacuit Bay Views" },
    { src: gallery3, name: "Golden Hour Sunsets" },
    { src: gallery4, name: "Tropical Architecture" },
    { src: gallery5, name: "Sunset Dining" },
  ];

  const foodImages = [
    { src: food1, name: "Trio of Kinilaw" },
    { src: food2, name: "Watermelon Margarita" },
    { src: food3, name: "Dragonfruit Cheesecake" },
    { src: food4, name: "Pork Katsu" },
    { src: food5, name: "Argentinian Grill" },
  ];

  return (
    <main className="dining-page">
      {/* RESTAURANT HERO */}
      <section
        className="dining-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
        id="dining-home"
      >
        <div className="dining-hero-overlay" />

        <DiningNavbar />

        <div className="dining-hero-content">
          <p className="dining-location">EL NIDO, PALAWAN</p>

          <h1>
            Atalaya Restaurant
            <br />
            &amp; Cocktail Bar
          </h1>

          <p className="dining-hero-description">
            A culinary journey blending Argentinian fire-grill mastery
            <br className="dining-desktop-break" />
            with Mediterranean soul, rooted in the natural abundance of Palawan.
          </p>

          <div className="dining-hero-actions">
            {/* EXPLORE MENU: Opens the separate Menu page */}
            <Link
              to="/dining/menu"
              className="dining-button dining-button-primary"
            >
              EXPLORE MENU
            </Link>

            {/* BOOK A TABLE: Opens the Reservations page */}
            <Link
              to="/dining/reservations"
              className="dining-button dining-button-outline"
            >
              BOOK A TABLE
            </Link>
          </div>
        </div>
      </section>

      {/* DINING INTRODUCTION */}
      <section className="dining-introduction">
        <div className="dining-introduction-content">
          <h2>
            Dining at Atalaya is a journey into flavor and place. An invitation
            to slow down, savor, and connect with the natural rhythm of the
            island.
          </h2>

          <p>
            From a sunrise breakfast with panoramic views of Cadlao Island and
            El Nido Bay to a three-course signature dinner under the stars,
            every meal is designed to complement the resort&apos;s sense of calm
            and understated luxury.
          </p>

          <p>
            The experience continues at our bar, where handcrafted cocktails
            highlight tropical botanicals, local spirits, and island fruits
            which are best enjoyed at sunset as the sky turns gold over the bay.
          </p>

          <div className="dining-food-gallery">
            <img src={breakfastImage} alt="Atalaya breakfast and fresh juice" />

            <img src={foodImage2} alt="Atalaya signature cuisine" />

            <img src={foodImage3} alt="Atalaya handcrafted cocktails" />
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="dining-team-section">
        <div className="dining-team-content">
          <div className="dining-team-text">
            <span className="dining-section-eyebrow">OUR TEAM</span>

            <h2>
              A Family united by
              <br />
              Hospitality
            </h2>

            <div className="dining-team-divider" />

            <p>
              Atalaya is more than a restaurant. It&apos;s a family united by a
              shared passion for hospitality. Our culinary team is led by locals
              who proudly call El Nido home.
            </p>

            <p>
              Our vision is simple: patronize local ingredients, embrace
              different culinary traditions, and create dishes that tell the
              story of Palawan.
            </p>

            <p>
              For us, great food begins with great people and we&apos;re proud
              to share our table with you.
            </p>
          </div>

          <div className="dining-team-image">
            <img
              src={farmImage}
              alt="Atalaya culinary team working with local farm produce"
            />
          </div>
        </div>
      </section>

      {/* ECO FOOD PROJECT */}
      <section className="dining-farm-section">
        <div className="dining-farm-content">
          <div className="dining-farm-image">
            <img
              src={farmImage2}
              alt="Atalaya's local farm in the hills of Palawan"
            />
          </div>

          <div className="dining-farm-text">
            <span className="dining-section-eyebrow">ECO FOOD PROJECT</span>

            <h2>
              Cultivating Flavor.
              <br />
              Growing Identity.
            </h2>

            <div className="dining-team-divider" />

            <p>
              Just 12 minutes from Atalaya, in New IbaJay, we&apos;ve started
              our own farm, the beginning of a long-term vision to connect our
              kitchen more closely to Palawan. There, we are growing specialty
              herbs, seasonal fruits, vegetables, and farm-fresh eggs.
            </p>

            <p>
              As the project grows, it lets our culinary team experiment with
              new flavors and bring more seasonality to the table. Alongside
              produce from trusted local farmers and seafood from Bacuit Bay,
              it&apos;s steadily shaping the way we cook.
            </p>

            <p>
              Atalaya blends the natural abundance of Palawan with different
              cuisines around the world.
            </p>

            {/* DISCOVER OUR CUISINE: Opens the Menu page */}
            <Link to="/dining/menu" className="dining-farm-button">
              DISCOVER OUR CUISINE
            </Link>
          </div>
        </div>
      </section>

      {/* MOMENTS AT ATALAYA — TWO ANIMATED GALLERY ROWS */}
      <section className="dining-moments-section">
        <div className="dining-moments-heading">
          <a
            href="https://www.instagram.com/atalayaresort.elnido/"
            target="_blank"
            rel="noreferrer"
            className="dining-moments-instagram"
          >
            @ATALAYARESORT.ELNIDO
          </a>

          <h2>Moments at Atalaya</h2>

          <p>
            A glimpse of culinary creations, craft botanical cocktails, and
            sunset memories overlooking Bacuit Bay.
          </p>
        </div>

        {/* FIRST ROW: Gallery images move left */}
        <div className="dining-moments-track dining-moments-track-left">
          {[0, 1].map((copy) => (
            <div
              className="dining-moments-row"
              key={`gallery-row-${copy}`}
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {galleryImages.map((item) => (
                <div
                  className="dining-moments-card"
                  key={`${copy}-${item.name}`}
                >
                  <img src={item.src} alt={item.name} />

                  <div className="dining-moments-overlay">
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* SECOND ROW: Food images move right */}
        <div className="dining-moments-track dining-moments-track-right">
          {[0, 1].map((copy) => (
            <div
              className="dining-moments-row"
              key={`food-row-${copy}`}
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {foodImages.map((item) => (
                <div
                  className="dining-moments-card"
                  key={`${copy}-${item.name}`}
                >
                  <img src={item.src} alt={item.name} />

                  <div className="dining-moments-overlay">
                    <span>{item.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* GOOGLE REVIEWS */}
      <section className="dining-reviews-section" aria-label="Guest reviews">
        <div className="dining-reviews-content">
          <p className="dining-reviews-eyebrow">LOVED BY OUR GUESTS</p>

          <div className="dining-reviews-stars" aria-label="5 out of 5 stars">
            <span aria-hidden="true">★★★★★</span>
          </div>

          <h2>
            5.0 <span>on Google</span>
          </h2>

          <p className="dining-reviews-description">
            Our guests are at the heart of everything we do. Thank you for
            sharing your moments at Atalaya with us.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <DiningFooter />
    </main>
  );
}

export default DiningPage;
