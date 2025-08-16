import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Heart,
  User,
  Star,
  Eye,
  MessageCircle,
  Sliders,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../../../Matrimonialdashboard.css";

const SearchComponent = () => {
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    ageRange: "",
    education: "",
    profession: "",
    interests: "",
    gender: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  return (
    <div className="matrimonial-search-container">
      {/* Search Bar */}
      <div className="matrimonial-search-bar">
        <Search size={20} className="matrimonial-search-icon" />
        <input
          type="text"
          placeholder="Search profiles..."
          className="matrimonial-search-input"
        />
        <button
          className="matrimonial-filter-btn"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Sliders size={18} /> {isMobile ? "" : "Filters"}
        </button>
      </div>

      {/* Filters Section */}
      {isFilterOpen && (
        <div className="matrimonial-filters-grid">
          {/* Location */}
          <div className="matrimonial-filter-item">
            <MapPin size={16} />
            <input
              type="text"
              placeholder="Location"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="matrimonial-filter-input"
            />
          </div>

          {/* Age Range */}
          <div className="matrimonial-filter-item">
            <Calendar size={16} />
            <select
              value={searchFilters.ageRange}
              onChange={(e) => handleFilterChange("ageRange", e.target.value)}
              className="matrimonial-filter-select"
            >
              <option value="">Age Range</option>
              <option value="18-25">18-25</option>
              <option value="26-30">26-30</option>
              <option value="31-35">31-35</option>
              <option value="36+">36+</option>
            </select>
          </div>

          {/* Education */}
          <div className="matrimonial-filter-item">
            <GraduationCap size={16} />
            <input
              type="text"
              placeholder="Education"
              value={searchFilters.education}
              onChange={(e) => handleFilterChange("education", e.target.value)}
              className="matrimonial-filter-input"
            />
          </div>

          {/* Profession */}
          <div className="matrimonial-filter-item">
            <Briefcase size={16} />
            <input
              type="text"
              placeholder="Profession"
              value={searchFilters.profession}
              onChange={(e) => handleFilterChange("profession", e.target.value)}
              className="matrimonial-filter-input"
            />
          </div>

          {/* Interests */}
          <div className="matrimonial-filter-item">
            <Heart size={16} />
            <input
              type="text"
              placeholder="Interests"
              value={searchFilters.interests}
              onChange={(e) => handleFilterChange("interests", e.target.value)}
              className="matrimonial-filter-input"
            />
          </div>

          {/* Gender */}
          <div className="matrimonial-filter-item">
            <User size={16} />
            <select
              value={searchFilters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
              className="matrimonial-filter-select"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="matrimonial-results-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="matrimonial-profile-card">
            <div className="matrimonial-profile-header">
              <img
                src={`https://randomuser.me/api/portraits/men/${item + 10}.jpg`}
                alt="Profile"
                className="matrimonial-profile-img"
              />
              <div>
                <h3 className="matrimonial-profile-name">John Doe, 28</h3>
                <p className="matrimonial-profile-meta">
                  <MapPin size={14} /> Mumbai, India
                </p>
              </div>
            </div>
            <div className="matrimonial-profile-details">
              <p>
                <GraduationCap size={14} /> MBA Graduate
              </p>
              <p>
                <Briefcase size={14} /> Software Engineer
              </p>
              <p>
                <Heart size={14} /> Music, Travel, Photography
              </p>
            </div>
            <div className="matrimonial-profile-actions">
              <button className="matrimonial-btn-outline">
                <Star size={14} /> Shortlist
              </button>
              <button className="matrimonial-btn-outline">
                <Eye size={14} /> View Profile
              </button>
              <button className="matrimonial-btn-primary">
                <MessageCircle size={14} /> Send Interest
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
