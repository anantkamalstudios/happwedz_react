import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

/**
 * Shown in place of a dashboard tool the vendor's plan doesn't include.
 *
 * These tabs used to be hidden from the navbar, which made this a page almost
 * nobody saw — only someone arriving from a bookmark or an old open tab. They
 * are listed for everyone now, marked with a padlock, so this is the ordinary
 * way a vendor finds out what a feature does and what it would cost. It is
 * worth keeping it a decent page.
 *
 * Nothing here is a security boundary: the API refuses the data either way.
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
