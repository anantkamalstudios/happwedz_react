import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import {
  FaWhatsapp,
  FaCheck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTags,
  FaHandshake,
  FaHeadset,
  FaFileContract,
  FaEnvelope,
  FaGift,
} from "react-icons/fa";

const Genie = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPackage(null);
  };

  const packages = [
    {
      id: 1,
      title: "Destination Wedding Package",
      description:
        "Perfect for all your destination wedding venue and vendor needs.",
      price: "₹ 10",
      crossPrice: "₹ 4999",
      validity: "30 days",
      features: [
        "Find venues with all-inclusive pricing (rooms, 3 meals, and event spaces), with available dates and quotes that fit your budget.",
        "Get personalized vendor recommendations for photographers, decorators, planners, caterers, makeup artists, and more",
        "Enjoy up to two meetings (virtual or in-person) for expert assistance",
        "Benefit from top-tier price negotiations",
        "Continuous support through follow-ups and virtual assistance until booking is finalized",
        "Professional vetting of vendor contracts",
        "Choose a free digital invite or enjoy 50% off Video invites",
      ],
      icon: <FaMapMarkerAlt className="hw-text-primary" size={25} />,
    },
    {
      id: 2,
      title: "City Wedding Package",
      description: "Ideal for hometown or local wedding planning.",
      price: "₹ 100",
      crossPrice: "₹ 4999",
      validity: "60 days",
      features: [
        "Resolve venue suggestions with date availability and quotes tailored to your budget and location",
        "Get expert vendor recommendations in any 5 categories of your choice",
        "One video meeting for personalized assistance",
        "Benefit from the best price negotiations",
        "Ongoing virtual support until the booking is finalized",
        "Enjoy 20% off on Video invites",
      ],
      icon: <FaUsers className="hw-text-primary" size={25} />,
    },
    {
      id: 3,
      title: "Single Wedding Service",
      description: "Ideal for venue booking or single wedding service",
      price: "₹ 1000",
      crossPrice: "₹ 4999",
      validity: "45 days",
      features: [
        "Tailored suggestions for venues or vendors (based on your selection), customized to your budget and preferred location (One city)",
        "Expert price negotiations to ensure the best deals",
        "Ongoing virtual support until your booking is confirmed",
      ],
      icon: <FaHandshake className="hw-text-primary" size={25} />,
    },
  ];

  return (
    <div className="genie-service-page">
      {/* Header Section */}
      <header className="genie-header py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="mb-4">
                <h1 className="display-4 fw-bold">
                  <span className="hw-text-primary">HW</span> Genie
                </h1>
                <h2 className="h3 mb-3">Virtual Planning Service</h2>
                <p className="lead">
                  The smart way to find venues & vendors for your wedding
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <img
                src="https://testimage.wedmegood.com/resized-nw/1900X/uploads/Genie_Banner_Web.jpg"
                alt="HW Genie Service"
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </header>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon mx-auto mb-3">
                <FaUsers size="2.5rem" className="hw-text-primary" />
              </div>
              <h4>Tailored Vendor Picks</h4>
              <p className="text-muted">
                Personalized recommendations based on your preferences
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon mx-auto mb-3">
                <FaTags size="2.5rem" className="hw-text-primary" />
              </div>
              <h4>Best Deals</h4>
              <p className="text-muted">
                Get the most value with our negotiation expertise
              </p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="feature-icon mx-auto mb-3">
                <FaHeadset size="2.5rem" className="hw-text-primary" />
              </div>
              <h4>Expert Help & Support</h4>
              <p className="text-muted">
                Guidance from wedding planning experts
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="contact-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <div className="contact-card p-4 bg-primary text-white rounded shadow">
                <h3 className="mb-3">Have Questions?</h3>
                <p className="mb-3">Connect with our genie experts on</p>
                <div className="d-flex align-items-center justify-content-center">
                  <FaWhatsapp size="1.5rem" className="me-2" />
                  <a
                    href="https://wa.me/91882665276"
                    className="text-white h5 mb-0 text-decoration-none"
                  >
                    +91882665276 (Whatsapp only)
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Packages Section */}
      <section className="packages-section py-5">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title mb-3">Select Package</h2>
              <p className="lead">HW Genie can help out!</p>
            </Col>
          </Row>

          <Row>
            {packages.map((pkg) => (
              <Col lg={4} md={6} className="mb-4" key={pkg.id}>
                <Card className="package-card h-100 shadow-sm border-0">
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      {/* Icon + Price Row */}
                      <div className="d-flex flex-column align-items-center mb-3">
                        {/* Icon */}
                        <div className="package-icon mb-2">{pkg.icon}</div>

                        {/* Price */}
                        <div className="price-section d-flex flex-column align-items-center">
                          <span
                            className="fw-bold"
                            style={{
                              fontSize: "20px",
                              color: "var(--primary-color)",
                            }}
                          >
                            {pkg.price}
                          </span>
                          <span
                            className="text-muted"
                            style={{
                              textDecoration: "line-through",
                              fontSize: "14px",
                            }}
                          >
                            {pkg.crossPrice}
                          </span>
                        </div>
                      </div>

                      {/* Title + Description (unchanged) */}
                      <div>
                        <h4
                          className="card-title mb-2 text-center justify-content-center"
                          style={{ margin: 0 }}
                        >
                          {pkg.title}
                        </h4>
                        <p className="text-muted mb-0 text-center">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    <ul className="features-list list-unstyled mb-4">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <FaCheck
                            size="0.8rem"
                            className="text-success me-2"
                          />
                          <small>{feature}</small>
                        </li>
                      ))}
                    </ul>

                    <div className="package-meta d-flex justify-content-between mb-4">
                      <div>
                        <small className="text-muted">
                          Offer valid for {pkg.validity}
                        </small>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      Continue &gt;
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Package Selection Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Genie Booking Assistance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <Container>
              <Row>
                {/* Left Side - Form */}
                <Col md={7}>
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Full name*</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                      />
                    </div>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">Email address*</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">Mobile number*</label>
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="+91"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">
                            Function date (From)*
                          </label>
                          <input
                            type="date"
                            className="form-control rounded-0"
                          />
                        </div>
                      </Col>

                      <Col md={6}>
                        <div className="mb-3">
                          <label className="form-label">
                            Function date (To)*
                          </label>
                          <input
                            type="date"
                            className="form-control rounded-0"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <div className="mb-3">
                          <label className="form-label">Wedding city*</label>
                          <input
                            type="text"
                            className="form-control rounded-0"
                            placeholder="Wedding city"
                          />
                        </div>
                      </Col>
                    </Row>
                  </form>
                </Col>

                {/* Right Side - Checkout Summary */}
                <Col md={5}>
                  <Card className="border-0 shadow-sm checkout-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">
                          <FaTags className="me-2 text-danger" /> All Coupons
                        </h6>
                        <a
                          href="#"
                          className="small text-decoration-none hw-text-primary"
                        >
                          View All &gt;
                        </a>
                      </div>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Coupon code"
                        />
                        <button className="btn btn-dark">APPLY</button>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          {selectedPackage.title}
                        </small>
                        <h5 className="fw-bold mb-0">
                          {selectedPackage.price}
                        </h5>
                      </div>
                      <Button
                        variant="danger"
                        className="w-100 fw-bold py-2"
                        onClick={() => {
                          alert("Proceed to Razorpay Checkout");
                        }}
                      >
                        {selectedPackage.price} – Continue
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Container className="border-2 bg-light p-4">
                {selectedPackage && (
                  <div>
                    <p className="lead">{selectedPackage.description}</p>
                    <h6 className="mb-3">Package Includes:</h6>
                    <ul className="list-unstyled">
                      {selectedPackage.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <FaCheck
                            size="0.8rem"
                            className="text-success me-2"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted">
                      Offer valid for {selectedPackage.validity}
                    </p>
                  </div>
                )}
              </Container>
            </Container>
          )}
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .genie-service-page {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .genie-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .feature-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 50%;
        }

        .contact-card {
          background: linear-gradient(135deg, #ff8d9aff 0%, #f5576cff 100%);
        }

        .section-title {
          position: relative;
          padding-bottom: 15px;
        }

        .section-title:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background-color: #4e54c8;
        }

        .package-card {
          transition: transform 0.3s, box-shadow 0.3s;
          border-radius: 12px;
        }

        .package-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .package-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f5ff;
          border-radius: 50%;
        }

        .features-list li {
          font-size: 0.9rem;
        }
        .checkout-card {
          background: #fff5f6;
          border-radius: 12px;
        }
        .checkout-card h5 {
          color: #d63384;
        }
        .form-control {
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default Genie;
