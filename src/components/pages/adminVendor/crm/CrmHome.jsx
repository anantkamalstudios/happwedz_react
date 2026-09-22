import React, { useCallback, useEffect, useState } from "react";
import { Download, Plus, Search, Settings2, Users } from "lucide-react";
import { crmApi, errorMessage, openFile, pdfPaths } from "./crmApi";
import { CLIENT_STATUSES, LEAD_SOURCES, formatDate, labelOf, rupees, todayIso } from "./crmFormat";
import { Badge, Spinner } from "./crmUi";
import ClientFormModal from "./ClientFormModal";
import { useToast } from "../../../layouts/toasts/Toast";

const PAGE_SIZE = 25;

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

  // Wait for typing to pause before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filters = { q: query || undefined, status, source, payment, sort };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, sum] = await Promise.all([
        crmApi.clients({ ...filters, page, limit: PAGE_SIZE }),
        crmApi.summary(),
      ]);
      setRows(list.clients || []);
      setTotal(list.total || 0);
      setSummary(sum.summary);
    } catch (err) {
      setError(errorMessage(err, "Could not load your clients."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, source, payment, sort, page]);

  useEffect(() => {
    load();
  }, [load]);

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
  const filtered = query || status !== "all" || source !== "all" || payment !== "all";

  return (
    <>
      <div className="crm-head">
        <div>
          <h1 className="crm-title">Clients</h1>
          <div className="crm-sub">Every booking in one place: events, quotations, invoices and payments.</div>
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
          <select className="crm-input" value={status} onChange={setFilter(setStatus)} aria-label="Status">
            <option value="all">All statuses</option>
            {CLIENT_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <select className="crm-input" value={source} onChange={setFilter(setSource)} aria-label="Lead source">
            <option value="all">All sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
          <select className="crm-input" value={payment} onChange={setFilter(setPayment)} aria-label="Payment">
            <option value="all">Any payment</option>
            <option value="pending">Payment pending</option>
            <option value="cleared">Fully paid</option>
          </select>
          <select className="crm-input" value={sort} onChange={setFilter(setSort)} aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="event">Event date</option>
            <option value="balance">Highest balance</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

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
                          <span className="crm-balance-due">{rupees(client.money.balancePaise)}</span>
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
