import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import EventDatePicker from "./DayPicker";

const PricingModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDate: "",
    message: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, eventDate: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, eventDate } = formData;

    if (!firstName || !lastName || !email || !phone || !eventDate) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Thank you! Your pricing request has been submitted successfully.");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      eventDate: "",
      message: "",
    });
    handleClose();
  };

  return (
    <>
      <div className="pricing-model">
        {/* <Button
          variant="primary"
          size="lg"
          onClick={handleShow}
          className="mb-3"
        >
          Request Pricing
        </Button> */}

        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <div className="d-flex flex-column">
              <h4 className="mb-1 text-muted" style={{ fontSize: "16px" }}>
                Location
              </h4>
              <h4 className="mb-1">Request Pricing Information</h4>
              <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem
                fugit earum, neque magni illo nesciunt dolorum, beatae ullam est
                sapiente et labore officiis culpa. Aut quaerat expedita rerum
                inventore voluptatum!
              </p>
            </div>
          </Modal.Header>

          <Modal.Body>
            <Form onSubmit={handleSubmit} className="custom-form">
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
              <Button type="submit" variant="primary" className="w-100">
                <FaPaperPlane className="me-2" /> Send Request
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default PricingModal;
