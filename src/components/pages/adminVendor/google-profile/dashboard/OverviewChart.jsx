// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// The daily chart on the Overview tab (helper D): one figure at a time as plain CSS bars, a readout on hover,
// a spoken summary, and a table of every day. Data: performance.daily from GrowthOS's performanceSchema.
import { useId, useState } from "react";
import { formatDay, formatNumber } from "./ReviewFormat";

const SERIES = [
  { key: "views", label: "Views", unit: ["view", "views"] },
  { key: "calls", label: "Calls", unit: ["call", "calls"] },
  { key: "website_actions", label: "Website clicks", unit: ["website click", "website clicks"] },
  { key: "direction_requests", label: "Direction requests", unit: ["direction request", "direction requests"] },
];

const amount = (n, unit) => `${formatNumber(n)} ${n === 1 ? unit[0] : unit[1]}`;
const valueOf = (day, key) => (typeof day?.[key] === "number" && Number.isFinite(day[key]) ? day[key] : 0);

export default function OverviewChart({ daily }) {
  const [seriesKey, setSeriesKey] = useState("views");
  const [active, setActive] = useState(null);
  const titleId = useId();
  const series = SERIES.find((s) => s.key === seriesKey) || SERIES[0];
  const days = Array.isArray(daily) ? daily : [];

  if (days.length === 0) {
    return (
      <section className="gp-card gp-ov-chart" aria-labelledby={titleId}>
        <h3 className="gp-h3" id={titleId}>
          Day by day
        </h3>
        <p className="gp-note">Google hasn't sent daily numbers for this period yet.</p>
      </section>
    );
  }

  const values = days.map((d) => valueOf(d, series.key));
  const total = values.reduce((sum, v) => sum + v, 0);
  const max = Math.max(...values);
  const peakIndex = values.indexOf(max);
  const first = formatDay(days[0].date);
  const last = formatDay(days[days.length - 1].date);
  const summary =
    max === 0
      ? `${series.label} per day, ${first} to ${last}: none in this period.`
      : `${series.label} per day, ${first} to ${last}: ${amount(total, series.unit)} in total, most on ${formatDay(
          days[peakIndex].date,
        )} with ${formatNumber(max)}.`;
  const shown = active !== null && days[active] ? active : null;
  const readout =
    shown !== null
      ? `${formatDay(days[shown].date, true)}: ${amount(values[shown], series.unit)}`
      : max === 0
        ? `No ${series.unit[1]} in this period`
        : `${amount(total, series.unit)} in total · most on ${formatDay(days[peakIndex].date)} (${formatNumber(max)})`;

  return (
    <section className="gp-card gp-ov-chart" aria-labelledby={titleId}>
      <div className="gp-ov-chart-head">
        <h3 className="gp-h3" id={titleId}>
          {series.label} per day
        </h3>
        <div className="gp-ov-seg" role="group" aria-label="Figure to show in the chart">
          {SERIES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={`gp-ov-seg-btn${s.key === seriesKey ? " is-on" : ""}`}
              aria-pressed={s.key === seriesKey}
              onClick={() => {
                setSeriesKey(s.key);
                setActive(null);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="gp-ov-readout" aria-hidden="true">
        {readout}
      </p>

      <div className="gp-ov-plot" role="img" aria-label={summary} onMouseLeave={() => setActive(null)}>
        <span className="gp-ov-axis-max" aria-hidden="true">
          {formatNumber(max)}
        </span>
        <div className={`gp-ov-bars${days.length > 45 ? " is-dense" : ""}`}>
          {days.map((d, i) => {
            const height = max > 0 ? (values[i] / max) * 100 : 0;
            return (
              <span
                key={d.date || i}
                className={`gp-ov-bar-slot${shown === i ? " is-active" : ""}`}
                onMouseEnter={() => setActive(i)}
              >
                <span className="gp-ov-bar" style={{ height: values[i] > 0 ? `max(2px, ${height}%)` : 0 }} />
              </span>
            );
          })}
        </div>
        <div className="gp-ov-axis-x" aria-hidden="true">
          <span>{first}</span>
          <span>{last}</span>
        </div>
      </div>

      <details className="gp-ov-table-wrap">
        <summary>See the numbers for each day</summary>
        <div className="gp-ov-table-scroll">
          <table className="gp-ov-table">
            <caption className="visually-hidden">Google numbers for each day</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                {SERIES.map((s) => (
                  <th scope="col" key={s.key}>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d.date || i}>
                  <th scope="row">{formatDay(d.date, true)}</th>
                  {SERIES.map((s) => (
                    <td key={s.key}>{formatNumber(valueOf(d, s.key))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
