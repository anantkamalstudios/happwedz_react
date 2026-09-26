import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { ArrowLeft, FileText, Mail, MapPin, Paperclip, Pencil, Phone, Plus, Trash2, UserRound, X } from "lucide-react";
import { crmApi, errorMessage, openFile, pdfPaths } from "./crmApi";
import {
  CLIENT_STATUSES,
  INVOICE_STATE_LABELS,
  LEAD_SOURCES,
  PAYMENT_METHODS,
  QUOTATION_STATUS_LABELS,
  formatDate,
  labelOf,
  rupees,
  todayIso,
  whatsappLink,
  whatsappText,
} from "./crmFormat";
import { Badge, Spinner } from "./crmUi";
import ClientFormModal from "./ClientFormModal";
import QuotationEditor from "./QuotationEditor";
import InvoiceModal from "./InvoiceModal";
import PaymentModal from "./PaymentModal";
import { ActivityCard, FollowUpBar, WhatsAppIcon } from "./ClientExtras";
import { useToast } from "../../../layouts/toasts/Toast";
import { resolveMediaUrl } from "../../../../config/constants";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "quotations", label: "Quotations" },
  { id: "invoices", label: "Invoices" },
  { id: "payments", label: "Payments" },
];

// Small yes/no dialog with an optional text box.
const ConfirmModal = ({ title, text, confirmLabel, danger, input, onConfirm, onClose }) => {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal show onHide={onClose} centered className="crm-modal">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ margin: 0 }}>{text}</p>
        {input && (
          <div className="crm-field" style={{ marginTop: 14, marginBottom: 0 }}>
            <label className="crm-label">{input}</label>
            <input className="crm-input" value={value} onChange={(e) => setValue(e.target.value)} maxLength={500} autoFocus />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="crm-btn" onClick={onClose} disabled={busy}>Cancel</button>
        <button
          className={`crm-btn ${danger ? "crm-btn-danger" : "crm-btn-primary"}`}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const done = await onConfirm(value);
            if (!done) setBusy(false);
          }}
        >
          {busy ? "Please wait…" : confirmLabel}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

// Send a quotation: email it and/or copy the link.
const SendQuotationModal = ({ quotation, client, seller, onClose, onSent }) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState(client.email || "");
  const [sendEmail, setSendEmail] = useState(!!client.email);
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState("");

  const send = async () => {
    setBusy(true);
    try {
      const result = await crmApi.sendQuotation(quotation.id, { email: email.trim() || undefined, sendEmail: sendEmail && !!email.trim() });
      setLink(result.link);
      addToast(result.message, "success");
      onSent();
    } catch (err) {
      addToast(errorMessage(err, "Could not send the quotation."), "error");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      addToast("Link copied.", "success");
    } catch {
      addToast("Copy the link from the box.", "error");
    }
  };

  return (
    <Modal show onHide={onClose} centered className="crm-modal">
      <Modal.Header closeButton>
        <Modal.Title>Send quotation {quotation.number}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!link ? (
          <>
            <p className="crm-muted" style={{ marginTop: 0 }}>
              Your client gets a link where they can view the quotation, download the PDF and accept it. You'll get an email when they answer.
            </p>
            <label className="crm-check" style={{ marginBottom: 10 }}>
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
              Email it with the PDF attached
            </label>
            {sendEmail && (
              <div className="crm-field">
                <label className="crm-label">Client email</label>
                <input className="crm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            )}
          </>
        ) : (
          <>
            <p style={{ marginTop: 0 }}>Share this link with your client, for example on WhatsApp:</p>
            <div className="crm-link-box">
              <input className="crm-input" readOnly value={link} onFocus={(e) => e.target.select()} />
              <button className="crm-btn crm-btn-primary" onClick={copy}>Copy</button>
            </div>
            <a
              className="crm-btn crm-btn-wa"
              style={{ marginTop: 12 }}
              href={whatsappLink(client.phone, whatsappText.quotation({ client, seller, quotation }))}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon /> Share on WhatsApp
            </a>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!link ? (
          <>
            <button className="crm-btn" onClick={onClose} disabled={busy}>Cancel</button>
            <button className="crm-btn crm-btn-primary" onClick={send} disabled={busy || (sendEmail && !email.trim())}>
              {busy ? "Sending…" : sendEmail ? "Send" : "Get link"}
            </button>
          </>
        ) : (
          <button className="crm-btn" onClick={onClose}>Done</button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

const ClientDetail = ({ clientId, onBack, onOpenBusiness }) => {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  // The people this client can be handed to. A staff member gets none, and the
  // picker is simply not drawn for them.
  const [owners, setOwners] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");
  const [modal, setModal] = useState(null); // { type, ...props }
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    let alive = true;
    crmApi
      .owners()
      .then((result) => alive && setOwners(result.owners || []))
      .catch(() => alive && setOwners([]));
    return () => {
      alive = false;
    };
  }, []);

  const assign = async (ownerId) => {
    setAssigning(true);
    try {
      const result = await crmApi.setClientOwner(clientId, ownerId ? Number(ownerId) : null);
      addToast(result.message, "success");
      await load();
    } catch (err) {
      addToast(errorMessage(err, "Could not change who this client belongs to."), "error");
    } finally {
      setAssigning(false);
    }
  };

  const [waConnected, setWaConnected] = useState(false);
  const [waSending, setWaSending] = useState(null);

  const load = useCallback(async () => {
    try {
      setData(await crmApi.client(clientId));
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Could not load this client."));
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  // Whether this vendor has connected WhatsApp decides what the WhatsApp
  // buttons below do. Asked once per page; if the question fails we assume
  // not connected, which falls back to the link that has always worked.
  useEffect(() => {
    let cancelled = false;
    crmApi
      .whatsapp()
      .then((res) => !cancelled && setWaConnected(Boolean(res?.whatsapp?.connected)))
      .catch(() => !cancelled && setWaConnected(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const close = () => setModal(null);
  const closeAndReload = (message) => {
    setModal(null);
    if (message) addToast(message, "success");
    load();
  };

  const open = async (path) => {
    try {
      await openFile(path);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  const run = (action, fallback) => async (...args) => {
    try {
      const result = await action(...args);
      closeAndReload(result?.message);
      return true;
    } catch (err) {
      addToast(errorMessage(err, fallback), "error");
      return false;
    }
  };

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    const tooBig = files.find((f) => f.size > 10 * 1024 * 1024);
    if (tooBig) return addToast(`${tooBig.name} is larger than 10 MB.`, "error");
    setUploading(true);
    try {
      await crmApi.uploadFiles(clientId, files.slice(0, 10));
      addToast(files.length > 10 ? "Uploaded the first 10 files." : "Uploaded.", "success");
      load();
    } catch (err) {
      addToast(errorMessage(err, "Upload failed."), "error");
    } finally {
      setUploading(false);
    }
  };

  if (error) {
    return (
      <>
        <button className="crm-back" onClick={onBack}><ArrowLeft size={15} /> All clients</button>
        <div className="crm-card crm-empty">
          <h3>{error}</h3>
          <button className="crm-btn" onClick={load}>Try again</button>
        </div>
      </>
    );
  }
  if (!data) return <Spinner />;

  const { client, events, quotations, invoices, payments, files, money, profile, due, lastReminder, activity, owner } = data;
  const seller = profile?.legalName || "us";

  // Open WhatsApp with a message ready to send. The tab is opened before any
  // await so the browser doesn't treat it as a popup.
  const shareOnWhatsApp = async (makeText, prepare) => {
    const tab = window.open("", "_blank");
    try {
      if (prepare) await prepare();
      const url = whatsappLink(client.phone, makeText());
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      if (tab) tab.close();
      addToast(errorMessage(err, "Could not prepare the message."), "error");
    }
  };
  // A WhatsApp button. When the vendor has connected their provider we send
  // the message ourselves and say so; when they haven't, this is exactly the
  // wa.me link it has always been, so nobody loses a button they had.
  const whatsappAction = (kind, doc, makeText, prepare) => {
    if (!waConnected) return () => shareOnWhatsApp(makeText, prepare);
    const send = { quotation: crmApi.whatsappQuotation, invoice: crmApi.whatsappInvoice, receipt: crmApi.whatsappReceipt }[kind];
    return async () => {
      const busyKey = `${kind}:${doc.id}`;
      setWaSending(busyKey);
      try {
        const result = await send(doc.id);
        addToast(result.message || "Sent on WhatsApp.", "success");
        load();
      } catch (err) {
        addToast(errorMessage(err, "Could not send it on WhatsApp."), "error");
      } finally {
        setWaSending(null);
      }
    };
  };
  const waBusy = (kind, doc) => waSending === `${kind}:${doc.id}`;
  const waTitle = waConnected ? "Send on WhatsApp" : "Share on WhatsApp";

  const liveInvoices = invoices.filter((i) => i.status !== "cancelled");
  const counts = { quotations: quotations.length, invoices: invoices.length, payments: payments.length };

  const finalNote = { invoice: "from invoices", quotation: "accepted quotation", events: "sum of event prices" }[money.finalSource];

  return (
    <>
      <button className="crm-back" onClick={onBack}><ArrowLeft size={15} /> All clients</button>

      <div className="crm-client-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 className="crm-title">{client.name}</h1>
            <Badge status={client.status}>{labelOf(CLIENT_STATUSES, client.status)}</Badge>
          </div>
          <div className="crm-client-meta">
            {client.phone && <span><Phone size={13} /> <a href={`tel:${client.phone}`}>{client.phone}</a></span>}
            {client.email && <span><Mail size={13} /> <a href={`mailto:${client.email}`}>{client.email}</a></span>}
            {(client.location || client.state) && <span><MapPin size={13} /> {[client.location, client.state].filter(Boolean).join(", ")}</span>}
            <span>Source: {labelOf(LEAD_SOURCES, client.leadSource)}</span>
            {owners.length > 0 && (
              <span>
                <UserRound size={13} />{" "}
                <label>
                  <span className="crm-sr-only">Who this client belongs to</span>
                  <select
                    className="crm-inline-select"
                    value={client.ownerId || ""}
                    disabled={assigning}
                    onChange={(e) => assign(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>{o.isMe ? `${o.name} (me)` : o.name}</option>
                    ))}
                  </select>
                </label>
              </span>
            )}
            {owners.length === 0 && owner && <span><UserRound size={13} /> {owner.name}</span>}
          </div>
        </div>
        <div className="crm-actions">
          {client.phone && (
            <a className="crm-btn crm-btn-wa" href={whatsappLink(client.phone)} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> WhatsApp
            </a>
          )}
          <button className="crm-btn" onClick={() => setModal({ type: "edit" })}><Pencil size={14} /> Edit</button>
          <button className="crm-btn" onClick={() => setModal({ type: "quotation" })}><FileText size={14} /> New quotation</button>
          <button className="crm-btn crm-btn-primary" onClick={() => setModal({ type: "payment" })}><Plus size={15} /> Record payment</button>
        </div>
      </div>

      <div className="crm-card crm-money">
        <div>
          <div className="crm-stat-label">Final amount</div>
          <div className="crm-stat-value">{rupees(money.finalPaise)}</div>
          <div className="crm-stat-note">{finalNote}</div>
        </div>
        <div>
          <div className="crm-stat-label">Advance received</div>
          <div className="crm-stat-value">{rupees(money.advancePaise)}</div>
          <div className="crm-stat-note">&nbsp;</div>
        </div>
        <div>
          <div className="crm-stat-label">Total received</div>
          <div className="crm-stat-value is-good">{rupees(money.receivedPaise)}</div>
          <div className="crm-stat-note">{payments.length} payment{payments.length === 1 ? "" : "s"}</div>
        </div>
        <div>
          <div className="crm-stat-label">Net balance</div>
          <div className={`crm-stat-value ${money.isPending ? "is-pending" : money.finalPaise ? "is-good" : ""}`}>
            {money.balancePaise < 0 ? `${rupees(-money.balancePaise)} extra` : rupees(money.balancePaise)}
          </div>
          <div className="crm-stat-note">
            {money.isPending
              ? due
                ? `${due.date < todayIso() ? "Overdue since" : "Due"} ${formatDate(due.date)}`
                : "Payment pending"
              : money.finalPaise
                ? "Fully paid"
                : "No amount yet"}
          </div>
        </div>
        {money.isPending && (
          <div className="crm-remind">
            <span className="crm-muted">
              {lastReminder
                ? `Last reminder emailed ${formatDate(lastReminder.createdAt)}.`
                : profile?.autoReminders && client.remindersEnabled && client.email && due
                  ? "Automatic email reminders are on for this client."
                  : "Remind the client about the pending balance."}
            </span>
            <span className="crm-actions">
              <button
                className="crm-btn crm-btn-sm"
                disabled={!client.email}
                title={client.email ? "" : "Add the client's email to send email reminders"}
                onClick={() =>
                  setModal({
                    type: "confirm",
                    title: "Email a payment reminder?",
                    text: `${client.email} will get a reminder for ${rupees(money.balancePaise)}${due ? ` (due ${formatDate(due.date)})` : ""}, with your bank and UPI details${due?.invoiceToken ? " and a link to the invoice" : ""}.`,
                    confirmLabel: "Send reminder",
                    onConfirm: run(() => crmApi.sendReminder(client.id), "Could not send the reminder."),
                  })
                }
              >
                <Mail size={13} /> Email reminder
              </button>
              <button
                className="crm-btn crm-btn-sm crm-btn-wa"
                onClick={() =>
                  shareOnWhatsApp(() => whatsappText.reminder({ client, seller, due, amountPaise: money.balancePaise, upiId: profile?.upiId }))
                }
              >
                <WhatsAppIcon size={13} /> WhatsApp reminder
              </button>
            </span>
          </div>
        )}
      </div>

      <FollowUpBar key={`${client.followUpDate}-${client.followUpNote}`} client={client} onSaved={load} />

      <div className="crm-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`crm-tab ${tab === t.id ? "is-active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
            {counts[t.id] ? <span className="crm-tab-count">{counts[t.id]}</span> : null}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="crm-cols">
          <div style={{ display: "grid", gap: 16 }}>
            <div className="crm-card">
              <div className="crm-card-pad" style={{ paddingBottom: 0 }}>
                <div className="crm-card-title">
                  <span>Events</span>
                  <button className="crm-btn crm-btn-sm" onClick={() => setModal({ type: "edit" })}>Edit events</button>
                </div>
              </div>
              {events.length ? (
                <div className="crm-table-wrap">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th className="crm-num">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td className="crm-strong">{event.name}</td>
                          <td>{event.eventDate ? formatDate(event.eventDate) : <span className="crm-muted">—</span>}</td>
                          <td>{event.venue || <span className="crm-muted">—</span>}</td>
                          <td className="crm-num">{rupees(event.pricePaise)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={3} className="crm-strong">Total</td>
                        <td className="crm-num crm-strong">{rupees(money.eventsTotalPaise)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="crm-empty" style={{ padding: 24 }}>No events yet.</div>
              )}
            </div>

            <div className="crm-card crm-card-pad">
              <div className="crm-card-title">Details</div>
              <dl className="crm-dl">
                <dt>Description</dt>
                <dd>{client.description || <span className="crm-muted">—</span>}</dd>
                <dt>Additional note</dt>
                <dd>{client.additionalNote || <span className="crm-muted">—</span>}</dd>
                <dt>Additional information</dt>
                <dd>{client.additionalInfo || <span className="crm-muted">—</span>}</dd>
                <dt>Balance due by</dt>
                <dd>{client.paymentDueDate ? formatDate(client.paymentDueDate) : <span className="crm-muted">—</span>}</dd>
                <dt>Pending payment note</dt>
                <dd>{client.pendingNote || <span className="crm-muted">—</span>}</dd>
                {client.enquiryId && (
                  <>
                    <dt>From enquiry</dt>
                    <dd>HappyWedz enquiry #{client.enquiryId}</dd>
                  </>
                )}
                <dt>Added</dt>
                <dd>{formatDate(client.createdAt)}</dd>
              </dl>
            </div>
          </div>

          <div style={{ display: "grid", gap: 16 }}>
          <div className="crm-card crm-card-pad">
            <div className="crm-card-title">
              <span>Photos &amp; documents</span>
              <button className="crm-btn crm-btn-sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
                <Paperclip size={13} /> {uploading ? "Uploading…" : "Upload"}
              </button>
              <input ref={fileInput} type="file" multiple accept="image/*,application/pdf" hidden onChange={uploadFiles} />
            </div>
            {files.length ? (
              <div className="crm-files">
                {files.map((file) => (
                  <div className="crm-file" key={file.id}>
                    <a href={resolveMediaUrl(file.url)} target="_blank" rel="noreferrer" title={file.name || ""}>
                      {file.kind === "photo" ? (
                        <img src={resolveMediaUrl(file.url)} alt={file.name || "Photo"} loading="lazy" />
                      ) : (
                        <>
                          <FileText size={22} />
                          <span style={{ wordBreak: "break-all" }}>{(file.name || "Document").slice(0, 40)}</span>
                        </>
                      )}
                    </a>
                    <button
                      className="crm-file-remove"
                      aria-label="Remove file"
                      onClick={() =>
                        setModal({
                          type: "confirm",
                          title: "Remove this file?",
                          text: file.name || "This file will be removed from the client.",
                          confirmLabel: "Remove",
                          danger: true,
                          onConfirm: run(() => crmApi.deleteFile(file.id), "Could not remove the file."),
                        })
                      }
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="crm-muted crm-small">Keep photos, signed contracts and other documents for this client here. Images or PDF, up to 10 MB each.</div>
            )}
          </div>
          <ActivityCard clientId={client.id} activity={activity || []} onChanged={load} />
          </div>
        </div>
      )}

      {tab === "quotations" && (
        <div className="crm-card">
          <div className="crm-doc-row">
            <div className="crm-muted">Custom quotations for this client. Send them by email or link; the client can accept online.</div>
            <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={() => setModal({ type: "quotation" })}>
              <Plus size={14} /> New quotation
            </button>
          </div>
          {quotations.length === 0 && <div className="crm-empty" style={{ padding: 28 }}>No quotations yet.</div>}
          {quotations.map((q) => {
            const status = q.isExpired ? "expired" : q.status;
            return (
              <div className="crm-doc-row" key={q.id}>
                <div className="crm-doc-main">
                  <div className="crm-doc-title">
                    {q.number}
                    <Badge status={status}>{QUOTATION_STATUS_LABELS[status]}</Badge>
                  </div>
                  <div className="crm-muted crm-small">
                    {formatDate(q.issueDate)}
                    {q.validUntil ? ` · valid until ${formatDate(q.validUntil)}` : ""} · {q.items.length} item{q.items.length === 1 ? "" : "s"}
                  </div>
                </div>
                <div className="crm-actions">
                  <span className="crm-strong" style={{ marginRight: 6 }}>{rupees(q.totalPaise)}</span>
                  <button className="crm-btn crm-btn-sm" onClick={() => open(pdfPaths.quotation(q.id))}>PDF</button>
                  <button
                    className="crm-btn crm-btn-sm crm-btn-wa"
                    aria-label={waTitle}
                    title={waTitle}
                    disabled={waBusy("quotation", q)}
                    onClick={whatsappAction(
                      "quotation",
                      q,
                      () => whatsappText.quotation({ client, seller, quotation: q }),
                      q.status === "draft" || q.status === "rejected"
                        ? async () => {
                            await crmApi.sendQuotation(q.id, { sendEmail: false });
                            load();
                          }
                        : null,
                    )}
                  >
                    <WhatsAppIcon size={13} />
                  </button>
                  {q.status !== "accepted" && (
                    <button className="crm-btn crm-btn-sm" onClick={() => setModal({ type: "quotation", quotation: q })}>Edit</button>
                  )}
                  {q.status !== "accepted" && (
                    <button className="crm-btn crm-btn-sm" onClick={() => setModal({ type: "send", quotation: q })}>
                      {q.status === "draft" ? "Send" : "Send again"}
                    </button>
                  )}
                  {q.status === "sent" && (
                    <button
                      className="crm-btn crm-btn-sm"
                      onClick={() =>
                        setModal({
                          type: "confirm",
                          title: `Mark ${q.number} as accepted?`,
                          text: "Use this when the client agreed outside HappyWedz, for example on a call. The client will be marked as booked.",
                          confirmLabel: "Mark accepted",
                          onConfirm: run(() => crmApi.setQuotationStatus(q.id, "accepted"), "Could not update the quotation."),
                        })
                      }
                    >
                      Mark accepted
                    </button>
                  )}
                  {q.status === "accepted" && (
                    <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={() => setModal({ type: "invoice", quotationId: q.id })}>
                      Create invoice
                    </button>
                  )}
                  {q.status !== "accepted" && (
                    <button
                      className="crm-btn crm-btn-sm crm-btn-danger"
                      aria-label="Delete quotation"
                      onClick={() =>
                        setModal({
                          type: "confirm",
                          title: `Delete ${q.number}?`,
                          text: q.status === "sent" ? "The client's link will stop working." : "This can't be undone.",
                          confirmLabel: "Delete",
                          danger: true,
                          onConfirm: run(() => crmApi.deleteQuotation(q.id), "Could not delete the quotation."),
                        })
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "invoices" && (
        <div className="crm-card">
          <div className="crm-doc-row">
            <div className="crm-muted">
              {profile?.gstin ? `GST invoices from ${profile.gstin}.` : "Invoices without GST."}{" "}
              <button className="crm-link" onClick={onOpenBusiness}>Business details</button>
            </div>
            <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={() => setModal({ type: "invoice" })}>
              <Plus size={14} /> New invoice
            </button>
          </div>
          {invoices.length === 0 && <div className="crm-empty" style={{ padding: 28 }}>No invoices yet.</div>}
          {invoices.map((inv) => (
            <div className="crm-doc-row" key={inv.id} style={inv.status === "cancelled" ? { opacity: 0.6 } : undefined}>
              <div className="crm-doc-main">
                <div className="crm-doc-title">
                  {inv.number}
                  <Badge status={inv.paymentState === "cancelled" ? "cancelled" : inv.paymentState}>{INVOICE_STATE_LABELS[inv.paymentState]}</Badge>
                  {inv.taxMode !== "none" && <span className="crm-chip">{inv.taxMode === "intra" ? "CGST + SGST" : "IGST"}</span>}
                </div>
                <div className="crm-muted crm-small">
                  {formatDate(inv.invoiceDate)}
                  {inv.dueDate ? ` · due ${formatDate(inv.dueDate)}` : ""}
                  {inv.paidPaise ? ` · received ${rupees(inv.paidPaise)}` : ""}
                  {inv.status === "cancelled" && inv.cancelReason ? ` · cancelled: ${inv.cancelReason}` : ""}
                </div>
              </div>
              <div className="crm-actions">
                <span className="crm-strong" style={{ marginRight: 6 }}>{rupees(inv.totalPaise)}</span>
                <button className="crm-btn crm-btn-sm" onClick={() => open(pdfPaths.invoice(inv.id))}>PDF</button>
                {inv.status !== "cancelled" && (
                  <button
                    className="crm-btn crm-btn-sm crm-btn-wa"
                    aria-label={waTitle}
                    title={waTitle}
                    disabled={waBusy("invoice", inv)}
                    onClick={whatsappAction("invoice", inv, () => whatsappText.invoice({ client, seller, invoice: inv }))}
                  >
                    <WhatsAppIcon size={13} />
                  </button>
                )}
                {inv.status !== "cancelled" && (
                  <>
                    <button
                      className="crm-btn crm-btn-sm"
                      onClick={() =>
                        client.email
                          ? setModal({
                              type: "confirm",
                              title: `Email ${inv.number}?`,
                              text: `The invoice PDF will be sent to ${client.email}.`,
                              confirmLabel: "Send email",
                              onConfirm: run(() => crmApi.sendInvoice(inv.id, {}), "Could not email the invoice."),
                            })
                          : addToast("Add the client's email first (Edit).", "error")
                      }
                    >
                      Email
                    </button>
                    {inv.paymentState !== "paid" && (
                      <button className="crm-btn crm-btn-sm" onClick={() => setModal({ type: "payment", invoiceId: inv.id })}>
                        Record payment
                      </button>
                    )}
                    <button
                      className="crm-btn crm-btn-sm crm-btn-danger"
                      onClick={() =>
                        setModal({
                          type: "confirm",
                          title: `Cancel ${inv.number}?`,
                          text: "Invoices can't be edited or deleted once issued. Cancelling keeps it on record, marked CANCELLED, and its number stays used. Issue a new invoice if something was wrong.",
                          confirmLabel: "Cancel invoice",
                          danger: true,
                          input: "Reason (printed on the invoice)",
                          onConfirm: run((reason) => crmApi.cancelInvoice(inv.id, reason), "Could not cancel the invoice."),
                        })
                      }
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "payments" && (
        <div className="crm-card">
          <div className="crm-doc-row">
            <div className="crm-muted">Every payment gets a receipt you can download or share.</div>
            <button className="crm-btn crm-btn-primary crm-btn-sm" onClick={() => setModal({ type: "payment" })}>
              <Plus size={14} /> Record payment
            </button>
          </div>
          {payments.length === 0 ? (
            <div className="crm-empty" style={{ padding: 28 }}>No payments yet.</div>
          ) : (
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Method</th>
                    <th>Against</th>
                    <th>Note</th>
                    <th className="crm-num">Amount</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td style={{ whiteSpace: "nowrap" }}>{formatDate(p.paidOn)}</td>
                      <td>
                        <button className="crm-link" onClick={() => open(pdfPaths.receipt(p.id))}>{p.receiptNumber}</button>
                        {p.isAdvance && <div><Badge status="booked">Advance</Badge></div>}
                      </td>
                      <td>
                        {labelOf(PAYMENT_METHODS, p.method)}
                        {p.reference && <div className="crm-muted crm-small">{p.reference}</div>}
                      </td>
                      <td>{p.invoiceNumber || <span className="crm-muted">—</span>}</td>
                      <td className="crm-small" style={{ maxWidth: 240 }}>{p.note || <span className="crm-muted">—</span>}</td>
                      <td className="crm-num crm-strong">{rupees(p.amountPaise)}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {/* The receipt number above is already a link to this,
                            but nobody finds it there - quotations and invoices
                            both carry a plain PDF button, so this one does too. */}
                        <button
                          className="crm-btn crm-btn-sm crm-btn-ghost"
                          title="Open the receipt"
                          onClick={() => open(pdfPaths.receipt(p.id))}
                        >
                          PDF
                        </button>
                        <button
                          className="crm-btn crm-btn-sm crm-btn-ghost crm-btn-wa"
                          aria-label="Send receipt on WhatsApp"
                          title="Send receipt on WhatsApp"
                          disabled={waBusy("receipt", p)}
                          onClick={whatsappAction("receipt", p, () => whatsappText.receipt({ client, seller, payment: p }))}
                        >
                          <WhatsAppIcon size={14} />
                        </button>
                        <button
                          className="crm-btn crm-btn-sm crm-btn-ghost crm-btn-danger"
                          aria-label="Remove payment"
                          onClick={() =>
                            setModal({
                              type: "confirm",
                              title: `Remove payment ${p.receiptNumber}?`,
                              text: `${rupees(p.amountPaise)} on ${formatDate(p.paidOn)} will be removed and the balance recalculated. Use this only for a payment entered by mistake.`,
                              confirmLabel: "Remove",
                              danger: true,
                              onConfirm: run(() => crmApi.deletePayment(p.id), "Could not remove the payment."),
                            })
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {modal?.type === "edit" && (
        <ClientFormModal client={client} events={events} onClose={close} onSaved={() => closeAndReload("Client saved.")} />
      )}
      {modal?.type === "quotation" && (
        <QuotationEditor
          client={client}
          events={events}
          profile={profile}
          quotation={modal.quotation}
          onClose={close}
          onSaved={(message) => {
            setTab("quotations");
            closeAndReload(message);
          }}
          onOpenBusiness={onOpenBusiness}
        />
      )}
      {modal?.type === "send" && (
        <SendQuotationModal quotation={modal.quotation} client={client} seller={seller} onClose={close} onSent={load} />
      )}
      {modal?.type === "invoice" && (
        <InvoiceModal
          client={client}
          events={events}
          profile={profile}
          quotations={quotations}
          defaultQuotationId={modal.quotationId}
          onClose={close}
          onSaved={(message) => {
            setTab("invoices");
            closeAndReload(message);
          }}
          onOpenBusiness={onOpenBusiness}
        />
      )}
      {modal?.type === "payment" && (
        <PaymentModal
          client={client}
          invoices={liveInvoices}
          money={money}
          defaultInvoiceId={modal.invoiceId}
          onClose={close}
          onSaved={(message) => {
            setTab("payments");
            closeAndReload(message);
          }}
        />
      )}
      {modal?.type === "confirm" && <ConfirmModal {...modal} onClose={close} />}

      {tab === "overview" && (
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button
            className="crm-btn crm-btn-sm crm-btn-danger"
            onClick={() =>
              setModal({
                type: "confirm",
                title: `Delete ${client.name}?`,
                text:
                  invoices.length || payments.length
                    ? "This client has invoices or payments, which must be kept for your accounts. Set the status to Cancelled or Lost instead."
                    : "The client, their events, quotations and files will be deleted. This can't be undone.",
                confirmLabel: "Delete client",
                danger: true,
                onConfirm: async () => {
                  try {
                    await crmApi.deleteClient(client.id);
                    addToast("Client deleted.", "success");
                    onBack();
                    return true;
                  } catch (err) {
                    addToast(errorMessage(err, "Could not delete the client."), "error");
                    return false;
                  }
                },
              })
            }
          >
            <Trash2 size={13} /> Delete client
          </button>
        </div>
      )}
    </>
  );
};

export default ClientDetail;
