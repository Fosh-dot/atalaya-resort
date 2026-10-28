import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./BookingPage.css";

import book1 from "../assets/images/book.jpg";
import book2 from "../assets/images/book2.jpg";
import book3 from "../assets/images/book3.jpg";
import book4 from "../assets/images/book4.jpg";
import book5 from "../assets/images/book5.jpg";
import book6 from "../assets/images/book6.jpg";
import book7 from "../assets/images/book7.jpg";
import book8 from "../assets/images/book8.jpg";
import book9 from "../assets/images/book9.jpg";
import book10 from "../assets/images/book10.jpg";
import book11 from "../assets/images/book11.jpg";
import book12 from "../assets/images/book12.jpg";
import book13 from "../assets/images/book13.jpg";
import book14 from "../assets/images/book14.jpg";
import book15 from "../assets/images/book15.jpg";

import standardRoomImage from "../assets/images/room-standard1.webp";
import superiorVillaImage from "../assets/images/room-villa-superior.webp";
import familyVillaImage from "../assets/images/room-friends-family-villa1.webp";

const standardSuiteImages = [
  book1,
  book2,
  book3,
  book4,
  book5,
  book6,
  book7,
  book8,
  book9,
  book10,
  book11,
  book12,
  book13,
  book14,
  book15,
];

const accommodations = [
  {
    id: 1,
    name: "Villa Standard Suite",
    images: standardSuiteImages,
    guests: 2,
    beds: "1 King bed",
    bathrooms: "1 Bathroom",
    size: "70m²",
    amenities:
      "Garden view • Non-smoking • Mini Bar • Bathrobes Provided • Body soap • Dining room seats • Bathroom amenities",
    description:
      "Perched on the hillside with sweeping ocean views, our Villa Standard Suites blend comfort and elegance in spacious interiors with a private island atmosphere.",
    rate: 23000,
    rateName: "Standard Rate",
    paymentTerms: "40% deposit required",
    available: true,
  },
  {
    id: 2,
    name: "Villa Superior Suite",
    images: [superiorVillaImage],
    guests: 2,
    beds: "1 King bed",
    bathrooms: "1 Bathroom",
    size: "80m²",
    amenities:
      "Garden view • Non-smoking • Luxury linen type • Espresso Machine • Shampoo • Linen and Towels Provided",
    description:
      "Atalaya's premium retreat, the Villa Superior Suite offers elegant indoor-outdoor living with sweeping Bacuit Bay views.",
    rate: 27200,
    rateName: "Standard Rate",
    paymentTerms: "Book now, pay later",
    available: true,
  },
  {
    id: 3,
    name: "Standard Room",
    images: [standardRoomImage],
    guests: 2,
    beds: "1 Queen bed",
    bathrooms: "1 Bathroom",
    size: "33m²",
    amenities:
      "Garden view • Non-smoking • Linen and Towels Provided • Fire extinguishers • Stairs • Luxury linen type • Espresso Machine",
    description:
      "This intimate space is a tranquil escape, offering a calming partial sea view and designed to welcome you back after a day exploring the island.",
    rate: 20000,
    rateName: "Standard Rate",
    paymentTerms: "40% deposit required",
    available: true,
  },
  {
    id: 4,
    name: "Friends and Family Villa",
    images: [familyVillaImage],
    guests: 8,
    beds: "3 King beds and 1 Queen bed",
    bathrooms: "Multiple bathrooms",
    size: "240m²",
    amenities:
      "Garden view • Non-smoking • Air conditioned • Mini Bar • Bathroom amenities • Bath • Luxury linen type • Balcony",
    description:
      "A multi-level haven of privacy and luxury, designed for families and groups seeking a memorable island stay.",
    rate: 49000,
    rateName: "Standard Rate",
    paymentTerms: "40% deposit required",
    available: true,
  },
];

function formatDate(dateString) {
  if (!dateString) return "Select date";

  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function BookingPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#booking-search") {
      const timer = setTimeout(() => {
        document.getElementById("booking-search")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.title = "Atalaya Resort | Availability";
  }, []);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [promoCode, setPromoCode] = useState("");
  const [showPromo, setShowPromo] = useState(false);
  const [selectedRates, setSelectedRates] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [expandedRooms, setExpandedRooms] = useState([]);
  const [apiAccommodations, setApiAccommodations] = useState([]);

  const [publicSettings, setPublicSettings] = useState({
    resort_name: "Atalaya Resort",
    payment_instructions: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    account_currency: "PHP",
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState("full");
  const [transactionReference, setTransactionReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptMessage, setReceiptMessage] = useState("");
  const [receiptError, setReceiptError] = useState("");
  const [showGuestForm, setShowGuestForm] = useState(false);

  const [guestDetails, setGuestDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    adults: 2,
    children: 0,
  });

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAccommodations() {
      try {
        const response = await fetch(`${API_BASE_URL}/accommodations`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load accommodations.");
        }

        if (active) {
          setApiAccommodations(Array.isArray(result.data) ? result.data : []);
        }
      } catch {
        if (active) {
          setBookingError(
            "Could not connect to the booking server. Check that the backend is running.",
          );
        }
      }
    }

    loadAccommodations();

    return () => {
      active = false;
    };
  }, [API_BASE_URL]);

  useEffect(() => {
    let active = true;

    async function loadPublicSettings() {
      try {
        const response = await fetch(`${API_BASE_URL}/public/settings`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load payment details.");
        }

        if (active) {
          setPublicSettings((previous) => ({
            ...previous,
            ...result.data,
          }));
        }
      } catch (error) {
        if (active) {
          setReceiptError(
            error.message || "Could not load the resort's payment details.",
          );
        }
      }
    }

    loadPublicSettings();

    return () => {
      active = false;
    };
  }, [API_BASE_URL]);

  async function uploadPaymentReceipt(event) {
    event.preventDefault();
    setReceiptError("");
    setReceiptMessage("");

    if (!bookingSuccess?.paymentId) {
      setReceiptError(
        "A payment record was not returned for this booking. Please contact the resort before uploading a receipt.",
      );
      return;
    }

    if (!receiptFile) {
      setReceiptError("Please choose your payment receipt first.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(receiptFile.type)) {
      setReceiptError("Upload a JPG, PNG, WEBP, or PDF receipt.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (receiptFile.size > maxSize) {
      setReceiptError("The receipt must be 5 MB or smaller.");
      return;
    }

    setReceiptLoading(true);

    try {
      if (!transactionReference.trim()) {
        setReceiptError("Please enter your transaction reference.");
        return;
      }

      if (!paymentDate) {
        setReceiptError("Please select the date you made the payment.");
        return;
      }

      const formData = new FormData();
      formData.append("receipt", receiptFile);
      formData.append("payment_method", "bank_transfer");
      formData.append("transaction_reference", transactionReference.trim());
      formData.append("payment_date", paymentDate);

      const response = await fetch(
        `${API_BASE_URL}/payments/${bookingSuccess.paymentId}/slip`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Receipt upload failed.");
      }

      setReceiptMessage(
        result.message ||
          "Your payment receipt was uploaded successfully and is awaiting review.",
      );

      setReceiptFile(null);
      setTransactionReference("");

      const fileInput = document.getElementById("booking-payment-receipt");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      setReceiptError(error.message || "Could not upload your receipt.");
    } finally {
      setReceiptLoading(false);
    }
  }

  // Fixed room matching: Friends and Family Villa in the UI is stored
  // as Friends and Family Villa (4-Bedroom) in the TiDB Cloud database.
  const normalizeAccommodationName = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const apiAccommodationByName = useMemo(() => {
    return new Map(
      apiAccommodations.map((item) => [
        normalizeAccommodationName(item.name),
        item,
      ]),
    );
  }, [apiAccommodations]);

  const liveAccommodations = accommodations.map((room) => {
    const normalizedName = normalizeAccommodationName(room.name);

    const live =
      apiAccommodationByName.get(normalizedName) ||
      (room.id === 4
        ? apiAccommodations.find(
            (item) =>
              normalizeAccommodationName(item.name) ===
              normalizeAccommodationName(
                "Friends and Family Villa (4-Bedroom)",
              ),
          )
        : null);

    return {
      ...room,
      databaseId: live?.id ?? null,
      rate:
        live?.price_per_night != null
          ? Number(live.price_per_night)
          : room.rate,
    };
  });

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(`${checkOut}T12:00:00`) -
              new Date(`${checkIn}T12:00:00`)) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const selectedAccommodations = liveAccommodations.filter((room) =>
    selectedRates.includes(room.id),
  );

  const selectedRoom = selectedAccommodations[0] || null;

  const hasUnconfirmedPrice = selectedAccommodations.some(
    (room) => room.rate === null || !room.databaseId,
  );

  const totalPrice = selectedRoom
    ? (selectedRoom.rate ?? 0) * nights * rooms
    : 0;

  function changeImage(roomId, direction, imagesLength) {
    setImageIndexes((previous) => {
      const currentIndex = previous[roomId] || 0;

      return {
        ...previous,
        [roomId]: (currentIndex + direction + imagesLength) % imagesLength,
      };
    });
  }

  function toggleRate(room) {
    if (!room.available || !room.databaseId) {
      setBookingError(
        "This accommodation is not connected to the database yet.",
      );
      return;
    }

    setBookingError("");
    setBookingSuccess(null);
    setShowGuestForm(false);

    setSelectedRates((previous) =>
      previous.includes(room.id) ? [] : [room.id],
    );
  }

  async function submitBooking(event) {
    event.preventDefault();
    setBookingError("");
    setBookingSuccess(null);

    if (!selectedRoom?.databaseId) {
      setBookingError("Please select one accommodation type first.");
      return;
    }

    if (!checkIn || !checkOut || nights < 1) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: guestDetails.fullName.trim(),
          email: guestDetails.email.trim(),
          phone: guestDetails.phone.trim(),
          checkIn,
          checkOut,
          adults: Number(guestDetails.adults),
          children: Number(guestDetails.children),
          accommodationId: Number(selectedRoom.databaseId),
          quantity: Number(rooms),
          paymentPlan,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Reservation could not be submitted.",
        );
      }

      setBookingSuccess(result.data);
      setShowGuestForm(false);
    } catch (error) {
      setBookingError(
        error.message || "Something went wrong while submitting your booking.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  function toggleRoomDetails(roomId) {
    setExpandedRooms((previous) =>
      previous.includes(roomId)
        ? previous.filter((id) => id !== roomId)
        : [...previous, roomId],
    );
  }
  return (
    <main className="booking-page">
      {/* BOOKING WEBSITE NAVIGATION */}
      <header className="booking-navbar">
        <Link to="/" className="booking-brand">
          Atalaya Resort
        </Link>

        <nav className="booking-navigation">
          <a href="#booking-search" className="booking-nav-active">
            Availability
          </a>

          <Link to="/booking/about">About</Link>
          <Link to="/booking/contact">Contact</Link>
          <Link to="/booking/policies">Policies</Link>
        </nav>

        <span className="booking-currency">PHP</span>
      </header>

      {/* TOP IMAGE */}
      <section
        className="booking-hero"
        style={{ backgroundImage: `url(${book1})` }}
        aria-label="Atalaya Resort"
      />

      {/* DATE AND GUEST SEARCH */}
      <section className="booking-search-section" id="booking-search">
        <div className="booking-search-panel">
          <label className="booking-field booking-date-field">
            <span>Select dates</span>

            <div className="booking-date-inputs">
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                aria-label="Check-in date"
                value={checkIn}
                onChange={(event) => {
                  const newCheckIn = event.target.value;

                  setCheckIn(newCheckIn);

                  if (checkOut && newCheckIn >= checkOut) {
                    setCheckOut("");
                  }

                  setSelectedRates([]);
                }}
              />

              <span>→</span>

              <input
                type="date"
                aria-label="Check-out date"
                min={checkIn || new Date().toISOString().slice(0, 10)}
                value={checkOut}
                onChange={(event) => {
                  setCheckOut(event.target.value);
                  setSelectedRates([]);
                }}
              />
            </div>
          </label>

          <div className="booking-field booking-guests-field">
            <span>Select rooms and guests</span>

            <div className="booking-guest-controls">
              <label>
                <span className="booking-control-icon">♟</span>

                <select
                  aria-label="Number of rooms"
                  value={rooms}
                  onChange={(event) => {
                    setRooms(Number(event.target.value));
                    setBookingError("");
                    setBookingSuccess(null);
                  }}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(
                    (number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "Room" : "Rooms"}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label>
                <select
                  aria-label="Number of guests"
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                >
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(
                    (number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "Guest" : "Guests"}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>
          </div>

          <div className="booking-promo-wrapper">
            <button
              type="button"
              className="booking-promo-toggle"
              onClick={() => setShowPromo(!showPromo)}
            >
              <span className="booking-tag-icon">◇</span>
              Add promo code
            </button>

            {showPromo && (
              <input
                className="booking-promo-input"
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
              />
            )}
          </div>
        </div>
      </section>

      {/* ROOM RESULTS AND BOOKING SUMMARY */}
      <section className="booking-results">
        <div className="booking-accommodations">
          {liveAccommodations.map((room) => {
            const imageIndex = imageIndexes[room.id] || 0;
            const isSelected = selectedRates.includes(room.id);
            const isExpanded = expandedRooms.includes(room.id);

            return (
              <article
                className={`booking-accommodation-card ${
                  !room.available ? "booking-room-unavailable" : ""
                }`}
                key={room.id}
              >
                {/* ROOM INFORMATION */}
                <div className="booking-room-top">
                  <div className="booking-accommodation-image">
                    <img
                      src={room.images[imageIndex]}
                      alt={`${room.name} photo ${imageIndex + 1}`}
                    />

                    {room.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="booking-image-arrow booking-image-previous"
                          onClick={() =>
                            changeImage(room.id, -1, room.images.length)
                          }
                          aria-label={`Previous ${room.name} photo`}
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          className="booking-image-arrow booking-image-next"
                          onClick={() =>
                            changeImage(room.id, 1, room.images.length)
                          }
                          aria-label={`Next ${room.name} photo`}
                        >
                          ›
                        </button>

                        <span className="booking-image-counter">
                          {imageIndex + 1} / {room.images.length}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="booking-accommodation-info">
                    <h2>{room.name}</h2>

                    <div className="booking-room-features">
                      <span>♟ Sleeps {room.guests}</span>
                      <span>▱ {room.beds}</span>
                      <span>♧ {room.bathrooms}</span>
                    </div>

                    <p className="booking-room-description">
                      <span>{room.size}</span>
                      <span> • </span>
                      {room.amenities}
                      <br />
                      {room.description}
                    </p>

                    {isExpanded && (
                      <div className="booking-extra-details">
                        <p>
                          <strong>Accommodation:</strong> {room.name}
                        </p>

                        <p>
                          <strong>Size:</strong> {room.size}
                        </p>

                        <p>
                          <strong>Maximum guests:</strong> {room.guests}
                        </p>

                        <p>
                          <strong>Facilities:</strong> {room.amenities}
                        </p>

                        <p>
                          <strong>Rate:</strong>{" "}
                          {room.rate !== null
                            ? `PHP ${room.rate.toLocaleString("en-PH")}.00 per night`
                            : "Price to be confirmed"}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="booking-more-info"
                      onClick={() => toggleRoomDetails(room.id)}
                    >
                      {isExpanded ? "Less info" : "More info"}
                    </button>
                  </div>
                </div>

                {/* RATE SECTION */}
                {room.available ? (
                  <div className="booking-rate-section">
                    <div className="booking-rate-details">
                      <h3>{room.rateName}</h3>

                      <p
                        className={
                          room.paymentTerms === "Book now, pay later"
                            ? "booking-payment-later"
                            : "booking-deposit-required"
                        }
                      >
                        <span>
                          {room.paymentTerms === "Book now, pay later"
                            ? "✓"
                            : "ⓘ"}
                        </span>

                        {room.paymentTerms}
                      </p>

                      <button
                        type="button"
                        className="booking-more-info"
                        onClick={() => toggleRoomDetails(room.id)}
                      >
                        More info
                      </button>
                    </div>

                    <div className="booking-rate-price">
                      <strong>
                        {room.rate !== null
                          ? `PHP ${room.rate.toLocaleString("en-PH")}.00`
                          : "Price to be confirmed"}
                      </strong>

                      <span>
                        {room.rate !== null
                          ? `Cost for ${nights} ${
                              nights === 1 ? "night" : "nights"
                            }, ${guests} ${guests === 1 ? "guest" : "guests"}`
                          : "Nightly rate not yet confirmed"}
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`booking-select-button ${
                        isSelected ? "booking-selected" : ""
                      }`}
                      onClick={() => toggleRate(room)}
                    >
                      {isSelected ? "Selected ✓" : "Select"}
                    </button>
                  </div>
                ) : (
                  <div className="booking-unavailable-section">
                    <p>
                      <strong>
                        {formatDate(checkIn)} – {formatDate(checkOut)}
                      </strong>{" "}
                      are unavailable
                    </p>

                    <button
                      type="button"
                      className="booking-find-dates-button"
                      onClick={() => {
                        document
                          .getElementById("booking-search")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      ▦ &nbsp; Find available dates
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* RIGHT-SIDE BOOKING SUMMARY */}
        <aside className="booking-summary">
          <div className="booking-summary-dates">
            <span>
              {formatDate(checkIn)} – {formatDate(checkOut)}
            </span>

            <span>
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>

          <p className="booking-summary-guests">
            {rooms} {rooms === 1 ? "room" : "rooms"}, {guests}{" "}
            {guests === 1 ? "guest" : "guests"}
          </p>

          {selectedAccommodations.length > 0 && (
            <div className="booking-selected-rooms">
              {selectedAccommodations.map((room) => (
                <div key={room.id} className="booking-selected-room">
                  <span>{room.name}</span>

                  <button
                    type="button"
                    onClick={() => toggleRate(room)}
                    aria-label={`Remove ${room.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="booking-total">
                <span>Estimated total</span>

                <strong>
                  {hasUnconfirmedPrice
                    ? "Price to be confirmed"
                    : `PHP ${totalPrice.toLocaleString("en-PH")}.00`}
                </strong>
              </div>
            </div>
          )}

          <hr />

          <p className="booking-summary-prompt">
            {selectedRates.length > 0
              ? hasUnconfirmedPrice
                ? "Some selected room prices need confirmation"
                : "Your selected accommodation"
              : "Select a rate to continue"}
          </p>

          <button
            type="button"
            className="booking-summary-button"
            disabled={selectedRates.length === 0}
            onClick={() => {
              setBookingError("");
              setBookingSuccess(null);

              if (!checkIn || !checkOut || nights <= 0) {
                setBookingError(
                  "Please select valid check-in and check-out dates.",
                );
                return;
              }

              if (hasUnconfirmedPrice) {
                setBookingError(
                  "This accommodation is not connected to the database yet.",
                );
                return;
              }

              setShowGuestForm(true);
            }}
          >
            Book
          </button>

          {bookingError && (
            <p className="booking-form-error" role="alert">
              {bookingError}
            </p>
          )}
          {bookingSuccess && (
            <div className="booking-confirmation" role="status">
              <h3>Reservation submitted</h3>
              <p>
                <strong>Reference:</strong> {bookingSuccess.bookingReference}
              </p>
              <p>
                <strong>Accommodation:</strong> {bookingSuccess.accommodation}
              </p>
              <p>
                <strong>Stay:</strong> {bookingSuccess.nights} night(s)
              </p>
              <p>
                <strong>Total:</strong> {bookingSuccess.currency}{" "}
                {Number(bookingSuccess.totalAmount).toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p>
                <strong>Payment plan:</strong>{" "}
                {bookingSuccess.paymentPlan === "deposit"
                  ? "60% deposit"
                  : "Full payment"}
              </p>
              <p>
                <strong>Amount due initially:</strong> {bookingSuccess.currency}{" "}
                {Number(
                  bookingSuccess.initialPaymentAmount ??
                    bookingSuccess.totalAmount,
                ).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </p>
              <p>
                <strong>Remaining balance:</strong> {bookingSuccess.currency}{" "}
                {Number(bookingSuccess.remainingBalance ?? 0).toLocaleString(
                  "en-PH",
                  { minimumFractionDigits: 2 },
                )}
              </p>
              <p>
                <strong>Status:</strong> {bookingSuccess.status}
              </p>
              <p>
                Your reservation has been received. Please use the payment
                details below and upload your receipt for review.
              </p>

              <div className="booking-payment-details">
                <h4>Payment instructions</h4>

                {publicSettings.bank_name && (
                  <p>
                    <strong>Bank:</strong> {publicSettings.bank_name}
                  </p>
                )}

                {publicSettings.account_name && (
                  <p>
                    <strong>Account name:</strong> {publicSettings.account_name}
                  </p>
                )}

                {publicSettings.account_number && (
                  <p>
                    <strong>Account number:</strong>{" "}
                    {publicSettings.account_number}
                  </p>
                )}

                <p>
                  <strong>Currency:</strong>{" "}
                  {publicSettings.account_currency ||
                    bookingSuccess.currency ||
                    "PHP"}
                </p>

                {publicSettings.payment_instructions && (
                  <p>{publicSettings.payment_instructions}</p>
                )}

                {!publicSettings.bank_name &&
                  !publicSettings.account_name &&
                  !publicSettings.account_number && (
                    <p>
                      The resort has not published its bank details yet. Please
                      contact the resort before making a transfer.
                    </p>
                  )}
              </div>

              {bookingSuccess.paymentId ? (
                <form
                  className="booking-guest-form booking-payment-upload-form"
                  onSubmit={uploadPaymentReceipt}
                >
                  <h4>Upload payment receipt</h4>

                  <p>
                    Booking reference:{" "}
                    <strong>{bookingSuccess.bookingReference}</strong>
                  </p>

                  <p>
                    Amount to submit:{" "}
                    <strong>
                      {bookingSuccess.currency}{" "}
                      {Number(
                        bookingSuccess.initialPaymentAmount ??
                          bookingSuccess.totalAmount,
                      ).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </strong>
                  </p>

                  <div className="booking-payment-method">
                    <label>Payment method</label>
                    <p>Bank Transfer</p>
                  </div>

                  <label htmlFor="booking-transaction-reference">
                    Transaction reference
                  </label>
                  <input
                    id="booking-transaction-reference"
                    type="text"
                    maxLength={150}
                    value={transactionReference}
                    onChange={(event) =>
                      setTransactionReference(event.target.value)
                    }
                    placeholder="Enter your transfer or deposit reference"
                    required
                  />

                  <label htmlFor="booking-payment-date">Payment date</label>
                  <input
                    id="booking-payment-date"
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    required
                  />

                  <label htmlFor="booking-payment-receipt">
                    Payment slip (JPG, PNG, WEBP, or PDF; max 5 MB)
                  </label>
                  <input
                    id="booking-payment-receipt"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    required
                    onChange={(event) => {
                      setReceiptFile(event.target.files?.[0] || null);
                      setReceiptError("");
                      setReceiptMessage("");
                    }}
                  />

                  <button
                    type="submit"
                    className="booking-summary-button"
                    disabled={receiptLoading}
                  >
                    {receiptLoading
                      ? "Uploading receipt..."
                      : "Submit payment receipt"}
                  </button>

                  {receiptMessage && (
                    <p className="booking-payment-success" role="status">
                      {receiptMessage}
                    </p>
                  )}

                  {receiptError && (
                    <p className="booking-form-error" role="alert">
                      {receiptError}
                    </p>
                  )}
                </form>
              ) : (
                <p className="booking-form-error">
                  Payment upload will be available once the booking API returns
                  a payment ID.
                </p>
              )}
            </div>
          )}

          {showGuestForm && (
            <form className="booking-guest-form" onSubmit={submitBooking}>
              <h3>Guest details</h3>

              <fieldset className="booking-payment-plan-options">
                <legend>Choose your payment plan</legend>

                <label>
                  <input
                    type="radio"
                    name="paymentPlan"
                    value="full"
                    checked={paymentPlan === "full"}
                    onChange={() => setPaymentPlan("full")}
                  />
                  <span>
                    <strong>Full payment (100%)</strong>
                    <small>Pay the entire booking total now.</small>
                  </span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="paymentPlan"
                    value="deposit"
                    checked={paymentPlan === "deposit"}
                    onChange={() => setPaymentPlan("deposit")}
                  />
                  <span>
                    <strong>60% deposit</strong>
                    <small>Pay 60% now and the remaining 40% later.</small>
                  </span>
                </label>

                <div className="booking-payment-plan-summary">
                  <p>
                    <span>Booking total</span>
                    <strong>
                      PHP{" "}
                      {totalPrice.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </p>

                  <p>
                    <span>Payment due initially</span>
                    <strong>
                      PHP{" "}
                      {(paymentPlan === "deposit"
                        ? Math.ceil(Math.round(totalPrice * 100) * 0.6) / 100
                        : totalPrice
                      ).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </p>

                  <p>
                    <span>Remaining balance</span>
                    <strong>
                      PHP{" "}
                      {(
                        Math.round(
                          totalPrice * 100 -
                            (paymentPlan === "deposit"
                              ? Math.ceil(Math.round(totalPrice * 100) * 0.6)
                              : Math.round(totalPrice * 100)),
                        ) / 100
                      ).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </p>
                </div>
              </fieldset>

              <label>
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={200}
                  value={guestDetails.fullName}
                  onChange={(event) =>
                    setGuestDetails({
                      ...guestDetails,
                      fullName: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={guestDetails.email}
                  onChange={(event) =>
                    setGuestDetails({
                      ...guestDetails,
                      email: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Phone number
                <input
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={40}
                  value={guestDetails.phone}
                  onChange={(event) =>
                    setGuestDetails({
                      ...guestDetails,
                      phone: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Adults
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={guestDetails.adults}
                  onChange={(event) =>
                    setGuestDetails({
                      ...guestDetails,
                      adults: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Children
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={guestDetails.children}
                  onChange={(event) =>
                    setGuestDetails({
                      ...guestDetails,
                      children: event.target.value,
                    })
                  }
                />
              </label>

              <button
                type="submit"
                className="booking-summary-button"
                disabled={bookingLoading}
              >
                {bookingLoading ? "Submitting..." : "Submit reservation"}
              </button>
            </form>
          )}
        </aside>
      </section>

      {/* BOOKING FOOTER */}
      <footer className="booking-footer" id="booking-policies">
        <div className="booking-footer-links">
          <Link to="/booking/policies">Policies</Link>
        </div>

        <div className="booking-footer-bottom">
          <span>Copyright © 2026</span>
          <span>Atalaya Resort</span>
          <span>El Nido · Palawan · Philippines</span>
          <Link to="/">Return to website</Link>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <button
        type="button"
        className="booking-back-to-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </main>
  );
}

export default BookingPage;
