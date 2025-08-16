import React, { useState } from "react";
import {
  FiFilter,
  FiHeart,
  FiMapPin,
  FiBookmark,
  FiShare2,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiSearch,
} from "react-icons/fi";
import "../../../Matrimonial.css";
import { useParams } from "react-router-dom";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
        <h4>{title}</h4>
        {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
      </div>
      {isOpen && <div className="filter-content">{children}</div>}
    </div>
  );
};

const ProfileMatrimonial = () => {
  const { matchType } = useParams();
  const [activeTab, setActiveTab] = useState("grooms");
  const [sortBy, setSortBy] = useState("recent");

  const [selectedCities, setSelectedCities] = useState(["All Cities"]);
  const [ageRange, setAgeRange] = useState({ min: 25, max: 35 });
  const [heightRange, setHeightRange] = useState({
    min: "5'4\"",
    max: "6'0\"",
  });
  const [maritalStatus, setMaritalStatus] = useState(["Never Married"]);
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [income, setIncome] = useState("");
  const [diet, setDiet] = useState(["Vegetarian"]);
  const [motherTongue, setMotherTongue] = useState("");
  const [community, setCommunity] = useState("");

  const cities = [
    "All Cities",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Ahmedabad",
    "Surat",
    "Jaipur",
    "Lucknow",
  ];

  const subCommunities = [
    "Iyer",
    "Iyengar",
    "Namboothiri",
    "Saraswat",
    "Kanyakubj",
    "Kulin",
    "Niyogi",
    "Havyaka",
    "Kota",
    "Kashmiri Pandit",
  ];

  const profiles = {
    grooms: [
      {
        id: 1,
        name: "Rajesh Sharma",
        age: 32,
        height: "5'10\"",
        education: "MBA, IIM Ahmedabad",
        profession: "Senior Manager at Deloitte",
        location: "Mumbai, India",
        income: "₹25-30 LPA",
        family: "Brahmin, Iyer, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        name: "Vikram Iyer",
        age: 29,
        height: "5'9\"",
        education: "MS in Computer Science",
        profession: "Software Engineer at Google",
        location: "Bangalore, India",
        income: "₹35-40 LPA",
        family: "Brahmin, Iyer, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=60",
      },
    ],
    brides: [
      {
        id: 1,
        name: "Priya Sharma",
        age: 26,
        height: "5'4\"",
        education: "M.Sc Biotechnology",
        profession: "Research Scientist",
        location: "Chennai, India",
        income: "₹8-10 LPA",
        family: "Brahmin, Iyer, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 2,
        name: "Ananya Iyer",
        age: 28,
        height: "5'5\"",
        education: "MBA, Symbiosis",
        profession: "Marketing Manager",
        location: "Pune, India",
        income: "₹12-15 LPA",
        family: "Brahmin, Iyengar, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=60",
      },
    ],
  };

  const handleCityToggle = (city) => {
    if (city === "All Cities") {
      setSelectedCities(["All Cities"]);
    } else {
      if (selectedCities.includes(city)) {
        setSelectedCities(selectedCities.filter((c) => c !== city));
      } else {
        setSelectedCities(
          selectedCities.filter((c) => c !== "All Cities").concat(city)
        );
      }
    }
  };

  const resetAllFilters = () => {
    setSelectedCities(["All Cities"]);
    setAgeRange({ min: 25, max: 35 });
    setHeightRange({ min: "5'4\"", max: "6'0\"" });
    setMaritalStatus(["Never Married"]);
    setEducation("");
    setProfession("");
    setIncome("");
    setDiet(["Vegetarian"]);
    setMotherTongue("");
    setCommunity("");
  };

  return (
    <div className="matrimonial">
      <div className="brahmin-matrimonial-page">
        <div className="brahmin-page-header">
          <div className="container">
            <h1>{matchType} Matrimony</h1>
            <p>
              Find your perfect Brahmin life partner from thousands of verified
              profiles
            </p>
            <div className="brahmin-stats">
              <div className="stat-item">
                <strong>10,000+</strong>
                <span>Active Profiles</span>
              </div>
              <div className="stat-item">
                <strong>5,000+</strong>
                <span>Success Stories</span>
              </div>
              <div className="stat-item">
                <strong>20+</strong>
                <span>Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container brahmin-main-content">
          <div className="brahmin-content-wrapper">
            {/* Profiles Column */}
            <div className="brahmin-profiles-column">
              <div className="brahmin-profile-tabs">
                <button
                  className={`brahmin-tab-btn ${
                    activeTab === "grooms" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("grooms")}
                >
                  Grooms
                </button>
                <button
                  className={`brahmin-tab-btn ${
                    activeTab === "brides" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("brides")}
                >
                  Brides
                </button>
              </div>

              <div className="brahmin-sorting-options">
                <div className="brahmin-sort-by">
                  <FiFilter className="brahmin-icon" />
                  <span>Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="brahmin-sort-select"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="popular">Most Popular</option>
                    <option value="income">Income: High to Low</option>
                    <option value="age">Age: Low to High</option>
                  </select>
                </div>

                <div className="brahmin-results-count">
                  Showing {profiles[activeTab].length} profiles
                </div>
              </div>

              <div className="brahmin-profiles-grid">
                {profiles[activeTab].map((profile) => (
                  <div key={profile.id} className="brahmin-profile-card">
                    <div className="brahmin-profile-badge">Premium</div>
                    <div className="brahmin-profile-image">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="brahmin-profile-img"
                      />
                      <div className="brahmin-profile-actions">
                        <button className="brahmin-action-btn">
                          <FiHeart />
                        </button>
                        <button className="brahmin-action-btn">
                          <FiBookmark />
                        </button>
                        <button className="brahmin-action-btn">
                          <FiShare2 />
                        </button>
                      </div>
                    </div>
                    <div className="brahmin-profile-info">
                      <h3>{profile.name}</h3>
                      <div className="brahmin-profile-details">
                        <p>
                          {profile.age} yrs, {profile.height}
                        </p>
                        <p>{profile.education}</p>
                        <p>{profile.profession}</p>
                        <p>
                          <FiMapPin className="brahmin-icon" />{" "}
                          {profile.location}
                        </p>
                        <p>Annual Income: {profile.income}</p>
                        <p>Family: {profile.family}</p>
                      </div>
                      <div className="brahmin-profile-cta">
                        <button className="brahmin-view-btn">
                          <FiEye className="brahmin-icon" />
                        </button>
                        <button className="brahmin-express-btn">
                          <FiHeart className="brahmin-icon" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="brahmin-pagination">
                <button className="brahmin-page-btn active">1</button>
                <button className="brahmin-page-btn">2</button>
                <button className="brahmin-page-btn">3</button>
                <button className="brahmin-page-btn">4</button>
                <button className="brahmin-page-btn next">Next →</button>
              </div>
            </div>

            {/* Filters Column */}
            <div className="brahmin-filters-column">
              <div className="filter-panel">
                <div className="filter-panel-header">
                  <h3>Refine Search</h3>
                  <button className="reset-all" onClick={resetAllFilters}>
                    <FiX size={16} /> Reset All
                  </button>
                </div>

                <FilterSection title="City">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search city..." />
                  </div>
                  <div className="filter-options">
                    {cities.map((city) => (
                      <label key={city} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedCities.includes(city)}
                          onChange={() => handleCityToggle(city)}
                        />
                        <span className="checkmark"></span>
                        <span className="option-label">{city}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Education">
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Any Education</option>
                    <option value="B.Tech">B.Tech/B.E.</option>
                    <option value="MBA">MBA/PGDM</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="CA">CA</option>
                    <option value="Medical">Medical</option>
                    <option value="Ph.D">Ph.D</option>
                  </select>
                </FilterSection>

                <button className="apply-filters-btn">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMatrimonial;
