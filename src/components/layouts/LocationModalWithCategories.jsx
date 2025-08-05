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
      <Button
        variant="outline-light"
        style={{ fontSize: "12px" }}
        onClick={handleShow}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-map-pin-icon lucide-map-pin"
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <circle cx="12" cy="10" r="3" />
        </svg>{" "}
        Select Location
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder=" Search City, State..."
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
                  <ul className="list-unstyled text-decoration-none">
                    {filtered.map((city) => (
                      <li key={city}>
                        <a
                          href="#"
                          className="text-dark d-block py-1 text-decoration-none"
                        >
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
      </Modal>
    </>
  );
};

export default LocationModalWithCategories;
