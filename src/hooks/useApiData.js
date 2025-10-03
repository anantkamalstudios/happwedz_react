import { useState, useEffect, useCallback } from "react";

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
        ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        : null;

      const params = new URLSearchParams();
      if (city && city !== "all") {
        params.append("city", city);
      }
      if (vendorType) {
        console.log("vendorType in UAP", vendorType);
        params.append("vendorType", vendorType);
      } else if (subCategory) {
        params.append("subCategory", subCategory);
      }

      const apiUrl = `https://happywedz.com/api/vendor-services?${params.toString()}`;
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

import { IMAGE_BASE_URL } from "../config/constants";

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

    return {
      id,

      // Names & titles
      name: item.name || vendor.businessName || "Unknown Vendor",
      subtitle: item.subtitle || attributes.subtitle || "",
      tagline: item.tagline || attributes.tagline || "",
      description: item.description || attributes.description || "",
      slug: item.slug || attributes.slug || "",

      // Media
      image: firstImage,
      gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),
      videos: media.videos || [],

      // Pricing
      price: attributes.price_range
        ? `${attributes.price_range.min} - ${attributes.price_range.max}`
        : attributes.price || item.price || 0,
      price_range: attributes.price_range || item.price_range || null,
      price_unit: attributes.price_unit || item.price_unit || null,
      starting_price: attributes.starting_price || item.starting_price || null,

      // Location
      location: `${location.city || vendor.city || ""}${
        location.state ? ", " + location.state : ""
      }`,

      // Ratings
      rating: attributes.rating || item.rating || 0,
      reviews: attributes.reviews || item.reviews || 0,
      within_24hr_available:
        attributes.within_24hr_available || item.within_24hr_available || false,

      // Capacity
      capacity:
        attributes.capacity_min || attributes.capacity_max
          ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
          : null,

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
        null,

      // Policies
      alcohol_policy: attributes.alcohol_policy || item.alcohol_policy || null,
      catering_policy:
        attributes.catering_policy || item.catering_policy || null,
      deco_policy: attributes.deco_policy || item.deco_policy || null,
      dj_policy: attributes.dj_policy || item.dj_policy || null,
      cancellation_policy:
        attributes.cancellation_policy || item.cancellation_policy || "",
      refund_policy: attributes.refund_policy || item.refund_policy || "",
      tnc: attributes.tnc || item.tnc || "",
      payment_terms: attributes.payment_terms ||
        item.payment_terms || { advance: null },

      // Facilities
      car_parking: attributes.car_parking || item.car_parking || null,
      rooms: attributes.rooms || item.rooms || null,

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
    };
  });
};

export default useApiData;
