import React, { useState } from "react";
import { FaQuestion, FaRegBuilding } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaBullhorn,
  FaCamera,
  FaVideo,
  FaCalendarAlt,
  FaHandshake,
  FaUsers,
  FaShareAlt,
  FaRing,
  FaBuilding,
  FaPhone,
  FaImage,
  FaRupeeSign,
  FaCheckCircle,
  FaFilePdf,
  FaClock,
  FaGift,
} from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { CiCircleInfo, CiLocationOn } from "react-icons/ci";
import BusinessDetails from "./subVendors/BusinessDetails";
import VendorForm from "./subVendors/VendorForm";
import LocationForm from "./subVendors/LocationForm";
import PromoForm from "./subVendors/PromoForm";
import PhotoGallery from "./subVendors/PhotoGallery";
import VideoGallery from "./subVendors/VideoGallery";
import Event from "./subVendors/Event";
import EndorsementForm from "./subVendors/EndorsementForm";
import OwnersManager from "./subVendors/OwnersManager";
import SocialDetails from "./subVendors/SocialDetails";
// Vendor Form Sections
import VendorBasicInfo from "./subVendors/VendorBasicInfo";
import VendorContact from "./subVendors/VendorContact";
import VendorLocation from "./subVendors/VendorLocation";
import VendorMedia from "./subVendors/VendorMedia";
import VendorPricing from "./subVendors/VendorPricing";
import VendorFacilities from "./subVendors/VendorFacilities";
import VendorPolicies from "./subVendors/VendorPolicies";
import VendorAvailability from "./subVendors/VendorAvailability";
import VendorMarketing from "./subVendors/VendorMarketing";

const Storefront = () => {
  const [active, setActive] = useState("business");

  const menuItems = [
    { id: "business", label: "Business details", icon: <FaRegBuilding /> },
    // Vendor Form Sections
    { id: "vendor-basic", label: "Basic Information", icon: <CiCircleInfo /> },
    { id: "vendor-contact", label: "Contact Details", icon: <FaPhone /> },
    {
      id: "vendor-location",
      label: "Location & Service Areas",
      icon: <FaMapMarkerAlt />,
    },
    { id: "vendor-media", label: "Media & Gallery", icon: <FaImage /> },
    {
      id: "vendor-pricing",
      label: "Pricing & Packages",
      icon: <FaRupeeSign />,
    },
    {
      id: "vendor-facilities",
      label: "Facilities & Features",
      icon: <FaCheckCircle />,
    },
    { id: "vendor-policies", label: "Policies & Terms", icon: <FaFilePdf /> },
    {
      id: "vendor-availability",
      label: "Availability & Slots",
      icon: <FaClock />,
    },
    { id: "vendor-marketing", label: "Marketing & CTA", icon: <FaGift /> },
    // Original sections
    { id: "location", label: "Location and map", icon: <CiLocationOn /> },
    // { id: "faq", label: "FAQ", icon: <FaQuestion /> },
    // { id: "promotions", label: "Promotions", icon: <FaBullhorn /> },
    // { id: "photos", label: "Photos", icon: <FaCamera /> },
    // { id: "videos", label: "Videos", icon: <FaVideo /> },
    // { id: "events", label: "Events", icon: <FaCalendarAlt /> },
    // { id: "vendors", label: "Preferred vendors", icon: <FaHandshake /> },
    // { id: "team", label: "Meet the team", icon: <FaUsers /> },
    // { id: "social", label: "Social networks", icon: <FaShareAlt /> },
    // { id: "button", label: "WeddingWire button", icon: <FaRing /> },
  ];

  const renderContent = () => {
    switch (active) {
      case "business":
        return <BusinessDetails />;
      // Vendor Form Sections
      case "vendor-basic":
        return <VendorBasicInfo />;
      case "vendor-contact":
        return <VendorContact />;
      case "vendor-location":
        return <VendorLocation />;
      case "vendor-media":
        return <VendorMedia />;
      case "vendor-pricing":
        return <VendorPricing />;
      case "vendor-facilities":
        return <VendorFacilities />;
      case "vendor-policies":
        return <VendorPolicies />;
      case "vendor-availability":
        return <VendorAvailability />;
      case "vendor-marketing":
        return <VendorMarketing />;
      // Original sections
      // case "location":
      //   return <LocationForm />;
      // case "promotions":
      //   return <PromoForm />;
      // case "photos":
      //   return <PhotoGallery />;
      // case "videos":
      //   return <VideoGallery />;
      // case "events":
      //   return <Event />;
      // case "vendors":
      //   return <EndorsementForm />;
      // case "team":
      //   return <OwnersManager />;
      // case "social":
      //   return <SocialDetails />;
      default:
        return (
          <div className="p-3 border rounded bg-white">
            <p>Content for {active}</p>
          </div>
        );
    }
  };

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 border-end">
          <Nav className="flex-column nav-pills">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.id}
                onClick={() => setActive(item.id)}
                active={active === item.id}
                className={`d-flex align-items-center gap-2 ${
                  active === item.id ? "text-white" : "text-secondary"
                }`}
                style={
                  active === item.id
                    ? {
                        background:
                          "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)",
                        fontSize: "14px",
                      }
                    : {}
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Main Content */}
        <div className="col-md-9">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Storefront;
