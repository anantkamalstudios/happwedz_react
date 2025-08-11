// src/components/admin/AdminTopbar.js
import React from "react";
import { Container, Form, Navbar, Nav, Dropdown, Badge } from "react-bootstrap";
import { FiMenu, FiSearch, FiMail, FiBell, FiUser } from "react-icons/fi";

const AdminTopbar = ({ onMenuToggle }) => {
  return (
    <Navbar bg="white" expand="lg" className="admin-topbar shadow-sm">
      <Container fluid>
        <button className="btn btn-sm d-md-none" onClick={onMenuToggle}>
          <FiMenu size={20} />
        </button>

        <Form className="d-flex search-bar">
          <div className="input-group">
            <span className="input-group-text bg-transparent border-end-0">
              <FiSearch />
            </span>
            <Form.Control
              type="search"
              placeholder="Search..."
              className="border-start-0"
            />
          </div>
        </Form>

        <Nav className="ms-auto">
          <Nav.Link className="position-relative">
            <FiMail size={20} />
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle badge-sm"
            >
              3
            </Badge>
          </Nav.Link>

          <Nav.Link className="position-relative">
            <FiBell size={20} />
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle badge-sm"
            >
              5
            </Badge>
          </Nav.Link>

          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="user-dropdown">
              <div className="d-flex align-items-center">
                <div className="avatar me-2">
                  <FiUser />
                </div>
                <div className="d-none d-sm-block">
                  <span className="user-name">John Doe</span>
                </div>
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/profile">My Profile</Dropdown.Item>
              <Dropdown.Item href="#/settings">Account Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminTopbar;
