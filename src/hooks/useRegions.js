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

        const resp = await axios.get(url);
        const payload = resp.data;
        console.log("VT", vendorType, "url", url, "data", payload);

        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        const cityMap = {};
        items.forEach((item) => {
          let city = null;
          if (item?.attributes?.city) {
            city = String(item.attributes.city).trim();
          } else if (item?.attributes?.location?.city) {
            city = String(item.attributes.location.city).trim();
          } else if (item?.vendor?.city) {
            city = String(item.vendor.city).trim();
          }
          if (!city) return;

          const matchedKey = Object.keys(cityImages).find(
            (k) => k.toLowerCase() === city.toLowerCase()
          );
          if (!matchedKey) return;

          if (!cityMap[matchedKey]) {
            cityMap[matchedKey] = {
              id: Object.keys(cityMap).length + 1,
              name: matchedKey,
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
