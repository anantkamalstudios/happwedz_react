// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" tab — built by helper D: the score, the AI helper switch and the ordered next steps (use my
// storefront, keywords, services, photos, AI fixes, things only the vendor can do). Each step is done / to do; the
// first one not done says "Start here" and opens. Reuses FixesTab (embedded) for the AI fixes and the score.
// RD-25 (contract §7.4): chat-first. The AI assistant chat (AssistantChat) is the main column; the score, the AI
// helper switch and the steps are the side column (below the chat on phones). A change applied in the chat reloads
// the fixes and the score; "Open fixes" in the chat opens the AI fixes step.
// API: gpManageApi.agent / storefront / keywords / services (+ the calls inside each step and FixesTab), assistantApi.
import { useCallback, useRef, useState } from "react";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import AssistantChat from "./AssistantChat";
import FixesTab from "./FixesTab";
import ImproveAgent from "./ImproveAgent";
import ImproveKeywords from "./ImproveKeywords";
import ImproveNeeds from "./ImproveNeeds";
import ImprovePhotos from "./ImprovePhotos";
import ImproveServices from "./ImproveServices";
import ImproveStorefront from "./ImproveStorefront";
import { ImproveStep } from "./ImproveParts";
import { KEYWORDS_NEEDED, activeKeywords, checklistKeys, isOpenFix, listOf, useLoad, vendorNeeds } from "./ImproveUtils";
import "./dashboard-improve.css";

const STEP_IDS = ["storefront", "keywords", "services", "photos", "fixes", "needs"];

/** Done when the AI helper's check found the logo, the cover and photos in place (or the vendor just sent some). */
const photosDoneByPlan = (plan) => {
  if (!plan?.available) return false;
  const rows = plan.checklist || [];
  const has = (step) => rows.some((r) => r.step === step);
  const needs = checklistKeys(plan, "need");
  return (
    has("logo") &&
    has("cover") &&
    !needs.some((k) => k === "logo" || k === "cover" || k === "library_photos") &&
    !(plan.needs_you || []).some((n) => n?.key === "photos")
  );
};

export default function ImproveTab({ onOpenTab }) {
  const agent = useLoad(gpManageApi.agent);
  const storefront = useLoad(gpManageApi.storefront);
  const keywords = useLoad(gpManageApi.keywords);
  const services = useLoad(gpManageApi.services);
  // What GrowthOS already has (read on load), replaced by the answer once the vendor presses the button.
  const savedFacts = useLoad(gpManageApi.facts);
  const [usedFacts, setFacts] = useState(null);
  const facts = usedFacts ?? (savedFacts.status === "ready" ? savedFacts.data : null);
  const [photosSent, setPhotosSent] = useState(false);
  const [report, setReport] = useState(null); // { status, plan, after } from the fix list
  const [fixesKey, setFixesKey] = useState(0);
  const [opened, setOpened] = useState({});
  const [firstCurrent, setFirstCurrent] = useState(undefined);
  const toggles = useRef({});

  const onReport = useCallback((next) => setReport(next), []);
  const reloadFixes = useCallback(() => {
    setReport(null);
    setFixesKey((k) => k + 1);
  }, []);

  const plan = report?.status === "ready" ? report.plan : null;
  const planKnown = report?.status === "ready" || report?.status === "error";
  const level = typeof plan?.level === "number" ? plan.level : 0;
  const openFixes = plan?.available ? (plan.fixes || []).filter(isOpenFix) : [];
  const activeCount = keywords.status === "ready" ? activeKeywords(listOf(keywords.data)).length : 0;
  const serviceCount = services.status === "ready" ? listOf(services.data).length : 0;

  const states = {
    storefront: facts?.description ? "done" : storefront.status === "loading" ? "unknown" : "todo",
    keywords: keywords.status === "loading" ? "unknown" : activeCount >= KEYWORDS_NEEDED ? "done" : "todo",
    services: services.status === "loading" ? "unknown" : serviceCount > 0 ? "done" : "todo",
    photos: photosSent || photosDoneByPlan(plan) ? "done" : planKnown ? "todo" : "unknown",
    fixes: !planKnown
      ? "unknown"
      : plan?.available && level >= 2 && openFixes.length === 0 && plan.checked_at && !plan.rechecking
        ? "done"
        : "todo",
    needs: !planKnown
      ? "unknown"
      : plan?.available && (plan.checklist || []).length > 0 && vendorNeeds(plan).needs.length === 0
        ? "done"
        : "todo",
  };

  // The first step not done ("Start here"); undefined while an earlier step is still loading, null when all are done.
  let current = null;
  for (const id of STEP_IDS) {
    if (states[id] === "unknown") {
      current = undefined;
      break;
    }
    if (states[id] === "todo") {
      current = id;
      break;
    }
  }

  // The step that was first when the tab opened stays open (finishing it does not close it under the vendor).
  if (firstCurrent === undefined && current !== undefined) setFirstCurrent(current);

  const isOpen = (id) => opened[id] ?? id === firstCurrent;
  const toggle = (id) => setOpened((cur) => ({ ...cur, [id]: !isOpen(id) }));
  const openStep = (id) => {
    setOpened((cur) => ({ ...cur, [id]: true }));
    const el = toggles.current[id];
    if (!el) return;
    el.focus({ preventScroll: true });
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const agentOff = agent.status === "ready" && agent.data && !agent.data.on;
  const total = STEP_IDS.length;

  const step = (id, number, title, summary, body) => (
    <ImproveStep
      key={id}
      ref={(el) => {
        toggles.current[id] = el;
      }}
      number={number}
      total={total}
      title={title}
      state={states[id]}
      current={current === id}
      open={isOpen(id)}
      onToggle={() => toggle(id)}
      summary={summary}
    >
      {body}
    </ImproveStep>
  );

  const keywordSummary =
    keywords.status === "ready"
      ? activeCount >= KEYWORDS_NEEDED
        ? `${activeCount} keywords — enough.`
        : `${activeCount} of ${KEYWORDS_NEEDED} keywords.`
      : "";
  const serviceSummary =
    services.status === "ready" ? (serviceCount ? `${serviceCount} ${serviceCount === 1 ? "service" : "services"} saved.` : "No services yet.") : "";
  const fixSummary = !plan?.available
    ? ""
    : openFixes.length
      ? `${openFixes.length} ${openFixes.length === 1 ? "fix waits" : "fixes wait"} for your Apply.`
      : "No fixes waiting.";
  const needCount = plan?.available ? vendorNeeds(plan).needs.length : 0;
  const needSummary = plan?.available && (plan.checklist || []).length ? (needCount ? `${needCount} to do.` : "Nothing needs you.") : "";

  return (
    <div className="gp-e-tab gp-i-tab">
      <div className="gp-e-stack-sm">
        <h2 className="gp-h2">Improve with AI</h2>
        <p className="gp-lead">
          Ask the AI assistant, or follow the steps. The AI does most of the work and asks before every change on
          Google.
        </p>
      </div>

      <div className="gp-a-layout">
        <div className="gp-a-main">
          <AssistantChat onOpenTab={onOpenTab} onOpenFixes={() => openStep("fixes")} onChanged={reloadFixes} />
        </div>

        <div className="gp-a-side">
          <ImproveAgent agent={agent} report={report} onChanged={reloadFixes} />

          {agentOff && <Callout tone="warn">Turn on the AI helper so it can prepare fixes.</Callout>}

          <section aria-labelledby="gp-i-steps-title" className="gp-e-stack">
            <div className="gp-e-head">
              <h2 className="gp-h3" id="gp-i-steps-title">
                Next steps
              </h2>
              {current === null && <span className="gp-chip gp-chip-ok">All steps done</span>}
            </div>
            <ol className="gp-e-plain gp-i-steps">
              {step(
                "storefront",
                1,
                "Use my storefront",
                facts?.description ? "GrowthOS has your description." : "Copy your About us text and FAQs to GrowthOS.",
                <ImproveStorefront storefront={storefront} facts={facts} onUsed={setFacts} />,
              )}
              {step("keywords", 2, "Keywords", keywordSummary, <ImproveKeywords keywords={keywords} />)}
              {step("services", 3, "Services", serviceSummary, <ImproveServices services={services} />)}
              {step(
                "photos",
                4,
                "Photos",
                photosSent ? "Photos sent to Google." : "Pick your cover photo, logo and photos from your storefront, or upload them.",
                <ImprovePhotos storefront={storefront} onSent={() => setPhotosSent(true)} />,
              )}
              {step(
                "fixes",
                5,
                "AI fixes ready",
                fixSummary,
                <FixesTab key={fixesKey} embedded onReport={onReport} onOpenTab={onOpenTab} />,
              )}
              {step(
                "needs",
                6,
                "Only you can do this",
                needSummary,
                <ImproveNeeds report={report} onOpenTab={onOpenTab} onOpenStep={openStep} onRetry={reloadFixes} />,
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
