import React from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const VenueSearch = () => {
    return (
        <section className="bg-white position-relative overflow-hidden">
            <div className="">
                <Row className="mx-5">
                    {/* Left Side - Text & Search */}
                    <Col md={6} className="z-1 rounded-end-pill" style={{ borderTopLeftRadius: "200px", borderBottomLeftRadius: "200px" }}>
                        {/* Breadcrumb */}
                        <div className="mb-2">
                            <span className="text-muted small">Wedding</span>
                            <span className="mx-2 text-muted small">/</span>
                            <span className="text-muted small">Wedding Venues</span>
                        </div>

                        {/* Heading */}
                        <h1 className="fw-bold text-primary mb-4">Wedding venues</h1>

                        {/* Search Bar */}
                        <div className="bg-white   shadow d-flex align-items-center overflow-hidden" style={{ maxWidth: "700px" }}>
                            <InputGroup>
                                <InputGroup.Text className="bg-white border-0 ps-3">
                                    <FaSearch />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Wedding Venues"
                                    className="border-0"
                                />
                                <InputGroup.Text className="bg-white border-0 px-2">in</InputGroup.Text>
                                <Form.Control
                                    placeholder="Location"
                                    className="border-0"
                                />
                                <Button variant="danger" className="px-4 ">
                                    Find
                                </Button>
                            </InputGroup>
                        </div>
                    </Col>

                    {/* Right Side - Image */}
                    <Col md={6} className="d-none d-md-block">
                        <img
                            src="https://cdn0.weddingwire.in/vendor/0200/3_2/640/jpg/weddingvenues-amita-rasa-eventspace-2_15_430200-166849155831730.webp"
                            alt="Wedding Table"
                            className="img-fluid"
                            style={{

                                objectFit: "cover",
                                height: "200px",
                                width: "600px",
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default VenueSearch;
