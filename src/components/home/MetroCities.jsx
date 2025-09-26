import React, { useState } from "react";

const citiesData = {
  Maharashtra: [
    "Wedding Venues Mumbai",
    "Wedding Venues Pune",
    "Wedding Venues Nashik",
    "Wedding Venues Nagpur",
    "Wedding Venues Raigad",
  ],
  "Uttar Pradesh": [
    "Wedding Venues Lucknow",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
    "Wedding Venues Noida",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Chandigarh: [
    "Wedding Venues Mohali",
    "Wedding Venues Mysore",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  "Delhi NCR": [
    "Wedding Venues Gurgaon",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
    "Wedding Venues Noida",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Rajasthan: [
    "Wedding Venues Jaipur",
    "Wedding Venues Mysore",
    "Wedding Venues West Delhi",
  ],
  Karnataka: [
    "Wedding Venues Bangalore",
    "Wedding Venues Mysore",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  "West Bengal": [
    "Wedding Venues Gurgaon",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
    "Wedding Venues Noida",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Uttarakhand: [
    "Wedding Venues Gurgaon",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
    "Wedding Venues Noida",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Kerala: [
    "Wedding Venues Gurgaon",
    "Wedding Venues South Delhi",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Odisha: [
    "Wedding Venues Bangalore",
    "Wedding Venues Mysore",
    "Wedding Venues West Delhi",
    "Wedding Venues Ghaziabad",
    "Wedding Venues North Delhi",
  ],
  Goa: ["Wedding Venues North Goa", "Wedding Venues South Goa"],
};

const MetroCities = () => {
  const [expandedStates, setExpandedStates] = useState({});

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
