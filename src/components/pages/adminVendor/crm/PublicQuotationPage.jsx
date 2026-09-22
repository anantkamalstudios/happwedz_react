import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Download, XCircle } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { formatDate, rupees } from "./crmFormat";
import { Spinner } from "./crmUi";
import { API_BASE_URL, resolveMediaUrl } from "../../../../config/constants";
import "./crm.css";

const STATUS_TEXT = {
  accepted: { tone: "green", text: "You accepted this quotation." },
  rejected: { tone: "red", text: "You declined this quotation." },
  expired: { tone: "amber", text: "This quotation has expired. Please ask the vendor for a new one." },
};

// The page a vendor's client opens from the quotation link. No login needed.
const PublicQuotationPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(null); // "accept" | "reject"
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    crmApi
      .publicQuotation(token)
      .then(setData)
      .catch((err) => setError(errorMessage(err, "This quotation link is not valid.")));
  }, [token]);

  const respond = async (decision) => {
    setBusy(true);
    try {
      const result = await crmApi.respondToQuotation(token, decision);
      setData((d) => ({ ...d, quotation: { ...d.quotation, status: result.status } }));
      setConfirming(null);
    } catch (err) {
      setError(errorMessage(err, "Could not record your answer."));
    } finally {
      setBusy(false);
    }
  };

  if (error && !data) {
    return (
      <div className="crm">
        <div className="crm-wrap" style={{ maxWidth: 760 }}>
          <div className="crm-card crm-empty">
            <h3>{error}</h3>
            <div>Please check the link or ask the vendor to send it again.</div>
          </div>
        </div>
      </div>
    );
  }
  if (!data) return <div className="crm"><Spinner /></div>;

  const { quotation: q, seller, clientName } = data;
  const status = STATUS_TEXT[q.status];

  return (
    <div className="crm">
      <div className="crm-wrap" style={{ maxWidth: 820 }}>
        <div className="crm-card crm-card-pad" style={{ padding: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {seller.logoUrl && <img className="crm-logo" src={resolveMediaUrl(seller.logoUrl)} alt="" />}
              <div>
                <h1 className="crm-title">{seller.name}</h1>
                <div className="crm-muted crm-small">
                  {[seller.city, seller.state].filter(Boolean).join(", ")}
                  {seller.phone ? ` · ${seller.phone}` : ""}
                </div>
                {seller.gstin && <div className="crm-muted crm-small">GSTIN {seller.gstin}</div>}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#ed1173", fontWeight: 700, fontSize: 18 }}>Quotation</div>
              <div className="crm-small">{q.number}</div>
              <div className="crm-muted crm-small">{formatDate(q.issueDate)}</div>
              {q.validUntil && <div className="crm-muted crm-small">Valid until {formatDate(q.validUntil)}</div>}
            </div>
          </div>

          <div className="crm-muted crm-small">Prepared for</div>
          <div className="crm-strong" style={{ fontSize: 16, marginBottom: 18 }}>{clientName}</div>

          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="crm-num crm-hide-sm">Qty</th>
                  <th className="crm-num crm-hide-sm">Rate</th>
                  {q.taxMode !== "none" && <th className="crm-num crm-hide-sm">GST</th>}
                  <th className="crm-num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {q.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {[item.eventName, item.description].filter(Boolean).join(" – ")}
                      <div className="crm-muted crm-small crm-show-sm">
                        {item.quantity} × {rupees(item.ratePaise, { decimals: true })}
                        {q.taxMode !== "none" ? ` · GST ${item.gstRate}%` : ""}
                      </div>
                    </td>
                    <td className="crm-num crm-hide-sm">{item.quantity}</td>
                    <td className="crm-num crm-hide-sm">{rupees(item.ratePaise, { decimals: true })}</td>
                    {q.taxMode !== "none" && <td className="crm-num crm-hide-sm">{item.gstRate}%</td>}
                    <td className="crm-num">{rupees(item.amountPaise, { decimals: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="crm-totals" style={{ marginTop: 14 }}>
            <div><span className="crm-muted">Subtotal</span><span>{rupees(q.subtotalPaise, { decimals: true })}</span></div>
            {q.discountPaise > 0 && <div><span className="crm-muted">Discount</span><span>− {rupees(q.discountPaise, { decimals: true })}</span></div>}
            {q.taxMode === "intra" && (
              <>
                <div><span className="crm-muted">CGST</span><span>{rupees(q.taxPaise / 2, { decimals: true })}</span></div>
                <div><span className="crm-muted">SGST</span><span>{rupees(q.taxPaise / 2, { decimals: true })}</span></div>
              </>
            )}
            {q.taxMode === "inter" && <div><span className="crm-muted">IGST</span><span>{rupees(q.taxPaise, { decimals: true })}</span></div>}
            <div className="is-total"><span>Total</span><span>{rupees(q.totalPaise, { decimals: true })}</span></div>
          </div>

          {q.notes && (
            <div style={{ marginTop: 18 }}>
              <div className="crm-label">Notes</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{q.notes}</div>
            </div>
          )}
          {q.terms && (
            <div style={{ marginTop: 14 }}>
              <div className="crm-label">Terms &amp; conditions</div>
              <div style={{ whiteSpace: "pre-wrap" }}>{q.terms}</div>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--crm-line)", marginTop: 22, paddingTop: 18 }}>
            {status ? (
              <div className={`crm-notice crm-tone-${status.tone}`} style={{ marginBottom: 12 }}>
                {q.status === "accepted" ? <CheckCircle2 size={18} /> : q.status === "rejected" ? <XCircle size={18} /> : null}
                <span>
                  {status.text}
                  {q.status === "accepted" && ` ${seller.name} has been told and will be in touch.`}
                </span>
              </div>
            ) : confirming ? (
              <div className="crm-notice crm-notice-info" style={{ flexDirection: "column" }}>
                <strong>{confirming === "accept" ? `Accept this quotation for ${rupees(q.totalPaise)}?` : "Decline this quotation?"}</strong>
                <span>{confirming === "accept" ? `${seller.name} will be notified so they can confirm your booking.` : `${seller.name} will be notified.`}</span>
                <div className="crm-actions" style={{ marginTop: 6 }}>
                  <button className="crm-btn" onClick={() => setConfirming(null)} disabled={busy}>Back</button>
                  <button className={`crm-btn ${confirming === "accept" ? "crm-btn-primary" : "crm-btn-danger"}`} onClick={() => respond(confirming)} disabled={busy}>
                    {busy ? "Please wait…" : confirming === "accept" ? "Yes, accept" : "Yes, decline"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="crm-actions" style={{ justifyContent: "flex-end" }}>
                <button className="crm-btn crm-btn-danger" onClick={() => setConfirming("reject")}>Decline</button>
                <button className="crm-btn crm-btn-primary" onClick={() => setConfirming("accept")}>
                  <CheckCircle2 size={16} /> Accept quotation
                </button>
              </div>
            )}
            {error && <div className="crm-notice crm-notice-warn" style={{ marginTop: 12, marginBottom: 0 }}>{error}</div>}
            <div style={{ marginTop: 12 }}>
              <a className="crm-btn crm-btn-sm" href={`${API_BASE_URL}/crm/public/quotations/${token}/pdf`}>
                <Download size={14} /> Download PDF
              </a>
            </div>
          </div>
        </div>
        <div className="crm-muted crm-small" style={{ textAlign: "center", marginTop: 14 }}>
          Sent with HappyWedz
          {seller.email ? <> · Questions? <a href={`mailto:${seller.email}`}>{seller.email}</a></> : null}
        </div>
      </div>
    </div>
  );
};

export default PublicQuotationPage;
