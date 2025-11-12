import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import EinviteCardGrid from "../layouts/einvites/EinviteCardGrid";
import EinviteFilterBar from "../layouts/einvites/EinviteFilterBar";
import { einviteApi } from "../../services/api/einviteApi";
import { FaChevronLeft } from "react-icons/fa6";

const EinviteCategoryPage = () => {
  const { category } = useParams();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryCards();
  }, [category]);

  const fetchCategoryCards = async () => {
    try {
      setLoading(true);
      // category param is now the cardType (wedding_einvite, video, save_the_date)
      const data = await einviteApi.getEinvitesByCardType(category);
      setCards(data);
      setFilteredCards(data);
    } catch (err) {
      setError("Failed to load cards");
      console.error("Error fetching category cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredCards(cards);
      return;
    }

    const filtered = cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.culture?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  const handleFilterChange = ({ category: filterCategory, theme }) => {
    let filtered = cards;

    if (filterCategory !== "all") {
      filtered = filtered.filter((card) => card.cardType === filterCategory);
    }

    if (theme !== "all") {
      filtered = filtered.filter((card) => card.theme === theme);
    }

    setFilteredCards(filtered);
  };

  const getCategoryInfo = (categoryKey) => {
    const categoryMap = {
      wedding_einvite: {
        title: "Wedding E-Invitations",
        icon: "fas fa-heart",
        description: "Beautiful digital wedding invitation cards",
        color: "#ff6b9d",
      },
      video: {
        title: "Video Invitations",
        icon: "fas fa-video",
        description: "Dynamic video invitation templates",
        color: "#6366f1",
      },
      save_the_date: {
        title: "Save the Date",
        icon: "fas fa-calendar",
        description: "Save the date card templates",
        color: "#10b981",
      },
    };
    return (
      categoryMap[categoryKey] || {
        title: "E-Invitations",
        icon: "fas fa-envelope",
        description: "Beautiful invitation templates",
        color: "#6366f1",
      }
    );
  };

  const categoryInfo = getCategoryInfo(category);

  return (
    <div className="einvite-category-page">
      <div className="container py-5">
        <div className="row mb-4 align-items-center justify-content-between">
          {/* LEFT SIDE */}
          <div className="col-md-8 d-flex align-items-center flex-wrap">
            <Link
              to="/einvites"
              className="col-md-1 btn btn-light border d-flex align-items-center justify-content-center me-3"
              aria-label="Back"
              style={{
                height: "45px",
                width: "45px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            >
              <FaChevronLeft size={20} />
            </Link>

            <div className="flex-grow-1 col-md-11">
              <h2 className="einvite-page-title mb-1">{categoryInfo.title}</h2>
              <p className="text-muted mb-0">{categoryInfo.description}</p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-2 d-flex align-items-center justify-content-md-end justify-content-start mt-3 mt-md-0 gap-3">
            {/* <span className="badge bg-light text-dark border fs-6 p-2">
                            {filteredCards.length} Templates
                        </span> */}

            <Link to="/einvites/my-cards" className={`btn btn-outline-primary`}>
              My Cards
            </Link>
          </div>
        </div>

        {/* <EinviteFilterBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    categories={[]}
                /> */}

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-4">
            {filteredCards.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-heart fa-4x text-muted mb-4"></i>
                <h4>No cards found</h4>
                <p className="text-muted">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <EinviteCardGrid
                cards={filteredCards}
                loading={false}
                showActions={true}
                showEditButton={true}
                showShareButton={false}
              />
            )}
          </div>
        )}

        {loading && <EinviteCardGrid cards={[]} loading={true} />}
      </div>
    </div>
  );
};

export default EinviteCategoryPage;
