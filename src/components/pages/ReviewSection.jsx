// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel, Button, Card } from "react-bootstrap";

// const API_BASE_URL = "https://happywedz.com/api";

// const ReviewModalFlow = ({ vendor }) => {
//   const { user, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [reviews, setReviews] = useState([]);
//   const [formData, setFormData] = useState({
//     rating_quality: 0,
//     rating_responsiveness: 0,
//     rating_professionalism: 0,
//     rating_value: 0,
//     rating_flexibility: 0,
//     title: "",
//     comment: "",
//     happywedz_helped: "yes",
//     guest_count: "",
//     spent: "",
//   });
//   const [hover, setHover] = useState({});
//   const [images, setImages] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch reviews
//   useEffect(() => {
//     if (vendor?.id) {
//       fetch(`${API_BASE_URL}/reviews/vendor/${vendor.id}`)
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success) setReviews(data.reviews);
//         })
//         .catch((err) => console.error("Failed to load reviews:", err));
//     }
//   }, [vendor]);

//   const handleWriteReviewClick = () => {
//     if (!user || !token) {
//       navigate("/customer-login");
//     } else {
//       setShowModal(true);
//       setStep(1);
//     }
//   };

//   const handleStarClick = (field, value) =>
//     setFormData({ ...formData, [field]: value });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImgs = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages((prev) => [...prev, ...newImgs]);
//   };

//   const requiredRatings = [
//     "rating_quality",
//     "rating_responsiveness",
//     "rating_professionalism",
//     "rating_value",
//     "rating_flexibility",
//   ];

//   const handleSubmit = async () => {
//     // Validate required fields
//     const emptyRating = requiredRatings.some(
//       (field) => !formData[field] || formData[field] === 0
//     );

//     if (!formData.title.trim() || !formData.comment.trim() || emptyRating) {
//       toast.error("Please fill in all required fields and ratings.");
//       return;
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => data.append(key, value));
//     images.forEach((img) => data.append("media", img.file));

//     try {
//       setSubmitting(true);
//       const response = await fetch(`${API_BASE_URL}/reviews/${vendor.id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: data,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || "Failed to submit.");

//       toast.success("Review submitted successfully!");
//       setShowModal(false);

//       // Reset form
//       setFormData({
//         rating_quality: 0,
//         rating_responsiveness: 0,
//         rating_professionalism: 0,
//         rating_value: 0,
//         rating_flexibility: 0,
//         title: "",
//         comment: "",
//         happywedz_helped: "yes",
//         guest_count: "",
//         spent: "",
//       });
//       setImages([]);

//       // Refetch reviews
//       const refreshed = await fetch(
//         `${API_BASE_URL}/reviews/vendor/${vendor.id}`
//       ).then((r) => r.json());
//       if (refreshed.success) setReviews(refreshed.reviews);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const RatingInput = ({ label, field }) => (
//     <div className="col-md-6 mb-4">
//       <label className="form-label fw-semibold">{label}</label>
//       <div className="d-flex gap-2">
//         {[...Array(5)].map((_, i) => {
//           const star = i + 1;
//           return (
//             <FaStar
//               key={i}
//               size={30}
//               color={
//                 star <= (hover[field] || formData[field])
//                   ? "#ffc107"
//                   : "#e4e5e9"
//               }
//               onClick={() => handleStarClick(field, star)}
//               onMouseEnter={() => setHover({ ...hover, [field]: star })}
//               onMouseLeave={() => setHover({ ...hover, [field]: 0 })}
//               style={{ cursor: "pointer" }}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );

//   const chunkReviews = (arr, size) => {
//     const result = [];
//     for (let i = 0; i < arr.length; i += size)
//       result.push(arr.slice(i, i + size));
//     return result;
//   };
//   const groupedReviews = chunkReviews(reviews, 3);

//   return (
//     <div className="container my-5">
//       <ToastContainer position="top-center" autoClose={3000} />

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//         <div>
//           <h3 className="fw-bold mb-2">Reviews of {vendor?.businessName}</h3>
//           <div className="d-flex align-items-center mb-1">
//             <FaStar className="text-warning me-2" size={22} />
//             <h4 className="mb-0 fw-bold">
//               {reviews.length > 0
//                 ? (
//                     reviews.reduce((sum, r) => sum + r.rating_quality, 0) /
//                     reviews.length
//                   ).toFixed(1)
//                 : "0.0"}{" "}
//               <span className="text-dark fw-normal">Excellent</span>
//             </h4>
//             <span className="text-muted ms-2">• {reviews.length} Reviews</span>
//           </div>
//         </div>

//         <div className="d-flex align-items-center">
//           <Button
//             variant="danger"
//             className="fw-semibold"
//             style={{ fontSize: "14px", padding: "8px 20px", minWidth: "140px" }}
//             onClick={handleWriteReviewClick}
//           >
//             Write a review
//           </Button>
//         </div>
//       </div>

//       {/* Review Carousel */}
//       {reviews.length > 0 ? (
//         <Carousel interval={null} indicators={false}>
//           {groupedReviews.map((group, index) => (
//             <Carousel.Item key={index}>
//               <div className="d-flex justify-content-center gap-4 flex-wrap">
//                 {group.map((review) => (
//                   <Card
//                     key={review.id}
//                     className="shadow-sm border rounded-3"
//                     style={{ width: "300px" }}
//                   >
//                     <Card.Body>
//                       <div className="d-flex align-items-center mb-3">
//                         {review.user?.image ? (
//                           <img
//                             src={review.user.image}
//                             alt={review.user.firstName}
//                             className="rounded-circle me-3"
//                             width={50}
//                             height={50}
//                           />
//                         ) : (
//                           <div
//                             className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-3"
//                             style={{ width: 50, height: 50 }}
//                           >
//                             {review.user?.name
//                               ? review.user.name.charAt(0)
//                               : "U"}
//                           </div>
//                         )}
//                         <div>
//                           <h6 className="mb-0 fw-bold">
//                             {review.user?.name || "Anonymous"}
//                           </h6>
//                           <small className="text-muted">
//                             Sent on{" "}
//                             {new Date(review.createdAt).toLocaleDateString()}
//                           </small>
//                         </div>
//                       </div>

//                       <div className="d-flex align-items-start mb-2">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <FaStar
//                             key={i}
//                             className="me-1"
//                             color={
//                               i < review.rating_quality ? "#ffc107" : "#e4e5e9"
//                             }
//                           />
//                         ))}
//                         <strong className="ms-2">
//                           {review.rating_quality.toFixed(1)}
//                         </strong>
//                       </div>

//                       <h6 className="fw-semibold mb-1">{review.title}</h6>
//                       <p
//                         className="text-muted mb-2"
//                         style={{ fontSize: "14px" }}
//                       >
//                         {review.comment.length > 120
//                           ? review.comment.slice(0, 120) + "..."
//                           : review.comment}
//                       </p>
//                       <a className="fw-semibold text-decoration-none">
//                         Read more
//                       </a>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </div>
//             </Carousel.Item>
//           ))}
//         </Carousel>
//       ) : (
//         <p className="text-muted text-center mt-4">
//           No reviews yet. Be the first to write one!
//         </p>
//       )}

//       {/* Review Modal */}
//       {showModal && (
//         <div className="custom-modal">
//           <div
//             className="modal-content-custom p-4"
//             style={{ maxWidth: 700, margin: "0 auto" }}
//           >
//             <h4 className="text-center mb-4">Step {step} of 3</h4>

//             {step === 1 && (
//               <div className="row">
//                 <h2>How was your experience with {vendor?.businessName}?</h2>
//                 <RatingInput label="Quality" field="rating_quality" />
//                 <RatingInput
//                   label="Responsiveness"
//                   field="rating_responsiveness"
//                 />
//                 <RatingInput
//                   label="Professionalism"
//                   field="rating_professionalism"
//                 />
//                 <RatingInput label="Value" field="rating_value" />
//                 <RatingInput label="Flexibility" field="rating_flexibility" />
//               </div>
//             )}

//             {step === 2 && (
//               <div>
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Give your review a title
//                   </label>
//                   <input
//                     type="text"
//                     name="title"
//                     className="form-control"
//                     placeholder="Amazing Experience"
//                     value={formData.title}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">Comment</label>
//                   <textarea
//                     name="comment"
//                     rows="3"
//                     className="form-control"
//                     placeholder="Write about your experience..."
//                     value={formData.comment}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold">
//                     Upload Images (Optional)
//                   </label>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="form-control"
//                   />
//                   <div className="d-flex flex-wrap mt-2">
//                     {images.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={img.preview}
//                         alt="preview"
//                         className="me-2 mb-2"
//                         style={{
//                           width: 100,
//                           height: 100,
//                           objectFit: "cover",
//                           borderRadius: 8,
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     How many guests attended ? (Optional)
//                   </label>
//                   <input
//                     type="number"
//                     name="guest_count"
//                     className="form-control"
//                     value={formData.guest_count}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label fw-semibold">
//                     How much did you spend? (Optional)
//                   </label>
//                   <input
//                     type="number"
//                     name="spent"
//                     className="form-control"
//                     value={formData.spent}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//               <button
//                 className="btn btn-secondary px-4"
//                 onClick={() =>
//                   step === 1 ? setShowModal(false) : setStep(step - 1)
//                 }
//               >
//                 Back
//               </button>

//               {step === 3 ? (
//                 <button
//                   onClick={handleSubmit}
//                   disabled={submitting}
//                   className="btn btn-primary px-4"
//                 >
//                   {submitting ? "Submitting..." : "Submit Review"}
//                 </button>
//               ) : (
//                 <button
//                   className="btn btn-primary px-4"
//                   onClick={() => {
//                     if (
//                       step === 1 &&
//                       requiredRatings.some((f) => formData[f] === 0)
//                     ) {
//                       toast.error(
//                         "Please provide all ratings before proceeding!"
//                       );
//                     } else {
//                       setStep(step + 1);
//                     }
//                   }}
//                 >
//                   Next
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewModalFlow;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel, Button, Card, Modal } from "react-bootstrap";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewModalFlow = ({ vendor }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [reviews, setReviews] = useState([]);
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

  // ADDED: State for validation error message inside the modal
  const [modalError, setModalError] = useState("");

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
      setShowModal(true);
      setStep(1);
      setModalError(""); // Clear previous error when opening
    }
  };

  const handleStarClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setModalError(""); // Clear error when a star is clicked
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing in required fields
    if (name === "title" || name === "comment") {
      setModalError("");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImgs]);
  };

  const requiredRatings = [
    "rating_quality",
    "rating_responsiveness",
    "rating_professionalism",
    "rating_value",
    "rating_flexibility",
  ];

  // UPDATED: Function to handle 'Next' click based on the current step
  const handleNextClick = () => {
    setModalError(""); // Clear previous errors

    if (step === 1) {
      const emptyRating = requiredRatings.some(
        (field) => !formData[field] || formData[field] === 0
      );
      if (emptyRating) {
        // Step 1 Validation: All 5 star ratings must be selected
        setModalError(
          "Please select a star rating for all fields before proceeding."
        );
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      if (!formData.title.trim()) {
        // Step 2 Validation: Check for empty title
        setModalError("Please provide a title for your review.");
        return;
      }
      if (!formData.comment.trim()) {
        // Step 2 Validation: Check for empty comment
        setModalError("Please write a comment about your experience.");
        return;
      }
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    // Final validation check (should be mostly covered by step validations)
    const emptyRating = requiredRatings.some(
      (field) => !formData[field] || formData[field] === 0
    );

    if (!formData.title.trim() || !formData.comment.trim() || emptyRating) {
      toast.error(
        "Please complete all required fields and ratings before submitting."
      );
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
      setModalError(""); // Clear error on success

      // Reset form
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
      setImages([]);

      // Refetch reviews
      const refreshed = await fetch(
        `${API_BASE_URL}/reviews/vendor/${vendor.id}`
      ).then((r) => r.json());
      if (refreshed.success) setReviews(refreshed.reviews);
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
              color={
                star <= (hover[field] || formData[field])
                  ? "#ffc107"
                  : "#e4e5e9"
              }
              onClick={() => handleStarClick(field, star)}
              onMouseEnter={() => setHover({ ...hover, [field]: star })}
              onMouseLeave={() => setHover({ ...hover, [field]: 0 })}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </div>
    </div>
  );

  const chunkReviews = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size)
      result.push(arr.slice(i, i + size));
    return result;
  };
  const groupedReviews = chunkReviews(reviews, 3);

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" autoClose={3000} />

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

      {/* Review Modal Flow (Steps 1-3) */}
      {showModal && (
        <div className="custom-modal">
          <div
            className="modal-content-custom p-4"
            style={{ maxWidth: 700, margin: "0 auto" }}
          >
            <h4 className="text-center mb-4">Step {step} of 3</h4>

            {/* ADDED: Display modal error message */}
            {modalError && (
              <div className="alert alert-danger text-center mb-4" role="alert">
                {modalError}
              </div>
            )}

            {step === 1 && (
              <div className="row">
                <h2>How was your experience with {vendor?.businessName}?</h2>
                <RatingInput label="Quality" field="rating_quality" />
                <RatingInput
                  label="Responsiveness"
                  field="rating_responsiveness"
                />
                <RatingInput
                  label="Professionalism"
                  field="rating_professionalism"
                />
                <RatingInput label="Value" field="rating_value" />
                <RatingInput label="Flexibility" field="rating_flexibility" />
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Give your review a title
                  </label>
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
                  <label className="form-label fw-semibold">
                    Upload Images (Optional)
                  </label>
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
                        className="me-2 mb-2"
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
            )}

            {step === 3 && (
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    How many guests attended ? (Optional)
                  </label>
                  <input
                    type="number"
                    name="guest_count"
                    className="form-control"
                    value={formData.guest_count}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    How much did you spend? (Optional)
                  </label>
                  <input
                    type="number"
                    name="spent"
                    className="form-control"
                    value={formData.spent}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-secondary px-4"
                onClick={() => {
                  setModalError(""); // Clear error on 'Back'
                  step === 1 ? setShowModal(false) : setStep(step - 1);
                }}
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
                // UPDATED: Use the new handler for 'Next' button
                <button
                  className="btn btn-primary px-4"
                  onClick={handleNextClick}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
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
