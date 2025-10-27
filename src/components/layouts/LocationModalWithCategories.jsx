import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLocation, clearLocation } from "../../redux/locationSlice";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

const LocationModalWithAPI = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");

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

  const handleCityClick = (city) => {
    dispatch(setLocation(city));
    setShow(false);

    setTimeout(() => {
      navigate(`/vendors/all?city=${encodeURIComponent(city)}`);
    }, 300);
  };

  const handleClearLocation = (e) => {
    e.stopPropagation();
    dispatch(clearLocation());
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <Button
          variant="outline-light"
          className="border-danger rounded-0 text-dark pe-5"
          onClick={() => setShow(true)}
          style={{ minWidth: 160 }}
        >
          {selectedLocation ? (
            <span>{selectedLocation}</span>
          ) : (
            <span>Select Location</span>
          )}
        </Button>
        {selectedLocation && (
          <button
            type="button"
            aria-label="Clear location"
            onClick={handleClearLocation}
            style={{
              position: "absolute",
              background: "none",
              top: 5,
              right: 6,
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
              padding: 1,
            }}
          >
            <span style={{ fontSize: 16, color: "#d00", fontWeight: "bold" }}>
              <IoCloseCircleOutline size={20} color="red" />
            </span>
          </button>
        )}
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="xl"
        centered
        backdrop={true}
        keyboard={true}
      >
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
              maxHeight: "400px",
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
                    className="p-2 text-start"
                    style={{ minWidth: "150px" }}
                  >
                    <a
                      href="#"
                      className="text-dark d-block text-decoration-none small"
                      onClick={() => handleCityClick(city)}
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
