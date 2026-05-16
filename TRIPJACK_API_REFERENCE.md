# TripJack Flight API Reference

## Base URL
```
https://happywedz.com/api
```

---

## 1. Location Search (TripJack)

**Endpoint:** `GET /tj/meta/locations`

**Query Params:**
- `q` — search term (min 2 chars)

**Example:**
```
GET /tj/meta/locations?q=mu
```

**Response:**
```json
{
  "payload": {
    "suggestions": [
      {
        "id": 4342,
        "code": "BLR",
        "name": "Bengaluru Intl Arpt",
        "city": "Bengaluru",
        "cityCode": "BLR",
        "country": "India",
        "countryCode": "IN",
        "priority": 10,
        "enabled": true
      }
    ],
    "status": {
      "success": true,
      "httpStatus": 200
    }
  },
  "status": {
    "success": true
  }
}
```

**Note:** This replaces the old `/flight_booking/airports` endpoint.

---

## 2. Flight Search

**Endpoint:** `POST /tj/fms/search`

**Body Structure:**
```json
{
  "searchQuery": {
    "cabinClass": "ECONOMY",
    "paxInfo": {
      "ADULT": "1",
      "CHILD": "0",
      "INFANT": "0"
    },
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
    }
  }
}
```

### Search Variants

#### Domestic One-way (Direct)
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
    }
  }
}
```

#### Domestic One-way (Connecting)
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
      "isDirectFlight": false,
      "isConnectingFlight": true
    }
  }
}
```

#### Domestic Return
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
      },
      {
        "fromCityOrAirport": { "code": "BLR" },
        "toCityOrAirport": { "code": "DEL" },
        "travelDate": "2026-06-25"
      }
    ],
    "searchModifiers": {
      "isDirectFlight": true,
      "isConnectingFlight": false
    }
  }
}
```

#### International One-way
```json
{
  "searchQuery": {
    "cabinClass": "ECONOMY",
    "paxInfo": { "ADULT": "1", "CHILD": "0", "INFANT": "0" },
    "routeInfos": [
      {
        "fromCityOrAirport": { "code": "BOM" },
        "toCityOrAirport": { "code": "DXB" },
        "travelDate": "2026-06-19"
      }
    ],
    "searchModifiers": {
      "isDirectFlight": true,
      "isConnectingFlight": false
    }
  }
}
```

#### Multi-city
```json
{
  "searchQuery": {
    "cabinClass": "ECONOMY",
    "paxInfo": { "ADULT": "1", "CHILD": "0", "INFANT": "0" },
    "routeInfos": [
      {
        "fromCityOrAirport": { "code": "DEL" },
        "toCityOrAirport": { "code": "BOM" },
        "travelDate": "2026-06-19"
      },
      {
        "fromCityOrAirport": { "code": "BOM" },
        "toCityOrAirport": { "code": "BLR" },
        "travelDate": "2026-06-22"
      },
      {
        "fromCityOrAirport": { "code": "BLR" },
        "toCityOrAirport": { "code": "DEL" },
        "travelDate": "2026-06-25"
      }
    ],
    "searchModifiers": {
      "isDirectFlight": true,
      "isConnectingFlight": false
    }
  }
}
```

#### Student Fare
```json
{
  "searchQuery": {
    "cabinClass": "ECONOMY",
    "paxInfo": { "ADULT": "1", "CHILD": "0", "INFANT": "0" },
    "routeInfos": [
      {
        "fromCityOrAirport": { "code": "DEL" },
        "toCityOrAirport": { "code": "LHR" },
        "travelDate": "2026-06-19"
      }
    ],
    "searchModifiers": {
      "isDirectFlight": false,
      "isConnectingFlight": true
    },
    "paxType": "STUDENT"
  }
}
```

#### Senior Citizen Fare
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
    "paxType": "SENIOR_CITIZEN"
  }
}
```

### Response Shape
```json
{
  "searchResult": {
    "tripInfos": {
      "ONWARD": [
        {
          "sI": [
            {
              "fD": {
                "aI": { "code": "SG", "name": "SpiceJet" },
                "fN": "151"
              },
              "da": { "code": "DEL", "city": "Delhi" },
              "aa": { "code": "BLR", "city": "Bangalore" },
              "dt": "2026-06-19T19:20",
              "at": "2026-06-19T22:05",
              "duration": 165,
              "stops": 0
            }
          ],
          "totalPriceList": [
            {
              "id": "priceId123",
              "fd": {
                "ADULT": {
                  "fC": { "TF": 5500, "BF": 4800 },
                  "bI": { "iB": "15 Kg", "cB": "7 Kg" },
                  "rT": 1
                }
              },
              "fareIdentifier": "PUBLISHED"
            }
          ]
        }
      ],
      "RETURN": [],
      "COMBO": []
    }
  }
}
```

---

## 3. Price Review

**Endpoint:** `POST /tj/fms/review`

**Body:**
```json
{
  "priceIds": ["priceId1", "priceId2"]
}
```

---

## 4. Fare Rules

**Endpoint:** `POST /tj/fms/farerule`

**Body:**
```json
{
  "id": "priceId123",
  "flowType": "SEARCH"
}
```

---

## 5. Seat Map

**Endpoint:** `POST /tj/fms/seat`

**Body:**
```json
{
  "bookingId": "TJ123456"
}
```

---

## 6. Book Flight (Auth Required)

**Endpoint:** `POST /tj/oms/book`

**Body:**
```json
{
  "priceId": "priceId123",
  "passengers": [
    {
      "ti": "Mr",
      "fN": "John",
      "lN": "Doe",
      "pt": "ADULT",
      "dob": "1990-01-15"
    }
  ],
  "contact": {
    "email": "john@example.com",
    "mobile": "+919876543210"
  }
}
```

---

## 7. Fare Validate (Auth Required)

**Endpoint:** `POST /tj/oms/fare-validate`

---

## 8. Confirm Booking (Auth Required)

**Endpoint:** `POST /tj/oms/confirm-book`

---

## 9. Booking Details (Auth Required)

**Endpoint:** `POST /tj/oms/booking-details`

**Body:**
```json
{
  "bookingId": "TJ123456"
}
```

---

## 10. Amendment Charges (Auth Required)

**Endpoint:** `POST /tj/oms/amendment/charges`

---

## 11. Submit Amendment (Auth Required)

**Endpoint:** `POST /tj/oms/amendment/submit`

---

## 12. Poll Amendment (Auth Required)

**Endpoint:** `POST /tj/oms/amendment/poll`

**Body:**
```json
{
  "amendmentId": "AMD123"
}
```

---

## Payment Endpoints (Existing)

### Create Payment Order
**Endpoint:** `POST /flight_payment/create_order`

### Verify & Book
**Endpoint:** `POST /flight_payment/verify_and_book`

---

## Frontend Implementation

### Service Layer
```js
// src/services/api/flightApi.js
import axiosInstance from './axiosInstance';

export const searchLocations = async (q, signal) => {
  const response = await axiosInstance.get('/tj/meta/locations', {
    params: { q },
    signal,
  });
  return response.data;
};

export const searchFlights = async (searchQuery) => {
  const response = await axiosInstance.post('/tj/fms/search', { searchQuery });
  return response.data;
};
```

### Hook Layer
```js
// src/hooks/useAirportSearch.js
import useAirportSearch from '../hooks/useAirportSearch';

const fromSearch = useAirportSearch(350);

// fromSearch.query - current input value
// fromSearch.setQuery(value) - update input
// fromSearch.suggestions - array of { iata, name, city, country, countryCode, cityCode, id, priority }
// fromSearch.loading - boolean loading state
// fromSearch.clearSuggestions() - reset state

// src/hooks/useFlight.js
import { useFlightSearch } from '../hooks/useFlight';

const { search, data, loading, error } = useFlightSearch();

// Fires direct + connecting in parallel, merges results
await search(searchQuery);

// data.ONWARD, data.RETURN, data.COMBO
```

### Component Usage
```jsx
// HeroPage.jsx
const fromSearch = useAirportSearch(350);
const toSearch = useAirportSearch(350);
const { search, loading } = useFlightSearch();

const handleSearchFlights = async () => {
  const searchQuery = {
    cabinClass: cabinClass.toUpperCase(),
    paxInfo: {
      ADULT: String(adults),
      CHILD: String(children),
      INFANT: "0"
    },
    routeInfos: [...],
    searchModifiers: { isDirectFlight: true, isConnectingFlight: true }
  };
  
  if (paxType !== "REGULAR") {
    searchQuery.paxType = paxType;
  }
  
  await search(searchQuery);
};
```

---

## Key Points

1. **All TripJack endpoints require `{ searchQuery: {...} }` wrapper**
2. **Airport search uses old endpoint** — `/flight_booking/airports`
3. **Payment endpoints unchanged** — `/flight_payment/...`
4. **Auth required for OMS endpoints** — handled by axiosInstance interceptors
5. **Search fires direct + connecting in parallel** — merged in `useFlightSearch` hook
6. **Deduplication by flight signature** — `${airlineCode}${flightNumber}-${depCode}-${arrCode}-${depTime}`
7. **Passenger types:** `REGULAR` (default), `STUDENT`, `SENIOR_CITIZEN`
8. **Cabin classes:** `ECONOMY`, `BUSINESS`, `FIRST`
