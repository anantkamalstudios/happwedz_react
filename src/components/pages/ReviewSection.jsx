import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Button, Card, Modal } from "react-bootstrap";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewModalFlow = ({ vendor }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  // ADDED: State for the review detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Fetch reviews
  useEffect(() => {
    if (vendor?.id) {
      fetch(`${API_BASE_URL}/reviews/vendor/${vendor.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setReviews(data.reviews);
        })
        .catch((err) => console.error("Failed to load reviews:", err));
    }
  }, [vendor]);

  // ADDED: Function to handle "Read More" click
  const handleReadMoreClick = (review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const handleWriteReviewClick = () => {
    if (!user || !token) {
      navigate("/customer-login");
    } else {
      navigate(`/write-review/${vendor.id}`);
    }
  };

  const chunkReviews = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };
  const groupedReviews = chunkReviews(reviews, 3);

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold mb-2">Reviews of {vendor?.businessName}</h3>
          <div className="d-flex align-items-center mb-1">
            <FaStar className="text-warning me-2" size={22} />
            <h4 className="mb-0 fw-bold">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating_quality, 0) /
                    reviews.length
                  ).toFixed(1)
                : "0.0"}{" "}
              <span className="text-dark fw-normal">Excellent</span>
            </h4>
            <span className="text-muted ms-2">• {reviews.length} Reviews</span>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <Button
            color="#ed1173"
            className="fw-semibold"
            style={{ fontSize: "14px", padding: "8px 20px", minWidth: "140px" }}
            onClick={handleWriteReviewClick}
          >
            Write a review
          </Button>
        </div>
      </div>

      {/* Review Carousel */}
      {reviews.length > 0 ? (
        <Carousel interval={null} indicators={false}>
          {groupedReviews.map((group, index) => (
            <Carousel.Item key={index}>
              <div
                className="d-flex justify-content-start gap-4 flex-wrap"
                style={{ position: "relative", zIndex: 2 }}
              >
                {group.map((review) => (
                  <Card
                    key={review.id}
                    className="shadow-sm border rounded-3"
                    style={{ width: "250px" }}
                  >
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        {review.user?.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.firstName}
                            className="rounded-circle me-3"
                            width={50}
                            height={50}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-3"
                            style={{ width: 50, height: 50 }}
                          >
                            {review.user?.name
                              ? review.user.name.charAt(0)
                              : "U"}
                          </div>
                        )}
                        <div>
                          <h6 className="mb-0 fw-bold">
                            {review.user?.name || "Anonymous"}
                          </h6>
                          <small className="text-muted">
                            Sent on{" "}
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      <div className="d-flex align-items-start mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className="me-1"
                            color={
                              i < review.rating_quality ? "#ffc107" : "#e4e5e9"
                            }
                          />
                        ))}
                        <strong className="ms-2">
                          {review.rating_quality.toFixed(1)}
                        </strong>
                      </div>

                      <h6 className="fw-semibold mb-1">{review.title}</h6>
                      <p
                        className="text-muted mb-2"
                        style={{ fontSize: "14px" }}
                      >
                        {review.comment.length > 120
                          ? review.comment.slice(0, 120) + "..."
                          : review.comment}
                      </p>
                      {/* UPDATED: Attach handler to "Read more" link */}
                      <a
                        className="fw-semibold text-decoration-none"
                        onClick={() => handleReadMoreClick(review)}
                        style={{ cursor: "pointer" }}
                      >
                        Read more
                      </a>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p className="text-muted text-center mt-4">
          No reviews yet. Be the first to write one!
        </p>
      )}

      {/* Review Details Modal */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Review Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedReview && (
            <div className="p-3">
              <h6 className="fw-bold mb-1">
                {selectedReview.user?.name || "Anonymous"}
              </h6>
              <small className="text-muted">
                Sent on{" "}
                {new Date(selectedReview.createdAt).toLocaleDateString()}
              </small>
              <h5 className="fw-bold my-3">{selectedReview.title}</h5>
              <p className="text-muted" style={{ lineHeight: "1.6" }}>
                {selectedReview.comment}
              </p>

              <div className="border rounded p-3 bg-light mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>Quality of service</span>
                  <span>
                    <FaStar color="#ffc107" /> {selectedReview.rating_quality}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Response time</span>
                  <span>
                    <FaStar color="#ffc107" />{" "}
                    {selectedReview.rating_responsiveness}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Professionalism</span>
                  <span>
                    <FaStar color="#ffc107" />{" "}
                    {selectedReview.rating_professionalism}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Value</span>
                  <span>
                    <FaStar color="#ffc107" /> {selectedReview.rating_value}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Flexibility</span>
                  <span>
                    <FaStar color="#ffc107" />{" "}
                    {selectedReview.rating_flexibility}
                  </span>
                </div>
              </div>

              {/* Media */}
              <div className="mb-4">
                <strong className="d-block mb-2">Media:</strong>
                <div className="d-flex flex-wrap">
                  {selectedReview.media && selectedReview.media.length > 0 ? (
                    selectedReview.media.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl}
                        alt="review"
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          marginRight: 8,
                          marginBottom: 8,
                          borderRadius: 8,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    ))
                  ) : (
                    <span className="text-muted">No images</span>
                  )}
                </div>
              </div>

              {selectedReview.vendor_reply && (
                <div className="bg-light border rounded p-3 mt-4">
                  <h6 className="text-uppercase text-muted fw-semibold mb-2">
                    Vendor's Reply:
                  </h6>
                  <p className="mb-0" style={{ whiteSpace: "pre-line" }}>
                    {selectedReview.vendor_reply}
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewModalFlow;
