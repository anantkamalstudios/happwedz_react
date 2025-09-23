import React from "react";
import { useNavigate } from "react-router-dom";

const TryLanding = () => {
  const navigate = useNavigate();

  const bgUrl =
    "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop')";

  return (
    <div className="container-fluid p-0" style={{ minHeight: "80vh" }}>
      <div
        className="d-flex align-items-center justify-content-center text-center"
        style={{
          minHeight: "80vh",
          backgroundImage: bgUrl,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: "rgba(0,0,0,0.45)" }}
        />

        <div className="position-relative text-white px-3">
          <h1 className="display-5 fw-semibold mb-3">Create Your Look</h1>
          <p className="lead mb-4" style={{ maxWidth: 720 }}>
            Elevate your style and experiment with virtual makeup in seconds.
            Try foundations, lipsticks, eyeshadows and more — all on your photo.
          </p>
          <button
            className="btn btn-lg btn-primary px-4"
            onClick={() => navigate("/try/upload")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default TryLanding;
