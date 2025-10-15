import React, { useEffect, useMemo, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import useApiData from "../../../../hooks/useApiData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";

const toSlug = (text) =>
  (text || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

const VenueVendorComponent = ({ type = "vendor" }) => {
  const isVendorBox = type === "vendor";

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Venue subcategories (for venues box only)
  const [venueSubcategories, setVenueSubcategories] = useState([]);
  const [loadingVenueCats, setLoadingVenueCats] = useState(false);

  const BACKEND_BASE_URL = "https://happywedzbackend.happywedz.com";
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (typeof path !== "string") return null;
    if (path.startsWith("http")) return path;
    const clean = path.replace(/^\/?uploads\/?/, "");
    return `${BACKEND_BASE_URL}/uploads/${clean}`;
  };

  useEffect(() => {
    if (!isVendorBox) return;
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch("https://happywedz.com/api/vendor-subcategories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load vendor subcategories", e);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [isVendorBox]);

  const { data: vendorItems, loading: loadingVendors } = useApiData(
    isVendorBox ? "vendors" : null,
    isVendorBox ? selectedSlug : null,
    null,
    null
  );

  return (
    <div
      style={{
        maxWidth: "100%",
        boxShadow:
          " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        flex: 1,
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2>{isVendorBox ? "Book all your Vendors" : "Find the perfect Venue"}</h2>

        <div className="d-flex justify-content-around align-items-center">
          <h5 style={{ width: "66%" }}>
            Here are some gems we recommand for you
          </h5>

          {isVendorBox && (
            <div
              style={{
                width: "30%",
                border: "2px solid #C31162",
                borderColor: "#C31162",
                outline: "none",
              }}
            >
              <select
                name="vendors"
                id="vendor"
                style={{ border: "2px solid transparent", width: "100%", padding: "8px" }}
                value={selectedSlug || ""}
                onChange={(e) => setSelectedSlug(e.target.value || null)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={toSlug(cat.name)}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {isVendorBox ? (
          <div
            className="d-flex justify-content-around align-items-center"
            style={{ position: "relative", minHeight: "220px" }}
          >
            {/* Cards - use old card layout, populate from API */}
            {(selectedSlug ? vendorItems : []).slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="card border-0 shadow-sm overflow-hidden p-2"
                style={{ maxWidth: "30%" }}
              >
                <div>
                  <img
                    src={
                      buildImageUrl(item.image) ||
                      "https://images.unsplash.com/photo-1759528278887-71c168973ad1?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    className="card-img-top w-100"
                    alt={item.name || "Vendor"}
                    style={{
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0">{item.name || "Name"}</h5>
                    <p className="rating text-warning small mb-0 mt-1">
                      ★
                      <span className="text-muted">
                        {(item.rating || 0).toFixed ? (item.rating || 0).toFixed(1) : item.rating || 0} (
                        {item.review_count || 0} Reviews)
                      </span>
                    </p>
                  </div>
                  <p
                    className=" mb-3"
                    style={{
                      color: "black",
                      fontSize: "12px",
                    }}
                  >
                    {item.location || item.city || "location, state"}
                  </p>
                </div>
              </div>
            ))}

            {/* Arrows overlay (visual only) */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <FaAngleLeft
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
              <FaAngleRight
                style={{
                  height: "25px",
                  width: "25px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
            </div>

            {/* Empty state when no category selected */}
            {!selectedSlug && (
              <div className="text-muted" style={{ position: "absolute", bottom: 0, fontSize: "14px" }}>
                {loadingCategories ? "Loading categories..." : "Choose a category to see recommendations."}
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: "0.5rem" }}>
            <VenueSwiper />
          </div>
        )}

        {isVendorBox && (
          <div
            style={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}
          >
            <button
              style={{
                padding: "5px 3.5rem",
                border: "1px solid #C31162",
                backgroundColor: "#C31162",
                color: "#fff",
                fontWeight: 600,
                borderRadius: "10px",
              }}
              disabled={!selectedSlug || loadingVendors}
            >
              {loadingVendors ? "Loading..." : "Search"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueVendorComponent;

// Separate component to keep main component lean
const VenueSwiper = () => {
  const [venueSubcategories, setVenueSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        const venues = data.find(
          (vendor) => vendor.name && vendor.name.toLowerCase() === "venues"
        );
        if (venues && Array.isArray(venues.subcategories)) {
          setVenueSubcategories(venues.subcategories);
        } else {
          setVenueSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setVenueSubcategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcategories();
  }, []);

  if (loading) {
    return <div className="text-muted" style={{ fontSize: "14px" }}>Loading venues...</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={16}
      slidesPerView={1.2}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      breakpoints={{
        576: { slidesPerView: 2.2, spaceBetween: 16 },
        768: { slidesPerView: 3.2, spaceBetween: 16 },
        992: { slidesPerView: 4.2, spaceBetween: 16 },
        1200: { slidesPerView: 5.2, spaceBetween: 16 },
      }}
    >
      {venueSubcategories.map((sub) => {
        const slug = toSlug(sub.name);
        return (
          <SwiperSlide key={sub.id}>
            <Link
              to={`/venues/${slug}`}
              className="text-decoration-none"
              style={{ color: "inherit" }}
            >
              <div className="card border-0 shadow-sm overflow-hidden p-2 h-100">
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "120px", background: "#f8f9fa", borderRadius: "12px" }}
                >
                  <span className="fw-semibold text-dark" style={{ fontSize: "14px" }}>
                    {sub.name}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
