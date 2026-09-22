import React from "react";
import { STATUS_TONES } from "./crmFormat";

export const Badge = ({ status, children }) => (
  <span className={`crm-badge crm-tone-${STATUS_TONES[status] || "grey"}`}>{children}</span>
);

export const Spinner = () => (
  <div className="crm-spinner">
    <div className="spinner-border" style={{ color: "#ed1173" }} role="status">
      <span className="visually-hidden">Loading</span>
    </div>
  </div>
);

// Rupee amount input: plain number text, the ₹ sign drawn by CSS.
export const RupeeInput = ({ value, onChange, placeholder = "0", ...rest }) => (
  <div className="crm-rupee">
    <input
      className="crm-input"
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ""))}
      {...rest}
    />
  </div>
);
