// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// A search box with Google's answers under it, for the Profile tab's Categories (gpManageApi.categories) and Service
// area (gpManageApi.places). Searches after 2 letters and a short pause; older answers are ignored.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { errorMessage } from "../../../../../services/api/googleProfileApi";
import { useDebounced } from "./ProfileUtils";

/**
 * `search(q)` returns a list; `itemKey(item)`, `itemTitle(item)`, `itemSub(item)` describe one answer;
 * `renderActions(item)` gives its buttons.
 */
export default function ProfileSearch({ label, search, itemKey, itemTitle, itemSub, renderActions, disabled, emptyText }) {
  const id = useId();
  const [text, setText] = useState("");
  const query = useDebounced(text.trim(), 300);
  const [result, setResult] = useState({ query: "", status: "idle", items: [], error: null });
  const request = useRef(0);
  const searchRef = useRef(search);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    if (query.length < 2 || disabled) return;
    const mine = ++request.current;
    setResult({ query, status: "loading", items: [], error: null });
    searchRef.current(query)
      .then((items) => {
        if (mine === request.current) setResult({ query, status: "ready", items: Array.isArray(items) ? items : [], error: null });
      })
      .catch((error) => {
        if (mine === request.current) setResult({ query, status: "error", items: [], error });
      });
  }, [query, disabled]);

  const active = query.length >= 2 && !disabled && result.query === query;

  return (
    <div className="gp-e-field">
      <label className="gp-e-label" htmlFor={`${id}-q`}>
        {label}
      </label>
      <input
        id={`${id}-q`}
        type="search"
        className="gp-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        aria-describedby={`${id}-hint`}
        aria-controls={`${id}-results`}
      />
      <span className="gp-note" id={`${id}-hint`}>
        Type at least 2 letters.
      </span>
      <div id={`${id}-results`} aria-live="polite">
        {active && result.status === "loading" && (
          <p className="gp-note gp-e-inline" role="status">
            <Spinner animation="border" size="sm" aria-hidden="true" /> Searching…
          </p>
        )}
        {active && result.status === "error" && (
          <p className="gp-e-error" role="alert">
            {errorMessage(result.error, "The search didn't work. Please try again.")}
          </p>
        )}
        {active && result.status === "ready" && result.items.length === 0 && <p className="gp-note">{emptyText}</p>}
        {active && result.status === "ready" && result.items.length > 0 && (
          <ul className="gp-e-results" aria-label={`Results for ${query}`}>
            {result.items.map((item) => (
              <li key={itemKey(item)} className="gp-e-result">
                <span className="gp-e-result-text">
                  <span>{itemTitle(item)}</span>
                  {itemSub?.(item) && <span className="gp-note">{itemSub(item)}</span>}
                </span>
                <span className="gp-e-result-actions">{renderActions(item)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
