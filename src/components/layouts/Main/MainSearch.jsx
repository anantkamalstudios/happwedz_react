import React, { useMemo, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const MainSearch = ({ title = "Find what you need", onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [place, setPlace] = useState("");

  const placeholders = useMemo(() => {
    const t = (title || "").toLowerCase();
    const keywordPh = t.includes("photo")
      ? "Photographers, shoots, poses"
      : t.includes("vendor")
      ? "Decor, catering, planners"
      : t.includes("venue")
      ? "Banquet halls, resorts, lawns"
      : "Venues, vendors, services";
    const placePh = "City or locality";
    return { keywordPh, placePh };
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, place });
    } else {
      console.log("Search:", { keyword, place });
    }
  };

  return (
    <section
      className="position-relative overflow-hidden"
      style={{
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
              <p className="text-muted mb-4" style={{ maxWidth: 560 }}>
                Discover curated options that fit your style, budget, and
                location. Search and compare instantly.
              </p>

              <Form onSubmit={handleSubmit} className="w-100">
                <div
                  className="d-flex flex-column flex-md-row align-items-stretch rounded-pill bg-white shadow p-2 gap-2"
                  style={{ maxWidth: 680 }}
                >
                  <div className="d-flex align-items-center flex-grow-1 px-2">
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

                  <div className="vr d-none d-md-block" />

                  <div className="d-flex align-items-center flex-grow-1 px-2">
                    <FaMapMarkerAlt className="me-2 text-muted" />
                    <Form.Control
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      type="text"
                      placeholder={placeholders.placePh}
                      className="border-0 shadow-none"
                      style={{ background: "transparent" }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="ms-md-2 rounded-pill px-4 d-flex align-items-center justify-content-center"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <CiSearch size={20} className="me-2" />
                    Search
                  </Button>
                </div>
              </Form>

              <div className="d-flex gap-2 mt-3 flex-wrap">
                {[
                  "Banquet Halls",
                  "Wedding Resorts",
                  "Photographers",
                  "Makeup",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="badge bg-light text-muted border rounded-pill px-3 py-2"
                    style={{ fontWeight: 500 }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Col>

          <Col xs={12} lg={6}>
            <div
              className="position-relative mx-auto"
              style={{ maxWidth: 560 }}
            >
              <div
                className="bg-white shadow rounded-4 overflow-hidden"
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
              <div
                className="position-absolute top-0 start-0 translate-middle d-none d-lg-block"
                style={{
                  width: 120,
                  height: 120,
                  background: "#fff",
                  borderRadius: 24,
                  opacity: 0.5,
                }}
              />
              {/* <div
                className="position-absolute bottom-0 end-0 translate-middle d-none d-lg-block"
                style={{
                  width: 140,
                  height: 140,
                  background: "#fff",
                  borderRadius: 24,
                  opacity: 0.5,
                }}
              /> */}
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default MainSearch;
