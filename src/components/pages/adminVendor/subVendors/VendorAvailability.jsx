import React from "react";
import VendorAvailabilityCalendar from "./VendorAvailabilityCalendar";

const VendorAvailability = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
}) => {
  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subSection]: {
        ...((prev && prev[subSection]) || {}),
        [field]: value,
      },
    }));
  };

  // Handler to save and show success modal
  const handleSaveAndShow = async () => {
    if (onSave) {
      await onSave();
    }
    if (onShowSuccess) {
      onShowSuccess();
    }
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Availability & Slots</h6>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Opening Time</label>
            <input
              type="time"
              className="form-control"
              value={formData?.timing?.open || ""}
              onChange={(e) =>
                handleNestedInputChange("timing", "open", e.target.value)
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Closing Time</label>
            <input
              type="time"
              className="form-control"
              value={formData?.timing?.close || ""}
              onChange={(e) =>
                handleNestedInputChange("timing", "close", e.target.value)
              }
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Last Entry Time</label>
            <input
              type="time"
              className="form-control"
              value={formData?.timing?.lastEntry || ""}
              onChange={(e) =>
                handleNestedInputChange("timing", "lastEntry", e.target.value)
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Feature Available</label>
            <select
              className="form-select"
              value={formData?.isFeatureAvailable || "No"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isFeatureAvailable: e.target.value,
                }))
              }
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">24hr Availability</label>
            <select
              className="form-select"
              value={formData?.within24HrAvailable || "No"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  within24HrAvailable: e.target.value,
                }))
              }
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        <div className="row">
          <VendorAvailabilityCalendar />
        </div>

        <button className="btn btn-primary mt-2" onClick={handleSaveAndShow}>
          Save Availability Details
        </button>
      </div>
    </div>
  );
};

export default VendorAvailability;
