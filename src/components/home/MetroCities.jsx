import React from "react";
import { useNavigate } from "react-router-dom";
import citiesData from "../../data/citiesData";

const MetroCities = () => {
  const navigate = useNavigate();

  const handleCityClick = (cityLabel) => {
    const city = cityLabel
      .replace(/^Wedding Venues\s*/i, "")
      .trim()
      .toLowerCase();
    navigate(`/venues/?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Wedding Vendors By Location</h3>

      <div className="mt-5 metro-cities-container">
        {Object.entries(citiesData).map(([state, venues]) => (
          <div key={state} className="mb-4 break-inside-avoid">
            <h5 className="fw-bold">{state}</h5>
            <ul className="list-unstyled mt-3">
              {venues.map((venue, index) => (
                <li
                  key={index}
                  className="lh-lg mb-1"
                  style={{ fontSize: "15px", cursor: "pointer" }}
                  onClick={() => handleCityClick(venue)}
                >
                  {venue}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetroCities;
