import React, { useId, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowRight, FiLock, FiMapPin, FiSearch, FiStar, FiTrendingUp } from "react-icons/fi";
import { Callout, FixLink } from "./GpParts";
import { GROWTHOS_PRIVACY_URL, STOREFRONT_PATH, WEEKDAYS, toTimeInput } from "./gpFormat";

/** A Storefront link that opens the section to fix (Storefront reads ?section=), e.g. vendor-location. */
const withSection = (url, tab) => {
  if (!tab || !url || !url.includes("/vendor-dashboard/vendor-store-front")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}section=${encodeURIComponent(tab)}`;
};

const ANSWERS = [
  {
    id: "yes",
    label: "Yes, I have one",
    help: "You'll sign in with Google and pick it. Nothing new is created.",
  },
  {
    id: "no",
    label: "No, create one for me",
    help: "GrowthOS creates it on your own Google account from the details above.",
  },
  {
    id: "unsure",
    label: "I'm not sure",
    help: "GrowthOS checks Google for a matching profile before creating a new one.",
  },
];

const BENEFITS = [
  {
    Icon: FiSearch,
    title: "Found on Google Search and Maps",
    text: "Your business with photos, hours, phone and directions.",
  },
  {
    Icon: FiStar,
    title: "Google reviews in one place",
    text: "Read reviews and reply to them from GrowthOS.",
  },
  {
    Icon: FiTrendingUp,
    title: "Posts and profile help",
    text: "GrowthOS suggests posts and fixes for your profile. You approve each one.",
  },
  {
    Icon: FiLock,
    title: "Your profile, your account",
    text: "The profile is created in your own Google account. GrowthOS never owns it.",
  },
];

function Fact({ label, value, note }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>
        {value ? value : <span className="gp-muted">Not added</span>}
        {note && <small>{note}</small>}
      </dd>
    </>
  );
}

/**
 * Screen 1: what will be sent, the working hours (HappyWedz does not keep them), the
 * vendor's answer about an existing Google profile, and consent.
 */
export default function StartScreen({ view, busy, problem, onSubmit }) {
  const ids = useId();
  const storefront = view?.storefront || {};
  const missing = Array.isArray(storefront.missing) ? storefront.missing : [];
  const hours = storefront.hours || {};

  const [openingTime, setOpeningTime] = useState(() => toTimeInput(hours.opening_time));
  const [closingTime, setClosingTime] = useState(() => toTimeInput(hours.closing_time));
  const [closedDays, setClosedDays] = useState(() =>
    Array.isArray(hours.weekly_off) ? hours.weekly_off.filter((d) => WEEKDAYS.some((w) => w.id === d)) : []
  );
  const [answer, setAnswer] = useState(() => view?.answer?.has_google_profile || "no");
  const [consent, setConsent] = useState(false);

  const toggleDay = (day) =>
    setClosedDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]));

  const hoursMissing = !openingTime || !closingTime;
  const allClosed = closedDays.length === WEEKDAYS.length;

  // The first reason the button is off, shown beside it.
  let hint = "";
  if (missing.length > 0) hint = "Add the missing details in Storefront first.";
  else if (hoursMissing) hint = "Add your opening and closing time.";
  else if (allClosed) hint = "Leave at least one day open.";
  else if (!consent) hint = "Tick the box above to continue.";

  const canSubmit = !hint && !busy;

  const submit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      has_google_profile: answer,
      opening_time: openingTime,
      closing_time: closingTime,
      // Kept in week order, whatever order they were ticked in.
      weekly_off: WEEKDAYS.map((w) => w.id).filter((d) => closedDays.includes(d)),
      consent: true,
    });
  };

  const searchExample = storefront.category
    ? `"${storefront.category.toLowerCase()} near me"`
    : `"wedding vendors near me"`;

  return (
    <section className="gp-grid2">
      <form className="gp-card gp-card-tint" onSubmit={submit} noValidate aria-labelledby={`${ids}-title`}>
        <div className="gp-row">
          <span className="gp-icon-badge" aria-hidden="true">
            <FiMapPin size={26} />
          </span>
          <div className="gp-stack-sm">
            <span className="gp-eyebrow">New on HappyWedz</span>
            <h2 className="gp-h2" id={`${ids}-title`}>
              Show up when couples search on Google and Maps
            </h2>
            <p className="gp-lead">
              Couples search {searchExample} on Google. Set up your Google Business Profile from your HappyWedz
              storefront. GrowthOS does the setup, and the profile stays in your own Google account.
            </p>
          </div>
        </div>

        <div className="gp-stack-sm">
          <h3 className="gp-h3">We'll use these details from your storefront</h3>
          <dl className="gp-facts">
            <Fact label="Business name" value={storefront.business_name} />
            <Fact label="Category" value={storefront.category} />
            <Fact label="Owner" value={storefront.owner_name} />
            <Fact
              label="Email"
              value={storefront.email}
              note={storefront.email ? "GrowthOS sends the set-password link here" : null}
            />
            <Fact label="Mobile" value={storefront.mobile} />
            <Fact label="Address" value={storefront.address} />
            <Fact label="Website" value={storefront.website} />
          </dl>
          <FixLink to={STOREFRONT_PATH} className="gp-note gp-link">
            Something wrong? Edit it in Storefront first.
          </FixLink>
        </div>

        {missing.length > 0 && (
          <Callout tone="alert" role="alert">
            <b>Add these to your storefront first:</b>
            <ul className="gp-list">
              {missing.map((item) => (
                <li key={item.field || item.label}>
                  <FixLink to={withSection(item.fix_url || STOREFRONT_PATH, item.tab)} className="gp-link">
                    {item.label || item.field}
                  </FixLink>
                </li>
              ))}
            </ul>
          </Callout>
        )}

        <fieldset className="gp-fieldset">
          <legend className="gp-legend">Working hours</legend>
          <div className="gp-times">
            <label className="gp-field" htmlFor={`${ids}-open`}>
              <span>Opening time</span>
              <input
                id={`${ids}-open`}
                type="time"
                className="gp-input"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                required
              />
            </label>
            <label className="gp-field" htmlFor={`${ids}-close`}>
              <span>Closing time</span>
              <input
                id={`${ids}-close`}
                type="time"
                className="gp-input"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="gp-field">
            <span id={`${ids}-days`}>Closed days</span>
            <div className="gp-days" role="group" aria-labelledby={`${ids}-days`}>
              {WEEKDAYS.map((day) => {
                const closed = closedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={`gp-day ${closed ? "is-closed" : ""}`}
                    aria-pressed={closed}
                    aria-label={day.long}
                    onClick={() => toggleDay(day.id)}
                  >
                    {day.short}
                  </button>
                );
              })}
            </div>
            <small className="gp-note">Tap the days you are closed. Leave them all open if you work every day.</small>
          </div>
        </fieldset>

        <fieldset className="gp-fieldset gp-choice">
          <legend className="gp-legend">Do you already have a Google Business Profile?</legend>
          {ANSWERS.map((option) => (
            <label
              key={option.id}
              className={`gp-choice-item ${answer === option.id ? "is-checked" : ""}`}
              htmlFor={`${ids}-gbp-${option.id}`}
            >
              <input
                type="radio"
                name={`${ids}-gbp`}
                id={`${ids}-gbp-${option.id}`}
                value={option.id}
                checked={answer === option.id}
                onChange={() => setAnswer(option.id)}
              />
              <span>
                {option.label}
                <small>{option.help}</small>
              </span>
            </label>
          ))}
        </fieldset>

        <label className="gp-consent" htmlFor={`${ids}-consent`}>
          <input
            type="checkbox"
            id={`${ids}-consent`}
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>
            {view?.consent_text}{" "}
            <a href={GROWTHOS_PRIVACY_URL} target="_blank" rel="noopener" className="gp-link">
              GrowthOS Privacy Policy
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </span>
        </label>

        {problem && <SetupProblem problem={problem} />}

        <div className="gp-btns">
          <button className="gp-btn gp-btn-primary" type="submit" disabled={!canSubmit} aria-busy={busy || undefined}>
            {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiArrowRight size={18} aria-hidden="true" />}
            Set up my Google profile
          </button>
          {hint && !busy && <span className="gp-note">{hint}</span>}
        </div>
      </form>

      <aside className="gp-card">
        <h3 className="gp-h3">What you get</h3>
        <ul className="gp-why">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title}>
              <benefit.Icon size={22} aria-hidden="true" className="gp-why-icon" />
              <span>
                <b>{benefit.title}</b>
                <span>{benefit.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="gp-powered">
          <FiTrendingUp size={18} aria-hidden="true" />
          <span>
            Set up by <b>GrowthOS AI</b>, a HappyWedz partner
          </span>
        </div>
      </aside>
    </section>
  );
}

/** Why the last "Set up" press did not go through. */
function SetupProblem({ problem }) {
  const fields = Array.isArray(problem.fields) ? problem.fields : [];
  return (
    <Callout tone="bad" role="alert">
      <b>{problem.message}</b>
      {fields.length > 0 && (
        <ul className="gp-list">
          {fields.map((field, index) => (
            <li key={`${field.path || field.label}-${index}`}>
              <b>{field.label || field.path}</b>
              {field.message ? `: ${field.message}` : ""}
              {field.fix_url && (
                <>
                  {" "}
                  <FixLink to={withSection(field.fix_url, field.tab)} className="gp-link">
                    Fix it in Storefront
                  </FixLink>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Callout>
  );
}
