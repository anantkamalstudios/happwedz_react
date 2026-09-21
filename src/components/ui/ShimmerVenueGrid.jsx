import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Loading placeholder for the venue grid (layouts/Main/GridView.jsx).
 *
 * Uses the same Container/Row/Col/Card structure and the same 240px image
 * block as the real card, so the grid doesn't jump when the data arrives.
 * If you change the card layout in GridView, change it here too.
 */
const ShimmerVenueGrid = ({ count = 6, colLg = 4 }) => (
  <Container fluid aria-busy="true" aria-label="Loading venues">
    <Row>
      {Array.from({ length: count }).map((_, i) => (
        <Col key={i} xs={12} sm={6} lg={colLg} className="mb-4 d-flex">
          <Card className="border-0 main-grid-cards rounded-4 overflow-hidden p-2 h-100 d-flex flex-column w-100">
            <div className="flex-shrink-0" style={{ height: "240px" }}>
              <Skeleton height="100%" borderRadius="15px" style={{ display: "block" }} />
            </div>

            <Card.Body className="p-3 d-flex flex-column flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <Skeleton width={180} height={22} />
                <Skeleton width={50} height={18} />
              </div>
              <Skeleton width={110} height={14} className="mb-2" />
              <Skeleton width={150} height={14} className="mb-3" />
              <div className="d-flex gap-2 mb-3">
                <Skeleton width={90} height={30} borderRadius="0.5rem" />
                <Skeleton width={90} height={30} borderRadius="0.5rem" />
              </div>
              <div className="mt-auto">
                <Skeleton height={40} borderRadius="0.5rem" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default ShimmerVenueGrid;
