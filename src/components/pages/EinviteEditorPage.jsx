import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiDownload,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { einviteApi } from "../../services/api/einviteApi";
import EinvitePage from "../layouts/einvites/design/EinvitePage";
import {
  cardFonts,
  cardPath,
  getCardPages,
  isVideoCard,
  loadFonts,
  pageTitle,
} from "../layouts/einvites/design/einviteDesign";
import VideoInviteEditor from "../layouts/einvites/video/VideoInviteEditor";
import { downloadCardPages } from "../layouts/einvites/design/exportCard";
import "../layouts/einvites/einviteStudio.css";

const notify = (text, icon = "success") =>
  Swal.fire({ text, icon, timer: 1600, showConfirmButton: false });

const EinviteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.id || authUser?._id || authUser?.userId;

  const [card, setCard] = useState(null);
  const [pages, setPages] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [focusedFieldId, setFocusedFieldId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fieldRefs = useRef({});
  const loadedIdRef = useRef(null);
  const stageRef = useRef(null);
  // Where each text box was when the invitation opened, for "Reset position".
  const originalPositionsRef = useRef({});

  useEffect(() => {
    // After the first save of a template the URL moves to the new copy's id;
    // that copy is already on screen, so there is nothing to reload.
    if (loadedIdRef.current === id) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);
    einviteApi
      .getCard(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) throw new Error("This invitation could not be found.");
        if (
          data.isTemplate === false &&
          data.ownerUserId &&
          currentUserId &&
          String(data.ownerUserId) !== String(currentUserId)
        ) {
          throw new Error("This invitation belongs to another account.");
        }
        loadedIdRef.current = data.id;
        setCard(data);
        const loadedPages = getCardPages(data);
        originalPositionsRef.current = Object.fromEntries(
          loadedPages.flatMap((p) => p.fields.map((f) => [`${p.id}:${f.id}`, { x: f.x, y: f.y }]))
        );
        setPages(loadedPages);
        setName(data.name || "");
        setPageIndex(0);
        setFocusedFieldId(null);
        setDirty(false);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load the invitation.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, currentUserId]);

  // Fonts depend on the design, not on the text being typed.
  useEffect(() => {
    if (card) loadFonts(cardFonts(getCardPages(card)));
  }, [card]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const page = pages[pageIndex];

  const updateField = (fieldId, patch) => {
    setPages((prev) =>
      prev.map((p, index) =>
        index !== pageIndex
          ? p
          : { ...p, fields: p.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)) }
      )
    );
    setDirty(true);
  };

  const resizeField = (field, factor) =>
    updateField(field.id, {
      fontSize: Math.min(400, Math.max(4, Math.round(field.fontSize * factor * 10) / 10)),
    });

  const focusField = (fieldId) => {
    setFocusedFieldId(fieldId);
    const input = fieldRefs.current[fieldId];
    if (input) {
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Tapping a text box edits it; dragging it moves it. A small threshold keeps
  // a slightly shaky tap from nudging the text.
  const startFieldPointer = (fieldId, event) => {
    const container = stageRef.current?.firstElementChild;
    const field = page?.fields.find((f) => f.id === fieldId);
    if (!container || !field) return;
    const rect = container.getBoundingClientRect();
    const start = { pointerX: event.clientX, pointerY: event.clientY, x: field.x, y: field.y };
    let moved = false;
    setFocusedFieldId(fieldId);

    const onMove = (moveEvent) => {
      const dx = moveEvent.clientX - start.pointerX;
      const dy = moveEvent.clientY - start.pointerY;
      if (!moved && Math.hypot(dx, dy) < 6) return;
      moved = true;
      let x = start.x + dx / rect.width;
      const y = start.y + dy / rect.height;
      // Snap centred text boxes back to the middle.
      if (field.width && Math.abs(x + field.width / 2 - 0.5) < 0.012) x = 0.5 - field.width / 2;
      updateField(fieldId, {
        x: Math.round(Math.min(1, Math.max(-0.2, x)) * 10000) / 10000,
        y: Math.round(Math.min(1, Math.max(-0.1, y)) * 10000) / 10000,
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (!moved) focusField(fieldId);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const originalPosition = (field) => originalPositionsRef.current[`${page?.id}:${field.id}`];
  const isMoved = (field) => {
    const original = originalPosition(field);
    return Boolean(original) && (Math.abs(original.x - field.x) > 0.0005 || Math.abs(original.y - field.y) > 0.0005);
  };

  const showPage = (index) => {
    setPageIndex(index);
    setFocusedFieldId(null);
  };

  // A set can be trimmed to the functions the couple is holding, and a card
  // can be copied (for a second reception, say) and renamed.
  const renamePage = (value) => {
    setPages((prev) => prev.map((p, index) => (index === pageIndex ? { ...p, name: value.slice(0, 60) } : p)));
    setDirty(true);
  };

  const duplicatePage = () => {
    const source = pages[pageIndex];
    const suffix = Math.random().toString(36).slice(2, 8);
    const copy = {
      ...source,
      id: `${source.id}_${suffix}`.slice(0, 60),
      name: `${pageTitle(source, pageIndex)} (copy)`.slice(0, 60),
      fields: source.fields.map((field) => ({ ...field })),
    };
    setPages((prev) => [...prev.slice(0, pageIndex + 1), copy, ...prev.slice(pageIndex + 1)]);
    showPage(pageIndex + 1);
    setDirty(true);
  };

  const removePage = async () => {
    if (pages.length < 2) return;
    const { isConfirmed } = await Swal.fire({
      text: `Remove the ${pageTitle(pages[pageIndex], pageIndex)} card from your invitation?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#ed1173",
    });
    if (!isConfirmed) return;
    setPages((prev) => prev.filter((_, index) => index !== pageIndex));
    showPage(Math.max(0, pageIndex - 1));
    setDirty(true);
  };

  const save = async () => {
    if (!currentUserId) {
      notify("Please log in to save your invitation.", "error");
      return null;
    }

    const payload = {
      name: name.trim() || card.name,
      pages: pages.map((p) => ({
        id: p.id,
        name: p.name,
        backgroundUrl: p.backgroundUrl,
        fields: p.fields,
      })),
    };

    setSaving(true);
    try {
      if (card.isTemplate) {
        const created = await einviteApi.createInstance({
          ...payload,
          originalTemplateId: card.id,
          ownerUserId: currentUserId,
        });
        const saved = created?.data || created;
        if (!saved?.id) throw new Error("Failed to save your invitation.");
        loadedIdRef.current = saved.id;
        setCard(saved);
        setDirty(false);
        navigate(`/einvites/editor/${saved.id}`, { replace: true });
        notify("Saved to Your Cards");
        return saved;
      }

      const updated = await einviteApi.updateInstance(card.id, payload);
      const saved = updated?.data || updated;
      setCard(saved);
      setDirty(false);
      notify("Invitation saved");
      return saved;
    } catch (err) {
      console.error("Error saving invitation:", err);
      notify(err.message || "Failed to save your invitation.", "error");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const saveAndShare = async () => {
    const saved = dirty || card.isTemplate ? await save() : card;
    if (saved?.id) navigate(`/einvites/share/${saved.id}`);
  };

  const download = async (allPages) => {
    setDownloading(true);
    try {
      await downloadCardPages(name.trim() || card.name, pages, allPages ? undefined : [pageIndex]);
    } catch (err) {
      console.error("Error downloading invitation:", err);
      notify("Couldn't create the image. Please try again.", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="eiv">
        <div className="container py-5 text-center">
          <div className="spinner-border" style={{ color: "#ed1173" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="eiv-status mt-3">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !card || !page) {
    return (
      <div className="eiv">
        <div className="eiv-empty">
          <h3>Can't open this invitation</h3>
          <p>{error || "This invitation has no pages."}</p>
          <Link to="/einvites/category/wedding_einvite" className="eiv-outline-btn">
            Browse designs
          </Link>
        </div>
      </div>
    );
  }

  // Video designs use their own step-by-step flow (scenes, review, payment).
  if (isVideoCard(card)) {
    return (
      <VideoInviteEditor
        initialCard={card}
        onCreated={(saved) => {
          loadedIdRef.current = saved.id;
          navigate(`/einvites/editor/${saved.id}${window.location.search}`, { replace: true });
        }}
      />
    );
  }

  const status = saving
    ? "Saving..."
    : dirty
    ? "Unsaved changes"
    : card.isTemplate
    ? "Not saved yet"
    : "All changes saved";

  return (
    <div className="eiv">
      <div className="eiv-editor-bar">
        <div className="container eiv-editor-bar-inner">
          <Link
            to={card.isTemplate ? cardPath(card) : "/einvites/my-cards"}
            className="eiv-outline-btn"
            aria-label="Back"
          >
            <FiArrowLeft size={16} />
            <span className="d-none d-sm-inline">Back</span>
          </Link>
          <input
            className="eiv-name-input"
            value={name}
            maxLength={120}
            aria-label="Invitation name"
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
          />
          <span className="eiv-status">{status}</span>
          <div className="d-flex flex-wrap gap-2 ms-auto">
            <button type="button" className="eiv-outline-btn" onClick={() => download(false)} disabled={downloading}>
              <FiDownload size={16} />
              {downloading ? "Preparing..." : pages.length > 1 ? "Download card" : "Download"}
            </button>
            {pages.length > 1 && (
              <button type="button" className="eiv-outline-btn" onClick={() => download(true)} disabled={downloading}>
                All cards
              </button>
            )}
            <button
              type="button"
              className="eiv-outline-btn"
              onClick={save}
              disabled={saving || (!dirty && !card.isTemplate)}
            >
              Save
            </button>
            <button
              type="button"
              className="eiv-primary-btn"
              style={{ padding: "9px 18px", fontSize: 15 }}
              onClick={saveAndShare}
              disabled={saving}
            >
              <FiShare2 size={16} /> Save &amp; share
            </button>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {pages.length > 1 && (
            <div className="col-lg-1 order-2 order-lg-1">
              <div className="eiv-page-list">
                {pages.map((p, index) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`eiv-page-item ${index === pageIndex ? "is-active" : ""}`}
                    onClick={() => showPage(index)}
                  >
                    <div>
                      <EinvitePage page={p} />
                    </div>
                    {pageTitle(p, index)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`${pages.length > 1 ? "col-lg-6" : "col-lg-7"} order-1 order-lg-2`}>
            <div className="eiv-stage">
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Previous card"
                  disabled={pageIndex === 0} onClick={() => showPage(pageIndex - 1)}>
                  <FiChevronLeft size={22} />
                </button>
              )}
              <div ref={stageRef} className="eiv-stage-card">
                <EinvitePage
                  page={page}
                  selectedFieldId={focusedFieldId}
                  onFieldPointerDown={startFieldPointer}
                  fieldCursor="move"
                />
              </div>
              {pages.length > 1 && (
                <button type="button" className="eiv-arrow" aria-label="Next card"
                  disabled={pageIndex === pages.length - 1} onClick={() => showPage(pageIndex + 1)}>
                  <FiChevronRight size={22} />
                </button>
              )}
            </div>
            <p className="eiv-status text-center mt-3 mb-0">Tap text to edit it, or drag it to move it.</p>
          </div>

          <div className="col-lg-5 order-3">
            <div className="eiv-panel">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                <h2 className="eiv-panel-title mb-0">
                  {pages.length > 1
                    ? `${pageTitle(page, pageIndex)} · card ${pageIndex + 1} of ${pages.length}`
                    : "Your details"}
                </h2>
                <div className="d-flex gap-1 flex-shrink-0">
                  <button type="button" className="eiv-icon-btn" title="Duplicate this card" aria-label="Duplicate this card" onClick={duplicatePage}>
                    <FiCopy size={16} />
                  </button>
                  {pages.length > 1 && (
                    <button type="button" className="eiv-icon-btn" title="Remove this card" aria-label="Remove this card" onClick={removePage}>
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="eiv-status mb-2">Change the text below. The card updates as you type.</p>

              <div className="eiv-field">
                <label htmlFor="eiv-card-name">Card name (event)</label>
                <input
                  id="eiv-card-name"
                  className="eiv-text-input"
                  value={page.name || ""}
                  placeholder={pageTitle(page, pageIndex)}
                  maxLength={60}
                  onChange={(e) => renamePage(e.target.value)}
                />
              </div>

              {page.fields.length === 0 ? (
                <p className="eiv-status mb-0">This page has no text to edit.</p>
              ) : (
                page.fields.map((field) => (
                  <div key={field.id} className={`eiv-field ${field.id === focusedFieldId ? "is-focused" : ""}`}>
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <label htmlFor={`eiv-field-${field.id}`}>{field.label}</label>
                      <div className="eiv-size-btns">
                        <button type="button" aria-label={`Smaller text for ${field.label}`} onClick={() => resizeField(field, 0.92)}>
                          A−
                        </button>
                        <button type="button" aria-label={`Larger text for ${field.label}`} onClick={() => resizeField(field, 1.08)}>
                          A+
                        </button>
                      </div>
                    </div>
                    <textarea
                      id={`eiv-field-${field.id}`}
                      ref={(element) => {
                        fieldRefs.current[field.id] = element;
                      }}
                      rows={Math.min(6, Math.max(1, field.defaultText.split("\n").length))}
                      value={field.defaultText}
                      maxLength={1000}
                      onFocus={() => setFocusedFieldId(field.id)}
                      onChange={(e) => updateField(field.id, { defaultText: e.target.value })}
                    />
                    {isMoved(field) && (
                      <button
                        type="button"
                        className="eiv-link-btn small mt-1"
                        onClick={() => updateField(field.id, originalPosition(field))}
                      >
                        Reset position
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EinviteEditorPage;
