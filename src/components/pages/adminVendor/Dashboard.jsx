// src/pages/adminpanel/Dashboard.js
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  FiCalendar,
  FiStar,
  FiMessageSquare,
  FiUserPlus,
} from "react-icons/fi";

const Dashboard = () => {
  // Widget data
  const stats = [
    {
      id: 1,
      title: "Total Bookings",
      value: 127,
      change: "+12%",
      icon: <FiCalendar size={24} />,
      color: "primary",
    },
    {
      id: 2,
      title: "Average Rating",
      value: "4.8",
      subtitle: "/ 5.0",
      change: "+0.2",
      icon: <FiStar size={24} />,
      color: "warning",
    },
    {
      id: 3,
      title: "New Messages",
      value: 18,
      change: "-3",
      icon: <FiMessageSquare size={24} />,
      color: "info",
    },
    {
      id: 4,
      title: "Pending Requests",
      value: 8,
      change: "+2",
      icon: <FiUserPlus size={24} />,
      color: "success",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header mb-4">
        <h2 className="page-title">Vendor Dashboard</h2>
      </div>

      {/* Stats Widgets */}
      <Row className="mb-4">
        {stats.map((stat) => (
          <Col md={6} lg={3} key={stat.id} className="mb-4 mb-lg-0">
            <Card className={`stat-widget border-0 bg-${stat.color}-light`}>
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className={`icon-circle bg-${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-0">
                      {stat.value} {stat.subtitle}
                    </h5>
                    <p className="text-muted mb-0">{stat.title}</p>
                  </div>
                  <div
                    className={`ms-auto badge bg-${
                      stat.change.includes("+") ? "success" : "danger"
                    }`}
                  >
                    {stat.change}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Analytics Chart */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <Card.Title>Performance Analytics</Card.Title>
            </Card.Header>
            <Card.Body>{/* <DashboardChart /> */}</Card.Body>
          </Card>

          {/* Bookings Table */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Recent Bookings</Card.Title>
              <a href="#" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </Card.Header>
            <Card.Body className="p-0">{/* <BookingTable /> */}</Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Requests Card */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>New Requests</Card.Title>
              <a href="#" className="btn btn-sm btn-outline-primary">
                Manage
              </a>
            </Card.Header>
            <Card.Body className="p-0">{/* <RequestTable /> */}</Card.Body>
          </Card>

          {/* Reviews Card */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Recent Reviews</Card.Title>
              <a href="#" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </Card.Header>
            <Card.Body className="p-0">{/* <ReviewList /> */}</Card.Body>
          </Card>

          {/* Notifications Card */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title>Notifications</Card.Title>
              <a href="#" className="btn btn-sm btn-outline-primary">
                View All
              </a>
            </Card.Header>
            <Card.Body className="p-0">{/* <NotificationList /> */}</Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
