import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { setLocation } from "../../redux/locationSlice";
import { useVendorType } from "../../hooks/useVendorType";
import { useHome } from "../../hooks/useHome";
import herosection from "../../assets/Hero_2.jpg";

const RotatingWordHeadline = ({
  words = ["Unique", "Dreamy", "Perfect"],
  titleTemplate = "Find Your _ Wedding Vendor",
}) => {
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
  const parts = titleTemplate.split("_");
  return (
    <h1 className="display-5 fw-bold">
      {parts[0]}
      <span
        style={{
          display: "inline-block",
          transition: "opacity .3s, transform .3s",
          opacity: animating ? 1 : 0,
          transform: animating ? "scale(1)" : "scale(0.95)",
          color: "#e83581",
        }}
      >
        {words[index]}
      </span>
      {parts[1] || " Wedding Vendor"}
    </h1>
  );
};

const Herosection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxLocation = useSelector((s) => s.location.selectedLocation);
  const { vendorTypes, loading } = useVendorType();
  const {
    heroData,
    vendorCategories,
    cities,
    loadingHero,
    loadingCities,
    getCurrentBackgroundImage,
  } = useHome();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toSlug = (t) =>
    t?.replace(/\s+/g, "-").replace(/[^A-Za-z0-9\-]/g, "") || "";
  const formatName = (n) => n.replace(/\band\b/gi, "&");

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      )
        setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showDropdown]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedCity) dispatch(setLocation(selectedCity));
    if (selectedCategory === "All Categories") navigate("/vendors");
    else {
      const formatted = selectedCategory
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const cityParam = selectedCity
        ? `&city=${encodeURIComponent(selectedCity)}`
        : "";
      navigate(
        `/vendors/all?vendorType=${encodeURIComponent(formatted)}${cityParam}`
      );
    }
  };

  const bgImage = getCurrentBackgroundImage() || herosection;

  return (
    <section
      className="hero-search position-relative text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        paddingTop: "120px",
        paddingBottom: "80px",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="overlay" />
      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <RotatingWordHeadline
              words={heroData?.typewriter_words || ["Dream"]}
              titleTemplate={
                heroData?.title || "Discover Your _ Wedding Vendor"
              }
            />
            <p className="lead mb-4">
              {heroData?.subtitle ||
                "Discover top-rated wedding vendors with countless reliable reviews."}
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
                  <span>Find Vendors in {reduxLocation}</span>
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
                      {vendorCategories.map((cat, i) => (
                        <div
                          key={cat.id || i}
                          style={{
                            breakInside: "avoid",
                            marginBottom: "1.5rem",
                          }}
                        >
                          <div
                            className="fw-bold text-uppercase mb-2"
                            style={{ color: "#e83581", fontSize: "14px" }}
                          >
                            {cat.name}
                          </div>
                          {Array.isArray(cat.subcategories) &&
                            cat.subcategories.map((sub, j) => (
                              <li
                                key={sub.id || j}
                                className="mb-1"
                                style={{ listStyle: "none" }}
                              >
                                <Link
                                  to={`/vendors/${toSlug(sub.name)}`}
                                  style={{
                                    fontSize: "13px",
                                    color: "#333",
                                    textDecoration: "none",
                                    display: "block",
                                    padding: "4px 0",
                                    transition: "color 0.2s",
                                  }}
                                  onClick={() => setShowDropdown(false)}
                                >
                                  {formatName(sub.name)}
                                </Link>
                              </li>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Form className="search-form" onSubmit={handleSearch}>
                <Row className="g-3">
                  <Col xs={12} md={5}>
                    <Form.Select
                      className="form-control-lg"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ fontSize: "14px", padding: "0.5rem 0.75rem" }}
                    >
                      <option>All Categories</option>
                      {vendorTypes.length ? (
                        vendorTypes.map((c) => (
                          <option key={c.id}>{c.name}</option>
                        ))
                      ) : (
                        <option disabled>
                          {loading ? "Loading..." : "No categories found"}
                        </option>
                      )}
                    </Form.Select>
                  </Col>
                  <Col xs={12} md={5}>
                    <Form.Select
                      className="form-control-lg"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      style={{ fontSize: "14px", padding: "0.5rem 0.75rem" }}
                    >
                      {loadingCities ? (
                        <option>Loading cities...</option>
                      ) : (
                        cities.map((city) => <option key={city}>{city}</option>)
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
        {heroData?.description && (
          <Row className="justify-content-center mt-3">
            <Col lg={10} className="text-center">
              <p
                className="small text-white-50 mb-0"
                style={{ fontSize: "14px" }}
              >
                {heroData.description}
              </p>
            </Col>
          </Row>
        )}
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
