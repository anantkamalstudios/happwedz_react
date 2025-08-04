import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import LocationModalWithCategories from "./LocationModalWithCategories";

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg">
      <div className="container-fluid mx-5">
        <a className="navbar-brand" href="/">
          <img src="./images/logo.webp" alt="HappyWedz" height="40" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="row">
            <div className="col-12 py-2">
              <div className="container">
                <div className="row align-items-center gy-2">
                  {/* Left: Tagline */}
                  <div className="col-12 col-sm-6 col-lg-6 text-center text-sm-start">
                    <a className="nav-link text-white fw-semibold" href="#">
                      India's Favourite Wedding Planning Platform
                    </a>
                  </div>

                  {/* Center: Location */}
                  <div className="col-12 col-sm-6 col-lg-3 text-center">
                    <LocationModalWithCategories />
                  </div>

                  {/* Right: Icons */}
                  <div className="col-12 col-lg-3 d-flex justify-content-center justify-content-lg-end gap-3">
                    <a className="nav-link text-white p-0" href="#">
                      {/* Book Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-book-open-check-icon me-2"
                      >
                        <path d="M12 21V7" />
                        <path d="m16 12 2 2 4-4" />
                        <path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
                      </svg>
                    </a>

                    <a className="nav-link text-white p-0" href="#">
                      {/* Android Icon */}
                      <svg
                        fill="#fff"
                        width="24px"
                        height="24px"
                        viewBox="-2 -2 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="jam jam-android-circle me-2"
                      >
                        <path d="M6.39 8.248h-.026a.598.598 0 0 0-.596.596v2.594c0 .329.267.596.596.596h.026a.598.598 0 0 0 .596-.596V8.844a.598.598 0 0 0-.597-.596zM7.27 12.44c0 .3.247.546.548.546h.586v1.402c0 .329.268.596.596.596h.025a.598.598 0 0 0 .597-.596v-1.402h.818v1.402c0 .329.27.596.596.596h.026a.598.598 0 0 0 .596-.596v-1.402h.586c.3 0 .547-.245.547-.547V8.343H7.27v4.096zM11.406 5.859l.465-.718a.099.099 0 1 0-.166-.108l-.482.743a3.142 3.142 0 0 0-1.192-.232c-.427 0-.83.084-1.192.232l-.481-.743a.099.099 0 0 0-.137-.029.099.099 0 0 0-.03.137l.466.718c-.839.41-1.405 1.185-1.405 2.074 0 .055.004.109.009.162h5.541c.005-.053.008-.107.008-.162 0-.889-.566-1.663-1.404-2.074zm-2.66 1.284a.266.266 0 1 1 0-.532.266.266 0 0 1 0 .532zm2.57 0a.266.266 0 1 1-.001-.532.266.266 0 0 1 0 .532zM13.698 8.248h-.025a.598.598 0 0 0-.597.596v2.594c0 .329.27.596.597.596h.025a.597.597 0 0 0 .596-.596V8.844a.598.598 0 0 0-.596-.596z"></path>
                        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path>
                      </svg>
                    </a>

                    <a className="nav-link text-white p-0" href="#">
                      {/* App Store Icon */}
                      <svg
                        fill="#fff"
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        id="app-store"
                        data-name="Flat Line"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon flat-line me-2"
                      >
                        <line
                          x1="21"
                          y1="17"
                          x2="18"
                          y2="17"
                          style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                          }}
                        ></line>
                        <line
                          x1="20"
                          y1="21"
                          x2="14.29"
                          y2="10.72"
                          style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                          }}
                        ></line>
                        <line
                          x1="12"
                          y1="6.6"
                          x2="10"
                          y2="3"
                          style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                          }}
                        ></line>
                        <line
                          x1="14"
                          y1="3"
                          x2="4"
                          y2="21"
                          style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                          }}
                        ></line>
                        <line
                          x1="13"
                          y1="17"
                          x2="3"
                          y2="17"
                          style={{
                            fill: "none",
                            stroke: "#fff",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                          }}
                        ></line>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="col-12 py-2">
              <div className="container">
                <div className="row align-items-start flex-column flex-lg-row">
                  <div className="col-12 col-lg-9">
                    <ul className="navbar-nav d-flex flex-wrap flex-lg-nowrap gap-2 gap-lg-0 mb-3 mb-lg-0">
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <a
                          className="nav-link dropdown-toggle text-white"
                          href="#"
                        >
                          Venues
                        </a>
                        <div className="dropdown-menu mega-dropdown w-100 mt-0 shadow p-4">
                          <div className="container">
                            <div className="row">
                              {/* Column 1 */}
                              <div className="col-md-8">
                                <h6 className="fw-bold mb-3">By Type</h6>
                                <div className="row">
                                  {[
                                    "Banquet Halls",
                                    "Marriage Garden / Lawns",
                                    "Wedding Resorts",
                                    "Small Function / Party Halls",
                                    "Destination Wedding Venues",
                                    "Kalyana Mandapams",
                                    "4 Star & Above Wedding Hotels",
                                    "Venue Concierge Services",
                                    "Show More",
                                  ].map((item, i) => (
                                    <div
                                      className="col-6 col-md-4 mb-2"
                                      key={i}
                                    >
                                      <a
                                        href="#"
                                        className="text-dark text-decoration-none d-flex align-items-center"
                                      >
                                        <i className="bi bi-check-circle me-2"></i>{" "}
                                        {item}
                                      </a>
                                    </div>
                                  ))}
                                </div>

                                <h6 className="fw-bold mt-4">
                                  Complete Your Wedding Team
                                </h6>
                                <div className="d-flex flex-wrap">
                                  {[
                                    "Bandra",
                                    "Thane",
                                    "Kalyan",
                                    "Ulhasnagar",
                                    "Bhiwandi",
                                    "Panvel",
                                    "Andheri East",
                                  ].map((item, i) => (
                                    <a
                                      key={i}
                                      href="#"
                                      className="me-3 mt-2 text-decoration-none text-muted small"
                                    >
                                      {item}
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Column 2 - Right Panel */}
                              <div className="col-md-4 d-none d-md-block">
                                <div className="bg-white rounded shadow-sm p-3">
                                  <h6 className="fw-bold">
                                    Destination weddings
                                  </h6>
                                  <p className="mb-0 text-muted small">
                                    Easily plan your international wedding.
                                  </p>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/3176/3176294.png"
                                    alt="Destination"
                                    className="img-fluid mt-2"
                                    style={{ width: "40px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Vendors Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <a
                            className="nav-link dropdown-toggle text-white"
                            href="#"
                            id="vendorsDropdown"
                            role="button"
                          >
                            Vendors
                          </a>

                          <div
                            className="dropdown-menu mega-dropdown w-100 mt-0 shadow p-4"
                            aria-labelledby="vendorsDropdown"
                          >
                            <div className="container">
                              <div className="row">
                                {/* Column 1 */}
                                <div className="col-md-8">
                                  <h6 className="fw-bold mb-3">
                                    Start hiring your vendors
                                  </h6>
                                  <div className="row">
                                    {[
                                      "Wedding Photographers",
                                      "Wedding Videography",
                                      "Wedding Music",
                                      "Caterers",
                                      "Wedding Transportation",
                                      "Wedding Invitations",
                                      "Wedding Gifts",
                                      "Florists",
                                      "Wedding Planners",
                                    ].map((item, i) => (
                                      <div
                                        className="col-6 col-md-4 mb-2"
                                        key={i}
                                      >
                                        <a
                                          href="#"
                                          className="text-dark text-decoration-none d-flex align-items-center"
                                        >
                                          <i className="bi bi-check-circle me-2"></i>{" "}
                                          {item}
                                        </a>
                                      </div>
                                    ))}
                                  </div>

                                  <h6 className="fw-bold mt-4">
                                    Complete Your Wedding Team
                                  </h6>
                                  <div className="d-flex flex-wrap">
                                    {[
                                      "Wedding Choreographers",
                                      "Photobooth",
                                      "Wedding DJ",
                                      "Wedding Cakes",
                                      "Wedding Decorators",
                                      "Party Places",
                                      "Honeymoon",
                                      "Wedding Entertainment",
                                      "Tent House",
                                      "Promotions",
                                    ].map((item, i) => (
                                      <a
                                        key={i}
                                        href="#"
                                        className="me-3 mt-2 text-decoration-none text-muted small"
                                      >
                                        {item}
                                      </a>
                                    ))}
                                  </div>
                                </div>

                                {/* Column 2 - Right Panel */}
                                <div className="col-md-4 d-none d-md-block">
                                  <div className="bg-white rounded shadow-sm p-3">
                                    <h6 className="fw-bold">
                                      Destination weddings
                                    </h6>
                                    <p className="mb-0 text-muted small">
                                      Easily plan your international wedding.
                                    </p>
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/3176/3176294.png"
                                      alt="Destination"
                                      className="img-fluid mt-2"
                                      style={{ width: "40px" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Other Nav Items */}
                      {[
                        "Photos",
                        "Real Weddings",
                        "E-Invites",
                        "Two Soul",
                        "Matrimonial",
                        "Genie",
                      ].map((item) => (
                        <li className="nav-item" key={item}>
                          <a className="nav-link text-white" href="#">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Login/Signup */}
                  <div className="col-12 col-lg-3 mt-2 d-flex justify-content-center justify-content-lg-end">
                    <div className="d-flex gap-3">
                      <a href="#" className="text-white text-decoration-none">
                        Login
                      </a>
                      <a href="#" className="text-white text-decoration-none">
                        Fresh Sign-Up
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
