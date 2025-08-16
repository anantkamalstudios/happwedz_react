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
  Menu,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <MapPin className="mtu-detail-icon" />
            {profile.location}
          </p>
          <p>
            <Calendar className="mtu-detail-icon" />
            {profile.age} years
          </p>
          <p>
            <User className="mtu-detail-icon" />
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
            <Heart className="mtu-btn-icon" />
            View Profile
          </button>
          <button className="mtu-btn mtu-btn-secondary">
            <MessageCircle className="mtu-btn-icon" />
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
          <Icon className="mtu-stat-icon-svg" />
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
          <Activity className="mtu-title-icon" />
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
            <Search className="mtu-btn-icon" />
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
          <Users className="mtu-title-icon" />
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
            <Filter className="mtu-btn-icon" />
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
            <Search className="mtu-btn-icon" />
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
          <Heart className="mtu-title-icon" />
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
          <MessageCircle className="mtu-title-icon" />
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
        <div className="mtu-messages-list">
          {filteredProfiles.slice(0, 3).map((profile) => (
            <div key={profile.id} className="mtu-message-item">
              <img
                src={profile.image}
                alt={profile.name}
                className="mtu-message-avatar"
              />
              <div className="mtu-message-content">
                <h4 className="mtu-message-name">{profile.name}</h4>
                <p className="mtu-message-preview">
                  Last message: Hi! I'm interested in your profile...
                </p>
                <small className="mtu-message-time">2 hours ago</small>
              </div>
              <button className="mtu-btn mtu-btn-primary">
                <MessageCircle className="mtu-btn-icon" />
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
                <Settings className="mtu-title-icon" />
                Account Settings
              </h1>
            </div>
            <div className="mtu-search-section">
              <h2 className="mtu-search-title">Profile Settings</h2>
              <p className="mtu-settings-description">
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
            <button
              className="mtu-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="mtu-user-profile">
              <div className="mtu-notification-icon">
                <Bell className="mtu-notification-bell" />
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

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="mtu-mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="mtu-mobile-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mtu-mobile-menu-header">
                <h2>Menu</h2>
                <button
                  className="mtu-mobile-menu-close"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <ul className="mtu-mobile-sidebar-menu">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id} className="mtu-mobile-sidebar-item">
                      <a
                        href="#"
                        className={`mtu-mobile-sidebar-link ${
                          activeSection === item.id ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSection(item.id);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Icon className="mtu-mobile-sidebar-icon" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

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
                        <Icon className="mtu-sidebar-icon" />
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
                  <X className="mtu-modal-close-icon" />
                </button>
              </div>
              <div className="mtu-modal-body">
                <img
                  src={selectedProfile.image}
                  alt={selectedProfile.name}
                  className="mtu-modal-profile-image"
                />
                <div className="mtu-modal-profile-content">
                  <h3 className="mtu-modal-profile-name">
                    {selectedProfile.name}, {selectedProfile.age}
                  </h3>
                  <div className="mtu-modal-profile-details">
                    <p>
                      <MapPin className="mtu-modal-detail-icon" />
                      {selectedProfile.location}
                    </p>
                    <p>
                      <User className="mtu-modal-detail-icon" />
                      {selectedProfile.profession}
                    </p>
                    <p>
                      <Calendar className="mtu-modal-detail-icon" />
                      {selectedProfile.education}
                    </p>
                  </div>
                  <div className="mtu-modal-profile-tags">
                    {selectedProfile.tags.map((tag, index) => (
                      <span key={index} className="mtu-modal-profile-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mtu-modal-profile-about">
                    {selectedProfile.about}
                  </p>
                  <div className="mtu-modal-profile-actions">
                    <button className="mtu-btn mtu-btn-primary">
                      <Heart className="mtu-btn-icon" />
                      Express Interest
                    </button>
                    <button className="mtu-btn mtu-btn-secondary">
                      <MessageCircle className="mtu-btn-icon" />
                      Send Message
                    </button>
                    <button className="mtu-btn mtu-btn-secondary">
                      <Phone className="mtu-btn-icon" />
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
