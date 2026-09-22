import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { formatDate, rupees, todayIso } from "./crmFormat";
import { Spinner } from "./crmUi";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPE_LABELS = { event: "Event", follow_up: "Follow-up", payment_due: "Payment due" };

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// The Monday-to-Sunday weeks covering a month.
const monthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - ((first.getDay() + 6) % 7));
  const last = new Date(year, month + 1, 0);
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - ((last.getDay() + 6) % 7)));
  const days = [];
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) days.push(new Date(d));
  return { days, from: iso(start), to: iso(end) };
};

const itemText = (item) =>
  item.type === "event" ? `${item.title} · ${item.clientName}` : item.type === "payment_due" ? `${rupees(item.amountPaise)} due · ${item.clientName}` : `Follow up · ${item.clientName}`;

/**
 * Month calendar of client events, follow-ups and payment due dates.
 * Phones get a list of the month's items under a compact grid.
 */
const CalendarView = ({ onOpenClient }) => {
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null); // ISO date picked on the grid

  const grid = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);
  const today = todayIso();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await crmApi.calendar(grid.from, grid.to);
      setItems(res.items || []);
    } catch (err) {
      setError(errorMessage(err, "Could not load the calendar."));
    } finally {
      setLoading(false);
    }
  }, [grid.from, grid.to]);

  useEffect(() => {
    load();
  }, [load]);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const item of items) {
      if (!map.has(item.date)) map.set(item.date, []);
      map.get(item.date).push(item);
    }
    return map;
  }, [items]);

  const move = (delta) => {
    setSelected(null);
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const monthPrefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;
  const listItems = items.filter((i) => (selected ? i.date === selected : i.date.startsWith(monthPrefix)));

  return (
    <div className="crm-card">
      <div className="crm-cal-head">
        <div className="crm-actions">
          <button className="crm-icon-btn" onClick={() => move(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
          <button className="crm-icon-btn" onClick={() => move(1)} aria-label="Next month"><ChevronRight size={16} /></button>
          <h2 className="crm-cal-title">{monthLabel}</h2>
          {loading && items.length > 0 && <span className="crm-muted crm-small">Loading…</span>}
        </div>
        <div className="crm-actions">
          <span className="crm-cal-key"><i className="crm-cal-dot is-event" /> Event</span>
          <span className="crm-cal-key"><i className="crm-cal-dot is-follow_up" /> Follow-up</span>
          <span className="crm-cal-key"><i className="crm-cal-dot is-payment_due" /> Payment due</span>
          <button className="crm-btn crm-btn-sm" onClick={() => { setSelected(null); setCursor({ year: now.getFullYear(), month: now.getMonth() }); }}>
            Today
          </button>
        </div>
      </div>

      {error ? (
        <div className="crm-empty">
          <h3>{error}</h3>
          <button className="crm-btn" onClick={load}>Try again</button>
        </div>
      ) : loading && !items.length ? (
        <Spinner />
      ) : (
        <>
          <div className="crm-cal-grid">
            {WEEKDAYS.map((d) => (
              <div key={d} className="crm-cal-weekday">{d}</div>
            ))}
            {grid.days.map((day) => {
              const key = iso(day);
              const dayItems = byDate.get(key) || [];
              const outside = day.getMonth() !== cursor.month;
              return (
                <div
                  key={key}
                  className={`crm-cal-day${outside ? " is-outside" : ""}${key === today ? " is-today" : ""}${key === selected ? " is-selected" : ""}`}
                  onClick={() => setSelected(key === selected ? null : key)}
                >
                  <div className="crm-cal-date">{day.getDate()}</div>
                  <div className="crm-cal-items">
                    {dayItems.slice(0, 3).map((item, index) => (
                      <button
                        key={index}
                        className={`crm-cal-item is-${item.type}`}
                        title={`${TYPE_LABELS[item.type]}: ${itemText(item)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenClient(item.clientId);
                        }}
                      >
                        {itemText(item)}
                      </button>
                    ))}
                    {dayItems.length > 3 && <div className="crm-cal-more">+{dayItems.length - 3} more</div>}
                  </div>
                  <div className="crm-cal-dots">
                    {dayItems.slice(0, 4).map((item, index) => (
                      <i key={index} className={`crm-cal-dot is-${item.type}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="crm-cal-list">
            <div className="crm-section-label" style={{ padding: "0 16px" }}>
              <span>{selected ? formatDate(selected) : `All of ${monthLabel}`}</span>
              {selected && <button className="crm-link" onClick={() => setSelected(null)}>Show whole month</button>}
            </div>
            {listItems.length === 0 ? (
              <div className="crm-muted crm-small" style={{ padding: "0 16px 16px" }}>Nothing scheduled.</div>
            ) : (
              listItems.map((item, index) => (
                <button key={index} className="crm-cal-row" onClick={() => onOpenClient(item.clientId)}>
                  <i className={`crm-cal-dot is-${item.type}`} />
                  <span className="crm-cal-row-date">{formatDate(item.date)}</span>
                  <span className="crm-cal-row-text">
                    <strong>{item.type === "event" ? item.title : TYPE_LABELS[item.type]}</strong> · {item.clientName}
                    {item.type === "event" && item.venue ? ` · ${item.venue}` : ""}
                    {item.type === "payment_due" ? ` · ${rupees(item.amountPaise)}` : ""}
                    {item.type === "follow_up" && item.note ? ` · ${item.note}` : ""}
                  </span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarView;
