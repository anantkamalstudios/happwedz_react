import axiosInstance from './axiosInstance';

const LEGACY_BASE_URL = 'https://happywedz.com/api/Flight_booking';
// const LEGACY_BASE_URL = 'http://localhost:4000/Flight_booking';

const isTripJackSearchQuery = (payload) =>
  Boolean(payload?.routeInfos || payload?.searchModifiers);

// --- Location search (TripJack) ---

export const searchLocations = async (q, signal) => {
  const response = await axiosInstance.get('/tj/meta/locations', {
    params: { q },
    signal,
  });
  return response.data;
};

/** Legacy airport search; hooks use searchLocations */
export const searchAirports = async (keyword, signal) => {
  try {
    const response = await axiosInstance.get(`${LEGACY_BASE_URL}/airports`, {
      params: { keyword },
      signal,
    });
    return response.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
};

// --- Flight search ---

export const searchFlights = async (searchQueryOrParams, signal) => {
  if (isTripJackSearchQuery(searchQueryOrParams)) {
    const response = await axiosInstance.post(
      '/tj/fms/search',
      { searchQuery: searchQueryOrParams },
      signal ? { signal } : undefined
    );
    return response.data;
  }

  try {
    const response = await axiosInstance.post(
      `${LEGACY_BASE_URL}/search`,
      searchQueryOrParams,
      signal ? { signal } : undefined
    );
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// --- TripJack FMS ---

export const reviewFlight = async (priceIds) => {
  const response = await axiosInstance.post('/tj/fms/review', { priceIds });
  return response.data;
};

export const getFareRule = async (id, flowType) => {
  const response = await axiosInstance.post('/tj/fms/farerule', { id, flowType });
  return response.data;
};

export const getSeatMap = async (bookingId) => {
  const response = await axiosInstance.post('/tj/fms/seat', { bookingId });
  return response.data;
};

// --- TripJack OMS ---

export const bookFlight = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/book', payload);
  return response.data;
};

export const fareValidate = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/fare-validate', payload);
  return response.data;
};

export const confirmBook = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/confirm-book', payload);
  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  const response = await axiosInstance.post('/tj/oms/booking-details', { bookingId });
  return response.data;
};

export const getAmendmentCharges = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/amendment/charges', payload);
  return response.data;
};

export const submitAmendment = async (payload) => {
  const response = await axiosInstance.post('/tj/oms/amendment/submit', payload);
  return response.data;
};

export const pollAmendment = async (amendmentId) => {
  const response = await axiosInstance.post('/tj/oms/amendment/poll', { amendmentId });
  return response.data;
};

// --- Legacy helpers ---

export const getFlightDetails = async (offerId) => {
  const response = await axiosInstance.get(`${LEGACY_BASE_URL}/flight/${offerId}`);
  return response.data;
};

export const verifyOffer = async (provider, offerId) => {
  const response = await axiosInstance.post(`${LEGACY_BASE_URL}/verify`, {
    provider,
    offer_id: offerId,
  });
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axiosInstance.post(
    `${LEGACY_BASE_URL}/booking/${bookingId}/cancel`
  );
  return response.data;
};

export const getPopularRoutes = async () => {
  const response = await axiosInstance.get(`${LEGACY_BASE_URL}/popular-routes`);
  return response.data;
};

export const getFlightDeals = async () => {
  const response = await axiosInstance.get(`${LEGACY_BASE_URL}/deals`);
  return response.data;
};

// --- Payment ---

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

  const response = await axiosInstance.post(
    '/flight_payment/create_order',
    paymentPayload
  );
  return response.data;
};

export const verifyAndBookFlight = async (payload) => {
  const response = await axiosInstance.post('/flight_payment/verify_and_book', payload);
  return response.data;
};
