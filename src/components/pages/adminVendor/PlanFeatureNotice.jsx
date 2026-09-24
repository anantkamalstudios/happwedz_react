import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

/**
 * Shown in place of a dashboard tool the vendor's plan doesn't include.
 *
 * The tab itself is hidden from the navbar, so this is what a vendor sees only
 * if they reach the page another way: a bookmark, an old open tab, or a link
 * from before they changed plan. The server refuses the data either way.
 */
const PlanFeatureNotice = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div
        className="mx-auto text-center p-4 p-md-5"
        style={{ maxWidth: 520, background: "#fff", border: "1px solid #e7e8ee", borderRadius: 14 }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{ width: 52, height: 52, borderRadius: "50%", background: "#fde7f1", color: "#ed1173" }}
        >
          <FiLock size={22} />
        </div>
        <h5 className="fw-bold mb-2">{title} is not part of your plan</h5>
        <p className="text-muted mb-4" style={{ fontSize: ".92rem" }}>
          {description} Your saved data is safe — upgrade and it comes straight back.
        </p>
        <button
          type="button"
          className="btn"
          style={{ background: "#ed1173", color: "#fff", fontWeight: 600, padding: "10px 22px", borderRadius: 9 }}
          onClick={() => navigate("/vendor-dashboard/vendor-setting?tab=billing")}
        >
          View plans
        </button>
      </div>
    </div>
  );
};

export default PlanFeatureNotice;
