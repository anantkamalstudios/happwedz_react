import React from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
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

  // Check if a vendor is already in the wishlist
  const isFavorite = (vendorId) =>
    wishlist.some((w) => w.vendorId === vendorId || w.vendor?._id === vendorId);

  const handleWishlistToggle = (vendor) => {
    if (!user?.id) {
      console.error("User not logged in. Cannot modify wishlist.");
      // Optionally, you can navigate to the login page here.
      return;
    }

    if (isFavorite(vendor.id)) {
      dispatch(removeFromWishlist(vendor.id));
    } else {
      dispatch(addToWishlist({ userId: user.id, vendor }));
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          {subVenuesData.map((venue) => (
            <Card
              key={venue.id}
              className="p-3 mb-4 border-0 shadow-lg rounded-5 overflow-hidden"
            >
              <Row className="g-0">
                <Col xs={12} md={4} className="position-relative">
                  <div className="position-relative h-100">
                    <Card.Img
                      src={venue.image}
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
                    <div className="price-tag position-absolute bottom-0 start-0 text-white px-2 py-1">
                      FROM : <FaIndianRupeeSign size={12} /> {venue.price}
                    </div>
                  </div>
                </Col>

                <Col
                  xs={12}
                  md={8}
                  className="p-3 d-flex flex-column"
                >
                  <Link
                    to={`/details/info/${venue.id}`}
                    className="text-decoration-none"
                  >
                    <div>
                      <h4 className="fw-bold mb-1 primary-text">
                        {venue.name}
                      </h4>
                      <p className="text-muted small mb-1">
                        <IoLocationOutline className="me-2" />
                        {venue.location}
                      </p>

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
                        {venue.within_24hr_available && (
                          <div className="d-flex align-items-center">
                            <BsLightningCharge
                              color="orange"
                              className="me-1"
                            />
                            {venue.within_24hr_available} Responds within 24
                            hours
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="mt-2">
                    <button
                      className="w-100 details-btn"
                      onClick={() => handleShow(venue.id)}
                    >
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
