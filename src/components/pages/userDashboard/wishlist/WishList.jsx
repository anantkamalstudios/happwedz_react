import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { FaCheck, FaHeart } from "react-icons/fa6";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const WishlistPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [vendors, setVendors] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 4;

  // Fetch vendors from API
  useEffect(() => {
    if (!token) return;
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://happywedz.com/api/vendor?page=${currentPage}&limit=${vendorsPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setVendors(data.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchVendors();
  }, [token, currentPage]);

  // Fetch wishlist from API
  useEffect(() => {
    if (!token || !userId) return;
    const fetchWishlist = async () => {
      try {
        const res = await fetch(
          `https://happywedz.com/api/wishlist/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success) setWishlist(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [token, userId]);

  const addToWishlist = async (vendor) => {
    if (wishlist.find((w) => w.vendor_id === vendor.id)) return;
    try {
      const res = await fetch("https://happywedz.com/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          vendor_id: vendor.id,
          title: vendor.title,
          subtitle: vendor.subtitle,
          pricing: vendor.pricing,
          phone: vendor.phone,
        }),
      });
      const data = await res.json();
      if (data.success) setWishlist([...wishlist, data.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const res = await fetch(`https://happywedz.com/api/wishlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setWishlist(wishlist.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const updateWishlistField = async (id, field, value) => {
    try {
      const res = await fetch(`https://happywedz.com/api/wishlist/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.success)
        setWishlist(
          wishlist.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          )
        );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNoteInput = (id) => {
    setShowNoteInput({ ...showNoteInput, [id]: !showNoteInput[id] });
  };

  const updateNote = (id, newNote) => updateWishlistField(id, "note", newNote);
  const updateRating = (id, newRating) =>
    updateWishlistField(id, "rating", newRating);
  const updateStatus = (id, status) =>
    updateWishlistField(id, "status", status);
  const updatePricing = (id, pricing) =>
    updateWishlistField(id, "pricing", pricing);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Not Available":
        return "bg-danger";
      case "Evaluating":
        return "bg-warning";
      case "Preselecting":
        return "bg-info";
      case "Negotiation":
        return "bg-primary";
      case "Hired":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

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
            <div>
              <h2 className="fw-bold text-dark mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">
                Manage your selected wedding services
              </p>
            </div>
            <Link to="/vendors" className="btn btn-primary rounded-3 px-4">
              <BsPlusLg className="me-2" size={18} /> Add Vendor
            </Link>
          </div>

          {/* Vendors List */}
          <div className="row g-4">
            {loading && <p>Loading vendors...</p>}
            {!loading &&
              wishlist.map((vendor) => (
                <div key={vendor.id} className="col-xl-6 col-12">
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                    <div className="position-relative">
                      <img
                        src={
                          vendor.image || "https://via.placeholder.com/400x220"
                        }
                        alt={vendor.title}
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
                        onClick={() => removeFromWishlist(vendor.id)}
                      >
                        <IoClose size={22} />
                      </button>
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span
                          className={`badge ${getStatusBadgeClass(
                            vendor.status
                          )} px-3 py-2 rounded-pill`}
                        >
                          {vendor.status || "Evaluating"}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <h5 className="fw-bold text-dark mb-2">{vendor.title}</h5>
                      <p className="text-muted mb-2">{vendor.subtitle}</p>

                      {/* Status & Rating */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted small mb-2">
                          STATUS
                        </label>
                        <select
                          className="form-select border-2 rounded-3"
                          value={vendor.status || "Evaluating"}
                          onChange={(e) =>
                            updateStatus(vendor.id, e.target.value)
                          }
                        >
                          <option>Not Available</option>
                          <option>Evaluating</option>
                          <option>Preselecting</option>
                          <option>Negotiation</option>
                          <option>Hired</option>
                        </select>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-7">
                          <label className="form-label fw-semibold text-muted small mb-2">
                            WHAT DO YOU THINK
                          </label>
                          <div className="d-flex align-items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className="btn btn-sm p-0 me-1 border-0 bg-transparent"
                                onClick={() => updateRating(vendor.id, star)}
                              >
                                <FaHeart
                                  size={20}
                                  color={
                                    star <= (vendor.rating || 0)
                                      ? "red"
                                      : "#ccc"
                                  }
                                  style={{
                                    cursor: "pointer",
                                    transition: "0.2s",
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="col-5">
                          <label className="form-label fw-semibold text-muted small mb-2">
                            PRICING
                          </label>
                          <input
                            type="text"
                            className="form-control border-2 rounded-3"
                            value={vendor.pricing || ""}
                            onChange={(e) =>
                              updatePricing(vendor.id, e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-semibold text-muted small mb-0">
                            NOTES
                          </label>
                          <button
                            className="btn btn-primary rounded-pill px-3 d-flex align-items-center"
                            onClick={() => toggleNoteInput(vendor.id)}
                          >
                            {showNoteInput[vendor.id] ? (
                              <>
                                <MdOutlineCancel size={15} className="me-2" />{" "}
                                Cancel
                              </>
                            ) : (
                              <>
                                <GoPlus size={15} className="me-2" /> Add Note
                              </>
                            )}
                          </button>
                        </div>
                        {showNoteInput[vendor.id] ? (
                          <div className="d-flex gap-2 mt-3">
                            <input
                              type="text"
                              className="form-control border-2 rounded-3"
                              defaultValue={vendor.note || ""}
                              placeholder="Add your note..."
                              onKeyPress={(e) => {
                                if (e.key === "Enter")
                                  updateNote(vendor.id, e.target.value);
                              }}
                            />
                            <button
                              className="btn btn-primary rounded-2"
                              onClick={(e) => {
                                const input = e.target.previousElementSibling;
                                updateNote(vendor.id, input.value);
                              }}
                            >
                              <FaCheck size={10} />
                            </button>
                          </div>
                        ) : (
                          vendor.note && (
                            <div className="bg-light rounded-3 p-3">
                              <p
                                className="mb-0 text-muted"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {vendor.note}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-light border-0 p-4">
                      <div className="d-flex justify-content-center align-items-center text-center">
                        <button
                          className="btn btn-primary rounded-3 px-4"
                          onClick={() => navigate("/user-dashboard/message")}
                        >
                          <PiChatCircleDotsLight className="me-2" size={18} />{" "}
                          Connect Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {wishlist.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <i
                  className="bi bi-heart text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h4 className="fw-bold text-muted mb-3">
                Your wishlist is empty
              </h4>
              <p className="text-muted mb-4">
                Start adding vendors to keep track of your wedding planning
              </p>
              <button className="btn btn-primary rounded-3 px-4">
                <BsPlusLg className="me-2" size={18} /> Browse Vendors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
