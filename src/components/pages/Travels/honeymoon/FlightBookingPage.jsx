import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingSteps from './components/BookingSteps';
import FlightItinerary from './components/FlightItinerary';
import PassengerDetails from './components/PassengerDetails';
import SeatSelection from './components/SeatSelection';
import BookingReview from './components/BookingReview';
import BookingConfirmation from './components/BookingConfirmation';

export default function FlightBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { outbound, return: returnFlight, searchParams, reviewData, bookingId: initialBookingId } = location.state || {};
  
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(initialBookingId || null);
  const [travellerInfo, setTravellerInfo] = useState([]);
  const [contact, setContact] = useState({});
  const [gstInfo, setGstInfo] = useState(null);
  const [seatSelections, setSeatSelections] = useState([]);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    if (!outbound || !searchParams) {
      navigate('/honeymoon');
    }
  }, [outbound, searchParams, navigate]);

  if (!outbound || !searchParams) {
    return null;
  }

  const selectedFare = outbound.totalPriceList[0];
  const returnFare = returnFlight?.totalPriceList[0];

  return (
    <div className="tj-booking-page">
      <div className="container py-4">
        {!confirmed ? (
          <>
            <BookingSteps currentStep={step} />
            
            {step === 1 && (
              <FlightItinerary
                trip={outbound}
                returnTrip={returnFlight}
                fare={selectedFare}
                returnFare={returnFare}
                searchParams={searchParams}
                bookingId={bookingId}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <PassengerDetails
                searchParams={searchParams}
                onBack={() => setStep(1)}
                onContinue={(travellers, contactInfo, gst) => {
                  setTravellerInfo(travellers);
                  setContact(contactInfo);
                  setGstInfo(gst);
                  setStep(3);
                }}
              />
            )}

            {step === 3 && bookingId && (
              <SeatSelection
                bookingId={bookingId}
                passengers={travellerInfo}
                onBack={() => setStep(2)}
                onContinue={(seats) => {
                  setSeatSelections(seats);
                  setStep(4);
                }}
              />
            )}

            {step === 4 && (
              <BookingReview
                trip={outbound}
                returnTrip={returnFlight}
                fare={selectedFare}
                returnFare={returnFare}
                searchParams={searchParams}
                travellerInfo={travellerInfo}
                contact={contact}
                gstInfo={gstInfo}
                seatSelections={seatSelections}
                bookingId={bookingId}
                reviewData={reviewData}
                onBack={() => setStep(3)}
                onPaymentSuccess={(bookingResponse) => {
                  setConfirmed(bookingResponse);
                }}
              />
            )}
          </>
        ) : (
          <BookingConfirmation
            bookingData={confirmed}
            trip={outbound}
            returnTrip={returnFlight}
            travellerInfo={travellerInfo}
          />
        )}
      </div>
    </div>
  );
}
