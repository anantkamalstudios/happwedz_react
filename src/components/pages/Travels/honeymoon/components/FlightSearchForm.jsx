import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import useAirportSearch from "../../../../../hooks/useAirportSearch";
import { buildTripJackSearchQuery } from "../../../../../utils/flightSearchUtils";
import "../tripjack-styles.css";
import { MdFlightLand, MdFlightTakeoff } from "react-icons/md";

export default function FlightSearchForm() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [paxType, setPaxType] = useState("REGULAR");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferredAirline, setPreferredAirline] = useState("");
  const [directFlight, setDirectFlight] = useState(false);
  const [creditShell, setCreditShell] = useState(false);

  const fromSearch = useAirportSearch(350);
  const toSearch = useAirportSearch(350);

  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");

  const swapCities = () => {
    const prevFrom = fromCode;
    const prevTo = toCode;
    const prevFromQuery = fromSearch.query;
    const prevToQuery = toSearch.query;
    
    setFromCode(prevTo);
    setToCode(prevFrom);
    fromSearch.setQuery(prevToQuery);
    toSearch.setQuery(prevFromQuery);
  };

  const selectFromAirport = (airport) => {
    setFromCode(airport.iata);
    fromSearch.setQuery(`${airport.city} (${airport.iata})`);
    fromSearch.setSuggestions([]);
  };

  const selectToAirport = (airport) => {
    setToCode(airport.iata);
    toSearch.setQuery(`${airport.city} (${airport.iata})`);
    toSearch.setSuggestions([]);
  };

  const handleSearchFlights = async () => {
    const from = fromCode || fromSearch.query;
    const to = toCode || toSearch.query;

    if (!from || !to || !departureDate) {
      alert("Please fill in all required fields");
      return;
    }
    if (tripType === "round" && !returnDate) {
      alert("Please select return date for round trip");
      return;
    }

    const searchQuery = buildTripJackSearchQuery({
      from,
      to,
      departureDate,
      returnDate,
      adults,
      children,
      infants: 0,
      cabinClass,
      tripType,
      paxType,
    });

    const searchParams = {
      from,
      to,
      departureDate,
      returnDate,
      adults,
      children,
      cabinClass,
      tripType,
      paxType,
      preferredAirline,
      directFlight,
      creditShell,
    };

    setLoading(true);
    try {
      const { searchFlights } = await import("../../../../../services/api/flightApi");
      
      const directQuery = {
        ...searchQuery,
        searchModifiers: { isDirectFlight: true, isConnectingFlight: false },
      };
      
      const connectingQuery = {
        ...searchQuery,
        searchModifiers: { isDirectFlight: false, isConnectingFlight: true },
      };
      
      const [d, c] = await Promise.allSettled([
        searchFlights(directQuery),
        searchFlights(connectingQuery),
      ]);
      
      const initialResults = {
        direct: d.status === "fulfilled" ? d.value : null,
        connecting: c.status === "fulfilled" ? c.value : null,
      };

      navigate("/honeymoon/flights", {
        state: { searchParams, initialResults },
      });
    } catch (err) {
      console.error("Error searching flights:", err);
      alert("Error searching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tj-flight-search-wrapper">
      <div className="tj-trip-type-tabs">
        <div
          className={`tj-trip-tab ${tripType === "oneway" ? "active" : ""}`}
          onClick={() => setTripType("oneway")}
        >
          ONE WAY
        </div>
        <div
          className={`tj-trip-tab ${tripType === "round" ? "active" : ""}`}
          onClick={() => setTripType("round")}
        >
          ROUND TRIP
        </div>
        <div className="tj-trip-tab">MULTI CITY</div>
      </div>

      <div className="tj-search-card">
        <div className="tj-search-row">
          <div className="tj-field-group tj-from-field">
            <MdFlightTakeoff className="tj-field-icon" size={20} />
            <div className="tj-field-content">
              <input
                type="text"
                className="tj-field-input"
                placeholder="From"
                value={fromSearch.query}
                onChange={(e) => {
                  fromSearch.setQuery(e.target.value);
                  setFromCode("");
                }}
                onBlur={() => {
                  setTimeout(() => {
                    fromSearch.setSuggestions([]);
                  }, 200);
                }}
              />
              <div className="tj-field-sublabel">{fromCode || "City or Airport"}</div>
            </div>
            {fromSearch.suggestions.length > 0 && (
              <div className="tj-suggestions-dropdown">
                {fromSearch.suggestions.map((loc, idx) => (
                  <div
                    key={idx}
                    className="tj-suggestion-item"
                    onClick={() => selectFromAirport(loc)}
                  >
                    <div className="tj-suggestion-main">
                      <span className="tj-suggestion-iata">{loc.iata}</span>
                      <span className="tj-suggestion-name">{loc.name}</span>
                    </div>
                    <div className="tj-suggestion-city">
                      {loc.city}, {loc.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tj-swap-btn" onClick={swapCities}>
            ⇄
          </div>

          <div className="tj-field-group tj-to-field">
            <MdFlightLand className="tj-field-icon" size={20} />
            <div className="tj-field-content">
              <input
                type="text"
                className="tj-field-input"
                placeholder="To"
                value={toSearch.query}
                onChange={(e) => {
                  toSearch.setQuery(e.target.value);
                  setToCode("");
                }}
                onBlur={() => {
                  setTimeout(() => {
                    toSearch.setSuggestions([]);
                  }, 200);
                }}
              />
              <div className="tj-field-sublabel">{toCode || "City or Airport"}</div>
            </div>
            {toSearch.suggestions.length > 0 && (
              <div className="tj-suggestions-dropdown">
                {toSearch.suggestions.map((loc, idx) => (
                  <div
                    key={idx}
                    className="tj-suggestion-item"
                    onClick={() => selectToAirport(loc)}
                  >
                    <div className="tj-suggestion-main">
                      <span className="tj-suggestion-iata">{loc.iata}</span>
                      <span className="tj-suggestion-name">{loc.name}</span>
                    </div>
                    <div className="tj-suggestion-city">
                      {loc.city}, {loc.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tj-field-group tj-date-field">
            <Calendar className="tj-field-icon" size={20} />
            <div className="tj-field-content">
              <input
                type="date"
                className="tj-field-input"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <div className="tj-field-sublabel">Departure</div>
            </div>
          </div>

          {tripType === "round" && (
            <div className="tj-field-group tj-date-field">
              <Calendar className="tj-field-icon" size={20} />
              <div className="tj-field-content">
                <input
                  type="date"
                  className="tj-field-input"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate}
                />
                <div className="tj-field-sublabel">Return</div>
              </div>
            </div>
          )}

          <div className="tj-field-group tj-pax-field" onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}>
            <Users className="tj-field-icon" size={20} />
            <div className="tj-field-content">
              <div className="tj-field-input">{adults + children} Passenger{adults + children > 1 ? 's' : ''}</div>
              <div className="tj-field-sublabel">{cabinClass}</div>
            </div>
            {showTravelersDropdown && (
              <div className="tj-travelers-dropdown">
                <div className="tj-traveler-row">
                  <span>Adults</span>
                  <div className="tj-counter">
                    <button onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}>-</button>
                    <span>{adults}</span>
                    <button onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }}>+</button>
                  </div>
                </div>
                <div className="tj-traveler-row">
                  <span>Children</span>
                  <div className="tj-counter">
                    <button onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}>-</button>
                    <span>{children}</span>
                    <button onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}>+</button>
                  </div>
                </div>
                <div className="tj-class-selector">
                  <select value={cabinClass} onChange={(e) => { e.stopPropagation(); setCabinClass(e.target.value); }}>
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <button className="tj-search-btn" onClick={handleSearchFlights} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="tj-options-row">
          <div className="tj-option-group">
            <select
              className="tj-airline-select"
              value={preferredAirline}
              onChange={(e) => setPreferredAirline(e.target.value)}
            >
              <option value="">Select Preferred Airline</option>
              <option value="6E">IndiGo</option>
              <option value="AI">Air India</option>
              <option value="SG">SpiceJet</option>
              <option value="UK">Vistara</option>
            </select>
          </div>

          <div className="tj-option-group">
            <span className="tj-option-label">Select Fare Type:</span>
            <label className="tj-checkbox-label">
              <input
                type="checkbox"
                checked={paxType === "REGULAR"}
                onChange={() => setPaxType("REGULAR")}
              />
              Regular
            </label>
            <label className="tj-checkbox-label">
              <input
                type="checkbox"
                checked={paxType === "STUDENT"}
                onChange={() => setPaxType("STUDENT")}
              />
              Student
            </label>
            <label className="tj-checkbox-label">
              <input
                type="checkbox"
                checked={paxType === "SENIOR_CITIZEN"}
                onChange={() => setPaxType("SENIOR_CITIZEN")}
              />
              Senior Citizen
            </label>
          </div>

          <div className="tj-option-group">
            <label className="tj-checkbox-label">
              <input
                type="checkbox"
                checked={directFlight}
                onChange={(e) => setDirectFlight(e.target.checked)}
              />
              Direct Flight
            </label>
            <label className="tj-checkbox-label">
              <input
                type="checkbox"
                checked={creditShell}
                onChange={(e) => setCreditShell(e.target.checked)}
              />
              Credit Shell
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
