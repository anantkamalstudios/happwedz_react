import React from "react";

const VendorPolicies = ({ formData, setFormData, onSave }) => {
  const paymentTerms = formData.paymentTerms || {
    advancePercent: "",
    modes: [],
  };

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
        <h6 className="mb-3 fw-bold">Policies & Terms</h6>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Cancellation Policy
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.cancellationPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cancellationPolicy: e.target.value,
                }))
              }
              placeholder="Enter cancellation policy"
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Refund Policy</label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.refundPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  refundPolicy: e.target.value,
                }))
              }
              placeholder="Enter refund policy"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Advance Payment %</label>
            <input
              type="number"
              className="form-control"
              value={paymentTerms.advancePercent}
              onChange={(e) =>
                handleNestedInputChange(
                  "paymentTerms",
                  "advancePercent",
                  e.target.value
                )
              }
              placeholder="Advance payment percentage"
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Terms & Conditions</label>
            <textarea
              className="form-control"
              rows="4"
              value={formData.tnc || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tnc: e.target.value }))
              }
              placeholder="Enter terms and conditions"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" onClick={onSave}>Save Policies & Terms</button>
      </div>
    </div>
  );
};

export default VendorPolicies;
