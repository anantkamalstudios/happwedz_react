import React, { useState } from "react";
import { getImageUrl, handleImageError } from "../../../utils/imageUtils";

const EinviteCardEditor = ({ card, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState("text");
  const [editedCard, setEditedCard] = useState(card || {});

  const handleFieldChange = (fieldId, value) => {
    setEditedCard((prev) => ({
      ...prev,
      editableFields: prev.editableFields?.map((field) =>
        field.id === fieldId ? { ...field, defaultText: value } : field
      ),
    }));
  };

  const handleStyleChange = (fieldId, styleType, value) => {
    setEditedCard((prev) => ({
      ...prev,
      editableFields: prev.editableFields?.map((field) =>
        field.id === fieldId ? { ...field, [styleType]: value } : field
      ),
    }));
  };

  const handleSave = () => onSave(editedCard);

  const bgUrl = getImageUrl(
    editedCard.backgroundUrl || editedCard.background_url
  );

  return (
    <div className="einvite-editor py-4">
      <div className="container-fluid">
        <div className="row">
          {/* Canvas Section */}
          <div className="col-md-8">
            <div
              className="einvite-canvas-container position-relative border rounded overflow-hidden shadow-sm"
              style={{
                width: "100%",
                minHeight: "600px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {bgUrl ? (
                <img
                  src={bgUrl}
                  alt="Card Background"
                  className="w-100 h-auto d-block"
                  style={{
                    objectFit: "contain",
                    maxHeight: "600px",
                  }}
                  onError={(e) =>
                    handleImageError(
                      e,
                      editedCard.backgroundUrl || editedCard.background_url
                    )
                  }
                />
              ) : (
                <div className="text-center text-muted p-5">
                  No background image found
                </div>
              )}

              {/* Editable Text Fields */}
              {editedCard.editableFields?.map((field) => (
                <div
                  key={field.id}
                  style={{
                    position: "absolute",
                    left: field.x,
                    top: field.y,
                    color: field.color,
                    fontFamily: field.fontFamily,
                    fontSize: `${field.fontSize}px`,
                    pointerEvents: "none",
                  }}
                >
                  {field.defaultText}
                </div>
              ))}
            </div>
          </div>

          {/* Controls Section */}
          <div className="col-md-4">
            <div className="einvite-editor-controls">
              <ul className="nav nav-tabs text-black" role="tablist">
                {["text", "style", "layout"].map((tab) => (
                  <li className="nav-item text-black" key={tab}>
                    <button
                      className={`nav-link ${
                        activeTab === tab ? "active" : "text-black"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="tab-content mt-3">
                {activeTab === "text" && (
                  <div className="tab-pane active">
                    {editedCard.editableFields?.map((field) => (
                      <div key={field.id} className="mb-3">
                        <label className="form-label">{field.label}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={field.defaultText}
                          onChange={(e) =>
                            handleFieldChange(field.id, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "style" && (
                  <div className="tab-pane active">
                    {editedCard.editableFields?.map((field) => (
                      <div key={field.id} className="mb-3 border-bottom pb-3">
                        <h6>{field.label}</h6>
                        <div className="mb-2">
                          <label className="form-label">Color</label>
                          <input
                            type="color"
                            className="form-control form-control-color"
                            value={field.color}
                            onChange={(e) =>
                              handleStyleChange(
                                field.id,
                                "color",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Font Family</label>
                          <select
                            className="form-select"
                            value={field.fontFamily}
                            onChange={(e) =>
                              handleStyleChange(
                                field.id,
                                "fontFamily",
                                e.target.value
                              )
                            }
                          >
                            <option value="Arial">Arial</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Times New Roman">
                              Times New Roman
                            </option>
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Font Size</label>
                          <input
                            type="range"
                            className="form-range"
                            min="12"
                            max="48"
                            value={field.fontSize}
                            onChange={(e) =>
                              handleStyleChange(
                                field.id,
                                "fontSize",
                                parseInt(e.target.value)
                              )
                            }
                          />
                          <small className="text-muted">
                            {field.fontSize}px
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "layout" && (
                  <div className="tab-pane active text-muted">
                    Layout controls coming soon...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="text-end mt-4">
          <button className="btn btn-secondary me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EinviteCardEditor;
