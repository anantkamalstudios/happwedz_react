// import { useState, useEffect, useCallback } from "react";

// const useApiData = (section, slug, city = null, vendorType = null) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     if (!section || (!slug && !vendorType)) {
//       setData([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const subCategory = slug
//         ? slug
//             .replace(/-{2,}/g, " / ")
//             .replace(/-/g, " ")
//             .replace(/\s*\/\s*/g, " / ")
//             .replace(/\s{2,}/g, " ")
//             .replace(/\b\w/g, (l) => l.toUpperCase())
//             .trim()
//         : null;

//       const params = new URLSearchParams();
//       if (vendorType) {
//         params.append("vendorType", vendorType);
//       }
//       if (city && city !== "all") {
//         params.append("city", city);
//       }

//       if (!vendorType && subCategory && subCategory.toLowerCase() !== "all") {
//         params.append("subCategory", subCategory);
//       }

//       const apiUrl = `https://happywedz.com/api/vendor-services?${params.toString()}`;
//       if (subCategory) {
//       }
//       console.log("[useApiData] Fetching:", apiUrl);
//       const response = await fetch(apiUrl);
//       // console.log("res", response);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       // console.log("result", result);
//       const items = Array.isArray(result) ? result : [];
//       const transformed = transformApiData(items);
//       console.log("items", items);
//       console.log("trans", transformed);

//       setData(transformed);
//     } catch (err) {
//       console.error(`❌ Error loading ${section} data:`, err);
//       setError(`Failed to load ${section} data from API: ${err.message}`);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [section, slug, city, vendorType]);

//   const refetch = useCallback(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch };
// };

// import { IMAGE_BASE_URL } from "../config/constants";

// // const transformApiData = (items) => {
// //   return items.map((item) => {
// //     const id = item.id;
// //     const media = item.media || {};
// //     const vendor = item.vendor || {};
// //     const attributes = item.attributes || {};
// //     const location = item.location || {};

// //     const rawGallery = media.gallery || item.gallery || [];
// //     const galleryPaths = rawGallery.filter((img) => typeof img === "string");
// //     const firstImage = media.coverImage
// //       ? IMAGE_BASE_URL + media.coverImage
// //       : galleryPaths.length > 0
// //       ? IMAGE_BASE_URL + galleryPaths[0]
// //       : null;

// //     return {
// //       id,

// //       // Names & titles
// //       name: item.name || vendor.businessName || "Unknown Vendor",
// //       subtitle: item.subtitle || attributes.subtitle || "",
// //       tagline: item.tagline || attributes.tagline || "",
// //       description: item.description || attributes.description || "",
// //       slug: item.slug || attributes.slug || "",

// //       // Media
// //       image: firstImage,
// //       gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),
// //       videos: media.videos || [],

// //       // Pricing
// //       price: attributes.price_range
// //         ? `${attributes.price_range.min} - ${attributes.price_range.max}`
// //         : attributes.price || item.price || 0,
// //       price_range: attributes.price_range || item.price_range || null,
// //       price_unit: attributes.price_unit || item.price_unit || null,
// //       starting_price: attributes.starting_price || item.starting_price || null,

// //       // Location
// //       location: `${location.city || vendor.city || ""}${
// //         location.state ? ", " + location.state : ""
// //       }`,

// //       // Ratings
// //       rating: attributes.rating || item.rating || 0,
// //       reviews: attributes.reviews || item.reviews || 0,
// //       within_24hr_available:
// //         attributes.within_24hr_available || item.within_24hr_available || false,

// //       // Capacity
// //       capacity:
// //         attributes.capacity_min || attributes.capacity_max
// //           ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
// //           : null,

// //       // Contact
// //       call: vendor.phone || attributes.contact?.phone || item.cta_phone || null,
// //       whatsapp:
// //         vendor.whatsapp ||
// //         attributes.contact?.whatsapp ||
// //         item.contact?.whatsapp ||
// //         null,
// //       website:
// //         vendor.website ||
// //         attributes.contact?.website ||
// //         item.contact?.website ||
// //         null,

// //       // Policies
// //       alcohol_policy: attributes.alcohol_policy || item.alcohol_policy || null,
// //       catering_policy:
// //         attributes.catering_policy || item.catering_policy || null,
// //       deco_policy: attributes.deco_policy || item.deco_policy || null,
// //       dj_policy: attributes.dj_policy || item.dj_policy || null,
// //       cancellation_policy:
// //         attributes.cancellation_policy || item.cancellation_policy || "",
// //       refund_policy: attributes.refund_policy || item.refund_policy || "",
// //       tnc: attributes.tnc || item.tnc || "",
// //       payment_terms: attributes.payment_terms ||
// //         item.payment_terms || { advance: null },

// //       // Facilities
// //       car_parking: attributes.car_parking || item.car_parking || null,
// //       rooms: attributes.rooms || item.rooms || null,

// //       // Flags
// //       is_featured: attributes.is_featured || item.is_featured || false,
// //       is_feature_available:
// //         attributes.is_feature_available || item.is_feature_available || false,

// //       // Deals
// //       deals: item.deals || attributes.deals || [],

// //       // Timings
// //       timings: {
// //         open: attributes.timing_open || item.timing_open || null,
// //         close: attributes.timing_close || item.timing_close || null,
// //         last_entry:
// //           attributes.timing_last_entry || item.timing_last_entry || null,
// //       },
// //     };
// //   });
// // };

// const transformApiData = (items) => {
//   return items.map((item) => {
//     const id = item.id;
//     const media = item.media || {};
//     const vendor = item.vendor || {};
//     const attributes = item.attributes || {};
//     const location = item.location || {};

//     const rawGallery = media.gallery || item.gallery || [];
//     const galleryPaths = rawGallery.filter((img) => typeof img === "string");
//     const firstImage = media.coverImage
//       ? IMAGE_BASE_URL + media.coverImage
//       : galleryPaths.length > 0
//       ? IMAGE_BASE_URL + galleryPaths[0]
//       : null;

//     return {
//       id,

//       // Names & titles
//       name: item.name || vendor.businessName || "Unknown Vendor",
//       subtitle: item.subtitle || attributes.subtitle || "",
//       tagline: item.tagline || attributes.tagline || "",
//       description:
//         item.description || attributes.description || attributes.about_us || "",
//       slug: item.slug || attributes.slug || "",

//       // Media
//       image: firstImage,
//       gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),
//       videos: media.videos || [],

//       // Pricing
//       price: attributes.price_range
//         ? `${attributes.price_range.min} - ${attributes.price_range.max}`
//         : attributes.price ||
//           item.price ||
//           attributes.veg_price ||
//           attributes.non_veg_price ||
//           0,
//       price_range: attributes.price_range || item.price_range || null,
//       price_unit: attributes.price_unit || item.price_unit || null,
//       starting_price: attributes.starting_price || item.starting_price || null,
//       veg_price: attributes.veg_price || item.veg_price || null,
//       non_veg_price: attributes.non_veg_price || item.non_veg_price || null,

//       // Location
//       address: attributes.address || item.address || "",
//       area: attributes.area || item.area || "",
//       city: location.city || attributes.city || vendor.city || item.city || "",
//       location: `${location.city || vendor.city || ""}${
//         location.state ? ", " + location.state : ""
//       }`,

//       // Ratings
//       rating: attributes.rating || item.rating || 0,
//       review_count: attributes.review_count || item.review_count || 0,
//       reviews: attributes.reviews || item.reviews || 0,
//       within_24hr_available:
//         attributes.within_24hr_available || item.within_24hr_available || false,

//       // Capacity
//       capacity:
//         attributes.capacity_min || attributes.capacity_max
//           ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
//           : attributes.area || null,

//       // Contact
//       call: vendor.phone || attributes.contact?.phone || item.cta_phone || null,
//       whatsapp:
//         vendor.whatsapp ||
//         attributes.contact?.whatsapp ||
//         item.contact?.whatsapp ||
//         null,
//       website:
//         vendor.website ||
//         attributes.contact?.website ||
//         item.contact?.website ||
//         attributes.url ||
//         item.url ||
//         null,

//       // Policies
//       alcohol_policy: attributes.alcohol_policy || item.alcohol_policy || null,
//       catering_policy:
//         attributes.catering_policy || item.catering_policy || null,
//       decor_policy:
//         attributes.decor_policy ||
//         item.decor_policy ||
//         attributes.deco_policy ||
//         item.deco_policy ||
//         null,
//       dj_policy: attributes.dj_policy || item.dj_policy || null,
//       cancellation_policy:
//         attributes.cancellation_policy || item.cancellation_policy || "",
//       refund_policy: attributes.refund_policy || item.refund_policy || "",
//       tnc: attributes.tnc || item.tnc || "",
//       payment_terms: attributes.payment_terms ||
//         item.payment_terms || { advance: null },

//       // Facilities
//       car_parking: attributes.car_parking || item.car_parking || null,
//       rooms: attributes.rooms || item.rooms || null,

//       // Flags
//       is_featured: attributes.is_featured || item.is_featured || false,
//       is_feature_available:
//         attributes.is_feature_available || item.is_feature_available || false,

//       // Deals
//       deals: item.deals || attributes.deals || [],

//       // Timings
//       timings: {
//         open: attributes.timing_open || item.timing_open || null,
//         close: attributes.timing_close || item.timing_close || null,
//         last_entry:
//           attributes.timing_last_entry || item.timing_last_entry || null,
//       },

//       // Extra metadata (NEW FIELDS)
//       about_us: attributes.about_us || item.about_us || "",
//       imported_at: item.imported_at || attributes.imported_at || null,
//       vendor_name:
//         attributes.vendor_name || vendor.businessName || item.vendor_name || "",
//       url: attributes.url || item.url || null,
//     };
//   });
// };

// export default useApiData;

// import { useState, useEffect, useCallback } from "react";

// const IMAGE_BASE_URL = "https://your.image.base.url/";

// const useApiData = (section, slug, city = null, vendorType = null) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async () => {
//     if (!section || (!slug && !vendorType)) {
//       setData([]);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const subCategory = slug
//         ? slug
//             .replace(/-{2,}/g, " / ")
//             .replace(/-/g, " ")
//             .replace(/\s*\/\s*/g, " / ")
//             .replace(/\s{2,}/g, " ")
//             .replace(/\b\w/g, (l) => l.toUpperCase())
//             .trim()
//         : null;

//       const params = new URLSearchParams();
//       if (vendorType) {
//         params.append("vendorType", vendorType);
//       }
//       if (city && city !== "all") {
//         params.append("city", city);
//       }

//       if (!vendorType && subCategory && subCategory.toLowerCase() !== "all") {
//         params.append("subCategory", subCategory);
//       }

//       const apiUrl = `https://happywedz.com/api/vendor-services?${params.toString()}`;
//       if (subCategory) {
//       }
//       console.log("[useApiData] Fetching:", apiUrl);
//       const response = await fetch(apiUrl);
//       // console.log("res", response);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       // console.log("result", result);
//       const items = Array.isArray(result) ? result : [];
//       const transformed = transformApiData(items);
//       console.log("items", items);
//       console.log("trans", transformed);

//       setData(transformed);
//     } catch (err) {
//       console.error(`❌ Error loading ${section} data:`, err);
//       setError(`Failed to load ${section} data from API: ${err.message}`);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [section, slug, city, vendorType]);

//   const refetch = useCallback(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch };
// };

// // Assuming this is defined or imported in the actual file
// // const IMAGE_BASE_URL = "https://your.image.base.url/";

// const transformApiData = (items) => {
//   return items.map((item) => {
//     const id = item.id;
//     const media = item.media || {};
//     const vendor = item.vendor || {};
//     const attributes = item.attributes || {};
//     const location = item.location || {};

//     const rawGallery = media.gallery || item.gallery || [];
//     const galleryPaths = rawGallery.filter((img) => typeof img === "string");
//     const firstImage = media.coverImage
//       ? IMAGE_BASE_URL + media.coverImage
//       : galleryPaths.length > 0
//       ? IMAGE_BASE_URL + galleryPaths[0]
//       : null;

//     // --- Price Transformation Correction ---
//     // Extract potential prices using multiple keys including the Photographer ones
//     const basePrice = attributes.price || item.price || 0;

//     const vegPriceValue =
//       attributes.veg_price ||
//       item.veg_price ||
//       attributes.PhotoPackage || // From your sample data
//       attributes.photo_package_price || // From your sample data
//       basePrice;

//     const nonVegPriceValue =
//       attributes.non_veg_price ||
//       item.non_veg_price ||
//       attributes.Photo_video || // From your sample data
//       attributes.photo_video_package_price || // From your sample data
//       basePrice;
//     // ---------------------------------------

//     return {
//       id,

//       // Names & titles
//       name: item.name || vendor.businessName || "Unknown Vendor",
//       subtitle: item.subtitle || attributes.subtitle || "",
//       tagline: item.tagline || attributes.tagline || "",
//       description:
//         item.description || attributes.description || attributes.about_us || "",
//       slug: item.slug || attributes.slug || "",

//       // Media
//       image: firstImage,
//       gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),
//       videos: media.videos || [],

//       // Pricing
//       price: attributes.price_range
//         ? `${attributes.price_range.min} - ${attributes.price_range.max}`
//         : basePrice,
//       price_range: attributes.price_range || item.price_range || null,
//       price_unit: attributes.price_unit || item.price_unit || null,
//       starting_price: attributes.starting_price || item.starting_price || null,

//       // FIX: Changed from snake_case (veg_price) to camelCase (vegPrice)
//       // to match GridView.js usage.
//       vegPrice: vegPriceValue,
//       nonVegPrice: nonVegPriceValue,

//       // Location
//       address: attributes.address || item.address || "",
//       area: attributes.area || item.area || "",
//       city: location.city || attributes.city || vendor.city || item.city || "",
//       location: `${location.city || vendor.city || ""}${
//         location.state ? ", " + location.state : ""
//       }`,

//       // Ratings
//       rating: attributes.rating || item.rating || 0,
//       review_count: attributes.review_count || item.review_count || 0,
//       reviews: attributes.reviews || item.reviews || 0,
//       within_24hr_available:
//         attributes.within_24hr_available || item.within_24hr_available || false,

//       // Capacity
//       capacity:
//         attributes.capacity_min || attributes.capacity_max
//           ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
//           : attributes.area || null,

//       // Contact
//       call: vendor.phone || attributes.contact?.phone || item.cta_phone || null,
//       whatsapp:
//         vendor.whatsapp ||
//         attributes.contact?.whatsapp ||
//         item.contact?.whatsapp ||
//         null,
//       website:
//         vendor.website ||
//         attributes.contact?.website ||
//         item.contact?.website ||
//         attributes.url ||
//         item.url ||
//         null,

//       // Policies
//       alcohol_policy: attributes.alcohol_policy || item.alcohol_policy || null,
//       catering_policy:
//         attributes.catering_policy || item.catering_policy || null,
//       decor_policy:
//         attributes.decor_policy ||
//         item.decor_policy ||
//         attributes.deco_policy ||
//         item.deco_policy ||
//         null,
//       dj_policy: attributes.dj_policy || item.dj_policy || null,
//       cancellation_policy:
//         attributes.cancellation_policy || item.cancellation_policy || "",
//       refund_policy: attributes.refund_policy || item.refund_policy || "",
//       tnc: attributes.tnc || item.tnc || "",
//       payment_terms: attributes.payment_terms ||
//         item.payment_terms || { advance: null },

//       // Facilities
//       car_parking: attributes.car_parking || item.car_parking || null,
//       rooms: attributes.rooms || item.rooms || null,

//       // Flags
//       is_featured: attributes.is_featured || item.is_featured || false,
//       is_feature_available:
//         attributes.is_feature_available || item.is_feature_available || false,

//       // Deals
//       deals: item.deals || attributes.deals || [],

//       // Timings
//       timings: {
//         open: attributes.timing_open || item.timing_open || null,
//         close: attributes.timing_close || item.timing_close || null,
//         last_entry:
//           attributes.timing_last_entry || item.timing_last_entry || null,
//       },

//       // Extra metadata (NEW FIELDS)
//       about_us: attributes.about_us || item.about_us || "",
//       imported_at: item.imported_at || attributes.imported_at || null,
//       vendor_name:
//         attributes.vendor_name || vendor.businessName || item.vendor_name || "",
//       url: attributes.url || item.url || null,
//     };
//   });
// };

// export default useApiData;

import { useState, useEffect, useCallback } from "react";

// ⚠️ NOTE: You must define or import IMAGE_BASE_URL from a config file.
const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";
// Replace the above line with your actual import or definition:
// import { IMAGE_BASE_URL } from "../config/constants";

const useApiData = (section, slug, city = null, vendorType = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!section || (!slug && !vendorType)) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subCategory = slug
        ? slug
            .replace(/-{2,}/g, " / ")
            .replace(/-/g, " ")
            .replace(/\s*\/\s*/g, " / ")
            .replace(/\s{2,}/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .trim()
        : null;

      const params = new URLSearchParams();
      if (vendorType) {
        params.append("vendorType", vendorType);
      }
      if (city && city !== "all") {
        params.append("city", city);
      }

      if (!vendorType && subCategory && subCategory.toLowerCase() !== "all") {
        params.append("subCategory", subCategory);
      }

      const apiUrl = `https://happywedz.com/api/vendor-services?${params.toString()}`;
      if (subCategory) {
      }
      console.log("[useApiData] Fetching:", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const items = Array.isArray(result) ? result : [];
      const transformed = transformApiData(items);

      setData(transformed);
    } catch (err) {
      console.error(`❌ Error loading ${section} data:`, err);
      setError(`Failed to load ${section} data from API: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [section, slug, city, vendorType]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

const transformApiData = (items) => {
  return items.map((item) => {
    const id = item.id;
    const media = item.media || {};
    const vendor = item.vendor || {};
    const attributes = item.attributes || {};
    const location = item.location || {};

    const rawGallery = media.gallery || item.gallery || [];
    const galleryPaths = rawGallery.filter((img) => typeof img === "string");
    const firstImage = media.coverImage
      ? IMAGE_BASE_URL + media.coverImage
      : galleryPaths.length > 0
      ? IMAGE_BASE_URL + galleryPaths[0]
      : null;

    // --- Price Transformation Correction for veg/non-veg/photographer packages ---
    const basePrice = attributes.price || item.price || 0;

    const vegPriceValue =
      attributes.veg_price ||
      item.veg_price ||
      attributes.PhotoPackage || // Photographer key fallback
      attributes.photo_package_price ||
      basePrice;

    const nonVegPriceValue =
      attributes.non_veg_price ||
      item.non_veg_price ||
      attributes.Photo_video || // Photographer key fallback
      attributes.photo_video_package_price ||
      basePrice;
    // -----------------------------------------------------------------------------

    return {
      id,

      // Names & titles
      name: item.name || vendor.businessName || "Unknown Vendor",
      subtitle: item.subtitle || attributes.subtitle || "",
      tagline: item.tagline || attributes.tagline || "",
      description:
        item.description || attributes.description || attributes.about_us || "",
      slug: item.slug || attributes.slug || "",

      // Media
      image: firstImage,
      gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),
      videos: media.videos || [],

      // Pricing
      price: attributes.price_range
        ? `${attributes.price_range.min} - ${attributes.price_range.max}`
        : basePrice,
      price_range: attributes.price_range || item.price_range || null,
      price_unit: attributes.price_unit || item.price_unit || null,
      starting_price: attributes.starting_price || item.starting_price || null,

      // Keys matching GridView.js (camelCase)
      vegPrice: vegPriceValue,
      nonVegPrice: nonVegPriceValue,

      // Location
      address: attributes.address || item.address || "",
      area: attributes.area || item.area || "",
      city: location.city || attributes.city || vendor.city || item.city || "",
      location: `${location.city || vendor.city || ""}${
        location.state ? ", " + location.state : ""
      }`,

      // Ratings
      rating: attributes.rating || item.rating || 0,
      review_count: attributes.review_count || item.review_count || 0,
      reviews: attributes.reviews || item.reviews || 0,
      within_24hr_available:
        attributes.within_24hr_available || item.within_24hr_available || false,

      // Capacity
      capacity:
        attributes.capacity_min || attributes.capacity_max
          ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
          : attributes.area || null,

      // Facilities
      car_parking: attributes.car_parking || item.car_parking || null,
      // 🔑 Crucial field for the GridView component's conditional logic
      rooms: attributes.rooms || item.rooms || null,

      // Contact
      call: vendor.phone || attributes.contact?.phone || item.cta_phone || null,
      whatsapp:
        vendor.whatsapp ||
        attributes.contact?.whatsapp ||
        item.contact?.whatsapp ||
        null,
      website:
        vendor.website ||
        attributes.contact?.website ||
        item.contact?.website ||
        attributes.url ||
        item.url ||
        null,

      // Policies
      alcohol_policy: attributes.alcohol_policy || item.alcohol_policy || null,
      catering_policy:
        attributes.catering_policy || item.catering_policy || null,
      decor_policy:
        attributes.decor_policy ||
        item.decor_policy ||
        attributes.deco_policy ||
        item.deco_policy ||
        null,
      dj_policy: attributes.dj_policy || item.dj_policy || null,
      cancellation_policy:
        attributes.cancellation_policy || item.cancellation_policy || "",
      refund_policy: attributes.refund_policy || item.refund_policy || "",
      tnc: attributes.tnc || item.tnc || "",
      payment_terms: attributes.payment_terms ||
        item.payment_terms || { advance: null },

      // Flags
      is_featured: attributes.is_featured || item.is_featured || false,
      is_feature_available:
        attributes.is_feature_available || item.is_feature_available || false,

      // Deals
      deals: item.deals || attributes.deals || [],

      // Timings
      timings: {
        open: attributes.timing_open || item.timing_open || null,
        close: attributes.timing_close || item.timing_close || null,
        last_entry:
          attributes.timing_last_entry || item.timing_last_entry || null,
      },

      // Extra metadata
      about_us: attributes.about_us || item.about_us || "",
      imported_at: item.imported_at || attributes.imported_at || null,
      vendor_name:
        attributes.vendor_name || vendor.businessName || item.vendor_name || "",
      url: attributes.url || item.url || null,
    };
  });
};

export default useApiData;
