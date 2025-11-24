import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../redux/authSlice";
import "swiper/css";
import "swiper/css/autoplay";
import vendorServicesApi from "../../services/api/vendorServicesApi";
import PricingModal from "./PricingModal";
import BusinessClaimForm from "../pages/BusinessClaimForm";
import DOMPurify from "dompurify";

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
const API_BASE_URL = "https://happywedz.com";
import Swal from "sweetalert2";
import SectionTabs from "./SectionTabs";
import { TbView360Number } from "react-icons/tb";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
};

const Detailed = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [venueData, setVenueData] = useState(null);
  const [profileViews, setProfileViews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [mainVideo, setMainVideo] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [mediaTab, setMediaTab] = useState("gallery"); // 'gallery' | 'video'
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const handleShowPricingModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowPricingModal(true);
  };

  const getVendorFeatures = (data) => {
    if (!data || !data.attributes) return [];

    const attributes = data.attributes;
    const amenities = [];
    const vendorType = attributes.vendor_type;

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
      if (attributes.dJ_policy) {
        amenities.push({
          icon: <FaStar />,
          name: `DJ: ${capitalizeWords(attributes.dJ_policy)}`,
        });
      }
      if (attributes.space) {
        amenities.push({
          icon: <FaStar />,
          name: `Space: ${capitalizeWords(attributes.space)}`,
        });
      }

      if (attributes.outside_alcohol) {
        amenities.push({
          icon: <FaStar />,
          name: `Outside Alcohol: ${capitalizeWords(attributes.outside_alcohol)}`,
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

      if (attributes.parking) {
        amenities.push({
          icon: <FaParking />,
          name: `Parking: ${attributes.parking}`,
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
      if (attributes.offerings) {
        const services = attributes.offerings
          .split(",")
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
  const [_hover, _setHover] = useState(0);
  const [experience, setExperience] = useState("");
  const [spent, setSpent] = useState("");
  const [_reviews, _setReviews] = useState([]);

  const _handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...filePreviews]);
  };

  const _handleSubmit = () => {
    if (!rating || !experience) {
      Swal.fire({
        title: "",
        text: "Please give a rating and write your experience.",
        timer: "1500",
      });
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

    _setReviews((prev) => [newReview, ...prev]);
    // Reset form
    setRating(0);
    setExperience("");
    setSpent("");
    setImages([]);
  };

  // Fetch wishlist on component mount to initialize favorites
  useEffect(() => {
    if (!token || !id) {
      setFavorites({});
      setWishlistIds(new Set());
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`https://happywedz.com/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          const ids = new Set(data.data.map((item) => item.vendor_services_id));
          setWishlistIds(ids);
          // Initialize favorites state from fetched wishlist
          const favoritesObj = {};
          ids.forEach((itemId) => {
            favoritesObj[itemId] = true;
          });
          setFavorites(favoritesObj);
        } else {
          setWishlistIds(new Set());
          setFavorites({});
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistIds(new Set());
        setFavorites({});
      }
    };

    fetchWishlist();
  }, [token, id]);

  const isFavorite = (vendorId) => {
    if (!vendorId) return false;
    const vendorIdStr = String(vendorId);
    const vendorIdNum = parseInt(vendorId);
    return (
      favorites[vendorIdStr] === true ||
      favorites[vendorIdNum] === true ||
      wishlistIds.has(vendorIdStr) ||
      wishlistIds.has(vendorIdNum)
    );
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!venueData || !id) return;

    const vendorService = {
      id: parseInt(id),
      vendor_services_id: parseInt(id),
    };

    const wasFavorite = isFavorite(id);

    // Optimistically update UI
    setFavorites((prev) => ({
      ...prev,
      [id]: !wasFavorite,
    }));

    // Update wishlistIds set
    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(id);
        newSet.delete(parseInt(id));
      } else {
        newSet.add(id);
        newSet.add(parseInt(id));
      }
      return newSet;
    });

    // Dispatch toggleWishlist action
    dispatch(toggleWishlist(vendorService));
  };

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await vendorServicesApi.getVendorServiceById(id);
        setVenueData(data);

        (async () => {
          try {
            if (data?.vendor_id) {
              const sessionKey = `vendor_viewed_${data.vendor_id}`;
              if (!sessionStorage.getItem(sessionKey)) {
                const incRes = await axios.post(
                  `${API_BASE_URL}/api/vendor/increment-view/${data.vendor_id}`
                );
                try {
                  sessionStorage.setItem(sessionKey, Date.now().toString());
                } catch { }
                if (incRes?.data?.vendor?.profileViews !== undefined) {
                  setVenueData((prev) => ({
                    ...prev,
                    vendor: {
                      ...(prev?.vendor || {}),
                      profileViews: incRes.data.vendor.profileViews,
                    },
                  }));
                  setProfileViews(incRes.data.vendor.profileViews);
                }
              } else {
                // already counted this session — skip increment
                console.debug(
                  `skip increment-view for vendor ${data.vendor_id} (already viewed this session)`
                );
              }
            }
          } catch (incErr) {
            // fail quietly but log for debugging
            console.debug("increment-view failed:", incErr?.message || incErr);
          }
        })();

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

        // Handle videos if provided
        const videoList = Array.isArray(data.attributes?.video)
          ? data.attributes.video.filter(Boolean)
          : [];
        setVideos(videoList);
        if (videoList.length > 0) {
          setMainVideo(videoList[0]);
        } else {
          setMainVideo(null);
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

  const [_faqList, _setFaqList] = useState([]);

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
          _setFaqList(mergedFaqs);
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

  function _parseDbValue(value) {
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

  const isVenue = !!(
    venueData.attributes?.veg_price ||
    venueData.attributes?.catering_policy ||
    venueData.attributes?.rooms ||
    venueData.attributes?.vendor_type?.toLowerCase().includes("venue")
  );

  const displayLocation = isVenue
    ? venueData.attributes?.address ||
    venueData.attributes?.city ||
    "Location not specified"
    : venueData.attributes?.address ||
    venueData.attributes?.city ||
    venueData.vendor?.city ||
    "Location not specified";

  // Prefer precise coordinates if present
  const latRaw =
    venueData.attributes?.latitude ?? venueData.attributes?.location?.latitude;
  const lngRaw =
    venueData.attributes?.longitude ??
    venueData.attributes?.location?.longitude;
  const lat = parseFloat(latRaw);
  const lng = parseFloat(lngRaw);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
      displayLocation
    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const activeVendor = {
    id: id,
    name:
      venueData.attributes?.vendor_name ||
      venueData.attributes?.name ||
      venueData.vendor?.vendor_name ||
      "Unknown Vendor",
    location: displayLocation,
    rating: venueData.attributes?.rating || 4.5,
    reviews: venueData.attributes?.review_count || 0,
    image: mainImage || "/images/default-vendor.jpg",
  };

  // Aliases to match JSX usage
  const faqList = _faqList || [];
  const parseDbValue = _parseDbValue;

  // Smooth scroll to section by id
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="venue-detail-page">
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-4 position-relative">
              {mediaTab === "gallery" ? (
                mainImage ? (
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
                )
              ) : (
                mainVideo ? (
                  <video
                    src={mainVideo}
                    controls
                    className="rounded-lg"
                    style={{ width: "100%", height: "500px", objectFit: "cover", backgroundColor: "#000" }}
                  />
                ) : (
                  <div className="main-image rounded-lg d-flex align-items-center justify-content-center bg-light">
                    <p className="text-muted">No video available</p>
                  </div>
                )
              )}
              {/* In-image media toggle */}
             <div
  className="position-absolute d-flex align-items-center"
  style={{
    top: "12px",
    left: "60px",
    background: "#fff",
    color: "#000",
    borderRadius: "999px",
    padding: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 2,
    gap: "6px",
  }}
>
  <button
    type="button"
    className="btn btn-sm"
    onClick={() => setMediaTab("gallery")}
    style={{
      background: mediaTab === "gallery" ? "#f2f2f2" : "#fff",
      color: "#000",
      border: mediaTab === "gallery" ? "2px solid #000" : "1px solid #e5e5e5",
      padding: "2px 10px",
      height: "28px",
      lineHeight: 1,
      borderRadius: "999px",
    }}
  >
    Gallery
  </button>

  <button
    type="button"
    className="btn btn-sm"
    onClick={() => setMediaTab("video")}
    disabled={videos.length === 0}
    title={videos.length === 0 ? "No videos available" : ""}
    style={{
      background: mediaTab === "video" ? "#f2f2f2" : "#fff",
      color: "#000",
      border: mediaTab === "video" ? "2px solid #000" : "1px solid #e5e5e5",
      padding: "2px 10px",
      height: "28px",
      lineHeight: 1,
      opacity: videos.length === 0 ? 0.5 : 1,
      cursor: videos.length === 0 ? "not-allowed" : "pointer",
      borderRadius: "999px",
    }}
  >
    Video
  </button>
</div>

              {isVenue && (
                <button
                  className="btn btn-light position-absolute rounded-circle border-0 shadow-sm"
                  style={{
                    top: "12px",
                    left: "12px",
                    width: "36px",
                    height: "36px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <TbView360Number className="text-dark" size={18} />
                </button>
              )}
              <button className="favorite-btn" onClick={handleFavoriteToggle}>
                {isFavorite(id) ? (
                  <FaHeart className="text-danger" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>

            {mediaTab === "gallery" ? (
              images.length > 0 && (
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
                          className={`thumbnail-item ${mainImage === img ? "active" : ""} ${
                            hoveredIndex !== null && hoveredIndex !== idx ? "blurred" : ""
                          }`}
                          onClick={() => setMainImage(img)}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ cursor: "pointer", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/imageNotFound.jpg";
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )
            ) : (
              videos.length > 0 && (
                <div className="mb-5">
                  <div className="d-flex gap-2 flex-wrap">
                    {videos.map((vid, idx) => (
                      <video
                        key={idx}
                        src={vid}
                        muted
                        onClick={() => setMainVideo(vid)}
                        className={`rounded ${mainVideo === vid ? "border border-primary" : ""}`}
                        style={{ width: "160px", height: "100px", objectFit: "cover", backgroundColor: "#000", cursor: "pointer" }}
                      />
                    ))}
                  </div>
                </div>
              )
            )}

            {/* In-page navigation */}
            <SectionTabs scrollToSection={scrollToSection} />

            <div id="about" className="venue-description mb-5">
              <h3 className="details-section-title fw-bold">
                About{" "}
                {venueData.attributes?.vendor_name ||
                  venueData.attributes?.name ||
                  venueData.attributes?.Name}
              </h3>
              {venueData.attributes?.about_us ? (
                <div
                  className="description-text text-black"
                  style={{ textAlign: "justify" }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      venueData?.attributes?.about_us || ""
                    ),
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
                          }`}
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

            <div id="faq" className="my-4 border p-3 rounded">
              <h5 className="my-4">Frequently Asked Questions</h5>

              {faqList.length > 0 ? (
                <>
                  {(showAllFaqs ? faqList : faqList.slice(0, 5)).map(
                    (ques, index) => {
                      // Parse the answer to handle different data types
                      const parseAnswer = (answer) => {
                        if (answer == null) return [];

                        // If it's already an array, return it
                        if (Array.isArray(answer)) {
                          return answer.filter(
                            (item) => item != null && item !== ""
                          );
                        }

                        // If it's an object (like {"0": "200", "1": "600"})
                        if (typeof answer === "object") {
                          const values = Object.values(answer).filter(
                            (v) => v != null && v !== ""
                          );

                          // If it's a range (2 values), join with hyphen
                          if (values.length === 2) {
                            return [`${values[0]} - ${values[1]}`];
                          }
                          // Single value from object
                          if (values.length === 1) {
                            return values;
                          }
                          return values;
                        }

                        // For primitive values (string, number)
                        const strValue = String(answer).trim();
                        return strValue ? [strValue] : [];
                      };

                      const answers = parseAnswer(ques.ans);
                      const isSingleAnswer = answers.length === 1;

                      // Skip if no valid answers
                      if (answers.length === 0) return null;

                      return (
                        <div
                          className="w-100 rounded border-bottom"
                          key={index}
                        >
                          <div className="p-2">
                            <p className="fw-semibold mb-1">{ques.text}</p>

                            {isSingleAnswer ? (
                              <p className="text-muted">{answers[0]}</p>
                            ) : (
                              <div className="row">
                                {answers.map((answer, idx) => (
                                  <div
                                    className="col-md-4 d-flex align-items-start mb-2"
                                    key={idx}
                                  >
                                    <i
                                      className="fa-solid fa-check me-2"
                                      style={{
                                        color: "#f44e4e",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <span className="text-muted">{answer}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {faqList.length > 5 && (
                    <div className="text-center mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setShowAllFaqs(!showAllFaqs)}
                      >
                        {showAllFaqs ? "Show Less" : "Read More"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted">
                  No FAQ information available for this vendor.
                </p>
              )}
            </div>

            <div id="reviews" className="py-2">
              <ReviewSection vendor={activeVendor} />
            </div>
            <div id="map" className="venue-map mt-4 pt-3 border-top">
              <div
                className="mb-2 fw-semibold text-dark"
                style={{ fontSize: "1.05rem" }}
              >
                View Location
              </div>

              {/* Show map by coordinates when available; fallback to text location */}
              <iframe
                src={mapSrc}
                width="100%"
                height="450"
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
            {/* Testimonials */}
            {/* <div className="testimonials mb-5">
              <h3 className="details-section-title fw-bold">
                What Couples Say
              </h3>
             
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
            </div> */}
          </Col>

          <Col lg={4} className="ps-lg-5">
            <div
              className="venue-details-card p-4 border rounded sticky-top"
              style={{ top: "20px" }}
            >
              <div className="venue-info">
                <div className="mb-3">
                  <div className="d-flex">
                    <h2 className="fw-bold fs-20">
                      {venueData?.attributes?.vendor_name ||
                        venueData?.attributes?.Name ||
                        venueData?.attributes?.name ||
                        "Vendor Name"}
                    </h2>
                  </div>
                  <div className="d-flex align-items-center my-2">
                    <FaLocationDot className="me-1" size={15} color="black" />
                    <span>{venueData?.attributes?.address || venueData?.attributes?.city}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="rating-badge">
                      <FaStar className="text-warning" />
                      <span className="rating-value fw-bold">
                        {venueData.attributes?.rating || 0}
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

                <div className="pricing mb-4">
                  {isVenue ? (
                    <>
                      <h4 className="price-title fw-bold">
                        Veg Starting Price
                      </h4>
                      <div className="price-value fs-4 fw-bold">
                        {venueData.attributes?.veg_price
                          ? `₹ ${parseInt(
                            venueData.attributes.veg_price.replace(/,/g, "")
                          ).toLocaleString()} onwards`
                          : "Contact for pricing"}
                      </div>
                      <h4 className="price-title fw-bold mt-3">
                        Non-Veg Starting Price 
                      </h4>
                      <div className="price-value fs-4 fw-bold">
                        {venueData.attributes?.non_veg_price
                          ? `₹ ${parseInt(
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
                        ₹{" "}
                        {venueData.attributes?.PriceRange ||
                          venueData.attributes.starting_price
                          ? venueData.attributes.PriceRange.replace(
                            "Rs.",
                            ""
                          ).trim() || venueData.attributes.starting_price
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
                            ₹{" "}
                            {venueData.attributes.photo_video_package_price.replace(
                              "Rs.",
                              ""
                            )}{" "}
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

                <div>
                  <button
                    className="btn btn-primary w-100 py-2 fs-5 mt-2 rounded-4"
                    onClick={() => setShowClaimForm(true)}
                  >
                    Claim Your Business
                  </button>
                </div>
              </div>

              <hr />

              <div className="action-buttons mb-3">
                <div className="margin-b-50 d-flex h-center cursor-pointer">
                  <div style={{ width: "100%" }}>
                    <button
                      className="btn btn-primary w-100 py-2 fs-5 rounded-4"
                      onClick={() =>
                        handleShowPricingModal(venueData.vendor_id)
                      }
                    >
                      Request Pricing & Availability
                    </button>
                  </div>
                </div>
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

      <Modal
        show={showClaimForm}
        onHide={() => setShowClaimForm(false)}
        size="xl"
        centered
        scrollable
        backdrop={true}
      >
        <Modal.Body>
          <BusinessClaimForm
            setShowClaimForm={setShowClaimForm}
            vendorServiceId={venueData?.id}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Detailed;
