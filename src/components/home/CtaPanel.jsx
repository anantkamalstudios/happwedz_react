import React from "react";
import { Link } from "react-router-dom";

const CtaPanel = ({ img, title, link, subtitle, btnName }) => {
  return (
    <div className="home-cta-section d-flex align-items-center justify-content-center my-5">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="row w-100">
          <div className="col-12 col-lg-12">
            <div className="ui-card d-flex flex-column flex-md-row align-items-center text-center text-md-start">
              <div className="me-md-4 mb-4 mb-md-0">
                <img
                  src={img}
                  alt="HappyWedz Logo"
                  width="100"
                  height="100"
                  className="img-fluid"
                  loading="lazy"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex-grow-1 me-md-4 mb-4 mb-md-0">
                <h2 className="fs-4 fw-bold mb-2 text-dark">{title}</h2>
                <p className="mb-0 text-dark">{subtitle}</p>
              </div>
              <div>
                <Link to={link}>
                  <button className="btn cta-btn">{btnName}</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaPanel;
