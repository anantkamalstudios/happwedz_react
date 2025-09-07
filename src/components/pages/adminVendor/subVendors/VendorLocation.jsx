import React, { useState } from "react";

const VendorLocation = () => {
  const [formData, setFormData] = useState({
    location: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      lat: "",
      lng: "",
      landmark: "",
      serviceAreas: [],
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Location & Service Areas</h6>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Address Line 1 *</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.addressLine1}
              onChange={(e) =>
                handleInputChange("addressLine1", e.target.value)
              }
              placeholder="Enter address line 1"
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Address Line 2</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.addressLine2}
              onChange={(e) =>
                handleInputChange("addressLine2", e.target.value)
              }
              placeholder="Enter address line 2"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">City *</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter city"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">State *</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="Enter state"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Pincode *</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.pincode}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              placeholder="Enter pincode"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Landmark</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.landmark}
              onChange={(e) => handleInputChange("landmark", e.target.value)}
              placeholder="Enter nearby landmark"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Country</label>
            <input
              type="text"
              className="form-control"
              value={formData.location.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Enter country"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Latitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={formData.location.lat}
              onChange={(e) => handleInputChange("lat", e.target.value)}
              placeholder="Enter latitude"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Longitude</label>
            <input
              type="number"
              step="any"
              className="form-control"
              value={formData.location.lng}
              onChange={(e) => handleInputChange("lng", e.target.value)}
              placeholder="Enter longitude"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2">Save Location Details</button>
      </div>
    </div>
  );
};

export default VendorLocation;
