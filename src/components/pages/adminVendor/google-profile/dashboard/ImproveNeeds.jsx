// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" step 6 (helper D): what only the vendor can do, from the AI helper's last check (the fix plan's
// checklist "need:" rows, low-rated reviews, review replies waiting, photos), each with one button that opens the
// right tab (Profile, Reviews) or one of the steps above. Shape: GrowthOS fixPlanSchema (ai-commands.ts).
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Callout, RefreshButton } from "../GpParts";
import { TabLoading } from "./ProfileShared";
import { GOOGLE_BLOCK_TEXT } from "./ProfileUtils";
import { vendorNeeds } from "./ImproveUtils";

export default function ImproveNeeds({ report, onOpenTab, onOpenStep, onRetry }) {
  if (!report || report.status === "loading") return <TabLoading label="Loading the AI helper's check…" />;
  if (report.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <Callout tone="bad">We couldn't load the AI helper's check. Please try again.</Callout>
        <div className="gp-btns">
          <RefreshButton onClick={onRetry}>Try again</RefreshButton>
        </div>
      </div>
    );
  }
  const plan = report.plan;
  if (!plan?.available) {
    return (
      <Callout tone="warn">
        {GOOGLE_BLOCK_TEXT[plan?.reason] || "This list works once your Google profile is verified and connected."}
      </Callout>
    );
  }

  const { needs, fixed } = vendorNeeds(plan);
  const checked = (plan.checklist || []).length > 0;

  return (
    <div className="gp-e-stack">
      {needs.length === 0 ? (
        <Callout tone={checked ? "ok" : "warn"}>
          {checked
            ? "Nothing needs you right now."
            : "After its first check, the AI helper lists here what only you can do."}
        </Callout>
      ) : (
        <ul className="gp-e-plain gp-e-needs">
          {needs.map((n) => (
            <li key={n.key} className="gp-e-need">
              <b>{n.title}</b>
              <span className="gp-note">{n.body}</span>
              <div className="gp-btns">
                <button
                  type="button"
                  className="gp-btn gp-btn-ghost gp-e-btn-sm"
                  onClick={() => (n.tab ? onOpenTab?.(n.tab, true) : onOpenStep(n.step))}
                >
                  {n.action}
                  <FiArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {fixed.length > 0 && (
        <p className="gp-note gp-e-inline">
          <FiCheck size={14} aria-hidden="true" /> You fixed: {fixed.join(", ")}. The AI helper checks again and uses it.
        </p>
      )}
    </div>
  );
}
