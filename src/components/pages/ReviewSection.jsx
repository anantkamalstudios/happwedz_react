// ReviewSection.jsx
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewSection = ({ vendor }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [experience, setExperience] = useState("");
  const [spent, setSpent] = useState("");
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...filePreviews]);
  };

  const handleSubmit = () => {
    if (!rating || !experience) {
      alert("Please give a rating and write your experience.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating,
      experience,
      spent,
      images,
      user: "You",
      date: new Date().toLocaleDateString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    // Reset form
    setRating(0);
    setExperience("");
    setSpent("");
    setImages([]);
  };

  return (
    <div className="container">
      <div className="card border-0 rounded-4 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Write a Review</h5>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label">Rate Vendor</label>
            <div>
              {[...Array(5)].map((_, i) => {
                const star = i + 1;
                return (
                  <FaStar
                    key={i}
                    size={28}
                    style={{ cursor: "pointer", marginRight: 4 }}
                    color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                );
              })}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-3">
            <label className="form-label">Tell Your Experience</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Share details about your experience..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          {/* Spent Money */}
          <div className="mb-3">
            <label className="form-label">Approx. Money Spent</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount in INR"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
            />
          </div>

          {/* Upload Images */}
          <div className="mb-3">
            <label className="form-label">Upload Images</label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="d-flex flex-wrap mt-2">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="preview"
                  className="me-2 mb-2"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Review
          </button>
        </div>

        {/* Show Reviews */}
        {reviews.length > 0 && (
          <div className="card-body border-top">
            <h6 className="fw-bold mb-3">User Reviews</h6>
            {reviews.map((r) => (
              <div key={r.id} className="mb-3">
                <div className="d-flex align-items-center mb-1">
                  <strong>{r.user}</strong>
                  <span className="ms-2 text-warning">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} size={16} />
                    ))}
                  </span>
                  <small className="text-muted ms-2">{r.date}</small>
                </div>
                <p className="mb-1">{r.experience}</p>
                {r.spent && (
                  <p className="text-muted small mb-1">Spent: ₹{r.spent}</p>
                )}
                <div className="d-flex flex-wrap">
                  {r.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="review"
                      className="me-2 mb-2"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ))}
                </div>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
