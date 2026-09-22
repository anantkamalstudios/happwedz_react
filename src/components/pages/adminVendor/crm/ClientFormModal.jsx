import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Plus, Trash2 } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { CLIENT_STATUSES, EVENT_SUGGESTIONS, INDIAN_STATES, LEAD_SOURCES, rupees, toPaise, toRupeeInput } from "./crmFormat";
import { RupeeInput } from "./crmUi";

const blankEvent = (name = "") => ({ key: Math.random().toString(36).slice(2), id: null, name, eventDate: "", venue: "", price: "" });

/**
 * Add or edit a client, with their events (each event has its own price).
 * Pass `client` and `events` to edit.
 */
const ClientFormModal = ({ client, events: initialEvents, onClose, onSaved }) => {
  const editing = !!client;
  const [form, setForm] = useState(() => ({
    name: client?.name || "",
    phone: client?.phone || "",
    email: client?.email || "",
    location: client?.location || "",
    state: client?.state || "",
    leadSource: client?.leadSource || "other",
    status: client?.status || "lead",
    description: client?.description || "",
    additionalNote: client?.additionalNote || "",
    additionalInfo: client?.additionalInfo || "",
    paymentDueDate: client?.paymentDueDate || "",
    pendingNote: client?.pendingNote || "",
  }));
  const [events, setEvents] = useState(() =>
    initialEvents?.length
      ? initialEvents.map((e) => ({ key: String(e.id), id: e.id, name: e.name, eventDate: e.eventDate || "", venue: e.venue || "", price: toRupeeInput(e.pricePaise) }))
      : [blankEvent("Wedding")],
  );
  const [showMore, setShowMore] = useState(editing && !!(client.additionalNote || client.additionalInfo || client.paymentDueDate || client.pendingNote));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setEvent = (key, field, value) => setEvents((list) => list.map((ev) => (ev.key === key ? { ...ev, [field]: value } : ev)));

  const eventsTotal = events.reduce((sum, ev) => sum + (toPaise(ev.price) || 0), 0);
  const unusedSuggestions = EVENT_SUGGESTIONS.filter((name) => !events.some((ev) => ev.name.trim().toLowerCase() === name.toLowerCase()));

  const addEvent = (name = "") => {
    setEvents((list) => {
      // Fill an untouched empty row instead of adding another.
      const empty = list.find((ev) => !ev.name.trim() && !ev.eventDate && !ev.price);
      if (empty && name) return list.map((ev) => (ev === empty ? { ...ev, name } : ev));
      return [...list, blankEvent(name)];
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Enter the client's name.");
    const filled = events.filter((ev) => ev.name.trim() || ev.eventDate || ev.venue || ev.price);
    if (filled.some((ev) => !ev.name.trim())) return setError("Give every event a name, or remove the empty row.");
    if (filled.some((ev) => Number.isNaN(toPaise(ev.price)))) return setError("Check the event prices.");

    const body = {
      ...form,
      events: filled.map((ev) => ({ id: ev.id, name: ev.name.trim(), eventDate: ev.eventDate || null, venue: ev.venue, pricePaise: toPaise(ev.price) })),
    };
    setSaving(true);
    try {
      const result = editing ? await crmApi.updateClient(client.id, body) : await crmApi.createClient(body);
      onSaved(result.client);
    } catch (err) {
      setError(errorMessage(err, "Could not save the client."));
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="lg" centered className="crm-modal" dialogClassName="crm-dialog-lg" backdrop="static">
      <form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit client" : "Add client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="crm-grid-2">
            <div className="crm-field">
              <label className="crm-label">Client name *</label>
              <input className="crm-input" value={form.name} onChange={set("name")} placeholder="e.g. Riya & Arjun" autoFocus maxLength={150} />
            </div>
            <div className="crm-field">
              <label className="crm-label">Phone</label>
              <input className="crm-input" value={form.phone} onChange={set("phone")} inputMode="tel" maxLength={20} />
            </div>
            <div className="crm-field">
              <label className="crm-label">Email</label>
              <input className="crm-input" type="email" value={form.email} onChange={set("email")} maxLength={150} />
              <div className="crm-hint">Needed to email quotations and invoices.</div>
            </div>
            <div className="crm-field">
              <label className="crm-label">Location</label>
              <input className="crm-input" value={form.location} onChange={set("location")} placeholder="City or address" maxLength={200} />
            </div>
            <div className="crm-field">
              <label className="crm-label">State</label>
              <select className="crm-input" value={form.state} onChange={set("state")}>
                <option value="">Not set</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="crm-hint">Used for GST: same state as you → CGST + SGST, other state → IGST.</div>
            </div>
            <div className="crm-grid-2" style={{ gap: "0 10px" }}>
              <div className="crm-field">
                <label className="crm-label">Lead source</label>
                <select className="crm-input" value={form.leadSource} onChange={set("leadSource")}>
                  {LEAD_SOURCES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="crm-field">
                <label className="crm-label">Status</label>
                <select className="crm-input" value={form.status} onChange={set("status")}>
                  {CLIENT_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="crm-section-label">
            <span>Events</span>
            <span className="crm-muted" style={{ fontWeight: 600 }}>Total {rupees(eventsTotal)}</span>
          </div>
          {unusedSuggestions.length > 0 && (
            <div className="crm-suggestions">
              {unusedSuggestions.map((name) => (
                <button type="button" key={name} className="crm-suggestion" onClick={() => addEvent(name)}>
                  + {name}
                </button>
              ))}
            </div>
          )}
          {events.map((ev) => (
            <div className="crm-event-row" key={ev.key}>
              <input className="crm-input" placeholder="Event name" value={ev.name} onChange={(e) => setEvent(ev.key, "name", e.target.value)} maxLength={100} aria-label="Event name" />
              <input className="crm-input" type="date" value={ev.eventDate} onChange={(e) => setEvent(ev.key, "eventDate", e.target.value)} aria-label="Event date" />
              <input className="crm-input" placeholder="Venue" value={ev.venue} onChange={(e) => setEvent(ev.key, "venue", e.target.value)} maxLength={200} aria-label="Venue" />
              <RupeeInput value={ev.price} onChange={(value) => setEvent(ev.key, "price", value)} aria-label="Price" />
              <button type="button" className="crm-icon-btn" onClick={() => setEvents((list) => list.filter((x) => x.key !== ev.key))} aria-label="Remove event">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button type="button" className="crm-btn crm-btn-sm" onClick={() => addEvent()} style={{ marginBottom: 16 }}>
            <Plus size={14} /> Add event
          </button>

          <div className="crm-field">
            <label className="crm-label">Description</label>
            <textarea className="crm-input" value={form.description} onChange={set("description")} placeholder="What the client wants" maxLength={4000} />
          </div>

          {!showMore ? (
            <button type="button" className="crm-link" onClick={() => setShowMore(true)}>
              + Notes, payment due date and more
            </button>
          ) : (
            <>
              <div className="crm-grid-2">
                <div className="crm-field">
                  <label className="crm-label">Additional note</label>
                  <textarea className="crm-input" value={form.additionalNote} onChange={set("additionalNote")} maxLength={4000} />
                </div>
                <div className="crm-field">
                  <label className="crm-label">Additional information</label>
                  <textarea className="crm-input" value={form.additionalInfo} onChange={set("additionalInfo")} maxLength={4000} />
                </div>
                <div className="crm-field">
                  <label className="crm-label">Balance due by</label>
                  <input className="crm-input" type="date" value={form.paymentDueDate} onChange={set("paymentDueDate")} />
                </div>
                <div className="crm-field">
                  <label className="crm-label">Pending payment note</label>
                  <input className="crm-input" value={form.pendingNote} onChange={set("pendingNote")} placeholder="e.g. Rest after the reception" maxLength={2000} />
                </div>
              </div>
            </>
          )}

          {error && <div className="crm-notice crm-notice-warn" style={{ marginTop: 14, marginBottom: 0 }}>{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="crm-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Add client"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ClientFormModal;
