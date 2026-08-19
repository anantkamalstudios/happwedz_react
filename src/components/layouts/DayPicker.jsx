import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import dayjs from "dayjs";

function CustomDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const dayFormatted = day.format("YYYY-MM-DD");
  const isAvailable =
    !outsideCurrentMonth &&
    Array.isArray(highlightedDays) &&
    highlightedDays.includes(dayFormatted);

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isAvailable ? "✨" : undefined}
      sx={{
        "& .MuiBadge-badge": {
          fontSize: "10px",
          top: 6,
          right: 6,
        },
      }}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={
          isAvailable
            ? {
                backgroundColor: "#e6fffa !important",
                color: "#0d9488 !important",
                fontWeight: "bold",
                border: "1.5px solid #14b8a6 !important",
                "&:hover": {
                  backgroundColor: "#ccfbf1 !important",
                },
              }
            : {}
        }
      />
    </Badge>
  );
}

function EventDatePicker({ formData, setFormData, availableSlots = [] }) {
  // Normalize slots into an array of "YYYY-MM-DD" strings
  const normalizedSlots = Array.isArray(availableSlots)
    ? availableSlots
        .map((s) => {
          if (!s) return null;
          if (typeof s === "string") return s;
          if (s.date) return String(s.date).split("T")[0];
          return null;
        })
        .filter(Boolean)
    : [];

  const selectedDateStr = formData.eventDate
    ? dayjs(formData.eventDate).format("YYYY-MM-DD")
    : null;

  const isSelectedAvailable =
    selectedDateStr && normalizedSlots.includes(selectedDateStr);

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label mb-0 fw-semibold">Event Date *</label>
        {normalizedSlots.length > 0 && (
          <span
            className="badge rounded-pill px-2 py-1"
            style={{
              backgroundColor: "#d1fae5",
              color: "#065f46",
              border: "1px solid #a7f3d0",
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            ✨ {normalizedSlots.length} Available Slots
          </span>
        )}
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={formData.eventDate ? dayjs(formData.eventDate) : null}
          format="DD/MM/YYYY"
          onChange={(newDate) =>
            setFormData({
              ...formData,
              eventDate: newDate ? newDate.toDate() : null,
            })
          }
          minDate={dayjs()}
          slots={{
            day: CustomDay,
          }}
          slotProps={{
            day: {
              highlightedDays: normalizedSlots,
            },
            textField: {
              fullWidth: true,
              variant: "outlined",
              size: "small",
            },
          }}
        />
      </LocalizationProvider>

      {/* Available Slots Quick Picker Chips */}
      {normalizedSlots.length > 0 && (
        <div
          className="mt-2 p-2 rounded-3 border"
          style={{
            backgroundColor: "#f0fdf4",
            borderColor: "#bbf7d0",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between mb-1"
            style={{ fontSize: "11.5px", color: "#166534" }}
          >
            <span className="fw-bold">🟢 Available Dates (Click to select):</span>
          </div>
          <div
            className="d-flex flex-wrap gap-1"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          >
            {normalizedSlots.map((dateStr) => {
              const d = dayjs(dateStr);
              const isSelected = selectedDateStr === dateStr;
              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      eventDate: d.toDate(),
                    })
                  }
                  className={`btn btn-sm px-2 py-1 rounded-pill ${
                    isSelected
                      ? "btn-success text-white fw-bold shadow-sm"
                      : "btn-outline-success bg-white text-success"
                  }`}
                  style={{
                    fontSize: "11px",
                    borderColor: isSelected ? "#15803d" : "#86efac",
                    transition: "all 0.15s ease",
                  }}
                >
                  📅 {d.format("DD MMM YYYY")} {isSelected ? "✓" : ""}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Status feedback */}
      {formData.eventDate && (
        <div className="mt-1" style={{ fontSize: "11.5px" }}>
          {isSelectedAvailable ? (
            <span className="text-success fw-semibold">
              ✅ Selected date is confirmed available for this vendor/venue!
            </span>
          ) : (
            <span className="text-muted">
              ℹ️ Custom date selected — availability will be verified with the vendor.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default EventDatePicker;
