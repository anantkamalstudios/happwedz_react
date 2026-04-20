import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

const formatMoney = (value, currency) => {
  const num =
    value !== undefined && value !== null ? parseFloat(String(value)) : null;
  if (!Number.isFinite(num) || num === null) return "—";
  const prefix = currency ? `${currency} ` : "";
  return `${prefix}${num.toLocaleString("en-IN")}`;
};

const getHotelMinRate = (hotel) => {
  const rooms = Array.isArray(hotel?.rooms) ? hotel.rooms : [];
  let best = null;
  rooms.forEach((room) => {
    const rates = Array.isArray(room?.rates) ? room.rates : [];
    rates.forEach((rate) => {
      const net =
        rate?.net !== undefined && rate?.net !== null
          ? parseFloat(String(rate.net))
          : null;
      if (!Number.isFinite(net) || net === null) return;
      if (!best || net < best.net) {
        best = {
          net,
          currency: rate?.currency || null,
          boardName: rate?.boardName || rate?.boardCode || null,
          paymentType: rate?.paymentType || null,
          hasFreeCancellation: Array.isArray(rate?.cancellationPolicies)
            ? rate.cancellationPolicies.some(
              (p) =>
                p?.amount !== undefined &&
                p?.amount !== null &&
                parseFloat(String(p.amount)) === 0,
            )
            : false,
        };
      }
    });
  });
  return best;
};

const parseStarNumber = (categoryName) => {
  if (!categoryName) return null;
  const m = String(categoryName).match(/(\d+(\.\d+)?)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) ? n : null;
};

const getHotelLatLon = (hotel) => {
  const meta = hotel?.meta;
  const raw = hotel?.raw;
  let lat =
    meta?.latitude ??
    meta?.lat ??
    raw?.latitude ??
    raw?.lat ??
    raw?.coordinates?.latitude ??
    raw?.location?.latitude;
  let lon =
    meta?.longitude ??
    meta?.lng ??
    meta?.lon ??
    raw?.longitude ??
    raw?.lng ??
    raw?.lon ??
    raw?.coordinates?.longitude ??
    raw?.location?.longitude;
  lat = lat !== undefined && lat !== null ? parseFloat(String(lat)) : null;
  lon = lon !== undefined && lon !== null ? parseFloat(String(lon)) : null;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
};

/** Same Google Maps embed pattern as `Detailed.jsx` (coords first, else text search). */
const buildHotelGoogleMapInfo = (hotel, coords) => {
  const displayLocation =
    (hotel?.location && String(hotel.location).trim()) ||
    [
      hotel?.raw?.address,
      hotel?.meta?.destinationName,
      hotel?.meta?.zoneName,
      hotel?.name,
    ]
      .filter(Boolean)
      .join(", ")
      .trim() ||
    "Hotel";

  const lat = coords?.lat;
  const lng = coords?.lon;
  const hasCoords =
    coords &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  const mapSrc = hasCoords
    ? `https://maps.google.com/maps?q=${lat},${lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        displayLocation,
      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const openMapsHref = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(displayLocation)}`;

  return { mapSrc, openMapsHref, hasCoords, displayLocation };
};

export default function HotelbedsHotelsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotelId } = useParams();

  const hotels = useMemo(() => {
    const stateHotels = Array.isArray(location.state?.hotels)
      ? location.state.hotels
      : [];
    return stateHotels;
  }, [location.state]);

  const searchParams = location.state?.hotelSearchParams || null;

  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === hotelId),
    [hotelId, hotels],
  );

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [sortBy, setSortBy] = useState("price_asc");
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
  const [onlyFreeCancellation, setOnlyFreeCancellation] = useState(false);

  const hotelsWithMeta = useMemo(() => {
    return hotels.map((hotel) => {
      const minRate = getHotelMinRate(hotel);
      const starNumber = parseStarNumber(hotel?.meta?.categoryName);
      const rooms = Array.isArray(hotel?.rooms) ? hotel.rooms : [];
      const boardNames = new Set();
      const paymentTypes = new Set();
      let hasFreeCancellation = false;

      rooms.forEach((room) => {
        const rates = Array.isArray(room?.rates) ? room.rates : [];
        rates.forEach((rate) => {
          if (rate?.boardName || rate?.boardCode) {
            boardNames.add(rate.boardName || rate.boardCode);
          }
          if (rate?.paymentType) paymentTypes.add(rate.paymentType);
          if (
            !hasFreeCancellation &&
            Array.isArray(rate?.cancellationPolicies) &&
            rate.cancellationPolicies.some(
              (p) =>
                p?.amount !== undefined &&
                p?.amount !== null &&
                parseFloat(String(p.amount)) === 0,
            )
          ) {
            hasFreeCancellation = true;
          }
        });
      });

      return {
        ...hotel,
        _minRate: minRate,
        _minNet: minRate?.net ?? null,
        _currency: minRate?.currency ?? null,
        _starNumber: starNumber,
        _boardNames: Array.from(boardNames),
        _paymentTypes: Array.from(paymentTypes),
        _hasFreeCancellation: hasFreeCancellation,
      };
    });
  }, [hotels]);

  const filtersMeta = useMemo(() => {
    const starOptions = new Set();
    const boardOptions = new Set();
    const paymentTypeOptions = new Set();
    let maxNetSeen = 0;

    hotelsWithMeta.forEach((hotel) => {
      if (hotel._starNumber !== null) {
        starOptions.add(String(Math.floor(hotel._starNumber)));
      }
      (hotel._boardNames || []).forEach((b) => boardOptions.add(b));
      (hotel._paymentTypes || []).forEach((p) => paymentTypeOptions.add(p));
      if (hotel._minNet !== null && Number.isFinite(hotel._minNet)) {
        maxNetSeen = Math.max(maxNetSeen, hotel._minNet);
      }
    });

    const starsSorted = Array.from(starOptions)
      .map((s) => parseInt(s, 10))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => b - a)
      .map((n) => String(n));

    return {
      stars: starsSorted,
      boards: Array.from(boardOptions).sort((a, b) =>
        String(a).localeCompare(String(b)),
      ),
      paymentTypes: Array.from(paymentTypeOptions).sort((a, b) =>
        String(a).localeCompare(String(b)),
      ),
      maxNetSeen: maxNetSeen || 0,
    };
  }, [hotelsWithMeta]);

  const effectiveMaxPrice = maxPrice ?? (filtersMeta.maxNetSeen || null);

  const filteredHotels = useMemo(() => {
    const filtered = hotelsWithMeta.filter((hotel) => {
      if (hotel._minNet !== null && effectiveMaxPrice !== null) {
        if (hotel._minNet > effectiveMaxPrice) return false;
      }
      if (selectedStars.length > 0) {
        const starBucket =
          hotel._starNumber !== null ? String(Math.floor(hotel._starNumber)) : null;
        if (!starBucket || !selectedStars.includes(starBucket)) return false;
      }
      if (selectedBoards.length > 0) {
        const hotelBoards = Array.isArray(hotel._boardNames) ? hotel._boardNames : [];
        const matchesBoard = selectedBoards.some((b) => hotelBoards.includes(b));
        if (!matchesBoard) return false;
      }
      if (selectedPaymentTypes.length > 0) {
        const hotelPayments = Array.isArray(hotel._paymentTypes)
          ? hotel._paymentTypes
          : [];
        const matchesPayment = selectedPaymentTypes.some((p) => hotelPayments.includes(p));
        if (!matchesPayment) return false;
      }
      if (onlyFreeCancellation && !hotel._hasFreeCancellation) return false;
      return true;
    });

    const sorted = [...filtered];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => (a._minNet ?? Infinity) - (b._minNet ?? Infinity));
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => (b._minNet ?? -Infinity) - (a._minNet ?? -Infinity));
    } else if (sortBy === "rating_desc") {
      sorted.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }
    return sorted;
  }, [
    hotelsWithMeta,
    effectiveMaxPrice,
    selectedStars,
    selectedBoards,
    selectedPaymentTypes,
    onlyFreeCancellation,
    sortBy,
  ]);

  if (selectedHotel) {
    const safeGallery = Array.isArray(selectedHotel.gallery)
      ? selectedHotel.gallery.filter(Boolean)
      : [];
    const safeRooms = Array.isArray(selectedHotel.rooms) ? selectedHotel.rooms : [];
    const hotelCoords = getHotelLatLon(selectedHotel);
    const mapInfo = buildHotelGoogleMapInfo(selectedHotel, hotelCoords);

    return (
      <>
        <div className="container py-4 py-md-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              type="button"
              className="btn btn-link px-0 fs-14"
              onClick={() => navigate("/hotelbeds/hotels", { state: location.state })}
            >
              ← Back to results
            </button>
            <div className="fs-12 text-muted">
              {searchParams?.destinationCode
                ? `Destination: ${searchParams.destinationCode}`
                : ""}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-7">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: 320, borderRadius: 16, overflow: "hidden" }}
                >
                  <img
                    src={safeGallery[0] || selectedHotel.image || ""}
                    alt={selectedHotel.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-body p-3 p-md-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h1 className="h4 mb-1 fs-16">{selectedHotel.name}</h1>
                      <div className="text-muted fs-14">{selectedHotel.location}</div>
                      {selectedHotel.meta?.categoryName && (
                        <div className="fs-13 text-muted mt-1">
                          {selectedHotel.meta.categoryName}
                          {selectedHotel.meta.destinationName
                            ? ` · ${selectedHotel.meta.destinationName}`
                            : ""}
                          {selectedHotel.meta.zoneName ? ` · ${selectedHotel.meta.zoneName}` : ""}
                        </div>
                      )}
                      {hotelCoords && (
                        <div className="fs-12 text-muted mt-1">
                          Coordinates: {hotelCoords.lat.toFixed(5)}, {hotelCoords.lon.toFixed(5)}
                        </div>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="badge bg-success text-white px-2 py-1 rounded-3 mb-1">
                        <span className="fw-bold me-1">
                          {(Number(selectedHotel.rating) || 0).toFixed(1)}
                        </span>
                        <span className="fs-12">{selectedHotel.ratingLabel}</span>
                      </div>
                      <div className="fs-12 text-muted">
                        {selectedHotel.reviews || 0} reviews
                      </div>
                    </div>
                  </div>

                  {Array.isArray(selectedHotel.tags) && selectedHotel.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {selectedHotel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge rounded-pill bg-light text-dark border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedHotel.shortDescription && (
                    <p className="mb-0 fs-14 text-muted">{selectedHotel.shortDescription}</p>
                  )}

                  {safeGallery.length > 1 && (
                    <div className="mt-3">
                      <div className="fs-13 fw-semibold mb-2">
                        All photos ({safeGallery.length})
                      </div>
                      <div className="d-flex gap-2 overflow-auto pb-1">
                        {safeGallery.map((imgUrl, idx) => (
                          <img
                            key={`${imgUrl}-${idx}`}
                            src={imgUrl}
                            alt={`${selectedHotel.name} ${idx + 1}`}
                            style={{
                              width: 120,
                              height: 84,
                              objectFit: "cover",
                              background: "#f8f9fa",
                              border: "1px solid #e9ecef",
                              borderRadius: 12,
                              flexShrink: 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-3 p-md-4">
                  <div className="fs-13 text-muted mb-1">From</div>
                  <div className="h4 mb-0 primary-text">{selectedHotel.priceFrom}</div>
                  <div className="fs-12 text-muted mt-2">
                    Taxes/cancellation/promo details are inside each room rate.
                  </div>
                </div>
              </div>

              {safeRooms.length > 0 && (
                <div className="card border-0 shadow-sm rounded-4 mt-4">
                  <div className="card-body p-3 p-md-4">
                    <h2 className="h6 mb-3 fs-14">Rooms & rates</h2>
                    <div className="d-flex flex-column gap-3">
                      {safeRooms.map((room) => {
                        const firstRate = Array.isArray(room?.rates) ? room.rates[0] : null;
                        return (
                          <div
                            key={room.id}
                            className="border rounded-4 p-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setActiveRoom(room);
                              setRoomModalOpen(true);
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="fw-semibold fs-14">{room.name}</div>
                                {room.code && (
                                  <div className="fs-12 text-muted">Room code: {room.code}</div>
                                )}
                                {firstRate?.boardName && (
                                  <div className="fs-12 text-muted">{firstRate.boardName}</div>
                                )}
                              </div>
                              <div className="text-end">
                                <div className="fs-11 text-muted">Net</div>
                                <div className="fw-bold fs-14">
                                  {formatMoney(firstRate?.net, firstRate?.currency)}
                                </div>
                              </div>
                            </div>

                            <div className="fs-12 text-muted mt-2">
                              {Array.isArray(room?.rates) ? `${room.rates.length} rate(s)` : "No rates"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div id="map" className="row mt-4 pt-3 border-top">
            <div className="col-12">
              <div
                className="mb-2 fw-semibold text-dark d-flex align-items-start gap-1 fs-16"
                style={{ fontSize: "1.05rem" }}
              >
                <FaLocationDot className="mt-1 flex-shrink-0" size={16} />
                <span style={{ wordBreak: "break-word", lineHeight: 1.3 }}>
                  {mapInfo.displayLocation}
                </span>
              </div>
              <iframe
                src={mapInfo.mapSrc}
                width="100%"
                height={450}
                style={{
                  border: 0,
                  borderRadius: "12px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                  cursor: "grab",
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location Map"
              />
              <div className="mt-2">
                <a
                  href={mapInfo.openMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fs-13"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {activeRoom && (
          <Modal
            show={roomModalOpen}
            onHide={() => setRoomModalOpen(false)}
            centered
            size="lg"
          >
            <div className="modal-content rounded-4">
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title fs-16">{activeRoom.name}</h5>
                  {activeRoom.code && (
                    <div className="fs-12 text-muted">Room code: {activeRoom.code}</div>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setRoomModalOpen(false)}
                />
              </div>

              <div className="modal-body pt-2">
                {Array.isArray(activeRoom?.rates) && activeRoom.rates.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {activeRoom.rates.map((rate) => (
                      <div
                        key={rate.rateKey || JSON.stringify(rate)}
                        className="border rounded-3 p-2"
                      >
                        <div className="d-flex justify-content-between">
                          <div className="fw-semibold fs-13">
                            {rate.boardName || rate.boardCode || "Rate"}
                          </div>
                          <div className="fw-bold fs-13">
                            {formatMoney(rate.net, rate.currency)}
                          </div>
                        </div>
                        <div className="fs-12 text-muted">
                          {rate.paymentType ? `Payment: ${rate.paymentType}` : ""}
                          {rate.rateType ? ` · Type: ${rate.rateType}` : ""}
                          {rate.rateClass ? ` · Class: ${rate.rateClass}` : ""}
                        </div>

                        {Array.isArray(rate.promotions) && rate.promotions.length > 0 && (
                          <div className="fs-12 text-muted mt-1">
                            Promotions:{" "}
                            {rate.promotions
                              .map((p) => p.name || p.code)
                              .filter(Boolean)
                              .join(", ")}
                          </div>
                        )}

                        {Array.isArray(rate.taxes) && rate.taxes.length > 0 && (
                          <div className="fs-12 text-muted mt-1">
                            Taxes: {rate.taxes.length} item(s)
                          </div>
                        )}

                        {Array.isArray(rate.cancellationPolicies) &&
                          rate.cancellationPolicies.length > 0 && (
                            <div className="fs-12 text-muted mt-1">
                              Cancellation:{" "}
                              {rate.cancellationPolicies
                                .map(
                                  (p) =>
                                    `${p.from || "—"} (${p.amount ?? "—"} ${p.currency || ""})`,
                                )
                                .join(" · ")}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted">No rates available for this room.</div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div
        className="p-3 p-md-4 rounded-4 mb-4 shadow-sm"
        style={{
          background:
            "linear-gradient(120deg, rgba(237,17,115,0.15), rgba(255,107,157,0.10), rgba(255,255,255,0.95))",
          border: "1px solid rgba(237,17,115,0.20)",
        }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-end">
          <div>
            <div className="text-uppercase fs-12 fw-semibold mb-1" style={{ color: "#ed1173" }}>
              Hotelbeds Search
            </div>
            <h1 className="h4 mb-1 fs-16">Hotel search results</h1>
            <p className="text-muted fs-14 mb-2">
              Results from the Hotelbeds search API.
            </p>
            {searchParams && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {searchParams.destinationCode ? (
                  <span className="badge rounded-pill text-dark bg-white border">
                    Destination: <strong>{searchParams.destinationCode}</strong>
                  </span>
                ) : null}
                {searchParams.checkIn ? (
                  <span className="badge rounded-pill text-dark bg-white border">
                    Check-in: <strong>{searchParams.checkIn}</strong>
                  </span>
                ) : null}
                {searchParams.checkOut ? (
                  <span className="badge rounded-pill text-dark bg-white border">
                    Check-out: <strong>{searchParams.checkOut}</strong>
                  </span>
                ) : null}
              </div>
            )}
          </div>
          <div className="fs-13 text-muted">
            Showing <strong>{filteredHotels.length}</strong> / {hotels.length} hotel(s)
          </div>
        </div>
      </div>

      {hotels.length === 0 ? (
        <div className="alert alert-light border rounded-3 mb-0">
          No results yet. Search from the Hotels tab in the hero section.
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          <div className="col-lg-4">
            <div
              className="card border-0 shadow-sm rounded-4 position-sticky"
              style={{ top: 16 }}
            >
              <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 className="mb-0">Filters</h6>
                <button
                  className="btn btn-sm d-flex align-items-center justify-content-center gap-1 px-3 flex-fill flex-sm-grow-0 btn-outline-secondary text-nowrap"
                  onClick={() => {
                    setMaxPrice(null);
                    setSelectedStars([]);
                    setSelectedBoards([]);
                    setSelectedPaymentTypes([]);
                    setOnlyFreeCancellation(false);
                    setSortBy("price_asc");
                  }}
                >
                  Clear All
                </button>
              </div>

              <div className="card-body">
                <div className="mb-4">
                  <h6>Sort</h6>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price_asc">Price (low to high)</option>
                    <option value="price_desc">Price (high to low)</option>
                    <option value="rating_desc">Rating (high to low)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <h6>Price Range</h6>
                  <small className="text-muted d-block mb-2">
                    Max price (net): {formatMoney(effectiveMaxPrice, null)}
                  </small>
                  <small className="text-muted d-flex justify-content-between mb-2">
                    <span>0</span>
                    <span>{formatMoney(filtersMeta.maxNetSeen, null)}</span>
                  </small>
                  <input
                    type="range"
                    className="form-range"
                    min={0}
                    max={Math.max(1, Math.round(filtersMeta.maxNetSeen || 0))}
                    value={
                      effectiveMaxPrice !== null
                        ? Math.min(
                          Math.round(effectiveMaxPrice),
                          Math.round(filtersMeta.maxNetSeen || 0),
                        )
                        : Math.round(filtersMeta.maxNetSeen || 0)
                    }
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    disabled={!filtersMeta.maxNetSeen}
                  />
                </div>

                <div className="mb-4">
                  <h6>Policies</h6>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="freeCancellation"
                      checked={onlyFreeCancellation}
                      onChange={(e) => setOnlyFreeCancellation(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="freeCancellation">
                      Free cancellation only
                    </label>
                  </div>
                </div>

                {filtersMeta.stars.length > 0 && (
                  <div className="mb-4">
                    <h6>Stars</h6>
                    <div className="d-flex flex-column gap-2">
                      {filtersMeta.stars.map((s) => (
                        <div className="form-check" key={s}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`star-${s}`}
                            checked={selectedStars.includes(s)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedStars((prev) =>
                                checked ? [...prev, s] : prev.filter((x) => x !== s),
                              );
                            }}
                          />
                          <label className="form-check-label" htmlFor={`star-${s}`}>
                            {s} star
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filtersMeta.boards.length > 0 && (
                  <div className="mb-4">
                    <h6>Board</h6>
                    <div
                      className="d-flex flex-column gap-2"
                      style={{ maxHeight: 180, overflow: "auto" }}
                    >
                      {filtersMeta.boards.map((b) => (
                        <div className="form-check" key={b}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`board-${b}`}
                            checked={selectedBoards.includes(b)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedBoards((prev) =>
                                checked ? [...prev, b] : prev.filter((x) => x !== b),
                              );
                            }}
                          />
                          <label className="form-check-label" htmlFor={`board-${b}`}>
                            {b}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filtersMeta.paymentTypes.length > 0 && (
                  <div className="mb-0">
                    <h6>Payment Type</h6>
                    <div className="d-flex flex-column gap-2">
                      {filtersMeta.paymentTypes.map((p) => (
                        <div className="form-check" key={p}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`pay-${p}`}
                            checked={selectedPaymentTypes.includes(p)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedPaymentTypes((prev) =>
                                checked ? [...prev, p] : prev.filter((x) => x !== p),
                              );
                            }}
                          />
                          <label className="form-check-label" htmlFor={`pay-${p}`}>
                            {p}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {filteredHotels.length === 0 ? (
              <div className="alert alert-light border rounded-3 mb-0">
                No hotels match your filters. Try clearing filters.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="card border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/hotelbeds/hotels/${hotel.id}`, {
                        state: location.state,
                      })
                    }
                  >
                    <div className="row g-0">
                      <div className="col-md-4">
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: 170, borderRadius: 14, overflow: "hidden" }}
                        >
                          <img
                            src={hotel.image || ""}
                            alt={hotel.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="card-body p-3 p-md-4">
                          <div className="row g-3 align-items-stretch">
                            <div className="col-md-8">
                              <div className="d-flex align-items-start justify-content-between">
                                <h2 className="h5 mb-1 fs-16">{hotel.name}</h2>
                                <div className="badge bg-success text-white px-2 py-1 rounded-3">
                                  <span className="fw-bold me-1">
                                    {(Number(hotel.rating) || 0).toFixed(1)}
                                  </span>
                                  <span className="fs-12">{hotel.ratingLabel}</span>
                                </div>
                              </div>

                              <div className="text-muted fs-13 mb-2">{hotel.location}</div>

                              <div className="d-flex flex-wrap gap-2 mb-2">
                                {hotel.meta?.categoryName && (
                                  <span className="badge rounded-pill bg-light text-dark border">
                                    {hotel.meta.categoryName}
                                  </span>
                                )}
                                {hotel._minRate?.boardName && (
                                  <span className="badge rounded-pill bg-light text-dark border">
                                    {hotel._minRate.boardName}
                                  </span>
                                )}
                                {hotel._hasFreeCancellation && (
                                  <span className="badge rounded-pill bg-success-subtle text-success border">
                                    Free cancellation
                                  </span>
                                )}
                              </div>

                              <p className="mb-2 fs-14 text-muted">
                                {hotel.shortDescription || "Great stay for your trip."}
                              </p>

                              <div className="fs-13 text-muted">
                                {Array.isArray(hotel.rooms)
                                  ? `${hotel.rooms.length} room(s) available`
                                  : "Rooms not available"}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div
                                className="h-100 border rounded-3 p-3 d-flex flex-column justify-content-between"
                                style={{ background: "#fafbff" }}
                              >
                                <div className="text-end">
                                  <div className="fs-12 text-muted">Per night</div>
                                  <div className="h5 mb-0">
                                    {hotel._minNet !== null
                                      ? formatMoney(hotel._minNet, hotel._currency)
                                      : hotel.priceFrom}
                                  </div>
                                  {hotel._minRate?.paymentType && (
                                    <div className="fs-12 text-muted mt-1">
                                      {hotel._minRate.paymentType}
                                    </div>
                                  )}
                                </div>
                                <button type="button" className="btn btn-primary btn-sm mt-3 w-100">
                                  View Rooms
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

