// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24, docs/partner-api-gbp-contract.md §6.5).
// Screen "pick": Google is connected. The vendor chooses the Google business account and the profile in it
// ("Use this profile"), or creates a new profile here (SetupCreate). Same steps as GrowthOS's own
// ChooseLocation (growthos-web/src/features/integrations/google-card.tsx).
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowUpRight, FiCheck, FiMapPin, FiPlus, FiRefreshCw, FiUserPlus } from "react-icons/fi";
import googleProfileApi, { errorCode, errorMessage } from "../../../../services/api/googleProfileApi";
import { AsideCard, Callout } from "./GpParts";
import { GOOGLE_BUSINESS_URL } from "./gpFormat";
import SetupCreate from "./SetupCreate";

const NETWORK_MESSAGE = "Could not reach HappyWedz. Check your internet connection and try again.";

const messageOf = (error, fallback) => (errorCode(error) === "network" ? NETWORK_MESSAGE : errorMessage(error, fallback));

/** A Google error with "Try again", and "Connect Google again" when Google's access has run out. */
function GoogleProblem({ error, fallback, onRetry, onReconnect, connecting }) {
  const reconnect = errorCode(error) === "google_reconnect";
  return (
    <div className="gp-stack-sm">
      <Callout tone="bad" role="alert">
        {messageOf(error, fallback)}
      </Callout>
      <div className="gp-btns">
        {reconnect ? (
          <ConnectAgainButton primary busy={connecting} onClick={onReconnect}>
            Connect Google again
          </ConnectAgainButton>
        ) : (
          onRetry && (
            <button type="button" className="gp-btn gp-btn-primary" onClick={onRetry}>
              <FiRefreshCw size={18} aria-hidden="true" />
              Try again
            </button>
          )
        )}
      </div>
    </div>
  );
}

function ConnectAgainButton({ primary = false, busy, onClick, children }) {
  return (
    <button
      type="button"
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`}
      onClick={onClick}
      disabled={busy}
      aria-busy={busy || undefined}
    >
      {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiUserPlus size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}

function Loading({ label }) {
  return (
    <p className="gp-note gp-setup-inline" role="status">
      <Spinner animation="border" size="sm" aria-hidden="true" />
      {label}
    </p>
  );
}

/**
 * `onDone(message)` reads the View again after the profile was chosen or created (resolves true when it moved on);
 * `onConnect` sends the vendor to Google again (another Google account); `connecting` while that link is fetched.
 */
export default function SetupPick({ connecting, connectProblem, onConnect, onDone }) {
  const ids = useId();
  const headRef = useRef(null);
  const [mode, setMode] = useState("pick"); // pick | create
  const [accounts, setAccounts] = useState({ status: "loading", items: [], error: null });
  const [account, setAccount] = useState("");
  const [locations, setLocations] = useState({ account: "", status: "idle", items: [], error: null });
  const [location, setLocation] = useState("");
  const [picking, setPicking] = useState(false);
  const [pickError, setPickError] = useState(null);
  const request = useRef(0);

  const loadAccounts = useCallback(async () => {
    setAccounts({ status: "loading", items: [], error: null });
    try {
      const data = await googleProfileApi.accounts();
      const items = Array.isArray(data) ? data.filter((a) => a && a.name) : [];
      setAccounts({ status: "ready", items, error: null });
      setAccount((current) => (items.some((a) => a.name === current) ? current : items.length === 1 ? items[0].name : ""));
    } catch (error) {
      setAccounts({ status: "error", items: [], error });
    }
  }, []);

  const loadLocations = useCallback(async (accountName) => {
    if (!accountName) return;
    const mine = ++request.current;
    setLocations({ account: accountName, status: "loading", items: [], error: null });
    try {
      const data = await googleProfileApi.locations(accountName);
      if (mine !== request.current) return;
      const items = Array.isArray(data) ? data.filter((l) => l && l.name) : [];
      setLocations({ account: accountName, status: "ready", items, error: null });
      setLocation(items.length === 1 ? items[0].name : "");
    } catch (error) {
      if (mine === request.current) setLocations({ account: accountName, status: "error", items: [], error });
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (account) loadLocations(account);
  }, [account, loadLocations]);

  const switchMode = (next) => {
    setMode(next);
    setPickError(null);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    requestAnimationFrame(() => headRef.current?.focus());
  };

  const chooseAccount = (name) => {
    setAccount(name);
    setLocation("");
    setPickError(null);
  };

  const pickProfile = async () => {
    if (!account || !location || picking) return;
    setPicking(true);
    setPickError(null);
    try {
      await googleProfileApi.pickLocation({ account_name: account, location_name: location });
      await onDone("Your Google profile is connected.");
    } catch (error) {
      setPickError(error);
    } finally {
      setPicking(false);
    }
  };

  const chosenAccount = accounts.items.find((a) => a.name === account);

  if (mode === "create") {
    return (
      <SetupCreate
        headRef={headRef}
        accounts={accounts.items}
        account={account}
        onBack={() => switchMode("pick")}
        onCreated={() => onDone("Your Google profile was created.")}
      />
    );
  }

  const otherAccount = (
    <ConnectAgainButton busy={connecting} onClick={onConnect}>
      Use a different Google account
    </ConnectAgainButton>
  );

  const renderLocations = () => {
    if (!account) return null;
    if (locations.account !== account || locations.status === "loading" || locations.status === "idle") {
      return <Loading label="Loading your profiles…" />;
    }
    if (locations.status === "error") {
      return (
        <GoogleProblem
          error={locations.error}
          fallback="We couldn't load your profiles. Please try again."
          onRetry={() => loadLocations(account)}
          onReconnect={onConnect}
          connecting={connecting}
        />
      );
    }
    if (locations.items.length === 0) {
      return (
        <div className="gp-setup-empty">
          <span className="gp-state-icon" aria-hidden="true">
            <FiMapPin size={26} />
          </span>
          <h3 className="gp-h3">This Google account has no Business Profile yet</h3>
          <p className="gp-lead">
            Create one from your HappyWedz details
            {accounts.items.length > 1 ? ", or choose another business account above." : "."} It's created in your
            own Google account.
          </p>
          <div className="gp-btns">
            <button type="button" className="gp-btn gp-btn-primary" onClick={() => switchMode("create")}>
              <FiPlus size={18} aria-hidden="true" />
              Create a new profile
            </button>
            {otherAccount}
          </div>
        </div>
      );
    }
    return (
      <>
        <fieldset className="gp-fieldset gp-choice">
          <legend className="gp-legend">Choose your profile</legend>
          {locations.items.map((item) => {
            const inputId = `${ids}-loc-${item.name.replace(/[^\w-]/g, "_")}`;
            const checked = location === item.name;
            const details = [item.address, item.category].filter(Boolean).join(" · ");
            return (
              <label key={item.name} className={`gp-choice-item ${checked ? "is-checked" : ""}`} htmlFor={inputId}>
                <input
                  type="radio"
                  name={`${ids}-loc`}
                  id={inputId}
                  value={item.name}
                  checked={checked}
                  onChange={() => {
                    setLocation(item.name);
                    setPickError(null);
                  }}
                />
                <span className="gp-setup-wrap">
                  {item.title || "Untitled profile"}
                  {details && <small>{details}</small>}
                </span>
              </label>
            );
          })}
        </fieldset>
        {pickError && (
          <GoogleProblem
            error={pickError}
            fallback="We couldn't use this profile. Please try again."
            onReconnect={onConnect}
            connecting={connecting}
          />
        )}
        <div className="gp-btns">
          <button
            type="button"
            className="gp-btn gp-btn-primary"
            onClick={pickProfile}
            disabled={!location || picking}
            aria-busy={picking || undefined}
          >
            {picking ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCheck size={18} aria-hidden="true" />}
            Use this profile
          </button>
          <button type="button" className="gp-btn gp-btn-ghost" onClick={() => switchMode("create")} disabled={picking}>
            <FiPlus size={18} aria-hidden="true" />
            Create a new profile instead
          </button>
          {!location && !picking && <span className="gp-note">Choose your profile above.</span>}
        </div>
      </>
    );
  };

  const renderAccounts = () => {
    if (accounts.status === "loading") return <Loading label="Loading your Google business accounts…" />;
    if (accounts.status === "error") {
      return (
        <GoogleProblem
          error={accounts.error}
          fallback="We couldn't load your Google business accounts. Please try again."
          onRetry={loadAccounts}
          onReconnect={onConnect}
          connecting={connecting}
        />
      );
    }
    if (accounts.items.length === 0) {
      return (
        <div className="gp-setup-empty">
          <span className="gp-state-icon" aria-hidden="true">
            <FiMapPin size={26} />
          </span>
          <h3 className="gp-h3">No Google business account found</h3>
          <p className="gp-lead">
            Open Google Business Profile once with this Google account to set up its business account, then come back
            here and press Check again.
          </p>
          <div className="gp-btns">
            <a className="gp-btn gp-btn-primary" href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener">
              Open Google Business Profile
              <FiArrowUpRight size={18} aria-hidden="true" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <button type="button" className="gp-btn gp-btn-ghost" onClick={loadAccounts}>
              <FiRefreshCw size={18} aria-hidden="true" />
              Check again
            </button>
            {otherAccount}
          </div>
        </div>
      );
    }
    return (
      <>
        {accounts.items.length > 1 ? (
          <div className="gp-field">
            <label htmlFor={`${ids}-account`}>Google business account</label>
            <select
              id={`${ids}-account`}
              className="gp-input"
              value={account}
              onChange={(e) => chooseAccount(e.target.value)}
              disabled={picking}
            >
              <option value="">Choose a business account</option>
              {accounts.items.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.accountName || a.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="gp-note">
            Google business account: <b className="gp-setup-ink">{chosenAccount?.accountName || chosenAccount?.name}</b>
          </p>
        )}
        {renderLocations()}
      </>
    );
  };

  return (
    <section className="gp-grid2">
      <div className="gp-card gp-card-tint">
        <Callout tone="ok">Google is connected.</Callout>
        {connectProblem && (
          <Callout tone="bad" role="alert">
            {connectProblem}
          </Callout>
        )}
        <h2 className="gp-h2" ref={headRef} tabIndex={-1}>
          Pick your Google Business Profile
        </h2>
        <p className="gp-lead">
          Choose the profile of this business. Nothing new is created. No profile yet? Create one here from your
          HappyWedz details.
        </p>
        {renderAccounts()}
      </div>
      <AsideCard title="Don't see your profile?">
        <p className="gp-lead">
          It may be in another Google account. Connect the Google account that manages your profile on Google.
        </p>
        <div className="gp-btns">{otherAccount}</div>
      </AsideCard>
    </section>
  );
}
