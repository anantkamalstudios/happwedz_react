import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FiArrowLeft, FiCheck, FiClock, FiEdit2, FiFilm, FiPlay } from "react-icons/fi";
import { einviteApi } from "../../../../services/api/einviteApi";
import EinvitePage from "../design/EinvitePage";
import EinviteVideoPlayer from "../design/EinviteVideoPlayer";
import { cardFonts, cardPath, getCardPages, loadFonts, pageTitle } from "../design/einviteDesign";
import { payForInvitation } from "../share/payForInvitation";
import StepHeader from "./StepHeader";

const AUTOSAVE_MS = 1200;
const rupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const toast = (text, icon = "success") => Swal.fire({ text, icon, timer: 1800, showConfirmButton: false });

// Typing before the first save (on the design itself) is kept on this device,
// so a refresh doesn't lose it.
const localKey = (cardId) => `einvite-video-draft:${cardId}`;
const readLocal = (cardId) => {
  try {
    return JSON.parse(localStorage.getItem(localKey(cardId)) || "null");
  } catch {
    return null;
  }
};
const writeLocal = (cardId, value) => {
  try {
    if (value) localStorage.setItem(localKey(cardId), JSON.stringify(value));
    else localStorage.removeItem(localKey(cardId));
  } catch {
    // Storage unavailable: nothing to keep.
  }
};

const counterClass = (length, limit) => {
  if (!limit) return "";
  if (length >= limit) return "is-danger";
  return length >= limit * 0.8 ? "is-warn" : "";
};

// Required text boxes left empty, per scene: { sceneIndex: [fieldId] }.
const findMissing = (pages) =>
  pages.map((page) => page.fields.filter((field) => field.required && !field.defaultText.trim()).map((field) => field.id));

const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.round(seconds / 60)}m ago`;
};

// WedMeGood-style flow for a video design: one scene at a time with a live
// preview, then a review page, then payment (paid designs) and the video.
// `onCreated(copy)` is called when the design is first saved as the couple's copy.
const VideoInviteEditor = ({ initialCard, onCreated }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [card, setCard] = useState(initialCard);
  const [pages, setPages] = useState(() => {
    const loaded = getCardPages(initialCard);
    const local = initialCard.isTemplate ? readLocal(initialCard.id) : null;
    if (!local?.pages) return loaded;
    // Only text is restored; the design's layout always comes from the server.
    return loaded.map((page) => ({
      ...page,
      fields: page.fields.map((field) => {
        const saved = local.pages.find((p) => p.id === page.id)?.fields?.find((f) => f.id === field.id);
        return saved && typeof saved.defaultText === "string" ? { ...field, defaultText: saved.defaultText } : field;
      }),
    }));
  });
  const [name, setName] = useState(initialCard.name || "");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [focusedFieldId, setFocusedFieldId] = useState(null);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [saveState, setSaveState] = useState({ status: initialCard.isTemplate ? "local" : "saved", at: null });
  const [previewing, setPreviewing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0);

  const fieldRefs = useRef({});
  const savingRef = useRef(null);

  const step = searchParams.get("step") === "review" ? "review" : "details";
  const isPaid = Boolean(card.pricing?.isPaid);
  const isUnlocked = card.isTemplate ? !isPaid : card.isUnlocked !== false;
  const page = pages[Math.min(sceneIndex, pages.length - 1)];

  useEffect(() => {
    loadFonts(cardFonts(pages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keeps "Saved 2m ago" fresh.
  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  const goToStep = (next) => {
    const params = new URLSearchParams(searchParams);
    if (next === "review") params.set("step", "review");
    else params.delete("step");
    setSearchParams(params, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ----- saving -----

  const payload = useCallback(
    () => ({
      name: name.trim() || card.name,
      pages: pages.map((p) => ({ id: p.id, name: p.name, backgroundUrl: p.backgroundUrl, fields: p.fields })),
    }),
    [name, pages, card.name]
  );

  // Saves to the server. The design itself is first copied into Your Cards.
  const save = useCallback(
    async ({ quiet = false } = {}) => {
      if (savingRef.current) return savingRef.current;
      const run = (async () => {
        setSaveState((prev) => ({ ...prev, status: "saving" }));
        try {
          let saved;
          if (card.isTemplate) {
            const created = await einviteApi.createInstance({ ...payload(), originalTemplateId: card.id });
            saved = created?.data || created;
            if (!saved?.id) throw new Error("Failed to save your invitation.");
            writeLocal(card.id, null);
            setCard(saved);
            onCreated?.(saved);
          } else {
            const updated = await einviteApi.updateInstance(card.id, payload());
            saved = updated?.data || updated;
            setCard(saved);
          }
          setDirty(false);
          setSaveState({ status: "saved", at: new Date() });
          if (!quiet) toast("Draft saved");
          return saved;
        } catch (err) {
          setSaveState((prev) => ({ ...prev, status: "error" }));
          if (!quiet) toast(err.message || "Couldn't save. Please try again.", "error");
          return null;
        } finally {
          savingRef.current = null;
        }
      })();
      savingRef.current = run;
      return run;
    },
    [card, payload, onCreated]
  );

  // Autosave once the couple has their own copy; before that, keep it locally.
  useEffect(() => {
    if (!dirty) return undefined;
    if (card.isTemplate) {
      writeLocal(card.id, { pages: pages.map((p) => ({ id: p.id, fields: p.fields.map((f) => ({ id: f.id, defaultText: f.defaultText })) })) });
      return undefined;
    }
    const timer = setTimeout(() => save({ quiet: true }), AUTOSAVE_MS);
    return () => clearTimeout(timer);
  }, [dirty, pages, name, card.isTemplate, card.id, save]);

  useEffect(() => {
    if (!dirty || card.isTemplate) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, card.isTemplate]);

  // ----- editing -----

  const updateText = (fieldId, text) => {
    setPages((prev) =>
      prev.map((p, index) =>
        index !== sceneIndex ? p : { ...p, fields: p.fields.map((f) => (f.id === fieldId ? { ...f, defaultText: text } : f)) }
      )
    );
    setErrors((prev) => ({ ...prev, [fieldId]: undefined }));
    setDirty(true);
  };

  const focusField = (fieldId) => {
    setFocusedFieldId(fieldId);
    const input = fieldRefs.current[fieldId];
    if (input) {
      input.focus({ preventScroll: true });
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const showScene = (index) => {
    setSceneIndex(index);
    setFocusedFieldId(null);
    setPreviewing(false);
    if (window.innerWidth < 992) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Marks this scene's empty required boxes; returns false if there are any.
  const validateScene = (index) => {
    const missing = findMissing(pages)[index];
    if (!missing.length) return true;
    setErrors(Object.fromEntries(missing.map((id) => [id, "This is required"])));
    toast("Please fill in all required fields", "error");
    setTimeout(() => focusField(missing[0]), 50);
    return false;
  };

  const next = async () => {
    if (!validateScene(sceneIndex)) return;
    if (card.isTemplate || dirty) await save({ quiet: true });
    if (sceneIndex < pages.length - 1) showScene(sceneIndex + 1);
    else goToStep("review");
  };

  // ----- review -----

  const missingAll = findMissing(pages);
  const firstMissingScene = missingAll.findIndex((ids) => ids.length);

  const finish = async () => {
    if (firstMissingScene !== -1) {
      goToStep("details");
      showScene(firstMissingScene);
      validateScene(firstMissingScene);
      return;
    }
    if (!confirmed) {
      toast("Please confirm your details first", "error");
      return;
    }
    setBusy(true);
    try {
      const saved = card.isTemplate || dirty ? await save({ quiet: true }) : card;
      if (!saved?.id) return;
      if (isPaid && !saved.isUnlocked) {
        const order = await payForInvitation(saved.id);
        if (!order) return; // closed the payment window
      }
      navigate(`/einvites/share/${saved.id}?create=1`);
    } catch (err) {
      toast(err.message || "Something went wrong. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  const saveLabel = {
    local: "Not saved yet",
    saving: "Saving…",
    saved: saveState.at ? `Saved ✓ ${timeAgo(saveState.at)}` : "All changes saved",
    error: "Couldn't save — retrying when you type",
  }[saveState.status];

  const pricing = card.pricing || {};
  const priceBox = useMemo(
    () =>
      !isPaid ? (
        <div className="eiv-price-row">
          <span>Video invite</span>
          <strong className="eiv-free">FREE</strong>
        </div>
      ) : (
        <>
          {pricing.mrp > pricing.price && (
            <div className="eiv-price-row">
              <span>MRP</span>
              <s>{rupees(pricing.mrp)}</s>
            </div>
          )}
          {pricing.mrp > pricing.price && (
            <div className="eiv-price-row is-discount">
              <span>Discount ({pricing.discountPercent}% off)</span>
              <span>− {rupees(pricing.mrp - pricing.price)}</span>
            </div>
          )}
          <div className="eiv-price-row is-total">
            <span>Total</span>
            <strong>{isUnlocked ? "Paid ✓" : rupees(pricing.price)}</strong>
          </div>
        </>
      ),
    [isPaid, isUnlocked, pricing.mrp, pricing.price, pricing.discountPercent]
  );

  const header = (
    <div className="eiv-editor-bar">
      <div className="container eiv-editor-bar-inner">
        <Link to={card.isTemplate ? cardPath(card) : "/einvites/my-cards"} className="eiv-outline-btn" aria-label="Back">
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
        <span className={`eiv-status ${saveState.status === "error" ? "text-danger" : ""}`}>{saveLabel}</span>
      </div>
    </div>
  );

  // ----- review step -----
  if (step === "review") {
    return (
      <div className="eiv">
        {header}
        <div className="container py-4">
          <StepHeader current={3} isPaid={isPaid && !isUnlocked} />
          <div className="row g-4 justify-content-center">
            <div className="col-lg-7">
              <div className="eiv-panel">
                <h2 className="eiv-panel-title mb-3">Your entered details</h2>
                {pages.map((p, index) => (
                  <div key={p.id} className="eiv-review-scene">
                    <div className="eiv-review-thumb">
                      <EinvitePage page={p} />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong>{pageTitle(p, index)}</strong>
                        <button
                          type="button"
                          className="eiv-link-btn small"
                          onClick={() => {
                            goToStep("details");
                            showScene(index);
                          }}
                        >
                          <FiEdit2 size={13} /> Edit
                        </button>
                      </div>
                      {p.fields.map((field) => (
                        <div key={field.id} className="eiv-review-field">
                          <span>{field.label}</span>
                          <span className={!field.defaultText.trim() && field.required ? "text-danger" : ""}>
                            {field.defaultText.trim() || (field.required ? "Required — please fill in" : "—")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="eiv-panel eiv-checkout">
                <div className="eiv-delivery">
                  <FiClock size={16} /> Your video is created instantly{isPaid && !isUnlocked ? " after payment" : ""}.
                </div>
                {priceBox}
                <label className="eiv-confirm" htmlFor="eiv-confirm">
                  <input id="eiv-confirm" type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                  I've checked all my details (names, date, venue).
                </label>
                <button type="button" className="eiv-primary-btn w-100" onClick={finish} disabled={busy}>
                  {busy ? "Please wait…" : isPaid && !isUnlocked ? `Proceed to Pay ${rupees(pricing.price)}` : "Create my video"}
                </button>
                <button type="button" className="eiv-link-btn small mt-2" onClick={() => goToStep("details")}>
                  ← Back to details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- details step -----
  return (
    <div className="eiv">
      {header}
      <div className="container py-4">
        <StepHeader current={2} isPaid={isPaid && !isUnlocked} />
        <div className="eiv-video-editor">
          <div className="eiv-video-editor-preview">
            <div className="eiv-stage-card eiv-stage-video mx-auto">
              {previewing ? (
                <EinviteVideoPlayer video={card.video} pages={pages} />
              ) : (
                <div key={page.id} className="eiv-scene-enter">
                  <EinvitePage page={page} selectedFieldId={focusedFieldId} onFieldPointerDown={focusField} fieldCursor="text" />
                </div>
              )}
            </div>
            <button type="button" className="eiv-outline-btn mx-auto mt-3 d-flex" onClick={() => setPreviewing((on) => !on)}>
              {previewing ? <FiEdit2 size={15} /> : <FiPlay size={15} />} {previewing ? "Back to editing" : "Play video preview"}
            </button>
          </div>

          <div className="eiv-panel">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="eiv-eyebrow">
                Scene {sceneIndex + 1} of {pages.length}
              </span>
              <div className="eiv-dots" aria-hidden="true">
                {pages.map((p, index) => (
                  <span
                    key={p.id}
                    className={`eiv-dot ${index === sceneIndex ? "is-active" : index < sceneIndex ? "is-done" : ""}`}
                  />
                ))}
              </div>
            </div>
            <h2 className="eiv-panel-title mb-3">{pageTitle(page, sceneIndex)}</h2>

            <div key={page.id} className="eiv-scene-enter">
              {page.fields.length === 0 && <p className="eiv-status">This scene has no text to change.</p>}
              {page.fields.map((field) => {
                const limit = field.characterLimit;
                const length = field.defaultText.length;
                const multiline = field.defaultText.includes("\n") || (limit || 1000) > 80;
                const InputTag = multiline ? "textarea" : "input";
                return (
                  <div key={field.id} className={`eiv-field ${field.id === focusedFieldId ? "is-focused" : ""}`}>
                    <label htmlFor={`eiv-vfield-${field.id}`}>
                      {field.label}
                      {field.required && <span className="text-danger ms-1">*</span>}
                    </label>
                    <InputTag
                      id={`eiv-vfield-${field.id}`}
                      ref={(element) => {
                        fieldRefs.current[field.id] = element;
                      }}
                      className={`eiv-text-input ${errors[field.id] ? "is-invalid" : ""} ${limit && length >= limit ? "is-limit" : ""}`}
                      {...(multiline ? { rows: Math.min(5, Math.max(2, field.defaultText.split("\n").length)) } : { type: "text" })}
                      value={field.defaultText}
                      maxLength={limit || 1000}
                      onFocus={() => setFocusedFieldId(field.id)}
                      onChange={(e) => updateText(field.id, e.target.value)}
                    />
                    <div className="eiv-field-meta">
                      {errors[field.id] && <span className="text-danger">{errors[field.id]}</span>}
                      {limit && (
                        <span className={`eiv-counter ${counterClass(length, limit)}`}>
                          {Math.max(0, limit - length)} characters left
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="eiv-editor-nav">
              <button type="button" className="eiv-outline-btn" onClick={() => save()} disabled={saveState.status === "saving"}>
                Save Draft
              </button>
              <button
                type="button"
                className="eiv-outline-btn"
                onClick={() => showScene(sceneIndex - 1)}
                disabled={sceneIndex === 0}
              >
                Previous
              </button>
              <button type="button" className="eiv-primary-btn flex-grow-1" onClick={next}>
                {sceneIndex < pages.length - 1 ? (
                  "Next"
                ) : (
                  <>
                    <FiCheck size={16} /> Review
                  </>
                )}
              </button>
            </div>
            <p className="eiv-status small mt-3 mb-0">
              <FiFilm size={13} className="me-1" />
              Tap any text on the preview to jump to it. Your video is made from exactly what you see.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInviteEditor;
