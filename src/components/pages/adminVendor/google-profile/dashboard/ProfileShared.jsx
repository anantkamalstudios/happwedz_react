// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Parts shared by helper E's tabs (Posts, Profile, Photos, Fixes): loading and error states, the server's error with
// its field messages, an in-place "are you sure?" box, and an image that loads with the vendor's token when needed.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiImage } from "react-icons/fi";
import { errorMessage, loadImage } from "../../../../../services/api/googleProfileApi";
import { Callout, RefreshButton } from "../GpParts";
import { fieldMessagesOf } from "./ProfileUtils";

/** The tab is loading. */
export function TabLoading({ label = "Loading…" }) {
  return (
    <div className="gp-e-state" role="status">
      <Spinner animation="border" size="sm" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/** The server's message (and its field messages), in red. */
export function ErrorNote({ error, fallback }) {
  if (!error) return null;
  const details = fieldMessagesOf(error);
  return (
    <Callout tone="bad" role="alert">
      <span>{errorMessage(error, fallback)}</span>
      {details.length > 0 && (
        <ul className="gp-list">
          {details.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </Callout>
  );
}

/** Loading failed: the message and "Try again". */
export function TabError({ error, onRetry, busy, fallback = "We couldn't load this. Please try again." }) {
  return (
    <div className="gp-e-stack">
      <ErrorNote error={error} fallback={fallback} />
      <div className="gp-btns">
        <RefreshButton primary busy={busy} onClick={onRetry}>
          Try again
        </RefreshButton>
      </div>
    </div>
  );
}

/** Nothing to show yet. */
export function EmptyBox({ icon = FiImage, title, children, action }) {
  const Icon = icon;
  return (
    <div className="gp-e-empty">
      <span className="gp-state-icon" aria-hidden="true">
        <Icon size={26} />
      </span>
      <h3 className="gp-h3">{title}</h3>
      {children && <p className="gp-lead">{children}</p>}
      {action && <div className="gp-btns gp-e-center">{action}</div>}
    </div>
  );
}

/**
 * "Are you sure?" shown in place (no pop-up). Takes focus when it opens; Escape or Cancel closes it.
 * `tone` is "bad" for deleting and "warn" for anything else.
 */
export function ConfirmBox({ title, children, confirmLabel, busy, tone = "warn", error, onConfirm, onCancel }) {
  const id = useId();
  const headingRef = useRef(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <div
      className={`gp-e-confirm is-${tone}`}
      role="alertdialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={children ? `${id}-body` : undefined}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !busy) {
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <p id={`${id}-title`} className="gp-e-confirm-title" tabIndex={-1} ref={headingRef}>
        {title}
      </p>
      {children && (
        <div id={`${id}-body`} className="gp-note">
          {children}
        </div>
      )}
      <ErrorNote error={error} />
      <div className="gp-btns">
        <button
          type="button"
          className={`gp-btn ${tone === "bad" ? "gp-e-btn-danger" : "gp-btn-primary"}`}
          onClick={onConfirm}
          disabled={busy}
          aria-busy={busy || undefined}
        >
          {busy && <Spinner animation="border" size="sm" aria-hidden="true" />}
          {confirmLabel}
        </button>
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
    </div>
  );
}

const TOKEN_IMAGES = "/vendor/google-profile/images/";

/**
 * An image. Google's own URLs load as they are; images the HappyWedz server serves
 * (/vendor/google-profile/images/…) need the vendor's token, so they load through loadImage
 * and the object URL is revoked when the image leaves the screen.
 */
export function AuthImage({ src, alt = "", className = "", loading = "lazy" }) {
  const needsToken = typeof src === "string" && src.startsWith(TOKEN_IMAGES);
  const [loaded, setLoaded] = useState({ src: null, url: null, failed: false });
  const [broken, setBroken] = useState(null);

  useEffect(() => {
    if (!needsToken) return undefined;
    let alive = true;
    let objectUrl = null;
    loadImage(src)
      .then((url) => {
        if (alive) {
          objectUrl = url;
          setLoaded({ src, url, failed: false });
        } else if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      })
      .catch(() => {
        if (alive) setLoaded({ src, url: null, failed: true });
      });
    return () => {
      alive = false;
      if (objectUrl?.startsWith("blob:")) URL.revokeObjectURL(objectUrl);
    };
  }, [src, needsToken]);

  const shown = needsToken ? (loaded.src === src ? loaded.url : null) : src;
  const failed = !src || broken === src || (needsToken && loaded.src === src && loaded.failed);

  if (failed || !shown) {
    return (
      <span
        className={`gp-e-imgph ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt ? `${alt}${failed ? " (not available)" : ""}` : undefined}
        aria-hidden={alt ? undefined : "true"}
      >
        {failed ? <FiImage size={22} aria-hidden="true" /> : <Spinner animation="border" size="sm" aria-hidden="true" />}
      </span>
    );
  }
  return <img src={shown} alt={alt} className={className} loading={loading} onError={() => setBroken(src)} />;
}
