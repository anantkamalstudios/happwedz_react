import React, { useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";

const GridView = ({ subVenuesData, handleShow }) => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container>
      <Row>
        {subVenuesData.map((v) => (
          <Col key={v.id} xs={12} sm={6} md={4} className="mb-4">
            <Card className="rounded-4 border-0 shadow-lg h-100 p-2">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={v.image}
                  alt={v.name}
                  className="rounded-4"
                  style={{ objectFit: "cover", height: "200px", width: "100%" }}
                />
                <button
                  className="btn-glass position-absolute top-0 end-0 m-2 rounded-circle"
                  onClick={() => toggleFavorite(v.id)}
                >
                  {favorites[v.id] ? (
                    <FaHeart className="text-danger" />
                  ) : (
                    <FaRegHeart className="text-white" />
                  )}
                </button>
              </div>

              <Card.Body>
                <Link
                  to={`/details/info/${v.id}`}
                  className="text-decoration-none"
                >
                  <Card.Title className="mb-1 fs-20 primary-text fw-bold">
                    {v.name}
                  </Card.Title>
                  <div className="text-muted small mb-2">{v.location}</div>

                  <div className="d-flex align-items-center mb-2">
                    <FaStar className="text-warning me-1" />
                    <span>{v.rating}</span>
                    <span className="text-muted ms-1">
                      ({v.reviews} Review)
                    </span>
                  </div>

                  <div className="d-flex gap-2 mb-2 flex-wrap">
                    <span className="badge bg-pink text-dark">
                      <GoPerson size={15} /> {v.capacity}
                    </span>
                    <span className="badge bg-pink text-dark">
                      ₹ {v.price} per day
                    </span>
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-light-pink text-dark">
                      {v.capacity}
                    </span>
                    <span className="badge bg-light-pink text-dark">
                      {v.rooms} Rooms
                    </span>
                    {v.more && (
                      <span className="badge bg-light-pink text-dark">
                        + {v.more} more
                      </span>
                    )}
                  </div>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default GridView;
