import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import citiesData from "../../data/citiesData";

const MetroCities = () => {
  const [expandedStates, setExpandedStates] = useState({});
  const navigate = useNavigate();

  const handleCityClick = (cityLabel) => {
    const city = cityLabel
      .replace(/^Wedding Venues\s*/i, "")
      .trim()
      .toLowerCase();
    navigate(`/venues/wedding-venues?city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Wedding Vendors By Location</h3>
      <div className="row row-cols-1 row-cols-md-4 g-4 mt-5">
        {Object.entries(citiesData).map(([state, venues]) => {
          const isExpanded = expandedStates[state];
          const visibleVenues = isExpanded ? venues : venues.slice(0, 5);

          return (
            <div className="col" key={state}>
              <div className="h-100">
                <div>
                  <h5 className="fw-bold">{state}</h5>
                  <ul className="list-unstyled mb-0 mt-3">
                    {visibleVenues.map((venue, index) => (
                      <li
                        key={index}
                        style={{ fontSize: "15px", cursor: "pointer" }}
                        className="lh-lg"
                        onClick={() => handleCityClick(venue)}
                      >
                        {venue}
                      </li>
                    ))}
                    {venues.length > 5 && (
                      <li>
                        <button
                          className="btn btn-link primary-text p-0 mt-1 fs-16 text-decoration-none"
                          onClick={() =>
                            setExpandedStates((prev) => ({
                              ...prev,
                              [state]: !prev[state],
                            }))
                          }
                        >
                          {isExpanded ? "View less" : "View all"}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetroCities;
