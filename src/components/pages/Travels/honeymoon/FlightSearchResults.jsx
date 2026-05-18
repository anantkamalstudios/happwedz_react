import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import FlightFiltersSidebar from './FlightFiltersSidebar';
import FlightSearchForm from './components/FlightSearchForm';
import { BsLightning } from "react-icons/bs";

const ShimmerCard = () => (
  <div className="shimmer-card">
    <div className="d-flex align-items-center gap-2 mb-3">
      <div className="shimmer-line shimmer-logo" />
      <div>
        <div className="shimmer-line shimmer-title" />
        <div className="shimmer-line" style={{height:'10px', width:'60px'}} />
      </div>
      <div className="ms-auto d-flex gap-4">
        <div className="shimmer-line shimmer-time" />
        <div className="shimmer-line" style={{height:'22px',width:'80px'}} />
        <div className="shimmer-line shimmer-time" />
      </div>
    </div>
    <div className="shimmer-line shimmer-price mb-2" />
    <div className="shimmer-line shimmer-badge" />
  </div>
);

export default function FlightSearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { searchParams, initialResults } = location.state || {};
  
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [filteredOutbound, setFilteredOutbound] = useState([]);
  const [filteredReturn, setFilteredReturn] = useState([]);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [sortOutbound, setSortOutbound] = useState('price');
  const [sortReturn, setSortReturn] = useState('price');
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    departure_time: [],
    arrival_time: [],
    departure_return_time: [],
    arrival_return_time: [],
    baggage: [],
    price_min: null,
    price_max: null,
  });
  const [filtersMeta, setFiltersMeta] = useState(null);
  const [expandedFares, setExpandedFares] = useState({});
  const [modifyOpen, setModifyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchParams || !initialResults) {
      navigate('/honeymoon');
      return;
    }

    setLoading(true);
    processInitialResults(initialResults);
    setLoading(false);
  }, [searchParams, initialResults, navigate]);

  const processInitialResults = (results) => {
    const directTrips = results.direct?.searchResult?.tripInfos || {};
    const connectingTrips = results.connecting?.searchResult?.tripInfos || {};

    const mergedOnward = dedupeFlights([
      ...(directTrips.ONWARD || []),
      ...(connectingTrips.ONWARD || []),
    ]);

    const mergedReturn = dedupeFlights([
      ...(directTrips.RETURN || []),
      ...(connectingTrips.RETURN || []),
    ]);

    setOutboundFlights(mergedOnward);
    setReturnFlights(mergedReturn);
    setFilteredOutbound(mergedOnward);
    setFilteredReturn(mergedReturn);

    computeFiltersMeta(mergedOnward, mergedReturn);
  };

  const dedupeFlights = (flights) => {
    const seen = new Set();
    return flights.filter(flight => {
      const key = getFlightKey(flight);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const getFlightKey = (flight) => {
    const first = flight.sI[0];
    const last = flight.sI[flight.sI.length - 1];
    return `${first.fD.aI.code}${first.fD.fN}-${first.da.code}-${last.aa.code}-${first.dt}`;
  };

  const computeFiltersMeta = (onward, returnFlights) => {
    const allFlights = [...onward, ...returnFlights];
    
    const stopsMap = new Map();
    const airlinesMap = new Map();
    let minPrice = Infinity;
    let maxPrice = 0;

    allFlights.forEach(flight => {
      const stops = flight.sI.length - 1;
      const airline = flight.sI[0].fD.aI;
      const price = flight.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0;

      if (!stopsMap.has(stops)) {
        stopsMap.set(stops, { value: stops, count: 0, min_price: Infinity });
      }
      const stopData = stopsMap.get(stops);
      stopData.count++;
      stopData.min_price = Math.min(stopData.min_price, price);

      if (!airlinesMap.has(airline.code)) {
        airlinesMap.set(airline.code, {
          code: airline.code,
          name: airline.name,
          logo: `https://airlines.airhex.com/airlines-logo/${airline.code.toLowerCase()}.png`,
          count: 0,
          min_price: Infinity,
        });
      }
      const airlineData = airlinesMap.get(airline.code);
      airlineData.count++;
      airlineData.min_price = Math.min(airlineData.min_price, price);

      minPrice = Math.min(minPrice, price);
      maxPrice = Math.max(maxPrice, price);
    });

    setFiltersMeta({
      stops: Array.from(stopsMap.values()),
      airlines: Array.from(airlinesMap.values()),
      price: { min: minPrice, max: maxPrice },
    });
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortOutbound, sortReturn, outboundFlights, returnFlights]);

  const applyFiltersAndSort = () => {
    setFilteredOutbound(filterAndSort(outboundFlights, sortOutbound));
    setFilteredReturn(filterAndSort(returnFlights, sortReturn));
  };

  const filterAndSort = (flights, sortBy) => {
    let filtered = flights.filter(flight => {
      const stops = flight.sI.length - 1;
      const airline = flight.sI[0].fD.aI.code;
      const price = flight.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0;
      const depHour = parseInt(flight.sI[0].dt.split('T')[1].split(':')[0]);

      if (filters.stops.length > 0 && !filters.stops.includes(stops)) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(airline)) return false;
      if (filters.price_min && price < filters.price_min) return false;
      if (filters.price_max && price > filters.price_max) return false;
      
      if (filters.departure_time.length > 0) {
        const inRange = filters.departure_time.some(range => {
          const [start, end] = range.split('-').map(Number);
          return depHour >= start && depHour < end;
        });
        if (!inRange) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      const priceA = a.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0;
      const priceB = b.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0;
      const durationA = a.sI.reduce((sum, seg) => sum + seg.duration, 0);
      const durationB = b.sI.reduce((sum, seg) => sum + seg.duration, 0);

      switch (sortBy) {
        case 'price':
          return priceA - priceB;
        case 'duration':
          return durationA - durationB;
        case 'departure':
          return new Date(a.sI[0].dt) - new Date(b.sI[0].dt);
        case 'arrival':
          return new Date(a.sI[a.sI.length - 1].at) - new Date(b.sI[b.sI.length - 1].at);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (['stops', 'airlines', 'departure_time', 'arrival_time', 'departure_return_time', 'arrival_return_time', 'baggage'].includes(filterType)) {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(v => v !== value);
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = value;
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      stops: [],
      airlines: [],
      departure_time: [],
      arrival_time: [],
      departure_return_time: [],
      arrival_return_time: [],
      baggage: [],
      price_min: null,
      price_max: null,
    });
  };

  const toggleFareExpansion = (flightId) => {
    setExpandedFares(prev => ({ ...prev, [flightId]: !prev[flightId] }));
  };

  const selectFlight = (flight, type) => {
    if (type === 'outbound') {
      setSelectedOutbound(selectedOutbound?.id === flight.id ? null : flight);
    } else {
      setSelectedReturn(selectedReturn?.id === flight.id ? null : flight);
    }
  };

  const handleBook = async () => {
    if (!selectedOutbound) {
      alert('Please select an outbound flight');
      return;
    }
    if (searchParams.tripType === 'round' && !selectedReturn) {
      alert('Please select a return flight');
      return;
    }

    navigate('/honeymoon/flights/booking', {
      state: {
        outbound: selectedOutbound,
        return: selectedReturn,
        searchParams,
      },
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getCheapest = (flights) => {
    if (!flights.length) return null;
    return flights.reduce((min, f) => {
      const price = f.totalPriceList[0]?.fd?.ADULT?.fC?.TF || Infinity;
      const minPrice = min.totalPriceList[0]?.fd?.ADULT?.fC?.TF || Infinity;
      return price < minPrice ? f : min;
    });
  };

  const getFastest = (flights) => {
    if (!flights.length) return null;
    return flights.reduce((min, f) => {
      const duration = f.sI.reduce((sum, seg) => sum + seg.duration, 0);
      const minDuration = min.sI.reduce((sum, seg) => sum + seg.duration, 0);
      return duration < minDuration ? f : min;
    });
  };

  const renderFlight = (flight, type) => {
    const first = flight.sI[0];
    const last = flight.sI[flight.sI.length - 1];
    const airline = first.fD.aI;
    const stops = flight.sI.length - 1;
    const duration = flight.sI.reduce((sum, seg) => sum + seg.duration, 0);
    const isSelected = type === 'outbound' ? selectedOutbound?.id === flight.id : selectedReturn?.id === flight.id;
    const flightId = flight.id || getFlightKey(flight);
    const expanded = expandedFares[flightId];
    const visibleFares = expanded ? flight.totalPriceList : flight.totalPriceList.slice(0, 2);

    return (
      <div
        key={flightId}
        className={`tj-flight-card ${isSelected ? 'selected' : ''}`}
        onClick={() => selectFlight({ ...flight, id: flightId }, type)}
      >
        <div className="tj-flight-header">
          <img
            src={`https://airlines.airhex.com/airlines-logo/${airline.code.toLowerCase()}.png`}
            alt={airline.name}
            className="tj-airline-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="tj-airline-fallback">{airline.code}</div>
          <div className="tj-airline-info">
            <div className="tj-airline-name">{airline.name}</div>
            <div className="tj-flight-number">{first.fD.fN}</div>
          </div>
        </div>

        <div className="tj-flight-route">
          <div className="tj-flight-time">
            <div className="tj-time-value">{formatTime(first.dt)}</div>
            <div className="tj-time-date">{formatDate(first.dt).split(',')[0]}</div>
          </div>

          <div className="tj-flight-duration">
            <div className="tj-duration-line"></div>
            <div className="tj-duration-text">{formatDuration(duration)}</div>
            <div className={`tj-stops-badge ${stops === 0 ? 'nonstop' : ''}`}>
              {stops === 0 ? 'Non-Stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
            </div>
          </div>

          <div className="tj-flight-time">
            <div className="tj-time-value">{formatTime(last.at)}</div>
            <div className="tj-time-date">{formatDate(last.at).split(',')[0]}</div>
          </div>
        </div>

        <div className="tj-fare-options">
          {visibleFares.map((fare, idx) => {
            const price = fare.fd.ADULT.fC.TF;
            const fareType = fare.fareIdentifier;
            const badgeClass = fareType === 'PUBLISHED' ? 'published' : fareType === 'SME' ? 'sme' : fareType === 'SPECIAL_RETURN' ? 'special' : 'promo';
            
            return (
              <div key={idx} className="tj-fare-option">
                <div className="tj-fare-price">
                  ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  <FiEdit2 size={12} className="tj-fare-edit" />
                </div>
                <div className={`tj-fare-badge ${badgeClass}`}>
                  {fareType === 'PUBLISHED' ? 'Published' : fareType === 'SME' ? 'SME' : fareType === 'SPECIAL_RETURN' ? 'Special Return' : fareType}
                </div>
                <div className="tj-fare-details">
                  {fare.fd.ADULT.cc}, {fare.fd.ADULT.rT === 1 ? 'Refundable' : 'Non-Refundable'}
                </div>
              </div>
            );
          })}
          
          {flight.totalPriceList.length > 2 && (
            <div className="tj-fare-expand" onClick={(e) => { e.stopPropagation(); toggleFareExpansion(flightId); }}>
              {expanded ? 'Show less' : `+${flight.totalPriceList.length - 2} more fares`} {expanded ? '▲' : '▼'}
            </div>
          )}
        </div>

        <div className="tj-flight-footer">
          <div className="tj-view-details">View Details +</div>
          <div className="tj-seats-left">Seats left: {flight.totalPriceList[0]?.fd?.ADULT?.sR || 9}</div>
        </div>
      </div>
    );
  };

  const cheapestOutbound = getCheapest(filteredOutbound);
  const fastestOutbound = getFastest(filteredOutbound);
  const cheapestReturn = getCheapest(filteredReturn);
  const fastestReturn = getFastest(filteredReturn);

  const totalPrice = (selectedOutbound?.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0) + 
                     (selectedReturn?.totalPriceList[0]?.fd?.ADULT?.fC?.TF || 0);

  const isRoundTrip = searchParams?.tripType === 'round';

  return (
    <div className="tj-results-page">
      <div className="tj-nav-bar">
        <div className="container-fluid">
          <div className="tj-nav-content">
            <div className="tj-nav-route">
              {searchParams?.from} ⇄ {searchParams?.to}
            </div>
            <div className="tj-nav-dates">
              Departure Date: {formatDate(searchParams?.departureDate)}
            </div>
            {isRoundTrip && (
              <div className="tj-nav-dates">
                Return Date: {formatDate(searchParams?.returnDate)}
              </div>
            )}
            <div className="tj-nav-pax">
              {searchParams?.adults} Adult{searchParams?.adults > 1 ? 's' : ''} | {searchParams?.cabinClass?.toUpperCase()}
            </div>
            <div className="tj-nav-airline">
              Preferred Airline: {searchParams?.preferredAirline || 'None'}
            </div>
            <div className="tj-modify-btn" onClick={() => setModifyOpen(!modifyOpen)}>
              MODIFY SEARCH {modifyOpen ? '▲' : '▼'}
            </div>
          </div>
        </div>
      </div>

      {modifyOpen && (
        <div className="tj-modify-panel">
          <div className="container">
            <FlightSearchForm />
          </div>
        </div>
      )}

      <div className="tj-quickselect-strip">
        <div className="container">
          <div className="row">
            <div className={isRoundTrip ? 'col-lg-6' : 'col-12'}>
              <div className="tj-quickselect-group">
                {cheapestOutbound && (
                  <div className="tj-quickselect-item" onClick={() => selectFlight({ ...cheapestOutbound, id: getFlightKey(cheapestOutbound) }, 'outbound')}>
                    <span className="tj-quickselect-label">₹ Cheapest</span>
                    <span className="tj-quickselect-price">
                      ₹{Number(cheapestOutbound.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="tj-quickselect-duration">
                      Duration: {formatDuration(cheapestOutbound.sI.reduce((sum, seg) => sum + seg.duration, 0))}
                    </span>
                  </div>
                )}
                {fastestOutbound && (
                  <div className="tj-quickselect-item" onClick={() => selectFlight({ ...fastestOutbound, id: getFlightKey(fastestOutbound) }, 'outbound')}>
                    <span className="tj-quickselect-label"><BsLightning /> Fastest</span>
                    <span className="tj-quickselect-price">
                      ₹{Number(fastestOutbound.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="tj-quickselect-duration">
                      Duration: {formatDuration(fastestOutbound.sI.reduce((sum, seg) => sum + seg.duration, 0))}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {isRoundTrip && (
              <div className="col-lg-6">
                <div className="tj-quickselect-group">
                  {cheapestReturn && (
                    <div className="tj-quickselect-item" onClick={() => selectFlight({ ...cheapestReturn, id: getFlightKey(cheapestReturn) }, 'return')}>
                      <span className="tj-quickselect-label">₹ Cheapest</span>
                      <span className="tj-quickselect-price">
                        ₹{Number(cheapestReturn.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="tj-quickselect-duration">
                        Duration: {formatDuration(cheapestReturn.sI.reduce((sum, seg) => sum + seg.duration, 0))}
                      </span>
                    </div>
                  )}
                  {fastestReturn && (
                    <div className="tj-quickselect-item" onClick={() => selectFlight({ ...fastestReturn, id: getFlightKey(fastestReturn) }, 'return')}>
                      <span className="tj-quickselect-label">⚡ Fastest</span>
                      <span className="tj-quickselect-price">
                        ₹{Number(fastestReturn.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="tj-quickselect-duration">
                        Duration: {formatDuration(fastestReturn.sI.reduce((sum, seg) => sum + seg.duration, 0))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-3">
            <FlightFiltersSidebar
              filtersMeta={filtersMeta}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              searchParams={searchParams}
            />
          </div>

          <div className="col-lg-9 ">
            <div className="row">
              <div className={isRoundTrip ? 'col-lg-6' : 'col-12'}>
                <div className="tj-flights-column">
                  <div className="tj-column-header">
                    <div className="tj-column-title">
                      {searchParams?.from} → {searchParams?.to} <span className="tj-column-date">{formatDate(searchParams?.departureDate)}</span>
                    </div>
                  </div>

                  <div className="tj-sort-tabs">
                    <span className="tj-sort-label">Sort By:</span>
                    {['duration', 'departure', 'arrival', 'price'].map(sort => (
                      <div
                        key={sort}
                        className={`tj-sort-tab ${sortOutbound === sort ? 'active' : ''}`}
                        onClick={() => setSortOutbound(sort)}
                      >
                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                      </div>
                    ))}
                  </div>

                  <div className="tj-flights-list">
                    {loading ? (
                      [1, 2, 3, 4].map(i => <ShimmerCard key={i} />)
                    ) : filteredOutbound.length === 0 ? (
                      <div className="no-results">No flights found</div>
                    ) : (
                      filteredOutbound.map(flight => renderFlight(flight, 'outbound'))
                    )}
                  </div>
                </div>
              </div>

              {isRoundTrip && (
                <div className="col-lg-6">
                  <div className="tj-flights-column">
                    <div className="tj-column-header">
                      <div className="tj-column-title">
                        {searchParams?.to} → {searchParams?.from} <span className="tj-column-date">{formatDate(searchParams?.returnDate)}</span>
                      </div>
                    </div>

                    <div className="tj-sort-tabs">
                      <span className="tj-sort-label">Sort By:</span>
                      {['duration', 'departure', 'arrival', 'price'].map(sort => (
                        <div
                          key={sort}
                          className={`tj-sort-tab ${sortReturn === sort ? 'active' : ''}`}
                          onClick={() => setSortReturn(sort)}
                        >
                          {sort.charAt(0).toUpperCase() + sort.slice(1)}
                        </div>
                      ))}
                    </div>

                    <div className="tj-flights-list">
                      {loading ? (
                        [1, 2, 3, 4].map(i => <ShimmerCard key={i} />)
                      ) : filteredReturn.length === 0 ? (
                        <div className="no-results">No flights found</div>
                      ) : (
                        filteredReturn.map(flight => renderFlight(flight, 'return'))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(selectedOutbound || selectedReturn) && (
        <div className="tj-booking-bar">
          <div className="container-fluid">
            <div className="tj-booking-content">
              {selectedOutbound && (
                <div className="tj-booking-flight">
                  <img
                    src={`https://airlines.airhex.com/airlines-logo/${selectedOutbound.sI[0].fD.aI.code.toLowerCase()}.png`}
                    alt={selectedOutbound.sI[0].fD.aI.name}
                    className="tj-booking-logo"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="tj-booking-flight-no">{selectedOutbound.sI[0].fD.fN}</span>
                  <span className="tj-booking-route">
                    {formatTime(selectedOutbound.sI[0].dt)} → {formatTime(selectedOutbound.sI[selectedOutbound.sI.length - 1].at)}
                  </span>
                  <span className="tj-booking-cities">
                    {selectedOutbound.sI[0].da.code}→{selectedOutbound.sI[selectedOutbound.sI.length - 1].aa.code}
                  </span>
                  <span className="tj-booking-price">
                    ₹{Number(selectedOutbound.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {selectedReturn && (
                <div className="tj-booking-flight">
                  <img
                    src={`https://airlines.airhex.com/airlines-logo/${selectedReturn.sI[0].fD.aI.code.toLowerCase()}.png`}
                    alt={selectedReturn.sI[0].fD.aI.name}
                    className="tj-booking-logo"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="tj-booking-flight-no">{selectedReturn.sI[0].fD.fN}</span>
                  <span className="tj-booking-route">
                    {formatTime(selectedReturn.sI[0].dt)} → {formatTime(selectedReturn.sI[selectedReturn.sI.length - 1].at)}
                  </span>
                  <span className="tj-booking-cities">
                    {selectedReturn.sI[0].da.code}→{selectedReturn.sI[selectedReturn.sI.length - 1].aa.code}
                  </span>
                  <span className="tj-booking-price">
                    ₹{Number(selectedReturn.totalPriceList[0].fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="tj-booking-total">
                ₹{Number(totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })} total
              </div>

              <button className="tj-book-btn" onClick={handleBook}>
                BOOK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
