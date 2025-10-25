import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://happywedz.com/api/vendor-types/with-subcategories/all"
  //       );
  //       const data = await response.json();
  //       setCategoriesApi(Array.isArray(data) ? data : []);
  //       if (Array.isArray(data) && data.length > 0) {
  //         setSelectedCategory(data[0].name);
  //       }
  //     } catch (error) {
  //       setCategoriesApi([]);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  useEffect(() => {
    if (
      !selectedCategory &&
      Array.isArray(vendorTypes) &&
      vendorTypes.length > 0
    ) {
      setSelectedCategory(vendorTypes[0].name);
    }
  }, [vendorTypes, selectedCategory]);

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
            <Form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedCategory) {
                  const formattedCategory = selectedCategory
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");

                  const encodedCategory = encodeURIComponent(formattedCategory);
                  navigate(`/vendors/all?vendorType=${encodedCategory}`);
                }
              }}
            >

              <Row className="g-3">
                <Col xs={12} md={10}>
                  <Form.Select
                    aria-label="Select Category"
                    className="form-control-lg"
                    style={{ fontSize: "14px", padding: "0.5rem 0.75rem" }}
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
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
