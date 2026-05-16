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
 * Book flight — POST /tj/oms/book
 * @param {object} payload  TripJack booking payload
 */
export const bookFlight = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/book', payload);
  return response.data;
};

/**
 * Fare validate — POST /tj/oms/fare-validate
 * @param {object} payload
 */
export const fareValidate = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/fare-validate', payload);
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
 */
export const getBookingDetails = async (bookingId) => {
  const response = await axiosInstance.post('/tj/oms/booking-details', { bookingId });
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
  };
  const response = await axiosInstance.post('/flight_payment/create_order', paymentPayload);
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
