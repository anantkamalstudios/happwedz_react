// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Reviews tab — built by helper D. Google reviews with stars and filters, unanswered first; AI draft, edit, publish (vendor's Publish = approval), edit or delete a published reply; Sync now.
// API: gpManageApi in src/services/api/googleProfileApi.js. Shapes: GrowthOS ReviewsStatus, Review and the review list
// with meta { page, page_size, total, counts } (growthos-web/src/contracts/reviews.ts). Never sample reviews.
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";
import { Callout } from "../GpParts";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import OverviewLoadError from "./OverviewLoadError";
import useOverviewLoad from "./OverviewLoad";
import ReviewCard from "./ReviewCard";
import { REVIEWS_PAGE_SIZE, REVIEW_FILTERS, errorInfo, formatWhen, plural } from "./ReviewFormat";

const EMPTY_LIST = { status: "idle", filter: null, items: [], meta: null, error: null };

/** What the tab shows (GrowthOS reviewsView): the list, or why there are no reviews. */
function viewOf(status) {
  if (!status) return "loading";
  if ((status.total_reviews ?? 0) > 0) return "list";
  if (!status.google_connected) return "disconnected";
  if (!status.sync_available) return "waiting";
  return "empty";
}

const EMPTY_WORDS = {
  disconnected: {
    title: "Google isn't connected",
    body: "Reviews come from your Google Business Profile. They appear here once your profile is connected.",
  },
  waiting: {
    title: "Waiting for Google to verify your profile",
    body: "Google reviews can be read once your profile is verified. They appear here after that.",
  },
  empty: {
    title: "No reviews yet",
    body: "When people review you on Google, their reviews appear here, and you can answer them.",
  },
};

function ListLoading({ label }) {
  return (
    <div role="status">
      <span className="visually-hidden">{label}</span>
      <ul className="gp-rv-list" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="gp-rv-card gp-ov-skel gp-rv-skel" />
        ))}
      </ul>
    </div>
  );
}

function Empty({ title, children, action }) {
  return (
    <div className="gp-ov-empty">
      <p className="gp-ov-empty-title">{title}</p>
      <p className="gp-lead">{children}</p>
      {action}
    </div>
  );
}

export default function ReviewsTab() {
  const status = useOverviewLoad(() => gpManageApi.reviewsStatus(), "reviews-status");
  const info = status.data;
  const view = status.status === "error" ? "error" : viewOf(info);

  const [filter, setFilter] = useState("all");
  const [reload, setReload] = useState(0);
  const [list, setList] = useState(EMPTY_LIST);
  const [more, setMore] = useState({ busy: false, error: null, notice: "" });
  const [sync, setSync] = useState({ busy: false, error: null, notice: "" });
  const request = useRef(0);
  const listRef = useRef(null);
  const focusFrom = useRef(null);

  // Page 1 of the chosen filter; again after Sync now or Try again.
  useEffect(() => {
    if (view !== "list") return;
    const id = ++request.current;
    setList((l) => ({ ...l, status: "loading", error: null }));
    setMore({ busy: false, error: null, notice: "" });
    gpManageApi
      .reviews({ filter, page: 1, page_size: REVIEWS_PAGE_SIZE })
      .then(({ data, meta }) => {
        if (request.current !== id) return;
        setList({ status: "ready", filter, items: Array.isArray(data) ? data : [], meta, error: null });
      })
      .catch((error) => {
        if (request.current !== id) return;
        setList({ status: "error", filter, items: [], meta: null, error });
      });
  }, [view, filter, reload]);

  // After "Load more", focus moves to the first new review.
  useEffect(() => {
    if (focusFrom.current === null) return;
    const cards = listRef.current?.querySelectorAll(".gp-rv-card");
    const target = cards?.[focusFrom.current];
    focusFrom.current = null;
    target?.focus();
  }, [list.items.length]);

  const meta = list.meta;
  const counts = meta?.counts || null;
  const hasMore = Boolean(meta) && typeof meta.total === "number" && list.items.length < meta.total;

  const loadMore = async () => {
    const id = request.current;
    const nextPage = (meta?.page ?? 1) + 1;
    setMore({ busy: true, error: null, notice: "" });
    try {
      const { data, meta: nextMeta } = await gpManageApi.reviews({ filter, page: nextPage, page_size: REVIEWS_PAGE_SIZE });
      if (request.current !== id) return;
      const fresh = Array.isArray(data) ? data : [];
      setList((l) => {
        const known = new Set(l.items.map((r) => r.id));
        const added = fresh.filter((r) => !known.has(r.id));
        focusFrom.current = added.length ? l.items.length : null;
        return { ...l, items: [...l.items, ...added], meta: nextMeta || l.meta };
      });
      setMore({ busy: false, error: null, notice: `${plural(fresh.length, "more review", "more reviews")} loaded.` });
    } catch (error) {
      if (request.current !== id) return;
      setMore({ busy: false, error: errorInfo(error), notice: "" });
    }
  };

  const syncNow = async () => {
    setSync({ busy: true, error: null, notice: "" });
    try {
      const result = await gpManageApi.syncReviews();
      const found = typeof result?.new_reviews === "number" ? result.new_reviews : null;
      const drafted = typeof result?.drafted === "number" ? result.drafted : 0;
      let notice = found === null ? "Synced with Google." : found === 0 ? "Synced. No new reviews." : `Synced. ${plural(found, "new review", "new reviews")}.`;
      if (drafted > 0) notice += ` AI wrote ${plural(drafted, "draft reply", "draft replies")} for you to check.`;
      setSync({ busy: false, error: null, notice });
      status.reload();
      setReload((n) => n + 1);
    } catch (error) {
      setSync({ busy: false, error: errorInfo(error), notice: "" });
    }
  };

  // A review changed on its card: keep it in the list and keep the "need a reply" count right.
  const onReviewChange = (next, before) => {
    if (!next) return;
    setList((l) => {
      const items = l.items.map((r) => (r.id === next.id ? next : r));
      let nextMeta = l.meta;
      const was = before?.reply_status === "published";
      const now = next.reply_status === "published";
      if (l.meta?.counts && was !== now) {
        const step = now ? 1 : -1;
        const c = l.meta.counts;
        nextMeta = {
          ...l.meta,
          counts: {
            ...c,
            answered: Math.max(0, (c.answered ?? 0) + step),
            unanswered: Math.max(0, (c.unanswered ?? 0) - step),
          },
        };
      }
      return { ...l, items, meta: nextMeta };
    });
  };

  const chooseFilter = (id) => {
    if (id === filter) return;
    setFilter(id);
  };

  // Status line: "128 reviews · 5 need a reply · Last synced 21 Oct, 14:05".
  const line = [];
  if (info) {
    line.push(plural(info.total_reviews ?? 0, "review", "reviews"));
    if (counts && typeof counts.unanswered === "number") {
      line.push(counts.unanswered === 0 ? "all replied" : `${formatNumberSafe(counts.unanswered)} ${counts.unanswered === 1 ? "needs" : "need"} a reply`);
    }
    line.push(info.last_synced_at ? `Last synced ${formatWhen(info.last_synced_at)}` : "Not synced yet");
  }

  let body;
  if (view === "error") {
    body = <OverviewLoadError message={errorInfo(status.error, "We couldn't load your reviews. Please try again.").message} onRetry={status.reload} />;
  } else if (view === "loading") {
    body = <ListLoading label="Loading your reviews…" />;
  } else if (view !== "list") {
    const words = EMPTY_WORDS[view];
    body = <Empty title={words.title}>{words.body}</Empty>;
  } else {
    const sameFilter = list.filter === filter;
    let listBody;
    if ((list.status === "loading" || list.status === "idle") && (!sameFilter || list.items.length === 0)) {
      listBody = <ListLoading label="Loading reviews…" />;
    } else if (list.status === "error") {
      listBody = (
        <OverviewLoadError
          message={errorInfo(list.error, "We couldn't load your reviews. Please try again.").message}
          onRetry={() => setReload((n) => n + 1)}
        />
      );
    } else if (list.items.length === 0) {
      listBody = (
        <Empty
          title="No reviews here"
          action={
            filter !== "all" && (
              <div className="gp-btns">
                <button type="button" className="gp-btn gp-btn-ghost" onClick={() => chooseFilter("all")}>
                  Show all reviews
                </button>
              </div>
            )
          }
        >
          No reviews match this filter.
        </Empty>
      );
    } else {
      const busy = list.status === "loading";
      listBody = (
        <>
          <ul className={`gp-rv-list${busy ? " is-busy" : ""}`} ref={listRef} aria-busy={busy || undefined}>
            {list.items.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} publishAvailable={info?.publish_available !== false} onChange={onReviewChange} />
              </li>
            ))}
          </ul>
          {more.error && (
            <Callout tone="bad" role="alert">
              {more.error.message}
            </Callout>
          )}
          {hasMore && (
            <div className="gp-btns gp-rv-more">
              <button type="button" className="gp-btn gp-btn-ghost" onClick={loadMore} disabled={more.busy || busy} aria-busy={more.busy || undefined}>
                {more.busy && <Spinner animation="border" size="sm" aria-hidden="true" />}
                Load more reviews
              </button>
              <span className="gp-note">
                Showing {formatNumberSafe(list.items.length)} of {formatNumberSafe(meta.total)}
              </span>
            </div>
          )}
        </>
      );
    }

    body = (
      <>
        <div className="gp-rv-filters" role="group" aria-label="Show reviews">
          {REVIEW_FILTERS.map((f) => {
            const count = counts && typeof counts[f.id] === "number" ? counts[f.id] : null;
            return (
              <button
                key={f.id}
                type="button"
                className={`gp-ov-seg-btn gp-rv-filter${f.id === filter ? " is-on" : ""}`}
                aria-pressed={f.id === filter}
                onClick={() => chooseFilter(f.id)}
              >
                {f.label}
                {count !== null && <span className="gp-rv-filter-count"> ({formatNumberSafe(count)})</span>}
              </button>
            );
          })}
        </div>
        {listBody}
      </>
    );
  }

  return (
    <div className="gp-stack gp-rv">
      <div className="gp-rv-top">
        <div className="gp-ov-head-text">
          <h3 className="gp-h3">Google reviews</h3>
          {info && <p className="gp-note">{line.join(" · ")}</p>}
        </div>
        {info?.sync_available && (
          <button type="button" className="gp-btn gp-btn-ghost" onClick={syncNow} disabled={sync.busy} aria-busy={sync.busy || undefined}>
            {sync.busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiRefreshCw size={18} aria-hidden="true" />}
            Sync now
          </button>
        )}
      </div>

      {sync.notice && <Callout tone="ok">{sync.notice}</Callout>}

      {sync.error && (
        <Callout tone="bad" role="alert">
          {sync.error.message}
          {sync.error.hint && <span className="gp-rv-hint">{sync.error.hint}</span>}
        </Callout>
      )}

      {(info?.withheld_reviews ?? 0) > 0 && (
        <Callout tone="warn">
          Google shows {plural(info.withheld_reviews, "review", "reviews")} on your profile that it hasn't released yet. Google
          checks new reviews first, usually for a day or two. They appear here after that.
        </Callout>
      )}

      {view === "list" && info?.publish_available === false && (
        <Callout tone="warn">
          Replies can't go on Google until Google verifies your profile. You can write and save replies now.
        </Callout>
      )}

      {body}

      <p className="visually-hidden" aria-live="polite">
        {sync.notice || more.notice}
      </p>
    </div>
  );
}

function formatNumberSafe(n) {
  return typeof n === "number" && Number.isFinite(n) ? Math.round(n).toLocaleString("en-IN") : "";
}
