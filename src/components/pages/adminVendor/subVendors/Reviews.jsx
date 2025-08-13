import React, { useState } from "react";

const Reviews = ({ reviews }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`reviews__star ${index < rating ? "filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const filteredAndSortedReviews = reviews
    .filter(
      (review) =>
        filterRating === "all" || review.rating === parseInt(filterRating)
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  const distribution = getRatingDistribution();

  return (
    <div className="reviews">
      <div className="reviews__header">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h3 className="reviews__title">
              Customer Reviews ({reviews.length})
            </h3>
            <div className="reviews__summary">
              <div className="reviews__average">
                <span className="reviews__average-score">
                  {getAverageRating()}
                </span>
                <div className="reviews__average-stars">
                  {renderStars(Math.round(getAverageRating()))}
                </div>
                <span className="reviews__average-text">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="reviews__rating-breakdown">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="reviews__rating-row">
                  <span className="reviews__rating-label">{rating}★</span>
                  <div className="reviews__rating-bar">
                    <div
                      className="reviews__rating-fill"
                      style={{
                        width: `${
                          reviews.length
                            ? (distribution[rating] / reviews.length) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="reviews__rating-count">
                    ({distribution[rating]})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="reviews__filters">
        <div className="row">
          <div className="col-md-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="reviews__filter-select form-control"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
          <div className="col-md-6">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="reviews__filter-select form-control"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="reviews__list">
        {filteredAndSortedReviews.length > 0 ? (
          filteredAndSortedReviews.map((review) => (
            <div key={review.id} className="reviews__item">
              <div className="reviews__item-header">
                <div className="reviews__user-info">
                  <div className="reviews__avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviews__user-details">
                    <h5 className="reviews__user-name">
                      {review.name}
                      {review.verified && (
                        <span className="reviews__verified">✓ Verified</span>
                      )}
                    </h5>
                    <div className="reviews__meta">
                      <span className="reviews__date">{review.date}</span>
                      {review.serviceType && (
                        <span className="reviews__service">
                          {" "}
                          • {review.serviceType}
                        </span>
                      )}
                      {review.eventDate && (
                        <span className="reviews__event-date">
                          {" "}
                          • Event: {review.eventDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="reviews__rating-display">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.title && (
                <h6 className="reviews__review-title">{review.title}</h6>
              )}

              <p className="reviews__review-text">{review.review}</p>

              <div className="reviews__actions">
                <button className="reviews__action-btn">👍 Helpful</button>
                <button className="reviews__action-btn">💬 Reply</button>
              </div>
            </div>
          ))
        ) : (
          <div className="reviews__empty">
            <p>No reviews match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
