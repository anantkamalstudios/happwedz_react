import React, { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [22.3511148, 78.6677428];
const DEFAULT_ZOOM = 5;

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [32, 32] });
    }
  }, [points, map]);
  return null;
}

// Simple cache to avoid repeat geocodes in a session
const geocodeCache = new Map(); // key: query, value: { lat, lon }

async function geocodeLocation(query) {
  const key = (query || "").trim().toLowerCase();
  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      key
    )}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "HappyWedz/1.0 (contact: info@happywedz.example)",
      },
    });
    const data = await res.json();
    const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const result = first
      ? { lat: parseFloat(first.lat), lng: parseFloat(first.lon) }
      : null;
    geocodeCache.set(key, result);
    return result;
  } catch (e) {
    return null;
  }
}

const MapView = ({ subVenuesData = [], section }) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  console.log(subVenuesData, "subVenuesData from mapping");

  useEffect(() => {
    isMounted.current = true;
    const run = async () => {
      setLoading(true);
      const tasks = subVenuesData.map(async (v) => {
        // Prefer explicit coordinates if added later
        if (v.lat && v.lng) return { ...v, lat: v.lat, lng: v.lng };
        const q = v.location || v.name;
        const coords = await geocodeLocation(q);
        if (coords) return { ...v, ...coords };
        return null;
      });
      const results = (await Promise.all(tasks)).filter(Boolean);
      if (isMounted.current) setPoints(results);
      setLoading(false);
    };
    run();
    return () => {
      isMounted.current = false;
    };
  }, [subVenuesData]);

  const center = useMemo(() => {
    if (points.length > 0) return [points[0].lat, points[0].lng];
    return DEFAULT_CENTER;
  }, [points]);

  return (
    <div className="container-fluid py-3">
      {loading && (
        <div className="text-center text-muted small mb-2">Loading map…</div>
      )}
      <div
        className="rounded-4 overflow-hidden shadow-sm"
        style={{ height: 480 }}
      >
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={points} />

          {points.map((v) => (
            <Marker key={v.id || v.slug || v.name} position={[v.lat, v.lng]}>
              <Popup maxWidth={320} className="small">
                <div className="d-flex gap-3" style={{ minWidth: 220 }}>
                  <div className="flex-shrink-0">
                    <img
                      src={v.image}
                      alt={v.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "logo-no-bg.png";
                        e.currentTarget.style.objectFit = "contain";
                        e.currentTarget.style.background = "#fafafa";
                      }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold mb-1">{v.name}</div>
                    <div
                      className="text-muted mb-1"
                      style={{ lineHeight: 1.2 }}
                    >
                      {v.location}
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      {v.rating && (
                        <span className="badge bg-success">{v.rating}★</span>
                      )}
                      {v.price && (
                        <span className="badge bg-light text-muted border">
                          {v.price}
                        </span>
                      )}
                    </div>
                    <button className="btn btn-sm btn-primary rounded-pill px-3">
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {points.length === 0 && !loading && (
        <div className="text-center text-muted small mt-2">
          No mappable venues for this selection.
        </div>
      )}
    </div>
  );
};

export default MapView;
