import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const VendorFacilities = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
  vendorTypeName: propVendorTypeName,
  isVenue: propIsVenue,
}) => {
  const { vendor } = useSelector((state) => state.vendorAuth || {});
  const [fetchedVendorTypeName, setFetchedVendorTypeName] = useState("");

  useEffect(() => {
    const fetchVendorType = async () => {
      if (vendor?.vendor_type_id) {
        try {
          const response = await axios.get(
            `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`
          );
          setFetchedVendorTypeName(response.data?.name || "");
        } catch (err) {
          console.error("Error fetching vendor type:", err);
        }
      }
    };
    fetchVendorType();
  }, [vendor?.vendor_type_id]);

  const finalVendorTypeName = propVendorTypeName || fetchedVendorTypeName;
  const normalizedType = (finalVendorTypeName || "").toLowerCase();
  const isVenue =
    propIsVenue ||
    normalizedType.includes("venue") ||
    normalizedType.includes("marriage garden") ||
    normalizedType.includes("banquet") ||
    normalizedType.includes("resort") ||
    normalizedType.includes("hotel") ||
    normalizedType.includes("lawn") ||
    normalizedType.includes("palace") ||
    normalizedType.includes("fort");

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
          {isVenue && (
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
          )}
          {isVenue && (
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
          )}

          {isVenue && (
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Outside Alcohol</label>
              <input
                type="text"
                className="form-control"
                value={formData.outside_alcohol || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    outside_alcohol: e.target.value,
                  }))
                }
                placeholder="e.g. Allowed, Not Allowed, Own Alcohol"
              />
            </div>
          )}

          {isVenue && (
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
          )}
          {isVenue && (
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
          )}
          {!isVenue && (
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
          )}

          {/* Delivery Time (for Photographers/Other Vendors) */}
          {!isVenue && (
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
          )}
          {/* Travel Info */}
          {!isVenue && (
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
          )}
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

          {isVenue && (
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Venue</label>
              <input
                type="text"
                className="form-control"
                value={formData.start_venue || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_venue: e.target.value,
                  }))
                }
                placeholder="Start Venue"
              />
            </div>
          )}

          {isVenue && (
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">DJ Policy</label>
              <input
                type="text"
                className="form-control"
                value={formData.dJ_policy || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dJ_policy: e.target.value,
                  }))
                }
                placeholder="DJ Policy"
              />
            </div>
          )}

          {isVenue && (
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Space</label>
              <input
                type="text"
                className="form-control"
                value={formData.space || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    space: e.target.value,
                  }))
                }
                placeholder="Space"
              />
            </div>
          )}

          {isVenue && (
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
          )}
        </div>
        <button className="btn btn-primary mt-2" onClick={handleSave}>
          Save Facilities Details
        </button>
      </div>
    </div>
  );
};

export default VendorFacilities;
