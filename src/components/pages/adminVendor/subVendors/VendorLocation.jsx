import React, { useState, useEffect } from "react";
import axios from "axios";

const VendorLocation = ({ formData, setFormData, onSave }) => {
  const location = formData.location || {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India", // default
    pincode: "",
    lat: "",
    lng: "",
    landmark: "",
    serviceAreas: [],
  };

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    location.country || "India"
  );
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState(location.city || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch all countries
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      const sorted = res.data
        .map((c) => c.name.common)
        .sort((a, b) => a.localeCompare(b));
      setCountries(sorted);
    });
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!selectedCountry) return;

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: selectedCountry,
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));

    handleInputChange("country", selectedCountry);
  }, [selectedCountry]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // Filter cities for suggestions
  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(cityInput.toLowerCase())
  );

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Location & Service Areas</h6>
        <div className="row">
          {/* Address Line 1 */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Address Line 1 *</label>
            <input
              type="text"
              className="form-control"
              value={location.addressLine1}
              onChange={(e) =>
                handleInputChange("addressLine1", e.target.value)
              }
              placeholder="Enter address line 1"
            />
          </div>

          {/* Country Dropdown */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Country *</label>
            <select
              className="form-select"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCityInput("");
                handleInputChange("city", "");
              }}
            >
              {countries.length > 0 ? (
                countries.map((country, idx) => (
                  <option key={idx} value={country}>
                    {country}
                  </option>
                ))
              ) : (
                <option>Loading countries...</option>
              )}
            </select>
          </div>

          {/* City Autocomplete */}
          <div className="col-md-6 mb-3 position-relative">
            <label className="form-label fw-semibold">City *</label>
            <input
              type="text"
              className="form-control"
              value={cityInput}
              onChange={(e) => {
                setCityInput(e.target.value);
                handleInputChange("city", e.target.value);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // hide after select
              placeholder="Enter city"
              autoComplete="off"
            />
            {showSuggestions && cityInput && filteredCities.length > 0 && (
              <ul
                className="list-group position-absolute w-100 shadow-sm"
                style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1000 }}
              >
                {filteredCities.slice(0, 15).map((city, idx) => (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setCityInput(city);
                      handleInputChange("city", city);
                      setShowSuggestions(false);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* State */}
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">State *</label>
            <input
              type="text"
              className="form-control"
              value={location.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="Enter state"
            />
          </div>

          {/* Pincode */}
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Pincode *</label>
            <input
              type="text"
              className="form-control"
              value={location.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              placeholder="Enter pincode"
            />
          </div>

          {/* Landmark */}
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Landmark</label>
            <input
              type="text"
              className="form-control"
              value={location.landmark}
              onChange={(e) => handleInputChange("landmark", e.target.value)}
              placeholder="Enter nearby landmark"
            />
          </div>

          {/* Latitude */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Latitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={location.lat}
              onChange={(e) => handleInputChange("lat", e.target.value)}
              placeholder="Enter latitude"
            />
          </div>

          {/* Longitude */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Longitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={location.lng}
              onChange={(e) => handleInputChange("lng", e.target.value)}
              placeholder="Enter longitude"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" onClick={onSave}>
          Save Location Details
        </button>
      </div>
    </div>
  );
};

export default VendorLocation;
