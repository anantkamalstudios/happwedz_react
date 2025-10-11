import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewModalFlow = ({ vendor }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    rating_quality: 0,
    rating_responsiveness: 0,
    rating_professionalism: 0,
    rating_value: 0,
    rating_flexibility: 0,
    title: "",
    comment: "",
    happywedz_helped: "yes",
    guest_count: "",
    spent: "",
  });
  const [hover, setHover] = useState({});
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleWriteReviewClick = () => {
    if (!user || !token) {
      navigate("/customer-login");
    } else {
      setShowModal(true);
      setStep(1);
    }
  };

  const handleStarClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleSubmit = async () => {
    if (
      !formData.title ||
      !formData.comment ||
      Object.values(formData)
        .slice(0, 5)
        .some((val) => val === 0)
    ) {
      toast.error("Please fill in all required fields and ratings.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append("media", img.file));

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/reviews/${vendor.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit.");

      toast.success("Review submitted successfully!");
      setShowModal(false);
      setImages([]);
      setFormData({
        rating_quality: 0,
        rating_responsiveness: 0,
        rating_professionalism: 0,
        rating_value: 0,
        rating_flexibility: 0,
        title: "",
        comment: "",
        happywedz_helped: "yes",
        guest_count: "",
        spent: "",
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const RatingInput = ({ label, field }) => (
    <div className="col-md-6 mb-4">
      <label className="form-label fw-semibold">{label}</label>
      <div className="d-flex gap-2">
        {[...Array(5)].map((_, i) => {
          const star = i + 1;
          return (
            <FaStar
              key={i}
              size={30}
              className="star-icon"
              color={
                star <= (hover[field] || formData[field])
                  ? "#ffc107"
                  : "#e4e5e9"
              }
              onClick={() => handleStarClick(field, star)}
              onMouseEnter={() => setHover({ ...hover, [field]: star })}
              onMouseLeave={() => setHover({ ...hover, [field]: 0 })}
            />
          );
        })}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="row">
            <RatingInput label="Quality" field="rating_quality" />
            <RatingInput label="Responsiveness" field="rating_responsiveness" />
            <RatingInput
              label="Professionalism"
              field="rating_professionalism"
            />
            <RatingInput label="Value" field="rating_value" />
            <RatingInput label="Flexibility" field="rating_flexibility" />
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Amazing Experience"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Comment</label>
              <textarea
                name="comment"
                rows="3"
                className="form-control"
                placeholder="Write about your experience..."
                value={formData.comment}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control"
              />
              <div className="d-flex flex-wrap mt-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.preview}
                    alt="preview"
                    className="preview-img me-2 mb-2"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Guests</label>
              <input
                type="number"
                name="guest_count"
                className="form-control"
                value={formData.guest_count}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Spent (₹)</label>
              <input
                type="number"
                name="spent"
                className="form-control"
                value={formData.spent}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 review-section container">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">{vendor?.businessName}</h4>
        <button
          onClick={handleWriteReviewClick}
          className="btn btn-primary btn-lg px-4"
        >
          Write a Review
        </button>
      </div>

      {showModal && (
        <div className="custom-modal">
          <div
            className="modal-content-custom p-4"
            style={{ maxWidth: 700, margin: "0 auto" }}
          >
            <h4 className="text-center mb-4">Step {step} of 3</h4>
            {renderStepContent()}
            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-secondary px-4"
                onClick={() =>
                  step === 1 ? setShowModal(false) : setStep(step - 1)
                }
              >
                Back
              </button>
              {step === 3 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn btn-primary px-4"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              ) : (
                <button
                  className="btn btn-primary px-4"
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModalFlow;
