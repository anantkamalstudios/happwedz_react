// import { useState, useEffect } from "react";
// import axios from "axios";
// import { IMAGE_BASE_URL } from "../config/constants";

// const API_URL = import.meta.env.VITE_API_URL;

// export const useHome = () => {
//   const [heroData, setHeroData] = useState(null);
//   const [vendorCategories, setVendorCategories] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [loadingHero, setLoadingHero] = useState(true);
//   const [loadingCities, setLoadingCities] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const fetchHeroData = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/home-hero-section`);
//         if (res.data?.success) setHeroData(res.data.data);
//       } catch {
//         setHeroData(null);
//       } finally {
//         setLoadingHero(false);
//       }
//     };

//     const fetchVendorCategories = async () => {
//       try {
//         const res = await axios.get(
//           `${API_URL}/vendor-types/with-subcategories/all`
//         );
//         setVendorCategories(Array.isArray(res.data) ? res.data : []);
//       } catch {
//         setVendorCategories([]);
//       }
//     };

//     const fetchCities = async () => {
//       setLoadingCities(true);
//       try {
//         const res = await axios.post(
//           "https://countriesnow.space/api/v0.1/countries/cities",
//           { country: "India" }
//         );
//         const data = res.data?.data?.sort((a, b) => a.localeCompare(b)) || [];
//         setCities(data);
//       } catch {
//         setCities(["Pune"]);
//       } finally {
//         setLoadingCities(false);
//       }
//     };

//     fetchHeroData();
//     fetchVendorCategories();
//     fetchCities();
//   }, []);

//   useEffect(() => {
//     if (heroData?.carousel_images?.length) {
//       const interval = setInterval(() => {
//         setCurrentImageIndex(
//           (prev) => (prev + 1) % heroData.carousel_images.length
//         );
//       }, 3000);
//       return () => clearInterval(interval);
//     }
//   }, [heroData]);

//   const getCurrentBackgroundImage = () => {
//     if (heroData?.carousel_images?.length)
//       return `${IMAGE_BASE_URL}${heroData.carousel_images[currentImageIndex]}`;
//     return null;
//   };

//   return {
//     heroData,
//     vendorCategories,
//     cities,
//     loadingHero,
//     loadingCities,
//     getCurrentBackgroundImage,
//   };
// };


import { useState, useEffect } from "react";
import axios from "axios";
import { IMAGE_BASE_URL } from "../config/constants";
import { dedupeRequest } from "../services/api/dedupeApi";

const API_URL = import.meta.env.VITE_API_URL;

// ⚡ Fallback Cities if API fails
const FALLBACK_CITIES = [
  "Delhi NCR",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Pune",
  "Lucknow",
  "Jaipur",
  "Kolkata",
  "Hyderabad",
];

const HERO_CACHE_KEY = "cached_hero_data";
const HERO_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const useHome = () => {
  const [heroData, setHeroData] = useState(() => {
    try {
      const cachedRaw = localStorage.getItem(HERO_CACHE_KEY);
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (parsed && Date.now() - parsed.timestamp < HERO_CACHE_TTL) {
          return parsed.data;
        }
      }
    } catch {}
    return null;
  });
  const [vendorCategories, setVendorCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingHero, setLoadingHero] = useState(!heroData);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await dedupeRequest(`${API_URL}/home-hero-section`);
        if (res.data?.success && res.data.data) {
          const freshData = {
            carousel_images: res.data.data.carousel_images,
            title: res.data.data.title,
            subtitle: res.data.data.subtitle,
            typewriter_words: res.data.data.typewriter_words
          };
          setHeroData(freshData);
          localStorage.setItem(
            HERO_CACHE_KEY,
            JSON.stringify({
              timestamp: Date.now(),
              data: freshData,
            })
          );
        }
      } catch {
        // Fallback silently to cached values
      } finally {
        setLoadingHero(false);
      }
    };

    const fetchVendorCategories = async () => {
      try {
        const res = await dedupeRequest(`${API_URL}/vendor-types/with-subcategories/all`);
        setVendorCategories(Array.isArray(res.data) ? res.data : []);
      } catch {
        setVendorCategories([]);
      }
    };

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await dedupeRequest(
          "https://countriesnow.space/api/v0.1/countries/cities",
          "post",
          { country: "India" }
        );

        let data = Array.isArray(res.data?.data) ? res.data.data : [];
        
        if (!data.length) {
          data = FALLBACK_CITIES;
        }

        // Run sorting only if it is dynamic data
        const sortedCities = [...data].sort((a, b) => a.localeCompare(b));
        setCities(sortedCities);
      } catch (err) {
        console.error("City API failed, using fallback list", err);
        setCities(FALLBACK_CITIES);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchHeroData();
    fetchVendorCategories();
    fetchCities();
  }, []);

  useEffect(() => {
    const imgs = heroData?.carousel_images;
    // Only cycle when there is actually more than one image — a single-image
    // "carousel" was re-rendering the whole hero every 3s for no visual change.
    if (!imgs || imgs.length <= 1) return;
    const interval = setInterval(() => {
      // Don't churn the main thread (or refetch remote images) on a hidden tab.
      if (typeof document !== "undefined" && document.hidden) return;
      setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroData]);

  const getCurrentBackgroundImage = () => {
    if (heroData?.carousel_images?.length) {
      return `${IMAGE_BASE_URL}${heroData.carousel_images[currentImageIndex]}`;
    }
    return null;
  };

  return {
    heroData,
    vendorCategories,
    cities,
    loadingHero,
    loadingCities,
    getCurrentBackgroundImage,
  };
};
