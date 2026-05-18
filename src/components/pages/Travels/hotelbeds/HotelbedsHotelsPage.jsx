import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal, Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ExternalLink,
  Filter,
  Heart,
  Images,
  LayoutGrid,
  List,
  MapPin,
  MessageCircleMore,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";
import {
  getHotelDetail,
  getHotelFilters,
  suggestHotels,
  searchHotels,
} from "../../../../services/api/hotelApi";
import HotelDetailsPage, { HotelSearchBarEditable } from "./HotelbedsDetailsPage";
import HotelSearchBar from "./HotelSearchBar";
import { defaultFilters } from "./hotelbedsDetailHelpers";
import "./hotelbedsStyles.css";


const readPath = (value, path) =>
  path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), value);

const findFirstArray = (value, paths) => {
  for (const path of paths) {
    const match = readPath(value, path);
    if (Array.isArray(match)) return match;
  }
  return [];
};

const createCorrelationId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  if (typeof error?.response?.data?.message === "string" && error.response.data.message.trim()) {
    return error.response.data.message;
  }
  if (typeof error?.response?.data?.error === "string" && error.response.data.error.trim()) {
    return error.response.data.error;
  }
  return fallback;
};

const formatMoney = (value, currency = "INR", compact = false) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Price not available";
  const localeCurrency = currency === "INR" ? "INR" : currency;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: localeCurrency,
    maximumFractionDigits: 0,
  }).format(amount);
  return compact ? formatted.replace("₹", "₹") : formatted;
};

const formatDate = (value) => {
  if (!value) return "Select date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getHotelId = (hotel) =>
  String(
    hotel?.tjid ||
      hotel?.tjHotelId ||
      hotel?.hotelId ||
      hotel?.hid ||
      hotel?.id ||
      hotel?.hotelCode ||
      "",
  );

const getReviewPayloadFields = (hotelInfo, selectedHotel, detailMeta, searchPayload, searchResponse) => {
  const searchIdCandidates = [
    detailMeta?.searchId,
    searchResponse?.metaData?.searchId,
    searchResponse?.searchId,
    searchPayload?.searchId,
    selectedHotel?.raw?.searchId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const detailRequestIdCandidates = [
    detailMeta?.requestId,
    searchResponse?.metaData?.requestId,
    searchResponse?.requestId,
    hotelInfo?.requestId,
    hotelInfo?.detailRequestId,
    selectedHotel?.raw?.requestId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const tjHotelIdCandidates = [
    hotelInfo?.tjid,
    hotelInfo?.tjHotelId,
    selectedHotel?.raw?.tjid,
    selectedHotel?.raw?.tjHotelId,
    selectedHotel?.raw?.hotelId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  return {
    searchId: searchIdCandidates[0] || "",
    detailRequestId: detailRequestIdCandidates[0] || "",
    tjHotelId: tjHotelIdCandidates[0] || "",
    candidates: {
      searchIdCandidates,
      detailRequestIdCandidates,
      tjHotelIdCandidates,
    },
  };
};

const buildDefaultTraveller = (passengerType, bookingRequirements) => {
  const isAdult = passengerType === "ADULT";
  return {
    ti: isAdult ? "Mr" : "Master",
    pt: passengerType,
    fN: "",
    lN: "",
    ...(bookingRequirements?.panRequired && isAdult ? { pan: "" } : {}),
    ...(bookingRequirements?.passportRequired && isAdult ? { pNum: "" } : {}),
  };
};

const getReviewRoomInfos = (reviewResponse) => {
  const selectedOption = reviewResponse?.selectedOption || {};
  if (Array.isArray(selectedOption?.roomInfos) && selectedOption.roomInfos.length > 0) {
    return selectedOption.roomInfos;
  }
  if (Array.isArray(selectedOption?.ris) && selectedOption.ris.length > 0) {
    return selectedOption.ris;
  }

  const fallbackAdults = Number(reviewResponse?.roomSummary?.adults || 1);
  const fallbackChildren = Number(reviewResponse?.roomSummary?.children || 0);
  return [
    {
      adt: fallbackAdults,
      chd: fallbackChildren,
    },
  ];
};

const createInitialBookingForm = (reviewResponse) => {
  const bookingRequirements = reviewResponse?.bookingRequirements || {};
  const roomTravellerInfo = getReviewRoomInfos(reviewResponse).map((roomInfo) => {
    const adultCount = Math.max(Number(roomInfo?.adt || 0), 1);
    const childCount = Math.max(Number(roomInfo?.chd || 0), 0);
    const travellerInfo = [
      ...Array.from({ length: adultCount }, () => buildDefaultTraveller("ADULT", bookingRequirements)),
      ...Array.from({ length: childCount }, () => buildDefaultTraveller("CHILD", bookingRequirements)),
    ];

    return { travellerInfo };
  });

  return {
    roomTravellerInfo,
    deliveryInfo: {
      emails: [""],
      contacts: [""],
      code: ["+91"],
    },
    termsAccepted: false,
  };
};

const validateBookingForm = (bookingForm, reviewResponse) => {
  const errors = [];
  const bookingRequirements = reviewResponse?.bookingRequirements || {};
  const roomTravellerInfo = Array.isArray(bookingForm?.roomTravellerInfo) ? bookingForm.roomTravellerInfo : [];

  if (roomTravellerInfo.length === 0) {
    errors.push("At least one traveller is required.");
  }

  roomTravellerInfo.forEach((room, roomIndex) => {
    const travellerInfo = Array.isArray(room?.travellerInfo) ? room.travellerInfo : [];
    if (travellerInfo.length === 0) {
      errors.push(`Room ${roomIndex + 1} needs at least one traveller.`);
      return;
    }

    travellerInfo.forEach((traveller, travellerIndex) => {
      if (!traveller?.fN?.trim()) {
        errors.push(`Enter first name for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
      }
      if (!traveller?.lN?.trim()) {
        errors.push(`Enter last name for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
      }
      if (traveller?.pt === "ADULT" && bookingRequirements?.panRequired) {
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(traveller?.pan || "").trim().toUpperCase())) {
          errors.push(`Enter a valid PAN for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
        }
      }
      if (traveller?.pt === "ADULT" && bookingRequirements?.passportRequired) {
        if (!/^[A-Z0-9]{6,20}$/i.test(String(traveller?.pNum || "").trim())) {
          errors.push(`Enter a valid passport number for room ${roomIndex + 1}, traveller ${travellerIndex + 1}.`);
        }
      }
    });
  });

  const email = String(bookingForm?.deliveryInfo?.emails?.[0] || "").trim();
  const phone = String(bookingForm?.deliveryInfo?.contacts?.[0] || "").trim();
  const code = String(bookingForm?.deliveryInfo?.code?.[0] || "").trim();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push("Enter a valid contact email address.");
  }
  if (!phone || !/^[0-9]{7,15}$/.test(phone)) {
    errors.push("Enter a valid contact phone number.");
  }
  if (!code || !/^\+?\d{1,4}$/.test(code)) {
    errors.push("Enter a valid phone country code.");
  }
  if (!bookingForm?.termsAccepted) {
    errors.push("Accept the booking terms before proceeding.");
  }

  return errors;
};

const delay = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms);
});

const normalizeAmount = (value) => {
  const num = Number(value || 0);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Number(num.toFixed(2));
};

const getHotelImages = (hotel) => {
  const images = Array.isArray(hotel?.images) ? hotel.images : [];
  return images
    .map((image) => image?.url || image?.imageUrl || image?.path || image)
    .filter(Boolean);
};

const getHotelAddress = (hotel, searchPayload) => {
  const address = hotel?.address || {};
  return [
    address?.ctn,
    address?.sn,
    hotel?.cityName,
    hotel?.location,
    searchPayload?.searchQuery?.searchCriteria?.searchRegionName,
  ]
    .filter(Boolean)
    .join(", ");
};

const getDisplayRating = (score) => {
  const numeric = Number(score);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return (numeric / 20).toFixed(1);
};

const getRatingLabel = (hotel) => hotel?.userRating?.label || "No rating";

const getPriceInfo = (hotel) => {
  const rate = Array.isArray(hotel?.rate) ? hotel.rate[0] : hotel?.rate?.[0];
  const nightlyPrice = Number(rate?.nightlyPrice ?? rate?.pricePerNight ?? hotel?.nightlyPrice);
  const totalPrice = Number(
    hotel?.minPrice ?? rate?.totalPrice ?? rate?.price?.totalPrice ?? hotel?.price,
  );

  return {
    nightlyPrice: Number.isFinite(nightlyPrice) ? nightlyPrice : null,
    totalPrice: Number.isFinite(totalPrice) ? totalPrice : null,
    currency: rate?.currency || hotel?.currency || "INR",
    mealBasis: rate?.mealbasis || rate?.mealBasis || hotel?.mealBasis || "Room Only",
    optionId: rate?.optionId || hotel?.optionId || "",
    supplierName: rate?.supplierName || hotel?.supplierName || "",
    cancellation: rate?.cancellation || hotel?.cancellation || null,
    isRefundable:
      rate?.cancellation?.isRefundable ??
      hotel?.cancellation?.isRefundable ??
      false,
  };
};

const getAmenities = (hotel) => {
  const preferred = [];
  const seen = new Set();

  if (Array.isArray(hotel?.tja)) {
    hotel.tja.forEach((group) => {
      if (Array.isArray(group?.am)) {
        group.am.forEach((item) => {
          const name = String(item?.name || item || "").trim();
          if (name && !seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            preferred.push(name);
          }
        });
      }
    });
  }

  if (preferred.length === 0 && Array.isArray(hotel?.facilities)) {
    hotel.facilities.forEach((item) => {
      const name = String(item?.name || item || "").trim();
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        preferred.push(name);
      }
    });
  }

  return preferred.slice(0, 4);
};

const normalizeHotel = (hotel, searchPayload) => {
  const images = getHotelImages(hotel);
  const priceInfo = getPriceInfo(hotel);
  return {
    id: getHotelId(hotel),
    name: hotel?.name || hotel?.hotelName || "Hotel",
    location: getHotelAddress(hotel, searchPayload),
    image: images[0] || "",
    imageCount: images.length,
    images,
    starRating: Number(hotel?.starRating || 0),
    userRating: getDisplayRating(hotel?.userRating?.score),
    userRatingLabel: getRatingLabel(hotel),
    ratingCount: Number(hotel?.userRating?.rc || 0),
    userFavourite: Boolean(hotel?.userFavourite),
    propertyType: hotel?.propertyType || "",
    amenities: getAmenities(hotel),
    priceInfo,
    raw: hotel,
  };
};

const extractHotels = (payload, searchPayload) =>
  findFirstArray(payload, [
    ["hotels"],
    ["data", "hotels"],
    ["searchResult", "hotels"],
    ["hotelSearchResult", "hotels"],
    ["hotelSearchResult", "searchResult", "hotels"],
    ["result", "hotels"],
  ])
    .map((hotel) => normalizeHotel(hotel, searchPayload))
    .filter((hotel) => hotel.id);

const extractSearchId = (payload) =>
  payload?.searchId ||
  payload?.data?.searchId ||
  payload?.searchResult?.searchId ||
  payload?.hotelSearchResult?.searchId ||
  "";

const extractHotelCount = (payload, fallbackCount = 0) =>
  Number(
    payload?.hotelCount ??
      payload?.data?.hotelCount ??
      payload?.searchResult?.hotelCount ??
      payload?.hotelSearchResult?.hotelCount ??
      fallbackCount,
  ) || fallbackCount;

const extractLastHotelId = (payload, hotels = []) =>
  payload?.lastHotelId ||
  payload?.data?.lastHotelId ||
  payload?.pagination?.lastHotelId ||
  payload?.data?.pagination?.lastHotelId ||
  hotels[hotels.length - 1]?.id ||
  "";

const mergeHotels = (currentHotels, incomingHotels) => {
  const merged = [...currentHotels];
  const seen = new Set(currentHotels.map((hotel) => hotel.id));

  incomingHotels.forEach((hotel) => {
    if (!hotel?.id) return;

    if (seen.has(hotel.id)) {
      const index = merged.findIndex((item) => item.id === hotel.id);
      if (index >= 0) merged[index] = hotel;
      return;
    }

    seen.add(hotel.id);
    merged.push(hotel);
  });

  return merged;
};

const normalizeFilterOption = (item) => ({
  value: String(item?.value ?? item?.label ?? item ?? ""),
  label: String(item?.label ?? item?.value ?? item ?? ""),
  count: Number(item?.count ?? 0) || 0,
  state: item?.state || "ENABLED",
});

const normalizeFilterKey = (name) => {
  const key = String(name || "").toLowerCase();
  if (key === "property type") return "propertyType";
  if (key === "popular places") return "popularPlaces";
  if (key === "rating") return "ratings";
  if (key === "user rating") return "userRating";
  if (key === "amenities") return "amenities";
  if (key === "free cancellation") return "cancellationPolicy";
  if (key === "price range") return "priceRange";
  if (key === "search by hotel name") return "hotelName";
  return key.replace(/\s+/g, "");
};

const extractFilterGroups = (payload) => {
  const groups = Array.isArray(payload?.filters)
    ? payload.filters
    : Array.isArray(payload?.data?.filters)
      ? payload.data.filters
      : [];

  return groups.map((group) => ({
    key: normalizeFilterKey(group?.name),
    name: group?.name || "",
    filterType: group?.filterType || "STATIC",
    options: Array.isArray(group?.options)
      ? group.options
          .map(normalizeFilterOption)
          .filter((item) => item.value && item.label && item.state !== "DISABLED")
      : [],
  }));
};

const buildDetailPayload = (hotel, searchPayload, searchResponse) => {
  const searchQuery = searchPayload?.searchQuery || {};
  const criteria = searchQuery.searchCriteria || {};
  return {
    searchQuery: {
      checkInDate: searchQuery.checkinDate,
      checkoutDate: searchQuery.checkoutDate,
      roomInfo: searchQuery.roomInfo || [],
      hotelSearchCriteria: {
        nationality: criteria.nationality || "106",
        countryOfResidence: criteria.countryOfResidence || "106",
        currency: criteria.currency || "INR",
      },
      searchPreferences: {
        hids: [hotel.id],
      },
      searchRegionId: criteria.city || "",
      searchRegionName: criteria.searchRegionName || "",
      searchRegionType: criteria.searchRegionType || searchQuery.searchType || "CITY",
      gstApplied: false,
      isLimitOptionAllowed: true,
    },
    searchId: searchResponse?.searchId || searchPayload?.searchId || "",
    userIntent: {
      optionId: hotel?.priceInfo?.optionId || "",
      supplierName: hotel?.priceInfo?.supplierName || "",
      price: Number.isFinite(hotel?.priceInfo?.totalPrice)
        ? String(hotel.priceInfo.totalPrice)
        : "",
    },
  };
};

const buildFilterPayload = (searchPayload, appliedFilters, searchResponse, sortOrder) => ({
  ...searchPayload,
  appliedFilters: {
    ...(searchPayload?.appliedFilters || {}),
    ...appliedFilters,
  },
  searchId: searchResponse?.searchId || searchPayload?.searchId || "",
  correlationId: searchPayload?.correlationId || createCorrelationId(),
  sortOrder,
});

const buildSearchPayload = (
  searchPayload,
  appliedFilters,
  searchResponse,
  sortOrder,
  lastHotelId = "",
) => ({
  ...buildFilterPayload(searchPayload, appliedFilters, searchResponse, sortOrder),
  pagination: {
    ...(searchPayload?.pagination || {}),
    pageSize:
      searchPayload?.pagination?.pageSize ||
      searchResponse?.pagination?.pageSize ||
      searchResponse?.data?.pagination?.pageSize ||
      15,
    lastHotelId,
  },
  allOptions: searchPayload?.allOptions ?? true,
  filterType: searchPayload?.filterType || "BOTH",
  searchId: extractSearchId(searchResponse) || searchPayload?.searchId || "",
});

const parseJsonSafely = (value) => {
  if (!value || typeof value !== "string") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const dedupeStrings = (values) => {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = String(value || "").trim();
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const dedupeImages = (values) => {
  const seen = new Set();
  return values.filter((item) => {
    const url = String(item?.url || item || "").trim();
    if (!url) return false;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
};

const normalizeImageItems = (items) =>
  dedupeImages(
    (Array.isArray(items) ? items : [])
      .map((item) => item?.url || item?.imageUrl || item?.path || item?.links?.[0]?.url || item)
      .filter(Boolean)
      .map((url) => ({ url })),
  );

const buildAddressParts = (address = {}) =>
  [
    address?.adr,
    address?.adr2,
    address?.ctn || address?.city?.name,
    address?.sn || address?.state?.name,
    address?.postalCode,
    address?.cn || address?.country?.name,
  ].filter(Boolean);

const buildAddressLabel = (address = {}) => buildAddressParts(address).join(", ");

const getRoomMetadata = (hotelInfo, roomInfo) => {
  const roomId = String(roomInfo?.id || roomInfo?.rid || roomInfo?.roomId || "");
  const roomMetaMap = hotelInfo?.oprmd || hotelInfo?.roomMeta || {};
  return roomMetaMap?.[roomId] || roomInfo || {};
};

const getRoomBedSummary = (roomMeta) => {
  const beds = Array.isArray(roomMeta?.bds)
    ? roomMeta.bds
    : Array.isArray(roomMeta?.radi?.bds)
      ? roomMeta.radi.bds
      : [];

  if (beds.length === 0) return "";

  return beds
    .map((bed) => `${bed?.bc || 1} ${bed?.bt || "Bed"}`.trim())
    .filter(Boolean)
    .join(", ");
};

const getRoomGuestSummary = (roomMeta, roomInfo) => {
  const maxGuests = Number(roomMeta?.mga ?? roomMeta?.radi?.mga ?? roomInfo?.mga ?? 0);
  const maxAdults = Number(roomMeta?.maa ?? roomMeta?.radi?.maa ?? roomInfo?.adt ?? 0);
  const maxChildren = Number(roomMeta?.mca ?? roomMeta?.radi?.mca ?? roomInfo?.chd ?? 0);

  if (!maxGuests && !maxAdults && !maxChildren) return "";

  const parts = [];
  if (maxGuests) parts.push(`Fits max. ${maxGuests} guest${maxGuests > 1 ? "s" : ""}`);
  else if (maxAdults) parts.push(`${maxAdults} adult${maxAdults > 1 ? "s" : ""}`);
  if (maxChildren) parts.push(`${maxChildren} child${maxChildren > 1 ? "ren" : ""}`);
  return parts.join(" • ");
};

const getCancellationLabel = (cnp) => {
  if (cnp?.ifra === true) return "Refundable";
  if (cnp?.inra === true) return "Non-refundable";
  if (cnp?.isRefundable === true) return "Refundable";
  return "Cancellation policy";
};

const getCancellationPenalties = (cnp) =>
  Array.isArray(cnp?.pd)
    ? cnp.pd.map((penalty) => ({
        from: penalty?.fdt || penalty?.from || "",
        to: penalty?.tdt || penalty?.to || "",
        amount: penalty?.am ?? penalty?.amount ?? "",
      }))
    : Array.isArray(cnp?.penalties)
      ? cnp.penalties
      : [];

const getNightCount = (searchPayload) => {
  const checkin = new Date(searchPayload?.searchQuery?.checkinDate || searchPayload?.searchQuery?.checkInDate);
  const checkout = new Date(searchPayload?.searchQuery?.checkoutDate || searchPayload?.searchQuery?.checkOutDate);
  if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime())) return 1;
  const diff = Math.round((checkout.getTime() - checkin.getTime()) / 86400000);
  return diff > 0 ? diff : 1;
};

const getRoomImages = (roomMeta) =>
  normalizeImageItems([
    ...(Array.isArray(roomMeta?.img) ? roomMeta.img.flatMap((item) => item?.links || item) : []),
    ...(Array.isArray(roomMeta?.imgs) ? roomMeta.imgs : []),
  ]);

const getRoomAmenities = (roomMeta) =>
  dedupeStrings([
    ...(Array.isArray(roomMeta?.fcs) ? roomMeta.fcs : []),
    ...(Array.isArray(roomMeta?.am) ? roomMeta.am.map((item) => item?.name || item) : []),
    ...(Array.isArray(roomMeta?.rexb?.BENEFIT)
      ? roomMeta.rexb.BENEFIT.flatMap((item) => item?.values || [])
      : []),
  ]);

const getRoomMealBasis = (option, roomInfo) => option?.mb || roomInfo?.mb || "Room Only";

const getOptionPanRequired = (hotelInfo, option, optionIndex) => {
  if (hotelInfo?.panRequired === true) return true;
  if (Array.isArray(hotelInfo?.filters?.panRequired)) {
    return hotelInfo.filters.panRequired.includes(optionIndex) ||
      hotelInfo.filters.panRequired.includes(option?.id)
      ? true
      : false;
  }
  return false;
};

const getOptionPanOptional = (hotelInfo, option, optionIndex) => {
  if (Array.isArray(hotelInfo?.filters?.panNotRequired)) {
    return hotelInfo.filters.panNotRequired.includes(optionIndex) ||
      hotelInfo.filters.panNotRequired.includes(option?.id)
      ? true
      : false;
  }
  return !getOptionPanRequired(hotelInfo, option, optionIndex);
};

const getOptionTotalPrice = (option, roomInfo) =>
  Number(option?.totalPrice ?? option?.tp ?? roomInfo?.totalPrice ?? roomInfo?.tp ?? 0);

const getOptionNightlyPrice = (option, roomInfo, nights) => {
  const direct = Number(option?.nightlyPrice ?? roomInfo?.nightlyPrice ?? 0);
  if (Number.isFinite(direct) && direct > 0) return direct;
  const total = getOptionTotalPrice(option, roomInfo);
  return total > 0 ? total / Math.max(1, nights) : 0;
};

const normalizeRoomOption = (option, optionIndex, hotelInfo, nights) => {
  const roomInfo = option?.roomInfos?.[0] || option?.ris?.[0] || {};
  const roomMeta = getRoomMetadata(hotelInfo, roomInfo);
  const images = getRoomImages(roomMeta);
  const amenities = getRoomAmenities(roomMeta);
  const totalPrice = getOptionTotalPrice(option, roomInfo);
  const nightlyPrice = getOptionNightlyPrice(option, roomInfo, nights);
  const mealBasis = getRoomMealBasis(option, roomInfo);
  const cancellation = option?.cnp || roomInfo?.cnp || {};
  const roomName = roomInfo?.srn || roomInfo?.rt || roomInfo?.rc || "Room";
  const supplierRoomType = roomInfo?.rc || roomInfo?.rt || roomName;

  return {
    id: String(option?.id || option?.optionId || `${optionIndex}`),
    optionIndex,
    roomId: String(roomInfo?.id || roomInfo?.rid || roomMeta?.rid || `${optionIndex}`),
    roomName,
    supplierRoomType,
    mealBasis,
    totalPrice: Number.isFinite(totalPrice) && totalPrice > 0 ? totalPrice : null,
    nightlyPrice: Number.isFinite(nightlyPrice) && nightlyPrice > 0 ? nightlyPrice : null,
    currency: option?.currency || option?.sc || roomInfo?.currency || "INR",
    cancellation,
    cancellationLabel: getCancellationLabel(cancellation),
    cancellationPenalties: getCancellationPenalties(cancellation),
    refundable: cancellation?.ifra === true || cancellation?.isRefundable === true,
    nonRefundable: cancellation?.inra === true,
    panRequired: getOptionPanRequired(hotelInfo, option, optionIndex),
    panOptional: getOptionPanOptional(hotelInfo, option, optionIndex),
    passportRequired: Boolean(hotelInfo?.passportRequired),
    adults: Number(roomInfo?.adt || 0),
    children: Number(roomInfo?.chd || 0),
    bedSummary: getRoomBedSummary(roomMeta),
    guestSummary: getRoomGuestSummary(roomMeta, roomInfo),
    images,
    image: images[0]?.url || "",
    amenities,
    view: Array.isArray(roomMeta?.vw)
      ? roomMeta.vw.join(", ")
      : Array.isArray(roomMeta?.radi?.vi)
        ? roomMeta.radi.vi.join(", ")
        : "",
    raw: option,
    roomInfo,
    roomMeta,
  };
};

const extractDetailHotelRoot = (payload) =>
  payload?.searchResult?.hotelInfos?.[0] ||
  payload?.data?.searchResult?.hotelInfos?.[0] ||
  payload?.hotel ||
  payload?.data?.hotel ||
  payload?.searchResult?.hotel ||
  payload?.hotelInfos?.[0] ||
  null;

const extractDetailMeta = (payload) => ({
  searchId:
    payload?.metaData?.searchId ||
    payload?.data?.metaData?.searchId ||
    payload?.searchQuery?.searchId ||
    payload?.id ||
    "",
  requestId:
    payload?.metaData?.requestId ||
    payload?.data?.metaData?.requestId ||
    payload?.requestId ||
    payload?.id ||
    "",
});

// Removed old SearchBar component - now using HotelSearchBar from HotelSearchBar.jsx

function ResultHeader({
  destination,
  hotelCount,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  favoritesOnly,
  setFavoritesOnly,
  onOpenMobileFilters,
}) {
  return (
    <div className="hotel-toolbar">
      <div className="hotel-toolbar-left">
        <div className="hotel-breadcrumb">{`Home Hotels > ${destination}`}</div>
        <div className="hotel-sort-pill">
          <SlidersHorizontal size={14} />
          <span>Sort By:</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="popularity">Most Popular</option>
            <option value="priceLowToHigh">Price Low to High</option>
            <option value="priceHighToLow">Price High to Low</option>
          </select>
        </div>
        <div className="hotel-results-copy">
          {`Showing `}
          <strong>{hotelCount}</strong>
          {` hotels for `}
          <strong>{destination}</strong>
        </div>
      </div>

      <div className="hotel-toolbar-right">
        <button
          type="button"
          className="hotel-mobile-filter-btn"
          onClick={onOpenMobileFilters}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        <button
          type="button"
          className={`hotel-view-pill ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid size={15} />
          Grid View
        </button>
        <button
          type="button"
          className={`hotel-view-pill ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <List size={15} />
          List View
        </button>
        <button
          type="button"
          className={`hotel-fav-pill ${favoritesOnly ? "active" : ""}`}
          onClick={() => setFavoritesOnly((prev) => !prev)}
        >
          <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} />
          View Favourites
        </button>
      </div>
    </div>
  );
}

function FilterChips({ chips, onRemove, onClearAll }) {
  if (chips.length === 0) return null;

  return (
    <div className="hotel-filter-chips">
      {chips.map((chip) => (
        <span key={`${chip.group}-${chip.value}`} className="hotel-chip">
          {chip.label}
          <button type="button" onClick={() => onRemove(chip.group, chip.value)}>
            <X size={13} />
          </button>
        </span>
      ))}
      <span className="hotel-chip">
        Clear all
        <button type="button" onClick={onClearAll}>
          <X size={13} />
        </button>
      </span>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="hotel-sidebar-card">
      <div className="hotel-sidebar-head">
        <div className="hotel-filter-skeleton" style={{ width: 90, height: 18 }} />
        <div className="hotel-filter-skeleton" style={{ width: 56, height: 14 }} />
      </div>
      <div style={{ padding: 18 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ marginBottom: 22 }}>
            <div className="hotel-filter-skeleton" style={{ width: "55%", height: 16, marginBottom: 12 }} />
            {Array.from({ length: 4 }).map((__, optionIndex) => (
              <div
                key={optionIndex}
                className="hotel-filter-skeleton"
                style={{ width: "100%", height: 14, marginBottom: 10 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function HotelFilterSidebar({
  filterGroups,
  appliedFilters,
  toggleFilter,
  clearAllFilters,
  favoritesOnly,
  setFavoritesOnly,
  hotelNameQuery,
  setHotelNameQuery,
}) {
  const [collapsed, setCollapsed] = useState({});

  return (
    <div className="hotel-sidebar-card">
      <div className="hotel-sidebar-head">
        <div className="hotel-sidebar-title">Filter by</div>
        <button type="button" className="hotel-clear-btn" onClick={clearAllFilters}>
          Clear all filters
        </button>
      </div>

      <div className="hotel-sidebar-scroll">

      <div className="hotel-filter-block">
        <button type="button" className="hotel-filter-toggle">
          <span>Search by hotel name</span>
        </button>
        <div className="hotel-filter-content" style={{ maxHeight: "none" }}>
          <input
            className="hotel-filter-search"
            placeholder="Select by Hotel Name"
            value={hotelNameQuery}
            onChange={(e) => setHotelNameQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="hotel-filter-block">
        <div className="hotel-filter-option">
          <label>
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={() => setFavoritesOnly((prev) => !prev)}
            />
            <span>View favourites only</span>
          </label>
        </div>
      </div>

      {filterGroups.map((group) => (
        <div className="hotel-filter-block" key={group.key}>
          <button
            type="button"
            className="hotel-filter-toggle"
            onClick={() =>
              setCollapsed((prev) => ({ ...prev, [group.key]: !prev[group.key] }))
            }
          >
            <span>{group.name}</span>
            <span>{collapsed[group.key] ? "+" : "−"}</span>
          </button>
          {!collapsed[group.key] ? (
            <div className="hotel-filter-content">
              {group.options.map((option) => (
                <div className="hotel-filter-option" key={`${group.key}-${option.value}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={(appliedFilters[group.key] || []).includes(option.value)}
                      onChange={() => toggleFilter(group.key, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                  <span className="hotel-filter-count">{option.count ? `(${option.count})` : ""}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      </div>
    </div>
  );
}

function HotelCardSkeleton() {
  return (
    <div className="hotel-card">
      <div className="hotel-skeleton-card" style={{ aspectRatio: "16 / 10" }} />
      <div className="hotel-card-body">
        <div className="hotel-skeleton-card" style={{ width: "72%", height: 22 }} />
        <div className="hotel-skeleton-card" style={{ width: "48%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "100%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "86%", height: 14 }} />
        <div className="hotel-skeleton-card" style={{ width: "54%", height: 34, marginTop: 12 }} />
      </div>
    </div>
  );
}

function renderStars(count) {
  return Array.from({ length: Math.max(0, Math.min(5, Number(count) || 0)) }).map((_, index) => (
    <Star key={index} size={14} fill="currentColor" />
  ));
}

function HotelCard({ hotel, onClick }) {
  const images = hotel.images?.length ? hotel.images : hotel.image ? [hotel.image] : [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [hotel.id]);

  const activeImage = images[activeImageIndex] || "";

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-card-image-wrap">
        {hotel.image ? (
          <img className="hotel-card-image" src={hotel.image} alt={hotel.name} />
        ) : null}
        <span className="hotel-image-pill">{`${hotel.imageCount || 1}/${hotel.imageCount || 1}`}</span>
        <span className={`hotel-fav-badge ${hotel.userFavourite ? "active" : ""}`}>
          <Heart size={16} fill={hotel.userFavourite ? "currentColor" : "none"} />
        </span>
        <span className="hotel-arrow-badge">›</span>
      </div>

      <div className="hotel-card-body">
        <div className="hotel-title-row">
          <div className="hotel-title-block">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location">
              <MapPin size={14} />
              <span>{hotel.location || "Location unavailable"}</span>
            </div>
            <div className="hotel-stars">{renderStars(hotel.starRating)}</div>
          </div>

          <div className="hotel-rating-box">
            {hotel.userRating ? (
              <>
                <div className="hotel-rating-badge">
                  <Star size={12} fill="currentColor" />
                  <span>{hotel.userRating}</span>
                </div>
                <div className="hotel-rating-meta">
                  <div>{hotel.userRatingLabel}</div>
                  <div>{hotel.ratingCount ? `(${hotel.ratingCount} Ratings)` : ""}</div>
                </div>
              </>
            ) : (
              <div className="hotel-rating-meta">No rating</div>
            )}
          </div>
        </div>

        <div className="hotel-meal-line">{hotel.priceInfo.mealBasis}</div>

        <div className="hotel-amenities">
          {hotel.amenities.length > 0
            ? hotel.amenities.map((amenity, index) => {
                const amenityText = typeof amenity === 'object' && amenity !== null 
                  ? (amenity.name || amenity.nm || JSON.stringify(amenity))
                  : String(amenity || '');
                return (
                  <span key={`${amenityText}-${index}`} className="hotel-amenity-chip">
                    {amenityText}
                  </span>
                );
              })
            : <span className="hotel-amenity-chip">Amenities unavailable</span>}
        </div>

        <div className="hotel-price-row">
          <div className="hotel-price-meta">
            <div className="hotel-nightly">
              {hotel.priceInfo.nightlyPrice
                ? `${formatMoney(hotel.priceInfo.nightlyPrice, hotel.priceInfo.currency)} /night`
                : "Nightly price unavailable"}
            </div>
            <div className="hotel-total-inline">
              <div className="hotel-total-price">
              {hotel.priceInfo.totalPrice
                ? formatMoney(hotel.priceInfo.totalPrice, hotel.priceInfo.currency, true)
                : "—"}
            </div>
              <div className="hotel-total-caption">Total</div>
            </div>
            <div className="hotel-tax-copy">Incl. of all taxes</div>
          </div>

          <button type="button" className="hotel-card-cta">
            Choose Room
          </button>
        </div>
      </div>
    </div>
  );
}

function HotelListCard({ hotel, onClick }) {
  return (
    <div className="hotel-card" onClick={onClick}>
      <div className="hotel-list-card">
        <div className="hotel-list-image-wrap">
          {hotel.image ? (
            <img className="hotel-card-image" src={hotel.image} alt={hotel.name} />
          ) : null}
          <span className="hotel-image-pill">{`${hotel.imageCount || 1}/${hotel.imageCount || 1}`}</span>
          <span className={`hotel-fav-badge ${hotel.userFavourite ? "active" : ""}`}>
            <Heart size={16} fill={hotel.userFavourite ? "currentColor" : "none"} />
          </span>
          <span className="hotel-arrow-badge">›</span>
        </div>

        <div className="hotel-list-main">
          <div className="hotel-title-block">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location">
              <MapPin size={14} />
              <span>{hotel.location || "Location unavailable"}</span>
            </div>
            <div className="hotel-stars">{renderStars(hotel.starRating)}</div>
          </div>

          <div className="hotel-meal-line">{hotel.priceInfo.mealBasis}</div>

          <div className="hotel-amenities">
            {hotel.amenities.length > 0
              ? hotel.amenities.map((amenity, index) => {
                  const amenityText = typeof amenity === 'object' && amenity !== null 
                    ? (amenity.name || amenity.nm || JSON.stringify(amenity))
                    : String(amenity || '');
                  return (
                    <span key={`${amenityText}-${index}`} className="hotel-amenity-chip">
                      {amenityText}
                    </span>
                  );
                })
              : <span className="hotel-amenity-chip">Amenities unavailable</span>}
          </div>
        </div>

        <div className="hotel-list-side">
          <div className="hotel-rating-box">
            {hotel.userRating ? (
              <>
                <div className="hotel-rating-badge">
                  <Star size={12} fill="currentColor" />
                  <span>{hotel.userRating}</span>
                </div>
                <div className="hotel-rating-meta">
                  <div>{hotel.userRatingLabel}</div>
                  <div>{hotel.ratingCount ? `(${hotel.ratingCount} Ratings)` : ""}</div>
                </div>
              </>
            ) : (
              <div className="hotel-rating-meta">No rating</div>
            )}
          </div>

          <div className="hotel-price-meta" style={{ textAlign: "right" }}>
            <div className="hotel-nightly">
              {hotel.priceInfo.nightlyPrice
                ? `${formatMoney(hotel.priceInfo.nightlyPrice, hotel.priceInfo.currency)} /night`
                : "Nightly price unavailable"}
            </div>
            <div className="hotel-total-inline" style={{ justifyContent: "flex-end" }}>
              <div className="hotel-total-price">
              {hotel.priceInfo.totalPrice
                ? formatMoney(hotel.priceInfo.totalPrice, hotel.priceInfo.currency, true)
                : "—"}
            </div>
              <div className="hotel-total-caption">Total</div>
            </div>
            <div className="hotel-tax-copy">Incl. of all taxes</div>
          </div>

          <button type="button" className="hotel-card-cta">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClearAll }) {
  return (
    <div className="hotel-empty">
      <SlidersHorizontal size={26} color="#ed1173" />
      <div className="hotel-empty-title">No hotels match these filters</div>
      <div className="hotel-empty-copy">
        Try clearing a few filters or broaden your destination and price range.
      </div>
      <Button
        className="hotel-card-cta mt-3"
        style={{ width: "auto" }}
        onClick={onClearAll}
      >
        Clear all filters
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="hotel-error">
      <X size={26} color="#ed1173" />
      <div className="hotel-error-title">Unable to load hotels</div>
      <div className="hotel-error-copy">
        Something went wrong while refreshing these results.
      </div>
      <Button
        className="hotel-card-cta mt-3"
        style={{ width: "auto" }}
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

export default function HotelbedsHotelsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId } = useParams();

  const initialPayload = location.state?.hotelSearchPayload || null;
  const initialResponse = location.state?.hotelSearchResponse || null;
  const initialSuggestion = location.state?.selectedHotelSuggestion || null;

  const [searchResponse, setSearchResponse] = useState(initialResponse);
  const [loadedHotels, setLoadedHotels] = useState(() =>
    extractHotels(initialResponse, initialPayload),
  );
  const [filterGroups, setFilterGroups] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [resultsError, setResultsError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailResponse, setDetailResponse] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [hasMoreResults, setHasMoreResults] = useState(true);
  const [lastHotelId, setLastHotelId] = useState(() =>
    extractLastHotelId(initialResponse, extractHotels(initialResponse, initialPayload)),
  );
  const loadMoreRef = useRef(null);
  const appendRequestRef = useRef(false);

  const hotels = loadedHotels;

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => hotel.id === hotelId) || null,
    [hotelId, hotels],
  );

  const hotelNameQuery = appliedFilters.hotelName || "";

  useEffect(() => {
    if (!initialPayload) return undefined;

    let active = true;
    setFiltersLoading(true);
    getHotelFilters(buildFilterPayload(initialPayload, appliedFilters, initialResponse, sortOrder))
      .then((response) => {
        if (!active) return;
        setFilterGroups(extractFilterGroups(response));
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to load hotel filters"));
        if (active) setFilterGroups([]);
      })
      .finally(() => {
        if (active) setFiltersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialPayload, initialResponse, sortOrder]);

  useEffect(() => {
    if (!initialPayload || hotelId) return undefined;

    let active = true;
    appendRequestRef.current = false;
    setResultsLoading(true);
    setResultsError("");

    searchHotels(buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, ""))
      .then((response) => {
        if (!active) return;
        const nextHotels = extractHotels(response, initialPayload);
        const nextLastHotelId = extractLastHotelId(response, nextHotels);
        const nextHotelCount = extractHotelCount(response, nextHotels.length);
        setSearchResponse(response);
        setLoadedHotels(nextHotels);
        setLastHotelId(nextLastHotelId);
        setHasMoreResults(Boolean(nextLastHotelId) && nextHotels.length < nextHotelCount);
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to refresh hotel results"));
        if (active) setResultsError("Unable to refresh hotel results");
      })
      .finally(() => {
        if (active) setResultsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [appliedFilters, hotelId, initialPayload, sortOrder]);

  useEffect(() => {
    if (!initialPayload || hotelId || !hasMoreResults || !lastHotelId) return undefined;

    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        if (resultsLoading || loadingMore || appendRequestRef.current) return;

        let active = true;
        appendRequestRef.current = true;
        setLoadingMore(true);

        searchHotels(
          buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, lastHotelId),
        )
          .then((response) => {
            if (!active) return;
            const incomingHotels = extractHotels(response, initialPayload);
            setSearchResponse(response);
            setLoadedHotels((prev) => {
              const mergedHotels = mergeHotels(prev, incomingHotels);
              const nextLastHotelId = extractLastHotelId(response, incomingHotels);
              const totalCount = extractHotelCount(response, mergedHotels.length);
              setLastHotelId(nextLastHotelId);
              setHasMoreResults(
                Boolean(nextLastHotelId) &&
                  incomingHotels.length > 0 &&
                  mergedHotels.length < totalCount,
              );
              return mergedHotels;
            });
          })
          .catch((error) => {
            console.error(getErrorMessage(error, "Unable to load more hotel results"));
          })
          .finally(() => {
            if (active) setLoadingMore(false);
            appendRequestRef.current = false;
          });
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [
    appliedFilters,
    hasMoreResults,
    hotelId,
    initialPayload,
    lastHotelId,
    loadingMore,
    resultsLoading,
    searchResponse,
    sortOrder,
  ]);
  useEffect(() => {
    if (!hotelId || !selectedHotel || !initialPayload) return undefined;

    let active = true;
    setDetailLoading(true);
    getHotelDetail(buildDetailPayload(selectedHotel, initialPayload, searchResponse))
      .then((response) => {
        if (!active) return;
        setDetailResponse(response);
      })
      .catch((error) => {
        console.error(getErrorMessage(error, "Unable to load hotel detail"));
        if (active) setDetailResponse(null);
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hotelId, initialPayload, searchResponse, selectedHotel]);

  const clearAllFilters = () => {
    setAppliedFilters(defaultFilters());
    setFavoritesOnly(false);
  };

  const toggleFilter = (group, value) => {
    setAppliedFilters((prev) => {
      const currentValues = Array.isArray(prev[group]) ? prev[group] : [];
      const exists = currentValues.includes(value);
      return {
        ...prev,
        [group]: exists
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const removeFilterChip = (group, value) => {
    if (group === "onlyFavorites") {
      setFavoritesOnly(false);
      return;
    }
    if (group === "hotelName") {
      setAppliedFilters((prev) => ({ ...prev, hotelName: "" }));
      return;
    }
    toggleFilter(group, value);
  };

  const selectedFilterChips = useMemo(() => {
    const chips = [];

    Object.entries(appliedFilters).forEach(([group, value]) => {
      if (group === "hotelName" && String(value || "").trim()) {
        chips.push({ group, value, label: `Hotel: ${value}` });
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          const label =
            filterGroups
              .find((filterGroup) => filterGroup.key === group)
              ?.options.find((option) => option.value === item)?.label || item;
          chips.push({ group, value: item, label });
        });
      }
    });

    if (favoritesOnly) {
      chips.push({ group: "onlyFavorites", value: "1", label: "Favourites only" });
    }

    return chips;
  }, [appliedFilters, favoritesOnly, filterGroups]);

  const visibleHotels = useMemo(() => {
    let nextHotels = [...hotels];

    if (hotelNameQuery.trim()) {
      const query = hotelNameQuery.trim().toLowerCase();
      nextHotels = nextHotels.filter((hotel) => hotel.name.toLowerCase().includes(query));
    }

    if (favoritesOnly) {
      nextHotels = nextHotels.filter((hotel) => hotel.userFavourite);
    }

    return nextHotels;
  }, [favoritesOnly, hotelNameQuery, hotels]);

  const destinationName =
    initialSuggestion?.displayName ||
    initialPayload?.searchQuery?.searchCriteria?.searchRegionName ||
    "Hotels";

  const hotelCount =
    Number(
      searchResponse?.hotelCount ??
      searchResponse?.data?.hotelCount ??
      hotels.length,
    ) || hotels.length;

  if (selectedHotel) {
    return (
      <HotelDetailsPage
        selectedHotel={selectedHotel}
        detailResponse={detailResponse}
        detailLoading={detailLoading}
        initialPayload={initialPayload}
        initialSuggestion={initialSuggestion}
        onBackToResults={() => navigate("/hotels", { state: location.state })}
        activeOption={activeOption}
        roomModalOpen={roomModalOpen}
        setActiveOption={setActiveOption}
        setRoomModalOpen={setRoomModalOpen}
      />
    );
  }

  return (
    <div className="hotel-list-page">
      <div className="hotel-shell">
        <HotelSearchBar
          payload={initialPayload}
          suggestion={initialSuggestion}
          editable={true}
          onSearch={(nextPayload, response, selectedDestination) => {
            // Update the state with new search results
            setSearchResponse(response);
            const nextHotels = extractHotels(response, nextPayload);
            setLoadedHotels(nextHotels);
            const nextLastHotelId = extractLastHotelId(response, nextHotels);
            setLastHotelId(nextLastHotelId);
            const nextHotelCount = extractHotelCount(response, nextHotels.length);
            setHasMoreResults(Boolean(nextLastHotelId) && nextHotels.length < nextHotelCount);
          }}
        />

        <ResultHeader
          destination={destinationName}
          hotelCount={hotelCount}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          favoritesOnly={favoritesOnly}
          setFavoritesOnly={setFavoritesOnly}
          onOpenMobileFilters={() => setShowMobileFilters(true)}
        />

        <FilterChips
          chips={selectedFilterChips}
          onRemove={removeFilterChip}
          onClearAll={clearAllFilters}
        />

        <div className="hotel-popular-strip">
          <Sparkles size={16} color="#ed1173" />
          <span>{`Popular in ${destinationName}`}</span>
        </div>

        {!initialPayload ? (
          <div className="hotel-empty">
            <div className="hotel-empty-title">No hotel search loaded</div>
            <div className="hotel-empty-copy">
              Start from the honeymoon hotel search to view results here.
            </div>
          </div>
        ) : (
          <div className="hotel-results-layout">
            <aside className="hotel-sidebar">
              {filtersLoading ? (
                <FilterSkeleton />
              ) : (
                <HotelFilterSidebar
                  filterGroups={filterGroups}
                  appliedFilters={appliedFilters}
                  toggleFilter={toggleFilter}
                  clearAllFilters={clearAllFilters}
                  favoritesOnly={favoritesOnly}
                  setFavoritesOnly={setFavoritesOnly}
                  hotelNameQuery={hotelNameQuery}
                  setHotelNameQuery={(value) =>
                    setAppliedFilters((prev) => ({ ...prev, hotelName: value }))
                  }
                />
              )}
            </aside>

            <section>
              {resultsError ? (
                <ErrorState
                  onRetry={() =>
                    searchHotels(
                      buildSearchPayload(initialPayload, appliedFilters, searchResponse, sortOrder, ""),
                    ).then(setSearchResponse)
                  }
                />
              ) : resultsLoading && hotels.length === 0 ? (
                <div className={viewMode === "grid" ? "hotel-grid" : "hotel-list"}>
                  {Array.from({ length: viewMode === "grid" ? 6 : 4 }).map((_, index) => (
                    <HotelCardSkeleton key={index} />
                  ))}
                </div>
              ) : visibleHotels.length === 0 ? (
                <EmptyState onClearAll={clearAllFilters} />
              ) : viewMode === "grid" ? (
                <div className="hotel-grid">
                  {visibleHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() =>
                        navigate(`/hotels/${hotel.id}`, {
                          state: {
                            ...location.state,
                            hotelSearchResponse: searchResponse,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="hotel-list">
                  {visibleHotels.map((hotel) => (
                    <HotelListCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() =>
                        navigate(`/hotels/${hotel.id}`, {
                          state: {
                            ...location.state,
                            hotelSearchResponse: searchResponse,
                          },
                        })
                      }
                    />
                  ))}
                </div>
              )}
              {!resultsError && visibleHotels.length > 0 ? (
                <>
                  {loadingMore ? <div className="hotel-load-more">Loading more hotels...</div> : null}
                  {hasMoreResults ? <div ref={loadMoreRef} className="hotel-scroll-sentinel" /> : null}
                </>
              ) : null}
            </section>
          </div>
        )}
      </div>

      <Offcanvas
        show={showMobileFilters}
        onHide={() => setShowMobileFilters(false)}
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filters</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: 0 }}>
          {filtersLoading ? (
            <div className="p-3">
              <FilterSkeleton />
            </div>
          ) : (
            <div className="p-3">
              <HotelFilterSidebar
                filterGroups={filterGroups}
                appliedFilters={appliedFilters}
                toggleFilter={toggleFilter}
                clearAllFilters={clearAllFilters}
                favoritesOnly={favoritesOnly}
                setFavoritesOnly={setFavoritesOnly}
                hotelNameQuery={hotelNameQuery}
                setHotelNameQuery={(value) =>
                  setAppliedFilters((prev) => ({ ...prev, hotelName: value }))
                }
              />
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
