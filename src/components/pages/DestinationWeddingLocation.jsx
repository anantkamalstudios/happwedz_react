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
          alt: "Udaipur Wedding",
          title: "Udaipur",
          subtitle: "The Royal City of Lakes",
          description: "Known as the City of Lakes, Udaipur is one of India’s most luxurious wedding destinations. With royal palaces, grand heritage hotels, and scenic lakes, Udaipur offers a fairytale-like setting for couples who dream of a regal celebration.",
          bestSeason: "October to March",
          averageCost: "₹35 Lakhs – ₹60 Lakhs",
          weddingStyles: [
            "Royal Palace Weddings",
            "Luxury Heritage Weddings",
            "Lake View Weddings",
            "Traditional Rajasthani Weddings"
          ]
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1599059521744-8b898c628e9a?w=400&h=300&fit=crop",
          alt: "Jaipur Wedding",
          title: "Jaipur",
          subtitle: "The Royal Pink City",
          description: "Jaipur is known for its grand forts, colourful culture, and iconic palaces, making it one of India’s most preferred destinations for royal and heritage-style weddings. The city blends timeless Rajasthani traditions with luxurious hospitality.",
          bestSeason: "November to February",
          averageCost: "₹30 Lakhs – ₹55 Lakhs",
          weddingStyles: [
            "Heritage Weddings",
            "Fort Weddings",
            "Cultural Rajasthani Weddings",
            "Grand Traditional Ceremonies"
          ]
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=300&fit=crop",
          alt: "Goa Wedding",
          title: "Goa",
          subtitle: "India’s Beach Wedding Capital",
          description: "Goa is the ultimate choice for couples who dream of a relaxed, romantic, and picture-perfect beach wedding. With its golden sandy beaches, turquoise waters, swaying palm trees, and lively atmosphere, Goa creates a magical setting.",
          bestSeason: "November to February",
          averageCost: "₹30 Lakhs – ₹50 Lakhs",
          weddingStyles: [
            "Beach Weddings",
            "Sunset Weddings",
            "Intimate Weddings",
            "Tropical Theme Weddings",
            "Resort Poolside Ceremonies",
            "Boho & Minimalist Beach Celebrations"
          ]
        },
        {
          id: 4,
          url: "https://images.unsplash.com/photo-1605218427368-35b017402d7d?w=400&h=300&fit=crop",
          alt: "Kerala Wedding",
          title: "Kerala",
          subtitle: "God’s Own Country",
          description: "Kerala is a dream wedding location for couples who want a serene, nature-filled, and soulful celebration. The calm backwaters, lush coconut groves, misty tea plantations, and scenic beaches create a peaceful and romantic ambience.",
          bestSeason: "September to March",
          averageCost: "₹25 Lakhs – ₹45 Lakhs",
          weddingStyles: [
            "Backwater Weddings",
            "Nature-Themed Weddings",
            "Houseboat Ceremonies",
            "Simple Elegant South Indian Weddings",
            "Resort Garden Weddings"
          ]
        },
        {
          id: 5,
          url: "https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=400&h=300&fit=crop",
          alt: "Jodhpur Wedding",
          title: "Jodhpur",
          subtitle: "The Blue City",
          description: "Jodhpur is one of India’s most iconic wedding locations, known for its grand forts, deep blue houses, and breathtaking desert landscapes. The city’s majestic palaces and royal heritage create a regal atmosphere.",
          bestSeason: "October to March",
          averageCost: "₹30 Lakhs – ₹55 Lakhs",
          weddingStyles: [
            "Royal Palace Weddings",
            "Fort Weddings",
            "Desert Weddings",
            "Cultural Rajasthani Weddings",
            "Traditional Grand Ceremonies"
          ]
        },
        {
          id: 6,
          url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400&h=300&fit=crop",
          alt: "Andaman Wedding",
          title: "Andaman & Nicobar Islands",
          subtitle: "Island Paradise",
          description: "The Andaman & Nicobar Islands offer one of the most exotic and peaceful wedding experiences in India. With crystal-clear turquoise waters, soft white sand beaches, and lush tropical greenery, it creates a picture-perfect backdrop.",
          bestSeason: "November to April",
          averageCost: "₹20 Lakhs – ₹40 Lakhs",
          weddingStyles: [
            "Island Beach Weddings",
            "Intimate Seaside Ceremonies",
            "Minimalist Tropical Weddings",
            "Sunset Beach Mandap Weddings",
            "Private Resort Weddings"
          ]
        },
        {
          id: 7,
          url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop",
          alt: "Rishikesh Wedding",
          title: "Rishikesh & Mussoorie",
          subtitle: "Hilltop Serenity",
          description: "Rishikesh and Mussoorie are perfect for couples who want a soulful, peaceful, and nature-centric wedding. Rishikesh offers spiritual riverside settings, while Mussoorie provides stunning mountain views.",
          bestSeason: "March to June & September to November",
          averageCost: "₹15 Lakhs – ₹35 Lakhs",
          weddingStyles: [
            "Hilltop Weddings",
            "Riverside Ceremonies",
            "Spiritual and Traditional Weddings",
            "Nature-Themed Weddings",
            "Intimate Mountain Weddings"
          ]
        },
        {
          id: 8,
          url: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop",
          alt: "Agra Wedding",
          title: "Agra",
          subtitle: "City of the Taj Mahal",
          description: "Agra is synonymous with eternal love, thanks to the iconic Taj Mahal. This historic city offers a romantic and heritage-rich setting that adds a sense of grandeur and meaning to your big day.",
          bestSeason: "October to March",
          averageCost: "₹20 Lakhs – ₹40 Lakhs",
          weddingStyles: [
            "Heritage Weddings",
            "Luxury Hotel Weddings",
            "Mughal-Themed Weddings",
            "Romantic Ceremonies Inspired by the Taj Mahal"
          ]
        },
        {
          id: 9,
          url: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=400&h=300&fit=crop",
          alt: "Shimla Wedding",
          title: "Shimla & Manali",
          subtitle: "Snowy & Mountain View Weddings",
          description: "Shimla and Manali offer dreamy, cosy, and scenic wedding experiences. Pine forests, snow-capped peaks, cool weather, and charming hill resorts create a picture-perfect romantic setting.",
          bestSeason: "March to June & December to February",
          averageCost: "₹15 Lakhs – ₹30 Lakhs",
          weddingStyles: [
            "Snow Weddings",
            "Mountain Retreat Ceremonies",
            "Winter-Themed Weddings",
            "Intimate Nature Weddings"
          ]
        },
        {
          id: 10,
          url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
          alt: "Mumbai Wedding",
          title: "Mumbai, Alibaug & Lonavala",
          subtitle: "Modern Luxury & Convenience",
          description: "These locations combine luxury, accessibility, and stunning natural surroundings. Mumbai offers premium hotel venues, Alibaug delivers serene beaches, and Lonavala provides lush green hills.",
          bestSeason: "October to March",
          averageCost: "₹25 Lakhs – ₹50 Lakhs",
          weddingStyles: [
            "Luxury Resort Weddings",
            "Beachside Weddings",
            "Hill Retreat Weddings",
            "Modern Contemporary Celebrations",
            "Poolside Cocktail & Sangeet Events"
          ]
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
                    {image.subtitle && (
                      <h4 style={{ fontSize: '16px', color: '#d81b60', marginBottom: '10px', fontWeight: '600' }}>
                        {image.subtitle}
                      </h4>
                    )}
                    <p className="card-description">
                      {image.description}
                    </p>

                    <div style={{ marginBottom: '15px', fontSize: '14px' }}>
                      <p style={{ margin: '5px 0' }}><strong>Best Season:</strong> {image.bestSeason}</p>
                      <p style={{ margin: '5px 0' }}><strong>Average Cost:</strong> {image.averageCost}</p>
                      {image.weddingStyles && (
                        <div style={{ marginTop: '10px' }}>
                          <strong>Wedding Styles:</strong>
                          <ul style={{ paddingLeft: '20px', marginTop: '5px', color: '#666' }}>
                            {image.weddingStyles.map((style, i) => (
                              <li key={i}>{style}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

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
          z-index: 1;
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
          display: flex;
          flex-direction: column;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .card-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
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
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          color: #d81b60;
          font-size: 24px;
          font-weight: bold;
          margin: 0 0 5px 0;
          font-family: Georgia, serif;
        }

        .card-description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 15px 0;
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
          margin-top: auto;
          width: fit-content;
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