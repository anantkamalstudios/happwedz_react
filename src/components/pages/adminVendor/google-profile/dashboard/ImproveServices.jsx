// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" step 3 (helper D): the vendor's services in GrowthOS. The AI suggests up to 10 from the storefront;
// the vendor ticks them, can change each name and description, and adds the ticked ones; saved ones can be removed.
// The Growth Agent then lists them on Google. API: gpManageApi.services / suggestServices / addService / deleteService.
// Shapes: GrowthOS serviceRecordSchema; suggestions { service_name, category, description } (contract §4.2).
import { useId, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiPlus, FiTrash2, FiZap } from "react-icons/fi";
import { errorMessage, gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { TabLoading } from "./ProfileShared";
import { ImproveError } from "./ImproveParts";
import { listOf, suggestionsOf } from "./ImproveUtils";

// GrowthOS serviceSchema limits.
const LIMITS = { service_name: 150, category: 100, description: 2000 };

const EMPTY_SERVICE = { service_name: "", category: "", description: "" };

const same = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

/** Why a suggestion can't be added yet, per field. */
const problemsOf = (s) => {
  const out = {};
  if (!s.service_name.trim()) out.service_name = "Enter a name.";
  else if (s.service_name.trim().length > LIMITS.service_name) out.service_name = `Use at most ${LIMITS.service_name} characters.`;
  if (!s.category.trim()) out.category = "Enter a category.";
  else if (s.category.trim().length > LIMITS.category) out.category = `Use at most ${LIMITS.category} characters.`;
  if (!s.description.trim()) out.description = "Enter a short description.";
  else if (s.description.trim().length > LIMITS.description) out.description = `Use at most ${LIMITS.description} characters.`;
  return out;
};

/** One AI idea: tick, name, (category when the AI gave none), description. */
function ServiceIdea({ idea, onChange, disabled, problems }) {
  const id = useId();
  const field = (key, label, multiline = false) => (
    <div className="gp-e-field">
      <label className="gp-note" htmlFor={`${id}-${key}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          id={`${id}-${key}`}
          className="gp-input gp-e-textarea gp-i-textarea"
          value={idea[key]}
          maxLength={LIMITS[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          disabled={disabled}
          aria-invalid={Boolean(problems[key]) || undefined}
          aria-describedby={problems[key] ? `${id}-${key}-error` : undefined}
        />
      ) : (
        <input
          id={`${id}-${key}`}
          className="gp-input"
          value={idea[key]}
          maxLength={LIMITS[key]}
          onChange={(e) => onChange({ [key]: e.target.value })}
          disabled={disabled}
          aria-invalid={Boolean(problems[key]) || undefined}
          aria-describedby={problems[key] ? `${id}-${key}-error` : undefined}
        />
      )}
      {problems[key] && (
        <span className="gp-e-error" id={`${id}-${key}-error`}>
          {problems[key]}
        </span>
      )}
    </div>
  );
  return (
    <li className={`gp-i-idea${idea.ticked ? " is-checked" : ""}`}>
      <label className="gp-e-check">
        <input type="checkbox" checked={idea.ticked} onChange={(e) => onChange({ ticked: e.target.checked })} disabled={disabled} />
        Add “{idea.service_name.trim() || "this service"}”
      </label>
      {idea.ticked && (
        <div className="gp-e-stack-sm">
          {field("service_name", "Name")}
          {idea.aiCategory ? <span className="gp-note">Category: {idea.category}</span> : field("category", "Category")}
          {field("description", "Description", true)}
        </div>
      )}
    </li>
  );
}

export default function ImproveServices({ services }) {
  const [ideas, setIdeas] = useState(null); // [{ key, service_name, category, description, ticked, aiCategory }]
  const [busy, setBusy] = useState(null); // "suggest" | "add" | service id
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // { tone, text }
  const [showProblems, setShowProblems] = useState(false);
  // A service the vendor types (works when the AI is down too).
  const ownId = useId();
  const [own, setOwn] = useState(EMPTY_SERVICE);
  const [ownChecked, setOwnChecked] = useState(false);

  if (services.status === "loading") return <TabLoading label="Loading your services…" />;
  if (services.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <ImproveError error={services.error} fallback="We couldn't load your services. Please try again." />
        <div className="gp-btns">
          <RefreshButton onClick={() => services.reload()}>Try again</RefreshButton>
        </div>
      </div>
    );
  }

  const saved = listOf(services.data);
  const working = Boolean(busy);
  const ticked = (ideas || []).filter((s) => s.ticked);

  const suggest = async () => {
    setBusy("suggest");
    setError(null);
    setMessage(null);
    setShowProblems(false);
    try {
      const answer = await gpManageApi.suggestServices();
      const list = suggestionsOf(answer)
        .filter((s) => s && typeof s.service_name === "string" && s.service_name.trim())
        .filter((s) => !saved.some((x) => same(x.service_name, s.service_name)))
        .map((s, i) => ({
          key: `${i}-${s.service_name}`,
          service_name: s.service_name.trim(),
          category: typeof s.category === "string" ? s.category.trim() : "",
          description: typeof s.description === "string" ? s.description.trim() : "",
          aiCategory: typeof s.category === "string" && s.category.trim().length > 0 && s.category.trim().length <= LIMITS.category,
          ticked: true,
        }));
      setIdeas(list);
      setMessage({
        tone: list.length ? "ok" : "warn",
        text: list.length ? `${list.length} service ${list.length === 1 ? "idea is" : "ideas are"} ready below. Check each one.` : "No new service ideas from your storefront.",
      });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const change = (key, patch) => setIdeas((cur) => cur.map((s) => (s.key === key ? { ...s, ...patch } : s)));

  const addTicked = async () => {
    if (!ticked.length) return;
    if (ticked.some((s) => Object.keys(problemsOf(s)).length)) {
      setShowProblems(true);
      setMessage({ tone: "bad", text: "Some ticked services need a change first. See the notes in red." });
      return;
    }
    setBusy("add");
    setError(null);
    setMessage(null);
    const added = [];
    const failed = [];
    for (const s of ticked) {
      try {
        await gpManageApi.addService({ service_name: s.service_name.trim(), category: s.category.trim(), description: s.description.trim() });
        added.push(s.key);
      } catch (err) {
        failed.push(`“${s.service_name}” (${errorMessage(err)})`);
      }
    }
    setIdeas((cur) => (cur ? cur.filter((s) => !added.includes(s.key)) : cur));
    await services.reload(true);
    setShowProblems(false);
    setMessage({
      tone: failed.length ? "bad" : "ok",
      text: [
        added.length ? `Added ${added.length} ${added.length === 1 ? "service" : "services"}. The AI then adds them to your Google profile.` : "",
        failed.length ? `Not added: ${failed.join("; ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
    setBusy(null);
  };

  const remove = async (s) => {
    setBusy(s.id);
    setError(null);
    setMessage(null);
    try {
      await gpManageApi.deleteService(s.id);
      services.setData((page) => ({ ...(page || {}), data: listOf(page).filter((x) => x.id !== s.id) }));
      setMessage({ tone: "ok", text: `Removed “${s.service_name}”.` });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const showIdeas = Array.isArray(ideas) && ideas.length > 0;

  const ownProblems = problemsOf(own);
  const addOwn = async (event) => {
    event.preventDefault();
    setOwnChecked(true);
    if (Object.keys(ownProblems).length > 0) return;
    setBusy("own");
    setError(null);
    setMessage(null);
    try {
      await gpManageApi.addService({ service_name: own.service_name.trim(), category: own.category.trim(), description: own.description.trim() });
      setOwn(EMPTY_SERVICE);
      setOwnChecked(false);
      await services.reload(true);
      setMessage({ tone: "ok", text: `Added “${own.service_name.trim()}”.` });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="gp-e-stack">
      <p className="gp-note">Your services tell couples what you offer. The AI then adds them to your Google profile.</p>

      {saved.length > 0 ? (
        <div className="gp-e-stack-sm">
          <p className="gp-e-label">Your services</p>
          <ul className="gp-e-plain gp-i-rows">
            {saved.map((s) => (
              <li key={s.id} className="gp-i-row">
                <div className="gp-e-stack-sm gp-e-grow">
                  <b className="gp-i-row-title">{s.service_name}</b>
                  {s.category && <span className="gp-note">{s.category}</span>}
                </div>
                <button type="button" className="gp-e-icon-btn" onClick={() => remove(s)} disabled={working} aria-label={`Remove “${s.service_name}”`}>
                  {busy === s.id ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiTrash2 size={18} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="gp-muted">No services yet.</p>
      )}

      {showIdeas && (
        <fieldset className="gp-e-ai-box gp-i-fieldset">
          <legend className="gp-e-label">AI service ideas from your storefront</legend>
          <ul className="gp-e-plain gp-e-stack">
            {ideas.map((s) => (
              <ServiceIdea key={s.key} idea={s} onChange={(patch) => change(s.key, patch)} disabled={working} problems={showProblems && s.ticked ? problemsOf(s) : {}} />
            ))}
          </ul>
          <div className="gp-btns">
            <button type="button" className="gp-btn gp-btn-primary" onClick={addTicked} disabled={working || ticked.length === 0} aria-busy={busy === "add" || undefined}>
              {busy === "add" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiPlus size={18} aria-hidden="true" />}
              {busy === "add" ? "Adding…" : ticked.length ? `Add ${ticked.length} selected` : "Tick at least one"}
            </button>
          </div>
        </fieldset>
      )}

      <ImproveError error={error} />
      <div aria-live="polite">{message && <Callout tone={message.tone}>{message.text}</Callout>}</div>

      {!showIdeas && (
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-primary" onClick={suggest} disabled={working} aria-busy={busy === "suggest" || undefined}>
            {busy === "suggest" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiZap size={18} aria-hidden="true" />}
            {busy === "suggest" ? "Reading your storefront…" : "Suggest services from my storefront"}
          </button>
        </div>
      )}

      <form className="gp-i-own gp-e-stack-sm" onSubmit={addOwn} noValidate>
        <p className="gp-e-label">Or add your own service</p>
        {[
          ["service_name", "Service name", "e.g. Wedding reception hall"],
          ["category", "Category", "e.g. Venue"],
        ].map(([key, label, placeholder]) => (
          <div key={key} className="gp-e-stack-sm">
            <label htmlFor={`${ownId}-${key}`} className="gp-note">
              {label}
            </label>
            <input
              id={`${ownId}-${key}`}
              className="form-control"
              value={own[key]}
              maxLength={LIMITS[key]}
              placeholder={placeholder}
              onChange={(e) => setOwn((cur) => ({ ...cur, [key]: e.target.value }))}
              disabled={working}
              aria-invalid={ownChecked && ownProblems[key] ? true : undefined}
              aria-describedby={ownChecked && ownProblems[key] ? `${ownId}-${key}-err` : undefined}
            />
            {ownChecked && ownProblems[key] && (
              <span className="gp-e-error" id={`${ownId}-${key}-err`}>
                {ownProblems[key]}
              </span>
            )}
          </div>
        ))}
        <div className="gp-e-stack-sm">
          <label htmlFor={`${ownId}-description`} className="gp-note">
            Short description
          </label>
          <textarea
            id={`${ownId}-description`}
            className="form-control"
            rows={2}
            value={own.description}
            maxLength={LIMITS.description}
            onChange={(e) => setOwn((cur) => ({ ...cur, description: e.target.value }))}
            disabled={working}
            aria-invalid={ownChecked && ownProblems.description ? true : undefined}
            aria-describedby={ownChecked && ownProblems.description ? `${ownId}-description-err` : undefined}
          />
          {ownChecked && ownProblems.description && (
            <span className="gp-e-error" id={`${ownId}-description-err`}>
              {ownProblems.description}
            </span>
          )}
        </div>
        <div className="gp-btns">
          <button type="submit" className="gp-btn gp-btn-ghost" disabled={working} aria-busy={busy === "own" || undefined}>
            {busy === "own" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiPlus size={18} aria-hidden="true" />}
            Add service
          </button>
        </div>
      </form>
    </div>
  );
}
