import React, { useState } from "react";
import { Heart, Play, Calendar, Star, Filter, Search } from "lucide-react";

const WeddingCardDesigns = () => {
  const [activeTab, setActiveTab] = useState("wedding");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Wedding Card Designs Data
  const weddingCards = [
    {
      id: 1,
      name: "Royal Elegance",
      theme: "traditional",
      culture: "indian",
      image:
        "https://image.wedmegood.com/e-invite-images/5921489f-e0f7-411a-8b19-a85f2c11d2e9-1.JPEG",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Blush Romance",
      theme: "modern",
      culture: "western",
      image:
        "https://image.wedmegood.com/e-invite-images/5921489f-e0f7-411a-8b19-a85f2c11d2e9-1.JPEG",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Pink Petals",
      theme: "floral",
      culture: "indian",
      image:
        "https://image.wedmegood.com/e-invite-images/5921489f-e0f7-411a-8b19-a85f2c11d2e9-1.JPEG",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Crimson Dreams",
      theme: "traditional",
      culture: "indian",
      image:
        "https://image.wedmegood.com/e-invite-images/5921489f-e0f7-411a-8b19-a85f2c11d2e9-1.JPEG",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Rose Garden",
      theme: "floral",
      culture: "western",
      image:
        "https://image.wedmegood.com/e-invite-images/5921489f-e0f7-411a-8b19-a85f2c11d2e9-1.JPEG",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Vintage Pink",
      theme: "vintage",
      culture: "western",
      image:
        "https://image.wedmegood.com/e-invite-images/96d644fc-5760-4732-b7e7-7283f9ffc903-1.JPEG",
      rating: 4.5,
    },
    {
      id: 7,
      name: "Maharani Palace",
      theme: "traditional",
      culture: "indian",
      image:
        "https://image.wedmegood.com/e-invite-images/96d644fc-5760-4732-b7e7-7283f9ffc903-1.JPEG",
      rating: 4.9,
    },
    {
      id: 8,
      name: "Cherry Blossom",
      theme: "floral",
      culture: "asian",
      image:
        "https://image.wedmegood.com/e-invite-images/96d644fc-5760-4732-b7e7-7283f9ffc903-1.JPEG",
      rating: 4.7,
    },
  ];

  // Video Card Templates Data
  const videoCards = [
    {
      id: 1,
      name: "Romantic Slideshow",
      theme: "romantic",
      duration: "2:30",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Love Story Animation",
      theme: "animated",
      duration: "1:45",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Pink Elegance Video",
      theme: "elegant",
      duration: "2:00",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Bollywood Romance",
      theme: "bollywood",
      duration: "3:00",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Minimalist Motion",
      theme: "minimalist",
      duration: "1:30",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Floral Fantasy",
      theme: "floral",
      duration: "2:15",
      image:
        "https://image.wedmegood.com/e-invite-images/5b8ae9dc-c18b-4712-a2b7-b112f081acac-Love_Meadows.JPEG",
      rating: 4.5,
    },
  ];

  // Save the Date Templates Data
  const saveTheDateCards = [
    {
      id: 1,
      name: "Pink Announcement",
      theme: "modern",
      style: "card",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Floral Notice",
      theme: "floral",
      style: "postcard",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Elegant Calendar",
      theme: "elegant",
      style: "calendar",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Rose Reminder",
      theme: "romantic",
      style: "card",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Vintage Save",
      theme: "vintage",
      style: "postcard",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Dreamy Date",
      theme: "dreamy",
      style: "card",
      image:
        "https://image.wedmegood.com/e-invite-images/1f0581db-53fd-4b8d-bc42-58e7dcfbd4d9-Artboard_2.JPEG",
      rating: 4.5,
    },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "wedding":
        return weddingCards;
      case "video":
        return videoCards;
      case "savedate":
        return saveTheDateCards;
      default:
        return weddingCards;
    }
  };

  const getFilteredData = () => {
    const data = getCurrentData();
    if (selectedFilter === "all") return data;
    return data.filter(
      (item) =>
        item.theme === selectedFilter ||
        item.culture === selectedFilter ||
        item.style === selectedFilter
    );
  };

  const CardComponent = ({ item, type }) => (
    <div className="wc-card-container group">
      <div className="wc-card-image-wrapper">
        <img src={item.image} alt={item.name} className="wc-card-image" />
        <div className="wc-card-overlay">
          <div className="wc-card-overlay-content">
            {type === "video" && (
              <div className="wc-play-button">
                <Play className="w-8 h-8 text-white fill-current" />
              </div>
            )}
            <button className="wc-preview-btn">Quick Preview</button>
            <button className="wc-customize-btn">Customize Now</button>
          </div>
        </div>
        <div className="wc-card-heart">
          <Heart className="w-5 h-5 text-pink-500 hover:fill-current cursor-pointer transition-all" />
        </div>
      </div>
      <div className="wc-card-info">
        <h3 className="wc-card-title">{item.name}</h3>
        <div className="wc-card-meta">
          <div className="wc-rating">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{item.rating}</span>
          </div>
          {type === "video" && (
            <span className="wc-duration">{item.duration}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="wc-page-container">
      {/* Header */}
      <header className="wc-header">
        <div className="wc-header-content">
          <h1 className="wc-main-title">Wedding Invitations</h1>
          <p className="wc-subtitle">
            Create beautiful wedding invitations that tell your love story
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="wc-nav-section">
        <div className="wc-container">
          <nav className="wc-nav-tabs">
            <button
              className={`wc-tab ${
                activeTab === "wedding" ? "wc-tab-active" : ""
              }`}
              onClick={() => setActiveTab("wedding")}
            >
              Wedding Cards
              <span className="wc-tab-count">{weddingCards.length}</span>
            </button>
            <button
              className={`wc-tab ${
                activeTab === "video" ? "wc-tab-active" : ""
              }`}
              onClick={() => setActiveTab("video")}
            >
              Video Cards
              <span className="wc-tab-count">{videoCards.length}</span>
            </button>
            <button
              className={`wc-tab ${
                activeTab === "savedate" ? "wc-tab-active" : ""
              }`}
              onClick={() => setActiveTab("savedate")}
            >
              Save the Date
              <span className="wc-tab-count">{saveTheDateCards.length}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="wc-filters-section">
        <div className="wc-container">
          <div className="wc-filters-wrapper">
            <div className="wc-search-bar">
              <Search className="wc-search-icon" />
              <input
                type="text"
                placeholder="Search designs..."
                className="wc-search-input"
              />
            </div>
            <div className="wc-filters">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="wc-filter-select"
              >
                <option value="all">All Themes</option>
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
                <option value="floral">Floral</option>
                <option value="romantic">Romantic</option>
                <option value="vintage">Vintage</option>
                <option value="elegant">Elegant</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <main className="wc-main-content">
        <div className="wc-container">
          <div className="wc-section-header">
            <h2 className="wc-section-title">
              {activeTab === "wedding" && "Wedding Card Designs"}
              {activeTab === "video" && "Video Invitation Templates"}
              {activeTab === "savedate" && "Save the Date Templates"}
            </h2>
            <p className="wc-section-subtitle">
              Choose from our beautiful collection of {activeTab} templates
            </p>
          </div>

          <div className="wc-cards-grid">
            {getFilteredData().map((item) => (
              <CardComponent key={item.id} item={item} type={activeTab} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeddingCardDesigns;
