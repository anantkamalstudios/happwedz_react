import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { beautyApi } from "../../services/api";

const FinalLookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get all selected items from previous page
  const selectedImage = location.state?.selectedImage;
  const selectedProducts = location.state?.selectedProducts || {};
  const selectedDress = location.state?.selectedDress;
  const selectedLook = location.state?.selectedLook;
  const processedImageId = location.state?.processedImageId;
  const processedImageUrlFromState = location.state?.processedImageUrl;
  const [fetchedImageUrl, setFetchedImageUrl] = React.useState(null);
  const [isLoadingImage, setIsLoadingImage] = React.useState(false);

  React.useEffect(() => {
    if (processedImageUrlFromState) {
      setFetchedImageUrl(processedImageUrlFromState);
      return;
    }
    if (processedImageId) {
      const base = import.meta.env.VITE_API_BASE_URL || "/api";
      const url = `${base}/images/${processedImageId}`;
      setFetchedImageUrl(url);
    }
  }, [processedImageId, processedImageUrlFromState]);

  const profileImage =
    fetchedImageUrl ||
    selectedImage ||
    "https://i.pinimg.com/1200x/44/78/12/44781204ca8522a5c337224c9fdee36d.jpg";

  const colors = {
    primaryPink: "#ed1173",
    lightPink: "#fce4ec",
    mediumPink: "#f8bbd9",
    darkPink: "#ad1457",
    grey: "#62565bff",
    white: "#f8f4f6ff",
    accentPink: "#ff4081",
  };

  const handleTryAnother = () => {
    navigate(-1);
  };

  return (
    <div className="final-look-container">
      <div className="final-look-wrapper">
        <div className="final-look-header">
          <h1 className="final-look-title">Your Final Look!</h1>
          <p className="final-look-subtitle">
            Absolutely stunning with your selections
          </p>
        </div>

        <div className="final-look-content">
          <div className="final-image-container">
            <div className="final-image">
              <img
                src={profileImage}
                alt="Your final look"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    " width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23fce4ec'/%3E%3Ccircle cx='100' cy='100' r='30' fill='%23ed1173'/%3E%3Cpath d='M70 130 Q100 160 130 130' stroke='%23ed1173' strokeWidth='3' fill='none'/%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>

          <div className="applied-filters">
            <div className="applied-filters-title">Applied Filters</div>

            {Object.entries(selectedProducts).map(([type, product]) => {
              if (!product) return null;
              return (
                <div key={`${type}-${product.id}`} className="filter-item">
                  <div className="filter-type">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div className="filter-name">
                    {product.name}
                    {product.color && (
                      <span
                        className="filter-color"
                        style={{ backgroundColor: product.color }}
                      ></span>
                    )}
                  </div>
                </div>
              );
            })}

            {selectedDress && (
              <div className="filter-item">
                <div className="filter-type">Dress</div>
                <div className="filter-name">
                  {selectedDress.name}
                  <span
                    className="filter-color"
                    style={{ backgroundColor: selectedDress.color }}
                  ></span>
                </div>
              </div>
            )}

            {selectedLook && (
              <div className="filter-item">
                <div className="filter-type">Complete Look</div>
                <div className="filter-name">{selectedLook.name}</div>
                <div
                  className="filter-description"
                  style={{ fontSize: "0.85rem", color: colors.grey }}
                >
                  {selectedLook.description}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button className="try-another-button" onClick={handleTryAnother}>
            <i className="bi bi-arrow-left-circle me-2"></i>
            Try Another Look
          </button>
          <button className="share-button">
            <i className="bi bi-share me-2"></i>
            Share This Look
          </button>
        </div>
      </div>

      <style jsx>{`
        .final-look-container {
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            ${colors.white} 0%,
            ${colors.white} 100%
          );
          padding: 20px;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .final-look-wrapper {
          max-width: 1000px;
          width: 90%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(237, 17, 115, 0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px;
        }

        .final-look-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .final-look-title {
          color: ${colors.primaryPink};
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 8px;
        }

        .final-look-subtitle {
          color: ${colors.grey};
          font-size: 1.1rem;
        }

        .final-look-content {
          display: flex;
          width: 100%;
          gap: 25px;
          margin-bottom: 25px;
        }

        .final-image-container {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .final-image {
          width: 100%;
          /* max-width: 450px; */
          /* height: 380px; */
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(221, 122, 167, 0.2);
          border: 1px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f0f0;
        }

        .final-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .applied-filters {
          flex: 0.8;
          background: rgba(252, 228, 236, 0.3);
          border-radius: 15px;
          padding: 18px;
          border: 2px solid ${colors.mediumPink};
          overflow-y: auto;
        }

        .applied-filters-title {
          color: ${colors.darkPink};
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 15px;
          text-align: center;
          padding-bottom: 8px;
          border-bottom: 2px solid ${colors.lightPink};
        }

        .filter-item {
          background: white;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(237, 17, 115, 0.1);
        }

        .filter-type {
          color: ${colors.primaryPink};
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 1rem;
        }

        .filter-name {
          color: ${colors.darkPink};
          font-weight: 500;
          font-size: 0.9rem;
        }

        .filter-color {
          display: inline-block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          margin-left: 8px;
          vertical-align: middle;
          border: 2px solid #ddd;
        }

        .message-container {
          text-align: center;
          margin-bottom: 25px;
          padding: 18px;
          background: linear-gradient(
            45deg,
            ${colors.primaryPink},
            ${colors.accentPink}
          );
          border-radius: 12px;
          color: white;
          width: 100%;
        }

        .message-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .message-text {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          width: 100%;
          justify-content: center;
        }

        .try-another-button {
          background: ${colors.primaryPink};
          border: none;
          color: white;
          padding: 10px 25px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(237, 17, 115, 0.3);
        }

        .try-another-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(237, 17, 115, 0.4);
        }

        .share-button {
          background: white;
          border: 2px solid ${colors.primaryPink};
          color: ${colors.primaryPink};
          padding: 10px 25px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-button:hover {
          background: ${colors.lightPink};
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .final-look-content {
            flex-direction: column;
          }

          .final-image {
            max-width: 100%;
            height: 350px;
          }

          .applied-filters {
            max-height: none;
          }
        }

        @media (max-width: 600px) {
          .final-look-wrapper {
            padding: 20px;
            width: 95%;
          }

          .final-image {
            height: 300px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 10px;
          }

          .try-another-button,
          .share-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FinalLookPage;
