

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

    useEffect(() => {
    const slots =
      formData?.attributes?.availableSlots ||
      formData?.attributes?.available_slots ||
      [];
    const next = Array.isArray(slots) ? slots.map((s) => s.date) : [];
    setAvailableDates(next);
  }, [formData?.attributes?.availableSlots, formData?.attributes?.available_slots]);


  // Sync selected dates to formData.availableSlots automatically
  useEffect(() => {
    setFormData((prev) => {
      const next = availableDates.map((d) => ({ date: d }));
      const prevDates = Array.isArray(prev?.availableSlots)
        ? prev.availableSlots.map((s) => s.date)
        : [];
      const a = new Set(prevDates);
      const b = new Set(availableDates);
      let equal = a.size === b.size;
      if (equal) {
        for (const v of a) if (!b.has(v)) { equal = false; break; }
      }
      if (equal) return prev; // no change
      return { ...prev, availableSlots: next };
    });
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
