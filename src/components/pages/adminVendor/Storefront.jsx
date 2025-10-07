import { IMAGE_BASE_URL } from "../../../config/constants.js";
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
// import SocialDetails from "./subVendors/SocialDetails";
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
import Faq from "./subVendors/Faq.jsx";
import { GoGift } from "react-icons/go";
import VendorMenus from "./subVendors/VendorMenus";
import vendorServicesApi from "../../../services/api/vendorServicesApi";
import { name } from "dayjs/locale/en.js";

const Storefront = () => {
  const [active, setActive] = useState("business");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoDrafts, setPhotoDrafts] = useState([]);
  const [videoDrafts, setVideoDrafts] = useState([]);
  const [vendorTypeName, setVendorTypeName] = useState("");
  const { token, vendor } = useSelector((state) => state.vendorAuth || {});

  useEffect(() => {
    const fetchServiceData = async () => {
      if (vendor?.id && token) {
        try {
          // Clear localStorage for new vendor to prevent data leakage
          const lastVendorId = localStorage.getItem("lastVendorId");
          if (lastVendorId && lastVendorId !== vendor.id.toString()) {
            localStorage.removeItem("vendorFormData");
            localStorage.removeItem("photoDraftsMeta");
            localStorage.removeItem("videoDraftsMeta");
            setFormData({});
            setPhotoDrafts([]);
            setVideoDrafts([]);
          }
          localStorage.setItem("lastVendorId", vendor.id.toString());

          const serviceData =
            await vendorServicesApi.getVendorServiceByVendorId(
              vendor.id,
              token
            );

          // Fetch vendor type name from API (like VendorBasicInfo)
          if (vendor.vendor_type_id) {
            try {
              const response = await fetch(
                `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`
              );
              const vendorTypeData = await response.json();
              setVendorTypeName(vendorTypeData?.name || "");
            } catch (err) {
              setVendorTypeName("");
            }
          }

          // If data exists, merge it into formData.
          if (serviceData) {
            const actualData = Array.isArray(serviceData)
              ? serviceData[0]
              : serviceData;
            if (actualData) {
              if (actualData.media) {
                const { gallery = [], videos = [] } = actualData.media;
                // Normalize gallery: objects and string URLs, prefix relative paths
                const photoDraftsData = Array.isArray(gallery)
                  ? gallery.map((item, index) => {
                      let preview = "";
                      if (typeof item === "string") {
                        preview = item;
                      } else {
                        preview = item.url || item.path || "";
                      }
                      // Prefix relative paths
                      if (preview.startsWith("/uploads/")) {
                        preview = IMAGE_BASE_URL + preview;
                      }
                      return {
                        id:
                          typeof item === "string"
                            ? `photo_${index}`
                            : item.id || `photo_${index}`,
                        title: typeof item === "string" ? "" : item.title || "",
                        preview,
                        file: null,
                      };
                    })
                  : [];
                setPhotoDrafts(photoDraftsData);

                const videoDraftsData = Array.isArray(videos)
                  ? videos.map((item, index) => {
                      let preview = item.url || item.path || "";
                      if (preview.startsWith("/uploads/")) {
                        preview = IMAGE_BASE_URL + preview;
                      }
                      return {
                        id: item.id || `video_${index}`,
                        title: item.title || "",
                        type: item.type || "video",
                        preview,
                        file: null,
                      };
                    })
                  : [];
                setVideoDrafts(videoDraftsData);
              }
              if (actualData && actualData.attributes) {
                setFormData((prev) => ({
                  ...prev,
                  ...actualData,
                  contact: actualData.attributes.contact
                    ? {
                        contactName: actualData.attributes.contact.name || "",
                        phone: actualData.attributes.contact.phone || "",
                        altPhone: actualData.attributes.contact.altPhone || "",
                        email: actualData.attributes.contact.email || "",
                        website: actualData.attributes.contact.website || "",
                        whatsappNumber:
                          actualData.attributes.contact.whatsapp || "",
                        inquiryEmail:
                          actualData.attributes.contact.inquiryEmail || "",
                      }
                    : {},

                  location: actualData.attributes.location
                    ? {
                        addressLine1:
                          actualData.attributes.location.address || "",
                        addressLine2:
                          actualData.attributes.location.addressLine2 || "",
                        city: actualData.attributes.location.city || "",
                        state: actualData.attributes.location.state || "",
                        country:
                          actualData.attributes.location.country || "India",
                        pincode: actualData.attributes.location.pincode || "",
                        lat: actualData.attributes.location.lat || "",
                        lng: actualData.attributes.location.lng || "",
                        landmark: actualData.attributes.location.landmark || "",
                        serviceAreas:
                          actualData.attributes.location.serviceAreas || [],
                      }
                    : {},

                  // Pricing fields mapping
                  startingPrice: actualData.attributes.starting_price || "",
                  priceRange: actualData.attributes.price_range || {
                    min: "",
                    max: "",
                  },
                  priceUnit: actualData.attributes.price_unit || "",
                  currency: actualData.attributes.currency || "INR",
                  capacity: actualData.attributes.capacity || {
                    min: "",
                    max: "",
                  },
                  indoorOutdoor: actualData.attributes.indoor_outdoor || "",
                  alcoholPolicy: actualData.attributes.alcohol_policy || "",
                  cateringPolicy: actualData.attributes.catering_policy || "",
                  rooms: actualData.attributes.rooms || "",
                  cancellationPolicy:
                    actualData.attributes.cancellation_policy || "",
                  refundPolicy: actualData.attributes.refund_policy || "",
                  paymentTerms: actualData.attributes.payment_terms
                    ? {
                        advancePercent:
                          actualData.attributes.payment_terms.advance,
                      }
                    : {},
                  tnc: actualData.attributes.tnc || "",

                  isFeatureAvailable:
                    actualData.attributes.is_feature_available,
                  within24HrAvailable:
                    actualData.attributes.within_24hr_available,
                  djPolicy: actualData.attributes.dj_policy || "",
                  primaryCTA: actualData.attributes.primary_cta || "enquire",
                  sortWeight: actualData.attributes.sort_weight || "",
                  timing: actualData.attributes.timing || {
                    open: "",
                    close: "",
                    lastEntry: "",
                  },
                  ctaUrl: actualData.attributes.cta_url || "",
                  ctaPhone: actualData.attributes.cta_phone || "",
                  autoReply: actualData.attributes.auto_reply || "",

                  attributes: actualData.attributes,

                  // add other fields as needed
                }));
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch vendor service data:", error);
        }
      }
    };
    fetchServiceData();
  }, [vendor, token]);

  const handleSave = async () => {
    localStorage.setItem("vendorFormData", JSON.stringify(formData));
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

  // Expose show success modal to subcomponents
  const showSuccessModal = useMemo(() => () => setShowModal(true), []);

  // This effect is removed since we now load data from API instead of localStorage

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
        name: formData.contact?.contactName || "",
        phone: formData.contact?.phone || "",
        // website: formData.contact?.website || "",
        whatsapp: formData.contact?.whatsappNumber || "",
        altPhone: formData.contact?.altPhone || "",
        email: formData.contact?.email || "",
        // contactName: formData.contact?.contactName || "",
      },
      cta_url: formData.ctaUrl || "",
      tagline: formData.attributes?.tagline || "",
      currency: formData.currency || "INR",
      location: {
        city: formData.location?.city || "",
        state: formData.location?.state || "",
        address: formData.location?.addressLine1 || "",
        country: formData.location?.country || "India",
        pincode: formData.location?.pincode || "",
        lat: formData.location?.lat || "",
        lng: formData.location?.lng || "",
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
      // Always include menus if present in attributes
      ...(Array.isArray(formData.attributes?.menus)
        ? { menus: formData.attributes.menus }
        : {}),
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

    // Menus are now included only inside attributes for backend compatibility
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

  // Only show Menus sidebar for vendorTypeName 'Venues' or 'Caterers' (case-insensitive)
  const allowedMenuTypes = ["venues", "caterers"];
  const normalizedVendorTypeName = (vendorTypeName || "").trim().toLowerCase();

  const menuItems = [
    {
      id: "business",
      label: "Business details",
      icon: <FaRegBuilding size={20} />,
    },
    {
      id: "vendor-basic",
      label: "Basic Information",
      icon: <IoIosInformationCircleOutline size={20} />,
    },
    { id: "faq", label: "FAQ", icon: <CiCircleQuestion size={20} /> },
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
    {
      id: "vendor-availability",
      label: "Availability & Slots",
      icon: <MdOutlineEventAvailable size={20} />,
    },
    // Only show Menus if vendorTypeName is allowed
    ...(allowedMenuTypes.includes(normalizedVendorTypeName)
      ? [
          {
            id: "vendor-menus",
            label: "Menus",
            icon: <MdCurrencyRupee size={20} />,
          },
        ]
      : []),
    {
      id: "vendor-marketing",
      label: "Marketing & CTA",
      icon: <GoGift size={20} />,
    },
  ];

  const renderContent = () => {
    switch (active) {
      case "business":
        return (
          <BusinessDetails
            formData={formData}
            setFormData={setFormData}
            onShowSuccess={showSuccessModal}
          />
        );
      case "faq":
        return (
          <Faq
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-basic":
        return (
          <VendorBasicInfo
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-contact":
        return (
          <VendorContact
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-location":
        return (
          <VendorLocation
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "photos":
        return (
          <PhotoGallery
            images={photoDrafts}
            onImagesChange={setPhotoDrafts}
            onShowSuccess={showSuccessModal}
          />
        );
      case "videos":
        return (
          <VideoGallery
            videos={videoDrafts}
            onVideosChange={setVideoDrafts}
            onShowSuccess={showSuccessModal}
          />
        );
      case "promotions":
        return (
          <PromoForm
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-pricing":
        return (
          <VendorPricing
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-facilities":
        return (
          <VendorFacilities
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-policies":
        return (
          <VendorPolicies
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-availability":
        return (
          <VendorAvailability
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-menus":
        return (
          <VendorMenus
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "vendor-marketing":
        return (
          <VendorMarketing
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
            onSubmit={handleSubmit}
          />
        );
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
