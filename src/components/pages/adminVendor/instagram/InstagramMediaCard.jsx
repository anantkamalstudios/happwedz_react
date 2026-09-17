import React from "react";
import {
  FiCalendar,
  FiExternalLink,
  FiHeart,
  FiImage,
  FiMessageCircle,
} from "react-icons/fi";
import { FaClone, FaInstagram, FaPlay } from "react-icons/fa6";

const HASHTAG = /#[\p{L}\p{N}_]+/gu;

export const formatMediaDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const formatCount = (n) => n.toLocaleString("en-IN");

const TYPE_ICONS = {
  VIDEO: { Icon: FaPlay, label: "Video" },
  CAROUSEL_ALBUM: { Icon: FaClone, label: "Carousel" },
};

export default function InstagramMediaCard({ item, portrait = false, showCaption = true, note }) {
  const { Icon: TypeIcon, label: typeLabel } = TYPE_ICONS[item.type] || {
    Icon: FiImage,
    label: "Photo",
  };
  const tags = showCaption
    ? [...new Set((item.caption.match(HASHTAG) || []).map((t) => t.toUpperCase()))].slice(0, 3)
    : [];
  const hasStats = item.likes !== null || item.comments !== null;

  return (
    <a
      href={item.permalink || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="igd-card"
    >
      <div className={`igd-card-media ${portrait ? "is-portrait" : ""}`}>
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" referrerPolicy="no-referrer" />
        ) : (
          <span className="igd-card-missing">
            <FaInstagram size={32} />
          </span>
        )}
        <span className="igd-card-type" title={typeLabel} aria-label={typeLabel}>
          <TypeIcon size={14} />
        </span>
        <div className="igd-card-overlay">
          <span className="igd-card-date">
            <FiCalendar size={14} /> {formatMediaDate(item.timestamp)}
          </span>
          <span className="igd-card-open" aria-hidden="true">
            <FiExternalLink size={15} />
          </span>
        </div>
      </div>

      {(showCaption || note || hasStats) && (
        <div className="igd-card-body">
          {showCaption && (
            <p className={`igd-card-caption ${item.caption ? "" : "is-empty"}`}>
              {item.caption || "No caption"}
            </p>
          )}
          {tags.length > 0 && (
            <div className="igd-tags">
              {tags.map((tag) => (
                <span key={tag} className="igd-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {note}
          {hasStats && (
            <div className="igd-card-stats">
              {item.likes !== null && (
                <span>
                  <FiHeart size={15} /> {formatCount(item.likes)}
                </span>
              )}
              {item.comments !== null && (
                <span>
                  <FiMessageCircle size={15} /> {formatCount(item.comments)}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </a>
  );
}
