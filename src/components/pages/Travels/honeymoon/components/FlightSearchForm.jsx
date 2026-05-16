import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin } from "lucide-react";
import useAirportSearch from "../../../../../hooks/useAirportSearch";
import { buildTripJackSearchQuery } from "../../../../../utils/flightSearchUtils";
import LocationInput from "./LocationInput";
import DateSelector from "./DateSelector";
import TravellerSelector from "./TravellerSelector";
import SearchButton from "./SearchButton";

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

  const fromSearch = useAirportSearch(350);
  const toSearch = useAirportSearch(350);

  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const swapCities = () => {
    const prevFrom = fromCode;
    const prevTo = toCode;
    setFromCode(prevTo);
    setToCode(prevFrom);
    fromSearch.setQuery(prevTo);
    toSearch.setQuery(prevFrom);
  };

  const selectFromAirport = (airport) => {
    setFromCode(airport.iata);
    fromSearch.setQuery(airport.iata);
    setShowFromSuggestions(false);
  };

  const selectToAirport = (airport) => {
    setToCode(airport.iata);
    toSearch.setQuery(airport.iata);
    setShowToSuggestions(false);
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

    // Build proper TripJack searchQuery
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

    // Store search params for display purposes only
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
    };

    setLoading(true);
    try {
      const { searchFlights } = await import(
        "../../../../../services/api/flightApi"
      );
      
      const directQuery = {
        ...searchQuery,
        searchModifiers: { isDirectFlight: true, isConnectingFlight: false },
      };
      
      const connectingQuery = {
        ...searchQuery,
        searchModifiers: { isDirectFlight: false, isConnectingFlight: true },
      };
      
      console.log("Direct Query:", JSON.stringify(directQuery, null, 2));
      console.log("Connecting Query:", JSON.stringify(connectingQuery, null, 2));
      
      const [d, c] = await Promise.allSettled([
        searchFlights(directQuery),
        searchFlights(connectingQuery),
      ]);
      
      const initialResults = {
        direct: d.status === "fulfilled" ? d.value : null,
        connecting: c.status === "fulfilled" ? c.value : null,
      };

      navigate("/honeymoon/flights", {
        state: { searchParams, searchQuery, initialResults },
      });
    } catch (err) {
      console.error("Error searching flights:", err);
      alert("Error searching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-card">
      <div className="trip-options">
        <div className="trip-radio">
          {[
            ["round", "Round-trip"],
            ["oneway", "One-way"],
          ].map(([val, label]) => (
            <label key={val}>
              <input
                type="radio"
                name="trip"
                value={val}
                checked={tripType === val}
                onChange={() => setTripType(val)}
              />
              {label}
            </label>
          ))}
        </div>

        <div className="pax-type-selector">
          <label className="pax-type-label">Passenger Type:</label>
          <select
            className="pax-type-select"
            value={paxType}
            onChange={(e) => setPaxType(e.target.value)}
          >
            <option value="REGULAR">Regular</option>
            <option value="STUDENT">Student</option>
            <option value="SENIOR_CITIZEN">Senior Citizen</option>
          </select>
        </div>
      </div>

      <div className="search-fields">
        <LocationInput
          label="Departure"
          icon={Plane}
          placeholder="Enter departure city or airport"
          value={fromSearch.query}
          onChange={(e) => {
            fromSearch.setQuery(e.target.value);
            setFromCode("");
            setShowFromSuggestions(true);
          }}
          onSelect={selectFromAirport}
          suggestions={fromSearch.suggestions}
          loading={fromSearch.loading}
          showSuggestions={showFromSuggestions}
          onFocus={() => {
            if (fromSearch.query.length >= 2 && fromSearch.suggestions.length > 0) {
              setShowFromSuggestions(true);
            }
          }}
          onBlur={() => setShowFromSuggestions(false)}
        />

        <div className="swap-btn-wrap">
          <button className="swap-btn" onClick={swapCities} title="Swap cities">
            ⇄
          </button>
        </div>

        <LocationInput
          label="Destination"
          icon={MapPin}
          placeholder="Enter destination city or airport"
          value={toSearch.query}
          onChange={(e) => {
            toSearch.setQuery(e.target.value);
            setToCode("");
            setShowToSuggestions(true);
          }}
          onSelect={selectToAirport}
          suggestions={toSearch.suggestions}
          loading={toSearch.loading}
          showSuggestions={showToSuggestions}
          onFocus={() => {
            if (toSearch.query.length >= 2 && toSearch.suggestions.length > 0) {
              setShowToSuggestions(true);
            }
          }}
          onBlur={() => setShowToSuggestions(false)}
        />

        <DateSelector
          label="Departure"
          placeholder="Select departure date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />

        {tripType === "round" && (
          <DateSelector
            label="Return"
            placeholder="Select return date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate}
          />
        )}

        <TravellerSelector
          adults={adults}
          children={children}
          cabinClass={cabinClass}
          showDropdown={showTravelersDropdown}
          onToggleDropdown={setShowTravelersDropdown}
          onAdultsChange={setAdults}
          onChildrenChange={setChildren}
        />

        <SearchButton loading={loading} onClick={handleSearchFlights} type="flight" />
      </div>
    </div>
  );
}
