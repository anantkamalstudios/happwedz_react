import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FaLocationDot } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate, useParams } from "react-router-dom";
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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import ReviewSection from "../pages/ReviewSection";
import { FaqQuestions } from "../pages/adminVendor/subVendors/FaqData";
import axios from "axios";
const API_BASE_URL = "https://happywedz.com";
import Swal from "sweetalert2";
import SectionTabs from "./SectionTabs";
import { TbView360Number } from "react-icons/tb";
import GridView from "./Main/GridView";
import SimilarServices from "./SimilarServices";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
};

const formatList = (list, limit = 5) => {
  if (!Array.isArray(list) || list.length === 0) return "";
  return list.slice(0, limit).join(", ");
};

const formatKeyValuePairs = (obj, limit = 4) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return "";
  const entries = Object.entries(obj).filter(
    ([key, value]) => key && String(value || "").trim(),
  );
  if (!entries.length) return "";
  return entries
    .slice(0, limit)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
};

const pushFeature = (arr, icon, label, value) => {
  if (value === undefined || value === null) return;
  const text = String(value).trim();
  if (!text) return;
  arr.push({ icon, name: `${label}: ${text}` });
};

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
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
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showStartingPrice, setShowStartingPrice] = useState(false);
  const navigate = useNavigate();
  const handleShowPricingModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowPricingModal(true);
  };

  const getVendorFeatures = (data) => {
    if (!data || !data.attributes) return [];

    const attributes = data.attributes;
    const amenities = [];
    const vendorType = attributes.vendor_type;
    const normalizedVendorType = String(vendorType || "").toLowerCase();
    const venueMaster = attributes.venue_master || {};
    const catererMaster = attributes.caterer_master || {};
    const photographerMaster = attributes.photographer_master || {};
    const makeupArtistMaster = attributes.makeup_artist_master || {};
    const sherwaniMaster = attributes.sherwani_master || {};

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
      if (attributes.start_venue) {
        amenities.push({
          icon: <FaStar />,
          name: `Start Venue: ${capitalizeWords(attributes.start_venue)}`,
        });
      }

      if (attributes.outside_alcohol) {
        amenities.push({
          icon: <FaStar />,
          name: `Outside Alcohol: ${capitalizeWords(
            attributes.outside_alcohol,
          )}`,
        });
      }

      // --- Alcohol Policy ---
      let alcoholStatus = attributes.alcohol_policy
        ? capitalizeWords(attributes.alcohol_policy)
        : "";
      if (
        attributes.about_us &&
        attributes.about_us.includes(
          "In house alcohol available, outside alcohol not permitted",
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
          name: `Total Rooms:${attributes.rooms}`,
        });
      }

      // --- Venue Area/Capacity Breakdown (from 'area' attribute) ---
      if (attributes.area) {
        const areas = attributes.area.split(",").map((s) => s.trim());
        areas.forEach((area) => {
          const match = area.match(
            /(\w+)\s*(\d+)\s*Seating\s*\|\s*(\d+)\s*Floating\s*(.*)/i,
          );
          if (match) {
            const [, , seating, floating, locationPart] = match;
            let venueName =
              locationPart.replace(/^(,)\s*/, "").trim() || area.split(" ")[0];
            venueName = capitalizeWords(
              venueName
                .replace("Banquetpoolside", "Banquet Poolside")
                .replace("Poolsideoutdoor", "Poolside/Outdoor")
                .replace("Lawnoutdoor", "Lawn/Outdoor"),
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

    // --- VENUE MASTER ATTRIBUTES ---
    if (venueMaster && Object.keys(venueMaster).length > 0) {
      const vc = venueMaster.categories || {};
      pushFeature(
        amenities,
        <FaStar />,
        "Venue Categories",
        formatList(
          Object.values(vc)
            .filter(Array.isArray)
            .flat(),
          12,
        ),
      );

      const vSpace = venueMaster.space_capacity || {};
      pushFeature(amenities, <FaUsers />, "Guest Capacity", vSpace.max_guests);
      pushFeature(
        amenities,
        <FaStar />,
        "Space Types",
        formatList(vSpace.space_types),
      );

      const vFood = venueMaster.food || {};
      pushFeature(
        amenities,
        <FaUtensils />,
        "Cuisine",
        formatList(vFood.cuisines, 4),
      );
      pushFeature(
        amenities,
        <FaUtensils />,
        "Veg/Non-Veg",
        vFood.veg_non_veg,
      );

      pushFeature(amenities, <FaUtensils />, "Catering Policy", vFood.catering_policy);
      pushFeature(amenities, <FaUtensils />, "Per Plate Cost", vFood.per_plate_cost_range);
      pushFeature(
        amenities,
        <FaUtensils />,
        "Outside Catering Charges",
        vFood.outside_catering_charges,
      );
      pushFeature(amenities, <FaUtensils />, "Jain Food", vFood.jain_food);

      const vDecor = venueMaster.decor || {};
      pushFeature(amenities, <FaStar />, "Decor Policy", vDecor.policy);
      pushFeature(
        amenities,
        <FaStar />,
        "Decor Capabilities",
        formatList(vDecor.capabilities, 4),
      );
      pushFeature(amenities, <FaStar />, "Decor Lighting", formatList(vDecor.lighting, 3));
      pushFeature(amenities, <FaStar />, "Decor Sound", formatList(vDecor.sound, 3));

      const vRooms = venueMaster.rooms || {};
      pushFeature(amenities, <FaBed />, "Number of Rooms", vRooms.num_rooms);
      pushFeature(amenities, <FaBed />, "Room Types", formatList(vRooms.room_types, 4));
      pushFeature(amenities, <FaBed />, "Room Price Range", vRooms.room_price_range);
      pushFeature(amenities, <FaBed />, "Complimentary Rooms", vRooms.complimentary_rooms);
      pushFeature(
        amenities,
        <FaBed />,
        "Room Type Counts",
        formatKeyValuePairs(vRooms.room_type_counts, 3),
      );

      const vAlcohol = venueMaster.alcohol || {};
      pushFeature(amenities, <FaGlassCheers />, "Alcohol Policy", vAlcohol.policy);
      pushFeature(amenities, <FaGlassCheers />, "Corkage", vAlcohol.corkage);
      pushFeature(amenities, <FaGlassCheers />, "Bar Setup", formatList(vAlcohol.bar_setup, 3));

      const vFacilities = venueMaster.facilities || {};
      pushFeature(amenities, <FaParking />, "Parking Capacity", vFacilities.parking_capacity);
      pushFeature(amenities, <FaParking />, "Valet", vFacilities.valet);
      pushFeature(amenities, <FaStar />, "Power Backup", formatList(vFacilities.power_backup, 3));
      pushFeature(amenities, <FaStar />, "Air Conditioning", vFacilities.ac);
      pushFeature(amenities, <FaStar />, "Washroom Quality", vFacilities.washroom);
      pushFeature(
        amenities,
        <FaStar />,
        "Additional Facilities",
        formatList(vFacilities.additional, 4),
      );

      const vEntertainment = venueMaster.entertainment || {};
      pushFeature(amenities, <FaCalendarAlt />, "DJ Policy", vEntertainment.dj_policy);
      pushFeature(
        amenities,
        <FaCalendarAlt />,
        "Entertainment Supported",
        formatList(vEntertainment.supported, 4),
      );
      pushFeature(amenities, <FaCalendarAlt />, "Noise Restriction", vEntertainment.noise);

      const vSuitability = venueMaster.suitability || {};
      pushFeature(
        amenities,
        <FaUsers />,
        "Suitable For",
        formatList(vSuitability.suitable_for, 4),
      );
      pushFeature(amenities, <FaUsers />, "Best For", formatList(vSuitability.best_for, 4));
      pushFeature(
        amenities,
        <FaUsers />,
        "Ideal Guest Range",
        formatList(vSuitability.ideal_guest_range, 3),
      );

      const vIdentity = venueMaster.identity || {};
      pushFeature(amenities, <FaMapMarkerAlt />, "Location Type", vIdentity.location_type);
      pushFeature(amenities, <FaMapMarkerAlt />, "Ownership", vIdentity.property_ownership);
      pushFeature(amenities, <FaStar />, "Years of Operation", vIdentity.years_of_operation);

      const vPricing = venueMaster.pricing_booking || {};
      pushFeature(amenities, <FaStar />, "Pricing Model", formatList(vPricing.pricing_model, 3));
      pushFeature(
        amenities,
        <FaStar />,
        "Starting Venue Price",
        vPricing.starting_venue_price,
      );
      pushFeature(amenities, <FaStar />, "Advance Payment", vPricing.advance_payment_range);
      pushFeature(amenities, <FaStar />, "Cancellation", vPricing.cancellation);
      pushFeature(amenities, <FaStar />, "Refund Timeline", vPricing.refund_timeline);
    }

    // --- CATERER MASTER ATTRIBUTES ---
    if (catererMaster && Object.keys(catererMaster).length > 0) {
      const ci = catererMaster.identity || {};
      const cs = catererMaster.service_type || {};
      const cc = catererMaster.cuisine_intelligence || {};
      const cp = catererMaster.pricing_structure || {};
      const cl = catererMaster.venue_logistics || {};

      pushFeature(amenities, <FaStar />, "Caterer Type", ci.caterer_type);
      pushFeature(
        amenities,
        <FaMapMarkerAlt />,
        "Coverage",
        ci.service_coverage,
      );
      pushFeature(
        amenities,
        <FaUtensils />,
        "Catering Style",
        formatList(cs.catering_style, 4),
      );
      pushFeature(
        amenities,
        <FaUtensils />,
        "Cuisine Types",
        formatList(cc.cuisine_types, 5),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Best Known For",
        formatList(cc.best_known_for, 4),
      );
      pushFeature(
        amenities,
        <FaUsers />,
        "Max Guests",
        catererMaster.scale_execution?.maximum_pax,
      );
      pushFeature(amenities, <FaStar />, "Price Range", cp.price_range);
      pushFeature(amenities, <FaStar />, "Pricing Type", cp.pricing_type);
      pushFeature(
        amenities,
        <FaUtensils />,
        "Dietary Options",
        formatList(cs.special_dietary_options, 4),
      );
      pushFeature(
        amenities,
        <FaUtensils />,
        "Live Counters",
        formatList(catererMaster.menu_customization?.popular_live_counters, 4),
      );
      pushFeature(
        amenities,
        <FaMapMarkerAlt />,
        "Outdoor Catering",
        cl.outdoor_catering_supported,
      );
      pushFeature(
        amenities,
        <FaCalendarAlt />,
        "Functions Covered",
        formatList(catererMaster.event_suitability?.functions_suitable_for, 6),
      );
    }

    // --- PHOTOGRAPHER MASTER ATTRIBUTES ---
    if (photographerMaster && Object.keys(photographerMaster).length > 0) {
      const pi = photographerMaster.identity || {};
      const ps = photographerMaster.style_intelligence || {};
      const pt = photographerMaster.team_coverage || {};
      const pd = photographerMaster.deliverables || {};
      const pe = photographerMaster.equipment || {};
      const pp = photographerMaster.pricing || {};
      const pw = photographerMaster.workflow || {};
      const ppre = photographerMaster.prewedding_specialization || {};
      const pes = photographerMaster.event_suitability || {};

      pushFeature(
        amenities,
        <FaStar />,
        "Services",
        formatList(pi.services_offered, 5),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Photography Style",
        formatList(ps.photography_style, 4),
      );
      pushFeature(amenities, <FaStar />, "Editing Style", ps.editing_style);
      pushFeature(amenities, <FaStar />, "Best Known For", formatList(ps.best_known_for, 5));
      pushFeature(
        amenities,
        <FaStar />,
        "Ideal Wedding Type",
        formatList(ps.ideal_wedding_type, 5),
      );
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Availability", pi.travel_availability);
      pushFeature(amenities, <FaStar />, "Also Available For", pi.also_available_for);
      pushFeature(amenities, <FaStar />, "Years of Experience", pi.years_of_experience);
      pushFeature(amenities, <FaUsers />, "Team Size", pt.team_size);
      pushFeature(amenities, <FaUsers />, "Max Events Per Day", pt.max_events_per_day);
      pushFeature(amenities, <FaUsers />, "Backup Team", pt.backup_team_available);
      pushFeature(
        amenities,
        <FaUsers />,
        "Female Photographer",
        pt.female_photographer_available,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Photos Delivered",
        pd.photos_delivered,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Videos Delivered",
        formatList(pd.videos_delivered, 3),
      );
      pushFeature(amenities, <FaStar />, "Album Included", pd.album_included);
      pushFeature(amenities, <FaStar />, "Album Type", pd.album_type);
      pushFeature(amenities, <FaStar />, "Raw Data Provided", pd.raw_data_provided);
      pushFeature(
        amenities,
        <FaStar />,
        "Express Delivery",
        pd.express_delivery_available,
      );
      pushFeature(
        amenities,
        <FaCalendarAlt />,
        "Delivery Time",
        pd.delivery_time,
      );
      pushFeature(amenities, <FaStar />, "Camera Type", pe.camera_type);
      pushFeature(amenities, <FaStar />, "Lighting Setup", pe.lighting_setup);
      pushFeature(
        amenities,
        <FaStar />,
        "Drone Available",
        pe.drone_available,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Live Streaming Setup",
        pe.live_streaming_setup,
      );
      pushFeature(amenities, <FaStar />, "Starting Price", pp.starting_price);
      pushFeature(amenities, <FaStar />, "Pricing Type", pp.pricing_type);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Charges", pp.travel_charges);
      pushFeature(
        amenities,
        <FaMapMarkerAlt />,
        "Accommodation Required",
        pp.accommodation_required,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Pre-Wedding Shoot Cost",
        pp.pre_wedding_shoot_cost,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Booking Advance Required",
        pw.booking_advance_required,
      );
      pushFeature(amenities, <FaStar />, "Advance Percentage", pw.advance_percentage);
      pushFeature(amenities, <FaStar />, "Revision Allowed", pw.revision_allowed);
      pushFeature(
        amenities,
        <FaStar />,
        "Number of Revisions",
        pw.number_of_revisions,
      );
      pushFeature(amenities, <FaStar />, "Cancellation Policy", pw.cancellation_policy);
      pushFeature(
        amenities,
        <FaCalendarAlt />,
        "Functions Covered",
        formatList(pes.functions_covered, 7),
      );
      pushFeature(amenities, <FaStar />, "Best For", formatList(pes.best_for, 5));
      pushFeature(
        amenities,
        <FaMapMarkerAlt />,
        "Pre-Wedding Locations",
        ppre.locations_supported,
      );
      pushFeature(amenities, <FaStar />, "Props Provided", ppre.props_provided);
      pushFeature(
        amenities,
        <FaStar />,
        "Concept Shoot Available",
        ppre.concept_shoot_available,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Location Scouting Support",
        ppre.location_scouting_support,
      );
    }

    // --- MAKEUP ARTIST MASTER ATTRIBUTES ---
    if (makeupArtistMaster && Object.keys(makeupArtistMaster).length > 0) {
      const mi = makeupArtistMaster.identity || {};
      const ms = makeupArtistMaster.makeup_style_intelligence || {};
      const msk = makeupArtistMaster.skin_hair_expertise || {};
      const mp = makeupArtistMaster.pricing_structure || {};

      pushFeature(amenities, <FaStar />, "Artist", mi.brand_artist_name);
      pushFeature(amenities, <FaStar />, "Artist Type", mi.artist_type);
      pushFeature(
        amenities,
        <FaStar />,
        "Services",
        formatList(mi.services_offered, 6),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Signature Makeup",
        formatList(ms.signature_makeup_style, 5),
      );
      pushFeature(
        amenities,
        <FaMapMarkerAlt />,
        "Travel",
        mi.travel_availability,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Skin Types",
        formatList(msk.skin_types_handled, 5),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Starting Price",
        mp.bridal_makeup_starting_price,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Cities",
        formatList(mi.cities, 4),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Skin Tone Expertise",
        formatList(msk.skin_tone_expertise, 4),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Product Category",
        makeupArtistMaster.products_brands?.product_category,
      );
    }

    // --- DYNAMIC MASTER PROFILE EXTRACTION ---
    const mapMasterProfile = (masterData) => {
      if (!masterData || typeof masterData !== "object") return;
      const skipSections = ["ai_faq"];
      const formatKey = (key) =>
        key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

      Object.keys(masterData).forEach((sectionKey) => {
        if (skipSections.includes(sectionKey)) return;
        const sectionData = masterData[sectionKey];
        if (typeof sectionData === "object" && !Array.isArray(sectionData) && sectionData !== null) {
          Object.keys(sectionData).forEach((fieldKey) => {
            if (fieldKey === "vendor_type" || fieldKey === "brand_name") return;
            let val = sectionData[fieldKey];
            if (val === true) val = "Yes";
            if (
              val === false ||
              val === null ||
              val === "" ||
              (Array.isArray(val) && val.length === 0)
            )
              return;

            const displayVal = Array.isArray(val)
              ? formatList(val, 10)
              : String(val);
            pushFeature(amenities, <FaStar />, formatKey(fieldKey), displayVal);
          });
        }
      });
    };

    const dynamicMasters = [
      attributes.wedding_planner_master,
      attributes.decorator_master,
      attributes.trousseau_master,
      attributes.invitation_gift_master,
      attributes.gift_master,
      attributes.favor_master,
      attributes.invitation_master,
      attributes.wedding_suit_master,
      attributes.sherwani_master,
    ];

    dynamicMasters.forEach((master) => {
      if (master && Object.keys(master).length > 0) {
        mapMasterProfile(master);
      }
    });

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
            "",
          )}`,
        });
      }

      // Offerings (render as a single amenity with value list)
      const offeringsRaw = attributes.offerings || attributes.Offerings;
      if (offeringsRaw) {
        const services = offeringsRaw
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        if (services.length > 0) {
          const top = services.slice(0, 5).map((s) => capitalizeWords(s));
          amenities.push({
            icon: <FaStar />,
            name: `Offerings: ${top.join(", ")}`,
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
                  `${API_BASE_URL}/api/vendor/increment-view/${data.vendor_id}`,
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
                  `skip increment-view for vendor ${data.vendor_id} (already viewed this session)`,
                );
              }
            }
          } catch (incErr) {
            // fail quietly but log for debugging
            console.debug("increment-view failed:", incErr?.message || incErr);
          }
        })();

        // Handle images from new API structure
        let parsedImages = [];
        if (data.media) {
          if (Array.isArray(data.media)) {
            parsedImages = data.media.map((item) =>
              typeof item === "string" ? item : item.url || item.path || null
            ).filter(Boolean);
          } else if (typeof data.media === "object" && Array.isArray(data.media.gallery)) {
            parsedImages = data.media.gallery.map((item) =>
              typeof item === "string" ? item : item.url || item.path || null
            ).filter(Boolean);
          }
        }

        if (!parsedImages.length && data.attributes?.Portfolio) {
          // Fallback: parse Portfolio field (pipe-separated URLs)
          parsedImages = data.attributes.Portfolio.split("|")
            .map((url) => url.trim())
            .filter((url) => url);
        }

        if (parsedImages.length > 0) {
          parsedImages = parsedImages.map(img => {
            if (typeof img === 'string' && img.startsWith('/uploads/')) {
              return `https://happywedz.com${img}`;
            }
            return img;
          });
          setImages(parsedImages);
          setMainImage(parsedImages[0]);
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
          `https://happywedz.com/api/faq-answers/${dynamicVendorId}`,
        );
        const answers = response.data || [];

        const answerMap = new Map(
          answers.map((a) => [a.faq_question_id, a.answer]),
        );

        const vendorTypeKey = Object.keys(FaqQuestions).find(
          (key) => FaqQuestions[key].vendor_type_id === dynamicVendorTypeId,
        );

        if (vendorTypeKey) {
          const questions = FaqQuestions[vendorTypeKey].questions || [];
          const normSubcat = (venueData?.subcategory?.name || "").trim().toLowerCase();

          let filteredQuestions = questions;

          // 1. Groomwear (vendor_type_id: 11)
          if (dynamicVendorTypeId === 11) {
            const isSherwani = normSubcat.includes("sherwani");
            const isWeddingSuit = normSubcat.includes("suit") || normSubcat.includes("wedding suite");

            filteredQuestions = questions.filter(q => {
              const qid = q.id;
              if (qid >= 401 && qid <= 410) return true;
              if (qid >= 411 && qid <= 425) return isSherwani;
              if (qid >= 426 && qid <= 435) return isWeddingSuit;
              return true;
            });
          }
          // 2. Decorators (vendor_type_id: 4)
          else if (dynamicVendorTypeId === 4) {
            const isDecorator = normSubcat.includes("decorator") || normSubcat.includes("decor") || normSubcat.includes("event styling");
            filteredQuestions = questions.filter(q => {
              const qid = q.id;
              if (qid >= 1201 && qid <= 1212) return true;
              if (qid >= 1213 && qid <= 1225) return isDecorator;
              return true;
            });
          }
          // 3. Invites & Gifts (vendor_type_id: 9)
          else if (dynamicVendorTypeId === 9) {
            const isTrousseauPacker = normSubcat.includes("trousseau packer") || normSubcat.includes("trousseau pack");
            const isGift = normSubcat === "gifts" || normSubcat === "gift" || normSubcat.includes("gifting") || normSubcat === "invitation gifts";
            const isFavor = normSubcat.includes("favor") || normSubcat.includes("favour");
            const isInvitation = (normSubcat.includes("invitation") || normSubcat.includes("invite")) && !isGift;

            filteredQuestions = questions.filter(q => {
              const qid = q.id;
              if (qid >= 1501 && qid <= 1515) return true;
              if (qid >= 2116 && qid <= 2129) return isTrousseauPacker;
              if (qid >= 2130 && qid <= 2144) return isGift;
              if (qid >= 2145 && qid <= 2159) return isFavor;
              if (qid >= 2160 && qid <= 2172) return isInvitation;
              return true;
            });
          }

          const mergedFaqs = filteredQuestions.map((q) => ({
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
      displayLocation,
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
  const vendorFeatures = getVendorFeatures(venueData);
  const hasManyFeatures = vendorFeatures.length > 9;
  const featuresToRender = showAllFeatures
    ? vendorFeatures
    : vendorFeatures.slice(0, 9);

  // Smooth scroll to section by id
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="venue-detail-page">
      <Container className="py-2">
        <Row>
          <Col lg={8}>
            <div className="main-image-container mb-4 position-relative">
              {mediaTab === "gallery" ? (
                mainImage ? (
                  <img
                    src={mainImage}
                    alt={venueData.attributes?.name || "Main Vendor"}
                    className="main-image rounded-lg"
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      // Fallback to local placeholder image when main image fails to load
                      e.target.onerror = null;
                      e.target.src = "/images/imageNotFound.jpg";
                      try {
                        setMainImage("/images/imageNotFound.jpg");
                      } catch (err) {
                        // ignore if setMainImage not available in this scope for any reason
                      }
                    }}
                  />
                ) : (
                  <div className="main-image rounded-lg d-flex align-items-center justify-content-center bg-light">
                    <p className="text-muted">No image available</p>
                  </div>
                )
              ) : mainVideo ? (
                getYouTubeVideoId(mainVideo) ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                      mainVideo,
                    )}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                    style={{
                      width: "100%",
                      height: "500px",
                      border: "none",
                      backgroundColor: "#000",
                    }}
                  />
                ) : (
                  <video
                    src={mainVideo}
                    controls
                    className="rounded-lg"
                    style={{
                      width: "100%",
                      height: "500px",
                      objectFit: "cover",
                      backgroundColor: "#000",
                    }}
                  />
                )
              ) : (
                <div className="main-image rounded-lg d-flex align-items-center justify-content-center bg-light">
                  <p className="text-muted">No video available</p>
                </div>
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
                  className="btn btn-sm fs-14"
                  onClick={() => setMediaTab("gallery")}
                  style={{
                    background: mediaTab === "gallery" ? "#f2f2f2" : "#fff",
                    color: "#000",
                    border:
                      mediaTab === "gallery"
                        ? "2px solid #000"
                        : "1px solid #e5e5e5",
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
                  className="btn btn-sm fs-14"
                  onClick={() => setMediaTab("video")}
                  disabled={videos.length === 0}
                  title={videos.length === 0 ? "No videos available" : ""}
                  style={{
                    background: mediaTab === "video" ? "#f2f2f2" : "#fff",
                    color: "#000",
                    border:
                      mediaTab === "video"
                        ? "2px solid #000"
                        : "1px solid #e5e5e5",
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
                  onClick={() => navigate(`/vendor-360/${id}`)}
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

            {mediaTab === "gallery"
              ? images.length > 0 && (
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
                              height: "100%",
                              objectFit: "cover",
                            }}
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
              : videos.length > 0 && (
                <div className="mb-5">
                  <div className="d-flex gap-2 flex-wrap">
                    {videos.map((vid, idx) => {
                      const youtubeId = getYouTubeVideoId(vid);
                      return youtubeId ? (
                        <div
                          key={idx}
                          onClick={() => setMainVideo(vid)}
                          className={`rounded overflow-hidden position-relative ${mainVideo === vid ? "border border-primary" : ""
                            }`}
                          style={{
                            width: "160px",
                            height: "100px",
                            backgroundColor: "#000",
                            cursor: "pointer",
                            backgroundImage: `url(https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center h-100"
                            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8 5V19L19 12L8 5Z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <video
                          key={idx}
                          src={vid}
                          muted
                          onClick={() => setMainVideo(vid)}
                          className={`rounded ${mainVideo === vid ? "border border-primary" : ""
                            }`}
                          style={{
                            width: "160px",
                            height: "100px",
                            objectFit: "cover",
                            backgroundColor: "#000",
                            cursor: "pointer",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

            {/* In-page navigation */}
            <SectionTabs scrollToSection={scrollToSection} />

            <div id="about" className="venue-description mb-5 p-2">
              <h3 className="details-section-title fw-bold fs-22">
                About {venueData.attributes?.name || venueData.attributes?.Name}
              </h3>
              {venueData.attributes?.about_us ? (
                <div
                  className="description-text text-black fs-14 vendor-about-html"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      venueData?.attributes?.about_us || "",
                    ),
                  }}
                />
              ) : (
                <p className="text-black text-justify">
                  No description available for this vendor.
                </p>
              )}

              {/* {venueData.attributes?.subtitle && (
                <p className="description-text text-black text-justify fs-14">
                  {venueData.attributes.subtitle}
                </p>
              )} */}
            </div>

            {/* DYNAMIC AMENITIES / SERVICES */}
            <div className="venue-amenities mb-5">
              <h3 className="details-section-title fw-bold fs-22 mb-4">
                Features and Facilities
              </h3>
              <Row>
                {vendorFeatures.length > 0 ? (
                  featuresToRender.map((item, index) => {
                    const raw = item.name || "";
                    const isSub = raw.startsWith("-");
                    const trimmed = isSub
                      ? raw.replace(/^\-\s*/, "").trim()
                      : raw.trim();
                    const [labelPart, ...rest] = trimmed.split(":");
                    const label = (labelPart || "").trim();
                    const value = rest.join(":").trim();

                    return (
                      <Col
                        key={index}
                        md={isSub ? 12 : 4}
                        sm={isSub ? 12 : 6}
                        xs={12}
                        className={isSub ? "mb-2" : "mb-4"}
                      >
                        <div className={`amenity-item ${isSub ? "ms-4" : ""}`}>
                          <div className="d-flex flex-column">
                            <span className="fw-semibold text-dark fs-16">
                              {label}
                            </span>
                            {value && (
                              <span className="text-muted small mt-1 fs-14">
                                {value}
                              </span>
                            )}
                            {!value && !label && (
                              <span className="text-muted small fs-14">
                                {trimmed}
                              </span>
                            )}
                          </div>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <Col>
                    <p className="text-muted">
                      No service or amenity information available.
                    </p>
                  </Col>
                )}
              </Row>
              {hasManyFeatures && (
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-dark fw-semibold text-decoration-underline fs-14"
                    onClick={() => setShowAllFeatures((prev) => !prev)}
                  >
                    {showAllFeatures ? "Show Less" : "Read More"}
                  </button>
                </div>
              )}
            </div>

            {/* FaqQuestionAnswer Detailed */}

            <div id="FAQ" className="my-4 border p-3 rounded">
              <h5 className="my-4 fs-16">Frequently Asked Questions</h5>

              {(() => {
                // Helper to parse various answer shapes into a string array
                const parseAnswer = (answer) => {
                  if (answer == null) return [];
                  if (Array.isArray(answer)) {
                    return answer.filter((item) => item != null && item !== "");
                  }
                  if (typeof answer === "object") {
                    const values = Object.values(answer).filter(
                      (v) => v != null && v !== "",
                    );
                    if (values.length === 2)
                      return [`${values[0]} - ${values[1]}`];
                    if (values.length === 1) return values;
                    return values;
                  }
                  const strValue = String(answer).trim();
                  return strValue ? [strValue] : [];
                };

                // Only include FAQs with at least one non-empty answer
                const validFaqs = (faqList || []).filter(
                  (q) => parseAnswer(q.ans).length > 0,
                );

                if (validFaqs.length === 0) {
                  return (
                    <p className="text-muted fs-14">
                      No FAQ information available for this vendor.
                    </p>
                  );
                }

                const listToShow = showAllFaqs
                  ? validFaqs
                  : validFaqs.slice(0, 5);

                return (
                  <>
                    {listToShow.map((ques, index) => {
                      const answers = parseAnswer(ques.ans);
                      const isSingleAnswer = answers.length === 1;
                      return (
                        <div
                          className="w-100 rounded border-bottom fs-14"
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
                    })}

                    {validFaqs.length > 5 && (
                      <div className="text-start mt-3">
                        <button
                          className="btn btn-link p-0 text-dark fw-semibold text-decoration-underline fs-14"
                          onClick={() => setShowAllFaqs(!showAllFaqs)}
                        >
                          {showAllFaqs ? "Show Less" : "Read More"}
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div id="reviews" className="py-2">
              <ReviewSection vendor={venueData || activeVendor} />
            </div>

            <div id="map" className="mt-4 pt-3 border-top">
              <div
                className="mb-2 fw-semibold text-dark fs-16"
                style={{ fontSize: "1.05rem" }}
              >
                <span>
                  {venueData?.attributes?.address ||
                    venueData?.attributes?.city}
                </span>
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
          </Col>

          <Col lg={4} className="ps-lg-5">
            <div
              className="venue-details-card p-4 border rounded z-0"
              style={{ top: "20px" }}
            >
              <div className="venue-info">
                {/* Title + Location */}
                <div className="mb-3">
                  <div className="d-flex">
                    <h2 className="fw-bold fs-22 text-dark m-0">
                      {venueData?.attributes?.name ||
                        venueData?.attributes?.Name ||
                        "Vendor Name"}
                    </h2>
                  </div>

                  <div
                    className={`d-flex ${(
                      venueData?.attributes?.address ||
                      venueData?.attributes?.city ||
                      ""
                    ).length > 38
                      ? "align-items-start"
                      : "align-items-center"
                      } my-2 fs-14 text-black`}
                  >
                    <FaLocationDot
                      className="me-1"
                      size={15}
                      color="#000"
                      style={{
                        marginTop:
                          (
                            venueData?.attributes?.address ||
                            venueData?.attributes?.city ||
                            ""
                          ).length > 38
                            ? "3px"
                            : "0",
                      }}
                    />
                    <span
                      style={{
                        wordBreak: "break-word",
                        lineHeight: "1.3",
                      }}
                    >
                      {venueData?.attributes?.address ||
                        venueData?.attributes?.city}
                    </span>
                  </div>

                  {/* Rating Clean */}
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="rating-badge d-flex align-items-center gap-1">
                      <FaStar size={12} color="#000" />
                      <span className="fw-semibold text-dark fs-16">
                        {venueData.attributes?.rating || 0}
                      </span>
                      <span className="text-muted fs-10">
                        ({venueData.attributes?.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="tags mb-4 d-flex flex-wrap gap-2">
                  {/* {venueData.attributes?.vendor_type && (
                    <span className="px-2 py-1 border rounded text-dark fs-12 bg-white">
                      {venueData.attributes.vendor_type}
                    </span>
                  )} */}
                  {/* {isVenue && venueData.attributes?.rooms && (
                    <span className="px-2 py-1 border rounded text-dark fs-12 bg-white">
                      Hotel/Resort
                    </span>
                  )}
                  {isVenue && venueData.attributes?.indoor_outdoor && (
                    <span className="px-2 py-1 border rounded text-dark fs-12 bg-white">
                      {capitalizeWords(venueData.attributes.indoor_outdoor)}
                    </span>
                  )} */}
                </div>

                {/* Pricing Section */}
                <div className="pricing mb-3 text-dark">
                  {isVenue ? (
                    <>
                      <h4 className="fw-semibold fs-16 m-0">
                        Veg Starting Price
                      </h4>
                      <div className="fw-bold fs-16 mt-1 primary-text">
                        {venueData.attributes?.veg_price
                          ? `₹ ${parseInt(
                            venueData.attributes.veg_price.replace(/,/g, ""),
                            10,
                          ).toLocaleString()}`
                          : "Contact for pricing"}
                      </div>

                      <h4 className="fw-semibold fs-16 mt-3 m-0 ">
                        Non-Veg Starting Price
                      </h4>
                      <div className="fw-bold fs-16 mt-1 primary-text">
                        {venueData.attributes?.non_veg_price
                          ? `₹ ${parseInt(
                            venueData.attributes.non_veg_price.replace(
                              /,/g,
                              "",
                            ),
                            10,
                          ).toLocaleString()} onwards`
                          : "Contact for pricing"}
                      </div>

                      {venueData.attributes?.starting_price && (
                        <div
                          className="mt-3 d-flex align-items-center justify-content-between"
                          style={{ cursor: "pointer" }}
                          onClick={() => setShowStartingPrice((prev) => !prev)}
                        >
                          <span className="fw-semibold fs-14">
                            Venue starting price
                          </span>
                          <span className="d-flex align-items-center primary-text fs-14">
                            {showStartingPrice && (
                              <span className="me-2">
                                ₹{" "}
                                {parseInt(
                                  String(
                                    venueData.attributes.starting_price,
                                  ).replace(/[^0-9]/g, ""),
                                  10,
                                ).toLocaleString()}
                              </span>
                            )}
                            {showStartingPrice ? (
                              <FaChevronUp size={14} />
                            ) : (
                              <FaChevronDown size={14} />
                            )}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="fw-semibold fs-16 d-block">
                        {venueData.attributes?.vendor_type === "Makeup"
                          ? "Makeup Package (Starting)"
                          : venueData.attributes?.vendor_type === "Photography"
                            ? "Photography Package (Starting)"
                            : venueData.attributes?.vendor_type ===
                              "Music And Dance"
                              ? ""
                              : ""}
                      </span>

                      <div className="fs-16 fw-bold mt-1">
                        <span className="fw-semibold fs-16 d-block">
                          Starting Price
                        </span>
                        <span className="primary-text">
                          ₹{" "}
                          {venueData.attributes?.PriceRange ||
                            venueData.attributes.starting_price
                            ? venueData.attributes.PriceRange.replace(
                              "Rs.",
                              "",
                            ).trim() || venueData.attributes.starting_price
                            : venueData.attributes.photo_package_price
                              ? `₹${parseInt(
                                venueData.attributes.photo_package_price.replace(
                                  /,/g,
                                  "",
                                ),
                              ).toLocaleString()} onwards`
                              : "Contact for pricing"}
                        </span>
                      </div>

                      {venueData.attributes?.photo_video_package_price && (
                        <>
                          <h4 className="fw-semibold fs-16 mt-3 d-block m-0">
                            Photo + Video Package (Starting)
                          </h4>
                          <div className="fs-16 fw-bold mt-1">
                            <span className="primary-text">
                              ₹{" "}
                              {venueData.attributes.photo_video_package_price.replace(
                                "Rs.",
                                "",
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="details-action-group">
                  <button
                    className="btn btn-outline-primary details-action-btn rounded-2"
                    onClick={() => setShowClaimForm(true)}
                  >
                    Claim Your Business
                  </button>
                </div>

                <hr />

                <div className="details-action-group mb-3">
                  <button
                    className="btn btn-outline-primary details-action-btn rounded-2"
                    onClick={() => handleShowPricingModal(venueData.vendor_id)}
                  >
                    Request Pricing & Availability
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Similar Venues/Vendors section */}
      <SimilarServices venueData={venueData} currentId={id} />

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
