import { useState } from "react";

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      alt: "Mountain landscape",
    },
    {
      url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&h=600&fit=crop",
      alt: "Ocean waves",
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
      alt: "Forest path",
    },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>
        {/* Image Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "450px",
            backgroundColor: "#000",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Left Arrow Button */}
          <button
            onClick={goToPrevious}
            style={{
              position: "absolute",
              left: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={goToNext}
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              transition: "all 0.3s ease",
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        {/* Indicator Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: index === currentIndex ? "32px" : "12px",
                height: "12px",
                borderRadius: index === currentIndex ? "6px" : "50%",
                backgroundColor: index === currentIndex ? "#0d6efd" : "#6c757d",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = "#495057";
                }
              }}
              onMouseOut={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.backgroundColor = "#6c757d";
                }
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Image Counter */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#6c757d",
            fontSize: "14px",
          }}
        >
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
