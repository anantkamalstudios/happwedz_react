import React, { useState } from "react";
import { Link } from "react-router-dom";

const MasonryImageSection = () => {
  const [images] = useState([
    {
      id: 1,
      url: "https://img.freepik.com/premium-photo/bride-groom-standing-front-chandelier_1113980-2347.jpg?w=1060",
      title: "Wedding Cake",
      category: "Catering",
      height: 280,
    },
    {
      id: 2,
      url: "https://img.freepik.com/premium-photo/photo-traditional-indian-wedding-ceremony_1325814-2854.jpg",
      title: "Elegant Wedding Venue",
      category: "Venues",
      height: 360,
    },
    {
      id: 3,
      url: "https://img.freepik.com/premium-photo/bride-groom-pink-gold-wedding-dress_1120246-25950.jpg?w=1060",
      title: "Wedding Photography",
      category: "Photography",
      height: 220,
    },
    {
      id: 4,
      url: "https://img.freepik.com/free-photo/beautiful-woman-long-red-dress-walks-around-city-with-her-husband_1157-13373.jpg?w=1060",
      title: "Bridal Makeup",
      category: "Makeup",
      height: 340,
    },
    {
      id: 5,
      url: "https://img.freepik.com/premium-photo/indian-bride-traditional-red-sari-with-golden-jewelry_143921-233.jpg",
      title: "Wedding Rings",
      category: "Jewelry",
      height: 300,
    },
    {
      id: 6,
      url: "https://img.freepik.com/premium-photo/photo-traditional-indian-wedding-ceremony_1325814-2854.jpg",
      title: "Elegant Wedding Venue",
      category: "Venues",
      height: 360,
    },
  ]);

  const weddingImages = [
    {
      id: 1,
      src: "https://img.freepik.com/premium-photo/bride-groom-standing-front-chandelier_1113980-2347.jpg?w=1060",
      title: "Elegant Wedding Venue",
      size: "large",
    },
    {
      id: 2,
      src: "https://img.freepik.com/premium-photo/photo-traditional-indian-wedding-ceremony_1325814-2854.jpg",
      title: "Wedding",
      size: "medium",
    },
    {
      id: 3,
      src: "https://img.freepik.com/premium-photo/bride-groom-pink-gold-wedding-dress_1120246-25950.jpg?w=1060",
      title: "Wedding",
      size: "large",
    },
    {
      id: 4,
      src: "https://img.freepik.com/free-photo/beautiful-woman-long-red-dress-walks-around-city-with-her-husband_1157-13373.jpg?w=1060",
      title: "Wedding",
      size: "medium",
    },
    {
      id: 5,
      src: "https://img.freepik.com/premium-photo/indian-bride-fotographiya_1108565-38.jpg?w=1060",
      title: "Wedding",
      size: "large",
    },
    {
      id: 6,
      src: "https://img.freepik.com/premium-photo/photo-traditional-indian-wedding-ceremony_1325814-2854.jpg",
      title: "Wedding",
      size: "medium",
    },
  ];
  return (
    <div style={{ padding: "40px 20px" }}>
      <div className="container">
        <div className="text-center mb-1">
          <img
            src="/images/home/weddinggalleryflower.png"
            alt="inspiredTeaser"
            className="w-20 h-20"
          />
          <h2 className="blogs-carousel-heading fw-bold mb-4 display-5 primary-text">
            Wedding Gallery
          </h2>
          <p className="fs-26 mb-3" data-aos="fade-up" data-aos-delay="50">
            Get inspired by our collection of beautiful wedding moments
          </p>
        </div>

        <div className="gallery-container">
          <Link to="/photography" className="see-more-link">
            SEE MORE
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className={`gallery-item ${weddingImages[0].size}`}>
                <img src={weddingImages[0].src} alt={weddingImages[0].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[0].title}</p>
                </div>
              </div>

              <div className={`gallery-item ${weddingImages[3].size}`}>
                <img src={weddingImages[3].src} alt={weddingImages[3].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[3].title}</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className={`gallery-item ${weddingImages[1].size}`}>
                <img src={weddingImages[1].src} alt={weddingImages[1].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[1].title}</p>
                </div>
              </div>

              <div className={`gallery-item ${weddingImages[4].size}`}>
                <img src={weddingImages[4].src} alt={weddingImages[4].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[4].title}</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className={`gallery-item ${weddingImages[2].size}`}>
                <img src={weddingImages[2].src} alt={weddingImages[2].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[2].title}</p>
                </div>
              </div>

              <div className={`gallery-item ${weddingImages[5].size}`}>
                <img src={weddingImages[5].src} alt={weddingImages[5].title} />
                <div className="gallery-overlay">
                  <p className="gallery-title">{weddingImages[5].title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasonryImageSection;
