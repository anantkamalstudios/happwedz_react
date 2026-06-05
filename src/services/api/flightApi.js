import axiosInstance from './axiosInstance';

// ─── Location Search (TripJack) ──────────────────────────────────────────────

/**
 * Search airports/cities — GET /tj/meta/locations
 * @param {string} q  Search query (min 2 chars)
 * @param {AbortSignal} signal  Optional abort signal
 */
export const searchLocations = async (q, signal) => {
  const response = await axiosInstance.get('/tj/meta/locations', {
    params: { q },
    signal,
  });
  return response.data;
};

// Legacy airport search (deprecated, use searchLocations instead)
export const searchAirports = async (keyword, signal) => {
  return searchLocations(keyword, signal);
};

// ─── TripJack FMS (Fare Management System) ───────────────────────────────────

/**
 * Air search — POST /tj/fms/search
 * @param {object} searchQuery  TripJack-shaped search body
 */
export const searchFlights = async (searchQuery) => {
  const response = await axiosInstance.post('/tj/fms/search', { searchQuery });
  return response.data;
};

/**
 * Price review — POST /tj/fms/review
 * @param {string[]} priceIds  Array of priceId strings from totalPriceList[n].id
 */
export const reviewFlight = async (priceIds) => {
  const response = await axiosInstance.post('/tj/fms/review', { priceIds });
  return response.data;
};

/**
 * Fare rules — POST /tj/fms/farerule
 * @param {string} id        priceId
 * @param {string} flowType  e.g. "SEARCH"
 */
export const getFareRule = async (id, flowType) => {
  const response = await axiosInstance.post('/tj/fms/farerule', { id, flowType });
  return response.data;
};

/**
 * Seat map — POST /tj/fms/seat
 * @param {string} bookingId
 */
export const getSeatMap = async (bookingId) => {
  const response = await axiosInstance.post('/tj/fms/seat', { bookingId });
  return response.data;
};

// ─── TripJack OMS (Order Management System) — auth required ──────────────────

/**
 * Book flight (instant ticket) — POST /tj/oms/book
 * @param {object} payload  TripJack booking payload (includes paymentInfos)
 */
export const bookFlight = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/book', payload);
  return response.data;
};

/**
 * Hold / Block itinerary — POST /tj/oms/hold (book WITHOUT paymentInfos)
 * @param {object} payload  bookingId + travellerInfo + deliveryInfo
 */
export const holdFlight = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/hold', payload);
  return response.data;
};

/**
 * Post-hold fare confirmation — POST /tj/oms/fare-validate
 * @param {object} payload
 */
export const fareValidate = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/fare-validate', payload);
  return response.data;
};

/**
 * Pre-book fare validation (TJ 2.0 instant) — POST /tj/oms/book-fare-validate
 * @param {object} payload
 */
export const bookFareValidate = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/book-fare-validate', payload);
  return response.data;
};

/**
 * Confirm booking — POST /tj/oms/confirm-book
 * @param {object} payload
 */
export const confirmBook = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/confirm-book', payload);
  return response.data;
};

/**
 * Booking details — POST /tj/oms/booking-details
 * @param {string} bookingId
 * @param {boolean} requirePaxPricing  include traveller-level pricing (default true)
 */
export const getBookingDetails = async (bookingId, requirePaxPricing = true) => {
  const response = await axiosInstance.post('/tj/oms/booking-details', { bookingId, requirePaxPricing });
  return response.data;
};

/**
 * Amendment charges — POST /tj/oms/amendment/charges
 * @param {object} payload
 */
export const getAmendmentCharges = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/amendment/charges', payload);
  return response.data;
};

/**
 * Submit amendment — POST /tj/oms/amendment/submit
 * @param {object} payload
 */
export const submitAmendment = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/amendment/submit', payload);
  return response.data;
};

/**
 * Poll amendment — POST /tj/oms/amendment/poll
 * @param {string} amendmentId
 */
export const pollAmendment = async (amendmentId) => {
  const response = await axiosInstance.post('/tj/oms/amendment/poll', { amendmentId });
  return response.data;
};

// ─── Payment (existing, keep as-is) ──────────────────────────────────────────

/**
 * Create Razorpay order for flight booking
 * @param {object} bookingData
 */
export const createFlightPaymentOrder = async (bookingData) => {
  const paymentPayload = {
    offer_id: bookingData.offer_id,
    provider: bookingData.provider,
    amount: bookingData.price,
    trip_type: bookingData.trip_type,
    from: bookingData.from,
    to: bookingData.to,
    departure: bookingData.departure,
    arrival: bookingData.arrival,
    flight_no: bookingData.flight_no,
    airline: bookingData.airline,
    cabin_class: bookingData.cabin_class,
    passengers: bookingData.passengers,
    contact: bookingData.contact,
    booking_payload: bookingData.booking_payload,
    // true when paying for a previously HELD booking → backend tickets via confirm-book
    is_hold_confirm: bookingData.is_hold_confirm === true,
  };
  const response = await axiosInstance.post('/flight_payment/create_order', paymentPayload);
  return response.data;
};

/**
 * HOLD a fare (block the seat without payment) — POST /flight_payment/hold
 * @param {object} holdData  same shape as createFlightPaymentOrder's bookingData
 */
export const holdFlightBooking = async (holdData) => {
  const payload = {
    provider: holdData.provider,
    amount: holdData.price,
    trip_type: holdData.trip_type,
    from: holdData.from,
    to: holdData.to,
    departure: holdData.departure,
    arrival: holdData.arrival,
    flight_no: holdData.flight_no,
    airline: holdData.airline,
    cabin_class: holdData.cabin_class,
    passengers: holdData.passengers,
    contact: holdData.contact,
    booking_payload: holdData.booking_payload,
  };
  const response = await axiosInstance.post('/flight_payment/hold', payload);
  return response.data;
};

/**
 * Verify Razorpay payment and book flight
 * @param {object} payload
 */
export const verifyAndBookFlight = async (payload) => {
  const response = await axiosInstance.post('/flight_payment/verify_and_book', payload);
  return response.data;
};

// ─── My Bookings (logged-in user) ────────────────────────────────────────────

/**
 * Get the logged-in user's flight bookings — GET /tj/my-bookings
 * Returns rows enriched with passenger_name, passenger_count, payment_status, amount_paid.
 */
export const getMyFlightBookings = async () => {
  const response = await axiosInstance.get('/tj/my-bookings');
  return response.data;
};

/**
 * Our DB record for one booking (booking date + Razorpay payment) — GET /tj/booking-record/:orderId
 */
export const getFlightBookingRecord = async (orderId) => {
  const response = await axiosInstance.get(`/tj/booking-record/${encodeURIComponent(orderId)}`);
  return response.data;
};

// ─── Cancellation ────────────────────────────────────────────────────────────

/**
 * Preview cancellation charges/refund (does NOT cancel) — POST /tj/oms/cancel-charges
 */
export const getFlightCancelCharges = async (orderId) => {
  const response = await axiosInstance.post('/tj/oms/cancel-charges', {
    provider: 'tripjack',
    order_id: orderId,
  });
  return response.data;
};

/**
 * Cancel a booking (amendment submit + poll) — POST /tj/oms/cancel
 */
export const cancelFlightBooking = async (orderId, opts = {}) => {
  const response = await axiosInstance.post('/tj/oms/cancel', {
    provider: 'tripjack',
    order_id: orderId,
    ...opts,
  });
  return response.data;
};

/**
 * Release a HELD booking (unhold) — POST /tj/oms/release-hold
 */
export const releaseHeldBooking = async (orderId) => {
  const response = await axiosInstance.post('/tj/oms/release-hold', { order_id: orderId });
  return response.data;
};
