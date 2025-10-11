import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EinviteCardGrid from '../layouts/einvites/EinviteCardGrid';
import EinviteFilterBar from '../layouts/einvites/EinviteFilterBar';
import { einviteApi } from '../../services/api/einviteApi';

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
            const data = await einviteApi.getEinvitesByCategory(category);
            setCards(data);
            setFilteredCards(data);
        } catch (err) {
            setError('Failed to load cards');
            console.error('Error fetching category cards:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) {
            setFilteredCards(cards);
            return;
        }

        const filtered = cards.filter(card =>
            card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.theme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.culture?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCards(filtered);
    };

    const handleFilterChange = ({ category: filterCategory, theme }) => {
        let filtered = cards;

        if (filterCategory !== 'all') {
            filtered = filtered.filter(card => card.cardType === filterCategory);
        }

        if (theme !== 'all') {
            filtered = filtered.filter(card => card.theme === theme);
        }

        setFilteredCards(filtered);
    };

    const getCategoryInfo = (categoryKey) => {
        const categoryMap = {
            'wedding-e-invitations': {
                title: 'Wedding E-Invitations',
                icon: 'fas fa-heart',
                description: 'Beautiful wedding invitation templates'
            },
            'video-invitations': {
                title: 'Video Invitations',
                icon: 'fas fa-video',
                description: 'Dynamic video invitation templates'
            },
            'save-the-date': {
                title: 'Save The Date',
                icon: 'fas fa-calendar',
                description: 'Save the date card templates'
            }
        };
        return categoryMap[categoryKey] || {
            title: 'E-Invitations',
            icon: 'fas fa-envelope',
            description: 'Beautiful invitation templates'
        };
    };

    const categoryInfo = getCategoryInfo(category);

    return (
        <div className="einvite-category-page">
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-md-8">
                        <Link to="/einvites" className="btn btn-outline-secondary mb-3">
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Browse
                        </Link>
                        <h2 className="einvite-page-title">
                            <i className={`${categoryInfo.icon} me-2 text-primary`}></i>
                            {categoryInfo.title}
                        </h2>
                        <p className="text-muted">{categoryInfo.description}</p>
                    </div>
                    <div className="col-md-4 text-end">
                        <div className="einvite-category-stats">
                            <span className="badge bg-primary fs-6">
                                {filteredCards.length} Templates
                            </span>
                        </div>
                    </div>
                </div>

                <EinviteFilterBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    categories={[]}
                />

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
                                <p className="text-muted">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <EinviteCardGrid
                                cards={filteredCards}
                                loading={false}
                                showActions={false}
                            />
                        )}
                    </div>
                )}

                {loading && (
                    <EinviteCardGrid cards={[]} loading={true} />
                )}
            </div>
        </div>
    );
};

export default EinviteCategoryPage;