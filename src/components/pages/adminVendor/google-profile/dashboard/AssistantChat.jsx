// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.4).
// AI assistant chat (helper D) — GrowthOS's Command Center for the Google profile, inside "Improve with AI": today's
// message (coach items with their action buttons), the chat of the last 30 days (questions with their answers,
// command cards), and the message box with one photo. A message is read as a question (the answer text) or a command
// (a card that changes nothing until the vendor presses Apply / Publish to Google). "Clear chat" asks first.
// API: assistantApi.coach / history / suggestions / send / attach / clear (+ the card's calls).
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiTrash2 } from "react-icons/fi";
import { assistantApi, gpManageApi } from "../../../../../services/api/googleProfileApi";
import { RefreshButton } from "../GpParts";
import AssistantCoach from "./AssistantCoach";
import AssistantCommandCard from "./AssistantCommandCard";
import AssistantComposer from "./AssistantComposer";
import { AssistantBubble, TypingIndicator, UserBubble } from "./AssistantMessage";
import {
  PHOTO_ACCEPT,
  announcementOf,
  chatErrorText,
  listOf,
  messageError,
  newKey,
  photoProblem,
  prefersReducedMotion,
  suggestionTexts,
  turnsFromHistory,
} from "./AssistantUtils";
import { ConfirmBox } from "./ProfileShared";
import { useLoad } from "./ImproveUtils";
import "./dashboard-assistant.css";

/** "Add more photos" in today's tips: at most this many photos in one go. */
const PHOTOS_AT_ONCE = 10;

export default function AssistantChat({ onOpenTab, onOpenFixes, onChanged }) {
  const id = useId();
  const coach = useLoad(assistantApi.coach);
  const history = useLoad(assistantApi.history);
  const suggestions = useLoad(assistantApi.suggestions);

  const [fresh, setFresh] = useState([]); // this visit's turns
  const [busy, setBusy] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [photoNote, setPhotoNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState(null);

  const inputRef = useRef(null);
  const logRef = useRef(null);
  const coachFileRef = useRef(null);
  const coachCommand = useRef("");
  const previews = useRef(new Set());

  // Photo previews of sent messages are freed when the chat goes away.
  useEffect(() => {
    const set = previews.current;
    return () => set.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  // 2026-10-27: the chat opens at its newest message (today's AI message is the last one), like a messenger; new
  // messages scroll to the end too.
  const opened = useRef(false);
  useEffect(() => {
    const log = logRef.current;
    if (!log || history.status === "loading" || coach.status === "loading") return;
    if (!opened.current) {
      opened.current = true;
      log.scrollTop = log.scrollHeight;
      return;
    }
    if (fresh.length === 0) return;
    log.scrollTo({ top: log.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [fresh, busy, history.status, coach.status]);

  /** Sends one message (with a photo already uploaded, or a file to upload first) and shows the answer. */
  const submit = useCallback(async ({ text, attachment = null, file = null, preview = null }) => {
    if (!text) return;
    const key = newKey();
    if (preview) previews.current.add(preview);
    const base = { key, text, preview, attachments: attachment ? [attachment] : [] };
    setFresh((list) => [...list, { ...base, type: "pending", stage: file && !attachment ? "upload" : "ai" }]);
    setBusy(true);
    setAnnouncement("");
    let sent = attachment;
    let turn;
    try {
      if (!sent && file) {
        const data = await assistantApi.attach(file);
        if (!data?.id) throw messageError("The photo did not upload. Please try again.");
        sent = { id: data.id, name: data.name || file.name, url: data.url ?? null };
        setFresh((list) => list.map((t) => (t.key === key ? { ...t, stage: "ai", attachments: [sent] } : t)));
      }
      const answer = await assistantApi.send(text, sent?.id);
      if (answer?.kind === "command" && answer.command) {
        turn = { ...base, attachments: sent ? [sent] : [], type: "command", command: answer.command };
      } else if (answer?.kind === "question") {
        turn = { ...base, attachments: sent ? [sent] : [], type: "question", answer: answer.answer ?? "" };
      } else {
        throw messageError("We couldn't read the AI's answer. Please try again.");
      }
    } catch (error) {
      turn = { ...base, attachments: sent ? [sent] : [], type: "failed", error, attachment: sent, file: sent ? null : file };
    }
    setFresh((list) => list.map((t) => (t.key === key ? turn : t)));
    setAnnouncement(announcementOf(turn));
    setBusy(false);
  }, []);

  const sendText = (text, attachment) => {
    if (busy) return;
    setPrompt("");
    setPhotoNote("");
    submit({ text, attachment, preview: attachment?.preview || null });
  };

  const retry = (turn) => {
    if (busy) return;
    setFresh((list) => list.filter((t) => t.key !== turn.key));
    submit({ text: turn.text, attachment: turn.attachment, file: turn.file, preview: turn.preview });
  };

  // Coach "Upload photo": pick a photo, then send the item's command with it. 2026-10-27: "Add more photos"
  // (purpose photo) takes up to PHOTOS_AT_ONCE photos and sends them straight to Google as photos (category Other),
  // one by one, without the AI.
  const coachMany = useRef(false);
  const onUploadFor = (command, purpose) => {
    if (busy) return;
    coachCommand.current = command || "";
    coachMany.current = purpose === "photo";
    setPhotoNote("");
    if (coachFileRef.current) coachFileRef.current.multiple = coachMany.current;
    coachFileRef.current?.click();
  };

  const sendPhotos = async (files) => {
    const key = newKey();
    const shown = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      previews.current.add(url);
      return { id: `${key}-${i}`, kind: "image", name: file.name, url };
    });
    const text = files.length === 1 ? "Add this photo to my Google profile" : `Add these ${files.length} photos to my Google profile`;
    const base = { key, text, preview: null, attachments: shown };
    const pending = (done) => ({ ...base, type: "pending", stage: "upload", label: `Sending photo ${done + 1} of ${files.length} to Google…` });
    setFresh((list) => [...list, pending(0)]);
    setBusy(true);
    setAnnouncement("");
    let sent = 0;
    const failed = [];
    for (let i = 0; i < files.length; i += 1) {
      setFresh((list) => list.map((t) => (t.key === key ? pending(i) : t)));
      try {
        await gpManageApi.addPhoto(files[i], "ADDITIONAL");
        sent += 1;
      } catch (error) {
        failed.push(`${files[i].name}: ${error?.response?.data?.message || "not sent"}`);
      }
    }
    const answer = [
      sent ? `${sent} ${sent === 1 ? "photo" : "photos"} sent to Google as "Other". Google checks photos before showing them.` : "No photo was sent.",
      ...(failed.length ? ["Not sent:", ...failed] : []),
    ].join("\n");
    const turn = { ...base, type: "question", answer };
    setFresh((list) => list.map((t) => (t.key === key ? turn : t)));
    setAnnouncement(answer);
    setBusy(false);
    if (sent) onChanged?.();
  };

  const onCoachFile = (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (coachMany.current && picked.length) {
      const bad = picked.map((f) => photoProblem(f)).find(Boolean);
      const good = picked.filter((f) => !photoProblem(f));
      const extra = good.length > PHOTOS_AT_ONCE ? ` Only the first ${PHOTOS_AT_ONCE} are sent; add the rest after.` : "";
      setPhotoNote(bad ? `Some photos were left out: ${bad}${extra}` : extra.trim());
      if (good.length) sendPhotos(good.slice(0, PHOTOS_AT_ONCE));
      return;
    }
    const file = picked[0];
    const text = coachCommand.current;
    if (!file || !text) return;
    const problem = photoProblem(file);
    if (problem) {
      setPhotoNote(problem);
      return;
    }
    setPhotoNote("");
    submit({ text, file, preview: URL.createObjectURL(file) });
  };

  // Coach "Type answer": the box starts with the command, the vendor types the rest.
  const onTypeAnswer = (prefix) => {
    setPrompt(prefix);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(prefix.length, prefix.length);
    });
  };

  // A card that changed (Apply, Undo, Choose …): in this visit's turns, or in the loaded chat.
  const replaceCommand = (next) => {
    if (fresh.some((t) => t.type === "command" && t.command.id === next.id)) {
      setFresh((list) => list.map((t) => (t.type === "command" && t.command.id === next.id ? { ...t, command: next } : t)));
    } else {
      history.setData((rows) => listOf(rows).map((r) => (r.id === next.id ? next : r)));
    }
  };

  const clear = async () => {
    setClearing(true);
    setClearError(null);
    try {
      await assistantApi.clear();
      history.setData([]);
      previews.current.forEach((url) => URL.revokeObjectURL(url));
      previews.current.clear();
      setFresh([]);
      setConfirming(false);
      setAnnouncement("The chat is cleared.");
      inputRef.current?.focus();
    } catch (err) {
      setClearError(err);
    } finally {
      setClearing(false);
    }
  };

  const freshIds = new Set(fresh.filter((t) => t.type === "command").map((t) => t.command.id));
  const past = history.status === "ready" ? turnsFromHistory(history.data).filter((t) => !freshIds.has(t.command?.id ?? "")) : [];
  const turns = [...past, ...fresh];
  const empty = history.status !== "loading" && turns.length === 0;
  const starters = empty && suggestions.status === "ready" ? suggestionTexts(suggestions.data).slice(0, 6) : [];

  const renderTurn = (turn, compact = false) => (
    <li key={turn.key} className="gp-a-turn">
      <UserBubble text={turn.text} attachments={turn.attachments} localPreview={turn.preview} />
      {turn.type === "pending" && (
        <TypingIndicator
          label={turn.label || (turn.stage === "upload" ? "Uploading your photo…" : "The AI is writing… This can take up to a minute.")}
        />
      )}
      {turn.type === "question" && (
        <AssistantBubble>
          <p className="gp-a-text gp-a-answer">{turn.answer || "The AI had no answer this time. Please ask again."}</p>
        </AssistantBubble>
      )}
      {turn.type === "command" && (
        <AssistantBubble wide>
          <AssistantCommandCard
            command={turn.command}
            onChange={replaceCommand}
            onChanged={onChanged}
            onOpenTab={onOpenTab}
            compact={compact}
          />
        </AssistantBubble>
      )}
      {turn.type === "failed" && (
        <AssistantBubble>
          <div className="gp-e-stack-sm">
            <p className="gp-a-error">{chatErrorText(turn.error)}</p>
            <div className="gp-btns">
              <RefreshButton onClick={() => retry(turn)} disabled={busy}>
                Try again
              </RefreshButton>
            </div>
          </div>
        </AssistantBubble>
      )}
    </li>
  );

  return (
    <section className="gp-card gp-a-chat" aria-labelledby={`${id}-title`}>
      <div className="gp-a-chat-head">
        <div className="gp-e-stack-sm">
          <h3 className="gp-h3" id={`${id}-title`}>
            AI assistant
          </h3>
          <p className="gp-note">Ask about your profile or tell the AI what to change. Nothing goes to Google until you tap.</p>
        </div>
        {turns.length > 0 && !confirming && (
          <button type="button" className="gp-btn gp-btn-ghost gp-a-btn gp-a-btn-sm" onClick={() => setConfirming(true)} disabled={busy}>
            <FiTrash2 size={16} aria-hidden="true" />
            Clear chat
          </button>
        )}
      </div>

      {confirming && (
        <ConfirmBox
          title="Clear the chat?"
          confirmLabel="Clear chat"
          tone="bad"
          busy={clearing}
          error={clearError}
          onConfirm={clear}
          onCancel={() => {
            setConfirming(false);
            setClearError(null);
          }}
        >
          This removes your messages and the AI's answers from this chat. Changes already made on Google stay.
        </ConfirmBox>
      )}

      <div
        className="gp-a-log"
        ref={logRef}
        role="region"
        aria-label="Chat with the AI assistant"
        tabIndex={0}
      >
        <ol className="gp-e-plain gp-a-turns">
          {history.status === "loading" && (
            <li className="gp-a-turn">
              <p className="gp-a-typing gp-note" role="status">
                <Spinner animation="border" size="sm" aria-hidden="true" /> Loading your chat…
              </p>
            </li>
          )}
          {history.status === "error" && (
            <li className="gp-a-turn">
              <AssistantBubble>
                <div className="gp-e-stack-sm">
                  <p className="gp-a-error" role="alert">
                    {chatErrorText(history.error, "We couldn't load your earlier messages.")}
                  </p>
                  <div className="gp-btns">
                    <RefreshButton onClick={() => history.reload()}>Try again</RefreshButton>
                  </div>
                </div>
              </AssistantBubble>
            </li>
          )}
          {/* Earlier visits' finished cards are short; today's AI message comes after them, then this visit's messages. */}
          {past.map((turn) => renderTurn(turn, true))}
          <li className="gp-a-turn">
            <AssistantCoach
              coach={coach}
              busy={busy}
              onSend={(text) => sendText(text, null)}
              onUploadFor={onUploadFor}
              onOpenFixes={onOpenFixes}
              onOpenTab={onOpenTab}
              onTypeAnswer={onTypeAnswer}
            />
          </li>
          {fresh.map((turn) => renderTurn(turn))}
        </ol>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <input
        ref={coachFileRef}
        type="file"
        accept={PHOTO_ACCEPT}
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onCoachFile}
      />
      {photoNote && (
        <p className="gp-a-error" role="alert">
          {photoNote}
        </p>
      )}

      <AssistantComposer
        value={prompt}
        onChange={setPrompt}
        onSend={sendText}
        busy={busy}
        inputRef={inputRef}
        suggestions={starters}
      />
    </section>
  );
}
