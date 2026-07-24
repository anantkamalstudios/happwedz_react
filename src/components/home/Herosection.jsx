import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { setLocation } from "../../redux/locationSlice";
import { useVendorType } from "../../hooks/useVendorType";
import { useHome } from "../../hooks/useHome";

// Served from /public with a stable URL so it can be <link rel="preload">-ed
// in index.html and start downloading before the JS bundle even parses.
// This is the LCP image — keep it identical to the preload href.
const HERO_FALLBACK = "/hero-2.webp";

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
  const { _vendorTypes, _loading } = useVendorType();
  const {
    heroData,
    vendorCategories,
    cities,
    _loadingHero,
    _loadingCities,
    getCurrentBackgroundImage,
  } = useHome();

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCity, setSelectedCity] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const cityDropdownRef = useRef(null);
  const cityInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const categoryButtonRef = useRef(null);

  const toSlug = (t) =>
    t?.replace(/\s+/g, "-").replace(/[^A-Za-z0-9-]/g, "") || "";
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

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target)
      )
        setShowCityDropdown(false);
    };
    if (showCityDropdown) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCityDropdown]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(e.target)
      )
        setShowCategoryDropdown(false);
    };
    if (showCategoryDropdown)
      document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showCategoryDropdown]);

  // LCP guard: always paint the local, optimized, preloaded webp first.
  // Only swap to the (unpreloaded, remote) carousel image once the browser is
  // idle — i.e. after the Largest Contentful Paint has already happened.
  const remoteBg = getCurrentBackgroundImage();
  const [useRemoteBg, setUseRemoteBg] = useState(false);
  useEffect(() => {
    if (!remoteBg) return;
    const schedule =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = schedule(() => setUseRemoteBg(true));
    return () => cancel(id);
  }, [remoteBg]);
  const bgImage = useRemoteBg && remoteBg ? remoteBg : HERO_FALLBACK;

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

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

  return (
    <section
      className="hero-search position-relative text-white overflow-hidden"
      style={{
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <img
        src={bgImage}
        alt="HappyWedz Hero Background"
        fetchPriority="high"
        loading="eager"
        decoding="async"
        width="1920"
        height="800"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          willChange: "opacity",
        }}
      />
      <div className="overlay" style={{ zIndex: 1 }} />
      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center text-center">
          <Col lg={10}>
            <RotatingWordHeadline
              words={heroData?.typewriter_words || ["Dream"]}
              titleTemplate={
                heroData?.title || "Discover Your _ Wedding Vendor"
              }
            />
            <p className="lead mb-4 fs-20">
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
                      fontSize: "14px",
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
                                  className="fs-14 py-1"
                                  style={{
                                    fontSize: "14px",
                                    color: "#333",
                                    textDecoration: "none",
                                    display: "block",
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
                  <Col xs={12} md={5} className="position-relative">
                    <button
                      ref={categoryButtonRef}
                      type="button"
                      className="btn-light w-100 fw-semibold d-flex justify-content-between align-items-center"
                      onClick={() =>
                        setShowCategoryDropdown(!showCategoryDropdown)
                      }
                      style={{
                        fontSize: "14px",
                        padding: "0.75rem 1rem",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        color: "#333",
                        borderRadius: "6px",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>
                        {selectedCategory}
                      </span>
                      {showCategoryDropdown ? (
                        <MdExpandLess size={18} />
                      ) : (
                        <MdExpandMore size={18} />
                      )}
                    </button>
                    {showCategoryDropdown && (
                      <div
                        ref={categoryDropdownRef}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          right: 0,
                          fontSize: "14px",
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          maxHeight: "300px",
                          overflowY: "auto",
                          zIndex: 999,
                          border: "1px solid #ddd",
                        }}
                      >
                        <div style={{ padding: "0.5rem 0" }}>
                          <div
                            style={{
                              fontSize: "14px",
                              padding: "0.75rem 1rem",
                              color: "#333",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                            }}
                            onClick={() => {
                              setSelectedCategory("All Categories");
                              setShowCategoryDropdown(false);
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#f5f5f5")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "white")
                            }
                          >
                            All Categories
                          </div>
                          {vendorCategories.map((cat) => (
                            <div
                              key={cat.id}
                              style={{
                                fontSize: "14px",
                                padding: "0.75rem 1rem",
                                color: "#333",
                                cursor: "pointer",
                                borderBottom: "1px solid #eee",
                              }}
                              onClick={() => {
                                setSelectedCategory(cat.name);
                                setShowCategoryDropdown(false);
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = "#f5f5f5")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = "white")
                              }
                            >
                              {cat.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                  <Col xs={12} md={5} className="position-relative">
                    <div
                      ref={cityInputRef}
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        className="form-control fw-bold"
                        value={citySearch}
                        onChange={(e) => {
                          setCitySearch(e.target.value);
                          setShowCityDropdown(true);
                        }}
                        placeholder="Search city..."
                        style={{
                          fontSize: "14px",
                          padding: "0.75rem 1rem",
                          paddingRight: "2.5rem",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                        onFocus={() => setShowCityDropdown(true)}
                      />
                      <button
                        type="button"
                        aria-label={
                          showCityDropdown ? "Hide city list" : "Show city list"
                        }
                        aria-expanded={showCityDropdown}
                        onClick={() => setShowCityDropdown(!showCityDropdown)}
                        style={{
                          position: "absolute",
                          right: "8px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "0",
                        }}
                      >
                        {showCityDropdown ? (
                          <MdExpandLess size={18} />
                        ) : (
                          <MdExpandMore size={18} />
                        )}
                      </button>
                    </div>
                    {showCityDropdown && (
                      <div
                        ref={cityDropdownRef}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 4px)",
                          left: 0,
                          right: 0,
                          backgroundColor: "white",
                          borderRadius: "6px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          maxHeight: "300px",
                          overflowY: "auto",
                          zIndex: 999,
                          fontSize: "14px",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div style={{ padding: "0.5rem 0" }}>
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <div
                                key={city}
                                style={{
                                  padding: "0.75rem 1rem",
                                  color: "#333",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #eee",
                                }}
                                onClick={() => {
                                  setCitySearch(city);
                                  setSelectedCity(city);
                                  setShowCityDropdown(false);
                                }}
                                onMouseEnter={(e) =>
                                  (e.target.style.backgroundColor = "#f5f5f5")
                                }
                                onMouseLeave={(e) =>
                                  (e.target.style.backgroundColor = "white")
                                }
                              >
                                {city}
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                padding: "1rem",
                                color: "#999",
                                textAlign: "center",
                              }}
                            >
                              No cities found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
