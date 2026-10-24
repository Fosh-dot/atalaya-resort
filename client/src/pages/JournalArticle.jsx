import { Link } from "react-router-dom";
import DiningNavbar from "../components/dining/DiningNavbar";
import DiningFooter from "../components/dining/DiningFooter";
import "./JournalArticle.css";

import farmImage from "../assets/images/farm.jpg";

function JournalArticle() {
  return (
    <div className="journal-article-page">
      <DiningNavbar />

      <main className="journal-article-main">
        <article className="journal-article-container">
          {/* Back to Journal */}
          <Link to="/dining/journal" className="journal-back-link">
            <span aria-hidden="true">←</span> BACK TO JOURNAL
          </Link>

          {/* Article Heading */}
          <div className="journal-article-heading">
            <span className="journal-article-category">
              ECO FOOD PROJECT · JULY 2, 2026
            </span>

            <h1>Growing Our Eco Food Project in New Ibajay</h1>
          </div>

          {/* Featured Image */}
          <img
            className="journal-article-feature-image"
            src={farmImage}
            alt="Atalaya's eco food project in New Ibajay"
          />

          {/* Article Content */}
          <div className="journal-article-body">
            <p>
              Just twelve minutes from Atalaya, in New Ibajay, we've started our
              own farm. It's early days, the beginning of a long-term vision to
              connect our kitchen more closely to Palawan. There, we're growing
              specialty herbs, seasonal fruits, vegetables, and farm-fresh eggs.
            </p>

            <h2>Why we started</h2>

            <p>
              Great food begins with great ingredients. As the project grows, it
              lets our culinary team experiment with new flavors, harvest closer
              to their peak, and bring more seasonality to the table. Alongside
              produce from trusted local farmers and seafood from the waters of
              Bacuit Bay, it's steadily shaping the way we cook.
            </p>

            <h2>What's growing right now</h2>

            <ul>
              <li>Specialty herbs for our fire-grill and cocktails</li>
              <li>Seasonal fruits and vegetables</li>
              <li>Farm-fresh eggs</li>
            </ul>

            <p>
              Atalaya blends the natural abundance of Palawan with different
              cuisines around the world. We'll keep sharing updates here as the
              farm grows.
            </p>

            {/* Reserve a Table */}
            <Link
              to="/dining#dining-reservations"
              className="journal-article-reserve"
            >
              RESERVE A TABLE <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      </main>

      <DiningFooter />
    </div>
  );
}

export default JournalArticle;
