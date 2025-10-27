import React, { useMemo, useState, useRef } from "react";
import { getImageUrl, handleImageError } from "../../../utils/imageUtils";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { TbTextResize } from "react-icons/tb";
import { AiOutlineUndo } from "react-icons/ai";
import { useSelector } from "react-redux";
import { FaCopy, FaWhatsapp, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

const EinviteCardEditor = ({ card, onSave, onCancel, onSaveDraft }) => {
  const [editedCard, setEditedCard] = useState(card || {});
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSizePanel, setShowSizePanel] = useState(false);
  const [history, setHistory] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Refs for boundary detection
  const canvasRef = useRef(null);
  const textElementRefs = useRef({});

  const pushHistory = (state) => {
    setHistory((prev) => [...prev, state]);
  };

  const shareUrl = `${window.location.origin}/einvites/view/${card.id}`;

  const authUser = useSelector((state) => state?.auth?.user);
  const vendorUser = useSelector((state) => state?.vendorAuth?.vendor);
  const userPhone = authUser?.phone || vendorUser?.phone || "";

  const normalizePhoneForWhatsApp = (phone) => {
    if (!phone) return "";
    const digitsOnly = String(phone).replace(/\D/g, "");
    return digitsOnly;
  };

  const openWhatsAppShare = () => {
    const targetPhone = normalizePhoneForWhatsApp(userPhone);
    const message = `Hey! Check out my e-invite: ${shareUrl}`;
    const base = targetPhone
      ? `https://wa.me/${targetPhone}`
      : "https://wa.me/";
    const url = `${base}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        // alert("Link copied to clipboard!");
        Swal.fire({
          text: "Link copied to clipboard!",
          timer: 1500,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
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
      backgroundUrl: stripDomain(
        editedCard.backgroundUrl || editedCard.background_url
      ),
      thumbnailUrl: stripDomain(
        editedCard.thumbnailUrl || editedCard.thumbnail_url
      ),
      // Server expects a JSON string for editableFields
      editableFields: JSON.stringify(editableFields),
    };
  };

  const handleSave = async () => {
    const cleanedCard = buildCleanPayload();
    try {
      setIsPublishing(true);
      await Promise.resolve(onSave(cleanedCard));
      setIsPublished(true);
      setIsPreview(false);
      setShowPublishConfirm(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = () => {
    const cleanedCard = buildCleanPayload();
    onSaveDraft?.(cleanedCard);
  };

  const selectedField = useMemo(
    () =>
      editedCard.editableFields?.find((f) => f.id === selectedFieldId) || null,
    [editedCard, selectedFieldId]
  );

  const bgUrl = getImageUrl(
    editedCard.backgroundUrl || editedCard.background_url
  );

  const beginDrag = (e, field) => {
    e.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const startX = e.clientX - canvasRect.left;
    const startY = e.clientY - canvasRect.top;

    setSelectedFieldId(field.id);
    setIsDragging(true);
    setDragOffset({ x: startX - field.x, y: startY - field.y });
    pushHistory(JSON.parse(JSON.stringify(editedCard)));
  };

  const onCanvasMouseMove = (e) => {
    if (!isDragging || !selectedField) return;

    // Get canvas container bounds
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();

    // Get the text element to measure its dimensions
    const textElement = textElementRefs.current[selectedField.id];
    if (!textElement) return;

    const textRect = textElement.getBoundingClientRect();

    // Calculate mouse position relative to canvas
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    // Calculate new position
    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;

    // Calculate boundaries (relative to canvas)
    const minX = 0;
    const minY = 0;
    const maxX = canvasRect.width - textRect.width;
    const maxY = canvasRect.height - textRect.height;

    // Constrain position within boundaries
    newX = Math.max(minX, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));

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
      editableFields: prev.editableFields.filter(
        (f) => f.id !== selectedField.id
      ),
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
  };

  return (
    <div className="einvite-editor py-4" onMouseUp={endDrag}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {/* Canvas Section */}
          <div className="col-md-5">
            <div
              className="einvite-canvas-wrapper mx-auto"
              style={{
                width: "414px",
                maxWidth: "414px",
              }}
            >
              <div
                ref={canvasRef}
                className="einvite-canvas-container position-relative border rounded shadow-sm"
                style={{
                  width: "414px",
                  height: "659.288px",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                }}
                onMouseMove={onCanvasMouseMove}
                onMouseLeave={endDrag}
                onClick={() => setSelectedFieldId(null)}
              >
                {bgUrl ? (
                  <img
                    src={bgUrl}
                    alt="Card Background"
                    className="d-block"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
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
                  <div
                    className="text-center text-muted p-5"
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No background image found
                  </div>
                )}

                {/* Editable Text Fields */}
                {editedCard.editableFields?.map((field) => (
                  <div
                    key={field.id}
                    ref={(el) => {
                      if (el) textElementRefs.current[field.id] = el;
                    }}
                    onMouseDown={(e) => {
                      if (isPreview || isPublished) return; // disable drag in preview/published view
                      beginDrag(e, field);
                    }}
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
                      cursor: isPreview || isPublished ? "default" : "move",
                      userSelect: "none",
                      border:
                        !isPreview &&
                        !isPublished &&
                        selectedFieldId === field.id
                          ? "2px dashed #d91d6e"
                          : "none",
                      padding:
                        !isPreview &&
                        !isPublished &&
                        selectedFieldId === field.id
                          ? "4px 8px"
                          : 0,
                      background:
                        !isPreview &&
                        !isPublished &&
                        selectedFieldId === field.id
                          ? "rgba(217, 29, 110, 0.08)"
                          : "transparent",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {field.defaultText}
                    {!isPreview &&
                      !isPublished &&
                      selectedFieldId === field.id && (
                        <button
                          type="button"
                          className="btn btn-sm btn-light position-absolute"
                          style={{
                            right: -15,
                            top: -20,
                            padding: "5px 5px",
                            borderRadius: "50%",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
            {!isPreview && !isPublished && (
              <div
                className="einvite-card-editor mt-3"
                style={{ width: "414px", margin: "0 auto" }}
              >
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
                        onMouseDown={() =>
                          pushHistory(JSON.parse(JSON.stringify(editedCard)))
                        }
                      />

                      {/* {showFontSizeValue && (
                      <div className="size-value">{selectedField.fontSize}px</div>
                    )} */}
                    </div>
                  </div>
                )}

                <div className="editor-toolbar d-flex justify-content-center align-items-center gap-2 flex-wrap">
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
                    onClick={() => setIsPreview(true)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Preview toolbar */}
            {isPreview && !isPublished && (
              <div
                className="mt-3 d-flex justify-content-center gap-2"
                style={{ width: "414px", margin: "0 auto" }}
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2 fs-12"
                  onClick={() => setIsPreview(false)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-success fs-12 text-white"
                  onClick={() => setShowPublishConfirm(true)}
                >
                  Publish
                </button>
              </div>
            )}

            {/* Post-publish options */}
            {isPublished && (
              <div className="container my-4">
                <div className="row g-4">
                  {/* Card 1 - Share Only Free */}
                  <div className="col-12">
                    <div className="border rounded-4 shadow-sm p-4 bg-white">
                      <h5 className="fw-bold mb-3">
                        Share Only — <span className="primary-text">Free</span>
                      </h5>

                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center flex-wrap">
                          <span
                            className="text-primary small me-2"
                            style={{ cursor: "pointer" }}
                            onClick={handleCopy}
                            title={shareUrl}
                          >
                            {shareUrl.length > 60
                              ? shareUrl.slice(0, 60) + "..."
                              : shareUrl}
                          </span>
                          <FaCopy
                            role="button"
                            style={{ cursor: "pointer" }}
                            className="text-primary"
                            onClick={handleCopy}
                            title="Copy Link"
                          />
                        </div>
                      </div>

                      <ul className="mb-3 text-secondary">
                        <li>Share link with Guests</li>
                        <li>Guests RSVP, map location & comment</li>
                        <li>No Downloadable Digital Invite</li>
                      </ul>
                      <button
                        className="btn btn-success d-flex align-items-center"
                        onClick={openWhatsAppShare}
                      >
                        <FaWhatsapp className="me-2" /> Share on WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Card 2 - Share + Download */}
                  <div className="col-12">
                    <div className="border rounded-4 shadow-sm p-4 bg-white">
                      <h5 className="fw-bold mb-3 ">
                        Share + Download —{" "}
                        <span className="primary-text">₹249 only</span>
                      </h5>

                      <div className="d-flex align-items-center mb-3">
                        <span
                          className="text-primary small me-2"
                          style={{ cursor: "pointer" }}
                          onClick={handleCopy}
                        >
                          {shareUrl}
                        </span>
                        <FaCopy
                          role="button"
                          className="text-primary"
                          onClick={handleCopy}
                          title="Copy Link"
                        />
                      </div>

                      <ul className="mb-3 text-secondary">
                        <li>Share link with Guests</li>
                        <li>Guests RSVP, map location & comment</li>
                        <li>Downloadable card allowed [Non-Animated PDF]</li>
                      </ul>

                      <button className="btn btn-primary text-white d-flex align-items-center">
                        <FaDownload className="me-2" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedField && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Text</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedField.defaultText}
                    onChange={(e) =>
                      handleFieldChange(selectedField.id, e.target.value)
                    }
                    onFocus={() =>
                      pushHistory(JSON.parse(JSON.stringify(editedCard)))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={selectedField.color}
                    onChange={(e) =>
                      handleStyleChange(
                        selectedField.id,
                        "color",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowEditModal(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirm Modal */}
      {showPublishConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => !isPublishing && setShowPublishConfirm(false)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Publish</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => !isPublishing && setShowPublishConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">Are you sure to publish card?</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isPublishing}
                  onClick={() => setShowPublishConfirm(false)}
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isPublishing}
                  onClick={handleSave}
                >
                  {isPublishing ? "Publishing..." : "Publish"}
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
