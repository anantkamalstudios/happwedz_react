import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setRoleType } from "../../../redux/roleSlice";

const SectionCard = ({ title, subtitle, image, onTry, comingSoon }) => {
  return (
    <div
      className="position-relative rounded-0 overflow-hidden mb-4"
      style={{
        pointerEvents: comingSoon ? "none" : "auto",
      }}
    >
      <img
        src={image}
        alt={title}
        className="w-100 h-100"
        style={{
          objectFit: "cover",
          filter: comingSoon ? "brightness(0.6)" : "brightness(1)",
          height: "90vh",
        }}
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

      {comingSoon && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "900",
              color: "#fff",
              letterSpacing: "2px",
            }}
          >
            Coming Soon
          </h1>
        </div>
      )}
    </div>
  );
};

const GroomeMakeupChoose = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  return (
    <div className="">
      <SectionCard
        title="Makeup"
        subtitle="Explore stunning groome makeup looks curated by professionals."
        image="/images/try/groomMakeup.png"
        onTry={() => {
          navigate("/try/makeup");
          dispatch(setRoleType({ type: "makeup" }));
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          userInfo.type = "makeup";
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }}
      />

      <SectionCard
        title="Jewellery"
        subtitle="Try elegant jewellery pieces that complement your groome style."
        image="/images/try/groomJewellary.png"
        onTry={() => {
          navigate("/try/makeup");
          dispatch(setRoleType({ type: "jewellary" }));
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          userInfo.type = "jewellary";
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }}
        comingSoon
      />

      <SectionCard
        title="Outfit"
        subtitle="Visualize outfits to complete your perfect groome look."
        image="/images/try/groomOutfit.png"
        onTry={() => {
          navigate("/try/makeup");
          dispatch(setRoleType({ type: "outfit" }));
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          userInfo.type = "outfit";
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }}
        comingSoon
      />
    </div>
  );
};

export default GroomeMakeupChoose;
