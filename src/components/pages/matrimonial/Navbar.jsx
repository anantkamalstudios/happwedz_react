// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="logo">
            <span className="logo-primary">Jeevan</span>
            <span className="logo-secondary">Saathi</span>
          </Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-item">
            <Link to="/" className="nav-link active">
              Home
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/search" className="nav-link">
              Search
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/matches" className="nav-link">
              Matches
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/premium" className="nav-link">
              Premium
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/community" className="nav-link">
              Community
            </Link>
          </div>
          <div className="navbar-item">
            <Link to="/help" className="nav-link">
              Help
            </Link>
          </div>
        </div>

        <div className="navbar-actions">
          <button className="btn btn-login">Login</button>
          <button className="btn btn-register">Register Free</button>
        </div>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
