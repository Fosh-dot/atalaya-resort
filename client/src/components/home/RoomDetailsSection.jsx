import "./RoomDetailsSection.css";

const rooms = [
  {
    name: "Standard Room",
    description:
      "This intimate space is a tranquil escape, offering a calming partial sea view and designed to welcome you back after a day exploring the wonders of El Nido.",
    amenities: "Queen bed · Flat-screen TV · Refrigerator",
    price: "₱20,000",
  },
  {
    name: "Villa Standard Suite",
    description:
      "Perched on the hillside with sweeping ocean views, our Villa Standard Suites blend comfort and elegance in spacious interiors with a private balcony. Thoughtfully designed with tropical touches, they offer a serene island escape for couples or solo travelers.",
    amenities:
      "Private balcony · King bed · Flat-screen TV · Coffee machine · Refrigerator",
    price: "₱23,000",
  },
  {
    name: "Villa Superior Suite",
    description:
      "Atalaya's premium retreat, the Villa Superior Suite offers 90 sqm of elegant indoor-outdoor living with sweeping Bacuit Bay views. Tailored for couples, it exudes tranquility through refined design, natural textures, and coastal serenity.",
    amenities:
      "Private balcony · King bed · Flat-screen TV · Coffee machine · Refrigerator",
    price: "₱27,200",
  },
  {
    name: "Friends and Family Villa (4-Bedroom)",
    description:
      "A multi-level haven of privacy, this is Atalaya's exclusive villa featuring generous spaces, jacuzzi, kitchen, and dining areas. With flexible room options and premium amenities, it's perfect for families and friends seeking a shared island retreat.",
    amenities:
      "Shared jacuzzi · Full kitchen · Coffee machine · 2 refrigerators · 4 ensuite bedrooms · Private balcony · TV · 3 further bedrooms · Queen beds",
    price: "₱49,000",
  },
];

function RoomDetailsSection() {
  return (
    <section className="room-details-section">
      <div className="room-details-grid">
        {rooms.map((room) => (
          <article className="room-details-card" key={room.name}>
            <div className="room-details-description">
              <p>{room.description}</p>
            </div>

            <p className="room-details-amenities">{room.amenities}</p>

            <div className="room-details-booking">
              <h3>{room.price}</h3>

              <button
                type="button"
                className="room-book-now"
                onClick={() => {
                  // Connect to the booking flow when it is implemented.
                }}
              >
                BOOK NOW
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RoomDetailsSection;
