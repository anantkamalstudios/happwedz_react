import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function BlogSection() {
  const navigate = useNavigate();
  const featuredBlog = {
    id: 1,
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1761405378292-30f64ad6f60b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
    ],
    title: "From Nani-Ghar Vibes To Y2K Parties, Nostalgia Is The Cool N...",
    description:
      "Who knew growing up would mean throwing parties that celebrate... well, growing up? From 90s Bollywood sangeets to college-themed cocktail nights and mehendis straight out of your ...",
    date: "24 Oct, 2025",
  };

  const blogs = [
    {
      id: 2,
      images: [
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
      ],
      title: "A Deeply Personalised Mumbai Wedding Tha...",
      description:
        "When a modern swipe turns into a forever kind of love, you just know the weddings going to be something else! Set agains...",
      date: "24 Oct, 2025",
      buttonColor: "#333",
    },
    {
      id: 3,
      images: [
        "https://images.unsplash.com/photo-1519167758481-83f29da8c471?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400&h=300&fit=crop",
      ],
      title: "12 Best Banquet Halls in Delhi: Unique, ...",
      description:
        "Planning a wedding in the heart of India's capital? Delhi offers an incredible array of banquet halls that blend grandeu...",
      date: "23 Oct, 2025",
      buttonColor: "#e91e63",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "60px 20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#4a4a4a",
              marginBottom: "30px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Browse Through Our Blog For Some More Destination Wedding Ideas!
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
              fontSize: "15px",
              color: "#666",
              lineHeight: "1.7",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            Need help organizing the wedding of your dreams? Read latest stories
            about all that's trending and new!
          </p>
        </div>

        <div style={{ marginBottom: "40px" }}>
          <FeaturedBlogCard blog={featuredBlog} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 450px))",
            gap: "100px",
            justifyContent: "center",
            alignContent: "center",
            margin: "0 auto 60px",
            width: "100%",
            maxWidth: "1400px",
            padding: "0 20px",
          }}
        >
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {/* CTA Section */}
        <div
          style={{
            textAlign: "center",
            padding: "50px 20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "#4a4a4a",
              marginBottom: "30px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Planning A Destination Wedding?
          </h2>

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

          <button
            style={{
              padding: "18px 50px",
              border: "none",
              backgroundColor: "#e91e63",
              color: "#fff",
              borderRadius: "50px",
              fontSize: "18px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(233, 30, 99, 0.3)",
            }}
            onClick={() => navigate("/vendors")}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#d81b60";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(233, 30, 99, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#e91e63";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(233, 30, 99, 0.3)";
            }}
          >
            Find vendors in your wedding city
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedBlogCard({ blog }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "stretch",
        maxWidth: "1000px",
        margin: "60px auto",
      }}
    >
      {/* Images Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          width: "55%",
          minHeight: "320px",
        }}
      >
        {blog.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Blog image ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <div
        style={{
          width: "45%",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "120%",
            height: "80%",
            background: "#fff",
            position: "absolute",
            right: "0%",
            top: "50%",
            transform: "translateY(-50%)",
            borderRadius: "12px",
            zIndex: 10,
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#333",
              lineHeight: "1.4",
              marginBottom: "10px",
            }}
          >
            {blog.title}
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6",
              marginBottom: "15px",
            }}
          >
            {blog.description}
          </p>

          <p
            style={{
              fontSize: "13px",
              color: "#999",
              marginBottom: "20px",
            }}
          >
            {blog.date}
          </p>

          <button
            style={{
              padding: "10px 28px",
              border: "2px solid #333",
              backgroundColor: "transparent",
              color: "#333",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              alignSelf: "flex-start",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#333";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#333";
            }}
          >
            Read Blog
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${blog.images.length}, 1fr)`,
          height: "250px",
        }}
      >
        {blog.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Blog image ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      <div style={{ padding: "25px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "12px",
            fontFamily: "Arial, sans-serif",
            lineHeight: "1.4",
          }}
        >
          {blog.title}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            lineHeight: "1.6",
            marginBottom: "12px",
          }}
        >
          {blog.description}
        </p>

        <p
          style={{
            fontSize: "13px",
            color: "#999",
            marginBottom: "18px",
          }}
        >
          {blog.date}
        </p>

        <button
          style={{
            padding: "10px 28px",
            border: `2px solid ${blog.buttonColor}`,
            backgroundColor: "transparent",
            color: blog.buttonColor,
            borderRadius: "30px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = blog.buttonColor;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = blog.buttonColor;
          }}
        >
          Read Blog
        </button>
      </div>
    </div>
  );
}
