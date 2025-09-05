import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaSearch, FaStar, FaComments, FaRegSmileBeam } from "react-icons/fa";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Search & Discover",
      description:
        "Browse thousands of verified wedding vendors by category, location, and budget",
      icon: <FaSearch />,
      color: "#e83581",
    },
    {
      number: "02",
      title: "Compare & Review",
      description:
        "Read genuine reviews, check portfolios, and compare prices from multiple vendors",
      icon: <FaStar />,
      color: "#ff6b9d",
    },
    {
      number: "03",
      title: "Connect & Book",
      description:
        "Contact vendors directly, get quotes, and book your favorites with confidence",
      icon: <FaComments />,
      color: "#ff8fab",
    },
    {
      number: "04",
      title: "Plan & Celebrate",
      description:
        "Work with your chosen vendors to create the perfect wedding day",
      icon: <FaRegSmileBeam />,
      color: "#ffb3c6",
    },
  ];

  return (
    <>
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center">
            {/* <button className="cta-button">Start Planning Your Wedding</button> */}
            <h2 className="fw-bold text-dark mb-3">HappyWedz Works</h2>
            <p
              className="h6 text-muted mb-3"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              Start Planning Your Wedding
            </p>
          </div>

          <div className="steps-container mt-5">
            <div className="connecting-line"></div>

            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div
                  className="step-number-badge"
                  style={{
                    background:
                      "conic-gradient(from 180deg at 50% 50%, #FFB6C1, #FF69B4, #C71585, #FFB6C1)",
                  }}
                >
                  {step.number}
                </div>

                <span className="step-icon">{step.icon}</span>

                <h3 className="step-title">{step.title}</h3>

                <p className="step-description">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="step-arrow">
                    <svg
                      className="arrow-svg"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="20"
                        cy="20"
                        r="18"
                        fill="white"
                        stroke={step.color}
                        strokeWidth="2"
                      />
                      <path
                        d="M16 14L22 20L16 26"
                        stroke={step.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksSection;
