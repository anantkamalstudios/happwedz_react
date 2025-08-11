// src/components/HeroSection.js
import React from "react";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Life Partner</h1>
          <p className="hero-subtitle">
            Trusted by millions of families since 2004
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Create Free Profile</button>
            <button className="btn btn-outline">Search Matches</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
