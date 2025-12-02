import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { MyContext } from "../../context/useContext";

const Footer = () => {
  const navigate = useNavigate();
  const {
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    setSelectedCategoryName,
    types,
  } = useContext(MyContext);

  const findCategoryIdByName = (categoryName) => {
    if (!types || !Array.isArray(types)) return null;
    const category = types.find(
      (type) => type.name?.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };

  const handleCategoryClick = (categoryName) => {
    const categoryId = findCategoryIdByName(categoryName);
    if (categoryId) {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(categoryName);
      navigate("/photography");
    }
  };

  return (
    <footer
      className="footer position-relative pt-0 primary-bg text-white"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Top Border */}
      <div
        style={{
          width: "100%",
          height: "4px",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Subtle Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(232, 53, 129, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 107, 157, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(232, 53, 129, 0.02) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row gy-4">
          {/* === LOGO COLUMN === */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Link
              to="/"
              style={{
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              <img
                src="/images/logo.webp"
                alt="HappyWedz Logo"
                style={{
                  width: "150px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>

            <p
              className="fs-14"
              style={{
                marginTop: "20px",
                maxWidth: "85%",
                lineHeight: "1.8",
              }}
            >
              29/1B, Sinhgad Rd, next to Vidya Sahakri Bank,
              <br /> Near Veer Baji Pasalkar Chowk, Kirti Nagar, Vadgaon Budruk,
              Pune, Maharashtra 411041
            </p>
          </div>

          <div className="col-12 col-sm-6 col-lg-3" style={{ color: "#fff" }}>
            <p className="footer-title fs-16">Plan Your Wedding</p>
            <ul className="footer-list">
              <li className="fs-14">
                <Link to="/user-dashboard/my-wedding" className="fs-14">
                  Start Planning
                </Link>
              </li>
              <li className="fs-14">
                <Link
                  to="/vendors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="fs-14"
                >
                  Search By Vendor
                </Link>
              </li>
              <li className="fs-14">
                <Link
                  to="/vendors"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="fs-14"
                >
                  Search By City
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/top-rated" className="fs-14">
                  Top Rated Vendors
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/destination-wedding" className="fs-14">
                  Destination Wedding
                </Link>
              </li>
            </ul>
          </div>

          {/* === INSPIRATION & IDEAS === */}
          <div className="col-12 col-sm-6 col-lg-3">
            <p className="footer-title fs-16">Inspiration & Ideas</p>
            <ul className="footer-list">
              <li className="fs-14">
                <Link to="/blog" className="fs-14">
                  Wedding Blog
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/photography" className="fs-14">
                  Wedding Inspiration Gallery
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/real-wedding" className="fs-14">
                  Real Wedding
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/user-dashboard/real-wedding" className="fs-14">
                  Submit Your Wedding
                </Link>
              </li>
            </ul>
          </div>

          {/* === BRIDAL & GROOM FASHION === */}
          <div className="col-12 col-sm-6 col-lg-3">
            <p className="footer-title fs-16">Bridal & Groom Fashion</p>
            <ul className="footer-list" style={{ color: "#fff" }}>
              <li className="fs-14">
                <a
                  onClick={() => handleCategoryClick("Wedding Card Designs")}
                  style={{ cursor: "pointer" }}
                  className="fs-14"
                >
                  Wedding Card Designs
                </a>
              </li>
              <li className="fs-14">
                <a
                  onClick={() => handleCategoryClick("Outfit")}
                  style={{ cursor: "pointer" }}
                  className="fs-14"
                >
                  Outfit
                </a>
              </li>
              <li className="fs-14">
                <a
                  onClick={() => handleCategoryClick("Bridal Makeup & Hair")}
                  style={{ cursor: "pointer" }}
                  className="fs-14"
                >
                  Bridal Makeup &amp; Hair
                </a>
              </li>
              <li className="fs-14">
                <a
                  onClick={() => handleCategoryClick("Groom Wear")}
                  style={{ cursor: "pointer" }}
                  className="fs-14"
                >
                  Groom Wear
                </a>
              </li>
              <li className="fs-14">
                <a
                  onClick={() => handleCategoryClick("Jewellery & Accessories")}
                  style={{ cursor: "pointer" }}
                  className="fs-14"
                >
                  Jewellery & Accessories
                </a>
              </li>
            </ul>
          </div>

          {/* === COMPANY === */}
          <div className="col-12 col-sm-6 col-lg-3">
            <p className="footer-title fs-16">Company</p>
            <ul className="footer-list">
              <li className="fs-14">
                <Link to="/about-us" className="fs-14">
                  About HappyWedz
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/careers" className="fs-14">
                  Careers
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/contact-us" className="fs-14">
                  Contact Us
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/sitemap" className="fs-14">
                  Site Map
                </Link>
              </li>
              <li className="fs-14">
                <Link to="/einvites" className="fs-14">
                  Wedding Invitation Maker
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 opacity-50" style={{ background: "#fff" }} />

        <div className="row gy-4">
          <div className="col-12 col-md-6">
            <ul className="footer-list list-unstyled d-flex flex-wrap pt-3">
              <li className="me-3">
                {" "}
                <Link to="/terms" className="me-3 fs-16">
                  Terms & Condition
                </Link>
              </li>

              <li className="me-3">
                {" "}
                <Link to="/cancellation" className="me-3 fs-16">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex gap-3 align-items-start pt-2">
              <a
                href="https://facebook.com/happywedz"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <i
                  className="fa-brands fa-facebook-f"
                  style={{ color: "#C31162" }}
                ></i>
              </a>
              <a
                href="https://instagram.com/happywedz/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <i
                  className="fa-brands fa-instagram"
                  style={{ color: "#C31162" }}
                ></i>
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter (X)"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                style={{ color: "#C31162" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 1227"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.8L667.137 450.887L360.017 0H0L466.92 681.821L0 1226.55H105.08L518.72 751.869L840.882 1226.55H1200L714.163 519.284ZM567.17 689.73L523.16 627.913L143.04 80.73H310.4L621.477 532.57L665.487 594.387L1067.04 1150.63H899.68L567.17 689.73Z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@HappyWedz"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
                style={{ color: "#C31162" }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.498 6.186a2.995 2.995 0 0 0-2.111-2.115C19.37 3.5 12 3.5 12 3.5s-7.37 0-9.387.571a2.995 2.995 0 0 0-2.111 2.115C.5 8.203.5 12 .5 12s0 3.797.002 5.814a2.995 2.995 0 0 0 2.111 2.115c2.016.57 9.387.57 9.387.57s7.37 0 9.387-.571a2.995 2.995 0 0 0 2.111-2.115C23.5 15.797 23.5 12 23.5 12s0-3.797-.002-5.814zM9.75 15.02V8.98l6.5 3.02-6.5 3.02z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4 opacity-50" style={{ background: "#fff" }} />

        <div className="text-center fs-14">
          <p style={{ color: "#fff" }}>
            &copy; {new Date().getFullYear()} HappyWedz Technologies Pvt. Ltd.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
