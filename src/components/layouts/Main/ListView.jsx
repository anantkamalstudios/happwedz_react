import React, { useState, useEffect } from "react";
import { Row, Col, Card, Container, Button, Badge } from "react-bootstrap";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { TbView360Number } from "react-icons/tb";
import { toggleWishlist } from "../../../redux/authSlice";
import DOMPurify from "dompurify";
import PricingModal from "../PricingModal";
import { fetchVendorTypesWithSubcategoriesApi } from "../../../services/api/vendorTypesWithSubcategoriesApi";
import { IMAGE_BASE_URL } from "../../../config/constants";
import { useParams } from "react-router-dom";

const ListView = ({ subVenuesData, handleShow, section }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");
  const [hoveredImages, setHoveredImages] = useState({});
  const [favorites, setFavorites] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [vendorTypes, setVendorTypes] = useState([]);
  const navigate = useNavigate();
  const { subcategory } = useParams(); // this will give slug like "banquet-hall"
  const [activeSub, setActiveSub] = useState(subcategory || "");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  useEffect(() => {
    setActiveSub(subcategory || "");
  }, [subcategory]);

  // Persist active subcategory so selection survives page refresh
  const ACTIVE_KEY = `listview_active_sub:${section}`;

  // Load saved active sub if URL param is not present
  useEffect(() => {
    try {
      if (!subcategory) {
        const saved = window.localStorage.getItem(ACTIVE_KEY);
        if (saved) setActiveSub(saved);
      }
    } catch (e) {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  useEffect(() => {
    const loadVendorTypes = async () => {
      const types = await fetchVendorTypesWithSubcategoriesApi();
      setVendorTypes(types || []);
    };
    loadVendorTypes();
  }, []);

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
    <>
      <Container>
        <Row>
          {/* Main list: take 9/12 on md+ screens to leave space for right sidebar */}
          <Col xs={12} md={9}>
            <Row>
              {filteredVenues.map((venue) => (
                <Col xs={12} key={venue.id}>
                  <Card
                    className="p-3 mb-4 border-0 shadow-lg rounded-5 overflow-hidden"
                    onClick={() => navigate(`/details/info/${venue.id}`)}
                    style={{ cursor: "pointer" }}
                  >
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

                        {((venue.vendor_type || "")
                          .toLowerCase()
                          .includes("venue") ||
                          venue.vegPrice !== null ||
                          venue.nonVegPrice !== null) && (
                          <button
                            className="btn btn-light rounded-circle position-absolute top-0 start-0 m-2"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <TbView360Number className="text-dark" />
                          </button>
                        )}

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
                                onMouseEnter={() =>
                                  handleThumbEnter(venue.id, thumb)
                                }
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
                        <Link className="text-decoration-none">
                          <div className="d-flex justify-content-between align-items-start">
                            <span className="fw-bold mb-1 primary-text fs-18">
                              {venue.name}
                            </span>
                          </div>

                          <p className="text-muted small mb-1 fs-14">
                            {" "}
                            <IoLocationOutline className="me-2 fs-14" />
                            {venue.location}
                          </p>

                          <p className="fw-semibold text-dark mb-2 fs-16">
                            <FaIndianRupeeSign size={14} />{" "}
                            {(
                              venue?.vegPrice ||
                              venue?.nonVegPrice ||
                              venue?.starting_price ||
                              "Contact For Price"
                            )
                              ?.replace(/rs\.?/i, "")
                              ?.trim()}
                          </p>

                          <div className="d-flex align-items-center mb-2 fs-14">
                            <FaStar className="text-warning me-1 fs-14" />
                            <span>{venue.rating || "5.0"}</span>
                            <span className="text-muted ms-1 fs-14">
                              ({venue.reviews} reviews)
                            </span>
                          </div>

                          <div
                            className="text-muted small mb-2 fs-14"
                            style={{
                              lineHeight: "1.9",
                              wordSpacing: "0.1em",
                              letterSpacing: "0.02em",
                              whiteSpace: "pre-line",
                              maxHeight: "5.7em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                venue.description || ""
                              ),
                            }}
                          />
                        </Link>
                        <div className="mt-auto text-end fs-14">
                          <Button
                            variant="danger"
                            className="btn-primary fs-14"
                            onClick={(e) => {
                              e.stopPropagation();
                              const vid = venue.vendor_id ?? venue.id;
                              if (typeof handleShow === "function") {
                                handleShow(vid);
                              } else {
                                setSelectedVendorId(vid);
                                setShowPricingModal(true);
                              }
                            }}
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
          </Col>

          {/* Right sidebar: vertical stacked ad cards */}
          <Col xs={12} md={3} className="mt-4 mt-md-0">
            <div className="d-flex flex-column gap-3">
              {vendorTypes
                .filter((vt) => {
                  if (
                    section &&
                    vt.name.toLowerCase() === section.toLowerCase()
                  )
                    return true;
                  // If no data, maybe show nothing or default?
                  // Try to match based on the first item in subVenuesData
                  if (!subVenuesData || subVenuesData.length === 0)
                    return false;
                  const currentType =
                    subVenuesData[0].vendor_type || subVenuesData[0].vendorType;
                  if (!currentType) return false;
                  return (
                    vt.name.toLowerCase() ===
                    currentType.toString().toLowerCase()
                  );
                })
                .map((venueType) => (
                  <Card
                    key={venueType.id}
                    className="p-3 border-0 shadow-sm rounded-4"
                  >
                    {/* Hero Image */}
                    {venueType.hero_image && (
                      <div className="mb-3">
                        <img
                          src={
                            venueType.hero_image.startsWith("/uploads")
                              ? `${IMAGE_BASE_URL}${venueType.hero_image}`
                              : venueType.hero_image
                          }
                          alt={venueType.name}
                          className="img-fluid rounded-4 w-100 object-fit-cover"
                          style={{ height: "200px" }}
                        />
                      </div>
                    )}

                    {/* Subcategories List */}
                    <h5 className="fw-bold mb-3">{venueType.name}</h5>
                    <div className="d-flex flex-column gap-2">
                      {venueType.subcategories?.map((sub) => {
                        const slug = toSlug(sub.name);
                        const isActive = slug === activeSub;
                        return (
                          <div
                            key={sub.id}
                            className={`p-2 rounded-3 cursor-pointer hover-shadow transition-all ${
                              isActive ? "subcategory-active" : "bg-light"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              // optimistically set active state for instant feedback
                              setActiveSub(slug);
                              try {
                                window.localStorage.setItem(ACTIVE_KEY, slug);
                              } catch (e) {}
                              navigate(`/${section}/${slug}`);
                            }}
                          >
                            <span className="fw-medium">{sub.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
      <PricingModal
        show={showPricingModal}
        handleClose={() => setShowPricingModal(false)}
        vendorId={selectedVendorId}
      />
    </>
  );
};

export default ListView;
