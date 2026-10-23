// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24, docs/partner-api-gbp-contract.md §6.5).
// Google verification, inside HappyWedz: the ways Google offers (googleProfileApi.verification → options), "Send
// the code" for one of them, the code box → "Verify", and "Waiting for Google". Ways GrowthOS can't finish here
// (a video and the like) are done on Google's own site. Same steps as GrowthOS's VerificationPanel
// (growthos-web/src/features/integrations/google-create.tsx, contracts/google.ts verificationSchema).
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowUpRight, FiCheck, FiMail, FiMessageSquare, FiPhone, FiRefreshCw, FiSend, FiShield } from "react-icons/fi";
import googleProfileApi, { errorCode, errorMessage } from "../../../../services/api/googleProfileApi";
import { useToast } from "../../../layouts/toasts/Toast";
import { Callout } from "./GpParts";
import {
  GOOGLE_BUSINESS_URL,
  GOOGLE_HELP_OWNERSHIP,
  GOOGLE_HELP_SUSPENDED,
  VERIFY_METHODS,
  isVerifyCode,
} from "./gpFormat";

const NETWORK_MESSAGE = "Could not reach HappyWedz. Check your internet connection and try again.";
const messageOf = (error, fallback) => (errorCode(error) === "network" ? NETWORK_MESSAGE : errorMessage(error, fallback));

const METHOD_ICONS = { ADDRESS: FiMail, PHONE_CALL: FiPhone, SMS: FiMessageSquare, EMAIL: FiMail, AUTO: FiShield };

/** A link styled as a button, to Google's own site (new tab). */
function GoogleLink({ href = GOOGLE_BUSINESS_URL, primary = false, children }) {
  return (
    <a className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`} href={href} target="_blank" rel="noopener">
      {children}
      <FiArrowUpRight size={18} aria-hidden="true" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

function CheckAgainButton({ busy, disabled, onClick, primary = false }) {
  return (
    <button
      type="button"
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`}
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy || undefined}
    >
      {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiRefreshCw size={18} aria-hidden="true" />}
      Check again
    </button>
  );
}

/**
 * `onVerified(message)` reads the View again once Google says the profile is verified (the page then shows it live);
 * `onRefresh` is the page's "Check again"; `refreshing` while it runs.
 */
export default function SetupVerify({ onVerified, onRefresh, refreshing }) {
  const ids = useId();
  const { addToast } = useToast();
  const codeRef = useRef(null);
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [method, setMethod] = useState("");
  const [pin, setPin] = useState("");
  const [pinTouched, setPinTouched] = useState(false);
  const [busy, setBusy] = useState(null); // null | "send" | "verify" | "check"
  const [problem, setProblem] = useState(null);
  const request = useRef(0);

  const load = useCallback(async ({ quiet = false } = {}) => {
    const mine = ++request.current;
    if (!quiet) setState({ status: "loading", data: null, error: null });
    try {
      const data = await googleProfileApi.verification();
      if (mine !== request.current) return null;
      if (!data || typeof data !== "object") throw new Error("no verification");
      setState({ status: "ready", data, error: null });
      return data;
    } catch (error) {
      if (mine === request.current) setState({ status: "error", data: null, error });
      return null;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const checkAgain = async () => {
    setBusy("check");
    setProblem(null);
    const data = await load({ quiet: true });
    setBusy(null);
    if (data?.state === "verified") onVerified("Google verified your profile.");
    else onRefresh();
  };

  const sendCode = async () => {
    if (!method || busy) return;
    setBusy("send");
    setProblem(null);
    try {
      const started = await googleProfileApi.startVerification(method);
      if (started?.state === "verified") {
        setBusy(null);
        onVerified("Google verified your profile.");
        return;
      }
      addToast(method === "AUTO" ? "Google is checking your business." : "Google is sending your code.");
      setPin("");
      setPinTouched(false);
      setMethod("");
      await load({ quiet: true });
      requestAnimationFrame(() => codeRef.current?.focus());
    } catch (error) {
      setProblem(messageOf(error, "Could not ask Google for a code. Please try again."));
    } finally {
      setBusy(null);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setPinTouched(true);
    if (!isVerifyCode(pin) || busy) {
      codeRef.current?.focus();
      return;
    }
    setBusy("verify");
    setProblem(null);
    try {
      await googleProfileApi.completeVerification(pin.trim());
      setBusy(null);
      onVerified("Your profile is verified.");
    } catch (error) {
      setBusy(null);
      setProblem(messageOf(error, "That code didn't work. Check it and try again."));
      requestAnimationFrame(() => codeRef.current?.focus());
    }
  };

  if (state.status === "loading") {
    return (
      <p className="gp-note gp-setup-inline" role="status">
        <Spinner animation="border" size="sm" aria-hidden="true" />
        Asking Google how it can verify your profile…
      </p>
    );
  }

  if (state.status === "error") {
    // If Google can't list the ways here, verifying on Google's own site still works.
    return (
      <div className="gp-stack-sm">
        <Callout tone="bad" role="alert">
          {messageOf(state.error, "We couldn't load the verification. Please try again.")}
        </Callout>
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-primary" onClick={() => load()}>
            <FiRefreshCw size={18} aria-hidden="true" />
            Try again
          </button>
          <GoogleLink>Verify on Google instead</GoogleLink>
        </div>
      </div>
    );
  }

  const v = state.data;
  const options = Array.isArray(v.options) ? v.options.filter((o) => o && o.method) : [];
  const anyBusy = Boolean(busy) || refreshing;

  if (v.state === "verified") {
    return (
      <div className="gp-stack-sm">
        <Callout tone="ok" role="status">
          <b>Google verified your profile.</b> It can now appear on Google Search and Maps.
        </Callout>
        <div className="gp-btns">
          <button
            type="button"
            className="gp-btn gp-btn-primary"
            onClick={() => onVerified("Google verified your profile.")}
            disabled={refreshing}
            aria-busy={refreshing || undefined}
          >
            {refreshing ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCheck size={18} aria-hidden="true" />}
            Show my profile
          </button>
        </div>
      </div>
    );
  }

  // Suspended, or managed by someone else: verifying again does not help — it is fixed on Google.
  if (v.state === "suspended" || v.state === "conflict") {
    const suspended = v.state === "suspended";
    return (
      <div className="gp-stack-sm">
        <Callout tone="alert" role="alert">
          <b>{suspended ? "Google has suspended this profile" : "This business is managed by another Google account"}</b>
          <div>
            {suspended
              ? "Verification can't help while it is suspended. Check the profile against Google's guidelines, fix it on Google and ask Google to restore it."
              : "Ask the current owner on Google for ownership, or connect the Google account that already owns it."}
          </div>
        </Callout>
        <div className="gp-btns">
          <GoogleLink primary href={suspended ? GOOGLE_HELP_SUSPENDED : GOOGLE_HELP_OWNERSHIP}>
            Open Google's help
          </GoogleLink>
          <CheckAgainButton busy={busy === "check" || refreshing} disabled={anyBusy} onClick={checkAgain} />
        </div>
      </div>
    );
  }

  const waitingWords = VERIFY_METHODS[v.method]?.sent;
  const waitingForGoogle = !v.awaiting_code && v.state === "pending";
  const showPinError = pinTouched && !isVerifyCode(pin);
  const chosen = VERIFY_METHODS[method];

  return (
    <div className="gp-stack">
      {problem && (
        <Callout tone="bad" role="alert">
          {problem}
        </Callout>
      )}

      {v.awaiting_code && (
        <form className="gp-setup-code" noValidate onSubmit={verify} aria-labelledby={`${ids}-code-title`}>
          <h3 className="gp-h3" id={`${ids}-code-title`}>
            Enter the code from Google
          </h3>
          <p className="gp-lead">{waitingWords || "Google sent you a code. Enter it here."}</p>
          <div className="gp-setup-code-row">
            <div className="gp-field">
              <label htmlFor={`${ids}-pin`}>Verification code</label>
              <input
                id={`${ids}-pin`}
                ref={codeRef}
                className="gp-input gp-setup-pin"
                inputMode="text"
                autoComplete="one-time-code"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onBlur={() => setPinTouched(Boolean(pin))}
                disabled={anyBusy}
                aria-invalid={showPinError || undefined}
                aria-describedby={showPinError ? `${ids}-pin-error` : undefined}
              />
            </div>
            <button
              type="submit"
              className="gp-btn gp-btn-primary"
              disabled={anyBusy}
              aria-busy={busy === "verify" || undefined}
            >
              {busy === "verify" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCheck size={18} aria-hidden="true" />}
              Verify
            </button>
          </div>
          {showPinError && (
            <small id={`${ids}-pin-error`} className="gp-field-error">
              Enter the code from Google: 4 to 8 letters or numbers.
            </small>
          )}
        </form>
      )}

      {waitingForGoogle && (
        <div className="gp-stack-sm">
          <Callout tone="warn" role="status">
            <b>Waiting for Google.</b> {waitingWords || "Google is checking your business."} Press Check again later.
          </Callout>
          <div className="gp-btns">
            <CheckAgainButton primary busy={busy === "check" || refreshing} disabled={anyBusy} onClick={checkAgain} />
          </div>
        </div>
      )}

      {options.length === 0 ? (
        !v.awaiting_code && (
          <div className="gp-stack-sm">
            <Callout tone="alert" role="status">
              <b>Google doesn't offer a way to verify here</b>
              <div>
                Google may ask for a video or another way. Finish verification on Google, then come back and press Check
                again.
              </div>
            </Callout>
            <div className="gp-btns">
              <GoogleLink primary>Verify on Google</GoogleLink>
              {!waitingForGoogle && (
                <CheckAgainButton busy={busy === "check" || refreshing} disabled={anyBusy} onClick={checkAgain} />
              )}
            </div>
          </div>
        )
      ) : (
        <fieldset className="gp-fieldset gp-choice">
          <legend className="gp-legend">
            {v.awaiting_code || waitingForGoogle
              ? "Didn't get the code? Choose a way to send a new one."
              : "How should Google send your code?"}
          </legend>
          {options.map((option) => {
            const words = VERIFY_METHODS[option.method];
            const Icon = METHOD_ICONS[option.method] || FiShield;
            const detail = option.phone || option.email || option.address || "";
            const inputId = `${ids}-m-${option.method}`;
            if (!words) {
              // A way GrowthOS can't finish here: done on Google's own site.
              return (
                <div key={option.method} className="gp-choice-item">
                  <Icon size={18} aria-hidden="true" className="gp-setup-method-icon" />
                  <span className="gp-setup-wrap">
                    Another way
                    <small>
                      Finish this one on Google.{" "}
                      <a className="gp-link" href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener">
                        Open Google
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    </small>
                  </span>
                </div>
              );
            }
            return (
              <label
                key={option.method}
                className={`gp-choice-item ${method === option.method ? "is-checked" : ""}`}
                htmlFor={inputId}
              >
                <input
                  type="radio"
                  name={`${ids}-method`}
                  id={inputId}
                  value={option.method}
                  checked={method === option.method}
                  onChange={() => setMethod(option.method)}
                  disabled={anyBusy}
                />
                <Icon size={18} aria-hidden="true" className="gp-setup-method-icon" />
                <span className="gp-setup-wrap">
                  {words.label}
                  <small>{detail ? `${words.help} ${detail}` : words.help}</small>
                </span>
              </label>
            );
          })}
          <div className="gp-btns">
            <button
              type="button"
              className={`gp-btn ${v.awaiting_code ? "gp-btn-ghost" : "gp-btn-primary"}`}
              onClick={sendCode}
              disabled={!method || anyBusy}
              aria-busy={busy === "send" || undefined}
            >
              {busy === "send" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiSend size={18} aria-hidden="true" />}
              {method === "AUTO" ? "Verify now" : "Send the code"}
            </button>
            {!method && !anyBusy && <span className="gp-note">Choose a way above.</span>}
            {chosen && method !== "AUTO" && !anyBusy && (
              <span className="gp-note">Google sends the code by {chosen.label.toLowerCase()}.</span>
            )}
          </div>
        </fieldset>
      )}

      {(options.length > 0 || v.awaiting_code) && (
        <div className="gp-btns gp-setup-foot">
          {!waitingForGoogle && (
            <CheckAgainButton busy={busy === "check" || refreshing} disabled={anyBusy} onClick={checkAgain} />
          )}
          <GoogleLink>Verify on Google instead</GoogleLink>
        </div>
      )}
    </div>
  );
}
