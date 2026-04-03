import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, MapPin, Clock, ArrowRight, Luggage, Filter, SlidersHorizontal } from 'lucide-react';
import { searchFlights, verifyOffer, createFlightPaymentOrder, verifyAndBookFlight } from '../../../../services/api/flightApi';
import FlightFiltersSidebar from './FlightFiltersSidebar';
import BookingForm from './BookingForm';

const FlightSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('price'); // price, duration, departure
  const [verifyingFlight, setVerifyingFlight] = useState(null);
  const [verificationError, setVerificationError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [verifiedFlightData, setVerifiedFlightData] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [pendingBookingPayload, setPendingBookingPayload] = useState(null);
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    departure_time: [],
    price_min: null,
    price_max: null,
    baggage_included: true,
    refundable: true
  });
  const [filtersMeta, setFiltersMeta] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get search parameters and any initial results from location state
  const searchParams = location.state?.searchParams;
  const initialResults = location.state?.initialResults;

  useEffect(() => {
    // Load Razorpay Checkout script (required for window.Razorpay)
    const existing = document.querySelector('script[data-razorpay="checkout"]');
    if (existing) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpay = 'checkout';

    script.onload = () => console.log('Razorpay checkout loaded');
    script.onerror = () => console.error('Failed to load Razorpay checkout');

    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!searchParams) {
      navigate('/honeymoon');
      return;
    }

    // If hero page already fetched results, use them without re-calling API
    if (initialResults && initialResults.status && initialResults.data) {
      setFlights(initialResults.data);
      setFiltersMeta(initialResults.filters_meta);
      setActiveFilters(initialResults.active_filters);
      setPagination(initialResults.pagination);
      setCurrentPage(initialResults.pagination?.current_page || 1);
      setLoading(false);
    } else {
      searchFlightsData();
    }
  }, [searchParams, initialResults]);

  const searchFlightsData = async (page = 1, appliedFilters = filters) => {
    setLoading(true);
    setError(null);

    try {
      const requestParams = {
        ...searchParams,
        page: page,
        filters: appliedFilters
      };

      const response = await searchFlights(requestParams);

      if (response.status && response.data) {
        setFlights(response.data);
        setFiltersMeta(response.filters_meta);
        setActiveFilters(response.active_filters);
        setPagination(response.pagination);
        setCurrentPage(response.pagination?.current_page || 1);
      } else {
        setError('No flights found for your search criteria');
      }
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortFlights = (flightsToSort) => {
    const sorted = [...flightsToSort];

    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.price - b.price);
      case 'duration':
        return sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
      case 'departure':
        return sorted.sort((a, b) => new Date(a.departure) - new Date(b.departure));
      default:
        return sorted;
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFlightSelect = async (flight, fare) => {
    const flightId = `${flight.flight_no}-${fare.offer_id}`;
    setVerifyingFlight(flightId);
    setVerificationError(null);
    
    try {
      // Verify the flight offer first
      const verification = await verifyOffer(fare.provider, fare.offer_id);
      
      if (verification.status) {
        // Verification successful, show booking form
        setSelectedFlight({ ...flight, selectedFare: fare });
        setVerifiedFlightData(verification);
        setShowBookingForm(true);
      } else {
        // Verification failed
        setVerificationError(verification.message || 'Flight verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Flight verification error:', err);
      setVerificationError(err.response?.data?.message || err.message || 'Failed to verify flight. Please try again.');
    } finally {
      setVerifyingFlight(null);
    }
  };

  const handleBookingSubmit = async (paymentData) => {
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      // Keep a copy so we can prefill Razorpay and verify+book on success
      setPendingBookingPayload(paymentData);
      const paymentResponse = await createFlightPaymentOrder(paymentData);
      
      if (paymentResponse.status) {
        // Payment order created successfully
        console.log('Payment order created:', paymentResponse);
        
        // Open Razorpay payment modal
        if (paymentResponse.razorpay_order_id && paymentResponse.key_id) {
          openRazorpayPayment(paymentResponse, paymentData);
        } else {
          alert('Payment order created! Please proceed with payment.');
          setShowBookingForm(false);
        }
      } else {
        setBookingError(paymentResponse.message || 'Payment order creation failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment order error:', err);
      setBookingError(err.response?.data?.message || err.message || 'Failed to create payment order. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const openRazorpayPayment = (orderData, bookingPayload) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      console.error('Razorpay not loaded yet');
      alert('Payment gateway is loading. Please try again in a moment.');
      return;
    }

    // Add a small delay to ensure Razorpay is fully initialized
    setTimeout(() => {
      const options = {
        key: orderData.key_id,
        amount: Math.round(orderData.amount * 100), // INR -> paise
        currency: orderData.currency || 'INR',
        name: 'Flight Booking',
        description: bookingPayload
          ? `Flight ${bookingPayload.from} to ${bookingPayload.to}`
          : 'Flight booking payment',
        order_id: orderData.razorpay_order_id,
        prefill: bookingPayload?.contact ? {
          email: bookingPayload.contact.email,
          contact: bookingPayload.contact.phone,
        } : undefined,
        handler: async function (response) {
          console.log('Razorpay payment success:', response);
          
          try {
            if (!response?.razorpay_payment_id) {
              alert('Payment failed. Please try again.');
              return;
            }

            setBookingLoading(true);

            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await verifyAndBookFlight(verifyPayload);

            if (verifyRes?.status) {
              alert(`Payment successful! Flight booked. PNR: ${verifyRes.pnr || ''}`);
              setShowBookingForm(false);
              setPendingBookingPayload(null);
            } else {
              alert(verifyRes?.message || 'Payment verified but booking failed.');
            }
          } catch (err) {
            console.error('verify_and_book error:', err);
            alert(err.response?.data?.message || err.message || 'Payment verification failed.');
          } finally {
            setBookingLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            console.log('Razorpay modal closed');
          }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        alert('Payment initialization failed. Please refresh and try again.');
      }
    }, 150); // small delay
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedFlight(null);
    setVerifiedFlightData(null);
    setBookingError(null);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };

    if (filterType === 'stops' || filterType === 'airlines' || filterType === 'departure_time') {
      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }
    } else {
      newFilters[filterType] = value;
    }

    setFilters(newFilters);
    searchFlightsData(1, newFilters);
  };

  const handlePageChange = (page) => {
    searchFlightsData(page, filters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      stops: [],
      airlines: [],
      departure_time: [],
      price_min: null,
      price_max: null,
      baggage_included: true,
      refundable: true
    };
    setFilters(defaultFilters);
    searchFlightsData(1, defaultFilters);
  };

  const handleBackToSearch = () => {
    navigate('/honeymoon');
  };

  const sortedFlights = sortFlights(flights);

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBackToSearch}>
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={handleBackToSearch}
          >
            ← Back to Search
          </button>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2 d-flex align-items-center gap-2">
                <Plane size={22} />
                Flight Search Results
              </h2>
              {searchParams && (
                <p className="text-muted">
                  <MapPin size={14} className="me-1" />
                  {searchParams.from} <ArrowRight size={14} className="mx-1" /> {searchParams.to} • {formatDate(searchParams.date)} •
                  {searchParams.return_date ? ` Return: ${formatDate(searchParams.return_date)}` : ' One-way'} •
                  {searchParams.adults} {searchParams.adults === 1 ? 'Adult' : 'Adults'}
                  {searchParams.children > 0 && `, ${searchParams.children} ${searchParams.children === 1 ? 'Child' : 'Children'}`}
                </p>
              )}
            </div>

            <div className="d-flex align-items-center gap-3">
              {pagination && (
                <span className="badge bg-success d-flex align-items-center gap-1">
                  <SlidersHorizontal size={14} />
                  {pagination.total} flights found
                </span>
              )}
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price">Sort by Price</option>
                <option value="duration">Sort by Duration</option>
                <option value="departure">Sort by Departure</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 mb-4">
          <FlightFiltersSidebar
            filtersMeta={filtersMeta}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Flight Results */}
        <div className="col-lg-9">
          {loading ? (
            // Skeleton cards while loading, filters stay visible
            <div>
              {[1, 2, 3].map((i) => (
                <div className="flight-results mb-3" key={i}>
                  <div className="flight-item placeholder-glow">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="airline-logo d-flex align-items-center justify-content-center">
                          <Plane size={18} />
                        </div>
                        <div>
                          <div className="placeholder col-6 mb-1"></div>
                          <div className="placeholder col-4"></div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="placeholder col-4 mb-1"></div>
                        <div className="placeholder col-6"></div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex flex-column align-items-start gap-1">
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-3"></span>
                      </div>
                      <div className="d-flex flex-column align-items-center gap-1">
                        <Clock size={18} className="text-muted" />
                        <span className="placeholder col-4"></span>
                      </div>
                      <div className="d-flex flex-column align-items-end gap-1">
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-3"></span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <Luggage size={16} className="text-muted" />
                        <span className="placeholder col-5"></span>
                      </div>
                      <button className="select-button" disabled>
                        <span className="placeholder col-6"></span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedFlights.length === 0 ? (
            <div className="alert alert-info text-center">
              <h4>No Flights Found</h4>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="flight-results">
              {sortedFlights.map((flight, index) => (
                <div key={index} className="flight-item">
                  <div className="flight-header">
                    <div className="flight-airline">
                      <img src={flight.airline_logo} alt={flight.airline_name} style={{ width: '40px', height: '40px', marginRight: '12px' }} />
                      <div>
                        <div>{flight.airline_name} {flight.flight_no}</div>
                        {flight.operating_airline !== flight.airline && (
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                            Operated by {flight.operating_airline}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flight-price">
                      ₹{flight.price.toFixed(0)}
                      <div style={{ fontSize: '12px', color: '#999', fontWeight: '500', marginTop: '2px' }}>
                        per adult
                      </div>
                    </div>
                  </div>

                  <div className="flight-details">
                    <div className="flight-time">
                      <div className="flight-time-value">{formatTime(flight.departure)}</div>
                      <div className="flight-time-label">{flight.origin}</div>
                      <div className="flight-time-date">{formatDate(flight.departure)}</div>
                      {flight.departure_terminal && (
                        <div className="mt-1" style={{ fontSize: '11px', color: '#666' }}>
                          Terminal {flight.departure_terminal}
                        </div>
                      )}
                    </div>

                    <div className="flight-duration">
                      <div>{flight.duration}</div>
                      <div className="flight-stops">
                        {flight.stops === 0 ? ' Direct' : ` ${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                      </div>
                      {flight.layovers && flight.layovers.length > 0 && (
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                          via {flight.layovers[0].airport}
                        </div>
                      )}
                    </div>

                    <div className="flight-time">
                      <div className="flight-time-value">{formatTime(flight.arrival)}</div>
                      <div className="flight-time-label">{flight.destination}</div>
                      <div className="flight-time-date">{formatDate(flight.arrival)}</div>
                      {flight.arrival_terminal && (
                        <div className="mt-1" style={{ fontSize: '11px', color: '#666' }}>
                          Terminal {flight.arrival_terminal}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flight-amenities">
                    <div className="amenity-badge">
                      {flight.fares[0]?.cabin_class || 'Economy'}
                    </div>
                    <div className="amenity-badge">
                      {flight.fares[0]?.baggage || '15KG'}
                    </div>
                    <div className={`amenity-badge ${flight.stops === 0 ? 'direct' : 'stops'}`}>
                      {flight.stops === 0 ? ' Direct Flight' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                    <div className="amenity-badge seats-badge">
                      {flight.fares[0]?.seats_available || 9} seats left
                    </div>
                    {flight.aircraft && (
                      <div className="amenity-badge">
                        ✈️ {flight.aircraft}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ fontSize: '13px', color: '#666' }}>

                      <span style={{ fontWeight: '600', marginLeft: '8px' }}>Aircraft:</span> {flight.aircraft_name || flight.aircraft}
                    </div>
                    <button 
                      className="select-button"
                      onClick={() => handleFlightSelect(flight, flight.fares[0])}
                      disabled={verifyingFlight === `${flight.flight_no}-${flight.fares[0]?.offer_id}`}
                    >
                      {verifyingFlight === `${flight.flight_no}-${flight.fares[0]?.offer_id}` ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Verifying...
                        </>
                      ) : (
                        'Select Flight'
                      )}
                    </button>
                    
                    {/* Show verification error for this flight */}
                    {verificationError && verifyingFlight === null && (
                      <div className="verification-error mt-2">
                        <small className="text-danger">{verificationError}</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${!pagination.has_prev ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.has_prev}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(pagination.total_pages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      })}
                      <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.has_next}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedFlight && (
        <div className="booking-modal-overlay" onClick={closeBookingForm}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h4>Complete Your Booking</h4>
              <button className="close-btn" onClick={closeBookingForm}>×</button>
            </div>
            
            <div className="booking-modal-body">
              {/* Flight Summary */}
              <div className="flight-summary-card">
                <div className="d-flex align-items-center mb-3">
                  <img src={selectedFlight.airline_logo} alt={selectedFlight.airline_name} style={{ width: '40px', height: '40px', marginRight: '12px' }} />
                  <div>
                    <h6 className="mb-0">{selectedFlight.airline_name} {selectedFlight.flight_no}</h6>
                    <small className="text-muted">{selectedFlight.origin} → {selectedFlight.destination}</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="h6 mb-0">{formatTime(selectedFlight.departure)} - {formatTime(selectedFlight.arrival)}</div>
                    <small className="text-muted">{formatDate(selectedFlight.departure)}</small>
                  </div>
                  <div className="text-end">
                    <div className="h5 mb-0 text-primary">₹{verifiedFlightData?.price || selectedFlight.selectedFare?.price}</div>
                    <small className="text-muted">Verified Price</small>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <BookingForm 
                flight={selectedFlight}
                verifiedData={verifiedFlightData}
                searchParams={searchParams}
                onSubmit={handleBookingSubmit}
                loading={bookingLoading}
                error={bookingError}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .flight-results {
          margin-top: 24px;
          background: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          border: 1px solid rgba(237, 17, 115, 0.1);
        }

        .flight-item {
          border: 2px solid #f8f9fa;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
          position: relative;
          overflow: hidden;
        }

        .flight-item:hover {
          border-color: #ed1173;
          box-shadow: 0 15px 40px rgba(237, 17, 115, 0.15);
          transform: translateY(-2px);
        }

        .flight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f8f9fa;
        }

        .flight-airline {
          font-weight: 800;
          color: #1a1a2e;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .airline-logo {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ed1173, #ff6b9d);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .flight-price {
          font-size: 24px;
          font-weight: 900;
          color: #ed1173;
          text-shadow: 0 2px 4px rgba(237, 17, 115, 0.1);
        }

        .flight-details {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 30px;
          align-items: center;
          margin-bottom: 20px;
        }

        .flight-time {
          text-align: center;
        }

        .flight-time-value {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a2e;
          margin-bottom: 4px;
        }

        .flight-time-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 2px;
          font-weight: 600;
        }

        .flight-time-date {
          font-size: 12px;
          color: #999;
          font-weight: 500;
        }

        .flight-duration {
          text-align: center;
          color: #666;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 16px;
          background: rgba(237, 17, 115, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(237, 17, 115, 0.1);
        }

        .flight-stops {
          font-size: 12px;
          color: #ed1173;
          margin-top: 6px;
          font-weight: 700;
        }

        .flight-amenities {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .amenity-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f8f9fa;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          border: 1px solid #e9ecef;
        }

        .amenity-badge.direct {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border-color: rgba(76, 175, 80, 0.2);
        }

        .amenity-badge.stops {
          background: rgba(255, 152, 0, 0.1);
          color: #ff9800;
          border-color: rgba(255, 152, 0, 0.2);
        }

        .seats-badge {
          background: rgba(233, 30, 99, 0.1);
          color: #e91e63;
          border-color: rgba(233, 30, 99, 0.2);
        }

        .select-button {
          background: linear-gradient(135deg, #ed1173, #ff6b9d);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(237, 17, 115, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .select-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(237, 17, 115, 0.4);
        }

        .select-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .verification-error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 8px 12px;
          margin-top: 8px;
        }

        .spinner-border-sm {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        /* Booking Modal Styles */
        .booking-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .booking-modal {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .booking-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: between;
          align-items: center;
        }

        .booking-modal-header h4 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #f8f9fa;
          color: #333;
        }

        .booking-modal-body {
          padding: 24px;
        }

        .flight-summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .flight-summary-card .h6,
        .flight-summary-card .h5 {
          color: white;
        }

        .flight-summary-card small {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
};

export default FlightSearchResults;
