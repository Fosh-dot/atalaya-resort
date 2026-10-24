import { useRef, useState } from "react";
import "./VillasSection.css";

// STANDARD ROOM IMAGES — 12 PHOTOS
import standardRoom from "../../assets/images/room-standard1.webp";
import standardRoom2 from "../../assets/images/room-standard2.webp";
import standardRoom3 from "../../assets/images/room-standard3.webp";
import standardRoom4 from "../../assets/images/room-standard4.webp";
import standardRoom5 from "../../assets/images/room-standard5.webp";
import standardRoom6 from "../../assets/images/room-standard6.webp";
import standardRoom7 from "../../assets/images/room-standard7.webp";
import standardRoom8 from "../../assets/images/room-standard8.webp";
import standardRoom9 from "../../assets/images/room-standard9.webp";
import standardRoom10 from "../../assets/images/room-standard10.webp";
import standardRoom11 from "../../assets/images/room-standard11.webp";
import standardRoom12 from "../../assets/images/room-standard12.webp";

// VILLA STANDARD SUITE IMAGES — 18 PHOTOS
import standardVilla1 from "../../assets/images/room-villa-standard1.webp";
import standardVilla2 from "../../assets/images/room-villa-standard2.webp";
import standardVilla3 from "../../assets/images/room-villa-standard3.webp";
import standardVilla4 from "../../assets/images/room-villa-standard4.webp";
import standardVilla5 from "../../assets/images/room-villa-standard5.webp";
import standardVilla6 from "../../assets/images/room-villa-standard6.webp";
import standardVilla7 from "../../assets/images/room-villa-standard7.webp";
import standardVilla8 from "../../assets/images/room-villa-standard8.webp";
import standardVilla9 from "../../assets/images/room-villa-standard9.webp";
import standardVilla10 from "../../assets/images/room-villa-standard10.webp";
import standardVilla11 from "../../assets/images/room-villa-standard11.webp";
import standardVilla12 from "../../assets/images/room-villa-standard12.webp";
import standardVilla13 from "../../assets/images/room-villa-standard13.webp";
import standardVilla14 from "../../assets/images/room-villa-standard14.webp";
import standardVilla15 from "../../assets/images/room-villa-standard15.webp";
import standardVilla16 from "../../assets/images/room-villa-standard16.webp";
import standardVilla17 from "../../assets/images/room-villa-standard17.webp";
import standardVilla18 from "../../assets/images/room-villa-standard18.webp";

// VILLA SUPERIOR SUITE IMAGES — 11 PHOTOS
import superiorVilla from "../../assets/images/room-villa-superior.webp";
import superiorVilla2 from "../../assets/images/room-villa-superior2.webp";
import superiorVilla3 from "../../assets/images/room-villa-superior3.webp";
import superiorVilla4 from "../../assets/images/room-villa-superior4.webp";
import superiorVilla5 from "../../assets/images/room-villa-superior5.webp";
import superiorVilla6 from "../../assets/images/room-villa-superior6.webp";
import superiorVilla7 from "../../assets/images/room-villa-superior7.webp";
import superiorVilla8 from "../../assets/images/room-villa-superior8.webp";
import superiorVilla9 from "../../assets/images/room-villa-superior9.webp";
import superiorVilla10 from "../../assets/images/room-villa-superior10.webp";
import superiorVilla11 from "../../assets/images/room-villa-superior11.webp";
// FRIENDS AND FAMILY VILLA — 14 PHOTOS
import familyVilla1 from "../../assets/images/room-friends-family-villa1.webp";
import familyVilla2 from "../../assets/images/room-friends-family-villa2.webp";
import familyVilla3 from "../../assets/images/room-friends-family-villa3.webp";
import familyVilla4 from "../../assets/images/room-friends-family-villa4.webp";
import familyVilla5 from "../../assets/images/room-friends-family-villa5.webp";
import familyVilla6 from "../../assets/images/room-friends-family-villa6.webp";
import familyVilla7 from "../../assets/images/room-friends-family-villa7.webp";
import familyVilla8 from "../../assets/images/room-friends-family-villa8.webp";
import familyVilla9 from "../../assets/images/room-friends-family-villa9.webp";
import familyVilla10 from "../../assets/images/room-friends-family-villa10.webp";
import familyVilla11 from "../../assets/images/room-friends-family-villa11.webp";
import familyVilla12 from "../../assets/images/room-friends-family-villa12.webp";
import familyVilla13 from "../../assets/images/room-friends-family-villa13.webp";
import familyVilla14 from "../../assets/images/room-friends-family-villa14.webp";

// STANDARD ROOM GALLERY
const standardRoomImages = [
  standardRoom,
  standardRoom2,
  standardRoom3,
  standardRoom4,
  standardRoom5,
  standardRoom6,
  standardRoom7,
  standardRoom8,
  standardRoom9,
  standardRoom10,
  standardRoom11,
  standardRoom12,
];

// VILLA STANDARD SUITE GALLERY
const standardVillaImages = [
  standardVilla1,
  standardVilla2,
  standardVilla3,
  standardVilla4,
  standardVilla5,
  standardVilla6,
  standardVilla7,
  standardVilla8,
  standardVilla9,
  standardVilla10,
  standardVilla11,
  standardVilla12,
  standardVilla13,
  standardVilla14,
  standardVilla15,
  standardVilla16,
  standardVilla17,
  standardVilla18,
];

const superiorVillaImages = [
  superiorVilla,
  superiorVilla2,
  superiorVilla3,
  superiorVilla4,
  superiorVilla5,
  superiorVilla6,
  superiorVilla7,
  superiorVilla8,
  superiorVilla9,
  superiorVilla10,
  superiorVilla11,
];

const familyVillaImages = [
  familyVilla1,
  familyVilla2,
  familyVilla3,
  familyVilla4,
  familyVilla5,
  familyVilla6,
  familyVilla7,
  familyVilla8,
  familyVilla9,
  familyVilla10,
  familyVilla11,
  familyVilla12,
  familyVilla13,
  familyVilla14,
];

// ACCOMMODATIONS
const villas = [
  {
    id: 1,
    name: "Standard Room",
    size: "33 m²",
    guests: "Up to 2 guests",
    images: standardRoomImages,
    alt: "Atalaya Standard Room",
  },
  {
    id: 2,
    name: "Villa Standard Suite",
    size: "66 m²",
    guests: "Up to 2 guests",
    images: standardVillaImages,
    alt: "Atalaya Villa Standard Suite",
  },
  {
    id: 3,
    name: "Villa Superior Suite",
    size: "90 m²",
    guests: "Up to 2 guests",
    images: superiorVillaImages,
    alt: "Atalaya Villa Superior Suite",
  },

  {
    id: 4,
    name: "Friends and Family Villa (4-Bedroom)",
    size: "220 m²",
    guests: "Up to 8 guests",
    images: familyVillaImages,
    alt: "Atalaya Friends and Family Villa",
  },
];

// INDIVIDUAL ROOM CARD
function VillaCard({ villa }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  const hasMultipleImages = villa.images.length > 1;

  function changeImage(direction) {
    setCurrentImage((current) => {
      return (current + direction + villa.images.length) % villa.images.length;
    });
  }

  return (
    <>
      <article className="villa-card">
        <div className="villa-image-wrapper">
          <img
            src={villa.images[currentImage]}
            alt={`${villa.alt} photo ${currentImage + 1}`}
            className="villa-image"
          />

          {hasMultipleImages && (
            <>
              <button
                type="button"
                className="villa-photo-arrow villa-photo-arrow-left"
                aria-label={`Previous ${villa.name} photo`}
                onClick={() => changeImage(-1)}
              >
                ‹
              </button>

              <button
                type="button"
                className="villa-photo-arrow villa-photo-arrow-right"
                aria-label={`Next ${villa.name} photo`}
                onClick={() => changeImage(1)}
              >
                ›
              </button>
            </>
          )}

          <button
            type="button"
            className="villa-all-photos"
            onClick={() => setShowGallery(true)}
          >
            <span aria-hidden="true">▦</span>
            VIEW ALL PHOTOS
          </button>
        </div>

        <div className="villa-details">
          <p className="villa-capacity">
            {villa.size} · {villa.guests}
          </p>

          <h3>{villa.name}</h3>
        </div>
      </article>

      {showGallery && (
        <div
          className="villa-gallery-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${villa.name} photo gallery`}
          onClick={() => setShowGallery(false)}
        >
          <button
            type="button"
            className="villa-gallery-close"
            aria-label="Close gallery"
            onClick={() => setShowGallery(false)}
          >
            ×
          </button>

          <button
            type="button"
            className="villa-gallery-arrow"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              changeImage(-1);
            }}
          >
            ‹
          </button>

          <img
            src={villa.images[currentImage]}
            alt={`${villa.alt} photo ${currentImage + 1}`}
            className="villa-gallery-image"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="villa-gallery-arrow"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              changeImage(1);
            }}
          >
            ›
          </button>

          <p className="villa-gallery-counter">
            {currentImage + 1} / {villa.images.length}
          </p>
        </div>
      )}
    </>
  );
}

// VILLAS SECTION
function VillasSection() {
  const sliderRef = useRef(null);

  function scrollSlider(direction) {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction * sliderRef.current.clientWidth * 0.65,
      behavior: "smooth",
    });
  }

  return (
    <section className="villas-section" id="accommodations">
      <div className="villas-heading-row">
        <h2>Villas &amp; Suites</h2>

        <a href="#all-villas" className="villas-view-button">
          VIEW
        </a>
      </div>

      <div className="villas-slider-wrapper">
        <button
          type="button"
          className="villas-slider-arrow villas-slider-arrow-left"
          aria-label="Scroll to previous rooms"
          onClick={() => scrollSlider(-1)}
        >
          ‹
        </button>

        <div className="villas-slider" ref={sliderRef}>
          {villas.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>

        <button
          type="button"
          className="villas-slider-arrow villas-slider-arrow-right"
          aria-label="Scroll to more rooms"
          onClick={() => scrollSlider(1)}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default VillasSection;
