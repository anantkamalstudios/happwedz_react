import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../redux/favoriteSlice";
import { IoClose } from "react-icons/io5";

export default function FavouriteListPopup({ setShowPopup }) {
  const dispatch = useDispatch();
  const favorites = useSelector((store) => store.favorites?.favorites) || [];
  const [showEmailPopUp, setShowEmailPopUp] = useState(false);
  const[email, setEmail] = useState("");

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative",
      }}
    >
      <div
        style={{
          // background: "#fff",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}

        <div
          style={{
            background: "linear-gradient(135deg, #d91e6e 0%, #c91963 100%)",
            color: "white",
            padding: "20px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "600",
          }}
        >
          Favourite List
        </div>
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "absolute",
            top: 8,
            right: 10,
          }}
        >
          <IoClose color="#fff" size={30} />
        </div>

        {/* Content */}
        <div
          style={{
            padding: "20px",
            maxHeight: "450px",
            overflowY: "auto",
          }}
        >
          {favorites.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                padding: "40px 20px",
                fontSize: "16px",
              }}
            >
              No favorites yet. Start adding products to your favorites!
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  background: "#f8b4d4",
                  borderRadius: "12px",
                  marginBottom: "15px",
                  padding: "10px",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Top-right cross button */}
                <button
                  onClick={() => {
                    dispatch(removeFavorite(item.id));
                  }}
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "24px",
                    height: "24px",
                    border: "none",
                    borderRadius: "50%",
                    background: "white",
                    color: "#d91e6e",
                    cursor: "pointer",
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  ×
                </button>

                {/* Product Image */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    marginRight: "15px",
                    background: "#ffd9ec",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.product_real_image}
                    alt="Product"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Right Side */}
                <div
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {/* Details */}
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#000",
                      fontWeight: "600",
                      marginBottom: "auto",
                    }}
                  >
                    {item.description}
                  </div>

                  {/* Bottom row: price left, button right */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#000",
                      }}
                    >
                      {item.price}
                    </div>

                    <button
                      style={{
                        background: "white",
                        color: "#d91e6e",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      View Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Email Send Button */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          <button
            onClick={() => setShowEmailPopUp(true)}
            className="btn w-100"
            style={{
              background: "linear-gradient(135deg, #d91e6e 0%, #c91963 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "15px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Email Send
          </button>
        </div>
      </div>
      {favorites.length > 0 &&showEmailPopUp && (
        <div
          onClick={() => setShowEmailPopUp(false)} // closes when clicking outside
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h3
              style={{ color: "#C31162", marginBottom: 8, textAlign: "center" }}
            >
              Enter your email
            </h3>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                border: "2px solid #f0f0f0b9",
                borderRadius: "10px",
                width: "100%",
                padding: "10px 12px",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <button
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#C31162",
                color: "#fff",
                fontWeight: 600,
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Send Email
            </button>
            <button
              onClick={() => setShowEmailPopUp(false)}
              style={{
                background: "transparent",
                color: "#999",
                border: "none",
                fontSize: "0.9rem",
                marginTop: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
