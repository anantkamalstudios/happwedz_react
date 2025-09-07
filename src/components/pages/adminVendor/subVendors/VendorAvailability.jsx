import React, { useState } from "react";

const VendorAvailability = () => {
  const [formData, setFormData] = useState({
    timing: { open: "", close: "", lastEntry: "" },
    blackoutDates: [],
    availableSlots: [{ date: "", timeFrom: "", timeTo: "" }],
    isFeatureAvailable: "No",
    within24HrAvailable: "No",
  });

  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subSection]: {
        ...prev[subSection],
        [field]: value,
      },
    }));
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
              value={formData.timing.open}
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
              value={formData.timing.close}
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
              value={formData.timing.lastEntry}
              onChange={(e) =>
                handleNestedInputChange("timing", "lastEntry", e.target.value)
              }
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Feature Available</label>
            <select
              className="form-select"
              value={formData.isFeatureAvailable}
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
              value={formData.within24HrAvailable}
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
        <button className="btn btn-primary mt-2">
          Save Availability Details
        </button>
      </div>
    </div>
  );
};

export default VendorAvailability;
