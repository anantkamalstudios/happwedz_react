// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// "Google suggested changes" on the Profile tab: the fields where Google's version differs from the vendor's, with
// both versions; accept Google's or keep your own (only fields Google already changed; others are still under review).
// Shown only when Google suggests something. API: gpManageApi.googleUpdates / answerGoogleUpdates (googleUpdatesSchema).
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { ErrorNote } from "./ProfileShared";

// Google field paths → plain names (GrowthOS's labels).
const FIELD_LABELS = {
  title: "Business name",
  phoneNumbers: "Phone numbers",
  "phoneNumbers.primaryPhone": "Main phone",
  "phoneNumbers.additionalPhones": "Other phones",
  websiteUri: "Website",
  regularHours: "Opening hours",
  specialHours: "Special hours",
  moreHours: "More hours",
  categories: "Categories",
  "categories.primaryCategory": "Main category",
  "categories.additionalCategories": "Other categories",
  storefrontAddress: "Address",
  serviceArea: "Service area",
  profile: "Description",
  "profile.description": "Description",
  openInfo: "Open status",
  "openInfo.status": "Open status",
  "openInfo.openingDate": "Opening date",
  serviceItems: "Services",
};

const labelOf = (path) => FIELD_LABELS[path] || FIELD_LABELS[String(path).split(".")[0]] || path;

/** A raw Google value as short readable text. */
const readable = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value.join(", ");
  if (typeof value === "object" && typeof value.displayName === "string") return value.displayName;
  const json = JSON.stringify(value);
  return json.length > 300 ? `${json.slice(0, 300)}…` : json;
};

/** `onChanged` reloads the profile after an answer. */
export default function ProfileUpdates({ onChanged }) {
  const [state, setState] = useState({ status: "loading", fields: [], error: null });
  const [busy, setBusy] = useState(null); // accept | reject
  const [error, setError] = useState(null);
  const [done, setDone] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const data = await gpManageApi.googleUpdates();
      setState({ status: "ready", fields: Array.isArray(data?.fields) ? data.fields : [], error: null });
    } catch (failure) {
      setState({ status: "error", fields: [], error: failure });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (action) => {
    setBusy(action);
    setError(null);
    setDone("");
    try {
      await gpManageApi.answerGoogleUpdates({ action });
      setDone(action === "accept" ? "Google's version accepted." : "Your version kept on Google.");
      await load(true);
      onChanged?.();
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(null);
    }
  };

  const doneLine = <div aria-live="polite">{done && <Callout tone="ok">{done}</Callout>}</div>;

  if (state.status === "loading") return doneLine;
  if (state.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <ErrorNote error={state.error} fallback="We couldn't check Google's suggested changes." />
        <div className="gp-btns">
          <RefreshButton onClick={() => load()}>Check Google's suggestions again</RefreshButton>
        </div>
      </div>
    );
  }
  if (state.fields.length === 0) return doneLine;

  const decidable = state.fields.filter((f) => !f.pending);

  return (
    <section className="gp-card gp-card-tint gp-e-updates" aria-labelledby="gp-e-updates-title">
      <div className="gp-e-stack-sm">
        <h3 className="gp-h3" id="gp-e-updates-title">
          Google suggested changes
        </h3>
        <p className="gp-note">
          Google sometimes changes profile details, for example from customer suggestions. Compare both versions and choose
          which to keep.
        </p>
      </div>
      <ul className="gp-e-plain gp-e-stack">
        {state.fields.map((f) => (
          <li key={f.field} className="gp-e-stack-sm">
            <div className="gp-e-item-head">
              <span className="gp-e-item-title">{labelOf(f.field)}</span>
              {f.pending && <span className="gp-chip gp-chip-warn">Google is reviewing it</span>}
            </div>
            <dl className="gp-e-compare">
              <div>
                <dt>Your version</dt>
                <dd>{readable(f.yours) ?? <span className="gp-muted">Not set</span>}</dd>
              </div>
              <div>
                <dt>Google's version</dt>
                <dd>{readable(f.google) ?? <span className="gp-muted">Not set</span>}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <ErrorNote error={error} />
      {decidable.length > 0 ? (
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-primary" onClick={() => decide("accept")} disabled={Boolean(busy)} aria-busy={busy === "accept" || undefined}>
            {busy === "accept" && <Spinner animation="border" size="sm" aria-hidden="true" />}
            Accept Google's version
          </button>
          <button type="button" className="gp-btn gp-btn-ghost" onClick={() => decide("reject")} disabled={Boolean(busy)} aria-busy={busy === "reject" || undefined}>
            {busy === "reject" && <Spinner animation="border" size="sm" aria-hidden="true" />}
            Keep mine
          </button>
        </div>
      ) : (
        <p className="gp-note">Google is still reviewing these. Nothing to choose yet.</p>
      )}
      {doneLine}
    </section>
  );
}
