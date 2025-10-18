// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { UserPlus, Copy, Check } from 'lucide-react';

// export default function ReviewRequestForm() {
//   const { vendor } = useSelector((state) => state.vendorAuth) || {};
//   const [recipients, setRecipients] = useState([]);
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState(`Hi [Name],

// It was a pleasure to be part of your event! If you have a few moments, could you provide a review of our services on happywedz?

// Thank you in advance for your feedback. We greatly appreciate your help!

// Best,
// shree venues`);
//   const [saveAsTemplate, setSaveAsTemplate] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const vendorId = vendor?.id || vendor?._id || vendor?.vendorId;
//   const ccEmail = vendor?.email || vendor?.contactEmail || vendor?.businessEmail || '';
//   const reviewUrl = vendorId
//     ? `${window.location.origin}/write-review/${vendorId}`
//     : `${window.location.origin}/write-review/`;

//   const addRecipient = () => {
//     if (username.trim() && email.trim()) {
//       setRecipients([...recipients, { username, email }]);
//       setUsername('');
//       setEmail('');
//     }
//   };

//   const removeRecipient = (index) => {
//     setRecipients(recipients.filter((_, i) => i !== index));
//   };

//   const handleSend = () => {
//     alert('Review request sent successfully!');
//   };

//   const copyUrl = () => {
//     navigator.clipboard.writeText(reviewUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: '800px' }}>
//       <div className="card shadow-sm">
//         <div className="card-body p-4">
//           <h5 className="card-title mb-3">Recipients</h5>
//           <p className="text-muted small mb-4">
//             Edit and send this message to request reviews from your clients. You will also receive a copy of the email.
//           </p>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">TO:</label>
//             <div className="row g-2 mb-2">
//               <div className="col-md-5">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
//                 />
//               </div>
//               <div className="col-md-5">
//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
//                 />
//               </div>
//               <div className="col-md-2">
//                 <button
//                   className="btn btn-danger w-100"
//                   onClick={addRecipient}
//                 >
//                   Add
//                 </button>
//               </div>
//             </div>

//             {recipients.length > 0 && (
//               <div className="mb-2">
//                 {recipients.map((recipient, index) => (
//                   <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">
//                     {recipient.username} ({recipient.email})
//                     <button
//                       className="btn-close btn-close-sm ms-2"
//                       style={{ fontSize: '0.7em' }}
//                       onClick={() => removeRecipient(index)}
//                     ></button>
//                   </span>
//                 ))}
//               </div>
//             )}

//             <button className="btn btn-link text-danger p-0 text-decoration-none">
//               <UserPlus size={16} className="me-1" />
//               Add clients
//             </button>
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">CC:</label>
//             <span className="text-muted ms-2">{ccEmail}</span>
//           </div>

//           <div className="mb-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <label className="form-label fw-semibold mb-0">Message</label>
//               <button className="btn btn-link btn-sm text-decoration-none p-0">
//                 Template
//               </button>
//             </div>
//             <textarea
//               className="form-control"
//               rows="10"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             <small className="text-muted">
//               Note: a link to write a review directly on your Storefront will be included in the email. [Link]
//             </small>
//           </div>

//           <div className="form-check mb-3">
//             <input
//               className="form-check-input"
//               type="checkbox"
//               checked={saveAsTemplate}
//               onChange={(e) => setSaveAsTemplate(e.target.checked)}
//               id="saveTemplate"
//             />
//             <label className="form-check-label" htmlFor="saveTemplate">
//               Save as template
//             </label>
//           </div>

//           <button className="btn btn-secondary" onClick={handleSend}>
//             Send
//           </button>
//         </div>
//       </div>

//       <div className="card shadow-sm mt-4">
//         <div className="card-body p-4">
//           <h5 className="card-title mb-3">Share your personalised review URL</h5>
//           <p className="text-muted mb-3">
//             Send this personalised URL to your past clients for a quick way to collect wedding reviews for your services.
//           </p>

//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control"
//               value={reviewUrl}
//               readOnly
//             />
//             <button
//               className="btn btn-outline-danger"
//               onClick={copyUrl}
//             >
//               {copied ? (
//                 <>
//                   <Check size={16} className="me-1" />
//                   COPIED
//                 </>
//               ) : (
//                 <>
//                   <Copy size={16} className="me-1" />
//                   COPY
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserPlus, Copy, Check } from "lucide-react";
import Swal from "sweetalert2";

export default function ReviewRequestForm() {
  const { vendor } = useSelector((state) => state.vendorAuth) || {};
  const [recipients, setRecipients] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Hi [Name],

It was a pleasure to be part of your event! If you have a few moments, could you provide a review of our services on happywedz?

Thank you in advance for your feedback. We greatly appreciate your help!

Best,
shree venues`);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const vendorId = vendor?.id || vendor?._id || vendor?.vendorId;
  const ccEmail =
    vendor?.email || vendor?.contactEmail || vendor?.businessEmail || "";
  const reviewUrl = vendorId
    ? `${window.location.origin}/write-review/${vendorId}`
    : `${window.location.origin}/write-review/`;

  const addRecipient = () => {
    if (username.trim() && email.trim()) {
      setRecipients([...recipients, { username, email }]);
      setUsername("");
      setEmail("");
    }
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      // alert("Please add at least one recipient.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please add at least one recipient.",
        confirmButtonText: "OK",
        confirmButtonColor: "#ed1173",
        })
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vendorId,
        ccEmail,
        recipients,
        message,
        saveAsTemplate,
        reviewUrl,
      };

      // const response = await axios.post(
      //   'http://localhost:4000/reviews/review-requests',
      //   payload
      // );

      const response = await axios.post(
        "https://happywedz.com/api/reviews/review-requests",
        payload
      );

      if (response.data?.success) {
        // alert("Review request sent successfully!");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Review request sent successfully!",
          confirmButtonText: "OK",
          confirmButtonColor: "#ed1173",
          timer:"3000"

        })
        setRecipients([]);
      } else {
        // alert(response.data?.message || "Failed to send review requests.");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data?.message || "Failed to send review requests.",
          confirmButtonText: "OK",
          confirmButtonColor: "#ed1173",
          timer:"3000"
        })
      }
    } catch (error) {
      console.error("Error sending review requests:", error);
      // alert("Something went wrong while sending review requests.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while sending review requests.",
        confirmButtonText: "OK",
        confirmButtonColor: "#ed1173",
        timer:"3000"
        })
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">Recipients</h5>
          <p className="text-muted small mb-4">
            Edit and send this message to request reviews from your clients. You
            will also receive a copy of the email.
          </p>

          {/* Recipients Input */}
          <div className="mb-3">
            <label className="form-label fw-semibold">TO:</label>
            <div className="row g-2 mb-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                />
              </div>
              <div className="col-md-5">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addRecipient()}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-danger w-100" onClick={addRecipient}>
                  Add
                </button>
              </div>
            </div>

            {recipients.length > 0 && (
              <div className="mb-2">
                {recipients.map((recipient, index) => (
                  <span
                    key={index}
                    className="badge bg-light text-dark me-2 mb-2 p-2"
                  >
                    {recipient.username} ({recipient.email})
                    <button
                      className="btn-close btn-close-sm ms-2"
                      style={{ fontSize: "0.7em" }}
                      onClick={() => removeRecipient(index)}
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">CC:</label>
            <span className="text-muted ms-2">{ccEmail}</span>
          </div>

          {/* Message Section */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label fw-semibold mb-0">Message</label>
              <button className="btn btn-link btn-sm text-decoration-none p-0">
                Template
              </button>
            </div>
            <textarea
              className="form-control"
              rows="10"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <small className="text-muted">
              Note: a link to write a review directly on your Storefront will be
              included in the email. [Link]
            </small>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={saveAsTemplate}
              onChange={(e) => setSaveAsTemplate(e.target.checked)}
              id="saveTemplate"
            />
            <label className="form-check-label" htmlFor="saveTemplate">
              Save as template
            </label>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Review URL Share Section */}
      <div className="card shadow-sm mt-4">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">
            Share your personalised review URL
          </h5>
          <p className="text-muted mb-3">
            Send this personalised URL to your past clients for a quick way to
            collect wedding reviews for your services.
          </p>

          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={reviewUrl}
              readOnly
            />
            <button className="btn btn-outline-danger" onClick={copyUrl}>
              {copied ? (
                <>
                  <Check size={16} className="me-1" />
                  COPIED
                </>
              ) : (
                <>
                  <Copy size={16} className="me-1" />
                  COPY
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
