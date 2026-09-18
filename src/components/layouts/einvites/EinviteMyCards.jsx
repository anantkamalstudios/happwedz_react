import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FiEdit2, FiSend, FiTrash2 } from "react-icons/fi";
import { einviteApi } from "../../../services/api/einviteApi";
import EinvitePage from "./design/EinvitePage";
import { cardFonts, cardSetSummary, getCardPages, isVideoCard, loadFonts } from "./design/einviteDesign";
import { formatDate } from "./share/shareUtils";
import "./einviteStudio.css";

const MyCardTile = ({ card, onDelete }) => {
  const pages = getCardPages(card);
  const isVideo = isVideoCard(card);
  const summary = isVideo ? "10-second video" : pages.length > 1 ? cardSetSummary(pages) : "";

  return (
    <div className="eiv-my-card">
      <Link to={`/einvites/editor/${card.id}`} className="eiv-my-card-media" aria-label={`Edit ${card.name}`}>
        <EinvitePage page={pages[0]} style={{ background: "#fff" }} />
        {isVideo ? (
          <span className="eiv-tile-badge is-video">{"▶︎"} Video</span>
        ) : (
          pages.length > 1 && <span className="eiv-tile-badge">{pages.length} cards</span>
        )}
      </Link>
      <div className="eiv-tile-name">{card.name}</div>
      <div className="eiv-tile-events">
        {summary || `${pages.length} ${pages.length === 1 ? "card" : "cards"}`}
        {card.updated_at && ` · ${formatDate(card.updated_at)}`}
      </div>
      <div className="d-flex flex-wrap gap-2 mt-2">
        <Link to={`/einvites/share/${card.id}`} className="eiv-chip-btn is-primary">
          <FiSend size={15} /> Share &amp; RSVP
        </Link>
        <Link to={`/einvites/editor/${card.id}`} className="eiv-chip-btn">
          <FiEdit2 size={15} /> Edit
        </Link>
        <button type="button" className="eiv-chip-btn is-danger" aria-label={`Delete ${card.name}`} onClick={() => onDelete(card)}>
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
};

// The logged-in couple's own invitations.
const EinviteMyCards = () => {
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.id || authUser?._id || authUser?.userId;

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await einviteApi.getUserEinvites(currentUserId);
      const list = Array.isArray(result?.data) ? result.data : [];
      setCards(list);
      loadFonts(list.flatMap((card) => cardFonts(getCardPages(card).slice(0, 1))));
    } catch (err) {
      console.error("Error fetching user cards:", err);
      setError("Failed to load your cards");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteCard = async (card) => {
    const { isConfirmed } = await Swal.fire({
      text: `Delete "${card.name}"? Its share links will stop working and its RSVPs will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ed1173",
    });
    if (!isConfirmed) return;
    try {
      await einviteApi.deleteInstance(card.id);
      setCards((prev) => prev.filter((item) => item.id !== card.id));
    } catch (err) {
      Swal.fire({ text: err.message || "Failed to delete the card", icon: "error" });
    }
  };

  return (
    <div className="eiv">
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h1 className="eiv-title mb-1">Your Cards</h1>
            <p className="eiv-status mb-0">Edit your invitations, share them with guests and track RSVPs.</p>
          </div>
          <Link to="/einvites/category/wedding_einvite" className="eiv-outline-btn">Browse designs</Link>
        </div>

        {loading ? (
          <div className="eiv-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="eiv-skeleton" />
            ))}
          </div>
        ) : error ? (
          <div className="eiv-empty">
            <h3>{error}</h3>
            <button type="button" className="eiv-outline-btn" onClick={load}>Try again</button>
          </div>
        ) : cards.length === 0 ? (
          <div className="eiv-empty">
            <h3>No cards yet</h3>
            <p>Pick a design, add your names and dates, and it will be saved here.</p>
            <Link to="/einvites/category/wedding_einvite" className="eiv-outline-btn">Browse designs</Link>
          </div>
        ) : (
          <div className="eiv-grid">
            {cards.map((card) => (
              <MyCardTile key={card.id} card={card} onDelete={deleteCard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EinviteMyCards;
