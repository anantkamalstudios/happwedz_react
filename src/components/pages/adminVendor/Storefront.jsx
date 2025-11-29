import { IMAGE_BASE_URL } from "../../../config/constants.js";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaRegBuilding } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { CiBullhorn, CiCircleQuestion, CiLocationOn } from "react-icons/ci";
import BusinessDetails from "./subVendors/BusinessDetails";
import PromoForm from "./subVendors/PromoForm";
import PhotoGallery from "./subVendors/PhotoGallery";
import VideoGallery from "./subVendors/VideoGallery";
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
import { PiShareNetworkDuotone } from "react-icons/pi";

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
import Swal from "sweetalert2";
import PreferredVendors from "./subVendors/PreferredVendors";
import SocialDetails from "./subVendors/SocialDetails";

const Storefront = ({ setCompletion }) => {
  const [active, setActive] = useState("business");
  const [showModal, setShowModal] = useState(false);
  const { token, vendor } = useSelector((state) => state.vendorAuth || {});
  const [formData, setFormData] = useState({ attributes: vendor || {} });
  const [photoDrafts, setPhotoDrafts] = useState([]);
  const [videoDrafts, setVideoDrafts] = useState([]);
  const [vendorTypeName, setVendorTypeName] = useState("");
  // Persist active tab per-vendor so refresh/navigation keeps you on the same section
  const storageKey = React.useMemo(
    () =>
      vendor?.id ? `storefrontActiveTab_${vendor.id}` : "storefrontActiveTab",
    [vendor?.id]
  );

  const fetchServiceData = useCallback(async () => {
    if (vendor?.id && token) {
      try {
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

        const serviceData = await vendorServicesApi.getVendorServiceByVendorId(
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
            let gallery = [];
            let videos = [];

            if (actualData.media) {
              if (Array.isArray(actualData.media)) {
                gallery = actualData.media.map((item) =>
                  typeof item === "string"
                    ? item
                    : item.url || item.path || null
                );
              } else if (
                actualData.media &&
                typeof actualData.media === "object"
              ) {
                // legacy shape: { gallery: [...], videos: [...] }
                gallery = Array.isArray(actualData.media.gallery)
                  ? actualData.media.gallery.map((g) =>
                      typeof g === "string" ? g : g.url || g.path || null
                    )
                  : [];
                videos = Array.isArray(actualData.media.videos)
                  ? actualData.media.videos.map((v) =>
                      typeof v === "string" ? v : v.url || v.path || null
                    )
                  : [];
              }
            }

            if (actualData.attributes) {
              const videosFromAttr =
                actualData.attributes.video ||
                actualData.attributes.vedio ||
                [];
              if (Array.isArray(videosFromAttr)) {
                const normalizedVideos = videosFromAttr
                  .map((v) =>
                    typeof v === "string" ? v : v.url || v.path || null
                  )
                  .filter(Boolean);
                videos = [...new Set([...videos, ...normalizedVideos])];
              }
            }

            // Normalize gallery and videos: prefix relative paths and build draft objects
            const photoDraftsData = Array.isArray(gallery)
              ? gallery.map((item, index) => {
                  let preview = item || "";
                  if (preview && preview.startsWith("/uploads/"))
                    preview = IMAGE_BASE_URL + preview;
                  return {
                    preview,
                    file: null,
                  };
                })
              : [];
            setPhotoDrafts(photoDraftsData.filter((p) => p.preview));

            const videoDraftsData = Array.isArray(videos)
              ? videos.map((item, index) => {
                  let preview = item || "";
                  if (preview && preview.startsWith("/uploads/"))
                    preview = IMAGE_BASE_URL + preview;
                  return {
                    id: `video_${index}`,
                    title: "",
                    type: "video",
                    preview,
                    file: null,
                  };
                })
              : [];
            setVideoDrafts(videoDraftsData.filter((v) => v.preview));
            if (actualData && actualData.attributes) {
              setFormData((prev) => ({
                ...prev,
                ...actualData,
                deals: actualData.attributes.deals || [],
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
                city: actualData.attributes.city || "",
                // latitude: actualData.attributes.latitude || "",
                // longitude: actualData.attributes.longitude || "",
                // address:actualData.attributes.address || "",

                location: actualData.attributes.location
                  ? {
                      address: actualData.attributes.address || "",

                      city: actualData.attributes.city || "",
                      state: actualData.attributes.location.state || "",
                      country:
                        actualData.attributes.location.country || "India",
                      pincode: actualData.attributes.location.pincode || "",
                      latitude: actualData.attributes.latitude || "",
                      longitude: actualData.attributes.longitude || "",

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
                PriceRange: actualData.attributes.PriceRange || "",
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

                payment_terms: actualData.attributes.payment_terms || "",
                parking: actualData.attributes.parking || "",

                tnc: actualData.attributes.tnc || "",

                isFeatureAvailable: actualData.attributes.is_feature_available,
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

                // New attributes from Detailed.jsx
                veg_price: actualData.attributes.veg_price || "",
                non_veg_price: actualData.attributes.non_veg_price || "",
                photo_package_price:
                  actualData.attributes.photo_package_price || "",
                photo_video_package_price:
                  actualData.attributes.photo_video_package_price || "",
                happywedz_since:
                  actualData.attributes.happywedz_since ||
                  actualData.attributes.HappyWedz ||
                  "",
                HappyWedz:
                  actualData.attributes.HappyWedz ||
                  actualData.attributes.happywedz_since ||
                  "",
                travel_info: actualData.attributes.travel_info || "",
                offerings: actualData.attributes.offerings || "",
                delivery_time: actualData.attributes.delivery_time || "",
                decorPolicy: actualData.attributes.decor_policy || "",
                area: actualData.attributes.area || "",
                video: actualData.attributes.video || [],

                attributes: {
                  ...prev.attributes,
                  ...actualData.attributes,
                  email:
                    actualData.attributes.contact?.email ||
                    prev.attributes?.email,
                },
              }));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch vendor service data:", error);
      }
    }
  }, [vendor?.id, vendor?.vendor_type_id, token]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  // Fetch and load storefront completion from backend
  useEffect(() => {
    const fetchStorefrontCompletion = async () => {
      if (!formData.id || !token) return;

      try {
        const response = await fetch(
          `https://happywedz.com/api/vendor-services/${formData.id}/storefront-completion`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Storefront completion response:", data);

        if (response.ok && data?.service?.storefront_completion !== undefined) {
          const completion = data.service.storefront_completion;
          localStorage.setItem("storefrontCompletion", completion.toString());
          console.log("Stored storefrontCompletion:", completion);
        }
      } catch (error) {
        console.error("Error fetching storefront completion:", error);
      }
    };

    fetchStorefrontCompletion();
  }, [formData.id, token]);

  // Persist service ID to localStorage so Navbar can access it
  useEffect(() => {
    if (formData.id) {
      localStorage.setItem("vendorServiceId", formData.id.toString());
    }
  }, [formData.id]);

  const handleSave = async () => {
    localStorage.setItem("vendorFormData", JSON.stringify(formData));
    if (formData.id) {
      try {
        const fd = buildFormData();
        await vendorServicesApi.createOrUpdateService(fd, token, formData.id);
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Failed to update. ${
            typeof e === "string" ? e : e?.message || "Unknown error"
          }`,
          timer: "3000",
          confirmButtonText: "OK",
          confirmButtonColor: "#C31162",
        });
      }
    }
    setShowModal(true);
  };

  // Expose show success modal to subcomponents
  const showSuccessModal = useMemo(() => () => setShowModal(true), []);

  // This effect is removed since we now load data from API instead of localStorage

  // Persist lightweight drafts (no File blobs) whenever they change
  useEffect(() => {
    const meta = photoDrafts.map(({ preview }) => ({ preview }));
    localStorage.setItem("photoDraftsMeta", JSON.stringify(meta));
  }, [photoDrafts]);

  useEffect(() => {
    // Persist only lightweight preview URLs for videos (avoid storing internal ids/titles)
    const meta = videoDrafts.map(({ preview, url }) => ({
      preview: preview || url,
    }));
    localStorage.setItem("videoDraftsMeta", JSON.stringify(meta));
  }, [videoDrafts]);

  const buildAttributes = () => {
    const attrs = {
      tnc: formData.tnc,
      name:
        formData.attributes?.businessName ||
        formData.attributes?.name ||
        formData.attributes?.Name ||
        "",
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
      city: formData.location?.city || "",
      latitude: formData.location?.latitude || "",
      longitude: formData.location?.longitude || "",
      address: formData.location?.address || "",

      location: {
        state: formData.location?.state || "",
        // address: formData.location?.addressLine1 || "",
        country: formData.location?.country || "India",
        pincode: formData.location?.pincode || "",
      },
      packages: formData.packages || [],
      subtitle: formData.attributes?.subtitle || "",
      cta_phone: formData.ctaPhone || "",
      dj_policy: formData.djPolicy || "",
      auto_reply: formData.autoReply || "",
      price_unit: formData.priceUnit || "",
      parking: formData.parking || "",
      deco_policy: formData.decoPolicy || "",
      about_us: formData.attributes?.about_us || "",
      is_featured: !!formData.isFeatured,
      price_range: formData.priceRange || { min: "", max: "" },
      PriceRange: formData.PriceRange || "",
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

      payment_terms: formData.payment_terms || "",

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
            // slots:
            //   s.slots ||
            //   (s.timeFrom && s.timeTo ? [`${s.timeFrom}-${s.timeTo}`] : []),
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
      // New attributes from Detailed.jsx
      vendor_name:
        formData.attributes?.vendor_name ||
        formData.attributes?.Name ||
        formData.attributes?.businessName ||
        "",
      vendor_type: formData.vendorTypeName || vendorTypeName || "",
      veg_price: formData.veg_price || "",
      non_veg_price: formData.non_veg_price || "",
      photo_package_price: formData.photo_package_price || "",
      photo_video_package_price: formData.photo_video_package_price || "",
      happywedz_since: formData.happywedz_since || formData.HappyWedz || "",
      HappyWedz: formData.HappyWedz || formData.happywedz_since || "",
      travel_info: formData.travel_info || "",
      offerings: formData.offerings || "",
      delivery_time: formData.delivery_time || "",
      decor_policy: formData.decorPolicy || "",
      area: formData.area || "",
      // Social links
      facebook_link: formData.attributes?.facebook_link || "",
      instagram_link: formData.attributes?.instagram_link || "",
      twitter_link: formData.attributes?.twitter_link || "",
      pinterest_link: formData.attributes?.pinterest_link || "",
      // Always include menus if present in attributes
      ...(Array.isArray(formData.attributes?.menus)
        ? { menus: formData.attributes.menus }
        : {}),

      video: Array.isArray(videoDrafts)
        ? videoDrafts
            .map((v) => v.url || v.preview || "")
            .filter(
              (url) =>
                url &&
                typeof url === "string" &&
                !url.startsWith("blob:") &&
                !url.startsWith("data:")
            )
            .map((url) =>
              url.startsWith("/uploads/") ? IMAGE_BASE_URL + url : url
            )
        : formData.attributes?.video || [],
      // Preferred vendors selection
      preferred_vendors:
        formData.attributes?.preferred_vendors ||
        formData.preferredVendors ||
        formData.preferred_vendor_ids ||
        [],
    };

    // Remove undefined keys
    Object.keys(attrs).forEach(
      (k) => attrs[k] === undefined && delete attrs[k]
    );
    return attrs;
  };

  const buildMedia = () => {
    const gallery = Array.isArray(photoDrafts)
      ? photoDrafts
          .map((p) => {
            const preview = p.preview || p.url || p.path || "";
            return preview || null;
          })
          .filter(Boolean)
      : Array.isArray(formData.media?.gallery)
      ? formData.media.gallery
          .map((g) => (typeof g === "string" ? g : g.url || g.path || null))
          .filter(Boolean)
      : Array.isArray(formData.gallery)
      ? formData.gallery.filter((g) => typeof g === "string")
      : [];
    const media = {
      gallery,
      coverImage: formData.media?.coverImage || formData.coverImage || "",
    };

    return media;
  };

  // Build a flat media array (strings) suitable for sending as `media: [...]`
  const buildMediaArray = () => {
    const m = buildMedia();
    const normalizeUrl = (u) => {
      if (!u || typeof u !== "string") return null;
      // ignore local blob/object URLs (these are client-side previews and should not be sent)
      if (u.startsWith("blob:") || u.startsWith("data:")) return null;
      // prefix relative uploads
      if (u.startsWith("/uploads/")) return IMAGE_BASE_URL + u;
      return u;
    };

    const gallery = Array.isArray(m.gallery)
      ? m.gallery.map(normalizeUrl).filter(Boolean)
      : [];

    // Only include gallery images in the flat media array. Videos are sent under attributes.video
    return gallery;
  };

  const buildFormData = () => {
    const fd = new FormData();
    const vendorId = vendor?.id || formData.vendor_id;
    if (vendorId) fd.append("vendor_id", `${vendorId}`);
    if (formData.vendor_subcategory_id)
      fd.append("vendor_subcategory_id", `${formData.vendor_subcategory_id}`);
    if (formData.status) fd.append("status", formData.status);

    const attrs = buildAttributes();
    // Ensure attributes do not accidentally include a media key
    if (attrs && Object.prototype.hasOwnProperty.call(attrs, "media")) {
      delete attrs.media;
    }

    const mediaArray = buildMediaArray();
    // Ensure mediaArray is a plain array of strings (no blob/data URLs or objects)
    const safeMedia = Array.isArray(mediaArray)
      ? mediaArray.filter((u) => typeof u === "string" && u.trim())
      : [];

    fd.append("attributes", JSON.stringify(attrs));
    // Send `media` as a flat array of URL strings as requested by the frontend contract
    fd.append("media", JSON.stringify(safeMedia));

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
        // Normalize created.media into an array of URLs
        let normalized = [];
        if (Array.isArray(created.media)) {
          normalized = created.media.filter((x) => typeof x === "string");
        } else if (
          created.media.gallery &&
          Array.isArray(created.media.gallery)
        ) {
          normalized = created.media.gallery.map((g) =>
            typeof g === "string" ? g : g.url || g.path || null
          );
          // also include videos returned under created.media.videos if any
          if (created.media.videos && Array.isArray(created.media.videos)) {
            normalized.push(
              ...created.media.videos.map((v) =>
                typeof v === "string" ? v : v.url || v.path || null
              )
            );
          }
          normalized = normalized.filter(Boolean);
        } else if (created.media && typeof created.media === "object") {
          // fallback: try to extract any string URLs from the object
          const vals = Object.values(created.media).flat();
          normalized = vals.filter((v) => typeof v === "string");
        }

        // Hydrate previews for photos and videos from normalized array (strings)
        if (normalized.length) {
          setPhotoDrafts((prev) =>
            prev.map((p, i) => ({
              ...p,
              preview: normalized[i] || p.preview,
              file: null,
            }))
          );
          setVideoDrafts((prev) =>
            prev.map((v, i) => ({
              ...v,
              preview: normalized[prev.length + i] || v.preview,
              file: null,
            }))
          );
        }
      }
      setShowModal(true);
    } catch (e) {
      // alert(
      //   `Failed to submit. ${
      //     typeof e === "string" ? e : e?.message || "Unknown error"
      //   }`
      // );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to submit. ${
          typeof e === "string" ? e : e?.message || "Unknown error"
        }`,
        timer: "3000",
        confirmButtonText: "OK",
        confirmButtonColor: "#C31162",
      });
    }
  };

  // Only show Menus sidebar for vendorTypeName 'Venues' or 'Caterers' (case-insensitive)
  const allowedMenuTypes = React.useMemo(() => ["venues", "caterers"], []);
  const normalizedVendorTypeName = (vendorTypeName || "").trim().toLowerCase();

  // Calculate completion percentage
  const calculateCompletion = useCallback(() => {
    const sections = [
      { id: "business", fields: ["attributes.Name", "attributes.about_us"] },
      {
        id: "vendor-basic",
        fields: ["attributes.vendor_name", "attributes.tagline"],
      },
      // FAQ handled specially below
      { id: "faq", fields: [] },
      {
        id: "vendor-contact",
        fields: ["contact.contactName", "contact.phone", "contact.email"],
      },
      {
        id: "vendor-location",
        fields: ["location.city", "location.state", "location.addressLine1"],
      },
      { id: "photos", fields: ["photoDrafts"] },
      { id: "videos", fields: ["videoDrafts"] },
      {
        id: "vendor-pricing",
        fields: ["startingPrice", "priceRange.min", "priceRange.max"],
      },
      { id: "vendor-facilities", fields: ["capacity.min", "capacity.max"] },
      { id: "promotions", fields: ["deals"] },
      {
        id: "vendor-policies",
        fields: ["tnc", "cancellationPolicy", "refundPolicy"],
      },
      // { id: "vendor-availability", fields: ["timing.open", "timing.close"] },
      { id: "vendor-availability", fields: ["attributes.available_slots"] },
      { id: "vendor-marketing", fields: ["primaryCTA"] },
    ];

    if (allowedMenuTypes.includes(normalizedVendorTypeName)) {
      sections.push({ id: "vendor-menus", fields: ["attributes.menus"] });
    }

    let completed = 0;
    sections.forEach((section) => {
      let hasData = false;
      if (section.id === "faq") {
        // Count FAQ completed only if at least one non-empty answer exists
        const faqs = formData?.faqs;
        if (faqs && typeof faqs === "object") {
          hasData = Object.values(faqs).some((ans) => {
            if (ans == null) return false;
            if (Array.isArray(ans)) return ans.filter(Boolean).length > 0;
            if (typeof ans === "object") return Object.keys(ans).length > 0;
            const s = String(ans).trim();
            return s.length > 0;
          });
        }
      } else {
        hasData = section.fields.some((field) => {
          if (field === "photoDrafts") return photoDrafts.length > 0;
          if (field === "videoDrafts") return videoDrafts.length > 0;
          const keys = field.split(".");
          let value = formData;
          for (const key of keys) {
            value = value?.[key];
          }
          return value && value !== "" && value !== null && value !== undefined;
        });
      }
      if (hasData) completed++;
    });

    const percentage = Math.round((completed / sections.length) * 100);
    return percentage;
  }, [
    formData,
    photoDrafts,
    videoDrafts,
    normalizedVendorTypeName,
    allowedMenuTypes,
  ]);

  useEffect(() => {
    const percentage = calculateCompletion();
    if (setCompletion) setCompletion(percentage);
    // Also save to localStorage so it persists across navigation
    localStorage.setItem("storefrontCompletion", percentage.toString());

    // Send completion percentage to backend API
    const sendCompletionToBackend = async () => {
      if (!formData.id || !token) return;
      try {
        const response = await fetch(
          `https://happywedz.com/api/vendor-services/${formData.id}/storefront-completion`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ completion: percentage }),
          }
        );
        if (!response.ok) {
          console.warn("Failed to update storefront completion on backend");
        }
      } catch (error) {
        console.error("Error sending storefront completion to backend:", error);
      }
    };

    sendCompletionToBackend();
  }, [calculateCompletion, setCompletion, formData.id, token]);

  // Helper to set active tab and persist selection
  const handleSetActive = useCallback(
    (id) => {
      setActive(id);
      try {
        localStorage.setItem(storageKey, id);
      } catch (_) {}
    },
    [storageKey]
  );

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
      id: "preferred-vendors",
      label: "Preferred Vendors",
      icon: <IoCheckmarkCircleOutline size={20} />,
    },
    {
      id: "social",
      label: "Social Network",
      icon: <PiShareNetworkDuotone size={20} />,
    },

    {
      id: "vendor-facilities",
      label: "Facilities & Features",
      icon: <IoCheckmarkCircleOutline size={20} />,
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

    // {
    //   id: "social",
    //   label: "Social Media",
    //   icon: <FaShareAlt size={20} />,
    // },

    // {
    //   id: "vendor-marketing",
    //   label: "Marketing & CTA",
    //   icon: <GoGift size={20} />,
    // },
    {
      id: "vendor-pricing",
      label: "Pricing & Packages",
      icon: <MdCurrencyRupee size={20} />,
    },
  ];

  // Restore stored active tab once menu items are known/updated
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      const ids = new Set(menuItems.map((m) => m.id));
      if (stored && ids.has(stored)) {
        if (active !== stored) setActive(stored);
      } else if (!ids.has(active)) {
        setActive("business");
      }
    } catch (_) {
      if (active !== "business") setActive("business");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, normalizedVendorTypeName]);

  const renderContent = () => {
    switch (active) {
      case "business":
        return (
          <BusinessDetails
            formData={formData}
            setFormData={setFormData}
            onShowSuccess={showSuccessModal}
            onSaveSuccess={fetchServiceData}
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
            onSave={(media) => {
              const drafts = (media || []).map((m) => {
                if (m instanceof File) {
                  return {
                    file: m,
                    preview: URL.createObjectURL(m),
                  };
                }
                if (typeof m === "string") {
                  let preview = m;
                  if (preview.startsWith("/uploads/"))
                    preview = IMAGE_BASE_URL + preview;
                  return { preview, file: null };
                }
                return {
                  preview: m.preview || m.url || "",
                  file: m.file || null,
                };
              });
              setPhotoDrafts(drafts.filter((d) => d.preview));
            }}
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
            onSubmit={handleSubmit}
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
      case "social":
        return (
          <SocialDetails
            formData={formData}
            setFormData={setFormData}
            onSave={handleSave}
            onShowSuccess={showSuccessModal}
          />
        );
      case "preferred-vendors":
        return (
          <PreferredVendors
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
      // case "social":
      //   return (
      //     <SocialDetails
      //       formData={formData}
      //       setFormData={setFormData}
      //       onSave={handleSave}
      //       onShowSuccess={showSuccessModal}
      //     />
      //   );
      // case "vendor-marketing":
      //   return (
      //     <VendorMarketing
      //       formData={formData}
      //       setFormData={setFormData}
      //       onSave={handleSave}
      //       onShowSuccess={showSuccessModal}
      //       onSubmit={handleSubmit}
      //     />
      //   );
      default:
        return (
          <div className="p-3 border rounded bg-white">
            <p>Content for {active}</p>
          </div>
        );
    }
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="container py-3 store-front-navbar">
      <div className="row">
        <div className="col-md-3 border-end">
          <Nav className="flex-column custom-sidebar">
            {menuItems.map((item) => (
              <Nav.Link
                key={item.id}
                onClick={() => handleSetActive(item.id)}
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
