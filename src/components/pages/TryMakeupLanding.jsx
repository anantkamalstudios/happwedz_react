import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PolicyModal = ({ open, onClose, onAgree }) => {
  const [agreeOne, setAgreeOne] = useState(false);
  const [agreeTwo, setAgreeTwo] = useState(false);

  const allAgreed = agreeOne && agreeTwo;

  if (!open) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content border-0 p-4"
          style={{ borderRadius: "16px", maxWidth: "480px", margin: "0 auto" }}
        >
          {/* Close button */}
          <div className="d-flex flex-row justify-content-between">
            <div className="text-center">
              <h4 className="fw-bold" style={{ color: "#C8006E" }}>
                Our Privacy
              </h4>
            </div>
            <div className="">
              <button
                type="button"
                className="btn p-0 border-0"
                onClick={onClose}
                style={{
                  fontSize: "1.5rem",
                  lineHeight: 1,
                  color: "#C8006E",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </div>
          </div>
          {/* Intro Text */}
          <p className="mt-3 text-center small text-muted text-justify">
            To access this service, you must be at least 18 years old.
          </p>
          <p className="text-muted small text-justify">
            At <strong>HappyWedz</strong>, we allow you to apply AI-powered
            bridal makeup filters like
            <strong>blush, lipstick, glam looks</strong> and more. Your uploaded
            image may be processed using our secure AI system to generate
            realistic try-on results.
          </p>
          <p className="text-muted small mb-4 text-justify">
            If you choose to upload a photo or use the camera, your image will
            be used solely for generating previews. We do
            <strong>not sell or misuse</strong> your data, and your images are
            deleted according to our retention policy.
          </p>
          <h6 className="fw-bold text-center mb-3">Privacy Notice</h6>
          {/* Checkbox 1 */}
          <div className="mb-3 d-flex align-items-start gap-2">
            <div>
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={agreeOne}
                onChange={(e) => setAgreeOne(e.target.checked)}
                id="agreeOne"
              />
            </div>
            <label htmlFor="agreeOne" className="small text-muted">
              I consent to the use of my image to apply virtual makeup filters
              (blush, lipstick, etc.) and agree to the use of AI processing as
              described.
            </label>
          </div>
          {/* Checkbox 2 */}
          <div className="mb-4 d-flex align-items-start gap-2">
            <div>
              <input
                type="checkbox"
                className="form-check-input mt-1"
                checked={agreeTwo}
                onChange={(e) => setAgreeTwo(e.target.checked)}
                id="agreeTwo"
              />
            </div>
            <label htmlFor="agreeTwo" className="small text-muted">
              I am at least 18 years old and agree to the terms and privacy
              practices of HappyWedz.
            </label>
          </div>
          {/* CTA Button */}
          <div className="d-grid">
            <button
              className="btn"
              style={{
                backgroundColor: "#C8006E",
                color: "#fff",
                fontWeight: "500",
              }}
              disabled={!allAgreed}
              onClick={onAgree}
            >
              I Consent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TryMakeupLanding = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };
  const handleAgree = () => {
    setOpen(false);
    navigate("/try/upload");
  };

  return (
    <div className="container py-5">
      {/* <div className="text-center mb-4">
        <h2 className="fw-semibold">Try Makeup</h2>
        <p className="text-muted">Start by reviewing our policy</p>
      </div>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Open Policy
        </button>
      </div> */}

      <PolicyModal open={open} onClose={handleClose} onAgree={handleAgree} />
    </div>
  );
};

export default TryMakeupLanding;
