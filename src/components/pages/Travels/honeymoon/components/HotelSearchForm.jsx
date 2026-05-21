import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { suggestHotels, searchHotels } from "../../../../../services/api/hotelApi";
import {
  createCorrelationId,
  defaultFilters,
} from "../../hotelbeds/hotelbedsDetailHelpers";
import SearchButton from "./SearchButton";

const readSuggestionItems = (payload) => {
  const candidates = [
    payload,
    payload?.suggestions,
    payload?.data?.suggestions,
    payload?.data,
    payload?.items,
    payload?.results,
  ];
  const match = candidates.find((value) => Array.isArray(value));
  return Array.isArray(match) ? match : [];
};

const normalizeHotelSuggestion = (suggestion) => {
  if (!suggestion) return null;

  const searchType =
    suggestion?.searchType ||
    suggestion?.searchRegionType ||
    suggestion?.regionType ||
    suggestion?.type ||
    "CITY";

  const city =
    suggestion?.city ||
    suggestion?.cityId ||
    suggestion?.regionId ||
    suggestion?.searchRegionId ||
    suggestion?.id ||
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
    suggestion?.tjids || suggestion?.hids || suggestion?.hotelIds || [];
  const tjids = Array.isArray(rawTjids)
    ? rawTjids.map((item) => String(item)).filter(Boolean)
    : [];

  const subtitle =
    suggestion?.subtitle ||
    [suggestion?.stateName, suggestion?.countryName].filter(Boolean).join(", ");

  return {
    id: String(city || displayName || ""),
    city: String(city || ""),
    searchType: String(searchType || "CITY").toUpperCase(),
    searchRegionType: String(searchType || "CITY").toUpperCase(),
    searchRegionName: String(displayName || "").trim(),
    displayName: String(displayName || "").trim(),
    stateName: suggestion?.stateName || "",
    countryName:
      suggestion?.countryName ||
      suggestion?.country ||
      (subtitle ? String(subtitle).split(",").slice(-1)[0]?.trim() : ""),
    tjids,
    raw: suggestion,
  };
};

const buildRoomInfoFromCounts = ({ rooms, adults, children }) => {
  const roomCount = Math.max(1, Number(rooms) || 1);
  let adultsRemaining = Math.max(roomCount, Number(adults) || 1);
  let childrenRemaining = Math.max(0, Number(children) || 0);

  return Array.from({ length: roomCount }, (_, index) => {
    const roomsLeft = roomCount - index;
    const adultsForRoom = Math.max(1, Math.floor(adultsRemaining / roomsLeft));
    adultsRemaining -= adultsForRoom;

    const childrenForRoom = Math.floor(childrenRemaining / roomsLeft);
    childrenRemaining -= childrenForRoom;

    return {
      numberOfAdults: adultsForRoom,
      numberOfChild: childrenForRoom,
      childAge: Array.from({ length: childrenForRoom }, () => 6),
    };
  });
};

const getSuggestionBadge = (searchRegionType) => {
  const type = String(searchRegionType || "CITY").toUpperCase();
  if (type === "NEIGHBORHOOD") return "NBH";
  if (type === "POINT_OF_INTEREST") return "POI";
  if (type === "MULTI_CITY_VICINITY") return "MCV";
  return type.slice(0, 4);
};

export default function HotelSearchForm() {
  const navigate = useNavigate();
  const destinationRef = useRef(null);
  const [hotelLocation, setHotelLocation] = useState("");
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [hotelSuggestLoading, setHotelSuggestLoading] = useState(false);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [selectedHotelSuggestion, setSelectedHotelSuggestion] = useState(null);
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelSearchLoading, setHotelSearchLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowHotelSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const keyword = hotelLocation.trim();
    if (keyword.length < 2) {
      setHotelSuggestions([]);
      setShowHotelSuggestions(false);
      setHotelSuggestLoading(false);
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setHotelSuggestLoading(true);
      try {
        const response = await suggestHotels({ keyword });
        if (!active) return;

        const suggestions = readSuggestionItems(response)
          .map(normalizeHotelSuggestion)
          .filter((item) => item?.id && item?.displayName);

        setHotelSuggestions(suggestions);
        setShowHotelSuggestions(true);
      } catch (error) {
        if (!active) return;
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
      window.clearTimeout(timer);
    };
  }, [hotelLocation]);

  const handleSearchHotels = async () => {
    if (!selectedHotelSuggestion?.city || !selectedHotelSuggestion?.displayName) {
      alert("Please select a destination from the suggestions.");
      return;
    }

    if (!hotelCheckIn || !hotelCheckOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const payload = {
      searchQuery: {
        checkinDate: hotelCheckIn,
        checkoutDate: hotelCheckOut,
        roomInfo: buildRoomInfoFromCounts({
          rooms: hotelRooms,
          adults: hotelAdults,
          children: hotelChildren,
        }),
        searchCriteria: {
          city: selectedHotelSuggestion.city,
          tjids: selectedHotelSuggestion.tjids,
          nationality: "106",
          countryOfResidence: "106",
          currency: "INR",
          searchRegionName: selectedHotelSuggestion.searchRegionName,
          searchRegionType: selectedHotelSuggestion.searchRegionType,
        },
        searchType: selectedHotelSuggestion.searchType || "CITY",
        gstApplied: false,
      },
      allOptions: true,
      appliedFilters: {
        ...defaultFilters(),
        onlyFavorites: false,
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

    setHotelSearchLoading(true);
    try {
      const response = await searchHotels(payload);
      navigate("/hotels", {
        state: {
          hotelSearchPayload: payload,
          hotelSearchResponse: response,
          selectedHotelSuggestion,
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
    <div className="search-card">
      <div className="search-fields">
        <div className="field-box" ref={destinationRef}>
          <div className="field-label">Destination</div>
          <div className="field-wrapper">
            <input
              className="field-input"
              type="text"
              placeholder="Type city, neighborhood or place"
              autoComplete="off"
              value={hotelLocation}
              onChange={(e) => {
                const value = e.target.value;
                setHotelLocation(value);
                setSelectedHotelSuggestion(null);
                setShowHotelSuggestions(value.trim().length >= 2);
              }}
              onFocus={() => {
                if (hotelLocation.trim().length >= 2) {
                  setShowHotelSuggestions(true);
                }
              }}
            />
            <div className="field-sub">
              {selectedHotelSuggestion
                ? `${selectedHotelSuggestion.searchRegionType} · ${
                    [
                      selectedHotelSuggestion.stateName,
                      selectedHotelSuggestion.countryName,
                    ]
                      .filter(Boolean)
                      .join(", ") || selectedHotelSuggestion.city
                  }`
                : "Choose a TripJack suggestion before searching"}
            </div>
            {showHotelSuggestions && (
              <div className="airport-suggestions">
                {hotelSuggestLoading ? (
                  <div className="suggestion-item suggestion-loading">
                    <Loader2 size={16} className="spin" />
                    Searching destinations...
                  </div>
                ) : hotelSuggestions.length > 0 ? (
                  hotelSuggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion.id}-${index}`}
                      className="suggestion-item"
                      onClick={() => {
                        setSelectedHotelSuggestion(suggestion);
                        setHotelLocation(suggestion.displayName);
                        setShowHotelSuggestions(false);
                      }}
                    >
                      <div className="suggestion-main">
                        <span className="suggestion-iata">
                          {getSuggestionBadge(suggestion.searchRegionType)}
                        </span>
                        <span className="suggestion-name">
                          {suggestion.displayName}
                        </span>
                      </div>
                      <div className="suggestion-city">
                        {[
                          suggestion.stateName,
                          suggestion.countryName,
                          suggestion.city &&
                            suggestion.city !== suggestion.displayName
                            ? suggestion.city
                            : "",
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item suggestion-empty">
                    No destinations found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="field-box">
          <div className="field-label">Check-in</div>
          <input
            className="field-input"
            type="date"
            value={hotelCheckIn}
            onChange={(e) => {
              const value = e.target.value;
              setHotelCheckIn(value);
              if (hotelCheckOut && hotelCheckOut < value) {
                setHotelCheckOut(value);
              }
            }}
          />
        </div>

        <div className="field-box">
          <div className="field-label">Check-out</div>
          <input
            className="field-input"
            type="date"
            min={hotelCheckIn || undefined}
            value={hotelCheckOut}
            onChange={(e) => setHotelCheckOut(e.target.value)}
          />
        </div>

        <div className="field-box">
          <div className="field-label">Rooms</div>
          <input
            className="field-input"
            type="number"
            min={1}
            value={hotelRooms}
            onChange={(e) =>
              setHotelRooms(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </div>

        <div className="field-box">
          <div className="field-label">Adults</div>
          <input
            className="field-input"
            type="number"
            min={1}
            value={hotelAdults}
            onChange={(e) =>
              setHotelAdults(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </div>

        <div className="field-box">
          <div className="field-label">Children</div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={hotelChildren}
            onChange={(e) =>
              setHotelChildren(Math.max(0, Number(e.target.value) || 0))
            }
          />
        </div>

        <SearchButton
          loading={hotelSearchLoading}
          onClick={handleSearchHotels}
          type="hotel"
        />
      </div>
    </div>
  );
}
