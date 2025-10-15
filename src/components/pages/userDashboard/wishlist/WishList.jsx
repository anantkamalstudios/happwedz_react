import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { PiChatCircleDotsLight } from "react-icons/pi";
import PricingModal from "../../../layouts/PricingModal";
import vendorServicesApi from "../../../../services/api/vendorServicesApi";

const Wishlist = () => {
  const token = useSelector((state) => state.auth.token);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  const handleShowModal = (vendorId) => {
    setSelectedVendorId(vendorId);
    setShowModal(true);
  };

  // ✅ Utility to safely get image URL
  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";
    return `https://happywedzbackend.happywedz.com${path}`;
  };

  // ✅ Fetch Wishlist
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
          // For each vendor service ID, fetch full vendor service details
          const enrichedData = await Promise.all(
            data.data.map(async (item) => {
              try {
                const serviceData = await vendorServicesApi.getVendorServiceById(
                  item.vendor_services_id
                );

                const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";
                let imageUrl =
                  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";

                if (serviceData?.media?.gallery?.length > 0) {
                  const validImg = serviceData.media.gallery.find(
                    (img) =>
                      typeof img === "string" && img.startsWith("/uploads/")
                  );
                  if (validImg) imageUrl = `${IMAGE_BASE_URL}${validImg}`;
                }

                return {
                  wishlist_id: item.wishlist_id,
                  vendor_services_id: item.vendor_services_id,
                  businessName:
                    serviceData?.businessName || item.businessName || "Unknown",
                  city: serviceData?.city || item.city || "Unknown",
                  image: imageUrl,
                };
              } catch (err) {
                console.error("Error fetching service:", err);
                return {
                  wishlist_id: item.wishlist_id,
                  vendor_services_id: item.vendor_services_id,
                  businessName: item.businessName || "Unknown",
                  city: item.city || "Unknown",
                  image:
                    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
                };
              }
            })
          );

          setWishlist(enrichedData);
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

  // ✅ Toggle Wishlist (Add / Remove)
  const toggleWishlistItem = async (vendorId) => {
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
      if (result.success) {
        // Refetch wishlist after toggle
        const wishlistRes = await fetch(`https://happywedz.com/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const wishlistData = await wishlistRes.json();
        if (wishlistData.success) {
          const mappedWishlist = (wishlistData.data || []).map((item) => ({
            wishlist_id: item.wishlist_id,
            vendor_services_id: item.vendor_services_id,
            businessName: item.businessName || "Unknown",
            city: item.city || "Unknown",
            image: getImageUrl(item.image?.id),
          }));
          setWishlist(mappedWishlist);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UI Loading / Empty states
  if (loading) {
    return (
      <div className="text-center mt-5">
        <h5>Loading wishlist...</h5>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center mt-5">
        <h5>No items in your wishlist yet.</h5>
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
                className="text-uppercase fw-bold text-muted mb-3"
                style={{ fontSize: "0.85rem" }}
              >
                Your Search
              </h6>
              <input
                type="text"
                className="form-control border-2 rounded-3"
                value="Wedding Services"
                readOnly
                style={{ backgroundColor: "#f8f9fa", fontSize: "0.95rem" }}
              />
            </div>
            <div className="mt-4 pt-4 border-top text-center">
              <div className="fw-bold text-primary fs-4 mb-1">
                {wishlist.length}
              </div>
              <div className="text-muted small">Items in Wishlist</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="col-md-7">
              <h2 className="fw-bold text-dark mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">
                Manage your selected wedding services
              </p>
            </div>
            <div className="col-md-3 justify-content-end d-flex">
            <Link to="/vendors" className="btn btn-primary rounded-3 px-4">
              <BsPlusLg className="me-2" size={18} /> Add Vendor
            </Link>
            </div>
          </div>

          {/* Vendors List */}
          <div className="row g-4">
            {wishlist.map((vendor) => (
              <div
                key={vendor.vendor_services_id}
                className="col-md-6 col-xl-4"
              >
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 wishlist-card">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={vendor.image}
                      alt={vendor.businessName}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <button
                      className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center rounded-circle shadow"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#fff",
                        border: "none",
                      }}
                      onClick={() =>
                        toggleWishlistItem(vendor.vendor_services_id)
                      }
                    >
                      <IoClose size={22} />
                    </button>
                  </div>
                  <div className="card-body p-3 d-flex flex-column">
                    <h5 className="fw-bold text-dark mb-1 fs-6 text-truncate">
                      {vendor.businessName}
                    </h5>
                    <p className="text-muted small mb-3">{vendor.city}</p>

                    <div className="mt-auto">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() =>
                          handleShowModal(vendor.vendor_services_id)
                        }
                      >
                        <PiChatCircleDotsLight className="me-2" size={18} />{" "}
                        Contact Us
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state inside layout */}
          {wishlist.length === 0 && !loading && (
            <div className="text-center py-5 bg-light rounded-4">
              <i
                className="bi bi-heart text-muted"
                style={{ fontSize: "4rem" }}
              ></i>
              <h4 className="fw-bold text-muted my-3">
                Your Wishlist is Empty
              </h4>
              <p className="text-muted mb-4">
                Browse vendors and add your favorites to your wishlist.
              </p>
              <Link to="/vendors" className="btn btn-primary rounded-3 px-4">
                <BsPlusLg className="me-2" /> Browse Vendors
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .wishlist-card .card-img-top {
          transition: transform 0.3s ease;
        }
        .wishlist-card:hover .card-img-top {
          transform: scale(1.05);
        }
      `}</style>

      {/* ✅ Pricing Modal */}
      <PricingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        vendorId={selectedVendorId}
      />
    </div>
  );
};

export default Wishlist;
