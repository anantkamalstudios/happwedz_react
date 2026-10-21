import React from "react";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FiAlertCircle, FiAlertTriangle, FiArrowUpRight, FiCheck, FiClock, FiRefreshCw } from "react-icons/fi";
import { STEPS, isAppPath, initials } from "./gpFormat";

const CALLOUT_ICONS = {
  ok: FiCheck,
  warn: FiClock,
  bad: FiAlertCircle,
  alert: FiAlertTriangle,
};

/** The 5-step strip above every screen. `done` = how many steps are finished. */
export function StepStrip({ done }) {
  return (
    <ol className="gp-steps" aria-label="Setup progress">
      {STEPS.map((label, index) => {
        const state = index < done ? "done" : index === done ? "now" : "todo";
        return (
          <li
            key={label}
            className={`gp-step is-${state}`}
            aria-current={state === "now" ? "step" : undefined}
          >
            <span className="gp-step-bar" aria-hidden="true" />
            <span className="gp-step-label">
              {label}
              {state === "done" && <span className="visually-hidden"> (done)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** A coloured message line. `tone` is ok | warn | bad | alert (amber warning). */
export function Callout({ tone = "ok", role, children }) {
  const Icon = CALLOUT_ICONS[tone] || FiCheck;
  return (
    <div className={`gp-callout gp-callout-${tone}`} role={role}>
      <Icon size={18} aria-hidden="true" className="gp-callout-icon" />
      <div className="gp-callout-body">{children}</div>
    </div>
  );
}

/** A button-styled link that opens GrowthOS in a new tab. */
export function GrowthosLink({ href, primary = true, children }) {
  return (
    <a
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`}
      href={href}
      target="_blank"
      rel="noopener"
    >
      {children}
      <FiArrowUpRight size={18} aria-hidden="true" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

/** A link to the place in HappyWedz where a detail is fixed (usually the storefront). */
export function FixLink({ to, className, children }) {
  if (!to) return <span className={className}>{children}</span>;
  if (isAppPath(to)) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}

/** "I've set my password" / "I've connected it" / "Check again". */
export function RefreshButton({ onClick, busy, disabled, primary = false, children }) {
  return (
    <button
      type="button"
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`}
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy || undefined}
    >
      {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiRefreshCw size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** The business name with its initials, as on the verification and live screens. */
export function ProfileHead({ name, line, children }) {
  return (
    <div className="gp-profile">
      <span className="gp-profile-ph" aria-hidden="true">
        {initials(name)}
      </span>
      <div className="gp-profile-text">
        <h2 className="gp-h2">{name}</h2>
        {line && <span className="gp-muted">{line}</span>}
        {children}
      </div>
    </div>
  );
}

/** A side card with a heading and one paragraph. */
export function AsideCard({ title, children }) {
  return (
    <aside className="gp-card">
      <h3 className="gp-h3">{title}</h3>
      {children}
    </aside>
  );
}
