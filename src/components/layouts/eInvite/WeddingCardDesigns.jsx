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
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Royal+Elegance",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Blush Romance",
      theme: "modern",
      culture: "western",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Blush+Romance",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Pink Petals",
      theme: "floral",
      culture: "indian",
      image:
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Pink+Petals",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Crimson Dreams",
      theme: "traditional",
      culture: "indian",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Crimson+Dreams",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Rose Garden",
      theme: "floral",
      culture: "western",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Rose+Garden",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Vintage Pink",
      theme: "vintage",
      culture: "western",
      image:
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Vintage+Pink",
      rating: 4.5,
    },
    {
      id: 7,
      name: "Maharani Palace",
      theme: "traditional",
      culture: "indian",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Maharani+Palace",
      rating: 4.9,
    },
    {
      id: 8,
      name: "Cherry Blossom",
      theme: "floral",
      culture: "asian",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Cherry+Blossom",
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
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Romantic+Slideshow",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Love Story Animation",
      theme: "animated",
      duration: "1:45",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Love+Story+Animation",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Pink Elegance Video",
      theme: "elegant",
      duration: "2:00",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Pink+Elegance+Video",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Bollywood Romance",
      theme: "bollywood",
      duration: "3:00",
      image:
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Bollywood+Romance",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Minimalist Motion",
      theme: "minimalist",
      duration: "1:30",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Minimalist+Motion",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Floral Fantasy",
      theme: "floral",
      duration: "2:15",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Floral+Fantasy",
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
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Pink+Announcement",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Floral Notice",
      theme: "floral",
      style: "postcard",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Floral+Notice",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Elegant Calendar",
      theme: "elegant",
      style: "calendar",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Elegant+Calendar",
      rating: 4.7,
    },
    {
      id: 4,
      name: "Rose Reminder",
      theme: "romantic",
      style: "card",
      image:
        "https://via.placeholder.com/300x400/E91E63/FFFFFF?text=Rose+Reminder",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Vintage Save",
      theme: "vintage",
      style: "postcard",
      image:
        "https://via.placeholder.com/300x400/F8BBD9/FFFFFF?text=Vintage+Save",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Dreamy Date",
      theme: "dreamy",
      style: "card",
      image:
        "https://via.placeholder.com/300x400/C2185B/FFFFFF?text=Dreamy+Date",
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

      <style jsx>{`
        .wc-page-container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #fce4ec 0%,
            #ffffff 50%,
            #f8bbd9 100%
          );
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .wc-header {
          background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
          color: white;
          padding: 4rem 0 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .wc-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="hearts" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M10,6 C6,2 2,6 6,10 C2,6 6,14 10,10 C14,6 18,2 14,6 C18,10 14,14 10,10" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23hearts)"/></svg>')
            repeat;
          opacity: 0.1;
        }

        .wc-header-content {
          position: relative;
          z-index: 1;
        }

        .wc-main-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .wc-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .wc-nav-section {
          background: white;
          border-bottom: 1px solid #f0f0f0;
          padding: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .wc-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .wc-nav-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .wc-tab {
          padding: 1.5rem 2rem;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wc-tab:hover {
          color: #e91e63;
          background: #fce4ec;
        }

        .wc-tab-active {
          color: #e91e63;
          border-bottom-color: #e91e63;
          background: #fce4ec;
        }

        .wc-tab-count {
          background: #e91e63;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .wc-filters-section {
          background: white;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .wc-filters-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .wc-search-bar {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .wc-search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1.25rem;
          height: 1.25rem;
          color: #9ca3af;
        }

        .wc-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #f0f0f0;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .wc-search-input:focus {
          border-color: #e91e63;
          box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
        }

        .wc-filters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .wc-filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #f0f0f0;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          cursor: pointer;
          background: white;
          transition: all 0.3s ease;
        }

        .wc-filter-select:focus {
          border-color: #e91e63;
        }

        .wc-main-content {
          padding: 3rem 0;
        }

        .wc-section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .wc-section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .wc-section-subtitle {
          font-size: 1.125rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .wc-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .wc-card-container {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
        }

        .wc-card-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(233, 30, 99, 0.2);
        }

        .wc-card-image-wrapper {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .wc-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wc-card-container:hover .wc-card-image {
          transform: scale(1.05);
        }

        .wc-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(233, 30, 99, 0.8) 100%
          );
          opacity: 0;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wc-card-container:hover .wc-card-overlay {
          opacity: 1;
        }

        .wc-card-overlay-content {
          text-align: center;
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }

        .wc-card-container:hover .wc-card-overlay-content {
          transform: translateY(0);
        }

        .wc-play-button {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .wc-play-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .wc-preview-btn,
        .wc-customize-btn {
          display: block;
          width: 80%;
          margin: 0.5rem auto;
          padding: 0.75rem 1rem;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .wc-customize-btn {
          background: white;
          color: #e91e63;
        }

        .wc-preview-btn:hover {
          background: white;
          color: #e91e63;
        }

        .wc-customize-btn:hover {
          background: #e91e63;
          color: white;
        }

        .wc-card-heart {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .wc-card-info {
          padding: 1.5rem;
        }

        .wc-card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .wc-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .wc-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .wc-duration {
          background: #f8bbd9;
          color: #c2185b;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .wc-main-title {
            font-size: 2.5rem;
          }

          .wc-nav-tabs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .wc-tab {
            padding: 1rem 1.5rem;
            white-space: nowrap;
          }

          .wc-filters-wrapper {
            flex-direction: column;
            gap: 1rem;
          }

          .wc-search-bar {
            max-width: none;
          }

          .wc-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .wc-section-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .wc-main-title {
            font-size: 2rem;
          }

          .wc-cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .wc-tab {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .wc-header {
            padding: 2rem 0;
          }
        }

        /* Animations */
        @keyframes wc-fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wc-card-container {
          animation: wc-fadeInUp 0.6s ease forwards;
        }

        .wc-card-container:nth-child(1) {
          animation-delay: 0.1s;
        }
        .wc-card-container:nth-child(2) {
          animation-delay: 0.2s;
        }
        .wc-card-container:nth-child(3) {
          animation-delay: 0.3s;
        }
        .wc-card-container:nth-child(4) {
          animation-delay: 0.4s;
        }
        .wc-card-container:nth-child(5) {
          animation-delay: 0.5s;
        }
        .wc-card-container:nth-child(6) {
          animation-delay: 0.6s;
        }
        .wc-card-container:nth-child(7) {
          animation-delay: 0.7s;
        }
        .wc-card-container:nth-child(8) {
          animation-delay: 0.8s;
        }

        /* Hover Effects */
        .wc-card-heart:hover {
          transform: scale(1.1);
        }

        .wc-tab-count {
          transition: all 0.3s ease;
        }

        .wc-tab:hover .wc-tab-count {
          background: #c2185b;
        }

        .wc-tab-active .wc-tab-count {
          background: #c2185b;
        }
      `}</style>
    </div>
  );
};

export default WeddingCardDe;
