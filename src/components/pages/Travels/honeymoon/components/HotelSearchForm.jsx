import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHotelCountries,
  getHotelDestinations,
  getHotelImages,
  searchHotels,
} from "../../../../../services/api/hotelApi";
import SearchButton from "./SearchButton";

const readArray = (payload, primaryKey) => {
  if (Array.isArray(payload?.[primaryKey])) return payload[primaryKey];
  if (Array.isArray(payload?.data?.[primaryKey])) return payload.data[primaryKey];
  const nested = payload?.[primaryKey];
  if (nested && typeof nested === "object") {
    if (Array.isArray(nested?.[primaryKey])) return nested[primaryKey];
    if (Array.isArray(nested?.items)) return nested.items;
    if (Array.isArray(nested?.results)) return nested.results;
    if (Array.isArray(nested?.data)) return nested.data;
    if (Array.isArray(nested?.hotels)) return nested.hotels;
    if (Array.isArray(nested?.images)) return nested.images;
  }
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

const getPriceValue = (hotel) => {
  const candidateValues = [
    hotel?.minRate,
    hotel?.price?.amount,
    hotel?.amount,
    hotel?.totalRate,
    hotel?.rate,
  ];
  const parsed = candidateValues
    .map((value) => parseFloat(String(value)))
    .find((value) => Number.isFinite(value));
  return parsed ?? null;
};

const readFirst = (...values) =>
  values.find((v) => v !== undefined && v !== null);

const mapCancellationPolicies = (rate) => {
  const policies = readArray(rate, "cancellationPolicies");
  return policies.map((p) => ({
    from: p?.from || p?.dateFrom || null,
    amount: readFirst(p?.amount, p?.price?.amount, p?.value, null),
    currency: p?.currency || p?.price?.currency || null,
    type: p?.type || null,
  }));
};

const mapTaxes = (rate) => {
  const taxes = readArray(rate, "taxes");
  return taxes.map((t) => ({
    included: t?.included ?? null,
    percent: readFirst(t?.percent, t?.percentage, null),
    amount: readFirst(t?.amount, t?.value, null),
    currency: t?.currency || null,
    type: t?.type || t?.code || null,
    description: t?.description?.content || t?.description || null,
  }));
};

const mapPromotions = (rate) => {
  const promotions = readArray(rate, "promotions");
  return promotions.map((promo) => ({
    code: promo?.code || null,
    name:
      promo?.name ||
      promo?.description?.content ||
      promo?.description ||
      null,
  }));
};

const mapRoomRates = (room) => {
  const rates = readArray(room, "rates");
  return rates.map((rate) => ({
    rateKey: rate?.rateKey || rate?.key || null,
    boardCode: rate?.boardCode || null,
    boardName: rate?.boardName || null,
    rateClass: rate?.rateClass || null,
    rateType: rate?.rateType || null,
    rooms: rate?.rooms ?? null,
    adults: rate?.adults ?? null,
    children: rate?.children ?? null,
    net: readFirst(rate?.net, rate?.price?.net, rate?.amount, null),
    sellingRate: readFirst(rate?.sellingRate, rate?.price?.sellingRate, null),
    currency: rate?.currency || rate?.price?.currency || null,
    allotment: rate?.allotment ?? null,
    paymentType: rate?.paymentType || null,
    packaging: rate?.packaging ?? null,
    hotelMandatory: rate?.hotelMandatory ?? null,
    offers: readArray(rate, "offers"),
    taxes: mapTaxes(rate),
    promotions: mapPromotions(rate),
    cancellationPolicies: mapCancellationPolicies(rate),
  }));
};

const mapRooms = (hotel) => {
  const rooms = readArray(hotel, "rooms");
  return rooms.map((room, idx) => ({
    id: String(room?.code || room?.roomCode || room?.id || idx),
    code: room?.code || room?.roomCode || null,
    name: room?.name || room?.description?.content || room?.type || "Room",
    rates: mapRoomRates(room),
  }));
};

const normalizeImageUrl = (url) => {
  if (!url) return null;
  const text = String(url).trim();
  if (!text) return null;
  if (text.startsWith("http://")) return `https://${text.slice(7)}`;
  return text;
};

const mapHotelSearchResult = (hotel, imagePayload) => {
  const hotelCode =
    hotel?.hotelCode || hotel?.code || hotel?.id || hotel?.hotel_id;
  const imageHotelCode = String(imagePayload?.hotelCode || "");
  const currentHotelCode = String(hotelCode || "");
  const shouldUseImagePayload =
    !imageHotelCode || !currentHotelCode || imageHotelCode === currentHotelCode;

  const rawImages = shouldUseImagePayload
    ? readArray(imagePayload, "images")
    : [];
  const sortedImages = [...rawImages].sort((a, b) => {
    const aType = a?.type === "GEN" ? 0 : 1;
    const bType = b?.type === "GEN" ? 0 : 1;
    if (aType !== bType) return aType - bType;
    const aVisual = Number(a?.visualOrder ?? Number.MAX_SAFE_INTEGER);
    const bVisual = Number(b?.visualOrder ?? Number.MAX_SAFE_INTEGER);
    if (aVisual !== bVisual) return aVisual - bVisual;
    const aOrder = Number(a?.order ?? Number.MAX_SAFE_INTEGER);
    const bOrder = Number(b?.order ?? Number.MAX_SAFE_INTEGER);
    return aOrder - bOrder;
  });

  const imageUrls = sortedImages
    .map((image) =>
      normalizeImageUrl(
        image?.url || image?.path || image?.image || image?.imageUrl || null
      )
    )
    .filter(Boolean);
  const mainImage = imageUrls[0] || hotel?.image || hotel?.thumbnail || "";

  const price = getPriceValue(hotel);
  const rawRating =
    parseFloat(
      String(hotel?.rating ?? hotel?.reviewScore ?? hotel?.stars ?? "0")
    ) || 0;
  const rating =
    rawRating > 5 && rawRating <= 100
      ? Number((rawRating / 20).toFixed(1))
      : rawRating;

  let ratingLabel = "No reviews";
  if (rating >= 4.5) ratingLabel = "Excellent";
  else if (rating >= 4.0) ratingLabel = "Very good";
  else if (rating >= 3.5) ratingLabel = "Good";
  else if (rating > 0) ratingLabel = "Pleasant";

  const locationParts = [
    hotel?.address,
    hotel?.city,
    hotel?.destinationName,
    hotel?.countryName,
  ].filter(Boolean);

  const rooms = mapRooms(hotel);
  const firstRateNet = rooms?.[0]?.rates?.[0]?.net;
  const derivedPrice = readFirst(price, firstRateNet, null);

  return {
    id: String(hotelCode || hotel?.name || "hotel"),
    name: hotel?.name || hotel?.hotelName || "Hotel",
    location: locationParts.join(", "),
    rating,
    ratingLabel,
    reviews: hotel?.reviews ?? 0,
    locationScore: undefined,
    priceFrom:
      derivedPrice !== null
        ? `₹ ${Number(derivedPrice).toLocaleString("en-IN")}`
        : "Price not available",
    image: mainImage,
    gallery: imageUrls.length ? imageUrls : mainImage ? [mainImage] : [],
    tags: [hotel?.categoryName, hotel?.boardName].filter(Boolean),
    shortDescription: hotel?.description || hotel?.zoneName || "",
    overview: [hotel?.address, hotel?.zoneName].filter(Boolean),
    breakfastInfo: hotel?.boardName || null,
    facilities: [],
    propertyHighlights: [hotel?.destinationName, hotel?.categoryName].filter(
      Boolean
    ),
    rooms: rooms.length ? rooms : undefined,
    meta: {
      hotelCode: hotelCode ? String(hotelCode) : null,
      categoryCode: hotel?.categoryCode || null,
      categoryName: hotel?.categoryName || null,
      destinationCode: hotel?.destinationCode || null,
      destinationName: hotel?.destinationName || null,
      zoneCode: hotel?.zoneCode || null,
      zoneName: hotel?.zoneName || null,
      latitude: hotel?.latitude ?? hotel?.location?.latitude ?? null,
      longitude: hotel?.longitude ?? hotel?.location?.longitude ?? null,
    },
    raw: hotel,
  };
};

export default function HotelSearchForm() {
  const navigate = useNavigate();
  const [hotelCountries, setHotelCountries] = useState([]);
  const [hotelDestinations, setHotelDestinations] = useState([]);
  const [hotelCountryCode, setHotelCountryCode] = useState("");
  const [hotelDestinationCode, setHotelDestinationCode] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelSearchLoading, setHotelSearchLoading] = useState(false);
  const [hotelMetaLoading, setHotelMetaLoading] = useState(false);

  useEffect(() => {
    if (hotelCountries.length > 0) return;

    let active = true;
    setHotelMetaLoading(true);
    getHotelCountries()
      .then((response) => {
        if (!active) return;
        const countries = readArray(response, "countries");
        setHotelCountries(countries);
        if (countries.length > 0) {
          setHotelCountryCode(countries[0]?.code || "");
        }
      })
      .catch((error) => {
        console.error("Unable to load hotel countries", error);
      })
      .finally(() => {
        if (active) {
          setHotelMetaLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [hotelCountries.length]);

  useEffect(() => {
    if (!hotelCountryCode) return;

    let active = true;
    setHotelMetaLoading(true);
    getHotelDestinations(hotelCountryCode)
      .then((response) => {
        if (!active) return;
        const destinations = readArray(response, "destinations");
        setHotelDestinations(destinations);
      })
      .catch((error) => {
        console.error("Unable to load hotel destinations", error);
        if (active) {
          setHotelDestinations([]);
        }
      })
      .finally(() => {
        if (active) {
          setHotelMetaLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [hotelCountryCode]);

  const handleSearchHotels = async () => {
    const code = hotelDestinationCode.trim().toUpperCase();
    if (!code || !hotelCheckIn || !hotelCheckOut) {
      alert("Please enter destination code and travel dates");
      return;
    }

    setHotelSearchLoading(true);
    try {
      const payload = {
        destinationCode: code,
        checkIn: hotelCheckIn,
        checkOut: hotelCheckOut,
        roomCount: hotelRooms,
        adults: hotelAdults,
        children: hotelChildren,
        maxHotels: 50,
      };

      const response = await searchHotels(payload);
      const hotels = readArray(response, "hotels");
      const mappedHotels = await Promise.all(
        hotels.map(async (hotel) => {
          const code = hotel?.hotelCode || hotel?.code || hotel?.id;
          let imagePayload = null;
          if (code) {
            try {
              imagePayload = await getHotelImages(code);
            } catch (error) {
              imagePayload = null;
            }
          }
          return mapHotelSearchResult(hotel, imagePayload);
        })
      );

      navigate("/hotelbeds/hotels", {
        state: {
          hotels: mappedHotels,
          hotelSearchParams: payload,
          hotelSearchResponse: response,
        },
      });
    } catch (error) {
      console.error("Error searching hotels:", error);
      alert("Error searching hotels");
    } finally {
      setHotelSearchLoading(false);
    }
  };

  return (
    <div className="search-card">
      <div className="search-fields">
        <div className="field-box">
          <div className="field-label">Country</div>
          <select
            className="field-input"
            value={hotelCountryCode}
            onChange={(e) => setHotelCountryCode(e.target.value)}
            disabled={hotelMetaLoading}
          >
            <option value="">Select country</option>
            {hotelCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country?.description?.content ||
                  country?.name ||
                  country.code}
              </option>
            ))}
          </select>
        </div>

        <div className="field-box">
          <div className="field-label">Destination code</div>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. PMI"
            autoComplete="off"
            value={hotelDestinationCode}
            onChange={(e) => setHotelDestinationCode(e.target.value)}
          />
          <div className="field-sub">IATA-style code sent to the API</div>
        </div>

        {hotelCountryCode && hotelDestinations.length > 0 && (
          <div className="field-box">
            <div className="field-label">Or pick destination</div>
            <select
              className="field-input"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) setHotelDestinationCode(v);
              }}
              disabled={hotelMetaLoading}
            >
              <option value="">Choose to fill destination code…</option>
              {hotelDestinations.map((destination) => (
                <option key={destination.code} value={destination.code}>
                  {(destination?.name?.content ||
                    destination?.description?.content ||
                    destination?.name ||
                    destination.code) + ` (${destination.code})`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field-box">
          <div className="field-label">Check-in</div>
          <input
            className="field-input"
            type="date"
            value={hotelCheckIn}
            onChange={(e) => setHotelCheckIn(e.target.value)}
          />
        </div>

        <div className="field-box">
          <div className="field-label">Check-out</div>
          <input
            className="field-input"
            type="date"
            min={hotelCheckIn || undefined}
            value={hotelCheckOut}
            onChange={(e) => setHotelCheckOut(e.target.value)}
          />
        </div>

        <div className="field-box">
          <div className="field-label">Rooms</div>
          <input
            className="field-input"
            type="number"
            min={1}
            value={hotelRooms}
            onChange={(e) =>
              setHotelRooms(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </div>

        <div className="field-box">
          <div className="field-label">Adults</div>
          <input
            className="field-input"
            type="number"
            min={1}
            value={hotelAdults}
            onChange={(e) =>
              setHotelAdults(Math.max(1, Number(e.target.value) || 1))
            }
          />
        </div>

        <div className="field-box">
          <div className="field-label">Children</div>
          <input
            className="field-input"
            type="number"
            min={0}
            value={hotelChildren}
            onChange={(e) =>
              setHotelChildren(Math.max(0, Number(e.target.value) || 0))
            }
          />
        </div>

        <SearchButton
          loading={hotelSearchLoading}
          onClick={handleSearchHotels}
          type="hotel"
        />
      </div>
    </div>
  );
}
