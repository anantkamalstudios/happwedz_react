import React, { useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { FaSearch, FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaIndianRupeeSign } from "react-icons/fa6";
import DynamicAside from "../aside/DynamicAside";
import { Link } from "react-router-dom";

const ListView = ({ subVenuesData, section, handleShow }) => {
  const [favorites, setFavorites] = useState({});
  const [filter, setFilter] = useState("all");

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredVenues =
    filter === "all"
      ? subVenuesData
      : subVenuesData.filter((venue) => venue.type === filter);

  return (
    <Container>
      <Row>
        {/* <Col xs={12} md={3} className="mb-4 d-block d-lg-none">
          <DynamicAside section={section} />
        </Col> */}

        <Col xs={12} md={12}>
          {filteredVenues.map((venue) => (
            <Card
              key={venue.id}
              className="venue-card mb-4 rounded-4 shadow-lg"
            >
              <Row className="g-0">
                {/* Image */}
                <Col xs={12} md={4} className="position-relative">
                  <div className="position-relative h-100">
                    <Card.Img
                      src={venue.image}
                      alt={venue.name}
                      className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                    />
                    <button
                      className="btn-glass position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => toggleFavorite(venue.id)}
                    >
                      {favorites[venue.id] ? (
                        <FaHeart className="text-danger" />
                      ) : (
                        <FaRegHeart className="text-white" />
                      )}
                    </button>
                    <div className="price-tag position-absolute bottom-0 start-0 text-white px-2 py-1">
                      <FaIndianRupeeSign size={12} /> {venue.price}
                    </div>
                  </div>
                </Col>

                {/* Details */}
                <Col
                  xs={12}
                  md={8}
                  className="p-3 d-flex flex-column justify-content-between"
                >
                  <Link
                    to={`/details/info/${venue.slug}`}
                    className="text-decoration-none"
                  >
                    <div>
                      <Card.Title as="h5" className="mb-2">
                        {venue.name}
                      </Card.Title>
                      <div className="text-muted small mb-2">
                        {(venue.description || "")
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}
                        ...
                      </div>
                      <div className="text-muted small mb-2">
                        {venue.location}
                      </div>

                      <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <FaStar className="text-warning me-1" />
                          <span>{venue.rating}</span>
                          <span className="text-muted ms-1">
                            ({venue.reviews})
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <LuUsers className="text-dark me-1" />
                          <span className="text-muted">{venue.capacity}</span>
                        </div>
                        {venue.call && (
                          <div className="d-flex align-items-center">
                            <BsLightningCharge
                              color="orange"
                              className="me-1"
                            />
                            {venue.call}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="mt-2">
                    <button className="w-100 details-btn" onClick={handleShow}>
                      Request Pricing
                    </button>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ListView;
