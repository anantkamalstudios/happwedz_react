import React, { useState } from "react";
import citiesData from "../../data/citiesData";

const MetroCities = () => {
  const [expandedStates, setExpandedStates] = useState({});
  const [selectedState, setSelectedState] = useState("Maharashtra");

  const toggleExpand = (state) => {
    setExpandedStates((prev) => ({
      ...prev,
      [state]: !prev[state],
    }));
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
              <div className=" h-100">
                <div className="">
                  <h5 className="fw-bold">{state}</h5>
                  <ul className="list-unstyled mb-0 mt-3">
                    {visibleVenues.map((venue, index) => (
                      <li
                        key={index}
                        style={{ fontSize: "15px" }}
                        className="lh-lg"
                      >
                        {venue}
                      </li>
                    ))}
                    {venues.length > 5 && (
                      <li>
                        <button
                          className="btn btn-link primary-text p-0 mt-1"
                          onClick={() => toggleExpand(state)}
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
