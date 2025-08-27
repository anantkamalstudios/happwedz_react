import React, { useState } from "react";
import { Heart, Play, Calendar, Star, Filter, Search } from "lucide-react";
import CardEditor from "./CardEditor";
import { useNavigate } from "react-router-dom";

const WeddingCardDesigns = () => {
  const [activeTab, setActiveTab] = useState("wedding");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

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

  const handleEditTemplate = (template) => {
    const editorUrl = `/editor?template=${encodeURIComponent(
      JSON.stringify(template)
    )}`;
    navigate(editorUrl);
  };

  // const CardComponent = ({ item, type }) => (
  //   <div className="card h-100 shadow-sm">
  //     <div className="position-relative">
  //       <img
  //         src={item.image}
  //         alt={item.name}
  //         className="card-img-top"
  //         style={{ height: "250px", objectFit: "cover" }}
  //       />

  //       {/* Overlay */}
  //       <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 bg-dark bg-opacity-50 transition-all">
  //         <div className="text-center">
  //           {type === "video" && (
  //             <div className="mb-3">
  //               <Play className="text-white" size={48} />
  //             </div>
  //           )}
  //           <button className="btn btn-light btn-sm me-2 mb-2">
  //             Quick Preview
  //           </button>
  //           <button
  //             className="btn btn-primary btn-sm mb-2"
  //             onClick={() => handleEditTemplate(item)}
  //           >
  //             Customize Now
  //           </button>
  //         </div>
  //       </div>

  //       {/* Heart Icon */}
  //       <div className="position-absolute top-0 end-0 p-2">
  //         <Heart className="text-pink-500 cursor-pointer" size={20} />
  //       </div>
  //     </div>

  //     <div className="card-body">
  //       <h5 className="card-title">{item.name}</h5>
  //       <div className="d-flex align-items-center justify-content-between">
  //         <div className="d-flex align-items-center">
  //           <Star className="text-warning me-1" size={16} />
  //           <span className="small text-muted">{item.rating}</span>
  //         </div>
  //         {type === "video" && (
  //           <span className="badge bg-secondary">{item.duration}</span>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );

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
            <button
              className="wc-customize-btn"
              onClick={() => handleEditTemplate(item)}
            >
              Customize Now
            </button>
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
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
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
      <div className="bg-white shadow-sm">
        <div className="container">
          <ul className="nav nav-pills nav-fill py-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "wedding" ? "active primary-b" : ""
                }`}
                onClick={() => setActiveTab("wedding")}
                style={
                  activeTab === "wedding"
                    ? { background: "var(--primary-color)", color: "#fff" }
                    : {}
                }
              >
                Wedding Cards
                <span className="badge bg-secondary ms-2">
                  {weddingCards.length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "video" ? "active primary-b" : ""
                }`}
                onClick={() => setActiveTab("video")}
                style={
                  activeTab === "video"
                    ? { background: "var(--primary-color)", color: "#fff" }
                    : {}
                }
              >
                Video Cards
                <span className="badge bg-secondary ms-2">
                  {videoCards.length}
                </span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "savedate" ? "active primary-b" : ""
                }`}
                onClick={() => setActiveTab("savedate")}
                style={
                  activeTab === "savedate"
                    ? { background: "var(--primary-color)", color: "#fff" }
                    : {}
                }
              >
                Save the Date
                <span className="badge bg-secondary ms-2">
                  {saveTheDateCards.length}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="bg-light py-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search designs..."
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Filter size={16} />
                </span>
                <select
                  className="form-select"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
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
      </div>
      {/* Cards Grid */}
      <main className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3">
              {activeTab === "wedding" && "Wedding Card Designs"}
              {activeTab === "video" && "Video Invitation Templates"}
              {activeTab === "savedate" && "Save the Date Templates"}
            </h2>
            <p className="text-muted">
              Choose from our beautiful collection of {activeTab} templates
            </p>
          </div>

          <div className="row g-4">
            {getFilteredData().map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6">
                <CardComponent item={item} type={activeTab} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeddingCardDesigns;
