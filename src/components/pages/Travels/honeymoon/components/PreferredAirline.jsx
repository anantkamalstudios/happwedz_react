import { MdFlight } from "react-icons/md";
import "./Filters.css";

export default function PreferredAirline({ value, onChange }) {
  const airlines = [
    { code: "", name: "Select Airline" },
    { code: "6E", name: "IndiGo" },
    { code: "AI", name: "Air India" },
    { code: "UK", name: "Vistara" },
    { code: "SG", name: "SpiceJet" },
    { code: "G8", name: "Go First" },
    { code: "I5", name: "Air Asia India" },
  ];

  return (
    <div className="filter-group filter-group-airline">
      <label className="filter-label">Preferred Airline</label>
      <div className="filter-select-wrapper">
        <MdFlight className="filter-icon" />
        <select 
          className="filter-select" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          {airlines.map((airline) => (
            <option key={airline.code} value={airline.code}>
              {airline.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
