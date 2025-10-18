import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EinviteCardGrid from "./EinviteCardGrid";
import { einviteApi } from "../../../services/api/einviteApi";
import Swal from "sweetalert2";

const EinviteMyCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserCards();
  }, []);

  const fetchUserCards = async () => {
    try {
      setLoading(true);
      // For now, we'll use getAllEinvites since we don't have user-specific endpoint
      const data = await einviteApi.getAllEinvites();
      setCards(data);
    } catch (err) {
      setError("Failed to load your cards");
      console.error("Error fetching user cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        await einviteApi.deleteEinvite(cardId);
        setCards(cards.filter((card) => card.id !== cardId));
      } catch (err) {
        console.error("Error deleting card:", err);
        // alert('Failed to delete card');
        Swal.fire({
          text: "Failed to delete card",
          timer: 1500,
          icon: "error",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <EinviteCardGrid cards={[]} loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="einvite-my-cards">
      <div className="row mb-4 light-pink-bg p-4">
        <div className="col-12 container">
          <h2 className="einvite-page-title display-6 fw-medium primary-text mb-0">
            Published Cards
          </h2>
        </div>
      </div>
      <div className="container py-5">
        {cards.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-heart fa-4x text-muted mb-4"></i>
            <h4>No cards yet</h4>
            <p className="text-muted">
              Create your first e-invitation to get started
            </p>
            <Link className="btn btn-primary" to="/einvites">
              Browse Templates
            </Link>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="einvite-stats-card">
                  <div className="einvite-stats-number">{cards.length}</div>
                  <div className="einvite-stats-label">Total Cards</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="einvite-stats-card">
                  <div className="einvite-stats-number">
                    {cards.filter((card) => card.isActive).length}
                  </div>
                  <div className="einvite-stats-label">Published</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="einvite-stats-card">
                  <div className="einvite-stats-number">
                    {cards.filter((card) => !card.isActive).length}
                  </div>
                  <div className="einvite-stats-label">Drafts</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="einvite-stats-card">
                  <div className="einvite-stats-number">0</div>
                  <div className="einvite-stats-label">Views</div>
                </div>
              </div>
            </div>

            <EinviteCardGrid
              cards={cards}
              loading={false}
              showActions={true}
              onDelete={handleDeleteCard}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EinviteMyCards;
