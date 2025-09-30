import React, { useState, useEffect } from "react";
import { FaBolt, FaPalette, FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TryLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleCategorySelect = (category) => {
    setShowModal(false);
    console.log(`Navigating to: /try/upload/${category}`);
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

          <div className="try-first-page-hero-content">
            <div className="try-first-page-content-wrapper">
              <h1 className="try-first-page-title">
                Transform Your Look with
                <span className="try-first-page-gradient-text"> AI Magic</span>
              </h1>
              <div className="try-first-page-features">
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
              </div>
              <button
                className="try-first-page-cta-button"
                onClick={() => setShowModal(true)}
              >
                <span>Start Your Transformation</span>
                <i className="try-first-page-button-icon">→</i>
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
                <h2>Choose Your Style</h2>
                <p>Select a category to start your virtual makeover</p>

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

                      <h4 className="mt-3 fw-semibold">Bride</h4>
                    </div>
                  </div>

                  {/* Groom */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => handleCategorySelect("groom")}
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
                        {/* Unique Overlay */}
                        <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
                          <span className="text-white fs-4 fw-bold">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <h4 className="mt-3 fw-semibold">Groom</h4>
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
                      <h4 className="mt-3 fw-semibold">Other</h4>
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
