import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLocation } from "../../redux/locationSlice";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import axios from "axios";
import herosection from "../../assets/Hero_2.jpg";
import { categories, locations, popularSearches } from "../../data/herosection";
import { useVendorType } from "../../hooks/useVendorType";

const RotatingWordHeadline = () => {
  const words = ["Unique", "Dreamy", "Perfect"];
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setAnimating(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setAnimating(true);
      }, 300);
    }, 2800);
    return () => clearInterval(cycle);
  }, [words.length]);

  return (
    <h1 className="display-5 fw-bold">
      Find Your{" "}
      <span
        className="rotating-word"
        aria-label={words[index]}
        style={{
          display: "inline-block",
          transition: "opacity .3s, transform .3s",
          opacity: animating ? 1 : 0,
          transform: animating ? "scale(1)" : "scale(0.95)",
          color: "#e83581",
        }}
      >
        {words[index]}
      </span>{" "}
      Wedding Vendor
    </h1>
  );
};

const Herosection = () => {
  const { vendorTypes, loading } = useVendorType();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [vendorCategories, setVendorCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const toSlug = (text) =>
    text?.replace(/\s+/g, "-").replace(/[^A-Za-z0-9\-]/g, "") || "";

  const formatName = (name) => name.replace(/\band\b/gi, "&");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: "India" }
        );
        if (response.data && response.data.data) {
          const sortedCities = response.data.data.sort((a, b) =>
            a.localeCompare(b)
          );
          setCities(sortedCities);
          setSelectedCity("Pune");
        }
      } catch (error) {
        setCities(["Pune"]);
        setSelectedCity("Pune");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        setVendorCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setVendorCategories([]);
        console.error("Error fetching vendor categories:", error);
      }
    };
    fetchVendorCategories();
  }, []);

  return (
    <section
      className="hero-search position-relative text-white"
      style={{
        backgroundImage: `url(${herosection})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <div className="overlay" />
      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <RotatingWordHeadline />
            <p className="lead mb-4">
              Discover top-rated wedding vendors with countless reliable
              reviews.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4">
          <Col xs={12} md={10}>
            {reduxLocation ? (
              <div className="position-relative">
                <button
                  ref={buttonRef}
                  className="btn-light w-100 fw-semibold d-flex justify-content-between align-items-center"
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    fontSize: "16px",
                    padding: "1rem 2rem",
                    backgroundColor: "white",
                    border: "2px solid #e83581",
                    color: "#e83581",
                    borderRadius: "8px",
                  }}
                >
                  <span className="text-start">
                    Find Vendors in {reduxLocation}
                  </span>
                  {showDropdown ? (
                    <MdExpandLess size={24} />
                  ) : (
                    <MdExpandMore size={24} />
                  )}
                </button>

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="vendor-dropdown-menu"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      maxHeight: "500px",
                      overflowY: "auto",
                      zIndex: 1000,
                      animation: "slideDown 0.3s ease-out",
                    }}
                  >
                    <div
                      style={{
                        padding: "1.5rem",
                        columnCount: 4,
                        columnGap: "1.5rem",
                      }}
                      className="dropdown-grid"
                    >
                      {vendorCategories.length > 0 &&
                        vendorCategories.map((cat, i) => (
                          <div
                            key={cat.id || i}
                            className="vendor-category-card"
                            style={{
                              breakInside: "avoid",
                              marginBottom: "1.5rem",
                            }}
                          >
                            <div
                              className="fw-bold text-uppercase mb-2"
                              style={{
                                color: "#e83581",
                                fontSize: "14px",
                              }}
                            >
                              {cat.name}
                            </div>
                            {Array.isArray(cat.subcategories) &&
                              cat.subcategories.length > 0 && (
                                <ul
                                  className="list-unstyled"
                                  style={{ margin: 0 }}
                                >
                                  {cat.subcategories.map((sub, j) => (
                                    <li key={sub.id || j} className="mb-1">
                                      <Link
                                        to={`/vendors/${toSlug(sub.name)}`}
                                        className="dropdown-link small d-block"
                                        style={{
                                          fontSize: "13px",
                                          color: "#333",
                                          textDecoration: "none",
                                          padding: "4px 0",
                                          transition: "color 0.2s",
                                        }}
                                        onClick={() => setShowDropdown(false)}
                                      >
                                        {formatName(sub.name)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Form
                className="search-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Dispatch the selected city to Redux if a city is selected
                  if (selectedCity) {
                    dispatch(setLocation(selectedCity));
                  }

                  if (selectedCategory === "All Categories") {
                    navigate("/vendors");
                  } else if (selectedCategory) {
                    const formattedCategory = selectedCategory
                      .toLowerCase()
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ");

                    const encodedCategory =
                      encodeURIComponent(formattedCategory);
                    const cityParam = selectedCity
                      ? `&city=${encodeURIComponent(selectedCity)}`
                      : "";
                    navigate(
                      `/vendors/all?vendorType=${encodedCategory}${cityParam}`
                    );
                  }
                }}
              >
                <Row className="g-3">
                  <Col xs={12} md={5}>
                    <Form.Select
                      aria-label="Select Category"
                      className="form-control-lg"
                      style={{ fontSize: "14px", padding: "0.5rem 0.75rem" }}
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All Categories">All Categories</option>
                      {Array.isArray(vendorTypes) && vendorTypes.length > 0 ? (
                        vendorTypes.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          {loading ? "Loading..." : "No categories found"}
                        </option>
                      )}
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Select
                      aria-label="Select City"
                      className="form-control-lg"
                      style={{ fontSize: "14px", padding: "0.5rem 0.75rem" }}
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      {loadingCities ? (
                        <option value="" disabled>
                          Loading cities...
                        </option>
                      ) : cities.length > 0 ? (
                        cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No cities found
                        </option>
                      )}
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={2} className="d-grid">
                    <Button
                      variant="none"
                      className="btn-primary fw-semibold fs-12"
                      type="submit"
                    >
                      FIND VENDOR
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col lg={10} className="text-center">
            <div className="popular-searches small">
              Popular Searches:{" "}
              {popularSearches.map((p, idx) => (
                <React.Fragment key={p.href}>
                  <a href={p.href} className="link-light text-decoration-none">
                    {p.label}
                  </a>
                  {idx < popularSearches.length - 1 && " | "}
                </React.Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .hero-search .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 1;
        }
        .search-form .form-control,
        .search-form .form-select {
          border-radius: 6px;
        }
        .btn-find {
          background: #e83581;
          border: none;
          color: #fff;
          border-radius: 6px;
          min-width: 160px;
          white-space: nowrap;
        }
        .btn-find:hover {
          background-color:rgb(238, 83, 148);
          color: #000;
        }
        .popular-searches a:hover {
          text-decoration: underline;
        }
        
        /* Dropdown animation */
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
         
        
        .vendor-dropdown-menu::-webkit-scrollbar {
          width: 8px;
        }
        
        .vendor-dropdown-menu::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .vendor-dropdown-menu::-webkit-scrollbar-thumb {
          background: #e83581;
          border-radius: 10px;
        }
        
        .vendor-dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #d91d6e;
        }
        
        .dropdown-link:hover {
          color: #e83581 !important;
          padding-left: 4px;
        }
        
        /* Responsive grid */
        @media (max-width: 1200px) {
          .dropdown-grid {
            column-count: 3 !important;
          }
        }
        
        @media (max-width: 768px) {
          .dropdown-grid {
            column-count: 2 !important;
          }
          .vendor-dropdown-menu {
            max-height: 400px !important;
          }
        }
        
        @media (max-width: 576px) {
          .dropdown-grid {
            column-count: 1 !important;
          }
          .vendor-dropdown-menu {
            max-height: 350px !important;
          }
        }
        
        @media (max-width: 991px) {
          .hero-search {
            padding-top: 80px;
            padding-bottom: 60px;
          }
          .display-5 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Herosection;
