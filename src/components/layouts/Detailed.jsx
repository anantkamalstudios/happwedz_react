import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import vendorServicesApi from "../../services/api/vendorServicesApi";
import PricingModal from "./PricingModal";

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
import { GrFormNextLink } from "react-icons/gr";
import ReviewSection from "../pages/ReviewSection";
import { FaqQuestions } from "../pages/adminVendor/subVendors/FaqData";
import axios from "axios";

const Detailed = () => {
  const { id } = useParams();
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [images, setImages] = useState([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleShowPricingModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowPricingModal(true);
  };

  // Dynamic amenities based on API data
  const getAmenities = (data) => {
    if (!data?.attributes) return [];

    const amenities = [];

    // Capacity
    if (data.attributes.capacity_min || data.attributes.capacity_max) {
      const capacity =
        data.attributes.capacity_min && data.attributes.capacity_max
          ? `${data.attributes.capacity_min}-${data.attributes.capacity_max} Guests`
          : data.attributes.capacity_min
            ? `${data.attributes.capacity_min}+ Guests`
            : `Up to ${data.attributes.capacity_max} Guests`;
      amenities.push({ icon: <FaUsers />, name: `Capacity: ${capacity}` });
    }

    // Car parking
    if (data.attributes.car_parking === "yes") {
      amenities.push({ icon: <FaParking />, name: "Car Parking" });
    }

    // Indoor/Outdoor
    if (data.attributes.indoor_outdoor) {
      amenities.push({
        icon:
          data.attributes.indoor_outdoor === "indoor" ? (
            <FaBed />
          ) : (
            <FaSwimmingPool />
          ),
        name:
          data.attributes.indoor_outdoor === "indoor"
            ? "Indoor Venue"
            : "Outdoor Venue",
      });
    }

    // Alcohol policy
    if (data.attributes.alcohol_policy === "allowed") {
      amenities.push({ icon: <FaGlassCheers />, name: "Alcohol Allowed" });
    }

    return amenities;
  };

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [experience, setExperience] = useState("");
  const [spent, setSpent] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...filePreviews]);
  };

  const handleSubmit = () => {
    if (!rating || !experience) {
      alert("Please give a rating and write your experience.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating,
      experience,
      spent,
      images,
      user: "You",
      date: new Date().toLocaleDateString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    // Reset form
    setRating(0);
    setExperience("");
    setSpent("");
    setImages([]);
  };

  // Fetch venue data
  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await vendorServicesApi.getVendorServiceById(id);
        setVenueData(data);

        // Set images from API data
        const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";
        if (data.media?.gallery && data.media.gallery.length > 0) {
          const imageUrls = data.media.gallery
            .filter(
              (item) => typeof item === "string" && item.startsWith("/uploads/")
            )
            .map((item) => `${IMAGE_BASE_URL}${item}`);

          if (imageUrls.length > 0) {
            setImages(imageUrls);
            setMainImage(imageUrls[0]);
          } else {
            // Fallback to default image if no valid images found
            setMainImage("/images/default-venue.jpg");
          }
        } else {
          // Fallback to default image if no gallery
          setMainImage("/images/default-venue.jpg");
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      // Guard clause: wait until venueData and its nested properties are available
      if (!venueData?.vendor?.id || !venueData?.vendor?.vendorType?.id) {
        return;
      }

      const dynamicVendorId = venueData.vendor.id;
      const dynamicVendorTypeId = venueData.vendor.vendorType.id;

      try {
        // 1. Fetch the answers for the specific vendor
        const response = await axios.get(
          `https://happywedz.com/api/faq-answers/${dynamicVendorId}`
        );
        const answers = response.data || [];

        // 2. Create a quick-lookup map for the answers
        const answerMap = new Map(
          answers.map((a) => [a.faq_question_id, a.answer])
        );

        // 3. Find the correct question set based on vendor type
        const vendorTypeKey = Object.keys(FaqQuestions).find(
          (key) => FaqQuestions[key].vendor_type_id === dynamicVendorTypeId
        );

        if (vendorTypeKey) {
          const questions = FaqQuestions[vendorTypeKey].questions;
          // 4. Merge questions with answers
          const mergedFaqs = questions.map((q) => ({
            ...q,
            ans: answerMap.get(q.id) || "", // Use the answer or an empty string
          }));
          setFaqList(mergedFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQ answers:", error);
      }
    };

    fetchFaqData();
  }, [venueData]); // This effect now depends on venueData

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="venue-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading venue details...</p>
          </div>
        </Container>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="venue-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // No data state
  if (!venueData) {
    return (
      <div className="venue-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              Venue not found
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Create activeVendor from API data
  const activeVendor = {
    id: venueData.vendor_id, // Use vendor_id instead of service id
    name:
      venueData.attributes?.name ||
      venueData.vendor?.businessName ||
      "Unknown Venue",
    businessName: venueData.vendor?.businessName || venueData.attributes?.name,
    firstName: venueData.vendor?.firstName,
    lastName: venueData.vendor?.lastName,
    email: venueData.vendor?.email || venueData.attributes?.email,
    phone: venueData.vendor?.phone || venueData.attributes?.contact?.phone,
    city: venueData.vendor?.city || venueData.attributes?.location?.city,
    location: venueData.attributes?.location
      ? `${venueData.attributes.location.city}, ${venueData.attributes.location.state}`
      : "Location not specified",
    rating: 4.5, // Default rating since not in API
    reviews: 0, // Default reviews since not in API
    image: mainImage || "/images/default-venue.jpg",
  };

  function parseDbValue(value) {
    if (
      typeof value === "string" &&
      value.startsWith("{") &&
      value.endsWith("}")
    ) {
      return value
        .replace(/[{}]/g, "")
        .split(",")
        .map((item) => item.replace(/"/g, "").trim());
    } else {
      return [value];
    }
  }

  return (
    <div className="venue-detail-page">
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={venueData.attributes?.name || "Main Venue"}
                  className="main-image rounded-lg"
                />
              ) : (
                <div className="main-image rounded-lg d-flex align-items-center justify-content-center bg-light">
                  <p className="text-muted">No image available</p>
                </div>
              )}
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

            {images.length > 0 && (
              <div className="thumbnail-gallery mb-5">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={10}
                  slidesPerView={4}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  loop={images.length > 4}
                  grabCursor={true}
                  freeMode={true}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div
                        className={`thumbnail-item ${mainImage === img ? "active" : ""
                          } ${hoveredIndex !== null && hoveredIndex !== idx
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
            )}

            <div className="venue-description mb-5">
              <h3 className="details-section-title fw-bold fw-bold">
                About This Venue
              </h3>
              {venueData.attributes?.description ? (
                <div
                  className="description-text text-black"
                  style={{ textAlign: "justify" }}
                  dangerouslySetInnerHTML={{
                    __html: venueData.attributes.description,
                  }}
                />
              ) : (
                <p className="text-black text-justify">
                  No description available for this venue.
                </p>
              )}

              {venueData.attributes?.subtitle && (
                <p className="description-text text-black text-justify">
                  {venueData.attributes.subtitle}
                </p>
              )}
            </div>

            {/**  FaqQuestionAnswer Detailed */}

            <div className="my-4 border p-3 rounded">
              <h1 className="my-4">Frequently Asked Questions</h1>
              {faqList.length > 0 ? (
                faqList.map((ques, index) => {
                  const answers = parseDbValue(ques.ans);

                  return (
                    <div className="w-100 rounded border-bottom" key={index}>
                      <div className="p-2">
                        <p className="fw-semibold mb-1">{ques.text}</p>

                        {answers.length === 1 ? (
                          <p className="text-muted">{answers[0]}</p>
                        ) : (
                          <div className="row">
                            {answers.map((a, idx) => (
                              <div
                                className="col-md-4  d-flex align-items-start mb-2"
                                key={idx}
                              >
                                <i
                                  className="fa-solid fa-check me-2"
                                  style={{ color: "#0e6214", marginTop: "4px" }}
                                ></i>
                                <span className="text-muted">{a}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted">
                  No FAQ information available for this vendor.
                </p>
              )}
            </div>

            {/* Amenities */}
            <div className="venue-amenities mb-5">
              <h3 className="details-section-title fw-bold">
                Amenities & Services
              </h3>
              <Row>
                {getAmenities(venueData).length > 0 ? (
                  getAmenities(venueData).map((item, index) => (
                    <Col md={6} key={index}>
                      <div className="amenity-item">
                        <div className="amenity-icon">{item.icon}</div>
                        <span>{item.name}</span>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p className="text-muted">
                      No amenities information available.
                    </p>
                  </Col>
                )}
              </Row>
            </div>

            {/* Testimonials */}
            <div className="testimonials mb-5">
              <h3 className="details-section-title fw-bold">
                What Couples Say
              </h3>
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

          <Col lg={4} className="ps-5">
            <div className="venue-details-card">
              <div className="venue-info">
                <div className="mb-3">
                  <div className="d-flex">
                    <span className="fw-bold me-2 fs-30">
                      {venueData.attributes?.name || "Vendor Name"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center my-2">
                    <FaLocationDot className="me-1" size={15} color="black" />
                    <span>
                      {venueData.attributes?.location
                        ? `${venueData.attributes.location.city}, ${venueData.attributes.location.state}`
                        : "Location not specified"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="rating-badge">
                      <FaStar className="text-warning" />
                      <span className="rating-value">4.5</span>
                      <span className="reviews">(0 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="tags mb-4">
                  {venueData.subcategory?.name && (
                    <span className="tag resort">
                      {venueData.subcategory.name}
                    </span>
                  )}
                  {venueData.attributes?.is_featured && (
                    <span className="tag destination">Featured</span>
                  )}
                  {venueData.attributes?.indoor_outdoor && (
                    <span className="tag eco">
                      {venueData.attributes.indoor_outdoor}
                    </span>
                  )}
                </div>

                <div className="pricing mb-4">
                  <h4 className="price-title">Starting Price</h4>
                  <div className="price-value">
                    {venueData.attributes?.starting_price
                      ? `₹${venueData.attributes.starting_price.toLocaleString()} onwards`
                      : venueData.attributes?.price_range?.min
                        ? `₹${parseInt(
                          venueData.attributes.price_range.min
                        ).toLocaleString()} onwards`
                        : "Contact for pricing"}
                  </div>
                  <p className="price-note">
                    {venueData.attributes?.price_unit
                      ? `Price per ${venueData.attributes.price_unit}`
                      : "Price varies based on season and services"}
                  </p>
                </div>

                {/* <div className="contact-info mb-4">
                  <h4 className="contact-title">Contact Venue</h4>
                  {venueData.attributes?.contact?.phone && (
                    <div className="contact-item">
                      <FaPhoneAlt className="me-2" />
                      <span>{venueData.attributes.contact.phone}</span>
                    </div>
                  )}
                  {venueData.attributes?.email && (
                    <div className="contact-item">
                      <FaEnvelope className="me-2" />
                      <span>{venueData.attributes.email}</span>
                    </div>
                  )}
                  {venueData.attributes?.contact?.website && (
                    <div className="contact-item">
                      <FaCalendarAlt className="me-2" />
                      <a
                        href={venueData.attributes.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  {venueData.attributes?.timing_open &&
                    venueData.attributes?.timing_close && (
                      <div className="contact-item">
                        <FaCalendarAlt className="me-2" />
                        <span>
                          Open: {venueData.attributes.timing_open} -{" "}
                          {venueData.attributes.timing_close}
                        </span>
                      </div>
                    )}
                </div> */}

                <div className="action-buttons">
                  <div className="margin-b-50 d-flex h-center cursor-pointer">
                    <div style={{ width: "500px" }}>
                      <button
                        className="btn-primary w-100"
                        onClick={() =>
                          handleShowPricingModal(venueData.vendor_id)
                        }
                      >
                        Requesting Pricing
                      </button>
                    </div>
                  </div>
                  {/* <Button
                    variant="outline-light"
                    className="w-100 mb-3 border text-black detailed-btn-hover-pink"
                  >
                    Request Pricing & Availability
                  </Button> */}
                  {/* <Button variant="outline-primary" className="w-100">
                    Schedule a Tour
                  </Button> */}
                </div>
              </div>

              <div className="venue-map mt-4">
                <div
                  className="mb-2 fw-semibold text-dark"
                  style={{ fontSize: "1.05rem" }}
                >
                  View the venue location on Google Maps
                </div>

                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119975.8600521573!2d73.71764683167392!3d19.998203172021707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddd290b09914b3%3A0xcb07845d9d28215c!2s${encodeURIComponent(
                    venueData.attributes?.location
                      ? `${venueData.attributes.location.city}, ${venueData.attributes.location.state}`
                      : "Nashik, Maharashtra"
                  )}!5e0!3m2!1sen!2sin!4v1757499953908!5m2!1sen!2sin`}
                  width="100%"
                  height="350"
                  style={{
                    border: 0,
                    borderRadius: "12px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                    cursor: "grab",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Venue Location Map"
                ></iframe>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <section className="similar-venues py-5">
        <Container>
          <h3 className="details-section-title fw-bold text-center mb-4">
            Similar Venues You Might Like
          </h3>
          <Row>
            {images.slice(0, 3).map((img, index) => (
              <Col md={4} key={index}>
                <div className="similar-venue-card">
                  <div
                    className="venue-image"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                  <div className="venue-info">
                    <h5>{venueData.attributes?.name || "Similar Venue"}</h5>
                    <p className="location">
                      <FaMapMarkerAlt />{" "}
                      {venueData.attributes?.location
                        ? `${venueData.attributes.location.city}, ${venueData.attributes.location.state}`
                        : "Location not specified"}
                    </p>
                    <div className="d-flex justify-content-between">
                      <span className="rating">⭐ 4.5 (0 reviews)</span>
                      <span className="price">
                        {venueData.attributes?.starting_price
                          ? `₹${venueData.attributes.starting_price.toLocaleString()} onwards`
                          : "Contact for pricing"}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <div className="py-5">
        <ReviewSection vendor={activeVendor} />
      </div>

      <PricingModal
        show={showPricingModal}
        handleClose={() => setShowPricingModal(false)}
        vendorId={selectedVendorId}
      />
    </div>
  );
};

export default Detailed;
