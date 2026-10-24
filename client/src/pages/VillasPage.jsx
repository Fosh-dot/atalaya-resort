import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./VillasPage.css";

import standardRoom from "../assets/images/room-standard1.webp";
import standardVilla from "../assets/images/room-villa-standard1.webp";
import superiorVilla from "../assets/images/room-villa-superior.webp";
import familyVilla from "../assets/images/room-friends-family-villa1.webp";

import roomLounge1 from "../assets/images/room-lounge.webp";
import roomLounge2 from "../assets/images/room-lounge2.webp";
import roomLounge3 from "../assets/images/room-lounge3.webp";

/* ACCOMMODATION HIGHLIGHTS */

const accommodationHighlights = [
  {
    image: roomLounge1,
    imageAlt: "Relaxing lounge space at Atalaya Resort",
    title: "Your Private Haven in El Nido",
    description:
      "Each room is designed to be a sanctuary, calm, minimal, and deeply restful. Tucked away in nature, our accommodations offer comfort without excess, luxury without noise. Whether you're here to unplug, reconnect, or simply breathe, this is where you'll feel at ease.",
  },
  {
    image: roomLounge2,
    imageAlt: "Thoughtfully designed accommodation interior",
    title: "Thoughtfully Designed Spaces",
    description:
      "We offer 12 private rooms, each one crafted with natural textures, warm tones, and large windows that open to the sights and sounds of El Nido. Expect spacious layouts, organic finishes, and subtle touches of Filipino craftsmanship.",
  },
  {
    image: roomLounge3,
    imageAlt: "Peaceful bedroom at Atalaya Resort",
    title: "Quiet Mornings. Serene Nights.",
    description:
      "Wake to birdsong and filtered sunlight. Spend your days by the pool, on a private deck, or immersed in nearby adventures. At night, retreat to quiet luxury and restful sleep, designed to restore.",
  },
];

/* VILLAS AND SUITES */

const roomDetails = [
  {
    name: "Standard Room",
    images: [standardRoom, roomLounge1, roomLounge2, roomLounge3],
    imageAlt: "Atalaya Resort Standard Room",
    description:
      "This intimate space is a tranquil escape, offering a calming partial sea view and designed to welcome you back after a day exploring the wonders of El Nido.",
    amenities: "Queen bed · Flat-screen TV · Refrigerator",
    price: "₱20,000",
  },
  {
    name: "Villa Standard Suite",
    images: [standardVilla, roomLounge2, roomLounge3, roomLounge1],
    imageAlt: "Atalaya Resort Villa Standard Suite",
    description:
      "Perched on the hillside with sweeping ocean views, our Villa Standard Suites blend comfort and elegance in spacious interiors with a private balcony. Thoughtfully designed with tropical touches, they offer a serene island escape for couples or solo travelers.",
    amenities:
      "Private balcony · King bed · Flat-screen TV · Coffee machine · Refrigerator",
    price: "₱23,000",
  },
  {
    name: "Villa Superior Suite",
    images: [superiorVilla, roomLounge3, roomLounge1, roomLounge2],
    imageAlt: "Atalaya Resort Villa Superior Suite",
    description:
      "Atalaya's premium retreat offers 90 sqm of elegant indoor-outdoor living with sweeping Bacuit Bay views. Tailored for couples, it exudes tranquility through refined design, natural textures, and coastal serenity.",
    amenities:
      "Private balcony · King bed · Flat-screen TV · Coffee machine · Refrigerator",
    price: "₱27,200",
  },
  {
    name: "Friends and Family Villa (4-Bedroom)",
    images: [familyVilla, roomLounge1, roomLounge3, roomLounge2],
    imageAlt: "Atalaya Resort Friends and Family Villa",
    description:
      "A multi-level haven of privacy, this is Atalaya's exclusive villa featuring generous spaces, jacuzzi, kitchen, and dining areas. With flexible room options and premium amenities, it's perfect for families and friends seeking a shared island retreat.",
    amenities:
      "Shared jacuzzi · Full kitchen · Coffee machine · 2 refrigerators · 4 ensuite bedrooms · Private balcony · TV · Queen beds",
    price: "₱49,000",
  },
];

function VillasPage() {
  const navigate = useNavigate();

  const goToAvailability = () => {
    navigate("/booking");
  };

  const [imageIndexes, setImageIndexes] = useState(roomDetails.map(() => 0));

  const changeImage = (roomIndex, direction) => {
    setImageIndexes((previousIndexes) =>
      previousIndexes.map((currentIndex, index) => {
        if (index !== roomIndex) return currentIndex;

        const totalImages = roomDetails[roomIndex].images.length;

        return (currentIndex + direction + totalImages) % totalImages;
      }),
    );
  };

  // Navigate to the Availability section on the booking page.

  return (
    <main className="villas-page">
      {/* HERO SECTION */}

      <section className="villas-page-hero">
        <Navbar />

        <div className="villas-page-hero-overlay" />

        <div className="villas-page-hero-content">
          <h1>SUITES &amp; VILLAS</h1>

          <p>
            Discover your ideal stay in El Nido, where comfort meets
            tranquility. Each villa and suite offers a private retreat with
            elegant spaces, soothing views, and the gentle rhythm of island
            life.
          </p>
        </div>
      </section>

      {/* CHECK DATES AND AVAILABILITY */}

      <section className="availability-section">
        <div className="availability-card">
          <h2>Check dates &amp; availability</h2>

          <p>Search rooms and book directly on our booking site.</p>

          <button
            type="button"
            className="availability-book-button"
            onClick={goToAvailability}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      {/* ACCOMMODATION HIGHLIGHTS */}

      <section className="accommodation-highlights">
        <div className="accommodation-highlights-grid">
          {accommodationHighlights.map((highlight) => (
            <article className="accommodation-highlight" key={highlight.title}>
              <div className="accommodation-highlight-image-wrapper">
                <img
                  src={highlight.image}
                  alt={highlight.imageAlt}
                  className="accommodation-highlight-image"
                  loading="lazy"
                />
              </div>

              <div className="accommodation-highlight-content">
                <h2>{highlight.title}</h2>

                <p>{highlight.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* VILLAS AND SUITES */}

      <section className="villas-room-details-section" id="accommodations">
        <div className="villas-room-details-heading">
          <h2>Villas &amp; Suites</h2>
        </div>

        <div className="villas-room-details-grid">
          {roomDetails.map((room, roomIndex) => (
            <article className="room-details-card" key={room.name}>
              {/* ROOM IMAGE CAROUSEL */}

              <div className="villas-room-image-wrapper">
                <img
                  src={room.images[imageIndexes[roomIndex]]}
                  alt={room.imageAlt}
                  className="villas-room-image"
                  loading="lazy"
                />

                <button
                  type="button"
                  className="villas-image-arrow villas-image-arrow-left"
                  aria-label={`Previous image for ${room.name}`}
                  onClick={() => changeImage(roomIndex, -1)}
                >
                  &#8249;
                </button>

                <button
                  type="button"
                  className="villas-image-arrow villas-image-arrow-right"
                  aria-label={`Next image for ${room.name}`}
                  onClick={() => changeImage(roomIndex, 1)}
                >
                  &#8250;
                </button>
              </div>

              {/* ROOM NAME AND DESCRIPTION */}

              <div className="room-details-description">
                <h2 className="villas-room-name">{room.name}</h2>

                <p>{room.description}</p>
              </div>

              {/* AMENITIES */}

              <p className="room-details-amenities">{room.amenities}</p>

              {/* PRICE AND BOOKING */}

              <div className="room-details-booking">
                <h3>{room.price}</h3>

                <button
                  type="button"
                  className="room-book-now"
                  onClick={goToAvailability}
                >
                  BOOK NOW
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <Footer />
    </main>
  );
}

export default VillasPage;
