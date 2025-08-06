import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="floral-border top-left"></div>
      <div className="floral-border top-right"></div>
      <div className="floral-border bottom-left"></div>
      <div className="floral-border bottom-right"></div>

      <div className="not-found-content text-center">
        <div className="elegant-number">
          <span className="number-4">4</span>
          <div className="floral-divider"></div>
          <span className="number-0">0</span>
          <div className="floral-divider"></div>
          <span className="number-4">4</span>
        </div>

        <h1 className="elegant-title">Page Not Found</h1>

        <p className="romantic-text">
          Like a missing piece of the wedding cake, this page seems to have
          vanished.
          <br />
          Let's find our way back to the celebration.
        </p>

        <div className="d-flex justify-content-center mt-5">
          <Link to="/" className="elegant-button">
            Return to Home
            <div className="button-flourish left"></div>
            <div className="button-flourish right"></div>
          </Link>
        </div>
      </div>

      <div className="floating-petals">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="petal"
            style={{
              "--delay": `${Math.random() * 5}s`,
              "--size": `${5 + Math.random() * 10}px`,
              "--left": `${Math.random() * 100}%`,
              "--duration": `${10 + Math.random() * 20}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
