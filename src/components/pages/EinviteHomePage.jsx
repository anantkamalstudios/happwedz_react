import React from 'react';
import { useNavigate } from 'react-router-dom';
import EinviteHeroSection from '../layouts/einvites/EinviteHeroSection';
import ChooseTemplate from './ChooseTemplate';
import { useToast } from '../layouts/toasts/Toast';

const EinviteHomePage = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();

    const categories = [
        {
            id: 'wedding_einvite',
            title: 'Wedding E-Invitations',
            description: 'Beautiful digital wedding invitation cards',
            color: '#ff6b9d',
            image: './images/einvite/wedding-card.jpg'
        },
        {
            id: 'video',
            title: 'Video Invitations',
            description: 'Dynamic video invitation templates',
            color: '#6366f1',
            image: './images/commingsoon.jpg'
        },
        {
            id: 'save_the_date',
            title: 'Save the Date',
            description: 'Save the date card templates',
            color: '#10b981',
            image: './images/einvite/save-the-date.jpg'
        }
    ];

    const handleCategoryClick = (categoryId) => {
        if (categoryId === 'video') {
            addToast('Video invitations coming soon!', 'info');
            return;
        }

        navigate(`/einvites/category/${categoryId}`);
    };

    return (
        <div className="einvite-home-page">
            <EinviteHeroSection />

            <main className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3">Choose Your Invitation Type</h2>
                        <p className="text-muted fs-5">Select from our beautiful collection of invitation templates</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {categories.map((category) => (
                            <div key={category.id} className="col-lg-4 col-md-6 border-0">
                                <div
                                    className="category-card border-0 bg-white overflow-hidden"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div
                                        className="category-image-wrapper"
                                        style={{
                                            backgroundImage: `url(${category.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                        }}

                                    >
                                        <div className="category-overlay">
                                            <span className="view-text">View Templates</span>
                                        </div>
                                    </div>
                                    <div className="category-content">
                                        <h3 className="category-title">{category.title}</h3>
                                        <p className="category-description">{category.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <ChooseTemplate />

            <style jsx>{`
                .einvite-home-page { 
                    min-height: 100vh;
                }

                .category-card {
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                    height: 100%;
                    padding: 0px;
                    display: flex;
                    flex-direction: column;
                }

                .category-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                }

                .category-image-wrapper {
                    height: 500px;
                    position: relative;
                    overflow: hidden;
                }

                .category-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .category-card:hover .category-overlay {
                    opacity: 1;
                }

                .view-text {
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .category-content {
                    padding: 2rem;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    text-align: center;
                }

                .category-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 0.75rem;
                }

                .category-description {
                    font-size: 1rem;
                    color: #666;
                    margin-bottom: 0;
                    line-height: 1.6;
                }

                @media (max-width: 991px) {
                    .category-image-wrapper {
                        height: 300px;
                    }
                    
                    .category-title {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 767px) {
                    .category-image-wrapper {
                        height: 250px;
                    }
                    
                    .category-content {
                        padding: 1.5rem;
                    }
                    
                    .category-title {
                        font-size: 1.25rem;
                    }
                    
                    .category-description {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default EinviteHomePage;