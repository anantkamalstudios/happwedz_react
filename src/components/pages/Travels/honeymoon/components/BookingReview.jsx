import { useState } from 'react';
import { FaPlane, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { bookFlight } from '../../../../../services/api/flightApi';

export default function BookingReview({ 
  trip, 
  returnTrip, 
  fare, 
  returnFare, 
  searchParams, 
  travellerInfo, 
  contact, 
  gstInfo,
  seatSelections,
  bookingId,
  reviewData,
  onBack, 
  onPaymentSuccess 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Get confirmed amount from review API response
  const getConfirmedAmount = () => {
    if (!reviewData) {
      // Fallback to calculated amount if reviewData is not available
      return calculateTotalAmount();
    }

    // Try different possible paths in the review response
    let confirmedAmount = 0;
    
    // Path 1: reviewData.results[0]?.fare?.fd?.ADULT?.fC?.TF
    if (reviewData.results?.[0]?.fare?.fd?.ADULT?.fC?.TF) {
      confirmedAmount = reviewData.results[0].fare.fd.ADULT.fC.TF;
    }
    // Path 2: reviewData.totalPriceList?.[0]?.fd?.ADULT?.fC?.TF
    else if (reviewData.totalPriceList?.[0]?.fd?.ADULT?.fC?.TF) {
      confirmedAmount = reviewData.totalPriceList[0].fd.ADULT.fC.TF;
    }
    // Path 3: reviewData.tripInfos?.COMBO?.[0]?.totalPriceList?.[0]?.fd?.ADULT?.fC?.TF
    else if (reviewData.tripInfos?.COMBO?.[0]?.totalPriceList?.[0]?.fd?.ADULT?.fC?.TF) {
      confirmedAmount = reviewData.tripInfos.COMBO[0].totalPriceList[0].fd.ADULT.fC.TF;
    }
    // Path 4: Check if there's a direct totalFare field
    else if (reviewData.totalFare) {
      confirmedAmount = reviewData.totalFare;
    }
    // Fallback to calculated amount
    else {
      console.warn('Could not find confirmed amount in reviewData, using calculated amount');
      return calculateTotalAmount();
    }

    // Multiply by number of adults if needed
    const adults = searchParams.adults || 1;
    const totalFlightAmount = confirmedAmount * adults;
    
    // Add seat charges
    const seatTotal = seatSelections?.reduce((sum, seat) => sum + (seat.amount || 0), 0) || 0;
    
    return totalFlightAmount + seatTotal;
  };

  const calculateTotalAmount = () => {
    const adults = searchParams.adults || 1;
    const onwardTotal = fare.fd.ADULT.fC.TF * adults;
    const returnTotal = returnFare ? returnFare.fd.ADULT.fC.TF * adults : 0;
    const seatTotal = seatSelections?.reduce((sum, seat) => sum + (seat.amount || 0), 0) || 0;
    return onwardTotal + returnTotal + seatTotal;
  };

  const renderFlightSummary = (flightTrip, flightFare, title) => {
    const first = flightTrip.sI[0];
    const last = flightTrip.sI[flightTrip.sI.length - 1];
    const airline = first.fD.aI;
    const duration = flightTrip.sI.reduce((sum, seg) => sum + seg.duration, 0);
    const stops = flightTrip.sI.length - 1;

    return (
      <div className="flight-summary-compact mb-3">
        <h6 className="flight-summary-title">{title}</h6>
        <div className="d-flex align-items-center gap-3">
          <img
            src={`https://logos.skyscnr.com/images/airlines/favicon/${airline.code}.png`}
            alt={airline.name}
            className="airline-logo-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://airlines.airhex.com/airlines-logo/${airline.code.toLowerCase()}.png`;
            }}
          />
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="airline-name-sm">{airline.name} {first.fD.fN}</div>
                <div className="flight-route-sm">
                  {first.da.code} {formatTime(first.dt)} → {last.aa.code} {formatTime(last.at)}
                </div>
              </div>
              <div className="text-end">
                <div className="flight-duration-sm">{formatDuration(duration)}</div>
                <div className="flight-stops-sm">{stops === 0 ? 'Non-Stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleProceedToPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use confirmed amount from review API response
      const confirmedAmount = getConfirmedAmount();
      
      console.log('Booking with confirmed amount:', confirmedAmount);
      console.log('Review data:', reviewData);
      
      // Strip + prefix from country code for phone number
      const cleanCountryCode = contact.countryCode.replace(/^\+/, '');
      const fullPhoneNumber = `${cleanCountryCode}${contact.mobile}`;
      
      const payload = {
        bookingId: bookingId,
        paymentInfos: [{ amount: confirmedAmount }],
        travellerInfo: travellerInfo,
        deliveryInfo: {
          emails: [contact.email],
          contacts: [fullPhoneNumber],
        },
        ...(gstInfo && {
          gstInfo: {
            gstNumber: gstInfo.gstNumber,
            email: gstInfo.companyEmail,
            registeredName: gstInfo.companyName,
            mobile: fullPhoneNumber,
            address: '',
          },
        }),
      };

      console.log('Booking payload:', payload);

      const response = await bookFlight(payload);
      
      if (response && response.bookingId) {
        onPaymentSuccess(response);
      } else {
        setError('Booking failed. Please try again.');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="booking-card">
          <h4 className="booking-card-title">Review Your Booking</h4>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="review-section">
            <h5 className="review-section-title">
              <FaPlane className="me-2" />
              Flight Details
            </h5>
            {renderFlightSummary(trip, fare, 'Onward Journey')}
            {returnTrip && renderFlightSummary(returnTrip, returnFare, 'Return Journey')}
          </div>
          
          <div className="review-section mt-4">
            <h5 className="review-section-title">
              <FaUser className="me-2" />
              Passenger Details
            </h5>
            {travellerInfo.map((traveller, index) => (
              <div key={index} className="passenger-review-item">
                <div className="passenger-review-number">Passenger {index + 1}</div>
                <div className="passenger-review-details">
                  <strong>{traveller.ti} {traveller.fN} {traveller.lN}</strong>
                  <span className="ms-3 text-muted">{traveller.pt}</span>
                  <span className="ms-3 text-muted">DOB: {traveller.dob}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="review-section mt-4">
            <h5 className="review-section-title">
              <FaEnvelope className="me-2" />
              Contact Information
            </h5>
            <div className="contact-review">
              <div className="contact-review-item">
                <FaPhone className="me-2" />
                {contact.countryCode} {contact.mobile}
              </div>
              <div className="contact-review-item">
                <FaEnvelope className="me-2" />
                {contact.email}
              </div>
            </div>
          </div>
          
          {seatSelections && seatSelections.length > 0 && (
            <div className="review-section mt-4">
              <h5 className="review-section-title">Selected Seats</h5>
              <div className="seats-review">
                {seatSelections.map((seat, index) => (
                  <div key={index} className="seat-review-item">
                    <span className="seat-passenger">{seat.passengerName || `Passenger ${index + 1}`}</span>
                    <span className="seat-number-badge">{seat.seatNo}</span>
                    <span className="seat-amount">₹{Number(seat.amount).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {gstInfo && (
            <div className="review-section mt-4">
              <h5 className="review-section-title">GST Details</h5>
              <div className="gst-review">
                <div><strong>Company:</strong> {gstInfo.companyName}</div>
                <div><strong>GST Number:</strong> {gstInfo.gstNumber}</div>
                <div><strong>Email:</strong> {gstInfo.companyEmail}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="booking-card sticky-summary">
          <h5 className="booking-card-title">Fare Summary</h5>
          
          <div className="fare-summary-review">
            <div className="fare-row">
              <span>Onward Flight</span>
              <span>₹{Number(fare.fd.ADULT.fC.TF * (searchParams.adults || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {returnFare && (
              <div className="fare-row">
                <span>Return Flight</span>
                <span>₹{Number(returnFare.fd.ADULT.fC.TF * (searchParams.adults || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {seatSelections && seatSelections.length > 0 && (
              <div className="fare-row">
                <span>Seat Charges</span>
                <span>₹{Number(seatSelections.reduce((sum, seat) => sum + (seat.amount || 0), 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="fare-row fare-total mt-3 pt-3">
              <span>Total Amount</span>
              <span>₹{Number(getConfirmedAmount()).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div className="terms-notice mt-3">
            <small className="text-muted">
              By proceeding, you agree to our Terms & Conditions and Privacy Policy.
            </small>
          </div>
          
          <div className="d-flex gap-2 mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary flex-grow-1" 
              onClick={onBack}
              disabled={loading}
            >
              Back
            </button>
            <button 
              type="button" 
              className="btn btn-primary flex-grow-1" 
              onClick={handleProceedToPayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
