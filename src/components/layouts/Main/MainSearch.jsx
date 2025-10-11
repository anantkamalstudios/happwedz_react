import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import axios from "axios";

const MainSearch = ({ title = "Find what you need", onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState("");
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const placeholders = useMemo(() => {
    const t = (title || "").toLowerCase();
    const keywordPh = t.includes("photo")
      ? "Photographers, shoots, poses"
      : t.includes("vendor")
      ? "Decor, catering, planners"
      : t.includes("venue")
      ? "Banquet halls, resorts, lawns"
      : "Find Best Venues";
    const placePh = "City or locality";
    return { keywordPh, placePh };
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, place });
    } else {
      // console.log("Search:", { keyword, place });
    }
  };

  useEffect(() => {
    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })

      .then((res) => {
        // console.log("Fetched cities:", res.data);
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, []);

  // ✅ Filter cities locally
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
              <p className="text-muted mb-4" style={{}}>
                From royal palaces to cozy gardens - find the perfect setting
                for your big day
              </p>

              <Form onSubmit={handleSubmit} className="w-100 position-relative">
                <div
                  className="d-flex flex-column flex-md-row align-items-stretch rounded-pill p-2 gap-2"
                  style={{
                    maxWidth: 680,
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  <div
                    className="d-flex align-items-center flex-grow-1 px-2"
                    style={{ border: "2px solid #C31162", borderRadius: "5px" }}
                  >
                    <FaSearch className="me-2 text-muted" />
                    <Form.Control
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      type="text"
                      placeholder={placeholders.keywordPh}
                      className="border-0 shadow-none"
                      style={{ background: "transparent" }}
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
              </Form>

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
