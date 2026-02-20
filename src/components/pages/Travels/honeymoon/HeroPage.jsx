import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Inter:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .flight-hero {
    min-height: 100vh;
    background-image: url('https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Poppins', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .flight-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }

  .navbar-custom {
    background: rgba(0,0,0,0.15);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 12px 0;
  }

  .navbar-recommended {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .navbar-recommended-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
  }

  .navbar-recommended-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .navbar-recommended-pill:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }

  .nav-tab {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 18px;
    border-radius: 25px;
    color: rgba(255,255,255,0.75);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all 0.2s ease;
    text-decoration: none;
    white-space: nowrap;
  }

  .nav-tab:hover { color: #fff; background: rgba(255,255,255,0.1); }

  .nav-tab.active {
    color: #ed1173;
    background: #fff;
    font-weight: 600;
  }

  .hero-title {
    font-size: clamp(2rem, 5vw, 3.6rem);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 10px;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.75);
    font-weight: 400;
  }

  .search-card {
    background: #fff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.3);
  }

  .trip-radio label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .trip-radio input[type=radio] { accent-color: #ed1173; width: 16px; height: 16px; }
  .trip-radio input[type=checkbox] { accent-color: #ed1173; width: 16px; height: 16px; }

  .class-select {
    border: none;
    outline: none;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    background: transparent;
  }

  .search-fields {
    display: grid;
    grid-template-columns: 1fr auto 1fr 1fr 1fr auto;
    gap: 0;
    border: 2px solid #ed1173;
    border-radius: 14px;
    overflow: hidden;
    align-items: stretch;
  }

  @media (max-width: 991px) {
    .search-fields {
      grid-template-columns: 1fr 1fr;
      border-radius: 14px;
    }
    .swap-btn-wrap { grid-column: 1 / -1; display: flex; justify-content: center; padding: 6px; border-right: none !important; }
    .explore-btn { grid-column: 1 / -1; border-radius: 0 0 12px 12px !important; }
  }

  @media (max-width: 575px) {
    .search-fields { grid-template-columns: 1fr; }
    .swap-btn-wrap { grid-column: 1; }
    .explore-btn { grid-column: 1; }
  }

  .field-box {
    padding: 14px 18px;
    border-right: 1px solid #f0e0e8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .field-box:last-of-type { border-right: none; }

  .field-label {
    font-size: 11px;
    color: #999;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }

  .field-value {
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .field-sub {
    font-size: 12px;
    color: #aaa;
    margin-top: 1px;
  }

  .field-input {
    border: none;
    outline: none;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e;
    width: 100%;
    background: transparent;
    font-family: 'Poppins', sans-serif;
  }

  .field-input::placeholder { color: #bbb; font-weight: 500; }

  .swap-btn-wrap {
    display: flex;
    align-items: center;
    padding: 8px 6px;
    border-right: 1px solid #f0e0e8;
    background: #fff9fb;
  }

  .swap-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 2px solid #ed1173;
    background: #fff;
    color: #ed1173;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }

  .swap-btn:hover { background: #ed1173; color: #fff; }

  .explore-btn {
    background: linear-gradient(135deg, #ed1173, #c0006a);
    color: #fff;
    border: none;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.5px;
    font-family: 'Poppins', sans-serif;
    transition: all 0.2s;
    white-space: nowrap;
    border-radius: 0 12px 12px 0;
  }

  .explore-btn:hover { background: linear-gradient(135deg, #ff2a8a, #ed1173); transform: scale(1.02); }

  .stats-row {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    margin-top: 48px;
  }

  .stat-item { color: rgba(255,255,255,0.9); }
  .stat-num { font-size: 1.8rem; font-weight: 800; }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.6); font-weight: 500; }

  .explore-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 30px;
    padding: 6px 16px;
    color: rgba(255,255,255,0.85);
    font-size: 13px;
    margin-bottom: 20px;
    backdrop-filter: blur(6px);
  }

  .dot { width: 8px; height: 8px; border-radius: 50%; background: #ed1173; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  .plane-icon {
    font-size: 6rem;
    opacity: 0.08;
    position: absolute;
    top: 60px; right: -20px;
    transform: rotate(-20deg);
    pointer-events: none;
  }

  @media (min-width: 992px) { .plane-icon { font-size: 10rem; right: 40px; opacity: 0.1; } }

  .recommended-section {
    margin-top: 40px;
  }

  .recommended-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
  }

  .recommended-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .recommended-card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 16px 18px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    color: #fff;
  }

  .recommended-tag {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 6px;
  }

  .recommended-name {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .recommended-meta {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
  }
`;

export default function FlightHero() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("Mumbai");
  const [to, setTo] = useState("");
  const [dates, setDates] = useState("");
  const [direct, setDirect] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");

  const swapCities = () => {
    setFrom(to || "");
    setTo(from);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="flight-hero">
        {/* Navbar */}
        <nav className="navbar-custom">
          <div className="container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-1 flex-wrap">
                {[
                  { icon: "🛏️", label: "Stays" },
                  { icon: "✈️", label: "Flights", active: true },
                  { icon: "🏨", label: "Flight + Hotel" },
                  { icon: "🚗", label: "Car rental" },
                  {
                    icon: "🎡",
                    label: "Activities",
                    onClick: () => navigate("/travels"),
                  },
                ].map((tab) => (
                  <button
                    key={tab.label}
                    className={`nav-tab ${tab.active ? "active" : ""}`}
                    onClick={tab.onClick}
                  >
                    <span>{tab.icon}</span> {tab.label}
                  </button>
                ))}
              </div>

              <div className="navbar-recommended d-none d-md-flex">
                <span className="navbar-recommended-label">Recommended</span>
                <div
                  className="navbar-recommended-pill"
                  onClick={() => navigate("/honeymoon/hotels")}
                >
                  <span>🏨</span>
                  <span>Recommended hotel</span>
                </div>
                <div className="navbar-recommended-pill">
                  <span>✨</span>
                  <span>Recommended activity</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="container py-5" style={{ position: "relative" }}>
          <span className="plane-icon">✈️</span>

          <div className="row align-items-start">
            <div className="col-12 mb-5">
              <div className="explore-badge">
                <span className="dot"></span>✨ Best fares across 500+ airlines
              </div>
              <h1 className="hero-title">
                book cheap flight tickets with ease
                <br />
              </h1>
              <p className="hero-subtitle">
                Discover your next dream destination
              </p>

              {/* Stats */}
              <div className="stats-row d-none d-md-flex">
                {[
                  ["100+", "Airlines"],
                  ["20k+", "Travelers"],
                  ["10+", "Countries"],
                ].map(([n, l]) => (
                  <div key={l} className="stat-item">
                    <div className="stat-num">{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12">
              <div className="recommended-section">
                <div className="recommended-title">Recommended Picks</div>
                <div className="recommended-grid">
                  <div
                    className="recommended-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/honeymoon/hotels")}
                  >
                    <div className="recommended-tag">Recommended hotel</div>
                    <div className="recommended-name">
                      Romantic Beachfront Resort
                    </div>
                    <div className="recommended-meta">4.8 • Goa • ₹₹₹</div>
                  </div>
                  <div className="recommended-card">
                    <div className="recommended-tag">Recommended activity</div>
                    <div className="recommended-name">
                      Sunset cruise and candlelight dinner
                    </div>
                    <div className="recommended-meta">
                      4.9 • Popular for couples
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="search-card">
                <div className="d-flex align-items-center flex-wrap gap-3 mb-3 trip-radio">
                  {[
                    ["round", "Round-trip"],
                    ["oneway", "One-way"],
                    ["multi", "Multi-city"],
                  ].map(([val, label]) => (
                    <label key={val}>
                      <input
                        type="radio"
                        name="trip"
                        value={val}
                        checked={tripType === val}
                        onChange={() => setTripType(val)}
                      />
                      {label}
                    </label>
                  ))}
                  <select
                    className="class-select ms-1"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                  >
                    {[
                      "Economy",
                      "Business",
                      "First Class",
                      "Premium Economy",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <label className="ms-auto trip-radio">
                    <input
                      type="checkbox"
                      checked={direct}
                      onChange={(e) => setDirect(e.target.checked)}
                    />
                    Direct flights only
                  </label>
                </div>

                {/* Search fields */}
                <div className="search-fields">
                  {/* From */}
                  <div className="field-box">
                    <div className="field-label">✈ Leaving from</div>
                    <input
                      className="field-input"
                      placeholder="City or airport"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                    <div className="field-sub">All airports</div>
                  </div>

                  {/* Swap */}
                  <div className="swap-btn-wrap">
                    <button
                      className="swap-btn"
                      onClick={swapCities}
                      title="Swap cities"
                    >
                      ⇄
                    </button>
                  </div>

                  {/* To */}
                  <div className="field-box">
                    <div className="field-label">🛬 Going to</div>
                    <input
                      className="field-input"
                      placeholder="City or airport"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    <div className="field-sub">&nbsp;</div>
                  </div>

                  {/* Dates */}
                  <div className="field-box">
                    <div className="field-label">📅 Travel dates</div>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Add dates"
                      value={dates}
                      onChange={(e) => setDates(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                    />
                  </div>

                  {/* Travelers */}
                  <div className="field-box">
                    <div className="field-label">👤 Travelers</div>
                    <div className="field-value">1 adult</div>
                    <div className="field-sub">{cabinClass}</div>
                  </div>

                  {/* Explore Button */}
                  <button className="explore-btn">🔍 Explore</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
