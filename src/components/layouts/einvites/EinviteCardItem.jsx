import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';

const EinviteCardItem = ({ card, showActions = true, onCardClickEdit = false, fixedImageHeight }) => {
    const navigate = useNavigate();

    const handleCustomize = () => {
        navigate(`/einvites/editor/${card.id}`);
    };

    const handlePreview = () => {
        navigate(`/einvites/preview/${card.id}`);
    };

    const handleWholeCardClick = () => {
        if (onCardClickEdit) {
            handleCustomize();
        }
    };

    return (
        <div className="einvite-card-wrapper" onClick={handleWholeCardClick} style={{ cursor: onCardClickEdit ? 'pointer' : 'default' }}>
            <div className="card h-100 shadow-sm einvite-card">
                {/* Card Image Container */}
                <div className="einvite-image-container position-relative" style={fixedImageHeight ? { height: fixedImageHeight, overflow: 'hidden' } : undefined}>
                    <img
                        src={getImageUrl(card.thumbnailUrl || card.thumbnail_url || card.image)}
                        alt={card.name}
                        className="card-img-top einvite-image"
                        style={fixedImageHeight ? { height: '100%', width: '100%', objectFit: 'cover' } : undefined}
                        onError={(e) => handleImageError(e, card.thumbnailUrl || card.thumbnail_url || card.image)}
                    />

                    {/* Edit Button Overlay - Top Right */}
                    <button
                        onClick={handleCustomize}
                        className="btn accent-pink-bg einvite-edit-btn position-absolute text-white"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClickCapture={(e) => { e.stopPropagation(); handleCustomize(); }}
                    >
                        <i className="fas fa-edit me-2"></i>
                        Edit
                    </button>

                    {/* Video Play Icon */}
                    {card.cardType === 'video_invite' && (
                        <div className="einvite-play-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <div className="einvite-play-icon">
                                <i className="fas fa-play"></i>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card Footer with Title */}
                <div className="card-body text-center">
                    <h6 className=" einvite-title mb-2 fs-24 text-center">{card.name}</h6>

                    {(card.rating || (card.cardType === 'video_invite' && card.duration)) && (
                        <div className="d-flex align-items-center justify-content-center gap-3 mb-2 einvite-meta">
                            {card.rating && (
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-star text-warning me-1"></i>
                                    <span>{card.rating}</span>
                                </div>
                            )}
                            {card.cardType === 'video_invite' && card.duration && (
                                <span className="text-muted">{card.duration}</span>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {(card.theme || card.culture) && (
                        <div className="d-flex align-items-center justify-content-center gap-2 einvite-tags">
                            {card.theme && (
                                <span className="badge bg-light text-dark">{card.theme}</span>
                            )}
                            {card.culture && (
                                <span className="badge bg-light text-dark">{card.culture}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EinviteCardItem;