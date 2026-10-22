// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Fixes tab — built by helper E. GrowthOS's fix plan for the Google profile: the GrowthOS score now and after the
// selected fixes (gainOf), each open fix with what it changes (now → new), Apply or Dismiss each (or Apply selected),
// what needs the vendor (opens the Photos, Reviews or Profile tab), and Check again (runs in the background; the plan
// refreshes until its checked_at changes). API: gpManageApi.fixes / prepareFixes / approveFix / rejectFix.
// Shape: GrowthOS fixPlanSchema, isOpenFix and gainOf (growthos-web/src/contracts/ai-commands.ts).
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiCheck, FiImage, FiLock, FiStar, FiTool, FiX } from "react-icons/fi";
import { errorMessage, gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { formatWhen } from "../gpFormat";
import { AuthImage, EmptyBox, ErrorNote, TabError, TabLoading } from "./ProfileShared";
import { GOOGLE_BLOCK_TEXT } from "./ProfileUtils";

const isOpenFix = (f) => f.status === "pending_approval" || f.status === "escalated";

/** What the given fixes add: the points of the failed checks they fix, each counted once (GrowthOS gainOf). */
const gainOf = (plan, fixes) => {
  const checks = new Set(fixes.flatMap((f) => f.checks || []));
  return [...checks].reduce((sum, c) => sum + (plan.check_points?.[c] ?? 0), 0);
};

const FIELD_NAMES = {
  description: "description",
  hours: "opening hours",
  services: "services",
  attributes: "attributes",
  categories: "other categories",
  special_hours: "holiday hours",
  website: "website",
};

const CATEGORY_NAMES = {
  profile_completeness: "Profile completeness",
  content_quality: "Content quality",
  reviews: "Reviews",
  activity: "Activity",
  photos: "Photos",
  seo: "Search",
};

/** What a fix does, in words. */
const fixText = (f) => {
  switch (f.action) {
    case "update_google_profile":
      return FIELD_NAMES[f.field] ? `Update your ${FIELD_NAMES[f.field]} on Google` : "Update your Google profile";
    case "add_google_photo":
      return f.kind === "logo" ? "Add your logo to Google" : f.kind === "cover" ? "Add your cover photo to Google" : "Add a photo to Google";
    case "add_google_keyword":
      return `Track the keyword “${f.keyword || ""}”`;
    case "publish_google_post":
      return `Publish a Google post: ${f.post?.topic || ""}`;
    default:
      return "Improve your Google profile";
  }
};

const POLL_MS = 3000;
const POLL_TRIES = 60;

/** One open fix: what it changes, its points, Apply / Dismiss. */
function FixItem({ fix, plan, checked, onCheck, busy, disabled, onApply, onDismiss }) {
  const points = gainOf(plan, [fix]);
  const checkId = `gp-e-fix-${fix.action_id}`;
  return (
    <li className={`gp-e-fix${checked ? " is-checked" : ""}`}>
      <div className="gp-e-fix-head">
        <input id={checkId} type="checkbox" checked={checked} onChange={(e) => onCheck(e.target.checked)} disabled={disabled} />
        <div className="gp-e-stack-sm gp-e-grow">
          <label htmlFor={checkId} className="gp-e-item-title">
            {fixText(fix)}
          </label>
          <div className="gp-chips">
            {points > 0 ? <span className="gp-chip gp-chip-pink">+{points} points</span> : <span className="gp-chip gp-e-chip-muted">Not in the score</span>}
            {fix.status === "escalated" && <span className="gp-chip gp-chip-warn">Low confidence: check it</span>}
          </div>
        </div>
      </div>

      {fix.image_url && <AuthImage src={fix.image_url} alt="The photo that will be added" className="gp-e-fix-img" />}
      {fix.post && (
        <div className="gp-e-box">
          <b>{fix.post.topic}</b>
          {fix.post.text && <p className="gp-e-pre">{fix.post.text}</p>}
          {fix.post.button && <span className="gp-note">Button: {fix.post.button}</span>}
        </div>
      )}
      {fix.value && (
        <dl className="gp-e-compare">
          <div>
            <dt>On Google now</dt>
            <dd className="gp-e-pre">{fix.current || <span className="gp-muted">Not set</span>}</dd>
          </div>
          <div className="is-new">
            <dt>New version</dt>
            <dd className="gp-e-pre">{fix.value}</dd>
          </div>
        </dl>
      )}
      {fix.reason && <p className="gp-note">{fix.reason}</p>}

      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-primary gp-e-btn-sm" onClick={onApply} disabled={disabled} aria-busy={busy === "apply" || undefined}>
          {busy === "apply" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCheck size={16} aria-hidden="true" />}
          Apply<span className="visually-hidden">: {fixText(fix)}</span>
        </button>
        <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={onDismiss} disabled={disabled} aria-busy={busy === "dismiss" || undefined}>
          {busy === "dismiss" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiX size={16} aria-hidden="true" />}
          Dismiss<span className="visually-hidden">: {fixText(fix)}</span>
        </button>
      </div>
    </li>
  );
}

/** The score now → after the selected fixes, and the points per area. */
function ScoreCard({ plan, picked, after }) {
  const audit = plan.audit;
  if (!audit) {
    return (
      <aside className="gp-card gp-e-score" aria-label="GrowthOS score">
        <p className="gp-e-label">GrowthOS score</p>
        <p className="gp-muted">Not available yet</p>
      </aside>
    );
  }
  const gain = Math.max(0, after - audit.score);
  return (
    <aside className="gp-card gp-e-score" aria-label="GrowthOS score">
      <p className="gp-e-label">GrowthOS score</p>
      <p className="gp-e-score-line">
        <span className="gp-e-score-now">{audit.score}</span>
        <span aria-hidden="true"> → </span>
        <span className="visually-hidden"> now, </span>
        <span className="gp-e-score-after">{after}</span>
        <span className="visually-hidden"> after the selected fixes,</span>
        <span className="gp-muted"> / {audit.max_score}</span>
      </p>
      {gain > 0 && <span className="gp-chip gp-chip-pink">+{gain} with the selected fixes</span>}
      {audit.partial && <p className="gp-note">Partial score: some checks need data from Google and are not counted yet.</p>}
      <div className="gp-e-meters">
        {(audit.categories || []).map((c) => {
          const cur = c.score ?? 0;
          const here = c.checks || [];
          const add = gainOf(plan, picked.map((f) => ({ checks: (f.checks || []).filter((k) => here.includes(k)) })));
          const pct = (v) => (c.weight ? Math.min(100, (v / c.weight) * 100) : 0);
          return (
            <div key={c.key} className="gp-e-meter">
              <div className="gp-e-meter-row">
                <span>{CATEGORY_NAMES[c.key] || c.key}</span>
                <span className="gp-muted">
                  {c.score === null ? "Not checked" : add > 0 ? `${cur} → ${cur + add} / ${c.weight}` : `${cur} / ${c.weight}`}
                </span>
              </div>
              <div className="gp-e-meter-bar" aria-hidden="true">
                <span className="is-after" style={{ width: `${pct(cur + add)}%` }} />
                <span style={{ width: `${pct(cur)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="gp-note">Our own check, not an official Google score. It updates once Google shows the changes.</p>
    </aside>
  );
}

export default function FixesTab({ onOpenTab }) {
  const [state, setState] = useState({ status: "loading", plan: null, error: null });
  const [selected, setSelected] = useState(null); // null = every open fix
  const [busy, setBusy] = useState(null); // { id, kind } | { id: "all" }
  const [actionError, setActionError] = useState(null);
  const [done, setDone] = useState("");
  const [waiting, setWaiting] = useState(null); // { checked } while Check again runs
  const [prepareBusy, setPrepareBusy] = useState(false);
  const [prepareError, setPrepareError] = useState(null);
  const tries = useRef(0);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const plan = await gpManageApi.fixes();
      setState({ status: "ready", plan, error: null });
      return plan;
    } catch (error) {
      setState((s) => (quiet && s.status === "ready" ? s : { ...s, status: "error", error }));
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const plan = state.plan;
  const checkedAt = plan?.checked_at ?? null;
  const finished = waiting && checkedAt !== waiting.checked;
  const polling = state.status === "ready" && ((waiting && !finished) || plan?.rechecking) && tries.current < POLL_TRIES;

  // While a check runs in the background, read the plan again every few seconds.
  useEffect(() => {
    if (!polling) return undefined;
    const timer = setTimeout(() => {
      tries.current += 1;
      load(true);
    }, POLL_MS);
    return () => clearTimeout(timer);
  }, [polling, plan, load]);

  useEffect(() => {
    if (finished) {
      setWaiting(null);
      setSelected(null);
      setDone("The check is finished. The plan below is up to date.");
    }
  }, [finished]);

  const checkAgain = async () => {
    setPrepareBusy(true);
    setPrepareError(null);
    setDone("");
    try {
      await gpManageApi.prepareFixes();
      tries.current = 0;
      setWaiting({ checked: checkedAt });
    } catch (error) {
      setPrepareError(error);
    } finally {
      setPrepareBusy(false);
    }
  };

  if (state.status === "loading") return <TabLoading label="Loading your fix plan…" />;
  if (state.status === "error") return <TabError error={state.error} onRetry={() => load()} />;

  const header = (
    <div className="gp-e-head">
      <div className="gp-e-stack-sm">
        <h2 className="gp-h3">Fixes for your Google profile</h2>
        <p className="gp-note">
          {plan?.checked_at ? `Last checked ${formatWhen(plan.checked_at)}.` : plan?.prepared_at ? `Prepared ${formatWhen(plan.prepared_at)}.` : "Not checked yet."}
        </p>
      </div>
      <RefreshButton onClick={checkAgain} busy={prepareBusy || Boolean(waiting)} disabled={Boolean(busy)}>
        {waiting ? "Checking…" : "Check again"}
      </RefreshButton>
    </div>
  );

  const status = (
    <div aria-live="polite" className="gp-e-stack-sm">
      {(waiting || plan?.rechecking) && (
        <Callout tone="warn">
          {tries.current >= POLL_TRIES
            ? "The check is taking longer than usual. Come back in a few minutes."
            : "Checking your Google profile and preparing fixes. This takes up to a minute; you can stay or come back."}
        </Callout>
      )}
      {done && <Callout tone="ok">{done}</Callout>}
    </div>
  );

  if (!plan?.available) {
    return (
      <div className="gp-e-tab">
        {header}
        {status}
        <ErrorNote error={prepareError} />
        <Callout tone="warn">
          {GOOGLE_BLOCK_TEXT[plan?.reason] || "The fix plan works once your Google profile is verified and connected. Please try again later."}
        </Callout>
        <div className="gp-btns">
          <RefreshButton onClick={() => load()}>Try again</RefreshButton>
        </div>
      </div>
    );
  }

  const fixes = Array.isArray(plan.fixes) ? plan.fixes : [];
  const open = fixes.filter(isOpenFix);
  const chosen = selected ?? open.map((f) => f.action_id);
  const picked = open.filter((f) => chosen.includes(f.action_id));
  const score = plan.audit?.score ?? 0;
  const max = plan.audit?.max_score ?? 100;
  const after = Math.min(max, score + gainOf(plan, picked));
  const replies = (plan.reviews || []).filter((r) => !r.blocked);
  const doneToday = fixes.filter((f) => f.status === "executed" || f.status === "failed");
  const needsCategory = (plan.checklist || []).some((row) => row.result === "need:primary_category");
  const working = Boolean(busy);

  const runOne = async (fix, kind) => {
    setBusy({ id: fix.action_id, kind });
    setActionError(null);
    setDone("");
    try {
      if (kind === "apply") {
        const result = await gpManageApi.approveFix(fix.action_id);
        if (result?.status === "failed") {
          setActionError({ response: { data: { message: result.result || `“${fixText(fix)}” could not be done.` } } });
        } else {
          setDone(`Sent to Google: ${fixText(fix)}. Google checks it before showing it.`);
        }
      } else {
        await gpManageApi.rejectFix(fix.action_id);
        setDone(`Dismissed: ${fixText(fix)}.`);
      }
      setSelected((current) => (current ? current.filter((x) => x !== fix.action_id) : current));
      await load(true);
    } catch (error) {
      setActionError(error);
    } finally {
      setBusy(null);
    }
  };

  const applySelected = async () => {
    setBusy({ id: "all" });
    setActionError(null);
    setDone("");
    let sent = 0;
    const failed = [];
    for (const fix of picked) {
      try {
        const result = await gpManageApi.approveFix(fix.action_id);
        if (result?.status === "failed") failed.push(`${fixText(fix)}${result.result ? `: ${result.result}` : ""}`);
        else sent += 1;
      } catch (error) {
        failed.push(`${fixText(fix)}: ${errorMessage(error)}`);
      }
    }
    if (sent) setDone(`${sent} ${sent === 1 ? "fix" : "fixes"} sent to Google. Google checks each change before showing it.`);
    if (failed.length) setActionError({ response: { data: { message: `${failed.length} could not be done.`, details: { fields: failed.map((m, i) => ({ path: String(i), message: m })) } } } });
    setSelected(null);
    await load(true);
    setBusy(null);
  };

  const needs = [
    ...(plan.needs_you || []).map((n) => {
      if (n.key === "photos")
        return {
          key: "photos",
          icon: FiImage,
          title: `Add ${n.count} real ${n.count === 1 ? "photo" : "photos"} of your business`,
          body: "Profiles with 10 or more photos look trusted. AI never makes fake photos.",
          action: "Add photos",
          tab: "photos",
          points: n.points,
        };
      if (n.key === "low_reviews")
        return {
          key: "low_reviews",
          icon: FiStar,
          title: `${n.count} low-rated ${n.count === 1 ? "review waits" : "reviews wait"} for you`,
          body: "Replies to 1–3★ reviews always need you. The AI prepares a draft you can use.",
          action: "Open Reviews",
          tab: "reviews",
          points: n.points,
        };
      return null;
    }),
    replies.length
      ? {
          key: "replies",
          icon: FiStar,
          title: `${replies.length} ${replies.length === 1 ? "reply is" : "replies are"} ready for 4–5★ reviews`,
          body: "Check each reply and publish it in Reviews.",
          action: "Open Reviews",
          tab: "reviews",
          points: gainOf(plan, [{ checks: plan.review_checks || [] }]),
        }
      : null,
    needsCategory
      ? {
          key: "category",
          icon: FiTool,
          title: "Your Google profile has no main category",
          body: "Choose one in the Profile tab, under Categories.",
          action: "Open Profile",
          tab: "profile",
          points: 0,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="gp-e-tab">
      {header}
      {status}
      <ErrorNote error={prepareError} />

      <div className="gp-e-fix-layout">
        <div className="gp-e-stack gp-e-grow">
          <div className="gp-e-head">
            <h3 className="gp-h3">AI can do these for you now</h3>
            {open.length > 1 && (
              <button
                type="button"
                className="gp-btn gp-btn-ghost gp-e-btn-sm"
                disabled={working}
                onClick={() => setSelected(chosen.length === open.length ? [] : open.map((f) => f.action_id))}
              >
                {chosen.length === open.length ? "Clear all" : "Select all"}
              </button>
            )}
          </div>
          <ErrorNote error={actionError} />
          {open.length === 0 ? (
            plan.level < 2 ? (
              <EmptyBox icon={FiTool} title="The Growth Agent is off">
                GrowthOS's Growth Agent prepares these fixes. It is switched off for your profile; it can be switched on in
                GrowthOS under Autopilot.
              </EmptyBox>
            ) : (
              <EmptyBox icon={FiCheck} title="No fixes waiting">
                Everything the AI can fix is done or waiting for its next daily check.
              </EmptyBox>
            )
          ) : (
            <ul className="gp-e-plain gp-e-stack">
              {open.map((fix) => (
                <FixItem
                  key={fix.action_id}
                  fix={fix}
                  plan={plan}
                  checked={chosen.includes(fix.action_id)}
                  onCheck={(on) => setSelected(on ? [...chosen, fix.action_id] : chosen.filter((x) => x !== fix.action_id))}
                  busy={busy?.id === fix.action_id ? busy.kind : null}
                  disabled={working}
                  onApply={() => runOne(fix, "apply")}
                  onDismiss={() => runOne(fix, "dismiss")}
                />
              ))}
            </ul>
          )}

          {needs.length > 0 && (
            <>
              <h3 className="gp-h3">Needs you</h3>
              <ul className="gp-e-plain gp-e-needs">
                {needs.map((n) => {
                  const Icon = n.icon;
                  return (
                    <li key={n.key} className="gp-e-need">
                      <b>{n.title}</b>
                      <span className="gp-note">{n.body}</span>
                      <div className="gp-btns">
                        <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={() => onOpenTab?.(n.tab)}>
                          <Icon size={16} aria-hidden="true" />
                          {n.action}
                        </button>
                        {n.points > 0 && <span className="gp-chip gp-chip-pink">+{n.points} points</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {doneToday.length > 0 && (
            <details className="gp-e-details">
              <summary>Done in the last 24 hours ({doneToday.length})</summary>
              <ul className="gp-e-plain gp-e-stack-sm">
                {doneToday.map((f) => (
                  <li key={f.action_id} className={f.status === "failed" ? "gp-e-error" : ""}>
                    {f.status === "failed" ? "Not done: " : "Done: "}
                    {f.result || fixText(f)}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div className="gp-e-stack gp-e-fix-side">
          <ScoreCard plan={plan} picked={picked} after={after} />
          {open.length > 0 && (
            <button type="button" className="gp-btn gp-btn-primary gp-e-wide" disabled={working || picked.length === 0} onClick={applySelected} aria-busy={busy?.id === "all" || undefined}>
              {busy?.id === "all" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCheck size={18} aria-hidden="true" />}
              {busy?.id === "all"
                ? "Sending to Google…"
                : picked.length === 0
                  ? "Select at least one fix"
                  : `Apply ${picked.length} selected ${picked.length === 1 ? "fix" : "fixes"}`}
            </button>
          )}
          <p className="gp-note gp-e-inline">
            <FiLock size={14} aria-hidden="true" /> AI never changes your name, address, main category or phone. Google checks every
            change before showing it.
          </p>
        </div>
      </div>
    </div>
  );
}
