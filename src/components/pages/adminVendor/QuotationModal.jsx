// import React, { useState, useEffect } from "react";
// import { useToast } from "../../layouts/toasts/Toast";

// const API_BASE_URL = "https://happywedz.com";

// const QuotationModal = ({ show, onClose, lead, vendorToken }) => {
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     price: "",
//     service: "",
//     date: "",
//     message: "",
//   });
//   const { addToast } = useToast();

//   useEffect(() => {
//     document.body.style.overflow = show ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [show]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!lead || !lead.request) return;

//     setSubmitting(true);

//     try {
//       if (!vendorToken) throw new Error("Authentication token not found.");

//       const payload = {
//         price: formData.price,
//         services: formData.service,
//         validTill: formData.date,
//         message: formData.message,
//         userId: lead.request.user?.id,
//       };

//       const response = await fetch(
//         `${API_BASE_URL}/api/request-pricing/requests/${lead.request.id}/quotation`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${vendorToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to send quotation.");
//       }
//       addToast("Quotation sent successfully!", "success");
//       onClose();
//     } catch (err) {
//       addToast(`Error: ${err.message}`, "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!show) {
//     return null;
//   }

//   return (
//     <>
//       <div className="custom-backdrop" onClick={onClose}></div>
//       <div className="custom-modal" role="dialog" aria-modal="true">
//         <div
//           className="modal-content custom-modal-card"
//           style={{ borderRadius: "15px" }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="modal-header custom-modal-header">
//             <div className="text-center w-100 mb-4">
//               <h5 className="modal-title mb-0 text-danger">Quotations</h5>
//               <small className="text-light d-block text-dark">
//                 Fill up details
//               </small>
//             </div>
//             <button
//               type="button"
//               className="close-circle"
//               onClick={onClose}
//               aria-label="Close"
//             >
//               &times;
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <label className="form-label">Price</label>
//                 <input
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   type="number"
//                   className="form-control"
//                   placeholder="0"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Services</label>
//                 <input
//                   name="service"
//                   value={formData.service}
//                   onChange={handleChange}
//                   type="text"
//                   className="form-control"
//                   placeholder="Service Name"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Valid Till Date</label>
//                 <input
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   type="date"
//                   className="form-control"
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                 <label className="form-label">Message</label>
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   className="form-control"
//                   rows="5"
//                   maxLength="2000"
//                   placeholder="Your Message"
//                 />
//                 <div className="form-text text-end">Max. 2000 characters</div>
//               </div>
//             </div>

//             <div className="modal-footer border-0 p-3">
//               <button
//                 type="submit"
//                 className="btn btn-pink w-100"
//                 disabled={submitting}
//               >
//                 {submitting ? "Sending..." : "Send"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default QuotationModal;

import React, { useState, useEffect } from "react";
import { useToast } from "../../layouts/toasts/Toast";

const API_BASE_URL = "https://happywedz.com";

const QuotationModal = ({ show, onClose, lead, vendorToken }) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    servicesIncluded: "", // Holds the single service string from the input
    date: "",
    message: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    // Scroll lock logic for the modal
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lead || !lead.request) return;

    setSubmitting(true);

    try {
      if (!vendorToken) throw new Error("Authentication token not found.");

      // CRITICAL FIX: Sending 'services' as an array of strings
      const payload = {
        price: formData.price,
        servicesIncluded: [formData.servicesIncluded.trim()],
        validTill: formData.date,
        message: formData.message,
        userId: lead.request.user?.id,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/request-pricing/requests/${lead.request.id}/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${vendorToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send quotation.");
      }

      addToast("Quotation sent successfully!", "success");
      onClose();

      // OPTIONAL: If the quote API doesn't change the lead status to 'replied',
      // you might need to call the 'replied' action here:
      /*
      if (lead.request.status !== 'replied') {
          await fetch(`${API_BASE_URL}/api/inbox/${lead.id}/replied`, { 
              method: "PATCH", 
              headers: { Authorization: `Bearer ${vendorToken}` } 
          });
      }
      */
    } catch (err) {
      addToast(`Error: ${err.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="custom-backdrop" onClick={onClose}></div>
      <div className="custom-modal" role="dialog" aria-modal="true">
        <div
          className="modal-content custom-modal-card"
          style={{ borderRadius: "15px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header custom-modal-header">
            <div className="text-center w-100 mb-4">
              <h5 className="modal-title mb-0 text-danger">Quotations</h5>
              <small className="text-light d-block text-dark">
                Fill up details
              </small>
            </div>
            <button
              type="button"
              className="close-circle"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  type="number"
                  className="form-control"
                  placeholder="0"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Services</label>
                <input
                  name="servicesIncluded"
                  value={formData.servicesIncluded}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  placeholder="e.g., Photography, Videography, Album"
                  required
                />
                <div className="form-text">Enter service details.</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Valid Till Date</label>
                <input
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  type="date"
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="5"
                  maxLength="2000"
                  placeholder="Your Message"
                />
                <div className="form-text text-end">Max. 2000 characters</div>
              </div>
            </div>

            <div className="modal-footer border-0 p-3">
              <button
                type="submit"
                className="btn btn-pink w-100"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuotationModal;
