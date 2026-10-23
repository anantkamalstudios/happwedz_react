// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" parts (helper D): one numbered step (done / to do / "Start here", opens and closes in place) and
// the server's error with a hint for the codes a vendor can act on (ai_limit_reached, feature_disabled, rate_limited).
import { forwardRef, useId } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { ErrorNote } from "./ProfileShared";
import { errorHint } from "./ImproveUtils";

/** The server's message (red) and, for some codes, what the vendor can do. */
export function ImproveError({ error, fallback }) {
  if (!error) return null;
  const hint = errorHint(error);
  return (
    <div className="gp-i-error">
      <ErrorNote error={error} fallback={fallback} />
      {hint && <p className="gp-note">{hint}</p>}
    </div>
  );
}

/**
 * One next step. The heading is a button that opens or closes the step (the body stays mounted, so ticks are kept).
 * `state` is "done", "todo" or "unknown" (still loading); `current` marks the first step not done ("Start here").
 */
export const ImproveStep = forwardRef(function ImproveStep(
  { number, total, title, state, current, open, onToggle, summary, children },
  ref,
) {
  const id = useId();
  const done = state === "done";
  const stateText = done ? "Done" : state === "unknown" ? "Checking" : "To do";
  return (
    <li className={`gp-i-step${done ? " is-done" : ""}${current ? " is-current" : ""}`}>
      <h3 className="gp-h3 gp-i-step-h">
        <button
          ref={ref}
          type="button"
          className="gp-i-step-toggle"
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={onToggle}
        >
          <span className="gp-i-step-num" aria-hidden="true">
            {done ? <FiCheck size={16} /> : number}
          </span>
          <span className="gp-i-step-title">
            <span className="visually-hidden">
              Step {number} of {total}:{" "}
            </span>
            {title}
            <span className="visually-hidden">
              {" "}
              ({stateText}
              {current ? ", start here" : ""})
            </span>
          </span>
          <span className="gp-i-step-flags" aria-hidden="true">
            {current && <span className="gp-chip gp-chip-pink">Start here</span>}
            <span className={`gp-chip ${done ? "gp-chip-ok" : "gp-e-chip-muted"}`}>{stateText}</span>
          </span>
          <FiChevronDown size={18} aria-hidden="true" className="gp-i-step-chev" />
        </button>
      </h3>
      {summary && <p className="gp-note gp-i-step-summary">{summary}</p>}
      <div id={`${id}-body`} className="gp-i-step-body" hidden={!open}>
        {children}
      </div>
    </li>
  );
});
