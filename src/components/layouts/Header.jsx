import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LocationModalWithCategories from "./LocationModalWithCategories";
import { RiMenuFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { vendorLogout } from "../../redux/vendorAuthSlice";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  FaRing,
  FaClipboardList,
  FaStore,
  FaUsers,
  FaPiggyBank,
  FaHeart,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const navigate = useNavigate();
  const formatName = (name) => name.replace(/\band\b/gi, "&");

  const handleLogout = () => {
    dispatch(logout());
    dispatch(vendorLogout());

    localStorage.removeItem("vendorFormData");
    localStorage.removeItem("photoDraftsMeta");
    localStorage.removeItem("videoDraftsMeta");
  };

  const { user, token: userToken } = useSelector((state) => state.auth);
  const { vendor, token: vendorToken } = useSelector(
    (state) => state.vendorAuth
  );

  const isUserLoggedIn = !!userToken && !!user;
  const isVendorLoggedIn = !!vendorToken && !!vendor;
  const isLoggedIn = isUserLoggedIn || isVendorLoggedIn;

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  const location = window.location.pathname;
  useEffect(() => {
    const collapse = document.getElementById("mainNav");
    if (collapse && collapse.classList.contains("show")) {
      collapse.classList.remove("show");
    }
    if (window.bootstrap && window.bootstrap.Collapse) {
      try {
        const bsCollapse =
          window.bootstrap.Collapse.getOrCreateInstance(collapse);
        bsCollapse.hide();
      } catch {}
    }
  }, [location]);

  const tabs = [
    {
      id: "wedding",
      slug: "my-wedding",
      label: "My Wedding",
      icon: <FaRing />,
    },
    {
      id: "checklist",
      slug: "checklist",
      label: "Checklist",
      icon: <FaClipboardList />,
    },
    { id: "vendors", slug: "vendor", label: "Vendor", icon: <FaStore /> },
    {
      id: "guest-list",
      slug: "guest-list",
      label: "Guest list",
      icon: <FaUsers />,
    },
    { id: "budget", slug: "budget", label: "Budget", icon: <FaPiggyBank /> },
    { id: "wishlist", slug: "wishlist", label: "Wishlist", icon: <FaHeart /> },
    // { id: "booking", slug: "booking", label: "Booking", icon: <FaShoppingCart /> },
    {
      id: "message",
      slug: "message",
      label: "Message",
      icon: <FaEnvelopeOpenText />,
    },
    {
      id: "real-wedding",
      slug: "real-wedding",
      label: "Real wedding",
      icon: <FaUserFriends />,
    },
    {
      id: "user-profile",
      slug: "user-profile",
      label: "Profile",
      icon: <FaUser />,
    },
  ];

  const [venueSubcategories, setVenueSubcategories] = useState([]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        const venues = data.find(
          (vendor) => vendor.name && vendor.name.toLowerCase() === "venues"
        );
        if (venues && Array.isArray(venues.subcategories)) {
          setVenueSubcategories(venues.subcategories);
        } else {
          setVenueSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  const [vendorCategories, setVendorCategories] = useState([]);
  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        setVendorCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setVendorCategories([]);
        console.error("Error fetching vendor categories:", error);
      }
    };
    fetchVendorCategories();
  }, []);

  const vendorType = encodeURIComponent("Venues");
  const cityParam = selectedCity
    ? `&city=${encodeURIComponent(selectedCity)}`
    : "";

  const targetURL = `/vendors/all?vendorType=${vendorType}${cityParam}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
      <div className="container-fluid">
        {/* Mobile view: logo left + toggle right */}
        <div className="d-flex d-lg-none justify-content-between align-items-center w-100 px-3 py-2">
          <Link className="navbar-brand m-0" to="/">
            <img src="/happywed_white.png" alt="HappyWedz" height="30" />
            {/* <img src="/images/logo.webp" alt="HappyWedz" height="30" /> */}
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
            <RiMenuFill color="white" size={35} />
          </button>
        </div>

        <div className="w-100" id="mainNav">
          <div className="row">
            <div className="col-12 bg-white p-2">
              <div className="container-fluid w-100">
                <div className="row align-items-center gy-2">
                  {/* Left: Tagline */}
                  <div className="col-12 col-sm-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-sm-start">
                    <a
                      className="nav-link text-dark fw-semibold top-header-heading"
                      href="#"
                    >
                      India's Favourite Wedding Planning Platform
                    </a>
                  </div>

                  {/* Middle: Location Selector */}
                  <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center justify-content-sm-start">
                    <LocationModalWithCategories />
                  </div>

                  {/* Right: Store Icons */}
                  <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center justify-content-lg-end gap-4">
                    <img
                      src="/images/header/playstore.png"
                      alt="Play Store"
                      title="Download on Play Store"
                      className="img-fluid"
                      style={{
                        maxHeight: "28px",
                        width: "auto",
                        cursor: "pointer",
                      }}
                    />

                    <img
                      src="/images/header/appstore.png"
                      alt="App Store"
                      title="Download on App Store"
                      className="img-fluid"
                      style={{
                        maxHeight: "28px",
                        width: "auto",
                        cursor: "pointer",
                      }}
                    />

                    <Link
                      to="/try"
                      state={{ title: "Try" }}
                      title="Try Design Studio"
                    >
                      <img
                        src="/images/header/tryimg.png"
                        alt="Design Studio"
                        className="img-fluid"
                        style={{
                          maxHeight: "50px",
                          width: "auto",
                          cursor: "pointer",
                        }}
                      />
                    </Link>

                    {/* PlayStore */}
                    {/* <a
                      className="app-store-link d-flex align-items-center bg-white px-3 py-1 rounded-pill gap-2 text-decoration-none"
                      style={{ minWidth: 0 }}
                      href="#"
                    >
                      <svg
                        fill="#34A853"
                        width="24px"
                        height="24px"
                        viewBox="-2 -2 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="jam jam-android-circle"
                      >
                        <path d="M6.39 8.248h-.026a.598.598 0 0 0-.596.596v2.594c0 .329.267.596.596.596h.026a.598.598 0 0 0 .596-.596V8.844a.598.598 0 0 0-.597-.596zM7.27 12.44c0 .3.247.546.548.546h.586v1.402c0 .329.268.596.596.596h.025a.598.598 0 0 0 .597-.596v-1.402h.818v1.402c0 .329.27.596.596.596h.026a.598.598 0 0 0 .596-.596v-1.402h.586c.3 0 .547-.245.547-.547V8.343H7.27v4.096zM11.406 5.859l.465-.718a.099.099 0 1 0-.166-.108l-.482.743a3.142 3.142 0 0 0-1.192-.232c-.427 0-.83.084-1.192.232l-.481-.743a.099.099 0 0 0-.137-.029.099.099 0 0 0-.03.137l.466.718c-.839.41-1.405 1.185-1.405 2.074 0 .055.004.109.009.162h5.541c.005-.053.008-.107.008-.162 0-.889-.566-1.663-1.404-2.074zm-2.66 1.284a.266.266 0 1 1 0-.532.266.266 0 0 1 0 .532zm2.57 0a.266.266 0 1 1-.001-.532.266.266 0 0 1 0 .532zM13.698 8.248h-.025a.598.598 0 0 0-.597.596v2.594c0 .329.27.596.597.596h.025a.597.597 0 0 0 .596-.596V8.844a.598.598 0 0 0-.596-.596z"></path>
                        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path>
                      </svg>
                      <span className="fw-semibold text-dark d-none d-lg-inline header-cta">
                        PlayStore
                      </span>
                    </a> */}

                    {/* AppStore */}
                    {/* <a
                      className="app-store-link d-flex align-items-center bg-white px-3 py-1 rounded-pill gap-2 text-decoration-none"
                      href="#"
                      style={{ minWidth: 0 }}
                    >
                      <svg
                        fill="#000"
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon flat-line me-2"
                      >
                        <line
                          x1="21"
                          y1="17"
                          x2="18"
                          y2="17"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></line>
                        <line
                          x1="20"
                          y1="21"
                          x2="14.29"
                          y2="10.72"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></line>
                        <line
                          x1="12"
                          y1="6.6"
                          x2="10"
                          y2="3"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></line>
                        <line
                          x1="14"
                          y1="3"
                          x2="4"
                          y2="21"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></line>
                        <line
                          x1="13"
                          y1="17"
                          x2="3"
                          y2="17"
                          stroke="#000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></line>
                      </svg>
                      <span className="fw-semibold text-dark d-none d-lg-inline header-cta">
                        AppStore
                      </span>
                    </a> */}

                    {/* <Link
                      className="app-store-link-pulse d-flex align-items-center bg-white px-3 py-1 rounded-pill gap-2 text-decoration-none"
                      style={{ minWidth: 0 }}
                      to="/try"
                      state={{ title: "Try" }}
                    >                      
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-800"
                      >
                        <circle
                          cx="12"
                          cy="9"
                          r="3.2"
                          fill="#fff"
                          stroke="#000"
                        />
                        <path
                          d="M4.5 20c0-4.5 3.5-8 7.5-8s7.5 3.5 7.5 8"
                          fill="#FBCFE8"
                          stroke="#D946EF"
                        />
                        <path
                          d="M8 20c0-2.2 1.8-4 4-4s4 1.8 4 4"
                          fill="#000"
                          stroke="#000"
                        />
                        <path
                          d="M9.5 13.5c.5.5 1.5.5 2.5.5s2-.1 2.5-.5"
                          stroke="#000"
                        />
                        <path d="M11 10.5c.3.5 1.7.5 2 0" stroke="#000" />
                        <circle cx="11" cy="9" r="0.25" fill="#000" />
                        <circle cx="13" cy="9" r="0.25" fill="#000" />
                      </svg>
                      <span className="fw-semibold text-dark d-none d-lg-inline header-cta">
                        Design Studio
                      </span>
                    </Link>  */}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="col-12 py-2">
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-evenly">
                    <div className="text-center d-none d-lg-block">
                      <Link className="navbar-brand-logo" to="/">
                        <img
                          src="/images/logo.webp"
                          alt="HappyWedz"
                          height="40"
                          className="mx-auto d-block"
                        />
                      </Link>
                    </div>
                    <ul className="navbar-nav d-flex flex-wrap justify-content-center gap-3">
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <button className="nav-link dropdown-toggle text-white fs-18">
                            Planning Tools
                          </button>

                          <div className="dropdown-menu mega-dropdown w-100 border-0 mt-0 p-4 rounded-4 shadow-sm bg-white">
                            <div className="container">
                              <div className="row g-4">
                                {/* LEFT SECTION */}
                                <div className="col-md-8">
                                  <h6 className="fw-semibold text-dark mb-4 fs-5">
                                    Plan your unique wedding
                                  </h6>

                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "repeat(3, 1fr)",
                                      gap: "1.25rem 1rem",
                                    }}
                                  >
                                    {tabs.map((tab) => (
                                      <div
                                        key={tab.id}
                                        onClick={() =>
                                          navigate(
                                            `/user-dashboard/${tab.slug}`
                                          )
                                        }
                                        className="d-flex align-items-center"
                                        style={{
                                          cursor: "pointer",
                                          transition: "color 0.2s ease-in-out",
                                        }}
                                        onMouseEnter={(e) =>
                                          (e.currentTarget.style.color =
                                            "#e91e63")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.currentTarget.style.color =
                                            "#212529")
                                        }
                                      >
                                        <span
                                          className="fs-18"
                                          style={{
                                            fontSize: "30px",
                                            color: "#555",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                          {tab.icon}
                                        </span>
                                        <span className="ms-2 fw-medium small">
                                          {tab.label}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* RIGHT SECTION */}
                                <div className="col-md-4">
                                  <div className="d-flex flex-column gap-3">
                                    {[
                                      {
                                        title: "Get the HappyWedz App",
                                        desc: "Plan your wedding on the go with the HappyWedz app.",
                                        image: "/images/header/playstore.png",
                                      },
                                      {
                                        title: "Wedshots",
                                        desc: "Easily collect all your guests' event photos in one album!",
                                        image: "/images/header/tryimg.png",
                                      },
                                    ].map((item, i) => (
                                      <div
                                        key={i}
                                        className="p-3 rounded-4 bg-white shadow-sm"
                                        style={{
                                          border: "1px solid #f0f0f0",
                                          cursor: "pointer",
                                          transition: "all 0.2s ease-in-out",
                                        }}
                                        onMouseEnter={(e) =>
                                          (e.currentTarget.style.boxShadow =
                                            "0 4px 12px rgba(0,0,0,0.08)")
                                        }
                                        onMouseLeave={(e) =>
                                          (e.currentTarget.style.boxShadow =
                                            "0 2px 4px rgba(0,0,0,0.04)")
                                        }
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div className="me-3">
                                            <h6 className="fw-semibold mb-1 text-dark fs-6">
                                              {item.title}
                                            </h6>
                                            <p
                                              className="mb-0 text-muted"
                                              style={{
                                                fontSize: "13px",
                                                lineHeight: "1.4",
                                              }}
                                            >
                                              {item.desc}
                                            </p>
                                          </div>
                                          <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{
                                              width: "38px",
                                              height: "38px",
                                              borderRadius: "8px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <Link
                          // to={targetURL}
                          to="/venues"
                          className="nav-link dropdown-toggle text-white fs-18"
                        >
                          Venues
                        </Link>

                        <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 rounded-4">
                          <div className="container-fluid">
                            <div className="row g-4">
                              <div className="col-md-4 d-none d-md-block">
                                <div className="primary-light-bg rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                                  <div>
                                    <h6 className="fw-bold mb-3">
                                      Popular Categories
                                    </h6>
                                    <div className="d-flex flex-column flex-wrap gap-2">
                                      <Link
                                        to="/venues"
                                        className="primary-text px-3 py-2 small me-2 d-flex align-items-center justify-content-between"
                                      >
                                        Wedding Venues <FaArrowRightLong />
                                      </Link>

                                      <Link
                                        to="/venues"
                                        className="primary-text px-3 py-2 small me-2 d-flex align-items-center justify-content-between"
                                      >
                                        Popular Locations <FaArrowRightLong />
                                      </Link>

                                      {!isLoggedIn && (
                                        <Link
                                          to="/vendor-login"
                                          className="primary-text px-3 py-2 small me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Are You Vendor <FaArrowRightLong />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-8 p-4">
                                <h6 className="fw-bold primary-text text-uppercase mb-3">
                                  By Type
                                </h6>
                                <div className="row">
                                  {(venueSubcategories.length > 0
                                    ? [
                                        ...venueSubcategories.map(
                                          (s) => s.name
                                        ),
                                        "View All Venues",
                                      ]
                                    : [
                                        "Banquet Halls",
                                        "Marriage Garden / Lawns",
                                        "Wedding Resorts",
                                        "Small Function / Party Halls",
                                        "Destination Wedding Venues",
                                        "Kalyana Mandapams",
                                        "4 Star & Above Wedding Hotels",
                                        "Venue Concierge Services",
                                        "View All Venues",
                                      ]
                                  ).map((item, i) => {
                                    const isShowMore =
                                      item === "View All Venues";
                                    const path = isShowMore
                                      ? "/venues"
                                      : `/venues/${item
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")
                                          .replace(/[^a-z0-9\-]/g, "")}`;
                                    return (
                                      <div className="col-12 mb-2" key={i}>
                                        <Link
                                          to={path}
                                          className={`dropdown-link d-flex align-items-center ${
                                            isShowMore
                                              ? "primary-text fw-bold text-decoration-underline"
                                              : ""
                                          }`}
                                        >
                                          <i className="bi bi-check-circle me-2 text-primary"></i>
                                          <span className="small">{item}</span>
                                        </Link>
                                      </div>
                                    );
                                  })}
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
                            className="nav-link dropdown-toggle text-white fs-18"
                          >
                            Vendors
                          </Link>
                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div
                                style={{
                                  columnCount: 4,
                                  columnGap: "1rem",
                                }}
                                className="grid-layout"
                              >
                                {vendorCategories.length > 0 &&
                                  vendorCategories.map((cat, i) => (
                                    <div
                                      className="mb-4 d-inline-block w-100"
                                      key={cat.id || i}
                                    >
                                      <div className="fw-bold primary-text text-uppercase mb-2">
                                        {cat.name}
                                      </div>
                                      {Array.isArray(cat.subcategories) &&
                                        cat.subcategories.length > 0 && (
                                          <ul className="list-unstyled">
                                            {cat.subcategories.map((sub, j) => (
                                              <li
                                                key={sub.id || j}
                                                className="mb-1"
                                              >
                                                <Link
                                                  to={`/vendors/${toSlug(
                                                    sub.name
                                                  )}`}
                                                  className="dropdown-link small d-block"
                                                >
                                                  {formatName(sub.name)}
                                                </Link>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
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
                          <Link
                            className="nav-link dropdown-toggle text-white fs-18"
                            to="/photography"
                            id="photoDropdown"
                            role="button"
                          >
                            Photography
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div
                                style={{ columnCount: 4, columnGap: "1rem" }}
                                className="grid-layout"
                              >
                                {[
                                  {
                                    title: "Bridal Wear",
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
                                      "Sherwani",
                                      "Wedding Suits",
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
                                  // <div className="col-6 col-md-3" key={i}>
                                  //   <h6 className="fw-semibold text-secondary mb-3">
                                  //     {section.title}
                                  //   </h6>
                                  //   <ul className="list-unstyled">
                                  //     {section.items.map((item, idx) => (
                                  //       <li key={idx}>
                                  //         <Link
                                  //           to={`/photography/${toSlug(item)}`}
                                  //           state={{ title: item }}
                                  //           className="dropdown-link small d-block mb-2"
                                  //         >
                                  //           <i className="bi bi-chevron-right me-2 text-muted"></i>
                                  //           {item}
                                  //         </Link>
                                  //       </li>
                                  //     ))}
                                  //   </ul>
                                  // </div>
                                  <div
                                    className="mb-4 d-inline-block w-100"
                                    key={i}
                                  >
                                    <div className="fw-bold primary-text text-uppercase mb-2">
                                      {section.title}
                                    </div>
                                    {Array.isArray(section.items) &&
                                      section.items.length > 0 && (
                                        <ul className="list-unstyled">
                                          {section.items.map((item, j) => (
                                            <li key={j} className="mb-1">
                                              <Link
                                                to={`/photography/${toSlug(
                                                  item
                                                )}`}
                                                state={{ title: item }}
                                                className="dropdown-link small d-block"
                                              >
                                                {item}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
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
                            // className="nav-link dropdown-toggle text-white"
                            className="nav-link text-white fs-18"
                            to="/einvites"
                            state={{ title: "E-Invites" }}
                            id="photoDropdown"
                            role="button"
                          >
                            E-Invites
                          </Link>

                          {/* <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                <div className="col-6 col-md-3">
                                  <h6 className="fw-semibold text-secondary mb-3">
                                    Wedding Invitation Maker
                                  </h6>
                                  <ul className="list-unstyled">
                                    <li>
                                      <Link
                                        to="/e-invite-wedding-card-designs"
                                        state={{
                                          title: "Wedding Card Designs",
                                        }}
                                        className="dropdown-link small d-block mb-2"
                                      >
                                        <i className="bi bi-chevron-right me-2 text-muted"></i>
                                        Wedding Card Designs
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="/e-invite-invitation-video-templates"
                                        state={{
                                          title: "Invitation Video Templates",
                                        }}
                                        className="dropdown-link small d-block mb-2"
                                      >
                                        <i className="bi bi-chevron-right me-2 text-muted"></i>
                                        Invitation Video Templates
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="/e-invite/save-the-date-templates"
                                        state={{
                                          title: "Save the Date Templates",
                                        }}
                                        className="dropdown-link small d-block mb-2"
                                      >
                                        <i className="bi bi-chevron-right me-2 text-muted"></i>
                                        Save the Date Templates
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </li>

                      {/* photo Dropdown */}
                      {/* <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper"> 
                          <Link
                            className="nav-link dropdown-toggle text-white"
                            to="#"
                            state={{ title: "two-soul" }}
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
                                    <h6 className="fw-bold primary-text text-uppercase mb-2">
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
                      </li> */}

                      {/* Matrimonial Dropdown */}
                      {/* <li className="nav-item dropdown mega-dropdown-wrapper position-static">
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
                      </li> */}

                      {/* Genie Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white fs-18"
                            to="/genie"
                            state={{ title: "Genie" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Genie
                          </Link>
                        </div>
                      </li>

                      {/* blog Dropdown */}
                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white fs-18"
                            to="/blog"
                            state={{ title: "Blog" }}
                            id="blog"
                            role="button"
                          >
                            Blog
                          </Link>
                        </div>
                      </li>

                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white fs-18"
                            to="/real-wedding"
                            state={{ title: "Real Wedding" }}
                            id="real-wedding"
                            role="button"
                          >
                            Real Wedding
                          </Link>
                        </div>
                      </li>

                      {/* Login Dropdown */}
                      {/* <li className="nav-item dropdown mega-dropdown-wrapper position-static">
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
                      </li> */}

                      {/* Vendor Dashboard */}
                      {/* <li className="nav-Vendor Dashboard mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link text-white"
                            to="/customer-register"
                            state={{ title: "vendor dashboard" }}
                            id="photoDropdown"
                            role="button"
                          >
                            Sign
                          </Link>
                        </div>
                      </li> */}

                      {/* Login Dropdown */}
                      {isUserLoggedIn ? (
                        <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              to="/user-dashboard"
                              className="nav-link text-white fs-18"
                            >
                              User Dashboard
                            </Link>
                          </div>
                        </li>
                      ) : isVendorLoggedIn ? (
                        <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              to="/vendor-dashboard"
                              className="nav-link text-white fs-18"
                            >
                              Vendor Dashboard
                            </Link>
                          </div>
                        </li>
                      ) : (
                        <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              to="/customer-login"
                              className="nav-link text-white fs-18"
                            >
                              Login
                            </Link>
                          </div>
                        </li>
                      )}

                      {isLoggedIn && (
                        <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <button
                              onClick={handleLogout}
                              className="nav-link text-white btn btn-link fs-18"
                              style={{ textDecoration: "none" }}
                            >
                              Logout
                            </button>
                          </div>
                        </li>
                      )}
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
