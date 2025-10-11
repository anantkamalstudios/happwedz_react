import React from 'react';
import { getImageUrl, handleImageError } from '../../../utils/imageUtils';

const EinvitePreviewPublish = ({ card, onPublish, onSaveDraft }) => {
    return (
        <div className="einvite-preview-publish">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="einvite-preview-container">
                            <div className="einvite-preview-card">
                                <img
                                    src={getImageUrl(card.backgroundUrl || card.background_url)}
                                    alt="Card Preview"
                                    className="einvite-preview-image"
                                    onError={(e) => handleImageError(e, card.backgroundUrl || card.background_url)}
                                />
                                {card.editableFields?.map(field => (
                                    <div
                                        key={field.id}
                                        className="einvite-preview-field"
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
                        <div className="einvite-publish-info">
                            <h4>Card Information</h4>
                            <div className="mb-3">
                                <strong>Name:</strong> {card.name}
                            </div>
                            <div className="mb-3">
                                <strong>Type:</strong> {card.cardType}
                            </div>
                            <div className="mb-3">
                                <strong>Created:</strong> {new Date(card.created_at).toLocaleDateString()}
                            </div>

                            <div className="einvite-publish-actions">
                                <button
                                    className="btn btn-success w-100 mb-3"
                                    onClick={onPublish}
                                >
                                    <i className="fas fa-share me-2"></i>
                                    Publish & Share
                                </button>
                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={onSaveDraft}
                                >
                                    <i className="fas fa-save me-2"></i>
                                    Save as Draft
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EinvitePreviewPublish;