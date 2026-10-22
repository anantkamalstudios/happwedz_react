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

const DAYS = { MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun" };
const OPEN_STATUS = { OPEN: "Open", CLOSED_TEMPORARILY: "Temporarily closed", CLOSED_PERMANENTLY: "Permanently closed" };
const clock = (t) => (t ? `${String(t.hours ?? 0).padStart(2, "0")}:${String(t.minutes ?? 0).padStart(2, "0")}` : "");

/**
 * A raw Google value as short readable text (phone numbers, address, categories, hours, description…), or null when
 * there is nothing. Never shows code: an unknown shape is read field by field.
 */
const readable = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const parts = value.map(readable).filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  if (typeof value !== "object" || Object.keys(value).length === 0) return null;
  if (typeof value.displayName === "string") return value.displayName;
  if ("primaryPhone" in value || "additionalPhones" in value)
    return [value.primaryPhone, ...(value.additionalPhones || [])].filter(Boolean).join(", ") || null;
  if (value.addressLines || value.locality || value.postalCode)
    return [...(value.addressLines || []), value.locality, value.administrativeArea, value.postalCode].filter(Boolean).join(", ") || null;
  if ("primaryCategory" in value || "additionalCategories" in value)
    return [value.primaryCategory?.displayName, ...(value.additionalCategories || []).map((c) => c?.displayName)].filter(Boolean).join(", ") || null;
  if (Array.isArray(value.periods))
    return value.periods.map((p) => `${DAYS[p.openDay] || p.openDay} ${clock(p.openTime)}–${clock(p.closeTime)}`).join(", ") || null;
  if (typeof value.status === "string") return OPEN_STATUS[value.status] || value.status;
  const parts = Object.values(value).map(readable).filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
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
                <dd>{readable(f.google) ?? <span className="gp-muted">{f.pending ? "Not shown yet" : "Not set"}</span>}</dd>
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
        <p className="gp-note">
          Google is checking {state.fields.length > 1 ? "these changes" : "this change"}. You don't need to do
          anything: this box goes away when Google has finished.
        </p>
      )}
      {doneLine}
    </section>
  );
}
