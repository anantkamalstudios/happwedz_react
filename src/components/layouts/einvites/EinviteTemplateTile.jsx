import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import EinvitePage from "./design/EinvitePage";
import EinviteVideoPlayer from "./design/EinviteVideoPlayer";
import { cardPath, cardSetSummary, getCardPages, isVideoCard } from "./design/einviteDesign";
import "./einviteStudio.css";

const rupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const duration = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

// Catalogue tile. Cards from the old editor are always drawn live because their
// stored thumbnails were canvas snapshots that are often cropped or missing; a
// thumbnail uploaded for a current design is used unless it fails to load.
const EinviteTemplateTile = ({ card }) => {
  const pages = useMemo(() => getCardPages(card), [card]);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const isVideo = isVideoCard(card);
  const useThumbnail = Boolean(card.thumbnailUrl) && Number(card.designVersion) >= 2 && !thumbnailFailed;

  // Videos play silently while the pointer rests on them (not on touch screens).
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef(null);
  const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover)").matches;
  const startPreview = () => {
    if (!isVideo || !canHover) return;
    hoverTimer.current = setTimeout(() => setHovering(true), 250);
  };
  const stopPreview = () => {
    clearTimeout(hoverTimer.current);
    setHovering(false);
  };

  return (
    <Link to={cardPath(card)} className="eiv-tile" onMouseEnter={startPreview} onMouseLeave={stopPreview}>
      <div className="eiv-tile-media">
        {useThumbnail ? (
          <img
            src={card.thumbnailUrl}
            alt={card.name}
            loading="lazy"
            onError={() => setThumbnailFailed(true)}
          />
        ) : (
          <EinvitePage page={pages[0]} style={{ background: "#fff" }} />
        )}
        {hovering && (
          <div className="eiv-tile-preview">
            <EinviteVideoPlayer video={card.video} pages={pages} showControls={false} style={{ cursor: "inherit" }} />
          </div>
        )}
        {isVideo ? (
          <span className="eiv-tile-badge is-video">
            {"▶︎"} {duration(card.video?.duration || 10)}
          </span>
        ) : (
          pages.length > 1 && <span className="eiv-tile-badge">{pages.length} cards</span>
        )}
      </div>
      <div className="eiv-tile-name">{card.name}</div>
      {!isVideo && pages.length > 1 && cardSetSummary(pages) && (
        <div className="eiv-tile-events">{cardSetSummary(pages)}</div>
      )}
      {isVideo && (
        <div className="eiv-tile-price">
          {card.pricing?.isPaid ? (
            <>
              <strong>{rupees(card.pricing.price)}</strong>
              {card.pricing.mrp > card.pricing.price && <s>{rupees(card.pricing.mrp)}</s>}
            </>
          ) : (
            <strong className="eiv-free">FREE</strong>
          )}
        </div>
      )}
    </Link>
  );
};

export default EinviteTemplateTile;
