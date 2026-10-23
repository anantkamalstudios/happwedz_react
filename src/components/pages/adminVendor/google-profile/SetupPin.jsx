// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24 follow-up, docs/partner-api-gbp-contract.md §6.5).
// The "Map location" box of the create form. Google sometimes needs the business's place on the map before it
// creates a profile (the prefill's map_pin is false, or a create came back with pin_drop_required). The vendor uses
// the map location on their HappyWedz storefront (only offered when the storefront has one) or pastes a Google Maps
// link; HappyWedz's server sends it to GrowthOS (googleProfileApi.savePin), which saves it on the business location.
import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiCheck, FiMapPin } from "react-icons/fi";
import googleProfileApi, { errorCode, errorMessage } from "../../../../services/api/googleProfileApi";
import { Callout } from "./GpParts";

const NETWORK_MESSAGE = "Could not reach HappyWedz. Check your internet connection and try again.";
const messageOf = (error, fallback) => (errorCode(error) === "network" ? NETWORK_MESSAGE : errorMessage(error, fallback));

const MAPS_URL_MAX = 2000;
const LINK_MESSAGES = {
  empty: "Paste a Google Maps link to your business.",
  bad: "Paste a Google Maps link that starts with https://.",
  long: "The link is too long.",
};

/** The pasted link's problem, or "" when it can be sent (same rules as the server). */
function linkProblem(link) {
  if (!link) return LINK_MESSAGES.empty;
  if (link.length > MAPS_URL_MAX) return LINK_MESSAGES.long;
  if (/\s/.test(link)) return LINK_MESSAGES.bad;
  try {
    const u = new URL(link);
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname ? "" : LINK_MESSAGES.bad;
  } catch {
    return LINK_MESSAGES.bad;
  }
}

/**
 * `storefrontPin`: the storefront has a map location ("Use my storefront map pin" is offered).
 * `rejected`: Google refused the last create because it could not place the address.
 * `onSaved(answer)`: after GrowthOS saved the location ({ latitude, longitude }).
 * `headingRef`: focused when the form sends the vendor here.
 */
export default function SetupPin({ idBase, storefrontPin, rejected, disabled, onSaved, headingRef }) {
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(null); // null | "storefront" | "link"
  const [linkError, setLinkError] = useState("");
  const [problem, setProblem] = useState("");

  const titleId = `${idBase}-pin-title`;
  const inputId = `${idBase}-pin-link`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const locked = Boolean(busy) || disabled;

  const save = async (kind, body) => {
    setBusy(kind);
    setProblem("");
    setLinkError("");
    try {
      const answer = await googleProfileApi.savePin(body);
      setBusy(null);
      setLink("");
      await onSaved(answer);
    } catch (error) {
      setBusy(null);
      const message = messageOf(error, "We couldn't save the map location. Please try again.");
      if (kind === "link") setLinkError(message);
      else setProblem(message);
    }
  };

  const saveLink = () => {
    if (locked) return;
    const value = link.trim();
    const wrong = linkProblem(value);
    if (wrong) {
      setLinkError(wrong);
      document.getElementById(inputId)?.focus();
      return;
    }
    save("link", { maps_url: value });
  };

  return (
    <div className="gp-setup-map" role="group" aria-labelledby={titleId}>
      <h3 className="gp-h3 gp-setup-inline" id={titleId} ref={headingRef} tabIndex={-1}>
        <FiMapPin size={18} aria-hidden="true" />
        Map location
      </h3>
      <p className="gp-lead">Google needs your business's place on the map.</p>

      {rejected && (
        <Callout tone="bad" role="alert">
          Google couldn't place your address on the map. Check the address above, save your map location, then create
          your profile again.
        </Callout>
      )}

      {storefrontPin && (
        <>
          <div className="gp-btns">
            <button
              type="button"
              className="gp-btn gp-btn-primary"
              onClick={() => !locked && save("storefront", {})}
              disabled={locked}
              aria-busy={busy === "storefront" || undefined}
            >
              {busy === "storefront" ? (
                <Spinner animation="border" size="sm" aria-hidden="true" />
              ) : (
                <FiMapPin size={18} aria-hidden="true" />
              )}
              Use my storefront map pin
            </button>
          </div>
          {problem && (
            <Callout tone="bad" role="alert">
              {problem}
            </Callout>
          )}
          <p className="gp-note">Or paste a link instead:</p>
        </>
      )}

      <div className="gp-field">
        <label htmlFor={inputId}>Paste a Google Maps link to your business</label>
        <input
          id={inputId}
          type="url"
          className="gp-input"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setLinkError("");
          }}
          onKeyDown={(e) => {
            // Enter saves the link, not the whole create form.
            if (e.key === "Enter") {
              e.preventDefault();
              saveLink();
            }
          }}
          placeholder="https://maps.app.goo.gl/…"
          inputMode="url"
          autoComplete="url"
          maxLength={MAPS_URL_MAX}
          disabled={locked}
          aria-invalid={Boolean(linkError) || undefined}
          aria-describedby={[hintId, linkError ? errorId : null].filter(Boolean).join(" ")}
        />
        <small id={hintId} className="gp-note gp-field-help">
          To copy it: open Google Maps, find your business, press Share, then Copy link. Not on Maps yet? Drop a pin on
          your place, then Share and Copy link.
        </small>
        {linkError && (
          <small id={errorId} className="gp-field-error" role="alert">
            {linkError}
          </small>
        )}
      </div>
      <div className="gp-btns">
        <button
          type="button"
          className={`gp-btn ${storefrontPin ? "gp-btn-ghost" : "gp-btn-primary"}`}
          onClick={saveLink}
          disabled={locked}
          aria-busy={busy === "link" || undefined}
        >
          {busy === "link" ? (
            <Spinner animation="border" size="sm" aria-hidden="true" />
          ) : (
            <FiCheck size={18} aria-hidden="true" />
          )}
          Save location
        </button>
      </div>
    </div>
  );
}
