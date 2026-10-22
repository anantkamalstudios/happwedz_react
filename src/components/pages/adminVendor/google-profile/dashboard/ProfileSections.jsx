// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// The section forms of the Profile tab. Each saves one section on Google with gpManageApi.saveProfileSection(section,
// body), the body being exactly GrowthOS's section schema (growthos-api profile-edit.ts SECTION_SCHEMAS). Business
// name, categories, address and service area (and "permanently closed") need a ticked warning, sent as confirm_risk.
// Every form gets `data` (GrowthOS ProfileEditData), `onSaved(section, result)` and `onCancel`.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiPlus, FiStar, FiTrash2, FiX } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import ProfileHoursEditor from "./ProfileHoursEditor";
import ProfileSearch from "./ProfileSearch";
import { ErrorNote } from "./ProfileShared";
import {
  PROFILE_LIMITS,
  formatMoney,
  fromWeek,
  isHttpUrl,
  isTime,
  toWeek,
  weekErrors,
} from "./ProfileUtils";

const RISKY = ["name", "categories", "address", "service_area"];
const RISK = {
  title: "Google may review this change or ask you to verify your profile again.",
  label: "I understand. Save this change on Google.",
};

/** Saving one section: busy, the server's error, and save(body). */
function useSectionSave(section, onSaved) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const save = async (body) => {
    setBusy(true);
    setError(null);
    try {
      const result = await gpManageApi.saveProfileSection(section, body);
      onSaved(section, result);
    } catch (failure) {
      setError(failure);
      setBusy(false);
    }
  };
  return { busy, error, save, setError };
}

/**
 * The frame of one section form: heading (focused when it opens), the fields, the risk warning with its tick box,
 * the error, and Save on Google / Cancel. `onSubmit(confirmed)`.
 */
function SectionFrame({ section, title, intro, risk, onSubmit, onCancel, busy, error, canSave = true, problems, children }) {
  const id = useId();
  const headingRef = useRef(null);
  const [confirmed, setConfirmed] = useState(false);
  const warning = risk === undefined ? (RISKY.includes(section) ? RISK : null) : risk;

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <form
      className="gp-e-editor gp-e-section-form"
      noValidate
      aria-labelledby={`${id}-title`}
      onSubmit={(event) => {
        event.preventDefault();
        if (!busy) onSubmit(confirmed);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) {
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <div className="gp-e-editor-head">
        <h3 className="gp-h3" id={`${id}-title`} tabIndex={-1} ref={headingRef}>
          Edit {title.toLowerCase()}
        </h3>
        <p className="gp-note">{intro || "Saved on your Google profile when you press Save on Google."}</p>
      </div>
      {children}
      {problems && (
        <p className="gp-e-error" role="alert">
          {problems}
        </p>
      )}
      {warning && (
        <div className="gp-e-stack-sm">
          <Callout tone="alert">
            <b>{warning.title}</b>
          </Callout>
          <label className="gp-consent gp-e-consent" htmlFor={`${id}-confirm`}>
            <input id={`${id}-confirm`} type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            <span>{warning.label}</span>
          </label>
        </div>
      )}
      <ErrorNote error={error} />
      <div className="gp-btns">
        <button
          type="submit"
          className="gp-btn gp-btn-primary"
          disabled={busy || !canSave || (warning !== null && !confirmed)}
          aria-busy={busy || undefined}
        >
          {busy && <Spinner animation="border" size="sm" aria-hidden="true" />}
          {busy ? "Saving…" : "Save on Google"}
        </button>
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
      {warning && !confirmed && !busy && <p className="gp-note">Tick the box above to save.</p>}
    </form>
  );
}

/** A labelled text box with an optional hint and error. */
function TextField({ id, label, value, onChange, hint, error, required, maxLength, type = "text", inputMode, placeholder, autoComplete }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="gp-e-field">
      <label className="gp-e-label" htmlFor={id}>
        {label}
        {required && <span className="gp-e-req"> (required)</span>}
      </label>
      <input
        id={id}
        className="gp-input"
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
      />
      {hint && (
        <span className="gp-note" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="gp-e-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Description ─────────────────────────────────────────────────────────────

export function DescriptionForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("description", onSaved);
  const [text, setText] = useState(data.profile.description || "");
  const [focus, setFocus] = useState("");
  const [ai, setAi] = useState({ busy: false, error: null, note: "" });
  const [problem, setProblem] = useState("");

  const writeWithAi = async () => {
    setAi({ busy: true, error: null, note: "" });
    try {
      const result = await gpManageApi.generateDescription({ focus: focus.trim() || null });
      if (result?.description) setText(result.description.slice(0, PROFILE_LIMITS.description));
      const used = Array.isArray(result?.keywords_used) ? result.keywords_used : [];
      setAi({
        busy: false,
        error: null,
        note: `The AI wrote a new description below. Read it and change anything before you save.${used.length ? ` Keywords used: ${used.join(", ")}.` : ""}`,
      });
    } catch (error) {
      setAi({ busy: false, error, note: "" });
    }
  };

  const submit = () => {
    if (text.trim().length > PROFILE_LIMITS.description) {
      setProblem(`Google allows up to ${PROFILE_LIMITS.description} characters.`);
      return;
    }
    setProblem("");
    s.save({ description: text.trim() });
  };

  return (
    <SectionFrame section="description" title={title} onSubmit={submit} onCancel={onCancel} busy={s.busy} error={s.error}>
      <div className="gp-e-ai-box">
        <TextField
          id={`${id}-focus`}
          label="What to highlight (optional)"
          value={focus}
          onChange={setFocus}
          maxLength={300}
          placeholder="e.g. bridal makeup, open on Sundays"
          hint="Only things that are true for your business."
        />
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-ghost" onClick={writeWithAi} disabled={ai.busy || s.busy} aria-busy={ai.busy || undefined}>
            {ai.busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiStar size={18} aria-hidden="true" />}
            {ai.busy ? "Writing…" : text.trim() ? "Write a new version with AI" : "Write with AI"}
          </button>
        </div>
        <p className="gp-note">
          Written from your business details and services, within Google's {PROFILE_LIMITS.description} characters (no phone
          numbers, links or prices).
        </p>
        <p className="gp-note" role="status">
          {ai.note}
        </p>
        <ErrorNote error={ai.error} />
      </div>
      <div className="gp-e-field">
        <label className="gp-e-label" htmlFor={`${id}-text`}>
          Description
        </label>
        <textarea
          id={`${id}-text`}
          className="gp-input gp-e-textarea"
          rows={8}
          maxLength={PROFILE_LIMITS.description}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-describedby={`${id}-count${problem ? ` ${id}-problem` : ""}`}
          aria-invalid={Boolean(problem) || undefined}
        />
        <span className="gp-note" id={`${id}-count`}>
          {text.length} of {PROFILE_LIMITS.description} characters
        </span>
        {problem && (
          <span className="gp-e-error" id={`${id}-problem`}>
            {problem}
          </span>
        )}
      </div>
    </SectionFrame>
  );
}

// ── Hours ───────────────────────────────────────────────────────────────────

export function HoursForm({ data, title, onSaved, onCancel }) {
  const s = useSectionSave("hours", onSaved);
  const [week, setWeek] = useState(() => toWeek(data.profile.regular_hours));
  const [errors, setErrors] = useState({});
  const submit = () => {
    const found = weekErrors(week);
    setErrors(found);
    if (Object.keys(found).length) return;
    s.save({ periods: fromWeek(week) });
  };
  return (
    <SectionFrame
      section="hours"
      title={title}
      onSubmit={submit}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
      problems={Object.keys(errors).length ? "Some hours need fixing. See the days marked below." : ""}
    >
      <ProfileHoursEditor legend="Opening hours" value={week} onChange={setWeek} errors={errors} />
    </SectionFrame>
  );
}

export function MoreHoursForm({ data, title, onSaved, onCancel }) {
  const s = useSectionSave("more_hours", onSaved);
  const types = data.more_hours_types || [];
  const [weeks, setWeeks] = useState(() =>
    Object.fromEntries(types.map((t) => [t.id, toWeek(data.profile.more_hours.find((h) => h.type_id === t.id)?.periods || [])])),
  );
  const [errors, setErrors] = useState({});
  const submit = () => {
    const found = Object.assign({}, ...types.map((t) => weekErrors(weeks[t.id] || toWeek([]), `${t.id}.`)));
    setErrors(found);
    if (Object.keys(found).length) return;
    s.save({
      types: types.map((t) => ({ type_id: t.id, periods: fromWeek(weeks[t.id] || toWeek([])) })).filter((t) => t.periods.length > 0),
    });
  };
  return (
    <SectionFrame
      section="more_hours"
      title={title}
      intro="Extra hours Google shows for your category. Leave a type closed every day to not show it."
      onSubmit={submit}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
      problems={Object.keys(errors).length ? "Some hours need fixing. See the days marked below." : ""}
    >
      {types.map((t) => (
        <ProfileHoursEditor
          key={t.id}
          legend={t.name}
          value={weeks[t.id] || toWeek([])}
          onChange={(week) => setWeeks((all) => ({ ...all, [t.id]: week }))}
          errors={errors}
          prefix={`${t.id}.`}
        />
      ))}
    </SectionFrame>
  );
}

export function SpecialHoursForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("special_hours", onSaved);
  const [days, setDays] = useState(() =>
    data.profile.special_hours.map((d) => ({ date: d.date || "", closed: Boolean(d.closed), open: d.open || "", close: d.close || "" })),
  );
  const [errors, setErrors] = useState({});
  const update = (i, patch) => setDays((all) => all.map((d, j) => (j === i ? { ...d, ...patch } : d)));

  const submit = () => {
    const found = {};
    days.forEach((d, i) => {
      if (!d.date) found[i] = "Choose a date.";
      else if (!d.closed && (!isTime(d.open) || !isTime(d.close))) found[i] = "Set an opening and a closing time, or tick Closed all day.";
      else if (!d.closed && d.close <= d.open) found[i] = "The closing time must be after the opening time.";
    });
    setErrors(found);
    if (Object.keys(found).length) return;
    s.save({
      days: days.map((d) => (d.closed ? { date: d.date, closed: true, open: null, close: null } : { date: d.date, closed: false, open: d.open, close: d.close })),
    });
  };

  return (
    <SectionFrame
      section="special_hours"
      title={title}
      intro="Dates when your hours differ from the usual, like holidays."
      onSubmit={submit}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
      problems={Object.keys(errors).length ? "Some dates need fixing. See below." : ""}
    >
      {days.length === 0 && <p className="gp-note">No special hours yet.</p>}
      <ul className="gp-e-plain gp-e-stack">
        {days.map((d, i) => (
          <li key={i} className="gp-e-day is-open">
            <div className="gp-e-range-row">
              <label className="gp-e-field">
                <span className="gp-note">Date</span>
                <input
                  type="date"
                  className="gp-input"
                  value={d.date}
                  onChange={(e) => update(i, { date: e.target.value })}
                  aria-label={`Special date ${i + 1}`}
                  aria-invalid={Boolean(errors[i]) || undefined}
                  aria-describedby={errors[i] ? `${id}-${i}-error` : undefined}
                />
              </label>
              <button
                type="button"
                className="gp-e-icon-btn"
                onClick={() => setDays((all) => all.filter((_, j) => j !== i))}
                aria-label={`Remove special date ${i + 1}`}
              >
                <FiTrash2 size={18} aria-hidden="true" />
              </button>
            </div>
            <label className="gp-e-check" htmlFor={`${id}-${i}-closed`}>
              <input id={`${id}-${i}-closed`} type="checkbox" checked={d.closed} onChange={(e) => update(i, { closed: e.target.checked })} />
              Closed all day<span className="visually-hidden"> on special date {i + 1}</span>
            </label>
            {!d.closed && (
              <div className="gp-e-range-row">
                <label className="gp-e-field">
                  <span className="gp-note">Opens</span>
                  <input type="time" className="gp-input" value={d.open} onChange={(e) => update(i, { open: e.target.value })} aria-label={`Special date ${i + 1} opens`} />
                </label>
                <label className="gp-e-field">
                  <span className="gp-note">Closes</span>
                  <input type="time" className="gp-input" value={d.close} onChange={(e) => update(i, { close: e.target.value })} aria-label={`Special date ${i + 1} closes`} />
                </label>
              </div>
            )}
            {errors[i] && (
              <span className="gp-e-error" id={`${id}-${i}-error`}>
                {errors[i]}
              </span>
            )}
          </li>
        ))}
      </ul>
      {days.length < PROFILE_LIMITS.special_days && (
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={() => setDays((all) => [...all, { date: "", closed: true, open: "", close: "" }])}>
            <FiPlus size={16} aria-hidden="true" />
            Add a date
          </button>
        </div>
      )}
    </SectionFrame>
  );
}

// ── Contact, name, address ──────────────────────────────────────────────────

export function ContactForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("contact", onSaved);
  const [primary, setPrimary] = useState(data.profile.primary_phone || "");
  const [more, setMore] = useState(data.profile.additional_phones || []);
  const [website, setWebsite] = useState(data.profile.website || "");
  const [errors, setErrors] = useState({});

  const submit = () => {
    const found = {};
    if (primary.trim().length > 30) found.primary = "Too long.";
    more.forEach((p, i) => {
      if (!p.trim()) found[`more${i}`] = "Enter the number, or remove this box.";
      else if (p.trim().length > 30) found[`more${i}`] = "Too long.";
    });
    if (website.trim() && !isHttpUrl(website)) found.website = "Enter a web address starting with https://";
    setErrors(found);
    if (Object.keys(found).length) return;
    s.save({ primary_phone: primary.trim(), additional_phones: more.map((p) => p.trim()), website: website.trim() });
  };

  return (
    <SectionFrame section="contact" title={title} onSubmit={submit} onCancel={onCancel} busy={s.busy} error={s.error}>
      <TextField id={`${id}-primary`} label="Main phone" type="tel" inputMode="tel" autoComplete="tel" value={primary} onChange={setPrimary} error={errors.primary} />
      {more.map((phone, i) => (
        <div key={i} className="gp-e-range-row">
          <TextField
            id={`${id}-more${i}`}
            label={`Other phone ${i + 1}`}
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(v) => setMore((all) => all.map((p, j) => (j === i ? v : p)))}
            error={errors[`more${i}`]}
          />
          <button type="button" className="gp-e-icon-btn gp-e-icon-btn-low" onClick={() => setMore((all) => all.filter((_, j) => j !== i))} aria-label={`Remove other phone ${i + 1}`}>
            <FiTrash2 size={18} aria-hidden="true" />
          </button>
        </div>
      ))}
      {more.length < PROFILE_LIMITS.additional_phones && (
        <div className="gp-btns">
          <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={() => setMore((all) => [...all, ""])}>
            <FiPlus size={16} aria-hidden="true" />
            Add a phone number
          </button>
        </div>
      )}
      <TextField
        id={`${id}-website`}
        label="Website"
        type="url"
        inputMode="url"
        placeholder="https://"
        value={website}
        onChange={setWebsite}
        error={errors.website}
      />
    </SectionFrame>
  );
}

export function NameForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("name", onSaved);
  const [name, setName] = useState(data.profile.title || "");
  const [error, setError] = useState("");
  const submit = (confirmed) => {
    if (!name.trim()) {
      setError("Enter the business name.");
      return;
    }
    setError("");
    s.save({ title: name.trim(), confirm_risk: confirmed });
  };
  return (
    <SectionFrame section="name" title={title} onSubmit={submit} onCancel={onCancel} busy={s.busy} error={s.error}>
      <TextField id={`${id}-name`} label="Business name" value={name} onChange={setName} maxLength={100} error={error} required hint="Use your real business name, as customers know it." />
    </SectionFrame>
  );
}

const ADDRESS_FIELDS = [
  ["line1", "Street address", true],
  ["line2", "Area or landmark", false],
  ["line3", "Address line 3", false],
  ["locality", "City", true],
  ["administrative_area", "State", true],
  ["postal_code", "PIN code", true],
];

export function AddressForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("address", onSaved);
  const a = data.profile.address;
  const [v, setV] = useState({
    line1: a?.address_lines?.[0] || "",
    line2: a?.address_lines?.[1] || "",
    line3: a?.address_lines?.[2] || "",
    locality: a?.locality || "",
    administrative_area: a?.administrative_area || "",
    postal_code: a?.postal_code || "",
  });
  const [errors, setErrors] = useState({});
  const submit = (confirmed) => {
    const found = {};
    ADDRESS_FIELDS.forEach(([key, , required]) => {
      if (required && !v[key].trim()) found[key] = "This is needed.";
    });
    if (v.postal_code.trim().length > 12) found.postal_code = "Too long.";
    setErrors(found);
    if (Object.keys(found).length) return;
    s.save({
      region_code: /^[A-Z]{2}$/.test(a?.region_code || "") ? a.region_code : "IN",
      address_lines: [v.line1, v.line2, v.line3].map((x) => x.trim()).filter(Boolean),
      locality: v.locality.trim(),
      administrative_area: v.administrative_area.trim(),
      postal_code: v.postal_code.trim(),
      confirm_risk: confirmed,
    });
  };
  return (
    <SectionFrame section="address" title={title} onSubmit={submit} onCancel={onCancel} busy={s.busy} error={s.error}>
      <div className="gp-e-grid2">
        {ADDRESS_FIELDS.map(([key, label, required]) => (
          <TextField
            key={key}
            id={`${id}-${key}`}
            label={label}
            value={v[key]}
            onChange={(value) => setV((all) => ({ ...all, [key]: value }))}
            maxLength={key === "postal_code" ? 12 : 80}
            autoComplete={key === "postal_code" ? "postal-code" : undefined}
            required={required}
            error={errors[key]}
          />
        ))}
      </div>
    </SectionFrame>
  );
}

// ── Open status ─────────────────────────────────────────────────────────────

const OPEN_STATUSES = [
  ["OPEN", "Open"],
  ["CLOSED_TEMPORARILY", "Temporarily closed"],
  ["CLOSED_PERMANENTLY", "Permanently closed"],
];

export function OpenStatusForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("open_status", onSaved);
  const known = OPEN_STATUSES.some(([value]) => value === data.profile.open_status?.status);
  const [status, setStatus] = useState(known ? data.profile.open_status.status : "OPEN");
  const [date, setDate] = useState(data.profile.open_status?.opening_date || "");
  return (
    <SectionFrame
      section="open_status"
      title={title}
      risk={
        status === "CLOSED_PERMANENTLY"
          ? { title: "A permanently closed business is hidden from most Google searches.", label: "I understand. Mark the business as permanently closed on Google." }
          : null
      }
      onSubmit={(confirmed) => s.save({ status, opening_date: date || null, confirm_risk: confirmed })}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
    >
      <fieldset className="gp-fieldset">
        <legend className="gp-e-label">Is the business open?</legend>
        {OPEN_STATUSES.map(([value, label]) => (
          <label key={value} className={`gp-choice-item${status === value ? " is-checked" : ""}`}>
            <input type="radio" name={`${id}-status`} value={value} checked={status === value} onChange={() => setStatus(value)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="gp-e-range-row">
        <label className="gp-e-field" htmlFor={`${id}-date`}>
          <span className="gp-e-label">Opening date (optional)</span>
          <input id={`${id}-date`} type="date" className="gp-input" value={date} onChange={(e) => setDate(e.target.value)} aria-describedby={`${id}-date-hint`} />
          <span className="gp-note" id={`${id}-date-hint`}>
            When the business opened or will open.
          </span>
        </label>
        {date && (
          <button type="button" className="gp-e-icon-btn" onClick={() => setDate("")} aria-label="Clear the opening date">
            <FiX size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </SectionFrame>
  );
}

// ── Services and attributes ─────────────────────────────────────────────────

export function ServicesForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("services", onSaved);
  const services = data.growthos_services || [];
  const [chosen, setChosen] = useState(() => new Set(services.filter((x) => x.on_google).map((x) => x.id)));
  const toggle = (serviceId, on) =>
    setChosen((current) => {
      const next = new Set(current);
      if (on) next.add(serviceId);
      else next.delete(serviceId);
      return next;
    });
  const onGoogle = data.profile.services_on_google || [];
  return (
    <SectionFrame
      section="services"
      title={title}
      intro="Choose the services to show on Google. Services added on Google with other names are kept."
      onSubmit={() => s.save({ service_ids: services.filter((x) => chosen.has(x.id)).map((x) => x.id) })}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
      canSave={services.length > 0}
    >
      <fieldset className="gp-fieldset">
        <legend className="gp-e-label">Your services</legend>
        {services.length === 0 ? (
          <p className="gp-note">No services to choose from yet.</p>
        ) : (
          services.map((x) => (
            <label key={x.id} className={`gp-choice-item${chosen.has(x.id) ? " is-checked" : ""}`} htmlFor={`${id}-${x.id}`}>
              <input id={`${id}-${x.id}`} type="checkbox" checked={chosen.has(x.id)} onChange={(e) => toggle(x.id, e.target.checked)} />
              <span className="gp-e-grow">
                {x.name}
                <small>{typeof x.price === "number" ? formatMoney(x.price, data.currency) : "No fixed price"}</small>
              </span>
            </label>
          ))
        )}
      </fieldset>
      <div className="gp-e-stack-sm">
        <p className="gp-e-label">On Google now</p>
        {onGoogle.length === 0 ? (
          <p className="gp-note">No services on Google yet.</p>
        ) : (
          <ul className="gp-list">
            {onGoogle.map((x, i) => (
              <li key={`${x.label}-${i}`}>
                {x.label}
                {typeof x.price === "number" ? ` · ${formatMoney(x.price, x.currency || data.currency)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionFrame>
  );
}

const sameValues = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

function AttributeInput({ meta, value, onChange, error }) {
  const id = useId();
  const errorId = error ? `${id}-error` : undefined;
  const errorLine = error && (
    <span className="gp-e-error" id={errorId}>
      {error}
    </span>
  );
  if (meta.value_type === "BOOL" || meta.value_type === "ENUM") {
    const current = meta.value_type === "BOOL" ? (value[0] === true ? "yes" : value[0] === false ? "no" : "") : typeof value[0] === "string" ? value[0] : "";
    const choices = meta.value_type === "BOOL" ? [["yes", "Yes"], ["no", "No"]] : meta.choices.map((c) => [c.value, c.display_name]);
    return (
      <div className="gp-e-field">
        <label className="gp-e-label" htmlFor={id}>
          {meta.display_name}
        </label>
        <select
          id={id}
          className="gp-input"
          value={current}
          aria-describedby={errorId}
          onChange={(e) => {
            const v = e.target.value;
            if (meta.value_type === "BOOL") onChange(v === "yes" ? [true] : v === "no" ? [false] : []);
            else onChange(v ? [v] : []);
          }}
        >
          <option value="">Not set</option>
          {choices.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        {errorLine}
      </div>
    );
  }
  if (meta.value_type === "URL") {
    return (
      <div className="gp-e-field">
        <label className="gp-e-label" htmlFor={id}>
          {meta.display_name}
        </label>
        <input
          id={id}
          className="gp-input"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={typeof value[0] === "string" ? value[0] : ""}
          onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
        />
        {errorLine}
      </div>
    );
  }
  return (
    <fieldset className="gp-fieldset">
      <legend className="gp-e-label">{meta.display_name}</legend>
      <div className="gp-e-checks">
        {meta.choices.map((c) => (
          <label key={c.value} className="gp-e-check" htmlFor={`${id}-${c.value}`}>
            <input
              id={`${id}-${c.value}`}
              type="checkbox"
              checked={value.includes(c.value)}
              onChange={(e) => onChange(e.target.checked ? [...value, c.value] : value.filter((x) => x !== c.value))}
            />
            {c.display_name}
          </label>
        ))}
      </div>
      {errorLine}
    </fieldset>
  );
}

export function AttributesForm({ data, title, onSaved, onCancel }) {
  const s = useSectionSave("attributes", onSaved);
  const meta = data.attributes?.meta || [];
  const [initial] = useState(() =>
    Object.fromEntries(meta.map((m) => [m.name, data.attributes.values.find((v) => v.name === m.name)?.values || []])),
  );
  const [values, setValues] = useState(initial);
  const [urlErrors, setUrlErrors] = useState({});
  const groups = [...new Set(meta.map((m) => m.group || ""))].sort((a, b) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b)));
  // Only what was changed or set (Google can't clear a yes / no or single choice, so those stay as they are).
  const changed = meta.filter((m) => {
    const v = values[m.name] || [];
    if (sameValues(v, initial[m.name] || [])) return false;
    return m.value_type === "REPEATED_ENUM" || m.value_type === "URL" || v.length > 0;
  });
  const submit = () => {
    const bad = {};
    changed.forEach((m) => {
      if (m.value_type === "URL" && !(values[m.name] || []).every((u) => typeof u === "string" && isHttpUrl(u))) {
        bad[m.name] = "Enter a web address starting with https://";
      }
    });
    setUrlErrors(bad);
    if (Object.keys(bad).length) return;
    s.save({ values: changed.map((m) => ({ name: m.name, values: (values[m.name] || []).map((x) => (typeof x === "string" ? x.trim() : x)) })) });
  };
  return (
    <SectionFrame
      section="attributes"
      title={title}
      intro="Google offers these for your category. Only what you change is saved."
      onSubmit={submit}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
      canSave={changed.length > 0}
    >
      {groups.map((group) => (
        <div key={group || "other"} className="gp-e-stack">
          <p className="gp-eyebrow">{group || "Other"}</p>
          {meta
            .filter((m) => (m.group || "") === group)
            .map((m) => (
              <AttributeInput
                key={m.name}
                meta={m}
                value={values[m.name] || []}
                onChange={(v) => setValues((all) => ({ ...all, [m.name]: v }))}
                error={urlErrors[m.name]}
              />
            ))}
        </div>
      ))}
      {changed.length === 0 && <p className="gp-note">Change an answer to save.</p>}
    </SectionFrame>
  );
}

// ── Categories and service area (searched on Google) ────────────────────────

export function CategoriesForm({ data, title, onSaved, onCancel }) {
  const s = useSectionSave("categories", onSaved);
  const [primary, setPrimary] = useState(data.profile.primary_category || null);
  const [additional, setAdditional] = useState(data.profile.additional_categories || []);
  const [problem, setProblem] = useState("");
  const region = /^[A-Z]{2}$/.test(data.profile.address?.region_code || "") ? data.profile.address.region_code : "IN";
  const full = additional.length >= PROFILE_LIMITS.additional_categories;
  const chosen = (name) => primary?.name === name || additional.some((c) => c.name === name);

  const submit = (confirmed) => {
    if (!primary) {
      setProblem("Choose a main category: search below and press Make main.");
      return;
    }
    setProblem("");
    s.save({ primary: primary.name, additional: additional.map((c) => c.name).filter((n) => n !== primary.name), confirm_risk: confirmed });
  };

  return (
    <SectionFrame section="categories" title={title} onSubmit={submit} onCancel={onCancel} busy={s.busy} error={s.error} problems={problem}>
      <div className="gp-e-stack-sm">
        <p className="gp-e-label">Main category</p>
        <p>{primary ? primary.display_name : <span className="gp-muted">No main category yet. Search and choose one.</span>}</p>
      </div>
      <div className="gp-e-stack-sm">
        <p className="gp-e-label">Other categories</p>
        {additional.length === 0 ? (
          <p className="gp-note">No other categories.</p>
        ) : (
          <ul className="gp-e-tags">
            {additional.map((c) => (
              <li key={c.name} className="gp-e-tag">
                {c.display_name}
                <button type="button" className="gp-e-tag-x" onClick={() => setAdditional((all) => all.filter((x) => x.name !== c.name))} aria-label={`Remove ${c.display_name}`}>
                  <FiX size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="gp-note">Up to {PROFILE_LIMITS.additional_categories} other categories.</p>
      </div>
      <ProfileSearch
        label="Search Google's categories"
        search={(q) => gpManageApi.categories(q, region)}
        itemKey={(c) => c.name}
        itemTitle={(c) => c.display_name}
        emptyText="No matching categories."
        renderActions={(c) =>
          chosen(c.name) ? (
            <span className="gp-chip gp-chip-ok">Chosen</span>
          ) : (
            <>
              <button
                type="button"
                className="gp-btn gp-btn-ghost gp-e-btn-sm"
                onClick={() => {
                  setPrimary(c);
                  setAdditional((all) => all.filter((x) => x.name !== c.name));
                }}
              >
                Make main<span className="visually-hidden">: {c.display_name}</span>
              </button>
              <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" disabled={full} onClick={() => setAdditional((all) => [...all, c])}>
                Add<span className="visually-hidden">: {c.display_name}</span>
              </button>
            </>
          )
        }
      />
    </SectionFrame>
  );
}

const BUSINESS_TYPES = [
  ["CUSTOMER_AND_BUSINESS_LOCATION", "At your business and at customers' places"],
  ["CUSTOMER_LOCATION_ONLY", "Only at customers' places (your address is hidden)"],
];

export function ServiceAreaForm({ data, title, onSaved, onCancel }) {
  const id = useId();
  const s = useSectionSave("service_area", onSaved);
  const area = data.profile.service_area;
  const known = BUSINESS_TYPES.some(([value]) => value === area?.business_type);
  const [type, setType] = useState(known ? area.business_type : "CUSTOMER_AND_BUSINESS_LOCATION");
  const [places, setPlaces] = useState(area?.places || []);
  const full = places.length >= PROFILE_LIMITS.places;
  return (
    <SectionFrame
      section="service_area"
      title={title}
      onSubmit={(confirmed) => s.save({ business_type: type, places: places.map((p) => ({ place_id: p.place_id, name: p.name })), confirm_risk: confirmed })}
      onCancel={onCancel}
      busy={s.busy}
      error={s.error}
    >
      <fieldset className="gp-fieldset">
        <legend className="gp-e-label">Where you serve customers</legend>
        {BUSINESS_TYPES.map(([value, label]) => (
          <label key={value} className={`gp-choice-item${type === value ? " is-checked" : ""}`}>
            <input type="radio" name={`${id}-type`} value={value} checked={type === value} onChange={() => setType(value)} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <div className="gp-e-stack-sm">
        <p className="gp-e-label">Service areas</p>
        {places.length === 0 ? (
          <p className="gp-note">No service areas yet.</p>
        ) : (
          <ul className="gp-e-tags">
            {places.map((p) => (
              <li key={p.place_id} className="gp-e-tag">
                {p.name}
                <button type="button" className="gp-e-tag-x" onClick={() => setPlaces((all) => all.filter((x) => x.place_id !== p.place_id))} aria-label={`Remove ${p.name}`}>
                  <FiX size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="gp-note">Up to {PROFILE_LIMITS.places} areas.</p>
      </div>
      <ProfileSearch
        label="Search for a city or area"
        search={(q) => gpManageApi.places(q)}
        disabled={full}
        itemKey={(p) => p.place_id}
        itemTitle={(p) => p.name}
        itemSub={(p) => p.address || ""}
        emptyText="No matching places."
        renderActions={(p) =>
          places.some((x) => x.place_id === p.place_id) ? (
            <span className="gp-chip gp-chip-ok">Added</span>
          ) : (
            <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={() => setPlaces((all) => [...all, { place_id: p.place_id, name: p.name }])}>
              Add<span className="visually-hidden">: {p.name}</span>
            </button>
          )
        }
      />
    </SectionFrame>
  );
}
