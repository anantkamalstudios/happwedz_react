import React from "react";
import { useNavigate } from "react-router-dom";
import citiesData from "../../data/citiesData";
import { useDispatch } from "react-redux";
import { setLocation } from "../../redux/locationSlice";
import { FaChevronDown } from "react-icons/fa6";
import "../../styles/routes/metro-cities.css";

const MetroCities = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCityClick = (cityLabel) => {
    const city = cityLabel
      .replace(/^Wedding Venues\s*/i, "")
      .trim()
      .toLowerCase();
    dispatch(setLocation(city));
    const citySlug = city.replace(/\s+/g, "-");
    navigate(`/venues/all/${citySlug}`);
  };

  // Distribute states into 4 columns to avoid row height constraints (gaps)
  const entries = Object.entries(citiesData);
  const columns = [[], [], [], []];
  entries.forEach((entry, index) => {
    columns[index % 4].push(entry);
  });

  return (
    <div className="container my-5">
      <h4 className="mb-4 text-center fs-20 fw-bold header-title">Wedding Venues By Location</h4>

      <div className="mt-4 metro-cities-grid">
        {columns.map((column, colIdx) => (
          <div key={colIdx} className="metro-column">
            {column.map(([state, venues]) => (
              <div key={state} className="state-card mb-4 break-inside-avoid">
                <div className="state-header d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-16 state-name">{state}</span>
                  <FaChevronDown className="chevron-icon" />
                </div>
                <ul className="list-unstyled mt-3 city-list">
                  {venues.map((venue, index) => {
                    const cleanName = venue.replace(/^Wedding Venues\s*/i, "");
                    return (
                      <li
                        key={index}
                        className="city-item lh-lg mb-1 fs-14"
                        onClick={() => handleCityClick(venue)}
                      >
                        <span className="city-dot"></span>
                        {cleanName}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetroCities;
