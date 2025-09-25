import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const LocationModalWithAPI = () => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");

  const cityCategories = {
    "Top Cities": [
      "All Cities",
      "Delhi NCR",
      "Mumbai",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Pune",
      "Lucknow",
      "Jaipur",
      "Kolkata",
    ],
    "Popular Cities": [
      "Gurgaon",
      "Goa",
      "Udaipur",
      "Chandigarh",
      "Jim Corbett",
      "Ahmedabad",
      "Indore",
      "Agra",
      "Kanpur",
      "Kochi",
    ],
    "Other Cities": [
      "Nagpur",
      "Dehradun",
      "Thane",
      "Surat",
      "Vadodara",
      "Raipur",
      "Mysore",
      "Hubli",
      "Dhitara",
      "Toranagallu",
    ],
    States: ["Kerala", "Rajasthan", "Himachal Pradesh", "Maharashtra"],
    "International Cities": ["Dubai", "Thailand", "Bali", "Abu Dhabi"],
  };

  // Fetch countries
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      const sorted = res.data
        .map((c) => c.name.common)
        .sort((a, b) => a.localeCompare(b));
      setCountries(sorted);
    });
  }, []);

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
  }, [selectedCountry]);

  const filterCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outline-light"
        className="border-danger rounded-0 text-dark"
        onClick={() => setShow(true)}
      >
        Select Location
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="xl" centered>
        <Modal.Body>
          <Form.Select
            className="mb-3"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>

          {/* City Search */}
          <Form.Control
            type="text"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-3"
          />

          <div
            style={{
              padding: "1rem",
              maxHeight: "700px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {filterCities.length === 0 ? (
              <div className="text-center text-muted py-3">
                No cities found.
              </div>
            ) : (
              <div className="d-flex flex-wrap justify-content-center">
                {filterCities.map((city) => (
                  <div
                    key={city}
                    className="p-2 text-center"
                    style={{ minWidth: "150px" }}
                  >
                    <a
                      href="#"
                      className="text-dark d-block py-2 text-decoration-none small border rounded"
                    >
                      {city}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LocationModalWithAPI;
