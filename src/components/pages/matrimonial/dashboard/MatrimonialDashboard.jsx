import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  MessageCircle,
  Star,
  Search,
  Filter,
  Bell,
  User,
  Settings,
  Home,
  Activity,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  ThumbsUp,
  X,
} from "lucide-react";
import "../../../../Matrimonialdashboard.css";
import { Link } from "react-router-dom";
const sampleProfiles = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 26,
    location: "Mumbai, Maharashtra",
    education: "MBA Finance",
    profession: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
    status: "online",
    tags: ["Vegetarian", "Non-Smoker", "Yoga Enthusiast"],
    about:
      "Looking for a life partner who shares similar values and interests.",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    age: 29,
    location: "Bangalore, Karnataka",
    education: "B.Tech IT",
    profession: "Data Scientist",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    status: "online",
    tags: ["Fitness", "Travel", "Music"],
    about:
      "Passionate about technology and looking for meaningful connections.",
  },
  {
    id: 3,
    name: "Anjali Patel",
    age: 24,
    location: "Ahmedabad, Gujarat",
    education: "CA",
    profession: "Chartered Accountant",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    status: "offline",
    tags: ["Books", "Classical Music", "Cooking"],
    about: "Family-oriented person seeking a caring and understanding partner.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    age: 31,
    location: "Delhi, NCR",
    education: "MBBS",
    profession: "Doctor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    status: "online",
    tags: ["Healthcare", "Social Work", "Reading"],
    about:
      "Dedicated medical professional looking for a supportive life partner.",
  },
  {
    id: 5,
    name: "Sneha Reddy",
    age: 27,
    location: "Hyderabad, Telangana",
    education: "M.Sc Physics",
    profession: "Research Scientist",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
    status: "online",
    tags: ["Science", "Hiking", "Photography"],
    about:
      "Science enthusiast seeking an intellectually stimulating relationship.",
  },
  {
    id: 6,
    name: "Arjun Mehta",
    age: 28,
    location: "Pune, Maharashtra",
    education: "MBA Marketing",
    profession: "Marketing Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    status: "offline",
    tags: ["Creative", "Sports", "Adventure"],
    about:
      "Creative professional looking for someone who shares a zest for life.",
  },
];

const MatrimonialDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [filteredProfiles, setFilteredProfiles] = useState(sampleProfiles);
  const [searchFilters, setSearchFilters] = useState({
    ageRange: "",
    location: "",
    education: "",
    profession: "",
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [stats, setStats] = useState({
    totalProfiles: 1250,
    activeProfiles: 890,
    newMatches: 25,
    messages: 12,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalProfiles: prev.totalProfiles + Math.floor(Math.random() * 5),
        activeProfiles: prev.activeProfiles + Math.floor(Math.random() * 3),
        newMatches: prev.newMatches + Math.floor(Math.random() * 2),
        messages: prev.messages + Math.floor(Math.random() * 3),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filterName, value) => {
    setSearchFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    let filtered = sampleProfiles;

    if (searchFilters.location) {
      filtered = filtered.filter((profile) =>
        profile.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase())
      );
    }

    if (searchFilters.education) {
      filtered = filtered.filter((profile) =>
        profile.education
          .toLowerCase()
          .includes(searchFilters.education.toLowerCase())
      );
    }

    if (searchFilters.profession) {
      filtered = filtered.filter((profile) =>
        profile.profession
          .toLowerCase()
          .includes(searchFilters.profession.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "profiles", label: "Browse Profiles", icon: Users },
    { id: "matches", label: "My Matches", icon: Heart },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "interests", label: "Interest Sent", icon: UserCheck },
    { id: "visitors", label: "Profile Visitors", icon: Eye },
    { id: "search", label: "Advanced Search", icon: Search },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const ProfileCard = ({ profile }) => (
    <div className="mtu-profile-card">
      <div className="mtu-profile-image-container">
        <img
          src={profile.image}
          alt={profile.name}
          className="mtu-profile-image"
        />
        <span className={`mtu-profile-status ${profile.status}`}>
          {profile.status}
        </span>
      </div>
      <div className="mtu-profile-content">
        <h3 className="mtu-profile-name">{profile.name}</h3>
        <div className="mtu-profile-details">
          <p>
            <MapPin
              size={14}
              style={{ display: "inline", marginRight: "5px" }}
            />
            {profile.location}
          </p>
          <p>
            <Calendar
              size={14}
              style={{ display: "inline", marginRight: "5px" }}
            />
            {profile.age} years
          </p>
          <p>
            <User size={14} style={{ display: "inline", marginRight: "5px" }} />
            {profile.profession}
          </p>
        </div>
        <div className="mtu-profile-tags">
          {profile.tags.map((tag, index) => (
            <span key={index} className="mtu-profile-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="mtu-profile-actions">
          <button
            className="mtu-btn mtu-btn-primary"
            onClick={() => setSelectedProfile(profile)}
          >
            <Heart size={16} />
            View Profile
          </button>
          <button className="mtu-btn mtu-btn-secondary">
            <MessageCircle size={16} />
            Message
          </button>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, change }) => (
    <div className="mtu-stat-card">
      <div className="mtu-stat-header">
        <span className="mtu-stat-title">{title}</span>
        <div className="mtu-stat-icon">
          <Icon size={20} />
        </div>
      </div>
      <div className="mtu-stat-value">{value.toLocaleString()}</div>
      {change && (
        <div
          className={`mtu-stat-change ${change > 0 ? "positive" : "negative"}`}
        >
          {change > 0 ? "+" : ""}
          {change}% from last week
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div>
      <div className="mtu-content-header">
        <h1 className="mtu-page-title">
          <Activity size={32} />
          Dashboard Overview
        </h1>
        <div className="mtu-breadcrumb">
          Home <span className="mtu-breadcrumb-separator"></span> Dashboard
        </div>
      </div>

      <div className="mtu-stats-grid">
        <StatCard
          title="Total Profiles"
          value={stats.totalProfiles}
          icon={Users}
          change={8.2}
        />

        <StatCard
          title="Active Users"
          value={stats.activeProfiles}
          icon={UserCheck}
          change={5.4}
        />
        <StatCard
          title="New Matches"
          value={stats.newMatches}
          icon={Heart}
          change={12.1}
        />
        <StatCard
          title="Messages"
          value={stats.messages}
          icon={MessageCircle}
          change={-2.3}
        />
      </div>

      <div className="mtu-search-section">
        <div className="mtu-search-header">
          <h2 className="mtu-search-title">Quick Profile Search</h2>
        </div>
        <div className="mtu-search-form">
          <div className="mtu-form-group">
            <label className="mtu-form-label">Age Range</label>
            <select
              className="mtu-form-select"
              value={searchFilters.ageRange}
              onChange={(e) => handleFilterChange("ageRange", e.target.value)}
            >
              <option value="">Select Age Range</option>
              <option value="20-25">20-25 years</option>
              <option value="26-30">26-30 years</option>
              <option value="31-35">31-35 years</option>
              <option value="36-40">36-40 years</option>
            </select>
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Location</label>
            <input
              type="text"
              className="mtu-form-input"
              placeholder="Enter city or state"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Education</label>
            <input
              type="text"
              className="mtu-form-input"
              placeholder="Enter education qualification"
              value={searchFilters.education}
              onChange={(e) => handleFilterChange("education", e.target.value)}
            />
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Profession</label>
            <input
              type="text"
              className="mtu-form-input"
              placeholder="Enter profession"
              value={searchFilters.profession}
              onChange={(e) => handleFilterChange("profession", e.target.value)}
            />
          </div>
        </div>
        <div className="mtu-search-actions">
          <button
            className="mtu-btn mtu-btn-secondary"
            onClick={() =>
              setSearchFilters({
                ageRange: "",
                location: "",
                education: "",
                profession: "",
              })
            }
          >
            Clear Filters
          </button>
          <button className="mtu-btn mtu-btn-primary" onClick={applyFilters}>
            <Search size={16} />
            Search Profiles
          </button>
        </div>
      </div>

      <div className="mtu-profiles-grid">
        {filteredProfiles.slice(0, 4).map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
  const renderProfiles = () => (
    <div>
      <div className="mtu-content-header">
        <h1 className="mtu-page-title">
          <Users size={32} />
          Browse Profiles
        </h1>
        <div className="mtu-breadcrumb">
          Home <span className="mtu-breadcrumb-separator"></span> Browse
          Profiles
        </div>
      </div>

      <div className="mtu-search-section">
        <div className="mtu-search-header">
          <h2 className="mtu-search-title">Filter Profiles</h2>
          <button className="mtu-btn mtu-btn-primary">
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>
        <div className="mtu-search-form">
          <div className="mtu-form-group">
            <label className="mtu-form-label">Age Range</label>
            <select
              className="mtu-form-select"
              value={searchFilters.ageRange}
              onChange={(e) => handleFilterChange("ageRange", e.target.value)}
            >
              <option value="">All Ages</option>
              <option value="20-25">20-25 years</option>
              <option value="26-30">26-30 years</option>
              <option value="31-35">31-35 years</option>
              <option value="36-40">36-40 years</option>
            </select>
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Location</label>
            <input
              type="text"
              className="mtu-form-input"
              placeholder="Search by location"
              value={searchFilters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Education</label>
            <select className="mtu-form-select">
              <option value="">All Education</option>
              <option value="graduate">Graduate</option>
              <option value="postgraduate">Post Graduate</option>
              <option value="doctorate">Doctorate</option>
            </select>
          </div>
          <div className="mtu-form-group">
            <label className="mtu-form-label">Profession</label>
            <select className="mtu-form-select">
              <option value="">All Professions</option>
              <option value="engineer">Engineer</option>
              <option value="doctor">Doctor</option>
              <option value="teacher">Teacher</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
        <div className="mtu-search-actions">
          <button className="mtu-btn mtu-btn-secondary">Reset</button>
          <button className="mtu-btn mtu-btn-primary" onClick={applyFilters}>
            <Search size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      <div className="mtu-profiles-grid">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );

  const renderMatches = () => (
    <div>
      <div className="mtu-content-header">
        <h1 className="mtu-page-title">
          <Heart size={32} />
          My Matches
        </h1>
        <div className="mtu-breadcrumb">
          Home <span className="mtu-breadcrumb-separator"></span> My Matches
        </div>
      </div>

      <div className="mtu-stats-grid">
        <StatCard title="Total Matches" value={25} icon={Heart} />
        <StatCard title="Mutual Interest" value={8} icon={ThumbsUp} />
        <StatCard title="Profile Views" value={156} icon={Eye} />
        <StatCard title="Interest Sent" value={42} icon={UserCheck} />
      </div>

      <div className="mtu-profiles-grid">
        {filteredProfiles.slice(0, 3).map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div>
      <div className="mtu-content-header">
        <h1 className="mtu-page-title">
          <MessageCircle size={32} />
          Messages
        </h1>
        <div className="mtu-breadcrumb">
          Home <span className="mtu-breadcrumb-separator"></span> Messages
        </div>
      </div>

      <div className="mtu-search-section">
        <div className="mtu-search-header">
          <h2 className="mtu-search-title">Recent Conversations</h2>
        </div>
        <div style={{ display: "grid", gap: "1rem" }}>
          {filteredProfiles.slice(0, 3).map((profile) => (
            <div
              key={profile.id}
              style={{
                background: "var(--mtu-white)",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--mtu-border-color)",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src={profile.image}
                alt={profile.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: "var(--mtu-dark-gray)" }}>
                  {profile.name}
                </h4>
                <p
                  style={{
                    margin: "0.25rem 0",
                    color: "var(--mtu-gray)",
                    fontSize: "0.9rem",
                  }}
                >
                  Last message: Hi! I'm interested in your profile...
                </p>
                <small style={{ color: "var(--mtu-gray)" }}>2 hours ago</small>
              </div>
              <button className="mtu-btn mtu-btn-primary">
                <MessageCircle size={16} />
                Reply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "edit-profile":
        return renderEditProfile();
      case "profiles":
        return renderProfiles();
      case "matches":
        return renderMatches();
      case "messages":
        return renderMessages();
      case "interests":
        return renderMatches();
      case "visitors":
        return renderMatches();
      case "search":
        return renderProfiles();
      case "settings":
        return (
          <div>
            <div className="mtu-content-header">
              <h1 className="mtu-page-title">
                <Settings size={32} />
                Account Settings
              </h1>
            </div>
            <div className="mtu-search-section">
              <h2 className="mtu-search-title">Profile Settings</h2>
              <p style={{ color: "var(--mtu-gray)" }}>
                Manage your account preferences and privacy settings.
              </p>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="matrimonial">
      <div className="matrimony-unique-body mtu-root">
        {/* Header */}
        <header className="mtu-header-wrapper">
          <nav className="mtu-navigation-container">
            {/* <a href="#" className="mtu-brand-logo">
            <Heart size={28} />
            SoulMate Connect
          </a>
          <ul className="mtu-nav-menu">
            <li className="mtu-nav-item">
              <a href="#">Home</a>
            </li>
            <li className="mtu-nav-item">
              <a href="#">About</a>
            </li>
            <li className="mtu-nav-item">
              <a href="#">Success Stories</a>
            </li>
            <li className="mtu-nav-item">
              <a href="#">Help</a>
            </li> */}
            {/* </ul> */}
            <div className="mtu-user-profile">
              <div className="mtu-notification-icon">
                <Bell size={20} />
                <span className="mtu-notification-badge">3</span>
              </div>
              <Link to="/edit-profile">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="mtu-profile-avatar"
                />
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Dashboard */}
        <div className="mtu-dashboard-container">
          <div className="mtu-dashboard-grid">
            {/* Sidebar */}
            <aside className="mtu-sidebar-panel">
              <h2 className="mtu-sidebar-title">Navigation</h2>
              <ul className="mtu-sidebar-menu">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className="mtu-sidebar-item">
                      <a
                        href="#"
                        className={`mtu-sidebar-link ${
                          activeSection === item.id ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(item.id);
                        }}
                      >
                        <Icon size={20} className="mtu-sidebar-icon" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Main Content */}
            <main className="mtu-main-content">{renderContent()}</main>
          </div>
        </div>

        {/* Profile Modal */}
        {selectedProfile && (
          <div
            className="mtu-modal-overlay"
            onClick={() => setSelectedProfile(null)}
          >
            <div
              className="mtu-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mtu-modal-header">
                <h2 className="mtu-modal-title">{selectedProfile.name}</h2>
                <button
                  className="mtu-modal-close"
                  onClick={() => setSelectedProfile(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "2rem",
                }}
              >
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  style={{
                    width: "100%",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h3
                    style={{
                      color: "var(--mtu-dark-gray)",
                      marginBottom: "1rem",
                    }}
                  >
                    {selectedProfile.name}, {selectedProfile.age}
                  </h3>
                  <div style={{ marginBottom: "1rem" }}>
                    <p>
                      <MapPin
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: "8px",
                          color: "var(--mtu-primary-pink)",
                        }}
                      />
                      {selectedProfile.location}
                    </p>
                    <p>
                      <User
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: "8px",
                          color: "var(--mtu-primary-pink)",
                        }}
                      />
                      {selectedProfile.profession}
                    </p>
                    <p>
                      <Calendar
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: "8px",
                          color: "var(--mtu-primary-pink)",
                        }}
                      />
                      {selectedProfile.education}
                    </p>
                  </div>
                  <div
                    className="mtu-profile-tags"
                    style={{ marginBottom: "1rem" }}
                  >
                    {selectedProfile.tags.map((tag, index) => (
                      <span key={index} className="mtu-profile-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p
                    style={{ color: "var(--mtu-gray)", marginBottom: "1.5rem" }}
                  >
                    {selectedProfile.about}
                  </p>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="mtu-btn mtu-btn-primary">
                      <Heart size={16} />
                      Express Interest
                    </button>
                    <button className="mtu-btn mtu-btn-secondary">
                      <MessageCircle size={16} />
                      Send Message
                    </button>
                    <button className="mtu-btn mtu-btn-secondary">
                      <Phone size={16} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrimonialDashboard;
