import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Button, Badge } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { TbView360Number } from "react-icons/tb";
import { toggleWishlist } from "../../../redux/authSlice";
import DOMPurify from "dompurify";

const ListView = ({ subVenuesData, handleShow }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [hoveredImages, setHoveredImages] = useState({});
  const [favorites, setFavorites] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (!token) {
      setFavorites({});
      setWishlistIds(new Set());
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`https://happywedz.com/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          const ids = new Set(data.data.map((item) => item.vendor_services_id));
          setWishlistIds(ids);
          const favoritesObj = {};
          ids.forEach((id) => {
            favoritesObj[id] = true;
          });
          setFavorites(favoritesObj);
        } else {
          setWishlistIds(new Set());
          setFavorites({});
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistIds(new Set());
        setFavorites({});
      }
    };

    fetchWishlist();
  }, [token, subVenuesData]);

  const isFavorite = (vendorId) => {
    return favorites[vendorId] === true || wishlistIds.has(vendorId);
  };

  const handleWishlistToggle = (venue, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const wasFavorite = isFavorite(venue.id);
    setFavorites((prev) => ({
      ...prev,
      [venue.id]: !wasFavorite,
    }));

    setWishlistIds((prev) => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(venue.id);
      } else {
        newSet.add(venue.id);
      }
      return newSet;
    });

    dispatch(toggleWishlist(venue));
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
                    src={
                      hoveredImages[venue.id] ||
                      venue.image ||
                      "/images/imageNotFound.jpg"
                    }
                    alt={venue.name}
                    className="img-fluid rounded-5 object-fit-cover"
                    style={{ height: "200px", width: "100%" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/imageNotFound.jpg";
                    }}
                  />

                  <button
                    className="btn btn-light rounded-circle position-absolute top-0 start-0 m-2"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <TbView360Number className="text-dark" />
                  </button>

                  <button
                    className="btn btn-light rounded-circle position-absolute top-0 end-0 m-2"
                    onClick={(e) => handleWishlistToggle(venue, e)}
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
                          src={thumb || "/images/imageNotFound.jpg"}
                          alt="thumb"
                          className="rounded-2 me-2 object-fit-cover"
                          style={{
                            height: "50px",
                            width: "70px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={() => handleThumbEnter(venue.id, thumb)}
                          onMouseLeave={() => handleThumbLeave(venue.id)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/imageNotFound.jpg";
                          }}
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

                    <div
                      className="text-muted small mb-2"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.5",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(venue.description || ""),
                      }}
                    />
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
