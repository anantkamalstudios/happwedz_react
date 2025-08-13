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
} from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { CiLocationOn } from "react-icons/ci";
import BusinessDetails from "./subVendors/BusinessDetails";
import LocationForm from "./subVendors/LocationForm";
import PromoForm from "./subVendors/PromoForm";
import PhotoGallery from "./subVendors/PhotoGallery";
import VideoGallery from "./subVendors/VideoGallery";
import Event from "./subVendors/Event";
import EndorsementForm from "./subVendors/EndorsementForm";
import OwnersManager from "./subVendors/OwnersManager";
import SocialDetails from "./subVendors/SocialDetails";

const Storefront = () => {
  const [active, setActive] = useState("business");

  const menuItems = [
    { id: "business", label: "Business details", icon: <FaRegBuilding /> },
    { id: "location", label: "Location and map", icon: <CiLocationOn /> },
    // { id: "faq", label: "FAQ", icon: <FaQuestion /> },
    { id: "promotions", label: "Promotions", icon: <FaBullhorn /> },
    { id: "photos", label: "Photos", icon: <FaCamera /> },
    { id: "videos", label: "Videos", icon: <FaVideo /> },
    { id: "events", label: "Events", icon: <FaCalendarAlt /> },
    { id: "vendors", label: "Preferred vendors", icon: <FaHandshake /> },
    { id: "team", label: "Meet the team", icon: <FaUsers /> },
    { id: "social", label: "Social networks", icon: <FaShareAlt /> },
    // { id: "button", label: "WeddingWire button", icon: <FaRing /> },
  ];

  const renderContent = () => {
    switch (active) {
      case "business":
        return <BusinessDetails />;
      case "location":
        return <LocationForm />;
      case "promotions":
        return <PromoForm />;
      case "photos":
        return <PhotoGallery />;
      case "videos":
        return <VideoGallery />;
      case "events":
        return <Event />;
      case "vendors":
        return <EndorsementForm />;
      case "team":
        return <OwnersManager />;
      case "social":
        return <SocialDetails />;
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
                  active === item.id
                    ? "text-white bg-primary"
                    : "text-secondary"
                }`}
                style={{ fontSize: "14px" }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {/* <h5 className="mb-3 text-capitalize">
            {menuItems.find((m) => m.id === active)?.label}
          </h5> */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Storefront;
