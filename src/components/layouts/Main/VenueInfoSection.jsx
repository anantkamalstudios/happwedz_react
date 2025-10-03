import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const VenueInfoSection = () => {
  return (
    <section className="venue-info-section py-5">
      <Container>
        {/* Intro */}
        <Row className="mb-4">
          <Col lg={10} className="mx-auto">
            <h2 className="fw-bold mb-4">
              Find the Perfect Wedding Venue with HappyWedz
            </h2>
            <p>
              Every bride dreams of saying “I do” in a stunning setting—whether
              it’s an intimate celebration at a chic resort, a grand reception
              in a luxurious hotel, or a cozy gathering in a small yet beautiful
              banquet hall. At Happy Wedz, we bring you a wide range of wedding
              venues to match every couple’s vision and budget.
            </p>
            <p>
              From dreamy destination weddings in <strong>Kashmir</strong> or{" "}
              <strong>Kanyakumari </strong>
              to elegant celebrations in your own city, we’ve got thousands of
              venue options for you. Whether you’re searching for a poolside
              spot for your mehendi, a lush green lawn for your cocktail party,
              or a spacious hall for your wedding day, HappyWedz makes
              venue-hunting simple and stress-free.
            </p>
          </Col>
        </Row>

        {/* Key Points */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h3 className="fw-semibold mb-3">
              Things to Keep in Mind While Booking Your Wedding Venue
            </h3>
            <ol>
              <li>
                <strong>Budget:</strong> Stick to your budget and explore venues
                that give you the best value without compromising on services.
              </li>
              <li>
                <strong>Location:</strong> If you’re marrying in your hometown,
                pick a venue that’s easily accessible. For destination weddings,
                research thoroughly—check hotel photos, banquet areas, and
                amenities before finalizing.
              </li>
              <li>
                <strong>Services & Facilities:</strong> Look for great
                hospitality—food options, décor, 24x7 service, parking, and
                Wi-Fi.
              </li>
              <li>
                <strong>Banquet & Capacity:</strong> Ensure the venue fits your
                guest list and matches your event’s ambiance.
              </li>
              <li>
                <strong>In-house Vendors:</strong> Many venues provide catering,
                décor, DJs, and planners—saving time and money.
              </li>
              <li>
                <strong>Payment Terms:</strong> Clarify advance requirements and
                settlement timelines to avoid last-minute stress.
              </li>
            </ol>
            <p>
              A well-chosen venue sets the tone for your celebration. With the
              right place, your wedding becomes unforgettable, but the wrong
              choice can turn things stressful—so plan wisely!
            </p>
          </Col>
        </Row>

        {/* More Than Venues */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <h3 className="fw-semibold mb-3">More Than Just Venues</h3>
            <p>
              At HappyWedz, you can do much more than find your perfect wedding
              venue. Explore and book photographers, bridal makeup artists,
              décor specialists, wedding planners, and other vendors with ease.
              Browse real photos, read reviews, compare prices, and connect with
              your shortlisted vendors directly.
            </p>
            <p>
              And for convenience on the go, download the{" "}
              <strong>HappyWedz Wedding Planning App</strong> (available on
              Android & iOS) to manage all your wedding needs anytime, anywhere.
            </p>
          </Col>
        </Row>

        {/* Closing */}
        <Row>
          <Col lg={10} className="mx-auto text-center">
            <h4 className="fw-bold text-success">
              With HappyWedz, planning your dream wedding has never been this
              simple!
            </h4>
          </Col>
        </Row>
      </Container>

      <style>{`
        .venue-info-section p,
        .venue-info-section li {
          text-align: justify;
          font-size: 1rem;
          line-height: 1.7;
        }
        .venue-info-section ol {
          padding-left: 1.2rem;
        }
        .venue-info-section h2, 
        .venue-info-section h3, 
        .venue-info-section h4 {
          color: #e83581;
        }
        @media (max-width: 767px) {
          .venue-info-section h2 {
            font-size: 1.5rem;
          }
          .venue-info-section h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
};

export default VenueInfoSection;
