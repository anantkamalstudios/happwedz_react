import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { crmApi, errorMessage } from "./crmApi";
import { PAYMENT_METHODS, rupees, toPaise, toRupeeInput, todayIso } from "./crmFormat";
import { RupeeInput } from "./crmUi";

const PaymentModal = ({ client, invoices, money, defaultInvoiceId, onClose, onSaved }) => {
  const firstPayment = money.receivedPaise === 0;
  const [amount, setAmount] = useState(() => {
    if (defaultInvoiceId) {
      const inv = invoices.find((i) => i.id === defaultInvoiceId);
      if (inv) return toRupeeInput(Math.max(0, inv.totalPaise - (inv.paidPaise || 0)));
    }
    return "";
  });
  const [paidOn, setPaidOn] = useState(todayIso());
  const [method, setMethod] = useState("upi");
  const [reference, setReference] = useState("");
  const [invoiceId, setInvoiceId] = useState(defaultInvoiceId ? String(defaultInvoiceId) : "");
  const [isAdvance, setIsAdvance] = useState(firstPayment && !defaultInvoiceId);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const amountPaise = toPaise(amount);
  const balanceAfter = money.balancePaise - (Number.isNaN(amountPaise) ? 0 : amountPaise);

  const save = async (e) => {
    e.preventDefault();
    if (!amountPaise || Number.isNaN(amountPaise)) return setError("Enter the amount received.");
    setError("");
    setSaving(true);
    try {
      const result = await crmApi.createPayment(client.id, {
        amountPaise,
        paidOn,
        method,
        reference,
        invoiceId: invoiceId ? Number(invoiceId) : null,
        isAdvance,
        note,
      });
      onSaved(result.message);
    } catch (err) {
      setError(errorMessage(err, "Could not record the payment."));
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered className="crm-modal" backdrop="static">
      <form onSubmit={save}>
        <Modal.Header closeButton>
          <Modal.Title>Record payment · {client.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="crm-grid-2">
            <div className="crm-field">
              <label className="crm-label">Amount received *</label>
              <RupeeInput value={amount} onChange={setAmount} autoFocus />
              {money.finalPaise > 0 && (
                <div className="crm-hint">
                  {money.balancePaise > 0 ? `Balance now ${rupees(money.balancePaise)}` : "Nothing pending"}
                  {amountPaise > 0 && ` → ${balanceAfter >= 0 ? rupees(balanceAfter) : `${rupees(-balanceAfter)} extra`} after this`}
                </div>
              )}
            </div>
            <div className="crm-field">
              <label className="crm-label">Date received</label>
              <input className="crm-input" type="date" value={paidOn} max={todayIso()} onChange={(e) => setPaidOn(e.target.value)} />
            </div>
            <div className="crm-field">
              <label className="crm-label">Method</label>
              <select className="crm-input" value={method} onChange={(e) => setMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="crm-field">
              <label className="crm-label">Reference</label>
              <input className="crm-input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="UTR, cheque no…" maxLength={80} />
            </div>
          </div>
          {invoices.length > 0 && (
            <div className="crm-field">
              <label className="crm-label">Against invoice</label>
              <select className="crm-input" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
                <option value="">Not linked to an invoice</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.number} · {rupees(inv.totalPaise)}
                    {inv.paidPaise ? ` (received ${rupees(inv.paidPaise)})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="crm-field">
            <label className="crm-check">
              <input type="checkbox" checked={isAdvance} onChange={(e) => setIsAdvance(e.target.checked)} />
              This is an advance (booking amount)
            </label>
          </div>
          <div className="crm-field" style={{ marginBottom: 0 }}>
            <label className="crm-label">Note</label>
            <input className="crm-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Printed on the receipt" maxLength={1000} />
          </div>
          {error && <div className="crm-notice crm-notice-warn" style={{ marginTop: 14, marginBottom: 0 }}>{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="crm-btn" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save payment"}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default PaymentModal;
