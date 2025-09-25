import React from "react";
import { useNavigate } from "react-router-dom";

const SectionCard = ({ title, subtitle, image, onTry }) => {
  return (
    <div
      className="position-relative rounded-4 overflow-hidden mb-4"
      style={{ minHeight: 320 }}
    >
      <img
        src={image}
        alt={title}
        className="w-100 h-100"
        style={{ objectFit: "cover", filter: "brightness(0.75)" }}
      />
      <div
        className="position-absolute top-0 end-0 p-4 text-end text-white"
        style={{ maxWidth: 520 }}
      >
        <h1 className="fw-bold mb-2">{title}</h1>
        <p className="mb-3" style={{ opacity: 0.9 }}>
          {subtitle}
        </p>
        <button className="try-btn w-50 rounded-2" onClick={onTry}>
          Get Started
        </button>
      </div>
    </div>
  );
};

const BrideMakeupChoose = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <h2 className="fw-semibold">Choose what you'd like to try</h2>
        <p className="text-muted">Pick a category to continue</p>
      </div>

      <SectionCard
        title="Makeup"
        subtitle="Explore stunning bridal makeup looks curated by professionals."
        image="/images/try/makeup.png"
        onTry={() => navigate("/try/makeup")}
      />

      <SectionCard
        title="Jewellery"
        subtitle="Try elegant jewellery pieces that complement your bridal style."
        image="/images/try/jewelry.png"
        onTry={() => navigate("/try/makeup")}
      />

      <SectionCard
        title="Outfit"
        subtitle="Visualize outfits to complete your perfect bridal look."
        image="/images/try/outfit.png"
        onTry={() => navigate("/try/makeup")}
      />
    </div>
  );
};

export default BrideMakeupChoose;
