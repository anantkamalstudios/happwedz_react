import React from "react";

const VendorPricing = ({ formData, setFormData }) => {
  const priceRange = formData.priceRange || { min: "", max: "" };

  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subSection]: {
        ...(prev[subSection] || {}),
        [field]: value,
      },
    }));
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Pricing & Packages</h6>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Starting Price</label>
            <input
              type="number"
              className="form-control"
              value={formData.startingPrice || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  startingPrice: e.target.value,
                }))
              }
              placeholder="Enter starting price"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Price Unit</label>
            <select
              className="form-select"
              value={formData.priceUnit || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priceUnit: e.target.value }))
              }
            >
              <option value="per_person">Per Person</option>
              <option value="per_event">Per Event</option>
              <option value="per_hour">Per Hour</option>
              <option value="per_day">Per Day</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Currency</label>
            <select
              className="form-select"
              value={formData.currency || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, currency: e.target.value }))
              }
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Price Range Min</label>
            <input
              type="number"
              className="form-control"
              value={priceRange.min}
              onChange={(e) =>
                handleNestedInputChange("priceRange", "min", e.target.value)
              }
              placeholder="Minimum price"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Price Range Max</label>
            <input
              type="number"
              className="form-control"
              value={priceRange.max}
              onChange={(e) =>
                handleNestedInputChange("priceRange", "max", e.target.value)
              }
              placeholder="Maximum price"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2">Save Pricing Details</button>
      </div>
    </div>
  );
};

export default VendorPricing;
