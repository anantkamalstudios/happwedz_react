import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Download, Kanban, LineChart, List, PhoneCall, Plus, Search, Settings2, Users, UsersRound } from "lucide-react";
import { crmApi, errorMessage, openFile, pdfPaths } from "./crmApi";
import { CLIENT_STATUSES, LEAD_SOURCES, formatDate, labelOf, rupees, todayIso } from "./crmFormat";
import { Badge, Spinner } from "./crmUi";
import ClientFormModal from "./ClientFormModal";
import CalendarView from "./CalendarView";
import BoardView from "./BoardView";
import AnalyticsView from "./AnalyticsView";
import TeamPage from "./TeamPage";
import { useToast } from "../../../layouts/toasts/Toast";

const PAGE_SIZE = 25;
const VIEW_KEY = "crm.view";

const VIEWS = ["list", "board", "calendar", "analytics", "team"];

const readView = () => {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    return VIEWS.includes(saved) ? saved : "list";
  } catch {
    return "list";
  }
};

const CrmHome = ({ onOpenClient, onOpenBusiness }) => {
  const { addToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [payment, setPayment] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [followup, setFollowup] = useState("all");
  const [view, setView] = useState(readView);
  // Who is looking: the vendor themselves, or someone they invited.
  const [viewer, setViewer] = useState(null);
  const [owners, setOwners] = useState([]);
  const [owner, setOwner] = useState("all");

  const switchView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Private mode: the choice just isn't remembered.
    }
  };

  // Wait for typing to pause before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = { q: query || undefined, status, source, payment, sort, followup: followup === "all" ? undefined : followup };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // The board loads its own columns; only the panels above it need the summary.
      const [list, sum] = await Promise.all([
        view === "board" || view === "analytics" || view === "team"
          ? Promise.resolve(null)
          : crmApi.clients({ ...filters, page, limit: PAGE_SIZE, owner }),
        crmApi.summary(),
      ]);
      if (list) {
        setRows(list.clients || []);
        setTotal(list.total || 0);
      }
      setSummary(sum.summary);
      setViewer(sum.viewer || null);
    } catch (err) {
      setError(errorMessage(err, "Could not load your clients."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, source, payment, sort, page, followup, view, owner]);

  useEffect(() => {
    load();
  }, [load]);

  // The people a client can be handed to. Empty for a staff member, who does
  // not hand clients around, so the chips and the filter simply do not appear.
  useEffect(() => {
    let alive = true;
    crmApi
      .owners()
      .then((data) => alive && setOwners(data.owners || []))
      .catch(() => alive && setOwners([]));
    return () => {
      alive = false;
    };
  }, []);

  const exportExcel = async () => {
    setExporting(true);
    try {
      await openFile(pdfPaths.export(), { params: filters, download: true, filename: `clients-${todayIso()}.xlsx` });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setExporting(false);
    }
  };

  const setFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = query || status !== "all" || source !== "all" || payment !== "all" || followup !== "all";

  // "Show all" on a home panel: the list, filtered to just those clients.
  const showOnly = (next) => {
    switchView("list");
    setFollowup(next.followup || "all");
    setPayment(next.payment || "all");
    setStatus("all");
    setSource("all");
    setSearch("");
    setPage(1);
  };

  // One filter row, used by the list and by the board. The board is the status,
  // so a status filter would only fight with it.
  const filterBar = (
    <div className="crm-filters">
      <div className="crm-search">
        <Search size={15} />
        <input
          className="crm-input"
          placeholder="Search name, phone, email or event"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {view !== "board" && (
        <select className="crm-input" value={status} onChange={setFilter(setStatus)} aria-label="Status">
          <option value="all">All statuses</option>
          {CLIENT_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      )}
      <select className="crm-input" value={source} onChange={setFilter(setSource)} aria-label="Lead source">
        <option value="all">All sources</option>
        {LEAD_SOURCES.map((s) => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      <select className="crm-input" value={payment} onChange={setFilter(setPayment)} aria-label="Payment">
        <option value="all">Any payment</option>
        <option value="pending">Payment pending</option>
        <option value="overdue">Payment overdue</option>
        <option value="cleared">Fully paid</option>
      </select>
      <select className="crm-input" value={sort} onChange={setFilter(setSort)} aria-label="Sort">
        <option value="newest">Newest first</option>
        <option value="event">Event date</option>
        <option value="balance">Highest balance</option>
        <option value="name">Name A–Z</option>
      </select>
    </div>
  );

  return (
    <>
      <div className="crm-head">
        <div>
          <h1 className="crm-title">Clients</h1>
          <div className="crm-sub">
            {viewer?.role === "staff"
              ? "The clients you are looking after: events, quotations, invoices and payments."
              : "Every booking in one place: events, quotations, invoices and payments."}
          </div>
        </div>
        <div className="crm-actions">
          <button className="crm-btn" onClick={onOpenBusiness}>
            <Settings2 size={15} /> Business details
          </button>
          <button className="crm-btn" onClick={exportExcel} disabled={exporting || !total}>
            <Download size={15} /> {exporting ? "Exporting…" : "Export Excel"}
          </button>
          <button className="crm-btn crm-btn-primary" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add client
          </button>
        </div>
      </div>

      {summary && (
        <div className="crm-stats">
          <div className="crm-card crm-stat">
            <div className="crm-stat-label">Booked value</div>
            <div className="crm-stat-value">{rupees(summary.bookedValuePaise)}</div>
            <div className="crm-stat-note">{summary.booked} booked client{summary.booked === 1 ? "" : "s"}</div>
          </div>
          <div className="crm-card crm-stat">
            <div className="crm-stat-label">Collected</div>
            <div className="crm-stat-value is-good">{rupees(summary.collectedPaise)}</div>
            <div className="crm-stat-note">{rupees(summary.collectedThisMonthPaise)} this month</div>
          </div>
          <div className="crm-card crm-stat">
            <div className="crm-stat-label">Payment pending</div>
            <div className={`crm-stat-value ${summary.pendingPaise ? "is-pending" : ""}`}>{rupees(summary.pendingPaise)}</div>
            <div className="crm-stat-note">from {summary.pendingClients} client{summary.pendingClients === 1 ? "" : "s"}</div>
          </div>
          <div className="crm-card crm-stat">
            <div className="crm-stat-label">New leads</div>
            <div className="crm-stat-value">{summary.newLeads}</div>
            <div className="crm-stat-note">{summary.clients} clients in total</div>
          </div>
        </div>
      )}

      {(summary?.followUps?.length > 0 || summary?.overdue?.length > 0) && (
        <div className="crm-panels">
          {summary.followUps.length > 0 && (
            <div className="crm-card">
              <div className="crm-panel-title">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <PhoneCall size={15} style={{ color: "#2457c5" }} /> Follow-ups due
                </span>
                <button className="crm-link crm-small" onClick={() => showOnly({ followup: "due" })}>Show all</button>
              </div>
              {summary.followUps.map((f) => (
                <button key={f.clientId} className="crm-panel-row" onClick={() => onOpenClient(f.clientId)}>
                  <span style={{ minWidth: 0 }}>
                    <strong>{f.clientName}</strong>
                    {f.note ? <span className="crm-muted"> · {f.note}</span> : null}
                  </span>
                  <span className={f.date < todayIso() ? "crm-balance-due crm-small" : "crm-muted crm-small"} style={{ whiteSpace: "nowrap" }}>
                    {f.date < todayIso() ? `since ${formatDate(f.date)}` : "today"}
                  </span>
                </button>
              ))}
            </div>
          )}
          {summary.overdue.length > 0 && (
            <div className="crm-card">
              <div className="crm-panel-title">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <AlertCircle size={15} style={{ color: "#c62828" }} /> Payments overdue
                  {summary.overdueCount > summary.overdue.length ? <span className="crm-tab-count">{summary.overdueCount}</span> : null}
                </span>
                <button className="crm-link crm-small" onClick={() => showOnly({ payment: "overdue" })}>Show all</button>
              </div>
              {summary.overdue.map((o) => (
                <button key={o.clientId} className="crm-panel-row" onClick={() => onOpenClient(o.clientId)}>
                  <strong>{o.clientName}</strong>
                  <span style={{ whiteSpace: "nowrap" }}>
                    <span className="crm-balance-due">{rupees(o.amountPaise)}</span>
                    <span className="crm-muted crm-small"> · due {formatDate(o.dueDate)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="crm-head" style={{ marginBottom: 12 }}>
        <div className="crm-switch" role="tablist" aria-label="View">
          <button role="tab" aria-selected={view === "list"} className={view === "list" ? "is-active" : ""} onClick={() => switchView("list")}>
            <List size={15} /> Clients
          </button>
          <button role="tab" aria-selected={view === "board"} className={view === "board" ? "is-active" : ""} onClick={() => switchView("board")}>
            <Kanban size={15} /> Pipeline
          </button>
          <button role="tab" aria-selected={view === "calendar"} className={view === "calendar" ? "is-active" : ""} onClick={() => switchView("calendar")}>
            <CalendarDays size={15} /> Calendar
          </button>
          <button role="tab" aria-selected={view === "analytics"} className={view === "analytics" ? "is-active" : ""} onClick={() => switchView("analytics")}>
            <LineChart size={15} /> Analytics
          </button>
          {viewer?.canManageTeam && (
            <button role="tab" aria-selected={view === "team"} className={view === "team" ? "is-active" : ""} onClick={() => switchView("team")}>
              <UsersRound size={15} /> Team
            </button>
          )}
        </div>
        {followup === "due" && view === "list" && (
          <span className="crm-chip">
            Showing follow-ups due · <button className="crm-link crm-small" onClick={() => setFollowup("all")}>clear</button>
          </span>
        )}
      </div>

      {view === "calendar" ? (
        <CalendarView onOpenClient={onOpenClient} />
      ) : view === "analytics" ? (
        <AnalyticsView />
      ) : view === "team" ? (
        <TeamPage />
      ) : view === "board" ? (
        <>
          <div className="crm-card crm-board-filters">{filterBar}</div>
          <BoardView
            filters={{ q: query, source, payment, sort, followup: followup === "all" ? undefined : followup }}
            owners={owners}
            canAssign={!!viewer?.canAssign && owners.length > 0}
            owner={owner}
            onOwnerFilter={setOwner}
            onOpenClient={onOpenClient}
            onMoved={load}
          />
        </>
      ) : (
        <>
      {summary?.upcoming?.length > 0 && (
        <>
          <div className="crm-section-label">Events in the next 30 days</div>
          <div className="crm-upcoming">
            {summary.upcoming.map((event, index) => (
              <button key={index} className="crm-card crm-upcoming-item" onClick={() => onOpenClient(event.clientId)}>
                <div className="crm-upcoming-date">{formatDate(event.eventDate)}</div>
                <div className="crm-strong">{event.name}</div>
                <div className="crm-muted crm-small">
                  {event.clientName}
                  {event.venue ? ` · ${event.venue}` : ""}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="crm-card">
        {filterBar}
        {loading && !rows.length ? (
          <Spinner />
        ) : error ? (
          <div className="crm-empty">
            <h3>{error}</h3>
            <button className="crm-btn" onClick={load}>Try again</button>
          </div>
        ) : !rows.length ? (
          <div className="crm-empty">
            <Users size={36} style={{ marginBottom: 10 }} />
            {filtered ? (
              <>
                <h3>No clients match these filters</h3>
                <div>Try a different search or status.</div>
              </>
            ) : (
              <>
                <h3>Add your first client</h3>
                <div style={{ marginBottom: 14 }}>
                  Add clients yourself, or use “Add to CRM” on any HappyWedz enquiry.
                </div>
                <button className="crm-btn crm-btn-primary" onClick={() => setAdding(true)}>
                  <Plus size={16} /> Add client
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="crm-table-wrap">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client</th>
                    <th>Events</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th className="crm-num">Final amount</th>
                    <th className="crm-num">Received</th>
                    <th className="crm-num">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((client, index) => (
                    <tr key={client.id} className="is-clickable" onClick={() => onOpenClient(client.id)}>
                      <td className="crm-muted">{(page - 1) * PAGE_SIZE + index + 1}</td>
                      <td>
                        <div className="crm-strong">{client.name}</div>
                        <div className="crm-muted crm-small">{[client.phone, client.location].filter(Boolean).join(" · ")}</div>
                      </td>
                      <td>
                        <div className="crm-events-cell">
                          {client.events.length ? (
                            client.events.map((event) => (
                              <span key={event.id} className="crm-chip" title={event.venue || ""}>
                                {event.name}
                                {event.eventDate ? ` · ${formatDate(event.eventDate)}` : ""}
                              </span>
                            ))
                          ) : (
                            <span className="crm-muted">—</span>
                          )}
                        </div>
                      </td>
                      <td>{labelOf(LEAD_SOURCES, client.leadSource)}</td>
                      <td>
                        <Badge status={client.status}>{labelOf(CLIENT_STATUSES, client.status)}</Badge>
                      </td>
                      <td className="crm-num">{client.money.finalPaise ? rupees(client.money.finalPaise) : "—"}</td>
                      <td className="crm-num">{client.money.receivedPaise ? rupees(client.money.receivedPaise) : "—"}</td>
                      <td className="crm-num">
                        {client.money.finalPaise === 0 && client.money.receivedPaise === 0 ? (
                          <span className="crm-muted">—</span>
                        ) : client.money.isPending ? (
                          <>
                            <span className="crm-balance-due">{rupees(client.money.balancePaise)}</span>
                            {client.dueDate && (
                              <div
                                className={`crm-small ${client.dueDate < todayIso() && !["lost", "cancelled"].includes(client.status) ? "crm-balance-due" : "crm-muted"}`}
                                style={{ fontWeight: 400 }}
                              >
                                {client.dueDate < todayIso() ? "overdue since " : "due "}
                                {formatDate(client.dueDate)}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="crm-balance-clear">Paid</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="crm-pager">
              <span>
                {total} client{total === 1 ? "" : "s"}
              </span>
              {pages > 1 && (
                <div className="crm-actions">
                  <button className="crm-btn crm-btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </button>
                  <span>
                    Page {page} of {pages}
                  </span>
                  <button className="crm-btn crm-btn-sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

        </>
      )}

      {adding && (
        <ClientFormModal
          onClose={() => setAdding(false)}
          onSaved={(client) => {
            setAdding(false);
            addToast("Client added.", "success");
            onOpenClient(client.id);
          }}
        />
      )}
    </>
  );
};

export default CrmHome;
