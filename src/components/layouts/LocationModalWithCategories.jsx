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
  }, [selectedCountry]);

  const filterCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Button variant="outline-light" onClick={() => setShow(true)}>
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

          {/* Cities List */}
          <div
            style={{
              padding: "1rem",
              maxHeight: "700px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Row>
              {filterCities.map((city) => (
                <Col key={city} md={4} className="mb-2">
                  <a
                    href="#"
                    className="text-dark d-block py-1 text-decoration-none small"
                  >
                    {city}
                  </a>
                </Col>
              ))}
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LocationModalWithAPI;
