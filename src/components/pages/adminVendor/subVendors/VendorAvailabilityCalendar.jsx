

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Calendar, Check, X, Clock } from "lucide-react";

// Helper to get all days from current month to December
const getMonthsDays = (initialAvailableDates = []) => {
  const today = dayjs();
  const months = [];

  for (let month = today.month(); month <= 11; month++) {
    const monthStart = today.month(month).startOf("month");
    const daysInMonth = monthStart.daysInMonth();
    const firstDayOfWeek = monthStart.day();
    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(new Date(today.year(), month, day));
      const isToday = date.isSame(dayjs(), "day");
      const isPast = date.isBefore(dayjs(), "day");
      const isInitiallyAvailable = initialAvailableDates.includes(
        date.format("YYYY-MM-DD")
      );

      days.push({
        date: date,
        available: !isPast && isInitiallyAvailable,
        isToday: isToday,
        isPast: isPast,
        dayNumber: day,
      });
    }

    months.push({
      month,
      days,
      monthName: monthStart.format("MMMM YYYY"),
      shortName: monthStart.format("MMM"),
    });
  }

  return months;
};

const VendorAvailabilityCalendar = ({
  initialAvailableDates = [],
  onAvailabilityChange,
}) => {
  const [monthsDays, setMonthsDays] = useState(() =>
    getMonthsDays(initialAvailableDates)
  );
  const [stats, setStats] = useState({
    available: 0,
    unavailable: 0,
    total: 0,
  });

  // Calculate summary stats
  useEffect(() => {
    let available = 0;
    let unavailable = 0;
    let total = 0;

    monthsDays.forEach((monthData) => {
      monthData.days.forEach((day) => {
        if (day && !day.isPast) {
          total++;
          if (day.available) available++;
          else unavailable++;
        }
      });
    });

    setStats({ available, unavailable, total });
  }, [monthsDays]);

  // Notify parent whenever monthsDays change
  useEffect(() => {
    const selectedDates = [];
    monthsDays.forEach((m) =>
      m.days.forEach((d) => {
        if (d && !d.isPast && d.available)
          selectedDates.push(d.date.format("YYYY-MM-DD"));
      })
    );
    if (onAvailabilityChange) onAvailabilityChange(selectedDates);
  }, [monthsDays, onAvailabilityChange]);

  useEffect(() => {
    // Build a set of currently selected dates from monthsDays
    const current = new Set();
    monthsDays.forEach((m) =>
      m.days.forEach((d) => {
        if (d && !d.isPast && d.available)
          current.add(d.date.format("YYYY-MM-DD"));
      })
    );
    const next = new Set(initialAvailableDates || []);
    // If equal, skip rebuilding to prevent loops
    if (current.size === next.size) {
      let equal = true;
      current.forEach((v) => {
        if (!next.has(v)) equal = false;
      });
      if (equal) return;
    }
    setMonthsDays(getMonthsDays(initialAvailableDates));
  }, [initialAvailableDates, monthsDays]);


  // Toggle single date
  const toggleAvailability = (monthIndex, dayIndex) => {
    const day = monthsDays[monthIndex].days[dayIndex];
    if (!day || day.isPast) return;

    const updated = [...monthsDays];
    updated[monthIndex].days[dayIndex].available =
      !updated[monthIndex].days[dayIndex].available;
    setMonthsDays(updated);
  };

  // Toggle entire month
  const setMonthAvailability = (monthIndex, available) => {
    const updated = [...monthsDays];
    updated[monthIndex].days = updated[monthIndex].days.map((day) =>
      day && !day.isPast ? { ...day, available } : day
    );
    setMonthsDays(updated);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="container-fluid py-4 vendor-available-calendar">
      {/* Header with Statistics */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
            <div className="mb-3 mb-md-0">
              <h2 className="h3 mb-1 d-flex align-items-center">
                <Calendar className="me-2 text-primary" size={28} />
                Availability Calendar
              </h2>
              <p className="text-muted mb-0">
                Manage your availability for upcoming months
              </p>
            </div>

            {/* Stats Cards */}
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="calender-stat-card available-card fs-6 px-3 py-2">
                  <Check size={16} className="me-1" />
                  {stats.available}
                </div>
                <small className="d-block text-muted mt-1">Available</small>
              </div>
              <div className="text-center">
                <div className="calender-stat-card unavailable-card fs-6 px-3 py-2">
                  <X size={16} className="me-1" />
                  {stats.unavailable}
                </div>
                <small className="d-block text-muted mt-1">Unavailable</small>
              </div>
              <div className="text-center">
                <div className="calender-stat-card total-card fs-6 px-3 py-2">
                  <Clock size={16} className="me-1" />
                  {stats.total}
                </div>
                <small className="d-block text-muted mt-1">Total Days</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="row g-4">
        {monthsDays.map((monthData, monthIndex) => (
          <div key={monthData.month} className="col-12 col-md-6 col-xl-4">
            <div className="card h-100 shadow-sm border-0">
              {/* Month Header */}
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{monthData.monthName}</h5>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-outline-light dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Actions
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setMonthAvailability(monthIndex, true)}
                      >
                        <Check size={16} className="me-2" />
                        Mark All Available
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setMonthAvailability(monthIndex, false)}
                      >
                        <X size={16} className="me-2" />
                        Mark All Unavailable
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Month Days */}
              <div className="card-body p-3">
                {/* Weekdays header */}
                <div className="row g-1 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="col">
                      <div className="text-center py-2">
                        <small className="fw-bold text-muted">{day}</small>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="calendar-grid">
                  {Array.from(
                    { length: Math.ceil(monthData.days.length / 7) },
                    (_, weekIndex) => (
                      <div key={weekIndex} className="row g-1 mb-1">
                        {monthData.days
                          .slice(weekIndex * 7, (weekIndex + 1) * 7)
                          .map((day, dayIndex) => {
                            const actualDayIndex = weekIndex * 7 + dayIndex;
                            return (
                              <div key={dayIndex} className="col">
                                {day ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleAvailability(
                                        monthIndex,
                                        actualDayIndex
                                      )
                                    }
                                    disabled={day.isPast}
                                    className={`btn w-100 p-2 border-0 position-relative ${
                                      day.isPast
                                        ? "btn-light text-muted"
                                        : day.available
                                        ? "btn-success"
                                        : "btn-danger"
                                    } ${day.isToday ? "ring-today" : ""}`}
                                    style={{
                                      minHeight: "40px",
                                      fontSize: "0.875rem",
                                      cursor: day.isPast
                                        ? "not-allowed"
                                        : "pointer",
                                    }}
                                  >
                                    {day.dayNumber}
                                  </button>
                                ) : (
                                  <div style={{ minHeight: "40px" }}></div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorAvailabilityCalendar;
