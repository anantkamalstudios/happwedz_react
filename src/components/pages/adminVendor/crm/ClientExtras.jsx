import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  FileText,
  IndianRupee,
  Paperclip,
  PhoneCall,
  Receipt,
  StickyNote,
  Trash2,
  UserPlus,
  XCircle,
} from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { addDaysIso, formatDate, todayIso } from "./crmFormat";
import { useToast } from "../../../layouts/toasts/Toast";

// WhatsApp glyph for share buttons (lucide has no brand icons).
export const WhatsAppIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36A9.38 9.38 0 0 1 2.64 12c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.88.98 6.66 2.77a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.44-9.44 9.44m8.02-17.46A11.27 11.27 0 0 0 12.05.72C5.8.72.72 5.8.72 12.05c0 2 .52 3.95 1.52 5.66L.62 23.5l5.94-1.56a11.3 11.3 0 0 0 5.48 1.4h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01" />
  </svg>
);

const QUICK_DATES = [
  { label: "Tomorrow", days: 1 },
  { label: "In 3 days", days: 3 },
  { label: "Next week", days: 7 },
  { label: "In 2 weeks", days: 14 },
];

/**
 * The client's next follow-up: when to call or message them next, and why.
 */
export const FollowUpBar = ({ client, onSaved }) => {
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [date, setDate] = useState(client.followUpDate || addDaysIso(1));
  const [note, setNote] = useState(client.followUpNote || "");
  const [busy, setBusy] = useState(false);

  const save = async (values, message) => {
    setBusy(true);
    try {
      await crmApi.updateClient(client.id, values);
      setEditing(false);
      addToast(message, "success");
      onSaved();
    } catch (err) {
      addToast(errorMessage(err, "Could not save the follow-up."), "error");
    } finally {
      setBusy(false);
    }
  };

  const startEditing = () => {
    setDate(client.followUpDate || addDaysIso(1));
    setNote(client.followUpNote || "");
    setEditing(true);
  };

  if (editing) {
    return (
      <div className="crm-card crm-card-pad" style={{ marginBottom: 16 }}>
        <div className="crm-card-title" style={{ marginBottom: 8 }}>Next follow-up</div>
        <div className="crm-grid-2">
          <div className="crm-field" style={{ marginBottom: 8 }}>
            <label className="crm-label">Date</label>
            <input className="crm-input" type="date" value={date} min={todayIso()} onChange={(e) => setDate(e.target.value)} />
            <div className="crm-quick">
              {QUICK_DATES.map((q) => (
                <button key={q.days} type="button" className="crm-suggestion" onClick={() => setDate(addDaysIso(q.days))}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
          <div className="crm-field" style={{ marginBottom: 8 }}>
            <label className="crm-label">What about?</label>
            <input className="crm-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Confirm the Sangeet venue" maxLength={300} />
          </div>
        </div>
        <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
          <button className="crm-btn crm-btn-sm" onClick={() => setEditing(false)} disabled={busy}>Cancel</button>
          <button
            className="crm-btn crm-btn-primary crm-btn-sm"
            disabled={busy || !date}
            onClick={() => save({ followUpDate: date, followUpNote: note.trim() || null }, `Follow-up set for ${formatDate(date)}.`)}
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  if (!client.followUpDate) {
    return (
      <div style={{ marginBottom: 12 }}>
        <button className="crm-link crm-small" onClick={startEditing} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <PhoneCall size={13} /> Set a follow-up reminder
        </button>
      </div>
    );
  }

  const today = todayIso();
  const due = client.followUpDate <= today;
  return (
    <div className={`crm-follow ${due ? "is-due" : ""}`}>
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center", minWidth: 0 }}>
        <PhoneCall size={16} />
        <span>
          <strong>
            {client.followUpDate === today ? "Follow up today" : due ? `Follow-up overdue since ${formatDate(client.followUpDate)}` : `Follow up on ${formatDate(client.followUpDate)}`}
          </strong>
          {client.followUpNote ? ` — ${client.followUpNote}` : ""}
        </span>
      </span>
      <span className="crm-actions">
        <button className="crm-btn crm-btn-sm" onClick={startEditing} disabled={busy}>Change</button>
        <button className="crm-btn crm-btn-sm" onClick={() => save({ followUpDate: null, followUpNote: null }, "Follow-up done.")} disabled={busy}>
          <CheckCircle2 size={14} /> Done
        </button>
      </span>
    </div>
  );
};

const ICONS = {
  client: UserPlus,
  quotation: FileText,
  accepted: CheckCircle2,
  rejected: XCircle,
  invoice: Receipt,
  cancelled: XCircle,
  payment: IndianRupee,
  reminder: Bell,
  file: Paperclip,
  note: StickyNote,
};

const formatWhen = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

const SHOW_FIRST = 8;

/**
 * Notes the vendor keeps about a client, mixed in with everything the CRM
 * recorded (quotations, invoices, payments, reminders), newest first.
 */
export const ActivityCard = ({ clientId, activity, onChanged }) => {
  const { addToast } = useToast();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await crmApi.addNote(clientId, text);
      setText("");
      onChanged();
    } catch (err) {
      addToast(errorMessage(err, "Could not save the note."), "error");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (noteId) => {
    try {
      await crmApi.deleteNote(noteId);
      onChanged();
    } catch (err) {
      addToast(errorMessage(err, "Could not delete the note."), "error");
    }
  };

  const shown = showAll ? activity : activity.slice(0, SHOW_FIRST);

  return (
    <div className="crm-card crm-card-pad">
      <div className="crm-card-title">Notes &amp; activity</div>
      <form onSubmit={add} style={{ marginBottom: 12 }}>
        <textarea
          className="crm-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note — a call, a meeting, what the client asked for…"
          maxLength={4000}
          style={{ minHeight: 60 }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) add(e);
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button type="submit" className="crm-btn crm-btn-primary crm-btn-sm" disabled={busy || !text.trim()}>
            {busy ? "Saving…" : "Add note"}
          </button>
        </div>
      </form>
      <ul className="crm-timeline">
        {shown.map((item, index) => {
          const Icon = ICONS[item.type] || FileText;
          return (
            <li key={`${item.type}-${item.noteId || index}`}>
              <span className={`crm-timeline-icon is-${item.type}`}>
                <Icon size={13} />
              </span>
              <span className="crm-timeline-body">
                <span className={item.type === "note" ? "crm-timeline-note" : undefined} style={item.type === "note" ? { display: "block" } : undefined}>
                  {item.text}
                </span>
                <span className="crm-timeline-when">
                  {formatWhen(item.at)}
                  {item.by ? ` · ${item.by}` : ""}
                </span>
              </span>
              {item.type === "note" && (
                <button className="crm-btn crm-btn-sm crm-btn-ghost crm-btn-danger" onClick={() => remove(item.noteId)} aria-label="Delete note" style={{ alignSelf: "flex-start" }}>
                  <Trash2 size={13} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {activity.length > SHOW_FIRST && (
        <button className="crm-link crm-small" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : `Show all ${activity.length}`}
        </button>
      )}
    </div>
  );
};

/**
 * A free-text WhatsApp message to the client.
 *
 * WhatsApp only permits this for 24 hours after the CLIENT writes to the
 * business, and Wapzio's API has no way to read incoming messages — so
 * nothing here knows whether that window is open. The send is attempted and
 * the refusal explained, because trying is the only way to find out.
 *
 * That is also why there is no conversation above this box: their replies
 * never reach us.
 */
export const WhatsAppReply = ({ client, connected, onClientChanged }) => {
  // Templates, fetched only when a vendor asks for one. A client's page
  // should not call the provider on every open for a list most visits never
  // need.
  const [templating, setTemplating] = React.useState(false);
  const [templates, setTemplates] = React.useState(null);
  const [templateName, setTemplateName] = React.useState("");
  const [values, setValues] = React.useState({});
  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  // A file is fetched by WhatsApp from a public link, so this is an address
  // rather than an upload.
  const [attaching, setAttaching] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState("");

  const chosen = (templates || []).find((t) => t.name === templateName);

  const openTemplates = async () => {
    setTemplating(true);
    setError("");
    // {{1}} is the client's name in almost every template anyone writes, so
    // it is put there as a real value that can be seen and changed, not as
    // grey placeholder text that looks filled and sends nothing.
    setValues((v) => (v[1] ? v : { ...v, 1: client.name || "" }));
    if (templates) return;
    try {
      const data = await crmApi.whatsappTemplates();
      setTemplates((data.templates || []).filter((t) => t.status === "approved"));
    } catch (err) {
      setError(errorMessage(err, "Could not read your templates."));
      setTemplates([]);
    }
  };

  const sendTemplate = async () => {
    if (!templateName) return;
    setSending(true);
    setError("");
    setSent("");
    try {
      const data = await crmApi.whatsappSendTemplate(client.id, { templateName, variables: values });
      setSent(data.message || `Sent to ${client.name}.`);
      setTemplating(false);
      setTemplateName("");
      setValues({});
    } catch (err) {
      setError(errorMessage(err, "Could not send this template."));
    } finally {
      setSending(false);
    }
  };

  const optedOut = Boolean(client.whatsappOptedOutAt);

  const allowAgain = async () => {
    if (!window.confirm(`${client.name} asked you to stop messaging them. Only do this if they have asked to hear from you again.`)) return;
    setSending(true);
    setError("");
    try {
      const data = await crmApi.clearWhatsappOptOut(client.id);
      setSent(data.message || "They can be messaged again.");
      // The flag lives on the client, so the page it came from has to say so.
      if (typeof onClientChanged === "function") onClientChanged();
    } catch (err) {
      setError(errorMessage(err, "Could not change that."));
    } finally {
      setSending(false);
    }
  };

  if (!connected) return null;

  const send = async (e) => {
    e.preventDefault();
    if (attaching ? !mediaUrl.trim() : !text.trim()) return;
    setSending(true);
    setError("");
    setSent("");
    try {
      if (attaching) {
        // The type is worked out from the address: a PDF is a document to
        // WhatsApp, a JPEG is a photo, and they are not interchangeable.
        const lower = mediaUrl.toLowerCase();
        const type = /\.(jpe?g|png|webp|gif)(\?|$)/.test(lower)
          ? "image"
          : /\.(mp4|mov|3gp)(\?|$)/.test(lower)
            ? "video"
            : /\.(mp3|ogg|m4a|aac)(\?|$)/.test(lower)
              ? "audio"
              : "document";
        await crmApi.whatsappFile(client.id, { type, mediaUrl: mediaUrl.trim(), caption: text.trim() });
        setMediaUrl("");
      } else {
        await crmApi.whatsappReply(client.id, { text: text.trim() });
      }
      setSent(`Sent to ${client.name}.`);
      setText("");
    } catch (err) {
      setError(errorMessage(err, "Could not send this message."));
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="crm-card crm-card-pad" onSubmit={send}>
      <div className="crm-card-title">Message on WhatsApp</div>

      {optedOut ? (
        <div className="crm-notice crm-notice-warn">
          <strong>{client.name} asked you to stop messaging them</strong>
          {client.whatsappOptOutText ? ` — they wrote "${client.whatsappOptOutText}".` : "."} They are
          left out of every broadcast, and messages here will be refused.
          <div className="crm-actions">
            <button type="button" className="crm-btn crm-btn-sm" onClick={allowAgain} disabled={sending}>
              They asked to hear from me again
            </button>
          </div>
        </div>
      ) : null}

      {error ? <div className="crm-error">{error}</div> : null}
      {sent ? <div className="crm-notice crm-notice-info">{sent}</div> : null}

      <div className="crm-field">
        <textarea
          className="crm-input"
          rows={3}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            // A failure left on screen while the vendor retypes reads as
            // though the new attempt failed too.
            if (error) setError("");
          }}
          placeholder={`Write to ${client.name || "this client"}…`}
        />
        <div className="crm-hint">
          A plain message only reaches a client who has written to you in the last 24 hours.
          Outside that, WhatsApp allows approved templates only — send one below, and once they
          reply you can write freely again.
        </div>
      </div>

      {attaching ? (
        <div className="crm-field">
          <label className="crm-label">Web address of the file</label>
          <input
            className="crm-input"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="https://…/venue-photos.pdf"
          />
          <div className="crm-hint">
            WhatsApp fetches the file itself, so it has to be a link anyone can open —
            not a file on your computer.
          </div>
        </div>
      ) : null}

      {templating ? (
        <div className="crm-field">
          <label className="crm-label">Approved template</label>
          {templates === null ? (
            <div className="crm-hint">Reading your templates…</div>
          ) : !templates.length ? (
            <div className="crm-hint">
              You have no approved templates yet. Create one on the WhatsApp screen; Meta has to
              approve it before it can be sent.
            </div>
          ) : (
            <>
              <select
                className="crm-input"
                value={templateName}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                  setValues({});
                  if (error) setError("");
                }}
              >
                <option value="">Choose a template</option>
                {[...new Map(templates.map((t) => [t.name, t])).values()].map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              {chosen?.body ? <p className="crm-note">{chosen.body}</p> : null}

              {/* Only the slots the template uses, where we know. A template
                  made outside HappyWedz reports no wording and no count, so
                  three blanks and a word about why. */}
              {(chosen?.variableCount
                ? Array.from({ length: chosen.variableCount }, (_, i) => i + 1)
                : templateName
                  ? [1, 2, 3]
                  : []
              ).map((n) => (
                <div className="crm-field" key={n}>
                  <label className="crm-label">{`{{${n}}}`}</label>
                  {/* No placeholder. Greyed-out text in an empty box reads as
                      a filled one — the client's name sat in {{1}} looking
                      saved, and the template went out with it blank. */}
                  <input
                    className="crm-input"
                    value={values[n] || ""}
                    onChange={(e) => setValues((v) => ({ ...v, [n]: e.target.value }))}
                  />
                </div>
              ))}

              {templateName && !chosen?.variableCount ? (
                <div className="crm-hint">
                  This template was made outside HappyWedz, so we cannot show its wording or how
                  many values it takes. Fill in the ones it uses and leave the rest blank.
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}

      <div className="crm-actions">
        <button
          type="button"
          className="crm-btn crm-btn-sm"
          onClick={() => (templating ? setTemplating(false) : openTemplates())}
          disabled={sending}
        >
          {templating ? "Back to a message" : "Send a template"}
        </button>
        <button
          type="button"
          className="crm-btn crm-btn-sm"
          onClick={() => setAttaching((v) => !v)}
          disabled={sending}
        >
          {attaching ? "Just a message" : "Attach a photo or file"}
        </button>
        {templating ? (
          <button
            type="button"
            className="crm-btn crm-btn-primary"
            onClick={sendTemplate}
            disabled={sending || !templateName}
          >
            <WhatsAppIcon /> {sending ? "Sending…" : templateName ? "Send template" : "Choose a template"}
          </button>
        ) : (
          <button
            type="submit"
            className="crm-btn crm-btn-primary"
            disabled={sending || (attaching ? !mediaUrl.trim() : !text.trim())}
          >
            <WhatsAppIcon /> {sending ? "Sending…" : "Send"}
          </button>
        )}
      </div>
    </form>
  );
};
