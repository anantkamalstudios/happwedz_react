import React, { useState } from "react";
import { Row, Col, Card, Container, Button, Badge } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/wishlistSlice";
import { IoLocationOutline } from "react-icons/io5";

const ListView = ({ subVenuesData, handleShow }) => {
  const dispatch = useDispatch();
  const { items: wishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [hoveredImages, setHoveredImages] = useState({});

  // Check if a vendor is already in the wishlist
  const isFavorite = (vendorId) =>
    wishlist.some((w) => w.vendorId === vendorId || w.vendor?._id === vendorId);

  const handleWishlistToggle = (vendor) => {
    if (!user?.id) {
      console.error("User not logged in. Cannot modify wishlist.");
      return;
    }

    if (isFavorite(vendor.id)) {
      dispatch(removeFromWishlist(vendor.id));
    } else {
      dispatch(addToWishlist({ userId: user.id, vendor }));
    }
  };

  const handleThumbEnter = (venueId, thumbUrl) => {
    setHoveredImages((prev) => ({ ...prev, [venueId]: thumbUrl }));
  };
  const handleThumbLeave = (venueId) => {
    setHoveredImages((prev) => {
      const copy = { ...prev };
      delete copy[venueId];
      return copy;
    });
  };

  const filteredVenues =
    filter === "all"
      ? subVenuesData
      : subVenuesData.filter((venue) => venue.type === filter);

  return (
    <Container>
      <Row>
        {filteredVenues.map((venue) => (
          <Col xs={12} key={venue.id}>
            <Card className="p-3 mb-4 border-0 shadow-lg rounded-5 overflow-hidden">
              <Row className="g-0">
                <Col md={4} className="position-relative">
                  <Card.Img
                    src={hoveredImages[venue.id] || venue.image}
                    alt={venue.name}
                    className="img-fluid rounded-5 object-fit-cover"
                    style={{ height: "200px", width: "100%" }}
                  />

                  <button
                    className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                    onClick={() => handleWishlistToggle(venue)}
                  >
                    {isFavorite(venue.id) ? (
                      <FaHeart className="text-danger" />
                    ) : (
                      <FaRegHeart className="text-dark" />
                    )}
                  </button>

                  {venue.gallery?.length > 0 && (
                    <div className="d-flex mt-2 px-2">
                      {venue.gallery.slice(0, 3).map((thumb, i) => (
                        <img
                          key={i}
                          src={thumb}
                          alt="thumb"
                          className="rounded-2 me-2 object-fit-cover"
                          style={{
                            height: "50px",
                            width: "70px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => handleThumbEnter(venue.id, thumb)}
                          onMouseLeave={() => handleThumbLeave(venue.id)}
                        />
                      ))}
                    </div>
                  )}
                </Col>

                <Col md={8} className="p-3 d-flex flex-column">
                  <Link
                    to={`/details/info/${venue.id}`}
                    className="text-decoration-none"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <h4 className="fw-bold mb-1 primary-text">
                        {venue.name}
                      </h4>
                      {/* <Badge bg="danger">Handpicked</Badge> */}
                    </div>

                    <p className="text-muted small mb-1">
                      {" "}
                      <IoLocationOutline className="me-2" />
                      {venue.location}
                    </p>

                    <p className="fw-semibold text-dark mb-2">
                      <FaIndianRupeeSign size={14} /> {venue.price}{" "}
                      <small>per day</small>
                    </p>

                    <div className="d-flex align-items-center mb-2">
                      <FaStar className="text-warning me-1" />
                      <span>{venue.rating || "5.0"}</span>
                      <span className="text-muted ms-1">
                        ({venue.reviews} reviews)
                      </span>
                    </div>

                    <p className="text-muted small mb-2">
                      {(venue.description || "")
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}
                      ...
                    </p>
                  </Link>
                  <div className="mt-auto text-end">
                    <Button
                      variant="danger"
                      className="btn-primary"
                      onClick={() => handleShow(venue.id)}
                    >
                      Send Message
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListView;
