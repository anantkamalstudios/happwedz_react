// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Posts tab — built by helper E. Drafts, scheduled and published Google posts with a status filter; Write a post (with
// AI help, an image, publish now or schedule); edit a draft or a post on Google; cancel a schedule; delete with a check.
// API: gpManageApi.posts / deletePost / unschedulePost (the editor is PostEditor.jsx). Shapes: GrowthOS postSchema.
import { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiAlertTriangle, FiArrowUpRight, FiCalendar, FiEdit2, FiFileText, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import { formatWhen } from "../gpFormat";
import PostEditor from "./PostEditor";
import { AuthImage, ConfirmBox, EmptyBox, ErrorNote, TabError, TabLoading } from "./ProfileShared";
import { POST_CTA_LABELS, POST_TYPE_LABELS } from "./ProfileUtils";

const FILTERS = [
  { id: "", label: "All" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
];

const STATUS = {
  draft: { label: "Draft", chip: "gp-e-chip-muted" },
  scheduled: { label: "Scheduled", chip: "gp-chip-warn" },
  publishing: { label: "Publishing", chip: "gp-chip-warn" },
  published: { label: "Published", chip: "gp-chip-ok" },
};

const DONE = {
  draft: "Draft saved. It stays here until you publish or schedule it.",
  published: "Published on Google. Google may take a few minutes to show it.",
  scheduled: "Post scheduled. It goes on Google at the time you chose.",
  updated: "Post updated on Google. Google may take a few minutes to show the change.",
  unscheduled: "Schedule cancelled. The post is a draft again.",
  synced: "Read from Google. Posts made on Google now show here too.",
  deleted: "Post deleted.",
};

export default function PostsTab() {
  const [filter, setFilter] = useState("");
  const [state, setState] = useState({ status: "loading", posts: [], error: null });
  const [reloading, setReloading] = useState(false);
  const [editing, setEditing] = useState(null); // null | "new" | post
  const [deleting, setDeleting] = useState(null);
  const [rowBusy, setRowBusy] = useState(null);
  const [rowError, setRowError] = useState(null);
  const [done, setDone] = useState("");
  const returnFocus = useRef(null);
  const listTop = useRef(null);
  const request = useRef(0);

  const load = useCallback(async (status, quiet = false) => {
    const mine = ++request.current;
    if (quiet) setReloading(true);
    else setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const { data } = await gpManageApi.posts(status || undefined);
      if (mine === request.current) setState({ status: "ready", posts: Array.isArray(data) ? data : [], error: null });
    } catch (error) {
      if (mine !== request.current) return;
      if (quiet) setRowError(error);
      setState((s) => ({ ...s, status: quiet && s.status === "ready" ? "ready" : "error", error }));
    } finally {
      if (mine === request.current) setReloading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const openEditor = (target, trigger) => {
    returnFocus.current = trigger || null;
    setDone("");
    setRowError(null);
    setDeleting(null);
    setEditing(target);
  };

  const closeEditor = (message) => {
    setEditing(null);
    if (message) setDone(message);
    load(filter, true);
    // Back to where the vendor was: the button that opened the editor, or the list heading.
    window.requestAnimationFrame(() => {
      const target = returnFocus.current && document.body.contains(returnFocus.current) ? returnFocus.current : listTop.current;
      target?.focus();
    });
  };

  // "Refresh from Google": GrowthOS reads the profile and its posts now (once every 5 minutes).
  const [syncing, setSyncing] = useState(false);
  const syncGoogle = async () => {
    setSyncing(true);
    setRowError(null);
    setDone("");
    try {
      await gpManageApi.syncGoogle();
      setDone(DONE.synced);
      await load(filter, true);
    } catch (error) {
      setRowError(error);
    } finally {
      setSyncing(false);
    }
  };

  const unschedule = async (post) => {
    setRowBusy(post.id);
    setRowError(null);
    setDone("");
    try {
      await gpManageApi.unschedulePost(post.id);
      setDone(DONE.unscheduled);
      await load(filter, true);
    } catch (error) {
      setRowError(error);
    } finally {
      setRowBusy(null);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setRowBusy(deleting.id);
    setRowError(null);
    try {
      await gpManageApi.deletePost(deleting.id);
      setDeleting(null);
      setDone(DONE.deleted);
      listTop.current?.focus();
      await load(filter, true);
    } catch (error) {
      setRowError(error);
    } finally {
      setRowBusy(null);
    }
  };

  if (editing) {
    return (
      <div className="gp-e-tab">
        <PostEditor
          key={editing === "new" ? "new" : editing.id}
          post={editing === "new" ? null : editing}
          onDone={(kind) => closeEditor(DONE[kind])}
          onCancel={() => closeEditor("")}
        />
      </div>
    );
  }

  const writeButton = (
    <button type="button" className="gp-btn gp-btn-primary" onClick={(e) => openEditor("new", e.currentTarget)}>
      <FiPlus size={18} aria-hidden="true" />
      Write a post
    </button>
  );

  const filterLabel = FILTERS.find((f) => f.id === filter)?.label.toLowerCase();

  let body;
  if (state.status === "loading") body = <TabLoading label="Loading your posts…" />;
  else if (state.status === "error") body = <TabError error={state.error} onRetry={() => load(filter)} />;
  else if (state.posts.length === 0)
    body = (
      <EmptyBox icon={FiFileText} title={filter ? `No ${filterLabel} posts` : "No posts yet"} action={writeButton}>
        {filter
          ? "Try another filter, or write a new post."
          : "Posts tell people what's new: an update, an offer or an event. Write one and publish it now or later."}
      </EmptyBox>
    );
  else
    body = (
      <ul className="gp-e-list" aria-busy={reloading || undefined}>
        {state.posts.map((post) => {
          const status = STATUS[post.status] || STATUS.draft;
          const rejected = post.status === "published" && post.google_state === "REJECTED";
          const reviewing = post.status === "published" && post.google_state === "PROCESSING";
          // A post made on Google (not in GrowthOS) can be seen and deleted, not changed.
          const fromGoogle = post.imported_from_google === true;
          const canEdit = !fromGoogle && (post.status === "draft" || post.status === "published");
          const canDelete = canEdit || fromGoogle;
          const busy = rowBusy === post.id;
          return (
            <li key={post.id} className="gp-e-item">
              {post.image_url ? (
                <AuthImage src={post.image_url} alt="" className="gp-e-thumb" />
              ) : (
                <span className="gp-e-imgph gp-e-thumb" aria-hidden="true">
                  <FiFileText size={20} />
                </span>
              )}
              <div className="gp-e-item-body">
                <div className="gp-e-item-head">
                  <span className="gp-e-item-title">{post.topic}</span>
                  <span className={`gp-chip ${status.chip}`}>{status.label}</span>
                  <span className="gp-chip gp-chip-pink">{POST_TYPE_LABELS[post.post_type] || post.post_type}</span>
                  {fromGoogle && <span className="gp-chip gp-e-chip-muted">Made on Google</span>}
                  {post.ai_generated && <span className="gp-chip gp-e-chip-muted">AI text</span>}
                  {rejected && <span className="gp-chip gp-e-chip-bad">Rejected by Google</span>}
                  {reviewing && <span className="gp-chip gp-chip-warn">Google is reviewing it</span>}
                </div>
                <p className="gp-note">
                  {[
                    post.cta ? `Button: ${POST_CTA_LABELS[post.cta] || post.cta}` : null,
                    post.status === "published" && post.published_at ? `Published ${formatWhen(post.published_at)}` : null,
                    (post.status === "scheduled" || post.status === "publishing") && post.schedule_at
                      ? `Goes live ${formatWhen(post.schedule_at)}`
                      : null,
                    post.updated_at ? `Updated ${formatWhen(post.updated_at)}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {post.description && <p className="gp-e-clamp">{post.description}</p>}
                {rejected && (
                  <p className="gp-e-error">
                    Google did not accept this post. A phone number in the text is a common reason (use the Call now
                    button instead). Delete it and publish a corrected post.
                  </p>
                )}
                {post.status === "draft" && post.publish_error && (
                  <p className="gp-e-error">
                    <FiAlertTriangle size={14} aria-hidden="true" /> Not published: {post.publish_error}
                  </p>
                )}
                {deleting?.id === post.id ? (
                  <ConfirmBox
                    tone="bad"
                    title={`Delete “${post.topic}”?`}
                    confirmLabel="Delete post"
                    busy={busy}
                    error={rowError}
                    onConfirm={remove}
                    onCancel={() => {
                      setDeleting(null);
                      setRowError(null);
                    }}
                  >
                    {post.status === "published"
                      ? "It is also removed from your Google profile. This can't be undone."
                      : "This can't be undone."}
                  </ConfirmBox>
                ) : (
                  <div className="gp-e-row-actions">
                    {post.status === "published" && post.search_url && (
                      <a className="gp-btn gp-btn-ghost gp-e-btn-sm" href={post.search_url} target="_blank" rel="noopener noreferrer">
                        View on Google
                        <FiArrowUpRight size={16} aria-hidden="true" />
                        <span className="visually-hidden"> (opens in a new tab)</span>
                      </a>
                    )}
                    {post.status === "scheduled" && (
                      <button
                        type="button"
                        className="gp-btn gp-btn-ghost gp-e-btn-sm"
                        onClick={() => unschedule(post)}
                        disabled={busy}
                        aria-busy={busy || undefined}
                      >
                        {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCalendar size={16} aria-hidden="true" />}
                        Cancel schedule<span className="visually-hidden">: {post.topic}</span>
                      </button>
                    )}
                    {canEdit && (
                      <button type="button" className="gp-btn gp-btn-ghost gp-e-btn-sm" onClick={(e) => openEditor(post, e.currentTarget)} disabled={busy}>
                        <FiEdit2 size={16} aria-hidden="true" />
                        Edit<span className="visually-hidden">: {post.topic}</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        className="gp-btn gp-btn-ghost gp-e-btn-sm"
                        onClick={() => {
                          setRowError(null);
                          setDone("");
                          setDeleting(post);
                        }}
                        disabled={busy}
                      >
                        <FiTrash2 size={16} aria-hidden="true" />
                        Delete<span className="visually-hidden">: {post.topic}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="gp-e-tab">
      <div className="gp-e-head">
        <div className="gp-e-stack-sm">
          <h2 className="gp-h3" tabIndex={-1} ref={listTop}>
            Google posts
          </h2>
          <p className="gp-note">Updates, offers and events shown on your Google profile.</p>
        </div>
        {state.status === "ready" && state.posts.length > 0 && writeButton}
      </div>

      <div className="gp-e-filters" role="group" aria-label="Show posts">
        {FILTERS.map((f) => (
          <button
            key={f.id || "all"}
            type="button"
            className={`gp-e-filter${filter === f.id ? " is-active" : ""}`}
            aria-pressed={filter === f.id}
            onClick={() => {
              setDone("");
              setRowError(null);
              setDeleting(null);
              setFilter(f.id);
            }}
          >
            {f.label}
          </button>
        ))}
        <button type="button" className="gp-e-filter" onClick={syncGoogle} disabled={syncing} aria-busy={syncing || undefined}>
          <FiRefreshCw size={14} aria-hidden="true" /> {syncing ? "Reading Google…" : "Refresh from Google"}
        </button>
        {reloading && (
          <span role="status" className="gp-note gp-e-inline">
            <Spinner animation="border" size="sm" aria-hidden="true" /> Refreshing…
          </span>
        )}
      </div>

      <div aria-live="polite">{done && <Callout tone="ok">{done}</Callout>}</div>
      {rowError && !deleting && <ErrorNote error={rowError} />}
      {body}
    </div>
  );
}
