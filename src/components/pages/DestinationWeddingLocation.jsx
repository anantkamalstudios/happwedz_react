import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DestinationWedding() {
  const navigate = useNavigate();
  const destinations = [
    {
      id: 1,
      name: "Goa",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop",
      description:
        "Goa is extremely popular for destination weddings, and it's really not rocket science to guess why! If you have been dreaming of a beach wedding ever since you were a kid, then this is where you have to be!",
      cost: "Rs. 30 Lakh to 50 lakh",
      type: "Beach Weddings, Intimate weddings",
      tags: ["Intimate weddings", "Beach Weddings"],
      buttonColor: "#333",
    },
    {
      id: 2,
      name: "Jaipur",
      image:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop",
      description:
        "With that royal old-world charm and breathtaking palace backdrops, it isn't surprising that Jaipur is one of the most sought-after destination wedding venues! If you have always dreamt of a fairytale-like wedding, this is where magic can truly happen!",
      cost: "Rs. 30 Lakh to 70 lakh for a guest list of about 150 people",
      season: "November - February",
      tags: ["Intimate weddings", "Palace Weddings"],
      buttonColor: "#e91e63",
    },
    {
      id: 3,
      name: "Udaipur",
      image:
        "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop",
      description:
        "Known as the City of Lakes, Udaipur offers stunning palace venues and romantic lakeside settings perfect for your dream destination wedding.",
      cost: "Rs. 40 Lakh to 80 lakh",
      type: "Palace Weddings, Luxury weddings",
      tags: ["Palace weddings", "Luxury Weddings"],
      buttonColor: "#333",
    },
    {
      id: 4,
      name: "Kerala",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
      description:
        "Experience the serenity of backwaters and lush greenery. Kerala provides a peaceful and scenic backdrop for intimate wedding celebrations.",
      cost: "Rs. 25 Lakh to 60 lakh",
      season: "October - March",
      tags: ["Backwater weddings", "Nature Weddings"],
      buttonColor: "#e91e63",
    },
    {
      id: 5,
      name: "Kerala",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
      description:
        "Experience the serenity of backwaters and lush greenery. Kerala provides a peaceful and scenic backdrop for intimate wedding celebrations.",
      cost: "Rs. 25 Lakh to 60 lakh",
      season: "October - March",
      tags: ["Backwater weddings", "Nature Weddings"],
      buttonColor: "#e91e63",
    },
    {
      id: 6,
      name: "Kerala",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
      description:
        "Experience the serenity of backwaters and lush greenery. Kerala provides a peaceful and scenic backdrop for intimate wedding celebrations.",
      cost: "Rs. 25 Lakh to 60 lakh",
      season: "October - March",
      tags: ["Backwater weddings", "Nature Weddings"],
      buttonColor: "#e91e63",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "50px 20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            Which Are The Best Destination Wedding Locations In India?
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#ddd",
                maxWidth: "300px",
              }}
            ></div>
            <div style={{ width: "50px", height: "50px" }}>
              <svg
                viewBox="0 0 100 100"
                style={{ width: "100%", height: "100%" }}
              >
                <polygon
                  points="50,10 60,40 90,40 67,57 75,87 50,70 25,87 33,57 10,40 40,40"
                  fill="#ffc0cb"
                  opacity="0.5"
                />
              </svg>
            </div>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "#ddd",
                maxWidth: "300px",
              }}
            ></div>
          </div>

          <p
            style={{
              fontSize: "15px",
              color: "#666",
              lineHeight: "1.7",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            Destination weddings are the new big trend to happen to Indian
            weddings. Well, what's better than a wedding and a vacation together
            with all your friends and family spent soaking in the sun, and
            relaxing by the pool as you dance and eat and chill with your
            people? And the good news is - all this doesn't necessarily has to
            break your bank accounts!
          </p>
        </div>

        {/* Cards Grid */}
        <div>
          {/* First Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              borderBottom: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <DestinationCard
              destination={destinations[0]}
              navigate={navigate}
            />
            <div
              style={{
                width: "1px",
                backgroundColor: "#e0e0e0",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            ></div>
            <DestinationCard
              destination={destinations[1]}
              navigate={navigate}
            />
          </div>

          {/* Second Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              borderBottom: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <DestinationCard
              destination={destinations[2]}
              navigate={navigate}
            />
            <div
              style={{
                width: "1px",
                backgroundColor: "#e0e0e0",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            ></div>
            <DestinationCard
              destination={destinations[3]}
              navigate={navigate}
            />
          </div>
          {/* Third Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              borderBottom: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <DestinationCard
              destination={destinations[4]}
              navigate={navigate}
            />
            <div
              style={{
                width: "1px",
                backgroundColor: "#e0e0e0",
                marginTop: "40px",
                marginBottom: "40px",
              }}
            ></div>
            <DestinationCard
              destination={destinations[5]}
              navigate={navigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DestinationCard({ destination, navigate }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{ padding: "40px" }}>
      {/* Image */}
      <img
        src={destination.image}
        alt={destination.name}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "4px",
          marginBottom: "25px",
        }}
      />

      {/* Title */}
      <h2
        style={{
          fontSize: "26px",
          fontWeight: "600",
          color: "#333",
          marginBottom: "15px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {destination.name}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: "14px",
          color: "#000",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        {destination.description}
      </p>

      {/* Bullet Points */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              color: "#e91e63",
              marginRight: "10px",
              fontSize: "20px",
              lineHeight: "1.4",
            }}
          >
            •
          </span>
          <span style={{ fontSize: "13px", color: "#000", lineHeight: "1.5" }}>
            Average cost of destination weddings in {destination.name} is:{" "}
            {destination.cost}
          </span>
        </div>

        {destination.type && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "#e91e63",
                marginRight: "10px",
                fontSize: "20px",
                lineHeight: "1.4",
              }}
            >
              •
            </span>
            <span
              style={{ fontSize: "13px", color: "#000", lineHeight: "1.5" }}
            >
              {destination.type}
            </span>
          </div>
        )}

        {destination.season && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "#e91e63",
                marginRight: "10px",
                fontSize: "20px",
                lineHeight: "1.4",
              }}
            >
              •
            </span>
            <span
              style={{ fontSize: "13px", color: "#000", lineHeight: "1.5" }}
            >
              Best season: {destination.season}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {destination.tags.map((tag, index) => (
          <span
            key={index}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "3px",
              fontSize: "12px",
              color: "#777",
              border: "1px solid #e8e8e8",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: "12px 32px",
          border: `2px solid ${destination.buttonColor}`,
          backgroundColor: isHovered ? destination.buttonColor : "transparent",
          color: isHovered ? "#fff" : destination.buttonColor,
          borderRadius: "30px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onClick={() => { 
          navigate(`/destination-wedding/${destination.name.toLowerCase()}`);
        }}
      >
        See Details
      </button>
    </div>
  );
}
