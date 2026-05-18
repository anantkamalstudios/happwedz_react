/**
 * Build a proper TripJack searchQuery object from component state
 * @param {object} params - Search parameters
 * @returns {object} TripJack-shaped searchQuery
 */
export function buildTripJackSearchQuery({
  from,
  to,
  departureDate,
  returnDate,
  adults,
  children,
  infants,
  cabinClass,
  tripType,
  paxType,
}) {
  const routeInfos = [
    {
      fromCityOrAirport: { code: String(from).toUpperCase() },
      toCityOrAirport: { code: String(to).toUpperCase() },
      travelDate: departureDate,
    },
  ];

  if (tripType === "round" && returnDate) {
    routeInfos.push({
      fromCityOrAirport: { code: String(to).toUpperCase() },
      toCityOrAirport: { code: String(from).toUpperCase() },
      travelDate: returnDate,
    });
  }

  const searchQuery = {
    cabinClass: String(cabinClass || "ECONOMY").toUpperCase(),
    paxInfo: {
      ADULT: String(Math.max(1, adults || 1)),
      CHILD: String(Math.max(0, children || 0)),
      INFANT: String(Math.max(0, infants || 0)),
    },
    routeInfos,
    searchModifiers: {
      isDirectFlight: true,
      isConnectingFlight: true,
    },
  };

  // Add paxType only if not REGULAR
  if (paxType && paxType !== "REGULAR") {
    searchQuery.paxType = paxType;
  }

  return searchQuery;
}

/**
 * Map TripJack location response to our internal format
 * @param {object} location - TripJack location object
 * @returns {object} Mapped location
 */
export function mapTripJackLocation(location) {
  return {
    id: location.airportCode || location.id,
    iata: location.airportCode || location.code,
    name: location.airportName || location.name,
    city: location.cityName || location.city,
    country: location.countryName || location.country,
    countryCode: location.countryCode,
  };
}

/**
 * Map TripJack flight response to display format
 * @param {object} trip - TripJack trip object
 * @returns {object} Mapped flight for display
 */
export function mapTripJackFlight(trip) {
  if (!trip || !trip.sI || trip.sI.length === 0) return null;

  const firstSegment = trip.sI[0];
  const lastSegment = trip.sI[trip.sI.length - 1];
  const totalPriceList = trip.totalPriceList || [];
  const firstPrice = totalPriceList[0] || {};

  // Calculate total duration
  const totalDuration = trip.sI.reduce((sum, seg) => sum + (seg.duration || 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  // Get airline info
  const airlineCode = firstSegment.fD?.aI?.code || '';
  const airlineName = firstSegment.fD?.aI?.name || 'Unknown Airline';
  const flightNumber = firstSegment.fD?.fN || '';

  // Get fare info
  const adultFare = firstPrice.fd?.ADULT || {};
  const fareClass = adultFare.cc || 'ECONOMY';
  const baggage = adultFare.bI?.iB || '15 Kg';
  const cabinBaggage = adultFare.bI?.cB || '7 Kg';
  const seatsAvailable = adultFare.sR || 0;

  // Calculate price
  const totalFare = adultFare.fC?.TF || 0;

  return {
    flight_no: `${airlineCode}${flightNumber}`,
    airline: airlineCode,
    airline_name: airlineName,
    airline_logo: `https://static.tripjack.com/img/airlineLogo/v1/${airlineCode}.png`,
    operating_airline: airlineName,
    origin: firstSegment.da?.code || '',
    destination: lastSegment.aa?.code || '',
    departure: firstSegment.dt,
    arrival: lastSegment.at,
    departure_terminal: firstSegment.da?.terminal || '',
    arrival_terminal: lastSegment.aa?.terminal || '',
    duration: `${hours}h ${minutes}m`,
    duration_minutes: totalDuration,
    stops: trip.sI.length - 1,
    layovers: trip.sI.slice(0, -1).map(seg => ({
      airport: seg.aa?.code || '',
      duration: seg.duration || 0,
    })),
    price: totalFare,
    aircraft: firstSegment.fD?.eT || '',
    aircraft_name: firstSegment.fD?.eT || '',
    fares: totalPriceList.map(priceItem => ({
      offer_id: priceItem.id,
      provider: 'tripjack',
      cabin_class: priceItem.fd?.ADULT?.cc || fareClass,
      baggage: baggage,
      cabin_baggage: cabinBaggage,
      seats_available: priceItem.fd?.ADULT?.sR || seatsAvailable,
      price: priceItem.fd?.ADULT?.fC?.TF || totalFare,
      fare_identifier: priceItem.fareIdentifier || 'PUBLISHED',
    })),
    raw: trip,
  };
}
