import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl, handleImageError } from "../../../utils/imageUtils";
import { FiEdit2 } from "react-icons/fi";

const EinviteCardItem = ({
  card,
  showActions = true,
  onCardClickEdit = false,
  fixedImageHeight,
}) => { 
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleCustomize = () => {
    navigate(`/einvites/editor/${card.id}`);
  };

  const handlePreview = () => {
    navigate(`/einvites/preview/${card.id}`);
  };

  const handleWholeCardClick = () => {
    if (onCardClickEdit) {
      handleCustomize();
    }
  };

  return (
    <div
      className="einvite-card-wrapper"
      onClick={handleWholeCardClick}
      style={{ cursor: onCardClickEdit ? "pointer" : "default" }}
    >
      <div
        className="position-relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="einvite-image-container position-relative overflow-hidden"
          style={{
            height: fixedImageHeight || "400px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={getImageUrl(
              card.thumbnailUrl ||
                card.thumbnail_url ||
                card.backgroundUrl ||
                card.background_url
            )}
            alt={card.name}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            onError={(e) =>
              handleImageError(
                e,
                card.thumbnailUrl ||
                  card.thumbnail_url ||
                  card.backgroundUrl ||
                  card.background_url
              )
            }
          />
          {/* Overlay text fields on the card */}
          {/* {card.editableFields && card.editableFields.length > 0 && (
            <>
              {card.editableFields
                .filter(
                  (field) => field.defaultText && field.defaultText.trim()
                )
                .map((field) => (
                  <div
                    key={field.id}
                    className="position-absolute"
                    style={{
                      left: `${(field.x / 414) * 100}%`,
                      top: `${(field.y / 659.288) * 100}%`,
                      color: field.color || "#000000",
                      fontFamily: field.fontFamily || "Arial",
                      fontSize: `${Math.max(
                        8,
                        (field.fontSize / 414) * (fixedImageHeight || 400)
                      )}px`,
                      fontWeight: "normal",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      zIndex: 5,
                    }}
                  >
                    {field.defaultText}
                  </div>
                ))}
            </>
          )} */}

          {isHovered && (
            <div
              className="position-absolute"
              style={{
                top: "12px",
                right: "12px",
                zIndex: 10,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCustomize();
                }}
                className="btn btn-light d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  padding: 0,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  border: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <FiEdit2 size={18} />
              </button>
            </div>
          )}

          {card.cardType === "video_invite" && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <div
                className="bg-white d-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  opacity: 0.9,
                }}
              >
                <i
                  className="fas fa-play"
                  style={{ fontSize: "24px", color: "#000", marginLeft: "4px" }}
                ></i>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3">
          <h6
            className="mb-2 fw-semibold"
            style={{ fontSize: "18px", color: "#333" }}
          >
            {card.name}
          </h6>

          <div className="d-flex align-items-center gap-3 mb-2">
            {card.rating && (
              <div className="d-flex align-items-center">
                <i
                  className="fas fa-star me-1"
                  style={{ color: "#FFA500", fontSize: "14px" }}
                ></i>
                <span style={{ fontSize: "14px", color: "#666" }}>
                  {card.rating}
                </span>
              </div>
            )}
            {card.cardType === "video_invite" && card.duration && (
              <span style={{ fontSize: "14px", color: "#666" }}>
                {card.duration}
              </span>
            )}
          </div>

          {(card.theme || card.culture) && (
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {card.theme && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    fontSize: "12px",
                    fontWeight: "normal",
                    padding: "4px 12px",
                  }}
                >
                  {card.theme}
                </span>
              )}
              {card.culture && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    fontSize: "12px",
                    fontWeight: "normal",
                    padding: "4px 12px",
                  }}
                >
                  {card.culture}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EinviteCardItem;
