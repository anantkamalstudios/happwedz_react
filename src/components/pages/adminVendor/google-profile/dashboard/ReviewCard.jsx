// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// One Google review on the Reviews tab (helper D): stars, name, date, text and the reply. Write with AI (draft),
// edit, Save, Publish to Google (the vendor's Publish is the approval, after a small confirm), and for a reply on
// Google: Edit and Delete reply (with a confirm). Shape: GrowthOS Review (growthos-web/src/contracts/reviews.ts).
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiEdit2, FiSend, FiTrash2 } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { Callout } from "../GpParts";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import ReviewStars from "./ReviewStars";
import { initials } from "../gpFormat";
import { MAX_REPLY_LENGTH, POLICY_WORDS, REPLY_STATUS_WORDS, errorInfo, formatDate, isReview } from "./ReviewFormat";

const SENTIMENT_CHIP = {
  positive: { label: "Positive", className: "gp-chip-ok" },
  neutral: { label: "Neutral", className: "gp-rv-chip-neutral" },
  negative: { label: "Negative", className: "gp-rv-chip-bad" },
};

function BusyIcon({ busy, icon }) {
  const Icon = icon;
  return busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <Icon size={16} aria-hidden="true" />;
}

/**
 * `publishAvailable` comes from the reviews status (a verified profile). `onChange(next, before)` gets the review
 * as the server returned it after each change.
 */
export default function ReviewCard({ review, publishAvailable, onChange }) {
  const uid = useId();
  const nameId = `${uid}-name`;
  const replyId = `${uid}-reply`;
  const countId = `${uid}-count`;
  const errorId = `${uid}-error`;

  const published = review.reply_status === "published";
  const [mode, setMode] = useState("view"); // view | edit (reply not on Google) | editPublished
  const [text, setText] = useState(review.reply ?? "");
  const [busy, setBusy] = useState(null);
  const [confirm, setConfirm] = useState(null); // publish | delete
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState("");

  const textareaRef = useRef(null);
  const confirmRef = useRef(null);
  const publishBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const cardRef = useRef(null);
  const focusTextarea = useRef(false);
  // Where focus goes once a confirm or an editor closes: "publish" | "delete" (the button) | "card".
  const restoreTo = useRef(null);

  useEffect(() => {
    if (confirm) {
      confirmRef.current?.focus();
      return;
    }
    const back = restoreTo.current;
    restoreTo.current = null;
    if (back === "publish") publishBtnRef.current?.focus();
    else if (back === "delete") deleteBtnRef.current?.focus();
    else if (back === "card") cardRef.current?.focus();
  }, [confirm, mode]);

  useEffect(() => {
    if (focusTextarea.current && mode !== "view") {
      focusTextarea.current = false;
      textareaRef.current?.focus();
    }
  }, [mode]);

  const trimmed = text.trim();
  const tooLong = trimmed.length > MAX_REPLY_LENGTH;
  const editing = mode !== "view";
  const working = Boolean(busy);

  const openEditor = (nextMode, initial) => {
    setText(initial ?? review.reply ?? "");
    setError(null);
    setNotice("");
    setConfirm(null);
    focusTextarea.current = true;
    setMode(nextMode);
  };

  const closeEditor = () => {
    restoreTo.current = "card";
    setMode("view");
    setConfirm(null);
    setError(null);
    setText(review.reply ?? "");
  };

  const askConfirm = (kind) => {
    setError(null);
    setNotice("");
    setConfirm(kind);
  };

  const cancelConfirm = () => {
    restoreTo.current = confirm;
    setConfirm(null);
  };

  /** Runs one call; on success hands the review to the parent and says `done`. */
  const run = async (key, call, fallbackReview, done, after) => {
    setBusy(key);
    setError(null);
    setNotice("");
    try {
      const answer = await call();
      const next = isReview(answer) ? answer : fallbackReview;
      onChange?.(next, review);
      setNotice(done);
      after?.(next);
    } catch (err) {
      setError(errorInfo(err));
      if (key === "publish" || key === "delete") {
        restoreTo.current = key;
        setConfirm(null);
      }
    } finally {
      setBusy(null);
    }
  };

  const draft = () =>
    run(
      "draft",
      () => gpManageApi.draftReply(review.id),
      null,
      "AI draft ready. Read it and change anything you like before you publish.",
      (next) => {
        if (next?.reply) setText(next.reply);
        if (mode === "edit") {
          textareaRef.current?.focus();
        } else {
          focusTextarea.current = true;
          setMode("edit");
        }
      },
    );

  const save = () =>
    run(
      "save",
      () => gpManageApi.saveReply(review.id, trimmed),
      { ...review, reply: trimmed, reply_status: "draft" },
      "Draft saved. It isn't on Google yet.",
    );

  const publish = () =>
    run(
      "publish",
      () => gpManageApi.publishReply(review.id, trimmed),
      { ...review, reply: trimmed, reply_status: "published", published_at: new Date().toISOString() },
      "Reply published on Google.",
      () => {
        restoreTo.current = "card";
        setConfirm(null);
        setMode("view");
      },
    );

  const savePublished = () =>
    run(
      "editPublished",
      () => gpManageApi.editPublishedReply(review.id, trimmed),
      { ...review, reply: trimmed },
      "Reply updated on Google.",
      () => {
        restoreTo.current = "card";
        setMode("view");
      },
    );

  const remove = () =>
    run(
      "delete",
      () => gpManageApi.deleteReply(review.id),
      { ...review, reply: null, reply_status: "none", published_at: null },
      "Reply deleted from Google. The review needs a reply again.",
      (next) => {
        restoreTo.current = "card";
        setConfirm(null);
        setText(next?.reply ?? "");
      },
    );

  // A draft from the AI (or a saved draft) whose text the vendor has not changed.
  const unchangedDraft = trimmed === (review.reply ?? "").trim();
  const sentiment = SENTIMENT_CHIP[review.sentiment];
  const status = REPLY_STATUS_WORDS[review.reply_status] || REPLY_STATUS_WORDS.none;
  const flags = (review.policy_flags || []).filter((flag) => POLICY_WORDS[flag]);
  const date = formatDate(review.review_date);

  return (
    <article className="gp-rv-card" aria-labelledby={nameId} ref={cardRef} tabIndex={-1}>
      <header className="gp-rv-head">
        <span className="gp-rv-avatar" aria-hidden="true">
          {initials(review.reviewer_name)}
        </span>
        <div className="gp-rv-who">
          <h4 className="gp-rv-name" id={nameId}>
            {review.reviewer_name || "A Google user"}
          </h4>
          <span className="gp-rv-meta">
            <ReviewStars rating={review.rating} />
            {date && <span className="gp-muted">{date}</span>}
          </span>
        </div>
        <span className="gp-chips gp-rv-chips">
          {sentiment && <span className={`gp-chip ${sentiment.className}`}>{sentiment.label}</span>}
          <span className={`gp-chip gp-chip-${status.tone}`}>{status.label}</span>
        </span>
      </header>

      {review.review_text ? (
        <p className="gp-rv-text">{review.review_text}</p>
      ) : (
        <p className="gp-rv-text gp-muted">No written review, only a star rating.</p>
      )}

      {review.reply && !editing && (
        <div className={`gp-rv-reply${published ? " is-published" : ""}`}>
          <p className="gp-rv-reply-label">
            {published ? "Your reply on Google" : "Your draft reply (not on Google yet)"}
            {review.ai_generated && !published && <span className="gp-rv-ai">Written by AI</span>}
          </p>
          <p className="gp-rv-reply-text">{review.reply}</p>
        </div>
      )}

      {editing && (
        <div className="gp-rv-editor">
          <label className="gp-field" htmlFor={replyId}>
            {mode === "editPublished" ? "Change your reply on Google" : "Your reply"}
          </label>
          <textarea
            id={replyId}
            ref={textareaRef}
            className="gp-input gp-rv-textarea"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-describedby={`${countId}${error ? ` ${errorId}` : ""}`}
            aria-invalid={tooLong || undefined}
            readOnly={working}
          />
          <p id={countId} className={`gp-note gp-rv-count${tooLong ? " is-over" : ""}`}>
            {tooLong
              ? `Too long: ${trimmed.length} of ${MAX_REPLY_LENGTH} characters. Please shorten it.`
              : `Public on Google. ${trimmed.length} of ${MAX_REPLY_LENGTH} characters.`}
          </p>
          {mode === "edit" && review.ai_generated && unchangedDraft && trimmed && (
            <p className="gp-note">Written by AI. Read it before you publish.</p>
          )}
        </div>
      )}

      {flags.length > 0 && !published && (review.reply || editing) && (
        <Callout tone="alert">
          <b>Check before you publish</b>
          <ul className="gp-list">
            {flags.map((flag) => (
              <li key={flag}>{POLICY_WORDS[flag]}</li>
            ))}
          </ul>
        </Callout>
      )}

      {!publishAvailable && !published && editing && (
        <p className="gp-note">Replies can go on Google once Google verifies your profile. You can save a draft now.</p>
      )}

      {/* Buttons */}
      {!confirm && (
        <div className="gp-btns gp-rv-actions">
          {mode === "view" && !published && (
            <>
              <button type="button" className="gp-btn gp-btn-primary gp-rv-btn" onClick={draft} disabled={working}>
                <BusyIcon busy={busy === "draft"} icon={HiOutlineSparkles} />
                {review.reply ? "Write again with AI" : "Write with AI"}
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={() => openEditor("edit")} disabled={working}>
                <FiEdit2 size={16} aria-hidden="true" />
                {review.reply ? "Edit draft" : "Write a reply"}
              </button>
            </>
          )}

          {mode === "edit" && (
            <>
              <button
                type="button"
                className="gp-btn gp-btn-primary gp-rv-btn"
                ref={publishBtnRef}
                onClick={() => askConfirm("publish")}
                disabled={working || !trimmed || tooLong || !publishAvailable}
              >
                <FiSend size={16} aria-hidden="true" />
                Publish to Google
              </button>
              <button
                type="button"
                className="gp-btn gp-btn-ghost gp-rv-btn"
                onClick={save}
                disabled={working || !trimmed || tooLong || (review.reply_status !== "none" && unchangedDraft)}
              >
                <BusyIcon busy={busy === "save"} icon={FiEdit2} />
                Save
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={draft} disabled={working}>
                <BusyIcon busy={busy === "draft"} icon={HiOutlineSparkles} />
                {trimmed ? "Write again with AI" : "Write with AI"}
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={closeEditor} disabled={working}>
                Cancel
              </button>
            </>
          )}

          {mode === "view" && published && (
            <>
              <button
                type="button"
                className="gp-btn gp-btn-ghost gp-rv-btn"
                onClick={() => openEditor("editPublished")}
                disabled={working}
              >
                <FiEdit2 size={16} aria-hidden="true" />
                Edit
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" ref={deleteBtnRef} onClick={() => askConfirm("delete")} disabled={working}>
                <FiTrash2 size={16} aria-hidden="true" />
                Delete reply
              </button>
            </>
          )}

          {mode === "editPublished" && (
            <>
              <button
                type="button"
                className="gp-btn gp-btn-primary gp-rv-btn"
                onClick={savePublished}
                disabled={working || !trimmed || tooLong || unchangedDraft}
              >
                <BusyIcon busy={busy === "editPublished"} icon={FiSend} />
                Save on Google
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={closeEditor} disabled={working}>
                Cancel
              </button>
            </>
          )}
        </div>
      )}

      {confirm === "publish" && (
        <div className="gp-rv-confirm" role="group" aria-label="Confirm publishing">
          <p className="gp-rv-confirm-text">Publish this reply on Google? Everyone who sees your profile can read it.</p>
          <div className="gp-btns">
            <button
              type="button"
              ref={confirmRef}
              className="gp-btn gp-btn-primary gp-rv-btn"
              onClick={publish}
              disabled={working}
              aria-busy={busy === "publish" || undefined}
            >
              <BusyIcon busy={busy === "publish"} icon={FiSend} />
              Yes, publish
            </button>
            <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={cancelConfirm} disabled={working}>
              Not now
            </button>
          </div>
        </div>
      )}

      {confirm === "delete" && (
        <div className="gp-rv-confirm" role="group" aria-label="Confirm deleting the reply">
          <p className="gp-rv-confirm-text">Delete your reply from Google? The review will show as not answered.</p>
          <div className="gp-btns">
            <button
              type="button"
              ref={confirmRef}
              className="gp-btn gp-btn-primary gp-rv-btn"
              onClick={remove}
              disabled={working}
              aria-busy={busy === "delete" || undefined}
            >
              <BusyIcon busy={busy === "delete"} icon={FiTrash2} />
              Yes, delete reply
            </button>
            <button type="button" className="gp-btn gp-btn-ghost gp-rv-btn" onClick={cancelConfirm} disabled={working}>
              Keep it
            </button>
          </div>
        </div>
      )}

      {error && (
        <div id={errorId}>
          <Callout tone="bad" role="alert">
            {error.message}
            {error.flags.length > 0 && (
              <ul className="gp-list">
                {error.flags.map((flag) => (
                  <li key={flag}>{POLICY_WORDS[flag]}</li>
                ))}
              </ul>
            )}
            {error.hint && <span className="gp-rv-hint">{error.hint}</span>}
          </Callout>
        </div>
      )}

      <p className="gp-rv-notice" aria-live="polite">
        {notice}
      </p>
    </article>
  );
}
