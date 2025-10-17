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
  FaParking,
  FaGlassCheers,
  FaCalendarAlt,
} from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import ReviewSection from "../pages/ReviewSection";
import { FaqQuestions } from "../pages/adminVendor/subVendors/FaqData";
import axios from "axios";

// Helper function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
};

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

  /**
   * DYNAMIC AMENITIES/FEATURES based on vendor type (Venue or Photographer)
   */
  const getVendorFeatures = (data) => {
    if (!data || !data.attributes) return [];

    const attributes = data.attributes;
    const amenities = [];
    const vendorType = attributes.vendor_type;

    // --- Vendor-Agnostic Policies ---
    if (attributes.payment_terms) {
      amenities.push({
        icon: <FaCalendarAlt />,
        name: `Payment: ${attributes.payment_terms}`,
      });
    }
    if (attributes.travel_info) {
      amenities.push({
        icon: <FaMapMarkerAlt />,
        name: `Travel: ${attributes.travel_info}`,
      });
    }
    // HappyWedz tenure shown under Services & Offerings
    if (attributes.happywedz_since || attributes.HappyWedz) {
      const sinceValue = attributes.happywedz_since || attributes.HappyWedz;
      amenities.push({
        icon: <FaStar />,
        name: `HappyWedz: ${sinceValue}`,
      });
    }

    // --- VENUE-SPECIFIC FEATURES ---
    if (
      vendorType === "Venues" ||
      attributes.catering_policy ||
      attributes.rooms
    ) {
      // --- Catering Policy ---
      if (attributes.catering_policy) {
        amenities.push({
          icon: <FaUtensils />,
          name: `Catering: ${capitalizeWords(attributes.catering_policy)}`,
        });
      }

      // --- Decor Policy ---
      if (attributes.decor_policy) {
        amenities.push({
          icon: <FaStar />,
          name: `Decor: ${capitalizeWords(attributes.decor_policy)}`,
        });
      }

      // --- Alcohol Policy ---
      let alcoholStatus = attributes.alcohol_policy
        ? capitalizeWords(attributes.alcohol_policy)
        : "";
      if (
        attributes.about_us &&
        attributes.about_us.includes(
          "In house alcohol available, outside alcohol not permitted"
        )
      ) {
        alcoholStatus = "In-house Only (Outside Not Permitted)";
      }
      if (alcoholStatus) {
        amenities.push({
          icon: <FaGlassCheers />,
          name: `Alcohol: ${alcoholStatus}`,
        });
      }

      // --- Parking ---
      if (
        attributes.about_us &&
        attributes.about_us.includes("Sufficient Parking available")
      ) {
        amenities.push({
          icon: <FaParking />,
          name: "Sufficient Car Parking Available",
        });
      }

      // --- Number of Rooms (Accommodation) ---
      if (attributes.rooms) {
        amenities.push({
          icon: <FaBed />,
          name: `${attributes.rooms} Accommodation Rooms`,
        });
      }

      // --- Venue Area/Capacity Breakdown (from 'area' attribute) ---
      if (attributes.area) {
        const areas = attributes.area.split(",").map((s) => s.trim());
        areas.forEach((area) => {
          const match = area.match(
            /(\w+)\s*(\d+)\s*Seating\s*\|\s*(\d+)\s*Floating\s*(.*)/i
          );
          if (match) {
            const [, , seating, floating, locationPart] = match;
            let venueName =
              locationPart.replace(/^(,)\s*/, "").trim() || area.split(" ")[0];
            venueName = capitalizeWords(
              venueName
                .replace("Banquetpoolside", "Banquet Poolside")
                .replace("Poolsideoutdoor", "Poolside/Outdoor")
                .replace("Lawnoutdoor", "Lawn/Outdoor")
            );

            amenities.push({
              icon: <FaUsers />,
              name: `${venueName}: ${seating} Seating | ${floating} Floating`,
            });
          } else {
            amenities.push({
              icon: <FaUsers />,
              name: capitalizeWords(area),
            });
          }
        });
      }
    }

    // --- PHOTOGRAPHER/OTHER VENDOR SPECIFIC FEATURES ---
    if (
      vendorType === "Photographers" ||
      vendorType === "Makeup Artists" ||
      attributes.Offerings
    ) {
      // Delivery Time
      if (attributes.delivery_time) {
        amenities.push({
          icon: <GrFormNextLink />,
          name: `Delivery: ${attributes.delivery_time.replace(
            "Delivery time: ",
            ""
          )}`,
        });
      }

      // Offerings
      if (attributes.Offerings) {
        const services = attributes.Offerings.split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        if (services.length > 0) {
          amenities.push({ icon: <FaStar />, name: `Key Offerings:` });
          services.slice(0, 5).forEach((service) => {
            // List top 5 services
            amenities.push({
              icon: null,
              name: `- ${capitalizeWords(service)}`,
            });
          });
        }
      }
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

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await vendorServicesApi.getVendorServiceById(id);
        setVenueData(data);
        console.log("Vendor data attributes:", data.attributes);

        // Handle images from new API structure
        if (data.media && Array.isArray(data.media) && data.media.length > 0) {
          // New structure: media is already an array of full URLs
          setImages(data.media);
          setMainImage(data.media[0]);
        } else if (data.attributes?.Portfolio) {
          // Fallback: parse Portfolio field (pipe-separated URLs)
          const portfolioUrls = data.attributes.Portfolio.split("|")
            .map((url) => url.trim())
            .filter((url) => url);
          if (portfolioUrls.length > 0) {
            setImages(portfolioUrls);
            setMainImage(portfolioUrls[0]);
          } else {
            setMainImage("/images/default-vendor.jpg");
          }
        } else {
          setMainImage("/images/default-vendor.jpg");
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        setError("Failed to load vendor details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueData();
  }, [id]);

  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      if (!venueData?.vendor?.id || !venueData?.vendor?.vendorType?.id) {
        return;
      }

      const dynamicVendorId = venueData.vendor.id;
      const dynamicVendorTypeId = venueData.vendor.vendorType.id;

      try {
        const response = await axios.get(
          `https://happywedz.com/api/faq-answers/${dynamicVendorId}`
        );
        const answers = response.data || [];

        const answerMap = new Map(
          answers.map((a) => [a.faq_question_id, a.answer])
        );

        const vendorTypeKey = Object.keys(FaqQuestions).find(
          (key) => FaqQuestions[key].vendor_type_id === dynamicVendorTypeId
        );

        if (vendorTypeKey) {
          const questions = FaqQuestions[vendorTypeKey].questions;
          const mergedFaqs = questions.map((q) => ({
            ...q,
            ans: answerMap.get(q.id) || "",
          }));
          setFaqList(mergedFaqs);
        }
      } catch (error) {
        console.error("Error fetching FAQ answers:", error);
      }
    };

    fetchFaqData();
  }, [venueData]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // Loading, Error, No Data state checks remain the same...

  if (loading) {
    return (
      <div className="venue-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading vendor details...</p>
          </div>
        </Container>
      </div>
    );
  }

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

  if (!venueData) {
    return (
      <div className="venue-detail-page">
        <Container className="py-5">
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              Vendor not found
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Helper function to handle database array values
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
    } else if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    }
    return [value].filter((v) => v);
  }

  // Determine if it is a venue based on key attributes
  const isVenue = !!(
    venueData.attributes?.veg_price ||
    venueData.attributes?.catering_policy ||
    venueData.attributes?.rooms ||
    venueData.attributes?.vendor_type?.toLowerCase().includes("venue")
  );

  // Clean up location display
  const displayLocation = isVenue
    ? venueData.attributes?.address ||
    venueData.attributes?.city ||
    "Location not specified"
    : venueData.attributes?.address ||
    venueData.attributes?.city ||
    venueData.vendor?.city ||
    "Location not specified";

  // Create activeVendor from API data
  const activeVendor = {
    id: venueData.vendor_id,
    name:
      venueData.attributes?.vendor_name ||
      venueData.vendor?.vendor_name ||
      "Unknown Vendor",
    location: displayLocation,
    rating: venueData.attributes?.rating || 4.5,
    reviews: venueData.attributes?.review_count || 0,
    image: mainImage || "/images/default-vendor.jpg",
  };

  return (
    <div className="venue-detail-page">
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={venueData.attributes?.vendor_name || "Main Vendor"}
                  className="main-image rounded-lg"
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
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
                          style={{
                            cursor: "pointer",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <div className="venue-description mb-5">
              <h3 className="details-section-title fw-bold">
                About {venueData.attributes?.vendor_name || "This Vendor"}
              </h3>
              {venueData.attributes?.about_us ? (
                <div
                  className="description-text text-black"
                  style={{ textAlign: "justify" }}
                  dangerouslySetInnerHTML={{
                    __html: venueData.attributes.about_us,
                  }}
                />
              ) : (
                <p className="text-black text-justify">
                  No description available for this vendor.
                </p>
              )}

              {venueData.attributes?.subtitle && (
                <p className="description-text text-black text-justify">
                  {venueData.attributes.subtitle}
                </p>
              )}
            </div>

            {/* DYNAMIC AMENITIES / SERVICES */}
            <div className="venue-amenities mb-5">
              {/* <h3 className="details-section-title fw-bold">
                {isVenue ? "Amenities & Services" : "Services & Policies"}
              </h3> */}
              <Row>
                {getVendorFeatures(venueData).length > 0 ? (
                  getVendorFeatures(venueData).map((item, index) => (
                    <Col
                      md={isVenue || item.name.startsWith("-") ? 12 : 6}
                      key={index}
                    >
                      <div
                        className={`amenity-item d-flex align-items-center ${item.name.startsWith("-") ? "ms-4" : ""
                          } my-2`}
                      >
                        {item.icon && (
                          <div
                            className="amenity-icon me-2"
                            style={{ fontSize: "1.2rem" }}
                          >
                            {item.icon}
                          </div>
                        )}
                        <span className="text-black">{item.name}</span>
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <p className="text-muted">
                      No service or amenity information available.
                    </p>
                  </Col>
                )}
              </Row>
            </div>

            {/* FaqQuestionAnswer Detailed */}
            {/* <div className="my-4 border p-3 rounded">
              <h1 className="my-4">Frequently Asked Questions</h1>
              {faqList.length > 0 ? (
                faqList.map((ques, index) => {
                  const answers = parseDbValue(ques.ans);

                  return (
                    <div className="w-100 rounded border-bottom" key={index}>
                      <div className="p-2">
                        <p className="fw-semibold mb-1">{ques.text}</p>

                        {answers.length === 1 &&
                        answers[0] &&
                        !answers[0].includes("{") ? (
                          <p className="text-muted">{answers[0]}</p>
                        ) : (
                          <div className="row">
                            {answers.map(
                              (a, idx) =>
                                a && (
                                  <div
                                    className="col-md-4 d-flex align-items-start mb-2"
                                    key={idx}
                                  >
                                    <i
                                      className="fa-solid fa-check me-2"
                                      style={{
                                        color: "#f44e4eff",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <span className="text-muted">{a}</span>
                                  </div>
                                )
                            )}
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
            </div> */}

            <div className="py-5">
              <ReviewSection vendor={activeVendor} />
            </div>

            {/* Testimonials */}
            <div className="testimonials mb-5">
              <h3 className="details-section-title fw-bold">
                What Couples Say
              </h3>
              {/* Simplified testimonial structure for brevity, assuming standard 2 columns */}
              <Row>
                <Col md={6}>
                  <div className="testimonial-card p-4 border rounded mb-3">
                    <div className="rating mb-2">
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                    </div>
                    <p className="testimonial-text text-muted">
                      "Excellent service! Highly recommend this vendor for
                      making our day special."
                    </p>
                    <p className="testimonial-author fw-semibold text-black">
                      - Happy Couple, 2024
                    </p>
                  </div>

                  {/* Additional Pricing & Platform Info */}
                  {/* <div className="mb-3">
                    {venueData.attributes?.PriceRange && (
                      <div className="text-muted">
                        <span className="fw-semibold text-black me-1">
                          Price Range:
                        </span>
                        {venueData.attributes.PriceRange}
                      </div>
                    )}
                    {venueData.attributes?.photo_package_price && (
                      <div className="text-muted">
                        <span className="fw-semibold text-black me-1">
                          Photo Package:
                        </span>
                        {venueData.attributes.photo_package_price}
                      </div>
                    )}
                    {venueData.attributes?.photo_video_package_price && (
                      <div className="text-muted">
                        <span className="fw-semibold text-black me-1">
                          Photo + Video:
                        </span>
                        {venueData.attributes.photo_video_package_price}
                      </div>
                    )}
                    {(venueData.attributes?.happywedz_since ||
                      venueData.attributes?.HappyWedz) && (
                        <div className="text-muted">
                          <span className="fw-semibold text-black me-1">
                            HappyWedz:
                          </span>
                          {venueData.attributes.happywedz_since ||
                            venueData.attributes.HappyWedz}
                        </div>
                      )}
                  </div> */}
                </Col>
                <Col md={6}>
                  <div className="testimonial-card p-4 border rounded mb-3">
                    <div className="rating mb-2">
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                      <FaStar className="text-warning" />
                    </div>
                    <p className="testimonial-text text-muted">
                      "Professional and attentive. Everything was flawless!"
                    </p>
                    <p className="testimonial-author fw-semibold text-black">
                      - Another Happy Couple, 2023
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={4} className="ps-lg-5">
            <div
              className="venue-details-card p-4 border rounded sticky-top"
              style={{ top: "20px" }}
            >
              <div className="venue-info">
                <div className="mb-3">
                  <div className="d-flex">
                    <h2 className="fw-bold fs-30">
                      {venueData?.attributes?.vendor_name || "Vendor Name"}
                    </h2>
                  </div>
                  <div className="d-flex align-items-center my-2">
                    <FaLocationDot className="me-1" size={15} color="black" />
                    <span>{displayLocation}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="rating-badge">
                      <FaStar className="text-warning" />
                      <span className="rating-value fw-bold">
                        {venueData.attributes?.rating || 4.5}
                      </span>
                      <span className="reviews">
                        ({venueData.attributes?.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="tags mb-4">
                  {venueData.attributes?.vendor_type && (
                    <span className="tag badge bg-info me-2">
                      {venueData.attributes.vendor_type}
                    </span>
                  )}
                  {isVenue && venueData.attributes?.rooms && (
                    <span className="tag badge bg-success me-2">
                      Hotel/Resort
                    </span>
                  )}
                  {isVenue && venueData.attributes?.indoor_outdoor && (
                    <span className="tag badge bg-secondary me-2">
                      {capitalizeWords(venueData.attributes.indoor_outdoor)}
                    </span>
                  )}
                </div>

                {/* Move Request button above pricing */}


                <div className="pricing mb-4">
                  {/* CONDITIONAL PRICING DISPLAY */}
                  {isVenue ? (
                    <>
                      <h4 className="price-title fw-bold">
                        Veg Starting Price (Per Plate)
                      </h4>
                      <div className="price-value fs-4 fw-bold">
                        {venueData.attributes?.veg_price
                          ? `₹${parseInt(
                            venueData.attributes.veg_price.replace(/,/g, "")
                          ).toLocaleString()} onwards`
                          : "Contact for pricing"}
                      </div>
                      <h4 className="price-title fw-bold mt-3">
                        Non-Veg Starting Price (Per Plate)
                      </h4>
                      <div className="price-value fs-4 fw-bold">
                        {venueData.attributes?.non_veg_price
                          ? `₹${parseInt(
                            venueData.attributes.non_veg_price.replace(
                              /,/g,
                              ""
                            )
                          ).toLocaleString()} onwards`
                          : "Contact for pricing"}
                      </div>
                      <p className="price-note text-muted mt-2">
                        Price per plate, exclusive of taxes.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Photographer Pricing */}
                      {/* <h4 className="price-title fw-bold">
                        {venueData.attributes?.vendor_type === "Makeup"
                          ? "Makeup Package (Starting)"
                          : "Photography Package (Starting)"}
                      </h4> */}
                      <h4 className="price-title fw-bold">
                        {venueData.attributes?.vendor_type === "Makeup"
                          ? "Makeup Package (Starting)"
                          : venueData.attributes?.vendor_type === "Photography"
                            ? "Photography Package (Starting)"
                            : venueData.attributes?.vendor_type ===
                              "Music And Dance"
                              ? "Pricing Range"
                              : ""}
                      </h4>

                      <div className="price-value fs-4 fw-bold">
                        <h4 className="price-title fw-bold mt-3">
                          Pricing Range (Starting)
                        </h4>
                        {venueData.attributes?.PriceRange
                          ? venueData.attributes.PriceRange
                          : venueData.attributes.photo_package_price
                            ? `₹${parseInt(
                              venueData.attributes.photo_package_price.replace(
                                /,/g,
                                ""
                              )
                            ).toLocaleString()} onwards`
                            : "Contact for pricing"}
                      </div>
                      {venueData.attributes?.photo_video_package_price && (
                        <>
                          <h4 className="price-title fw-bold mt-3">
                            Photo + Video Package (Starting)
                          </h4>
                          <div className="price-value fs-4 fw-bold">
                            Rs.
                            {parseInt(
                              venueData.attributes.photo_video_package_price.replace(
                                /,/g,
                                ""
                              )
                            ).toLocaleString()}{" "}

                          </div>
                        </>
                      )}
                      <p className="price-note text-muted mt-2">
                        {venueData.attributes?.vendor_type === "Makeup"
                          ? "Price per session, exclusive of taxes."
                          : "Price per day/event, exclusive of taxes."}
                      </p>
                    </>
                  )}
                </div>

                {/* End moved button */}
              </div>

              <div className="action-buttons border-top pt-3 mb-3">
                <div className="margin-b-50 d-flex h-center cursor-pointer">
                  <div style={{ width: "100%" }}>
                    <button
                      className="btn btn-primary w-100 py-2 fs-5"
                      onClick={() =>
                        handleShowPricingModal(venueData.vendor_id)
                      }
                    >
                      Request Pricing & Availability
                    </button>
                  </div>
                </div>
              </div>

              <div className="venue-map mt-4 pt-3 border-top">
                <div
                  className="mb-2 fw-semibold text-dark"
                  style={{ fontSize: "1.05rem" }}
                >
                  View Location
                </div>

                {/* Using displayLocation for the map search query */}
                <iframe
                  src={`https://maps.google.com/maps?q=$${encodeURIComponent(
                    displayLocation
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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
                  title="Vendor Location Map"
                ></iframe>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Similar Venues/Vendors section remains the same */}
      {/* <section className="similar-venues py-5 bg-light">
        <Container>
          <h3 className="details-section-title fw-bold text-center mb-5">
            Similar {venueData.attributes?.vendor_type || "Vendors"} You Might
            Like
          </h3>
          <Row>
            {images.slice(0, 3).map((img, index) => (
              <Col md={4} key={index}>
                <div className="similar-venue-card bg-white p-3 rounded shadow-sm">
                  <div
                    className="venue-image rounded mb-3"
                    style={{
                      backgroundImage: `url(${img})`,
                      height: "200px",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="venue-info">
                    <h5 className="fw-bold">
                      {venueData.attributes?.vendor_name || "Similar Vendor"}
                    </h5>
                    <p className="location text-muted small">
                      <FaMapMarkerAlt className="me-1" /> {displayLocation}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="rating fw-semibold">
                        ⭐ {venueData.attributes?.rating || 4.5}
                      </span>
                      <span className="price text-primary fw-bold">
                        {isVenue && venueData.attributes?.veg_price
                          ? `₹${parseInt(
                            venueData.attributes.veg_price.replace(/,/g, "")
                          ).toLocaleString()} onwards`
                          : !isVenue && venueData.attributes?.photo_package_price
                            ? `₹${parseInt(
                              venueData.attributes.photo_package_price.replace(
                                /,/g,
                                ""
                              )
                            ).toLocaleString()} onwards`
                            : !isVenue && venueData.attributes?.PriceRange
                              ? `₹${parseInt(
                                venueData.attributes.PriceRange.replace(/[^\d]/g, "")
                              ).toLocaleString()} onwards`
                              : "Contact for pricing"}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section> */}

      <PricingModal
        show={showPricingModal}
        handleClose={() => setShowPricingModal(false)}
        vendorId={selectedVendorId}
      />
    </div>
  );
};

export default Detailed;
