import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { crmApi, errorMessage } from "./crmApi";
import { addDaysIso, taxModeFor, toPaise, toRupeeInput, todayIso } from "./crmFormat";
import ItemsEditor from "./ItemsEditor";
import { blankItem, itemsFromEvents, itemsFromSaved, itemsToPayload, validateItems } from "./itemRows";

const TAX_NOTES = {
  none: "No GST — add your GSTIN in Business details to charge GST.",
  intra: "CGST + SGST — the client is in your state (or no state is set).",
  inter: "IGST — the client is in another state.",
};

/**
 * Create or edit a custom quotation. New quotations start with one line per
 * event at the event's price; the vendor can change or add anything.
 */
const QuotationEditor = ({ client, events, profile, quotation, onClose, onSaved, onOpenBusiness }) => {
  const editing = !!quotation;
  const gstRate = Number(profile?.defaultGstRate ?? 18);
  const taxMode = taxModeFor(profile, client.state);

  const [items, setItems] = useState(() => {
    if (editing) return itemsFromSaved(quotation.items);
    const fromEvents = itemsFromEvents(events, gstRate, profile?.defaultSac);
    return fromEvents.length ? fromEvents : [blankItem(gstRate)];
  });
  const [discount, setDiscount] = useState(editing && quotation.discountPaise ? toRupeeInput(quotation.discountPaise) : "");
  const [issueDate, setIssueDate] = useState(editing ? quotation.issueDate : todayIso());
  const [validUntil, setValidUntil] = useState(editing ? quotation.validUntil || "" : addDaysIso(15));
  const [notes, setNotes] = useState(editing ? quotation.notes || "" : "");
  const [terms, setTerms] = useState(editing ? quotation.terms || "" : profile?.terms || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    const problem = validateItems(items);
    if (problem) return setError(problem);
    if (Number.isNaN(toPaise(discount))) return setError("Enter a valid discount.");
    setError("");
    setSaving(true);
    const body = {
      items: itemsToPayload(items),
      discountPaise: toPaise(discount),
      issueDate,
      validUntil: validUntil || null,
      notes,
      terms,
    };
    try {
      const result = editing ? await crmApi.updateQuotation(quotation.id, body) : await crmApi.createQuotation(client.id, body);
      onSaved(result.message);
    } catch (err) {
      setError(errorMessage(err, "Could not save the quotation."));
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="xl" centered className="crm-modal" backdrop="static" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{editing ? `Edit quotation ${quotation.number}` : `New quotation for ${client.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {editing && quotation.status === "sent" && (
          <div className="crm-notice crm-notice-info">Your client already has the link. They'll see these changes when they open it.</div>
        )}

        <div className="crm-grid-3">
          <div className="crm-field">
            <label className="crm-label">Quotation date</label>
            <input className="crm-input" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </div>
          <div className="crm-field">
            <label className="crm-label">Valid until</label>
            <input className="crm-input" type="date" value={validUntil} min={issueDate} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
          <div className="crm-field">
            <label className="crm-label">Tax</label>
            <div className="crm-small" style={{ paddingTop: 4 }}>
              {TAX_NOTES[taxMode]}{" "}
              {taxMode === "none" && (
                <button type="button" className="crm-link" onClick={onOpenBusiness}>
                  Business details
                </button>
              )}
            </div>
          </div>
        </div>

        <ItemsEditor items={items} setItems={setItems} taxMode={taxMode} discount={discount} setDiscount={setDiscount} defaultGstRate={gstRate} />

        <div className="crm-grid-2" style={{ marginTop: 16 }}>
          <div className="crm-field">
            <label className="crm-label">Notes for the client</label>
            <textarea className="crm-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What's included, deliverables, timelines…" maxLength={4000} />
          </div>
          <div className="crm-field">
            <label className="crm-label">Terms &amp; conditions</label>
            <textarea className="crm-input" value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="e.g. 50% advance to confirm the booking" maxLength={4000} />
            {!profile?.terms && <div className="crm-hint">Save default terms in Business details to fill this in every time.</div>}
          </div>
        </div>

        {error && <div className="crm-notice crm-notice-warn" style={{ marginBottom: 0 }}>{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <button className="crm-btn" onClick={onClose} disabled={saving}>Cancel</button>
        <button className="crm-btn crm-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : editing ? "Save quotation" : "Save as draft"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationEditor;
