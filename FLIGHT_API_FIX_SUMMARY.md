# Flight API Payload Fix Summary

## Problem
The flight search API was receiving incorrect payload shapes, causing 400 errors with messages like:
- "searchQuery.paxInfo : may not be null"
- "Adult pax count cannot be zero"

## Root Cause
Component state (filters, pagination, raw search params) was being sent directly to the TripJack API instead of a properly formatted `searchQuery` object.

## Solution

### 1. Created Utility Functions (`src/utils/flightSearchUtils.js`)

#### `buildTripJackSearchQuery(params)`
Builds a proper TripJack searchQuery object from component state.

**Input:**
```javascript
{
  from: "PNQ",
  to: "BLR",
  departureDate: "2026-05-17",
  returnDate: "2026-05-31",
  adults: 1,
  children: 0,
  infants: 0,
  cabinClass: "Economy",
  tripType: "round",
  paxType: "REGULAR"
}
```

**Output:**
```javascript
{
  cabinClass: "ECONOMY",
  paxInfo: {
    ADULT: "1",
    CHILD: "0",
    INFANT: "0"
  },
  routeInfos: [
    {
      fromCityOrAirport: { code: "PNQ" },
      toCityOrAirport: { code: "BLR" },
      travelDate: "2026-05-17"
    },
    {
      fromCityOrAirport: { code: "BLR" },
      toCityOrAirport: { code: "PNQ" },
      travelDate: "2026-05-31"
    }
  ],
  searchModifiers: {
    isDirectFlight: true,
    isConnectingFlight: true
  }
}
```

#### `mapTripJackFlight(trip)`
Maps TripJack API response to display format for flight cards.

#### `mapTripJackLocation(location)`
Maps TripJack location API response to internal format.

### 2. Updated Components

#### `FlightSearchForm.jsx`
- Now uses `buildTripJackSearchQuery()` to construct the search payload
- Separates display params (`searchParams`) from API payload (`searchQuery`)
- Ensures `paxInfo` is always included with valid values

#### `FlightSearchResults.jsx`
- Updated to use `buildTripJackSearchQuery()` for re-searches
- Uses `mapTripJackFlight()` to transform API response to display format
- Removed incorrect filter/pagination params from API calls
- Filters and pagination are now client-side only

### 3. API Call Pattern

**Correct pattern everywhere:**
```javascript
const searchQuery = buildTripJackSearchQuery({
  from, to, departureDate, returnDate,
  adults, children, infants: 0,
  cabinClass, tripType, paxType
});

// For direct flights only
const directQuery = {
  ...searchQuery,
  searchModifiers: { isDirectFlight: true, isConnectingFlight: false }
};

// For connecting flights only
const connectingQuery = {
  ...searchQuery,
  searchModifiers: { isDirectFlight: false, isConnectingFlight: true }
};

// API call
await searchFlights(directQuery);
await searchFlights(connectingQuery);
```

**The API endpoint receives:**
```javascript
POST /tj/fms/search
{
  searchQuery: {
    cabinClass: "ECONOMY",
    paxInfo: { ADULT: "1", CHILD: "0", INFANT: "0" },
    routeInfos: [...],
    searchModifiers: { isDirectFlight: true, isConnectingFlight: false }
  }
}
```

### 4. Key Rules

1. **Never send raw component state to the API**
   - ❌ `searchFlights({ from, to, date, filters, page })`
   - ✅ `searchFlights(buildTripJackSearchQuery({ from, to, ... }))`

2. **Filters and pagination are frontend-only**
   - Never include in `searchQuery`
   - Apply after receiving API response

3. **Always use the builder function**
   - Ensures consistent payload shape
   - Handles edge cases (missing values, type conversion)
   - Validates required fields

4. **Separate display params from API payload**
   - `searchParams`: for UI display (route info, dates, etc.)
   - `searchQuery`: for API calls (TripJack format)

### 5. Files Modified

- ✅ `src/utils/flightSearchUtils.js` (created)
- ✅ `src/components/pages/Travels/honeymoon/components/FlightSearchForm.jsx`
- ✅ `src/components/pages/Travels/honeymoon/FlightSearchResults.jsx`
- ✅ `src/hooks/useAirportSearch.js` (already correct)
- ✅ `src/hooks/useFlight.js` (already correct)
- ✅ `src/services/api/flightApi.js` (no changes needed)

### 6. Testing Checklist

- [ ] Initial search from hero page works
- [ ] Results page displays flights correctly
- [ ] Re-search from results page works
- [ ] Filters work (client-side)
- [ ] Pagination works (client-side)
- [ ] Round-trip search works
- [ ] One-way search works
- [ ] Different passenger types work (REGULAR, STUDENT, SENIOR_CITIZEN)
- [ ] Console shows correct payload structure

### 7. Console Debugging

The code includes console.log statements to verify payloads:
```javascript
console.log("Direct Query:", JSON.stringify(directQuery, null, 2));
console.log("Connecting Query:", JSON.stringify(connectingQuery, null, 2));
```

Check browser console to verify the payload matches the expected TripJack format.
