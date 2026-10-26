// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.4).
// AI assistant chat bubbles (helper D): the vendor's message (with its photo), the assistant's message, the
// "the AI is writing" indicator, and an attached photo. Photos the HappyWedz server serves load with the vendor's token.
import { HiOutlineSparkles } from "react-icons/hi";
import { AuthImage } from "./ProfileShared";

/** The vendor's message, on the right. */
export function UserBubble({ text, attachments = [], localPreview = null }) {
  const photos = attachments.filter((a) => a && (a.kind === "image" || a.url));
  return (
    <div className="gp-a-row is-user">
      <div className="gp-a-bubble is-user">
        <span className="visually-hidden">You: </span>
        {(localPreview || photos.length > 0) && (
          <span className="gp-a-photos">
            {localPreview ? (
              <img src={localPreview} alt="Your photo" className="gp-a-photo" />
            ) : (
              photos.map((a) => <AuthImage key={a.id || a.url} src={a.url} alt={a.name || "Your photo"} className="gp-a-photo" />)
            )}
          </span>
        )}
        <span className="gp-a-text">{text}</span>
      </div>
    </div>
  );
}

/** The assistant's message, on the left, with its mark. */
export function AssistantBubble({ children, wide = false, label = "AI assistant" }) {
  return (
    <div className="gp-a-row is-ai">
      <span className="gp-a-avatar" aria-hidden="true">
        <HiOutlineSparkles size={16} />
      </span>
      <div className={`gp-a-bubble is-ai${wide ? " is-wide" : ""}`}>
        <span className="visually-hidden">{label}: </span>
        {children}
      </div>
    </div>
  );
}

/** Shown while the AI works on an answer (it can take up to a minute). */
export function TypingIndicator({ label = "The AI is writing… This can take up to a minute." }) {
  return (
    <AssistantBubble>
      <span className="gp-a-typing" role="status">
        <span className="gp-a-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="gp-note">{label}</span>
      </span>
    </AssistantBubble>
  );
}
