import { useState } from "react";
import "./GoogleReviewsSection.css";

const reviews = [
  {
    id: 1,
    name: "Ivonne Iiz Volkert",
    initials: "IV",
    date: "3 months ago",
    text: "An incredible stay. I can't say enough good things: the staff made the experience exceptional, and our villa had the most beautiful view and a stunning modern-rustic design. One of the best trips we've ever had.",
  },
  {
    id: 2,
    name: "Annie Rose Latoza",
    initials: "AL",
    date: "a month ago",
    text: "Breathtaking views and top-tier food! Peaceful, with an incredible vantage point for the sunset. A must-try for anyone looking for a more elevated experience in El Nido.",
  },
  {
    id: 3,
    name: "vg",
    initials: "VG",
    date: "2 months ago",
    text: "Amazing luxurious stay with breathtaking views of the islands. The rooms are truly luxurious and the culinary experience was outstanding. A perfect choice for a relaxing, upscale stay in El Nido.",
  },
  {
    id: 4,
    name: "Teymour Benet",
    initials: "TB",
    date: "a month ago",
    text: "Best choice for our trip to Palawan. Incredible views from our room waking up to those islands, and it may be the best food we had in El Nido. Do not leave without trying the Kalamansi Pie!",
  },
  {
    id: 5,
    name: "Dina Pataric",
    initials: "DP",
    date: "a month ago",
    text: "Amazing hotel! Spacious rooms with a stunning ocean view and a breathtaking sunset. The staff is amazing and the chef's food is delicious. Would definitely recommend and come again!",
  },
  {
    id: 6,
    name: "Elcin Kocoglu",
    initials: "EK",
    date: "4 months ago",
    text: "The hotel was truly excellent. The property was exceptionally clean and well maintained, and the view was absolutely stunning, especially at sunset.",
  },
  {
    id: 7,
    name: "Carole Donaghy",
    initials: "CD",
    date: "a month ago",
    text: "The views are genuinely unreal, especially at sunset. The rooms are beautiful, the restaurant serves amazing food, and the staff are wonderful. We'll 100% be coming back next time we're in El Nido!",
  },
  {
    id: 8,
    name: "Janina Manipol",
    initials: "JM",
    date: "a week ago",
    text: "Loved my stay at Atalaya! From the peaceful setting and beautiful villas to the yummy food and super friendly staff, such a relaxing and memorable trip. Already missing the sunsets and slow mornings.",
  },
];

function GoogleIcon() {
  return (
    <span className="google-review-icon" aria-label="Google">
      <span>G</span>
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="google-review-card">
      <div className="google-review-header">
        <div className="google-review-avatar" aria-hidden="true">
          {review.initials}
        </div>

        <div className="google-review-person">
          <h3>{review.name}</h3>
          <p>{review.date}</p>
        </div>

        <GoogleIcon />
      </div>

      <div className="google-review-stars" aria-label="5 out of 5 stars">
        ★★★★★
      </div>

      <p className="google-review-text">{review.text}</p>
    </article>
  );
}

function GoogleReviewsSection() {
  const [showMore, setShowMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleReviews = [
    ...reviews.slice(activeIndex),
    ...reviews.slice(0, activeIndex),
  ];

  const nextReview = () => {
    setActiveIndex((current) => (current + 1) % reviews.length);
  };

  const previousReview = () => {
    setActiveIndex(
      (current) => (current - 1 + reviews.length) % reviews.length,
    );
  };

  return (
    <section className="google-reviews-section">
      <div className="google-reviews-heading">
        <p className="google-reviews-eyebrow">
          <span></span>
          GUEST REVIEWS
        </p>

        <h2>
          Loved on <span>Google</span>
        </h2>

        <div className="google-reviews-rating">
          <span className="google-reviews-score">4.9</span>

          <span className="google-reviews-rating-stars" aria-label="5 stars">
            ★★★★★
          </span>

          <span className="google-reviews-rating-caption">
            · 163 Google reviews · Top rated
          </span>
        </div>
      </div>

      <div className="google-reviews-carousel">
        <button
          type="button"
          className="google-reviews-arrow google-reviews-arrow-left"
          onClick={previousReview}
          aria-label="Previous reviews"
        >
          ‹
        </button>

        <div className="google-reviews-track-window">
          <div className="google-reviews-track" key={activeIndex}>
            {visibleReviews.map((review) => (
              <div className="google-reviews-slide" key={review.id}>
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="google-reviews-arrow google-reviews-arrow-right"
          onClick={nextReview}
          aria-label="Next reviews"
        >
          ›
        </button>
      </div>

      {showMore && (
        <div className="google-reviews-expanded">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <div className="google-reviews-footer">
        <button
          type="button"
          className="google-reviews-read-more"
          onClick={() => setShowMore((current) => !current)}
          aria-expanded={showMore}
        >
          {showMore ? "SHOW LESS" : "READ MORE"}
          <span
            className={
              showMore ? "read-more-chevron is-open" : "read-more-chevron"
            }
          >
            ↓
          </span>
        </button>
      </div>
    </section>
  );
}

export default GoogleReviewsSection;
