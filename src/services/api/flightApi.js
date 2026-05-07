import axiosInstance from './axiosInstance';

const BASE_URL = (
  import.meta.env.VITE_FLIGHT_API_URL || 'http://localhost:4000/Flight_booking'
).replace(/\/$/, '');

// Airport search API
export const searchAirports = async (keyword) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/airports`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
};

// Flight search API
export const searchFlights = async (searchParams) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/search`, searchParams);
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Get flight details by offer ID
export const getFlightDetails = async (offerId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/flight/${offerId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting flight details:', error);
    throw error;
  }
};

// Book flight
export const bookFlight = async (bookingData) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/book`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error;
  }
};

// Get booking details
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw error;
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/booking/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Get popular routes
export const getPopularRoutes = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/popular-routes`);
    return response.data;
  } catch (error) {
    console.error('Error getting popular routes:', error);
    throw error;
  }
};

// Get flight deals
export const getFlightDeals = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/deals`);
    return response.data;
  } catch (error) {
    console.error('Error getting flight deals:', error);
    throw error;
  }
};

// Verify flight offer
export const verifyOffer = async (provider, offerId) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/verify`, {
      provider,
      offer_id: offerId
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying offer:', error);
    throw error;
  }
};

// Create payment order for flight booking
export const createFlightPaymentOrder = async (bookingData) => {
  try {
    // Extract required fields for payment API
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
      contact: bookingData.contact
    };

    const response = await axiosInstance.post('/flight_payment/create_order', paymentPayload);
    return response.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Verify Razorpay payment and book flight
export const verifyAndBookFlight = async (payload) => {
  try {
    const response = await axiosInstance.post('/flight_payment/verify_and_book', payload);
    return response.data;
  } catch (error) {
    console.error('Error verifying payment / booking flight:', error);
    throw error;
  }
};
