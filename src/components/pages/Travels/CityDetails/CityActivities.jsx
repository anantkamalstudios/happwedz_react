import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./CityActivities.css";

const CityActivities = () => {
  const { cityName } = useParams();

  // Normalize city name for data lookup (lowercase)
  const cityKey = cityName?.toLowerCase();

  const gygAffiliateLinks = {
    rome: "https://www.getyourguide.com/rome-l33/?partner_id=235SCEF&utm_medium=online_publisher&cmp=rome",
    paris:
      "https://www.getyourguide.com/paris-l16/?partner_id=235SCEF&utm_medium=online_publisher",
    london:
      "https://www.getyourguide.com/london-l57/?partner_id=235SCEF&utm_medium=online_publisher",
    "new york city":
      "https://www.getyourguide.com/new-york-city-l59/?partner_id=235SCEF&utm_medium=online_publisher",
    dubai:
      "https://www.getyourguide.com/dubai-l173/?partner_id=235SCEF&utm_medium=online_publisher",
    barcelona:
      "https://www.getyourguide.com/barcelona-l45/?partner_id=235SCEF&utm_medium=online_publisher",
  };

  const viatorAffiliateLinks = {
    rome: "https://www.viator.com/Rome/d511-ttd?pid=P00234765&mcid=42383&medium=link&campaign=rome",
    paris:
      "https://www.viator.com/Paris/d479-ttd?pid=P00234765&mcid=42383&medium=link",
    london:
      "https://www.viator.com/London/d737-ttd?pid=P00234765&mcid=42383&medium=link",
    "new york city":
      "https://www.viator.com/New-York-City/d687-ttd?pid=P00234765&mcid=42383&medium=link",
    dubai:
      "https://www.viator.com/Dubai/d828-ttd?pid=P00234765&mcid=42383&medium=link",
    barcelona:
      "https://www.viator.com/Barcelona/d562-ttd?pid=P00234765&mcid=42383&medium=link",
  };

  // Data for different cities
  const cityData = {
    rome: {
      title: "Rome, Italy",
      subtitle:
        "The Eternal City with top tours and activities from trusted partners",
      activities: [
        {
          id: 3,
          provider: "Viator",
          title: "Best Rome tours and excursions",
          description:
            "Book unique experiences, day trips, and guided tours. From food walking tours to ancient ruins.",
          link: viatorAffiliateLinks.rome,
          buttonText: "View on Viator",
          tag: "Great value",
          // discount: "84% OFF",
          highlights: [
            "Top-rated local guides and small groups",
            "Day trips and city highlights in one place",
            "Secure booking with instant confirmation",
          ],
        },
        {
          id: 1,
          provider: "GetYourGuide",
          title: "Premium Rome tours and fast-track tickets",
          description:
            "Skip the line at the Colosseum, explore the Vatican Museums, and discover hidden gems with local guides.",
          link: "https://www.getyourguide.com/rome-l33/?partner_id=235SCEF&utm_medium=online_publisher&cmp=rome",
          buttonText: "View on GetYourGuide",
          tag: "Most popular",
          // discount: "85% OFF",
          featured: true,
          highlights: [
            "500+ Rome experiences with verified reviews",
            "Free cancellation on many activities",
            "Skip-the-line options for top attractions",
          ],
        },
        {
          id: 2,
          provider: "Tiqets",
          title: "All Rome attractions in one view",
          description:
            "Explore a curated list of the best things to do in Rome, from free walking tours to premium experiences.",
          link: "https://www.getyourguide.com/s/?q=Rome&customerSearch=1", // Fallback generic search
          buttonText: "View on Tiqets",
          tag: "Explore more",
          // discount: "Top picks",
          highlights: [
            "Compare activities across categories",
            "Flexible durations and group sizes",
            "Instant online booking",
          ],
        },
      ],
    },
    // Fallback data for other cities
    default: {
      title: cityName || "Discover City",
      subtitle: `Explore the best activities and tours in ${cityName}`,
      activities: [
        {
          id: 3,
          provider: "Viator",
          title: `${cityName} Tours & Excursions`,
          description:
            "Discover local culture, food, and landmarks with expert guides.",
          link:
            viatorAffiliateLinks[cityKey] ||
            `https://www.viator.com/searchResults/all?text=${cityName}&pid=P00234765&mcid=42383`,
          buttonText: "View on Viator",
          tag: "Great value",
          highlights: [
            "Handpicked tours with flexible scheduling",
            "Secure payments and support",
            "From day trips to short activities",
          ],
        },
        {
          id: 1,
          provider: "GetYourGuide",
          title: `Top Things to Do in ${cityName}`,
          description:
            "Find the best rated tours and activities with free cancellation.",
          link:
            gygAffiliateLinks[cityKey] ||
            `https://www.getyourguide.com/s/?q=${cityName}&partner_id=235SCEF`,
          buttonText: "View on GetYourGuide",
          tag: "Most popular",
          featured: true,
          highlights: [
            "Wide range of tours and tickets",
            "Verified reviews from real travelers",
            "Free cancellation on many options",
          ],
        },
        {
          id: 2,
          provider: "Tiqets",
          title: "All Rome attractions in one view",
          description:
            "Explore a curated list of the best things to do in Rome, from free walking tours to premium experiences.",
          link: "https://www.getyourguide.com/s/?q=Rome&customerSearch=1", // Fallback generic search
          buttonText: "View on Tiqets",
          tag: "Explore more",
          // discount: "Top picks",
          highlights: [
            "Compare activities across categories",
            "Flexible durations and group sizes",
            "Instant online booking",
          ],
        },
      ],
    },
  };

  const currentCity = cityData[cityKey] || cityData.default;
  const heroCategories = [
    "Top attractions",
    "Day trips",
    "Museums",
    "Food & wine",
    "Guided tours",
  ];
  const [filters, setFilters] = useState({
    country: "Italy",
    city: cityName || "Rome",
    attractionType: "Top attractions",
  });
  const [activeCategory, setActiveCategory] = useState(heroCategories[0]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="city-activities-container">
      <div className="container">
        <div className="city-hero-section">
          <h2 className="hero-title">
            Choose an experience and explore {currentCity.title}
          </h2>
          <p className="hero-subtitle">
            Pick a category to see the best options from our partners.
          </p>
          <div className="hero-chips">
            {heroCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  category === activeCategory
                    ? "hero-chip hero-chip-active"
                    : "hero-chip"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="city-filter-bar">
          <div className="filter-group">
            <span className="filter-label">Country</span>
            <div className="filter-select">
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange("country", e.target.value)}
              >
                <option value="Italy">Italy</option>
                <option value="France">France</option>
                <option value="Netherlands">Netherlands</option>
                <option value="USA">USA</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">City</span>
            <div className="filter-select">
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value={cityName || "Rome"}>{cityName || "Rome"}</option>
                <option value="Paris">Paris</option>
                <option value="Amsterdam">Amsterdam</option>
                <option value="New York">New York</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">Top attraction</span>
            <div className="filter-select">
              <select
                value={filters.attractionType}
                onChange={(e) =>
                  handleFilterChange("attractionType", e.target.value)
                }
              >
                <option value="Top attractions">Top attractions</option>
                <option value="Day trips">Day trips</option>
                <option value="Museums">Museums</option>
                <option value="Food & wine">Food & wine</option>
                <option value="Guided tours">Guided tours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="activities-grid">
          {currentCity.activities.map((activity) => (
            <a
              key={activity.id}
              href={activity.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`activity-card ${activity.featured ? "featured" : ""}`}
            >
              <div className="activity-card-header">
                <div className="activity-tag">{activity.tag}</div>
                {activity.discount && (
                  <div className="activity-discount">{activity.discount}</div>
                )}
              </div>

              <div className="activity-body">
                <div className="activity-provider">{activity.provider}</div>
                <h3 className="activity-title">{activity.title}</h3>
                <p className="activity-description">{activity.description}</p>

                {activity.highlights && (
                  <ul className="activity-features">
                    {activity.highlights.map((item, index) => (
                      <li key={index}>
                        <span className="feature-bullet" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="activity-footer">
                  <span className="activity-action">
                    {activity.buttonText}
                    <span>→</span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityActivities;
