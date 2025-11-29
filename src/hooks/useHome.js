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

export const useHome = () => {
  const [heroData, setHeroData] = useState(null);
  const [vendorCategories, setVendorCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await axios.get(`${API_URL}/home-hero-section`);
        if (res.data?.success) setHeroData(res.data.data);
      } catch {
        setHeroData(null);
      } finally {
        setLoadingHero(false);
      }
    };

    const fetchVendorCategories = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/vendor-types/with-subcategories/all`
        );
        setVendorCategories(Array.isArray(res.data) ? res.data : []);
      } catch {
        setVendorCategories([]);
      }
    };

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: "India" }
        );

        let data = Array.isArray(res.data?.data) ? res.data.data : [];
        
        if (!data.length) {
          data = FALLBACK_CITIES;
        }

        setCities(data.sort((a, b) => a.localeCompare(b)));
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
    if (heroData?.carousel_images?.length) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % heroData.carousel_images.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
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
