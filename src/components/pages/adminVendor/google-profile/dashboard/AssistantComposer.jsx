// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.4).
// AI assistant chat — the message box (helper D): text (Enter sends, Shift + Enter for a new line), one photo attached
// (uploaded as soon as it is picked; PNG / JPEG / WebP up to 5 MB), Send, and the starter commands while the chat is
// empty (a chip fills the box, as in GrowthOS). API: assistantApi.attach.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiPaperclip, FiSend, FiX } from "react-icons/fi";
import { assistantApi } from "../../../../../services/api/googleProfileApi";
import { PHOTO_ACCEPT, PROMPT_MAX, chatErrorText, photoProblem } from "./AssistantUtils";

export default function AssistantComposer({ value, onChange, onSend, busy, inputRef, suggestions = [] }) {
  const id = useId();
  const fileRef = useRef(null);
  // { status: uploading | ready | error, name, preview, data, error }
  const [attachment, setAttachment] = useState(null);
  const latest = useRef(null);
  latest.current = attachment;

  // The photo preview is freed when the box goes away (a sent photo's preview belongs to the chat then).
  useEffect(
    () => () => {
      if (latest.current?.preview) URL.revokeObjectURL(latest.current.preview);
    },
    [],
  );

  const removeAttachment = () => {
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
    inputRef.current?.focus();
  };

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    const problem = photoProblem(file);
    if (problem) {
      setAttachment({ status: "error", name: file.name, preview: null, data: null, error: problem });
      return;
    }
    const preview = URL.createObjectURL(file);
    setAttachment({ status: "uploading", name: file.name, preview, data: null, error: null });
    try {
      const data = await assistantApi.attach(file);
      if (!data?.id) throw new Error("no id");
      setAttachment((cur) => (cur?.preview === preview ? { ...cur, status: "ready", data } : cur));
    } catch (err) {
      setAttachment((cur) =>
        cur?.preview === preview
          ? { ...cur, status: "error", error: chatErrorText(err, "The photo did not upload. Please try again.") }
          : cur,
      );
    }
  };

  const uploading = attachment?.status === "uploading";
  const text = value.trim();
  const canSend = !busy && !uploading && text.length > 0 && text.length <= PROMPT_MAX;

  const send = () => {
    if (!canSend) return;
    const ready = attachment?.status === "ready" ? attachment : null;
    onSend(text, ready ? { id: ready.data.id, name: ready.name, url: ready.data.url ?? null, preview: ready.preview } : null);
    // A sent photo's preview is shown in the chat; a failed one is dropped here.
    if (!ready && attachment?.preview) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  };

  return (
    <form
      className="gp-a-composer"
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
    >
      {suggestions.length > 0 && (
        <div className="gp-e-stack-sm">
          <p className="gp-note" id={`${id}-sugg`}>
            Try one of these:
          </p>
          <ul className="gp-e-plain gp-a-chips" aria-labelledby={`${id}-sugg`}>
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="gp-a-chip"
                  onClick={() => {
                    onChange(s);
                    inputRef.current?.focus();
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {attachment && (
        <div className={`gp-a-attach${attachment.status === "error" ? " is-error" : ""}`}>
          {attachment.preview ? (
            <img src={attachment.preview} alt="" className="gp-a-attach-img" />
          ) : (
            <FiPaperclip size={18} aria-hidden="true" />
          )}
          <span className="gp-a-attach-text">
            <span className="gp-a-attach-name">{attachment.name}</span>
            <span className={attachment.status === "error" ? "gp-a-error" : "gp-note"} role={attachment.status === "error" ? "alert" : "status"}>
              {attachment.status === "uploading" && (
                <>
                  <Spinner animation="border" size="sm" aria-hidden="true" /> Uploading…
                </>
              )}
              {attachment.status === "ready" && "Photo ready. It goes with your next message."}
              {attachment.status === "error" && attachment.error}
            </span>
          </span>
          <button type="button" className="gp-e-icon-btn gp-a-attach-x" onClick={removeAttachment} aria-label={`Remove ${attachment.name}`}>
            <FiX size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <label htmlFor={`${id}-input`} className="visually-hidden">
        Message the AI assistant
      </label>
      <div className="gp-a-input-row">
        <input
          ref={fileRef}
          type="file"
          accept={PHOTO_ACCEPT}
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={pick}
        />
        <button
          type="button"
          className="gp-a-icon-btn"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="Attach a photo"
          title="Attach a photo"
        >
          <FiPaperclip size={18} aria-hidden="true" />
        </button>
        <textarea
          id={`${id}-input`}
          ref={inputRef}
          className="form-control gp-a-input"
          rows={2}
          value={value}
          maxLength={PROMPT_MAX}
          placeholder="Ask anything, or tell the AI what to change"
          aria-describedby={`${id}-hint`}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="submit" className="gp-btn gp-btn-primary gp-a-send" disabled={!canSend} aria-busy={busy || undefined}>
          {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiSend size={16} aria-hidden="true" />}
          <span className="gp-a-send-text">Send</span>
        </button>
      </div>
      <p className="gp-note gp-a-hint" id={`${id}-hint`}>
        <span>Enter to send · Shift + Enter for a new line</span>
        <span>
          {value.length} / {PROMPT_MAX}
        </span>
      </p>
    </form>
  );
}
