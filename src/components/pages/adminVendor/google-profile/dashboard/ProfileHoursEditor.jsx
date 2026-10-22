// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// The per-day opening hours editor of the Profile tab (opening hours and "more hours"): each weekday is closed, or open
// with one or more opening–closing ranges. Same shape as GrowthOS's weekSchema; "24:00" (midnight) shows as 00:00.
import { useId } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { WEEKDAYS } from "../gpFormat";

const blankRange = () => ({ open: "", close: "" });

/** `value` = { mon: [{ open, close }], … }; `errors` = { "<prefix>mon.0": message }. */
export default function ProfileHoursEditor({ legend, value, onChange, errors = {}, prefix = "" }) {
  const id = useId();
  const setDay = (day, ranges) => onChange({ ...value, [day]: ranges });

  return (
    <fieldset className="gp-fieldset gp-e-week">
      <legend className="gp-e-label">{legend}</legend>
      <p className="gp-note">Closing at 00:00 means open until midnight.</p>
      {WEEKDAYS.map((day) => {
        const ranges = value[day.id] || [];
        const open = ranges.length > 0;
        const checkId = `${id}-${day.id}`;
        return (
          <div key={day.id} className={`gp-e-day${open ? " is-open" : ""}`}>
            <div className="gp-e-day-head">
              <span className="gp-e-day-name">
                {day.long}
                {!open && <span className="gp-note"> · Closed</span>}
              </span>
              <label className="gp-e-check" htmlFor={checkId}>
                <input id={checkId} type="checkbox" checked={open} onChange={(e) => setDay(day.id, e.target.checked ? [blankRange()] : [])} />
                Open<span className="visually-hidden"> on {day.long}</span>
              </label>
            </div>
            {open && (
              <div className="gp-e-ranges">
                {ranges.map((range, i) => {
                  const error = errors[`${prefix}${day.id}.${i}`];
                  const errorId = `${checkId}-${i}-error`;
                  const update = (patch) => setDay(day.id, ranges.map((r, j) => (j === i ? { ...r, ...patch } : r)));
                  return (
                    <div key={i} className="gp-e-range">
                      <div className="gp-e-range-row">
                        <label className="gp-e-field">
                          <span className="gp-note">Opens</span>
                          <input
                            type="time"
                            className="gp-input"
                            value={range.open}
                            onChange={(e) => update({ open: e.target.value })}
                            aria-label={`${day.long} opens`}
                            aria-invalid={Boolean(error) || undefined}
                            aria-describedby={error ? errorId : undefined}
                          />
                        </label>
                        <label className="gp-e-field">
                          <span className="gp-note">Closes</span>
                          <input
                            type="time"
                            className="gp-input"
                            value={range.close === "24:00" ? "00:00" : range.close}
                            onChange={(e) => update({ close: e.target.value === "00:00" ? "24:00" : e.target.value })}
                            aria-label={`${day.long} closes`}
                            aria-invalid={Boolean(error) || undefined}
                            aria-describedby={error ? errorId : undefined}
                          />
                        </label>
                        <button
                          type="button"
                          className="gp-e-icon-btn"
                          onClick={() => setDay(day.id, ranges.filter((_, j) => j !== i))}
                          aria-label={`Remove these hours on ${day.long}`}
                        >
                          <FiTrash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                      {error && (
                        <span className="gp-e-error" id={errorId}>
                          {error}
                        </span>
                      )}
                    </div>
                  );
                })}
                <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={() => setDay(day.id, [...ranges, blankRange()])}>
                  <FiPlus size={16} aria-hidden="true" />
                  Add hours<span className="visually-hidden"> on {day.long}</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
