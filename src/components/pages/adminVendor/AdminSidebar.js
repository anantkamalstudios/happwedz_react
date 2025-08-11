// src/components/admin/AdminSidebar.js
import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ navItems, onSelect }) => {
  const location = useLocation();

  return (
    <div className="admin-sidebar">
      <div className="logo-container p-4 text-center">
        <h3 className="logo-text">
          <span className="text-primary">Wedding</span>Vendor
          <span className="text-warning">Pro</span>
        </h3>
      </div>

      <Nav className="flex-column">
        {navItems.map((item) => (
          <Nav.Item key={item.id}>
            <Nav.Link
              as={Link}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={onSelect}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="badge bg-warning ms-auto">{item.badge}</span>
              )}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default AdminSidebar;
