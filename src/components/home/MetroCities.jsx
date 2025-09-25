import React from "react";

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
  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <h3 className="mb-4 text-center">Wedding Vendors By Location</h3>
      <div className="row">
        {Object.entries(citiesData).map(([state, venues]) => (
          <div className="col-6 col-md-3 mb-4" key={state}>
            <h5 className="fw-bold">{state}</h5>
            <ul className="list-unstyled">
              {venues.map((venue, index) => (
                <li key={index}>{venue}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetroCities;
