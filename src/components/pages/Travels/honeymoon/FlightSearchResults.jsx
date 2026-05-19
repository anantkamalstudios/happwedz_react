import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import FlightFiltersSidebar from './FlightFiltersSidebar';
import FlightSearchForm from './components/FlightSearchForm';
import FlightSearchHeader from './components/FlightSearchHeader';
import { BsLightning } from "react-icons/bs";
import { reviewFlight, getFareRule } from '../../../../services/api/flightApi';

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
  const [showDetails, setShowDetails] = useState({});
  const [activeTab, setActiveTab] = useState({});
  const [fareRuleData, setFareRuleData] = useState({});
  const [fareRuleLoading, setFareRuleLoading] = useState({});

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

    // Get priceIds for review
    const priceIds = [];
    if (selectedOutbound) {
      const outboundPriceId = selectedOutbound.totalPriceList[0]?.id;
      if (outboundPriceId) priceIds.push(outboundPriceId);
    }
    if (selectedReturn) {
      const returnPriceId = selectedReturn.totalPriceList[0]?.id;
      if (returnPriceId) priceIds.push(returnPriceId);
    }

    if (priceIds.length === 0) {
      alert('Unable to get flight pricing information');
      return;
    }

    setLoading(true);
    try {
      // Call review API to revalidate prices and get bookingId
      const reviewResponse = await reviewFlight(priceIds);
      
      if (!reviewResponse?.status?.success) {
        alert(reviewResponse?.status?.message || 'Failed to validate flight prices');
        return;
      }

      // Navigate to new booking flow
      navigate('/honeymoon/flights/book', {
        state: {
          outbound: selectedOutbound,
          return: selectedReturn,
          searchParams,
          reviewData: reviewResponse,
          bookingId: reviewResponse?.bookingId,
        },
      });
    } catch (error) {
      console.error('Error reviewing flight:', error);
      alert(error.response?.data?.message || 'Failed to proceed with booking. Please try again.');
    } finally {
      setLoading(false);
    }
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

    // Calculate if flight arrives next day
    const depDate = new Date(first.dt);
    const arrDate = new Date(last.at);
    const dayDiff = Math.round((arrDate - depDate) / 86400000);
    const isNextDay = dayDiff >= 1;

    // Multi-segment flight numbers
    const flightNumbers = flight.sI.map(s => `${s.fD.aI.code}-${s.fD.fN}`).join(', ');

    const handleTabClick = async (tab) => {
      setActiveTab(prev => ({ ...prev, [flightId]: tab }));
      
      if (tab === 'rules' && !fareRuleData[flightId] && !fareRuleLoading[flightId]) {
        setFareRuleLoading(prev => ({ ...prev, [flightId]: true }));
        try {
          const priceId = flight.totalPriceList[0]?.id;
          if (priceId) {
            const response = await getFareRule(priceId, 'SEARCH');
            setFareRuleData(prev => ({ ...prev, [flightId]: response }));
          }
        } catch (error) {
          console.error('Error fetching fare rules:', error);
          setFareRuleData(prev => ({ ...prev, [flightId]: { error: 'Failed to load fare rules' } }));
        } finally {
          setFareRuleLoading(prev => ({ ...prev, [flightId]: false }));
        }
      }
    };

    const calculateLayover = (prevSegment, nextSegment) => {
      const arrivalTime = new Date(prevSegment.at);
      const departureTime = new Date(nextSegment.dt);
      const layoverMinutes = Math.floor((departureTime - arrivalTime) / 60000);
      return formatDuration(layoverMinutes);
    };

    const getFareTypeName = (fareIdentifier) => {
      const map = {
        'PUBLISHED': 'Published',
        'SPECIAL_RETURN': 'Special Return',
        'SME': 'SME',
        'PROMO': 'Promo',
        'CORPORATE': 'Corporate',
        'FLEXI_PLUS': 'Flexi Plus',
      };
      return map[fareIdentifier] || fareIdentifier;
    };

    const currentTab = activeTab[flightId] || 'flight';
    const isDetailsOpen = showDetails[flightId] || false;

    return (
      <div
        key={flightId}
        className={`tj-flight-card ${isSelected ? 'selected' : ''}`}
      >
        {/* Header: Logo + Airline Name + Flight Numbers */}
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
            <div className="tj-flight-number">{flightNumbers}</div>
          </div>
        </div>

        {/* Route Section: DEP -> Duration/Stops -> ARR */}
        <div className="tj-flight-route">
          {/* Departure */}
          <div className="tj-route-section tj-route-dep">
            <div className="tj-iata-code">{first.da.code}</div>
            <div className="tj-time-value">{formatTime(first.dt)}</div>
            <div className="tj-time-date">{formatDate(first.dt).split(',').slice(0, 2).join(', ')}</div>
          </div>

          {/* Duration and Stop Line */}
          <div className="tj-route-center">
            <div className="tj-route-line-wrapper">
              <div className="tj-route-dot tj-route-dot-dep" />
              {stops > 0 && Array.from({ length: stops }).map((_, i) => (
                <div key={i} className="tj-route-stop-dot" />
              ))}
              <div className="tj-route-line" />
              <div className="tj-route-arrow">►</div>
              <div className="tj-route-dot tj-route-dot-arr" />
            </div>
            <div className="tj-duration-text">{formatDuration(duration)}</div>
            <div className={`tj-stops-badge ${stops === 0 ? 'nonstop' : ''}`}>
              {stops === 0 ? 'NON-STOP' : `${stops} Stop${stops > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Arrival */}
          <div className="tj-route-section tj-route-arr">
            <div className="tj-iata-code">{last.aa.code}</div>
            <div className="tj-time-value">{formatTime(last.at)}</div>
            <div className="tj-time-date">{formatDate(last.at).split(',').slice(0, 2).join(', ')}</div>
          </div>
        </div>

        {/* Next Day Notice */}
        {isNextDay && (
          <div className="tj-next-day-notice">
            ✈ Flight Arrives after {dayDiff} Day{dayDiff > 1 ? 's' : ''}
          </div>
        )}

        {/* Fare Options with Radio Buttons and Book/Compare Buttons */}
        <div className="tj-fare-options">
          {visibleFares.map((fare, idx) => {
            const price = fare.fd.ADULT.fC.TF;
            const fareType = fare.fareIdentifier;
            const badgeClass = 
              fareType === 'PUBLISHED' ? 'published' : 
              fareType === 'SME' ? 'sme' : 
              fareType === 'SPECIAL_RETURN' ? 'special' : 
              fareType === 'PROMO' ? 'promo' :
              fareType === 'CORPORATE' ? 'corporate' :
              fareType === 'FLEXI_PLUS' ? 'flexi' : 'promo';
            const isFirstFare = idx === 0;
            
            return (
              <div 
                key={idx} 
                className="tj-fare-option"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="radio"
                  name={`fare-${flightId}`}
                  defaultChecked={isFirstFare}
                  className="tj-fare-radio"
                />
                <div className="tj-fare-price">
                  ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className={`tj-fare-badge ${badgeClass}`}>
                  {getFareTypeName(fareType)}
                </div>
                <div className="tj-fare-details">
                  {fare.fd.ADULT.cc}, {fare.fd.ADULT.rT === 1 ? 'Refundable' : 'Non-Refundable'}
                </div>
                <div className="tj-fare-row-right">
                  {isFirstFare ? (
                    <button 
                      className="tj-book-fare-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectFlight({ ...flight, id: flightId }, type);
                        handleBook();
                      }}
                    >
                      BOOK
                    </button>
                  ) : (
                    <button className="tj-compare-btn">Compare</button>
                  )}
                </div>
              </div>
            );
          })}
          
          {flight.totalPriceList.length > 2 && (
            <div className="tj-fare-expand" onClick={(e) => { e.stopPropagation(); toggleFareExpansion(flightId); }}>
              {expanded ? 'Show less ▲' : `+${flight.totalPriceList.length - 2} more fares ▼`}
            </div>
          )}
        </div>

        {/* Footer: View Details + Seats Left */}
        <div className="tj-flight-footer">
          <div 
            className="tj-view-details" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setShowDetails(prev => ({ ...prev, [flightId]: !prev[flightId] }));
              if (!showDetails[flightId]) {
                setActiveTab(prev => ({ ...prev, [flightId]: 'flight' }));
              }
            }}
          >
            {isDetailsOpen ? 'Hide Details -' : 'View Details +'}
          </div>
          <div className="tj-seats-left">Seats left: {flight.totalPriceList[0]?.fd?.ADULT?.sR || 9}</div>
        </div>

        {isDetailsOpen && (
          <div className="tj-flight-details-panel" onClick={(e) => e.stopPropagation()}>
            <div className="tj-details-tabs">
              <div 
                className={`tj-details-tab ${currentTab === 'flight' ? 'active' : ''}`}
                onClick={() => handleTabClick('flight')}
              >
                Flight Details
              </div>
              <div 
                className={`tj-details-tab ${currentTab === 'fare' ? 'active' : ''}`}
                onClick={() => handleTabClick('fare')}
              >
                Fare Details
              </div>
              <div 
                className={`tj-details-tab ${currentTab === 'rules' ? 'active' : ''}`}
                onClick={() => handleTabClick('rules')}
              >
                Fare Rules
              </div>
            </div>
            
            <div className="tj-details-content">
              {currentTab === 'flight' && (
                <div className="tj-tab-flight-details">
                  <h4>Flight Information</h4>
                  {flight.sI.map((segment, idx) => (
                    <div key={idx}>
                      <div className="tj-segment-detail">
                        <div><strong>Flight:</strong> {segment.fD.aI.name} {segment.fD.fN}</div>
                        <div><strong>From:</strong> {segment.da.city} ({segment.da.code}) - {formatTime(segment.dt)}</div>
                        <div><strong>To:</strong> {segment.aa.city} ({segment.aa.code}) - {formatTime(segment.at)}</div>
                        <div><strong>Duration:</strong> {formatDuration(segment.duration)}</div>
                        {segment.fD.eT && <div><strong>Aircraft:</strong> {segment.fD.eT}</div>}
                        {segment.da.terminal && <div><strong>Terminal:</strong> {segment.da.terminal}</div>}
                      </div>
                      {idx < flight.sI.length - 1 && (
                        <div className="tj-layover-info">
                          Layover at {segment.aa.city}: {calculateLayover(segment, flight.sI[idx + 1])}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentTab === 'fare' && (
                <div className="tj-tab-fare-details">
                  <h4>Fare Breakdown</h4>
                  <table className="tj-fare-table">
                    <thead>
                      <tr>
                        <th>Fare Type</th>
                        <th>Cabin</th>
                        <th>Base Fare</th>
                        <th>Taxes & Fees</th>
                        <th>Total</th>
                        <th>Refundable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flight.totalPriceList.map((fare, idx) => (
                        <tr key={idx}>
                          <td>{getFareTypeName(fare.fareIdentifier)}</td>
                          <td>{fare.fd.ADULT.cc}</td>
                          <td>₹{Number(fare.fd.ADULT.fC.BF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td>₹{Number(fare.fd.ADULT.fC.TAF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td>₹{Number(fare.fd.ADULT.fC.TF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td>{fare.fd.ADULT.rT === 1 ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentTab === 'rules' && (
                <div className="tj-tab-fare-rules">
                  {fareRuleLoading[flightId] ? (
                    <div className="shimmer-card">
                      <div className="shimmer-line" style={{height:'20px', width:'100%', marginBottom:'12px'}} />
                      <div className="shimmer-line" style={{height:'16px', width:'90%', marginBottom:'8px'}} />
                      <div className="shimmer-line" style={{height:'16px', width:'85%', marginBottom:'8px'}} />
                      <div className="shimmer-line" style={{height:'16px', width:'80%'}} />
                    </div>
                  ) : fareRuleData[flightId]?.error ? (
                    <div className="tj-error-message">
                      {fareRuleData[flightId].error}
                    </div>
                  ) : fareRuleData[flightId]?.fareRule ? (
                    <div className="tj-fare-rules-content">
                      <h4>Fare Rules</h4>
                      {Object.keys(fareRuleData[flightId].fareRule).map((route, routeIdx) => {
                        const routeRules = fareRuleData[flightId].fareRule[route];
                        const fr = routeRules?.fr || {};
                        
                        return (
                          <div key={routeIdx} className="tj-route-rules">
                            <h5 className="tj-route-title">{route}</h5>
                            
                            {fr.CANCELLATION?.DEFAULT && (
                              <div className="tj-rule-section">
                                <h6>Cancellation Policy</h6>
                                <div className="tj-rule-item">
                                  <strong>Amount:</strong> ₹{Number(fr.CANCELLATION.DEFAULT.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="tj-rule-item">
                                  <strong>Additional Fee:</strong> ₹{Number(fr.CANCELLATION.DEFAULT.additionalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                {fr.CANCELLATION.DEFAULT.policyInfo && (
                                  <div className="tj-rule-item">
                                    <strong>Policy:</strong> {fr.CANCELLATION.DEFAULT.policyInfo}
                                  </div>
                                )}
                                {fr.CANCELLATION.DEFAULT.fcs && (
                                  <div className="tj-fee-breakdown">
                                    <strong>Fee Breakdown:</strong>
                                    <table className="tj-fee-table">
                                      <tbody>
                                        {fr.CANCELLATION.DEFAULT.fcs.CRF !== undefined && (
                                          <tr><td>CRF:</td><td>₹{Number(fr.CANCELLATION.DEFAULT.fcs.CRF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.CANCELLATION.DEFAULT.fcs.ARFT !== undefined && (
                                          <tr><td>ARFT:</td><td>₹{Number(fr.CANCELLATION.DEFAULT.fcs.ARFT).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.CANCELLATION.DEFAULT.fcs.CRFT !== undefined && (
                                          <tr><td>CRFT:</td><td>₹{Number(fr.CANCELLATION.DEFAULT.fcs.CRFT).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.CANCELLATION.DEFAULT.fcs.ARF !== undefined && (
                                          <tr><td>ARF:</td><td>₹{Number(fr.CANCELLATION.DEFAULT.fcs.ARF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {fr.DATECHANGE?.DEFAULT && (
                              <div className="tj-rule-section">
                                <h6>Date Change Policy</h6>
                                <div className="tj-rule-item">
                                  <strong>Amount:</strong> ₹{Number(fr.DATECHANGE.DEFAULT.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="tj-rule-item">
                                  <strong>Additional Fee:</strong> ₹{Number(fr.DATECHANGE.DEFAULT.additionalFee || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                                {fr.DATECHANGE.DEFAULT.policyInfo && (
                                  <div className="tj-rule-item">
                                    <strong>Policy:</strong> {fr.DATECHANGE.DEFAULT.policyInfo}
                                  </div>
                                )}
                                {fr.DATECHANGE.DEFAULT.fcs && (
                                  <div className="tj-fee-breakdown">
                                    <strong>Fee Breakdown:</strong>
                                    <table className="tj-fee-table">
                                      <tbody>
                                        {fr.DATECHANGE.DEFAULT.fcs.CRF !== undefined && (
                                          <tr><td>CRF:</td><td>₹{Number(fr.DATECHANGE.DEFAULT.fcs.CRF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.DATECHANGE.DEFAULT.fcs.ARFT !== undefined && (
                                          <tr><td>ARFT:</td><td>₹{Number(fr.DATECHANGE.DEFAULT.fcs.ARFT).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.DATECHANGE.DEFAULT.fcs.CRFT !== undefined && (
                                          <tr><td>CRFT:</td><td>₹{Number(fr.DATECHANGE.DEFAULT.fcs.CRFT).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                        {fr.DATECHANGE.DEFAULT.fcs.ARF !== undefined && (
                                          <tr><td>ARF:</td><td>₹{Number(fr.DATECHANGE.DEFAULT.fcs.ARF).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="tj-no-data">No fare rules available</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
      <FlightSearchHeader 
        searchParams={searchParams} 
        onModify={() => setModifyOpen(!modifyOpen)} 
      />

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
                    {/* <div className="tj-share-icons">
                      <MdShare size={15} className="tj-share-icon" />
                      <MdEmail size={15} className="tj-share-icon" />
                      <MdVisibility size={15} className="tj-share-icon" />
                    </div> */}
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
                      {/* <div className="tj-share-icons">
                        <MdShare size={15} className="tj-share-icon" />
                        <MdEmail size={15} className="tj-share-icon" />
                        <MdVisibility size={15} className="tj-share-icon" />
                      </div> */}
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

              <button className="tj-book-btn" onClick={handleBook} disabled={loading}>
                {loading ? 'Processing...' : 'BOOK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
