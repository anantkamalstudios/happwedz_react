import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';

const EinviteCardItem = ({ card, showActions = true }) => {
    const navigate = useNavigate();

    const handleCustomize = () => {
        navigate(`/einvites/editor/${card.id}`);
    };

    const handlePreview = () => {
        navigate(`/einvites/preview/${card.id}`);
    };

    return (
        <div className="einvite-card-item">
            <div className="card h-100 shadow-sm">
                <div className="einvite-card-image-wrapper">
                    <img
                        src={getImageUrl(card.thumbnailUrl || card.thumbnail_url || card.image)}
                        alt={card.name}
                        className="card-img-top einvite-card-image"
                        onError={(e) => handleImageError(e, card.thumbnailUrl || card.thumbnail_url || card.image)}
                    />
                    <div className="einvite-card-overlay">
                        <div className="einvite-card-actions">
                            <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={handleCustomize}
                            >
                                <i className="fas fa-edit me-1"></i>
                                Customize
                            </button>
                            <button
                                className="btn btn-outline-light btn-sm"
                                onClick={handlePreview}
                            >
                                <i className="fas fa-eye me-1"></i>
                                Preview
                            </button>
                        </div>
                    </div>
                    {card.cardType === 'video_invite' && (
                        <div className="einvite-play-button">
                            <i className="fas fa-play"></i>
                        </div>
                    )}
                </div>

                <div className="card-body">
                    <h6 className="card-title einvite-card-title">{card.name}</h6>
                    <div className="einvite-card-meta">
                        <div className="einvite-card-rating">
                            <i className="fas fa-star text-warning"></i>
                            <span className="ms-1">{card.rating || '4.5'}</span>
                        </div>
                        {card.cardType === 'video_invite' && (
                            <span className="einvite-card-duration">{card.duration || '2:30'}</span>
                        )}
                    </div>
                    <div className="einvite-card-tags">
                        {card.theme && (
                            <span className="badge bg-light text-dark me-1">{card.theme}</span>
                        )}
                        {card.culture && (
                            <span className="badge bg-light text-dark">{card.culture}</span>
                        )}
                    </div>
                </div>

                {showActions && (
                    <div className="card-footer bg-transparent">
                        <div className="d-flex justify-content-between align-items-center">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={handleCustomize}
                            >
                                <i className="fas fa-edit me-1"></i>
                                Edit
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => console.log('Delete card:', card.id)}
                            >
                                <i className="fas fa-trash me-1"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EinviteCardItem;