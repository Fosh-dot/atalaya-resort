import DiningNavbar from "../components/dining/DiningNavbar";
import DiningFooter from "../components/dining/DiningFooter";
import "./MenuPage.css";

import menuHeroImage from "../assets/images/hero-menu00.jpg";

import food1 from "../assets/images/food1.jpg";
import food2 from "../assets/images/food2.jpg";
import food3 from "../assets/images/food3.jpg";
import food4 from "../assets/images/food4.jpg";
import food5 from "../assets/images/food5.jpg";

function MenuPage() {
  const dishes = [
    { image: food1, name: "Trio of Kinilaw" },
    { image: food2, name: "Watermelon Margarita" },
    { image: food3, name: "Dragonfruit Cheesecake" },
    { image: food4, name: "Pork Katsu" },
    { image: food5, name: "Argentinian Grill" },
  ];

  return (
    <main className="restaurant-menu-page">
      {/* Menu Hero */}
      <section
        className="restaurant-menu-hero"
        style={{ backgroundImage: `url(${menuHeroImage})` }}
      >
        <div className="restaurant-menu-hero-overlay" />

        <DiningNavbar />

        <div className="restaurant-menu-hero-content">
          <p className="restaurant-menu-eyebrow">OUR CULINARY CURATION</p>

          <h1>The Menu</h1>

          <p className="restaurant-menu-description">
            Dishes rooted in Palawan produce and fused with creative
            Mediterranean methods,
            <br className="restaurant-menu-desktop-break" />
            with a growing share of greens, fruits, and herbs from our own
            garden.
          </p>
        </div>
      </section>

      {/* Guest Favourites */}
      <section className="restaurant-menu-content">
        <p className="restaurant-menu-content-eyebrow">GUEST FAVOURITES</p>

        <h2>Our Bestsellers</h2>

        <p className="restaurant-menu-content-description">
          A look at the dishes our guests love most, so you know exactly what to
          expect.
        </p>

        {/* Moving Food Gallery */}
        <div className="restaurant-menu-marquee">
          <div className="restaurant-menu-track">
            {[0, 1].map((copy) => (
              <div
                className="restaurant-menu-row"
                key={copy}
                aria-hidden={copy === 1}
              >
                {dishes.map((dish, index) => (
                  <article className="restaurant-menu-card" key={index}>
                    <img src={dish.image} alt={copy === 1 ? "" : dish.name} />

                    <div className="restaurant-menu-card-caption">
                      <h3>{dish.name}</h3>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="restaurant-menu-categories">
        <nav
          className="restaurant-menu-category-list"
          aria-label="Menu categories"
        >
          {[
            "BREAKFAST",
            "LUNCH",
            "DINNER",
            "COCKTAILS",
            "WINES",
            "BEVERAGES",
          ].map((category, index) => (
            <button
              key={category}
              type="button"
              className={`restaurant-menu-category ${
                index === 0 ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </section>

      <DiningFooter />
    </main>
  );
}

export default MenuPage;
