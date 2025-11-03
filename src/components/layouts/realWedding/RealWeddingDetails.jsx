import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCameraRetro,
  FaChevronLeft,
  FaGem,
  FaLandmark,
  FaMapMarkerAlt,
  FaPaintBrush,
  FaTag,
} from "react-icons/fa";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import {
  FaPalette,
  FaStar,
  FaTshirt,
  FaUserTie,
  FaFemale,
} from "react-icons/fa";
import DOMPurify from "dompurify";

export default function WeddingPage({ post, onBackClick }) {
  const vendorTypeIcons = {
    photographers: <FaCameraRetro />,
    venues: <FaLandmark />,
    "bridal makeup": <FaPaintBrush />,
    "bridal wear": <FaTshirt />,
    jewellery: <FaGem />,
    default: <FaTag />,
  };

  const iconStyle = {
    fontSize: "1.8rem",
    color: "#C31162",
    marginRight: "1rem",
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <div
        className="position-relative text-center text-white"
        style={{
          backgroundImage: `url(https://happywedzbackend.happywedz.com/${post.coverPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
        }}
      >
        <div
          className="position-absolute top-50 start-50 translate-middle p-4 d-flex flex-column align-items-center justify-content-center gap-4"
          style={{
            // backgroundColor: "rgba(253, 7, 93, 0.4)",
            backgroundColor: "#C31162",
            opacity: "0.3",
            borderRadius: "8px",
            minWidth: "1000px",
            minHeight: "350px",
          }}
        >
          <h1
            className="fw-bold display-5 text-white"
            style={{
              color: "white",
              fontSize: "5rem",
              letterSpacing: "1px",
              wordSpacing: "5px",
              fontWeight: "lighter",
            }}
          >
            {post.brideName} and {post.groomName}
          </h1>
          <p className="mb-1" style={{ fontSize: "2rem" }}>
            {post.weddingDate} – {post.city}
          </p>
          {post.story && (
            <p className="medium mb-0">
              <span
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post?.story?.slice(0, 100) || ""),
                }}
              />
              ...
              <a className="text-warning fw-bold">Read More</a>
            </p>
          )}
        </div>
        <button
          className="wedding-back-btn btn btn-light position-absolute d-flex align-items-center justify-content-center"
          onClick={onBackClick}
          aria-label="Back"
          style={{
            top: "2rem",
            left: "2rem",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
          }}
        >
          <FaChevronLeft />
        </button>
      </div>

      {/* Couples Bio */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Couple Bio
        </h3>

        <Row className="align-items-start">
          {/* Groom Bio */}
          <Col md={6} className="mb-4 mb-md-0">
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaUserEdit
                  size={22}
                  color="#C31162"
                  className="me-2"
                  style={{ minWidth: "22px" }}
                />
                <h5 className="mb-0" style={{ color: "#C31162" }}>
                  {post.groomName}
                </h5>
              </div>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.groomBio}
              </p>
            </div>
          </Col>

          {/* Bride Bio */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaUserEdit
                  size={22}
                  color="#C31162"
                  className="me-2"
                  style={{ minWidth: "22px" }}
                />
                <h5 className="mb-0" style={{ color: "#C31162" }}>
                  {post.brideName}
                </h5>
              </div>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.brideBio}
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Photo Gallery */}
      <div className="container my-5">
        <h3 className="mb-3 fw-semibold">Photo Gallery</h3>

        <div
          className="p-2 mb-3"
          style={{ backgroundColor: "#f8d7da", borderRadius: "6px" }}
        >
          <span className="fw-semibold text-danger">Top Photos</span>
        </div>

        <div className="row g-3">
          {post.highlightPhotos && post.highlightPhotos.length > 0 ? (
            post.highlightPhotos.map((src, i) => (
              <div className="col-6 col-md-3" key={i}>
                <img
                  src={"https://happywedzbackend.happywedz.com/" + src}
                  className="img-fluid rounded"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "200px",
                  }}
                  alt="highlight"
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No highlight photos available</p>
          )}
        </div>
      </div>

      {/* Love story */}
      <Container className="my-5">
        {/* Inline animation CSS */}
        <style>
          {`
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
        </style>

        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Their Love Story
        </h3>

        <div
          className="mx-auto text-center"
          style={{
            position: "relative",
            maxWidth: "800px",
            borderRadius: "16px",
            padding: "2rem",
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            zIndex: 1,
          }}
        >
          <div
            className="primary-light-bg text-black"
            style={{
              content: "",
              position: "absolute",
              inset: "-3px",
              borderRadius: "18px",
              padding: "3px",
              backgroundSize: "400% 400%",
              animation: "gradientMove 6s ease infinite",
              zIndex: -1,
            }}
          ></div>

          <div
            className="mb-0 text-justify"
            style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                post.story
                  ? post.story
                      .replace(
                        /<\/?(span|font|style|script|div|pre)[^>]*>/gi,
                        ""
                      )
                      .replace(/<(p|br|hr|h[1-6])\b[^>]*>/gi, "")
                      .replace(/<\/(p|br|hr|h[1-6])>/gi, "")
                  : ""
              ),
            }}
          ></div>
        </div>
      </Container>

      {/* Highlights */}
      <Container className="my-4">
        <h2
          style={{
            color: "#C31162",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          Highlights
        </h2>
        <Row>
          {post.highlightPhotos.map((photo, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card
                style={{
                  border: "none",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Img
                  variant="top"
                  src={"https://happywedzbackend.happywedz.com/" + photo}
                  alt={`Highlight ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Events */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Wedding Events
        </h3>

        <Row className="g-4">
          {post.events?.map((event, index) => (
            <Col md={4} key={index}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="card-title d-flex align-items-center"
                    style={{ color: "#C31162" }}
                  >
                    <FaRegStar className="me-2" /> {event.name}
                  </h5>
                  <p className="card-text mb-2 d-flex align-items-center">
                    <FaCalendarAlt color="#C31162" className="me-2" />
                    {event.date}
                  </p>
                  <p className="card-text d-flex align-items-center">
                    <FaMapMarkerAlt color="#C31162" className="me-2" />
                    {event.venue}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Special highlighted */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Special Highlights
        </h3>

        {/* THEMES */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {post.themes?.map((theme, index) => (
            <span
              key={index}
              className="badge d-flex align-items-center px-3 py-2"
              style={{
                backgroundColor: "#fff0f6",
                color: "#C31162",
                fontSize: "0.95rem",
                border: "1px solid #C31162",
                borderRadius: "20px",
              }}
            >
              <FaPalette className="me-2" /> {theme}
            </span>
          ))}
        </div>

        <Row className="g-4">
          {/* Special Moments */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <h5
                className="mb-3 d-flex align-items-center"
                style={{ color: "#C31162" }}
              >
                <FaStar className="me-2" /> Special Moments
              </h5>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.specialMoments || "Their most cherished wedding moments"}
              </p>
            </div>
          </Col>

          {/* Outfit Details */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <h5
                className="mb-3 d-flex align-items-center"
                style={{ color: "#C31162" }}
              >
                <FaTshirt className="me-2" /> Outfit Details
              </h5>

              {/* Groom Outfit */}
              <div className="mb-3">
                <h6
                  className="mb-1 d-flex align-items-center"
                  style={{ color: "#C31162" }}
                >
                  <FaUserTie className="me-2" /> Groom
                </h6>
                <p className="mb-0 text-muted">
                  {post.groomOutfit || "Groom outfit details here."}
                </p>
              </div>

              {/* Bride Outfit */}
              <div>
                <h6
                  className="mb-1 d-flex align-items-center"
                  style={{ color: "#C31162" }}
                >
                  <FaFemale className="me-2" /> Bride
                </h6>
                <p className="mb-0 text-muted">
                  {post.brideOutfit || "Bride outfit details here."}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* <div className="container mb-5">
        <h4 className="mb-3 fw-semibold">Tagged Vendors</h4>
        <div className="row g-4">
          {post.vendors && post.vendors.length > 0 ? (
            post.vendors.map((vendor, i) => (
              <div className="col-12 col-md-3" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src="https://picsum.photos/400/250"
                    className="card-img-top"
                    alt={vendor.name}
                  />
                  <div className="card-body text-center">
                    <h6 className="mb-1" style={{ fontSize: "1.3rem" }}>
                      {vendor.name}
                    </h6>
                    <p className="text-muted small mb-0">{vendor.type}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No vendors tagged</p>
          )}
        </div>
      </div> */}

      {/* Tagged Vendors */}
      <Container className="container mb-5">
        <h4 className="mb-4 fw-semibold">Tagged Vendors</h4>
        <Row className="g-4">
          {post.vendors && post.vendors.length > 0 ? (
            post.vendors.map((vendor, i) => {
              const typeKey = vendor.type?.toLowerCase() || "";
              const icon = vendorTypeIcons[typeKey] || vendorTypeIcons.default;

              return (
                <Col xs={12} md={6} lg={4} key={i}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center">
                      <div style={iconStyle}>{icon}</div>
                      <div>
                        <Card.Title
                          style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}
                        >
                          {vendor.name}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-0">
                          {vendor.type}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p className="text-muted">No vendors tagged</p>
          )}
        </Row>
      </Container>
    </div>
  );
}
