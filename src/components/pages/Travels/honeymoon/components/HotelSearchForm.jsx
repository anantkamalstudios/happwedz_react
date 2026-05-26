import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  ChevronDown,
  Loader2,
  Search,
  X,
} from "lucide-react";
import {
  fetchHotelCityRegions,
  fetchHotelCountries,
  fetchStaticHotelsSuggestions,
  searchHotels,
} from "../../../../../services/api/hotelApi";
import {
  createCorrelationId,
  defaultFilters,
} from "../../hotelbeds/hotelbedsDetailHelpers";

const HOTEL_COUNTRIES = [
  { code: "106", name: "India" },
  { code: "9", name: "Australia" },
  { code: "13", name: "Bahrain" },
  { code: "14", name: "Bangladesh" },
  { code: "18", name: "Belgium" },
  { code: "22", name: "Bolivia" },
  { code: "25", name: "Brazil" },
  { code: "33", name: "Canada" },
  { code: "39", name: "China" },
  { code: "43", name: "Croatia" },
  { code: "48", name: "Denmark" },
  { code: "52", name: "Ecuador" },
  { code: "53", name: "Egypt" },
  { code: "62", name: "France" },
  { code: "68", name: "Germany" },
  { code: "71", name: "Greece" },
  { code: "82", name: "Hong Kong" },
  { code: "88", name: "Ireland" },
  { code: "91", name: "Italy" },
  { code: "94", name: "Japan" },
  { code: "116", name: "Malaysia" },
  { code: "124", name: "Mexico" },
  { code: "134", name: "Nepal" },
  { code: "137", name: "New Zealand" },
  { code: "149", name: "Philippines" },
  { code: "150", name: "Poland" },
  { code: "151", name: "Portugal" },
  { code: "162", name: "Saudi Arabia" },
  { code: "167", name: "Singapore" },
  { code: "174", name: "Spain" },
  { code: "175", name: "Sri Lanka" },
  { code: "185", name: "Thailand" },
  { code: "188", name: "Tunisia" },
  { code: "194", name: "United Arab Emirates" },
  { code: "195", name: "United Kingdom" },
  { code: "196", name: "United States" },
  { code: "201", name: "Vietnam" },
];

const HOTEL_RATING_OPTIONS = [
  { value: "5", label: "5 Star" },
  { value: "4", label: "4 Star" },
  { value: "3", label: "3 Star" },
  { value: "2", label: "2 Star" },
  { value: "1", label: "1 Star" },
  { value: "0", label: "Unrated" },
];

const readSuggestionItems = (payload) => {
  const candidates = [
    payload,
    payload?.suggestions,
    payload?.data?.suggestions,
    payload?.data,
    payload?.items,
    payload?.results,
  ];
  const arrayMatch = candidates.find((value) => Array.isArray(value));
  if (Array.isArray(arrayMatch)) return arrayMatch;

  const objectToArray = (value) => {
    if (!value || Array.isArray(value) || typeof value !== "object") return [];
    return Object.values(value).filter(
      (item) =>
        item &&
        typeof item === "object" &&
        (item.displayName || item.name || item.searchRegionName),
    );
  };

  for (const candidate of candidates) {
    const extracted = objectToArray(candidate);
    if (extracted.length) return extracted;
  }

  return [];
};

const normalizeHotelSuggestion = (suggestion) => {
  if (!suggestion) return null;

  const rawSearchType =
    suggestion?.searchType ||
    suggestion?.searchRegionType ||
    suggestion?.regionType ||
    suggestion?.type ||
    "CITY";
  const normalizedSearchType = String(rawSearchType || "CITY").toUpperCase();

  const city =
    suggestion?.city ||
    suggestion?.cityId ||
    suggestion?.regionId ||
    suggestion?.searchRegionId ||
    (normalizedSearchType !== "HOTEL" ? suggestion?.id : "") ||
    "";

  const displayName =
    suggestion?.name ||
    suggestion?.displayName ||
    suggestion?.label ||
    suggestion?.searchRegionName ||
    suggestion?.cityName ||
    suggestion?.keyword ||
    "";

  const rawTjids =
    suggestion?.tjids ||
    suggestion?.hids ||
    suggestion?.hotelIds ||
    suggestion?.tjid ||
    suggestion?.tjHotelId ||
    suggestion?.hotelCode ||
    suggestion?.raw?.tjid ||
    suggestion?.raw?.tjHotelId ||
    suggestion?.raw?.hotelCode ||
    [];
  const tjids = Array.isArray(rawTjids)
    ? rawTjids.map((item) => String(item || "").trim()).filter(Boolean)
    : typeof rawTjids === "string"
      ? rawTjids
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : rawTjids
        ? [String(rawTjids).trim()].filter(Boolean)
        : [];
  const hid =
    suggestion?.hid ||
    suggestion?.hotelId ||
    suggestion?.hotelid ||
    suggestion?.tjid ||
    suggestion?.tjHotelId ||
    suggestion?.hotelCode ||
    suggestion?.raw?.tjid ||
    suggestion?.raw?.tjHotelId ||
    suggestion?.raw?.hotelCode ||
    "";
  const normalizedHid = String(hid || "").trim();
  const normalizedTjids = tjids.length ? tjids : normalizedHid ? [normalizedHid] : [];

  const subtitle =
    suggestion?.subtitle ||
    [suggestion?.stateName, suggestion?.countryName].filter(Boolean).join(", ");

  return {
    id: String(city || displayName || ""),
    city: String(city || ""),
    searchType: normalizedSearchType,
    searchRegionType: normalizedSearchType,
    searchRegionName: String(displayName || "").trim(),
    displayName: String(displayName || "").trim(),
    stateName: suggestion?.stateName || "",
    countryName:
      suggestion?.countryName ||
      suggestion?.country ||
      (subtitle ? String(subtitle).split(",").slice(-1)[0]?.trim() : ""),
    tjids: normalizedTjids,
    hid: normalizedHid,
    raw: suggestion,
  };
};

const getSuggestionBadge = (searchRegionType) => {
  const type = String(searchRegionType || "CITY").toUpperCase();
  if (type === "NEIGHBORHOOD") return "NBH";
  if (type === "POINT_OF_INTEREST") return "POI";
  if (type === "MULTI_CITY_VICINITY") return "MCV";
  return type.slice(0, 4);
};

const buildRoomInfoFromRooms = (rooms) =>
  rooms.map((room) => ({
    numberOfAdults: Math.max(1, Number(room?.adults) || 1),
    numberOfChild: Math.max(0, Number(room?.children) || 0),
    childAge: Array.from({ length: Math.max(0, Number(room?.children) || 0) }, () => 6),
  }));

const parseDateInput = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const calculateNights = (checkIn, checkOut) => {
  const start = parseDateInput(checkIn);
  const end = parseDateInput(checkOut);
  if (!start || !end) return 0;
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
  return diff > 0 ? diff : 0;
};

const toggleArrayValue = (currentValues, nextValue) =>
  currentValues.includes(nextValue)
    ? currentValues.filter((value) => value !== nextValue)
    : [...currentValues, nextValue];

function RatingDropdown({ selectedRatings, onToggle, onClose }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="hotel-search-popover hotel-rating-dropdown" ref={dropdownRef}>
      <div className="hotel-search-popover-header">
        <div className="hotel-search-popover-title">Select rating</div>
        <button type="button" className="hotel-search-popover-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="hotel-rating-dropdown-list">
        {HOTEL_RATING_OPTIONS.map((option) => (
          <label key={option.value} className="hotel-rating-option">
            <input
              type="checkbox"
              checked={selectedRatings.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CountryDropdown({ value, label, onChange, onClose, options = HOTEL_COUNTRIES }) {
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredCountries = options.filter((country) =>
    String(country.name || country.label || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="hotel-search-popover hotel-country-dropdown" ref={dropdownRef}>
      <div className="hotel-search-popover-header">
        <div className="hotel-search-popover-title">{label}</div>
        <button type="button" className="hotel-search-popover-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="hotel-country-search">
        <Search size={15} />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search country"
          autoFocus
        />
      </div>
      <div className="hotel-country-list">
        {filteredCountries.map((country) => (
          <button
            key={country.code || country.countryName}
            type="button"
            className={`hotel-country-item ${(country.code || country.countryName) === value ? "selected" : ""}`}
            onClick={() => {
              onChange(country.code || country.countryName);
              onClose?.();
            }}
          >
            <span>{country.name || country.label}</span>
            {(country.code || country.countryName) === value ? <span className="hotel-country-check">✓</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomsGuestsDropdown({ rooms, onApply, onClose }) {
  const [localRooms, setLocalRooms] = useState(rooms);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setLocalRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const updateRoom = (roomIndex, field, nextValue) => {
    setLocalRooms((prev) =>
      prev.map((room, index) =>
        index === roomIndex ? { ...room, [field]: nextValue } : room,
      ),
    );
  };

  const addRoom = () => {
    setLocalRooms((prev) =>
      prev.length >= 4 ? prev : [...prev, { adults: 1, children: 0 }],
    );
  };

  const removeRoom = (roomIndex) => {
    setLocalRooms((prev) => (prev.length === 1 ? prev : prev.filter((_, index) => index !== roomIndex)));
  };

  return (
    <div className="hotel-search-popover hotel-guests-dropdown" ref={dropdownRef}>
      <div className="hotel-search-popover-header">
        <div className="hotel-search-popover-title">Rooms & Guests</div>
        <button type="button" className="hotel-search-popover-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="hotel-guests-dropdown-body">
        {localRooms.map((room, roomIndex) => (
          <div key={`room-${roomIndex}`} className="hotel-room-card">
            <div className="hotel-room-card-head">
              <div className="hotel-room-card-title">Room {roomIndex + 1}</div>
              {localRooms.length > 1 ? (
                <button
                  type="button"
                  className="hotel-room-remove"
                  onClick={() => removeRoom(roomIndex)}
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="hotel-stepper-row">
              <div>
                <div className="hotel-stepper-title">Adults</div>
                <div className="hotel-stepper-copy">Ages 18+</div>
              </div>
              <div className="hotel-stepper-controls">
                <button
                  type="button"
                  onClick={() => updateRoom(roomIndex, "adults", Math.max(1, room.adults - 1))}
                  disabled={room.adults <= 1}
                >
                  -
                </button>
                <span>{room.adults}</span>
                <button
                  type="button"
                  onClick={() => updateRoom(roomIndex, "adults", Math.min(8, room.adults + 1))}
                  disabled={room.adults >= 8}
                >
                  +
                </button>
              </div>
            </div>

            <div className="hotel-stepper-row">
              <div>
                <div className="hotel-stepper-title">Children</div>
                <div className="hotel-stepper-copy">Ages 0-17</div>
              </div>
              <div className="hotel-stepper-controls">
                <button
                  type="button"
                  onClick={() => updateRoom(roomIndex, "children", Math.max(0, room.children - 1))}
                  disabled={room.children <= 0}
                >
                  -
                </button>
                <span>{room.children}</span>
                <button
                  type="button"
                  onClick={() => updateRoom(roomIndex, "children", Math.min(4, room.children + 1))}
                  disabled={room.children >= 4}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hotel-guests-dropdown-footer">
        <button
          type="button"
          className="hotel-guests-secondary-btn"
          onClick={addRoom}
          disabled={localRooms.length >= 4}
        >
          + Add room
        </button>
        <button
          type="button"
          className="hotel-guests-primary-btn"
          onClick={() => {
            onApply(localRooms);
            onClose?.();
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default function HotelSearchForm() {
  const navigate = useNavigate();
  const destinationRef = useRef(null);
  const suppressNextSuggestionFetchRef = useRef(false);
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [hotelSuggestLoading, setHotelSuggestLoading] = useState(false);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [countryOptions, setCountryOptions] = useState([{ code: "INDIA", name: "India" }]);
  const [selectedCountry, setSelectedCountry] = useState("INDIA");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelRooms, setHotelRooms] = useState([{ adults: 2, children: 0 }]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [nationality, setNationality] = useState("106");
  const [countryOfResidence, setCountryOfResidence] = useState("106");
  const [gstClaimEligible, setGstClaimEligible] = useState(false);
  const [showRatingsDropdown, setShowRatingsDropdown] = useState(false);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [showResidenceDropdown, setShowResidenceDropdown] = useState(false);
  const [showSearchCountryDropdown, setShowSearchCountryDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [hotelSearchLoading, setHotelSearchLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowHotelSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;
    const loadCountries = async () => {
      try {
        const response = await fetchHotelCountries();
        if (!active) return;
        const countries = Array.isArray(response?.countries) ? response.countries : [];
        if (!countries.length) return;
        const mapped = countries.map((item) => ({
          code: item?.countryName || item?.id,
          name: item?.label || item?.countryName || item?.id,
        }));
        setCountryOptions(mapped);
        setSelectedCountry("INDIA");
      } catch (error) {
        console.error("Unable to load TripJack country list", error);
      }
    };
    loadCountries();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const keyword = hotelLocation.trim();
    if (suppressNextSuggestionFetchRef.current) {
      suppressNextSuggestionFetchRef.current = false;
      setShowHotelSuggestions(false);
      setHotelSuggestLoading(false);
      return undefined;
    }
    if (keyword.length < 2) {
      setHotelSuggestions([]);
      setShowHotelSuggestions(false);
      setHotelSuggestLoading(false);
      return undefined;
    }

    let active = true;
    const abortController = new AbortController();
    const timer = window.setTimeout(async () => {
      setHotelSuggestLoading(true);
      try {
        const [destResponse, hotelResponse] = await Promise.all([
          fetchHotelCityRegions({ keyword, selectedCountry, limit: 80 }, { signal: abortController.signal }),
          fetchStaticHotelsSuggestions(
            { keyword, selectedCountry, limit: 30 },
            { signal: abortController.signal },
          ),
        ]);
        if (!active) return;

        const destinationSuggestions = readSuggestionItems(destResponse)
          .map(normalizeHotelSuggestion)
          .map((item) => ({ ...item, suggestionType: "destination" }))
          .filter((item) => item?.id && item?.displayName);
        const hotelSuggestionsRaw = readSuggestionItems(hotelResponse)
          .map(normalizeHotelSuggestion)
          .map((item) => ({
            ...item,
            id: String(item?.hid || item?.id || ""),
            hid: String(item?.hid || item?.id || ""),
            suggestionType: "hotel",
            searchType: "HOTEL",
            searchRegionType: "HOTEL",
          }))
          .filter((item) => item?.id && item?.displayName);

        const seenDest = new Set();
        const dedupDestinations = destinationSuggestions.filter((item) => {
          const key = `${item.id}|${item.searchRegionType}|${item.countryName}`;
          if (seenDest.has(key)) return false;
          seenDest.add(key);
          return true;
        });
        const seenHotels = new Set();
        const dedupHotels = hotelSuggestionsRaw.filter((item) => {
          const key = String(item?.hid || item?.id || "");
          if (!key || seenHotels.has(key)) return false;
          seenHotels.add(key);
          return true;
        });

        setHotelSuggestions([...dedupDestinations, ...dedupHotels]);
        setShowHotelSuggestions(true);
      } catch (error) {
        if (!active) return;
        if (error?.name === "CanceledError" || error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
          return;
        }
        setHotelSuggestions([]);
        setShowHotelSuggestions(false);
        console.error("Unable to load hotel suggestions", error);
      } finally {
        if (active) {
          setHotelSuggestLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      abortController.abort();
      window.clearTimeout(timer);
    };
  }, [hotelLocation, selectedCountry]);

  const totalNights = useMemo(
    () => calculateNights(hotelCheckIn, hotelCheckOut),
    [hotelCheckIn, hotelCheckOut],
  );

  const totalRooms = hotelRooms.length;
  const totalAdults = hotelRooms.reduce((sum, room) => sum + room.adults, 0);
  const totalChildren = hotelRooms.reduce((sum, room) => sum + room.children, 0);
  const totalGuests = totalAdults + totalChildren;

  const nationalityName =
    HOTEL_COUNTRIES.find((country) => country.code === nationality)?.name || "India";
  const residenceName =
    HOTEL_COUNTRIES.find((country) => country.code === countryOfResidence)?.name || "India";

  const selectedRatingsLabel = selectedRatings.length
    ? selectedRatings.length === 1
      ? HOTEL_RATING_OPTIONS.find((option) => selectedRatings.includes(option.value))?.label || "1 selected"
      : `${selectedRatings.length} selected`
    : "Select";
  const selectedSuggestion = selectedHotel || selectedDestination;
  const selectedCountryLabel =
    countryOptions.find((country) => String(country.code || "").toUpperCase() === selectedCountry)?.name ||
    "India";
  const destinationSuggestions = hotelSuggestions.filter((item) => item?.suggestionType !== "hotel");
  const hotelOnlySuggestions = hotelSuggestions.filter((item) => item?.suggestionType === "hotel");

  const handleSearchHotels = async () => {
    if (!selectedSuggestion?.displayName) {
      alert("Please select a destination or hotel from suggestions.");
      return;
    }

    if (!hotelCheckIn || !hotelCheckOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (totalNights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const isHotelSearch =
      String(selectedSuggestion?.searchRegionType || selectedSuggestion?.searchType || "").toUpperCase() ===
      "HOTEL";

    const fallbackCity =
      selectedSuggestion?.city ||
      selectedSuggestion?.raw?.city ||
      selectedSuggestion?.raw?.cityId ||
      selectedSuggestion?.raw?.cId ||
      "";
    const normalizedTjids = Array.isArray(selectedSuggestion?.tjids)
      ? selectedSuggestion.tjids.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const normalizedHid = String(
      selectedSuggestion?.hid ||
        selectedSuggestion?.raw?.hid ||
        selectedSuggestion?.raw?.tjid ||
        selectedSuggestion?.raw?.tjHotelId ||
        selectedSuggestion?.raw?.hotelCode ||
        ""
    ).trim();
    const effectiveTjids = normalizedTjids.length
      ? normalizedTjids
      : normalizedHid
        ? [normalizedHid]
        : [];
    const effectiveCity = String(fallbackCity || "").trim();

    const payload = {
      searchQuery: {
        checkinDate: hotelCheckIn,
        checkoutDate: hotelCheckOut,
        roomInfo: buildRoomInfoFromRooms(hotelRooms),
        searchCriteria: {
          city: !effectiveTjids.length ? effectiveCity : "",
          cityRegionIds:
            !isHotelSearch && selectedDestination?.id ? [String(selectedDestination.id)] : [],
          countryName: selectedCountry,
          tjids: effectiveTjids,
          nationality,
          countryOfResidence,
          currency: "INR",
          searchRegionName: selectedSuggestion.searchRegionName,
          searchRegionType: selectedSuggestion.searchRegionType,
        },
        searchType: selectedSuggestion.searchType || "CITY",
        gstApplied: gstClaimEligible,
      },
      allOptions: true,
      appliedFilters: {
        ...defaultFilters(),
        ratings: selectedRatings,
        onlyFavorites: false,
        hotelName: "",
      },
      pagination: {
        pageSize: 15,
        lastHotelId: "",
      },
      searchId: "",
      correlationId: createCorrelationId(),
      filterType: "BOTH",
      sortOrder: "popularity",
    };

    console.log("[HotelSearchForm] Search payload summary", {
      destination: selectedSuggestion.displayName,
      searchType: selectedSuggestion.searchRegionType || selectedSuggestion.searchType,
      city: !effectiveTjids.length ? effectiveCity : "",
      tjids: effectiveTjids,
      checkInDate: hotelCheckIn,
      checkoutDate: hotelCheckOut,
      totalNights,
      rooms: totalRooms,
      adults: totalAdults,
      children: totalChildren,
      filters: {
        ratings: selectedRatings,
        nationality,
        countryOfResidence,
        gstClaimEligible,
      },
    });

    setHotelSearchLoading(true);
    try {
      const response = await searchHotels(payload);
      navigate("/hotels", {
        state: {
          hotelSearchPayload: payload,
          hotelSearchResponse: response,
          selectedHotelSuggestion: selectedSuggestion,
        },
      });
    } catch (error) {
      console.error("Error searching hotels:", error);
      alert("Error searching hotels");
    } finally {
      setHotelSearchLoading(false);
    }
  };

  return (
    <div className="search-card hotel-search-card">
      <div className="hotel-search-stack">
        <div className="hotel-search-main-row">
          <div className="hotel-main-field hotel-main-field--destination" ref={destinationRef}>
            <div className="hotel-main-label">Destination / Hotel Search</div>
            <div className="field-wrapper">
              <input
                className="hotel-main-input"
                type="text"
                placeholder="Type city, neighborhood or place"
                autoComplete="off"
                value={hotelLocation}
                onChange={(event) => {
                  const value = event.target.value;
                  setHotelLocation(value);
                  setSelectedDestination(null);
                  setSelectedHotel(null);
                  setShowHotelSuggestions(value.trim().length >= 2);
                }}
                onFocus={() => {
                  if (hotelLocation.trim().length >= 2) {
                    setShowHotelSuggestions(true);
                  }
                }}
              />
              <div className="hotel-main-sub">
                {selectedSuggestion
                  ? `${selectedSuggestion.searchRegionType} · ${[
                      selectedSuggestion.stateName,
                      selectedSuggestion.countryName,
                    ]
                      .filter(Boolean)
                      .join(", ")}`
                  : ""}
              </div>

              {showHotelSuggestions ? (
                <div className="airport-suggestions hotel-airport-suggestions">
                  {hotelSuggestLoading ? (
                    <div className="suggestion-item suggestion-loading">
                      <Loader2 size={16} className="spin" />
                      Searching destinations...
                    </div>
                  ) : hotelSuggestions.length > 0 ? (
                    <>
                      {destinationSuggestions.length > 0 ? (
                        <div className="suggestion-item suggestion-empty">Destinations</div>
                      ) : null}
                      {destinationSuggestions.map((suggestion, index) => (
                        <div
                          key={`destination-${suggestion.id}-${index}`}
                          className="suggestion-item"
                          onClick={() => {
                            suppressNextSuggestionFetchRef.current = true;
                            setSelectedDestination(suggestion);
                            setSelectedHotel(null);
                            setHotelLocation(suggestion.displayName);
                            setShowHotelSuggestions(false);
                          }}
                        >
                          <div className="suggestion-main">
                            <span className="suggestion-iata">{getSuggestionBadge(suggestion.searchRegionType)}</span>
                            <span className="suggestion-name">{suggestion.displayName}</span>
                          </div>
                          <div className="suggestion-city">
                            {[suggestion.stateName, suggestion.countryName, suggestion.city]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                      ))}

                      {hotelOnlySuggestions.length > 0 ? (
                        <div className="suggestion-item suggestion-empty">Hotels</div>
                      ) : null}
                      {hotelOnlySuggestions.map((suggestion, index) => (
                        <div
                          key={`hotel-${suggestion.id}-${index}`}
                          className="suggestion-item"
                          onClick={() => {
                            suppressNextSuggestionFetchRef.current = true;
                            setSelectedHotel(suggestion);
                            setSelectedDestination(null);
                            setHotelLocation(suggestion.displayName);
                            setShowHotelSuggestions(false);
                          }}
                        >
                          <div className="suggestion-main">
                            <span className="suggestion-iata">HOTL</span>
                            <span className="suggestion-name">{suggestion.displayName}</span>
                          </div>
                          <div className="suggestion-city">
                            {[suggestion.cityName || suggestion.city, suggestion.countryName]
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="suggestion-item suggestion-empty">No destinations found</div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="hotel-main-field">
            <div className="hotel-main-label">Check-in</div>
            <input
              className="hotel-main-input"
              type="date"
              value={hotelCheckIn}
              onChange={(event) => {
                const value = event.target.value;
                setHotelCheckIn(value);
                if (hotelCheckOut && hotelCheckOut < value) {
                  setHotelCheckOut(value);
                }
              }}
            />
          </div>

          <div className="hotel-main-field">
            <div className="hotel-main-label">Check-out</div>
            <input
              className="hotel-main-input"
              type="date"
              min={hotelCheckIn || undefined}
              value={hotelCheckOut}
              onChange={(event) => setHotelCheckOut(event.target.value)}
            />
          </div>

          <div className="hotel-main-field hotel-main-field--nights">
            <div className="hotel-main-label">Total Nights</div>
            <div className="hotel-main-value">{totalNights > 0 ? `${totalNights} Night${totalNights > 1 ? "s" : ""}` : "--"}</div>
          </div>

          <div className="hotel-main-field hotel-main-field--guests">
            <button
              type="button"
              className="hotel-guests-trigger"
              onClick={() => {
                setShowGuestsDropdown((prev) => !prev);
                setShowRatingsDropdown(false);
                setShowNationalityDropdown(false);
                setShowResidenceDropdown(false);
              }}
            >
              <div className="hotel-main-label">
                Persons & Rooms
                <ChevronDown size={12} />
              </div>
              <div className="hotel-main-value">
                {totalRooms} Room{totalRooms > 1 ? "s" : ""}, {totalGuests} Guest{totalGuests > 1 ? "s" : ""}
              </div>
              <div className="hotel-main-sub">
                {totalAdults} Adult{totalAdults > 1 ? "s" : ""}
                {totalChildren ? `, ${totalChildren} Child${totalChildren > 1 ? "ren" : ""}` : ""}
              </div>
            </button>

            {showGuestsDropdown ? (
              <RoomsGuestsDropdown
                rooms={hotelRooms}
                onApply={setHotelRooms}
                onClose={() => setShowGuestsDropdown(false)}
              />
            ) : null}
          </div>

          <button
            type="button"
            className="hotel-search-submit"
            onClick={handleSearchHotels}
            disabled={hotelSearchLoading}
          >
            {hotelSearchLoading ? (
              <span className="hotel-search-submit-content">
                <Loader2 size={18} className="spin" />
                Searching...
              </span>
            ) : (
              <span className="hotel-search-submit-content">
                <BedDouble size={18} />
                Search
              </span>
            )}
          </button>
        </div>

        <div className="hotel-more-options-row">
          <div className="hotel-more-options-title">More Options:</div>

          <div className="hotel-more-option-item">
            <button
              type="button"
              className="hotel-more-option-button"
              onClick={() => {
                setShowSearchCountryDropdown((prev) => !prev);
                setShowGuestsDropdown(false);
                setShowRatingsDropdown(false);
                setShowNationalityDropdown(false);
                setShowResidenceDropdown(false);
              }}
            >
              <span className="hotel-more-option-label">Search Country:</span>
              <span className="hotel-more-option-value">
                {selectedCountryLabel}
                <ChevronDown size={12} />
              </span>
            </button>

            {showSearchCountryDropdown ? (
              <CountryDropdown
                value={selectedCountry}
                label="Select search country"
                options={countryOptions}
                onChange={(countryCode) => {
                  const next = String(countryCode || "").toUpperCase();
                  setSelectedCountry(next);
                  setSelectedDestination(null);
                  setSelectedHotel(null);
                  setHotelLocation("");
                  setHotelSuggestions([]);
                  setShowHotelSuggestions(false);
                }}
                onClose={() => setShowSearchCountryDropdown(false)}
              />
            ) : null}
          </div>

          <div className="hotel-more-option-item">
            <button
              type="button"
              className="hotel-more-option-button"
              onClick={() => {
                setShowRatingsDropdown((prev) => !prev);
                setShowGuestsDropdown(false);
                setShowNationalityDropdown(false);
                setShowResidenceDropdown(false);
              }}
            >
              <span className="hotel-more-option-label">Rating</span>
              <span className="hotel-more-option-value">
                {selectedRatingsLabel}
                <ChevronDown size={12} />
              </span>
            </button>

            {showRatingsDropdown ? (
              <RatingDropdown
                selectedRatings={selectedRatings}
                onToggle={(value) =>
                  setSelectedRatings((prev) => toggleArrayValue(prev, value))
                }
                onClose={() => setShowRatingsDropdown(false)}
              />
            ) : null}
          </div>

          <div className="hotel-more-option-item">
            <button
              type="button"
              className="hotel-more-option-button"
              onClick={() => {
                setShowNationalityDropdown((prev) => !prev);
                setShowGuestsDropdown(false);
                setShowRatingsDropdown(false);
                setShowResidenceDropdown(false);
              }}
            >
              <span className="hotel-more-option-label">Nationality:</span>
              <span className="hotel-more-option-value">
                {nationalityName}
                <ChevronDown size={12} />
              </span>
            </button>

            {showNationalityDropdown ? (
              <CountryDropdown
                value={nationality}
                label="Select nationality"
                onChange={setNationality}
                onClose={() => setShowNationalityDropdown(false)}
              />
            ) : null}
          </div>

          <div className="hotel-more-option-item">
            <button
              type="button"
              className="hotel-more-option-button"
              onClick={() => {
                setShowResidenceDropdown((prev) => !prev);
                setShowGuestsDropdown(false);
                setShowRatingsDropdown(false);
                setShowNationalityDropdown(false);
              }}
            >
              <span className="hotel-more-option-label">Country of Residence:</span>
              <span className="hotel-more-option-value">
                {residenceName}
                <ChevronDown size={12} />
              </span>
            </button>

            {showResidenceDropdown ? (
              <CountryDropdown
                value={countryOfResidence}
                label="Select country of residence"
                onChange={setCountryOfResidence}
                onClose={() => setShowResidenceDropdown(false)}
              />
            ) : null}
          </div>

          <label className="hotel-gst-toggle">
            <input
              type="checkbox"
              checked={gstClaimEligible}
              onChange={(event) => setGstClaimEligible(event.target.checked)}
            />
            <span>Show GST claim eligible rates</span>
          </label>
        </div>
      </div>
    </div>
  );
}
