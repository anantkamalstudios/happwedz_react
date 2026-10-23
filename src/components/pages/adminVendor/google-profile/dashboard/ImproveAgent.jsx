// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" top card (helper D): the GrowthOS score now → after the selected fixes (as the fix list counts
// it), and the AI helper switch (on = ask first: every change waits for the vendor's Apply). Turning it off asks first.
// API: gpManageApi.agent / setAgent — { on, configured, level, posts_per_week, review_replies, google_ready }.
import { useId, useState } from "react";
import { Spinner } from "react-bootstrap";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { ConfirmBox } from "./ProfileShared";
import { ImproveError } from "./ImproveParts";

/** "a, b and c". */
const joinWords = (parts) => {
  const list = parts.filter(Boolean);
  return list.length > 1 ? `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}` : list.join("");
};

/** The score now → after the selected fixes. `report` comes from the fix list: { status, plan, after }. */
function ImproveScore({ report }) {
  const audit = report?.plan?.available ? report.plan.audit : null;
  if (!report || report.status === "loading") {
    return (
      <div className="gp-i-score" role="status">
        <p className="gp-e-label">GrowthOS score</p>
        <p className="gp-i-score-wait">
          <Spinner animation="border" size="sm" aria-hidden="true" /> Loading…
        </p>
      </div>
    );
  }
  if (!audit) {
    return (
      <div className="gp-i-score">
        <p className="gp-e-label">GrowthOS score</p>
        <p className="gp-muted">Not available yet</p>
      </div>
    );
  }
  const after = Math.max(audit.score, report.after ?? audit.score);
  const gain = after - audit.score;
  return (
    <div className="gp-i-score">
      <p className="gp-e-label">GrowthOS score</p>
      <p className="gp-e-score-line">
        <span className="gp-e-score-now">{audit.score}</span>
        {gain > 0 && (
          <>
            <span aria-hidden="true"> → </span>
            <span className="visually-hidden"> now, </span>
            <span className="gp-e-score-after">{after}</span>
            <span className="visually-hidden"> after the selected fixes,</span>
          </>
        )}
        <span className="gp-muted"> / {audit.max_score}</span>
      </p>
      {gain > 0 ? (
        <span className="gp-chip gp-chip-pink">+{gain} with the selected fixes</span>
      ) : (
        <span className="gp-note">No fixes selected right now.</span>
      )}
      <p className="gp-note">Our own check, not an official Google score.</p>
    </div>
  );
}

export default function ImproveAgent({ agent, report, onChanged }) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");

  const data = agent.data;
  const on = Boolean(data?.on);

  const change = async (next) => {
    setBusy(true);
    setError(null);
    setMessage("");
    try {
      const answer = await gpManageApi.setAgent(next);
      agent.setData(answer ?? { ...(data || {}), on: next });
      setConfirming(false);
      setMessage(next ? "The AI helper is on. It asks before every change." : "The AI helper is off.");
      onChanged?.(next);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const onSwitch = () => {
    if (busy) return;
    if (on) setConfirming(true);
    else change(true);
  };

  let helper;
  if (agent.status === "loading") {
    helper = (
      <div className="gp-e-state gp-i-agent-wait" role="status">
        <Spinner animation="border" size="sm" aria-hidden="true" />
        <span>Loading the AI helper…</span>
      </div>
    );
  } else if (agent.status === "error") {
    helper = (
      <div className="gp-e-stack-sm">
        <ImproveError error={agent.error} fallback="We couldn't load the AI helper. Please try again." />
        <div className="gp-btns">
          <RefreshButton onClick={() => agent.reload()}>Try again</RefreshButton>
        </div>
      </div>
    );
  } else {
    const posts = typeof data?.posts_per_week === "number" && data.posts_per_week > 0 ? data.posts_per_week : null;
    helper = (
      <div className="gp-e-stack-sm">
        <div className="gp-i-switch-row">
          <span className="gp-e-label" id={`${id}-label`}>
            AI helper
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-labelledby={`${id}-label`}
            aria-describedby={`${id}-desc`}
            className={`gp-i-switch${on ? " is-on" : ""}`}
            onClick={onSwitch}
            disabled={busy || confirming}
            aria-busy={busy || undefined}
          >
            <span className="gp-i-switch-track" aria-hidden="true">
              <span className="gp-i-switch-knob" />
            </span>
            <span className="gp-i-switch-text">{on ? "On — asks before every change" : "Off"}</span>
            {busy && <Spinner animation="border" size="sm" aria-hidden="true" />}
          </button>
        </div>
        <p className="gp-note" id={`${id}-desc`}>
          {on
            ? `It ${joinWords([
                "prepares changes for your Google profile",
                data?.review_replies ? "drafts replies to 4–5★ reviews" : "",
                posts ? `writes ${posts} Google ${posts === 1 ? "post" : "posts"} a week` : "",
              ])}. Nothing goes to Google until you press Apply.`
            : "When it is on, it prepares changes for your Google profile. Nothing goes to Google until you press Apply."}
        </p>
        {on && data && data.google_ready === false && (
          <p className="gp-note">It starts once your Google profile is connected and verified.</p>
        )}
        {confirming && (
          <ConfirmBox
            title="Turn off the AI helper?"
            confirmLabel="Turn off"
            busy={busy}
            error={error}
            onConfirm={() => change(false)}
            onCancel={() => {
              setConfirming(false);
              setError(null);
            }}
          >
            It stops preparing fixes for your Google profile and drafting review replies. Nothing already on Google
            changes, and you can still make every change yourself.
          </ConfirmBox>
        )}
        {!confirming && <ImproveError error={error} />}
        <div aria-live="polite">{message && <Callout tone="ok">{message}</Callout>}</div>
      </div>
    );
  }

  return (
    <section className="gp-card gp-card-tint gp-i-top" aria-label="Your score and the AI helper">
      <ImproveScore report={report} />
      <div className="gp-i-top-helper">{helper}</div>
    </section>
  );
}
