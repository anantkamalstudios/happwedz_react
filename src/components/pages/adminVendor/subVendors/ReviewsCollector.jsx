// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { UserPlus, Copy, Check } from "lucide-react";
// import Swal from "sweetalert2";

// export default function ReviewRequestForm() {
//   const { vendor, token } = useSelector((state) => state.vendorAuth) || {};
//   const [recipients, setRecipients] = useState([]);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");

//   const [message, setMessage] = useState(() => {
//     const name = vendor?.businessName || "our team";
//     return `Hi [Name],

// It was a pleasure to be part of your event! If you have a few moments, could you provide a review of our services on happywedz?

// Thank you in advance for your feedback. We greatly appreciate your help!

// Best,
// ${name}`;
//   });

//   const [saveAsTemplate, setSaveAsTemplate] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({ username: "", email: "" });

//   const vendorId = vendor?.id || vendor?._id || vendor?.vendorId;
//   const ccEmail =
//     vendor?.email || vendor?.contactEmail || vendor?.businessEmail || "";
//   const [serviceId, setServiceId] = useState(null);
//   const reviewUrl = serviceId
//     ? `${window.location.origin}/write-review/${serviceId}`
//     : `${window.location.origin}/write-review/`;

//   // Fetch service ID by vendor ID for review URL
//   React.useEffect(() => {
//     const loadService = async () => {
//       if (!vendorId) return;
//       try {
//         const res = await axios.get(
//           `https://happywedz.com/api/vendor-services/vendor/${vendorId}`,
//           {
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//           }
//         );
//         const data = res?.data;
//         // Support both array and object responses
//         const svc = Array.isArray(data) ? data[0] : data?.data || data;
//         if (svc?.id) setServiceId(svc.id);
//       } catch (_) {
//         setServiceId(null);
//       }
//     };
//     loadService();
//   }, [vendorId, token]);

//   const addRecipient = () => {
//     const trimmedUsername = username.trim();
//     const trimmedEmail = email.trim();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     const newErrors = { username: "", email: "" };

//     if (!trimmedUsername) {
//       newErrors.username = "Username is required.";
//       Swal.fire({
//         icon: "error",
//         text: "Username is required.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#ed1173",
//       });
//     }

//     if (!trimmedEmail) {
//       newErrors.email = "Email is required.";
//       Swal.fire({
//         icon: "error",
//         text: "Email is required.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#ed1173",
//       });
//     } else if (!emailRegex.test(trimmedEmail)) {
//       newErrors.email = "Please enter a valid email address.";
//       Swal.fire({
//         icon: "error",
//         text: "Please enter a valid email address.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#ed1173",
//       });
//     }

//     if (newErrors.username || newErrors.email) {
//       setErrors(newErrors);
//       return;
//     }

//     setRecipients([
//       ...recipients,
//       { username: trimmedUsername, email: trimmedEmail },
//     ]);
//     setUsername("");
//     setEmail("");
//     setErrors({ username: "", email: "" });
//   };

//   const removeRecipient = (index) => {
//     setRecipients(recipients.filter((_, i) => i !== index));
//   };

//   const handleSend = async () => {
//     if (recipients.length === 0) {
//       // alert("Please add at least one recipient.");
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Please add at least one recipient.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#ed1173",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         vendorId,
//         ccEmail,
//         recipients,
//         message,
//         saveAsTemplate,
//         reviewUrl,
//       };

//       const response = await axios.post(
//         "https://happywedz.com/api/reviews/send-review-request",
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data?.success) {
//         // alert("Review request sent successfully!");
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Review request sent successfully!",
//           confirmButtonText: "OK",
//           confirmButtonColor: "#ed1173",
//           timer: "3000",
//         });
//         setRecipients([]);
//       } else {
//         // alert(response.data?.message || "Failed to send review requests.");
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           text: response.data?.message || "Failed to send review requests.",
//           confirmButtonText: "OK",
//           confirmButtonColor: "#ed1173",
//           timer: "3000",
//         });
//       }
//     } catch (error) {
//       console.error("Error sending review requests:", error);
//       // alert("Something went wrong while sending review requests.");
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong while sending review requests.",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#ed1173",
//         timer: "3000",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyUrl = () => {
//     navigator.clipboard.writeText(reviewUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="container py-4" style={{ maxWidth: "800px" }}>
//       <div className="card shadow-sm">
//         <div className="card-body p-4">
//           <h5 className="card-title mb-3">Recipients</h5>
//           <p className="text-muted small mb-4">
//             Edit and send this message to request reviews from your clients. You
//             will also receive a copy of the email.
//           </p>

//           {/* Recipients Input */}
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
//                   onKeyDown={(e) => e.key === "Enter" && addRecipient()}
//                 />
//               </div>
//               <div className="col-md-5">
//                 <input
//                   type="email"
//                   className="form-control"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addRecipient()}
//                 />
//               </div>
//               <div className="col-md-2">
//                 <button className="btn btn-danger w-100" onClick={addRecipient}>
//                   Add
//                 </button>
//               </div>
//             </div>

//             {recipients.length > 0 && (
//               <div className="mb-2">
//                 {recipients.map((recipient, index) => (
//                   <span
//                     key={index}
//                     className="badge bg-light text-dark me-2 mb-2 p-2"
//                   >
//                     {recipient.username} ({recipient.email})
//                     <button
//                       className="btn-close btn-close-sm ms-2"
//                       style={{ fontSize: "0.7em" }}
//                       onClick={() => removeRecipient(index)}
//                     ></button>
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="mb-3">
//             <label className="form-label fw-semibold">CC:</label>
//             <span className="text-muted ms-2">{ccEmail}</span>
//           </div>

//           {/* Message Section */}
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
//               Note: a link to write a review directly on your Storefront will be
//               included in the email. [Link]
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

//           <button
//             className="btn btn-secondary"
//             onClick={handleSend}
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>

//       {/* Review URL Share Section */}
//       <div className="card shadow-sm mt-4">
//         <div className="card-body p-4">
//           <h5 className="card-title mb-3">
//             Share your personalised review URL
//           </h5>
//           <p className="text-muted mb-3">
//             Send this personalised URL to your past clients for a quick way to
//             collect wedding reviews for your services.
//           </p>

//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control"
//               value={reviewUrl}
//               readOnly
//             />
//             <button className="btn btn-outline-danger" onClick={copyUrl}>
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


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { Copy, Check } from "lucide-react"; 
import "bootstrap/dist/css/bootstrap.min.css";

export default function ReviewRequestForm() {
  const { vendor, token } = useSelector((state) => state.vendorAuth) || {};
  const [bookedLeads, setBookedLeads] = useState([]);
  const [selectedInboxId, setSelectedInboxId] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const vendorId = vendor?.id || vendor?.vendorId;
  const [serviceId, setServiceId] = useState(null);
  
  // Generate personalized review URL (serviceId preferred, fallback to vendorId)
  const reviewUrl = `${window.location.origin}/write-review/${serviceId}`;

  useEffect(() => {
    if (!token) return;
    const fetchBooked = async () => {
      try {
        const res = await axios.get(
          "https://happywedz.com/api/inbox?filter=booked",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookedLeads(res.data.inbox || []);
      } catch (err) {
        console.error("Fetch Booked Leads Error:", err);
      }
    };
    fetchBooked();
  }, [token]);

  // Fetch vendor's service and pick an ID for review URL
  useEffect(() => {
    const fetchServiceId = async () => {
      if (!vendorId) return;
      try {
        const res = await axios.get(
          `https://happywedz.com/api/vendor-services/vendor/${vendorId}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const raw = res?.data;
        // Normalize to an array of services
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : raw?.data
          ? [raw.data]
          : [];
        if (list.length > 0) {
          // Prefer subcategory 2 if present
          const preferred = list.find((s) => s?.vendor_subcategory_id === 2);
          const chosen = preferred || list[0];
          if (chosen?.id) setServiceId(chosen.id);
        }
      } catch (e) {
        setServiceId(null);
      }
    };
    fetchServiceId();
  }, [vendorId, token]);

  const handleSelectChange = (e) => {
    const inboxId = e.target.value;
    setSelectedInboxId(inboxId);
    const lead = bookedLeads.find((item) => item.id == inboxId);
    setSelectedLead(lead);

    if (lead) {
      const user = lead?.request?.user;
      const eventDate = lead.request?.eventDate;

      setMessage(
        `Hi ${user?.name || ""},\n\n` +
        `Thank you for choosing ${vendor?.businessName} for your event on ${eventDate}.\n` +
        `We would love to hear your feedback on our services!\n\n` +
        `Please review us on HappyWedz.\n\n` +
        `Thanks & Regards,\n${vendor?.businessName}`
      );
    }
  };

  const handleSend = async () => {
    if (!selectedLead) {
      return Swal.fire({ icon: "error", text: "Please select a booked customer" });
    }

    const userId = selectedLead.request?.user?.id;
    const requestId = selectedLead.request?.id;

    if (!userId) {
      return Swal.fire({ icon: "error", text: "User not found for this booking" });
    }

    if (!selectedLead.request?.user?.email) {
      return Swal.fire({ icon: "error", text: "No email found for this customer" });
    }

    if (!message.trim()) {
      return Swal.fire({ icon: "warning", text: "Message cannot be empty" });
    }

    setLoading(true);
    try {
      await axios.post(
        `https://happywedz.com/api/reviews/send-review-request/${requestId}`,
        {
          message,
          reviewLink: reviewUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        text: "Review Request Sent Successfully!",
      });

      setSelectedInboxId("");
      setSelectedLead(null);
      setMessage("");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      Swal.fire({
        icon: "error",
        text: apiMsg || "Failed to send review request.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy URL to clipboard
  const copyUrl = () => {
    navigator.clipboard.writeText(reviewUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error("Failed to copy:", err);
      Swal.fire({
        icon: "error",
        text: "Failed to copy URL",
      });
    });
  };

  return (
    <div className="container py-4" style={{ maxWidth: "800px" }}>
      {/* Review Request Form Card */}
      <div className="card shadow p-4">
        <h4 className="mb-3">Send Review Request</h4>

        <div className="mb-3">
          <label className="form-label fw-semibold">Select Customer</label>
          <select
            className="form-select"
            value={selectedInboxId}
            onChange={handleSelectChange}
          >
            <option value="">-- Select Booked Customer --</option>
            {bookedLeads.map((item) => (
              <option key={item.id} value={item.id}>
                {item.request?.user?.name} - {item.request?.eventDate}
              </option>
            ))}
          </select>
        </div>

        {selectedLead && (
          <>
            <div className="mb-3">
              <label className="form-label fw-semibold">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={selectedLead.request.user.name}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={selectedLead.request.user.email}
                readOnly
              />
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">Message</label>
          <textarea
            className="form-control"
            rows="8"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <button
          className="btn  w-50"
          style={{ backgroundColor: "#ed1173" }}
          disabled={loading}
          onClick={handleSend}
        >
          {loading ? "Sending..." : "Send Review Request"}
        </button>
      </div>

      {/* Personalized Review URL Card */}
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
            <button 
              className="btn btn-outline-danger" 
              onClick={copyUrl}
              style={{ minWidth: "120px" }}
            >
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
