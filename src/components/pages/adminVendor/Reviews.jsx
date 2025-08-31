// src/pages/adminvendor/ReviewsPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaEnvelope,
  FaFilter,
  FaEdit,
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";
import "./ReviewsPage.css";

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reviewsFilter, setReviewsFilter] = useState("all");
  const [message, setMessage] = useState(
    "We would appreciate if you could take a moment to share your experience with us. Your feedback helps us improve!"
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [businessName, setBusinessName] = useState("Your Business Name");
  const [editingBusinessName, setEditingBusinessName] = useState(false);

  // Mock data - replace with your actual data source
  const reviewsData = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2023-08-15",
      comment:
        "Absolutely fantastic service! They went above and beyond to make our day special.",
      categories: { quality: 5, value: 4, professionalism: 5 },
      type: "wedding",
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "2023-08-10",
      comment:
        "Good experience overall. The team was professional and responsive.",
      categories: { quality: 4, value: 4, professionalism: 5 },
      type: "corporate",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      rating: 2,
      date: "2023-08-05",
      comment: "Disappointed with the quality. Expected better for the price.",
      categories: { quality: 2, value: 3, professionalism: 4 },
      type: "wedding",
    },
    {
      id: 4,
      name: "David Wilson",
      rating: 5,
      date: "2023-07-28",
      comment: "Outstanding work! Will definitely use their services again.",
      categories: { quality: 5, value: 5, professionalism: 5 },
      type: "event",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      rating: 3,
      date: "2023-07-20",
      comment:
        "Average experience. Some aspects were good, others could improve.",
      categories: { quality: 3, value: 3, professionalism: 4 },
      type: "corporate",
    },
  ];

  // Calculate stats
  const totalReviews = reviewsData.length;
  const averageRating =
    reviewsData.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const positiveReviews = reviewsData.filter(
    (review) => review.rating >= 4
  ).length;
  const negativeReviews = reviewsData.filter(
    (review) => review.rating <= 2
  ).length;

  // Filter reviews based on selected filter
  const filteredReviews = reviewsData.filter((review) => {
    if (reviewsFilter === "all") return true;
    if (reviewsFilter === "positive") return review.rating >= 4;
    if (reviewsFilter === "negative") return review.rating <= 2;
    if (reviewsFilter === "wedding") return review.type === "wedding";
    return review.rating === parseInt(reviewsFilter);
  });

  const sendReviewRequest = (e) => {
    e.preventDefault();
    alert(`Review request sent to: ${recipientEmail}\n\nMessage: ${message}`);
    setRecipientEmail("");
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} className="star filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div className="reviews-page">
      <style>
        {`
          .reviews-page {
            overflow-x: hidden;
            max-width: 100vw;
            display: flex;
            height: 100vh;
          }
          
          .vertical-nav {
            width: 280px;
            min-width: 280px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          
          .main-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            max-width: calc(100vw - 280px);
          }
          
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .reviews-list {
            max-width: 100%;
          }
          
          .review-card {
            max-width: 100%;
            word-wrap: break-word;
          }
          
          @media (max-width: 768px) {
            .reviews-page {
              flex-direction: column;
            }
            
            .vertical-nav {
              width: 100%;
              min-width: 100%;
            }
            
            .main-content {
              max-width: 100vw;
            }
          }
        `}
      </style>

      {/* Vertical Navigation */}
      <div className="vertical-nav">
        <div
          className={`nav-item ${
            activeTab === "dashboard" ? "active zoom-text" : ""
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaStar /> Dashboard
        </div>
        <div
          className={`nav-item ${
            activeTab === "collector" ? "active zoom-text" : ""
          }`}
          onClick={() => setActiveTab("collector")}
        >
          <FaEnvelope /> Review Collector
        </div>
        <div
          className={`nav-item ${
            activeTab === "reviews" ? "active zoom-text" : ""
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          <FaFilter /> Reviews
        </div>
        <div className="business-info">
          <h3>
            {editingBusinessName ? (
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onBlur={() => setEditingBusinessName(false)}
                autoFocus
              />
            ) : (
              <span onClick={() => setEditingBusinessName(true)}>
                {businessName} <FaEdit className="edit-icon" />
              </span>
            )}
          </h3>
          <p>{totalReviews} Reviews</p>
          <div className="overall-rating">
            {renderStars(averageRating)}
            <span>{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="dashboard-view">
            <h2>Reviews Dashboard</h2>
            <div className="stats-container">
              <div className="stat-card">
                <h3>Total Reviews</h3>
                <p className="stat-value">{totalReviews}</p>
              </div>
              <div className="stat-card">
                <h3>Average Rating</h3>
                <div className="rating-display">
                  {renderStars(averageRating)}
                  <span>{averageRating.toFixed(1)}/5</span>
                </div>
              </div>
              <div className="stat-card positive">
                <h3>Positive Reviews</h3>
                <p className="stat-value">{positiveReviews}</p>
              </div>
              <div className="stat-card negative">
                <h3>Negative Reviews</h3>
                <p className="stat-value">{negativeReviews}</p>
              </div>
            </div>

            <div className="recent-reviews">
              <h3>Recent Reviews</h3>
              {reviewsData.slice(0, 3).map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">{review.name.charAt(0)}</div>
                      <div>
                        <h4>{review.name}</h4>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="review-type">{review.type}</div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Collector View */}
        {activeTab === "collector" && (
          <div className="collector-view">
            <h2>Request Reviews</h2>
            <div className="collector-stats">
              <p>
                You've collected <strong>{totalReviews} reviews</strong> so far
              </p>
              <p>Send requests to get more reviews</p>
            </div>

            <div className="request-form">
              <form onSubmit={sendReviewRequest}>
                <div className="form-group">
                  <label>Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="6"
                    placeholder="Your message to the recipient"
                  />
                  <div className="message-preview">
                    <h4>Preview:</h4>
                    <div className="preview-box">
                      <p>Hi there,</p>
                      <p>{message}</p>
                      <p>
                        Thank you,
                        <br />
                        {businessName}
                      </p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="send-button">
                  <FaPaperPlane /> Send Review Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reviews List View */}
        {activeTab === "reviews" && (
          <div className="reviews-view">
            <div className="reviews-header">
              <h2>All Reviews</h2>
              <div className="filters">
                <select
                  value={reviewsFilter}
                  onChange={(e) => setReviewsFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Reviews</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                  <option value="positive">Positive (4+ Stars)</option>
                  <option value="negative">Negative (2- Stars)</option>
                  <option value="wedding">Wedding Reviews</option>
                </select>
              </div>
            </div>

            <div className="reviews-summary">
              <div className="summary-card">
                <h3>Quality</h3>
                <div className="rating-bar">
                  <div className="bar" style={{ width: "85%" }}></div>
                  <span>4.3/5</span>
                </div>
              </div>
              <div className="summary-card">
                <h3>Value</h3>
                <div className="rating-bar">
                  <div className="bar" style={{ width: "78%" }}></div>
                  <span>3.9/5</span>
                </div>
              </div>
              <div className="summary-card">
                <h3>Professionalism</h3>
                <div className="rating-bar">
                  <div className="bar" style={{ width: "92%" }}></div>
                  <span>4.6/5</span>
                </div>
              </div>
            </div>

            <div className="reviews-list">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`review-card ${
                    review.rating <= 2 ? "negative" : ""
                  }`}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="avatar">{review.name.charAt(0)}</div>
                      <div>
                        <h4>{review.name}</h4>
                        <div className="review-meta">
                          <span>{review.date}</span>
                          <span className="review-type">{review.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span>{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>

                  <div className="review-categories">
                    <div>
                      <span>Quality:</span>
                      {renderStars(review.categories.quality)}
                    </div>
                    <div>
                      <span>Value:</span>
                      {renderStars(review.categories.value)}
                    </div>
                    <div>
                      <span>Professionalism:</span>
                      {renderStars(review.categories.professionalism)}
                    </div>
                  </div>

                  <div className="review-actions">
                    <button className="action-btn reply">Reply</button>
                    <button className="action-btn delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
