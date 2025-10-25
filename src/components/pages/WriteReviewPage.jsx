// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import vendorServicesApi from "../../services/api/vendorServicesApi";

// const API_BASE_URL = "https://happywedz.com/api";

// const WriteReviewPage = () => {
//   const { vendorId } = useParams();
//   const { user, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [vendor, setVendor] = useState(null);
//   const [loadingVendor, setLoadingVendor] = useState(true);
//   const [step, setStep] = useState(1);
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
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!user || !token) {
//       navigate("/customer-login", { state: { from: location } });
//     }
//   }, [user, token, navigate, location]);

//   useEffect(() => {
//     const fetchVendorData = async () => {
//       if (!vendorId) return;
//       try {
//         setLoadingVendor(true);
//         const data = await vendorServicesApi.getVendorServiceById(vendorId);
//         setVendor(data.vendor);
//       } catch (err) {
//         console.error("Failed to load vendor data:", err);
//         setError("Could not load vendor details. Please try again later.");
//       } finally {
//         setLoadingVendor(false);
//       }
//     };
//     fetchVendorData();
//   }, [vendorId]);

//   const handleStarClick = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//     setError("");
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (name === "title" || name === "comment") {
//       setError("");
//     }
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

//   const handleNextClick = () => {
//     setError("");
//     if (step === 1) {
//       const emptyRating = requiredRatings.some(
//         (field) => !formData[field] || formData[field] === 0
//       );
//       if (emptyRating) {
//         setError(
//           "Please select a star rating for all fields before proceeding."
//         );
//         return;
//       }
//       setStep(step + 1);
//     } else if (step === 2) {
//       if (!formData.title.trim()) {
//         setError("Please provide a title for your review.");
//         return;
//       }
//       if (!formData.comment.trim()) {
//         setError("Please write a comment about your experience.");
//         return;
//       }
//       setStep(step + 1);
//     }
//   };

//   const handleSubmit = async () => {
//     const emptyRating = requiredRatings.some(
//       (field) => !formData[field] || formData[field] === 0
//     );
//     if (!formData.title.trim() || !formData.comment.trim() || emptyRating) {
//       toast.error(
//         "Please complete all required fields and ratings before submitting."
//       );
//       return;
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => data.append(key, value));
//     images.forEach((img) => data.append("media", img.file));

//     try {
//       setSubmitting(true);
//       const response = await fetch(`${API_BASE_URL}/reviews/${vendorId}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: data,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || "Failed to submit.");

//       toast.success("Review submitted successfully!");
//       navigate(-1);
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

//   if (loadingVendor) {
//     return <div className="container my-5 text-center">Loading...</div>;
//   }

//   return (
//     <div className="container my-5">
//       <ToastContainer position="top-center" autoClose={3000} />
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card p-4 p-md-5">
//             <h2 className="text-center mb-4">
//               Write a Review for {vendor?.businessName}
//             </h2>
//             <h4 className="text-center mb-4">Step {step} of 3</h4>

//             {error && (
//               <div className="alert alert-danger text-center mb-4" role="alert">
//                 {error}
//               </div>
//             )}

//             {step === 1 && (
//               <div className="row">
//                 <h5 className="mb-4">How was your experience?</h5>
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
//                     rows="5"
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
//                     How many guests attended? (Optional)
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
//                 onClick={() => {
//                   setError("");
//                   step === 1 ? navigate(-1) : setStep(step - 1);
//                 }}
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
//                   onClick={handleNextClick}
//                   disabled={step === 1 && requiredRatings.some((field) => !formData[field] || formData[field] === 0)}
//                 >
//                   Next
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WriteReviewPage;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import vendorServicesApi from "../../services/api/vendorServicesApi";

const API_BASE_URL = "https://happywedz.com/api";

const WriteReviewPage = () => {
  const { vendorId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [vendor, setVendor] = useState(null);
  const [loadingVendor, setLoadingVendor] = useState(true);
  const [step, setStep] = useState(0); // Start at 0 for recommendation screen
  const [formData, setFormData] = useState({
    would_recommend: null, // New field for recommendation
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !token) {
      navigate("/customer-login", { state: { from: location } });
    }
  }, [user, token, navigate, location]);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) return;
      try {
        setLoadingVendor(true);
        const data = await vendorServicesApi.getVendorServiceById(vendorId);
        setVendor(data.vendor);
      } catch (err) {
        console.error("Failed to load vendor data:", err);
        setError("Could not load vendor details. Please try again later.");
      } finally {
        setLoadingVendor(false);
      }
    };
    fetchVendorData();
  }, [vendorId]);

  const handleRecommendation = (value) => {
    setFormData({ ...formData, would_recommend: value });
    setError("");
    // Auto advance after selection
    setTimeout(() => setStep(1), 300);
  };

  const handleStarClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "title" || name === "comment") {
      setError("");
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
  const ratingLabels = {
    rating_quality: "Quality",
    rating_responsiveness: "Responsiveness",
    rating_professionalism: "Professionalism",
    rating_value: "Value",
    rating_flexibility: "Flexibility",
  };

  const handleNextClick = () => {
    setError("");
    if (step === 1) {
      const missing = requiredRatings.filter(
        (field) => !formData[field] || formData[field] === 0
      );
      if (missing.length > 0) {
        const names = missing.map((f) => ratingLabels[f]).join(", ");
        setError(`Please select a star rating for: ${names}`);
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      if (!formData.title.trim()) {
        setError("Please provide a title for your review.");
        return;
      }
      if (!formData.comment.trim()) {
        setError("Please write a comment about your experience.");
        return;
      }
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
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
      const response = await fetch(`${API_BASE_URL}/reviews/${vendorId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to submit.");

      toast.success("Review submitted successfully!");
      navigate(-1);
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
              color={star <= formData[field] ? "#ffc107" : "#e4e5e9"}
              onClick={() => handleStarClick(field, star)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </div>
    </div>
  );

  if (loadingVendor) {
    return <div className="container my-5 text-center">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card p-4 p-md-5">
            {step === 0 ? (
              // Recommendation Screen
              <div className="text-center">
                {vendor?.businessLogo && (
                  <img
                    src={vendor.businessLogo}
                    alt={vendor.businessName}
                    className="img-fluid rounded mb-4"
                    style={{
                      maxWidth: 300,
                      maxHeight: 200,
                      objectFit: "cover",
                    }}
                  />
                )}
                <h2 className="mb-3">{vendor?.businessName}</h2>
                <p className="text-muted mb-5">{vendor?.vendorType?.name}</p>

                <h3 className="mb-5">Would you recommend this vendor?</h3>

                <div className="row justify-content-center gap-3">
                  <div className="col-5 col-md-4">
                    <button
                      className={`btn w-100 py-4 d-flex flex-column align-items-center justify-content-center ${
                        formData.would_recommend === "yes"
                          ? "primary-bg"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => handleRecommendation("yes")}
                      style={{
                        transition: "all 0.3s ease",
                        border:
                          formData.would_recommend === "yes"
                            ? "2px solid #198754"
                            : "2px solid #dee2e6",
                      }}
                    >
                      <FaThumbsUp size={40} className="mb-2" />
                      <span className="fw-bold fs-5">Yes</span>
                    </button>
                  </div>

                  <div className="col-5 col-md-4">
                    <button
                      className={`btn w-100 py-4 d-flex flex-column align-items-center justify-content-center ${
                        formData.would_recommend === "no"
                          ? "btn-danger"
                          : "btn-outline-secondary"
                      }`}
                      onClick={() => handleRecommendation("no")}
                      style={{
                        transition: "all 0.3s ease",
                        border:
                          formData.would_recommend === "no"
                            ? "2px solid #dc3545"
                            : "2px solid #dee2e6",
                      }}
                    >
                      <FaThumbsDown size={40} className="mb-2" />
                      <span className="fw-bold fs-5">No</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-center mb-4">
                  Write a Review for {vendor?.businessName}
                </h2>
                <h4 className="text-center mb-4">Step {step} of 3</h4>

                {error && (
                  <div
                    className="alert alert-danger text-center mb-4"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {step === 1 && (
                  <div className="row">
                    <h5 className="mb-4">How was your experience?</h5>
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
                    <RatingInput
                      label="Flexibility"
                      field="rating_flexibility"
                    />
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
                        rows="5"
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
                        How many guests attended? (Optional)
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
                      setError("");
                      step === 1 ? setStep(0) : setStep(step - 1);
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
                    <button
                      className="btn btn-primary px-4"
                      onClick={handleNextClick}
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteReviewPage;
