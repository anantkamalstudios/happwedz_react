import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EinvitePage from "./design/EinvitePage";
import { cardPath, getCardPages } from "./design/einviteDesign";
import "./einviteStudio.css";

// Catalogue tile. Cards from the old editor are always drawn live because their
// stored thumbnails were canvas snapshots that are often cropped or missing; a
// thumbnail uploaded for a current design is used unless it fails to load.
const EinviteTemplateTile = ({ card }) => {
  const pages = useMemo(() => getCardPages(card), [card]);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const useThumbnail = Boolean(card.thumbnailUrl) && Number(card.designVersion) >= 2 && !thumbnailFailed;

  return (
    <Link to={cardPath(card)} className="eiv-tile">
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
        {pages.length > 1 && <span className="eiv-tile-badge">{pages.length} pages</span>}
      </div>
      <div className="eiv-tile-name">{card.name}</div>
    </Link>
  );
};

export default EinviteTemplateTile;
