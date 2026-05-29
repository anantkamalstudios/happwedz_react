import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import useAirportSearch from "../../../../../hooks/useAirportSearch";
import { buildTripJackSearchQuery } from "../../../../../utils/flightSearchUtils";
import "../tripjack-styles.css";
import { MdFlightLand, MdFlightTakeoff } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosSwap } from "react-icons/io";
import PreferredAirline from "./PreferredAirline";
import FareTypeFilter from "./FareTypeFilter";
import AdditionalFilters from "./AdditionalFilters";

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

  const [multiCityLegs, setMultiCityLegs] = useState([
    { from: "", fromCode: "", to: "", toCode: "", date: "" },
    { from: "", fromCode: "", to: "", toCode: "", date: "" },
  ]);

  const fromSearch = useAirportSearch(350);
  const toSearch = useAirportSearch(350);
  const legFromSearches = [useAirportSearch(350), useAirportSearch(350), useAirportSearch(350), useAirportSearch(350), useAirportSearch(350)];
  const legToSearches = [useAirportSearch(350), useAirportSearch(350), useAirportSearch(350), useAirportSearch(350), useAirportSearch(350)];
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");

  const parseDateValue = (dateStr) => (dateStr ? new Date(dateStr) : null);
  const formatDateValue = (dateObj) => (dateObj ? dateObj.toISOString().split("T")[0] : "");

  const updateMultiCityLeg = (index, field, value) => {
    const updated = [...multiCityLegs];
    updated[index][field] = value;
    setMultiCityLegs(updated);
  };
  const addMultiCityLeg = () => {
    if (multiCityLegs.length < 5) setMultiCityLegs([...multiCityLegs, { from: "", fromCode: "", to: "", toCode: "", date: "" }]);
  };
  const removeMultiCityLeg = (index) => {
    if (multiCityLegs.length > 2) setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index));
  };
  const selectMultiCityAirport = (index, type, airport) => {
    const updated = [...multiCityLegs];
    if (type === "from") {
      updated[index].fromCode = airport.iata;
      updated[index].from = `${airport.city} (${airport.iata})`;
      legFromSearches[index].setQuery(updated[index].from);
      legFromSearches[index].setSuggestions([]);
    } else {
      updated[index].toCode = airport.iata;
      updated[index].to = `${airport.city} (${airport.iata})`;
      legToSearches[index].setQuery(updated[index].to);
      legToSearches[index].setSuggestions([]);
    }
    setMultiCityLegs(updated);
  };

  const handleMultiCitySearch = async () => {
    const validLegs = multiCityLegs.filter((l) => l.fromCode && l.toCode && l.date);
    if (validLegs.length < 2) {
      alert("Please fill at least 2 legs with origin, destination and date");
      return;
    }

    const isAscending = validLegs.every((leg, idx) => {
      if (idx === 0) return true;
      return new Date(leg.date).getTime() >= new Date(validLegs[idx - 1].date).getTime();
    });
    if (!isAscending) {
      alert("Travel dates must be in ascending order. Next date cannot be earlier than previous leg.");
      return;
    }
    const searchQuery = {
      searchQuery: {
        cabinClass: cabinClass.toUpperCase(),
        paxInfo: { ADULT: adults, CHILD: children, INFANT: 0 },
        routeInfos: validLegs.map((leg) => ({
          fromCityOrAirport: { code: leg.fromCode },
          toCityOrAirport: { code: leg.toCode },
          travelDate: leg.date,
        })),
        searchModifiers: { isDirectFlight: false, isConnectingFlight: true },
      },
    };
    setLoading(true);
    try {
      const { searchFlights } = await import("../../../../../services/api/flightApi");
      const result = await searchFlights(searchQuery.searchQuery);
      navigate("/honeymoon/flights/multicity", {
        state: {
          searchParams: { tripType: "multicity", adults, children, cabinClass, legs: validLegs },
          searchQuery: searchQuery.searchQuery,
          initialResults: { direct: null, connecting: result },
        },
      });
    } catch (err) {
      console.error(err);
      alert("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFlights = async () => {
    if (tripType === "multicity") return handleMultiCitySearch();
    const from = fromCode || fromSearch.query;
    const to = toCode || toSearch.query;
    if (!from || !to || !departureDate) return alert("Please fill in all required fields");
    if (tripType === "round" && !returnDate) return alert("Please select return date for round trip");

    const searchQuery = buildTripJackSearchQuery({ from, to, departureDate, returnDate, adults, children, infants: 0, cabinClass, tripType, paxType });
    const searchParams = { from, to, departureDate, returnDate, adults, children, cabinClass, tripType, paxType, preferredAirline, directFlight, creditShell };

    setLoading(true);
    try {
      const { searchFlights } = await import("../../../../../services/api/flightApi");
      const directQuery = { ...searchQuery, searchModifiers: { isDirectFlight: true, isConnectingFlight: false } };
      const connectingQuery = { ...searchQuery, searchModifiers: { isDirectFlight: false, isConnectingFlight: true } };
      const [d, c] = await Promise.allSettled([searchFlights(directQuery), searchFlights(connectingQuery)]);
      navigate("/honeymoon/flights", { state: { searchParams, initialResults: { direct: d.status === "fulfilled" ? d.value : null, connecting: c.status === "fulfilled" ? c.value : null } } });
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
        <div className={`tj-trip-tab ${tripType === "oneway" ? "active" : ""}`} onClick={() => setTripType("oneway")}>ONE WAY</div>
        <div className={`tj-trip-tab ${tripType === "round" ? "active" : ""}`} onClick={() => setTripType("round")}>ROUND TRIP</div>
        <div className={`tj-trip-tab ${tripType === "multicity" ? "active" : ""}`} onClick={() => setTripType("multicity")}>MULTI CITY</div>
      </div>

      <div className="tj-search-card">
        {tripType === "multicity" ? (
          <div className="tj-multicity-wrapper">
            {multiCityLegs.map((leg, index) => (
              <div key={index} className="tj-multicity-row">
                <div className="tj-search-row">
                  <div className="tj-field-group tj-from-field">
                    <MdFlightTakeoff className="tj-field-icon" size={18} />
                    <div className="tj-field-content">
                      <div className="tj-field-label">From</div>
                      <input className="tj-field-input" placeholder="Where from?" value={legFromSearches[index].query} onChange={(e) => { legFromSearches[index].setQuery(e.target.value); updateMultiCityLeg(index, "fromCode", ""); updateMultiCityLeg(index, "from", e.target.value); }} onBlur={() => setTimeout(() => legFromSearches[index].setSuggestions([]), 300)} />
                      <div className="tj-field-sublabel">{leg.fromCode || "City / Airport"}</div>
                    </div>
                    {legFromSearches[index].suggestions.length > 0 && <div className="tj-suggestions-dropdown">{legFromSearches[index].suggestions.map((loc, idx) => <div key={idx} className="tj-suggestion-item" onMouseDown={(e) => e.preventDefault()} onClick={() => selectMultiCityAirport(index, "from", loc)}><div className="tj-suggestion-main"><span className="tj-suggestion-iata">{loc.iata}</span><span className="tj-suggestion-name">{loc.name}</span></div><div className="tj-suggestion-city">{loc.city}, {loc.country}</div></div>)}</div>}
                  </div>

                  <div className="tj-swap-btn me-2" onClick={() => {
                    const fromText = legFromSearches[index].query;
                    const toText = legToSearches[index].query;
                    const fromIata = multiCityLegs[index].fromCode;
                    const toIata = multiCityLegs[index].toCode;
                    legFromSearches[index].setQuery(toText);
                    legToSearches[index].setQuery(fromText);
                    updateMultiCityLeg(index, "from", toText);
                    updateMultiCityLeg(index, "to", fromText);
                    updateMultiCityLeg(index, "fromCode", toIata);
                    updateMultiCityLeg(index, "toCode", fromIata);
                  }}><IoIosSwap /></div>

                  <div className="tj-field-group tj-to-field">
                    <MdFlightLand className="tj-field-icon" size={18} />
                    <div className="tj-field-content">
                      <div className="tj-field-label">To</div>
                      <input className="tj-field-input" placeholder="Where to?" value={legToSearches[index].query} onChange={(e) => { legToSearches[index].setQuery(e.target.value); updateMultiCityLeg(index, "toCode", ""); updateMultiCityLeg(index, "to", e.target.value); }} onBlur={() => setTimeout(() => legToSearches[index].setSuggestions([]), 300)} />
                      <div className="tj-field-sublabel">{leg.toCode || "City / Airport"}</div>
                    </div>
                    {legToSearches[index].suggestions.length > 0 && <div className="tj-suggestions-dropdown">{legToSearches[index].suggestions.map((loc, idx) => <div key={idx} className="tj-suggestion-item" onMouseDown={(e) => e.preventDefault()} onClick={() => selectMultiCityAirport(index, "to", loc)}><div className="tj-suggestion-main"><span className="tj-suggestion-iata">{loc.iata}</span><span className="tj-suggestion-name">{loc.name}</span></div><div className="tj-suggestion-city">{loc.city}, {loc.country}</div></div>)}</div>}
                  </div>

                  <div className="tj-field-group tj-date-field">
                    <Calendar className="tj-field-icon" size={18} />
                    <div className="tj-field-content">
                      <div className="tj-field-label">Depart</div>
                      <DatePicker
                        selected={parseDateValue(leg.date)}
                        onChange={(date) => updateMultiCityLeg(index, "date", formatDateValue(date))}
                        className="tj-field-input tj-date-picker"
                        dateFormat="dd-MM-yyyy"
                        minDate={
                          index > 0 && multiCityLegs[index - 1]?.date
                            ? parseDateValue(multiCityLegs[index - 1].date)
                            : new Date()
                        }
                        placeholderText="dd-mm-yyyy"
                      />
                      <div className="tj-field-sublabel">Travel Date</div>
                    </div>
                  </div>

                  {index === 0 && (
                    <>
                      <div className="tj-field-group tj-pax-field" onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}>
                        <Users className="tj-field-icon" size={18} />
                        <div className="tj-field-content">
                          <div className="tj-field-label">Passengers & Class</div>
                          <div className="tj-field-input">{adults + children} Passenger{adults + children > 1 ? "s" : ""}</div>
                          <div className="tj-field-sublabel">{cabinClass}</div>
                        </div>
                        {showTravelersDropdown && (
                          <div className="tj-travelers-dropdown" onClick={(e) => e.stopPropagation()}>
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
                          </div>
                        )}
                      </div>
                      <button className="tj-search-btn" onClick={handleSearchFlights} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
                    </>
                  )}
                </div>

                {/* Add/Remove Buttons - Outside search row but inside map */}
                {index === 1 && multiCityLegs.length < 5 && (
                  <div className="mt-3 text-center">
                    <button className="tj-add-route-btn border mb-2" type="button" onClick={addMultiCityLeg}>
                      + ADD ANOTHER CITY
                    </button>
                  </div>
                )}
                {index > 1 && (
                  <div className="mt-3 text-center">
                    <button className="tj-remove-route-btn" type="button" onClick={() => removeMultiCityLeg(index)}>
                      REMOVE
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="tj-search-row">
            <div className="tj-field-group tj-from-field">
              <MdFlightTakeoff className="tj-field-icon" size={18} />
              <div className="tj-field-content">
                <div className="tj-field-label">From</div>
                <input className="tj-field-input" placeholder="Where from?" value={fromSearch.query} onChange={(e) => { fromSearch.setQuery(e.target.value); setFromCode(""); }} onBlur={() => setTimeout(() => fromSearch.setSuggestions([]), 300)} />
                <div className="tj-field-sublabel">{fromCode || "City / Airport"}</div>
              </div>
              {fromSearch.suggestions.length > 0 && <div className="tj-suggestions-dropdown">{fromSearch.suggestions.map((loc, idx) => <div key={idx} className="tj-suggestion-item" onMouseDown={(e) => e.preventDefault()} onClick={() => { setFromCode(loc.iata); fromSearch.setQuery(`${loc.city} (${loc.iata})`); fromSearch.setSuggestions([]); }}><div className="tj-suggestion-main"><span className="tj-suggestion-iata">{loc.iata}</span><span className="tj-suggestion-name">{loc.name}</span></div><div className="tj-suggestion-city">{loc.city}, {loc.country}</div></div>)}</div>}
            </div>

            <div className="tj-swap-btn me-2" onClick={() => { const a = fromCode; const b = toCode; const qa = fromSearch.query; const qb = toSearch.query; setFromCode(b); setToCode(a); fromSearch.setQuery(qb); toSearch.setQuery(qa); }}><IoIosSwap /></div> 
            <div className="tj-field-group tj-to-field">
              <MdFlightLand className="tj-field-icon" size={18} />
              <div className="tj-field-content">
                <div className="tj-field-label">To</div>
                <input className="tj-field-input" placeholder="Where to?" value={toSearch.query} onChange={(e) => { toSearch.setQuery(e.target.value); setToCode(""); }} onBlur={() => setTimeout(() => toSearch.setSuggestions([]), 300)} />
                <div className="tj-field-sublabel">{toCode || "City / Airport"}</div>
              </div>
              {toSearch.suggestions.length > 0 && <div className="tj-suggestions-dropdown">{toSearch.suggestions.map((loc, idx) => <div key={idx} className="tj-suggestion-item" onMouseDown={(e) => e.preventDefault()} onClick={() => { setToCode(loc.iata); toSearch.setQuery(`${loc.city} (${loc.iata})`); toSearch.setSuggestions([]); }}><div className="tj-suggestion-main"><span className="tj-suggestion-iata">{loc.iata}</span><span className="tj-suggestion-name">{loc.name}</span></div><div className="tj-suggestion-city">{loc.city}, {loc.country}</div></div>)}</div>}
            </div>

            <div className="tj-field-group tj-date-field">
              <Calendar className="tj-field-icon" size={18} />
              <div className="tj-field-content">
                <div className="tj-field-label">Departure</div>
                <DatePicker selected={parseDateValue(departureDate)} onChange={(date) => setDepartureDate(formatDateValue(date))} className="tj-field-input tj-date-picker" dateFormat="dd-MM-yyyy" minDate={new Date()} placeholderText="dd-mm-yyyy" />
                <div className="tj-field-sublabel">Depart</div>
              </div>
            </div>

            {tripType === "round" && (
              <div className="tj-field-group tj-date-field">
                <Calendar className="tj-field-icon" size={18} />
                <div className="tj-field-content">
                  <div className="tj-field-label">Return</div>
                  <DatePicker selected={parseDateValue(returnDate)} onChange={(date) => setReturnDate(formatDateValue(date))} className="tj-field-input tj-date-picker" dateFormat="dd-MM-yyyy" minDate={parseDateValue(departureDate) || new Date()} placeholderText="dd-mm-yyyy" />
                  <div className="tj-field-sublabel">Return</div>
                </div>
              </div>
            )}

            <div className="tj-field-group tj-pax-field" onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}>
              <Users className="tj-field-icon" size={18} />
              <div className="tj-field-content">
                <div className="tj-field-label">Passengers & Class</div>
                <div className="tj-field-input">{adults + children} Passenger{adults + children > 1 ? "s" : ""}</div>
                <div className="tj-field-sublabel">{cabinClass}</div>
              </div>
              {showTravelersDropdown && (
                <div className="tj-travelers-dropdown">
                  <div className="tj-traveler-row"><span>Adults</span><div className="tj-counter"><button onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}>-</button><span>{adults}</span><button onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }}>+</button></div></div>
                  <div className="tj-traveler-row"><span>Children</span><div className="tj-counter"><button onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}>-</button><span>{children}</span><button onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}>+</button></div></div>
                </div>
              )}
            </div>
            <button className="tj-search-btn" onClick={handleSearchFlights} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          </div>
        )}

        <div className="tj-options-row">
          <PreferredAirline 
            value={preferredAirline} 
            onChange={setPreferredAirline} 
          />
          
          <FareTypeFilter 
            value={paxType} 
            onChange={setPaxType} 
          />
          
          <AdditionalFilters 
            directFlight={directFlight}
            creditShell={creditShell}
            onDirectFlightChange={setDirectFlight}
            onCreditShellChange={setCreditShell}
          />
        </div>
      </div>
    </div>
  );
}
