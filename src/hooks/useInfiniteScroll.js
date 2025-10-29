import { useState, useEffect, useCallback, useRef } from "react";

const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";

const useInfiniteScroll = (
  section,
  slug,
  city = null,
  vendorType = null,
  initialLimit = 9,
  filters = {}
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const abortRef = useRef(null);
  const cacheRef = useRef(new Map());
  const loadedPagesRef = useRef(new Set());
  const debounceTimerRef = useRef(null);
  const filtersRef = useRef(filters);

  // Update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Transform API data
  const transformApiData = useCallback((items) => {
    return items.map((item) => {
      const id = item.id;
      const media = Array.isArray(item.media) ? item.media : [];
      const vendor = item.vendor || {};
      const subcategory = item.subcategory || {};
      const attributes = item.attributes || {};

      const portfolioUrls = attributes.Portfolio
        ? attributes.Portfolio.split("|")
            .map((url) => url.trim())
            .filter((url) => url)
        : [];
      const gallery = media.length > 0 ? media : portfolioUrls;
      const firstImage = gallery.length > 0 ? gallery[0] : null;

      const vendorTypeName =
        attributes.vendor_type ||
        vendor?.vendorType?.name ||
        subcategory?.vendorType?.name ||
        "";
      const isVenue = vendorTypeName.toLowerCase().includes("venue");

      const photoPackage =
        attributes.photo_package_price ||
        attributes.PhotoPackage_Price ||
        attributes.PhotoPackage ||
        attributes.PhotoPackage_price ||
        attributes.PhotoPackagePrice ||
        attributes.PhotoPackage_price_inr;
      const photoVideoPackage =
        attributes.photo_video_package_price ||
        attributes.Photo_video_Price ||
        attributes.Photo_video ||
        attributes.PhotoVideo_Price ||
        attributes.PhotoVideoPackage;

      const rawRooms =
        attributes.rooms ??
        attributes.Rooms ??
        attributes.room_count ??
        attributes.RoomCount ??
        attributes.NoOfRooms ??
        attributes.no_of_rooms ??
        attributes.No_Of_Rooms;
      let roomsParsed = null;
      if (rawRooms !== undefined && rawRooms !== null) {
        const onlyDigits = String(rawRooms).match(/\d+/);
        const n = onlyDigits ? parseInt(onlyDigits[0], 10) : NaN;
        roomsParsed = Number.isNaN(n) ? null : n;
      }

      return {
        id,
        name:
          attributes.vendor_name ||
          attributes.Name ||
          vendor.businessName ||
          "Unknown Vendor",
        subtitle: attributes.subtitle || "",
        tagline: attributes.tagline || "",
        description:
          attributes.about_us ||
          attributes.Aboutus ||
          attributes.description ||
          "",
        slug: attributes.slug || "",

        image: firstImage,
        gallery,
        videos: [],

        vegPrice: isVenue
          ? attributes.veg_price || attributes.VegPrice || null
          : null,
        nonVegPrice: isVenue
          ? attributes.non_veg_price || attributes.NonVegPrice || null
          : null,
        starting_price: !isVenue
          ? photoPackage ||
            photoVideoPackage ||
            attributes.PriceRange ||
            attributes.price ||
            null
          : null,

        address: attributes.address || attributes.Address || "",
        area: attributes.area || "",
        city: attributes.city || vendor.city || "",
        location: attributes.city || vendor.city || "",
        rooms: roomsParsed,

        rating: attributes.rating || 0,
        review_count:
          attributes.review_count ||
          parseInt(attributes.review?.toString?.() || "0", 10) ||
          0,
        reviews:
          attributes.review_count ||
          parseInt(attributes.review?.toString?.() || "0", 10) ||
          0,

        vendor_type: vendorTypeName,
        subcategory_name: subcategory?.name || "",

        call: attributes.Phone || vendor.phone || null,
        whatsapp: attributes.Whatsapp || null,
        website: attributes.Website || null,

        about_us: attributes.about_us || attributes.Aboutus || "",
        vendor_name:
          vendor.businessName ||
          attributes.vendor_name ||
          attributes.Name ||
          "",
        url: attributes.Website || attributes.URL || null,
      };
    });
  }, []);

  // Fetch data with caching
  const fetchData = useCallback(
    async (pageNum, limit = initialLimit) => {
      if (!section || (!slug && !vendorType)) {
        setData([]);
        setLoading(false);
        return;
      }

      // Check if page already loaded
      if (loadedPagesRef.current.has(pageNum)) {
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

        params.append("page", pageNum.toString());
        params.append("limit", limit.toString());

        if (filtersRef.current && Object.keys(filtersRef.current).length > 0) {
          params.append("filters", JSON.stringify(filtersRef.current));
        }

        const apiUrl = `https://happywedz.com/api/vendor-services?${params.toString()}`;
        const cacheKey = apiUrl;

        // Check cache first
        if (cacheRef.current.has(cacheKey)) {
          const cached = cacheRef.current.get(cacheKey);
          setData((prevData) => {
            // Avoid duplicates
            const existingIds = new Set(prevData.map((item) => item.id));
            const newItems = cached.data.filter(
              (item) => !existingIds.has(item.id)
            );
            return [...prevData, ...newItems];
          });
          setHasMore(cached.hasMore);
          loadedPagesRef.current.add(pageNum);
          setLoading(false);
          return;
        }

        // Abort any previous request
        if (abortRef.current) {
          abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const itemsRaw = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : [];

        const transformed = transformApiData(itemsRaw);

        // Determine if there are more pages
        let hasMorePages = true;
        if (result.pagination) {
          hasMorePages = result.pagination.page < result.pagination.totalPages;
        } else if (Array.isArray(result)) {
          // If no pagination info, check if we got a full page
          hasMorePages = transformed.length >= limit;
        }

        // Cache the result
        cacheRef.current.set(cacheKey, {
          data: transformed,
          hasMore: hasMorePages,
        });

        // Add to loaded pages
        loadedPagesRef.current.add(pageNum);

        // Append to existing data
        setData((prevData) => {
          // Avoid duplicates
          const existingIds = new Set(prevData.map((item) => item.id));
          const newItems = transformed.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prevData, ...newItems];
        });

        setHasMore(hasMorePages);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error(`❌ Error loading ${section} data:`, err);
        setError(`Failed to load ${section} data from API: ${err.message}`);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [section, slug, city, vendorType, initialLimit, transformApiData]
  );

  // Debounced load more function
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the API call by 300ms
    debounceTimerRef.current = setTimeout(() => {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchData(nextPage, initialLimit);
        return nextPage;
      });
    }, 300);
  }, [loading, hasMore, fetchData, initialLimit]);

  // Reset when dependencies change
  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    loadedPagesRef.current.clear();
  }, []);

  // Initial load
  useEffect(() => {
    reset();
    fetchData(1, initialLimit);
  }, [section, slug, city, vendorType, reset, fetchData, initialLimit]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};

export default useInfiniteScroll;
