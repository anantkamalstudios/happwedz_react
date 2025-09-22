import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  ProgressBar,
  Accordion,
} from "react-bootstrap";
import {
  FaBuilding,
  FaUser,
  FaDollarSign,
  FaLock,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaGlobe,
} from "react-icons/fa";
import { FcBusinessman } from "react-icons/fc";
import { IoIosContact } from "react-icons/io";
import { Link } from "react-router-dom";

const VendorRegister = () => {
  // const [step, setStep] = useState(1);

  // const [validated, setValidated] = useState(false);

  // const [formData, setFormData] = useState({
  //   businessName: "",
  //   businessType: "",
  //   yearsInBusiness: "",
  //   description: "",
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   address: "",
  //   city: "",
  //   state: "",
  //   zip: "",
  //   services: [],
  //   priceRange: "",
  //   website: "",
  //   username: "",
  //   password: "",
  //   confirmPassword: "",
  //   acceptTerms: false,
  // });

  // const businessTypes = [
  //   "Venue",
  //   "Catering",
  //   "Photography",
  //   "Videography",
  //   "Florist",
  //   "DJ/Band",
  //   "Makeup Artist",
  //   "Decorator",
  //   "Wedding Planner",
  //   "Bakery",
  // ];

  // const serviceOptions = [
  //   "Full Wedding Planning",
  //   "Day-of Coordination",
  //   "Venue Selection",
  //   "Catering Services",
  //   "Photography",
  //   "Videography",
  //   "Floral Design",
  //   "Entertainment",
  //   "Lighting & Decor",
  //   "Transportation",
  //   "Invitations",
  //   "Wedding Cake",
  //   "Hair & Makeup",
  //   "Officiant Services",
  //   "Rentals",
  // ];

  // const priceRanges = [
  //   "Budget (Under ₹50,000)",
  //   "Moderate (₹50,000 - ₹1,50,000)",
  //   "Premium (₹1,50,000 - ₹3,00,000)",
  //   "Luxury (₹3,00,000+)",
  // ];

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   if (type === "checkbox") {
  //     const newServices = [...formData.services];
  //     if (checked) {
  //       newServices.push(value);
  //     } else {
  //       const index = newServices.indexOf(value);
  //       if (index > -1) {
  //         newServices.splice(index, 1);
  //       }
  //     }
  //     setFormData({ ...formData, services: newServices });
  //   } else if (type === "radio") {
  //     setFormData({ ...formData, [name]: value });
  //   } else {
  //     setFormData({ ...formData, [name]: value });
  //   }
  // };

  // const handleNext = (e) => {
  //   e.preventDefault();

  //   let isValid = true;

  //   if (step === 1) {
  //     if (
  //       !formData.businessName ||
  //       !formData.businessType ||
  //       !formData.description
  //     ) {
  //       isValid = false;
  //     }
  //   } else if (step === 2) {
  //     if (
  //       !formData.firstName ||
  //       !formData.lastName ||
  //       !formData.email ||
  //       !formData.phone
  //     ) {
  //       isValid = false;
  //     }
  //   } else if (step === 3) {
  //     if (formData.services.length === 0 || !formData.priceRange) {
  //       isValid = false;
  //     }
  //   }

  //   if (isValid) {
  //     setStep(step + 1);
  //     setValidated(false);
  //   } else {
  //     setValidated(true);
  //   }
  // };

  // const handlePrev = () => {
  //   setStep(step - 1);
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Final validation
  //   if (
  //     formData.username &&
  //     formData.password &&
  //     formData.password === formData.confirmPassword &&
  //     formData.acceptTerms
  //   ) {
  //     alert("Thank you for signing up! Your vendor account is being reviewed.");
  //   } else {
  //     setValidated(true);
  //   }
  // };

  // const progressPercentage = (step / 4) * 100;

  // New
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brandName: "",
    vendorType: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "India", // Default country set to India
  });

  const [errors, setErrors] = useState({
    brandName: "",
    vendorType: "",
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const [cities, setCities] = useState([]);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Fetch cities of India when the component mounts (useEffect) or the country changes
  useEffect(() => {
    if (!formData.country) return;

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, [formData.country]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.brandName.trim()) {
      formErrors.brandName = "Brand Name is required.";
    }

    if (!formData.vendorType) {
      formErrors.vendorType = "Vendor Type is required.";
    }

    if (!formData.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Invalid email address.";
    }

    if (!formData.phone.trim()) {
      formErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.password.trim()) {
      formErrors.password = "Password is required.";
    }

    if (!formData.city) {
      formErrors.city = "City is required.";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Submit logic here
        console.log("Form submitted", formData);
        await new Promise((res) => setTimeout(res, 1500));
      } catch (err) {
        console.error("Submit error", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    // <div className="vendor-signup-form container-fluid">
    //   <div className="card shadow-sm shadow-sm">
    //     <div className="card-header p-4">
    //       <div className="row align-items-center">
    //         <div className="col">
    //           <h2 className="mb-0">Vendor Signup</h2>
    //           <p className="mb-0 mt-2">
    //             Create your professional vendor profile in minutes
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="card-body p-4">
    //       <div className="mb-4">
    //         <div>
    //           <ProgressBar
    //             now={progressPercentage}
    //             variant="primary"
    //             className="mb-3"
    //             style={{ height: "auto" }}
    //             label={`Step ${step} of 4`}
    //           />
    //         </div>
    //         <div className="d-flex justify-content-between ">
    //           <span className={`step-indicator ${step >= 1 ? "active" : ""}`}>
    //             <span className="step-number">1</span> Business Info
    //           </span>
    //           <span className={`step-indicator ${step >= 2 ? "active" : ""}`}>
    //             <span className="step-number">2</span> Contact Info
    //           </span>
    //           <span className={`step-indicator ${step >= 3 ? "active" : ""}`}>
    //             <span className="step-number">3</span> Services
    //           </span>
    //           <span className={`step-indicator ${step >= 4 ? "active" : ""}`}>
    //             <span className="step-number">4</span> Account
    //           </span>
    //         </div>
    //       </div>

    //       <Form
    //         className="custom-form"
    //         noValidate
    //         validated={validated}
    //         onSubmit={step < 4 ? handleNext : handleSubmit}
    //       >
    //         {step === 1 && (
    //           <div className="form-step">
    //             <h3 className="mb-4 d-flex align-items-center">
    //               {" "}
    //               <FcBusinessman className="me-2" />
    //               Business Information
    //             </h3>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="businessName">
    //                   <Form.Label>
    //                     Business Name <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="text"
    //                     name="businessName"
    //                     value={formData.businessName}
    //                     onChange={handleChange}
    //                     placeholder="Enter your business name"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter your business name.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>

    //               <Col md={6}>
    //                 <Form.Group controlId="businessType">
    //                   <Form.Label>
    //                     Business Type <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="text"
    //                     name="businessType"
    //                     value={formData.businessType}
    //                     onChange={handleChange}
    //                     placeholder="Enter your business type"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter your business type.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="yearsInBusiness">
    //                   <Form.Label>Years in Business</Form.Label>
    //                   <Form.Control
    //                     type="number"
    //                     name="yearsInBusiness"
    //                     value={formData.yearsInBusiness}
    //                     onChange={handleChange}
    //                     min="0"
    //                     placeholder="Number of years"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Form.Group className="mb-4" controlId="description">
    //               <Form.Label>
    //                 Business Description <span className="text-danger">*</span>
    //               </Form.Label>
    //               <Form.Control
    //                 required
    //                 as="textarea"
    //                 rows={4}
    //                 name="description"
    //                 value={formData.description}
    //                 onChange={handleChange}
    //                 placeholder="Describe your business, services, and what makes you unique"
    //               />
    //               <Form.Control.Feedback type="invalid">
    //                 Please enter a business description.
    //               </Form.Control.Feedback>
    //               <Form.Text muted>
    //                 This will be displayed on your public profile. Minimum 100
    //                 characters recommended.
    //               </Form.Text>
    //             </Form.Group>
    //           </div>
    //         )}

    //         {step === 2 && (
    //           <div className="form-step">
    //             <h3 className="mb-4 d-flex align-items-center">
    //               <IoIosContact className="me-2" /> Contact Information
    //             </h3>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="firstName">
    //                   <Form.Label>
    //                     First Name <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="text"
    //                     name="firstName"
    //                     value={formData.firstName}
    //                     onChange={handleChange}
    //                     placeholder="Enter first name"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter your first name.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>

    //               <Col md={6}>
    //                 <Form.Group controlId="lastName">
    //                   <Form.Label>
    //                     Last Name <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="text"
    //                     name="lastName"
    //                     value={formData.lastName}
    //                     onChange={handleChange}
    //                     placeholder="Enter last name"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter your last name.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="email">
    //                   <Form.Label>
    //                     Email <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="email"
    //                     name="email"
    //                     value={formData.email}
    //                     onChange={handleChange}
    //                     placeholder="Enter email address"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter a valid email address.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>

    //               <Col md={6}>
    //                 <Form.Group controlId="phone">
    //                   <Form.Label>
    //                     Phone <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="tel"
    //                     name="phone"
    //                     value={formData.phone}
    //                     onChange={handleChange}
    //                     placeholder="Enter phone number"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please enter your phone number.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Form.Group className="mb-3" controlId="address">
    //               <Form.Label>Business Address</Form.Label>
    //               <Form.Control
    //                 type="text"
    //                 name="address"
    //                 value={formData.address}
    //                 onChange={handleChange}
    //                 placeholder="Street address"
    //               />
    //             </Form.Group>

    //             <Row className="mb-4">
    //               <Col md={6}>
    //                 <Form.Group controlId="city">
    //                   <Form.Label>City</Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="city"
    //                     value={formData.city}
    //                     onChange={handleChange}
    //                     placeholder="City"
    //                   />
    //                 </Form.Group>
    //               </Col>

    //               <Col md={3}>
    //                 <Form.Group controlId="state">
    //                   <Form.Label>State</Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="state"
    //                     value={formData.state}
    //                     onChange={handleChange}
    //                     placeholder="State"
    //                   />
    //                 </Form.Group>
    //               </Col>

    //               <Col md={3}>
    //                 <Form.Group controlId="zip">
    //                   <Form.Label>ZIP Code</Form.Label>
    //                   <Form.Control
    //                     type="text"
    //                     name="zip"
    //                     value={formData.zip}
    //                     onChange={handleChange}
    //                     placeholder="ZIP code"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //             </Row>
    //           </div>
    //         )}

    //         {step === 3 && (
    //           <div className="form-step">
    //             <h3 className="mb-4 d-flex align-items-center">
    //               {" "}
    //               Service Information
    //             </h3>

    //             <Form.Group className="mb-4" controlId="services">
    //               <Form.Label>
    //                 Services Offered <span className="text-danger">*</span>
    //               </Form.Label>
    //               <div className="service-checkboxes">
    //                 <Row>
    //                   {serviceOptions.map((service, index) => (
    //                     <Col key={index} md={6} className="mb-2">
    //                       <Form.Check
    //                         type="checkbox"
    //                         id={`service-${index}`}
    //                         label={service}
    //                         value={service}
    //                         checked={formData.services.includes(service)}
    //                         onChange={handleChange}
    //                       />
    //                     </Col>
    //                   ))}
    //                 </Row>
    //               </div>
    //               {validated && formData.services.length === 0 && (
    //                 <div className="text-danger small">
    //                   Please select at least one service.
    //                 </div>
    //               )}
    //             </Form.Group>

    //             <Row className="mb-4">
    //               <Col md={6}>
    //                 <Form.Group controlId="priceRange">
    //                   <Form.Label>
    //                     Price Range <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Select
    //                     required
    //                     name="priceRange"
    //                     value={formData.priceRange}
    //                     onChange={handleChange}
    //                   >
    //                     <option value="">
    //                       Select your typical price range
    //                     </option>
    //                     {priceRanges.map((range, index) => (
    //                       <option key={index} value={range}>
    //                         {range}
    //                       </option>
    //                     ))}
    //                   </Form.Select>
    //                   <Form.Control.Feedback type="invalid">
    //                     Please select your price range.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>

    //               <Col md={6}>
    //                 <Form.Group controlId="website">
    //                   <Form.Label>Website</Form.Label>
    //                   <Form.Control
    //                     type="url"
    //                     name="website"
    //                     value={formData.website}
    //                     onChange={handleChange}
    //                     placeholder="https://yourbusiness.com"
    //                   />
    //                 </Form.Group>
    //               </Col>
    //             </Row>
    //           </div>
    //         )}

    //         {step === 4 && (
    //           <div className="form-step">
    //             <h3 className="mb-4 d-flex align-items-center">
    //               Account Setup
    //             </h3>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="username">
    //                   <Form.Label>
    //                     Username <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="text"
    //                     name="username"
    //                     value={formData.username}
    //                     onChange={handleChange}
    //                     placeholder="Choose a username"
    //                   />
    //                   <Form.Control.Feedback type="invalid">
    //                     Please choose a username.
    //                   </Form.Control.Feedback>
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Row className="mb-3">
    //               <Col md={6}>
    //                 <Form.Group controlId="password">
    //                   <Form.Label>
    //                     Password <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="password"
    //                     name="password"
    //                     value={formData.password}
    //                     onChange={handleChange}
    //                     placeholder="Create a password"
    //                   />
    //                   <Form.Text muted>
    //                     Minimum 8 characters with at least 1 number and 1
    //                     special character
    //                   </Form.Text>
    //                 </Form.Group>
    //               </Col>

    //               <Col md={6}>
    //                 <Form.Group controlId="confirmPassword">
    //                   <Form.Label>
    //                     Confirm Password <span className="text-danger">*</span>
    //                   </Form.Label>
    //                   <Form.Control
    //                     required
    //                     type="password"
    //                     name="confirmPassword"
    //                     value={formData.confirmPassword}
    //                     onChange={handleChange}
    //                     placeholder="Confirm your password"
    //                   />
    //                   {validated &&
    //                     formData.password !== formData.confirmPassword && (
    //                       <div className="text-danger small">
    //                         Passwords do not match.
    //                       </div>
    //                     )}
    //                 </Form.Group>
    //               </Col>
    //             </Row>

    //             <Form.Group className="mb-4" controlId="acceptTerms">
    //               <Form.Check
    //                 required
    //                 type="checkbox"
    //                 label={
    //                   <span>
    //                     I agree to the <a href="#">Terms of Service</a> and{" "}
    //                     <a href="#">Privacy Policy</a>{" "}
    //                     <span className="text-danger">*</span>
    //                   </span>
    //                 }
    //                 name="acceptTerms"
    //                 checked={formData.acceptTerms}
    //                 onChange={(e) =>
    //                   setFormData({
    //                     ...formData,
    //                     acceptTerms: e.target.checked,
    //                   })
    //                 }
    //               />
    //               {validated && !formData.acceptTerms && (
    //                 <div className="text-danger small">
    //                   You must accept the terms to proceed.
    //                 </div>
    //               )}
    //             </Form.Group>

    //             <div className="benefits-card bg-light p-4 rounded mb-4">
    //               <h5 className="mb-3">Premium Vendor Benefits</h5>
    //               <ul className="benefits-list">
    //                 <li>
    //                   <FaCheck className="text-success me-2" /> Featured
    //                   placement in search results
    //                 </li>
    //                 <li>
    //                   <FaCheck className="text-success me-2" /> Unlimited photo
    //                   uploads
    //                 </li>
    //                 <li>
    //                   <FaCheck className="text-success me-2" /> Detailed
    //                   analytics dashboard
    //                 </li>
    //                 <li>
    //                   <FaCheck className="text-success me-2" /> Direct messaging
    //                   with clients
    //                 </li>
    //                 <li>
    //                   <FaCheck className="text-success me-2" /> Customizable
    //                   profile page
    //                 </li>
    //               </ul>
    //             </div>
    //           </div>
    //         )}

    //         <div className="d-flex justify-content-between mt-4">
    //           {step > 1 && (
    //             <Button variant="outline-primary" onClick={handlePrev}>
    //               Previous
    //             </Button>
    //           )}

    //           {step < 4 ? (
    //             <Button variant="primary" type="submit">
    //               Next Step <i className="ms-2 fas fa-arrow-right"></i>
    //             </Button>
    //           ) : (
    //             <Button variant="success" type="submit">
    //               Complete Registration <FaCheck className="ms-2" />
    //             </Button>
    //           )}
    //         </div>
    //       </Form>
    //     </div>

    //     {/* <div className="card-footer bg-light p-4">
    //       <div className="text-center">
    //         <p className="mb-2">
    //           Already have an account? <a href="#">Sign in</a>
    //         </p>
    //         <div className="d-flex justify-content-center gap-3">
    //           <span>
    //             <FaPhone className="me-2 text-primary" /> +91 98765 43210
    //           </span>
    //           <span>
    //             <FaEnvelope className="me-2 text-primary" /> support@vendors.com
    //           </span>
    //           <span>
    //             <FaGlobe className="me-2 text-primary" /> www.vendorsnetwork.com
    //           </span>
    //         </div>
    //       </div>
    //     </div> */}
    //   </div>
    // </div>
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
        {/* Left Image */}
        <div
          className="col-lg-5 d-none d-lg-block position-relative"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop') center/cover",
            minHeight: "600px",
          }}
        >
          <div className="position-absolute bottom-0 start-0 p-5 text-white">
            <h2 className="display-5 fw-light mb-3">
              Your Perfect Wedding Starts Here
            </h2>
            <p className="mb-0">
              Join thousands of vendors who help couples plan their dream
              wedding.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-lg-7 p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Vendor Registration</h2>
            <p className="text-muted">
              Create your vendor account to start providing services for
              weddings.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-4">
              {/* Brand Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="brandName"
                    className={`form-control ${
                      errors.brandName ? "is-invalid" : ""
                    }`}
                    placeholder="Brand Name"
                    value={formData.brandName}
                    onChange={handleChange}
                  />
                  <label>Brand Name</label>
                  {errors.brandName && (
                    <div className="invalid-feedback">{errors.brandName}</div>
                  )}
                </div>
              </div>

              {/* Vendor Type */}
              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    name="vendorType"
                    className={`form-select ${
                      errors.vendorType ? "is-invalid" : ""
                    }`}
                    value={formData.vendorType}
                    onChange={handleChange}
                  >
                    <option value="">Select Vendor Type</option>
                    <option value="venue">Venue</option>
                    <option value="caterer">Caterer</option>
                    <option value="photographer">Photographer</option>
                    <option value="florist">Florist</option>
                    <option value="dj">DJ</option>
                    <option value="wedding-planner">Wedding Planner</option>
                  </select>
                  <label>Vendor Type</label>
                  {errors.vendorType && (
                    <div className="invalid-feedback">{errors.vendorType}</div>
                  )}
                </div>
              </div>

              {/* Email + City */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label>Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    name="city"
                    className={`form-select ${errors.city ? "is-invalid" : ""}`}
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Select city</option>
                    {cities.map((city, i) => (
                      <option key={i} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <label>City</label>
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>
              </div>

              {/* Password with view/hide toggle */}
              <div className="col-md-6">
                <div className="form-floating position-relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label>Password</label>
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    <i
                      className={`bi ${
                        passwordVisible ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <label>Phone</label>
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-grid mb-4">
              <button
                type="submit"
                className="btn btn-lg btn-primary fw-medium py-3"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                )}
                Create Vendor Account
              </button>
            </div>

            <div className="text-center d-flex justify-content-between">
              <p className="text-muted">
                I have an account?
                <Link
                  to="/vendor-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Vendor Login
                </Link>
              </p>
              <p className="text-muted">
                I Am a Customer?
                <Link
                  to="/customer-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Customer Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
