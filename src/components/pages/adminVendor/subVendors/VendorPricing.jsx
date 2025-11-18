// import React from "react";

// const VendorPricing = ({ formData, setFormData, onSave, onShowSuccess }) => {
//   const priceRange = formData.priceRange || { min: "", max: "" };

//   const handleNestedInputChange = (subSection, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [subSection]: {
//         ...(prev[subSection] || {}),
//         [field]: value,
//       },
//     }));
//   };

//   const handleSave = async () => {
//     if (onSave) await onSave();
//     if (onShowSuccess) onShowSuccess();
//   };

//   return (
//     <div className="my-5">
//       <div className="p-3 border rounded bg-white">
//         <h6 className="mb-3 fw-bold">Pricing & Packages</h6>
//         <div className="row">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Starting Price</label>
//             <input
//               type="number"
//               className="form-control"
//               value={formData.startingPrice || ""}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   startingPrice: e.target.value,
//                 }))
//               }
//               placeholder="Enter starting price"
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Price Unit</label>
//             <select
//               className="form-select"
//               value={formData.priceUnit || ""}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, priceUnit: e.target.value }))
//               }
//             >
//               <option value="per_person">Per Person</option>
//               <option value="per_event">Per Event</option>
//               <option value="per_hour">Per Hour</option>
//               <option value="per_day">Per Day</option>
//               <option value="fixed">Fixed Price</option>
//             </select>
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Currency</label>
//             <select
//               className="form-select"
//               value={formData.currency || ""}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, currency: e.target.value }))
//               }
//             >
//               <option value="INR">INR</option>
//               <option value="USD">USD</option>
//               <option value="EUR">EUR</option>
//             </select>
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Price Range Min</label>
//             <input
//               type="number"
//               className="form-control"
//               value={priceRange.min}
//               onChange={(e) =>
//                 handleNestedInputChange("priceRange", "min", e.target.value)
//               }
//               placeholder="Minimum price"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Price Range Max</label>
//             <input
//               type="number"
//               className="form-control"
//               value={priceRange.max}
//               onChange={(e) =>
//                 handleNestedInputChange("priceRange", "max", e.target.value)
//               }
//               placeholder="Maximum price"
//             />
//           </div>
//         </div>
//         <button className="btn btn-primary mt-2" onClick={handleSave}>
//           Save Pricing Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VendorPricing;

import React from "react";

const VendorPricing = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
  onSubmit,
}) => {
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
        <h6 className="mb-3 fw-bold">Pricing & Packages</h6>
        <div className="row">
          {/* Starting Price */}
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

          {/* Price Unit */}
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

          {/* Currency */}
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

          {/* Price Range */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Price Range</label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                value={formData.priceRange?.min || ""}
                onChange={(e) =>
                  handleNestedInputChange("priceRange", "min", e.target.value)
                }
                placeholder="Min"
              />
              <span className="d-flex align-items-center">-</span>
              <input
                type="number"
                className="form-control"
                value={formData.priceRange?.max || ""}
                onChange={(e) =>
                  handleNestedInputChange("priceRange", "max", e.target.value)
                }
                placeholder="Max"
              />
            </div>
          </div>

          {/* Photo Package Price */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Photo Package Price
            </label>
            <input
              type="number"
              className="form-control"
              value={formData.photo_package_price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  photo_package_price: e.target.value,
                }))
              }
              placeholder="e.g. 24000"
            />
          </div>

          {/* Photo + Video Package Price */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Photo + Video Package Price
            </label>
            <input
              type="number"
              className="form-control"
              value={formData.photo_video_package_price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  photo_video_package_price: e.target.value,
                }))
              }
              placeholder="e.g. 40000"
            />
          </div>

          {/* Veg Price (for Venues) */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Veg Price Per Plate (for Venues)
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.veg_price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  veg_price: e.target.value,
                }))
              }
              placeholder="e.g. 600"
            />
          </div>
          */}

          {/* Non-Veg Price (for Venues) */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Non-Veg Price Per Plate (for Venues)
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.non_veg_price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  non_veg_price: e.target.value,
                }))
              }
              placeholder="e.g. 800"
            />
          </div> */}

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

          {/* Offerings (for Photographers/Other Vendors) */}
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
        </div>

        <div style={{ display: "flex", gap: "5px", width: "50%" }}>
          <button className="btn btn-primary mt-2" onClick={handleSave}>
            Save Pricing Details
          </button>
          <button className="btn btn-primary mt-2" onClick={onSubmit}>
            Submit All Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorPricing;
