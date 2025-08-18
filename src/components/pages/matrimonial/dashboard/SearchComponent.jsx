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
    basic: {
      ageFrom: "",
      ageTo: "",
      heightFrom: "",
      heightTo: "",
      maritalStatus: "",
      religion: "",
      caste: "",
      motherTongue: "",
      location: "",
    },
    professional: {
      education: "",
      occupation: "",
      incomeFrom: "",
      incomeTo: "",
      workLocation: "",
    },
    lifestyle: {
      diet: "",
      smoking: "",
      drinking: "",
    },
    physical: {
      complexion: "",
      bodyType: "",
      physicalStatus: "",
    },
    family: {
      familyType: "",
      familyStatus: "",
      familyValues: "",
    },
  });

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    professional: false,
    lifestyle: false,
    physical: false,
    family: false,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, name: "Software Engineers in Mumbai", count: 45 },
    { id: 2, name: "Doctors 26-30 years", count: 23 },
    { id: 3, name: "MBA Graduates Delhi NCR", count: 67 },
  ]);

  // Sample search results data
  const sampleResults = [
    {
      id: 1,
      name: "Ravi Kumar",
      age: 29,
      height: "5'8\"",
      education: "B.Tech IT",
      profession: "Software Engineer",
      location: "Bangalore, Karnataka",
      income: "₹8-12 Lakhs",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      online: true,
      verified: true,
      matchPercentage: 92,
      tags: ["Vegetarian", "Non-Smoker", "Fitness Enthusiast"],
    },
    {
      id: 2,
      name: "Anjali Patel",
      age: 26,
      height: "5'4\"",
      education: "CA",
      profession: "Chartered Accountant",
      location: "Mumbai, Maharashtra",
      income: "₹6-8 Lakhs",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      online: false,
      verified: true,
      matchPercentage: 88,
      tags: ["Vegetarian", "Classical Music", "Books"],
    },
    {
      id: 3,
      name: "Vikram Singh",
      age: 31,
      height: "5'10\"",
      education: "MBBS",
      profession: "Doctor",
      location: "Delhi, NCR",
      income: "₹12-15 Lakhs",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      online: true,
      verified: true,
      matchPercentage: 95,
      tags: ["Non-Vegetarian", "Social Work", "Travel"],
    },
    {
      id: 4,
      name: "Sneha Reddy",
      age: 27,
      height: "5'5\"",
      education: "M.Sc Physics",
      profession: "Research Scientist",
      location: "Hyderabad, Telangana",
      income: "₹5-7 Lakhs",
      image:
        "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=300&h=300&fit=crop&crop=face",
      online: true,
      verified: true,
      matchPercentage: 90,
      tags: ["Vegetarian", "Yoga", "Science"],
    },
  ];

  const handleFilterChange = (section, field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchResults(sampleResults);
      setIsSearching(false);
    }, 1500);
  };

  const clearFilters = () => {
    setSearchFilters({
      basic: {
        ageFrom: "",
        ageTo: "",
        heightFrom: "",
        heightTo: "",
        maritalStatus: "",
        religion: "",
        caste: "",
        motherTongue: "",
        location: "",
      },
      professional: {
        education: "",
        occupation: "",
        incomeFrom: "",
        incomeTo: "",
        workLocation: "",
      },
      lifestyle: {
        diet: "",
        smoking: "",
        drinking: "",
      },
      physical: {
        complexion: "",
        bodyType: "",
        physicalStatus: "",
      },
      family: {
        familyType: "",
        familyStatus: "",
        familyValues: "",
      },
    });
  };

  const FilterSection = ({ title, section, icon: Icon, children }) => (
    <div
      style={{
        background: "var(--mtu-white)",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        border: "1px solid var(--mtu-border-color)",
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => toggleSection(section)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          cursor: "pointer",
          background: expandedSections[section]
            ? "var(--mtu-light-pink)"
            : "var(--mtu-light-gray)",
          borderBottom: expandedSections[section]
            ? "1px solid var(--mtu-border-color)"
            : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Icon size={20} color="var(--mtu-primary-pink)" />
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "var(--mtu-dark-gray)",
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
        {expandedSections[section] ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </div>
      {expandedSections[section] && (
        <div style={{ padding: "1rem" }}>{children}</div>
      )}
    </div>
  );

  const FormField = ({
    label,
    type = "text",
    options = [],
    section,
    field,
    placeholder,
  }) => (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontWeight: "500",
          color: "var(--mtu-dark-gray)",
          marginBottom: "0.5rem",
          fontSize: "0.9rem",
        }}
      >
        {label}
      </label>
      {type === "select" ? (
        <select
          className="mtu-form-select"
          value={searchFilters[section]?.[field] || ""}
          onChange={(e) => handleFilterChange(section, field, e.target.value)}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="mtu-form-input"
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          value={searchFilters[section]?.[field] || ""}
          onChange={(e) => handleFilterChange(section, field, e.target.value)}
        />
      )}
    </div>
  );

  const ProfileCard = ({ profile }) => (
    <div
      style={{
        background: "var(--mtu-white)",
        borderRadius: "1rem",
        padding: "1.5rem",
        border: "1px solid var(--mtu-border-color)",
        boxShadow: "var(--mtu-shadow)",
        transition: "all 0.3s ease",
        position: "relative",
      }}
    >
      {/* Match Percentage Badge */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "var(--mtu-gradient-primary)",
          color: "white",
          padding: "0.25rem 0.75rem",
          borderRadius: "1rem",
          fontSize: "0.8rem",
          fontWeight: "600",
        }}
      >
        {profile.matchPercentage}% Match
      </div>

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ position: "relative" }}>
          <img
            src={profile.image}
            alt={profile.name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "0.5rem",
              objectFit: "cover",
              border: profile.verified
                ? "3px solid var(--mtu-primary-pink)"
                : "3px solid var(--mtu-border-color)",
            }}
          />
          {profile.online && (
            <div
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                width: "12px",
                height: "12px",
                background: "#10b981",
                borderRadius: "50%",
                border: "2px solid white",
              }}
            />
          )}
          {profile.verified && (
            <div
              style={{
                position: "absolute",
                top: "-5px",
                left: "-5px",
                background: "var(--mtu-primary-pink)",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
              }}
            >
              ✓
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              color: "var(--mtu-dark-gray)",
              marginBottom: "0.5rem",
              fontSize: "1.2rem",
              fontWeight: "600",
            }}
          >
            {profile.name}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.25rem",
              fontSize: "0.9rem",
              color: "var(--mtu-gray)",
            }}
          >
            <p>
              <Calendar
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              {profile.age} years
            </p>
            <p>
              <User
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              {profile.height}
            </p>
            <p>
              <GraduationCap
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              {profile.education}
            </p>
            <p>
              <Briefcase
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              {profile.profession}
            </p>
            <p>
              <MapPin
                size={14}
                style={{ display: "inline", marginRight: "5px" }}
              />
              {profile.location}
            </p>
            <p style={{ color: "var(--mtu-primary-pink)", fontWeight: "600" }}>
              {profile.income}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {profile.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                background: "var(--mtu-light-pink)",
                color: "var(--mtu-dark-pink)",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.7rem",
                fontWeight: "500",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "space-between",
        }}
      >
        <button
          className="mtu-btn mtu-btn-primary"
          style={{ flex: 1, fontSize: "0.9rem" }}
        >
          <Heart size={16} />
          Express Interest
        </button>
        <button
          className="mtu-btn mtu-btn-secondary"
          style={{ fontSize: "0.9rem" }}
        >
          <MessageCircle size={16} />
        </button>
        <button
          className="mtu-btn mtu-btn-secondary"
          style={{ fontSize: "0.9rem" }}
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="matrimonial">
      <div className="matrimony-unique-body mtu-root">
        <div className="mtu-dashboard-container">
          {/* Header */}
          <div className="mtu-content-header">
            <h1 className="mtu-page-title">
              <Search size={32} />
              Advanced Search
            </h1>
            <div className="mtu-breadcrumb">
              Home <span className="mtu-breadcrumb-separator"></span> Search
              Profiles
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "350px 1fr",
              gap: "2rem",
            }}
          >
            {/* Search Filters Sidebar */}
            <div>
              {/* Saved Searches */}
              <div
                style={{
                  background: "var(--mtu-white)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  boxShadow: "var(--mtu-shadow)",
                  border: "1px solid var(--mtu-border-color)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    color: "var(--mtu-dark-gray)",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Star size={20} color="var(--mtu-primary-pink)" />
                  Saved Searches
                </h3>
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: "var(--mtu-light-gray)",
                      borderRadius: "0.5rem",
                      marginBottom: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          margin: 0,
                          color: "var(--mtu-dark-gray)",
                        }}
                      >
                        {search.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--mtu-gray)",
                          margin: 0,
                        }}
                      >
                        {search.count} profiles
                      </p>
                    </div>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--mtu-gray)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Search Filters */}
              <div
                style={{
                  background: "var(--mtu-light-gray)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      color: "var(--mtu-dark-gray)",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Filter size={24} color="var(--mtu-primary-pink)" />
                    Search Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="mtu-btn mtu-btn-secondary"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Clear All
                  </button>
                </div>

                {/* Basic Information */}
                <FilterSection
                  title="Basic Information"
                  section="basic"
                  icon={User}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <FormField
                      label="Age From"
                      section="basic"
                      field="ageFrom"
                      type="number"
                      placeholder="Min age"
                    />
                    <FormField
                      label="Age To"
                      section="basic"
                      field="ageTo"
                      type="number"
                      placeholder="Max age"
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <FormField
                      label="Height From"
                      section="basic"
                      field="heightFrom"
                      type="select"
                      options={[
                        "4'6\"",
                        "4'7\"",
                        "4'8\"",
                        "4'9\"",
                        "4'10\"",
                        "4'11\"",
                        "5'0\"",
                        "5'1\"",
                        "5'2\"",
                        "5'3\"",
                        "5'4\"",
                        "5'5\"",
                        "5'6\"",
                        "5'7\"",
                        "5'8\"",
                        "5'9\"",
                        "5'10\"",
                        "5'11\"",
                        "6'0\"",
                        "6'1\"",
                        "6'2\"",
                        "6'3\"",
                        "6'4\"",
                      ]}
                    />
                    <FormField
                      label="Height To"
                      section="basic"
                      field="heightTo"
                      type="select"
                      options={[
                        "4'6\"",
                        "4'7\"",
                        "4'8\"",
                        "4'9\"",
                        "4'10\"",
                        "4'11\"",
                        "5'0\"",
                        "5'1\"",
                        "5'2\"",
                        "5'3\"",
                        "5'4\"",
                        "5'5\"",
                        "5'6\"",
                        "5'7\"",
                        "5'8\"",
                        "5'9\"",
                        "5'10\"",
                        "5'11\"",
                        "6'0\"",
                        "6'1\"",
                        "6'2\"",
                        "6'3\"",
                        "6'4\"",
                      ]}
                    />
                  </div>
                  <FormField
                    label="Marital Status"
                    section="basic"
                    field="maritalStatus"
                    type="select"
                    options={[
                      "Never Married",
                      "Divorced",
                      "Widowed",
                      "Awaiting Divorce",
                    ]}
                  />
                  <FormField
                    label="Religion"
                    section="basic"
                    field="religion"
                    type="select"
                    options={[
                      "Hindu",
                      "Muslim",
                      "Christian",
                      "Sikh",
                      "Buddhist",
                      "Jain",
                      "Parsi",
                      "Jewish",
                      "Other",
                    ]}
                  />
                  <FormField
                    label="Caste"
                    section="basic"
                    field="caste"
                    placeholder="Enter caste"
                  />
                  <FormField
                    label="Mother Tongue"
                    section="basic"
                    field="motherTongue"
                    type="select"
                    options={[
                      "Hindi",
                      "English",
                      "Tamil",
                      "Telugu",
                      "Marathi",
                      "Gujarati",
                      "Bengali",
                      "Kannada",
                      "Malayalam",
                      "Punjabi",
                      "Urdu",
                      "Other",
                    ]}
                  />
                  <FormField
                    label="Location"
                    section="basic"
                    field="location"
                    placeholder="City, State"
                  />
                </FilterSection>

                {/* Professional Information */}
                <FilterSection
                  title="Professional Information"
                  section="professional"
                  icon={Briefcase}
                >
                  <FormField
                    label="Education"
                    section="professional"
                    field="education"
                    type="select"
                    options={[
                      "High School",
                      "Diploma",
                      "Graduate",
                      "Post Graduate",
                      "Doctorate",
                    ]}
                  />
                  <FormField
                    label="Occupation"
                    section="professional"
                    field="occupation"
                    type="select"
                    options={[
                      "Software Engineer",
                      "Doctor",
                      "Teacher",
                      "Business",
                      "Lawyer",
                      "Accountant",
                      "Nurse",
                      "Artist",
                      "Other",
                    ]}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <FormField
                      label="Income From"
                      section="professional"
                      field="incomeFrom"
                      type="select"
                      options={[
                        "₹2-3 Lakhs",
                        "₹3-4 Lakhs",
                        "₹4-5 Lakhs",
                        "₹5-7 Lakhs",
                        "₹7-10 Lakhs",
                        "₹10-15 Lakhs",
                        "₹15-20 Lakhs",
                        "₹20+ Lakhs",
                      ]}
                    />
                    <FormField
                      label="Income To"
                      section="professional"
                      field="incomeTo"
                      type="select"
                      options={[
                        "₹2-3 Lakhs",
                        "₹3-4 Lakhs",
                        "₹4-5 Lakhs",
                        "₹5-7 Lakhs",
                        "₹7-10 Lakhs",
                        "₹10-15 Lakhs",
                        "₹15-20 Lakhs",
                        "₹20+ Lakhs",
                      ]}
                    />
                  </div>
                  <FormField
                    label="Work Location"
                    section="professional"
                    field="workLocation"
                    placeholder="Work city"
                  />
                </FilterSection>

                {/* Lifestyle */}
                <FilterSection
                  title="Lifestyle"
                  section="lifestyle"
                  icon={Heart}
                >
                  <FormField
                    label="Diet"
                    section="lifestyle"
                    field="diet"
                    type="select"
                    options={[
                      "Vegetarian",
                      "Non-Vegetarian",
                      "Eggetarian",
                      "Vegan",
                    ]}
                  />
                  <FormField
                    label="Smoking"
                    section="lifestyle"
                    field="smoking"
                    type="select"
                    options={["No", "Occasionally", "Yes"]}
                  />
                  <FormField
                    label="Drinking"
                    section="lifestyle"
                    field="drinking"
                    type="select"
                    options={["No", "Socially", "Occasionally", "Yes"]}
                  />
                </FilterSection>

                {/* Physical Attributes */}
                <FilterSection
                  title="Physical Attributes"
                  section="physical"
                  icon={User}
                >
                  <FormField
                    label="Complexion"
                    section="physical"
                    field="complexion"
                    type="select"
                    options={[
                      "Very Fair",
                      "Fair",
                      "Wheatish",
                      "Wheatish Brown",
                      "Dark",
                    ]}
                  />
                  <FormField
                    label="Body Type"
                    section="physical"
                    field="bodyType"
                    type="select"
                    options={["Slim", "Average", "Athletic", "Heavy"]}
                  />
                  <FormField
                    label="Physical Status"
                    section="physical"
                    field="physicalStatus"
                    type="select"
                    options={["Normal", "Physically Challenged"]}
                  />
                </FilterSection>

                {/* Family Information */}
                <FilterSection
                  title="Family Information"
                  section="family"
                  icon={User}
                >
                  <FormField
                    label="Family Type"
                    section="family"
                    field="familyType"
                    type="select"
                    options={["Joint Family", "Nuclear Family"]}
                  />
                  <FormField
                    label="Family Status"
                    section="family"
                    field="familyStatus"
                    type="select"
                    options={[
                      "Lower Middle Class",
                      "Middle Class",
                      "Upper Middle Class",
                      "Rich",
                      "Affluent",
                    ]}
                  />
                  <FormField
                    label="Family Values"
                    section="family"
                    field="familyValues"
                    type="select"
                    options={["Traditional", "Moderate", "Liberal"]}
                  />
                </FilterSection>

                {/* Search Actions */}
                <div
                  style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
                >
                  <button
                    onClick={handleSearch}
                    className="mtu-btn mtu-btn-primary"
                    disabled={isSearching}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isSearching ? (
                      <>
                        <div
                          className="mtu-loading-skeleton"
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                          }}
                        />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Search Now
                      </>
                    )}
                  </button>
                  <button className="mtu-btn mtu-btn-secondary">
                    <Star size={16} />
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div>
              {/* Results Header */}
              <div
                style={{
                  background: "var(--mtu-white)",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  marginBottom: "2rem",
                  boxShadow: "var(--mtu-shadow)",
                  border: "1px solid var(--mtu-border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: "var(--mtu-dark-gray)",
                        margin: 0,
                        fontSize: "1.5rem",
                        fontWeight: "600",
                      }}
                    >
                      Search Results
                    </h2>
                    <p
                      style={{
                        color: "var(--mtu-gray)",
                        margin: "0.5rem 0 0",
                        fontSize: "0.9rem",
                      }}
                    >
                      Found {searchResults.length} profiles matching your
                      criteria
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="mtu-form-select"
                      style={{ minWidth: "150px" }}
                    >
                      <option>Sort by: Match %</option>
                      <option>Sort by: Age</option>
                      <option>Sort by: Location</option>
                      <option>Sort by: Last Active</option>
                    </select>
                    <button className="mtu-btn mtu-btn-secondary">
                      <Sliders size={16} />
                      View Options
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results Grid */}
              {isSearching ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--mtu-white)",
                        borderRadius: "1rem",
                        padding: "1.5rem",
                        border: "1px solid var(--mtu-border-color)",
                        boxShadow: "var(--mtu-shadow)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div
                          className="mtu-loading-skeleton"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div
                            className="mtu-loading-skeleton"
                            style={{
                              height: "24px",
                              width: "60%",
                              marginBottom: "0.5rem",
                            }}
                          />
                          <div
                            className="mtu-loading-skeleton"
                            style={{
                              height: "16px",
                              width: "80%",
                              marginBottom: "0.5rem",
                            }}
                          />
                          <div
                            className="mtu-loading-skeleton"
                            style={{
                              height: "16px",
                              width: "70%",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div
                          className="mtu-loading-skeleton"
                          style={{
                            height: "36px",
                            flex: 1,
                          }}
                        />
                        <div
                          className="mtu-loading-skeleton"
                          style={{
                            height: "36px",
                            width: "40px",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {searchResults.map((profile) => (
                    <ProfileCard key={profile.id} profile={profile} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--mtu-white)",
                    borderRadius: "1rem",
                    padding: "3rem",
                    textAlign: "center",
                    boxShadow: "var(--mtu-shadow)",
                    border: "1px solid var(--mtu-border-color)",
                  }}
                >
                  <Search
                    size={48}
                    color="var(--mtu-gray)"
                    style={{ marginBottom: "1rem" }}
                  />
                  <h3
                    style={{
                      color: "var(--mtu-dark-gray)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Start Your Search
                  </h3>
                  <p style={{ color: "var(--mtu-gray)" }}>
                    Use the filters on the left to find profiles that match your
                    preferences
                  </p>
                </div>
              )}

              {/* Pagination */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "2rem",
                    padding: "2rem",
                  }}
                >
                  <button className="mtu-btn mtu-btn-secondary">
                    Previous
                  </button>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        className={`mtu-btn ${
                          page === 1 ? "mtu-btn-primary" : "mtu-btn-secondary"
                        }`}
                        style={{ minWidth: "40px" }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button className="mtu-btn mtu-btn-secondary">Next</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
