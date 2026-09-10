import React from "react";

/**
 * The strip at the top of Business details telling the vendor exactly where they stand.
 *
 * Copy comes from the server's access resolver so the banner, the emails and any other
 * surface say the same thing rather than three teams' wording of the same rule.
 */

const TONES = {
  info: { bg: "#eef4fb", border: "#1f5f8b", text: "#123a55", icon: "ℹ" },
  pending: { bg: "#fdf1dd", border: "#b26a00", text: "#6b3f00", icon: "⏳" },
  success: { bg: "#e9f6ed", border: "#166534", text: "#0f4023", icon: "✓" },
  danger: { bg: "#fbe9e9", border: "#a51d1d", text: "#6d1414", icon: "!" },
};

const STAGE_TONE = {
  kyc_required: "info",
  kyc_pending: "pending",
  kyc_rejected: "danger",
  payment_required: "success",
  expired: "pending",
  legacy_grace: "info",
  active: "success",
};

const VerificationStatusBanner = ({ access, onAction }) => {
  if (!access || !access.headline) return null;

  const tone = TONES[STAGE_TONE[access.stage] || "info"];
  const action = access.nextAction;

  // A tab-targeted action is already where the vendor is standing — Business details —
  // so showing a button that goes nowhere would be noise.
  const showButton = Boolean(action && action.href);

  return (
    <div
      className="d-flex align-items-start gap-3 rounded-3 p-3 p-md-4 mb-4"
      style={{
        background: tone.bg,
        borderLeft: `4px solid ${tone.border}`,
        color: tone.text,
      }}
      role="status"
    >
      <span
        aria-hidden="true"
        className="d-inline-flex align-items-center justify-content-center flex-shrink-0 fw-bold"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: tone.border,
          color: "#fff",
          fontSize: "0.9rem",
        }}
      >
        {tone.icon}
      </span>

      <div className="flex-grow-1">
        <div className="fw-bold mb-1" style={{ fontSize: "1.02rem" }}>
          {access.headline}
        </div>
        <div style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>{access.message}</div>

        {access.stage === "kyc_rejected" && access.reviewedAt && (
          <div className="mt-2" style={{ fontSize: "0.82rem", opacity: 0.85 }}>
            Reviewed on {new Date(access.reviewedAt).toLocaleDateString()}
          </div>
        )}
        {access.stage === "kyc_pending" && access.submittedAt && (
          <div className="mt-2" style={{ fontSize: "0.82rem", opacity: 0.85 }}>
            Submitted on {new Date(access.submittedAt).toLocaleDateString()}
          </div>
        )}

        {showButton && (
          <button
            type="button"
            className="btn btn-sm mt-3"
            style={{ background: tone.border, color: "#fff", fontWeight: 600 }}
            onClick={() => onAction?.(action)}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerificationStatusBanner;
