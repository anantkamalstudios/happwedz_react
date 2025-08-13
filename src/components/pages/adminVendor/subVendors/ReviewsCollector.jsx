import React, { useState } from "react";

const ReviewsCollector = ({ onSubmitReview }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    title: "",
    review: "",
    serviceType: "",
    eventDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.review && formData.rating) {
      onSubmitReview({
        ...formData,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        verified: Math.random() > 0.5,
      });
      setFormData({
        name: "",
        email: "",
        rating: 5,
        title: "",
        review: "",
        serviceType: "",
        eventDate: "",
      });
    }
  };

  const renderStars = (rating, onClick) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`reviews-collector__star ${index < rating ? "active" : ""}`}
        onClick={() => onClick(index + 1)}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="reviews-collector">
      <div className="reviews-collector__header">
        <h3 className="reviews-collector__title">Share Your Experience</h3>
        <p className="reviews-collector__subtitle">
          Help other couples by sharing your review
        </p>
      </div>

      <form onSubmit={handleSubmit} className="reviews-collector__form">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="reviews-collector__label">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="reviews-collector__input form-control"
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="reviews-collector__label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="reviews-collector__input form-control"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="reviews-collector__label">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="reviews-collector__select form-control"
            >
              <option value="">Select Service</option>
              <option value="Photography">Photography</option>
              <option value="Catering">Catering</option>
              <option value="Decoration">Decoration</option>
              <option value="Venue">Venue</option>
              <option value="Music/DJ">Music/DJ</option>
              <option value="Makeup">Makeup & Hair</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="reviews-collector__label">Event Date</label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="reviews-collector__input form-control"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="reviews-collector__label">Rating *</label>
          <div className="reviews-collector__rating">
            {renderStars(formData.rating, (rating) =>
              setFormData((prev) => ({ ...prev, rating }))
            )}
            <span className="reviews-collector__rating-text">
              ({formData.rating}/5)
            </span>
          </div>
        </div>

        <div className="mb-3">
          <label className="reviews-collector__label">Review Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="reviews-collector__input form-control"
            placeholder="Summarize your experience"
          />
        </div>

        <div className="mb-3">
          <label className="reviews-collector__label">Your Review *</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            className="reviews-collector__textarea form-control"
            rows="4"
            placeholder="Share your detailed experience..."
            required
          />
        </div>

        <button type="submit" className="reviews-collector__submit-btn btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewsCollector;
