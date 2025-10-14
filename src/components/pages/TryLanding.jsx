import React, { useState, useEffect } from "react";
import { FaBolt, FaPalette, FaMobileAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const TryLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (user && location.state?.openPopup) {
      setShowModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [user, location.state, navigate]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCategorySelect = (category) => {
    setShowModal(false);
  };

  return (
    <>
      <div className="try-first-page-container">
        {/* Hero Section */}
        <div
          className={`try-first-page-hero ${
            isLoaded ? "try-first-page-loaded" : ""
          }`}
        >
          <div className="try-first-page-hero-particles">
            <div className="try-first-page-particle"></div>
            <div className="try-first-page-particle"></div>
            <div className="try-first-page-particle"></div>
            <div className="try-first-page-particle"></div>
            <div className="try-first-page-particle"></div>
          </div>

          <div
            className="try-first-page-hero-content px-6"
            style={{
              placeSelf: "flex-end",
              display: "flex",
              justifyContent: "start",
              alignItems: "start",
            }}
          >
            <div
              className="try-first-page-content-wrapper"
              style={{ marginBottom: "8rem", marginLeft: "3rem" }}
            >
              <h1
                className="try-first-page-title"
                style={{ fontWeight: "400", textAlign: "start" }}
              >
                Virtual Try On
                {/* <span className="try-first-page-gradient-text"> AI Magic</span> */}
              </h1>
              {/* <div className="try-first-page-features">
                <div className="try-first-page-feature">
                  <FaBolt className="try-first-page-icon" />
                  <span>Instant Results</span>
                </div>
                <div className="try-first-page-feature">
                  <FaPalette className="try-first-page-icon" />
                  <span>Professional Quality</span>
                </div>
                <div className="try-first-page-feature">
                  <FaMobileAlt className="try-first-page-icon" />
                  <span>Mobile Friendly</span>
                </div>
              </div> */}
              <p
                style={{
                  color: "#fff",
                  fontSize: "1.6rem",
                  fontWeight: "500",
                  wordSpacing: "1.5px",
                }}
              >
                Makeup, Jewellary & Outfits in One Place
              </p>
              <button
                style={{
                  background: "linear-gradient(to right, #E83580, #821E48)",
                  color: "#fff",
                  border: "2px solid #C31162",
                  padding: "0.5rem 0",
                  fontWeight: "500",
                  borderRadius: "10px",
                  fontSize: "1.5rem",
                  width: "100%",
                }}
                onClick={() => {
                  if (!user) {
                    navigate("/customer-login", {
                      state: { from: "/try", openPopup: true },
                    });
                  } else {
                    setShowModal(true);
                    navigate("/try");
                  }
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Modal */}

        {showModal && (
          <div
            className="try-first-page-modal-backdrop"
            onClick={handleModalClose}
          >
            <div
              className="try-first-page-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="try-first-page-modal-header">
                <h2 style={{ color: "#C31162" }}>Choose Your Style</h2>
                <p style={{ color: "#000", fontWeight: "700" }}>
                  Instantly try on makeup look and find your perfect shades
                </p>

                <button
                  className="try-first-page-modal-close"
                  onClick={handleModalClose}
                >
                  <span>×</span>
                </button>
              </div>

              <div className="try-first-page-modal-content">
                <div className="row g-4 text-center">
                  {/* Bride */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => navigate("/try/bride")}
                      className="d-flex flex-column align-items-center"
                    >
                      <img
                        src="/images/try/bride.jpg"
                        alt="Bride"
                        className="rounded-5"
                        style={{
                          width: "100%",
                          height: "280px",
                          objectFit: "cover",
                        }}
                      />

                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Bride
                      </h4>
                    </div>
                  </div>

                  {/* Groom */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => navigate("/try/groome")}
                      className="d-flex flex-column align-items-center"
                    >
                      <div
                        className="position-relative w-100 try-modal-container"
                        style={{ height: "280px" }}
                      >
                        <img
                          src="/images/try/groome.jpg"
                          alt="Groom"
                          className="rounded-5 w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />

                        <h4 className="mt-3 fw-semibold">Groom</h4>
                        {/* <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
                          <span className="text-white fs-4 fw-bold">
                            Coming Soon
                          </span>
                        </div> */}
                      </div>
                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Groom
                      </h4>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => handleCategorySelect("other")}
                      className="d-flex flex-column align-items-center"
                    >
                      <div
                        className="position-relative w-100 try-modal-container"
                        style={{ height: "280px" }}
                      >
                        <img
                          src="/images/try/other.jpg"
                          alt="Other"
                          className="rounded-5 w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                        {/* Unique Overlay */}
                        <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
                          <span className="text-white fs-4 fw-bold">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Other
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TryLanding;
