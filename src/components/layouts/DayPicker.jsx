import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function EventDatePicker({ formData, setFormData }) {
  return (
    <div className="mb-3">
      <label className="form-label">Event Date *</label>
      <DatePicker
        selected={formData.eventDate}
        onChange={(date) => setFormData({ ...formData, eventDate: date })}
        minDate={new Date()}
        dateFormat="dd/MM/yyyy"
        className="form-control"
      />
    </div>
  );
}

export default EventDatePicker;
