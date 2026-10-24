import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BookingPoliciesPage.css";

const BookingPoliciesPage = () => {
  const [activeTab, setActiveTab] = useState("cancellation");
  useEffect(() => {
    document.title = "Atalaya Resort | Policies";
  }, []);
  return (
    <main className="booking-policies-page">
      <header className="booking-navbar">
        <Link to="/" className="booking-brand">
          Atalaya Resort
        </Link>
        <nav className="booking-navigation">
          <Link to="/booking">Availability</Link>
          <Link to="/booking/about">About</Link>
          <Link to="/booking/contact">Contact</Link>
          <Link to="/booking/policies" className="booking-nav-active">
            Policies
          </Link>
        </nav>
        <span className="booking-currency">PHP</span>
      </header>
      <nav className="booking-policy-tabs" aria-label="Policy sections">
        <button
          type="button"
          className={activeTab === "cancellation" ? "active" : ""}
          onClick={() => setActiveTab("cancellation")}
        >
          Cancellation policy
        </button>
        <button
          type="button"
          className={activeTab === "terms" ? "active" : ""}
          onClick={() => setActiveTab("terms")}
        >
          Terms, conditions and privacy policy
        </button>
      </nav>
      <section className="booking-policies-content">
        {activeTab === "cancellation" ? (
          <article className="booking-policy-card">
            <h1>Cancellation policy</h1>
            <p>
              Cancellation is free of charge 7 days prior to the date of
              arrival, after this time we charge you 100% the room rate as
              cancellation fee.
            </p>
          </article>
        ) : (
          <article className="booking-policy-card booking-terms-card">
            <h1>Terms, conditions and privacy policy</h1>
            <div className="booking-policy-copy">
              <p>
                No gatherings and parties of any nature are allowed in the room.
                The Property reserves the right to evict any additional
                occupants in the room.
              </p>
              <p>This reservation is not transferable.</p>
              <p>
                In the event of no-show, a fee of one night’s room charge
                (inclusive of any applicable prevailing government tax) will be
                charged to your credit card provided at the time of reservation
                or as per any revised conditions of booking as per the offer.
              </p>
              <p>
                The Property reserves the right to send guests away from the
                Property due to their conduct and behaviour or for any other
                safety, security, medical reasons. This applies in particular,
                if Guests do not observe instructions given by Property
                employees, express themselves in a discriminating manner, harass
                or endanger other guests.
              </p>
              <p>
                Guests will not be permitted to compromise the health, safety
                and security aspects of the Property at any point of time.
              </p>
              <p>
                Guests are bound to produce an original proof of identity at the
                time of arrival in the Property.
              </p>
              <p>
                Special terms of offer will be applicable for the respective
                bookings and in case of conflict, the terms of such special
                offers will prevail.
              </p>
              <p>
                In case of conflict in the actual bill provided to you after the
                receipt of services, the terms of the bill will prevail.
              </p>
              <p>
                Neatness and hygiene should be adequately maintained by the
                Guest. The Guest should always adhere to the safety, security
                and hygiene advice duly provided by the Property and should
                avoid breaching the same. The Guest will be solely responsible
                for any such violation if identified.
              </p>
              <p>
                All the assets and valuables of the Property should be duly
                maintained adequately and should not be damaged or destroyed.
                The Property has the discretion to levy any charges in future if
                it is proven beyond doubt that such damage/destruction to the
                assets of the Property (both movable and immovable) have been
                done or caused by the Guest.
              </p>
              <p>
                If you have any allergies, sensitivities or intolerance to a
                particular fabric, material, cleaning product or food, it is the
                guest’s responsibility to advise Property management prior to
                arrival.
              </p>
              <p>
                Your valuables can be stored in a safety deposit box in your
                room or the Property can store your valuables upon request. The
                Property is entitled to collect a charge for storage of these
                items. In case the items are exceptionally valuable, you must
                notify the Property before storing them. The Property may refuse
                to store them.
              </p>
              <p>
                Management and staff work hard to provide a safe and secure
                environment. The Property takes no responsibility for personal
                possessions that are lost, stolen or misplaced whilst on the
                premises due to the acts and omissions of the guests themselves.
              </p>
              <p>
                Lost property found on the premises is logged and kept in a
                secure location. Thereafter items are either disposed of or
                donated to charity. The Property accepts no responsibility for
                contacting individuals in relation to lost property. Perishable
                items retrieved from rooms after check out are only held until
                close of business that day.
              </p>
              <p>
                Claimed items can be collected from the Property with valid
                identification or the Property can arrange postage on behalf of
                the guest at their expense.
              </p>
              <p>
                The Company reserves the right to change these terms and
                conditions at any time without prior notice. Revised terms and
                conditions will be posted on this website. Please check the
                latest information posted here.
              </p>
              <p>
                The Property does not accept liability for loss, travel delay,
                injury, damage, additional expenses or inconvenience caused by
                events beyond its control, including flight delays or
                cancellations, civil disturbance, defects in vehicles, strikes,
                theft, acts of terrorism, natural disaster, war, fire, floods,
                acts of God, government actions, changes to regulations,
                machinery failure, maintenance requirements or industrial
                action.
              </p>
              <p>
                Transportation to the airport is provided as an ancillary
                service and the Property is not accountable for whatsoever
                happens to the guests during such transits.
              </p>
            </div>
          </article>
        )}
      </section>
      <footer className="booking-footer">
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
};
export default BookingPoliciesPage;
