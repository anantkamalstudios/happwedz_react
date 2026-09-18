import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { einviteApi } from "../../services/api/einviteApi";
import EinvitePage from "../layouts/einvites/design/EinvitePage";
import {
  cardFonts,
  cardPath,
  getCardPages,
  loadFonts,
  pageTitle,
} from "../layouts/einvites/design/einviteDesign";
import "../layouts/einvites/einviteStudio.css";

// A guest's last reply is kept on their device so they can see and change it.
const replyKey = (token, id) => `einvite-rsvp:${token || id}`;
const readReply = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const saveReply = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private browsing): the reply just isn't remembered.
  }
};

const RsvpForm = ({ pages, initial, onSubmit, submitting }) => {
  const [form, setForm] = useState({
    guestName: initial?.guestName || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    attending: initial?.attending || "",
    events: initial?.events || pages.map((page) => page.id),
    guestCount: initial?.guestCount || 1,
    message: initial?.message || "",
  });
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const toggleEvent = (id) =>
    set({ events: form.events.includes(id) ? form.events.filter((value) => value !== id) : [...form.events, id] });

  return (
    <form
      className="text-start"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="rsvp-name">Your name</label>
        <input id="rsvp-name" className="eiv-text-input" required maxLength={120}
          value={form.guestName} onChange={(e) => set({ guestName: e.target.value })} />
      </div>

      <fieldset className="mb-3">
        <legend className="form-label fw-semibold fs-6">Will you attend?</legend>
        <div className="eiv-answer-group">
          {[["yes", "Yes, I'll be there"], ["maybe", "Maybe"], ["no", "Sorry, can't make it"]].map(([value, label]) => (
            <label key={value} className={form.attending === value ? "is-on" : ""}>
              <input type="radio" name="rsvp-attending" value={value} required
                checked={form.attending === value} onChange={() => set({ attending: value })} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {form.attending !== "no" && (
        <>
          {pages.length > 1 && (
            <fieldset className="mb-3">
              <legend className="form-label fw-semibold fs-6">Which functions?</legend>
              <div className="eiv-card-picker">
                {pages.map((page, index) => (
                  <label key={page.id} className={form.events.includes(page.id) ? "is-on" : ""}>
                    <input type="checkbox" checked={form.events.includes(page.id)} onChange={() => toggleEvent(page.id)} />
                    {pageTitle(page, index)}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="rsvp-count">Number of people (including you)</label>
            <select id="rsvp-count" className="form-select" value={form.guestCount}
              onChange={(e) => set({ guestCount: Number(e.target.value) })}>
              {Array.from({ length: 20 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>{count}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="row g-2 mb-3">
        <div className="col-sm-6">
          <label className="form-label fw-semibold" htmlFor="rsvp-phone">Phone <span className="fw-normal text-muted">(optional)</span></label>
          <input id="rsvp-phone" className="eiv-text-input" inputMode="tel" maxLength={20}
            value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
        </div>
        <div className="col-sm-6">
          <label className="form-label fw-semibold" htmlFor="rsvp-email">Email <span className="fw-normal text-muted">(optional)</span></label>
          <input id="rsvp-email" type="email" className="eiv-text-input" maxLength={120}
            value={form.email} onChange={(e) => set({ email: e.target.value })} />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold" htmlFor="rsvp-message">Message for the couple <span className="fw-normal text-muted">(optional)</span></label>
        <textarea id="rsvp-message" className="eiv-text-input" rows={3} maxLength={1000}
          value={form.message} onChange={(e) => set({ message: e.target.value })} />
      </div>

      <button type="submit" className="eiv-primary-btn w-100 justify-content-center" disabled={submitting}>
        {submitting ? "Sending..." : "Send reply"}
      </button>
    </form>
  );
};

// What guests see. /einvites/i/:token shows the cards chosen for that link
// (and greets a guest by name on a personal link); /einvites/view/:id shows
// every card.
const EinviteViewPage = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState(() => readReply(replyKey(token, id)));
  const [editingReply, setEditingReply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const load = token
      ? einviteApi.getInvite(token).then((data) => ({ card: data?.card, link: data?.link }))
      : einviteApi.getCard(id).then((data) => ({ card: data, link: null }));
    load
      .then((result) => {
        if (cancelled) return;
        if (result.card?.isTemplate) {
          navigate(cardPath(result.card), { replace: true });
          return;
        }
        setCard(result.card);
        setLink(result.link);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "This invitation could not be found.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, token, navigate]);

  const pages = useMemo(() => getCardPages(card), [card]);
  useEffect(() => {
    if (pages.length) loadFonts(cardFonts(pages));
  }, [pages]);

  const submitRsvp = async (form) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const events = form.attending === "yes" || form.attending === "maybe" ? form.events : [];
      await einviteApi.sendRsvp({ token, cardId: card.id, ...form, events });
      const saved = { ...form, events, sentAt: new Date().toISOString() };
      saveReply(replyKey(token, id), saved);
      setReply(saved);
      setEditingReply(false);
    } catch (err) {
      setSubmitError(err.message || "Couldn't send your reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="eiv">
        <div className="container py-5 text-center">
          <div className="spinner-border" style={{ color: "#ed1173" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="eiv-status mt-3">Opening your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !card || pages.length === 0) {
    return (
      <div className="eiv">
        <div className="eiv-empty">
          <h3>Invitation not found</h3>
          <p>{error || "This invitation is no longer available."}</p>
          <Link className="eiv-outline-btn" to="/">Go to HappyWedz</Link>
        </div>
      </div>
    );
  }

  const guestName = link?.guestName;
  const answerText = { yes: "You're coming", maybe: "You might come", no: "You can't make it" };

  return (
    <div className="eiv eiv-invite">
      <div className="container py-4 py-md-5">
        <div className="mx-auto" style={{ maxWidth: 480 }}>
          <div className="text-center mb-4">
            <p className="eiv-eyebrow mb-2">{guestName ? `Dear ${guestName}` : "You're invited"}</p>
            <h1 className="eiv-info-title mb-1">{card.name || "Wedding Invitation"}</h1>
            {pages.length > 1 && (
              <p className="eiv-status mb-0">{pages.map((page, index) => pageTitle(page, index)).join(" · ")}</p>
            )}
          </div>

          {pages.map((page, index) => (
            <section key={page.id} className="mb-4" aria-label={pageTitle(page, index)}>
              {pages.length > 1 && <h2 className="eiv-invite-event">{pageTitle(page, index)}</h2>}
              <EinvitePage page={page} style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.16)", borderRadius: 4 }} />
            </section>
          ))}

          <div className="eiv-info" id="rsvp">
            {reply && !editingReply ? (
              <div className="text-center">
                <FiCheckCircle size={40} style={{ color: "#1a9c5b" }} />
                <h2 className="eiv-info-title mt-2 mb-1">Thank you{reply.guestName ? `, ${reply.guestName}` : ""}!</h2>
                <p className="eiv-status mb-3">
                  {answerText[reply.attending] || "Your reply was sent"}
                  {reply.attending !== "no" && pages.length > 1 && reply.events?.length > 0 &&
                    ` · ${pages
                      .map((page, index) => (reply.events.includes(page.id) ? pageTitle(page, index) : null))
                      .filter(Boolean)
                      .join(", ")}`}
                </p>
                <button type="button" className="eiv-outline-btn" onClick={() => setEditingReply(true)}>
                  Change my reply
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-3">
                  <FaHeart size={22} style={{ color: "#ed1173" }} />
                  <h2 className="eiv-info-title mt-2 mb-1">RSVP</h2>
                  <p className="eiv-status mb-0">Please let us know if you can join us.</p>
                </div>
                {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
                <RsvpForm
                  pages={pages}
                  initial={reply || { guestName: guestName || "" }}
                  onSubmit={submitRsvp}
                  submitting={submitting}
                />
              </>
            )}
          </div>

          <p className="text-center eiv-status small mt-4 mb-0">
            Made with <Link to="/einvites">HappyWedz e-invites</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EinviteViewPage;
