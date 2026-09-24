import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { LOST_REASONS, rupees } from "./crmFormat";

/**
 * Moving a client to Lost or Cancelled. The reason is asked for once, in one
 * tap, because it is the only way the analytics screen can ever say why work is
 * being lost — nobody types it twice.
 */
const StageMoveModal = ({ client, status: initialStatus, reasons = LOST_REASONS, saving, error, onClose, onConfirm }) => {
  const [status, setStatus] = useState(initialStatus === "cancelled" ? "cancelled" : "lost");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!reason) return;
    onConfirm({ status, reason, note: note.trim() });
  };

  return (
    <Modal show onHide={onClose} centered className="crm-modal" backdrop="static">
      <form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>Move {client.name} out of the pipeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="crm-muted crm-small" style={{ marginBottom: 14 }}>
            {client.firstEventDate ? `${client.events?.[0]?.name || "Event"} · ` : ""}
            {rupees(client.money?.finalPaise || 0)}
          </div>

          <div className="crm-field">
            <label className="crm-label">What happened?</label>
            <div className="crm-pills">
              <button type="button" className={`crm-pill ${status === "lost" ? "is-on" : ""}`} onClick={() => setStatus("lost")}>
                Lost — they went elsewhere
              </button>
              <button type="button" className={`crm-pill ${status === "cancelled" ? "is-on" : ""}`} onClick={() => setStatus("cancelled")}>
                Cancelled — the booking is off
              </button>
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Why? *</label>
            <div className="crm-pills">
              {reasons.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`crm-pill ${reason === r.id ? "is-on" : ""}`}
                  onClick={() => setReason(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {touched && !reason && <div className="crm-error crm-small">Pick a reason so you can see later why work is lost.</div>}
          </div>

          <div className="crm-field">
            <label className="crm-label" htmlFor="crm-lost-note">Note (optional)</label>
            <textarea
              id="crm-lost-note"
              className="crm-input"
              rows={2}
              maxLength={300}
              value={note}
              placeholder="Asked for 1.8L against our 2.4L quote."
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && <div className="crm-error">{error}</div>}
          <div className="crm-muted crm-small">
            This goes on the client's timeline, and into the reasons chart. You can move the client back at any time.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="crm-btn" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>
            {saving ? "Moving…" : `Move to ${status === "lost" ? "Lost" : "Cancelled"}`}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default StageMoveModal;
