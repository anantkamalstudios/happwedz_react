// ReviewSection.jsx
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewSection = ({ vendor }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [experience, setExperience] = useState("");
  const [spent, setSpent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Fetch existing reviews for the vendor
  useEffect(() => {
    if (!vendor?.id) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews/${vendor.id}`);
        if (!response.ok) {
          // Don't throw an error if no reviews are found (404), just show an empty list.
          if (response.status !== 404) {
            throw new Error("Failed to fetch reviews.");
          }
          return;
        }
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchReviews();
  }, [vendor?.id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImageObjects = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImageObjects]);
  };

  const handleSubmit = async () => {
    if (!rating || !experience) {
      toast.error("Please give a rating and write your experience.");
      return;
    }

    if (!user || !token) {
      toast.error("You must be logged in to write a review.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("vendor_id", vendor.id);
    formData.append("user_id", user.id);
    formData.append("rating", rating);
    formData.append("comment", experience);

    // Append each image file to the 'media' field
    images.forEach((imageObj) => {
      formData.append("media", imageObj.file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          // The browser will set the 'Content-Type' to 'multipart/form-data' automatically
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review.");
      }

      toast.success("Review submitted successfully!");

      // Add to local state for immediate feedback
      const newReview = {
        vendor_id: vendor.id,
        user_id: user.id,
        rating,
        id: result.review?.id || Date.now(),
        user: user.name,
        date: new Date().toLocaleDateString(),
        comment: experience,
        images: [],
      };
      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setRating(0);
      setExperience("");
      setSpent("");
      setImages([]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer position="top-center" autoClose={3000} />
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
                  key={img.preview + idx}
                  src={img.preview}
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
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Show Reviews */}
        {reviews.length > 0 && (
          <div className="card-body border-top">
            <h6 className="fw-bold mb-3">User Reviews</h6>
            {reviews.map((r) => (
              <div key={r.id} className="mb-3">
                <div className="d-flex align-items-center mb-1 flex-wrap">
                  <strong>{r.user?.name || r.user || "Anonymous"}</strong>
                  <span className="ms-2 text-warning">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </span>
                  <small className="text-muted ms-2">{r.date}</small>
                </div>
                <p className="mb-1">{r.comment || r.experience}</p>
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
                </div>{" "}
                */}
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
