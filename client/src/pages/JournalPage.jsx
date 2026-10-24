import { Link } from "react-router-dom";
import DiningNavbar from "../components/dining/DiningNavbar";
import DiningFooter from "../components/dining/DiningFooter";
import "./JournalPage.css";

import heroImage from "../assets/images/hero-journal.jpg";
import farmImage from "../assets/images/farm.jpg";

function JournalPage() {
  return (
    <div className="journal-page">
      <DiningNavbar />

      {/* Journal Hero */}
      <section
        className="journal-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="journal-hero-overlay"></div>

        <div className="journal-hero-content">
          <span className="journal-eyebrow">STORIES FROM ATALAYA</span>

          <h1>Journal</h1>

          <p>
            Updates from our farm project, the stories behind our dishes,
            seasonal promos, and ideas for private dining overlooking Bacuit
            Bay.
          </p>
        </div>
      </section>

      {/* Journal Articles */}
      <section className="journal-articles">
        <div className="journal-articles-grid">
          <article className="journal-card">
            <div className="journal-card-image">
              <img src={farmImage} alt="Atalaya's eco food project and farm" />
            </div>

            <div className="journal-card-content">
              <span className="journal-card-category">
                ECO FOOD PROJECT · JULY 2026
              </span>

              <h2>Growing Our Eco Food Project in New Ibajay</h2>

              <p>
                Twelve minutes from the restaurant, our young farm is beginning
                to shape the way we cook: herbs, seasonal fruit, vegetables, and
                farm-fresh eggs.
              </p>

              <Link
                to="/dining/journal/eco-food-project"
                className="journal-read-more"
              >
                READ MORE <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <DiningFooter />
    </div>
  );
}

export default JournalPage;
