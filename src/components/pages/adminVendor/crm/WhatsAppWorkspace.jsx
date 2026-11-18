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
  { key: "contacts", label: "Contacts" },
  { key: "history", label: "Sent" },
];

const STATUS_TONE = {
  approved: "crm-badge crm-tone-green",
  pending: "crm-badge crm-tone-amber",
  rejected: "crm-badge crm-tone-red",
  sent: "crm-badge crm-tone-green",
  failed: "crm-badge crm-tone-red",
};

const when = (v) =>
  v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

/** Meta's three categories, in the words a vendor would use. */
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

      {tab === "templates" ? <Templates /> : tab === "contacts" ? <Contacts /> : <History />}
    </div>
  );
};

export default WhatsAppWorkspace;
