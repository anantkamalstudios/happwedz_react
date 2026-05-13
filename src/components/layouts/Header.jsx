import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationModalWithCategories from "./LocationModalWithCategories";
import { RiMenuFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { vendorLogout } from "../../redux/vendorAuthSlice";
import { setLocation, clearLocation } from "../../redux/locationSlice";
import { FaChevronDown, FaChevronUp, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import usePhotography from "../../hooks/usePhotography";
import { useFilter } from "../../context/realWedding.context";
import axiosInstance from "../../services/api/axiosInstance";

/* ─────────────────────────────────────────────────────────────
   Inline styles injected once (CSS vars + drawer transitions)
───────────────────────────────────────────────────────────── */
const MOBILE_STYLES = `
  :root {
    --space-4: 1rem;
    --space-6: 1.5rem;
  }

  /* Overlay */
  .hw-mob-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 1000;
    transition: opacity 0.3s ease;
  }

  /* Drawer */
  .hw-mob-drawer {
    position: fixed;
    inset: 0 auto 0 0;
    width: 88%;
    max-width: 400px;
    background: #fff;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
  }
  .hw-mob-drawer.open {
    transform: translateX(0);
  }

  /* Drawer body scroll */
  .hw-mob-drawer-body {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: var(--space-4);
    padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
  }

  /* Touch targets */
  .hw-touch {
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
  }

  /* Accordion item */
  .hw-acc-btn {
    width: 100%;
    background: #f8f9fa;
    border: none;
    border-radius: 8px;
    padding: 0 var(--space-4);
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 0.95rem;
    color: #212529;
    cursor: pointer;
    text-align: left;
    transition: background 0.18s;
  }
  .hw-acc-btn:hover, .hw-acc-btn:focus { background: #f0e8f5; }

  .hw-acc-body {
    padding: 0.5rem 0 0.5rem var(--space-4);
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease;
  }
  .hw-acc-body.open { max-height: 1200px; }

  /* City bottom sheet */
  .hw-city-sheet-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    z-index: 1100;
    transition: opacity 0.25s;
  }
  .hw-city-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 20px 20px 0 0;
    z-index: 1101;
    max-height: 70vh;
    overflow-y: auto;
    padding: var(--space-4) var(--space-6);
    padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .hw-city-sheet.open { transform: translateY(0); }

  /* Auth buttons */
  .hw-auth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.95rem;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: opacity 0.18s;
    width: 100%;
  }
  .hw-auth-btn:hover { opacity: 0.88; }
  .hw-auth-btn-primary { background: #ed1173; color: #fff; }
  .hw-auth-btn-outline { background: transparent; color: #ed1173; border: 2px solid #ed1173; }
  .hw-auth-btn-danger  { background: #dc3545; color: #fff; }

  .hw-nav-link {
    display: flex;
    align-items: center;
    min-height: 44px;
    padding: 0.3rem 0;
    font-size: 0.875rem;
    color: #212529;
    text-decoration: none;
  }
  .hw-nav-link:hover { color: #ed1173; }

  .hw-section-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #ed1173;
    margin: 0.75rem 0 0.25rem;
  }

  /* Search Overlay */
  .hw-mob-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1200;
    padding: var(--space-4);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .hw-mob-search-overlay.open {
    transform: translateY(0);
  }
  .hw-search-input {
    width: 100%;
    height: 48px;
    border: 2px solid #ed1173;
    border-radius: 12px;
    padding: 0 1rem;
    font-size: 1rem;
    outline: none;
  }

  /* Hide drawer on desktop */
  @media (min-width: 1024px) {
    .hw-mob-overlay,
    .hw-mob-drawer,
    .hw-mob-topbar,
    .hw-mob-search-overlay { display: none !important; }
  }
  /* Hide desktop nav on mobile */
  @media (max-width: 1023px) {
    .hw-desktop-nav { display: none !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   MobileMenuDrawer Component
───────────────────────────────────────────────────────────── */
const MobileMenuDrawer = ({
  open,
  onClose,
  /* auth */
  isUserLoggedIn,
  isVendorLoggedIn,
  isLoggedIn,
  handleLogout,
  /* city */
  selectedCity,
  dispatch,
  setLocation,
  /* nav data */
  tabs,
  venueSubcategories,
  vendorCategories,
  photography,
  einviteCategories,
  browseByCategory,
  popularSections,
  mostSearchedBlogs,
  byCity,
  cultures,
  themes,
  reduxLocation,
  /* filter context */
  setSelectCity,
  setSelectedCulture,
  setSelectedTheme,
  /* helpers */
  toSlug,
  formatName,
  navigate,
}) => {
  const [activeAcc, setActiveAcc] = useState(null);
  const [citySheetOpen, setCitySheetOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close on route change is handled by parent (useEffect on location)
  const toggleAcc = (key) => setActiveAcc(activeAcc === key ? null : key);

  const closeAll = () => {
    onClose();
    setActiveAcc(null);
    setCitySheetOpen(false);
  };

  const cities = ["All Cities", "Mumbai", "Bangalore", "Pune", "Kolkata", "Jaipur", "Lucknow", "Hyderabad", "Delhi", "Others"];

  const handleCitySelect = (city) => {
    if (city === "All Cities") {
      dispatch(clearLocation());
    } else {
      dispatch(setLocation(city));
    }
    setCitySheetOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="hw-mob-overlay"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`hw-mob-drawer${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        ref={drawerRef}
      >
        {/* Drawer Header */}
        <div
          style={{
            background: "#ed1173",
            padding: "0 var(--space-4)",
            minHeight: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <Link to="/" onClick={closeAll}>
            <img src="/images/logo.webp" alt="HappyWedz" height="32" />
          </Link>
          <button
            className="hw-touch"
            onClick={closeAll}
            aria-label="Close menu"
            style={{ background: "none", border: "none", padding: "0 4px" }}
          >
            <IoClose color="white" size={28} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="hw-mob-drawer-body">
          {/* ── Auth Section ── */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {isUserLoggedIn ? (
              <>
                <Link
                  to="/user-dashboard"
                  className="hw-auth-btn hw-auth-btn-primary"
                  onClick={closeAll}
                  style={{ flex: 1 }}
                >
                  My Dashboard
                </Link>
                <button
                  className="hw-auth-btn hw-auth-btn-danger"
                  onClick={() => { handleLogout(); closeAll(); }}
                  style={{ flex: 0.6 }}
                >
                  Logout
                </button>
              </>
            ) : isVendorLoggedIn ? (
              <>
                <Link
                  to="/vendor-dashboard"
                  className="hw-auth-btn hw-auth-btn-primary"
                  onClick={closeAll}
                  style={{ flex: 1 }}
                >
                  Vendor Dashboard
                </Link>
                <button
                  className="hw-auth-btn hw-auth-btn-danger"
                  onClick={() => { handleLogout(); closeAll(); }}
                  style={{ flex: 0.6 }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/customer-login"
                  className="hw-auth-btn hw-auth-btn-primary"
                  onClick={closeAll}
                  style={{ flex: 1 }}
                >
                  Login
                </Link>
                <Link
                  to="/vendor-login"
                  className="hw-auth-btn hw-auth-btn-outline"
                  onClick={closeAll}
                  style={{ flex: 1 }}
                >
                  Vendor Login
                </Link>
              </>
            )}
          </div>

          {/* ── City Selector ── */}
          <button
            className="hw-touch"
            onClick={() => setCitySheetOpen(true)}
            aria-label="Select city"
            style={{
              width: "100%",
              background: "#f8f9fa",
              border: "1.5px solid #e0e0e0",
              borderRadius: "10px",
              padding: "0 var(--space-4)",
              marginBottom: "1rem",
              justifyContent: "space-between",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#212529",
              cursor: "pointer",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaMapMarkerAlt color="#ed1173" size={14} />
              {selectedCity || "Select City"}
            </span>
            <FaChevronDown size={12} color="#888" />
          </button>

          {/* ── Accordion Nav ── */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>

            {/* Planning Tools */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("planning")} aria-expanded={activeAcc === "planning"}>
                <span>Planning Tools</span>
                {activeAcc === "planning" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "planning" ? " open" : ""}`}>
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={`/user-dashboard/${tab.slug}`}
                    className="hw-nav-link"
                    onClick={closeAll}
                    style={{ gap: "0.6rem" }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#ed1173", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src={tab.img} alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
                    </div>
                    {tab.label}
                  </Link>
                ))}
              </div>
            </li>

            {/* Venues */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("venues")} aria-expanded={activeAcc === "venues"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/venues"); closeAll(); }}>Venues</span>
                {activeAcc === "venues" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "venues" ? " open" : ""}`}>
                <p className="hw-section-label">By Type</p>
                {(venueSubcategories.length > 0
                  ? [...venueSubcategories.map((s) => s.name), "View All Venues"]
                  : ["Banquet Halls", "Marriage Garden / Lawns", "Wedding Resorts", "Small Function / Party Halls", "Destination Wedding Venues", "Kalyana Mandapams", "4 Star & Above Wedding Hotels", "Venue Concierge Services", "View All Venues"]
                ).map((item, i) => {
                  const isAll = item === "View All Venues";
                  const path = isAll ? "/venues" : `/venues/${item.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
                  return (
                    <Link key={i} to={path} className="hw-nav-link" onClick={closeAll} style={{ fontWeight: isAll ? 700 : 400, color: isAll ? "#ed1173" : undefined }}>
                      {item}
                    </Link>
                  );
                })}
                <p className="hw-section-label">By City</p>
                {["Mumbai", "Bangalore", "Pune", "Kolkata", "Jaipur", "Lucknow", "Hyderabad", "More"].map((city, i) => {
                  const isMore = city === "More";
                  return (
                    <Link
                      key={i}
                      to={isMore ? "/venues" : `/venues?city=${encodeURIComponent(city)}`}
                      className="hw-nav-link"
                      onClick={() => { if (!isMore) dispatch(setLocation(city)); closeAll(); }}
                      style={{ fontWeight: isMore ? 700 : 400, color: isMore ? "#ed1173" : undefined }}
                    >
                      {city}
                    </Link>
                  );
                })}
              </div>
            </li>

            {/* Vendors */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("vendors")} aria-expanded={activeAcc === "vendors"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/vendors"); closeAll(); }}>Vendors</span>
                {activeAcc === "vendors" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "vendors" ? " open" : ""}`}>
                {vendorCategories.length > 0 && vendorCategories.map((cat, i) => (
                  <div key={cat.id || i} style={{ marginBottom: "0.75rem" }}>
                    <p className="hw-section-label">{cat.name}</p>
                    {Array.isArray(cat.subcategories) && cat.subcategories.map((sub, j) => (
                      <Link
                        key={sub.id || j}
                        to={`/vendors/${toSlug(sub.name)}${reduxLocation ? `?city=${encodeURIComponent(reduxLocation)}` : ""}`}
                        className="hw-nav-link"
                        onClick={closeAll}
                      >
                        {formatName(sub.name)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </li>

            {/* Photography */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("photography")} aria-expanded={activeAcc === "photography"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/photography"); closeAll(); }}>Photography</span>
                {activeAcc === "photography" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "photography" ? " open" : ""}`}>
                {photography.length > 0 && photography.map((cat, i) => (
                  <div key={cat.id || i} style={{ marginBottom: "0.75rem" }}>
                    <p className="hw-section-label">{cat.name}</p>
                    {Array.isArray(cat.categories) && cat.categories.map((sub, j) => (
                      <Link
                        key={sub.id || j}
                        to={`/photography/${toSlug(sub.name)}`}
                        className="hw-nav-link"
                        onClick={closeAll}
                      >
                        {formatName(sub.name)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </li>

            {/* E-Invites */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("einvites")} aria-expanded={activeAcc === "einvites"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/einvites"); closeAll(); }}>E-Invites</span>
                {activeAcc === "einvites" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "einvites" ? " open" : ""}`}>
                {einviteCategories.map((sub, j) => (
                  <Link
                    key={sub.cardType || j}
                    to={`/einvites/category/${sub.cardType}`}
                    className="hw-nav-link"
                    onClick={closeAll}
                  >
                    {formatName(sub.title)}
                  </Link>
                ))}
              </div>
            </li>

            {/* Blog */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("blog")} aria-expanded={activeAcc === "blog"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/blog"); closeAll(); }}>Blog</span>
                {activeAcc === "blog" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "blog" ? " open" : ""}`}>
                {browseByCategory.length > 0 && (
                  <>
                    <p className="hw-section-label">Browse by Category</p>
                    {browseByCategory.map((topic, index) => (
                      <Link key={index} to="/blog" className="hw-nav-link" onClick={closeAll}>
                        {topic?.name || String(topic)}
                      </Link>
                    ))}
                  </>
                )}
                {popularSections.length > 0 && (
                  <>
                    <p className="hw-section-label">Popular Sections</p>
                    {popularSections.map((cat, index) => (
                      <Link key={index} to="/blog" className="hw-nav-link" onClick={closeAll}>
                        {cat?.name || String(cat)}
                      </Link>
                    ))}
                  </>
                )}
                {mostSearchedBlogs.length > 0 && (
                  <>
                    <p className="hw-section-label">Most Searched</p>
                    {mostSearchedBlogs.map((idea, index) => (
                      <Link key={index} to="/blog" className="hw-nav-link" onClick={closeAll}>
                        {idea?.name || String(idea)}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </li>

            {/* Real Wedding */}
            <li style={{ marginBottom: "0.5rem" }}>
              <button className="hw-acc-btn" onClick={() => toggleAcc("real-wedding")} aria-expanded={activeAcc === "real-wedding"}>
                <span onClick={(e) => { e.stopPropagation(); navigate("/real-wedding"); closeAll(); }}>Real Wedding</span>
                {activeAcc === "real-wedding" ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
              <div className={`hw-acc-body${activeAcc === "real-wedding" ? " open" : ""}`}>
                <p className="hw-section-label">By City</p>
                {byCity.map((city, index) => (
                  <Link
                    key={index}
                    to="/real-wedding"
                    className="hw-nav-link"
                    onClick={() => { setSelectCity(city); setSelectedCulture("All Cultures"); setSelectedTheme("All Themes"); navigate("/real-wedding"); closeAll(); }}
                  >
                    {city}
                  </Link>
                ))}
                {cultures.length > 0 && (
                  <>
                    <p className="hw-section-label">By Culture</p>
                    {cultures.map((culture, index) => (
                      <Link
                        key={index}
                        to="/real-wedding"
                        className="hw-nav-link"
                        onClick={() => { setSelectedCulture(culture?.name || culture); setSelectCity("All Cities"); setSelectedTheme("All Themes"); navigate("/real-wedding"); closeAll(); }}
                      >
                        {culture?.name || String(culture)}
                      </Link>
                    ))}
                  </>
                )}
                {themes.length > 0 && (
                  <>
                    <p className="hw-section-label">By Theme</p>
                    {themes.map((theme, index) => (
                      <Link
                        key={index}
                        to="/real-wedding"
                        className="hw-nav-link"
                        onClick={() => { setSelectedTheme(theme); setSelectCity("All Cities"); setSelectedCulture("All Cultures"); navigate("/real-wedding"); closeAll(); }}
                      >
                        {theme}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </li>

            {/* Flat links */}
            {[
              { label: "ShaadiAI", to: "/shaadi-ai" },
              { label: "Honeymoon", to: "/honeymoon" },
              { label: "Shop", to: "https://store.happywedz.com/", external: true },
            ].map((item) => (
              <li key={item.label} style={{ marginBottom: "0.5rem" }}>
                {item.external ? (
                  <a
                    href={item.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hw-acc-btn"
                    style={{ textDecoration: "none" }}
                    onClick={closeAll}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.to} className="hw-acc-btn" style={{ textDecoration: "none" }} onClick={closeAll}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* App download */}
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f0f0f0" }}>
            <p style={{ fontWeight: 600, fontSize: "0.85rem", marginBottom: "0.5rem", color: "#555" }}>Get the App</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <img src="/images/header/playstore.png" alt="Play Store" style={{ maxHeight: 34, cursor: "pointer" }} />
              <img src="/images/header/appstore.png" alt="App Store" style={{ maxHeight: 34, cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>

      {/* City Bottom Sheet */}
      {citySheetOpen && (
        <div className="hw-city-sheet-overlay" onClick={() => setCitySheetOpen(false)} aria-hidden="true" />
      )}
      <div className={`hw-city-sheet${citySheetOpen ? " open" : ""}`} role="dialog" aria-label="Select your city">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>Select Your City</h6>
          <button
            onClick={() => setCitySheetOpen(false)}
            className="hw-touch"
            style={{ background: "none", border: "none", padding: 0 }}
            aria-label="Close city selector"
          >
            <IoClose size={24} />
          </button>
        </div>
        {cities.map((city) => (
          <button
            key={city}
            className="hw-touch"
            style={{
              width: "100%",
              background: (selectedCity === city || (!selectedCity && city === "All Cities")) ? "#fdf0f7" : "transparent",
              border: "none",
              borderBottom: "1px solid #f5f5f5",
              padding: "0 0.5rem",
              justifyContent: "space-between",
              fontWeight: (selectedCity === city || (!selectedCity && city === "All Cities")) ? 700 : 400,
              color: (selectedCity === city || (!selectedCity && city === "All Cities")) ? "#ed1173" : "#212529",
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
            onClick={() => handleCitySelect(city)}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaMapMarkerAlt size={13} color="#ed1173" />
              {city}
            </span>
            {(selectedCity === city || (!selectedCity && city === "All Cities")) && <span style={{ fontSize: "0.7rem", color: "#ed1173" }}>✓ Selected</span>}
          </button>
        ))}
      </div>
    </>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sync local selectedCity whenever Redux location changes (e.g. after mobile city sheet selection)
  useEffect(() => {
    setSelectedCity(reduxLocation);
  }, [reduxLocation]);
  const navigate = useNavigate();
  const {
    setSelectCity,
    setSelectedCulture,
    setSelectedTheme,
    cultures,
    themes,
  } = useFilter();

  const formatName = (name) => name.replace(/\band\b/gi, "&");

  const [popularSections, setPopularSections] = useState([]);
  const [browseByCategory, setBrowseByCategory] = useState([]);
  const [mostSearchedBlogs, setMostSearchedBlogs] = useState([]);

  useEffect(() => {
    const fetchCategories = async (type, setter) => {
      try {
        const res = await fetch(
          `https://happywedz.com/api/blog-categories/all?type=${type}&status=active`,
        );
        const json = await res.json();
        const arr = Array.isArray(json.data) ? json.data : [];
        setter(arr);
      } catch (e) {
        setter([]);
      }
    };
    fetchCategories("popular_section", setPopularSections);
    fetchCategories("browse_by_category", setBrowseByCategory);
    fetchCategories("most_searched", setMostSearchedBlogs);
  }, []);

  const byCity = ["Mumbai", "Bangalore", "Pune", "Kolkata", "Jaipur", "Others"];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout request failed", error);
    }

    if (isVendorLoggedIn) {
      dispatch(vendorLogout());
    } else {
      dispatch(logout());
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenTimestamp");
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorTokenExpiry");
    setMobileMenuOpen(false);
  };

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { vendor, token: vendorToken } = useSelector(
    (state) => state.vendorAuth,
  );

  const isUserLoggedIn = !!user && !!isAuthenticated;
  const isVendorLoggedIn = !!vendorToken && !!vendor;
  const isLoggedIn = isUserLoggedIn || isVendorLoggedIn;

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vendors/all?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const location = window.location.pathname;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileMenuOpen]);

  const tabs = [
    {
      id: "wedding",
      slug: "my-wedding",
      label: "My Wedding",
      img: "/images/userDashboard/mywedding-img.svg",
    },
    {
      id: "checklist",
      slug: "checklist",
      label: "Checklist",
      img: "/images/userDashboard/checklist-img.svg",
    },
    {
      id: "vendors",
      slug: "vendor",
      label: "Vendor",
      img: "/images/userDashboard/vendor-img.svg",
    },
    {
      id: "guest-list",
      slug: "guest-list",
      label: "Guest list",
      img: "/images/userDashboard/guestlist-img.svg",
    },
    {
      id: "budget",
      slug: "budget",
      label: "Budget",
      img: "/images/userDashboard/budget-img.svg",
    },
    {
      id: "wishlist",
      slug: "wishlist",
      label: "Wishlist",
      img: "/images/userDashboard/wishlist-img.svg",
    },
    {
      id: "message",
      slug: "message",
      label: "Message",
      img: "/images/userDashboard/message-img.svg",
    },
    {
      id: "real-wedding",
      slug: "real-wedding",
      label: "Real wedding",
      img: "/images/userDashboard/real-wedding-img1.png",
    },
    {
      id: "user-profile",
      slug: "user-profile",
      label: "Profile",
      img: "/images/userDashboard/userProfile-img.svg",
    },
  ];

  const [venueSubcategories, setVenueSubcategories] = useState([]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all",
        );
        const data = await response.json();
        const venues = data.find(
          (vendor) => vendor.name && vendor.name.toLowerCase() === "venues",
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
    {
      cardType: "wedding_einvite",
      title: "Wedding E-Invitations",
      icon: "bi-heart",
    },
    { cardType: "video", title: "Video Invitations", icon: "bi-play-circle" },
    {
      cardType: "save_the_date",
      title: "Save the Date",
      icon: "bi-calendar-heart",
    },
  ]);

  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all",
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



  return (
    <>
      {/* Inject mobile CSS once */}
      <style>{MOBILE_STYLES}</style>

      {/* ── NEW: MobileMenuDrawer (< 1024px) ── */}
      <MobileMenuDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isUserLoggedIn={isUserLoggedIn}
        isVendorLoggedIn={isVendorLoggedIn}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        selectedCity={selectedCity}
        dispatch={dispatch}
        setLocation={setLocation}
        tabs={tabs}
        venueSubcategories={venueSubcategories}
        vendorCategories={vendorCategories}
        photography={photography}
        einviteCategories={einviteCategories}
        browseByCategory={browseByCategory}
        popularSections={popularSections}
        mostSearchedBlogs={mostSearchedBlogs}
        byCity={byCity}
        cultures={cultures}
        themes={themes}
        reduxLocation={reduxLocation}
        setSelectCity={setSelectCity}
        setSelectedCulture={setSelectedCulture}
        setSelectedTheme={setSelectedTheme}
        toSlug={toSlug}
        formatName={formatName}
        navigate={navigate}
      />

      <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
        <div className="container-fluid p-0">

          {/* ── Mobile Topbar: logo + hamburger only (< 1024px) ── */}
          <div
            className="hw-mob-topbar"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem var(--space-4)",
              width: "100%",
            }}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src="/images/logo.webp" alt="HappyWedz" height="34" />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <button
                className="hw-touch"
                onClick={() => setMobileSearchOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 6px",
                  borderRadius: "8px",
                }}
                aria-label="Search"
              >
                <FaSearch color="white" size={18} />
              </button>

              <button
                className="hw-touch"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                style={{
                  background: "none",
                  border: "none",
                  padding: "0 4px",
                  borderRadius: "8px",
                }}
              >
                <RiMenuFill color="white" size={26} />
              </button>
            </div>
          </div>

          {/* MOBILE SEARCH OVERLAY */}
          {mobileSearchOpen && (
            <div
              className="hw-mob-overlay"
              style={{ zIndex: 1199 }}
              onClick={() => setMobileSearchOpen(false)}
            />
          )}
          <div className={`hw-mob-search-overlay${mobileSearchOpen ? " open" : ""}`}>
            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="hw-search-input"
                placeholder="Search vendors, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={mobileSearchOpen}
              />
              <button
                type="button"
                className="hw-touch"
                onClick={() => setMobileSearchOpen(false)}
                style={{ background: "#f8f9fa", border: "none", borderRadius: "10px", padding: "0 10px" }}
              >
                <IoClose size={24} color="#666" />
              </button>
            </form>
          </div>

          {/* DESKTOP VIEW */}
          <div className="d-none d-lg-block w-100">
            <div className="row w-100" style={{ margin: 0, padding: 0 }}>
              <div className="col-12 bg-white p-2">
                <div className="container w-100 p-0">
                  <div className="row align-items-center gy-2">
                    {/* Left: Tagline */}
                    <div className="col-12 col-sm-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-sm-start">
                      <a
                        className="nav-link fw-bold top-header-heading fs-18"
                        href="#"
                        style={{ color: "#C31162" }}
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
              <div className="col-12 py-0">
                <div className="container" style={{ maxWidth: "1400px" }}>
                  <div className="d-flex w-100 justify-content-center">
                    <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-between flex-nowrap">
                      <div className="text-center">
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
                        {/* Planning Tools Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("planning")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <button
                              className="nav-link dropdown-toggle text-white fs-16"
                              onClick={() => setOpenMenu(null)}
                            >
                              Planning Tools
                            </button>

                            <div
                              className="dropdown-menu mega-dropdown w-75 border-0 mt-0 p-4 rounded-0 shadow-sm bg-white"
                              style={{
                                display:
                                  openMenu === "planning" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row g-4">
                                  {/* LEFT SECTION */}
                                  <div className="col-md-8">
                                    <p className="fw-semibold text-dark mb-4 fs-16">
                                      Plan your unique wedding
                                    </p>

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
                                              `/user-dashboard/${tab.slug}`,
                                            )
                                          }
                                          className="d-flex align-items-center fs-16"
                                          style={{
                                            cursor: "pointer",
                                            transition:
                                              "color 0.2s ease-in-out",
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
                                          <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "45px",
                                              height: "45px",
                                              borderRadius: "50%",
                                              backgroundColor: "#ed1173",
                                              color: "#fff",
                                            }}
                                          >
                                            <div
                                              style={{
                                                height: "45px",
                                                width: "45px",
                                                padding: "5px",
                                                border: "none",
                                              }}
                                            >
                                              <img
                                                src={tab.img}
                                                alt=""
                                                style={{
                                                  height: "100%",
                                                  width: "100%",
                                                  objectFit: "contain",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            </div>
                                          </div>
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
                                          route:
                                            "https://play.google.com/store/apps/details?id=com.happy.happy_weds_vendors",
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
                                              <p className="fw-semibold mb-1 text-dark fs-16">
                                                {item.title}
                                              </p>
                                              <p
                                                className="mb-0 text-muted fs-14"
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

                        {/* Venues Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("venues")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <Link
                            to="/venues"
                            className="nav-link dropdown-toggle text-white fs-16"
                            onClick={() => setOpenMenu(null)}
                          >
                            Venues
                          </Link>

                          <div
                            className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 rounded-0"
                            style={{
                              display: openMenu === "venues" ? "block" : "none",
                            }}
                            onClick={() => setOpenMenu(null)}
                          >
                            <div className="container-fluid">
                              <div className="row g-4">
                                <div className="col-md-4 d-none d-md-block">
                                  <div className="primary-light-bg rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                      <p className="fw-bold mb-3 fs-16">
                                        Popular Categories
                                      </p>
                                      <div className="d-flex flex-column flex-wrap gap-2">
                                        <Link
                                          to="/venues"
                                          className="primary-text py-2 fs-14 me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Wedding Venues <FaArrowRightLong />
                                        </Link>

                                        <Link
                                          to="/venues"
                                          className="primary-text  py-2 fs-14 me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Popular Locations <FaArrowRightLong />
                                        </Link>

                                        {!isLoggedIn && (
                                          <Link
                                            to="/vendor-login"
                                            className="primary-text  py-2 fs-14 me-2 d-flex align-items-center justify-content-between"
                                          >
                                            Are You Vendor <FaArrowRightLong />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-5 p-4">
                                  <p className="fw-bold primary-text text-uppercase mb-3 fs-16">
                                    By Type
                                  </p>
                                  <div className="row">
                                    {(venueSubcategories.length > 0
                                      ? [
                                          ...venueSubcategories.map(
                                            (s) => s.name,
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
                                            <i className="bi bi-check-circle text-primary"></i>
                                            <span className="fs-14">
                                              {item}
                                            </span>
                                          </Link>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="col-md-3 p-4">
                                  <p className="fw-bold primary-text text-uppercase mb-3 fs-16">
                                    By City
                                  </p>
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
                                        : `/venues?city=${encodeURIComponent(
                                            city,
                                          )}`;
                                      return (
                                        <div className="col-12 mb-2" key={i}>
                                          <Link
                                            to={path}
                                            onClick={() => {
                                              if (!isMore) {
                                                dispatch(setLocation(city));
                                              }
                                            }}
                                            className={`dropdown-link d-flex align-items-center ${
                                              isMore
                                                ? "primary-text fw-bold text-decoration-underline"
                                                : ""
                                            }`}
                                          >
                                            <i className="bi bi-geo-alt text-primary"></i>
                                            <span className="fs-14">
                                              {city}
                                            </span>
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
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("vendors")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              to="/vendors"
                              className="nav-link dropdown-toggle text-white fs-16"
                              onClick={() => setOpenMenu(null)}
                            >
                              Vendors
                            </Link>
                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "vendors" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
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
                                        <div className="fw-bold primary-text text-uppercase mb-2 fs-16">
                                          {cat.name}
                                        </div>
                                        {Array.isArray(cat.subcategories) &&
                                          cat.subcategories.length > 0 && (
                                            <ul className="list-unstyled">
                                              {cat.subcategories.map(
                                                (sub, j) => (
                                                  <li
                                                    key={sub.id || j}
                                                    className="mb-1"
                                                  >
                                                    <Link
                                                      to={`/vendors/${toSlug(
                                                        sub.name,
                                                      )}${
                                                        reduxLocation
                                                          ? `?city=${encodeURIComponent(
                                                              reduxLocation,
                                                            )}`
                                                          : ""
                                                      }`}
                                                      className="dropdown-link fs-14 d-block"
                                                    >
                                                      {formatName(sub.name)}
                                                    </Link>
                                                  </li>
                                                ),
                                              )}
                                            </ul>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Photography Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("photography")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-16"
                              to="/photography"
                              id="photoDropdown"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Photography
                            </Link>
                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "photography" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-md-9">
                                    <div
                                      style={{
                                        columnCount: 3,
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
                                            <div className="fw-bold primary-text text-uppercase mb-2 fs-16">
                                              {cat.name}
                                            </div>
                                            {Array.isArray(cat.categories) &&
                                              cat.categories.length > 0 && (
                                                <ul className="list-unstyled">
                                                  {cat.categories.map(
                                                    (sub, j) => (
                                                      <li
                                                        key={sub.id || j}
                                                        className="mb-1"
                                                      >
                                                        <Link
                                                          to={`/photography/${toSlug(
                                                            sub.name,
                                                          )}`}
                                                          className="dropdown-link fs-14 d-block"
                                                        >
                                                          {formatName(sub.name)}
                                                        </Link>
                                                      </li>
                                                    ),
                                                  )}
                                                </ul>
                                              )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <Link
                                      to="/movment-plus/home"
                                      className="text-decoration-none"
                                    >
                                      <div className="h-100 d-flex flex-column justify-content-center align-items-center text-center p-1 rounded">
                                        <img
                                          src="https://img.freepik.com/free-photo/bride-groom-having-their-wedding-beach_23-2149043965.jpg?semt=ais_hybrid&w=740&q=80"
                                          alt="Movments Plus"
                                          className="mb-3 rounded"
                                          style={{
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                          }}
                                        />
                                        <div className="fw-bold primary-text text-uppercase fs-16">
                                          Movments Plus
                                        </div>
                                        <div className="small mt-2 fs-14 text-black">
                                          All-new gallery experience for
                                          photographers with Movments+.
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* E-Invites Dropdown */}
                        {/* <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("einvites")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-18"
                              to="/einvites"
                              state={{ title: "E-Invites" }}
                              id="einvitesDropdown"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              E-Invites
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "einvites" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container p-0">
                                <div className="row g-4">
                                  <div className="col-md-12">
                                    <h6 className="fw-semibold mb-3 primary-text text-uppercase">
                                      E-Invitation Categories
                                    </h6>
                                    <ul className="list-unstyled col m-0 p-0">
                                      {einviteCategories.map((sub, j) => (
                                        <li
                                          key={sub.id || j}
                                          className="col-12 col-md-4 mb-1 p-0"
                                        >
                                          <Link
                                            to={`/einvites/category/${sub.cardType}`}
                                            className="dropdown-link small d-block"
                                          >
                                            {formatName(sub.title)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li> */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("einvites")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-16"
                              to="/einvites"
                              state={{ title: "E-Invites" }}
                              id="einvitesDropdown"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              E-Invites
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "einvites" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container p-0">
                                <div className="row align-items-start">
                                  {/* LEFT SIDE MENU */}
                                  <div className="col-md-6">
                                    <p className="fw-semibold mb-3 primary-text text-uppercase fs-16">
                                      E-Invitation Categories
                                    </p>
                                    <ul className="list-unstyled m-0 p-0">
                                      {einviteCategories.map((sub, j) => (
                                        <li key={j} className="mb-2">
                                          <Link
                                            to={`/einvites/category/${sub.cardType}`}
                                            className="dropdown-link fs-14 d-block"
                                          >
                                            {formatName(sub.title)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* RIGHT SIDE IMAGES */}
                                  <div className="col-md-6">
                                    <div className="d-flex gap-2 justify-content-between">
                                      <img
                                        src="/e-card1.jpg"
                                        alt=""
                                        className="rounded"
                                        style={{
                                          width: "32%",
                                          height: "100px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <img
                                        src="/e-card20.png"
                                        alt=""
                                        className="rounded"
                                        style={{
                                          width: "32%",
                                          height: "100px",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <img
                                        src="/e-card3.jpg"
                                        alt=""
                                        className="rounded"
                                        style={{
                                          width: "32%",
                                          height: "100px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Shop */}
                        <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <a
                              className="nav-link text-white fs-16"
                              href="https://store.happywedz.com/"
                              id="shopLink"
                              role="button"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Shop
                            </a>
                          </div>
                        </li>

                        {/* Blog Dropdown */}
                        {/* <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("blog")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-16"
                              to="/blog"
                              state={{ title: "Blog" }}
                              id="blog"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Blog
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display: openMenu === "blog" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-12 col-md-3">
                                    <div className="fw-bold primary-text text-uppercase fs-16">
                                      Browse by Category
                                    </div>
                                    <ul className="list-unstyled col mt-2 p-0">
                                      {browseByCategory.map((cat) => (
                                        <li
                                          key={cat.id}
                                          className="dropdown-link fs-14 d-block mb-2"
                                        >
                                          <Link
                                            to={`/blog?type=browse_by_category&categoryId=${cat.id}`}
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {formatName(cat.name)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-3">
                                    <h6 className="primary-text fw-bold fs-16">
                                      Popular Sections
                                    </h6>
                                    <ul className="list-unstyled mt-2">
                                      {popularSections.map((cat) => (
                                        <li
                                          key={cat.id}
                                          className="dropdown-link fs-14 d-block mb-2"
                                        >
                                          <Link
                                            to={`/blog?type=popular_section&categoryId=${cat.id}`}
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {formatName(cat.name)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-3">
                                    <h6 className="primary-text fw-bold fs-16">
                                      Most Searched Blogs
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {mostSearchedBlogs.map((cat) => (
                                        <li
                                          key={cat.id}
                                          className="dropdown-link fs-14 d-block mb-2"
                                        >
                                          <Link
                                            to={`/blog?type=most_searched&categoryId=${cat.id}`}
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {formatName(cat.name)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                                    
                                    <img
                                      src="/blog1.jpg"
                                      alt="Top"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        marginBottom: "10px",
                                        borderRadius: "10px",
                                      }}
                                    />

                                    <img
                                      src="/blog2.jpg"
                                      alt="Bottom"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li> */}

                        {/* Genie */}
                        <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link text-white fs-16"
                              to="/shaadi-ai"
                              state={{ title: "Genie" }}
                              id="photoDropdown"
                              role="button"
                            >
                              ShaadiAI
                            </Link>
                          </div>
                        </li>

                        {/* Honeymoon */}
                        <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link text-white fs-16"
                              to="/honeymoon"
                              id="honeymoonLink"
                              role="button"
                            >
                              Honeymoon
                            </Link>
                          </div>
                        </li>

                        {/* Real Wedding Dropdown */}
                        {/* <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("real-wedding")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-16"
                              to="/real-wedding"
                              state={{ title: "Real Wedding" }}
                              id="real-wedding"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Real Wedding
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "real-wedding"
                                    ? "block"
                                    : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-12 col-md-3">
                                    <div className="fw-bold primary-text text-uppercase fs-16">
                                      By City
                                    </div>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {byCity.map((city, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block"
                                        >
                                          <Link
                                            className="fs-14"
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: "none",
                                              color: "#212529",
                                            }}
                                            onClick={() => {
                                              setSelectCity(city);
                                              setSelectedCulture(
                                                "All Cultures",
                                              );
                                              setSelectedTheme("All Themes");
                                            }}
                                          >
                                            {city}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-3">
                                    <h6 className="primary-text fw-bold fs-16">
                                      By Culture
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {cultures.map((culture, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block"
                                        >
                                          <Link
                                            className="fs-14"
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                            onClick={() => {
                                              setSelectedCulture(
                                                culture?.name || culture,
                                              );
                                              setSelectCity("All Cities");
                                              setSelectedTheme("All Themes");
                                            }}
                                          >
                                            {culture.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-3">
                                    <h6 className="primary-text fw-bold fs-16">
                                      By Theme
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {themes.map((theme, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block"
                                        >
                                          <Link
                                            className="fs-14"
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                            onClick={() => {
                                              setSelectedTheme(theme);
                                              setSelectCity("All Cities");
                                              setSelectedCulture(
                                                "All Cultures",
                                              );
                                            }}
                                          >
                                            {theme}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="col-12 col-md-3 d-flex flex-column align-items-center">
                                    <img
                                      src="/realweding1.jpg"
                                      alt="Top"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        marginBottom: "10px",
                                        borderRadius: "10px",
                                      }}
                                    />

                                    <img
                                      src="/realweding2.jpg"
                                      alt="Bottom"
                                      style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li> */}

                        {/* Auth Links */}
                        {isUserLoggedIn ? (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/user-dashboard"
                                className="nav-link text-white fs-16"
                              >
                                User Dashboard
                              </Link>
                            </div>
                          </li>
                        ) : isVendorLoggedIn ? (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/vendor-dashboard"
                                className="nav-link text-white fs-16"
                              >
                                Vendor Dashboard
                              </Link>
                            </div>
                          </li>
                        ) : (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/customer-login"
                                className="nav-link text-white fs-16"
                              >
                                Login
                              </Link>
                            </div>
                          </li>
                        )}

                        {isLoggedIn && (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <button
                                onClick={handleLogout}
                                className="nav-link text-white btn fs-16"
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
    </>
  );
};

export default Header;
