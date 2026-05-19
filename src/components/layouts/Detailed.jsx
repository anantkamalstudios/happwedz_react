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
    const mehndiArtistMaster = attributes.mehndi_artist_master || {};
    const floristMaster = attributes.florist_master || {};
    const panditMaster = attributes.pandit_master || {};
    const djMaster = attributes.dj_master || {};
    const sangeetChoreographerMaster = attributes.sangeet_choreographer_master || {};
    const weddingEntertainerMaster = attributes.wedding_entertainer_master || {};
    const preWeddingLocationMaster = attributes.pre_wedding_location_master || {};
    const preWeddingPhotographerMaster = attributes.pre_wedding_photographer_master || {};

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

    // --- DYNAMIC MASTER PROFILE EXTRACTION (Planning & Decor, Invites & Gifts, Groomwear) ---
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
    // --- MEHNDI ARTIST MASTER ATTRIBUTES ---
    if (mehndiArtistMaster && Object.keys(mehndiArtistMaster).length > 0) {
      const id = mehndiArtistMaster.identity || {};
      const srv = mehndiArtistMaster.services || {};
      const stl = mehndiArtistMaster.style_intelligence || {};
      const brd = mehndiArtistMaster.bridal_details || {};
      const gst = mehndiArtistMaster.guest_capacity || {};
      const mat = mehndiArtistMaster.material_quality || {};
      const evt = mehndiArtistMaster.event_suitability || {};
      const spd = mehndiArtistMaster.speed_execution || {};
      const prc = mehndiArtistMaster.pricing_travel || {};
      const wf = mehndiArtistMaster.workflow || {};

      pushFeature(amenities, <FaStar />, "Artist Type", id.artist_type);
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Availability", id.travel_availability);
      pushFeature(amenities, <FaUsers />, "Team Size", id.team_size);

      pushFeature(amenities, <FaStar />, "Services", formatList(srv.services_offered, 5));
      pushFeature(amenities, <FaStar />, "Coverage Type", formatList(srv.coverage_type, 3));

      pushFeature(amenities, <FaStar />, "Mehendi Style", formatList(stl.mehendi_style, 5));
      pushFeature(amenities, <FaStar />, "Design Complexity", stl.design_complexity);
      pushFeature(amenities, <FaStar />, "Best Known For", formatList(stl.best_known_for, 4));
      pushFeature(amenities, <FaStar />, "Custom Designs", stl.custom_designs_available);
      pushFeature(amenities, <FaStar />, "Personalization", formatList(stl.personalization_options, 4));

      pushFeature(amenities, <FaStar />, "Bridal Coverage", brd.bridal_coverage);
      pushFeature(amenities, <FaStar />, "Bridal Duration", brd.bridal_duration);
      if (brd.bridal_starting_price) {
        pushFeature(amenities, <FaStar />, "Bridal Starting Price", `₹${brd.bridal_starting_price}`);
      }

      pushFeature(amenities, <FaUsers />, "Guests Per Hour", gst.guests_per_hour);
      pushFeature(amenities, <FaUsers />, "Max Guests Covered", gst.max_guests_covered);
      pushFeature(amenities, <FaStar />, "Guest Pricing Model", gst.guest_pricing_model);
      pushFeature(amenities, <FaStar />, "Team Support for Guests", gst.team_support_for_guests);

      pushFeature(amenities, <FaStar />, "Mehendi Type", mat.mehendi_type);
      pushFeature(amenities, <FaStar />, "Color Guarantee", mat.color_guarantee);
      pushFeature(amenities, <FaStar />, "Aftercare Provided", mat.aftercare_instructions_provided);
      pushFeature(amenities, <FaStar />, "Allergies Consideration", mat.allergies_consideration);

      pushFeature(amenities, <FaCalendarAlt />, "Functions Covered", formatList(evt.functions_covered, 5));
      pushFeature(amenities, <FaStar />, "Best For", formatList(evt.best_for, 4));

      pushFeature(amenities, <FaStar />, "Application Speed", spd.application_speed);
      pushFeature(amenities, <FaUsers />, "Parallel Artists", spd.parallel_artists_available);
      pushFeature(amenities, <FaCalendarAlt />, "Multiple Events Handling", spd.multiple_events_handling);

      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Charges", prc.travel_charges);
      pushFeature(amenities, <FaStar />, "Stay Requirement", prc.stay_requirement);
      pushFeature(amenities, <FaStar />, "Min Booking Value", prc.minimum_booking_value);

      pushFeature(amenities, <FaStar />, "Advance Required", wf.advance_required);
      pushFeature(amenities, <FaStar />, "Advance Percentage", wf.advance_percentage);
      pushFeature(amenities, <FaStar />, "Booking Timeline", wf.booking_timeline);
      pushFeature(amenities, <FaStar />, "Cancellation Policy", wf.cancellation_policy);

      const ptag = mehndiArtistMaster.portfolio_tagging || {};
      pushFeature(amenities, <FaStar />, "Portfolio Tags", ptag.tags);
      pushFeature(amenities, <FaStar />, "Portfolio Notes", ptag.notes);
    }

    // --- FLORIST MASTER ATTRIBUTES ---
    if (floristMaster && Object.keys(floristMaster).length > 0) {
      const id = floristMaster.identity || {};
      const srv = floristMaster.services_offered || {};
      const core = floristMaster.core_intelligence || {};
      const tech = floristMaster.technical || {};
      const prc = floristMaster.pricing || {};
      const scale = floristMaster.scale_capacity || {};
      const wf = floristMaster.workflow || {};
      const ptag = floristMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Presence", formatList(id.service_presence, 3));
      pushFeature(amenities, <FaStar />, "Store Presence", formatList(id.store_presence, 3));
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaStar />, "Specialization", formatList(id.specialization, 5));

      pushFeature(amenities, <FaStar />, "Service Types", formatList(srv.service_types, 4));
      pushFeature(amenities, <FaStar />, "Customization", srv.customization_available);
      pushFeature(amenities, <FaStar />, "Same Day Delivery", srv.same_day_delivery);
      pushFeature(amenities, <FaStar />, "Subscription Services", srv.subscription_services);
      pushFeature(amenities, <FaUsers />, "Bulk Orders", srv.bulk_order_handling);
      pushFeature(amenities, <FaStar />, "Event Setup", srv.event_setup_support);
      pushFeature(amenities, <FaStar />, "Packaging", formatList(srv.packaging_options, 3));

      pushFeature(amenities, <FaStar />, "Flower Types", formatList(core.flower_types_available, 7));
      pushFeature(amenities, <FaStar />, "Usage Types", formatList(core.usage_types, 6));
      pushFeature(amenities, <FaStar />, "Fragrance", core.fragrance_level);
      pushFeature(amenities, <FaStar />, "Longevity", core.longevity_type);
      pushFeature(amenities, <FaStar />, "Color Palette", formatList(core.color_palette, 6));
      pushFeature(amenities, <FaCalendarAlt />, "Seasonal Availability", core.seasonal_availability);

      pushFeature(amenities, <FaStar />, "Storage", tech.storage_facility);
      pushFeature(amenities, <FaStar />, "Freshness Guarantee", tech.flower_freshness_guarantee);
      pushFeature(amenities, <FaStar />, "Sourcing", formatList(tech.sourcing_type, 3));
      pushFeature(amenities, <FaStar />, "Arrangements", formatList(tech.arrangement_types, 4));
      pushFeature(amenities, <FaStar />, "Eco-Friendly", tech.eco_friendly_options);

      pushFeature(amenities, <FaStar />, "Price Range", prc.price_range);
      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Delivery Charges", prc.delivery_charges);
      pushFeature(amenities, <FaStar />, "Setup Charges", prc.setup_charges);
      pushFeature(amenities, <FaStar />, "Bulk Discounts", prc.bulk_discounts);

      pushFeature(amenities, <FaStar />, "Daily Order Capacity", scale.daily_order_capacity);
      pushFeature(amenities, <FaCalendarAlt />, "Event Capacity", scale.event_handling_capacity);
      pushFeature(amenities, <FaUsers />, "Team Size", scale.team_size);

      pushFeature(amenities, <FaStar />, "Advance Booking", wf.advance_booking_required);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Window", wf.booking_window);
      pushFeature(amenities, <FaStar />, "Customization Approval", wf.customization_approval_process);
      pushFeature(amenities, <FaStar />, "Delivery Time Slots", wf.delivery_time_slots);
      pushFeature(amenities, <FaStar />, "Payment Modes", formatList(wf.payment_modes, 4));
      pushFeature(amenities, <FaStar />, "Advance Payment", wf.advance_payment_percentage);

      pushFeature(amenities, <FaStar />, "Style Tags", formatList(ptag.style_tags, 5));
      pushFeature(amenities, <FaUsers />, "Audience Tags", formatList(ptag.audience_tags, 4));
      pushFeature(amenities, <FaStar />, "Usage Tags", formatList(ptag.usage_tags, 4));
      pushFeature(amenities, <FaStar />, "Price Segment", ptag.price_segment_tags);
    }

    // --- PANDIT MASTER ATTRIBUTES ---
    if (panditMaster && Object.keys(panditMaster).length > 0) {
      const id = panditMaster.identity || {};
      const srv = panditMaster.services_offered || {};
      const core = panditMaster.core_intelligence || {};
      const tech = panditMaster.technical || {};
      const prc = panditMaster.pricing || {};
      const scale = panditMaster.scale_capacity || {};
      const wf = panditMaster.workflow || {};
      const ptag = panditMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaStar />, "Pandit Name", id.pandit_name);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Presence", formatList(id.service_presence, 4));
      pushFeature(amenities, <FaMapMarkerAlt />, "City Base", id.city_base);
      pushFeature(amenities, <FaStar />, "Languages", formatList(id.languages_spoken, 5));
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaStar />, "Tradition", formatList(id.religious_tradition, 4));

      pushFeature(amenities, <FaStar />, "Ceremonies", formatList(srv.ceremony_types, 5));
      pushFeature(amenities, <FaStar />, "Destination Wedding", srv.destination_wedding_services);
      pushFeature(amenities, <FaStar />, "Virtual Ceremony", srv.virtual_ceremony_support);
      pushFeature(amenities, <FaStar />, "Ritual Explanation", srv.ritual_explanation_provided);
      pushFeature(amenities, <FaStar />, "Custom Rituals", srv.customized_rituals);
      pushFeature(amenities, <FaStar />, "Samagri", srv.samagri_provided);
      pushFeature(amenities, <FaUsers />, "Assistant Pandits", srv.assistant_pandits_included);

      pushFeature(amenities, <FaCalendarAlt />, "Ritual Duration", core.ritual_duration_options);
      pushFeature(amenities, <FaStar />, "Complexity", core.ritual_complexity_level);
      pushFeature(amenities, <FaStar />, "Muhurat Guidance", core.muhurat_guidance_provided);
      pushFeature(amenities, <FaStar />, "Horoscope Matching", core.horoscope_matching);
      pushFeature(amenities, <FaStar />, "Language Preference", formatList(core.ritual_language_preference, 3));
      pushFeature(amenities, <FaStar />, "Havan Included", core.fire_ritual_havan_included);
      pushFeature(amenities, <FaStar />, "Interfaith Ceremonies", core.interfaith_custom_ceremonies);

      pushFeature(amenities, <FaStar />, "Audio Setup", tech.audio_setup_requirement);
      pushFeature(amenities, <FaStar />, "Mic Usage", tech.microphone_usage);
      pushFeature(amenities, <FaStar />, "Samagri List Advance", tech.samagri_list_provided_in_advance);
      pushFeature(amenities, <FaCalendarAlt />, "Setup Time", tech.setup_time_required);
      pushFeature(amenities, <FaStar />, "Dress Code", tech.dress_code_provided);
      pushFeature(amenities, <FaStar />, "Ritual Booklet", tech.documentation_ritual_booklet);

      pushFeature(amenities, <FaStar />, "Price Range", prc.price_range);
      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Charges", prc.travel_charges);
      pushFeature(amenities, <FaStar />, "Samagri Charges", prc.samagri_charges);
      pushFeature(amenities, <FaStar />, "Dakshina", prc.dakshina_flexibility);

      pushFeature(amenities, <FaCalendarAlt />, "Events Per Day", scale.events_per_day);
      pushFeature(amenities, <FaUsers />, "Team Size", scale.team_size);
      pushFeature(amenities, <FaMapMarkerAlt />, "Multi-Location", scale.multi_location_handling);

      pushFeature(amenities, <FaStar />, "Advance Booking", wf.advance_booking_required);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Window", wf.booking_window);
      pushFeature(amenities, <FaStar />, "Pre-consultation", wf.pre_ceremony_consultation);
      pushFeature(amenities, <FaStar />, "Customization Discussion", wf.ritual_customization_discussion);
      pushFeature(amenities, <FaStar />, "Arrival Timing", wf.arrival_timing);
      pushFeature(amenities, <FaStar />, "Payment Modes", formatList(wf.payment_modes, 4));
      pushFeature(amenities, <FaStar />, "Advance Payment", wf.advance_payment_percentage);

      pushFeature(amenities, <FaStar />, "Style Tags", formatList(ptag.style_tags, 4));
      pushFeature(amenities, <FaUsers />, "Audience Tags", formatList(ptag.audience_tags, 4));
      pushFeature(amenities, <FaStar />, "Usage Tags", formatList(ptag.usage_tags, 4));
      pushFeature(amenities, <FaStar />, "Price Segment", ptag.price_segment_tags);
    }

    // --- DJ MASTER ATTRIBUTES ---
    if (djMaster && Object.keys(djMaster).length > 0) {
      // Normalize: support both nested format (djMaster.identity.brand_name)
      // and flat legacy format (djMaster.brand_name) saved by earlier versions.
      const id = Object.keys(djMaster.identity || {}).length > 0
        ? djMaster.identity
        : {
          brand_name: djMaster.brand_name,
          primary_city: djMaster.primary_city,
          service_cities: djMaster.service_cities,
          vendor_type: djMaster.vendor_type,
          years_of_experience: djMaster.years_of_experience,
          travel_policy: djMaster.travel_policy,
          languages: djMaster.languages,
        };
      const srv = Object.keys(djMaster.services || {}).length > 0
        ? djMaster.services
        : {
          event_types: djMaster.event_types,
          dj_formats: djMaster.dj_formats,
          additional_services: djMaster.additional_services,
        };
      const core = Object.keys(djMaster.core_intelligence || {}).length > 0
        ? djMaster.core_intelligence
        : {
          music_genres: djMaster.music_genres,
          crowd_handling: djMaster.crowd_handling,
          specialization_style: djMaster.specialization_style,
          live_mixing_capability: djMaster.live_mixing_capability,
          custom_playlist_support: djMaster.custom_playlist_support,
          song_request_handling: djMaster.song_request_handling,
          entry_sync: djMaster.entry_sync,
          baraat_dj_setup: djMaster.baraat_dj_setup,
          backup_dj_available: djMaster.backup_dj_available,
        };
      const tech = Object.keys(djMaster.technical_setup || {}).length > 0
        ? djMaster.technical_setup
        : {
          equipment_ownership: djMaster.equipment_ownership,
          sound_setup_capability: djMaster.sound_setup_capability,
          lighting_setup: djMaster.lighting_setup,
          console_types: djMaster.console_types,
          power_backup: djMaster.power_backup,
          setup_time_required: djMaster.setup_time_required,
          technical_team_size: djMaster.technical_team_size,
        };
      const prc = Object.keys(djMaster.pricing || {}).length > 0
        ? djMaster.pricing
        : {
          pricing_model: djMaster.pricing_model,
          starting_price_range: djMaster.starting_price_range,
          includes: djMaster.includes,
          addon_charges: djMaster.addon_charges,
          peak_season_pricing: djMaster.peak_season_pricing,
          negotiation_flexibility: djMaster.negotiation_flexibility,
        };
      const scale = Object.keys(djMaster.scale_capacity || {}).length > 0
        ? djMaster.scale_capacity
        : {
          max_events_per_day: djMaster.max_events_per_day,
          concurrent_events: djMaster.concurrent_events,
          team_multi_event: djMaster.team_multi_event,
        };
      const wf = Object.keys(djMaster.workflow || {}).length > 0
        ? djMaster.workflow
        : {
          advance_booking_time: djMaster.advance_booking_time,
          booking_advance_percent: djMaster.booking_advance_percent,
          cancellation_policy: djMaster.cancellation_policy,
          coordination_mode: djMaster.coordination_mode,
          pre_event_planning_call: djMaster.pre_event_planning_call,
        };
      const ptag = Object.keys(djMaster.portfolio_tagging || {}).length > 0
        ? djMaster.portfolio_tagging
        : {
          event_mood_tags: djMaster.event_mood_tags,
          music_style_tags: djMaster.music_style_tags,
          celebrity_big_event_experience: djMaster.celebrity_big_event_experience,
        };

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaStar />, "Brand Name", id.brand_name);
      pushFeature(amenities, <FaMapMarkerAlt />, "Primary City", id.primary_city);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Cities", formatList(id.service_cities, 5));
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Policy", id.travel_policy);
      pushFeature(amenities, <FaStar />, "Languages Comfortable", formatList(id.languages, 5));

      pushFeature(amenities, <FaCalendarAlt />, "Event Types Covered", formatList(srv.event_types, 6));
      pushFeature(amenities, <FaStar />, "DJ Formats", formatList(srv.dj_formats, 4));
      pushFeature(amenities, <FaStar />, "Additional Services", formatList(srv.additional_services, 5));

      pushFeature(amenities, <FaStar />, "Music Genres", formatList(core.music_genres, 6));
      pushFeature(amenities, <FaUsers />, "Crowd Handling Capability", core.crowd_handling);
      pushFeature(amenities, <FaStar />, "Specialization Style", core.specialization_style);
      pushFeature(amenities, <FaStar />, "Live Mixing Capability", core.live_mixing_capability);
      pushFeature(amenities, <FaStar />, "Custom Playlist Support", core.custom_playlist_support);
      pushFeature(amenities, <FaStar />, "Song Request Handling", core.song_request_handling);
      pushFeature(amenities, <FaStar />, "Entry & Performance Sync", formatList(core.entry_sync, 4));
      pushFeature(amenities, <FaStar />, "Baraat DJ Setup", core.baraat_dj_setup);
      pushFeature(amenities, <FaStar />, "Backup DJ Available", core.backup_dj_available);

      pushFeature(amenities, <FaStar />, "Equipment Ownership", tech.equipment_ownership);
      pushFeature(amenities, <FaStar />, "Sound Setup Capability", tech.sound_setup_capability);
      pushFeature(amenities, <FaStar />, "Lighting Setup", tech.lighting_setup);
      pushFeature(amenities, <FaStar />, "Console Types", formatList(tech.console_types, 4));
      pushFeature(amenities, <FaStar />, "Power Backup", tech.power_backup);
      pushFeature(amenities, <FaCalendarAlt />, "Setup Time Required", tech.setup_time_required);
      pushFeature(amenities, <FaUsers />, "Technical Team Size", tech.technical_team_size);

      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Starting Price Range", prc.starting_price_range);
      pushFeature(amenities, <FaStar />, "Includes", formatList(prc.includes, 4));
      pushFeature(amenities, <FaStar />, "Add-on Charges", formatList(prc.addon_charges, 4));
      pushFeature(amenities, <FaStar />, "Peak Season Pricing", prc.peak_season_pricing);
      pushFeature(amenities, <FaStar />, "Negotiation Flexibility", prc.negotiation_flexibility);

      pushFeature(amenities, <FaCalendarAlt />, "Max Events Per Day", scale.max_events_per_day);
      pushFeature(amenities, <FaStar />, "Concurrent Events", scale.concurrent_events);
      pushFeature(amenities, <FaUsers />, "Team-based Multi-event", scale.team_multi_event);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", wf.advance_booking_time);
      pushFeature(amenities, <FaStar />, "Booking Advance Percentage", wf.booking_advance_percent);
      pushFeature(amenities, <FaStar />, "Cancellation Policy", wf.cancellation_policy);
      pushFeature(amenities, <FaStar />, "Client Coordination Mode", wf.coordination_mode);
      pushFeature(amenities, <FaStar />, "Pre-event Planning Call", wf.pre_event_planning_call);

      pushFeature(amenities, <FaStar />, "Event Mood Tags", formatList(ptag.event_mood_tags, 5));
      pushFeature(amenities, <FaStar />, "Music Style Tags", formatList(ptag.music_style_tags, 5));
      pushFeature(amenities, <FaStar />, "Celebrity/Big Event Experience", ptag.celebrity_big_event_experience);
    }

    // --- SANGEET CHOREOGRAPHER MASTER ATTRIBUTES ---
    if (sangeetChoreographerMaster && Object.keys(sangeetChoreographerMaster).length > 0) {
      const id = sangeetChoreographerMaster.identity || {};
      const srv = sangeetChoreographerMaster.services || {};
      const core = sangeetChoreographerMaster.core_intelligence || {};
      const rehearsal = sangeetChoreographerMaster.rehearsal_logistics || {};
      const exec = sangeetChoreographerMaster.performance_execution || {};
      const prc = sangeetChoreographerMaster.pricing || {};
      const scale = sangeetChoreographerMaster.scale_capacity || {};
      const wf = sangeetChoreographerMaster.workflow || {};
      const ptag = sangeetChoreographerMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaStar />, "Brand Name", id.brand_name);
      pushFeature(amenities, <FaMapMarkerAlt />, "Primary City", id.primary_city);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Cities", formatList(id.service_cities, 5));
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Policy", id.travel_policy);
      pushFeature(amenities, <FaStar />, "Languages Comfortable", formatList(id.languages, 5));

      pushFeature(amenities, <FaCalendarAlt />, "Event Types Covered", formatList(srv.event_types, 6));
      pushFeature(amenities, <FaStar />, "Dance Formats", formatList(srv.dance_formats, 5));
      pushFeature(amenities, <FaStar />, "Special Offerings", formatList(srv.special_offerings, 5));

      pushFeature(amenities, <FaStar />, "Dance Styles", formatList(core.dance_styles, 6));
      pushFeature(amenities, <FaStar />, "Skill Level Handling", core.skill_level_handling);
      pushFeature(amenities, <FaUsers />, "Age Group Handling", formatList(core.age_group_handling, 4));
      pushFeature(amenities, <FaUsers />, "Max Participants", core.max_participants_per_act);
      pushFeature(amenities, <FaStar />, "Story-based Choreography", core.story_based_choreography);
      pushFeature(amenities, <FaStar />, "Customization Level", core.customization_level);
      pushFeature(amenities, <FaStar />, "Music Selection Support", core.music_selection_support);
      pushFeature(amenities, <FaStar />, "Rehearsal Mode", core.rehearsal_mode);
      pushFeature(amenities, <FaStar />, "Performance Polish Level", core.performance_polish_level);

      pushFeature(amenities, <FaCalendarAlt />, "Rehearsal Sessions per Act", rehearsal.rehearsal_sessions_per_act);
      pushFeature(amenities, <FaCalendarAlt />, "Session Duration", rehearsal.session_duration);
      pushFeature(amenities, <FaMapMarkerAlt />, "Practice Location", rehearsal.practice_location);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel for Practice", rehearsal.travel_for_practice);
      pushFeature(amenities, <FaStar />, "Assistant Availability", rehearsal.assistant_availability);
      pushFeature(amenities, <FaStar />, "Last-minute Practice Support", rehearsal.last_minute_practice_support);

      pushFeature(amenities, <FaStar />, "On-event Presence", exec.on_event_presence);
      pushFeature(amenities, <FaStar />, "Backstage Coordination", exec.backstage_coordination);
      pushFeature(amenities, <FaStar />, "Entry & Transition Planning", exec.entry_transition_planning);
      pushFeature(amenities, <FaStar />, "Music Editing & Mixing", exec.music_editing_mixing);
      pushFeature(amenities, <FaStar />, "Props Support", exec.props_support);
      pushFeature(amenities, <FaStar />, "Costume Guidance", exec.costume_guidance);

      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Starting Price Range", prc.starting_price_range);
      pushFeature(amenities, <FaStar />, "Includes", formatList(prc.includes, 4));
      pushFeature(amenities, <FaStar />, "Add-on Charges", formatList(prc.addon_charges, 4));
      pushFeature(amenities, <FaStar />, "Peak Season Pricing", prc.peak_season_pricing);
      pushFeature(amenities, <FaStar />, "Negotiation Flexibility", prc.negotiation_flexibility);

      pushFeature(amenities, <FaCalendarAlt />, "Max Events Per Day", scale.max_events_per_day);
      pushFeature(amenities, <FaStar />, "Parallel Event Handling", scale.parallel_event_handling);
      pushFeature(amenities, <FaUsers />, "Team Size", scale.team_size);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", wf.advance_booking_time);
      pushFeature(amenities, <FaStar />, "Booking Advance Percentage", wf.booking_advance_percent);
      pushFeature(amenities, <FaStar />, "Cancellation Policy", wf.cancellation_policy);
      pushFeature(amenities, <FaStar />, "Client Coordination Mode", wf.coordination_mode);
      pushFeature(amenities, <FaStar />, "Trial Session Availability", wf.trial_session_availability);

      pushFeature(amenities, <FaStar />, "Performance Style Tags", formatList(ptag.performance_style_tags, 5));
      pushFeature(amenities, <FaStar />, "Event Scale Tags", formatList(ptag.event_scale_tags, 5));
      pushFeature(amenities, <FaStar />, "Choreography Style Tags", formatList(ptag.choreography_style_tags, 5));
    }

    // --- WEDDING ENTERTAINER MASTER ATTRIBUTES ---
    if (weddingEntertainerMaster && Object.keys(weddingEntertainerMaster).length > 0) {
      const id = weddingEntertainerMaster.identity || {};
      const srv = weddingEntertainerMaster.services || {};
      const core = weddingEntertainerMaster.core_intelligence || {};
      const tech = weddingEntertainerMaster.technical_setup || {};
      const prc = weddingEntertainerMaster.pricing || {};
      const scale = weddingEntertainerMaster.scale_capacity || {};
      const wf = weddingEntertainerMaster.workflow || {};
      const ptag = weddingEntertainerMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaStar />, "Brand Name", id.brand_name);
      pushFeature(amenities, <FaMapMarkerAlt />, "Primary City", id.primary_city);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Cities", formatList(id.service_cities, 5));
      const performerCat = id.performer_category === "Other" ? id.performer_category_other : id.performer_category;
      pushFeature(amenities, <FaStar />, "Performer Category", performerCat);
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaMapMarkerAlt />, "Travel Policy", id.travel_policy);
      pushFeature(amenities, <FaStar />, "Languages Comfortable", formatList(id.languages, 5));

      pushFeature(amenities, <FaCalendarAlt />, "Event Types Covered", formatList(srv.event_types, 6));
      pushFeature(amenities, <FaStar />, "Performance Types", formatList(srv.performance_types, 5));
      pushFeature(amenities, <FaUsers />, "Audience Type Handling", formatList(srv.audience_type_handling, 5));

      pushFeature(amenities, <FaStar />, "Engagement Style", core.engagement_style);
      pushFeature(amenities, <FaStar />, "Performance Duration", core.performance_duration);
      pushFeature(amenities, <FaStar />, "Performance Slots", core.performance_slots);
      pushFeature(amenities, <FaStar />, "Content Customization", core.content_customization);
      pushFeature(amenities, <FaStar />, "Theme Compatibility", formatList(core.theme_compatibility, 5));
      pushFeature(amenities, <FaStar />, "Energy Level", core.energy_level);
      pushFeature(amenities, <FaStar />, "Stage Requirement", core.stage_requirement);
      pushFeature(amenities, <FaStar />, "Sound Requirement", core.sound_requirement);
      pushFeature(amenities, <FaStar />, "Lighting Requirement", core.lighting_requirement);

      pushFeature(amenities, <FaStar />, "Equipment Ownership", tech.equipment_ownership);
      pushFeature(amenities, <FaCalendarAlt />, "Setup Time", tech.setup_time);
      pushFeature(amenities, <FaUsers />, "Team Size", tech.team_size);
      pushFeature(amenities, <FaStar />, "Power Requirement", tech.power_requirement);
      pushFeature(amenities, <FaStar />, "Green Room Requirement", tech.green_room_requirement);
      pushFeature(amenities, <FaStar />, "Outdoor Suitability", tech.outdoor_suitability);
      pushFeature(amenities, <FaStar />, "Indoor Suitability", tech.indoor_suitability);

      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Starting Price Range", prc.starting_price_range);
      pushFeature(amenities, <FaStar />, "Includes", formatList(prc.includes, 4));
      pushFeature(amenities, <FaStar />, "Add-ons", formatList(prc.addons, 4));
      pushFeature(amenities, <FaStar />, "Peak Season Pricing", prc.peak_pricing);
      pushFeature(amenities, <FaStar />, "Negotiation Flexibility", prc.negotiation_flexibility);

      pushFeature(amenities, <FaUsers />, "Audience Size Capability", scale.audience_size_capability);
      pushFeature(amenities, <FaStar />, "Multiple Event Handling", scale.multiple_event_handling);
      pushFeature(amenities, <FaStar />, "Parallel Performances", scale.parallel_performances);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", wf.advance_booking_time);
      pushFeature(amenities, <FaStar />, "Booking Advance Percentage", wf.booking_advance_percent);
      pushFeature(amenities, <FaStar />, "Cancellation Policy", wf.cancellation_policy);
      pushFeature(amenities, <FaStar />, "Client Coordination Mode", wf.coordination_mode);
      pushFeature(amenities, <FaStar />, "Pre-event Briefing", wf.pre_event_briefing);

      pushFeature(amenities, <FaStar />, "Entertainment Tags", formatList(ptag.entertainment_tags, 5));
      pushFeature(amenities, <FaStar />, "Performer Tags", formatList(ptag.performer_tags, 5));
      pushFeature(amenities, <FaStar />, "Event Fit Tags", formatList(ptag.event_fit_tags, 5));
    }

    // --- PRE-WEDDING LOCATION MASTER ATTRIBUTES ---
    if (preWeddingLocationMaster && Object.keys(preWeddingLocationMaster).length > 0) {
      const id = preWeddingLocationMaster.identity || {};
      const srv = preWeddingLocationMaster.services || {};
      const core = preWeddingLocationMaster.core_intelligence || {};
      const tech = preWeddingLocationMaster.technical || {};
      const prc = preWeddingLocationMaster.pricing || {};
      const scale = preWeddingLocationMaster.scale_capacity || {};
      const wf = preWeddingLocationMaster.workflow || {};
      const ptag = preWeddingLocationMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Location Type", id.location_type);
      pushFeature(amenities, <FaStar />, "Location Name", id.location_name);
      pushFeature(amenities, <FaStar />, "Ownership Type", id.ownership_type);
      pushFeature(amenities, <FaMapMarkerAlt />, "City", id.city);
      pushFeature(amenities, <FaStar />, "Accessibility", id.accessibility_type);
      pushFeature(amenities, <FaStar />, "Years of Operation", id.years_of_operation);

      pushFeature(amenities, <FaCalendarAlt />, "Booking Type", formatList(srv.booking_type, 4));
      pushFeature(amenities, <FaStar />, "Photography Allowed", srv.photography_allowed);
      pushFeature(amenities, <FaStar />, "Videography Allowed", srv.videography_allowed);
      pushFeature(amenities, <FaStar />, "Drone Usage Allowed", srv.drone_usage_allowed);
      pushFeature(amenities, <FaStar />, "Permission Handling", srv.permission_handling);
      pushFeature(amenities, <FaStar />, "Changing Rooms Available", srv.changing_rooms_available);
      pushFeature(amenities, <FaStar />, "Makeup Room Available", srv.makeup_room_available);
      pushFeature(amenities, <FaStar />, "Props Available", formatList(srv.props_available, 5));
      pushFeature(amenities, <FaStar />, "Power Supply Available", srv.power_supply_available);

      pushFeature(amenities, <FaStar />, "Location Themes", formatList(core.location_themes, 5));
      pushFeature(amenities, <FaCalendarAlt />, "Best Shoot Time", formatList(core.best_shoot_time, 4));
      pushFeature(amenities, <FaStar />, "Lighting Conditions", core.lighting_conditions);
      pushFeature(amenities, <FaStar />, "Weather Suitability", formatList(core.weather_suitability, 4));
      pushFeature(amenities, <FaStar />, "Privacy Level", core.privacy_level);
      pushFeature(amenities, <FaStar />, "Noise Level", core.noise_level);

      pushFeature(amenities, <FaStar />, "Area Size", tech.area_size);
      pushFeature(amenities, <FaStar />, "Shooting Spots", tech.shooting_spots);
      pushFeature(amenities, <FaStar />, "Indoor Availability", tech.indoor_availability);
      pushFeature(amenities, <FaStar />, "Outdoor Availability", tech.outdoor_availability);
      pushFeature(amenities, <FaStar />, "Terrain Type", formatList(tech.terrain_type, 5));
      pushFeature(amenities, <FaStar />, "Electric Backup", tech.electric_backup);

      pushFeature(amenities, <FaStar />, "Price Range", prc.price_range);
      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Outfits on Rent", prc.outfits_on_rent);
      pushFeature(amenities, <FaStar />, "Security Deposit Required", prc.security_deposit_required);
      pushFeature(amenities, <FaStar />, "Permit Charges", prc.permit_charges);
      pushFeature(amenities, <FaStar />, "Cancellation Policy", prc.cancellation_policy);

      pushFeature(amenities, <FaUsers />, "Max Crew Size", scale.max_crew_size);
      pushFeature(amenities, <FaUsers />, "Simultaneous Shoots", scale.simultaneous_shoots);
      pushFeature(amenities, <FaParking />, "Parking Capacity", scale.parking_capacity);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", wf.advance_booking_required);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Window", wf.booking_window);
      pushFeature(amenities, <FaStar />, "Time Slot Allocation", wf.time_slot_allocation);
      pushFeature(amenities, <FaStar />, "Onsite Coordinator", wf.onsite_coordinator_available);
      pushFeature(amenities, <FaStar />, "Payment Modes", formatList(wf.payment_modes, 4));
      pushFeature(amenities, <FaStar />, "Advance Payment", wf.advance_payment_percentage);

      pushFeature(amenities, <FaStar />, "Visual Style Tags", formatList(ptag.visual_style_tags, 5));
      pushFeature(amenities, <FaStar />, "Audience Tags", formatList(ptag.audience_tags, 4));
      pushFeature(amenities, <FaStar />, "Usage Tags", formatList(ptag.usage_tags, 4));
      pushFeature(amenities, <FaStar />, "Price Segment", ptag.price_segment_tags);
    }

    // --- PRE-WEDDING PHOTOGRAPHER MASTER ATTRIBUTES ---
    if (preWeddingPhotographerMaster && Object.keys(preWeddingPhotographerMaster).length > 0) {
      const id = preWeddingPhotographerMaster.identity || {};
      const srv = preWeddingPhotographerMaster.services || {};
      const core = preWeddingPhotographerMaster.core_intelligence || {};
      const tech = preWeddingPhotographerMaster.technical || {};
      const prc = preWeddingPhotographerMaster.pricing || {};
      const scale = preWeddingPhotographerMaster.scale_capacity || {};
      const wf = preWeddingPhotographerMaster.workflow || {};
      const ptag = preWeddingPhotographerMaster.portfolio_tagging || {};

      pushFeature(amenities, <FaStar />, "Vendor Type", id.vendor_type);
      pushFeature(amenities, <FaStar />, "Brand Name", id.brand_name);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Presence", formatList(id.service_presence, 4));
      pushFeature(amenities, <FaMapMarkerAlt />, "City", id.city);
      pushFeature(amenities, <FaStar />, "Years of Experience", id.years_of_experience);
      pushFeature(amenities, <FaUsers />, "Team Size", id.team_size);

      pushFeature(amenities, <FaStar />, "Shoot Types", formatList(srv.shoot_types, 4));
      pushFeature(amenities, <FaStar />, "Photography Coverage", formatList(srv.photography_coverage, 4));
      pushFeature(amenities, <FaStar />, "Drone Shooting", srv.drone_shooting);
      pushFeature(amenities, <FaStar />, "Cinematic Videography", srv.cinematic_videography);
      pushFeature(amenities, <FaStar />, "Concept Planning Support", srv.concept_planning_support);
      pushFeature(amenities, <FaStar />, "Location Assistance", srv.location_assistance);
      pushFeature(amenities, <FaStar />, "Styling Assistance", srv.styling_assistance);
      pushFeature(amenities, <FaStar />, "Outfit Coordination Support", srv.outfit_coordination_support);
      pushFeature(amenities, <FaStar />, "Travel Included", srv.travel_included);

      pushFeature(amenities, <FaStar />, "Photography Style", formatList(core.photography_style, 4));
      pushFeature(amenities, <FaStar />, "Shoot Style Themes", formatList(core.shoot_style_themes, 4));
      pushFeature(amenities, <FaStar />, "Lighting Style", formatList(core.lighting_style, 4));
      pushFeature(amenities, <FaStar />, "Editing Style", formatList(core.editing_style, 4));
      pushFeature(amenities, <FaStar />, "Reel Style Capability", formatList(core.reel_style_capability, 4));
      pushFeature(amenities, <FaCalendarAlt />, "Best Time Preference", formatList(core.best_time_preference, 4));

      pushFeature(amenities, <FaStar />, "Camera Type", formatList(tech.camera_type, 4));
      pushFeature(amenities, <FaStar />, "Drone Equipment Level", tech.drone_equipment_level);
      pushFeature(amenities, <FaStar />, "Video Resolution", tech.video_resolution);
      pushFeature(amenities, <FaStar />, "Stabilization Equipment", formatList(tech.stabilization_equipment, 4));
      pushFeature(amenities, <FaStar />, "Audio Capture", tech.audio_capture);
      pushFeature(amenities, <FaStar />, "Backup Equipment Available", tech.backup_equipment_available);

      pushFeature(amenities, <FaStar />, "Price Range", prc.price_range);
      pushFeature(amenities, <FaStar />, "Pricing Model", prc.pricing_model);
      pushFeature(amenities, <FaStar />, "Travel Charges", prc.travel_charges);
      pushFeature(amenities, <FaStar />, "Stay Charges", prc.stay_charges);
      pushFeature(amenities, <FaStar />, "Drone Charges", prc.drone_charges);
      pushFeature(amenities, <FaStar />, "Editing Charges", prc.editing_charges);
      pushFeature(amenities, <FaStar />, "Advance Payment", prc.advance_payment_percentage);

      pushFeature(amenities, <FaCalendarAlt />, "Shoots Per Month", scale.shoots_per_month);
      pushFeature(amenities, <FaUsers />, "Simultaneous Projects", scale.simultaneous_projects);
      pushFeature(amenities, <FaUsers />, "Team Scalability", scale.team_scalability);

      pushFeature(amenities, <FaCalendarAlt />, "Booking Window", wf.booking_window);
      pushFeature(amenities, <FaCalendarAlt />, "Concept Finalization", wf.concept_finalization_timeline);
      pushFeature(amenities, <FaCalendarAlt />, "Shoot Duration Options", formatList(wf.shoot_duration_options, 4));
      pushFeature(amenities, <FaStar />, "Raw Data Delivery", wf.raw_data_delivery);
      pushFeature(amenities, <FaCalendarAlt />, "Edited Photos Delivery", wf.edited_photos_delivery_timeline);
      pushFeature(amenities, <FaCalendarAlt />, "Video Delivery Timeline", wf.video_delivery_timeline);
      pushFeature(amenities, <FaStar />, "Payment Modes", formatList(wf.payment_modes, 4));

      pushFeature(amenities, <FaStar />, "Visual Style Tags", formatList(ptag.visual_style_tags, 5));
      pushFeature(amenities, <FaStar />, "Audience Tags", formatList(ptag.audience_tags, 4));
      pushFeature(amenities, <FaStar />, "Usage Tags", formatList(ptag.usage_tags, 4));
      pushFeature(amenities, <FaStar />, "Price Segment", ptag.price_segment_tags);
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

    console.log("FINAL AMENITIES:", amenities);
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
      if (!venueData) return;

      const dynamicVendorId = venueData.vendor?.id;
      const dynamicVendorTypeId = venueData.vendor?.vendorType?.id;

      // Subcategory keyword detection for Shiphan's categories (Music, Entertainment, Pre-Wedding etc.)
      const subcategoryName = venueData.vendor?.vendorSubcategory?.name || venueData.attributes?.vendor_subcategory || venueData?.subcategory?.name || "";
      const normalizedSub = String(subcategoryName).toLowerCase();
      const isLocMaster = venueData.attributes?.pre_wedding_location_master && Object.keys(venueData.attributes.pre_wedding_location_master).length > 0;
      const isPhotoMaster = venueData.attributes?.pre_wedding_photographer_master && Object.keys(venueData.attributes.pre_wedding_photographer_master).length > 0;
      const isDjMaster = venueData.attributes?.dj_master && Object.keys(venueData.attributes.dj_master).length > 0;
      const isChoreoMaster = venueData.attributes?.sangeet_choreographer_master && Object.keys(venueData.attributes.sangeet_choreographer_master).length > 0;
      const isEntMaster = venueData.attributes?.wedding_entertainer_master && Object.keys(venueData.attributes.wedding_entertainer_master).length > 0;

      let answers = [];
      if (dynamicVendorId) {
        try {
          const response = await axios.get(
            `https://happywedz.com/api/faq-answers/${dynamicVendorId}`,
          );
          answers = response.data || [];
        } catch (error) {
          console.error("Error fetching FAQ answers:", error);
        }
      }

      const answerMap = new Map(
        answers.map((a) => [a.faq_question_id, a.answer]),
      );

      const vendorTypeKey = dynamicVendorTypeId
        ? Object.keys(FaqQuestions).find((key) => {
          const entry = FaqQuestions[key];
          if (entry.vendor_type_id !== dynamicVendorTypeId) return false;
          if (entry.subcategory_keyword === "location") {
            return normalizedSub.includes("location") || isLocMaster;
          }
          if (entry.subcategory_keyword === "photographer") {
            return normalizedSub.includes("photographer") || isPhotoMaster;
          }
          if (entry.subcategory_keyword === "dj") {
            return normalizedSub.includes("dj") || isDjMaster;
          }
          if (entry.subcategory_keyword === "choreographer") {
            return normalizedSub.includes("choreographer") || isChoreoMaster;
          }
          if (entry.subcategory_keyword === "entertainer") {
            return normalizedSub.includes("entertainment") || normalizedSub.includes("entertainer") || isEntMaster;
          }
          return true;
        })
        : null;

      let mergedFaqs = [];
      if (vendorTypeKey) {
        const allQuestions = FaqQuestions[vendorTypeKey].questions || [];
        const normSubcat = (venueData?.subcategory?.name || subcategoryName || "").trim().toLowerCase();
        let filteredQuestions = allQuestions;

        // 1. Groomwear (vendor_type_id: 11)
        if (dynamicVendorTypeId === 11) {
          const isSherwani = normSubcat.includes("sherwani");
          const isWeddingSuit = normSubcat.includes("suit") || normSubcat.includes("wedding suite");
          filteredQuestions = allQuestions.filter(q => {
            const qid = q.id;
            if (qid >= 401 && qid <= 410) return true;
            if (qid >= 411 && qid <= 425) return isSherwani;
            if (qid >= 426 && qid <= 435) return isWeddingSuit;
            return true;
          });
        }
        // 2. Decorators / Planning (vendor_type_id: 4)
        else if (dynamicVendorTypeId === 4) {
          const isDecorator = normSubcat.includes("decorator") || normSubcat.includes("decor") || normSubcat.includes("event styling");
          filteredQuestions = allQuestions.filter(q => {
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
          filteredQuestions = allQuestions.filter(q => {
            const qid = q.id;
            if (qid >= 1501 && qid <= 1515) return true;
            if (qid >= 2116 && qid <= 2129) return isTrousseauPacker;
            if (qid >= 2130 && qid <= 2144) return isGift;
            if (qid >= 2145 && qid <= 2159) return isFavor;
            if (qid >= 2160 && qid <= 2172) return isInvitation;
            return true;
          });
        }

        mergedFaqs = filteredQuestions.map((q) => ({
          ...q,
          ans: answerMap.get(q.id) || "",
        }));
      }

      _setFaqList(mergedFaqs);
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
            {vendorFeatures.length > 0 && (
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
            )}

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
