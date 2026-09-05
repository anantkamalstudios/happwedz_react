import React from "react";
import { FiCheck } from "react-icons/fi";

/**
 * The plan grid, shared by the full Upgrade page and the picker modal.
 *
 * Restrained on purpose: white cards on a soft neutral ground, one pink accent reserved
 * for the buttons and the recommended card's edge. The previous design flooded the page
 * with orange gradients, which read as a template rather than a product.
 */

const PINK = "#c2185b";
const PINK_SOFT = "#fce7f0";
const INK = "#1d1117";
const MUTED = "#6f5c66";
const LINE = "#e9e1e5";

const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
};

const cycleNoun = (cycle) => (cycle === "monthly" ? "month" : "year");

/** Per-month equivalent, so a yearly price can be compared honestly against monthly. */
const monthlyEquivalent = (plan) => {
  if (plan.billing_cycle !== "yearly") return null;
  const n = Number(plan.price_inr);
  if (!Number.isFinite(n) || n <= 0) return null;
  return formatPrice(Math.round(n / 12));
};

const styles = `
.hw-plans { --hw-pink:${PINK}; --hw-line:${LINE}; --hw-ink:${INK}; --hw-muted:${MUTED}; }
.hw-cycle {
  display:inline-flex; padding:4px; gap:4px; border-radius:999px;
  background:#f2eef0; border:1px solid var(--hw-line);
}
.hw-cycle button {
  border:0; background:transparent; border-radius:999px; cursor:pointer;
  padding:8px 22px; font-size:.9rem; font-weight:600; color:var(--hw-muted);
  transition:background .18s ease, color .18s ease, box-shadow .18s ease;
}
.hw-cycle button[aria-selected="true"] {
  background:#fff; color:var(--hw-ink);
  box-shadow:0 1px 2px rgba(29,17,23,.08), 0 4px 12px -8px rgba(29,17,23,.28);
}
.hw-cycle button:focus-visible { outline:2px solid var(--hw-pink); outline-offset:2px; }

.hw-card {
  position:relative; display:flex; flex-direction:column; height:100%;
  background:#fff; border:1px solid var(--hw-line); border-radius:14px; padding:26px 24px 24px;
  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.hw-card:hover { border-color:#d9ccd3; box-shadow:0 10px 30px -18px rgba(29,17,23,.35); transform:translateY(-2px); }
.hw-card--featured { border-color:var(--hw-pink); box-shadow:0 12px 34px -20px rgba(194,24,91,.5); }
.hw-card--current { border-color:#c8d9cc; background:#fbfdfb; }

.hw-ribbon {
  position:absolute; top:-11px; left:50%; transform:translateX(-50%);
  background:var(--hw-pink); color:#fff;
  font-size:.68rem; font-weight:700; letter-spacing:.09em; text-transform:uppercase;
  padding:4px 11px; border-radius:999px;
}
.hw-eyebrow {
  font-size:.72rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--hw-muted);
}
.hw-price { font-size:2.3rem; font-weight:700; color:var(--hw-ink); line-height:1.05; letter-spacing:-.02em; font-variant-numeric:tabular-nums; }
.hw-per { font-size:.92rem; font-weight:500; color:var(--hw-muted); }
.hw-desc { font-size:.9rem; color:var(--hw-muted); line-height:1.55; margin:12px 0 0; }
.hw-rule { height:1px; background:var(--hw-line); margin:20px 0 18px; }
.hw-feat { display:flex; gap:10px; align-items:flex-start; font-size:.9rem; color:#3b2c34; line-height:1.5; margin-bottom:11px; }
.hw-tick {
  flex:0 0 18px; width:18px; height:18px; border-radius:50%; background:${PINK_SOFT}; color:var(--hw-pink);
  display:inline-flex; align-items:center; justify-content:center; margin-top:1px;
}
.hw-btn {
  margin-top:auto; width:100%; border-radius:9px; padding:12px 18px; font-weight:600; font-size:.95rem;
  border:1px solid var(--hw-pink); cursor:pointer; transition:background .18s ease, color .18s ease, opacity .18s ease;
}
.hw-btn--solid { background:var(--hw-pink); color:#fff; }
.hw-btn--solid:hover:not(:disabled) { background:#a8154e; }
.hw-btn--ghost { background:#fff; color:var(--hw-pink); }
.hw-btn--ghost:hover:not(:disabled) { background:${PINK_SOFT}; }
.hw-btn:disabled { opacity:.55; cursor:not-allowed; }
.hw-btn--done { background:#eef4ef; color:#2f6b41; border-color:#cfe2d5; }
@media (prefers-reduced-motion: reduce) { .hw-card, .hw-btn, .hw-cycle button { transition:none; } }
`;

const PlanCards = ({
  plans = [],
  cycle,
  onCycleChange,
  showCycleTabs = false,
  onChoose,
  processing = false,
  processingLabel = "",
  processingPlanId = null,
  currentPlanId = null,
  canPurchase = true,
  disabledReason = "",
}) => {
  // A price card reads as a card at roughly 320px. Left to fill a wide container, two
  // of them stretch to ~600px each and stop looking like prices at all — so the grid
  // is capped to what the number of plans actually needs, and centred.
  const gridMaxWidth =
    plans.length <= 1 ? 380 : plans.length === 2 ? 700 : 1020;

  return (
    <div className="hw-plans">
      <style>{styles}</style>

      {showCycleTabs && (
        <div className="d-flex justify-content-center mb-4">
          <div className="hw-cycle" role="tablist" aria-label="Billing cycle">
            {["monthly", "yearly"].map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cycle === c}
                onClick={() => onCycleChange?.(c)}
              >
                {c === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="row g-3 g-lg-4 justify-content-center mx-auto"
        style={{ maxWidth: gridMaxWidth }}
      >
        {plans.map((plan) => {
          const isCurrent = currentPlanId != null && plan.id === currentPlanId;
          const perMonth = monthlyEquivalent(plan);

          return (
            <div className="col-md-6 col-lg-4" style={{ maxWidth: 340, flex: "1 1 300px" }} key={plan.id}>
              <div
                className={`hw-card ${plan.is_popular && !isCurrent ? "hw-card--featured" : ""} ${
                  isCurrent ? "hw-card--current" : ""
                }`}
              >
                {plan.is_popular && !isCurrent && (
                  <span className="hw-ribbon">Recommended</span>
                )}

                <div className="hw-eyebrow">{plan.name}</div>

                <div className="d-flex align-items-baseline gap-2 mt-2">
                  <span className="hw-price">{formatPrice(plan.price_inr)}</span>
                  <span className="hw-per">/ {cycleNoun(plan.billing_cycle)}</span>
                </div>

                {perMonth && (
                  <div className="hw-per mt-1" style={{ fontSize: ".82rem" }}>
                    Works out to {perMonth} a month
                  </div>
                )}

                {plan.description && <p className="hw-desc">{plan.description}</p>}

                <div className="hw-rule" />

                <div className="mb-3">
                  {(plan.features || []).map((feature, i) => (
                    <div className="hw-feat" key={i}>
                      <span className="hw-tick" aria-hidden="true">
                        <FiCheck size={11} strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <button className="hw-btn hw-btn--done" disabled>
                    Your current plan
                  </button>
                ) : (
                  <button
                    className={`hw-btn ${plan.is_popular ? "hw-btn--solid" : "hw-btn--ghost"}`}
                    disabled={!canPurchase || processing}
                    title={canPurchase ? undefined : disabledReason}
                    onClick={() => onChoose?.(plan)}
                  >
                    {processing && processingPlanId === plan.id
                      ? processingLabel || "Please wait…"
                      : "Choose plan"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanCards;
export { formatPrice, cycleNoun };
