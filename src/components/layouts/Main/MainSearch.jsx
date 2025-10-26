import React, { useMemo, useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MainSearch = ({ title = "Find what you need", onSearch }) => {
  const { slug } = useParams();
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState("");
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef(null);
  const searchRef = useRef(null);

  const placeholders = useMemo(() => {
    const section = (title || "").toLowerCase();

    let keywordPh = "";
    let subtitle = "";

    switch (true) {
      case section.includes("venue"):
        keywordPh = "Banquet halls, resorts, lawns";
        subtitle =
          "From royal palaces to cozy gardens – find the perfect setting for your big day";
        break;
      case section.includes("vendor"):
        keywordPh = "Decor, catering, planners";
        subtitle =
          "Everything you need – from planners to caterers – to make your day hassle-free";
        break;
      case section.includes("photo"):
      case section.includes("photography"):
        keywordPh = "Photographers, shoots, poses";
        subtitle =
          "Capture your special moments with the best wedding photographers";
        break;
      case section.includes("invite"):
      case section.includes("e-invite"):
        keywordPh = "Wedding cards, digital invites";
        subtitle =
          "Send beautiful invites to your loved ones – traditional or digital";
        break;
      default:
        keywordPh = "Find Best Options";
        subtitle = "Plan your dream wedding with the best options available";
    }

    const placePh = "City or locality";
    return { keywordPh, placePh, subtitle };
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, place });
    } else {
    }
  };

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoadingSearch(true);
    try {
      const subCategory = slug
        ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        : title.includes("Venue") ? "Venues" : "Photographers";

      const response = await axios.get(
        `https://happywedz.com/api/vendor-services?subCategory=${encodeURIComponent(subCategory)}&search=${encodeURIComponent(searchQuery)}&limit=10`
      );

      const results = response.data?.data || [];
      setSearchResults(results);
      setShowResults(results.length > 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })

      .then((res) => {
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <section
      className="position-relative"
      style={{
        overflow: "visible",
        background:
          "linear-gradient(135deg, rgba(255, 114, 134, 0.08) 0%, rgba(137, 62, 247, 0.08) 100%)",
      }}
    >
      <div className="container py-4 py-md-5">
        <Row className="align-items-center g-4 g-lg-5">
          <Col xs={12} lg={6}>
            <div className="pe-lg-4">
              <h1
                className="mb-3"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: 800,
                  color: "#2e2e2e",
                }}
              >
                {title || "Plan your perfect day"}
              </h1>
              <p className="text-muted mb-4">{placeholders.subtitle}</p>

              <Form onSubmit={handleSubmit} className="w-100 position-relative" ref={searchRef}>
                <div
                  className="d-flex flex-column flex-md-row align-items-stretch rounded-pill p-2 gap-2"
                  style={{
                    maxWidth: 680,
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  <div
                    className="d-flex align-items-center flex-grow-1 px-2 position-relative"
                    style={{ border: "2px solid #C31162", borderRadius: "5px" }}
                  >
                    <FaSearch className="me-2 text-muted" />
                    <Form.Control
                      value={keyword}
                      onChange={handleKeywordChange}
                      type="text"
                      placeholder={placeholders.keywordPh}
                      className="border-0 shadow-none"
                      style={{ background: "transparent" }}
                      onFocus={() => keyword.length >= 2 && setShowResults(true)}
                    />
                  </div>

                  <Button
                    type="submit"
                    style={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#C31162",
                      color: "#fff",
                    }}
                  >
                    <CiSearch size={20} className="me-2" />
                    Search
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                  <div
                    className="position-absolute bg-white shadow-lg rounded-3 mt-2"
                    style={{
                      top: "100%",
                      left: 0,
                      right: 0,
                      maxWidth: 680,
                      maxHeight: "400px",
                      overflowY: "auto",
                      zIndex: 1000,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    {loadingSearch ? (
                      <div className="p-3 text-center text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="list-group list-group-flush">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={`/details/info/${result.id}`}
                            className="list-group-item list-group-item-action border-0"
                            style={{ textDecoration: "none", color: "inherit" }}
                            onClick={() => setShowResults(false)}
                          >
                            <div className="d-flex align-items-center gap-3 py-2">
                              <img
                                src={
                                  result.attributes?.image_url ||
                                  result.media?.[0]?.url ||
                                  "/images/imageNotFound.jpg"
                                }
                                alt={result.attributes?.vendor_name || "Vendor"}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/images/imageNotFound.jpg";
                                }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-semibold" style={{ fontSize: "14px" }}>
                                  {result.attributes?.vendor_name || result.vendor?.businessName || "Vendor"}
                                </h6>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <FaStar size={12} className="text-warning" />
                                  <span className="text-muted" style={{ fontSize: "12px" }}>
                                    {result.attributes?.rating || 0} ({result.attributes?.review_count || 0} reviews)
                                  </span>
                                </div>
                                <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                                  {result.attributes?.city || result.vendor?.city || "Location"}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-muted">
                        No results found for "{keyword}"
                      </div>
                    )}
                  </div>
                )}
              </Form>

              <div className="d-flex gap-2 mt-3 flex-wrap"></div>
              {/* <div className="d-flex gap-2 mt-3 flex-wrap">
                {["Banquet Halls", "Wedding Resorts", "Photographers"].map(
                  (chip) => (
                    <p style={{}}>
                      <span
                        key={chip}
                        className="badge  rounded-pill px-4 py-2"
                        style={{
                          fontWeight: 300,
                          fontSize: "10px",
                          color: "#C31162",
                          backgroundColor: "#fbcfe3ff",
                        }}
                      >
                        {chip}
                      </span>
                    </p>
                  )
                )}
              </div> */}
            </div>
          </Col>

          {/* <Col xs={12} lg={6}>
            <div
              className="position-relative right-0"
              style={{ maxWidth: 560 }}
            >
              <div
                className="bg-white shadow rounded-4 overflow-hidden w-100"
                style={{ aspectRatio: "16 / 10" }}
              >
                <img
                  src="/images/venues/hero_img_2.jpg"
                  alt="Search showcase"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "logo-no-bg.png";
                    e.currentTarget.style.objectFit = "contain";
                  }}
                />
              </div>
            </div>
          </Col> */}
          <Col xs={12} lg={6} className="position-static ">
            <div
              className="d-none d-lg-block position-absolute top-0 end-0 h-100"
              style={{
                width: "40%",
                zIndex: 1,
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              <div
                className="bg-white shadow rounded-start-4 overflow-hidden w-100 h-100"
                style={{
                  aspectRatio: "1 / 1",
                }}
              >
                <img
                  src="/images/venues/hero_img_2.jpg"
                  alt="Search showcase"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.currentTarget.src = "logo-no-bg.png";
                    e.currentTarget.style.objectFit = "contain";
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MainSearch;
