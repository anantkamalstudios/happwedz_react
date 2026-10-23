// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" step 2 (helper D): the keywords GrowthOS tracks for the Google profile. The AI suggests some (the
// top 5 new ones are ticked), the vendor adds the ticked ones, and can remove or track again a saved one. Done at 5
// active keywords. API: gpManageApi.keywords / suggestKeywords / addKeyword / setKeywordStatus / deleteKeyword.
// Shapes: GrowthOS keywordSchema and keywordGenerationSchema (growthos-web/src/contracts/google.ts).
import { useId, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiPlus, FiRefreshCw, FiX, FiZap } from "react-icons/fi";
import { errorMessage, gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { TabLoading } from "./ProfileShared";
import { ImproveError } from "./ImproveParts";
import { KEYWORDS_NEEDED, activeKeywords, listOf } from "./ImproveUtils";

const same = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

export default function ImproveKeywords({ keywords }) {
  const id = useId();
  const [ideas, setIdeas] = useState(null); // { area, list: [{ keyword, intent, service, priority_rationale }] }
  const [ticked, setTicked] = useState([]);
  const [busy, setBusy] = useState(null); // "suggest" | "add" | "remove:<id>" | "resume:<id>"
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // { tone, text }
  const [own, setOwn] = useState(""); // a keyword the vendor types (works when the AI is down too)

  if (keywords.status === "loading") return <TabLoading label="Loading your keywords…" />;
  if (keywords.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <ImproveError error={keywords.error} fallback="We couldn't load your keywords. Please try again." />
        <div className="gp-btns">
          <RefreshButton onClick={() => keywords.reload()}>Try again</RefreshButton>
        </div>
      </div>
    );
  }

  const saved = listOf(keywords.data);
  const active = activeKeywords(saved);
  const working = Boolean(busy);

  const suggest = async () => {
    setBusy("suggest");
    setError(null);
    setMessage(null);
    try {
      const answer = await gpManageApi.suggestKeywords();
      const list = (Array.isArray(answer?.suggestions) ? answer.suggestions : []).filter(
        (s) => s?.keyword && !s.already_added && !saved.some((k) => same(k.keyword, s.keyword)),
      );
      setIdeas({ area: typeof answer?.area === "string" && answer.area ? answer.area : null, list });
      setTicked(list.slice(0, KEYWORDS_NEEDED).map((s) => s.keyword));
      setMessage({
        tone: list.length ? "ok" : "warn",
        text: list.length ? `${list.length} keyword ${list.length === 1 ? "idea is" : "ideas are"} ready below.` : "No new keyword ideas right now.",
      });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const addTicked = async () => {
    const chosen = (ideas?.list || []).filter((s) => ticked.includes(s.keyword));
    if (!chosen.length) return;
    setBusy("add");
    setError(null);
    setMessage(null);
    const added = [];
    const failed = [];
    for (const s of chosen) {
      try {
        await gpManageApi.addKeyword({
          keyword: s.keyword,
          ...(s.intent ? { intent: s.intent } : {}),
          ...(s.service?.id ? { service_id: s.service.id } : {}),
          ...(ideas?.area ? { area: ideas.area } : {}),
          source: "ai",
        });
        added.push(s.keyword);
      } catch (err) {
        failed.push({ keyword: s.keyword, message: errorMessage(err) });
      }
    }
    setIdeas((current) => (current ? { ...current, list: current.list.filter((s) => !added.includes(s.keyword)) } : current));
    setTicked((current) => current.filter((k) => !added.includes(k)));
    await keywords.reload(true);
    setMessage({
      tone: failed.length ? "bad" : "ok",
      text: [
        added.length ? `Added ${added.length} ${added.length === 1 ? "keyword" : "keywords"}.` : "",
        failed.length ? `Not added: ${failed.map((f) => `“${f.keyword}” (${f.message})`).join("; ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
    setBusy(null);
  };

  const addOwn = async (event) => {
    event.preventDefault();
    const keyword = own.trim();
    if (!keyword) return;
    if (saved.some((k) => same(k.keyword, keyword))) {
      setError(null);
      setMessage({ tone: "warn", text: `“${keyword}” is already in your keywords.` });
      return;
    }
    setBusy("own");
    setError(null);
    setMessage(null);
    try {
      await gpManageApi.addKeyword({ keyword, source: "manual" });
      setOwn("");
      await keywords.reload(true);
      setMessage({ tone: "ok", text: `Added “${keyword}”.` });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (k) => {
    setBusy(`remove:${k.id}`);
    setError(null);
    setMessage(null);
    try {
      await gpManageApi.deleteKeyword(k.id);
      keywords.setData((page) => ({ ...(page || {}), data: listOf(page).filter((x) => x.id !== k.id) }));
      setMessage({ tone: "ok", text: `Removed “${k.keyword}”.` });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const resume = async (k) => {
    setBusy(`resume:${k.id}`);
    setError(null);
    setMessage(null);
    try {
      const answer = await gpManageApi.setKeywordStatus(k.id, "active");
      keywords.setData((page) => ({
        ...(page || {}),
        data: listOf(page).map((x) => (x.id === k.id ? { ...x, ...(answer && typeof answer === "object" ? answer : {}), status: "active" } : x)),
      }));
      setMessage({ tone: "ok", text: `Tracking “${k.keyword}” again.` });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(null);
    }
  };

  const toTick = ideas?.list || [];

  return (
    <div className="gp-e-stack">
      <p className="gp-note">
        Keywords are the words couples type into Google to find a vendor like you. The AI uses them in your description and
        posts. {active.length >= KEYWORDS_NEEDED ? `You have ${active.length} active keywords.` : `Add at least ${KEYWORDS_NEEDED}; you have ${active.length}.`}
      </p>

      {saved.length > 0 ? (
        <div className="gp-e-stack-sm">
          <p className="gp-e-label">Your keywords</p>
          <ul className="gp-e-tags">
            {saved.map((k) => (
              <li key={k.id} className={`gp-e-tag${k.status === "active" ? "" : " gp-i-tag-paused"}`}>
                {k.keyword}
                {k.status !== "active" && (
                  <>
                    <span className="gp-i-tag-note">(paused)</span>
                    <button type="button" className="gp-e-tag-x" onClick={() => resume(k)} disabled={working} aria-label={`Track “${k.keyword}” again`}>
                      {busy === `resume:${k.id}` ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiRefreshCw size={14} aria-hidden="true" />}
                    </button>
                  </>
                )}
                <button type="button" className="gp-e-tag-x" onClick={() => remove(k)} disabled={working} aria-label={`Remove “${k.keyword}”`}>
                  {busy === `remove:${k.id}` ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiX size={14} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="gp-muted">No keywords yet.</p>
      )}

      {ideas && toTick.length > 0 && (
        <fieldset className="gp-e-ai-box gp-i-fieldset">
          <legend className="gp-e-label">AI keyword ideas{ideas.area ? ` for ${ideas.area}` : ""}</legend>
          <ul className="gp-e-plain gp-e-stack-sm">
            {toTick.map((s, i) => {
              const boxId = `${id}-kw-${i}`;
              return (
                <li key={s.keyword} className="gp-i-tick">
                  <input
                    id={boxId}
                    type="checkbox"
                    checked={ticked.includes(s.keyword)}
                    onChange={(e) => setTicked((cur) => (e.target.checked ? [...cur, s.keyword] : cur.filter((k) => k !== s.keyword)))}
                    disabled={working}
                    aria-describedby={s.priority_rationale ? `${boxId}-why` : undefined}
                  />
                  <div className="gp-e-stack-sm gp-e-grow">
                    <label htmlFor={boxId} className="gp-e-item-title">
                      {s.keyword}
                    </label>
                    {s.priority_rationale && (
                      <span className="gp-note" id={`${boxId}-why`}>
                        {s.priority_rationale}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
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

      {!(ideas && toTick.length > 0) && (
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-primary" onClick={suggest} disabled={working} aria-busy={busy === "suggest" || undefined}>
            {busy === "suggest" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiZap size={18} aria-hidden="true" />}
            {busy === "suggest" ? "Finding keywords…" : "Suggest keywords"}
          </button>
        </div>
      )}

      <form className="gp-i-own" onSubmit={addOwn}>
        <label htmlFor={`${id}-own`} className="gp-e-label">
          Or add your own keyword
        </label>
        <div className="gp-i-own-row">
          <input
            id={`${id}-own`}
            className="form-control"
            value={own}
            maxLength={80}
            onChange={(e) => setOwn(e.target.value)}
            placeholder="e.g. banquet hall in Nashik"
            disabled={working}
          />
          <button type="submit" className="gp-btn gp-btn-ghost" disabled={working || !own.trim()} aria-busy={busy === "own" || undefined}>
            {busy === "own" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiPlus size={18} aria-hidden="true" />}
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
