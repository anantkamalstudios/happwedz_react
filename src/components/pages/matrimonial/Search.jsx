import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaInfoCircle } from "react-icons/fa";

const Search = () => {
  const [searchType, setSearchType] = useState("category");
  const [showProfileTooltip, setShowProfileTooltip] = useState(false);
  const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
  const [profileId, setProfileId] = useState("");

  // Form state for category search
  const [formData, setFormData] = useState({
    basic: {
      minAge: "25",
      maxAge: "35",
      maritalStatus: "Any",
      religion: "Any",
      caste: "Any",
      motherTongue: "Any",
      country: "India",
      state: "Any",
      city: "Any",
    },
    education: {
      education: "Any",
      educationField: "Any",
      profession: "Any",
      income: "Any",
    },
    lifestyle: {
      diet: "Any",
      smoke: "Any",
      drink: "Any",
      bodyType: "Any",
    },
  });

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

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setProfileId("");
    setFormData({
      basic: {
        minAge: "25",
        maxAge: "35",
        maritalStatus: "Any",
        religion: "Any",
        caste: "Any",
        motherTongue: "Any",
        country: "India",
        state: "Any",
        city: "Any",
      },
      education: {
        education: "Any",
        educationField: "Any",
        profession: "Any",
        income: "Any",
      },
      lifestyle: {
        diet: "Any",
        smoke: "Any",
        drink: "Any",
        bodyType: "Any",
      },
    });
  };

  return (
    <div className="matrimonial">
      <div className="search-container container py-4">
        <div className="search-header mb-4">
          <h2 className="text-center text-md-start">Advanced Search</h2>
          <div className="search-toggle d-flex flex-wrap justify-content-center justify-content-md-start gap-2 mb-3">
            <button
              className={`btn ${
                searchType === "profileId"
                  ? "btn-primary"
                  : "btn-outline-primary"
              } position-relative`}
              onClick={() => setSearchType("profileId")}
              onMouseEnter={() => setShowProfileTooltip(true)}
              onMouseLeave={() => setShowProfileTooltip(false)}
            >
              Search by Profile ID
              <FaInfoCircle className="ms-2" />
              {showProfileTooltip && (
                <div className="tooltip show">
                  Enter a specific profile ID to find someone directly
                </div>
              )}
            </button>
            <button
              className={`btn ${
                searchType === "category"
                  ? "btn-primary"
                  : "btn-outline-primary"
              } position-relative`}
              onClick={() => setSearchType("category")}
              onMouseEnter={() => setShowCategoryTooltip(true)}
              onMouseLeave={() => setShowCategoryTooltip(false)}
            >
              Search by Category
              <FaInfoCircle className="ms-2" />
              {showCategoryTooltip && (
                <div className="tooltip show">
                  Use filters to find matches based on your preferences
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="search-form">
          {searchType === "profileId" ? (
            <div className="profile-id-search">
              <div className="input-group mb-3">
                <input
                  type="text"
                  placeholder="Enter Profile ID"
                  className="form-control"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                />
                <button className="btn btn-primary">
                  <FaSearch className="me-1" /> Find Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="category-search">
              <div className="form-section mb-4">
                <h3 className="section-title mb-3">Basic Information</h3>
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Age</label>
                    <div className="d-flex align-items-center gap-2">
                      <select
                        className="form-select"
                        value={formData.basic.minAge}
                        onChange={(e) =>
                          handleInputChange("basic", "minAge", e.target.value)
                        }
                      >
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
                      <select
                        className="form-select"
                        value={formData.basic.maxAge}
                        onChange={(e) =>
                          handleInputChange("basic", "maxAge", e.target.value)
                        }
                      >
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

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Marital Status</label>
                    <select
                      className="form-select"
                      value={formData.basic.maritalStatus}
                      onChange={(e) =>
                        handleInputChange(
                          "basic",
                          "maritalStatus",
                          e.target.value
                        )
                      }
                    >
                      {maritalStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Religion</label>
                    <select
                      className="form-select"
                      value={formData.basic.religion}
                      onChange={(e) =>
                        handleInputChange("basic", "religion", e.target.value)
                      }
                    >
                      {religions.map((religion) => (
                        <option key={religion} value={religion}>
                          {religion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Caste</label>
                    <select
                      className="form-select"
                      value={formData.basic.caste}
                      onChange={(e) =>
                        handleInputChange("basic", "caste", e.target.value)
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="Brahmin">Brahmin</option>
                      <option value="Rajput">Rajput</option>
                      <option value="Maratha">Maratha</option>
                      <option value="Baniya">Baniya</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Mother Tongue</label>
                    <select
                      className="form-select"
                      value={formData.basic.motherTongue}
                      onChange={(e) =>
                        handleInputChange(
                          "basic",
                          "motherTongue",
                          e.target.value
                        )
                      }
                    >
                      {motherTongues.map((tongue) => (
                        <option key={tongue} value={tongue}>
                          {tongue}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Country</label>
                    <select
                      className="form-select"
                      value={formData.basic.country}
                      onChange={(e) =>
                        handleInputChange("basic", "country", e.target.value)
                      }
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">State</label>
                    <select
                      className="form-select"
                      value={formData.basic.state}
                      onChange={(e) =>
                        handleInputChange("basic", "state", e.target.value)
                      }
                    >
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">City</label>
                    <select
                      className="form-select"
                      value={formData.basic.city}
                      onChange={(e) =>
                        handleInputChange("basic", "city", e.target.value)
                      }
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section mb-4">
                <h3 className="section-title mb-3">Education & Career</h3>
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Education</label>
                    <select
                      className="form-select"
                      value={formData.education.education}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "education",
                          e.target.value
                        )
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="M.Sc">M.Sc</option>
                      <option value="Ph.D">Ph.D</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Education Field</label>
                    <select
                      className="form-select"
                      value={formData.education.educationField}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "educationField",
                          e.target.value
                        )
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Arts">Arts</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Profession</label>
                    <select
                      className="form-select"
                      value={formData.education.profession}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "profession",
                          e.target.value
                        )
                      }
                    >
                      {professions.map((profession) => (
                        <option key={profession} value={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Income</label>
                    <select
                      className="form-select"
                      value={formData.education.income}
                      onChange={(e) =>
                        handleInputChange("education", "income", e.target.value)
                      }
                    >
                      {incomes.map((income) => (
                        <option key={income} value={income}>
                          {income}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section mb-4">
                <h3 className="section-title mb-3">Lifestyle</h3>
                <div className="row g-3">
                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Diet</label>
                    <select
                      className="form-select"
                      value={formData.lifestyle.diet}
                      onChange={(e) =>
                        handleInputChange("lifestyle", "diet", e.target.value)
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Smoke</label>
                    <select
                      className="form-select"
                      value={formData.lifestyle.smoke}
                      onChange={(e) =>
                        handleInputChange("lifestyle", "smoke", e.target.value)
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="No">No</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Drink</label>
                    <select
                      className="form-select"
                      value={formData.lifestyle.drink}
                      onChange={(e) =>
                        handleInputChange("lifestyle", "drink", e.target.value)
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="No">No</option>
                      <option value="Occasionally">Occasionally</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label">Body Type</label>
                    <select
                      className="form-select"
                      value={formData.lifestyle.bodyType}
                      onChange={(e) =>
                        handleInputChange(
                          "lifestyle",
                          "bodyType",
                          e.target.value
                        )
                      }
                    >
                      <option value="Any">Any</option>
                      <option value="Slim">Slim</option>
                      <option value="Average">Average</option>
                      <option value="Athletic">Athletic</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions d-flex justify-content-end gap-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button className="btn btn-primary">
                  <FaSearch className="me-1" /> Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .matrimonial {
          background-color: #f8f9fa;
          min-height: 100vh;
          padding: 20px 0;
        }

        .search-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .search-header h2 {
          color: #d63384;
          font-weight: 600;
        }

        .section-title {
          color: #6c757d;
          font-size: 1.25rem;
          font-weight: 500;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }

        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          white-space: nowrap;
          z-index: 100;
          margin-bottom: 5px;
        }

        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }

        @media (max-width: 768px) {
          .search-toggle {
            flex-direction: column;
          }

          .search-toggle button {
            width: 100%;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Search;
