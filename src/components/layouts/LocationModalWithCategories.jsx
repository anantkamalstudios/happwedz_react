import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

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

const LocationModalWithCategories = () => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterCities = (cities) =>
    cities.filter((city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      {/* Button to trigger modal */}
      <Button variant="outline-light" onClick={handleShow}>
        📍 Select Location
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Body>
          {/* Search Input */}
          <Form.Control
            type="text"
            placeholder="🔍 Search City, State..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-3"
          />

          <Row>
            {Object.entries(cityCategories).map(([category, cities]) => {
              const filtered = filterCities(cities);
              if (filtered.length === 0) return null;

              return (
                <Col key={category} md={4} className="mb-4">
                  <h6 className="text-danger fw-bold">{category}</h6>
                  <ul className="list-unstyled">
                    {filtered.map((city) => (
                      <li key={city}>
                        <a href="#" className="text-dark d-block py-1">
                          {city}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LocationModalWithCategories;
