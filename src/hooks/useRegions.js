import { useEffect, useState } from "react";
import axios from "axios";
import cityImages from "../data/cityImages";

const useRegions = (vendorType = null) => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const baseUrl = "https://happywedz.com/api/vendor-services/";
        const url = vendorType
          ? `${baseUrl}?vendorType=${encodeURIComponent(vendorType)}`
          : baseUrl;

        const { data } = await axios.get(url);

        const cityMap = {};
        data.forEach((item) => {
          const rawCity = item.attributes?.location?.city;
          const city = rawCity ? String(rawCity).trim() : null;

          if (!city) return; // skip empty/null city

          // ✅ Only include if exists in cityImages
          const matchedKey = Object.keys(cityImages).find(
            (k) => k.toLowerCase() === city.toLowerCase()
          );

          if (!matchedKey) return; // skip cities not in cityImages

          if (!cityMap[matchedKey]) {
            cityMap[matchedKey] = {
              id: Object.keys(cityMap).length + 1,
              name: matchedKey, // use exact key from cityImages
              venueCount: 0,
              image: cityImages[matchedKey],
            };
          }
          cityMap[matchedKey].venueCount += 1;
        });

        setRegions(Object.values(cityMap));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [vendorType]);

  return { regions, loading, error };
};

export default useRegions;
