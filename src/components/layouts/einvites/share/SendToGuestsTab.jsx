import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { FiCopy, FiMail, FiSend } from "react-icons/fi";
import axiosInstance from "../../../../services/api/axiosInstance";
import { einviteApi } from "../../../../services/api/einviteApi";
import CardPicker from "./CardPicker";
import { copyText, emailUrl, inviteMessage, openAfter, pickedPageIds, shareLinkUrl, whatsappNumber, whatsappUrl } from "./shareUtils";

const STATUS_CLASS = { Attending: "is-yes", "Not Attending": "is-no", Pending: "is-maybe" };

// Guests from the couple's guest list. Each guest gets a personal link, so
// their reply updates their entry in the guest list.
const SendToGuestsTab = ({ card, pages, userId }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState(pages.map((page) => page.id));
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [busyGuestId, setBusyGuestId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axiosInstance
      .get(`/guestlist/user/${userId}`)
      .then((res) => !cancelled && setGuests(Array.isArray(res.data?.guests) ? res.data.guests : []))
      .catch(() => !cancelled && setError("Couldn't load your guest list."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const groups = useMemo(
    () => [...new Set(guests.map((guest) => String(guest.group || "").trim()).filter(Boolean))].sort(),
    [guests]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return guests.filter(
      (guest) =>
        (!group || String(guest.group || "").trim() === group) &&
        (!term ||
          String(guest.name || "").toLowerCase().includes(term) ||
          String(guest.phone_number || "").includes(term) ||
          String(guest.email || "").toLowerCase().includes(term))
    );
  }, [guests, group, search]);

  const allVisibleChecked = visible.length > 0 && visible.every((guest) => checked.includes(guest.id));
  const toggleAll = () =>
    setChecked(allVisibleChecked ? checked.filter((id) => !visible.some((guest) => guest.id === id)) : [...new Set([...checked, ...visible.map((guest) => guest.id)])]);
  const toggle = (id) => setChecked(checked.includes(id) ? checked.filter((value) => value !== id) : [...checked, id]);

  const ensureCards = () => {
    if (cards.length > 0) return true;
    Swal.fire({ text: "Pick at least one card to send.", icon: "error" });
    return false;
  };

  const personalLink = async (guest) => {
    const [result] = await einviteApi.createGuestLinks(card.id, {
      guestIds: [guest.id],
      pageIds: pickedPageIds(pages, cards),
    });
    if (!result?.link?.token) throw new Error("Couldn't create the link");
    return shareLinkUrl(result.link.token);
  };

  const withGuest = async (guest, action) => {
    if (!ensureCards()) return;
    setBusyGuestId(guest.id);
    try {
      await action();
    } catch (err) {
      Swal.fire({ text: err.message || "Something went wrong", icon: "error" });
    } finally {
      setBusyGuestId(null);
    }
  };

  const sendWhatsApp = (guest) =>
    withGuest(guest, () =>
      openAfter(async () => whatsappUrl(inviteMessage({ cardName: card.name, url: await personalLink(guest), guestName: guest.name }), guest.phone_number))
    );

  const copyLink = (guest) =>
    withGuest(guest, async () => {
      const url = await personalLink(guest);
      const ok = await copyText(url);
      Swal.fire({ text: ok ? `Link for ${guest.name} copied` : url, icon: ok ? "success" : "info", timer: ok ? 1500 : undefined, showConfirmButton: !ok });
    });

  const sendEmail = (guest) =>
    withGuest(guest, () =>
      openAfter(async () =>
        emailUrl({
          to: guest.email,
          subject: `You're invited: ${card.name}`,
          body: inviteMessage({ cardName: card.name, url: await personalLink(guest), guestName: guest.name }),
        })
      )
    );

  const emailSelected = async () => {
    if (!ensureCards()) return;
    const selectedGuests = guests.filter((guest) => checked.includes(guest.id));
    const withEmail = selectedGuests.filter((guest) => String(guest.email || "").includes("@"));
    if (withEmail.length === 0) {
      Swal.fire({ text: "None of the selected guests have an email address.", icon: "info" });
      return;
    }
    const { isConfirmed } = await Swal.fire({
      text: `Email your invitation to ${withEmail.length} ${withEmail.length === 1 ? "guest" : "guests"}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Send",
      confirmButtonColor: "#ed1173",
    });
    if (!isConfirmed) return;

    setSending(true);
    try {
      const result = await einviteApi.sendGuestEmails(card.id, {
        guestIds: selectedGuests.map((guest) => guest.id),
        pageIds: pickedPageIds(pages, cards),
        message: message.trim(),
      });
      const skipped = result?.skipped || [];
      Swal.fire({
        icon: "success",
        html: `Sent to <b>${result?.sent || 0}</b> ${result?.sent === 1 ? "guest" : "guests"}.${
          skipped.length ? `<br/><small>${skipped.length} skipped (no email address or sending failed).</small>` : ""
        }`,
      });
      setChecked([]);
    } catch (err) {
      Swal.fire({ text: err.message, icon: "error" });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="eiv-status py-3">Loading your guest list...</div>;
  if (error) return <div className="alert alert-danger py-2">{error}</div>;

  if (guests.length === 0) {
    return (
      <div className="eiv-empty py-4">
        <h3>Your guest list is empty</h3>
        <p>Add guests with their phone numbers and emails, then send each of them a personal invitation from here.</p>
        <Link to="/user-dashboard/guest-list" className="eiv-outline-btn">Open guest list</Link>
      </div>
    );
  }

  return (
    <div>
      <p className="eiv-status">
        Each guest gets a personal link. When they reply, their status in your{" "}
        <Link to="/user-dashboard/guest-list">guest list</Link> updates too.
      </p>

      {pages.length > 1 && (
        <div className="mb-3">
          <div className="small fw-semibold mb-2">Cards to send</div>
          <CardPicker pages={pages} selected={cards} onChange={setCards} idPrefix="send" />
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select eiv-select" value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Guest group">
          <option value="">All groups</option>
          {groups.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          className="eiv-text-input flex-grow-1"
          style={{ width: "auto", minWidth: 180 }}
          placeholder="Search guests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search guests"
        />
      </div>

      <div className="eiv-guest-table">
        <div className="eiv-guest-head">
          <label className="d-flex align-items-center gap-2 mb-0">
            <input type="checkbox" checked={allVisibleChecked} onChange={toggleAll} />
            {visible.length} {visible.length === 1 ? "guest" : "guests"}
          </label>
          <span>{checked.length} selected</span>
        </div>
        {visible.map((guest) => (
          <div key={guest.id} className="eiv-guest-row">
            <input type="checkbox" checked={checked.includes(guest.id)} onChange={() => toggle(guest.id)} aria-label={`Select ${guest.name}`} />
            <div className="eiv-guest-info">
              <div className="fw-semibold">
                {guest.name}
                {guest.status && <span className={`eiv-rsvp-badge ${STATUS_CLASS[guest.status] || ""}`}>{guest.status}</span>}
              </div>
              <div className="eiv-link-sub">
                {[guest.group, guest.phone_number, guest.email].filter(Boolean).join(" · ") || "No contact details"}
              </div>
            </div>
            <div className="eiv-link-actions">
              <button
                type="button"
                className="eiv-chip-btn is-whatsapp"
                disabled={busyGuestId === guest.id || !whatsappNumber(guest.phone_number)}
                title={whatsappNumber(guest.phone_number) ? "Open WhatsApp with the message ready" : "Add a phone number in your guest list"}
                onClick={() => sendWhatsApp(guest)}
              >
                <FaWhatsapp size={15} /> <span className="d-none d-sm-inline">WhatsApp</span>
              </button>
              <button
                type="button"
                className="eiv-chip-btn"
                disabled={busyGuestId === guest.id || !String(guest.email || "").includes("@")}
                title="Open your email app with the message ready"
                onClick={() => sendEmail(guest)}
              >
                <FiMail size={15} /> <span className="d-none d-sm-inline">Email</span>
              </button>
              <button type="button" className="eiv-chip-btn" disabled={busyGuestId === guest.id} title="Copy this guest's link" onClick={() => copyLink(guest)}>
                <FiCopy size={15} />
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="eiv-status p-3">No guests match.</div>}
      </div>

      <div className="eiv-new-link">
        <h3 className="eiv-subheading">Email selected guests</h3>
        <p className="eiv-status mb-2">We'll email each selected guest their personal link from HappyWedz.</p>
        <textarea
          className="eiv-text-input"
          rows={3}
          maxLength={1000}
          placeholder="Add a personal message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" className="eiv-primary-btn eiv-btn-sm mt-3" disabled={sending || checked.length === 0} onClick={emailSelected}>
          <FiSend size={16} /> {sending ? "Sending..." : `Email ${checked.length || ""} selected`.replace("  ", " ")}
        </button>
      </div>
    </div>
  );
};

export default SendToGuestsTab;
