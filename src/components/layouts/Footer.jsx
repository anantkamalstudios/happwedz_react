import { Link } from "react-router-dom";
import React from "react";

const Footer = () => {
  return (
    <footer
      className="footer position-relative pt-0 mt-5"
      style={{
        background: "#fefefe",
        color: "#222",
        marginTop: "2rem",
      }}
    >
      {/* <div
        style={{
          width: "100%",
          lineHeight: 0,
          transform: "translateY(-100%) rotate(180deg)",
        }}
      >
        <svg
          viewBox="0 0 1440 100"
          width="100%"
          height="100"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            d="M0,80 C360,120 1080,0 1440,80 L1440,0 L0,0 Z"
            fill="#fff"
            stroke="#eee"
            strokeWidth="2"
          />
        </svg>
      </div> */}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="row gy-4">
          <div className="col-6 col-md-3">
            <h6 className="footer-title">Plan Your Wedding</h6>
            <ul className="footer-list">
              <li>
                <a href="#start-planning">Start Planning</a>
              </li>
              <li>
                <a href="#vendor-search">Search By Vendor</a>
              </li>
              <li>
                <a href="#city-search">Search By City</a>
              </li>
              <li>
                <a href="#top-rated">Top Rated Vendors</a>
              </li>
              <li>
                <a href="#destination">Destination Wedding</a>
              </li>
              {/* <li><a href="#ideas">Wedding Ideas</a></li> */}
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Inspiration & Ideas</h6>
            <ul className="footer-list">
              <li>
                <a href="#wedding-blog">Wedding Blog</a>
              </li>
              <li>
                <a href="#inspo-gallery">Wedding Inspiration Gallery</a>
              </li>
              <li>
                <a href="#real-wedding">Real Wedding</a>
              </li>
              <li>
                <a href="#submit-wedding">Submit Your Wedding</a>
              </li>
              <li>
                <a href="#photo-gallery">Photo Gallery</a>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Bridal & Groom Fashion</h6>
            <ul className="footer-list">
              <li>
                <a href="#bridal-wear">Bridal Wear</a>
              </li>
              <li>
                <a href="#jewellery">Wedding Jewellery</a>
              </li>
              <li>
                <a href="#makeup-hair">Bridal Makeup &amp; Hair</a>
              </li>
              <li>
                <a href="#groom-wear">Groom Wear</a>
              </li>
              <li>
                <a href="#accessories">Wedding Accessories</a>
              </li>
              {/* <li><a href="#mehendi">Mehendi Designs</a></li> */}
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="footer-title">Company</h6>
            <ul className="footer-list">
              <li>
                <a href="#about">About WedMeGood</a>
              </li>
              <li>
                <a href="#careers">Careers</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <a href="#sitemap">Site Map</a>
              </li>

              <li>
                <a href="#invitation-maker">Wedding Invitation Maker</a>
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

      <style>{`
        .footer { 
          background: #fff;
          color: #222;
          box-shadow: 0 -2px 16px 0 rgba(0,0,0,0.04);
        }
        .footer-title,
        .section-title {
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: #111;
        }
        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-list li {
          margin: 0.35rem 0;
        }
        .footer-list a {
          color: #222;
          text-decoration: none;
          transition: color .2s;
          font-size: 0.95rem;
        }
        .footer-list a:hover {
          color: #e83581;
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f5f5f5;
          color: #222;
          text-decoration: none;
          transition: transform .2s, background .2s;
          font-size: 1.2rem;
        }
        .social-btn:hover {
          background: #e83581;
          color: #fff;
          transform: scale(1.1);
        }
        .footer hr {
          border-color: #eee;
        }
        .footer .small {
          color: #888;
        }
        @media (max-width: 767px) {
          .footer-list a { font-size: 0.9rem; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
