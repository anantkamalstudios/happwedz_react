import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";

/**
 * Makes a storefront tab read-only without touching the twenty-five tab components.
 *
 * A `disabled` fieldset disables every descendant input, select, textarea and button in
 * one stroke — that is native behaviour, not a trick. It does not stop a click handler on
 * a plain div, which several of these tabs use for custom pickers and drop zones, so
 * pointer-events is switched off on the same wrapper to catch those.
 *
 * None of this is a security boundary. The vendor can still delete the attribute in
 * devtools; requireStorefrontEditAccess on the server is what actually refuses the write.
 * This exists so an honest vendor does not fill in a long form that was never going to
 * save.
 */

const TONE = {
  kyc_required: { bg: "#eef4fb", border: "#1f5f8b", text: "#123a55" },
  kyc_pending: { bg: "#fdf1dd", border: "#b26a00", text: "#6b3f00" },
  kyc_rejected: { bg: "#fbe9e9", border: "#a51d1d", text: "#6d1414" },
  payment_required: { bg: "#fff1f6", border: "#c2185b", text: "#7a1038" },
  expired: { bg: "#fdf1dd", border: "#b26a00", text: "#6b3f00" },
  tab_not_in_plan: { bg: "#fff1f6", border: "#c2185b", text: "#7a1038" },
};

/** What to say when the tab is locked because the plan does not include it. */
const upgradeCopy = (tabLabel, planName) => ({
  headline: `${tabLabel} is not in your ${planName || "current"} plan`,
  message:
    "You can look around, but editing this section needs a higher plan. Upgrade any time and your existing content stays exactly as it is.",
});

const LockedTabOverlay = ({ access, tabId, children, showBanner = true }) => {
  const navigate = useNavigate();

  const tabLabel = access?.tabLabels?.[tabId] || "This section";
  const isBusinessTab = tabId === "business";

  const editable = isBusinessTab
    ? access?.canEditBusinessDetails
    : access?.editableTabs?.includes(tabId);

  // While access is still loading, or the vendor genuinely has access, render normally.
  if (access?.loading || editable) return <>{children}</>;

  // A plan is active but does not cover this tab — a different message from "you have
  // no plan at all", because the resolution is different too.
  const notInPlan = access?.stage === "active" || access?.stage === "legacy_grace";

  const copy = notInPlan
    ? upgradeCopy(tabLabel, access?.subscription?.planName)
    : { headline: access?.headline, message: access?.message };

  const tone = TONE[notInPlan ? "tab_not_in_plan" : access?.stage] || TONE.payment_required;
  const action = access?.nextAction;

  const handleAction = () => {
    if (notInPlan) {
      navigate("/vendor-dashboard/upgrade/vendor-plan");
      return;
    }
    if (action?.href) navigate(action.href);
  };

  const showButton = notInPlan || Boolean(action?.href);
  const buttonLabel = notInPlan ? "View plans" : action?.label;

  return (
    <div>
      {/* Business details renders its own, richer verification banner — showing this
          one too would say the same thing twice on the same screen. */}
      {showBanner && (
      <div
        className="d-flex align-items-start gap-3 rounded-3 p-3 p-md-4 mb-4"
        style={{ background: tone.bg, borderLeft: `4px solid ${tone.border}`, color: tone.text }}
        role="status"
      >
        <span
          aria-hidden="true"
          className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: tone.border,
            color: "#fff",
          }}
        >
          <FiLock size={16} />
        </span>

        <div className="flex-grow-1">
          <div className="fw-bold mb-1" style={{ fontSize: "1.02rem" }}>
            {copy.headline || `${tabLabel} is locked`}
          </div>
          <div style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
            {copy.message || "Complete your setup to edit this section."}
          </div>

          {showButton && (
            <button
              type="button"
              className="btn btn-sm mt-3"
              style={{ background: tone.border, color: "#fff", fontWeight: 600 }}
              onClick={handleAction}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
      )}

      {/* The fieldset is what actually disables the form; pointer-events covers the
          non-form controls a disabled fieldset does not reach. */}
      <fieldset
        disabled
        aria-label={`${tabLabel} (read only)`}
        style={{
          border: 0,
          padding: 0,
          margin: 0,
          minWidth: 0,
          pointerEvents: "none",
          opacity: 0.72,
          userSelect: "text",
        }}
      >
        {children}
      </fieldset>
    </div>
  );
};

export default LockedTabOverlay;
