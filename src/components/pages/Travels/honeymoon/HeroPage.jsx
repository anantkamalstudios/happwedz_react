import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FightIcon from "../../../../assets/trevel_icon/airplane.png";
import HotelIcon from "../../../../assets/trevel_icon/hotel.png";
import CarIcon from "../../../../assets/trevel_icon/sedan.png";
import ActivityIcon from "../../../../assets/trevel_icon/checklist.png";
import CruiseIcon from "../../../../assets/trevel_icon/cruise-ship.png";
import FlightSearchForm from "./components/FlightSearchForm";
import HotelSearchForm from "./components/HotelSearchForm";
import UpcomingBookings from "./components/UpcomingBookings";
import "./index.css";

export default function FlightHero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Flights");

  return (
    <>
    <div className="flight-hero">
      <nav className="navbar-custom">
        <div className="container">
          <div className="navbar-content">
            <div className="nav-tabs">
              {[
                {
                  icon: { src: HotelIcon, alt: "Hotels" },
                  label: "Hotels",
                  onClick: () => setActiveTab("Hotels"),
                },
                {
                  icon: { src: FightIcon, alt: "Flights" },
                  label: "Flights",
                  onClick: () => setActiveTab("Flights"),
                },
                { icon: { src: CruiseIcon, alt: "cruise" }, label: "cruise" },
                {
                  icon: { src: CarIcon, alt: "Car rental" },
                  label: "Car rental",
                },
                {
                  icon: { src: ActivityIcon, alt: "Activities" },
                  label: "Activities",
                  onClick: () => navigate("/travels"),
                },
              ].map((tab) => (
                <button
                  key={tab.label}
                  className={`nav-tab ${activeTab === tab.label ? "active" : ""}`}
                  onClick={tab.onClick}
                >
                  <span>
                    {typeof tab.icon === "object" ? (
                      <img src={tab.icon.src} alt={tab.icon.alt} />
                    ) : (
                      tab.icon
                    )}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="navbar-recommended">
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

      <div className="container hero-container">
        <span className="plane-icon">✈️</span>

        <div className="row align-items-start">
          <div className="col-12 hero-header">
            <h1 className="hero-title">
              {activeTab === "Flights"
                ? "Book Cheap Flight Tickets With Ease"
                : "Find Romantic Honeymoon Hotels"}
            </h1>
            <p className="hero-subtitle">
              {activeTab === "Flights"
                ? "Discover your next dream destination"
                : "Search stays by country and destination"}
            </p>

            <div className="stats-row">
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
            {activeTab === "Flights" ? (
              <FlightSearchForm />
            ) : (
              <HotelSearchForm />
            )}
          </div>
        </div>
      </div>
    </div>

    {activeTab === "Flights" && (
      <div className="ub-section">
        <UpcomingBookings />
      </div>
    )}
    </>
  );
}
