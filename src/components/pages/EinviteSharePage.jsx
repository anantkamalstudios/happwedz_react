import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { einviteApi } from '../../services/api/einviteApi';
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const EinviteSharePage = () => {
    const { id } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (id) {
            fetchCard();
            setShareUrl(`${window.location.origin}/einvites/view/${id}`);
        }
    }, [id]);

    const fetchCard = async () => {
        try {
            setLoading(true);
            const data = await einviteApi.getEinviteById(id);
            setCard(data);
        } catch (err) {
            setError('Failed to load card');
            console.error('Error fetching card:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppShare = () => {
        const message = `Check out this beautiful wedding invitation: ${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleEmailShare = () => {
        const subject = 'Wedding Invitation';
        const body = `You're invited to our wedding! View the invitation here: ${shareUrl}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy link:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard!');
        }
    };

    const handleDownload = () => {
        // This would implement the actual download functionality
        console.log('Downloading card:', card);
        alert('Download functionality coming soon!');
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading card...</p>
                </div>
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
                <Link className="btn btn-primary" to="/einvites">
                    Back to Browse
                </Link>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <h4>Card not found</h4>
                    <p className="text-muted">The requested card could not be found.</p>
                    <Link className="btn btn-primary" to="/einvites">
                        Back to Browse
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="einvite-share-page">
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="einvite-share-preview">
                            <div className="einvite-share-card">
                                <img
                                    src={getImageUrl(card.backgroundUrl || card.background_url)}
                                    alt="Card Preview"
                                    className="einvite-share-image"
                                    onError={(e) => handleImageError(e, card.backgroundUrl || card.background_url)}
                                />
                                {card.editableFields?.map(field => (
                                    <div
                                        key={field.id}
                                        className="einvite-share-field"
                                        style={{
                                            position: 'absolute',
                                            left: field.x,
                                            top: field.y,
                                            color: field.color,
                                            fontFamily: field.fontFamily,
                                            fontSize: field.fontSize
                                        }}
                                    >
                                        {field.defaultText}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="einvite-share-options">
                            <h4 className="mb-4">
                                <i className="fas fa-share me-2 text-primary"></i>
                                Share Your Invitation
                            </h4>

                            <div className="einvite-share-methods">
                                <button
                                    className="btn btn-success w-100 mb-3"
                                    onClick={handleWhatsAppShare}
                                >
                                    <i className="fab fa-whatsapp me-2"></i>
                                    Share on WhatsApp
                                </button>

                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={handleEmailShare}
                                >
                                    <i className="fas fa-envelope me-2"></i>
                                    Share via Email
                                </button>

                                <button
                                    className="btn btn-outline-primary w-100 mb-3"
                                    onClick={handleCopyLink}
                                >
                                    <i className="fas fa-link me-2"></i>
                                    Copy Link
                                </button>

                                <button
                                    className="btn btn-outline-secondary w-100 mb-3"
                                    onClick={handleDownload}
                                >
                                    <i className="fas fa-download me-2"></i>
                                    Download Image
                                </button>
                            </div>

                            <div className="einvite-share-info">
                                <h6>Card Information</h6>
                                <div className="mb-2">
                                    <strong>Name:</strong> {card.name}
                                </div>
                                <div className="mb-2">
                                    <strong>Type:</strong> {card.cardType}
                                </div>
                                <div className="mb-2">
                                    <strong>Created:</strong> {new Date(card.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="einvite-share-actions mt-4">
                                <Link
                                    className="btn btn-outline-primary w-100 mb-2"
                                    to={`/einvites/editor/${card.id}`}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Card
                                </Link>
                                <Link
                                    className="btn btn-outline-secondary w-100"
                                    to="/einvites"
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Create New
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EinviteSharePage;