import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { TbView360Number } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toggleWishlist } from "../../../redux/authSlice";
import QuickInquiryModal from "../QuickInquiryModal";
import { trackView } from "../../../services/localStorageService";
import { prioritizeRecentlyViewed, isRecentlyViewed } from "../../../utils/recentlyViewedHelper";

const GridView = ({ subVenuesData, handleShow, colLg, fluid }) => {
  const [favorites, setFavorites] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [showQuickInquiry, setShowQuickInquiry] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedVendorName, setSelectedVendorName] = useState("");
  const [displayData, setDisplayData] = useState([]);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Reorder: recently viewed first, then rest
  useEffect(() => {
    if (subVenuesData && subVenuesData.length > 0) {
      const reordered = prioritizeRecentlyViewed(subVenuesData);
      setDisplayData(reordered);
    } else {
      setDisplayData(subVenuesData || []);
    }
  }, [subVenuesData]);

  // Fetch wishlist on component mount to initialize favorites
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
          // Initialize favorites state from fetched wishlist
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

  const toggleFavorite = async (venue, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically update UI
    const wasFavorite = isFavorite(venue.id);
    setFavorites((prev) => ({
      ...prev,
      [venue.id]: !wasFavorite,
    }));

    // Update wishlistIds set
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

    // Track wishlist interaction when adding
    if (!wasFavorite && token) {
      try {
        await fetch(`https://happywedz.com/api/interactions/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendor_subcategory_data_id: venue.id,
            action: "wishlist",
          }),
        });
      } catch (error) {
        console.error("Error tracking wishlist interaction:", error);
      }
    }
  };

  const handleCardClick = async (venue) => {
    // Track to localStorage on click (works without auth)
    trackView({
      id: venue.id,
      name: venue.name,
      category: venue.vendor_type || venue.category,
      type: venue.vendor_type || 'vendor',
      location: venue.city || venue.address || venue.location,
      image: venue.image,
      price_range: venue.starting_price || venue.vegPrice || venue.nonVegPrice,
      slug: venue.slug || venue.id
    });

    if (token) {
      try {
        await fetch(`https://happywedz.com/api/interactions/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            vendor_subcategory_data_id: venue.id,
            action: "click",
          }),
        });
      } catch (error) {
        console.error("Error tracking click:", error);
      }
    }
    navigate(`/details/info/${venue.slug}`);
  };

  return (
    <Container fluid={fluid}>
      <Row>
        {displayData && displayData.length > 0 ? (
          displayData.map((venue) => {
            const wasViewed = isRecentlyViewed(venue.id);
            return (
            <Col key={venue.id} xs={12} sm={6} lg={colLg || 4} className="mb-4">
              <Card
                className="border-0 main-grid-cards rounded-4 overflow-hidden p-2 h-100"
                onClick={() => handleCardClick(venue)}
                style={{ cursor: "pointer" }}
              >
                <div className="position-relative" style={{ height: "240px" }}>
                  <Card.Img
                    key={`${venue.id}-${venue.image}`}
                    variant="top"
                    src={venue.image || "/images/imageNotFound.jpg"}
                    loading="eager"
                    alt={venue.name || "Venue"}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                      borderRadius: "15px",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/imageNotFound.jpg";
                    }}
                  />

                  {/* Recently Viewed Badge */}
                  {wasViewed && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        background: "rgba(231, 76, 60, 0.92)",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "11px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        backdropFilter: "blur(4px)",
                        zIndex: 2,
                      }}
                    >
                      👁️ Recently Viewed
                    </div>
                  )}

                  {((venue.vendor_type || "").toLowerCase().includes("venue") ||
                    venue.vegPrice !== null ||
                    venue.nonVegPrice !== null) && (
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
                      }}
                    >
                      <TbView360Number className="text-dark" size={18} />
                    </button>
                  )}

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
                    onClick={(e) => toggleFavorite(venue, e)}
                  >
                    {isFavorite(venue.id) ? (
                      <FaHeart className="text-danger" size={18} />
                    ) : (
                      <FaRegHeart className="text-dark" size={18} />
                    )}
                  </button>
                </div>

                {/* Card Body */}
                <Card.Body className="p-3">
                  <Link
                    // to={`/details/info/${venue.slug}`}
                    className="text-decoration-none"
                  >
                    {/* Title and Rating Row */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0 fw-bold text-dark fs-18">
                        {venue.name || "Venue Name"}
                      </Card.Title>
                      <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
                        <FaStar size={14} className="text-warning" />
                        <span
                          className="fw-semibold text-dark"
                          style={{ fontSize: "13px" }}
                        >
                          {/* {venue.rating || "0.0"} */}
                          {venue.rating || "0.0"}
                        </span>
                        <span
                          className="text-muted"
                          style={{ fontSize: "12px" }}
                        >
                          ({venue.review_count || "0"} Review
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
                      className="text-muted mb-3 d-flex align-items-center"
                      style={{ fontSize: "14px" }}
                    >
                      <FaMapMarkerAlt className="me-1" />
                      {venue.city || venue.address || "Location not available"}
                    </div>

                    {/* Price Row - show veg/non-veg for venues, else starting price */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      {venue.vegPrice || venue.nonVegPrice ? (
                        <>
                          {venue.vegPrice !== null &&
                            venue.vegPrice !== undefined && (
                              <div className="d-flex flex-column">
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "12px" }}
                                >
                                  Veg
                                </span>
                                <span
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "16px" }}
                                >
                                  ₹ {String(venue.vegPrice.replace("Rs.", ""))}
                                </span>
                              </div>
                            )}
                          {venue.nonVegPrice !== null &&
                            venue.nonVegPrice !== undefined && (
                              <div className="d-flex flex-column text-end">
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "12px" }}
                                >
                                  Non-Veg
                                </span>
                                <span
                                  className="fw-bold text-dark"
                                  style={{ fontSize: "16px" }}
                                >
                                  ₹{" "}
                                  {String(venue.nonVegPrice.replace("Rs.", ""))}
                                </span>
                              </div>
                            )}
                        </>
                      ) : (
                        <div>
                          <span
                            className="fw-bold text-dark"
                            style={{ fontSize: "16px" }}
                          >
                            {venue.starting_price
                              ? `₹ ${String(
                                  venue.starting_price.replace("Rs.", "")
                                )}`
                              : "Contact for pricing"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Info Pills */}
                    <div className="d-flex gap-2 flex-wrap">
                      {/* Capacity Pill */}
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
                        {venue.capacity}
                      </span>

                      {/* 🌟 ONLY show Rooms if the value is truthy (i.e., not 0, null, or undefined) 🌟 */}
                      {venue.rooms !== null && venue.rooms !== undefined && (
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
                          {venue.rooms} Rooms
                        </span>
                      )}

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

                  {/* Quick Inquiry Button */}
                  <button
                    className="quick-inquiry-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVendorId(venue.vendor_id || venue.id);
                      setSelectedVendorName(venue.name || "");
                      setShowQuickInquiry(true);
                    }}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
                    onMouseOut={(e) => e.stopPropagation()}
                  >
                    ⚡ Quick Inquiry
                  </button>
                </Card.Body>
              </Card>
            </Col>
            );
          })
        ) : (
          <Col xs={12} className="text-center py-5">
            <p className="text-muted">No venues available</p>
          </Col>
        )}
      </Row>
      <QuickInquiryModal
        show={showQuickInquiry}
        handleClose={() => setShowQuickInquiry(false)}
        vendorId={selectedVendorId}
        vendorName={selectedVendorName}
      />
    </Container>
  );
};

export default GridView;
