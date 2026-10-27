// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.2, §7.4).
// AI assistant chat — today's message (helper D): the coach items (built by GrowthOS from the score, the fixes and
// what only the vendor can do; no AI credit) as assistant bubbles, each with its one action: upload a photo, send a
// command, open the AI fixes, share the review link (copy / WhatsApp), type an answer, or open a dashboard tab.
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiCopy, FiUpload } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { RefreshButton } from "../GpParts";
import { AssistantBubble } from "./AssistantMessage";
import { PURPOSE_LABELS, TAB_LABELS, chatErrorText, copyText, listOf, whatsappShareUrl } from "./AssistantUtils";

/** The review link: copy it, or share it on WhatsApp. */
function ReviewLinkActions({ url }) {
  const [copied, setCopied] = useState("");
  const copy = async () => {
    const ok = await copyText(url);
    setCopied(ok ? "Link copied." : "Couldn't copy. Select the link and copy it.");
  };
  return (
    <div className="gp-e-stack-sm">
      {/* 2026-10-27: the long link is not printed; Copy link and WhatsApp carry it. */}
      <div className="gp-btns gp-a-btns">
        <button type="button" className="gp-btn gp-btn-ghost gp-a-btn" onClick={copy}>
          <FiCopy size={16} aria-hidden="true" />
          Copy link
        </button>
        <a className="gp-btn gp-btn-ghost gp-a-btn" href={whatsappShareUrl(url)} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={16} aria-hidden="true" />
          Share on WhatsApp
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </div>
      <p className="gp-note" aria-live="polite">
        {copied}
      </p>
    </div>
  );
}

/** One coach item's button(s). */
function ItemAction({ action, busy, onSend, onUploadFor, onOpenFixes, onOpenTab, onTypeAnswer }) {
  if (!action?.type) return null;
  switch (action.type) {
    case "upload_photo":
      return (
        <button type="button" className="gp-btn gp-btn-primary gp-a-btn gp-a-btn-sm" disabled={busy} onClick={() => onUploadFor(action.command, action.purpose)}>
          <FiUpload size={16} aria-hidden="true" />
          {action.purpose === "photo" ? "Upload photos" : PURPOSE_LABELS[action.purpose] || "Upload a photo"}
        </button>
      );
    case "command":
      return (
        <button type="button" className="gp-btn gp-btn-primary gp-a-btn gp-a-btn-sm" disabled={busy} onClick={() => onSend(action.command)}>
          Ask the AI to do it
        </button>
      );
    case "open_fixes":
      return (
        <button type="button" className="gp-btn gp-btn-primary gp-a-btn gp-a-btn-sm" onClick={onOpenFixes}>
          {typeof action.count === "number" && action.count > 0 ? `Open fixes (${action.count})` : "Open fixes"}
        </button>
      );
    case "review_link":
      return action.url ? <ReviewLinkActions url={action.url} /> : null;
    case "type_answer":
      return (
        <div className="gp-e-stack-sm">
          {action.question && <p className="gp-a-question">{action.question}</p>}
          <div className="gp-btns gp-a-btns">
            <button type="button" className="gp-btn gp-btn-ghost gp-a-btn" onClick={() => onTypeAnswer(action.command_prefix || "")}>
              Type answer
            </button>
          </div>
        </div>
      );
    case "open_tab":
      return TAB_LABELS[action.tab] ? (
        <button type="button" className="gp-btn gp-btn-ghost gp-a-btn" onClick={() => onOpenTab?.(action.tab)}>
          {TAB_LABELS[action.tab]}
        </button>
      ) : null;
    default:
      return null;
  }
}

/** Today's assistant message: loading, error (Try again), nothing to do, or the items. */
export default function AssistantCoach({ coach, busy, onSend, onUploadFor, onOpenFixes, onOpenTab, onTypeAnswer }) {
  if (coach.status === "loading") {
    return (
      <AssistantBubble>
        <span className="gp-a-typing" role="status">
          <Spinner animation="border" size="sm" aria-hidden="true" />
          <span className="gp-note">Loading today's tips…</span>
        </span>
      </AssistantBubble>
    );
  }
  if (coach.status === "error") {
    return (
      <AssistantBubble>
        <div className="gp-e-stack-sm">
          <p className="gp-a-error" role="alert">
            {chatErrorText(coach.error, "We couldn't load today's tips.")}
          </p>
          <div className="gp-btns">
            <RefreshButton onClick={() => coach.reload()}>Try again</RefreshButton>
          </div>
        </div>
      </AssistantBubble>
    );
  }

  const items = listOf(coach.data?.items);
  if (items.length === 0) {
    return (
      <AssistantBubble>
        <p className="gp-a-text">Your profile looks complete today. Ask me anything about it.</p>
      </AssistantBubble>
    );
  }

  // 2026-10-27: one message with a short list (one bubble, not one per tip).
  return (
    <AssistantBubble wide>
      <p className="gp-a-text">Here's what will help your Google profile today:</p>
      <ol className="gp-e-plain gp-a-tips">
        {items.map((item, index) => (
          <li key={item.key || index} className="gp-a-tip">
            <div className="gp-a-tip-head">
              <span className="gp-a-tip-num" aria-hidden="true">
                {index + 1}
              </span>
              <p className="gp-a-tip-title">
                <span className="visually-hidden">
                  Tip {index + 1} of {items.length}:{" "}
                </span>
                {item.title}
              </p>
              {typeof item.points === "number" && item.points > 0 && (
                <span className="gp-chip gp-chip-pink">+{item.points} points</span>
              )}
            </div>
            <div className="gp-a-tip-body">
              {item.message && <p className="gp-a-text gp-a-tip-text">{item.message}</p>}
              <ItemAction
                action={item.action}
                busy={busy}
                onSend={onSend}
                onUploadFor={onUploadFor}
                onOpenFixes={onOpenFixes}
                onOpenTab={onOpenTab}
                onTypeAnswer={onTypeAnswer}
              />
            </div>
          </li>
        ))}
      </ol>
    </AssistantBubble>
  );
}
