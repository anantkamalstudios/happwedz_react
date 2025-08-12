import React, { useState } from "react";
import { Link, Links } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import LocationModalWithCategories from "./LocationModalWithCategories";

const Header = () => {
  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
      <div className="container-fluid">
        <div className="d-flex d-lg-none justify-content-between align-items-center w-100 px-3 py-2">
          <Link className="navbar-brand" to="/">
            <img src="/images/logo.webp" alt="HappyWedz" height="40" />
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon custom-toggler-icon"></span>
          </button>
        </div>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="mainNav"
        >
          {/* <a className="navbar-brand d-none d-lg-block" href="/">
            <img src="/images/logo.webp" alt="HappyWedz" height="40" />
          </a> */}
        </div>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="row">
            <div className="col-12 pink-gradient-bg">
              <div className="container">
                <div className="row align-items-center gy-2">
                  {/* Left: Tagline */}
                  <div className="col-12 col-sm-6 col-lg-6 text-center text-sm-start">
                    <a
                      className="nav-link text-white fw-semibold top-header-heading"
                      href="#"
                    >
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

                    <a
                      href="/customer-login"
                      className="text-white text-decoration-none"
                    >
                      Login
                    </a>
                    <a href="#" className="text-white text-decoration-none">
                      SignUp
                    </a>
                    <div className="d-flex gap-3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="col-12 py-2">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-between">
                    <div className="mb-3 text-center d-none d-lg-block">
                      <Link className="navbar-brand-logo" to="/">
                        <img
                          src="/images/logo.webp"
                          alt="HappyWedz"
                          height="35"
                          className="mx-auto d-block"
                        />
                      </Link>
                    </div>
                    <ul className="navbar-nav d-flex flex-wrap justify-content-center gap-3">
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <Link
                          to="/venues"
                          className="nav-link dropdown-toggle text-white"
                        >
                          Venues
                        </Link>
                        <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                          <div className="container">
                            <div className="row g-4">
                              {/* Column 1: By Type */}
                              <div className="col-md-8">
                                <h6 className="fw-semibold text-uppercase mb-3 text-secondary">
                                  By Type
                                </h6>
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
                                      className="col-6 col-sm-4 mb-2"
                                      key={i}
                                    >
                                      <Link
                                        to={`/venues/${item
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")
                                          .replace(/[^a-z0-9\-]/g, "")}`}
                                        className="dropdown-link d-flex align-items-center"
                                      >
                                        <i className="bi bi-check-circle me-2 text-primary"></i>
                                        <span className="small">{item}</span>
                                      </Link>
                                    </div>
                                  ))}
                                </div>

                                <h6 className="fw-semibold mt-4 text-uppercase text-secondary">
                                  Popular Locations
                                </h6>
                                <div className="d-flex flex-wrap mt-2">
                                  {[
                                    "Bandra",
                                    "Thane",
                                    "Kalyan",
                                    "Ulhasnagar",
                                    "Bhiwandi",
                                    "Panvel",
                                    "Andheri East",
                                  ].map((item, i) => (
                                    <div className="" key={i}>
                                      <Link
                                        to={`/venues/${item
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")
                                          .replace(/[^a-z0-9\-]/g, "")}`}
                                        className="badge bg-light text-muted me-2 mb-2 px-3 py-2 small text-decoration-none rounded-pill"
                                      >
                                        {item}
                                      </Link>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Column 2: Featured box */}
                              <div className="col-md-4 d-none d-md-block">
                                <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                                  <div>
                                    <h6 className="fw-bold mb-2">
                                      Destination Weddings
                                    </h6>
                                    <p className="text-muted small mb-3">
                                      Easily plan your international wedding
                                      with the best venues and planners.
                                    </p>
                                  </div>
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/3176/3176294.png"
                                    alt="Destination"
                                    className="img-fluid"
                                    style={{
                                      width: "60px",
                                      objectFit: "contain",
                                    }}
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
                          <Link
                            to="/vendors"
                            className="nav-link dropdown-toggle text-white"
                          >
                            Vendors
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                <div className="col-md-8">
                                  <h6 className="fw-semibold text-uppercase mb-3 text-secondary">
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
                                        className="col-6 col-sm-4 mb-2"
                                        key={i}
                                      >
                                        <Link
                                          to={`/vendors/${toSlug(item)}`}
                                          state={{ title: item }}
                                          className="dropdown-link d-flex align-items-center"
                                        >
                                          <span className="small">{item}</span>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Column 2: Featured box */}
                                <div className="col-md-4 d-none d-md-block">
                                  <div className="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                      <h6 className="fw-bold mb-2">
                                        Destination Weddings
                                      </h6>
                                      <p className="text-muted small mb-3">
                                        Easily plan your international wedding
                                        with the best venues and planners.
                                      </p>
                                    </div>
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/3176/3176294.png"
                                      alt="Destination"
                                      className="img-fluid"
                                      style={{
                                        width: "60px",
                                        objectFit: "contain",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* photo Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link dropdown-toggle text-white"
                            to="/photography"
                            id="photoDropdown"
                            role="button"
                          >
                            Photography
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                {[
                                  {
                                    title: "Outfit",
                                    items: [
                                      "Bridal Lehenga",
                                      "Wedding Sarees",
                                      "Engagement",
                                      "Mehndi",
                                      "Blouse Designs",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Jewellery & Accessories",
                                    items: [
                                      "Bridal Jewellery",
                                      "Engagement Rings",
                                      "Floral Jewellery",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Mehndi",
                                    items: [
                                      "Arabic",
                                      "Mehndi Designs",
                                      "Simple",
                                      "Unique",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Decor & Ideas",
                                    items: [
                                      "Wedding Decor",
                                      "Bridal Entry",
                                      "Groom Entry",
                                      "Wedding Games",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Wedding Cards & Gifts",
                                    items: [
                                      "Designs",
                                      "Wedding Gifts",
                                      "Wedding Invitations",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Wedding Photography",
                                    items: [
                                      "Pre Wedding Shoot",
                                      "Wedding",
                                      "Photoshoot & Poses",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Groom Wear",
                                    items: [
                                      "Sherwani for Groom",
                                      "Wedding Suits for Groom",
                                      "More",
                                    ],
                                  },
                                  {
                                    title: "Bridal Makeup & Hair",
                                    items: [
                                      "Bridal Makeup",
                                      "Bridal Hairstyles",
                                      "Engagement",
                                      "Mehndi",
                                      "More",
                                    ],
                                  },
                                ].map((section, i) => (
                                  <div className="col-6 col-md-3" key={i}>
                                    <h6 className="fw-semibold text-secondary mb-3">
                                      {section.title}
                                    </h6>
                                    <ul className="list-unstyled">
                                      {section.items.map((item, idx) => (
                                        <li key={idx}>
                                          <Link
                                            to={`/photography/${toSlug(item)}`}
                                            state={{ title: item }}
                                            className="dropdown-link small d-block mb-2"
                                          >
                                            <i className="bi bi-chevron-right me-2 text-muted"></i>
                                            {item}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Real Weddings Dropdown */}
                      {/* <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link dropdown-toggle text-white"
                            to="/real-wedding"
                            state={{ title: "real-wedding" }}
                            id="rwDropdown"
                            role="button"
                          >
                            Real Weddings
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row mt-5"> 
                                <div className="col-6 col-md-3">
                                  <h6 className="fw-semibold text-secondary mb-3">
                                    By City
                                  </h6>
                                  <ul className="list-unstyled">
                                    {[
                                      "Mumbai",
                                      "Bangalore",
                                      "Pune",
                                      "Kolkata",
                                      "Jaipur",
                                      "Others",
                                    ].map((city, i) => (
                                      <li key={i}>
                                        <Link
                                          to={`/real-wedding/${toSlug(city)}`}
                                          state={{ title: city }}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <i className="bi bi-geo-alt me-2 text-muted"></i>{" "}
                                          {city}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div> 
                                <div className="col-6 col-md-3">
                                  <h6 className="fw-semibold text-secondary mb-3">
                                    By Culture
                                  </h6>
                                  <ul className="list-unstyled">
                                    {[
                                      "Maharashtrian",
                                      "Punjabi / Sikh",
                                      "Bengali",
                                      "Gujarati",
                                      "Marwari",
                                      "Telugu",
                                      "Others",
                                    ].map((culture, i) => (
                                      <li key={i}>
                                        <Link
                                          to={`/by-culture/${toSlug(culture)}`}
                                          state={{ title: culture }}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <i className="bi bi-flower1 me-2 text-muted"></i>{" "}
                                          {culture}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="col-6 col-md-3">
                                  <h6 className="fw-semibold text-secondary mb-3">
                                    By Theme
                                  </h6>
                                  <ul className="list-unstyled">
                                    {[
                                      "Destination",
                                      "Grand & Luxurious",
                                      "Pocket Friendly Stunners",
                                      "Intimate & Minimalist",
                                      "Modern & Stylish",
                                      "International",
                                      "Others",
                                    ].map((theme, i) => (
                                      <li key={i}>
                                        <Link
                                          to={`/by-theme/${toSlug(theme)}`}
                                          state={{ title: theme }}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <i className="bi bi-star me-2 text-muted"></i>{" "}
                                          {theme}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>


                                <div className="col-12 col-md-3">
                                  <h6 className="fw-semibold text-secondary mb-3">
                                    Latest Real Weddings
                                  </h6>
                                  <div className="d-flex flex-column gap-3">
                                    {[
                                      {
                                        name: "Sanya and Yuvraj",
                                        image:
                                          "https://image.wedmegood.com/resized/250X/uploads/images/d1e7005c97ba4762ac1e93bdbeb4e0d3realwedding/IMG_0263.jpeg?crop=229,404,1626,914",
                                      },
                                      {
                                        name: "Sanya and Yuvraj (Udaipur)",
                                        image:
                                          "https://image.wedmegood.com/resized/250X/uploads/images/d1e7005c97ba4762ac1e93bdbeb4e0d3realwedding/IMG_0263.jpeg?crop=229,404,1626,914",
                                      },
                                    ].map((wedding, i) => (
                                      <div
                                        key={i}
                                        className="d-flex align-items-center"
                                      >
                                        <Link
                                          to={`/latest-real-weddings/${toSlug(
                                            wedding.name
                                          )}`}
                                          state={{ title: wedding.name }}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <img
                                            src={wedding.image}
                                            alt={wedding.name}
                                            className="me-3 rounded-3"
                                            style={{
                                              width: "60px",
                                              height: "60px",
                                              objectFit: "cover",
                                            }}
                                          />
                                          <span className="small text-muted">
                                            {wedding.name}
                                          </span>
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li> */}

                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link dropdown-toggle text-white"
                            to="/e-invites"
                            state={{ title: "E-Invites" }}
                            id="photoDropdown"
                            role="button"
                          >
                            E-Invites
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                {[
                                  {
                                    title: "Wedding Invitation Maker",
                                    items: [
                                      "Wedding Card Designs",
                                      "Invitation Video Templates",
                                      "Save the Date Templates",
                                    ],
                                  },
                                ].map((section, i) => (
                                  <div className="col-6 col-md-3" key={i}>
                                    <h6 className="fw-semibold text-secondary mb-3">
                                      {section.title}
                                    </h6>
                                    <ul className="list-unstyled">
                                      {section.items.map((item, idx) => (
                                        <li key={idx}>
                                          <Link
                                            to={`/e-invite/${toSlug(item)}`}
                                            state={{ title: item }}
                                            className="dropdown-link small d-block mb-2"
                                          >
                                            <i className="bi bi-chevron-right me-2 text-muted"></i>
                                            {item}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* photo Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          {/* <Link
                            className="nav-link dropdown-toggle text-white"
                            to="/twosoul"
                            state={{ title: "Two Soul" }}
                            id="photoDropdown"
                            role="button"
                          > */}
                          <Link
                            className="nav-link dropdown-toggle text-white"
                            to="#"
                            state={{ title: "twosoul" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Two Soul
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                {[
                                  {
                                    title: "Bride",
                                    items: [
                                      "Mehndi Artists",
                                      "Bridal Makeup Artists",
                                      "Makeup Salon",
                                      "Bridal Jewellery",
                                      "Bridal Lehenga",
                                      "Trousseau Packing",
                                    ],
                                  },
                                  {
                                    title: "Couples",
                                    items: ["Sherwani", "Promotions", "More"],
                                  },
                                ].map((section, i) => (
                                  <div className="col-6 col-md-3" key={i}>
                                    <h6 className="fw-semibold text-secondary mb-3">
                                      {section.title}
                                    </h6>
                                    <ul className="list-unstyled">
                                      {section.items.map((item, idx) => (
                                        <li key={idx}>
                                          <Link
                                            to={`/two-soul/${toSlug(item)}`}
                                            state={{ title: item }}
                                            className="dropdown-link small d-block mb-2"
                                          >
                                            <i className="bi bi-chevron-right me-2 text-muted"></i>
                                            {item}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {/* Matrimonial Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/matrimonial"
                            state={{ title: "Matrimonial" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Matrimonial
                          </Link>
                        </div>
                      </li>

                      {/* Genie Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/genie"
                            state={{ title: "Genie" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Genie
                          </Link>
                        </div>
                      </li>

                      {/* Login Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/customer-login"
                            state={{ title: "Login" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Login
                          </Link>
                        </div>
                      </li>

                      {/* Login Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/customer-register"
                            state={{ title: "Signup" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Sign-up
                          </Link>
                        </div>
                      </li>

                      {/* Vendor Dashboard */}
                      <li className="nav-Vendor Dashboard mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/vendor-dashboard"
                            state={{ title: "vendor dashboard" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Dashboard
                          </Link>
                        </div>
                      </li>
                      {/* {["Genie"].map((item) => (
                        <li className="nav-item" key={item}>
                          <a className="nav-link text-white" href="#">
                            {item}
                          </a>
                        </li>
                      ))} */}
                    </ul>
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
