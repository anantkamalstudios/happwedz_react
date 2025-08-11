// src/components/MobileAppSection.js
import React from "react";

const MobileAppSection = () => {
  return (
    <section className="mobile-app-section">
      <div className="container">
        <div className="app-content">
          <div className="app-text">
            <h2>Find Your Match on the Go</h2>
            <p>
              Download the Jeevansathi app and stay connected with your matches
              anytime, anywhere.
            </p>
            <div className="app-badges">
              <div className="app-badge">
                <div className="badge-icon">G</div>
                <div>
                  <span>GET IT ON</span>
                  <span>Google Play</span>
                </div>
              </div>
              <div className="app-badge">
                <div className="badge-icon">A</div>
                <div>
                  <span>Download on the</span>
                  <span>App Store</span>
                </div>
              </div>
            </div>
          </div>
          <div className="app-image">
            <div className="phone-mockup"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
