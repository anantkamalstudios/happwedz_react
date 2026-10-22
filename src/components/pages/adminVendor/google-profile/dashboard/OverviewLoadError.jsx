// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// The error state of helper D's tabs: the server's message and a "Try again" button.
import { FiRefreshCw } from "react-icons/fi";
import { Callout } from "../GpParts";

export default function OverviewLoadError({ message, onRetry }) {
  return (
    <div className="gp-stack-sm">
      <Callout tone="bad" role="alert">
        {message}
      </Callout>
      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onRetry}>
          <FiRefreshCw size={18} aria-hidden="true" />
          Try again
        </button>
      </div>
    </div>
  );
}
