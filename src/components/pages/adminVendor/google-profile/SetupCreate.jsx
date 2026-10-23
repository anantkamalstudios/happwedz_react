// HappyWedz x GrowthOS AI — Google Profile setup (GrowthOS plan RD-24, docs/partner-api-gbp-contract.md §6.5).
// "Create a new profile": the form is filled in from the vendor's details in GrowthOS (googleProfileApi.prefill).
// The vendor checks every value, chooses Google's category, and presses Check: GrowthOS shows profiles already on
// Google that look the same (Google asks not to create duplicates). "Create my Google profile" creates it in the
// vendor's own Google account; Google then asks to verify it. Same rules as GrowthOS's own CreateForm
// (growthos-web/src/features/integrations/google-create.tsx, contracts/google.ts profileFormSchema).
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiAlertTriangle, FiArrowLeft, FiArrowUpRight, FiCheck, FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import googleProfileApi, { errorCode, errorMessage } from "../../../../services/api/googleProfileApi";
import { AsideCard, Callout } from "./GpParts";
import { PROFILE_LIMITS, checkProfileForm, profileBody, profileFormFrom, serverFieldErrors } from "./gpFormat";
import SetupCategory from "./SetupCategory";
import SetupHours from "./SetupHours";

const NETWORK_MESSAGE = "Could not reach HappyWedz. Check your internet connection and try again.";
const messageOf = (error, fallback) => (errorCode(error) === "network" ? NETWORK_MESSAGE : errorMessage(error, fallback));

// The order fields are checked and focused in.
const FIELD_ORDER = [
  "account_name",
  "location_id",
  "title",
  "category",
  "address_line1",
  "address_line2",
  "locality",
  "administrative_area",
  "postal_code",
  "phone",
  "website",
  "description",
  "days",
  "open",
  "close",
  "region_code",
];

/** One labelled text box with its hint and error. */
function TextField({ id, label, value, onChange, onBlur, error, hint, optional, wide, multiline, ...input }) {
  const hintId = hint ? `${id}-hint` : null;
  const errorId = error ? `${id}-error` : null;
  const props = {
    id,
    className: `gp-input${multiline ? " gp-setup-textarea" : ""}`,
    value,
    onChange: (e) => onChange(e.target.value),
    onBlur,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
    required: !optional || undefined,
    ...input,
  };
  return (
    <div className={`gp-field${wide ? " gp-setup-wide" : ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="gp-setup-optional"> (optional)</span>}
      </label>
      {multiline ? <textarea rows={4} {...props} /> : <input type="text" {...props} />}
      {hint && (
        <small id={hintId} className="gp-note gp-field-help">
          {hint}
        </small>
      )}
      {error && (
        <small id={errorId} className="gp-field-error">
          {error}
        </small>
      )}
    </div>
  );
}

/** What GrowthOS found on Google for these details. */
function CheckResult({ result, busy, onCreate, onClose }) {
  if (!result.checked) {
    return (
      <div className="gp-setup-result" role="alert">
        <Callout tone="alert">
          <b>Google could not check for an existing profile</b>
        </Callout>
        <p className="gp-lead">
          If you are sure this business is not on Google yet, you can create the profile now. If it may already exist,
          search for it on Google Maps first and ask for access instead.
        </p>
        {result.reason && <p className="gp-note gp-setup-wrap">Google said: {result.reason}</p>}
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-ghost" onClick={onCreate} disabled={busy}>
            Create the profile
          </button>
          <button type="button" className="gp-btn gp-btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
  if (result.matches.length === 0) {
    return (
      <Callout tone="ok" role="status">
        No matching profile found on Google. You can create yours.
      </Callout>
    );
  }
  return (
    <div className="gp-setup-result" role="alert">
      <Callout tone="alert">
        <b>This business may already be on Google</b>
      </Callout>
      <p className="gp-lead">
        Google found profiles that look like yours. If one is yours, request access on Google instead of creating a
        second one.
      </p>
      <ul className="gp-setup-matches">
        {result.matches.map((match, index) => (
          <li key={`${match.title}-${index}`} className="gp-setup-match">
            <span className="gp-setup-wrap">
              <b>{match.title}</b>
              {match.address && <span className="gp-note"> · {match.address}</span>}
            </span>
            {match.request_access_uri ? (
              <a className="gp-link gp-setup-inline" href={match.request_access_uri} target="_blank" rel="noopener noreferrer">
                Request access on Google
                <FiArrowUpRight size={16} aria-hidden="true" />
                <span className="visually-hidden"> for {match.title} (opens in a new tab)</span>
              </a>
            ) : (
              <span className="gp-note">Search for it on Google Maps to ask for access.</span>
            )}
          </li>
        ))}
      </ul>
      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onCreate} disabled={busy}>
          It's a different business — create mine
        </button>
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onClose} disabled={busy}>
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * `accounts` = the Google business accounts, `account` the one chosen on the pick screen; `onBack` returns to it;
 * `onCreated()` reads the View again and resolves true when the page moved on to verification.
 */
export default function SetupCreate({ headRef, accounts, account, onBack, onCreated }) {
  const ids = useId();
  const confirmRef = useRef(null);
  const [locationId, setLocationId] = useState(null);
  const [prefill, setPrefill] = useState({ status: "loading", data: null, error: null });
  const [values, setValues] = useState(null);
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [problem, setProblem] = useState(null);
  const [check, setCheck] = useState(null); // { key, matches, checked, reason }
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(null); // null | "check" | "create" | "continue"
  const [created, setCreated] = useState(false);
  const request = useRef(0);

  const loadPrefill = useCallback(
    async (forLocation) => {
      const mine = ++request.current;
      setPrefill({ status: "loading", data: null, error: null });
      try {
        const data = await googleProfileApi.prefill(forLocation);
        if (mine !== request.current) return;
        if (!data || !data.form) throw new Error("no prefill");
        setPrefill({ status: "ready", data, error: null });
        setValues(profileFormFrom(data, account || (accounts.length === 1 ? accounts[0].name : "")));
        setTouched({});
        setTried(false);
        setServerErrors({});
        setCheck(null);
        setConfirm(false);
      } catch (error) {
        if (mine === request.current) setPrefill({ status: "error", data: null, error });
      }
    },
    [account, accounts]
  );

  useEffect(() => {
    loadPrefill(locationId);
  }, [loadPrefill, locationId]);

  useEffect(() => {
    if (confirm) requestAnimationFrame(() => confirmRef.current?.focus());
  }, [confirm]);

  const heading = (
    <div className="gp-setup-head">
      <h2 className="gp-h2" id={`${ids}-title`} ref={headRef} tabIndex={-1}>
        Create your Google profile
      </h2>
      <button type="button" className="gp-btn gp-btn-ghost" onClick={onBack} disabled={Boolean(busy)}>
        <FiArrowLeft size={18} aria-hidden="true" />
        Back to your profiles
      </button>
    </div>
  );

  const aside = (
    <AsideCard title="Before you create it">
      <ul className="gp-next">
        <li>Use your real business name, as couples see it on your signboard.</li>
        <li>Check the address: Google shows it on Maps.</li>
        <li>The profile is created in your own Google account.</li>
        <li>Google then asks you to verify the business, usually with a code.</li>
      </ul>
    </AsideCard>
  );

  if (created) {
    return (
      <section className="gp-grid2">
        <div className="gp-card">
          <Callout tone="ok" role="status">
            <b>Your Google profile was created.</b>
          </Callout>
          <h2 className="gp-h2" ref={headRef} tabIndex={-1}>
            Next: Google verification
          </h2>
          <p className="gp-lead">We couldn't show the next step yet. Press Continue to try again.</p>
          <div className="gp-btns">
            <button
              type="button"
              className="gp-btn gp-btn-primary"
              disabled={busy === "continue"}
              aria-busy={busy === "continue" || undefined}
              onClick={async () => {
                setBusy("continue");
                await onCreated();
                setBusy(null);
              }}
            >
              {busy === "continue" ? (
                <Spinner animation="border" size="sm" aria-hidden="true" />
              ) : (
                <FiRefreshCw size={18} aria-hidden="true" />
              )}
              Continue
            </button>
          </div>
        </div>
        {aside}
      </section>
    );
  }

  if (prefill.status !== "ready" || !values) {
    return (
      <section className="gp-grid2">
        <div className="gp-card">
          {heading}
          {prefill.status === "error" ? (
            <>
              <Callout tone="bad" role="alert">
                {messageOf(prefill.error, "We couldn't load your details. Please try again.")}
              </Callout>
              <div className="gp-btns">
                <button type="button" className="gp-btn gp-btn-primary" onClick={() => loadPrefill(locationId)}>
                  <FiRefreshCw size={18} aria-hidden="true" />
                  Try again
                </button>
              </div>
            </>
          ) : (
            <p className="gp-note gp-setup-inline" role="status">
              <Spinner animation="border" size="sm" aria-hidden="true" />
              Filling in your details…
            </p>
          )}
        </div>
        {aside}
      </section>
    );
  }

  const data = prefill.data;
  const locations = Array.isArray(data.locations) ? data.locations : [];
  const clientErrors = checkProfileForm(values);
  const body = profileBody(values);
  const bodyKey = JSON.stringify(body);
  const currentCheck = check && check.key === bodyKey ? check : null;
  const working = Boolean(busy);

  // A field's message: the server's for that field, else the form's own once touched or after a press.
  const errorOf = (field) => serverErrors[field] || ((tried || touched[field]) && clientErrors[field]) || "";
  const fieldId = (field) => `${ids}-${field}`;

  const set = (patch) => {
    setValues((current) => ({ ...current, ...patch }));
    setServerErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
    setProblem(null);
    setConfirm(false);
  };
  const touch = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const firstError = (errors) => FIELD_ORDER.find((field) => errors[field]);
  const focusField = (field) => {
    const el =
      field === "days"
        ? document.getElementById(`${fieldId("days")}-group`)?.querySelector("button")
        : document.getElementById(fieldId(field));
    el?.focus?.();
    el?.scrollIntoView?.({ block: "center" });
  };

  // Every value right? Shows the messages and moves to the first wrong one otherwise.
  const ready = () => {
    setTried(true);
    const field = firstError(clientErrors);
    if (!field) return true;
    if (field === "region_code" || field === "account_name" || field === "location_id") {
      setProblem({ message: clientErrors[field] });
    }
    requestAnimationFrame(() => focusField(field));
    return false;
  };

  const failed = (error, fallback) => {
    const fields = serverFieldErrors(error);
    setServerErrors(fields);
    setProblem({ message: messageOf(error, fallback) });
    const field = firstError(fields);
    if (field) requestAnimationFrame(() => focusField(field));
  };

  // Look for the same business on Google. Resolves the result, or null when the check failed.
  const runCheck = async () => {
    setBusy("check");
    setProblem(null);
    setConfirm(false);
    try {
      const answer = await googleProfileApi.checkProfile(body);
      const matches = Array.isArray(answer?.data) ? answer.data.filter((m) => m && m.title) : [];
      const meta = answer?.meta || {};
      const result = {
        key: bodyKey,
        matches,
        checked: meta.checked !== false,
        reason: typeof meta.reason === "string" ? meta.reason : null,
      };
      setCheck(result);
      return result;
    } catch (error) {
      failed(error, "Could not check Google. Please try again.");
      return null;
    } finally {
      setBusy(null);
    }
  };

  const pressCheck = () => {
    if (!ready() || working) return;
    runCheck();
  };

  // "Create my Google profile": check first (unless these exact details were checked), then ask to confirm.
  const pressCreate = async () => {
    if (!ready() || working) return;
    if (!currentCheck) {
      const result = await runCheck();
      if (!result || !result.checked || result.matches.length > 0) return;
    }
    setConfirm(true);
  };

  const doCreate = async () => {
    setBusy("create");
    setProblem(null);
    try {
      await googleProfileApi.createProfile(body);
    } catch (error) {
      setBusy(null);
      setConfirm(false);
      failed(error, "Could not create the profile. Please try again.");
      return;
    }
    const moved = await onCreated();
    setBusy(null);
    if (!moved) setCreated(true);
  };

  const description = values.description || "";

  return (
    <section className="gp-grid2">
      <form
        className="gp-card"
        noValidate
        aria-labelledby={`${ids}-title`}
        onSubmit={(e) => {
          e.preventDefault();
          pressCreate();
        }}
      >
        {heading}
        <p className="gp-lead">
          We filled this in from your HappyWedz details. Check every value: it appears on Google Search and Maps.
        </p>

        {data.map_pin === false && (
          <Callout tone="alert" role="note">
            This address has no map pin. Google needs one when it can't find the address on the map by itself. If
            creating fails, check the street address, city and PIN code.
          </Callout>
        )}

        <div className="gp-setup-grid">
          {accounts.length > 1 && (
            <div className="gp-field gp-setup-wide">
              <label htmlFor={fieldId("account_name")}>Google business account</label>
              <select
                id={fieldId("account_name")}
                className="gp-input"
                value={values.account_name}
                onChange={(e) => set({ account_name: e.target.value })}
                disabled={working}
                aria-invalid={Boolean(errorOf("account_name")) || undefined}
              >
                <option value="">Choose a business account</option>
                {accounts.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.accountName || a.name}
                  </option>
                ))}
              </select>
              {errorOf("account_name") && <small className="gp-field-error">{errorOf("account_name")}</small>}
            </div>
          )}

          {locations.length > 1 && (
            <div className="gp-field gp-setup-wide">
              <label htmlFor={fieldId("location_id")}>Business location</label>
              <select
                id={fieldId("location_id")}
                className="gp-input"
                value={values.location_id}
                onChange={(e) => setLocationId(e.target.value || null)}
                disabled={working}
                aria-describedby={`${fieldId("location_id")}-hint`}
              >
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <small id={`${fieldId("location_id")}-hint`} className="gp-note gp-field-help">
                The profile is linked to this location. Changing it fills the form in again.
              </small>
            </div>
          )}

          <TextField
            id={fieldId("title")}
            label="Business name"
            value={values.title}
            onChange={(title) => set({ title })}
            onBlur={touch("title")}
            error={errorOf("title")}
            hint="Your real business name, as couples see it on your signboard."
            maxLength={PROFILE_LIMITS.title}
            autoComplete="organization"
            wide
            disabled={working}
          />

          <SetupCategory
            key={values.location_id}
            id={fieldId("category")}
            region={values.region_code}
            initialQuery={data.form.category_query || values.category_name}
            value={{ name: values.category, display_name: values.category_name }}
            onChange={(category, category_name) => set({ category, category_name })}
            error={errorOf("category")}
            disabled={working}
          />

          <TextField
            id={fieldId("address_line1")}
            label="Street address"
            value={values.address_line1}
            onChange={(address_line1) => set({ address_line1 })}
            onBlur={touch("address_line1")}
            error={errorOf("address_line1")}
            maxLength={PROFILE_LIMITS.address}
            autoComplete="address-line1"
            wide
            disabled={working}
          />
          <TextField
            id={fieldId("address_line2")}
            label="Area / landmark"
            optional
            value={values.address_line2}
            onChange={(address_line2) => set({ address_line2 })}
            onBlur={touch("address_line2")}
            error={errorOf("address_line2")}
            maxLength={PROFILE_LIMITS.address}
            autoComplete="address-line2"
            wide
            disabled={working}
          />
          <TextField
            id={fieldId("locality")}
            label="City"
            value={values.locality}
            onChange={(locality) => set({ locality })}
            onBlur={touch("locality")}
            error={errorOf("locality")}
            maxLength={PROFILE_LIMITS.locality}
            autoComplete="address-level2"
            disabled={working}
          />
          <TextField
            id={fieldId("administrative_area")}
            label="State"
            value={values.administrative_area}
            onChange={(administrative_area) => set({ administrative_area })}
            onBlur={touch("administrative_area")}
            error={errorOf("administrative_area")}
            maxLength={PROFILE_LIMITS.administrative_area}
            autoComplete="address-level1"
            disabled={working}
          />
          <TextField
            id={fieldId("postal_code")}
            label="PIN code"
            value={values.postal_code}
            onChange={(postal_code) => set({ postal_code })}
            onBlur={touch("postal_code")}
            error={errorOf("postal_code")}
            maxLength={PROFILE_LIMITS.postal_code}
            autoComplete="postal-code"
            inputMode="numeric"
            disabled={working}
          />
          <TextField
            id={fieldId("phone")}
            label="Phone"
            optional
            type="tel"
            value={values.phone}
            onChange={(phone) => set({ phone })}
            onBlur={touch("phone")}
            error={errorOf("phone")}
            hint="Google may call or text this number with the verification code."
            maxLength={PROFILE_LIMITS.phone}
            autoComplete="tel"
            disabled={working}
          />
          <TextField
            id={fieldId("website")}
            label="Website"
            optional
            type="url"
            value={values.website}
            onChange={(website) => set({ website })}
            onBlur={touch("website")}
            error={errorOf("website")}
            placeholder="https://"
            inputMode="url"
            autoComplete="url"
            wide
            disabled={working}
          />
          <TextField
            id={fieldId("description")}
            label="Description"
            optional
            multiline
            value={description}
            onChange={(text) => set({ description: text })}
            onBlur={touch("description")}
            error={errorOf("description")}
            hint={`${description.length} / ${PROFILE_LIMITS.description} characters`}
            maxLength={PROFILE_LIMITS.description}
            wide
            disabled={working}
          />

          <div className="gp-setup-wide">
            <SetupHours
              idBase={ids}
              value={{ with_hours: values.with_hours, days: values.days, open: values.open, close: values.close }}
              onChange={(patch) => {
                set(patch);
                setTouched((current) => ({ ...current, days: true }));
              }}
              errors={{ days: errorOf("days"), open: errorOf("open"), close: errorOf("close") }}
              disabled={working}
            />
          </div>
        </div>

        {problem && (
          <Callout tone="bad" role="alert">
            {problem.message}
          </Callout>
        )}

        {currentCheck && !confirm && (
          <CheckResult result={currentCheck} busy={working} onCreate={() => setConfirm(true)} onClose={() => setCheck(null)} />
        )}

        {confirm ? (
          <div className="gp-setup-confirm" role="group" aria-labelledby={`${ids}-confirm`}>
            <h3 className="gp-h3" id={`${ids}-confirm`} ref={confirmRef} tabIndex={-1}>
              Create this profile on Google?
            </h3>
            <p className="gp-lead">
              It's created in your own Google account as <b>{body.title}</b>. Google then asks you to verify the
              business, usually with a code by postcard, phone call, text message or email.
            </p>
            <div className="gp-btns">
              <button
                type="button"
                className="gp-btn gp-btn-primary"
                onClick={doCreate}
                disabled={working}
                aria-busy={busy === "create" || undefined}
              >
                {busy === "create" ? (
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                ) : (
                  <FiCheck size={18} aria-hidden="true" />
                )}
                Yes, create it
              </button>
              <button type="button" className="gp-btn gp-btn-ghost" onClick={() => setConfirm(false)} disabled={working}>
                Not yet
              </button>
            </div>
          </div>
        ) : (
          <div className="gp-btns">
            <button
              type="button"
              className="gp-btn gp-btn-ghost"
              onClick={pressCheck}
              disabled={working}
              aria-busy={busy === "check" || undefined}
            >
              {busy === "check" ? (
                <Spinner animation="border" size="sm" aria-hidden="true" />
              ) : (
                <FiSearch size={18} aria-hidden="true" />
              )}
              Check
            </button>
            <button type="submit" className="gp-btn gp-btn-primary" disabled={working}>
              <FiPlus size={18} aria-hidden="true" />
              Create my Google profile
            </button>
            {tried && Object.keys(clientErrors).length > 0 && !working && (
              <span className="gp-note gp-setup-inline">
                <FiAlertTriangle size={16} aria-hidden="true" />
                Fix the fields marked in red.
              </span>
            )}
          </div>
        )}
        <p className="gp-note">Check looks for this business on Google first. Nothing is created until you confirm.</p>
      </form>
      {aside}
    </section>
  );
}

