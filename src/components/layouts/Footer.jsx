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
      className="footer position-relative pt-0"
      style={{
        background:
          "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f1f3f4 100%)",
        color: "#222",
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
          <div className="col-6 col-md-3">
            <h6 className="footer-title">Plan Your Wedding</h6>
            <ul className="footer-list">
              <li>
                <Link to="/user-dashboard/my-wedding">Start Planning</Link>
              </li>
              <li>
                <Link to="/vendors">Search By Vendor</Link>
              </li>
              <li>
                <Link to="/vendors">Search By City</Link>
              </li>
              <li>
                <Link to="#" disable={true}>
                  Top Rated Vendors
                </Link>
              </li>
              <li>
                <Link to="#" disable={true}>
                  Destination Wedding
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Inspiration & Ideas</h6>
            <ul className="footer-list">
              <li>
                <Link to="/blog">Wedding Blog</Link>
              </li>
              <li>
                <Link to="/photography">Wedding Inspiration Gallery</Link>
              </li>
              <li>
                <Link to="/real-wedding">Real Wedding</Link>
              </li>
              <li>
                <Link to="/user-dashboard/real-wedding">
                  Submit Your Wedding
                </Link>
              </li>
              {/* <li>
                <Link to="#photo-gallery">Photo Gallery</Link>
              </li> */}
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Bridal & Groom Fashion</h6>
            <ul className="footer-list" style={{ color: "GrayText" }}>
              <li>
                <a
                  onClick={() => handleCategoryClick("Wedding Card Designs")}
                  style={{ cursor: "pointer" }}
                >
                  Wedding Card Designs
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleCategoryClick("Outfit")}
                  style={{ cursor: "pointer" }}
                >
                  Outfit
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleCategoryClick("Bridal Makeup & Hair")}
                  style={{ cursor: "pointer" }}
                >
                  Bridal Makeup &amp; Hair
                </a>
              </li>
              <li>
                <animateTransform
                  onClick={() => handleCategoryClick("Groom Wear")}
                  style={{ cursor: "pointer" }}
                >
                  Groom Wear
                </animateTransform>
              </li>
              <li>
                <a
                  onClick={() => handleCategoryClick("Jewellery & Accessories")}
                  style={{ cursor: "pointer" }}
                >
                  Jewellery & Accessories
                </a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Company</h6>
            <ul className="footer-list">
              <li>
                <Link to="/about-us">About HappyWedz</Link>
              </li>
              <li>
                <Link to="#" disable={true}>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link to="#" disable={true}>
                  Site Map
                </Link>
              </li>

              <li>
                <Link to="/einvites">Wedding Invitation Maker</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 opacity-50" />

        <div className="row gy-4">
          <div className="col-12 col-md-6">
            <ul className="footer-list list-unstyled d-flex flex-wrap pt-3">
              <li className="me-3">
                {" "}
                <Link to="/terms" className="me-3">
                  Terms&Condition
                </Link>
              </li>

              <li className="me-3">
                {" "}
                <Link to="/cancellation" className="me-3">
                  Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex gap-3 align-items-start pt-2">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              <a
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.954 4.569a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 9.9 9.9 0 0 1-3.127 1.195 4.92 4.92 0 0 0-8.384 4.482A13.97 13.97 0 0 1 1.671 3.149 4.822 4.822 0 0 0 1.05 5.624a4.92 4.92 0 0 0 2.188 4.1 4.902 4.902 0 0 1-2.229-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.224.084 4.937 4.937 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.396 0-.788-.023-1.175-.068a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.01-7.496 14.01-13.986 0-.21-.005-.423-.015-.634a9.936 9.936 0 0 0 2.457-2.548z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
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

        <hr className="my-4 opacity-50" />

        <div className="text-center small  ">
          <p className="">
            &copy; {new Date().getFullYear()} HappWedz Studios. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
