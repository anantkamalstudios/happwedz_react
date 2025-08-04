import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import LocationModalWithCategories from "./LocationModalWithCategories";

const Header = () => {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("Mumbai");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => setLocation(e.target.value);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{ backgroundColor: "#e83581" }}
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="./images/logo.webp" alt="HappyWedz" height="40" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="row">
            <div className="col-md-12">
              <div className="container">
                <div className="row align-items-center">
                  {/* Left */}
                  <div className="col-md-4">
                    <a className="nav-link text-white" href="#">
                      India's Favourite Wedding Planning Platform
                    </a>
                  </div>

                  {/* Center - Location */}
                  <div className="col-md-4 text-center">
                    <LocationModalWithCategories />
                  </div>

                  {/* Right */}
                  <div className="col-md-4 d-flex justify-content-end">
                    <a className="nav-link text-white" href="#">
                      Real Weddings
                    </a>
                    <a className="nav-link text-white" href="#">
                      Write A Review
                    </a>
                    <a className="nav-link text-white" href="#">
                      Download App
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={show} onHide={handleClose} centered size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Select Your Location</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Enter City or Area</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Mumbai"
                    value={location}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Google Maps Embed */}
                <div style={{ height: "300px", width: "100%" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      location
                    )}&output=embed`}
                    title="Location Map"
                  ></iframe>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {/* Bottom */}
            <div className="col-md-12 d-flex">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="weddingsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Venues
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="weddingsDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Featured venues
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Popular cities
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Destination weddings
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown text-white">
                  <a
                    className="nav-link dropdown-toggle text-white"
                    href="#"
                    id="vendorsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Vendors
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="vendorsDropdown"
                  >
                    <li>
                      <a className="dropdown-item text-white" href="#">
                        Photographers
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item text-white" href="#">
                        Makeup artists
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Photos
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Real Weddings
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    E-Invites
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Brides
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Groomes
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Matrimonial
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#">
                    Genie
                  </a>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <a href="#" className="me-2 text-white">
                  Login
                </a>
                <a href="#" className="text-white">
                  Fresh Sign-Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
