import React, { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { crmApi, errorMessage } from "./crmApi";
import { addDaysIso, computeTotals, rupees, taxModeFor, toPaise, todayIso } from "./crmFormat";
import ItemsEditor from "./ItemsEditor";
import { blankItem, itemsFromEvents, itemsFromSaved, itemsToPayload, validateItems } from "./itemRows";

/**
 * Issue an invoice, from an accepted quotation or from items entered here.
 * Invoices are final once issued (GST rules): no edits, only cancellation.
 */
const InvoiceModal = ({ client, events, profile, quotations, defaultQuotationId, onClose, onSaved, onOpenBusiness }) => {
  const gstRate = Number(profile?.defaultGstRate ?? 18);
  const taxMode = taxModeFor(profile, client.state);
  const accepted = quotations.filter((q) => q.status === "accepted");

  const [source, setSource] = useState(accepted.length ? "quotation" : "items");
  const [quotationId, setQuotationId] = useState(String(defaultQuotationId || accepted[0]?.id || ""));
  const [items, setItems] = useState(() => {
    const fromEvents = itemsFromEvents(events, gstRate, profile?.defaultSac);
    return fromEvents.length ? fromEvents : [blankItem(gstRate)];
  });
  const [discount, setDiscount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState(client.paymentDueDate && client.paymentDueDate >= todayIso() ? client.paymentDueDate : addDaysIso(7));
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(profile?.terms || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // What the invoice will come to when made from the chosen quotation. A quotation
  // written before GST registration gets the default rate on every line.
  const quotationPreview = useMemo(() => {
    const q = accepted.find((x) => String(x.id) === quotationId);
    if (!q) return null;
    const rows = itemsFromSaved(q.items).map((row) => (q.taxMode === "none" ? { ...row, gstRate: String(gstRate) } : row));
    return { quotation: q, totals: computeTotals(rows, q.discountPaise, taxMode) };
  }, [accepted, quotationId, taxMode, gstRate]);

  const issue = async () => {
    setError("");
    const body = { invoiceDate, dueDate: dueDate || null, notes, terms };
    if (source === "quotation") {
      if (!quotationPreview) return setError("Choose a quotation.");
      body.quotationId = quotationPreview.quotation.id;
    } else {
      const problem = validateItems(items);
      if (problem) return setError(problem);
      if (Number.isNaN(toPaise(discount))) return setError("Enter a valid discount.");
      body.items = itemsToPayload(items);
      body.discountPaise = toPaise(discount);
    }
    setSaving(true);
    try {
      const result = await crmApi.createInvoice(client.id, body);
      onSaved(result.message);
    } catch (err) {
      setError(errorMessage(err, "Could not issue the invoice."));
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} size="xl" centered className="crm-modal" backdrop="static" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>New invoice for {client.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {taxMode === "none" ? (
          <div className="crm-notice crm-notice-info">
            <span>
              This invoice won't include GST because your GSTIN isn't saved.{" "}
              <button type="button" className="crm-link" onClick={onOpenBusiness}>Add it in Business details</button> if you're registered.
            </span>
          </div>
        ) : (
          <div className="crm-notice crm-notice-info">
            Tax invoice from GSTIN {profile.gstin} with {taxMode === "intra" ? "CGST + SGST" : `IGST (client in ${client.state})`}.
          </div>
        )}

        <div className="crm-choice">
          <label className={source === "quotation" ? "is-active" : ""} style={!accepted.length ? { opacity: 0.55, cursor: "not-allowed" } : undefined}>
            <input type="radio" checked={source === "quotation"} disabled={!accepted.length} onChange={() => setSource("quotation")} />
            <span>
              <strong>From an accepted quotation</strong>
              <div className="crm-muted crm-small">{accepted.length ? "Same items and prices the client agreed to." : "No accepted quotation yet."}</div>
            </span>
          </label>
          <label className={source === "items" ? "is-active" : ""}>
            <input type="radio" checked={source === "items"} onChange={() => setSource("items")} />
            <span>
              <strong>Enter items</strong>
              <div className="crm-muted crm-small">Starts from the client's events and prices.</div>
            </span>
          </label>
        </div>

        <div className="crm-grid-3">
          <div className="crm-field">
            <label className="crm-label">Invoice date</label>
            <input className="crm-input" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
          <div className="crm-field">
            <label className="crm-label">Due date</label>
            <input className="crm-input" type="date" value={dueDate} min={invoiceDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          {source === "quotation" && accepted.length > 1 && (
            <div className="crm-field">
              <label className="crm-label">Quotation</label>
              <select className="crm-input" value={quotationId} onChange={(e) => setQuotationId(e.target.value)}>
                {accepted.map((q) => (
                  <option key={q.id} value={q.id}>{q.number} · {rupees(q.totalPaise)}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {source === "quotation" && quotationPreview && (
          <div className="crm-card crm-card-pad" style={{ marginBottom: 16 }}>
            <div className="crm-card-title">Quotation {quotationPreview.quotation.number}</div>
            {quotationPreview.quotation.items.map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0" }}>
                <span>
                  {[item.eventName, item.description].filter(Boolean).join(" – ")}
                  {Number(item.quantity) !== 1 ? ` × ${item.quantity}` : ""}
                </span>
                <span className="crm-strong">{rupees(item.amountPaise, { decimals: true })}</span>
              </div>
            ))}
            <div className="crm-totals" style={{ marginTop: 10 }}>
              {quotationPreview.totals.discount > 0 && <div><span className="crm-muted">Discount</span><span>− {rupees(quotationPreview.totals.discount, { decimals: true })}</span></div>}
              {taxMode === "intra" && <div><span className="crm-muted">CGST + SGST</span><span>{rupees(quotationPreview.totals.tax, { decimals: true })}</span></div>}
              {taxMode === "inter" && <div><span className="crm-muted">IGST</span><span>{rupees(quotationPreview.totals.tax, { decimals: true })}</span></div>}
              <div className="is-total"><span>Invoice total</span><span>{rupees(quotationPreview.totals.total, { decimals: true })}</span></div>
            </div>
            {quotationPreview.quotation.taxMode === "none" && taxMode !== "none" && (
              <div className="crm-hint">The quotation had no GST; {gstRate}% GST is added on the invoice.</div>
            )}
          </div>
        )}

        {source === "items" && (
          <ItemsEditor items={items} setItems={setItems} taxMode={taxMode} discount={discount} setDiscount={setDiscount} defaultGstRate={gstRate} />
        )}

        <div className="crm-grid-2" style={{ marginTop: 16 }}>
          <div className="crm-field">
            <label className="crm-label">Notes</label>
            <textarea className="crm-input" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={4000} />
          </div>
          <div className="crm-field">
            <label className="crm-label">Terms &amp; conditions</label>
            <textarea className="crm-input" value={terms} onChange={(e) => setTerms(e.target.value)} maxLength={4000} />
          </div>
        </div>

        <div className="crm-notice crm-notice-warn" style={{ marginBottom: error ? 10 : 0 }}>
          Check the details before issuing. An invoice can't be edited afterwards — only cancelled and issued again.
        </div>
        {error && <div className="crm-notice crm-notice-warn" style={{ marginBottom: 0 }}>{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <button className="crm-btn" onClick={onClose} disabled={saving}>Cancel</button>
        <button className="crm-btn crm-btn-primary" onClick={issue} disabled={saving}>
          {saving ? "Issuing…" : "Issue invoice"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
