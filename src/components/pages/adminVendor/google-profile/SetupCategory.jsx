// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24, docs/partner-api-gbp-contract.md §6.5).
// The new profile's category: search Google's own list (googleProfileApi.createCategories) and choose one.
// Same as GrowthOS's CategoryPicker (growthos-web/src/features/integrations/google-create.tsx): searches after
// 2 letters and a short pause, starting with the business's own category words; older answers are ignored.
import React, { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import googleProfileApi, { errorMessage } from "../../../../services/api/googleProfileApi";

/** `value` = { name, display_name } or empty name; `onChange(name, displayName)`. */
export default function SetupCategory({ id, region, initialQuery, value, onChange, error, disabled }) {
  const ids = useId();
  const [text, setText] = useState(initialQuery || "");
  const [query, setQuery] = useState((initialQuery || "").trim());
  const [result, setResult] = useState({ query: "", status: "idle", items: [], error: null });
  const request = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(text.trim()), 300);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    if (query.length < 2) return;
    const mine = ++request.current;
    setResult({ query, status: "loading", items: [], error: null });
    googleProfileApi
      .createCategories(query, region)
      .then((items) => {
        if (mine !== request.current) return;
        const list = Array.isArray(items) ? items.filter((c) => c && c.name) : [];
        setResult({ query, status: "ready", items: list, error: null });
      })
      .catch((err) => {
        if (mine === request.current) setResult({ query, status: "error", items: [], error: err });
      });
  }, [query, region]);

  const active = query.length >= 2 && result.query === query;
  const hintId = `${ids}-hint`;
  const errorId = `${ids}-error`;
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="gp-field gp-setup-wide">
      <label htmlFor={id}>Category</label>
      <p className="gp-note gp-field-help" id={hintId}>
        {value.name ? (
          <>
            Chosen: <b className="gp-setup-ink">{value.display_name || value.name}</b>. Search to change it.
          </>
        ) : (
          "Search Google's list and choose the one that fits best. Type at least 2 letters."
        )}
      </p>
      <input
        id={id}
        type="search"
        className="gp-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search categories, e.g. wedding photographer"
        autoComplete="off"
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        aria-controls={`${ids}-results`}
      />
      {error && (
        <small id={errorId} className="gp-field-error">
          {error}
        </small>
      )}
      <div id={`${ids}-results`} aria-live="polite">
        {active && result.status === "loading" && (
          <p className="gp-note gp-setup-inline" role="status">
            <Spinner animation="border" size="sm" aria-hidden="true" />
            Searching Google's categories…
          </p>
        )}
        {active && result.status === "error" && (
          <p className="gp-field-error" role="alert">
            {errorMessage(result.error, "The search didn't work. Please try again.")}
          </p>
        )}
        {active && result.status === "ready" && result.items.length === 0 && (
          <p className="gp-note">No category matches. Try another word.</p>
        )}
        {active && result.status === "ready" && result.items.length > 0 && (
          <div className="gp-setup-options" role="radiogroup" aria-label={`Categories for ${query}`}>
            {result.items.map((item) => {
              const optionId = `${ids}-${item.name.replace(/[^\w-]/g, "_")}`;
              const checked = value.name === item.name;
              return (
                <label key={item.name} htmlFor={optionId} className={`gp-setup-option ${checked ? "is-checked" : ""}`}>
                  <input
                    type="radio"
                    id={optionId}
                    name={`${ids}-category`}
                    value={item.name}
                    checked={checked}
                    disabled={disabled}
                    onChange={() => onChange(item.name, item.display_name || item.name)}
                  />
                  <span>{item.display_name || item.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
