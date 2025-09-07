import React, { useState } from "react";

const VendorFacilities = () => {
  const [formData, setFormData] = useState({
    capacity: { min: "", max: "" },
    rooms: "",
    carParking: "",
    hallTypes: [],
    indoorOutdoor: "",
    alcoholPolicy: "",
    djPolicy: "",
    cateringPolicy: "",
    decoPolicy: "",
    servicesOffered: [],
    features: [],
    cuisines: [],
    specialties: [],
    equipment: [],
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
        <h6 className="mb-3 fw-bold">Facilities & Features</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Minimum Capacity</label>
            <input
              type="number"
              className="form-control"
              value={formData.capacity.min}
              onChange={(e) =>
                handleNestedInputChange("capacity", "min", e.target.value)
              }
              placeholder="Minimum capacity"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Maximum Capacity</label>
            <input
              type="number"
              className="form-control"
              value={formData.capacity.max}
              onChange={(e) =>
                handleNestedInputChange("capacity", "max", e.target.value)
              }
              placeholder="Maximum capacity"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Number of Rooms</label>
            <input
              type="number"
              className="form-control"
              value={formData.rooms}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rooms: e.target.value }))
              }
              placeholder="Number of rooms"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Car Parking</label>
            <input
              type="text"
              className="form-control"
              value={formData.carParking}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, carParking: e.target.value }))
              }
              placeholder="Car parking details"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Indoor/Outdoor</label>
            <select
              className="form-select"
              value={formData.indoorOutdoor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  indoorOutdoor: e.target.value,
                }))
              }
            >
              <option value="">Select</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Alcohol Policy</label>
            <select
              className="form-select"
              value={formData.alcoholPolicy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  alcoholPolicy: e.target.value,
                }))
              }
            >
              <option value="">Select</option>
              <option value="allowed">Allowed</option>
              <option value="not_allowed">Not Allowed</option>
              <option value="own_alcohol">Own Alcohol</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-2">
          Save Facilities Details
        </button>
      </div>
    </div>
  );
};

export default VendorFacilities;
