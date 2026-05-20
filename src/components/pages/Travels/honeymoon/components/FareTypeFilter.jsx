import { useState, useEffect } from "react";
import "./Filters.css";

export default function FareTypeFilter({ value, onChange }) {
  const fareTypes = [
    { id: "REGULAR", label: "Regular" },
    { id: "STUDENT", label: "Student" },
    { id: "SENIOR_CITIZEN", label: "Senior Citizen" },
  ];

  const handleCheckboxChange = (fareId) => {
    onChange(fareId);
  };

  return (
    <div className="filter-group filter-group-fare">
      <label className="filter-label">Fare Type</label>
      <div className="filter-checkbox-group filter-checkbox-group-fare">
        {fareTypes.map((fare) => (
          <label key={fare.id} className="filter-checkbox-label">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={value === fare.id}
              onChange={() => handleCheckboxChange(fare.id)}
            />
            <span className="filter-checkbox-text">{fare.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
