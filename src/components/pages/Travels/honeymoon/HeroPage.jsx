import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, MapPin, Users, CalendarSearch, Loader2 } from "lucide-react";
import { searchAirports, searchFlights } from "../../../../services/api/flightApi";

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
    position: relative;
    z-index: 100;
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
    grid-template-columns: 1fr auto 1fr 1fr 1fr 1fr auto;
    gap: 0;
    border: 2px solid #ed1173;
    border-radius: 14px;
    overflow: visible;
    align-items: stretch;
    position: relative;
    z-index: 200;
  }

  @media (max-width: 1199px) {
    .search-fields {
      grid-template-columns: 1fr auto 1fr 1fr 1fr auto;
    }
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

  .explore-btn.loading {
    opacity: 0.9;
    cursor: wait;
  }

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

  .airport-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #ed1173;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    max-height: 250px;
    overflow-y: auto;
    z-index: 9999;
    margin-top: 8px;
    backdrop-filter: blur(10px);
    animation: slideDown 0.2s ease-out;
    min-width: 350px;
    width: auto;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .suggestion-item {
    padding: 14px 18px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .suggestion-item:hover {
    background: linear-gradient(135deg, rgba(237, 17, 115, 0.05), rgba(255, 107, 157, 0.05));
    border-left: 3px solid #ed1173;
    padding-left: 15px;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  .suggestion-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .suggestion-iata {
    font-weight: 800;
    color: #ed1173;
    font-size: 14px;
    background: rgba(237, 17, 115, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    min-width: 35px;
    text-align: center;
  }

  .suggestion-name {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 14px;
  }

  .suggestion-city {
    font-size: 12px;
    color: #666;
    margin-left: 43px;
    font-weight: 500;
  }

  .field-wrapper {
    position: relative;
    z-index: 1;
  }

  .travelers-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #ed1173;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    margin-top: 8px;
    padding: 20px;
    min-width: 300px;
    animation: slideDown 0.2s ease-out;
  }

  .traveler-type {
    margin-bottom: 16px;
  }

  .traveler-type:last-child {
    margin-bottom: 0;
  }

  .traveler-label {
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .traveler-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .traveler-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #ed1173;
    background: white;
    color: #ed1173;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.2s ease;
  }

  .traveler-button:hover {
    background: #ed1173;
    color: white;
  }

  .traveler-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .traveler-count {
    min-width: 40px;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    color: #1a1a2e;
  }

  .flight-results {
    margin-top: 24px;
    background: white;
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    border: 1px solid rgba(237, 17, 115, 0.1);
  }

  .flight-item {
    border: 2px solid #f8f9fa;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
    position: relative;
    overflow: hidden;
  }

  .flight-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ed1173, #ff6b9d);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .flight-item:hover {
    border-color: #ed1173;
    box-shadow: 0 15px 40px rgba(237, 17, 115, 0.15);
    transform: translateY(-2px);
  }

  .flight-item:hover::before {
    opacity: 1;
  }

  .flight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
  }

  .flight-airline {
    font-weight: 800;
    color: #1a1a2e;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .airline-logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 14px;
  }

  .flight-price {
    font-size: 24px;
    font-weight: 900;
    color: #ed1173;
    text-shadow: 0 2px 4px rgba(237, 17, 115, 0.1);
  }

  .flight-details {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 30px;
    align-items: center;
    margin-bottom: 20px;
  }

  .flight-time {
    text-align: center;
    position: relative;
  }

  .flight-time::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -15px;
    width: 30px;
    height: 2px;
    background: repeating-linear-gradient(90deg, #ddd, #ddd 3px, transparent 3px, transparent 6px);
    transform: translateY(-50%);
  }

  .flight-time:last-child::after {
    display: none;
  }

  .flight-time-value {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 4px;
  }

  .flight-time-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 2px;
    font-weight: 600;
  }

  .flight-time-date {
    font-size: 12px;
    color: #999;
    font-weight: 500;
  }

  .flight-duration {
    text-align: center;
    color: #666;
    font-size: 15px;
    font-weight: 600;
    padding: 12px 16px;
    background: rgba(237, 17, 115, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(237, 17, 115, 0.1);
  }

  .flight-stops {
    font-size: 12px;
    color: #ed1173;
    margin-top: 6px;
    font-weight: 700;
  }

  .flight-amenities {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .amenity-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #f8f9fa;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #666;
    border: 1px solid #e9ecef;
  }

  .amenity-badge.direct {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    border-color: rgba(76, 175, 80, 0.2);
  }

  .amenity-badge.stops {
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
    border-color: rgba(255, 152, 0, 0.2);
  }

  .seats-badge {
    background: rgba(233, 30, 99, 0.1);
    color: #e91e63;
    border-color: rgba(233, 30, 99, 0.2);
  }

  .select-button {
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(237, 17, 115, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .select-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(237, 17, 115, 0.4);
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
  }

  .results-title {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0;
  }

  .results-count {
    background: linear-gradient(135deg, #ed1173, #ff6b9d);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 14px;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
  }

  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #ed1173;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 1s linear infinite;
  }
`;

export default function FlightHero() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("round");
  const [from, setFrom] = useState("Mumbai");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [direct, setDirect] = useState(false);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const travelersRef = useRef(null);

  const swapCities = () => {
    setFrom(to || "");
    setTo(from);
  };

  // Airport search API
  const handleAirportSearch = async (keyword, type) => {
    if (keyword.length < 2) {
      if (type === 'from') {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
      return;
    }

    try {
      const data = await searchAirports(keyword);

      if (data.status && data.data) {
        if (type === 'from') {
          setFromSuggestions(data.data);
          setShowFromSuggestions(true);
        } else {
          setToSuggestions(data.data);
          setShowToSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error searching airports:', error);
    }
  };

  // Handle search click - call API then navigate to results page with params + data
  const handleSearchFlights = async () => {
    if (!from || !to || !departureDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (tripType === 'round' && !returnDate) {
      alert('Please select return date for round trip');
      return;
    }

    setLoading(true);
    try {
      const searchParams = {
        from: from,
        to: to,
        date: departureDate,
        adults: adults
      };

      // Add return date for round trip
      if (tripType === 'round') {
        searchParams.return_date = returnDate;
      }

      // Add children if any
      if (children > 0) {
        searchParams.children = children;
      }

      // Add cabin class if specified
      if (cabinClass !== 'Economy') {
        searchParams.cabin_class = cabinClass.toLowerCase();
      }

      // Add direct flight preference
      if (direct) {
        searchParams.direct = true;
      }

      // Call backend flight search API
      const response = await searchFlights(searchParams);

      // Navigate to results page with search parameters and initial API response
      navigate('/honeymoon/flights', {
        state: { searchParams, initialResults: response }
      });

    } catch (error) {
      console.error('Error searching flights:', error);
      alert('Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  // Handle airport selection
  const selectAirport = (airport, type) => {
    if (type === 'from') {
      setFrom(airport.iata);
      setShowFromSuggestions(false);
      setFromSuggestions([]);
    } else {
      setTo(airport.iata);
      setShowToSuggestions(false);
      setToSuggestions([]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromInputRef.current && !fromInputRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toInputRef.current && !toInputRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
      if (travelersRef.current && !travelersRef.current.contains(event.target)) {
        setShowTravelersDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

              <h1 className="hero-title">
                Book Cheap Flight Tickets With Ease
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
              <div className="search-card">
                <div className="d-flex align-items-center flex-wrap gap-3 mb-3 trip-radio">
                  {[
                    ["round", "Round-trip"],
                    ["oneway", "One-way"],
                    // ["multi", "Multi-city"],
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
                  {/* <select
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
                  </label> */}
                </div>

                {/* Search fields */}
                <div className="search-fields">
                  {/* From */}
                  <div className="field-box" ref={fromInputRef}>
                    <div className="field-label">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Plane size={14} /> Leaving from
                      </span>
                    </div>
                    <div className="field-wrapper">
                      <input
                        className="field-input"
                        placeholder="City or airport"
                        value={from}
                        onChange={(e) => {
                          setFrom(e.target.value);
                          handleAirportSearch(e.target.value, 'from');
                        }}
                        onFocus={() => from.length >= 2 && setShowFromSuggestions(true)}
                      />
                      {showFromSuggestions && fromSuggestions.length > 0 && (
                        <div className="airport-suggestions">
                          {fromSuggestions.map((airport, index) => (
                            <div
                              key={index}
                              className="suggestion-item"
                              onClick={() => selectAirport(airport, 'from')}
                            >
                              <div className="suggestion-main">
                                <span className="suggestion-iata">{airport.iata}</span>
                                <span className="suggestion-name">{airport.name}</span>
                              </div>
                              <div className="suggestion-city">{airport.city}, {airport.country}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
                  <div className="field-box" ref={toInputRef}>
                    <div className="field-label">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={14} /> Going to
                      </span>
                    </div>
                    <div className="field-wrapper">
                      <input
                        className="field-input"
                        placeholder="City or airport"
                        value={to}
                        onChange={(e) => {
                          setTo(e.target.value);
                          handleAirportSearch(e.target.value, 'to');
                        }}
                        onFocus={() => to.length >= 2 && setShowToSuggestions(true)}
                      />
                      {showToSuggestions && toSuggestions.length > 0 && (
                        <div className="airport-suggestions">
                          {toSuggestions.map((airport, index) => (
                            <div
                              key={index}
                              className="suggestion-item"
                              onClick={() => selectAirport(airport, 'to')}
                            >
                              <div className="suggestion-main">
                                <span className="suggestion-iata">{airport.iata}</span>
                                <span className="suggestion-name">{airport.name}</span>
                              </div>
                              <div className="suggestion-city">{airport.city}, {airport.country}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="field-sub">&nbsp;</div>
                  </div>

                  {/* Dates */}
                  <div className="field-box">
                    <div className="field-label">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <CalendarSearch size={14} /> Departure
                      </span>
                    </div>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Add departure date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                      }}
                    />
                  </div>

                  {/* Return Date - Show only for round trip */}
                  {tripType === 'round' && (
                    <div className="field-box">
                      <div className="field-label">
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <CalendarSearch size={14} /> Return
                        </span>
                      </div>
                      <input
                        className="field-input"
                        type="text"
                        placeholder="Add return date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = "text";
                        }}
                        min={departureDate}
                      />
                    </div>
                  )}

                  {/* Travelers */}
                  <div className="field-box" ref={travelersRef}>
                    <div className="field-label">
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Users size={14} /> Travelers
                      </span>
                    </div>
                    <div className="field-wrapper">
                      <div
                        className="field-value"
                        style={{ cursor: 'pointer', padding: '8px 0' }}
                        onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
                      >
                        {adults + children} {adults + children === 1 ? 'traveler' : 'travelers'}
                        {adults > 0 && `, ${adults} ${adults === 1 ? 'adult' : 'adults'}`}
                        {children > 0 && `, ${children} ${children === 1 ? 'child' : 'children'}`}
                      </div>
                      {showTravelersDropdown && (
                        <div className="travelers-dropdown">
                          <div className="traveler-type">
                            <div className="traveler-label">Adults</div>
                            <div className="traveler-controls">
                              <button
                                className="traveler-button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                              >
                                -
                              </button>
                              <div className="traveler-count">{adults}</div>
                              <button
                                className="traveler-button"
                                onClick={() => setAdults(adults + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="traveler-type">
                            <div className="traveler-label">Children</div>
                            <div className="traveler-controls">
                              <button
                                className="traveler-button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                disabled={children <= 0}
                              >
                                -
                              </button>
                              <div className="traveler-count">{children}</div>
                              <button
                                className="traveler-button"
                                onClick={() => setChildren(children + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="field-sub">{cabinClass}</div>
                  </div>

                  {/* Explore Button */}
                  <button
                    className={`explore-btn ${loading ? "loading" : ""}`}
                    onClick={handleSearchFlights}
                    disabled={loading}
                  >
                    {loading ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Loader2 size={18} className="spin" />
                        Searching flights...
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <Plane size={18} />
                        Search flights
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
