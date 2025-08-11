// src/components/SearchSection.js
import React, { useState } from "react";

const SearchSection = () => {
  const [searchData, setSearchData] = useState({
    gender: "Female",
    ageFrom: 25,
    ageTo: 30,
    religion: "Any",
    community: "Any",
    location: "India",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="section-header">
          <h2>Search Your Life Partner</h2>
          <p>Find your perfect match with our advanced search filters</p>
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>I'm looking for</label>
            <select
              name="gender"
              value={searchData.gender}
              onChange={handleChange}
            >
              <option>Female</option>
              <option>Male</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Age</label>
            <div className="age-range">
              <select
                name="ageFrom"
                value={searchData.ageFrom}
                onChange={handleChange}
              >
                {Array.from({ length: 50 }, (_, i) => i + 18).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
              <span>to</span>
              <select
                name="ageTo"
                value={searchData.ageTo}
                onChange={handleChange}
              >
                {Array.from({ length: 50 }, (_, i) => i + 18).map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>Religion</label>
            <select
              name="religion"
              value={searchData.religion}
              onChange={handleChange}
            >
              <option>Any</option>
              <option>Hindu</option>
              <option>Muslim</option>
              <option>Christian</option>
              <option>Sikh</option>
              <option>Jain</option>
              <option>Buddhist</option>
              <option>Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Community</label>
            <select
              name="community"
              value={searchData.community}
              onChange={handleChange}
            >
              <option>Any</option>
              <option>Brahmin</option>
              <option>Rajput</option>
              <option>Vaishya</option>
              <option>Kshatriya</option>
              <option>Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              name="location"
              value={searchData.location}
              onChange={handleChange}
            >
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
              <option>UAE</option>
              <option>Other</option>
            </select>
          </div>

          <button className="btn btn-search">Find Matches</button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
