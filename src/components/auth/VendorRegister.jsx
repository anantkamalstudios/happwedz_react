import React, { useState } from "react";
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

const VendorRegister = () => {
  const [step, setStep] = useState(1);

  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    yearsInBusiness: "",
    description: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    services: [],
    priceRange: "",
    website: "",
    username: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const businessTypes = [
    "Venue",
    "Catering",
    "Photography",
    "Videography",
    "Florist",
    "DJ/Band",
    "Makeup Artist",
    "Decorator",
    "Wedding Planner",
    "Bakery",
  ];

  const serviceOptions = [
    "Full Wedding Planning",
    "Day-of Coordination",
    "Venue Selection",
    "Catering Services",
    "Photography",
    "Videography",
    "Floral Design",
    "Entertainment",
    "Lighting & Decor",
    "Transportation",
    "Invitations",
    "Wedding Cake",
    "Hair & Makeup",
    "Officiant Services",
    "Rentals",
  ];

  const priceRanges = [
    "Budget (Under ₹50,000)",
    "Moderate (₹50,000 - ₹1,50,000)",
    "Premium (₹1,50,000 - ₹3,00,000)",
    "Luxury (₹3,00,000+)",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const newServices = [...formData.services];
      if (checked) {
        newServices.push(value);
      } else {
        const index = newServices.indexOf(value);
        if (index > -1) {
          newServices.splice(index, 1);
        }
      }
      setFormData({ ...formData, services: newServices });
    } else if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    let isValid = true;

    if (step === 1) {
      if (
        !formData.businessName ||
        !formData.businessType ||
        !formData.description
      ) {
        isValid = false;
      }
    } else if (step === 2) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone
      ) {
        isValid = false;
      }
    } else if (step === 3) {
      if (formData.services.length === 0 || !formData.priceRange) {
        isValid = false;
      }
    }

    if (isValid) {
      setStep(step + 1);
      setValidated(false);
    } else {
      setValidated(true);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation
    if (
      formData.username &&
      formData.password &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms
    ) {
      // Submit form logic here
      console.log("Form submitted:", formData);
      alert("Thank you for signing up! Your vendor account is being reviewed.");
    } else {
      setValidated(true);
    }
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="vendor-signup-form container-fluid">
      <div className="card shadow-sm shadow-sm">
        <div className="card-header p-4">
          <h2 className="mb-0">Vendor Signup</h2>
          <p className="mb-0">
            Create your professional vendor profile in minutes
          </p>
        </div>

        <div className="card-body p-4">
          <div className="mb-4">
            <ProgressBar
              now={progressPercentage}
              variant="primary"
              className="mb-3"
              style={{ height: "20px" }}
              label={`Step ${step} of 4`}
            />
            <div className="d-flex justify-content-between">
              <span className={`step-indicator ${step >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span> Business Info
              </span>
              <span className={`step-indicator ${step >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span> Contact Info
              </span>
              <span className={`step-indicator ${step >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span> Services
              </span>
              <span className={`step-indicator ${step >= 4 ? "active" : ""}`}>
                <span className="step-number">4</span> Account
              </span>
            </div>
          </div>

          <Form
            className="custom-form"
            noValidate
            validated={validated}
            onSubmit={step < 4 ? handleNext : handleSubmit}
          >
            {step === 1 && (
              <div className="form-step">
                <h3 className="mb-4 d-flex align-items-center">
                  {" "}
                  Business Information
                </h3>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="businessName">
                      <Form.Label>
                        Business Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter your business name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your business name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="businessType">
                      <Form.Label>
                        Business Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        required
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type, index) => (
                          <option key={index} value={type}>
                            {type}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select your business type.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="yearsInBusiness">
                      <Form.Label>Years in Business</Form.Label>
                      <Form.Control
                        type="number"
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        min="0"
                        placeholder="Number of years"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="description">
                  <Form.Label>
                    Business Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your business, services, and what makes you unique"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a business description.
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    This will be displayed on your public profile. Minimum 100
                    characters recommended.
                  </Form.Text>
                </Form.Group>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <h3 className="mb-4 d-flex align-items-center">
                  <FaUser className="me-2 text-primary" /> Contact Information
                </h3>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="firstName">
                      <Form.Label>
                        First Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your first name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="lastName">
                      <Form.Label>
                        Last Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>
                        Email <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>
                        Phone <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Business Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group controlId="state">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group controlId="zip">
                      <Form.Label>ZIP Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="ZIP code"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <h3 className="mb-4 d-flex align-items-center">
                  {" "}
                  Service Information
                </h3>

                <Form.Group className="mb-4" controlId="services">
                  <Form.Label>
                    Services Offered <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="service-checkboxes">
                    <Row>
                      {serviceOptions.map((service, index) => (
                        <Col key={index} md={6} className="mb-2">
                          <Form.Check
                            type="checkbox"
                            id={`service-${index}`}
                            label={service}
                            value={service}
                            checked={formData.services.includes(service)}
                            onChange={handleChange}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                  {validated && formData.services.length === 0 && (
                    <div className="text-danger small">
                      Please select at least one service.
                    </div>
                  )}
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="priceRange">
                      <Form.Label>
                        Price Range <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        required
                        name="priceRange"
                        value={formData.priceRange}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select your typical price range
                        </option>
                        {priceRanges.map((range, index) => (
                          <option key={index} value={range}>
                            {range}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select your price range.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="website">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yourbusiness.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h3 className="mb-4 d-flex align-items-center">
                  Account Setup
                </h3>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="username">
                      <Form.Label>
                        Username <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please choose a username.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="password">
                      <Form.Label>
                        Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                      />
                      <Form.Text muted>
                        Minimum 8 characters with at least 1 number and 1
                        special character
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="confirmPassword">
                      <Form.Label>
                        Confirm Password <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                      />
                      {validated &&
                        formData.password !== formData.confirmPassword && (
                          <div className="text-danger small">
                            Passwords do not match.
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="acceptTerms">
                  <Form.Check
                    required
                    type="checkbox"
                    label={
                      <span>
                        I agree to the <a href="#">Terms of Service</a> and{" "}
                        <a href="#">Privacy Policy</a>{" "}
                        <span className="text-danger">*</span>
                      </span>
                    }
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptTerms: e.target.checked,
                      })
                    }
                  />
                  {validated && !formData.acceptTerms && (
                    <div className="text-danger small">
                      You must accept the terms to proceed.
                    </div>
                  )}
                </Form.Group>

                <div className="benefits-card bg-light p-4 rounded mb-4">
                  <h5 className="mb-3">Premium Vendor Benefits</h5>
                  <ul className="benefits-list">
                    <li>
                      <FaCheck className="text-success me-2" /> Featured
                      placement in search results
                    </li>
                    <li>
                      <FaCheck className="text-success me-2" /> Unlimited photo
                      uploads
                    </li>
                    <li>
                      <FaCheck className="text-success me-2" /> Detailed
                      analytics dashboard
                    </li>
                    <li>
                      <FaCheck className="text-success me-2" /> Direct messaging
                      with clients
                    </li>
                    <li>
                      <FaCheck className="text-success me-2" /> Customizable
                      profile page
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              {step > 1 && (
                <Button variant="outline-primary" onClick={handlePrev}>
                  Previous
                </Button>
              )}

              {step < 4 ? (
                <Button variant="primary" type="submit">
                  Next Step <i className="ms-2 fas fa-arrow-right"></i>
                </Button>
              ) : (
                <Button variant="success" type="submit">
                  Complete Registration <FaCheck className="ms-2" />
                </Button>
              )}
            </div>
          </Form>
        </div>

        {/* <div className="card-footer bg-light p-4">
          <div className="text-center">
            <p className="mb-2">
              Already have an account? <a href="#">Sign in</a>
            </p>
            <div className="d-flex justify-content-center gap-3">
              <span>
                <FaPhone className="me-2 text-primary" /> +91 98765 43210
              </span>
              <span>
                <FaEnvelope className="me-2 text-primary" /> support@vendors.com
              </span>
              <span>
                <FaGlobe className="me-2 text-primary" /> www.vendorsnetwork.com
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default VendorRegister;
