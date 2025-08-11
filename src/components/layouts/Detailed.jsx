import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

import {
  FaStar,
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaUsers,
  FaUtensils,
  FaBed,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaParking,
  FaGlassCheers,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Detailed = () => {
  const [mainImage, setMainImage] = useState(
    "https://cdn0.weddingwire.in/vendor/4255/original/960/jpg/photographer-avshkaar-photography-weddingphotography-2_15_314255-165946397244869.webp"
  );

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = [
    "https://happywedz.com/wp-content/uploads/2024/04/Picture9.jpg",
    "https://happywedz.com/wp-content/uploads/2024/04/Picture19.jpg",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
  ];

  const amenities = [
    { icon: <FaUsers />, name: "Capacity: 500 Guests" },
    { icon: <FaUtensils />, name: "In-house Catering" },
    { icon: <FaBed />, name: "Accommodation" },
    { icon: <FaWifi />, name: "WiFi" },
    { icon: <FaCar />, name: "Valet Parking" },
    { icon: <FaSwimmingPool />, name: "Swimming Pool" },
    { icon: <FaParking />, name: "Ample Parking" },
    { icon: <FaGlassCheers />, name: "Bar Services" },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="venue-detail-page">
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-4">
              <img
                src={mainImage}
                alt="Main Venue"
                className="main-image rounded-lg"
              />
              <button
                className="favorite-btn"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? (
                  <FaHeart className="text-danger" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>

            <div className="thumbnail-gallery mb-5">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={10}
                slidesPerView={4}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
                grabCursor={true}
                freeMode={true}
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      className={`thumbnail-item ${
                        mainImage === img ? "active" : ""
                      } ${
                        hoveredIndex !== null && hoveredIndex !== idx
                          ? "blurred"
                          : ""
                      }`}
                      onClick={() => setMainImage(img)}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="img-fluid rounded"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="venue-description mb-5">
              <h3 className="section-title">About This Venue</h3>
              <p className="description-text">
                Nestled in the heart of Nashik's wine country, Grape County Eco
                Resort & Spa offers a luxurious setting for your dream wedding.
                Surrounded by lush vineyards and scenic beauty, this
                eco-friendly resort combines natural elegance with modern
                amenities to create unforgettable moments.
              </p>
              <p className="description-text">
                Our venue features beautifully landscaped gardens, elegant
                banquet halls, and intimate spaces for ceremonies and
                receptions. With a dedicated team of wedding specialists, we
                ensure every detail is perfectly executed to create the wedding
                of your dreams.
              </p>
            </div>

            {/* Amenities */}
            <div className="venue-amenities mb-5">
              <h3 className="section-title">Amenities & Services</h3>
              <Row>
                {amenities.map((item, index) => (
                  <Col md={6} key={index}>
                    <div className="amenity-item">
                      <div className="amenity-icon">{item.icon}</div>
                      <span>{item.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Testimonials */}
            <div className="testimonials mb-5">
              <h3 className="section-title">What Couples Say</h3>
              <Row>
                <Col md={6}>
                  <div className="testimonial-card">
                    <div className="rating">
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                    </div>
                    <p className="testimonial-text">
                      "Our wedding at Grape County was magical! The team went
                      above and beyond to make our day perfect."
                    </p>
                    <p className="testimonial-author">
                      - Priya & Raj, March 2023
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="testimonial-card">
                    <div className="rating">
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                    </div>
                    <p className="testimonial-text">
                      "The venue was stunning, and the staff was incredibly
                      attentive. Everything was flawless!"
                    </p>
                    <p className="testimonial-author">
                      - Ananya & Vikram, November 2022
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Side: Venue Details */}
          <Col lg={4}>
            <div className="venue-details-card">
              <div className="venue-info">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="rating-badge">
                    <FaStar className="text-warning" />
                    <span className="rating-value">4.8</span>
                    <span className="reviews">(120 reviews)</span>
                  </div>
                  <div className="location">
                    <FaLocationDot className="me-1" color="black" />
                    <span>Nashik, Maharashtra</span>
                  </div>
                </div>

                <div className="tags mb-4">
                  <span className="tag resort">Resort</span>
                  <span className="tag destination">Destination Wedding</span>
                  <span className="tag eco">Eco-Friendly</span>
                </div>

                <div className="pricing mb-4">
                  <h4 className="price-title">Starting Price</h4>
                  <div className="price-value">₹1,50,000 onwards</div>
                  <p className="price-note">
                    Price varies based on season and services
                  </p>
                </div>

                <div className="contact-info mb-4">
                  <h4 className="contact-title">Contact Venue</h4>
                  <div className="contact-item">
                    <FaPhoneAlt className="me-2" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope className="me-2" />
                    <span>info@grapecounty.com</span>
                  </div>
                  <div className="contact-item">
                    <FaCalendarAlt className="me-2" />
                    <span>Available for tours daily</span>
                  </div>
                </div>

                <div className="action-buttons">
                  <Button
                    variant="outline-light"
                    className="w-100 mb-3 border text-black detailed-btn-hover-pink"
                  >
                    Request Pricing & Availability
                  </Button>
                  {/* <Button variant="outline-primary" className="w-100">
                    Schedule a Tour
                  </Button> */}
                </div>
              </div>

              <div className="venue-map mt-4">
                <div className="map-placeholder">
                  <div className="map-overlay">
                    <Button variant="light">View on Map</Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Similar Venues */}
      <section className="similar-venues py-5">
        <Container>
          <h3 className="section-title text-center mb-4">
            Similar Venues You Might Like
          </h3>
          <Row>
            {[1, 2, 3].map((item) => (
              <Col md={4} key={item}>
                <div className="similar-venue-card">
                  <div
                    className="venue-image"
                    style={{ backgroundImage: `url(${images[item]})` }}
                  ></div>
                  <div className="venue-info">
                    <h5>Lavender Vineyard Resort</h5>
                    <p className="location">
                      <FaMapMarkerAlt /> Pune, Maharashtra
                    </p>
                    <div className="d-flex justify-content-between">
                      <span className="rating">⭐ 4.7 (98 reviews)</span>
                      <span className="price">₹1.8 Lakh onwards</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Detailed;
