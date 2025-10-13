import React, { useMemo, useState } from "react";
import { getImageUrl, handleImageError } from "../../../utils/imageUtils";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { TbTextResize } from "react-icons/tb";
import { AiOutlineUndo } from "react-icons/ai";


const EinviteCardEditor = ({ card, onSave, onCancel, onSaveDraft }) => {
  const [editedCard, setEditedCard] = useState(card || {});
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [history, setHistory] = useState([]);

  const pushHistory = (state) => {
    setHistory((prev) => [...prev, state]);
  };

  const handleFieldChange = (fieldId, value) => {
    setEditedCard((prev) => {
      const next = {
        ...prev,
        editableFields: prev.editableFields?.map((field) =>
          field.id === fieldId ? { ...field, defaultText: value } : field
        ),
      };
      return next;
    });
  };

  const handleStyleChange = (fieldId, styleType, value) => {
    setEditedCard((prev) => {
      const next = {
        ...prev,
        editableFields: prev.editableFields?.map((field) =>
          field.id === fieldId ? { ...field, [styleType]: value } : field
        ),
      };
      return next;
    });
  };

  const stripDomain = (url) => {
    if (!url) return url;
    return url.replace(/^https?:\/\/(www\.)?happywedz\.com/, "");
  };

  const buildCleanPayload = () => {
    const editableFields = Array.isArray(editedCard.editableFields)
      ? editedCard.editableFields.map((field) => ({
        id: field.id,
        label: field.label,
        defaultText: field.defaultText ?? "",
        color: field.color ?? "#000000",
        fontFamily: field.fontFamily ?? "Arial",
        fontSize: Number.isFinite(field.fontSize) ? field.fontSize : 16,
        x: Math.round(field.x ?? 0),
        y: Math.round(field.y ?? 0),
      }))
      : [];

    return {
      id: editedCard.id || editedCard._id,
      name: editedCard.name,
      cardType: editedCard.cardType,
      backgroundUrl: stripDomain(editedCard.backgroundUrl || editedCard.background_url),
      thumbnailUrl: stripDomain(editedCard.thumbnailUrl || editedCard.thumbnail_url),
      // Server expects a JSON string for editableFields
      editableFields: JSON.stringify(editableFields),
    };
  };

  const handleSave = () => {
    const cleanedCard = buildCleanPayload();
    onSave(cleanedCard);
  }

  const handleSaveDraft = () => {
    const cleanedCard = buildCleanPayload();
    onSaveDraft?.(cleanedCard);
  };


  const selectedField = useMemo(
    () => editedCard.editableFields?.find((f) => f.id === selectedFieldId) || null,
    [editedCard, selectedFieldId]
  );

  const bgUrl = getImageUrl(
    editedCard.backgroundUrl || editedCard.background_url
  );

  const beginDrag = (e, field) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    setSelectedFieldId(field.id);
    setIsDragging(true);
    setDragOffset({ x: startX - field.x, y: startY - field.y });
    pushHistory(JSON.parse(JSON.stringify(editedCard)));
  };

  const onCanvasMouseMove = (e) => {
    if (!isDragging || !selectedField) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setEditedCard((prev) => ({
      ...prev,
      editableFields: prev.editableFields.map((f) =>
        f.id === selectedField.id ? { ...f, x: newX, y: newY } : f
      ),
    }));
  };

  const endDrag = () => {
    if (isDragging) setIsDragging(false);
  };

  const openEdit = () => {
    if (!selectedField) return;
    setShowEditModal(true);
  };

  const handleSizeOpen = () => {
    if (!selectedField) return;
    setShowSizePanel(true);
  };

  const handleDelete = () => {
    if (!selectedField) return;
    pushHistory(JSON.parse(JSON.stringify(editedCard)));
    setEditedCard((prev) => ({
      ...prev,
      editableFields: prev.editableFields.filter((f) => f.id !== selectedField.id),
    }));
    setSelectedFieldId(null);
    setShowSizePanel(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setEditedCard(last);
  };

  const [showFontSizeValue, setShowFontSizeValue] = useState(false);
  let hideValueTimeout = null;

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    handleStyleChange(selectedField.id, "fontSize", newSize);

    setShowFontSizeValue(true);
    clearTimeout(hideValueTimeout);
    hideValueTimeout = setTimeout(() => setShowFontSizeValue(false), 1000);
  }

  return (
    <div className="einvite-editor py-4" onMouseUp={endDrag}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Canvas Section */}
          <div className="col-md-5">
            <div
              className="einvite-canvas-wrapper mx-auto"
              style={{
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <div
                className="einvite-canvas-container position-relative border rounded shadow-sm"
                style={{
                  width: "100%",
                  backgroundColor: "#ffffff",
                }}
                onMouseMove={onCanvasMouseMove}
                onClick={() => setSelectedFieldId(null)}
              >
                {bgUrl ? (
                  <img
                    src={bgUrl}
                    alt="Card Background"
                    className="w-100 h-auto d-block"
                    style={{
                      objectFit: "contain",
                      display: "block",
                    }}
                    onError={(e) =>
                      handleImageError(
                        e,
                        editedCard.backgroundUrl || editedCard.background_url
                      )
                    }
                  />
                ) : (
                  <div className="text-center text-muted p-5" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No background image found
                  </div>
                )}

                {/* Editable Text Fields */}
                {editedCard.editableFields?.map((field) => (
                  <div
                    key={field.id}
                    onMouseDown={(e) => beginDrag(e, field)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFieldId(field.id);
                    }}
                    style={{
                      position: "absolute",
                      left: field.x,
                      top: field.y,
                      color: field.color,
                      fontFamily: field.fontFamily,
                      fontSize: `${field.fontSize}px`,
                      cursor: "move",
                      userSelect: "none",
                      border: selectedFieldId === field.id ? "2px dashed #d91d6e" : "none",
                      padding: selectedFieldId === field.id ? "4px 8px" : 0,
                      background: selectedFieldId === field.id ? "rgba(217, 29, 110, 0.08)" : "transparent",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {field.defaultText}
                    {selectedFieldId === field.id && (
                      <button
                        type="button"
                        className="btn btn-sm btn-light position-absolute"
                        style={{
                          right: -15,
                          top: -20,
                          padding: "5px 5px",
                          borderRadius: "50%",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                      >
                        <MdDeleteOutline size={20} color="#000" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom customizables */}
            <div className="einvite-card-editor">
              {showSizePanel && selectedField && (
                <div className="size-panel">
                  <div className="size-panel-header">
                    <h6 className="size-panel-title">
                      Size {selectedField.fontSize}
                    </h6>
                    <button
                      type="button"
                      className="btn-close-panel"
                      onClick={() => setShowSizePanel(false)}
                      aria-label="Close"
                    >
                      <IoIosClose color="#000" size={20} />
                    </button>
                  </div>

                  <div className="size-panel-body">
                    <input
                      type="range"
                      className="size-slider"
                      min="8"
                      max="120"
                      value={selectedField.fontSize}
                      onChange={handleFontSizeChange}
                      onMouseDown={() => pushHistory(JSON.parse(JSON.stringify(editedCard)))}
                    />

                    {/* {showFontSizeValue && (
                      <div className="size-value">{selectedField.fontSize}px</div>
                    )} */}
                  </div>
                </div>
              )}


              <div className="editor-toolbar">
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={openEdit}
                  disabled={!selectedField}
                  title="Edit"
                >
                  <FiEdit2 />

                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={handleSizeOpen}
                  disabled={!selectedField}
                  title="Size"
                >
                  <TbTextResize />

                  <span>Size</span>
                </button>

                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  title="Undo"
                >
                  <AiOutlineUndo />

                  <span>Undo</span>
                </button>

                <div className="toolbar-spacer"></div>

                <button
                  type="button"
                  className="btn btn-light btn-save-draft me-2 fs-12"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-next fs-12 text-white"
                  onClick={handleSave}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="text-end mt-4">
          <button className="btn btn-secondary me-2 fs-16" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary fs-16" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedField && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" onClick={() => setShowEditModal(false)}>
          <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Text</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedField.defaultText}
                    onChange={(e) => handleFieldChange(selectedField.id, e.target.value)}
                    onFocus={() => pushHistory(JSON.parse(JSON.stringify(editedCard)))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={selectedField.color}
                    onChange={(e) => handleStyleChange(selectedField.id, "color", e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowEditModal(false)}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EinviteCardEditor;
