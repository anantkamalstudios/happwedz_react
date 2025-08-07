import React from "react";
import { FaFire, FaClock } from "react-icons/fa";
import { Form, Row, Col, Container } from "react-bootstrap";
import { BiSort } from "react-icons/bi";
import { TbArrowsSort } from "react-icons/tb";

const SortSection = () => {
  return (
    <Container fluid>
      <Row className="align-items-center justify-content-between mb-3">
        <Col
          xs={12}
          md="auto"
          className="d-flex flex-wrap align-items-center gap-2 mb-2 mb-md-0"
        >
          <span className="fw-semibold">Sort by:</span>

          <button className="btn  btn-sm d-flex align-items-center gap-1">
            <BiSort />
            Recent
          </button>

          <button className="btn btn-sm d-flex align-items-center gap-1">
            <TbArrowsSort />
            Trending
          </button>
        </Col>

        <Col xs={12} md={6}>
          <Form.Control
            type="search"
            placeholder="Search photos..."
            className="form-control rounded-3"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SortSection;
