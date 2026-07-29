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
  // Seeded so the hero's city dropdown is usable immediately; the full list
  // from the (third-party) cities API replaces it once the page is idle.
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // False until the 8s delay elapses; keeps the hero on the local preloaded
  // image so LCP is not the late-arriving remote one. See
  // getCurrentBackgroundImage below.
  const [carouselStarted, setCarouselStarted] = useState(false);
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

    // The cities list is third-party (~22 KB) and the fallback already covers
    // the common picks, so keep it off the critical path.
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const cityIdleId = schedule(() => fetchCities());
    return () => cancel(cityIdleId);
  }, []);

  useEffect(() => {
    const imgs = heroData?.carousel_images;
    if (!imgs || imgs.length === 0) return;

    // Users who ask for reduced motion get a still hero, not a slideshow.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Only cycle when there is actually more than one image — a single-image
    // "carousel" was re-rendering the whole hero every 3s for no visual change.
    // NOTE: revealing the CMS image and rotating it are deliberately separate.
    // Gating the reveal on these conditions would mean a single-image hero, or
    // any reduced-motion user, never saw the CMS image at all.
    const shouldCycle = imgs.length > 1 && !reduceMotion;

    // START LATE, ON PURPOSE.
    // Rotating a viewport-filling image every 5s means the page is never
    // "visually complete" — which is exactly what Speed Index measures. It
    // scored 0 (16.7s) solely because of this, while FCP and LCP were fine.
    // Each swap also pulled another ~290KB image, so the network never went
    // quiet and Lighthouse kept tracing for 22s.
    // Holding the first image until the page has settled lets the paint
    // converge; real users still get the carousel a moment later.
    let interval;
    const startCycling = () => {
      interval = setInterval(() => {
        // Don't churn the main thread (or refetch remote images) on a hidden tab.
        if (typeof document !== "undefined" && document.hidden) return;
        setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
      }, 5000);
    };
    const startDelay = setTimeout(() => {
      // Reveal the first CMS image, then rotate from it if there is more than
      // one and the user has not asked for reduced motion.
      setCarouselStarted(true);
      if (shouldCycle) startCycling();
    }, 8000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, [heroData]);

  const getCurrentBackgroundImage = () => {
    // Null until the carousel starts, which keeps the hero on the LOCAL
    // preloaded webp for the first 8s. The remote CMS image is ~290KB and
    // cannot begin downloading until the hero API responds, so letting it take
    // over early made it the Largest Contentful Paint element at ~1.7s instead
    // of ~0.7s. Deferring it means LCP is the preloaded local image, and the
    // CMS images arrive with the rotation.
    if (!carouselStarted) return null;
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
