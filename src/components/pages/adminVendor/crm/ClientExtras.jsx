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
