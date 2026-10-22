// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Overview tab — built by helper D. Views, calls, website clicks and direction requests (performance) with the period before, a daily chart, and the profile's rating and review count (overview).
// API: gpManageApi in src/services/api/googleProfileApi.js. Shapes: GrowthOS performanceSchema and googleOverviewSchema
// (growthos-web/src/contracts/google.ts). A figure Google did not give shows "Not available yet", never 0.
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowDownRight, FiArrowUpRight, FiEye, FiMapPin, FiMinus, FiMousePointer, FiPhone } from "react-icons/fi";
import { Callout } from "../GpParts";
import { errorMessage, gpManageApi } from "../../../../../services/api/googleProfileApi";
import OverviewChart from "./OverviewChart";
import OverviewLoadError from "./OverviewLoadError";
import useOverviewLoad from "./OverviewLoad";
import ReviewStars from "./ReviewStars";
import { formatDay, formatNumber, formatWhen, plural } from "./ReviewFormat";

const PERIODS = [7, 30, 90];

const FIGURES = [
  { key: "views", label: "Views", hint: "Times your profile was shown on Google Search and Maps", Icon: FiEye },
  { key: "calls", label: "Calls", hint: "Calls from your profile", Icon: FiPhone },
  { key: "website_actions", label: "Website clicks", hint: "Clicks to your website", Icon: FiMousePointer },
  { key: "direction_requests", label: "Direction requests", hint: "Requests for directions", Icon: FiMapPin },
];

// Why Google's numbers are not available (GrowthOS GOOGLE_BLOCKS).
const BLOCK_WORDS = {
  google_not_connected: "Google isn't connected, so there are no numbers to show yet.",
  google_no_location: "No Google profile is linked yet, so there are no numbers to show.",
  google_not_configured: "Google numbers are switched off right now. Please try again later.",
  google_unverified: "Google shows numbers once your profile is verified.",
};

const isNumber = (n) => typeof n === "number" && Number.isFinite(n);

/** "+12% vs previous 30 days", in words, with a direction for the arrow. */
function comparison(metric, days) {
  const span = `previous ${days} days`;
  if (!metric || !isNumber(metric.value)) return null;
  const { value, previous } = metric;
  if (!isNumber(previous)) return { dir: "flat", text: `No numbers for the ${span} to compare` };
  if (value === previous) return { dir: "flat", text: `Same as the ${span}` };
  if (previous === 0) return { dir: "up", text: `Up from 0 in the ${span}` };
  const pct = Math.round(((value - previous) / previous) * 100);
  if (pct === 0) return { dir: value > previous ? "up" : "down", text: `About the same as the ${span}` };
  return { dir: pct > 0 ? "up" : "down", text: `${pct > 0 ? "+" : "−"}${Math.abs(pct)}% vs ${span}` };
}

const TREND_ICONS = { up: FiArrowUpRight, down: FiArrowDownRight, flat: FiMinus };

function FigureCard({ figure, metric, days }) {
  const { Icon } = figure;
  const known = Boolean(metric) && isNumber(metric.value);
  const trend = known ? comparison(metric, days) : null;
  const TrendIcon = trend ? TREND_ICONS[trend.dir] : null;
  return (
    <li className="gp-ov-fig">
      <span className="gp-ov-fig-label">
        <Icon size={16} aria-hidden="true" />
        {figure.label}
      </span>
      {known ? (
        <span className="gp-ov-fig-value">{formatNumber(metric.value)}</span>
      ) : (
        <span className="gp-ov-fig-none">Not available yet</span>
      )}
      {trend && (
        <span className={`gp-ov-trend is-${trend.dir}`}>
          <TrendIcon size={14} aria-hidden="true" />
          {trend.text}
        </span>
      )}
      <span className="gp-note">{figure.hint}</span>
    </li>
  );
}

function FiguresLoading() {
  return (
    <div role="status">
      <span className="visually-hidden">Loading your Google numbers…</span>
      <ul className="gp-ov-figs" aria-hidden="true">
        {FIGURES.map((f) => (
          <li key={f.key} className="gp-ov-fig gp-ov-skel" />
        ))}
      </ul>
    </div>
  );
}

function Performance({ days }) {
  const perf = useOverviewLoad(() => gpManageApi.performance(days), days);
  const data = perf.data;

  if (perf.status === "loading" && !data) return <FiguresLoading />;
  if (perf.status === "error") {
    return (
      <OverviewLoadError
        message={errorMessage(perf.error, "We couldn't load your Google numbers. Please try again.")}
        onRetry={perf.reload}
      />
    );
  }
  if (data?.google && data.google.available === false) {
    return <Callout tone="warn">{BLOCK_WORDS[data.google.reason] || "Google's numbers aren't available yet."}</Callout>;
  }
  if (!data?.period || !data.metrics) {
    return (
      <div className="gp-ov-empty">
        <p className="gp-ov-empty-title">No numbers yet</p>
        <p className="gp-lead">Google sends its numbers once a day, and they are a few days behind. Check back tomorrow.</p>
      </div>
    );
  }

  const shownDays = isNumber(data.period.days) ? data.period.days : days;
  const busy = perf.status === "loading";
  return (
    <div className={`gp-stack-sm gp-ov-perf${busy ? " is-busy" : ""}`} aria-busy={busy || undefined}>
      <p className="gp-note">
        {formatDay(data.period.from, true)} – {formatDay(data.period.to, true)} (Google's newest day), compared with the{" "}
        {shownDays} days before.
        {data.synced_at ? ` Updated ${formatWhen(data.synced_at)}.` : ""}
      </p>
      <ul className="gp-ov-figs">
        {FIGURES.map((figure) => (
          <FigureCard key={figure.key} figure={figure} metric={data.metrics[figure.key]} days={shownDays} />
        ))}
      </ul>
      <OverviewChart key={`${data.period.from}:${data.period.to}`} daily={data.daily} />
    </div>
  );
}

function RatingCard({ onOpenTab }) {
  const overview = useOverviewLoad(() => gpManageApi.overview(), "overview");
  const profile = overview.data?.profile;
  const rating = isNumber(profile?.rating) ? profile.rating : null;
  const reviews = isNumber(profile?.reviews) ? profile.reviews : null;

  let body;
  if (overview.status === "loading") {
    body = (
      <div className="gp-ov-rating-row" role="status">
        <Spinner animation="border" size="sm" aria-hidden="true" />
        <span className="gp-muted">Loading your rating…</span>
      </div>
    );
  } else if (overview.status === "error") {
    body = (
      <OverviewLoadError
        message={errorMessage(overview.error, "We couldn't load your rating. Please try again.")}
        onRetry={overview.reload}
      />
    );
  } else if (rating !== null) {
    body = (
      <div className="gp-ov-rating-row">
        <span className="gp-ov-rating-num">{rating.toFixed(1)}</span>
        <span className="gp-ov-rating-meta">
          <ReviewStars rating={rating} size={18} />
          <span className="gp-muted">
            out of 5 · {reviews !== null ? plural(reviews, "review", "reviews") : "review count not available yet"}
          </span>
        </span>
      </div>
    );
  } else {
    body = (
      <div className="gp-ov-rating-meta">
        <span className="gp-ov-fig-none">Not available yet</span>
        <span className="gp-muted">
          {reviews !== null ? plural(reviews, "review", "reviews") : "Google hasn't shared your rating yet."}
        </span>
      </div>
    );
  }

  return (
    <section className="gp-card gp-ov-rating" aria-labelledby="gp-ov-rating-title">
      <h3 className="gp-h3" id="gp-ov-rating-title">
        Your rating on Google
      </h3>
      {body}
      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-primary" onClick={() => onOpenTab?.("reviews", true)}>
          See and answer reviews
        </button>
      </div>
    </section>
  );
}

export default function OverviewTab({ onOpenTab }) {
  const [days, setDays] = useState(30);

  return (
    <div className="gp-stack gp-ov">
      <section className="gp-stack-sm" aria-labelledby="gp-ov-numbers-title">
        <div className="gp-ov-head">
          <div className="gp-ov-head-text">
            <h3 className="gp-h3" id="gp-ov-numbers-title">
              How people found you on Google
            </h3>
            <p className="gp-note">These numbers come from your Google Business Profile.</p>
          </div>
          <div className="gp-ov-seg" role="group" aria-label="Period">
            {PERIODS.map((d) => (
              <button
                key={d}
                type="button"
                className={`gp-ov-seg-btn${d === days ? " is-on" : ""}`}
                aria-pressed={d === days}
                onClick={() => setDays(d)}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
        <Performance days={days} />
      </section>
      <RatingCard onOpenTab={onOpenTab} />
    </div>
  );
}
