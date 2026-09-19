import React from "react";
import { Spinner } from "react-bootstrap";
import { FiRefreshCw } from "react-icons/fi";

export function LoadingState() {
  return (
    <div className="igd-panel igd-state">
      <Spinner animation="border" size="sm" />
    </div>
  );
}

export function EmptyState({ icon, title, text, action }) {
  return (
    <div className="igd-panel igd-state">
      {icon && <span className="igd-state-icon">{icon}</span>}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export function FeedErrorBanner({ error, onRetry, onReconnect }) {
  return (
    <div className="igd-alert" role="alert">
      <span>{error.message}</span>
      {error.reconnect ? (
        <button type="button" className="igd-btn igd-btn-primary" onClick={onReconnect}>
          Reconnect
        </button>
      ) : (
        <button type="button" className="igd-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function RefreshButton({ onClick, busy, disabled }) {
  return (
    <button type="button" className="igd-btn" onClick={onClick} disabled={busy || disabled}>
      {busy ? <Spinner animation="border" size="sm" /> : <FiRefreshCw size={16} />}
      Refresh
    </button>
  );
}
