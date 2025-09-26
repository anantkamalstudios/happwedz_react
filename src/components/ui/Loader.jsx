import React from "react";
import logo from "../../../public/logo-no-bg.png";

const Loader = () => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-white d-flex justify-content-center align-items-center"
      style={{ zIndex: 2000 }}
    >
      <img
        src={logo}
        alt="Loading..."
        style={{
          width: "80px",
          height: "80px",
          animation: "spin 2s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
