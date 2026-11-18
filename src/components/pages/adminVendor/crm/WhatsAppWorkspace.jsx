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
  { key: "templates", label: "Templates" },
  { key: "campaigns", label: "Broadcasts" },
  { key: "contacts", label: "Contacts" },
  { key: "history", label: "Sent" },
];

const STATUS_TONE = {
  completed: "crm-badge crm-tone-green",
  sending: "crm-badge crm-tone-blue",
  scheduled: "crm-badge crm-tone-amber",
  approved: "crm-badge crm-tone-green",
  pending: "crm-badge crm-tone-amber",
  rejected: "crm-badge crm-tone-red",
  sent: "crm-badge crm-tone-green",
  failed: "crm-badge crm-tone-red",
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

      {!templates.length ? (
        <p className="crm-muted">No templates on this account yet.</p>
      ) : (
        <div className="crm-table-wrap"><table className="crm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Language</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={`${t.name}-${t.language}-${t.status}`}>
                <td className="crm-strong">{t.name}</td>
                <td>{t.language || "—"}</td>
                <td>{t.category || "—"}</td>
                <td>
                  <span className={STATUS_TONE[t.status] || "crm-badge"}>{t.status}</span>
                  {t.status === "pending" ? (
                    <div className="crm-muted crm-small">
                      Waiting on Meta
                      {t.submittedBy ? ` · submitted by ${t.submittedBy}` : ""}
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
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
                {templates.length
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
                These are the same for everyone who receives it. A template with someone's name
                in it would greet every client by that one name, so keep personal details out
                of a broadcast.
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
                <td className="crm-strong">{c.name || "—"}</td>
                <td>
                  <span className={STATUS_TONE[c.status] || "crm-badge"}>{c.status}</span>
                </td>
                <td>{c.recipients ?? "—"}</td>
                <td>{when(c.scheduledAt || c.sentAt)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
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
        Everything sent from HappyWedz. Replies from clients are not shown — WhatsApp messages
        sent to you do not reach us.
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

      {tab === "templates" ? (
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
