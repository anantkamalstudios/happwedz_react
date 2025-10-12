import React from "react";
import { useNavigate } from "react-router-dom";

const SectionCard = ({ title, subtitle, image, onTry }) => {
  return (
    <div className="position-relative rounded-0 overflow-hidden mb-4">
      <img
        src={image}
        alt={title}
        className="w-100 h-100"
        style={{ objectFit: "cover", filter: "brightness(1)" }}
      />
      <div className="row position-absolute bottom-50 end-0 p-4 text-center text-white w-100 d-flex justify-content-end">
        <div className="col-md-6"></div>
        <div className="col-md-4 justify-content-end">
          <h1 className="fw-bold mb-2 ">{title}</h1>
          <p className="mb-3" style={{ opacity: 0.9 }}>
            {subtitle}
          </p>
          <button className="btn-primary rounded-2" onClick={onTry}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

const BrideMakeupChoose = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <SectionCard
        title="Makeup"
        subtitle="Explore stunning bridal makeup looks curated by professionals."
        image="/images/try/makeup1.png"
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
