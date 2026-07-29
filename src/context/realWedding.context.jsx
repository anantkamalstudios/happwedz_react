import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { dedupeRequest } from "../services/api/dedupeApi";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectCity, setSelectCity] = useState("All Cities");
  const [selectedCulture, setSelectedCulture] = useState("All Cultures");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");

  const [cities, setCities] = useState([]);
  const [cultures, setCultures] = useState([]);

  const themes = [
    "Destination",
    "Grand & Luxurious",
    "Pocket Friendly Stunners",
    "Intimate & Minimalist",
    "Modern & Stylish",
    "International",
    "Classic",
    "Others",
  ];

  const fetchCities = useMemo(
    () => async () => {
      try {
        if (cities.length === 0) {
          const res = await dedupeRequest(
            "https://countriesnow.space/api/v0.1/countries/cities",
            "post",
            { country: "India" }
          );

          if (res.data?.data) {
            const sorted = [...res.data.data].sort((a, b) => a.localeCompare(b));
            setCities(sorted);
          } else {
            setCities(["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Goa", "Hyderabad", "Jaipur", "Kolkata", "Mumbai", "Pune", "Udaipur"]);
          }
        }
      } catch (err) {
        setCities(["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Goa", "Hyderabad", "Jaipur", "Kolkata", "Mumbai", "Pune", "Udaipur"]);
      }
    },
    [cities.length]
  );

  // This provider wraps the whole app, but its data is only read on the Real
  // Wedding pages. Firing these on mount put a third-party request and an API
  // request in front of the homepage's LCP resources, so they wait for idle.
  useEffect(() => {
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = schedule(() => fetchCities());
    return () => cancel(id);
  }, [fetchCities]);

  useEffect(() => {
    const fetchCultures = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/real-wedding-culture/public`
        );
        if (res.data?.cultures) {
          setCultures(res.data.cultures);
        }
      } catch (err) {
        console.error("Error fetching cultures:", err);
      }
    };
    const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = schedule(fetchCultures);
    return () => cancel(id);
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectCity("All Cities");
    setSelectedCulture("All Cultures");
    setSelectedTheme("All Themes");
  };

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,

        selectCity,
        setSelectCity,

        selectedCulture,
        setSelectedCulture,

        selectedTheme,
        setSelectedTheme,

        cities,
        cultures,
        themes,

        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
