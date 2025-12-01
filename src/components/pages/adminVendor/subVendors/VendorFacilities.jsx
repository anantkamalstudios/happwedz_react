import React from "react";

const VendorFacilities = ({ formData, setFormData, onSave, onShowSuccess }) => {
  const capacity = formData.capacity || { min: "", max: "" };

  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subSection]: {
        ...(prev[subSection] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (onSave) await onSave();
    if (onShowSuccess) onShowSuccess();
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Facilities & Features</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Number of Rooms</label>
            <input
              type="number"
              className="form-control"
              value={formData.rooms || ""}
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
              value={formData.parking || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, parking: e.target.value }))
              }
              placeholder="Car parking details"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Indoor/Outdoor</label>
            <select
              className="form-select"
              value={formData.indoorOutdoor || ""}
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
              value={formData.alcoholPolicy || ""}
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
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Catering Policy</label>
            <input
              type="text"
              className="form-control"
              value={formData.cateringPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cateringPolicy: e.target.value,
                }))
              }
              placeholder="e.g. Allowed, Not Allowed, Own Catering"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Decor Policy</label>
            <input
              type="text"
              className="form-control"
              value={formData.decorPolicy || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  decorPolicy: e.target.value,
                }))
              }
              placeholder="e.g. Allowed, Not Allowed"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Offerings (comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.offerings || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  offerings: e.target.value,
                }))
              }
              placeholder="e.g. Wedding, Pre-Wedding, Portrait"
            />
          </div>

          {/* Delivery Time (for Photographers/Other Vendors) */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Delivery Time (for Photographers)
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.delivery_time || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  delivery_time: e.target.value,
                }))
              }
              placeholder="e.g. 2-3 weeks"
            />
          </div>
          {/* Travel Info */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Travel Info</label>
            <input
              type="text"
              className="form-control"
              value={formData.travel_info || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  travel_info: e.target.value,
                }))
              }
              placeholder="e.g. Travel within city, All over India"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">HappyWedz Since</label>
            <input
              type="text"
              className="form-control"
              value={formData.happywedz_since || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  happywedz_since: e.target.value,
                }))
              }
              placeholder="e.g. 2020"
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Area / Capacity Details (e.g., Lawn 200 Seating | 50 Floating)
            </label>
            <textarea
              className="form-control"
              rows="3"
              value={formData.area || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  area: e.target.value,
                }))
              }
              placeholder="e.g. Lawn 200 Seating | 50 Floating, Indoor 100 Seating | 20 Floating"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" onClick={handleSave}>
          Save Facilities Details
        </button>
      </div>
    </div>
  );
};

export default VendorFacilities;
