import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, GripVertical } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { CLIENT_STATUSES, LEAD_SOURCES, LOST_REASONS, formatDate, labelOf, rupees, todayIso } from "./crmFormat";
import { Spinner } from "./crmUi";
import StageMoveModal from "./StageMoveModal";
import { useToast } from "../../../layouts/toasts/Toast";

// The board shows the statuses the CRM has always stored. Dragging a card is
// the quick way; the select on every card is the way that works on a phone and
// with a keyboard, so nothing here is drag-only.

const COLUMN_TONE = { lead: "blue", quoted: "violet", booked: "green", completed: "grey", closed: "red" };

const CardChip = ({ tone = "grey", children }) => <span className={`crm-bcard-chip crm-tone-${tone}`}>{children}</span>;

const BoardCard = ({ client, dragging, busy, onOpen, onDragStart, onDragEnd, onMove, onComplete }) => {
  const today = todayIso();
  const overdueFollowUp = client.followUpDate && client.followUpDate <= today;
  const overduePayment = client.dueDate && client.dueDate < today && client.money?.isPending;
  const event = (client.events || [])[0];
  const closed = client.status === "lost" || client.status === "cancelled";

  return (
    <div
      className={`crm-bcard ${dragging ? "is-dragging" : ""} ${busy ? "is-busy" : ""}`}
      draggable={!busy}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="crm-bcard-top">
        <button type="button" className="crm-bcard-name" onClick={() => onOpen(client.id)}>
          {client.name}
        </button>
        <GripVertical size={15} className="crm-bcard-grip" aria-hidden="true" />
      </div>

      {(event || client.firstEventDate) && (
        <div className="crm-muted crm-small">
          {event?.name || "Event"}
          {client.firstEventDate ? ` · ${formatDate(client.firstEventDate)}` : ""}
        </div>
      )}

      <div className="crm-bcard-money">
        <span className="crm-strong">{rupees(client.money?.finalPaise || 0)}</span>
        <CardChip>{labelOf(LEAD_SOURCES, client.leadSource)}</CardChip>
      </div>

      {client.money?.finalPaise > 0 && client.money?.receivedPaise > 0 && (
        <div className="crm-bcard-bar" aria-hidden="true">
          <span style={{ width: `${Math.min(100, Math.round((client.money.receivedPaise / client.money.finalPaise) * 100))}%` }} />
        </div>
      )}

      {closed && client.lostReasonLabel && <CardChip tone="red">{client.lostReasonLabel}</CardChip>}
      {!closed && overduePayment && <CardChip tone="red">{rupees(client.money.balancePaise)} overdue</CardChip>}
      {!closed && !overduePayment && client.money?.isPending && client.dueDate && (
        <CardChip tone="amber">{rupees(client.money.balancePaise)} due {formatDate(client.dueDate)}</CardChip>
      )}
      {!closed && client.followUpDate && (
        <CardChip tone={overdueFollowUp ? "red" : "blue"}>
          <Clock size={11} /> Follow up {formatDate(client.followUpDate)}
        </CardChip>
      )}

      {client.readyToComplete && (
        <button type="button" className="crm-btn crm-btn-soft crm-bcard-complete" onClick={() => onComplete(client)} disabled={busy}>
          <CheckCircle2 size={14} /> Event is over — mark completed
        </button>
      )}

      <div className="crm-bcard-foot">
        <span className="crm-muted crm-small">
          {client.daysInStage === 0 ? "Moved today" : `${client.daysInStage} day${client.daysInStage === 1 ? "" : "s"} here`}
        </span>
        <label className="crm-bcard-move">
          <span className="crm-sr-only">Move {client.name} to another stage</span>
          <select className="crm-input" value={client.status} disabled={busy} onChange={(e) => onMove(client, e.target.value)}>
            {CLIENT_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

const BoardView = ({ filters, onOpenClient, onMoved }) => {
  const { addToast } = useToast();
  const [columns, setColumns] = useState([]);
  const [reasons, setReasons] = useState(LOST_REASONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragId, setDragId] = useState(null);
  const [overColumn, setOverColumn] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [asking, setAsking] = useState(null); // { client, status } waiting for a reason
  const [askError, setAskError] = useState("");
  const [askSaving, setAskSaving] = useState(false);

  const { q, source, payment, sort, followup } = filters;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await crmApi.board({ q: q || undefined, source, payment, sort, followup });
      setColumns(data.columns || []);
      if (data.lostReasons?.length) setReasons(data.lostReasons);
    } catch (err) {
      setError(errorMessage(err, "Could not load your pipeline."));
    } finally {
      setLoading(false);
    }
  }, [q, source, payment, sort, followup]);

  useEffect(() => {
    load();
  }, [load]);

  const apply = async (client, status, extra = {}) => {
    setBusyId(client.id);
    try {
      const result = await crmApi.setClientStatus(client.id, { status, ...extra });
      if (result.moved) addToast(result.message, "success");
      await load();
      onMoved?.();
      return true;
    } catch (err) {
      addToast(errorMessage(err, "Could not move the client."), "error");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  // Lost and cancelled always ask why; everything else just moves.
  const requestMove = (client, status) => {
    if (!status || status === client.status) return;
    if (status === "lost" || status === "cancelled") {
      setAskError("");
      setAsking({ client, status });
      return;
    }
    apply(client, status);
  };

  const confirmClose = async ({ status, reason, note }) => {
    setAskSaving(true);
    setAskError("");
    try {
      const result = await crmApi.setClientStatus(asking.client.id, { status, reason, note });
      if (result.moved) addToast(result.message, "success");
      setAsking(null);
      await load();
      onMoved?.();
    } catch (err) {
      setAskError(errorMessage(err, "Could not move the client."));
    } finally {
      setAskSaving(false);
    }
  };

  const findCard = (id) => {
    for (const column of columns) {
      const card = column.clients.find((c) => c.id === id);
      if (card) return card;
    }
    return null;
  };

  const drop = (column) => {
    setOverColumn("");
    const card = findCard(dragId);
    setDragId(null);
    if (!card) return;
    // The closed column holds two statuses, so the dialog asks which one.
    requestMove(card, column.id === "closed" ? "lost" : column.id);
  };

  if (loading && !columns.length) return <Spinner />;
  if (error) {
    return (
      <div className="crm-card crm-empty">
        <h3>{error}</h3>
        <button className="crm-btn" onClick={load}>Try again</button>
      </div>
    );
  }

  const empty = columns.every((column) => column.count === 0);
  if (empty) {
    return (
      <div className="crm-card crm-empty">
        <h3>No clients match these filters</h3>
        <div>Clear the search or filters to see your whole pipeline.</div>
      </div>
    );
  }

  return (
    <>
      <div className="crm-board">
        {columns.map((column) => (
          <section
            key={column.id}
            className={`crm-bcol ${column.id === "closed" ? "is-closed" : ""} ${overColumn === column.id ? "is-over" : ""}`}
            onDragOver={(e) => {
              if (!dragId) return;
              e.preventDefault();
              setOverColumn(column.id);
            }}
            onDragLeave={() => setOverColumn((current) => (current === column.id ? "" : current))}
            onDrop={() => drop(column)}
          >
            <header className="crm-bcol-head">
              <div className="crm-bcol-title">
                <span className={`crm-dot crm-tone-${COLUMN_TONE[column.id] || "grey"}`} aria-hidden="true" />
                <h2>{column.id === "closed" ? "Lost / cancelled" : column.label}</h2>
                <span className="crm-tab-count">{column.count}</span>
              </div>
              <div className="crm-muted crm-small">
                {rupees(column.valuePaise)}
                {/* Money still to collect only means something once the work is won. */}
                {column.pendingPaise > 0 && (column.id === "booked" || column.id === "completed")
                  ? ` · ${rupees(column.pendingPaise)} to collect`
                  : ""}
              </div>
            </header>

            <div className="crm-bcol-body">
              {column.clients.map((client) => (
                <BoardCard
                  key={client.id}
                  client={client}
                  busy={busyId === client.id}
                  dragging={dragId === client.id}
                  onOpen={onOpenClient}
                  onDragStart={() => setDragId(client.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverColumn("");
                  }}
                  onMove={requestMove}
                  onComplete={(c) => apply(c, "completed")}
                />
              ))}
              {column.more > 0 && <div className="crm-muted crm-small crm-bcol-more">{column.more} more — use the list to see them all</div>}
              {column.count === 0 && <div className="crm-bcol-empty">Drop a client here</div>}
            </div>
          </section>
        ))}
      </div>

      {asking && (
        <StageMoveModal
          client={asking.client}
          status={asking.status}
          reasons={reasons}
          saving={askSaving}
          error={askError}
          onClose={() => setAsking(null)}
          onConfirm={confirmClose}
        />
      )}
    </>
  );
};

export default BoardView;
