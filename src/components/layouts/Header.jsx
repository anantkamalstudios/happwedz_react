import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LocationModalWithCategories from "./LocationModalWithCategories";
import { RiMenuFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { vendorLogout } from "../../redux/vendorAuthSlice";
import { setLocation } from "../../redux/locationSlice";
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
import axios from "axios";
import usePhotography from "../../hooks/usePhotography";

const Header = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const navigate = useNavigate();
  const formatName = (name) => name.replace(/\band\b/gi, "&");

  const handleLogout = () => {
    if (isVendorLoggedIn) {
      dispatch(vendorLogout());
    } else {
      dispatch(logout());
    }
    localStorage.clear();
  };

  const { user, token: userToken } = useSelector((state) => state.auth);
  const { vendor, token: vendorToken } = useSelector(
    (state) => state.vendorAuth
  );

  const isUserLoggedIn = !!userToken && !!user;
  const isVendorLoggedIn = !!vendorToken && !!vendor;
  const isLoggedIn = isUserLoggedIn || isVendorLoggedIn;

  const toSlug = (text) =>
    text?.replace(/\s+/g, "-").replace(/[^A-Za-z0-9\-]/g, "") || "";

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
      } catch { }
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
          // "http://localhost:4000/vendor-types/with-subcategories/all"
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
  const [einviteCategories, setEinviteCategories] = useState([
    { cardType: "wedding_einvite", title: "Wedding E-Invitations", icon: "bi-heart" },
    { cardType: "video", title: "Video Invitations", icon: "bi-play-circle" },
    { cardType: "save_the_date", title: "Save the Date", icon: "bi-calendar-heart" },
  ]);

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

  const {
    typesWithCategories,
    fetchTypesWithCategories,
    loading: photographyLoading,
    error: photographyError,
  } = usePhotography();

  const [photography, setPhotography] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchTypesWithCategories();
    };
    fetchData();
  }, []);
  useEffect(() => {
    setPhotography(typesWithCategories);
  }, [typesWithCategories]);

  const vendorType = encodeURIComponent("Venues");
  const cityParam = selectedCity
    ? `&city=${encodeURIComponent(selectedCity)}`
    : "";

  const targetURL = `/vendors/all?vendorType=${vendorType}${cityParam}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
      <div className="container-fluid p-0">
        {/* Mobile view: logo left + toggle right */}
        <div className="d-flex d-lg-none justify-content-between align-items-center w-100 py-2">
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

        <div className="collapse navbar-collapse w-100" id="mainNav">
          <div className="row w-100">
            <div className="col-12 bg-white p-2">
              <div className="container w-100 p-0">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="col-12 py-2">
              <div className="container" style={{ maxWidth: "1400px" }}>
                <div className="d-flex w-100 justify-content-center">
                  <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-between flex-nowrap">
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
                    <ul className="navbar-nav d-flex flex-wrap justify-content-center gap-2">
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
                                        <span className="ms-2 small">
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
                                        title: "Happywedz Website",
                                        desc: "Showcase your wedding website to friends and family.",
                                        image: "/images/couple.png",
                                        route: "/choose-template",
                                      },
                                    ].map((item, i) => (
                                      <div
                                        key={i}
                                        className="p-3 rounded-4 bg-white shadow-lg border-2"
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
                                        <Link
                                          to={item.route}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-decoration-none d-flex justify-content-between align-items-center"
                                        >
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
                                        </Link>
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
                                        className="primary-text py-2 small me-2 d-flex align-items-center justify-content-between"
                                      >
                                        Wedding Venues <FaArrowRightLong />
                                      </Link>

                                      <Link
                                        to="/venues"
                                        className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
                                      >
                                        Popular Locations <FaArrowRightLong />
                                      </Link>

                                      {!isLoggedIn && (
                                        <Link
                                          to="/vendor-login"
                                          className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Are You Vendor <FaArrowRightLong />
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-5 p-4">
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
                                          className={`dropdown-link d-flex align-items-center ${isShowMore
                                            ? "primary-text fw-bold text-decoration-underline"
                                            : ""
                                            }`}
                                        >
                                          <i className="bi bi-check-circle text-primary"></i>
                                          <span className="small">{item}</span>
                                        </Link>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="col-md-3 p-4">
                                <h6 className="fw-bold primary-text text-uppercase mb-3">
                                  By City
                                </h6>
                                <div className="row">
                                  {[
                                    "Mumbai",
                                    "Bangalore",
                                    "Pune",
                                    "Kolkata",
                                    "Jaipur",
                                    "Lucknow",
                                    "Hyderabad",
                                    "More",
                                  ].map((city, i) => {
                                    const isMore = city === "More";
                                    const path = isMore
                                      ? "/venues"
                                      : `/venues?city=${encodeURIComponent(city)}`;
                                    return (
                                      <div className="col-12 mb-2" key={i}>
                                        <Link
                                          to={path}
                                          onClick={() => {
                                            if (!isMore) {
                                              dispatch(setLocation(city));
                                            }
                                          }}
                                          className={`dropdown-link d-flex align-items-center ${isMore
                                            ? "primary-text fw-bold text-decoration-underline"
                                            : ""
                                            }`}
                                        >
                                          <i className="bi bi-geo-alt text-primary"></i>
                                          <span className="small">{city}</span>
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
                                style={{
                                  columnCount: 4,
                                  columnGap: "1rem",
                                }}
                                className="grid-layout"
                              >
                                {photography.length > 0 &&
                                  photography.map((cat, i) => (
                                    <div
                                      className="mb-4 d-inline-block w-100"
                                      key={cat.id || i}
                                    >
                                      <div className="fw-bold primary-text text-uppercase mb-2">
                                        {cat.name}
                                      </div>
                                      {Array.isArray(cat.categories) &&
                                        cat.categories.length > 0 && (
                                          <ul className="list-unstyled">
                                            {cat.categories.map((sub, j) => (
                                              <li
                                                key={sub.id || j}
                                                className="mb-1"
                                              >
                                                <Link
                                                  to={`/photography/${toSlug(
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

                      <li className="nav-item dropdown mega-dropdown-wrapper position-static">
                        <div className="dropdown-wrapper">
                          <Link
                            className="nav-link dropdown-toggle text-white fs-18"
                            to="/einvites"
                            state={{ title: "E-Invites" }}
                            id="einvitesDropdown"
                            role="button"
                          >
                            E-Invites
                          </Link>

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row g-4">
                                <div className="col-md-12">
                                  <h6 className="fw-semibold mb-3 primary-text text-uppercase">
                                    E-Invitation Categories
                                  </h6>
                                  <div className="row">
                                    {einviteCategories.map((sub, j) => (
                                      <li
                                        key={sub.id || j}
                                        className="mb-1"
                                      >
                                        <Link
                                          to={`/einvites/category/${sub.cardType}`}
                                          className="dropdown-link small d-block"
                                        >
                                          {formatName(sub.title)}
                                        </Link>
                                      </li>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

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

                          <div className="dropdown-menu mega-dropdown w-100 shadow border-0 mt-0 p-4 rounded-4">
                            <div className="container">
                              <div className="row">
                                <div className="col-12 col-md-4">
                                  <div className="fw-bold primary-text text-uppercase">
                                    By City
                                  </div>
                                  <ul className="list-unstyled mb-0">
                                    <li className="dropdown-link small d-block">
                                      Mumbai
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Bangalore
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Pune
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Kolkata
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Jaipur
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Others
                                    </li>
                                  </ul>
                                </div>

                                <div className="col-12 col-md-4">
                                  <h6 className="primary-text fw-bold">
                                    By Culture
                                  </h6>
                                  <ul className="list-unstyled mb-0">
                                    <li className="dropdown-link small d-block">
                                      Maharashtrian
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Punjabi / Sikh
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Bengali
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Gujarati
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Marwari
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Telugu
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Others
                                    </li>
                                  </ul>
                                </div>

                                <div className="col-12 col-md-4">
                                  <h6 className="primary-text fw-bold">
                                    By Theme
                                  </h6>
                                  <ul className="list-unstyled mb-0">
                                    <li className="dropdown-link small d-block">
                                      Destination
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Grand & Luxurious
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Pocket Friendly Stunners
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Intimate & Minimalist
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Modern & Stylish
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      International
                                    </li>
                                    <li className="dropdown-link small d-block">
                                      Others
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
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
