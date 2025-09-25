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
import {
  CiBullhorn,
  CiCircleInfo,
  CiCircleQuestion,
  CiLocationOn,
} from "react-icons/ci";
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
import SuccessModal from "../../ui/SuccessModal";
import { PiPhoneCall } from "react-icons/pi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { HiOutlineDocument } from "react-icons/hi2";
import { MdCurrencyRupee, MdOutlineEventAvailable } from "react-icons/md";

import {
  IoCameraOutline,
  IoCheckmarkCircleOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { GoGift } from "react-icons/go";

const Storefront = () => {
  const [active, setActive] = useState("business");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("vendorFormData");
    return saved ? JSON.parse(saved) : {};
  });

  const handleSave = () => {
    localStorage.setItem("vendorFormData", JSON.stringify(formData));
    setShowModal(true);
  };

  const menuItems = [
    {
      id: "business",
      label: "Business details",
      icon: <FaRegBuilding size={20} />,
    },
    { id: "faq", label: "FAQ", icon: <CiCircleQuestion size={20} /> },
    {
      id: "vendor-basic",
      label: "Basic Information",
      icon: <IoIosInformationCircleOutline size={20} />,
    },
    {
      id: "vendor-contact",
      label: "Contact Details",
      icon: <PiPhoneCall size={20} />,
    },
    {
      id: "vendor-location",
      label: "Location & Service Areas",
      icon: <CiLocationOn size={20} />,
    },
    { id: "photos", label: "Photos", icon: <IoCameraOutline size={20} /> },
    { id: "videos", label: "Videos", icon: <IoVideocamOutline size={20} /> },
    {
      id: "vendor-pricing",
      label: "Pricing & Packages",
      icon: <MdCurrencyRupee size={20} />,
    },
    {
      id: "vendor-facilities",
      label: "Facilities & Features",
      icon: <IoCheckmarkCircleOutline size={20} />,
    },
    {
      id: "vendor-policies",
      label: "Policies & Terms",
      icon: <HiOutlineDocument size={20} />,
    },
    { id: "promotions", label: "Promotions", icon: <CiBullhorn size={20} /> },
    {
      id: "vendor-availability",
      label: "Availability & Slots",
      icon: <MdOutlineEventAvailable size={20} />,
    },
    {
      id: "vendor-marketing",
      label: "Marketing & CTA",
      icon: <GoGift size={20} />,
    },
    {
      id: "location",
      label: "Location and map",
      icon: <CiLocationOn size={20} />,
    },

    // { id: "vendor-media", label: "Media & Gallery", icon: <FaImage /> },
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
      case "promotions":
        return <PromoForm />;
      // Vendor Form Sections
      case "vendor-basic":
        return (
          <VendorBasicInfo formData={formData} setFormData={setFormData} />
        );
      case "vendor-contact":
        return <VendorContact formData={formData} setFormData={setFormData} />;
      case "vendor-location":
        return <VendorLocation formData={formData} setFormData={setFormData} />;
      case "photos":
        return <PhotoGallery />;
      case "videos":
        return <VideoGallery />;
      // case "vendor-media":
      //   return <VendorMedia formData={formData} setFormData={setFormData} />;
      case "vendor-pricing":
        return <VendorPricing formData={formData} setFormData={setFormData} />;
      case "vendor-facilities":
        return (
          <VendorFacilities formData={formData} setFormData={setFormData} />
        );
      case "vendor-policies":
        return <VendorPolicies formData={formData} setFormData={setFormData} />;
      case "vendor-availability":
        return (
          <VendorAvailability formData={formData} setFormData={setFormData} />
        );
      case "vendor-marketing":
        return (
          <VendorMarketing
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
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
    <div className="container py-3 store-front-navbar">
      <div className="row">
        <div className="col-md-3 border-end">
          <Nav className="flex-column custom-sidebar">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`d-flex align-items-center gap-2 sidebar-nav-item ${
                  active === item.id ? "active" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>
        </div>

        <div className="col-md-9">{renderContent()}</div>
      </div>

      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Your details have been saved successfully!"
      />
    </div>
  );
};

export default Storefront;
