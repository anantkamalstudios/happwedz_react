import React, { useState } from "react";
// import "./Search.css";

const Search = () => {
  const [searchType, setSearchType] = useState("category");
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);

  // Sample data for dropdowns
  const religions = ["Any", "Hindu", "Muslim", "Christian", "Sikh", "Jain"];
  const countries = ["India", "USA", "UK", "Canada", "Australia"];
  const states = ["Any", "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"];
  const cities = ["Any", "Mumbai", "Delhi", "Bangalore", "Chennai"];
  const maritalStatuses = [
    "Any",
    "Never Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];
  const motherTongues = [
    "Any",
    "Hindi",
    "English",
    "Marathi",
    "Tamil",
    "Telugu",
    "hdhgjhs",
    "dfeff",
  ];
  const professions = [
    "Any",
    "Engineer",
    "Doctor",
    "Teacher",
    "Business",
    "Government Job",
  ];
  const incomes = [
    "Any",
    "No Income",
    "Below 1 Lakh",
    "1-2 Lakhs",
    "2-5 Lakhs",
    "5+ Lakhs",
  ];

  return (
    <div className="search-container">
      <div className="search-header">
        <h2>Advanced Search</h2>
        <div className="search-toggle">
          <button
            className={`toggle-btn ${
              searchType === "profileId" ? "active" : ""
            }`}
            onClick={() => setSearchType("profileId")}
            onMouseEnter={() => setShowProfileTooltip(true)}
            onMouseLeave={() => setShowProfileTooltip(false)}
          >
            Search by Profile ID
            {showProfileTooltip && (
              <span className="tooltip">
                Enter a specific profile ID to find someone directly
              </span>
            )}
          </button>
          <button
            className={`toggle-btn ${
              searchType === "category" ? "active" : ""
            }`}
            onClick={() => setSearchType("category")}
            onMouseEnter={() => setShowCategoryTooltip(true)}
            onMouseLeave={() => setShowCategoryTooltip(false)}
          >
            Search by Category
            {showCategoryTooltip && (
              <span className="tooltip">
                Use filters to find matches based on your preferences
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="search-form">
        {searchType === "profileId" ? (
          <div className="profile-id-search">
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Profile ID"
                className="profile-input"
              />
              <button className="search-btn">Find Profile</button>
            </div>
          </div>
        ) : (
          <div className="category-search">
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <div className="age-range">
                    <select defaultValue="25">
                      <option value="">Min</option>
                      {Array.from({ length: 48 }, (_, i) => i + 18).map(
                        (age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        )
                      )}
                    </select>
                    <span>to</span>
                    <select defaultValue="35">
                      <option value="">Max</option>
                      {Array.from({ length: 33 }, (_, i) => i + 25).map(
                        (age) => (
                          <option key={age} value={age}>
                            {age}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Marital Status</label>
                  <select>
                    {maritalStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Religion</label>
                  <select>
                    {religions.map((religion) => (
                      <option key={religion}>{religion}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Caste</label>
                  <select>
                    <option>Any</option>
                    <option>Brahmin</option>
                    <option>Rajput</option>
                    <option>Maratha</option>
                    <option>Baniya</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mother Tongue</label>
                  <select>
                    {motherTongues.map((tongue) => (
                      <option key={tongue}>{tongue}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select>
                    {countries.map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>State</label>
                  <select>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select>
                    {cities.map((city) => (
                      <option key={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Education & Career</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Education</label>
                  <select>
                    <option>Any</option>
                    <option>B.Tech</option>
                    <option>MBA</option>
                    <option>B.Sc</option>
                    <option>M.Sc</option>
                    <option>Ph.D</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Education Field</label>
                  <select>
                    <option>Any</option>
                    <option>Engineering</option>
                    <option>Medicine</option>
                    <option>Arts</option>
                    <option>Commerce</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Profession</label>
                  <select>
                    {professions.map((profession) => (
                      <option key={profession}>{profession}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Income</label>
                  <select>
                    {incomes.map((income) => (
                      <option key={income}>{income}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Lifestyle</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Diet</label>
                  <select>
                    <option>Any</option>
                    <option>Vegetarian</option>
                    <option>Non-Vegetarian</option>
                    <option>Eggetarian</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Smoke</label>
                  <select>
                    <option>Any</option>
                    <option>No</option>
                    <option>Occasionally</option>
                    <option>Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Drink</label>
                  <select>
                    <option>Any</option>
                    <option>No</option>
                    <option>Occasionally</option>
                    <option>Yes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Body Type</label>
                  <select>
                    <option>Any</option>
                    <option>Slim</option>
                    <option>Average</option>
                    <option>Athletic</option>
                    <option>Heavy</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="reset-btn">Reset</button>
              <button className="search-btn">Search</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
