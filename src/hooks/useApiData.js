import { useState, useEffect, useCallback } from "react";

const useApiData = (section, slug, city = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!section || !slug) {
      setData([]);
      setLoading(false);
      return;
    }

    if (section === "photography") {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subCategory = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const params = new URLSearchParams();
      if (city && city !== "all") {
        params.append("city", city);
      }
      if (subCategory) {
        params.append("subCategory", subCategory);
      }

      console.log(
        `Fetching ${section} data for: ${subCategory}${
          city ? ` in ${city}` : ""
        }`
      );

      const response = await fetch(
        `https://happywedz.com/api/vendor-services?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const items = Array.isArray(result) ? result : [];
      const transformed = transformApiData(items);

      setData(transformed);
      console.log(
        `✅ ${section} data loaded (${transformed.length} items):`,
        transformed
      );
    } catch (err) {
      console.error(`❌ Error loading ${section} data:`, err);
      setError(`Failed to load ${section} data from API: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [section, slug, city]);

  const refetch = useCallback(() => {
    console.log(`🔄 Refetching ${section} data...`);
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
      id: item.id,
      name: item.name || vendor.businessName || "Unknown Vendor",
      subtitle: item.subtitle || "",
      description: item.description || attributes.description || "",
      slug: item.slug || attributes.slug || "",

      image: firstImage,

      gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),

      videos: media.videos || [],

      price: attributes.price_range?.min || 0,

      location: `${location.city || vendor.city || ""}${
        location.state ? ", " + location.state : ""
      }`,

      rating: attributes.rating || 0,
      reviews: attributes.reviews || 0,
      within_24hr_available: attributes.within_24hr_available || null,

      capacity:
        attributes.capacity_min || attributes.capacity_max
          ? `${attributes.capacity_min || 0} - ${attributes.capacity_max || 0}`
          : null,

      call: vendor.phone || item.cta_phone || null,
      whatsapp: vendor.whatsapp || null,
      website: vendor.website || null,

      alcohol_policy: attributes.alcohol_policy || null,
      car_parking: attributes.car_parking || null,
      rooms: item.rooms || null,
    };
  });
};

export default useApiData;
