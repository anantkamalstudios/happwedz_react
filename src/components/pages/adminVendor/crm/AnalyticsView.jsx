import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Info, TrendingDown, TrendingUp } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { formatDate, rupees, todayIso } from "./crmFormat";
import { Spinner } from "./crmUi";

// Conversion analytics. Every number comes from work the vendor has already
// recorded; nothing here asks them to type anything twice.

const monthsAgo = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toLocaleDateString("en-CA");
};

const financialYearStart = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return `${year}-04-01`;
};

const monthStart = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

const PRESETS = [
  { id: "month", label: "This month", range: () => ({ from: monthStart(), to: todayIso() }) },
  { id: "quarter", label: "Last 3 months", range: () => ({ from: monthsAgo(3), to: todayIso() }) },
  { id: "year", label: "This financial year", range: () => ({ from: financialYearStart(), to: todayIso() }) },
];

const STAGE_COLOURS = { lead: "var(--crm-blue)", quoted: "var(--crm-violet)", booked: "var(--crm-green)", completed: "var(--crm-grey)" };

const pct = (value) => (value === null || value === undefined ? "—" : `${value}%`);

// "9 more than the 30 days before" — a number on its own says very little.
const Change = ({ value, before, kind = "count", goodWhenLower = false }) => {
  if (before === null || before === undefined || value === null || value === undefined) return null;
  const difference = Math.round((value - before) * 10) / 10;
  if (!difference) return <span className="crm-muted crm-small">Same as the period before</span>;
  const better = goodWhenLower ? difference < 0 : difference > 0;
  const size = Math.abs(difference);
  const text = kind === "money" ? rupees(size) : kind === "percent" ? `${size} points` : size;
  return (
    <span className={`crm-small ${better ? "is-good" : "is-pending"}`} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {difference > 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {text} {difference > 0 ? "more" : "less"} than the period before
    </span>
  );
};

const AnalyticsView = () => {
  const [preset, setPreset] = useState("year");
  const [range, setRange] = useState(() => PRESETS[2].range());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await crmApi.analytics({ from: range.from, to: range.to }));
    } catch (err) {
      setError(errorMessage(err, "Could not work out your numbers."));
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    load();
  }, [load]);

  const choose = (id) => {
    const found = PRESETS.find((p) => p.id === id);
    setPreset(id);
    if (found) setRange(found.range());
  };

  const setCustom = (key) => (e) => {
    setPreset("custom");
    setRange((current) => ({ ...current, [key]: e.target.value }));
  };

  const widest = useMemo(() => Math.max(1, ...(data?.funnel || []).map((f) => f.count)), [data]);
  const worstReason = useMemo(() => Math.max(1, ...(data?.lostReasons || []).map((r) => r.count)), [data]);

  if (loading && !data) return <Spinner />;
  if (error) {
    return (
      <div className="crm-card crm-empty">
        <h3>{error}</h3>
        <button className="crm-btn" onClick={load}>Try again</button>
      </div>
    );
  }
  if (!data) return null;

  const { kpis, funnel, lostReasons, sources } = data;

  return (
    <div className="crm-analytics">
      <div className="crm-card crm-range">
        <div className="crm-pills">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className={`crm-pill ${preset === p.id ? "is-on" : ""}`} onClick={() => choose(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="crm-range-dates">
          <label className="crm-small crm-muted" htmlFor="crm-from">From</label>
          <input id="crm-from" type="date" className="crm-input" value={range.from} max={range.to} onChange={setCustom("from")} />
          <label className="crm-small crm-muted" htmlFor="crm-to">to</label>
          <input id="crm-to" type="date" className="crm-input" value={range.to} min={range.from} onChange={setCustom("to")} />
        </div>
      </div>

      {data.thin && (
        <div className="crm-note">
          <Info size={15} />
          <span>
            Only {kpis.leads.value} client{kpis.leads.value === 1 ? "" : "s"} came in during this period, so the percentages below
            move a lot with each one. Pick a longer period to see a truer picture.
          </span>
        </div>
      )}

      <div className="crm-stats">
        <div className="crm-card crm-stat">
          <div className="crm-stat-label">New clients</div>
          <div className="crm-stat-value">{kpis.leads.value}</div>
          <div className="crm-stat-note"><Change value={kpis.leads.value} before={kpis.leads.before} /></div>
        </div>
        <div className="crm-card crm-stat">
          <div className="crm-stat-label">Turned into bookings</div>
          <div className="crm-stat-value" style={{ color: "var(--crm-brand)" }}>{pct(kpis.conversion.value)}</div>
          <div className="crm-stat-note">
            {kpis.booked.value} of {kpis.leads.value}
            {kpis.conversion.before !== null && kpis.conversion.value !== null ? (
              <> · <Change value={kpis.conversion.value} before={kpis.conversion.before} kind="percent" /></>
            ) : null}
          </div>
        </div>
        <div className="crm-card crm-stat">
          <div className="crm-stat-label">Days from enquiry to booking</div>
          <div className="crm-stat-value">{kpis.daysToBook.value === null ? "—" : kpis.daysToBook.value}</div>
          <div className="crm-stat-note">
            {kpis.daysToBook.value === null ? (
              "No bookings closed in this period"
            ) : kpis.daysToBook.before === null ? (
              `Across ${kpis.booked.value} booking${kpis.booked.value === 1 ? "" : "s"} closed in this period`
            ) : (
              <Change value={kpis.daysToBook.value} before={kpis.daysToBook.before} goodWhenLower />
            )}
          </div>
        </div>
        <div className="crm-card crm-stat">
          <div className="crm-stat-label">Booked value</div>
          <div className="crm-stat-value is-good">{rupees(kpis.bookedValuePaise.value)}</div>
          <div className="crm-stat-note">
            {kpis.booked.value > 0 ? `${rupees(kpis.averageBookingPaise.value)} on average · ` : ""}
            {rupees(kpis.collectedPaise.value)} collected in this period
          </div>
        </div>
      </div>

      <div className="crm-analytics-row">
        <div className="crm-card">
          <div className="crm-panel-title">
            <span>Where these {kpis.leads.value} client{kpis.leads.value === 1 ? "" : "s"} got to</span>
          </div>
          <div className="crm-sub" style={{ marginBottom: 14 }}>
            Every client who came in between {formatDate(data.range.from)} and {formatDate(data.range.to)}, and the furthest stage they reached.
          </div>
          {kpis.leads.value === 0 ? (
            <div className="crm-empty" style={{ padding: "20px 0" }}>
              <h3>No clients came in during this period</h3>
              <div>Try a longer period, or add the enquiries you are working on.</div>
            </div>
          ) : (
            <div className="crm-funnel">
              {funnel.map((step) => (
                <div key={step.id} className="crm-funnel-step">
                  <div className="crm-funnel-head">
                    <span className="crm-funnel-side">
                      <span className="crm-funnel-name">{step.label}</span>
                      <span className="crm-strong">{step.count}</span>
                      {step.rateFromPrevious !== null && (
                        <span className="crm-muted crm-small">· {pct(step.rateFromPrevious)} of the step before</span>
                      )}
                    </span>
                    <span className="crm-funnel-side">
                      {step.droppedFromPrevious > 0 && (
                        <span className="crm-small is-pending">{step.droppedFromPrevious} stopped here</span>
                      )}
                      <span className="crm-muted crm-small">{rupees(step.valuePaise)}</span>
                    </span>
                  </div>
                  <div className="crm-funnel-bar">
                    <span style={{ width: `${Math.round((step.count / widest) * 100)}%`, background: STAGE_COLOURS[step.id] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="crm-card">
          <div className="crm-panel-title">
            <span>Why work is lost</span>
            {data.lostCount > 0 && <span className="crm-tab-count">{data.lostCount}</span>}
          </div>
          <div className="crm-sub" style={{ marginBottom: 14 }}>From the reason picked when a client is moved to Lost or Cancelled.</div>
          {lostReasons.length === 0 ? (
            <div className="crm-empty" style={{ padding: "20px 0" }}>
              <h3>Nothing lost in this period</h3>
            </div>
          ) : (
            <>
              <div className="crm-reasons">
                {lostReasons.map((reason) => (
                  <div key={reason.id} className="crm-reason">
                    <div className="crm-reason-head">
                      <span>{reason.label}</span>
                      <span className="crm-strong">{reason.count}</span>
                    </div>
                    <div className="crm-funnel-bar">
                      <span style={{ width: `${Math.round((reason.count / worstReason) * 100)}%`, background: "var(--crm-red)" }} />
                    </div>
                    <div className="crm-muted crm-small">{rupees(reason.valuePaise)}</div>
                  </div>
                ))}
              </div>
              <div className="crm-note" style={{ marginTop: 14 }}>
                <Info size={15} />
                <span>{rupees(data.lostValuePaise)} of work went elsewhere in this period.</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="crm-card">
        <div className="crm-panel-title"><span>Which sources actually book</span></div>
        <div className="crm-sub" style={{ marginBottom: 6 }}>
          The lead source on each client, for the clients who came in during this period.
        </div>
        {sources.length === 0 ? (
          <div className="crm-empty" style={{ padding: "20px 0" }}><h3>Nothing to compare yet</h3></div>
        ) : (
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th className="crm-num">Clients</th>
                  <th className="crm-num">Booked</th>
                  <th className="crm-num">Booking rate</th>
                  <th className="crm-num">Booked value</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td className="crm-strong">{source.label}</td>
                    <td className="crm-num">{source.leads}</td>
                    <td className="crm-num">{source.booked}</td>
                    <td className={`crm-num ${source.rate >= 40 ? "is-good" : source.rate === 0 ? "is-pending" : ""}`}>{pct(source.rate)}</td>
                    <td className="crm-num">{source.valuePaise ? rupees(source.valuePaise) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;
