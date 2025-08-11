// src/pages/adminpanel/AdminPanel.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col, Offcanvas } from "react-bootstrap";
import {
  FiHome,
  FiEdit,
  FiCalendar,
  FiMail,
  FiUsers,
  FiStar,
  FiBell,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminPanel = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      path: "/",
      icon: <FiHome size={20} />,
      label: "Dashboard",
    },
    {
      id: "modify",
      path: "/modify-profile",
      icon: <FiEdit size={20} />,
      label: "Modify Profile",
    },
    {
      id: "bookings",
      path: "/bookings",
      icon: <FiCalendar size={20} />,
      label: "Bookings",
      badge: 12,
    },
    {
      id: "messages",
      path: "/messages",
      icon: <FiMail size={20} />,
      label: "Messages",
      badge: 5,
    },
    {
      id: "requests",
      path: "/requests",
      icon: <FiUsers size={20} />,
      label: "Requests",
      badge: 8,
    },
    {
      id: "reviews",
      path: "/reviews",
      icon: <FiStar size={20} />,
      label: "Reviews",
    },
    {
      id: "notifications",
      path: "/notifications",
      icon: <FiBell size={20} />,
      label: "Notifications",
      badge: 3,
    },
    {
      id: "analytics",
      path: "/analytics",
      icon: <FiBarChart2 size={20} />,
      label: "Analytics",
    },
    {
      id: "settings",
      path: "/settings",
      icon: <FiSettings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="admin-panel">
      {/* Mobile Menu Offcanvas */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        className="mobile-menu"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>WeddingVendor Pro</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AdminSidebar
            navItems={navItems}
            onSelect={() => setShowMobileMenu(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <AdminTopbar onMenuToggle={() => setShowMobileMenu(true)} />

      <Container fluid>
        <Row>
          {/* Desktop Sidebar */}
          <Col md={3} lg={2} className="d-none d-md-block sidebar-col">
            <AdminSidebar navItems={navItems} />
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="main-content">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPanel;
