import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReviewsSidebar from "./subVendors/ReviewsSidebar";
import ReviewsDashboard from "./subVendors/ReviewsDashboard";
import Reviews from "./subVendors/Reviews";
import ReviewsCollector from "./subVendors/ReviewsCollector";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("reviews");
  const { vendor, token: vendorToken } = useSelector(
    (state) => state.vendorAuth
  );

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchReviews(), fetchStats()]);
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();

      const formattedReviews = data.reviews.map((r) => ({
        id: r.id,
        name: r.user?.name || "Anonymous",
        rating: Number(
          (
            (r.rating_quality +
              r.rating_responsiveness +
              r.rating_professionalism +
              r.rating_value +
              r.rating_flexibility) /
            5
          ).toFixed(1)
        ),
        review: r.comment,
        date: new Date(r.createdAt).toLocaleDateString(),
        verified: true,
        reply: r.vendor_reply,
      }));

      setReviews(formattedReviews);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      if (!vendor?.id) return;
      const res = await fetch(
        `${API_BASE_URL}/reviews/vendor/${vendor.id}/average`
      );
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();

      setStats({
        averageRating: parseFloat(data.averageRating) || 0,
        reviewCount: parseInt(data.totalReviews) || 0,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!vendorToken) {
      setError("Vendor not authenticated.");
      setLoading(false);
      return;
    }
    fetchAll();
  }, [vendorToken]);

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/reply/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({ vendor_reply: replyText }),
      });
      if (!res.ok) throw new Error("Failed to submit reply");

      setReviews((prev) =>
        prev.map((rev) =>
          rev.id === reviewId ? { ...rev, reply: replyText } : rev
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
    } catch (err) {
      setError(err.message);
    }
  };

  const totalReviews = stats.reviewCount;
  const averageRating = stats.averageRating;
  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#ffc107" : "#e4e5e9" }}>
        {i < rating ? "★" : "☆"}
      </span>
    ));

  const renderContent = () => {
    if (activeSection === "review-collector") {
      return (
        <div>
          <div className="text-center mb-4">
            <h3>Review Collector</h3>
            <p>Send requests and collect reviews from your clients</p>
          </div>
          <ReviewsCollector />
        </div>
      );
    }

    if (activeSection === "reviews") {
      return (
        <div>
          <div className="text-center mb-5">
            <h3>Wedding Reviews</h3>
            <p>Real experiences from real couples</p>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <ReviewsCardGrid
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
              onReplySubmit={handleReplySubmit}
              onDelete={handleDelete}
              renderStars={renderStars}
            />
          )}
        </div>
      );
    }

    return (
      <div className="text-center py-5">
        <h2>{activeSection} Section</h2>
        <p>Content coming soon...</p>
      </div>
    );
  };

  return (
    <div className="">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 ${sidebarCollapsed ? "d-none" : ""}`}>
          <ReviewsSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content */}
        <div className={`col-md-${sidebarCollapsed ? 12 : 9}`}>
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

// New Component: Reviews Card Grid
const ReviewsCardGrid = ({
  reviews,
  averageRating,
  totalReviews,
  onReplySubmit,
  onDelete,
  renderStars,
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const handleReplyClick = (reviewId, existingReply) => {
    setReplyingTo(reviewId);
    setReplyText(existingReply || "");
  };

  const handleReplyCancel = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const handleReplySubmitLocal = (reviewId) => {
    if (replyText.trim()) {
      onReplySubmit(reviewId, replyText);
      setReplyingTo(null);
      setReplyText("");
    }
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0">{averageRating.toFixed(1)}</h3>
              <div className="mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-muted mb-0">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0">{totalReviews}</h3>
              <p className="text-muted mb-0">Total Reviews</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h3 className="mb-0">{reviews.filter((r) => r.reply).length}</h3>
              <p className="text-muted mb-0">Replies Sent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No reviews yet</p>
        </div>
      ) : (
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{review.name}</h5>
                      <small className="text-muted">{review.date}</small>
                    </div>
                    {review.verified && (
                      <span className="badge bg-success">Verified</span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-2">{renderStars(review.rating)}</div>
                      <strong>{review.rating}</strong>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="card-text mb-3">{review.review}</p>

                  {/* Vendor Reply */}
                  {review.reply && (
                    <div className="alert alert-light border mb-3">
                      <small className="text-muted d-block mb-1">
                        <strong>Your Reply:</strong>
                      </small>
                      <p className="mb-0 small">{review.reply}</p>
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo === review.id && (
                    <div className="mb-3">
                      <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleReplySubmitLocal(review.id)}
                        >
                          Submit Reply
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleReplyCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    {replyingTo !== review.id && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          handleReplyClick(review.id, review.reply)
                        }
                      >
                        {review.reply ? "Edit Reply" : "Reply"}
                      </button>
                    )}

                    {/* Delete button - only show if no reply */}

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(review.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
