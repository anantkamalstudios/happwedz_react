import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import VendorMenus from "./subVendors/VendorMenus";
import vendorServicesApi from "../../../services/api/vendorServicesApi";

const Storefront = () => {
  const [active, setActive] = useState("business");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("vendorFormData");
    return saved ? JSON.parse(saved) : {};
  });
  const [photoDrafts, setPhotoDrafts] = useState([]);
  const [videoDrafts, setVideoDrafts] = useState([]);
  const { token, vendor } = useSelector((state) => state.vendorAuth || {});

  // Save handler: update if id exists, else create
  const handleSave = async () => {
    // Always update localStorage
    localStorage.setItem("vendorFormData", JSON.stringify(formData));
    // If formData has an id, call update API
    if (formData.id) {
      try {
        const fd = buildFormData();
        await vendorServicesApi.createOrUpdateService(fd, token, formData.id);
      } catch (e) {
        alert(
          `Failed to update. ${
            typeof e === "string" ? e : e?.message || "Unknown error"
          }`
        );
      }
    }
    setShowModal(true);
  };
  console.log("Form Data:", formData);

  // Hydrate lightweight draft metadata (titles only) on mount if present
  useEffect(() => {
    try {
      const photoMeta = JSON.parse(
        localStorage.getItem("photoDraftsMeta") || "null"
      );
      const videoMeta = JSON.parse(
        localStorage.getItem("videoDraftsMeta") || "null"
      );
      if (Array.isArray(photoMeta) && photoDrafts.length === 0) {
        setPhotoDrafts(
          photoMeta.map((m) => ({
            id: m.id,
            title: m.title,
            preview: m.preview || "",
            file: m.file || null,
          }))
        );
      }
      if (Array.isArray(videoMeta) && videoDrafts.length === 0) {
        setVideoDrafts(
          videoMeta.map((m) => ({
            id: m.id,
            title: m.title,
            type: m.type || "video",
            preview: m.preview || "",
            file: m.file || null,
          }))
        );
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist lightweight drafts (no File blobs) whenever they change
  useEffect(() => {
    const meta = photoDrafts.map(({ id, title, preview }) => ({
      id,
      title,
      preview,
    }));
    localStorage.setItem("photoDraftsMeta", JSON.stringify(meta));
  }, [photoDrafts]);

  useEffect(() => {
    const meta = videoDrafts.map(({ id, title, type = "video", preview }) => ({
      id,
      title,
      type,
      preview,
    }));
    localStorage.setItem("videoDraftsMeta", JSON.stringify(meta));
  }, [videoDrafts]);

  const buildAttributes = () => {
    const attrs = {
      tnc: formData.tnc,
      name:
        formData.attributes?.name || formData.attributes?.businessName || "",
      slug: formData.attributes?.slug || "",
      tags: formData.tags || [],
      deals: formData.deals || [],
      email: formData.contact?.email || "",
      rooms: formData.rooms ? Number(formData.rooms) : undefined,
      badges: formData.badges || {},
      rating: formData.rating ? Number(formData.rating) : undefined,
      contact: {
        phone: formData.contact?.phone || "",
        website: formData.contact?.website || "",
        whatsapp: formData.contact?.whatsappNumber || "",
      },
      cta_url: formData.ctaUrl || "",
      tagline: formData.attributes?.tagline || "",
      currency: formData.currency || "INR",
      location: {
        city: formData.location?.city || "",
        state: formData.location?.state || "",
        address: formData.location?.addressLine1 || "",
      },
      packages: formData.packages || [],
      subtitle: formData.attributes?.subtitle || "",
      cta_phone: formData.ctaPhone || "",
      dj_policy: formData.djPolicy || "",
      auto_reply: formData.autoReply || "",
      price_unit: formData.priceUnit || "",
      car_parking: formData.carParking || "",
      deco_policy: formData.decoPolicy || "",
      description: formData.attributes?.description || "",
      is_featured: !!formData.isFeatured,
      price_range: formData.priceRange || { min: "", max: "" },
      primary_cta: formData.primaryCTA || "enquire",
      sort_weight: formData.sortWeight
        ? Number(formData.sortWeight)
        : undefined,
      timing_open: formData.timing?.open || "",
      capacity_max: formData.capacity?.max
        ? Number(formData.capacity?.max)
        : undefined,
      capacity_min: formData.capacity?.min
        ? Number(formData.capacity?.min)
        : undefined,
      timing_close: formData.timing?.close || "",
      payment_terms: formData.paymentTerms
        ? {
            advance: formData.paymentTerms.advancePercent
              ? `${formData.paymentTerms.advancePercent}%`
              : undefined,
            balance: undefined,
          }
        : undefined,
      refund_policy: formData.refundPolicy || "",
      reviews_count: formData.reviewsCount
        ? Number(formData.reviewsCount)
        : undefined,
      alcohol_policy: formData.alcoholPolicy || "",
      blackout_dates: formData.blackoutDates || [],
      indoor_outdoor: formData.indoorOutdoor || "",
      starting_price: formData.startingPrice
        ? Number(formData.startingPrice)
        : undefined,
      available_slots: Array.isArray(formData.availableSlots)
        ? formData.availableSlots.map((s) => ({
            date: s.date,
            slots:
              s.slots ||
              (s.timeFrom && s.timeTo ? [`${s.timeFrom}-${s.timeTo}`] : []),
          }))
        : [],
      catering_policy: formData.cateringPolicy || "",
      hall_types_note: formData.hallTypesNote || "",
      timing_last_entry: formData.timing?.lastEntry || "",
      cancellation_policy: formData.cancellationPolicy || "",
      is_feature_available:
        (formData.isFeatureAvailable || "No").toString().toLowerCase() ===
        "yes",
      within_24hr_available:
        (formData.within24HrAvailable || "No").toString().toLowerCase() ===
        "yes",
    };

    // Remove undefined keys
    Object.keys(attrs).forEach(
      (k) => attrs[k] === undefined && delete attrs[k]
    );
    return attrs;
  };

  const buildMedia = () => {
    // Build media metadata from current drafts if available, fallback to formData
    const gallery = Array.isArray(photoDrafts)
      ? photoDrafts.map((p) => ({
          id: p.id,
          title: p.title || "",
          type: "image",
        }))
      : formData.media?.gallery || formData.gallery || [];

    const videos = Array.isArray(videoDrafts)
      ? videoDrafts.map((v) => ({
          id: v.id,
          title: v.title || "",
          type: v.type || "video",
        }))
      : [];

    const media = {
      gallery,
      videos,
      coverImage: formData.media?.coverImage || formData.coverImage || "",
    };
    return media;
  };

  const buildFormData = () => {
    const fd = new FormData();
    const vendorId = vendor?.id || formData.vendor_id;
    if (vendorId) fd.append("vendor_id", `${vendorId}`);
    if (formData.vendor_subcategory_id)
      fd.append("vendor_subcategory_id", `${formData.vendor_subcategory_id}`);
    if (formData.status) fd.append("status", formData.status);

    const attrs = buildAttributes();
    const media = buildMedia();
    fd.append("attributes", JSON.stringify(attrs));
    fd.append("media", JSON.stringify(media));

    // Append media files so backend can store actual uploads
    if (Array.isArray(photoDrafts)) {
      photoDrafts.forEach((p, index) => {
        if (p && p.file instanceof File) {
          fd.append("gallery", p.file, p.file.name || `image_${index}`);
        }
      });
    }
    if (Array.isArray(videoDrafts)) {
      videoDrafts.forEach((v, index) => {
        if (v && v.file instanceof File) {
          fd.append("videos", v.file, v.file.name || `video_${index}`);
        }
      });
    }

    // Optional: menus for caterers
    if (Array.isArray(formData.menus)) {
      fd.append("menus", JSON.stringify(formData.menus));
    }
    return fd;
  };

  const handleSubmit = async () => {
    try {
      const fd = buildFormData();
      let created;
      if (formData.id) {
        created = await vendorServicesApi.createOrUpdateService(
          fd,
          token,
          formData.id
        );
      } else {
        created = await vendorServicesApi.createOrUpdateService(fd, token);
        // If POST succeeded and response has id, update formData with new id for future PUTs
        if (created?.id) {
          setFormData((prev) => ({ ...prev, id: created.id }));
        }
      }
      // On success, persist and show modal
      localStorage.setItem("vendorFormData", JSON.stringify(formData));
      // If API returns media URLs, hydrate previews and clear File blobs
      if (created?.media) {
        const { gallery = [], videos = [] } = created.media;
        if (Array.isArray(gallery) && gallery.length) {
          setPhotoDrafts((prev) =>
            prev.map((p, i) => ({
              ...p,
              preview: gallery[i]?.url || gallery[i]?.path || p.preview,
              file: null,
            }))
          );
        }
        if (Array.isArray(videos) && videos.length) {
          setVideoDrafts((prev) =>
            prev.map((v, i) => ({
              ...v,
              preview: videos[i]?.url || videos[i]?.path || v.preview,
              file: null,
            }))
          );
        }
      }
      setShowModal(true);
    } catch (e) {
      alert(
        `Failed to submit. ${
          typeof e === "string" ? e : e?.message || "Unknown error"
        }`
      );
    }
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
    { id: "promotions", label: "Promotions", icon: <CiBullhorn size={20} /> },
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
      id: "vendor-menus",
      label: "Menus",
      icon: <MdCurrencyRupee size={20} />,
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
        return (
          <BusinessDetails formData={formData} setFormData={setFormData} />
        );

      case "vendor-basic":
        return (
          <VendorBasicInfo
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-contact":
        return (
          <VendorContact
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-location":
        return (
          <VendorLocation
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "photos":
        return (
          <PhotoGallery images={photoDrafts} onImagesChange={setPhotoDrafts} />
        );
      case "videos":
        return (
          <VideoGallery videos={videoDrafts} onVideosChange={setVideoDrafts} />
        );
      case "promotions":
        return <PromoForm />;
      case "vendor-pricing":
        return (
          <VendorPricing
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-facilities":
        return (
          <VendorFacilities
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-policies":
        return (
          <VendorPolicies
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-availability":
        return (
          <VendorAvailability
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );
      case "vendor-menus":
        return (
          <VendorMenus
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
          />
        );

      case "vendor-marketing":
        return (
          <VendorMarketing
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onSubmit={handleSubmit}
          />
        );
      // case "vendor-media":
      //   return <VendorMedia formData={formData} setFormData={setFormData} />;
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
