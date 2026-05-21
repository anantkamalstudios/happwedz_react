import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import FightIcon from "../../../../assets/trevel_icon/airplane.png";
import HotelIcon from "../../../../assets/trevel_icon/hotel.png";
import CarIcon from "../../../../assets/trevel_icon/sedan.png";
import ActivityIcon from "../../../../assets/trevel_icon/checklist.png";
import CruiseIcon from "../../../../assets/trevel_icon/cruise-ship.png";
import FlightSearchForm from "./components/FlightSearchForm";
import HotelSearchForm from "./components/HotelSearchForm";
import InsuranceSearchPanel from "./InsuranceSearchPanel";
import "./index.css";

const formatSelectedDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function FlightHero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Flights");

  const heroTitle =
    activeTab === "Flights"
      ? "Book Cheap Flight Tickets With Ease"
      : activeTab === "Insurance"
        ? "Travel Insurance For Your Trip"
        : "Find Romantic Honeymoon Hotels";

  const heroSubtitle =
    activeTab === "Flights"
      ? "Discover your next dream destination"
      : activeTab === "Insurance"
        ? "Compare international, student & multi-trip plans"
        : "Search stays by city and destination";

  return (
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
                {
                  lucide: Shield,
                  label: "Insurance",
                  onClick: () => setActiveTab("Insurance"),
                },

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
                  type="button"
                  className={`nav-tab ${activeTab === tab.label ? "active" : ""}`}
                  onClick={tab.onClick}
                >
                  <span>
                    {tab.lucide ? (
                      <tab.lucide size={18} />
                    ) : typeof tab.icon === "object" ? (
                      <img src={tab.icon.src} alt={tab.icon.alt} />
                    ) : (
                      tab.icon
                    )}
                  </span>{" "}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="navbar-recommended">
              <span className="navbar-recommended-label">Recommended</span>
              <div
                className="navbar-recommended-pill"
                onClick={() => navigate("/honeymoon/hotels")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate("/honeymoon/hotels")
                }
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
            <h1 className="hero-title">{heroTitle}</h1>
            <p className="hero-subtitle">{heroSubtitle}</p>

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
            ) : activeTab === "Insurance" ? (
              <InsuranceSearchPanel formatSelectedDate={formatSelectedDate} />
            ) : (
              <HotelSearchForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
