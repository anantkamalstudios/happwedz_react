const createCorrelationId = () => {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const parseDateInput = (value) => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const normalized = String(value).trim();
  const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(normalized);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
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
  const date = parseDateInput(value);
  if (!date) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseJsonObjectSafely = (value) => {
  const parsed = parseJsonSafely(value);
  return parsed && typeof parsed === "object" ? parsed : {};
};

const toDisplayText = (value) => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value !== null) {
    return String(value?.name || value?.label || value?.nm || value?.value || "").trim();
  }
  return String(value || "").trim();
};

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

const normalizeTextKey = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

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
    .map((bed) => {
      if (bed?.description) return String(bed.description).trim();
      const count = bed?.bc || bed?.count || 1;
      const type = bed?.bt || bed?.type || bed?.size || "Bed";
      return `${count} ${type}`.trim();
    })
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
  const checkin = parseDateInput(searchPayload?.searchQuery?.checkinDate || searchPayload?.searchQuery?.checkInDate);
  const checkout = parseDateInput(searchPayload?.searchQuery?.checkoutDate || searchPayload?.searchQuery?.checkOutDate);
  if (!checkin || !checkout) return 1;
  const diff = Math.round((checkout.getTime() - checkin.getTime()) / 86400000);
  return diff > 0 ? diff : 1;
};

const getRoomImages = (roomMeta) =>
  normalizeImageItems([
    ...(Array.isArray(roomMeta?.img) ? roomMeta.img.flatMap((item) => item?.links || item) : []),
    ...(Array.isArray(roomMeta?.imgs) ? roomMeta.imgs : []),
  ]);

const ROOM_DESCRIPTION_SECTION_LABELS = [
  "Layout",
  "Internet",
  "Entertainment",
  "Food & Drink",
  "Sleep",
  "Bathroom",
  "Practical",
  "Comfort",
  "Need to Know",
  "Accessibility",
];

const normalizeRoomAmenityText = (value) => {
  const text = String(value || "").replace(/\s+/g, " ").trim().replace(/[.]+$/, "");
  if (!text) return "";
  if (/^cable channels$/i.test(text)) return "Television";
  if (/^climate-controlled air conditioning$/i.test(text)) {
    return "In-room climate control (air conditioning)";
  }
  return text;
};

const parseRoomDescriptionAmenities = (description) => {
  const raw = String(description || "").replace(/\s+/g, " ").trim();
  if (!raw) return [];

  let normalized = raw;
  ROOM_DESCRIPTION_SECTION_LABELS.forEach((label) => {
    normalized = normalized.replace(
      new RegExp(`\\s*${escapeRegExp(label)}\\s*-\\s*`, "gi"),
      `|||${label}:::`,
    );
  });
  normalized = normalized.replace(/\s+(Non-Smoking|Smoking)\b/gi, "|||$1");

  return normalized
    .split("|||")
    .slice(1)
    .flatMap((section) => {
      const [label, body = ""] = section.split(":::");
      const normalizedLabel = normalizeRoomAmenityText(label);
      if (!body && /^(non-smoking|smoking)$/i.test(normalizedLabel)) {
        return [normalizedLabel];
      }
      return body
        .split(/,|;|\band\b/gi)
        .map(normalizeRoomAmenityText)
        .filter(Boolean);
    });
};

const getRoomAmenities = (roomMeta, roomInfo = {}) =>
  dedupeStrings([
    ...(Array.isArray(roomMeta?.fcs) ? roomMeta.fcs.map((item) => toDisplayText(item)) : []),
    ...(Array.isArray(roomMeta?.am) ? roomMeta.am.map((item) => toDisplayText(item)) : []),
    ...(Array.isArray(roomMeta?.rma)
      ? roomMeta.rma.map((item) => {
          if (!item) return "";
          if (typeof item === "string") return item;
          if (item?.key && item?.value) return `${item.key}: ${item.value}`;
          return item?.name || item?.label || item?.value || "";
        })
      : []),
    ...(Array.isArray(roomMeta?.rexb?.BENEFIT)
      ? roomMeta.rexb.BENEFIT.flatMap((item) => item?.values || [])
      : []),
    ...parseRoomDescriptionAmenities(roomMeta?.des || roomInfo?.des || roomMeta?.radi?.des || ""),
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

const getOptionRoomNameKey = (option) =>
  normalizeTextKey(option?.roomName || option?.supplierRoomType || "");

const normalizeRoomOption = (option, optionIndex, hotelInfo, nights) => {
  const roomInfo = option?.roomInfos?.[0] || option?.ris?.[0] || {};
  const roomMeta = getRoomMetadata(hotelInfo, roomInfo);
  const images = getRoomImages(roomMeta);
  const amenities = getRoomAmenities(roomMeta, roomInfo);
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
    roomNameKey: getOptionRoomNameKey({
      roomName,
      supplierRoomType,
    }),
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

const extractStaticHotelRoot = (payload) => {
  if (Array.isArray(payload)) return payload[0] || {};
  if (!payload || typeof payload !== "object") return {};

  if (Array.isArray(payload?.data)) return payload.data[0] || {};
  if (Array.isArray(payload?.result)) return payload.result[0] || {};
  if (Array.isArray(payload?.payload)) return payload.payload[0] || {};
  if (Array.isArray(payload?.data?.result)) return payload.data.result[0] || {};

  const numericKeys = Object.keys(payload).filter((key) => /^\d+$/.test(key));
  if (numericKeys.length > 0) {
    const firstNumeric = numericKeys.sort((a, b) => Number(a) - Number(b))[0];
    return payload[firstNumeric] || {};
  }

  return payload;
};

const extractSearchIdCandidate = (payload) =>
  payload?.searchId ||
  payload?.metaData?.searchId ||
  payload?.data?.searchId ||
  payload?.data?.metaData?.searchId ||
  payload?.searchQuery?.searchId ||
  payload?.searchResult?.searchId ||
  payload?.data?.searchResult?.searchId ||
  payload?.hotelSearchResult?.searchId ||
  payload?.data?.hotelSearchResult?.searchId ||
  payload?.hotelSearchResponse?.searchId ||
  payload?.data?.hotelSearchResponse?.searchId ||
  "";

const extractRequestIdCandidate = (payload) =>
  payload?.requestId ||
  payload?.metaData?.requestId ||
  payload?.data?.requestId ||
  payload?.data?.metaData?.requestId ||
  payload?.searchResult?.requestId ||
  payload?.data?.searchResult?.requestId ||
  payload?.hotelSearchResult?.requestId ||
  payload?.data?.hotelSearchResult?.requestId ||
  "";

const extractDetailMeta = (payload) => ({
  searchId: extractSearchIdCandidate(payload) || payload?.id || "",
  requestId: extractRequestIdCandidate(payload) || payload?.id || "",
});

const normalizeHotelDetails = ({
  detailResponse,
  selectedHotel,
  searchPayload,
  selectedSuggestion,
  staticContentResponse,
}) => {
  const hotelInfo = extractDetailHotelRoot(detailResponse) || {};
  const staticHotel = extractStaticHotelRoot(staticContentResponse);
  const mergedRoomMeta = {
    ...(hotelInfo?.oprmd || {}),
    ...(staticHotel?.oprmd || {}),
  };
  const hotelInfoWithContent = {
    ...hotelInfo,
    oprmd: mergedRoomMeta,
  };
  const description =
    parseJsonSafely(staticHotel?.description || hotelInfo?.des || hotelInfo?.description || "") || {};
  const nights = getNightCount(searchPayload);
  const listImages = normalizeImageItems(selectedHotel?.images || []);
  const hotelImages = normalizeImageItems(hotelInfo?.img || hotelInfo?.images || []);
  const staticImages = normalizeImageItems(staticHotel?.images || []);
  const options = (Array.isArray(hotelInfo?.ops) ? hotelInfo.ops : [])
    .map((option, index) => normalizeRoomOption(option, index, hotelInfoWithContent, nights))
    .filter((option) => option.id);
  const sortedOptions = [...options].sort((a, b) => (a.totalPrice || Infinity) - (b.totalPrice || Infinity));
  const cheapestOption = sortedOptions[0] || null;
  
  const amenityGroups = Array.isArray(staticHotel?.tja)
    ? staticHotel.tja
        .map((group) => ({
          title: String(group?.catg || "").trim(),
          items: Array.isArray(group?.am)
            ? group.am
                .map((item) => ({
                  id: item?.id || "",
                  name: String(item?.name || "").trim(),
                  subtext: String(item?.subA || "").trim(),
                  icon: item?.icn || "",
                }))
                .filter((item) => item.name)
            : [],
        }))
        .filter((group) => group.title && group.items.length > 0)
    : [];

  const amenitySetFromTja = dedupeStrings(
    amenityGroups.flatMap((group) =>
      group.items.map((item) => (item.subtext ? `${item.name} (${item.subtext})` : item.name)),
    ),
  );
  const amenitySetFallback = dedupeStrings(
    Array.isArray(staticHotel?.facilities) ? staticHotel.facilities.map((item) => toDisplayText(item)) : [],
  );
  const amenitySet = amenitySetFromTja.length > 0 ? amenitySetFromTja : amenitySetFallback;
  
  const images = staticImages.length > 0
    ? dedupeImages([...staticImages, ...listImages, ...hotelImages, ...options.flatMap((option) => option.images)])
    : listImages.length > 0
      ? dedupeImages([...listImages, ...hotelImages])
      : dedupeImages([...hotelImages, ...options.flatMap((option) => option.images)]);
  const address = staticHotel?.ad || hotelInfo?.ad || {};
  const cityName =
    address?.ctn ||
    staticHotel?.hai?.regions?.[0]?.name ||
    address?.city?.name ||
    searchPayload?.searchQuery?.searchCriteria?.searchRegionName ||
    selectedSuggestion?.displayName ||
    selectedHotel?.location ||
    "";
  const fullAddress = buildAddressLabel(address);
  const locationInfo = staticHotel?.gl || hotelInfo?.gl || {};
  const mapSource = locationInfo?.lt && locationInfo?.ln
    ? `${locationInfo.lt},${locationInfo.ln}`
    : fullAddress || cityName || hotelInfo?.name || selectedHotel?.name || "Hotel";
  const filterData = hotelInfo?.filters || {};
  const roomMetaEntries = Object.values(mergedRoomMeta || {}).filter((item) => item && typeof item === "object");

  const roomTypeSummary = dedupeStrings(
    options.map((option) => option.roomName || option.supplierRoomType).filter(Boolean),
  );
  const mealPlanSummary = dedupeStrings(options.map((option) => option.mealBasis).filter(Boolean));

  // Extract about text primarily from content API description fields
  const instructionsArray = Array.isArray(hotelInfo?.inst) ? hotelInfo.inst : [];
  const aboutTextFromInst = instructionsArray.join(" ").trim();
  const aboutTextSections = [
    description?.location,
    description?.dining,
    description?.amenities,
    description?.rooms,
  ]
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  const aboutTextFromDesc = aboutTextSections.join("\n\n");
  const aboutTextFromApi =
    typeof staticHotel?.displayDescription === "string"
      ? staticHotel.displayDescription.trim()
      : typeof hotelInfo?.about === "string"
        ? hotelInfo.about.trim()
        : "";
  const fallbackSegments = [
    fullAddress
      ? `${hotelInfo?.name || "This hotel"} is located at ${fullAddress}.`
      : cityName
        ? `${hotelInfo?.name || "This hotel"} is located in ${cityName}.`
        : "",
    roomTypeSummary.length > 0
      ? `Available room categories include ${roomTypeSummary.join(", ")}.`
      : "",
    mealPlanSummary.length > 0
      ? `Meal plans include ${mealPlanSummary.join(" and ")}.`
      : "",
    amenitySet.length > 0
      ? `Popular amenities include ${amenitySet.slice(0, 5).join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  const finalAboutText =
    aboutTextFromApi ||
    aboutTextFromDesc ||
    aboutTextFromInst ||
    fallbackSegments ||
    `With a stay at ${hotelInfo?.name || "this hotel"} in ${cityName}, you'll be within easy reach of local attractions and amenities.`;

  const roomTypeGroupsMap = new Map();
  roomMetaEntries.forEach((roomMeta) => {
    const roomId = String(roomMeta?.roomId || "");
    const roomName = roomMeta?.srn || roomMeta?.rc || roomMeta?.rt || "Room";
    const key = roomId || normalizeTextKey(roomName);
    if (!key) return;

    const groupImages = getRoomImages(roomMeta);
    roomTypeGroupsMap.set(key, {
      groupKey: key,
      roomId,
      roomName,
      roomNameKey: normalizeTextKey(roomName),
      supplierRoomType: roomMeta?.rc || roomMeta?.rt || roomName,
      bedSummary: getRoomBedSummary(roomMeta),
      guestSummary: getRoomGuestSummary(roomMeta, roomMeta),
      amenities: getRoomAmenities(roomMeta, roomMeta),
      images: groupImages,
      image: groupImages[0]?.url || images[0]?.url || "",
      roomMeta,
      options: [],
    });
  });

  const matchedOptionIds = new Set();
  options.forEach((option) => {
    const roomIdKey = String(option?.roomId || "");
    const nameKey = option.roomNameKey || normalizeTextKey(option?.roomName || option?.supplierRoomType);
    const directGroup = roomIdKey && roomTypeGroupsMap.has(roomIdKey)
      ? roomTypeGroupsMap.get(roomIdKey)
      : Array.from(roomTypeGroupsMap.values()).find(
          (group) =>
            group.roomNameKey === nameKey ||
            normalizeTextKey(group.supplierRoomType) === nameKey,
        );

    if (directGroup) {
      directGroup.options.push(option);
      if (!directGroup.image && option.image) {
        directGroup.image = option.image;
      }
      if (!directGroup.images.length && option.images?.length) {
        directGroup.images = option.images;
      }
      matchedOptionIds.add(option.id);
      return;
    }

    const syntheticKey = roomIdKey || `${nameKey}-${option.id}`;
    roomTypeGroupsMap.set(syntheticKey, {
      groupKey: syntheticKey,
      roomId: roomIdKey,
      roomName: option.roomName,
      roomNameKey: nameKey,
      supplierRoomType: option.supplierRoomType || option.roomName,
      bedSummary: option.bedSummary,
      guestSummary: option.guestSummary,
      amenities: option.amenities || [],
      images: option.images || [],
      image: option.image || images[0]?.url || "",
      roomMeta: option.roomMeta || {},
      options: [option],
    });
    matchedOptionIds.add(option.id);
  });

  const roomTypeGroups = Array.from(roomTypeGroupsMap.values())
    .map((group) => {
      const groupedOptions = [...group.options].sort((a, b) => (a.totalPrice || Infinity) - (b.totalPrice || Infinity));
      const primaryOption = groupedOptions[0] || null;
      const groupImages = group.images?.length
        ? group.images
        : primaryOption?.images?.length
          ? primaryOption.images
          : images.slice(0, 3);

      return {
        ...group,
        images: groupImages,
        image: group.image || groupImages[0]?.url || "",
        options: groupedOptions,
        primaryOption,
        isBookable: groupedOptions.length > 0,
      };
    })
    .filter((group) => group.isBookable || group.roomId !== "0")
    .sort((a, b) => {
      const aPrice = a.primaryOption?.totalPrice || Infinity;
      const bPrice = b.primaryOption?.totalPrice || Infinity;
      if (aPrice !== bPrice) return aPrice - bPrice;
      return a.roomName.localeCompare(b.roomName);
    });

  const contentHotel = {
    id: String(staticHotel?.tjid || hotelInfo?.tjid || hotelInfo?.id || selectedHotel?.id || ""),
    name: staticHotel?.hotelFullName || staticHotel?.name || hotelInfo?.name || selectedHotel?.name || "Hotel",
    starRating: Number(staticHotel?.rating ?? hotelInfo?.rt ?? selectedHotel?.starRating ?? 0),
    address,
    cityName,
    fullAddress,
    images,
    amenities: amenitySet,
    amenityGroups,
    aboutText: finalAboutText,
    headline: staticHotel?.headline || description?.headline || hotelInfo?.name || "",
    propertyType: staticHotel?.pt || hotelInfo?.pt || "",
    regionName: staticHotel?.regionName || cityName || "",
    checkIn: staticHotel?.checkInTime || hotelInfo?.checkInTime || {},
    checkOut: staticHotel?.checkOutTime || hotelInfo?.checkOutTime || {},
  };

  return {
    meta: extractDetailMeta(detailResponse),
    id: contentHotel.id,
    name: contentHotel.name,
    starRating: contentHotel.starRating,
    address,
    cityName,
    fullAddress,
    mapInfo: {
      displayLocation: fullAddress || cityName || hotelInfo?.name || "Hotel",
      mapSrc: `https://maps.google.com/maps?q=${encodeURIComponent(mapSource)}&t=&z=13&ie=UTF8&iwloc=&output=embed`,
      openMapsHref: `https://www.google.com/maps?q=${encodeURIComponent(mapSource)}`,
    },
    description,
    headline: contentHotel.headline,
    aboutText: contentHotel.aboutText,
    amenities: contentHotel.amenities,
    amenityGroups: contentHotel.amenityGroups,
    images: contentHotel.images,
    contentHotel,
    contentImages: contentHotel.images,
    contentAmenities: contentHotel.amenities,
    contentAmenityGroups: contentHotel.amenityGroups,
    contentCheckIn: contentHotel.checkIn,
    contentCheckOut: contentHotel.checkOut,
    contentAddress: contentHotel.address,
    hotelInfo: hotelInfoWithContent,
    staticHotel,
    options,
    pricedOptions: options,
    cheapestOption,
    defaultBookableOption: cheapestOption,
    roomTypeGroups,
    filters: filterData,
    passportRequired: Boolean(hotelInfo?.passportRequired),
    panRequired: Boolean(hotelInfo?.panRequired),
    listHotel: selectedHotel,
    nights,
    importantInformation: {
      checkInInstructions: parseJsonObjectSafely(staticHotel?.checkInInstructions),
      knowBeforeYouGo: parseJsonObjectSafely(staticHotel?.knowBeforeYouGo),
      mandatoryFees: parseJsonObjectSafely(staticHotel?.mandatoryFees),
    },
  };
};

const getMealPlanOptions = (roomOptions) =>
  dedupeStrings(roomOptions.map((option) => option.mealBasis)).map((value) => ({
    label: value,
    value,
  }));

const getReviewPayloadFields = (hotelInfo, selectedHotel, detailMeta, searchPayload, searchResponse) => {
  const searchIdCandidates = [
    detailMeta?.searchId,
    extractSearchIdCandidate(searchResponse),
    extractSearchIdCandidate(searchPayload),
    extractSearchIdCandidate(selectedHotel?.raw),
    searchResponse?.metaData?.searchId,
    searchResponse?.searchId,
    searchPayload?.searchId,
    selectedHotel?.raw?.searchId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const detailRequestIdCandidates = [
    detailMeta?.requestId,
    extractRequestIdCandidate(searchResponse),
    extractRequestIdCandidate(searchPayload),
    extractRequestIdCandidate(selectedHotel?.raw),
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
  const selectedOption = reviewResponse?.selectedOption || {};
  const effectivePanRequired = Boolean(
    bookingRequirements?.panRequired ||
    selectedOption?.ipr ||
    reviewResponse?.hotelInfo?.panRequired ||
    reviewResponse?.hotelSummary?.panRequired
  );
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
      const travellerHasPanField = Object.prototype.hasOwnProperty.call(traveller || {}, "pan");
      const mustValidatePan = traveller?.pt === "ADULT" && (effectivePanRequired || travellerHasPanField);
      if (mustValidatePan) {
        const normalizedPan = String(traveller?.pan || "").trim().toUpperCase();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
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

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

const defaultFilters = () => ({
  hotelName: "",
  ratings: [],
  userRating: [],
  propertyType: [],
  mealType: [],
  cancellationPolicy: [],
  suppliers: [],
  amenities: [],
  brand: [],
  distance: [],
  popularPlaces: [],
  roomViews: [],
  priceRange: [],
  ramadanMeal: [],
  gstApplicable: [],
  onlyFavorites: false,
});

export {
  createCorrelationId,
  formatMoney,
  formatDate,
  parseJsonSafely,
  parseJsonObjectSafely,
  dedupeStrings,
  dedupeImages,
  normalizeImageItems,
  buildAddressLabel,
  getRoomMetadata,
  getRoomBedSummary,
  getRoomGuestSummary,
  getCancellationLabel,
  getCancellationPenalties,
  getNightCount,
  getRoomImages,
  getRoomAmenities,
  getRoomMealBasis,
  getOptionPanRequired,
  getOptionPanOptional,
  getOptionTotalPrice,
  getOptionNightlyPrice,
  normalizeRoomOption,
  extractDetailHotelRoot,
  extractDetailMeta,
  normalizeHotelDetails,
  getMealPlanOptions,
  getReviewPayloadFields,
  createInitialBookingForm,
  validateBookingForm,
  delay,
  normalizeAmount,
  defaultFilters,
};
