import { useState } from "react";

export default function DestinationWeddingRealStories() {
  const stories = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      title: "Corey and Saurabh (Goa)",
      description:
        "A Cross-Cultural Goa Wedding That Was Equal Parts Dreamy, Desi & Drop-Dead Gorgeous!",
      buttonColor: "#333",
      buttonTextColor: "#333",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=400&fit=crop",
      title: "Debosmita and Sumeet (Visakhapatnam (Vizag))",
      description:
        "A Bengali Beach Wedding In Vizag That's Pure Coastal Core & WMG Genie Goals!",
      buttonColor: "#e91e63",
      buttonTextColor: "#e91e63",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=400&fit=crop",
      title: "Sonal and Robin (Goa)",
      description:
        "A Whimsical Goa Wedding Which Just Set a New Benchmark for Personalisation!",
      buttonColor: "#333",
      buttonTextColor: "#333",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "60px 20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "600",
              color: "#4a4a4a",
              marginBottom: "30px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Real People : Real Stories
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#ccc",
                maxWidth: "400px",
              }}
            ></div>
            <div style={{ width: "50px", height: "50px" }}>
              <svg
                viewBox="0 0 100 100"
                style={{ width: "100%", height: "100%" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#e91e63"
                  strokeWidth="2"
                />
                <circle cx="35" cy="45" r="8" fill="#e91e63" />
                <circle cx="65" cy="45" r="8" fill="#e91e63" />
                <path
                  d="M 30 60 Q 50 75 70 60"
                  fill="none"
                  stroke="#e91e63"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#ccc",
                maxWidth: "400px",
              }}
            ></div>
          </div>

          <p
            style={{
              fontSize: "16px",
              color: "#666",
              lineHeight: "1.7",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            Looking for some more ideas and inspiration? Take a look how these
            couples organized their destination weddings!
          </p>
        </div>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "30px",
            justifyContent: "center",
          }}
        >
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        height: "550px",
        transition: "transform 0.3s ease",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "8px",
        }}
      >
        <img
          src={story.image}
          alt={story.title}
          style={{
            width: "100%",
            height: "70%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>

      {/* Content Card - Overlapping */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          right: "20px",
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
          height: "40%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "12px",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.3",
          }}
        >
          {story.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "20px",
          }}
        >
          {story.description}
        </p>

        {/* Button */}
        <button
          style={{
            padding: "10px 28px",
            border: `2px solid ${story.buttonColor}`,
            backgroundColor: "transparent",
            color: story.buttonTextColor,
            borderRadius: "30px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "inline-block",
            width: "fit-content",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = story.buttonColor;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = story.buttonTextColor;
          }}
        >
          View Wedding
        </button>
      </div>
    </div>
  );
}
