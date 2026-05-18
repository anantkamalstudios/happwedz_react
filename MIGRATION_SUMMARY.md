# TripJack Flight Migration Summary

## ✅ Completed Changes

### 1. Service Layer (`src/services/api/flightApi.js`)
**Status:** ✅ Complete

- ✅ Replaced all Duffel/Amadeus endpoints with TripJack BFF
- ✅ All `/tj/fms/...` endpoints (search, review, farerule, seat)
- ✅ All `/tj/oms/...` endpoints (book, validate, confirm, details, amendment)
- ✅ Kept airport search unchanged (`/flight_booking/airports`)
- ✅ Kept payment endpoints unchanged (`/flight_payment/...`)
- ✅ Fixed body wrapper — all TripJack calls now send `{ searchQuery: {...} }`

### 2. Custom Hooks (`src/hooks/`)
**Status:** ✅ Complete

#### `useFlight.js`
- ✅ `useFlightSearch()` — fires direct + connecting in parallel, merges ONWARD/RETURN/COMBO
- ✅ `useFlightReview()` — price review with loading/error/data state
- ✅ `useFareRule()` — fare rules fetch
- ✅ `useSeatMap()` — seat map fetch
- ✅ `useFlightBook()` — booking with state management
- ✅ `useBookingDetails()` — fetch booking details
- ✅ `useAmendment()` — charges, submit, poll with unified state

#### `useAirportSearch.js`
- ✅ Debounced typeahead (350ms default)
- ✅ AbortController to cancel stale requests
- ✅ Skip API call if query < 2 chars
- ✅ `clearSuggestions()` to reset state

### 3. UI Component (`src/components/pages/Travels/honeymoon/HeroPage.jsx`)
**Status:** ✅ Complete

- ✅ Replaced inline airport search with `useAirportSearch()` hooks
- ✅ Replaced direct `searchFlights()` call with `useFlightSearch()` hook
- ✅ Build TripJack-shaped `searchQuery` object
- ✅ Added passenger type selector (REGULAR, STUDENT, SENIOR_CITIZEN)
- ✅ Pass `{ searchParams, searchQuery, initialResults }` to results page
- ✅ UI unchanged — only logic migrated

### 4. Styling (`src/App.css`)
**Status:** ✅ Complete

- ✅ Added `.tj-*` CSS classes for flight cards
- ✅ Route row grid layout
- ✅ Fare badges (refundable, non-refundable, special)
- ✅ Tab bar for ONWARD/RETURN/COMBO
- ✅ Filter sidebar styles
- ✅ Loading shimmer animation
- ✅ Responsive breakpoints

---

## 📋 TripJack API Structure

### Search Request
```json
{
  "searchQuery": {
    "cabinClass": "ECONOMY",
    "paxInfo": { "ADULT": "1", "CHILD": "0", "INFANT": "0" },
    "routeInfos": [
      {
        "fromCityOrAirport": { "code": "DEL" },
        "toCityOrAirport": { "code": "BLR" },
        "travelDate": "2026-06-19"
      }
    ],
    "searchModifiers": {
      "isDirectFlight": true,
      "isConnectingFlight": false
    },
    "paxType": "REGULAR"  // Optional: STUDENT | SENIOR_CITIZEN
  }
}
```

### Search Response
```json
{
  "searchResult": {
    "tripInfos": {
      "ONWARD": [...],   // One-way / outbound flights
      "RETURN": [...],   // Return flights
      "COMBO": [...]     // Combined round-trip itineraries
    }
  }
}
```

### Trip Object Structure
```js
trip.sI[]                          // Segment array
trip.sI[n].fD.aI.code              // Airline code "SG"
trip.sI[n].fD.aI.name              // Airline name "SpiceJet"
trip.sI[n].fD.fN                   // Flight number "151"
trip.sI[n].da.code                 // Departure airport "DEL"
trip.sI[n].aa.code                 // Arrival airport "BLR"
trip.sI[n].dt                      // Departure time "2026-06-19T19:20"
trip.sI[n].at                      // Arrival time
trip.sI[n].duration                // Duration in minutes
trip.sI[n].stops                   // 0 = non-stop

trip.totalPriceList[]              // Available fares
trip.totalPriceList[n].id          // priceId for review/booking
trip.totalPriceList[n].fd.ADULT.fC.TF    // Total fare
trip.totalPriceList[n].fd.ADULT.fC.BF    // Base fare
trip.totalPriceList[n].fd.ADULT.bI.iB    // Checked baggage "15 Kg"
trip.totalPriceList[n].fd.ADULT.bI.cB    // Cabin baggage "7 Kg"
trip.totalPriceList[n].fd.ADULT.rT       // Refundable: 1=yes 0=no
trip.totalPriceList[n].fareIdentifier    // "PUBLISHED" | "SPECIAL"
```

---

## 🔄 Search Flow

### Frontend → BFF
1. User enters DEL → BLR, selects dates, passengers
2. `useFlightSearch()` fires TWO parallel requests:
   - Direct: `{ isDirectFlight: true, isConnectingFlight: false }`
   - Connecting: `{ isDirectFlight: false, isConnectingFlight: true }`
3. Hook merges `ONWARD`, `RETURN`, `COMBO` arrays
4. Deduplicates by flight signature: `${airline}${flightNo}-${dep}-${arr}-${time}`
5. Returns merged data to component

### BFF → TripJack
- BFF receives `{ searchQuery: {...} }`
- BFF forwards to TripJack API
- BFF returns raw TripJack response (no transformation)

---

## 🎯 Next Steps (Results Page)

### Create Flight Results Page
**File:** `src/components/pages/Travels/honeymoon/FlightResults.jsx`

```jsx
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function FlightResults() {
  const location = useLocation();
  const { searchParams, searchQuery, initialResults } = location.state || {};
  
  const [activeTab, setActiveTab] = useState('ONWARD');
  
  // Extract trips from initialResults
  const directTrips = initialResults?.direct?.searchResult?.tripInfos || {};
  const connectingTrips = initialResults?.connecting?.searchResult?.tripInfos || {};
  
  // Merge (already done in hook, but can also do here)
  const allTrips = {
    ONWARD: [...(directTrips.ONWARD || []), ...(connectingTrips.ONWARD || [])],
    RETURN: [...(directTrips.RETURN || []), ...(connectingTrips.RETURN || [])],
    COMBO: [...(directTrips.COMBO || []), ...(connectingTrips.COMBO || [])]
  };
  
  const currentTrips = allTrips[activeTab] || [];
  
  return (
    <div className="container py-4">
      {/* Tab bar */}
      <div className="tj-tab-bar">
        <button 
          className={`tj-tab ${activeTab === 'ONWARD' ? 'active' : ''}`}
          onClick={() => setActiveTab('ONWARD')}
        >
          Onward ({allTrips.ONWARD.length})
        </button>
        {allTrips.RETURN.length > 0 && (
          <button 
            className={`tj-tab ${activeTab === 'RETURN' ? 'active' : ''}`}
            onClick={() => setActiveTab('RETURN')}
          >
            Return ({allTrips.RETURN.length})
          </button>
        )}
        {allTrips.COMBO.length > 0 && (
          <button 
            className={`tj-tab ${activeTab === 'COMBO' ? 'active' : ''}`}
            onClick={() => setActiveTab('COMBO')}
          >
            Combo ({allTrips.COMBO.length})
          </button>
        )}
      </div>
      
      {/* Flight cards */}
      <div className="row">
        <div className="col-lg-3">
          {/* Filter sidebar */}
          <div className="tj-filter-sidebar">
            <div className="tj-filter-title">Filters</div>
            {/* Add filters here */}
          </div>
        </div>
        
        <div className="col-lg-9">
          {currentTrips.map((trip, idx) => (
            <FlightCard key={idx} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlightCard({ trip }) {
  const firstSegment = trip.sI[0];
  const lastSegment = trip.sI[trip.sI.length - 1];
  const firstPrice = trip.totalPriceList[0];
  
  return (
    <div className="tj-flight-card">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex align-items-center gap-3">
          <div className="tj-airline-logo">
            {firstSegment.fD.aI.code}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>
              {firstSegment.fD.aI.name}
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>
              {firstSegment.fD.aI.code} {firstSegment.fD.fN}
            </div>
          </div>
        </div>
        
        <div className="text-end">
          <div className="tj-price">₹{firstPrice.fd.ADULT.fC.TF.toLocaleString()}</div>
          <div className="tj-price-label">per adult</div>
        </div>
      </div>
      
      <div className="tj-route-row">
        <div>
          <div className="tj-time">{firstSegment.dt.split('T')[1]}</div>
          <div className="tj-airport">{firstSegment.da.code}</div>
        </div>
        
        <div className="tj-duration-col">
          <div className="tj-duration">
            {Math.floor(firstSegment.duration / 60)}h {firstSegment.duration % 60}m
          </div>
          <div className="tj-stops">
            {firstSegment.stops === 0 ? 'Non-stop' : `${firstSegment.stops} stop(s)`}
          </div>
        </div>
        
        <div>
          <div className="tj-time">{lastSegment.at.split('T')[1]}</div>
          <div className="tj-airport">{lastSegment.aa.code}</div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-2">
          <span className="tj-baggage">
            ✈️ {firstPrice.fd.ADULT.bI.cB}
          </span>
          <span className="tj-baggage">
            🧳 {firstPrice.fd.ADULT.bI.iB}
          </span>
          <span className={`tj-fare-badge ${firstPrice.fd.ADULT.rT === 1 ? 'refundable' : 'non-refundable'}`}>
            {firstPrice.fd.ADULT.rT === 1 ? 'Refundable' : 'Non-refundable'}
          </span>
        </div>
        
        <button className="tj-select-btn">
          Select Flight
        </button>
      </div>
    </div>
  );
}
```

---

## 🔍 Testing Checklist

### Airport Search
- [ ] Type "mu" → should show Mumbai airports
- [ ] Type "del" → should show Delhi airports
- [ ] Debounce working (no API call on every keystroke)
- [ ] Suggestions clear when clicking outside
- [ ] Can select airport from dropdown

### Flight Search
- [ ] One-way search works
- [ ] Round-trip search works (2 routeInfos)
- [ ] Student fare option works
- [ ] Senior citizen fare option works
- [ ] Loading state shows during search
- [ ] Error handling works
- [ ] Navigate to results page with correct state

### Results Page (To Build)
- [ ] ONWARD tab shows flights
- [ ] RETURN tab shows return flights (if round-trip)
- [ ] COMBO tab shows combined itineraries
- [ ] Flight cards display correctly
- [ ] Price, airline, times, duration all correct
- [ ] Baggage info displays
- [ ] Refundable/non-refundable badge
- [ ] Select button works

---

## 📝 Notes

1. **No response transformation** — TripJack responses flow raw from BFF → service → hook → component
2. **Auth handled automatically** — `axiosInstance` interceptors add Bearer token for `/tj/oms/...` endpoints
3. **Payment unchanged** — `/flight_payment/...` endpoints still work as before
4. **Deduplication** — `useFlightSearch` dedupes by flight signature to avoid showing same flight twice
5. **Parallel search** — Direct + connecting fired simultaneously via `Promise.allSettled`
6. **CSS ready** — All `.tj-*` classes in `App.css` ready for results page

---

## 🚀 Deployment

1. ✅ Service layer migrated
2. ✅ Hooks created
3. ✅ Search UI updated
4. ✅ CSS added
5. ⏳ Results page (next step)
6. ⏳ Booking flow (after results)
7. ⏳ Payment integration (after booking)

---

## 📚 Reference Files

- `TRIPJACK_API_REFERENCE.md` — Complete API documentation
- `src/services/api/flightApi.js` — Service layer
- `src/hooks/useFlight.js` — Flight hooks
- `src/hooks/useAirportSearch.js` — Airport search hook
- `src/components/pages/Travels/honeymoon/HeroPage.jsx` — Search UI
- `src/App.css` — TripJack styles (`.tj-*` classes)
