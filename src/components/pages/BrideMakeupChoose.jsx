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
          <h1 className="fw-semibold mb-2 ">{title}</h1>
          <p className="mb-3 fs-20" style={{ opacity: 0.9 }}>
            {subtitle}
          </p>
          <button
            className="rounded-4 w-75 mt-2"
            style={{
              padding: "10px 0",
              background: "linear-gradient(to right, #E83580, #821E48)",
              color: "#fff",
              border: "none",
              fontSize: "20px",
            }}
            onClick={onTry}
          >
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
        subtitle="Instantly Try On Makeup Looks And Find Your Perfect Shades."
        image="/images/try/makeup1.png"
        onTry={() => navigate("/try/makeup")}
      />

      <SectionCard
        title="Jewellery"
        subtitle="Instantly Try On Jewellery Looks And Find Your Perfect Piece."
        image="/images/try/jewellaryImage.png"
        onTry={() => navigate("/try/makeup")}
      />

      <SectionCard
        title="Outfit"
        subtitle="Instantly Try On Outfits And Find Your Perfect Look."
        image="/images/try/outfitImage.png"
        onTry={() => navigate("/try/makeup")}
      />
    </div>
  );
};

export default BrideMakeupChoose;
