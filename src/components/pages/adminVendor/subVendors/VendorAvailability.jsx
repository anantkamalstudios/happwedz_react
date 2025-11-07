// import React, { useState } from "react";
// import VendorAvailabilityCalendar from "./VendorAvailabilityCalendar";

// const VendorAvailability = ({
//   formData,
//   setFormData,
//   onSave,
//   onShowSuccess,
// }) => {
//   const [availableDates, setAvailableDates] = useState(
//     (formData?.available_slots || []).map((item) => item.date)
//   );

//   const handleNestedInputChange = (subSection, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [subSection]: {
//         ...((prev && prev[subSection]) || {}),
//         [field]: value,
//       },
//     }));
//   };

//   // Handler to save and show success modal
//   const handleSaveAndShow = async () => {
//     const available_slots = availableDates.map((d) => ({ date: d, slots: [] }));
//     setFormData((prev) => ({ ...prev, available_slots }));

//     setTimeout(async () => {
//       if (onSave) {
//         await onSave();
//       }
//       if (onShowSuccess) {
//         onShowSuccess();
//       }
//     }, 0);
//   };

//   return (
//     <div className="my-5">
//       <div className="p-3 border rounded bg-white">
//         <h6 className="mb-3 fw-bold">Availability & Slots</h6>
//         <div className="row">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Opening Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.open || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "open", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Closing Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.close || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "close", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Last Entry Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.lastEntry || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "lastEntry", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Feature Available</label>
//             <select
//               className="form-select"
//               value={formData?.isFeatureAvailable || "No"}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   isFeatureAvailable: e.target.value,
//                 }))
//               }
//             >
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">24hr Availability</label>
//             <select
//               className="form-select"
//               value={formData?.within24HrAvailable || "No"}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   within24HrAvailable: e.target.value,
//                 }))
//               }
//             >
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>
//         </div>
//         <div className="row">
//           <VendorAvailabilityCalendar
//             initialAvailableDates={availableDates}
//             onAvailabilityChange={setAvailableDates}
//           />
//         </div>

//         <button className="btn btn-primary mt-2" onClick={handleSaveAndShow}>
//           Save Availability Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VendorAvailability;

// import React, { useState } from "react";
// import VendorAvailabilityCalendar from "./VendorAvailabilityCalendar";

// const VendorAvailability = ({
//   formData,
//   setFormData,
//   onSave,
//   onShowSuccess,
// }) => {
//   const [availableDates, setAvailableDates] = useState(
//     (formData?.available_slots || []).map((item) => item.date)
//   );

//   const handleNestedInputChange = (subSection, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [subSection]: {
//         ...((prev && prev[subSection]) || {}),
//         [field]: value,
//       },
//     }));
//   };

//   const handleSaveAndShow = async () => {
//     const available_slots = availableDates.map((d) => ({
//       date: d,
//       slots: [],
//     }));

//     setFormData((prev) => ({ ...prev, available_slots }));

//     setTimeout(async () => {
//       if (onSave) await onSave();
//       if (onShowSuccess) onShowSuccess();
//     }, 0);
//   };

//   return (
//     <div className="my-5">
//       <div className="p-3 border rounded bg-white">
//         <h6 className="mb-3 fw-bold">Availability & Slots</h6>

//         <div className="row">
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Opening Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.open || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "open", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Closing Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.close || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "close", e.target.value)
//               }
//             />
//           </div>
//           <div className="col-md-4 mb-3">
//             <label className="form-label fw-semibold">Last Entry Time</label>
//             <input
//               type="time"
//               className="form-control"
//               value={formData?.timing?.lastEntry || ""}
//               onChange={(e) =>
//                 handleNestedInputChange("timing", "lastEntry", e.target.value)
//               }
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Feature Available</label>
//             <select
//               className="form-select"
//               value={formData?.isFeatureAvailable || "No"}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   isFeatureAvailable: e.target.value,
//                 }))
//               }
//             >
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>

//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">24hr Availability</label>
//             <select
//               className="form-select"
//               value={formData?.within24HrAvailable || "No"}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   within24HrAvailable: e.target.value,
//                 }))
//               }
//             >
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="row">
//           <VendorAvailabilityCalendar
//             initialAvailableDates={availableDates}
//             onAvailabilityChange={setAvailableDates}
//           />
//         </div>

//         <button className="btn btn-primary mt-2" onClick={handleSaveAndShow}>
//           Save Availability Details
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VendorAvailability;

import React, { useState, useEffect } from "react";
import VendorAvailabilityCalendar from "./VendorAvailabilityCalendar";

const VendorAvailability = ({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
}) => {
  const [availableDates, setAvailableDates] = useState(
    (
      formData?.attributes?.availableSlots ||
      formData?.attributes?.available_slots ||
      []
    ).map((item) => item.date)
  );

  // Sync selected dates to formData.availableSlots automatically
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: availableDates.map((d) => ({
        date: d,
        // slots: [],
      })),
    }));
  }, [availableDates, setFormData]);

  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subSection]: {
        ...((prev && prev[subSection]) || {}),
        [field]: value,
      },
    }));
  };

  // Manual save button handler (optional)
  const handleSaveAndShow = async () => {
    if (onSave) await onSave();
    if (onShowSuccess) onShowSuccess();
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Availability & Slots</h6>

        {/* <div className="row">
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
        </div> */}

        {/* Calendar Section */}
        <div className="row">
          <VendorAvailabilityCalendar
            initialAvailableDates={availableDates}
            onAvailabilityChange={setAvailableDates}
          />
        </div>

        <button className="btn btn-primary mt-2" onClick={handleSaveAndShow}>
          Save Availability Details
        </button>
      </div>
    </div>
  );
};

export default VendorAvailability;
