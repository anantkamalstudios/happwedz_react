import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { FaSearch } from "react-icons/fa";
import PricingModal from "../../../layouts/PricingModal";
import vendorServicesApi from "../../../../services/api/vendorServicesApi";

const Wishlist = () => {
  const token = useSelector((state) => state.auth.token);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleShowModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowModal(true);
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/imageNotFound.jpg";
    return `${path}`;
  };

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://happywedz.com/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data.length > 0) {
          const enrichedData = await Promise.all(
            data.data
              .filter(
                (item) =>
                  item.vendor_services_id &&
                  item.vendor_services_id !== "undefined" &&
                  item.vendor_services_id !== undefined
              )
              .map(async (item) => {
                try {
                  const serviceId = parseInt(item.vendor_services_id);
                  if (isNaN(serviceId) || serviceId <= 0) {
                    throw new Error(
                      `Invalid vendor_services_id: ${item.vendor_services_id}`
                    );
                  }

                  const serviceData =
                    await vendorServicesApi.getVendorServiceById(serviceId);

                  return {
                    wishlist_id: item.wishlist_id,
                    vendor_services_id: item.vendor_services_id,
                    businessName:
                      serviceData?.vendor?.businessName ||
                      serviceData?.attributes?.name ||
                      "Unknown Vendor",
                    city:
                      serviceData?.location?.city ||
                      serviceData?.attributes?.city ||
                      "Unknown City",
                    image: getImageUrl(
                      serviceData?.media?.[0] ||
                        serviceData?.attributes?.cover_image ||
                        serviceData?.cover_image ||
                        serviceData?.image ||
                        null
                    ),
                  };
                } catch (err) {
                  console.error("Error fetching service:", err);
                  return {
                    wishlist_id: item.wishlist_id,
                    vendor_services_id: item.vendor_services_id,
                    businessName: item.businessName || "Unknown",
                    city: "Unknown",
                    image: "/images/imageNotFound.jpg",
                  };
                }
              })
          );

          // Filter out any null/undefined values in case of errors
          const validData = enrichedData.filter(
            (item) => item !== null && item !== undefined
          );
          setWishlist(validData);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [token]);

  const toggleWishlistItem = async (vendorId) => {
    const originalWishlist = [...wishlist];
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.vendor_services_id !== vendorId)
    );

    try {
      const response = await fetch(
        "https://happywedz.com/api/wishlist/toggle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vendor_services_id: vendorId }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        setWishlist(originalWishlist);
        console.error("Failed to remove item from wishlist:", result.message);
      }
    } catch (err) {
      setWishlist(originalWishlist);
      console.error("Error toggling wishlist item:", err);
    }
  };

  const filteredWishlist = useMemo(() => {
    if (!searchTerm) {
      return wishlist;
    }
    return wishlist.filter(
      (vendor) =>
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [wishlist, searchTerm]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h5>Loading wishlist...</h5>
      </div>
    );
  }

  if (wishlist.length === 0 && !loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5 bg-light rounded-4 shadow-sm">
          <i
            className="bi bi-heart text-muted"
            style={{ fontSize: "4rem" }}
          ></i>
          <h4 className="fw-bold text-dark my-3">Your Wishlist is Empty</h4>
          <p className="text-muted mb-4">
            Browse vendors and add your favorites to your wishlist.
          </p>
          <Link to="/vendors" className="btn btn-primary rounded-3 px-4">
            <BsPlusLg className="me-2" /> Browse Vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div
            className="bg-white rounded-4 shadow-sm border-0 p-4 sticky-top"
            style={{ top: "20px" }}
          >
            <div className="mb-4">
              <h6
                className="text-uppercase fw-bold text-dark mb-3"
                style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
              >
                Filter Wishlist
              </h6>
              <div className="position-relative">
                <FaSearch
                  className="position-absolute text-muted"
                  style={{ top: "12px", left: "12px", fontSize: "14px" }}
                />
                <input
                  type="text"
                  className="form-control border-2 rounded-3 ps-5"
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: "#f8f9fa",
                    fontSize: "0.95rem",
                    border: "1px solid #e0e0e0",
                  }}
                />
              </div>
            </div>
            <div className="mt-4 pt-4 border-top text-center">
              <div className="fw-bold primary-text fs-3 mb-1">
                {wishlist.length}
              </div>
              <div className="text-muted small">Items in Wishlist</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">
                Manage your selected wedding services
              </p>
            </div>
            <div>
              <Link
                to="/vendors"
                className="btn btn-primary rounded-3 px-4 py-2"
              >
                <BsPlusLg className="me-2" size={16} /> Add Vendor
              </Link>
            </div>
          </div>

          {/* Vendors Grid - 2 columns per row */}
          <div className="row g-4">
            {filteredWishlist.map((vendor) => (
              <div key={vendor.vendor_services_id} className="col-md-6">
                <div className="wishlist-card-container">
                  {/* Image Section with Remove Button */}
                  <div className="wishlist-image-wrapper">
                    <img
                      src={vendor.image}
                      alt={vendor.businessName}
                      className="wishlist-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/imageNotFound.jpg";
                      }}
                    />
                    <button
                      className="wishlist-remove-btn"
                      onClick={() =>
                        toggleWishlistItem(vendor.vendor_services_id)
                      }
                      aria-label="Remove from wishlist"
                    >
                      <IoClose size={20} />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="wishlist-content">
                    <h5 className="wishlist-title">{vendor.businessName}</h5>
                    <p className="wishlist-location">
                      <i className="bi bi-geo-alt me-1"></i>
                      {vendor.city.length > 30
                        ? `${vendor.city.substring(0, 30)}...`
                        : vendor.city}
                    </p>

                    <button
                      className="btn btn-primary w-100 rounded-3 py-2"
                      style={{ marginTop: "auto" }}
                      onClick={() => handleShowModal(vendor.vendor_services_id)}
                    >
                      <PiChatCircleDotsLight className="me-2" size={18} />
                      Contact Vendor
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {wishlist.length > 0 && filteredWishlist.length === 0 && (
            <div className="text-center py-5 bg-light rounded-4 mt-4">
              <FaSearch className="text-muted mb-3" size={40} />
              <h5 className="fw-bold text-dark">No Vendors Found</h5>
              <p className="text-muted">
                No items in your wishlist match your search for "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </div>

      <PricingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        vendorId={selectedVendorId}
      />
    </div>
  );
};

export default Wishlist;
