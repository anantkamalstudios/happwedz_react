// src/components/pages/matrimonial/BrahminMatrimonial.jsx
import React, { useState } from "react";
import {
  FiFilter,
  FiHeart,
  FiMapPin,
  FiBookmark,
  FiShare2,
  FiEye,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
// import "./BrahminMatrimonial.css";
import "../../../Matrimonial.css";
const ProfileMatrimonial = () => {
  const [activeTab, setActiveTab] = useState("grooms");
  const [sortBy, setSortBy] = useState("recent");
  const [cityFilter, setCityFilter] = useState("all");
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Sample profile data with image URLs
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
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
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
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Arun Kumar",
        age: 34,
        height: "5'11\"",
        education: "CA, CFA",
        profession: "Finance Director at HDFC",
        location: "Delhi, India",
        income: "₹45-50 LPA",
        family: "Brahmin, Iyengar, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 4,
        name: "Suresh Menon",
        age: 31,
        height: "5'8\"",
        education: "B.Tech, IIT Bombay",
        profession: "Product Manager at Amazon",
        location: "Hyderabad, India",
        income: "₹30-35 LPA",
        family: "Brahmin, Namboothiri, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
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
          "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
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
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 3,
        name: "Divya Kumar",
        age: 25,
        height: "5'3\"",
        education: "B.Com, CA Inter",
        profession: "Chartered Accountant",
        location: "Kolkata, India",
        income: "₹15-18 LPA",
        family: "Brahmin, Niyogi, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
      },
      {
        id: 4,
        name: "Shruti Nair",
        age: 27,
        height: "5'6\"",
        education: "M.Tech Computer Science",
        profession: "Data Scientist",
        location: "Bangalore, India",
        income: "₹18-20 LPA",
        family: "Brahmin, Saraswat, Vegetarian",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      },
    ],
  };

  // City options for filtering
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
  ];

  // Sub-communities
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

  return (
    <div className="brahmin-matrimonial-page">
      {/* Breadcrumb */}
      <div className="brahmin-breadcrumb">
        <div className="container">
          <span>Home</span> › <span>Matrimony</span> ›{" "}
          <span>Brahmin Matrimony</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="brahmin-page-header">
        <div className="container">
          <h1>Brahmin Matrimony</h1>
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
          {/* Left Column - Profiles */}
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
                        <FiMapPin className="brahmin-icon" /> {profile.location}
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

          {/* Right Column - Filters */}
          <div className="brahmin-filters-column">
            <div className="brahmin-filter-card">
              <h3>Filter by City</h3>
              <div className="brahmin-city-filter">
                {cities.map((city) => (
                  <button
                    key={city}
                    className={`brahmin-city-btn ${
                      cityFilter === city ? "active" : ""
                    }`}
                    onClick={() => setCityFilter(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
            <div className="brahmin-filter-card">
              <h3>Refine Your Search</h3>
              <div className="brahmin-filter-group">
                <label>Age Range</label>
                <div className="brahmin-range-inputs">
                  <select className="brahmin-range-select">
                    <option>18</option>
                    <option>20</option>
                    <option>22</option>
                    <option>25</option>
                    <option>28</option>
                    <option selected>30</option>
                    <option>35</option>
                    <option>40</option>
                  </select>
                  <span>to</span>
                  <select className="brahmin-range-select">
                    <option>25</option>
                    <option>28</option>
                    <option>30</option>
                    <option>32</option>
                    <option selected>35</option>
                    <option>40</option>
                    <option>45</option>
                    <option>50</option>
                  </select>
                </div>
              </div>

              <div className="brahmin-filter-group">
                <label>Height</label>
                <div className="brahmin-range-inputs">
                  <select className="brahmin-range-select">
                    <option>4'8"</option>
                    <option>5'0"</option>
                    <option>5'2"</option>
                    <option selected>5'4"</option>
                    <option>5'6"</option>
                    <option>5'8"</option>
                  </select>
                  <span>to</span>
                  <select className="brahmin-range-select">
                    <option>5'8"</option>
                    <option>5'10"</option>
                    <option selected>6'0"</option>
                    <option>6'2"</option>
                    <option>6'4"</option>
                  </select>
                </div>
              </div>

              <div className="brahmin-filter-group">
                <label>Marital Status</label>
                <div className="brahmin-checkbox-group">
                  <label className="brahmin-checkbox-label">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="brahmin-checkbox"
                    />{" "}
                    Never Married
                  </label>
                  <label className="brahmin-checkbox-label">
                    <input type="checkbox" className="brahmin-checkbox" />{" "}
                    Divorced
                  </label>
                  <label className="brahmin-checkbox-label">
                    <input type="checkbox" className="brahmin-checkbox" />{" "}
                    Widowed
                  </label>
                </div>
              </div>

              <div className="brahmin-filter-group">
                <label>Education</label>
                <select className="brahmin-filter-select">
                  <option>Any</option>
                  <option>B.Tech/B.E.</option>
                  <option>MBA/PGDM</option>
                  <option>M.Tech</option>
                  <option>CA</option>
                  <option>Medical</option>
                  <option>Ph.D</option>
                </select>
              </div>

              <div className="brahmin-filter-group">
                <label>Profession</label>
                <select className="brahmin-filter-select">
                  <option>Any</option>
                  <option>Software Professional</option>
                  <option>Doctor</option>
                  <option>Civil Services</option>
                  <option>Business</option>
                  <option>Teacher</option>
                  <option>Government Employee</option>
                </select>
              </div>

              <div
                className="brahmin-more-filters-toggle"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
              >
                More Filters{" "}
                <FiChevronDown
                  className={`brahmin-icon ${showMoreFilters ? "rotate" : ""}`}
                />
              </div>

              {showMoreFilters && (
                <div className="brahmin-more-filters">
                  <div className="brahmin-filter-group">
                    <label>Income</label>
                    <select className="brahmin-filter-select">
                      <option>Any</option>
                      <option>No Income</option>
                      <option>Below ₹1 Lakh</option>
                      <option>₹1-2 Lakhs</option>
                      <option>₹2-5 Lakhs</option>
                      <option>₹5-10 Lakhs</option>
                      <option>₹10+ Lakhs</option>
                    </select>
                  </div>

                  <div className="brahmin-filter-group">
                    <label>Diet</label>
                    <div className="brahmin-checkbox-group">
                      <label className="brahmin-checkbox-label">
                        <input type="checkbox" className="brahmin-checkbox" />{" "}
                        Vegetarian
                      </label>
                      <label className="brahmin-checkbox-label">
                        <input type="checkbox" className="brahmin-checkbox" />{" "}
                        Non-Vegetarian
                      </label>
                      <label className="brahmin-checkbox-label">
                        <input type="checkbox" className="brahmin-checkbox" />{" "}
                        Eggetarian
                      </label>
                    </div>
                  </div>

                  <div className="brahmin-filter-group">
                    <label>Mother Tongue</label>
                    <select className="brahmin-filter-select">
                      <option>Any</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                      <option>Tamil</option>
                      <option>Telugu</option>
                      <option>Bengali</option>
                      <option>Malayalam</option>
                    </select>
                  </div>
                </div>
              )}

              <button className="brahmin-apply-btn">Apply Filters</button>
              <button className="brahmin-reset-btn">Reset Filters</button>
            </div>

            <div className="brahmin-info-card">
              <h3>Brahmin Matrimony</h3>
              <p>
                Brahmin matrimony is one of the oldest and most respected
                communities in India. Brahmin brides and grooms are known for
                their strong cultural values and education.
              </p>
              <p>
                Find your perfect match from sub-communities like Iyer, Iyengar,
                Namboothiri, Saraswat, and more.
              </p>

              <div className="brahmin-sub-communities">
                <h4>Popular Sub-Communities</h4>
                <div className="brahmin-community-list">
                  {subCommunities.map((community) => (
                    <div key={community} className="brahmin-community-item">
                      {community} <FiChevronRight className="brahmin-icon" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMatrimonial;
