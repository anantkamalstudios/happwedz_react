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

  return (
    <div style={{ backgroundColor: "#f8f9fa", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontWeight: "bold",
              color: "#333",
              marginBottom: "12px",
              fontSize: "2.5rem",
            }}
          >
            Wedding Gallery
          </h2>
          <p
            style={{
              color: "#666",
              fontSize: "1.1rem",
              margin: "0",
            }}
          >
            Get inspired by our collection of beautiful wedding moments
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                height: `${image.height}px`,
              }}
              className="masonry-item"
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              <img
                src={image.url}
                alt={image.title}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300/f8f9fa/6c757d?text=Image+Not+Available";
                }}
              />

              <div
                className="image-overlay"
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  background:
                    "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
                  padding: "40px 16px 16px",
                  color: "white",
                  opacity: "0",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                <h6
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                    lineHeight: "1.3",
                  }}
                >
                  {image.title}
                </h6>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/photography" className="btn btn-primary btn-lg">
            View Full Gallery
          </Link>
        </div>
      </div>

      <style jsx>{`
        .masonry-item:hover .image-overlay {
          opacity: 1 !important;
        }

        .masonry-item {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MasonryImageSection;
