import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Phone,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  Check,
} from "lucide-react";
import "../../../../Matrimonialdashboard.css";

const BasicInformation = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "Priya",
      lastName: "Sharma",
      dateOfBirth: "1997-06-15",
      age: 26,
      gender: "Female",
      maritalStatus: "Never Married",
      religion: "Hindu",
      caste: "Sharma",
      motherTongue: "Hindi",
      physicalStatus: "Normal",
      height: "5'4\"",
      weight: "55 kg",
      bodyType: "Slim",
      complexion: "Fair",
    },
    contactInfo: {
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      alternatePhone: "+91 87654 32109",
      address: "Bandra West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400050",
    },
    professionalInfo: {
      education: "MBA Finance",
      educationDetails:
        "Master of Business Administration in Finance from Mumbai University",
      occupation: "Software Engineer",
      company: "TechCorp Solutions Pvt Ltd",
      annualIncome: "₹8-10 Lakhs",
      workLocation: "Mumbai, Maharashtra",
    },
    familyInfo: {
      fatherName: "Rajesh Sharma",
      fatherOccupation: "Business Owner",
      motherName: "Sunita Sharma",
      motherOccupation: "Homemaker",
      siblings: "1 Sister (Younger)",
      familyType: "Nuclear Family",
      familyStatus: "Middle Class",
      familyValues: "Traditional",
    },
    lifestyle: {
      diet: "Vegetarian",
      smoking: "No",
      drinking: "No",
      hobbies: "Reading, Yoga, Cooking, Travelling",
      interests: "Technology, Health & Fitness, Spirituality",
      music: "Classical, Bollywood",
      movies: "Drama, Romance, Comedy",
      sports: "Badminton, Swimming",
    },
    partnerPreferences: {
      ageRange: "26-32 years",
      heightRange: "5'6\" - 6'2\"",
      maritalStatus: "Never Married",
      education: "Graduate or above",
      occupation: "Any",
      income: "₹5+ Lakhs",
      location: "Mumbai, Pune, Delhi",
      religion: "Hindu",
      caste: "Any",
      diet: "Vegetarian preferred",
    },
    aboutMe:
      "I'm a software engineer who believes in balancing career and personal life. I enjoy reading books, practicing yoga, and exploring new cuisines. I'm looking for a life partner who shares similar values and is ready for a committed relationship. Family is very important to me, and I believe in maintaining strong relationships with loved ones.",
    profilePicture:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&crop=face",
    gallery: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    ],
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (section, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const InfoSection = ({ title, icon: Icon, children, sectionKey }) => (
    <div
      className="mtu-profile-section"
      style={{
        background: "var(--mtu-white)",
        borderRadius: "1rem",
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow: "var(--mtu-shadow)",
        border: "1px solid var(--mtu-border-color)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          paddingBottom: "0.5rem",
          borderBottom: "2px solid var(--mtu-light-pink)",
        }}
      >
        <h3
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "var(--mtu-dark-gray)",
            margin: 0,
          }}
        >
          <Icon size={24} color="var(--mtu-primary-pink)" />
          {title}
        </h3>
        {!isEditing && sectionKey && (
          <button
            onClick={handleEdit}
            className="mtu-btn mtu-btn-secondary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            <Edit3 size={16} />
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );

  const InfoField = ({
    label,
    value,
    field,
    section,
    type = "text",
    options = [],
  }) => (
    <div style={{ marginBottom: "1rem" }}>
      <label
        style={{
          display: "block",
          fontWeight: "600",
          color: "var(--mtu-dark-gray)",
          marginBottom: "0.5rem",
          fontSize: "0.9rem",
        }}
      >
        {label}
      </label>
      {isEditing ? (
        type === "select" ? (
          <select
            className="mtu-form-select"
            value={editData[section]?.[field] || ""}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            className="mtu-form-input"
            value={editData[section]?.[field] || editData[field] || ""}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
            rows={4}
            style={{ resize: "vertical" }}
          />
        ) : (
          <input
            type={type}
            className="mtu-form-input"
            value={editData[section]?.[field] || editData[field] || ""}
            onChange={(e) => handleInputChange(section, field, e.target.value)}
          />
        )
      ) : (
        <p
          style={{
            color: "var(--mtu-gray)",
            padding: "0.75rem",
            background: "var(--mtu-light-gray)",
            borderRadius: "0.5rem",
            margin: 0,
          }}
        >
          {value || "Not specified"}
        </p>
      )}
    </div>
  );

  return (
    <div className="matrimonial">
      <div className="matrimony-unique-body mtu-root">
        <div className="mtu-dashboard-container">
          {/* Header */}
          <div className="mtu-content-header">
            <h1 className="mtu-page-title">
              <User size={32} />
              Profile Information
            </h1>
            <div className="mtu-breadcrumb">
              Home <span className="mtu-breadcrumb-separator"></span> Profile{" "}
              <span className="mtu-breadcrumb-separator"></span> Basic
              Information
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div
              style={{
                background: "var(--mtu-white)",
                padding: "1rem 2rem",
                borderRadius: "1rem",
                marginBottom: "2rem",
                boxShadow: "var(--mtu-shadow)",
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCancel}
                className="mtu-btn mtu-btn-secondary"
              >
                <X size={16} />
                Cancel
              </button>
              <button onClick={handleSave} className="mtu-btn mtu-btn-primary">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}

          {/* Profile Picture Section */}
          <InfoSection title="Profile Picture" icon={Camera}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid var(--mtu-primary-pink)",
                  }}
                />
                {isEditing && (
                  <button
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "var(--mtu-primary-pink)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>
              <div>
                <h4
                  style={{
                    color: "var(--mtu-dark-gray)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {profileData.personalInfo.firstName}{" "}
                  {profileData.personalInfo.lastName}
                </h4>
                <p style={{ color: "var(--mtu-gray)", marginBottom: "1rem" }}>
                  {profileData.personalInfo.age} years •{" "}
                  {profileData.contactInfo.city},{" "}
                  {profileData.contactInfo.state}
                </p>
                {isEditing && (
                  <button
                    className="mtu-btn mtu-btn-primary"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <Camera size={16} />
                    Change Photo
                  </button>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            <div style={{ marginTop: "2rem" }}>
              <h4
                style={{ color: "var(--mtu-dark-gray)", marginBottom: "1rem" }}
              >
                Photo Gallery
              </h4>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {profileData.gallery.map((photo, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "0.5rem",
                        objectFit: "cover",
                        border: "2px solid var(--mtu-border-color)",
                      }}
                    />
                    {isEditing && (
                      <button
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(255, 0, 0, 0.8)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      ></button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "2px dashed var(--mtu-primary-pink)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--mtu-primary-pink)",
                    }}
                  >
                    <Camera size={24} />
                  </div>
                )}
              </div>
            </div>
          </InfoSection>

          {/* Personal Information */}
          <InfoSection
            title="Personal Information"
            icon={User}
            sectionKey="personalInfo"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="First Name"
                value={profileData.personalInfo.firstName}
                field="firstName"
                section="personalInfo"
              />
              <InfoField
                label="Last Name"
                value={profileData.personalInfo.lastName}
                field="lastName"
                section="personalInfo"
              />
              <InfoField
                label="Date of Birth"
                value={profileData.personalInfo.dateOfBirth}
                field="dateOfBirth"
                section="personalInfo"
                type="date"
              />
              <InfoField
                label="Gender"
                value={profileData.personalInfo.gender}
                field="gender"
                section="personalInfo"
                type="select"
                options={["Male", "Female"]}
              />
              <InfoField
                label="Marital Status"
                value={profileData.personalInfo.maritalStatus}
                field="maritalStatus"
                section="personalInfo"
                type="select"
                options={["Never Married", "Divorced", "Widowed"]}
              />
              <InfoField
                label="Religion"
                value={profileData.personalInfo.religion}
                field="religion"
                section="personalInfo"
              />
              <InfoField
                label="Caste"
                value={profileData.personalInfo.caste}
                field="caste"
                section="personalInfo"
              />
              <InfoField
                label="Mother Tongue"
                value={profileData.personalInfo.motherTongue}
                field="motherTongue"
                section="personalInfo"
              />
              <InfoField
                label="Height"
                value={profileData.personalInfo.height}
                field="height"
                section="personalInfo"
              />
              <InfoField
                label="Weight"
                value={profileData.personalInfo.weight}
                field="weight"
                section="personalInfo"
              />
              <InfoField
                label="Body Type"
                value={profileData.personalInfo.bodyType}
                field="bodyType"
                section="personalInfo"
                type="select"
                options={["Slim", "Athletic", "Average", "Heavy"]}
              />
              <InfoField
                label="Complexion"
                value={profileData.personalInfo.complexion}
                field="complexion"
                section="personalInfo"
                type="select"
                options={["Fair", "Wheatish", "Dark"]}
              />
            </div>
          </InfoSection>

          {/* Contact Information */}
          <InfoSection
            title="Contact Information"
            icon={Phone}
            sectionKey="contactInfo"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="Email Address"
                value={profileData.contactInfo.email}
                field="email"
                section="contactInfo"
                type="email"
              />
              <InfoField
                label="Phone Number"
                value={profileData.contactInfo.phone}
                field="phone"
                section="contactInfo"
              />
              <InfoField
                label="Alternate Phone"
                value={profileData.contactInfo.alternatePhone}
                field="alternatePhone"
                section="contactInfo"
              />
              <InfoField
                label="Address"
                value={profileData.contactInfo.address}
                field="address"
                section="contactInfo"
              />
              <InfoField
                label="City"
                value={profileData.contactInfo.city}
                field="city"
                section="contactInfo"
              />
              <InfoField
                label="State"
                value={profileData.contactInfo.state}
                field="state"
                section="contactInfo"
              />
              <InfoField
                label="Country"
                value={profileData.contactInfo.country}
                field="country"
                section="contactInfo"
              />
              <InfoField
                label="Pin Code"
                value={profileData.contactInfo.pincode}
                field="pincode"
                section="contactInfo"
              />
            </div>
          </InfoSection>

          {/* Professional Information */}
          <InfoSection
            title="Professional Information"
            icon={Briefcase}
            sectionKey="professionalInfo"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="Education"
                value={profileData.professionalInfo.education}
                field="education"
                section="professionalInfo"
              />
              <InfoField
                label="Occupation"
                value={profileData.professionalInfo.occupation}
                field="occupation"
                section="professionalInfo"
              />
              <InfoField
                label="Company"
                value={profileData.professionalInfo.company}
                field="company"
                section="professionalInfo"
              />
              <InfoField
                label="Annual Income"
                value={profileData.professionalInfo.annualIncome}
                field="annualIncome"
                section="professionalInfo"
              />
              <InfoField
                label="Work Location"
                value={profileData.professionalInfo.workLocation}
                field="workLocation"
                section="professionalInfo"
              />
            </div>
            <InfoField
              label="Education Details"
              value={profileData.professionalInfo.educationDetails}
              field="educationDetails"
              section="professionalInfo"
              type="textarea"
            />
          </InfoSection>

          {/* About Me Section */}
          <InfoSection title="About Me" icon={Heart}>
            <InfoField
              label="Tell us about yourself"
              value={profileData.aboutMe}
              field="aboutMe"
              section=""
              type="textarea"
            />
          </InfoSection>

          {/* Family Information */}
          <InfoSection
            title="Family Information"
            icon={User}
            sectionKey="familyInfo"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="Father's Name"
                value={profileData.familyInfo.fatherName}
                field="fatherName"
                section="familyInfo"
              />
              <InfoField
                label="Father's Occupation"
                value={profileData.familyInfo.fatherOccupation}
                field="fatherOccupation"
                section="familyInfo"
              />
              <InfoField
                label="Mother's Name"
                value={profileData.familyInfo.motherName}
                field="motherName"
                section="familyInfo"
              />
              <InfoField
                label="Mother's Occupation"
                value={profileData.familyInfo.motherOccupation}
                field="motherOccupation"
                section="familyInfo"
              />
              <InfoField
                label="Siblings"
                value={profileData.familyInfo.siblings}
                field="siblings"
                section="familyInfo"
              />
              <InfoField
                label="Family Type"
                value={profileData.familyInfo.familyType}
                field="familyType"
                section="familyInfo"
                type="select"
                options={["Nuclear Family", "Joint Family"]}
              />
              <InfoField
                label="Family Status"
                value={profileData.familyInfo.familyStatus}
                field="familyStatus"
                section="familyInfo"
                type="select"
                options={[
                  "Lower Middle Class",
                  "Middle Class",
                  "Upper Middle Class",
                  "Rich",
                  "Affluent",
                ]}
              />
              <InfoField
                label="Family Values"
                value={profileData.familyInfo.familyValues}
                field="familyValues"
                section="familyInfo"
                type="select"
                options={["Traditional", "Moderate", "Liberal"]}
              />
            </div>
          </InfoSection>

          {/* Lifestyle Information */}
          <InfoSection
            title="Lifestyle & Interests"
            icon={Heart}
            sectionKey="lifestyle"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="Diet"
                value={profileData.lifestyle.diet}
                field="diet"
                section="lifestyle"
                type="select"
                options={[
                  "Vegetarian",
                  "Non-Vegetarian",
                  "Eggetarian",
                  "Vegan",
                ]}
              />
              <InfoField
                label="Smoking"
                value={profileData.lifestyle.smoking}
                field="smoking"
                section="lifestyle"
                type="select"
                options={["No", "Occasionally", "Yes"]}
              />
              <InfoField
                label="Drinking"
                value={profileData.lifestyle.drinking}
                field="drinking"
                section="lifestyle"
                type="select"
                options={["No", "Socially", "Occasionally", "Yes"]}
              />
              <InfoField
                label="Music Preferences"
                value={profileData.lifestyle.music}
                field="music"
                section="lifestyle"
              />
              <InfoField
                label="Movie Preferences"
                value={profileData.lifestyle.movies}
                field="movies"
                section="lifestyle"
              />
              <InfoField
                label="Sports"
                value={profileData.lifestyle.sports}
                field="sports"
                section="lifestyle"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <InfoField
                label="Hobbies"
                value={profileData.lifestyle.hobbies}
                field="hobbies"
                section="lifestyle"
                type="textarea"
              />
              <InfoField
                label="Interests"
                value={profileData.lifestyle.interests}
                field="interests"
                section="lifestyle"
                type="textarea"
              />
            </div>
          </InfoSection>

          {/* Partner Preferences */}
          <InfoSection
            title="Partner Preferences"
            icon={Heart}
            sectionKey="partnerPreferences"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              <InfoField
                label="Age Range"
                value={profileData.partnerPreferences.ageRange}
                field="ageRange"
                section="partnerPreferences"
              />
              <InfoField
                label="Height Range"
                value={profileData.partnerPreferences.heightRange}
                field="heightRange"
                section="partnerPreferences"
              />
              <InfoField
                label="Marital Status"
                value={profileData.partnerPreferences.maritalStatus}
                field="maritalStatus"
                section="partnerPreferences"
                type="select"
                options={["Never Married", "Divorced", "Widowed", "Any"]}
              />
              <InfoField
                label="Education"
                value={profileData.partnerPreferences.education}
                field="education"
                section="partnerPreferences"
              />
              <InfoField
                label="Occupation"
                value={profileData.partnerPreferences.occupation}
                field="occupation"
                section="partnerPreferences"
              />
              <InfoField
                label="Income"
                value={profileData.partnerPreferences.income}
                field="income"
                section="partnerPreferences"
              />
              <InfoField
                label="Location"
                value={profileData.partnerPreferences.location}
                field="location"
                section="partnerPreferences"
              />
              <InfoField
                label="Religion"
                value={profileData.partnerPreferences.religion}
                field="religion"
                section="partnerPreferences"
              />
              <InfoField
                label="Caste"
                value={profileData.partnerPreferences.caste}
                field="caste"
                section="partnerPreferences"
              />
              <InfoField
                label="Diet Preference"
                value={profileData.partnerPreferences.diet}
                field="diet"
                section="partnerPreferences"
                type="select"
                options={[
                  "Vegetarian preferred",
                  "Non-Vegetarian preferred",
                  "No Preference",
                ]}
              />
            </div>
          </InfoSection>

          {/* Profile Completion Status */}
          <div
            style={{
              background: "var(--mtu-white)",
              borderRadius: "1rem",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "var(--mtu-shadow)",
              border: "1px solid var(--mtu-border-color)",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.3rem",
                fontWeight: "600",
                color: "var(--mtu-dark-gray)",
                marginBottom: "1.5rem",
              }}
            >
              <Check size={24} color="var(--mtu-primary-pink)" />
              Profile Completion Status
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{ fontWeight: "600", color: "var(--mtu-dark-gray)" }}
                >
                  Profile Completion
                </span>
                <span
                  style={{
                    fontWeight: "600",
                    color: "var(--mtu-primary-pink)",
                  }}
                >
                  85%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "var(--mtu-light-gray)",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "85%",
                    height: "100%",
                    background: "var(--mtu-gradient-primary)",
                    borderRadius: "5px",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              {[
                { label: "Basic Information", completed: true },
                { label: "Contact Details", completed: true },
                { label: "Professional Info", completed: true },
                { label: "Family Details", completed: true },
                { label: "Lifestyle", completed: true },
                { label: "Partner Preferences", completed: true },
                { label: "Photo Gallery", completed: false },
                { label: "Horoscope Details", completed: false },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem",
                    background: item.completed
                      ? "var(--mtu-light-pink)"
                      : "var(--mtu-light-gray)",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: item.completed
                        ? "var(--mtu-primary-pink)"
                        : "var(--mtu-gray)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    {item.completed ? "✓" : "•"}
                  </div>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: item.completed
                        ? "var(--mtu-dark-pink)"
                        : "var(--mtu-gray)",
                      fontWeight: item.completed ? "600" : "500",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "var(--mtu-light-pink)",
                borderRadius: "0.5rem",
                border: "1px solid var(--mtu-secondary-pink)",
              }}
            >
              <h4
                style={{
                  color: "var(--mtu-dark-pink)",
                  marginBottom: "0.5rem",
                }}
              >
                Complete Your Profile
              </h4>
              <p
                style={{
                  color: "var(--mtu-dark-gray)",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                Add more photos and horoscope details to increase your profile
                visibility by 40%
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  className="mtu-btn mtu-btn-primary"
                  style={{ fontSize: "0.9rem" }}
                >
                  <Camera size={16} />
                  Add Photos
                </button>
                <button
                  className="mtu-btn mtu-btn-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  Add Horoscope
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div
            style={{
              background: "var(--mtu-white)",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "var(--mtu-shadow)",
              border: "1px solid var(--mtu-border-color)",
            }}
          >
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.3rem",
                fontWeight: "600",
                color: "var(--mtu-dark-gray)",
                marginBottom: "1.5rem",
              }}
            >
              <User size={24} color="var(--mtu-primary-pink)" />
              Privacy Settings
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "Show contact number",
                  description: "Allow members to see your contact number",
                  enabled: false,
                },
                {
                  label: "Show photo to all",
                  description: "Make your photos visible to all members",
                  enabled: true,
                },
                {
                  label: "Show horoscope details",
                  description: "Display astrological information",
                  enabled: true,
                },
                {
                  label: "Allow photo requests",
                  description: "Let members request for more photos",
                  enabled: true,
                },
              ].map((setting, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    background: "var(--mtu-light-gray)",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: "var(--mtu-dark-gray)",
                        marginBottom: "0.25rem",
                        fontSize: "1rem",
                      }}
                    >
                      {setting.label}
                    </h4>
                    <p
                      style={{
                        color: "var(--mtu-gray)",
                        fontSize: "0.8rem",
                        margin: 0,
                      }}
                    >
                      {setting.description}
                    </p>
                  </div>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "50px",
                      height: "24px",
                    }}
                  >
                    <input
                      type="checkbox"
                      defaultChecked={setting.enabled}
                      style={{ display: "none" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: setting.enabled
                          ? "var(--mtu-primary-pink)"
                          : "var(--mtu-gray)",
                        borderRadius: "24px",
                        transition: "0.3s",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          content: '""',
                          height: "18px",
                          width: "18px",
                          left: setting.enabled ? "29px" : "3px",
                          bottom: "3px",
                          background: "white",
                          borderRadius: "50%",
                          transition: "0.3s",
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
