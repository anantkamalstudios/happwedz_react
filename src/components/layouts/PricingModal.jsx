// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { FaPaperPlane } from "react-icons/fa";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import EventDatePicker from "./DayPicker";

// // const PricingModal = ({ show, handleClose, subVenuesData }) => {
// const PricingModal = ({ show, handleClose, vendorId }) => {
//   const { user, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   console.log(vendorId);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     eventDate: "",
//     message: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Pre-fill form if user is logged in
//     if (user) {
//       setFormData((prev) => ({
//         ...prev,
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       }));
//     } else {
//       // If user logs out while modal is open, clear the form
//       setFormData({ firstName: "", lastName: "", email: "", phone: "", eventDate: new Date(), message: "" });
//     }
//   }, [user, show]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 1. Check if user is logged in
//     if (!token || !user) {
//       handleClose(); // Close the modal before redirecting
//       navigate("/customer-login");
//       return;
//     }

//     // 2. Validate form data
//     const { firstName, lastName, email, phone, eventDate } = formData;
//     if (!firstName || !lastName || !email || !phone || !eventDate) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     // 3. Validate vendorId
//     if (!vendorId) {
//       console.error("PricingModal Error: vendorId prop is missing.");
//       setError("Could not identify the vendor. Please try again.");
//       return;
//     }

//     setSubmitting(true);
//     setError(null);

//     // 4. Construct payload and make API call
//     const payload = {
//       ...formData,
//       vendorId: vendorId,
//       userId: user.id,
//     };

//     try {
//       const response = await fetch("https://happywedz.com/api/request-pricing", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Something went wrong.");
//       }

//       alert(result.message || "Request sent successfully!");
//       handleClose();
//     } catch (err) {
//       setError(err.message);
//       console.error("Failed to send pricing request:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <div className="pricing-model">
//         <Modal show={show} onHide={handleClose} size="lg" centered>
//           <Modal.Header closeButton>
//             <div className="d-flex flex-column">
//               <h4 className="mb-1 text-muted" style={{ fontSize: "16px" }}>
//                 Location
//               </h4>
//               <h4 className="mb-1">Request Pricing Information</h4>
//               {vendorId && (
//                 <div className="mb-1 text-primary" style={{ fontSize: "13px" }}>
//                   <strong>Vendor ID:</strong> {vendorId}
//                 </div>
//               )}
//               <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
//                 fugit earum, neque magni illo nesciunt dolorum, beatae ullam est
//                 sapiente et labore officiis culpa. Aut quaerat expedita rerum
//                 inventore voluptatum!
//               </p>
//             </div>
//           </Modal.Header>

//           <Modal.Body>
//             <Form onSubmit={handleSubmit} className="custom-form">
//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}
//               {/* First/Last Name */}
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>First Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="firstName"
//                       placeholder="John"
//                       value={formData.firstName}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Last Name *</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="lastName"
//                       placeholder="Doe"
//                       value={formData.lastName}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {/* Email / Phone */}
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Email *</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="email"
//                       placeholder="john@example.com"
//                       value={formData.email}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Phone *</Form.Label>
//                     <Form.Control
//                       type="tel"
//                       name="phone"
//                       placeholder="+91 98765 43210"
//                       value={formData.phone}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               {/* Event Date */}
//               <EventDatePicker formData={formData} setFormData={setFormData} />

//               {/* Message */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Message (Optional)</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   name="message"
//                   placeholder="Tell us about your event requirements..."
//                   value={formData.message}
//                   onChange={handleChange}
//                 />
//               </Form.Group>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-100"
//                 disabled={submitting}
//               >
//                 {submitting ? "Sending..." : <><FaPaperPlane className="me-2" /> Send Request</>}
//               </Button>
//             </Form>
//           </Modal.Body>
//         </Modal>
//       </div>
//     </>
//   );
// };

// export default PricingModal;

import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Image } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventDatePicker from "./DayPicker";
import Swal from "sweetalert2";

const PricingModal = ({ show, handleClose, vendorId }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [vendorDetails, setVendorDetails] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDate: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vendorId && show) {
      const fetchVendorDetails = async () => {
        try {
          const response = await fetch(
            `https://happywedz.com/api/vendor-services/${vendorId}`
          );
          const result = await response.json();
          if (result.success) {
            setVendorDetails(result.data);
          }
        } catch (err) {
          console.error("Failed to fetch vendor details:", err);
        }
      };
      fetchVendorDetails();
    } else {
      setVendorDetails(null); // Reset when modal is closed or no vendorId
    }
  }, [vendorId, show]);

  useEffect(() => {
    if (user) {
      // Pre-fill form if user is logged in
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    } else {
      // Reset form if logged out
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventDate: new Date(),
        message: "",
      });
    }
  }, [user, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check login state
    if (!token || !user) {
      handleClose();
      navigate("/customer-login");
      return;
    }

    // 2. Validate required fields
    const { firstName, lastName, email, phone, eventDate } = formData;
    if (!firstName || !lastName || !email || !phone || !eventDate) {
      setError("Please fill in all required fields.");
      return;
    }

    // 3. Validate vendorId
    if (!vendorId) {
      console.error("PricingModal Error: vendorId prop is missing.");
      setError("Could not identify the vendor. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    // 4. Build payload
    const payload = {
      ...formData,
      vendorId: vendorId,
      userId: user.id,
    };

    try {
      const response = await fetch(
        "https://happywedz.com/api/request-pricing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.message?.toLowerCase().includes("token")) {
          setError("Your session has expired. Please login again.");
          handleClose();
          navigate("/customer-login");
          return;
        }
        throw new Error(result.message || "Something went wrong.");
      }
      Swal.fire({
        icon:"Success",
        text:"Request sent successfully!",
        timer: 1500
      })
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error("Failed to send pricing request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pricing-model">
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-center w-100">
            {vendorDetails?.image && (
              <Image
                src={`https://happywedzbackend.happywedz.com${vendorDetails.image}`}
                rounded
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
                className="me-3"
              />
            )}
            <div className="d-flex flex-column">
              <h5 className="mb-1">Request Pricing</h5>
              <h6 className="mb-1 text-muted fw-normal">
                {vendorDetails?.business_name || "Loading..."}
              </h6>
              <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                Please provide your details below to request pricing from this
                vendor.
              </p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit} className="custom-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* First/Last Name */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Email / Phone */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Event Date */}
            <EventDatePicker formData={formData} setFormData={setFormData} />

            {/* Message */}
            <Form.Group className="mb-3">
              <Form.Label>Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                placeholder="Tell us about your event requirements..."
                value={formData.message}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={submitting}
            >
              {submitting ? (
                "Sending..."
              ) : (
                <>
                  <FaPaperPlane className="me-2" /> Send Request
                </>
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PricingModal;
