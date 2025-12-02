import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const VenueInfoSection = () => {
  return (
    <section className="venue-info-section py-5">
      <Container>
        {/* Intro */}
        <Row className="mb-4">
          <Col lg={10} className="mx-auto">
            <h4 className="fw-bold mb-4">
              Find the Perfect Wedding Venue with HappyWedz
            </h4>
            <p className="fs-14">
              Every bride dreams of saying “I do” in the perfect setting —
              whether it’s a romantic outdoor lawn, a luxurious 5-star banquet,
              a cozy boutique resort, or a breathtaking destination venue. At
              HappyWedz, we help you discover the best wedding venues across
              India, tailored to your style, budget, and guest preferences.
            </p>
            <p className="fs-14">
              Whether you're planning a grand reception in Jaipur, a beachside
              ceremony in Goa, an intimate celebration in your own city, or a
              dreamy destination wedding from Kashmir to Kanyakumari, HappyWedz
              brings you thousands of verified venues to choose from.
            </p>
            <p className="fs-14">
              From poolside mehendi spots to lush green lawns, open-air
              terraces, royal palaces, ballrooms, and elegant banquet halls —
              venue hunting becomes effortless with HappyWedz.
            </p>
          </Col>
        </Row>

        {/* Key Points */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h4 className="fw-semibold mb-3">
              Things to Keep in Mind While Booking Your Wedding Venue
            </h4>
            <ol>
              <li>
                <strong>Budget</strong>
                <br />
                Choose a venue that fits your budget while offering good
                amenities. Compare prices, inclusions, and package details to
                get maximum value.
              </li>
              <li>
                <strong>Location</strong>
                <br />
                For hometown weddings, pick a venue with easy accessibility for
                guests.
                <br />
                For destination weddings, check hotel photos, banquet areas,
                surroundings, and reviews before finalizing.
              </li>
              <li>
                <strong>Services & Facilities</strong>
                <br />
                Look for quality hospitality, catering options, décor support,
                24/7 assistance, valet parking, Wi-Fi, and accommodation if
                required.
              </li>
              <li>
                <strong>Banquet Type & Capacity</strong>
                <br />
                Ensure the venue comfortably fits your guest list and aligns
                with your preferred wedding style — indoor, outdoor, or hybrid.
              </li>
              <li>
                <strong>In-house Vendors</strong>
                <br />
                Many venues include catering, décor, DJs, sound, and support
                staff. This saves time, effort, and often lowers the total cost.
              </li>
              <li>
                <strong>Payment Terms & Policies</strong>
                <br />
                Always check advance payments, cancellation rules, and
                settlement timelines to avoid last-minute issues.
              </li>
            </ol>
            <p className="mt-4">
              A well-selected venue sets the entire mood for your celebration.
              The right venue elevates your wedding, while the wrong choice can
              add stress — so choose wisely with HappyWedz!
            </p>
          </Col>
        </Row>

        {/* More Than Venues */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h4 className="fw-semibold mb-3">
              More Than Just Venues – Your Complete Wedding Marketplace
            </h4>
            <p className="fs-16">
              At HappyWedz, you can plan your entire wedding in one place.
            </p>
            <p>Explore and book:</p>
            <ul className="list-unstyled">
              <li>✔ Wedding photographers</li>
              <li>✔ Bridal makeup artists</li>
              <li>✔ Mehendi artists</li>
              <li>✔ Decorators & floral stylists</li>
              <li>✔ Wedding planners & event managers</li>
              <li>✔ Caterers, DJs, choreographers & more</li>
            </ul>
            <p className="fs-14">
              Browse real photos, view verified reviews, compare prices, and
              contact your shortlisted vendors instantly — all on one trusted
              platform.
            </p>
          </Col>
        </Row>

        {/* App Section */}
        <Row>
          <Col lg={10} className="mx-auto">
            <h4 className="fw-semibold mb-3">
              Plan Anytime, Anywhere with the HappyWedz App
            </h4>
            <p className="fs-14">
              Take complete control of your wedding planning with the HappyWedz
              Wedding Planning App (Android & iOS).
            </p>
            <p className="fs-14">
              Search vendors, shortlist venues, track bookings, compare
              packages, and manage your entire wedding journey on the go.
            </p>
            <p className="fw-bold text-success mt-3 fs-14">
              With HappyWedz, planning your dream wedding has never been this
              simple — or this beautiful.
            </p>
          </Col>
        </Row>
      </Container>

      <style>{`
        .venue-info-section p,
        .venue-info-section li {
          text-align: justify;
          font-size: 1rem;
          line-height: 1.7;
          color: #444;
        }
        .venue-info-section ol {
          padding-left: 1.2rem;
          font-size: 16px;
        }
        .venue-info-section ol li {
          margin-bottom: 1.5rem;
          font-size: 14px;
        }
        .venue-info-section h2 {
          color: #e83581;
          font-size: 2.5rem;
        }
        .venue-info-section h3 {
          color: #e83581;
          font-size: 1.75rem;
          margin-top: 1.5rem;
        }
        .venue-info-section strong {
          color: #333;
          font-weight: 600;
        }
        .list-unstyled li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
          font-size: 14px;
        }
        @media (max-width: 767px) {
          .venue-info-section h2 {
            font-size: 1.8rem;
          }
          .venue-info-section h3 {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default VenueInfoSection;
