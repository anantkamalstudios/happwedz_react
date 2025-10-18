import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../redux/favoriteSlice";

export default function FavouriteListPopup() {
  const dispatch = useDispatch();
  const favorites = useSelector((store) => store.favorites?.favorites) || [];

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
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
    </div>
  );
}
