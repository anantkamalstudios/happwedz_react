// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24, docs/partner-api-gbp-contract.md §6.5).
// The new profile's opening hours, the shape GrowthOS takes when it creates a profile: the open days and one
// opening and closing time for them, or no hours at all (GrowthOS's profileFormSchema: with_hours, days, open, close).
import React, { useId } from "react";
import { WEEKDAYS } from "./gpFormat";

/**
 * `value` = { with_hours, days, open, close }; `onChange(patch)`; `errors` = { days, open, close }.
 * `idBase` names the boxes (`<idBase>-open`, `<idBase>-close`, `<idBase>-days-group`) so the form can move to them.
 */
export default function SetupHours({ idBase, value, onChange, errors = {}, disabled }) {
  const ownId = useId();
  const ids = idBase || ownId;
  const toggleDay = (day) =>
    onChange({ days: value.days.includes(day) ? value.days.filter((d) => d !== day) : [...value.days, day] });

  const timeField = (field, label) => {
    const inputId = `${ids}-${field}`;
    const error = errors[field];
    return (
      <div className="gp-field">
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          type="time"
          className="gp-input"
          value={value[field]}
          onChange={(e) => onChange({ [field]: e.target.value })}
          disabled={disabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {error && (
          <small id={`${inputId}-error`} className="gp-field-error">
            {error}
          </small>
        )}
      </div>
    );
  };

  return (
    <fieldset className="gp-fieldset gp-setup-wide">
      <legend className="gp-legend">
        Opening hours <span className="gp-setup-optional">(optional)</span>
      </legend>
      <label className="gp-consent gp-setup-check" htmlFor={`${ids}-with`}>
        <input
          type="checkbox"
          id={`${ids}-with`}
          checked={value.with_hours}
          onChange={(e) => onChange({ with_hours: e.target.checked })}
          disabled={disabled}
        />
        <span>Add opening hours</span>
      </label>
      {value.with_hours && (
        <>
          <div className="gp-field">
            <span id={`${ids}-days`}>Open days</span>
            <div
              className="gp-days"
              id={`${ids}-days-group`}
              role="group"
              aria-labelledby={`${ids}-days`}
              aria-describedby={errors.days ? `${ids}-days-error` : undefined}
            >
              {WEEKDAYS.map((day) => {
                const open = value.days.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={`gp-day gp-setup-day ${open ? "is-open" : ""}`}
                    aria-pressed={open}
                    aria-label={day.long}
                    onClick={() => toggleDay(day.id)}
                    disabled={disabled}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
            {errors.days ? (
              <small id={`${ids}-days-error`} className="gp-field-error">
                {errors.days}
              </small>
            ) : (
              <small className="gp-note gp-field-help">Tap the days you are open.</small>
            )}
          </div>
          <div className="gp-times">
            {timeField("open", "Opens")}
            {timeField("close", "Closes")}
          </div>
          <small className="gp-note gp-field-help">
            Different hours on some days? Add them later in the Profile tab, after Google verifies the profile.
          </small>
        </>
      )}
    </fieldset>
  );
}
