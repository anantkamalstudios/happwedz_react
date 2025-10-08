import React, { useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { TbView360Number } from "react-icons/tb";
import { Link } from "react-router-dom";

const GridView = ({ subVenuesData, handleShow }) => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container>
      <Row>
        {subVenuesData && subVenuesData.length > 0 ? (
          subVenuesData.map((venue) => (
            <Col key={venue.id} xs={12} sm={6} lg={4} className="mb-4">
              <Card className="border-0 main-grid-cards rounded-4 overflow-hidden p-2 h-100">
                {/* Image Section */}
                <div className="position-relative" style={{ height: "240px" }}>
                  <Card.Img
                    variant="top"
                    src={
                      venue.image ||
                      "https://images.unsplash.com/photo-1519167758481-83f29da8c8d0?w=800&h=600&fit=crop"
                    }
                    loading="lazy"
                    alt={venue.name || "Venue"}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      borderRadius: "15px",
                    }}
                  />

                  {/* 360 View Icon (Left Side) */}
                  <button
                    className="btn btn-light position-absolute rounded-circle border-0 shadow-sm"
                    style={{
                      top: "12px",
                      left: "12px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("360 view clicked for venue:", venue.id);
                    }}
                  >
                    <TbView360Number className="text-dark" size={18} />
                  </button>

                  {/* Favorite Icon (Right Side) */}
                  <button
                    className="btn btn-light position-absolute rounded-circle border-0 shadow-sm"
                    style={{
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      padding: "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={(e) => toggleFavorite(venue.id, e)}
                  >
                    {favorites[venue.id] ? (
                      <FaHeart className="text-danger" size={18} />
                    ) : (
                      <FaRegHeart className="text-dark" size={18} />
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <Card.Body className="p-3">
                  <Link
                    to={`/details/info/${venue.id}`}
                    className="text-decoration-none"
                  >
                    {/* Title and Rating Row */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0 fw-bold text-dark fs-20">
                        {venue.name || "Venue Name"}
                      </Card.Title>
                      <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
                        <FaStar size={14} className="text-warning" />
                        <span
                          className="fw-semibold text-dark"
                          style={{ fontSize: "13px" }}
                        >
                          {venue.rating || "0.0"}
                        </span>
                        <span
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          ({venue.reviews || "0"} Review
                          {venue.reviews !== "1" && "s"})
                        </span>
                      </div>
                    </div>

                    {/* subtitle */}
                    <div
                      className="text-muted mb-3"
                      style={{ fontSize: "13px" }}
                    >
                      {venue.subtitle || venue.tagline}
                    </div>

                    {/* Location */}
                    <div
                      className="text-muted mb-3"
                      style={{ fontSize: "13px" }}
                    >
                      {venue.location || "Location not available"}
                    </div>

                    {/* Veg/Non-Veg Pills */}
                    {/* <div className="d-flex gap-2 mb-3">
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: "#fff",
                          color: "#666",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        Veg
                      </span>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: "#fff",
                          color: "#666",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        Non Veg
                      </span>
                    </div> */}

                    {/* Price Row */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "16px" }}
                        >
                          ₹ {venue.vegPrice || venue.price || "0"}
                        </span>
                        <span
                          className="text-muted ms-1"
                          style={{ fontSize: "12px" }}
                        >
                          per event
                        </span>
                      </div>
                      <div>
                        <span
                          className="fw-bold text-dark"
                          style={{ fontSize: "16px" }}
                        >
                          ₹ {venue.nonVegPrice || venue.price || "0"}
                        </span>
                        <span
                          className="text-muted ms-1"
                          style={{ fontSize: "12px" }}
                        >
                          per event
                        </span>
                      </div>
                    </div>

                    {/* Bottom Info Pills */}
                    <div className="d-flex gap-2 flex-wrap">
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: "#ffe5f0",
                          color: "#c2185b",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "none",
                        }}
                      >
                        {venue.capacity || "N/A"}
                      </span>
                      <span
                        className="badge px-3 py-2"
                        style={{
                          backgroundColor: "#ffe5f0",
                          color: "#c2185b",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "none",
                        }}
                      >
                        {venue.rooms || "0"} Rooms
                      </span>
                      {venue.more && (
                        <span
                          className="badge px-3 py-2"
                          style={{
                            backgroundColor: "#ffe5f0",
                            color: "#c2185b",
                            fontSize: "12px",
                            fontWeight: "500",
                            border: "none",
                          }}
                        >
                          + {venue.more} more
                        </span>
                      )}
                    </div>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="text-muted">No venues available</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default GridView;
