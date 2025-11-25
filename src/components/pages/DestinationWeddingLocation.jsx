import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DestinationWeddingLayout = ({
  icon,
  title,
  subtitle,
  btnName,
  redirectUrl,
  images: apiImages = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const normalizeUrl = (u) =>
    typeof u === "string" ? u.replace(/`/g, "").trim() : u;

  const images =
    Array.isArray(apiImages) && apiImages.length > 0
      ? apiImages
        .map(normalizeUrl)
        .map((url, idx) => ({
          id: idx + 1,
          url,
          alt: title || "Destination Wedding",
        }))
      : [
        {
          id: 1,
          url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
          alt: "Beach wedding setup",
          title: "Goa",
          description: "Goa is extremely popular for destination weddings, and it's really not rocket science to guess why! If you have been dreaming of a beach wedding ever since you were a kid, then this is where you have to be!",
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop",
          alt: "Beach wedding ceremony",
          title: "Mumbai",
          description: "Mumbai is extremely popular for destination weddings, and it's really not rocket science to guess why! If you have been dreaming of a beach wedding ever since you were a kid, then this is where you have to be!",
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
          alt: "Tropical wedding",
          title: "UK",
          description: "Uk is extremely popular for destination weddings, and it's really not rocket science to guess why! If you have been dreaming of a beach wedding ever since you were a kid, then this is where you have to be!",
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
          alt: "Tropical wedding",
          title: "Dubai",
          description: "Dubai is extremely popular for destination weddings, and it's really not rocket science to guess why! If you have been dreaming of a beach wedding ever since you were a kid, then this is where you have to be!",
        },
      ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const visibleCards = [
    images[currentSlide % images.length],
    images[(currentSlide + 1) % images.length],
    images[(currentSlide + 2) % images.length],
  ];

  return (
    <div className="destination-wedding-container">
      <div className="layout-wrapper">
        {/* Left Section - Pink Background with Overlap */}
        <div className="left-section">
          <h1 className="main-title">
            {title || 'Which Are The Best Destination Wedding Locations In India?'}
          </h1>
        </div>

        {/* Right Section - Cards Display */}
        <div className="right-section">
          {/* Cards Container */}
          <div className="cards-wrapper">
            <div className="cards-container">
              {visibleCards.map((image, index) => (
                <div key={`${image.id}-${index}`} className="card">
                  {/* Image */}
                  <div className="card-image">
                    <img
                      src={image.url}
                      alt={image.alt}
                    />
                  </div>

                  {/* Content */}
                  <div className="card-content">
                    <h3 className="card-title">
                      {image.title}
                    </h3>
                    <p className="card-description">
                      {image.description}
                    </p>
                    <button className="card-button" onClick={() => navigate(`/destination-wedding/${(image.title || '').toLowerCase()}`)}>
                      See Details
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button
              onClick={prevSlide}
              className="nav-button nav-prev"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="nav-button nav-next"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .destination-wedding-container {
          width: 100%;
          background-color: #f5f5f5;
          overflow: hidden;
        }

        .layout-wrapper {
          display: flex;
          min-height: 600px;
          position: relative;
        }

        .left-section {
          width: 40%;
          background-color: #d81b60;
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 0;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15);
        }

        .main-title {
          font-size: 48px;
          font-weight: bold;
          line-height: 1.2;
          margin: 0;
          font-family: Georgia, serif;
        }

        .right-section {
          width: 60%;
          padding: 40px 0 40px 0px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: visible;
          margin-left: -50px;
        }

        .cards-wrapper {
          width: 100%;
          overflow: hidden;
        }

        .cards-container {
          display: flex;
          gap: 20px;
          width: 100%;
          transition: transform 0.5s ease;
        }

        .card {
          flex: 0 0 calc(33.333% - 20px);
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card:hover .card-image img {
          transform: scale(1.05);
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          color: #d81b60;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 12px 0;
          font-family: Georgia, serif;
        }

        .card-description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        .card-button {
          background-color: transparent;
          border: 1px solid #d81b60;
          color: #d81b60;
          padding: 10px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .card-button:hover {
          background-color: #d81b60;
          color: white;
        }

        .navigation-buttons {
          position: absolute;
          bottom: 0px;
          right: 40px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .nav-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: none;
        }

        .nav-prev {
          border: 1px solid #ddd;
          background-color: white;
        }

        .nav-prev:hover {
          background-color: #f0f0f0;
        }

        .nav-next {
          background-color: #d81b60;
        }

        .nav-next:hover {
          background-color: #c2185b;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-title {
            font-size: 40px;
          }

          .card-title {
            font-size: 20px;
          }
        }

        @media (max-width: 992px) {
          .layout-wrapper {
            flex-direction: column;
            min-height: auto;
          }

          .left-section {
            width: 100%;
            padding: 60px 40px;
            box-shadow: none;
          }

          .main-title {
            font-size: 36px;
          }

          .right-section {
            width: 100%;
            padding: 40px 20px;
            margin-left: 0;
            margin-top: -30px;
            z-index: 1;
          }

          .cards-container {
            gap: 20px;
          }

          .card {
            flex: 0 0 calc(50% - 10px);
          }

          .card:nth-child(3) {
            display: none;
          }

          .navigation-buttons {
            bottom: 20px;
            right: 20px;
          }
        }

        @media (max-width: 768px) {
          .left-section {
            padding: 40px 30px;
          }

          .main-title {
            font-size: 28px;
          }

          .right-section {
            padding: 30px 15px;
          }

          .cards-container {
            gap: 15px;
          }

          .card {
            flex: 0 0 100%;
          }

          .card:nth-child(2),
          .card:nth-child(3) {
            display: none;
          }

          .card-image {
            height: 180px;
          }

          .card-content {
            padding: 15px;
          }

          .card-title {
            font-size: 20px;
          }

          .card-description {
            font-size: 13px;
          }

          .navigation-buttons {
            bottom: 15px;
            right: 15px;
          }

          .nav-button {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .left-section {
            padding: 30px 20px;
          }

          .main-title {
            font-size: 24px;
          }

          .right-section {
            padding: 20px 10px;
          }

          .card-image {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default DestinationWeddingLayout;