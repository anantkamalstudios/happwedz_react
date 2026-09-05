import React, { useCallback, useEffect, useState } from "react";
import { FiRefreshCw, FiCreditCard } from "react-icons/fi";
import vendorSubscriptionApi from "../../../../services/api/vendorSubscriptionApi";
import PlanPickerModal from "./PlanPickerModal";
import InvoiceViewerModal from "./InvoiceViewerModal";

/**
 * The vendor's billing view: the plan they are on, and every payment attempt.
 *
 * Failed and abandoned attempts are shown rather than hidden. A vendor whose card was
 * declined and then sees an empty history assumes the money vanished; the row with its
 * reason is what prevents that support ticket.
 */

const PINK = "#c2185b";
const INK = "#1d1117";
const MUTED = "#6f5c66";
const LINE = "#e9e1e5";

const STATUS = {
  paid: { label: "Paid", color: "#1a6b38", bg: "#e7f4ec" },
  created: { label: "Incomplete", color: "#6f5c66", bg: "#f1eef0" },
  failed: { label: "Failed", color: "#a51d1d", bg: "#fbe9e9" },
  refunded: { label: "Refunded", color: "#8a5a00", bg: "#fdf1dd" },
};

const money = (amount, currency = "INR") => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
};

const date = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const daysUntil = (value) => {
  if (!value) return null;
  return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
};

const css = `
.hw-bill { --hw-pink:${PINK}; --hw-line:${LINE}; }
.hw-panel { background:#fff; border:1px solid ${LINE}; border-radius:14px; overflow:hidden; }
.hw-panel__head {
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:16px 22px; border-bottom:1px solid ${LINE};
}
.hw-panel__title { display:flex; align-items:center; gap:9px; font-size:1rem; font-weight:700; color:${INK}; margin:0; }
.hw-icon-btn {
  flex:0 0 auto; width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center;
  border:1px solid ${LINE}; background:#fff; border-radius:8px; color:${MUTED}; cursor:pointer;
  transition:background .15s ease, color .15s ease;
}
.hw-icon-btn:hover { background:#f7f3f5; color:${INK}; }
.hw-icon-btn:focus-visible { outline:2px solid ${PINK}; outline-offset:2px; }
.hw-cta {
  border:0; background:${PINK}; color:#fff; border-radius:9px; padding:11px 22px;
  font-weight:600; font-size:.93rem; cursor:pointer; white-space:nowrap; transition:background .18s ease;
}
.hw-cta:hover:not(:disabled) { background:#a8154e; }
.hw-cta:disabled { opacity:.55; cursor:not-allowed; }
.hw-cta--ghost { background:#fff; color:${PINK}; border:1px solid ${PINK}; }
.hw-cta--ghost:hover:not(:disabled) { background:#fce7f0; }
.hw-label { font-size:.7rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:${MUTED}; }
.hw-chip { display:inline-block; font-size:.72rem; font-weight:700; padding:3px 10px; border-radius:999px; }
.hw-table { width:100%; border-collapse:collapse; font-size:.9rem; }
.hw-table th {
  text-align:left; font-size:.7rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase;
  color:${MUTED}; padding:11px 22px; background:#faf8f9; border-bottom:1px solid ${LINE}; white-space:nowrap;
}
.hw-table td { padding:14px 22px; border-bottom:1px solid #f2edef; color:#3b2c34; vertical-align:top; }
.hw-table tr:last-child td { border-bottom:0; }
.hw-mono { font-family:ui-monospace,"Cascadia Mono",Consolas,monospace; font-size:.8rem; }
.hw-num { font-variant-numeric:tabular-nums; white-space:nowrap; }
.hw-link-btn {
  border:1px solid ${LINE}; background:#fff; color:${PINK}; border-radius:7px;
  padding:5px 14px; font-size:.82rem; font-weight:600; cursor:pointer;
  transition:background .15s ease, border-color .15s ease;
}
.hw-link-btn:hover { background:#fce7f0; border-color:${PINK}; }
.hw-link-btn:focus-visible { outline:2px solid ${PINK}; outline-offset:2px; }
`;

const SubscriptionSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [invoiceFor, setInvoiceFor] = useState(null);

  const load = useCallback(async (quiet = false) => {
    quiet ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      setData(await vendorSubscriptionApi.getHistory());
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your billing details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: PINK }} role="status">
          <span className="visually-hidden">Loading</span>
        </div>
      </div>
    );
  }

  const access = data?.access || {};
  const sub = access.subscription;
  const payments = data?.payments || [];
  const left = sub ? daysUntil(sub.endsAt) : null;
  const soon = left !== null && left <= 14;

  return (
    <div className="hw-bill">
      <style>{css}</style>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={() => load()}>
            Retry
          </button>
        </div>
      )}

      {/* ── Current plan ───────────────────────────────────────────────── */}
      <div className="hw-panel mb-4">
        <div className="hw-panel__head">
          <h5 className="hw-panel__title">
            <FiCreditCard size={17} /> Your plan
          </h5>
          {sub && (
            <span
              className="hw-chip"
              style={
                soon
                  ? { background: "#fdf1dd", color: "#8a5a00" }
                  : { background: "#e7f4ec", color: "#1a6b38" }
              }
            >
              {soon ? "Renews soon" : "Active"}
            </span>
          )}
        </div>

        <div className="p-4">
          {sub ? (
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
              <div>
                <div className="hw-label mb-1">Current plan</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: INK }}>
                  {sub.planName}
                </div>
                <div style={{ color: MUTED, fontSize: ".9rem", marginTop: 6 }}>
                  {date(sub.startsAt)} — {date(sub.endsAt)}
                  {left !== null && left >= 0 && (
                    <> · {left} day{left === 1 ? "" : "s"} remaining</>
                  )}
                </div>
              </div>
              <button
                className={`hw-cta ${soon ? "" : "hw-cta--ghost"}`}
                onClick={() => setShowPicker(true)}
              >
                {soon ? "Renew now" : "Change plan"}
              </button>
            </div>
          ) : (
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div style={{ maxWidth: "46ch" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: INK }}>
                  {access.stage === "expired"
                    ? "Your plan has ended"
                    : "You are not on a plan yet"}
                </div>
                <div style={{ color: MUTED, fontSize: ".92rem", marginTop: 5, lineHeight: 1.55 }}>
                  {access.message ||
                    "Pick a plan to unlock your storefront and start editing."}
                </div>
              </div>
              <button
                className="hw-cta"
                disabled={access.canPurchase === false}
                title={
                  access.canPurchase === false
                    ? "Complete your business verification first"
                    : undefined
                }
                onClick={() => setShowPicker(true)}
              >
                {access.stage === "expired" ? "Renew plan" : "View plans"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Payment history ────────────────────────────────────────────── */}
      <div className="hw-panel">
        <div className="hw-panel__head">
          <h5 className="hw-panel__title">Payment history</h5>
          {/* Fixed square: this was a full-width block button stretched across the row. */}
          <button
            className="hw-icon-btn"
            onClick={() => load(true)}
            title="Refresh"
            aria-label="Refresh payment history"
            disabled={refreshing}
          >
            <FiRefreshCw size={15} className={refreshing ? "spinner-border-sm" : ""} />
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-5 px-3">
            <p className="fw-bold mb-1" style={{ color: INK }}>
              No payments yet
            </p>
            <p className="mb-0" style={{ color: MUTED, fontSize: ".9rem" }}>
              Your invoices will appear here once you buy a plan.
            </p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="hw-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Plan</th>
                    <th>Invoice</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const s = STATUS[p.status] || STATUS.created;
                    return (
                      <tr key={p.id}>
                        <td className="hw-num">{date(p.paid_at || p.created_at)}</td>
                        <td style={{ textTransform: "capitalize" }}>{p.plan?.name || "—"}</td>
                        <td>
                          <div className="hw-mono">{p.invoice_no || "—"}</div>
                          {p.razorpay_payment_id && (
                            <div className="hw-mono" style={{ color: MUTED, fontSize: ".72rem" }}>
                              {p.razorpay_payment_id}
                            </div>
                          )}
                        </td>
                        <td className="hw-num" style={{ textAlign: "right", fontWeight: 600 }}>
                          {money(p.amount, p.currency)}
                        </td>
                        <td>
                          <span
                            className="hw-chip"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {s.label}
                          </span>
                          {p.status === "failed" && p.failure_reason && (
                            <div style={{ color: MUTED, fontSize: ".74rem", marginTop: 5 }}>
                              {p.failure_reason}
                            </div>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {/* Only paid rows have an invoice — a document for a payment
                              that never completed would claim money changed hands. */}
                          {p.status === "paid" ? (
                            <button
                              className="hw-link-btn"
                              onClick={() => setInvoiceFor(p)}
                            >
                              View
                            </button>
                          ) : (
                            <span style={{ color: MUTED }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className="px-4 py-3"
              style={{ borderTop: `1px solid ${LINE}`, color: MUTED, fontSize: ".82rem" }}
            >
              Payments that were started but never completed are not listed. If money was
              deducted for one of them, reply to your receipt email and we will check it.
            </div>
          </>
        )}
      </div>

      <PlanPickerModal
        show={showPicker}
        onClose={() => setShowPicker(false)}
        onPurchased={() => window.location.reload()}
      />

      <InvoiceViewerModal
        show={Boolean(invoiceFor)}
        onClose={() => setInvoiceFor(null)}
        title={invoiceFor ? `Invoice ${invoiceFor.invoice_no || ""}`.trim() : "Invoice"}
        fetchInvoice={() => vendorSubscriptionApi.getInvoice(invoiceFor.id)}
      />
    </div>
  );
};

export default SubscriptionSettings;
