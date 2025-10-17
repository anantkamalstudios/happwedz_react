import React, { useState, useEffect } from 'react';
import EinviteHeroSection from '../layouts/einvites/EinviteHeroSection';
import EinviteFilterBar from '../layouts/einvites/EinviteFilterBar';
import EinviteCardGrid from '../layouts/einvites/EinviteCardGrid';
import { einviteApi } from '../../services/api/einviteApi';

const EinviteHomePage = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCards();
        fetchCategories();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const data = await einviteApi.getEinvitesByTemplateStatus(true);
            const cardsArray = Array.isArray(data) ? data : [];
            setCards(cardsArray);
            setFilteredCards(cardsArray);
        } catch (err) {
            setError('Failed to load cards');
            console.error('Error fetching cards:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await einviteApi.getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
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

    const handleFilterChange = ({ category, theme }) => {
        let filtered = cards;

        if (category !== 'all') {
            filtered = filtered.filter(card => card.card_type === category);
        }

        if (theme !== 'all') {
            filtered = filtered.filter(card => card.theme === theme);
        }

        setFilteredCards(filtered);
    };

    const getCardsByCategory = (category) => {
        if (!Array.isArray(filteredCards)) return [];
        return filteredCards.filter(card => {
            // Map API cardType to our expected categories
            const categoryMap = {
                'Wedding E-Invitations': 'wedding_einvite',
                'Video Invitations': 'video_invite',
                'Save The Date': 'save_the_date'
            };
            const mappedCategory = categoryMap[category];
            return card.cardType === mappedCategory;
        });
    };

    const cardCategories = [
        { key: 'Wedding E-Invitations', label: 'Wedding Cards', icon: 'fas fa-heart' },
        { key: 'Video Invitations', label: 'Video Cards', icon: 'fas fa-video' },
        { key: 'Save The Date', label: 'Save The Date', icon: 'fas fa-calendar' }
    ];

    return (
        <div className="einvite-home-page">
            <EinviteHeroSection />
            <EinviteFilterBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                categories={categories}
            />

            <main className="py-5">
                {error && (
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="container">
                        {filteredCards.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-heart fa-4x text-muted mb-4"></i>
                                <h4>No cards found</h4>
                                <p className="text-muted">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            cardCategories.map((category) => {
                                const categoryCards = getCardsByCategory(category.key);
                                if (categoryCards.length === 0) return null;

                                return (
                                    <div key={category.key} className="mb-5">
                                        <div className="row mb-4">
                                            <div className="col-md-8">
                                                <h3 className="einvite-section-title">
                                                    <i className={`${category.icon} me-2 text-primary`}></i>
                                                    {category.label}
                                                    <span className="badge bg-primary ms-2">{categoryCards.length}</span>
                                                </h3>
                                            </div>
                                            <div className="col-md-4 text-end">
                                                <a
                                                    href={`/einvites/category/${category.key.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="btn btn-outline-primary"
                                                >
                                                    Our Cards <i className="fas fa-arrow-right ms-1"></i>
                                                </a>
                                            </div>
                                        </div>

                                        <EinviteCardGrid
                                            cards={categoryCards.slice(0, 6)}
                                            loading={false}
                                            showActions={false}
                                        />
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {loading && (
                    <div className="container">
                        <EinviteCardGrid cards={[]} loading={true} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default EinviteHomePage;
