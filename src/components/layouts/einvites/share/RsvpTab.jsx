import React, { useCallback, useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { einviteApi } from "../../../../services/api/einviteApi";
import { pageTitle } from "../design/einviteDesign";
import { formatDate } from "./shareUtils";

const ANSWERS = {
  yes: { label: "Attending", className: "is-yes" },
  no: { label: "Not attending", className: "is-no" },
  maybe: { label: "Maybe", className: "is-maybe" },
};

const RsvpTab = ({ card, pages, onCount }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    einviteApi
      .getRsvps(card.id)
      .then((result) => {
        setData(result);
        onCount?.(result?.summary?.responses || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [card.id, onCount]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) return <div className="eiv-status py-3">Loading replies...</div>;
  if (error) return <div className="alert alert-danger py-2">{error}</div>;

  const summary = data?.summary || { responses: 0, yes: 0, no: 0, maybe: 0, headcount: 0, events: [] };
  const rsvps = (data?.data || []).filter((rsvp) => filter === "all" || rsvp.attending === filter);
  const eventName = (id) => {
    const index = pages.findIndex((page) => page.id === id);
    return index >= 0 ? pageTitle(pages[index], index) : null;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="eiv-status mb-0">Replies from everyone you've shared the invitation with.</p>
        <button type="button" className="eiv-chip-btn" onClick={load} disabled={loading}>
          <FiRefreshCw size={15} /> {loading ? "Refreshing" : "Refresh"}
        </button>
      </div>

      <div className="eiv-stat-row">
        <div className="eiv-stat">
          <strong>{summary.yes}</strong>
          <span>Attending</span>
          <small>{summary.headcount} {summary.headcount === 1 ? "person" : "people"}</small>
        </div>
        <div className="eiv-stat">
          <strong>{summary.maybe}</strong>
          <span>Maybe</span>
        </div>
        <div className="eiv-stat">
          <strong>{summary.no}</strong>
          <span>Not attending</span>
        </div>
        <div className="eiv-stat">
          <strong>{summary.responses}</strong>
          <span>Replies</span>
        </div>
      </div>

      {pages.length > 1 && summary.events.length > 0 && (
        <div className="eiv-event-counts">
          {summary.events.map((event) => (
            <div key={event.id}>
              <span>{eventName(event.id) || event.name}</span>
              <strong>{event.headcount} {event.headcount === 1 ? "person" : "people"}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="eiv-rsvp-filter" role="tablist" aria-label="Filter replies">
        {[["all", "All"], ["yes", "Attending"], ["maybe", "Maybe"], ["no", "Not attending"]].map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={filter === value}
            className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      {rsvps.length === 0 ? (
        <div className="eiv-status py-4 text-center">
          {summary.responses === 0 ? "No replies yet. Share your invitation to start collecting RSVPs." : "No replies in this list."}
        </div>
      ) : (
        <div className="eiv-guest-table">
          {rsvps.map((rsvp) => {
            const answer = ANSWERS[rsvp.attending] || ANSWERS.maybe;
            const events = (rsvp.events || []).map(eventName).filter(Boolean);
            return (
              <div key={rsvp.id} className="eiv-rsvp-row">
                <div className="d-flex flex-wrap justify-content-between gap-2">
                  <div className="fw-semibold">
                    {rsvp.guestName}
                    <span className={`eiv-rsvp-badge ${answer.className}`}>{answer.label}</span>
                  </div>
                  <span className="eiv-link-sub">{formatDate(rsvp.updatedAt)}</span>
                </div>
                <div className="eiv-link-sub">
                  {[
                    rsvp.attending !== "no" && `${rsvp.guestCount} ${rsvp.guestCount === 1 ? "person" : "people"}`,
                    rsvp.attending !== "no" && pages.length > 1 && events.length > 0 && events.join(", "),
                    rsvp.phone,
                    rsvp.email,
                    rsvp.linkLabel && `via ${rsvp.linkLabel}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                {rsvp.message && <div className="eiv-rsvp-message">“{rsvp.message}”</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RsvpTab;
