import React, { useCallback, useEffect, useState } from "react";
import { crmApi, errorMessage } from "./crmApi";
import { Spinner } from "./crmUi";

/**
 * WhatsApp, beyond sending a document.
 *
 * Three things Wapzio's API supports and the dashboard did not expose:
 * message templates, the contact list, and the record of what has been sent.
 *
 * There is no fourth tab for a client's replies. Wapzio publishes fifteen
 * endpoints and not one of them reads an incoming message — there is no inbox
 * call and no webhook — so an inbox cannot be shown honestly. Pretending
 * otherwise with an empty screen would be worse than its absence.
 */

const TABS = [
  { key: "chats", label: "Chats" },
  { key: "templates", label: "Templates" },
  { key: "campaigns", label: "Broadcasts" },
  { key: "contacts", label: "Contacts" },
  { key: "history", label: "Sent" },
];

const STATUS_TONE = {
  completed: "crm-badge crm-tone-green",
  draft: "crm-badge crm-tone-grey",
  queued: "crm-badge crm-tone-blue",
  processing: "crm-badge crm-tone-blue",
  paused: "crm-badge crm-tone-amber",
  cancelled: "crm-badge crm-tone-grey",
  sending: "crm-badge crm-tone-blue",
  scheduled: "crm-badge crm-tone-amber",
  approved: "crm-badge crm-tone-green",
  pending: "crm-badge crm-tone-amber",
  rejected: "crm-badge crm-tone-red",
  sent: "crm-badge crm-tone-green",
  failed: "crm-badge crm-tone-red",
};

/**
 * Meta's language codes in the words a vendor uses. Only the ones the account
 * actually has; anything else keeps its code, which is better than guessing
 * at a name.
 */
/** The filters over a template list, in the order Wapzio shows them. */
const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending" },
  { key: "rejected", label: "Rejected" },
];

const LANGUAGE_NAMES = {
  en: "English",
  en_US: "English",
  en_GB: "English",
  hi: "Hindi",
  mr: "Marathi",
  gu: "Gujarati",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  bn: "Bengali",
  pa: "Punjabi",
};

const languageName = (code) => LANGUAGE_NAMES[code] || LANGUAGE_NAMES[String(code).split("_")[0]] || code;

/** 7:48 pm — the time alone, because the day is a divider above it. */
const timeOf = (v) =>
  v ? new Date(v).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : "";

/** 18 Nov — the divider itself. */
const dayOf = (v) =>
  v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";

/** In a narrow list column: the time today, the date before that. */
const shortWhen = (v) => {
  if (!v) return "";
  const at = new Date(v);
  const today = new Date().toDateString() === at.toDateString();
  return today ? timeOf(at) : dayOf(at);
};

const when = (v) =>
  v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

/** Meta's three categories, in the words a vendor would use. */
/**
 * The buttons a template may carry.
 *
 * Meta allows at most three, and a quotation with "Confirm" and "Call us" on
 * it is worth more than one with a link to tap.
 */
const BUTTON_TYPES = [
  { id: "quick_reply", label: "Quick reply", hint: "The client taps it and the text comes back to you" },
  { id: "website", label: "Open a link", hint: "Needs the web address" },
  { id: "phone_call", label: "Call us", hint: "Needs the number to ring" },
  { id: "copy_code", label: "Copy a code", hint: "For a discount code" },
];

const CATEGORIES = [
  { id: "UTILITY", label: "Utility", hint: "Order updates, reminders, receipts" },
  { id: "MARKETING", label: "Marketing", hint: "Offers, announcements, anything promotional" },
  { id: "AUTHENTICATION", label: "Authentication", hint: "One-time passcodes" },
];

/* ─── Templates ─────────────────────────────────────────────────────────── */

const TemplateForm = ({ waba, onDone, onCancel }) => {
  const [form, setForm] = useState({
    templateName: "",
    wabaId: waba[0]?.id || "",
    category: "UTILITY",
    language: "en_US",
    body: "",
    footerText: "",
  });
  const [examples, setExamples] = useState({});
  const [buttons, setButtons] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Meta refuses a template whose variables carry no sample value, so the
  // form asks for one the moment a {{1}} appears rather than letting the
  // vendor find out by email hours later.
  const used = [...new Set((form.body.match(/\{\{\s*\d+\s*\}\}/g) || []).map((m) => m.replace(/\D/g, "")))];

  // Clears the previous failure: a banner that stays up while the vendor is
  // editing reads as though the new attempt failed too.
  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setError("");
  };

  /**
   * The same rules the server applies, checked here first.
   *
   * Without this a name with a space went all the way to the server, and the
   * only hint was a line of static help text nobody reads until after.
   */
  const problem = (() => {
    const name = form.templateName.trim();
    if (!name) return "Give the template a name.";
    if (!/^[a-z0-9_]+$/.test(name.toLowerCase())) {
      return "A name may use only lowercase letters, numbers and underscores — no spaces or hyphens.";
    }
    if (!form.wabaId.trim()) return "Enter the WhatsApp Business Account ID.";
    if (form.category !== "AUTHENTICATION" && !form.body.trim()) return "Write the message.";
    const blank = used.find((k) => !(examples[k] || "").trim());
    if (blank) return `Give a sample value for {{${blank}}} — Meta rejects a template without one.`;
    return "";
  })();

  const submit = async (e) => {
    e.preventDefault();
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await crmApi.createWhatsappTemplate({
        ...form,
        variableExamples: used.map((key) => ({ key, example: examples[key] || "" })),
        // Incomplete rows are dropped here rather than sent for Meta to
        // refuse: a link button with no link is not a button.
        buttons: buttons.filter(
          (b) =>
            b.text.trim() &&
            (b.type === "quick_reply" ||
              b.type === "copy_code" ||
              (b.type === "website" && b.url.trim()) ||
              (b.type === "phone_call" && b.phoneNumber.trim()))
        ),
      });
      onDone(result.message);
    } catch (err) {
      setError(errorMessage(err, "Could not submit this template."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="crm-card crm-card-pad" onSubmit={submit}>
      <div className="crm-card-title">New template</div>
      <div className="crm-hint">
        Meta has to approve every template before it can be sent — usually a few hours. It
        cannot be used until it comes back approved.
      </div>

      {error ? <div className="crm-error">{error}</div> : null}

      <div className="crm-grid-2">
        <div className="crm-field">
          <label className="crm-label">Name</label>
          <input
            className="crm-input"
            value={form.templateName}
            // Meta names are lowercase, and the server lowercases before
            // submitting - so a vendor typing My_Template would have got a
            // template called my_template with nothing to say so. Lowercasing
            // here makes the field show exactly what will be created.
            onChange={(e) => set({ templateName: e.target.value.toLowerCase() })}
            placeholder="booking_confirmed"
            required
          />
          <div className="crm-hint">
            Lowercase letters, numbers and underscores. Capitals are converted as you type.
          </div>
        </div>

        <div className="crm-field">
          <label className="crm-label">Language</label>
          <select
            className="crm-input"
            value={form.language}
            onChange={(e) => set({ language: e.target.value })}
          >
            <option value="en_US">English (US)</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="mr">Marathi</option>
          </select>
        </div>
      </div>

      <div className="crm-field">
        <label className="crm-label">Category</label>
        <select
          className="crm-input"
          value={form.category}
          onChange={(e) => set({ category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <div className="crm-hint">{CATEGORIES.find((c) => c.id === form.category)?.hint}</div>
      </div>

      {waba.length ? (
        waba.length > 1 ? (
          <div className="crm-field">
            <label className="crm-label">WhatsApp Business Account</label>
            <select
              className="crm-input"
              value={form.wabaId}
              onChange={(e) => set({ wabaId: e.target.value })}
            >
              {waba.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name || a.id}
                </option>
              ))}
            </select>
          </div>
        ) : null
      ) : (
        <div className="crm-field">
          <label className="crm-label">WhatsApp Business Account ID</label>
          <input
            className="crm-input"
            value={form.wabaId}
            onChange={(e) => set({ wabaId: e.target.value })}
            placeholder="1248119146671221"
            required
          />
          <div className="crm-hint">
            We could not read this from your account. It is the long number shown against your
            WhatsApp Business Account in your provider's dashboard.
          </div>
        </div>
      )}

      {form.category !== "AUTHENTICATION" ? (
        <>
          <div className="crm-field">
            <label className="crm-label">Message</label>
            <textarea
              className="crm-input"
              rows={4}
              value={form.body}
              onChange={(e) => set({ body: e.target.value })}
              placeholder="Hi {{1}}, your booking for {{2}} is confirmed."
            />
            <div className="crm-hint">
              Use {"{{1}}"}, {"{{2}}"} for anything that changes from one message to the next.
            </div>
          </div>

          {used.length ? (
            <div className="crm-card crm-card-pad">
              <div className="crm-section-label">Sample values</div>
              <div className="crm-hint">
                Meta rejects a template without these. They are only examples for the reviewer.
              </div>
              <div className="crm-grid-2">
                {used.map((key) => (
                  <div className="crm-field" key={key}>
                    <label className="crm-label">{`{{${key}}}`}</label>
                    <input
                      className="crm-input"
                      value={examples[key] || ""}
                      onChange={(e) => setExamples((x) => ({ ...x, [key]: e.target.value }))}
                      placeholder={key === "1" ? "Rahul" : "Sangeet, 12 Feb"}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="crm-field">
            <label className="crm-label">Buttons (optional)</label>
            <div className="crm-hint">
              Up to three. A quotation with "Confirm" on it gets a reply more often than one
              with only a link.
            </div>

            {buttons.map((b, i) => (
              <div className="crm-card crm-card-pad" key={i}>
                <div className="crm-grid-2">
                  <div className="crm-field">
                    <label className="crm-label">Type</label>
                    <select
                      className="crm-input"
                      value={b.type}
                      onChange={(e) =>
                        setButtons((list) =>
                          list.map((x, n) => (n === i ? { ...x, type: e.target.value } : x))
                        )
                      }
                    >
                      {BUTTON_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <div className="crm-hint">
                      {BUTTON_TYPES.find((t) => t.id === b.type)?.hint}
                    </div>
                  </div>

                  <div className="crm-field">
                    <label className="crm-label">Button text</label>
                    <input
                      className="crm-input"
                      value={b.text}
                      onChange={(e) =>
                        setButtons((list) =>
                          list.map((x, n) => (n === i ? { ...x, text: e.target.value } : x))
                        )
                      }
                      placeholder={b.type === "quick_reply" ? "Confirm" : "View quote"}
                      maxLength={25}
                    />
                  </div>
                </div>

                {b.type === "website" ? (
                  <div className="crm-field">
                    <label className="crm-label">Web address</label>
                    <input
                      className="crm-input"
                      value={b.url}
                      onChange={(e) =>
                        setButtons((list) =>
                          list.map((x, n) => (n === i ? { ...x, url: e.target.value } : x))
                        )
                      }
                      placeholder="https://happywedz.com"
                    />
                  </div>
                ) : null}

                {b.type === "phone_call" ? (
                  <div className="crm-field">
                    <label className="crm-label">Number to ring</label>
                    <input
                      className="crm-input"
                      value={b.phoneNumber}
                      onChange={(e) =>
                        setButtons((list) =>
                          list.map((x, n) => (n === i ? { ...x, phoneNumber: e.target.value } : x))
                        )
                      }
                      placeholder="+917770005377"
                    />
                  </div>
                ) : null}

                <div className="crm-actions">
                  <button
                    type="button"
                    className="crm-btn crm-btn-sm"
                    onClick={() => setButtons((list) => list.filter((_, n) => n !== i))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {buttons.length < 3 ? (
              <button
                type="button"
                className="crm-btn crm-btn-sm"
                onClick={() =>
                  setButtons((list) => [...list, { type: "quick_reply", text: "", url: "", phoneNumber: "" }])
                }
              >
                Add a button
              </button>
            ) : (
              <div className="crm-hint">Three is the most WhatsApp allows.</div>
            )}
          </div>

          <div className="crm-field">
            <label className="crm-label">Footer (optional)</label>
            <input
              className="crm-input"
              value={form.footerText}
              onChange={(e) => set({ footerText: e.target.value })}
              placeholder="Thank you"
            />
            <div className="crm-hint">Small grey line under the message.</div>
          </div>
        </>
      ) : (
        <div className="crm-notice crm-notice-info">
          An authentication template carries no message of its own — the passcode is filled in
          when it is sent.
        </div>
      )}

      {problem && form.templateName ? (
        <p className="crm-hint">{problem}</p>
      ) : null}

      <div className="crm-actions">
        <button type="button" className="crm-btn" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button
          type="submit"
          className="crm-btn crm-btn-primary"
          disabled={saving || Boolean(problem)}
          title={problem || ""}
        >
          {saving ? "Submitting…" : "Submit for approval"}
        </button>
      </div>
    </form>
  );
};

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [waba, setWaba] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, accounts] = await Promise.all([
        crmApi.whatsappTemplates(),
        // Only needed to file a new template; a failure here must not hide
        // the templates the vendor already has.
        crmApi.whatsappWaba().catch(() => ({ accounts: [] })),
      ]);
      setTemplates(list.templates || []);
      setWaba(accounts.accounts || []);
    } catch (err) {
      setError(errorMessage(err, "Could not read your templates."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = templates.reduce(
    (acc, t) => ({ ...acc, all: templates.length, [t.status]: (acc[t.status] || 0) + 1 }),
    { all: templates.length }
  );
  const shown = filter === "all" ? templates : templates.filter((t) => t.status === filter);

  if (loading) return <Spinner />;

  return (
    <>
      {error ? <div className="crm-error">{error}</div> : null}
      {notice ? <div className="crm-notice crm-notice-info">{notice}</div> : null}

      {!waba.length && templates.length ? (
        <div className="crm-notice crm-notice-warn">
          We could not read your WhatsApp Business Account automatically, though your
          templates load fine. You can still create a template — you will be asked for the
          account ID, which you will find in your WhatsApp provider's dashboard.
        </div>
      ) : null}

      {creating ? (
        <TemplateForm
          waba={waba}
          onCancel={() => setCreating(false)}
          onDone={(message) => {
            setCreating(false);
            setNotice(message);
            load();
          }}
        />
      ) : (
        <div className="crm-actions">
          <button className="crm-btn crm-btn-primary" onClick={() => setCreating(true)}>
            New template
          </button>
        </div>
      )}

      {templates.length > 6 ? (
        <div className="crm-tabs">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`crm-tab ${filter === f.key ? "is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label} ({counts[f.key] || 0})
            </button>
          ))}
        </div>
      ) : null}

      {!templates.length ? (
        <p className="crm-muted">No templates on this account yet.</p>
      ) : !shown.length ? (
        <p className="crm-muted">Nothing {filter === "all" ? "here" : `is ${filter}`} right now.</p>
      ) : (
        <div className="crm-tpl-grid">
          {shown.map((t) => (
            <div className="crm-tpl-card" key={`${t.name}-${t.language}-${t.status}`}>
              <div className="crm-tpl-head">
                <span className="crm-tpl-name" title={t.name}>
                  {t.name}
                </span>
                <span className={STATUS_TONE[t.status] || "crm-badge"}>{t.status}</span>
              </div>

              {/* The wording, where we have it. Wapzio's list returns none, so
                  this is filled only for templates submitted from here. */}
              {t.body ? (
                <p className="crm-tpl-body">{t.body}</p>
              ) : (
                <p className="crm-tpl-body is-missing">
                  Made outside HappyWedz, so we cannot show the wording.
                </p>
              )}

              {t.status === "pending" ? (
                <div className="crm-tpl-note">
                  Waiting on Meta
                  {t.submittedBy ? ` · submitted by ${t.submittedBy}` : ""}
                </div>
              ) : null}

              <div className="crm-tpl-foot">
                <span className="crm-chip">{(t.category || "—").toLowerCase()}</span>
                <span className="crm-tpl-lang">{languageName(t.language) || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ─── Broadcasts ────────────────────────────────────────────────────────── */

/**
 * One approved template to many clients at once.
 *
 * Two things the screen has to be honest about. Variables are set once for
 * the whole campaign, so a template with a name in it would greet everybody
 * by the same name — the form says so beside the fields. And a broadcast
 * cannot be recalled, so the number of people it will reach is shown before
 * the button, not after.
 */
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [audience, setAudience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [composing, setComposing] = useState(false);
  // Something is still going out, so the numbers need to keep moving.
  const working = campaigns.some((c) => ["queued", "sending"].includes(c.status));

  const [form, setForm] = useState({ name: "", templateName: "", audience: "all", scheduledAt: "" });
  const [variables, setVariables] = useState({});
  const [sending, setSending] = useState(false);

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setError("");
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, temps] = await Promise.all([
        crmApi.whatsappCampaigns().catch(() => ({ campaigns: [] })),
        crmApi.whatsappTemplates(),
      ]);
      setCampaigns(list.campaigns || []);
      // Only an approved template can be broadcast, so the rest are not
      // offered — choosing one that cannot send is a wasted journey.
      setTemplates((temps.templates || []).filter((t) => t.status === "approved"));
    } catch (err) {
      setError(errorMessage(err, "Could not load your campaigns."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * While something is going out, keep the counts moving.
   *
   * A broadcast is sent one message at a time, so "3 of 180" is a number that
   * changes while a vendor watches it. Refreshing quietly, without the
   * spinner, so the table does not blink every few seconds.
   */
  useEffect(() => {
    if (!working) return undefined;
    const timer = setInterval(() => {
      crmApi
        .whatsappCampaigns()
        .then((r) => setCampaigns(r.campaigns || []))
        .catch(() => {});
    }, 4000);
    return () => clearInterval(timer);
  }, [working]);

  // Recount every time the audience changes, so the number beside the button
  // is always the number that will actually be messaged.
  useEffect(() => {
    let cancelled = false;
    crmApi
      .whatsappAudience({ audience: form.audience })
      .then((r) => !cancelled && setAudience(r))
      .catch(() => !cancelled && setAudience(null));
    return () => {
      cancelled = true;
    };
  }, [form.audience]);

  const chosen = templates.find((t) => t.name === form.templateName);
  const chosenLanguages = form.templateName
    ? [
        ...new Set(
          templates.filter((t) => t.name === form.templateName).map((t) => t.language).filter(Boolean)
        ),
      ]
    : [];
  const reach = audience?.reachable ?? 0;

  const problem = (() => {
    if (!form.name.trim()) return "Give this campaign a name";
    if (!form.templateName) return "Choose a template";
    if (!reach) {
      return audience?.total
        ? "Nobody here has a number WhatsApp can reach"
        : "Nobody in this group yet";
    }
    if (audience?.max && reach > audience.max) {
      return `Too many at once — ${audience.max} is the limit`;
    }
    if (form.scheduledAt) {
      const at = new Date(form.scheduledAt);
      if (Number.isNaN(at.getTime())) return "That is not a valid date and time";
      // Matches the server's rule, so the refusal arrives while the vendor is
      // still looking at the field rather than after a round trip.
      if (at.getTime() < Date.now() + 60 * 1000) return "Pick a time at least a minute from now";
    }
    const needed = chosen?.variableCount || 0;
    const missing = Array.from({ length: needed }, (_, i) => String(i + 1)).find(
      (n) => !(variables[n] || "").trim()
    );
    if (missing) return `Fill in {{${missing}}}`;
    return "";
  })();

  const send = async (e) => {
    e.preventDefault();
    if (problem) {
      setError(problem);
      return;
    }
    setSending(true);
    setError("");
    try {
      const result = await crmApi.startWhatsappCampaign({
        ...form,
        // toISOString carries the timezone; the raw field value does not.
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        variables,
      });
      setNotice(result.message);
      setComposing(false);
      setForm({ name: "", templateName: "", audience: "all", scheduledAt: "" });
      setVariables({});
      load();
    } catch (err) {
      setError(errorMessage(err, "Could not start this campaign."));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      {error ? <div className="crm-error">{error}</div> : null}
      {notice ? <div className="crm-notice crm-notice-info">{notice}</div> : null}

      {composing ? (
        <form className="crm-card crm-card-pad" onSubmit={send}>
          <div className="crm-card-title">New broadcast</div>
          <div className="crm-hint">
            Goes to many clients at once and cannot be recalled. Only approved templates can
            be used.
          </div>

          <div className="crm-grid-2">
            <div className="crm-field">
              <label className="crm-label">Campaign name</label>
              <input
                className="crm-input"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Diwali offer"
                required
              />
              <div className="crm-hint">Only you see this.</div>
            </div>

            <div className="crm-field">
              <label className="crm-label">Template</label>
              <select
                className="crm-input"
                value={form.templateName}
                onChange={(e) => set({ templateName: e.target.value })}
              >
                <option value="">Choose a template</option>
                {/* One entry per name: Wapzio's campaign API takes a template
                    name and no language, so listing the same name twice gave
                    two options that could not be told apart and snapped back
                    to the first. */}
                {[...new Map(templates.map((t) => [t.name, t])).values()].map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="crm-hint">
                {chosenLanguages.length > 1
                  ? `This one is approved in ${chosenLanguages.map(languageName).join(" and ")}. A broadcast is sent by name only, so Wapzio picks which goes out.`
                  : templates.length
                    ? "Only approved templates are listed."
                    : "You have no approved templates yet."}
              </div>
            </div>
          </div>

          <div className="crm-grid-2">
            <div className="crm-field">
              <label className="crm-label">Send to</label>
              <select
                className="crm-input"
                value={form.audience}
                onChange={(e) => set({ audience: e.target.value })}
              >
                {(audience?.options || []).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="crm-hint">
                {!audience
                  ? "Counting…"
                  : audience.total === 0
                    ? "Nobody in this group yet"
                    : `${reach} of ${audience.total} in this group will be messaged` +
                      (audience.unreachable?.length
                        ? ` · ${audience.unreachable.length} have no usable number`
                        : "")}
              </div>
            </div>

            <div className="crm-field">
              <label className="crm-label">Send later (optional)</label>
              <input
                className="crm-input"
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => set({ scheduledAt: e.target.value })}
              />
              <div className="crm-hint">Leave empty to send now.</div>
            </div>
          </div>

          {chosen ? (
            <div className="crm-card crm-card-pad">
              <div className="crm-section-label">Values for this campaign</div>
              <div className="crm-hint">
                Write <strong>{"{name}"}</strong> and each client sees their own name. Anything
                else is the same for everyone, so keep other personal details out of a broadcast.
              </div>

              {/* The message itself, where we have it. Three blank boxes
                  labelled {{1}} {{2}} {{3}} told a vendor nothing about what
                  any of them stood for. */}
              {chosen.body ? (
                <p className="crm-note">{chosen.body}</p>
              ) : (
                <div className="crm-hint">
                  This template was made outside HappyWedz, so we cannot show its wording or
                  how many values it takes. Fill in the ones it uses and leave the rest blank.
                </div>
              )}

              <div className="crm-grid-2">
                {(chosen.variableCount
                  ? Array.from({ length: chosen.variableCount }, (_, i) => i + 1)
                  : [1, 2, 3]
                ).map((n) => (
                  <div className="crm-field" key={n}>
                    <label className="crm-label">{`{{${n}}}`}</label>
                    <input
                      className="crm-input"
                      value={variables[n] || ""}
                      onChange={(e) => setVariables((v) => ({ ...v, [n]: e.target.value }))}
                      placeholder={n === 1 ? "Diwali" : n === 2 ? "20%" : ""}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {audience?.unreachable?.length ? (
            <div className="crm-notice crm-notice-warn">
              {audience.unreachable.length} will be skipped for want of a usable number:{" "}
              {audience.unreachable.slice(0, 5).map((c) => c.name).join(", ")}
              {audience.unreachable.length > 5 ? " and others" : ""}.
            </div>
          ) : null}

          {problem && form.name ? <p className="crm-hint">{problem}</p> : null}

          <div className="crm-actions">
            <button type="button" className="crm-btn" onClick={() => setComposing(false)} disabled={sending}>
              Cancel
            </button>
            <button
              type="submit"
              className="crm-btn crm-btn-primary"
              disabled={sending || Boolean(problem)}
              title={problem || ""}
            >
              {sending
                ? "Starting…"
                : problem
                  ? problem
                  : form.scheduledAt
                    ? `Schedule for ${reach}`
                    : `Send to ${reach} now`}
            </button>
          </div>
        </form>
      ) : (
        <div className="crm-actions">
          <button className="crm-btn crm-btn-primary" onClick={() => setComposing(true)}>
            New broadcast
          </button>
        </div>
      )}

      {!campaigns.length ? (
        <p className="crm-muted">No broadcasts yet.</p>
      ) : (
        <div className="crm-table-wrap"><table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Recipients</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id || c.name}>
                <td className="crm-strong">
                  {c.name || "—"}
                  {c.source === "wapzio" ? <div className="crm-muted crm-small">made in Wapzio</div> : null}
                </td>
                <td>
                  <span className={STATUS_TONE[c.status] || "crm-badge"}>{c.status}</span>
                  {c.error ? <div className="crm-muted crm-small">{c.error}</div> : null}
                </td>
                <td>
                  {c.source === "happywedz" ? (
                    <>
                      {c.sent}
                      {c.recipients ? ` of ${c.recipients}` : ""}
                      {c.failed ? <div className="crm-muted crm-small">{c.failed} failed</div> : null}
                    </>
                  ) : (
                    (c.recipients ?? "—")
                  )}
                </td>
                <td>{when(c.scheduledAt || c.sentAt || c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </>
  );
};

/* ─── Chats ─────────────────────────────────────────────────────────────── */

/**
 * What clients have said, beside what was sent them.
 *
 * Until the webhook existed this screen could not: a client's reply went to
 * Wapzio and nowhere else, so HappyWedz only ever had its own half of a
 * conversation. The list is every thread newest first; opening one marks
 * what is in it as read.
 *
 * The 24-hour window is shown as a fact rather than left to be discovered.
 * WhatsApp refuses free text to a client who has not written for a day, and
 * finding that out by having a message bounce is a poor way to learn it.
 */
const windowLine = (w) => {
  if (!w) return null;
  if (!w.closesAt) return "They have never written to you, so only a template can be sent.";
  const closes = new Date(w.closesAt);
  if (!w.open) return "More than 24 hours since they wrote, so only a template can be sent.";
  return `You can write freely until ${closes.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  })}.`;
};

/** A tick for each thing WhatsApp tells us about a message we sent. */
const TICK = {
  queued: "· sending",
  sent: "✓ sent",
  delivered: "✓✓ delivered",
  read: "✓✓ read",
  failed: "✕ failed",
};

const Chats = () => {
  const [threads, setThreads] = useState([]);
  const [openKey, setOpenKey] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = useCallback(async (quiet = false) => {
    try {
      const data = await crmApi.whatsappConversations();
      setThreads(data.conversations || []);
    } catch (err) {
      if (!quiet) setError(errorMessage(err, "Could not read your conversations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Messages arrive by webhook, not by anything done on this screen, so the
  // list has to look for itself. Quietly: a failed poll must not throw an
  // error across a conversation the vendor is reading.
  useEffect(() => {
    const timer = setInterval(() => load(true), 20000);
    return () => clearInterval(timer);
  }, [load]);

  const open = useCallback(
    async (key) => {
      setOpenKey(key);
      setThread(null);
      try {
        const data = await crmApi.whatsappConversation(key);
        setThread(data.conversation);
        // Only what was in it when it was opened. Anything arriving while it
        // is open stays unread until it has actually been looked at.
        await crmApi.whatsappConversationSeen(key).catch(() => {});
        load(true);
      } catch (err) {
        setError(errorMessage(err, "Could not open this conversation."));
      }
    },
    [load]
  );

  // Keep the open conversation moving too, or a reply arriving mid-read
  // would not show until it was closed and opened again.
  useEffect(() => {
    if (!openKey) return undefined;
    const timer = setInterval(() => {
      crmApi
        .whatsappConversation(openKey)
        .then((d) => setThread(d.conversation))
        .catch(() => {});
    }, 15000);
    return () => clearInterval(timer);
  }, [openKey]);

  // The first conversation opens itself, so the screen is never an empty
  // panel beside a list.
  useEffect(() => {
    if (!openKey && threads.length) open(threads[0].key);
  }, [threads, openKey, open]);

  if (loading) return <Spinner />;

  const term = search.trim().toLowerCase();
  const shown = threads.filter((t) => {
    if (unreadOnly && !t.unread) return false;
    if (!term) return true;
    return `${t.name || ""} ${t.number || ""}`.toLowerCase().includes(term);
  });
  const unreadTotal = threads.reduce((n, t) => n + t.unread, 0);

  if (!threads.length) {
    return (
      <>
        {error ? <div className="crm-error">{error}</div> : null}
        <p className="crm-muted">
          No conversations yet. They appear here as soon as a client writes to your WhatsApp
          number. If you have been getting replies in Wapzio and nothing shows here, check
          Settings → Integrations, under Replies and delivery reports.
        </p>
      </>
    );
  }

  return (
    <>
      {error ? <div className="crm-error">{error}</div> : null}

      <div className="crm-inbox">
        <div className="crm-inbox-list">
          <input
            className="crm-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number"
          />
          <div className="crm-tabs crm-tabs-sm">
            <button
              className={`crm-tab ${!unreadOnly ? "is-active" : ""}`}
              onClick={() => setUnreadOnly(false)}
            >
              All
            </button>
            <button
              className={`crm-tab ${unreadOnly ? "is-active" : ""}`}
              onClick={() => setUnreadOnly(true)}
            >
              Unread {unreadTotal ? `(${unreadTotal})` : ""}
            </button>
          </div>

          {!shown.length ? (
            <p className="crm-muted crm-small">Nothing matches.</p>
          ) : (
            shown.map((t) => (
              <button
                key={t.key}
                className={`crm-inbox-row ${openKey === t.key ? "is-open" : ""}`}
                onClick={() => open(t.key)}
              >
                <span className="crm-inbox-avatar">
                  {(t.name || t.number || "?").trim().charAt(0).toUpperCase()}
                </span>
                <span className="crm-inbox-who">
                  <span className="crm-inbox-name">{t.name || t.number}</span>
                  <span className="crm-inbox-last">
                    {t.lastDirection === "out" ? "You: " : ""}
                    {t.lastMessage}
                  </span>
                </span>
                <span className="crm-inbox-meta">
                  <span className="crm-inbox-when">{shortWhen(t.lastAt)}</span>
                  {t.unread ? <span className="crm-inbox-unread">{t.unread}</span> : null}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="crm-inbox-thread">
          {!thread ? (
            <Spinner />
          ) : (
            <>
              <div className="crm-inbox-head">
                <span className="crm-inbox-avatar">
                  {(thread.name || thread.number || "?").trim().charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="crm-inbox-name">{thread.name || thread.number}</span>
                  <span className="crm-inbox-last">{thread.number}</span>
                </span>
                {!thread.clientId ? <span className="crm-chip">not a client yet</span> : null}
              </div>

              <div className="crm-chat">
                {!thread.messages.length ? (
                  <p className="crm-muted">Nothing here yet.</p>
                ) : (
                  thread.messages.map((m, i) => (
                    <React.Fragment key={m.id}>
                      {dayOf(m.at) !== dayOf(thread.messages[i - 1]?.at) ? (
                        <div className="crm-chat-day">{dayOf(m.at)}</div>
                      ) : null}
                      <div className={`crm-bubble ${m.direction === "in" ? "is-them" : "is-us"}`}>
                        {m.body ? <div className="crm-bubble-text">{m.body}</div> : null}
                        {m.mediaUrl ? (
                          <a className="crm-bubble-file" href={m.mediaUrl} target="_blank" rel="noreferrer">
                            📎 {m.mediaType || "Attachment"}
                          </a>
                        ) : null}
                        {!m.body && !m.mediaUrl ? (
                          <div className="crm-bubble-text crm-muted">
                            {m.template ? `Template: ${m.template}` : m.kind}
                          </div>
                        ) : null}
                        <div className="crm-bubble-foot">
                          {timeOf(m.at)}
                          {m.direction === "out" ? ` ${TICK[m.status] || m.status}` : ""}
                          {m.direction === "out" && m.actorName ? ` · ${m.actorName}` : ""}
                        </div>
                        {m.error ? <div className="crm-bubble-foot crm-danger">{m.error}</div> : null}
                      </div>
                    </React.Fragment>
                  ))
                )}
              </div>

              <div className="crm-inbox-foot">
                <div className="crm-hint">{windowLine(thread.window)}</div>
                {thread.clientId ? (
                  <a className="crm-btn crm-btn-primary" href={`?client=${thread.clientId}`}>
                    Open client to reply
                  </a>
                ) : (
                  <div className="crm-hint">
                    Add this number as a client to reply to them from HappyWedz.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ─── Contacts ──────────────────────────────────────────────────────────── */

const Contacts = () => {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    crmApi
      .whatsappContacts({ page, limit: 25, search: debounced })
      .then((r) => {
        if (cancelled) return;
        setRows(r.contacts || []);
        setPagination(r.pagination || null);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, "Could not read your contacts."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, debounced]);

  return (
    <>
      <div className="crm-hint">
        These are the contacts held in your WhatsApp account. Anyone you message is added
        automatically.
      </div>

      <input
        className="crm-input crm-search"
        placeholder="Search by name or number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error ? <div className="crm-error">{error}</div> : null}

      {loading ? (
        <Spinner />
      ) : !rows.length ? (
        <p className="crm-muted">No contacts found.</p>
      ) : (
        <>
          <div className="crm-table-wrap"><table className="crm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.phone}>
                  <td>{c.name || "—"}</td>
                  <td className="crm-strong">{c.phone}</td>
                  <td>{c.status || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table></div>

          {pagination && pagination.pages > 1 ? (
            <div className="crm-pager">
              <span className="crm-muted crm-small">
                Page {pagination.page} of {pagination.pages} · {pagination.total} contacts
              </span>
              <span className="crm-actions">
                <button className="crm-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <button
                  className="crm-btn"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </span>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

/* ─── History ───────────────────────────────────────────────────────────── */

const KIND_LABEL = {
  quotation: "Quotation",
  invoice: "Invoice",
  receipt: "Receipt",
  reply: "Message",
};

const History = () => {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    crmApi
      .whatsappHistory({ page, limit: 25, ...(status ? { status } : {}) })
      .then((r) => {
        if (cancelled) return;
        setRows(r.messages || []);
        setMeta(r);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, "Could not read your WhatsApp history."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, status]);

  return (
    <>
      <div className="crm-hint">
        Messages you sent to one client at a time. Broadcasts are not listed
        here — they are campaigns, and they live on the Broadcasts tab. Replies from clients
        are not shown either: WhatsApp messages sent to you do not reach us.
      </div>

      <div className="crm-tabs">
        {["", "sent", "failed"].map((s) => (
          <button
            key={s || "all"}
            className={`crm-tab ${status === s ? "is-active" : ""}`}
            onClick={() => {
              setStatus(s);
              setPage(1);
            }}
          >
            {s === "" ? "All" : s === "sent" ? "Delivered to WhatsApp" : "Failed"}
          </button>
        ))}
      </div>

      {error ? <div className="crm-error">{error}</div> : null}

      {loading ? (
        <Spinner />
      ) : !rows.length ? (
        <p className="crm-muted">
          {status === "failed"
            ? "Nothing has failed."
            : status === "sent"
              ? "Nothing delivered yet."
              : "Nothing sent yet."}
        </p>
      ) : (
        <>
          <div className="crm-table-wrap"><table className="crm-table">
            <thead>
              <tr>
                <th>When</th>
                <th>What</th>
                <th>To</th>
                <th>Sent by</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id}>
                  <td>{when(m.at)}</td>
                  <td>
                    {KIND_LABEL[m.kind] || m.kind}
                    {m.template ? <div className="crm-muted crm-small">{m.template}</div> : null}
                  </td>
                  <td>
                    {m.client ? (
                      <>
                        <div>{m.client}</div>
                        <div className="crm-muted crm-small">{m.to}</div>
                      </>
                    ) : (
                      <span className="crm-strong">{m.to}</span>
                    )}
                  </td>
                  <td>{m.sentBy || "—"}</td>
                  <td>
                    <span className={STATUS_TONE[m.status] || "crm-badge"}>{m.status}</span>
                    {m.error ? <div className="crm-muted crm-small">{m.error}</div> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>

          {meta && meta.totalPages > 1 ? (
            <div className="crm-pager">
              <span className="crm-muted crm-small">
                Page {meta.page} of {meta.totalPages} · {meta.total} messages
              </span>
              <span className="crm-actions">
                <button className="crm-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <button
                  className="crm-btn"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </span>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

/* ─── The shell ─────────────────────────────────────────────────────────── */

const WhatsAppWorkspace = ({ onBack }) => {
  const [tab, setTab] = useState("templates");

  return (
    <div className="crm-card crm-card-pad">
      <div className="crm-head">
        <h3 className="crm-title">WhatsApp</h3>
        {onBack ? (
          <button className="crm-btn" onClick={onBack}>
            Back
          </button>
        ) : null}
      </div>

      <div className="crm-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`crm-tab ${tab === t.key ? "is-active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "chats" ? (
        <Chats />
      ) : tab === "templates" ? (
        <Templates />
      ) : tab === "campaigns" ? (
        <Campaigns />
      ) : tab === "contacts" ? (
        <Contacts />
      ) : (
        <History />
      )}
    </div>
  );
};

export default WhatsAppWorkspace;
