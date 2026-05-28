import "./Filters.css";

export default function AdditionalFilters({ directFlight, creditShell, onDirectFlightChange, onCreditShellChange }) {
  return (
    <div className="filter-group filter-group-additional">
      <label className="filter-label filter-label-placeholder">Options</label>
      <div className="filter-checkbox-group filter-checkbox-group-additional">
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            className="filter-checkbox"
            checked={directFlight}
            onChange={(e) => onDirectFlightChange(e.target.checked)}
          />
          <span className="filter-checkbox-text">Direct Flight</span>
        </label>
        <label className="filter-checkbox-label">
          <input
            type="checkbox"
            className="filter-checkbox"
            checked={creditShell}
            onChange={(e) => onCreditShellChange(e.target.checked)}
          />
          <span className="filter-checkbox-text">Credit Shell</span>
        </label>
      </div>
    </div>
  );
}
