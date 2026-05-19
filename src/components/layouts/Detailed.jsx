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
    const jewelleryMaster = attributes.jewellery_master || {};
    const jewelleryRentalMaster = attributes.jewellery_rental_master || {};
    const accessoriesMaster = attributes.accessories_master || {};
    const flowerJewelleryMaster = attributes.flower_jewellery_master || {};
    const cocktailGownMaster = attributes.cocktail_gown_master || {};
    const bridalOutfitMaster = attributes.bridal_outfit_master || {};
    const rentalOutfitMaster = attributes.rental_outfit_master || {};

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

    // --- JEWELLERY & ACCESSORIES RENTAL MASTER ---
    if (jewelleryMaster && Object.keys(jewelleryMaster).length > 0) {
      const ji = jewelleryMaster.identity || {};
      const jpc = jewelleryMaster.product_categories || {};
      const jsd = jewelleryMaster.style_design_intelligence || {};
      const jmq = jewelleryMaster.material_quality || {};
      const jrl = jewelleryMaster.rental_logic || {};
      const jai = jewelleryMaster.availability_inventory || {};
      const jdl = jewelleryMaster.delivery_logistics || {};
      const jhq = jewelleryMaster.hygiene_quality || {};
      const jes = jewelleryMaster.event_suitability || {};
      const jwb = jewelleryMaster.workflow_booking || {};

      pushFeature(
        amenities,
        <FaStar />,
        "Experience",
        ji.years_of_experience ? `${ji.years_of_experience} years` : "",
      );
      pushFeature(amenities, <FaMapMarkerAlt />, "Cities", formatList(ji.cities, 4));
      pushFeature(amenities, <FaStar />, "Service Mode", ji.service_mode);
      pushFeature(amenities, <FaStar />, "Delivery Coverage", ji.delivery_coverage);
      pushFeature(
        amenities,
        <FaStar />,
        "Jewellery Types",
        formatList(jpc.jewellery_types_offered, 50),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Bridal Package",
        jpc.bridal_package_available,
      );
      pushFeature(amenities, <FaStar />, "Complete Set Includes", formatList(jpc.complete_set_includes, 50));
      pushFeature(
        amenities,
        <FaStar />,
        "Jewellery Style",
        formatList(jsd.jewellery_style, 50),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Best Known For",
        formatList(jsd.best_known_for, 50),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Suitable For",
        formatList(jsd.suitable_for, 50),
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Outfit Matching",
        jsd.outfit_matching_support,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Styling Consultation",
        jsd.styling_consultation,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Base Material",
        formatList(jmq.base_material, 50),
      );
      pushFeature(amenities, <FaStar />, "Finish Quality", jmq.finish_quality);
      pushFeature(amenities, <FaStar />, "Material Type", jmq.real_vs_imitation);
      pushFeature(amenities, <FaStar />, "Rental Duration", jrl.rental_duration);
      pushFeature(amenities, <FaStar />, "Rental Price Range", jrl.rental_price_range);
      pushFeature(amenities, <FaStar />, "Security Deposit", jrl.security_deposit);
      pushFeature(
        amenities,
        <FaStar />,
        "Deposit Range",
        jrl.deposit_amount_range,
      );
      pushFeature(amenities, <FaStar />, "Late Return Charges", jrl.late_return_charges);
      pushFeature(
        amenities,
        <FaStar />,
        "Advance Booking",
        jai.advance_booking_required,
      );
      pushFeature(amenities, <FaStar />, "Inventory Size", jai.inventory_size);
      pushFeature(amenities, <FaStar />, "Multiple Pieces Available", jai.multiple_pieces_available);
      pushFeature(amenities, <FaStar />, "Availability Tracking", jai.realtime_availability_tracking);
      pushFeature(
        amenities,
        <FaStar />,
        "Home Delivery",
        jdl.home_delivery_available,
      );
      pushFeature(amenities, <FaStar />, "Pickup Required", jdl.pickup_required);
      pushFeature(amenities, <FaStar />, "Try at Home", jdl.try_at_home_service);
      pushFeature(amenities, <FaStar />, "Shipping", jdl.shipping_charges);
      pushFeature(amenities, <FaStar />, "Sanitization", jhq.sanitization_process);
      pushFeature(amenities, <FaStar />, "Damage Policy", jhq.damage_policy);
      pushFeature(
        amenities,
        <FaStar />,
        "Replacement",
        jhq.replacement_available,
      );
      pushFeature(
        amenities,
        <FaStar />,
        "Functions",
        formatList(jes.functions_suitable_for, 50),
      );
      pushFeature(amenities, <FaStar />, "Best For", formatList(jes.best_for, 50));
      pushFeature(amenities, <FaCalendarAlt />, "Advance Required", jwb.advance_required);
      pushFeature(amenities, <FaCalendarAlt />, "Advance Percentage", jwb.advance_percentage);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation", jwb.cancellation_policy);
      pushFeature(amenities, <FaCalendarAlt />, "Refund Timeline", jwb.refund_timeline);
    }

    // --- JEWELLERY RENTAL MASTER ATTRIBUTES ---
    if (jewelleryRentalMaster && Object.keys(jewelleryRentalMaster).length > 0) {
      const ji = jewelleryRentalMaster.identity || {};
      const jpc = jewelleryRentalMaster.product_categories || {};
      const jsd = jewelleryRentalMaster.style_design || {};
      const jmq = jewelleryRentalMaster.material_quality || {};
      const jrl = jewelleryRentalMaster.rental_logic || {};
      const jai = jewelleryRentalMaster.availability || {};
      const jdl = jewelleryRentalMaster.delivery_logistics || {};
      const jhq = jewelleryRentalMaster.hygiene_quality || {};
      const jes = jewelleryRentalMaster.event_suitability || {};
      const jwb = jewelleryRentalMaster.workflow_booking || {};

      pushFeature(amenities, <FaStar />, "Experience", ji.years_of_experience ? `${ji.years_of_experience} years` : "");
      pushFeature(amenities, <FaMapMarkerAlt />, "City", ji.city);
      pushFeature(amenities, <FaStar />, "Service Mode", ji.service_mode);
      pushFeature(amenities, <FaStar />, "Delivery Coverage", ji.delivery_coverage);

      pushFeature(amenities, <FaStar />, "Jewellery Types", formatList(jpc.jewellery_types, 50));
      pushFeature(amenities, <FaStar />, "Bridal Package", jpc.bridal_package);
      pushFeature(amenities, <FaStar />, "Complete Set Includes", formatList(jpc.set_includes, 50));

      pushFeature(amenities, <FaStar />, "Jewellery Style", formatList(jsd.jewellery_style, 50));
      pushFeature(amenities, <FaStar />, "Best Known For", formatList(jsd.best_known_for, 50));
      pushFeature(amenities, <FaStar />, "Suitable For", formatList(jsd.suitable_for, 50));
      pushFeature(amenities, <FaStar />, "Outfit Matching", jsd.outfit_matching_support);
      pushFeature(amenities, <FaStar />, "Styling Consultation", jsd.styling_consultation);

      pushFeature(amenities, <FaStar />, "Base Material", formatList(jmq.base_material, 50));
      pushFeature(amenities, <FaStar />, "Finish Quality", jmq.finish_quality);
      pushFeature(amenities, <FaStar />, "Material Type", jmq.real_vs_imitation);

      pushFeature(amenities, <FaStar />, "Rental Duration", jrl.rental_duration);
      pushFeature(amenities, <FaStar />, "Rental Price Range", jrl.rental_price_range);
      pushFeature(amenities, <FaStar />, "Security Deposit", jrl.security_deposit);
      pushFeature(amenities, <FaStar />, "Deposit Amount Range", jrl.deposit_amount_range);
      pushFeature(amenities, <FaStar />, "Late Return Charges", jrl.late_return_charges);

      pushFeature(amenities, <FaStar />, "Advance Booking", jai.advance_booking_required);
      pushFeature(amenities, <FaStar />, "Inventory Size", jai.inventory_size);
      pushFeature(amenities, <FaStar />, "Multiple Pieces Available", jai.multiple_pieces_available);
      pushFeature(amenities, <FaStar />, "Availability Tracking", jai.availability_tracking);

      pushFeature(amenities, <FaStar />, "Home Delivery", jdl.home_delivery);
      pushFeature(amenities, <FaStar />, "Pickup Required", jdl.pickup_required);
      pushFeature(amenities, <FaStar />, "Shipping Charges", jdl.shipping_charges);
      pushFeature(amenities, <FaStar />, "Try at Home", jdl.try_at_home);

      pushFeature(amenities, <FaStar />, "Sanitization Process", jhq.sanitization_process);
      pushFeature(amenities, <FaStar />, "Damage Policy", jhq.damage_policy);
      pushFeature(amenities, <FaStar />, "Replacement Available", jhq.replacement_available);

      pushFeature(amenities, <FaStar />, "Functions Suitable", formatList(jes.functions_suitable_for, 50));
      pushFeature(amenities, <FaStar />, "Best For", formatList(jes.best_for, 50));

      pushFeature(amenities, <FaCalendarAlt />, "Advance Required", jwb.advance_required);
      pushFeature(amenities, <FaCalendarAlt />, "Advance Percentage", jwb.advance_percentage);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation Policy", jwb.cancellation_policy);
      pushFeature(amenities, <FaCalendarAlt />, "Refund Timeline", jwb.refund_timeline);
    }


    // --- ACCESSORIES MASTER ATTRIBUTES ---
    if (accessoriesMaster && Object.keys(accessoriesMaster).length > 0) {
      const ai = accessoriesMaster.identity || {};
      const apc = accessoriesMaster.product_categories || {};
      const asd = accessoriesMaster.style_intelligence || {};
      const amq = accessoriesMaster.material_quality || {};
      const arl = accessoriesMaster.sales_rental_logic || {};
      const aiv = accessoriesMaster.inventory || {};
      const al = accessoriesMaster.logistics || {};
      const aes = accessoriesMaster.event_suitability || {};
      const awb = accessoriesMaster.workflow || {};

      pushFeature(amenities, <FaStar />, "Experience", ai.years_of_experience ? `${ai.years_of_experience} years` : "");
      pushFeature(amenities, <FaMapMarkerAlt />, "City", ai.city);
      pushFeature(amenities, <FaStar />, "Service Mode", ai.service_mode);
      pushFeature(amenities, <FaStar />, "Delivery Coverage", ai.delivery_coverage);
      
      pushFeature(amenities, <FaStar />, "Accessories Types", formatList(apc.accessories_types, 6));
      pushFeature(amenities, <FaStar />, "Gender Focus", apc.gender_focus);
      pushFeature(amenities, <FaStar />, "Bridal Accessories", apc.bridal_accessories);
      pushFeature(amenities, <FaStar />, "Groom Accessories", apc.groom_accessories);

      pushFeature(amenities, <FaStar />, "Style Categories", formatList(asd.style_categories, 5));
      pushFeature(amenities, <FaStar />, "Best Known For", formatList(asd.best_known_for, 4));
      pushFeature(amenities, <FaStar />, "Suitable For", formatList(asd.suitable_for, 5));
      pushFeature(amenities, <FaStar />, "Outfit Matching", asd.outfit_matching);
      pushFeature(amenities, <FaStar />, "Styling Consultation", asd.styling_consultation);

      pushFeature(amenities, <FaStar />, "Materials Used", formatList(amq.materials_used, 4));
      pushFeature(amenities, <FaStar />, "Quality Tier", amq.quality_tier);
      pushFeature(amenities, <FaStar />, "Handmade Products", amq.handmade_products);

      pushFeature(amenities, <FaStar />, "Product Mode", arl.product_mode);
      pushFeature(amenities, <FaStar />, "Rental Duration", arl.rental_duration);
      pushFeature(amenities, <FaStar />, "Price Range", arl.price_range);
      pushFeature(amenities, <FaStar />, "Security Deposit", arl.security_deposit);
      pushFeature(amenities, <FaStar />, "Custom Orders", arl.custom_orders);
      pushFeature(amenities, <FaStar />, "Customization Time", arl.customization_time);

      pushFeature(amenities, <FaStar />, "Inventory Size", aiv.inventory_size);
      pushFeature(amenities, <FaStar />, "Multiple Pieces Available", aiv.multiple_pieces);
      pushFeature(amenities, <FaStar />, "Real-Time Tracking", aiv.real_time_tracking);
      
      pushFeature(amenities, <FaStar />, "Home Delivery", al.home_delivery);
      pushFeature(amenities, <FaStar />, "Store Pickup", al.store_pickup);
      pushFeature(amenities, <FaStar />, "Shipping Charges", al.shipping_charges);
      pushFeature(amenities, <FaStar />, "Try at Home", al.try_at_home);

      pushFeature(amenities, <FaStar />, "Functions Suitable For", formatList(aes.functions_suitable_for, 6));
      pushFeature(amenities, <FaStar />, "Best For", formatList(aes.best_for, 4));

      pushFeature(amenities, <FaCalendarAlt />, "Advance Required", awb.advance_required);
      pushFeature(amenities, <FaCalendarAlt />, "Advance Percentage", awb.advance_percentage);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation Policy", awb.cancellation_policy);
      pushFeature(amenities, <FaCalendarAlt />, "Return Policy", awb.return_policy);
    }

    // --- COCKTAIL GOWN MASTER ATTRIBUTES ---
    if (cocktailGownMaster && Object.keys(cocktailGownMaster).length > 0) {
      const ci = cocktailGownMaster.identity || {};
      const pc = cocktailGownMaster.product_catalog || {};
      const core = cocktailGownMaster.core_intelligence || {};
      const fs = cocktailGownMaster.fit_styling || {};
      const ou = cocktailGownMaster.occasion_usage || {};
      const pl = cocktailGownMaster.pricing_logic || {};
      const pd = cocktailGownMaster.production_delivery || {};
      const so = cocktailGownMaster.scale_operations || {};
      const wb = cocktailGownMaster.workflow_booking || {};

      pushFeature(amenities, <FaStar />, "Experience", ci.years_of_experience ? `${ci.years_of_experience} years` : "");
      pushFeature(amenities, <FaMapMarkerAlt />, "Primary City", ci.primary_city);
      pushFeature(amenities, <FaStar />, "Store Presence", ci.store_presence);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Cities", formatList(ci.service_cities, 4));
      pushFeature(amenities, <FaCalendarAlt />, "Appointment", ci.appointment_requirement);

      pushFeature(amenities, <FaStar />, "Gown Types", formatList(pc.gown_types, 5));
      pushFeature(amenities, <FaStar />, "Collection Type", pc.collection_type);
      pushFeature(amenities, <FaStar />, "Design Style", formatList(pc.design_style, 5));
      pushFeature(amenities, <FaStar />, "Color Palette", formatList(pc.color_palette, 5));

      pushFeature(amenities, <FaStar />, "Silhouettes", formatList(core.silhouette_types, 5));
      pushFeature(amenities, <FaStar />, "Necklines", formatList(core.neckline_types, 5));
      pushFeature(amenities, <FaStar />, "Sleeves", core.sleeve_types);
      pushFeature(amenities, <FaStar />, "Fabrics", formatList(core.fabric_options, 5));
      pushFeature(amenities, <FaStar />, "Embellishments", formatList(core.embellishment_types, 5));
      pushFeature(amenities, <FaStar />, "Train Length", core.train_length);
      pushFeature(amenities, <FaStar />, "Weight", core.weight_category);

      pushFeature(amenities, <FaStar />, "Size Range", fs.size_range);
      pushFeature(amenities, <FaStar />, "Body Type Styling", formatList(fs.body_type_styling, 5));
      pushFeature(amenities, <FaStar />, "Fit Type", fs.fit_type);
      pushFeature(amenities, <FaStar />, "Trial Availability", fs.trial_availability);
      pushFeature(amenities, <FaStar />, "Alteration Support", fs.alteration_support);
      pushFeature(amenities, <FaStar />, "Styling Consultation", fs.styling_consultation);
      pushFeature(amenities, <FaStar />, "Accessory Styling", fs.accessory_styling_support);

      pushFeature(amenities, <FaStar />, "Occasion Suitability", formatList(ou.occasion_suitability, 5));
      pushFeature(amenities, <FaStar />, "Reusability", ou.reusability);
      pushFeature(amenities, <FaStar />, "Comfort Level", ou.comfort_level);
      pushFeature(amenities, <FaStar />, "Season Suitability", ou.season_suitability);

      pushFeature(amenities, <FaStar />, "Pricing Model", pl.pricing_model);
      pushFeature(amenities, <FaStar />, "Starting Price", pl.starting_price_range);
      pushFeature(amenities, <FaStar />, "Includes", formatList(pl.includes, 5));
      pushFeature(amenities, <FaStar />, "Add-ons", formatList(pl.add_ons, 5));
      pushFeature(amenities, <FaStar />, "Negotiation", pl.negotiation_flexibility);

      pushFeature(amenities, <FaStar />, "Production Time", pd.production_time);
      pushFeature(amenities, <FaStar />, "Urgent Orders", pd.urgent_orders);
      pushFeature(amenities, <FaStar />, "Delivery Options", formatList(pd.delivery_options, 4));
      pushFeature(amenities, <FaStar />, "Packaging", pd.packaging);

      pushFeature(amenities, <FaStar />, "Orders Per Month", so.orders_per_month);
      pushFeature(amenities, <FaStar />, "Team Size", so.team_size);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", wb.advance_booking_time);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Advance", wb.booking_advance_percent);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation Policy", wb.cancellation_policy);
      pushFeature(amenities, <FaStar />, "Client Coordination", formatList(wb.client_coordination, 4));
    }

    // --- BRIDAL OUTFIT MASTER ATTRIBUTES (Trousseau Saree / Kanjeevaram Silk Saree / Lehenga) ---
    if (bridalOutfitMaster && Object.keys(bridalOutfitMaster).length > 0) {
      const bi = bridalOutfitMaster.identity || {};
      const bpc = bridalOutfitMaster.product_catalog || {};
      const bci = bridalOutfitMaster.core_intelligence || {};
      const bfs = bridalOutfitMaster.fit_styling || {};
      const bou = bridalOutfitMaster.occasion_usage || {};
      const bpl = bridalOutfitMaster.pricing_logic || {};
      const bpd = bridalOutfitMaster.production_delivery || {};
      const bso = bridalOutfitMaster.scale_operations || {};
      const bwb = bridalOutfitMaster.workflow_booking || {};

      pushFeature(amenities, <FaStar />, "Experience", bi.years_of_experience ? `${bi.years_of_experience} years` : "");
      pushFeature(amenities, <FaMapMarkerAlt />, "Primary City", bi.primary_city);
      pushFeature(amenities, <FaStar />, "Store Presence", bi.store_presence);
      pushFeature(amenities, <FaMapMarkerAlt />, "Service Cities", formatList(bi.service_cities, 4));
      pushFeature(amenities, <FaCalendarAlt />, "Appointment", bi.appointment_requirement);

      pushFeature(amenities, <FaStar />, "Outfit Types", formatList(bpc.lehenga_types, 5));
      pushFeature(amenities, <FaStar />, "Collection Type", bpc.collection_type);
      pushFeature(amenities, <FaStar />, "Design Style", formatList(bpc.design_style, 5));
      pushFeature(amenities, <FaStar />, "Color Options", formatList(bpc.color_options, 5));

      pushFeature(amenities, <FaStar />, "Silhouettes", formatList(bci.silhouette_types, 5));
      pushFeature(amenities, <FaStar />, "Fabrics", formatList(bci.fabric_options, 5));
      pushFeature(amenities, <FaStar />, "Work Types", formatList(bci.work_types, 5));
      pushFeature(amenities, <FaStar />, "Weight Category", bci.weight_category);
      pushFeature(amenities, <FaStar />, "Dupatta Options", bci.dupatta_options);
      pushFeature(amenities, <FaStar />, "Customization Depth", bci.customization_depth);

      pushFeature(amenities, <FaStar />, "Size Range", bfs.size_range);
      pushFeature(amenities, <FaStar />, "Body Type Styling", formatList(bfs.body_type_styling, 5));
      pushFeature(amenities, <FaStar />, "Trial Availability", bfs.trial_availability);
      pushFeature(amenities, <FaStar />, "Alteration Support", bfs.alteration_support);
      pushFeature(amenities, <FaStar />, "Styling Consultation", bfs.styling_consultation);
      pushFeature(amenities, <FaStar />, "Blouse Customization", bfs.blouse_customization);

      pushFeature(amenities, <FaStar />, "Occasion Suitability", formatList(bou.occasion_suitability, 5));
      pushFeature(amenities, <FaStar />, "Reusability", bou.reusability);
      pushFeature(amenities, <FaStar />, "Comfort Level", bou.comfort_level);
      pushFeature(amenities, <FaStar />, "Season Suitability", bou.season_suitability);

      pushFeature(amenities, <FaStar />, "Pricing Model", bpl.pricing_model);
      pushFeature(amenities, <FaStar />, "Starting Price", bpl.starting_price_range);
      pushFeature(amenities, <FaStar />, "Includes", formatList(bpl.includes, 5));
      pushFeature(amenities, <FaStar />, "Add-ons", formatList(bpl.add_ons, 5));
      pushFeature(amenities, <FaStar />, "Negotiation", bpl.negotiation_flexibility);

      pushFeature(amenities, <FaStar />, "Production Time", bpd.production_time);
      pushFeature(amenities, <FaStar />, "Urgent Orders", bpd.urgent_orders);
      pushFeature(amenities, <FaStar />, "Delivery Options", formatList(bpd.delivery_options, 4));
      pushFeature(amenities, <FaStar />, "Packaging", bpd.packaging);

      pushFeature(amenities, <FaStar />, "Orders Per Month", bso.orders_per_month);
      pushFeature(amenities, <FaStar />, "Team Size", bso.team_size);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", bwb.advance_booking_time);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Advance %", bwb.booking_advance_percent);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation Policy", bwb.cancellation_policy);
      pushFeature(amenities, <FaStar />, "Client Coordination", formatList(bwb.client_coordination, 4));
    }

    // --- RENTAL OUTFIT MASTER ATTRIBUTES (Bridal Lehenga on Rent) ---
    if (rentalOutfitMaster && Object.keys(rentalOutfitMaster).length > 0) {
      const ri = rentalOutfitMaster.identity || {};
      const rs = rentalOutfitMaster.services || {};
      const rci = rentalOutfitMaster.core_intelligence || {};
      const rt = rentalOutfitMaster.technical || {};
      const rp = rentalOutfitMaster.pricing || {};
      const rsc = rentalOutfitMaster.scale || {};
      const rw = rentalOutfitMaster.workflow || {};
      const rpo = rentalOutfitMaster.portfolio || {};

      pushFeature(amenities, <FaStar />, "Store Presence", formatList(ri.store_presence, 3));
      pushFeature(amenities, <FaMapMarkerAlt />, "City", ri.city);
      pushFeature(amenities, <FaStar />, "Store Access", ri.store_access_type);
      pushFeature(amenities, <FaStar />, "Experience", ri.years_of_experience);
      pushFeature(amenities, <FaStar />, "Specialization", formatList(ri.inventory_specialization, 4));

      pushFeature(amenities, <FaStar />, "Rental Types", formatList(rs.rental_types, 3));
      pushFeature(amenities, <FaStar />, "Trial Availability", rs.trial_availability);
      pushFeature(amenities, <FaStar />, "Customization", rs.customization_alteration);
      pushFeature(amenities, <FaStar />, "Styling Assistance", rs.styling_assistance);
      pushFeature(amenities, <FaStar />, "Accessories Available", formatList(rs.accessory_rental, 5));
      pushFeature(amenities, <FaStar />, "Dry Cleaning", rs.dry_cleaning_included);
      pushFeature(amenities, <FaStar />, "Pickup & Delivery", rs.pickup_delivery_service);
      pushFeature(amenities, <FaStar />, "Urgent Rental", rs.urgent_rental_availability);

      pushFeature(amenities, <FaStar />, "Lehenga Styles", formatList(rci.lehenga_styles, 5));
      pushFeature(amenities, <FaStar />, "Occasions", formatList(rci.occasion_suitability, 5));
      pushFeature(amenities, <FaStar />, "Work Types", formatList(rci.work_type, 5));
      pushFeature(amenities, <FaStar />, "Fabrics", formatList(rci.fabric_options, 5));
      pushFeature(amenities, <FaStar />, "Colors", formatList(rci.color_palette, 5));
      pushFeature(amenities, <FaStar />, "Designer Options", formatList(rci.designer_availability, 3));
      pushFeature(amenities, <FaStar />, "Dupatta Styles", formatList(rci.dupatta_styles, 3));

      pushFeature(amenities, <FaStar />, "Size Range", formatList(rt.size_range, 4));
      pushFeature(amenities, <FaStar />, "Adjustability", rt.adjustability_range);
      pushFeature(amenities, <FaStar />, "Weight Category", rt.lehenga_weight);
      pushFeature(amenities, <FaStar />, "Blouse Types", formatList(rt.blouse_type, 3));
      pushFeature(amenities, <FaStar />, "Can-Can Included", rt.can_can_included);
      pushFeature(amenities, <FaStar />, "Dupatta Length", rt.dupatta_length);
      pushFeature(amenities, <FaStar />, "Condition", rt.condition_quality);

      pushFeature(amenities, <FaStar />, "Rental Price Range", rp.rental_price_range);
      pushFeature(amenities, <FaStar />, "Security Deposit", rp.security_deposit_required);
      pushFeature(amenities, <FaStar />, "Deposit Amount", rp.deposit_amount_range);
      pushFeature(amenities, <FaStar />, "Late Charges", rp.late_return_charges);
      pushFeature(amenities, <FaStar />, "Damage Policy", rp.damage_policy);
      pushFeature(amenities, <FaStar />, "Cleaning Charges", rp.cleaning_charges);
      pushFeature(amenities, <FaStar />, "Trial Charges", rp.trial_charges);

      pushFeature(amenities, <FaStar />, "Inventory Size", rsc.inventory_size);
      pushFeature(amenities, <FaStar />, "Daily Trial Capacity", rsc.daily_trial_capacity);
      pushFeature(amenities, <FaStar />, "Rental Capacity", rsc.simultaneous_rentals);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Booking", rw.advance_booking_required);
      pushFeature(amenities, <FaCalendarAlt />, "Booking Window", rw.booking_window);
      pushFeature(amenities, <FaCalendarAlt />, "Trial Appointment", rw.trial_appointment_required);
      pushFeature(amenities, <FaCalendarAlt />, "Fitting Timeline", rw.fitting_timeline);
      pushFeature(amenities, <FaCalendarAlt />, "Pickup Timing", rw.pickup_timing);
      pushFeature(amenities, <FaCalendarAlt />, "Return Timeline", rw.return_timeline);
      pushFeature(amenities, <FaStar />, "Payment Modes", formatList(rw.payment_modes, 4));
      pushFeature(amenities, <FaStar />, "Advance Payment", rw.advance_payment_percentage);

      pushFeature(amenities, <FaStar />, "Style Tags", formatList(rpo.style_tags, 4));
      pushFeature(amenities, <FaStar />, "Audience", formatList(rpo.audience_tags, 3));
      pushFeature(amenities, <FaStar />, "Usage", formatList(rpo.usage_tags, 4));
      pushFeature(amenities, <FaStar />, "Price Segment", formatList(rpo.price_segment_tags, 2));
    }

    // --- FLOWER JEWELLERY MASTER ATTRIBUTES ---
    if (flowerJewelleryMaster && Object.keys(flowerJewelleryMaster).length > 0) {
      const fi = flowerJewelleryMaster.identity || {};
      const fpc = flowerJewelleryMaster.product_categories || {};
      const fmt = flowerJewelleryMaster.material_type || {};
      const fsd = flowerJewelleryMaster.style_design || {};
      const ffs = flowerJewelleryMaster.function_specific || {};
      const ff = flowerJewelleryMaster.facilities || {};
      const fpl = flowerJewelleryMaster.pricing_logic || {};
      const fdt = flowerJewelleryMaster.delivery_timing || {};
      const fsh = flowerJewelleryMaster.storage_handling || {};
      const fia = flowerJewelleryMaster.inventory_availability || {};
      const fwb = flowerJewelleryMaster.workflow_booking || {};

      pushFeature(amenities, <FaStar />, "Experience", fi.years_of_experience ? `${fi.years_of_experience} years` : "");
      pushFeature(amenities, <FaMapMarkerAlt />, "City", fi.city);
      pushFeature(amenities, <FaStar />, "Service Coverage", fi.service_coverage);
      pushFeature(amenities, <FaStar />, "Delivery Mode", fi.delivery_mode);

      pushFeature(amenities, <FaStar />, "Jewellery Items", formatList(fpc.jewellery_items, 6));
      pushFeature(amenities, <FaStar />, "Bridal Set Available", fpc.bridal_set_available);
      pushFeature(amenities, <FaStar />, "Set Includes", formatList(fpc.set_includes, 5));

      pushFeature(amenities, <FaStar />, "Flower Type", fmt.flower_type);
      pushFeature(amenities, <FaStar />, "Fresh Flowers", formatList(fmt.fresh_flower_types, 5));
      pushFeature(amenities, <FaStar />, "Artificial Material", formatList(fmt.artificial_material, 3));
      pushFeature(amenities, <FaStar />, "Durability", fmt.durability);

      pushFeature(amenities, <FaStar />, "Style Categories", formatList(fsd.style_categories, 5));
      pushFeature(amenities, <FaStar />, "Best Known For", formatList(fsd.best_known_for, 4));
      pushFeature(amenities, <FaStar />, "Suitable For", formatList(fsd.suitable_for, 4));
      pushFeature(amenities, <FaStar />, "Outfit Matching", fsd.outfit_matching_support);
      pushFeature(amenities, <FaStar />, "Customization", fsd.customization_available);
      pushFeature(amenities, <FaStar />, "Design Inputs", formatList(fsd.custom_design_inputs, 4));

      pushFeature(amenities, <FaStar />, "Functions", formatList(ffs.functions_suitable_for, 5));
      pushFeature(amenities, <FaStar />, "Best Function", ffs.best_function);

      pushFeature(amenities, <FaStar />, "Storage Facilities", ff.storage_facilities);
      pushFeature(amenities, <FaStar />, "Customization Capabilities", formatList(ff.customization_capabilities, 4));
      pushFeature(amenities, <FaStar />, "Delivery Features", formatList(ff.delivery_features, 4));
      
      pushFeature(amenities, <FaStar />, "Starting Price", fpl.starting_price);
      pushFeature(amenities, <FaStar />, "Pricing Type", fpl.pricing_type);
      pushFeature(amenities, <FaStar />, "Bridal Set Price Range", fpl.bridal_set_price_range);
      pushFeature(amenities, <FaStar />, "Bulk Orders Supported", fpl.bulk_orders_supported);
      pushFeature(amenities, <FaStar />, "Bulk Pricing", fpl.bulk_pricing);

      pushFeature(amenities, <FaStar />, "Order Prep Time", fdt.order_prep_time);
      pushFeature(amenities, <FaStar />, "Delivery Timing", fdt.delivery_timing);
      pushFeature(amenities, <FaStar />, "Time Slot Delivery", fdt.time_slot_delivery);
      pushFeature(amenities, <FaStar />, "Early Morning Delivery", fdt.early_morning_delivery);
      
      pushFeature(amenities, <FaStar />, "Storage Instructions", fsh.storage_instructions);
      pushFeature(amenities, <FaStar />, "Replacement Policy", fsh.replacement_policy);
      pushFeature(amenities, <FaStar />, "Damage Handling", fsh.damage_handling);

      pushFeature(amenities, <FaStar />, "Daily Capacity", fia.daily_order_capacity);
      pushFeature(amenities, <FaStar />, "Advance Booking", fia.advance_booking_required);
      pushFeature(amenities, <FaStar />, "Peak Season", fia.peak_season_availability);

      pushFeature(amenities, <FaCalendarAlt />, "Advance Required", fwb.advance_required);
      pushFeature(amenities, <FaCalendarAlt />, "Advance Percentage", fwb.advance_percentage);
      pushFeature(amenities, <FaCalendarAlt />, "Cancellation Policy", fwb.cancellation_policy);
      pushFeature(amenities, <FaCalendarAlt />, "Refund Timeline", fwb.refund_timeline);
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
      if (!venueData?.vendor?.id) {
        return; // Need vendor ID to fetch saved FAQ answers
      }

      const dynamicVendorId = venueData.vendor.id;
      const dynamicVendorTypeId = venueData.vendor.vendorType?.id ?? null;

      try {
        const response = await axios.get(
          `https://happywedz.com/api/faq-answers/${dynamicVendorId}`,
        );
        const answers = response.data || [];

        const answerMap = new Map(
          answers.map((a) => [a.faq_question_id, a.answer]),
        );

        let vendorTypeKey =
          Object.keys(FaqQuestions).find(
            (key) => FaqQuestions[key].vendor_type_id === dynamicVendorTypeId,
          ) ||
          (venueData.vendor.vendorType.name.toLowerCase().includes("rent") &&
          venueData.vendor.vendorType.name.toLowerCase().includes("jewel")
            ? "jewelleryrental"
            : null);

        // Force jewellery rental FAQ pattern to display the new AI FAQ structure
        // for valid jewellery/rental vendors
        const attrs = venueData.attributes || {};
        if (attrs.jewellery_rental_master?.ai_faq || attrs.jewellery_master?.ai_faq) {
          vendorTypeKey = "jewelleryrental";
        }
        if (attrs.accessories_master?.ai_faq) {
          vendorTypeKey = "accessories";
        }
        if (attrs.cocktail_gown_master?.ai_faq || venueData.vendor?.vendorType?.name === "Cocktails gowns" || venueData.vendor?.vendorType?.name === "Cocktail Gowns" || venueData.vendor?.vendorType?.name === "cocktails-gowns") {
          vendorTypeKey = "cocktailgowns";
        }
        if (attrs.rental_outfit_master && Object.keys(attrs.rental_outfit_master).length > 0) {
          vendorTypeKey = "rentaloutfit";
        }
        if (attrs.flower_jewellery_master && Object.keys(attrs.flower_jewellery_master).length > 0) {
          vendorTypeKey = "flowerjewellery";
        }
        // Bridal Outfit / Kanjeevaram Silk Saree detection
        const vendorTypeName = (venueData.vendor?.vendorType?.name || "").toLowerCase();
        const subcatName = (venueData.attributes?.vendor_subcategory_name || venueData.vendor?.vendorSubcategory?.name || "").toLowerCase();
        const serviceNameLower = (venueData.attributes?.name || venueData.attributes?.businessName || "").toLowerCase();
        const isKanjeevaramVendor =
          vendorTypeName.includes("kanjeevaram") ||
          vendorTypeName.includes("silk saree") ||
          subcatName.includes("kanjeevaram") ||
          subcatName.includes("silk saree") ||
          serviceNameLower.includes("kanjeevaram") ||
          serviceNameLower.includes("silk saree");
        const isBridalOutfitVendor =
          attrs.bridal_outfit_master && Object.keys(attrs.bridal_outfit_master).length > 0 &&
          !attrs.cocktail_gown_master?.ai_faq;
        if (isKanjeevaramVendor || (isBridalOutfitVendor && isKanjeevaramVendor)) {
          vendorTypeKey = "kanjeevaramsilksaree";
        } else if (isBridalOutfitVendor) {
          vendorTypeKey = "bridaloutfit";
        }

        if (vendorTypeKey) {
          const questions = FaqQuestions[vendorTypeKey].questions;

          const getAiFaqFallback = (qId) => {
            if (vendorTypeKey === "jewelleryrental") {
              const ai =
                attrs.jewellery_rental_master?.ai_faq ||
                attrs.jewellery_master?.ai_faq ||
                {};
              switch (qId) {
                case 5001: return ai.bridal_sets || ai.bridal_jewellery_sets;
                case 5002: return ai.rental_duration;
                case 5003: return ai.security_deposit || ai.security_deposit_required;
                case 5004: return ai.deposit_amount;
                case 5005: return ai.home_delivery || ai.home_delivery_available;
                case 5006: return ai.try_at_home || ai.try_at_home_service;
                case 5007: return ai.styling_consultation || ai.styling_consultation_available;
                case 5008: return ai.jewellery_types || ai.jewellery_types_offered;
                case 5009: return ai.occasions || ai.suitable_occasions;
                case 5010: return ai.inventory_size;
                case 5011: return ai.replacement || ai.replacement_available;
                case 5012: return ai.damage_policy;
                case 5013: return ai.advance_required;
                case 5014: return ai.cancellation || ai.cancellation_policy;
                case 5015: return ai.best_known_for;
                default: return "";
              }
            } else if (vendorTypeKey === "accessories") {
              const ai = attrs.accessories_master?.ai_faq || {};
              switch (qId) {
                case 4001: return ai.bridal_accessories || ai.bridal_accessories_available;
                case 4002: return ai.groom_accessories;
                case 4003: return ai.product_mode || ai.sale_or_rental || ai.sale_rental;
                case 4004: return ai.customization_available || ai.custom_orders;
                case 4005: return ai.price_range;
                case 4006: return ai.try_at_home || ai.try_at_home_available;
                case 4007: return ai.styling_consultation || ai.styling_consultation_available;
                case 4008: return ai.outfit_matching_support || ai.outfit_matching;
                case 4009: return ai.delivery_available || ai.home_delivery;
                case 4010: return ai.return_policy;
                case 4011: return ai.rental_duration;
                case 4012: return ai.inventory_size;
                case 4013: return ai.advance_required;
                case 4014: return ai.cancellation_policy;
                case 4015: return ai.best_known_for;
                default: return "";
              }
            } else if (vendorTypeKey === "cocktailgowns") {
              const ai = attrs.cocktail_gown_master?.ai_faq || {};
              switch (qId) {
                case 4301: return ai.customizable;
                case 4302: return ai.body_measurements;
                case 4303: return ai.trial_fittings;
                case 4304: return ai.styling_consultation;
                case 4305: return ai.plus_size;
                case 4306: return ai.delivery_outside_city;
                case 4307: return ai.alterations_included;
                case 4308: return ai.urgent_order;
                case 4309: return ai.premium_designer;
                case 4310: return ai.custom_color_fabric;
                case 4311: return ai.comfortable_long_events;
                case 4312: return ai.lightweight_options;
                case 4313: return ai.appointment_required;
                case 4314: return ai.reusable;
                case 4315: return ai.accessory_styling;
                default: return "";
              }
            } else if (vendorTypeKey === "bridaloutfit") {
              const ai = attrs.bridal_outfit_master?.ai_faq || {};
              switch (qId) {
                case 6001: return ai.customization_available;
                case 6002: return ai.body_measurements;
                case 6003: return ai.trial_fittings;
                case 6004: return ai.styling_consultation;
                case 6005: return ai.plus_size;
                case 6006: return ai.delivery_outside_city;
                case 6007: return ai.alterations_included;
                case 6008: return ai.urgent_order;
                case 6009: return ai.premium_designer;
                case 6010: return ai.blouse_dupatta_included || ai.custom_color_fabric;
                case 6011: return ai.comfortable_long_wear;
                case 6012: return ai.lightweight_options;
                case 6013: return ai.appointment_required;
                case 6014: return ai.reusable_after_wedding;
                case 6015: return attrs.bridal_outfit_master?.pricing_logic?.starting_price_range || "";
                default: return "";
              }
            } else if (vendorTypeKey === "kanjeevaramsilksaree") {
              // Kanjeevaram Silk Saree — derive answers from bridal_outfit_master fields
              const bo = attrs.bridal_outfit_master || {};
              const ai = bo.ai_faq || {};
              const core = bo.core_intelligence || {};
              const fs = bo.fit_styling || {};
              const pc = bo.product_catalog || {};
              const bi = bo.identity || {};
              const pl = bo.pricing_logic || {};
              const pd = bo.production_delivery || {};
              switch (qId) {
                case 7001: return core.fabric_options?.includes("Silk") ? "Yes" : "";
                case 7002: return bo.core_intelligence?.customization_depth ? "Yes" : ai.customization_available || "";
                case 7003: return "";
                case 7004: return pc.lehenga_types || pc.design_style;
                case 7005: return pl.starting_price_range || "";
                case 7006: return ai.blouse_dupatta_included || "";
                case 7007: return fs.alteration_support || "";
                case 7008: return formatList(bi.service_cities, 3) || pd.delivery_options?.includes("Home Delivery") ? "Yes – Select Cities" : "";
                case 7009: return "";
                case 7010: return core.work_types?.includes("Zari") ? "Mixed" : "";
                case 7011: return fs.styling_consultation || ai.styling_consultation || "";
                case 7012: return bi.appointment_requirement || "";
                case 7013: return bo.workflow_booking?.booking_advance_percent || "";
                case 7014: return bo.workflow_booking?.cancellation_policy || "";
                case 7015: return "";
                default: return "";
              }
            } else if (vendorTypeKey === "flowerjewellery") {
              const fi = attrs.flower_jewellery_master?.identity || {};
              const fmt = attrs.flower_jewellery_master?.material_type || {};
              const fsd = attrs.flower_jewellery_master?.style_design || {};
              const ffs = attrs.flower_jewellery_master?.function_specific || {};
              const fpl = attrs.flower_jewellery_master?.pricing_logic || {};
              const fdt = attrs.flower_jewellery_master?.delivery_timing || {};
              const fwb = attrs.flower_jewellery_master?.workflow_booking || {};
              const fia = attrs.flower_jewellery_master?.inventory_availability || {};
              switch (qId) {
                case 8001: return fi.bridal_jewellery_available || "";
                case 8002: return fmt.flower_type || "";
                case 8003: return fsd.customization_available || "";
                case 8004: return ffs.suitable_for || "";
                case 8005: return fdt.delivery_available || "";
                case 8006: return fdt.same_day_delivery || "";
                case 8007: return fdt.durability || "";
                case 8008: return fia.bulk_orders_supported || "";
                case 8009: return fsd.outfit_matching_support || "";
                case 8010: return fdt.preparation_time || "";
                case 8011: return fwb.replacement_policy || "";
                case 8012: return fwb.advance_required || "";
                case 8013: return fwb.cancellation_policy || "";
                case 8014: return fpl.price_range || "";
                case 8015: return fsd.best_known_for || "";
                default: return "";
              }
            } else if (vendorTypeKey === "rentaloutfit") {
              const ri = attrs.rental_outfit_master?.identity || {};
              const rs = attrs.rental_outfit_master?.services || {};
              const rci = attrs.rental_outfit_master?.core_intelligence || {};
              const rt = attrs.rental_outfit_master?.technical || {};
              const rp = attrs.rental_outfit_master?.pricing || {};
              const rw = attrs.rental_outfit_master?.workflow || {};
              switch (qId) {
                case 9001: return ri.bridal_lehenga_available || "Yes";
                case 9002: return rs.customization_alteration || "";
                case 9003: return rci.designer_availability || "";
                case 9004: return rp.security_deposit_required || "";
                case 9005: return rp.rental_price_range?.includes("2K–10K") || rp.rental_price_range?.includes("10K–25K") ? "Yes" : "";
                case 9006: return rs.trial_availability || "";
                case 9007: return rs.dry_cleaning_included || "";
                case 9008: return rt.size_range?.includes("XL") || rt.size_range?.includes("XXL") ? "Yes" : "";
                case 9009: return rs.rental_types?.includes("Multi-Day") ? "Yes" : "";
                case 9010: return rs.accessory_rental ? "Yes" : "";
                case 9011: return rw.booking_window?.includes("0–7") || rw.booking_window?.includes("7–30") ? "Yes" : "";
                case 9012: return rt.adjustability_range || "";
                case 9013: return rs.pickup_delivery_service || "";
                case 9014: return rci.lehenga_weight?.includes("Heavy") ? "Yes" : "";
                case 9015: return rw.trial_appointment_required || "";
                default: return "";
              }
            }
            return "";
          };

          const mergedFaqs = questions.map((q) => {
            let answer = answerMap.get(q.id) || "";
            if (!answer) {
              const fallback = getAiFaqFallback(q.id);
              if (
                fallback &&
                (Array.isArray(fallback)
                  ? fallback.length > 0
                  : String(fallback).trim() !== "")
              ) {
                answer = Array.isArray(fallback) ? fallback.join(", ") : fallback;
              }
            }
            return {
              ...q,
              ans: answer,
            };
          });
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

            {/* FACILITIES & FEATURES */}
            {vendorFeatures.length > 0 && (
              <div id="facilities" className="venue-facilities mb-5 p-2">
                <h3 className="details-section-title fw-bold fs-22">
                  Facilities & Features
                </h3>
                <div className="venue-amenities">
                  <Row>
                    {featuresToRender.map((item, index) => {
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
                          className={isSub ? "" : "mb-3"}
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
                    })}
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
