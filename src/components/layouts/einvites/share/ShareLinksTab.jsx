import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaWhatsapp } from "react-icons/fa";
import { FiCheck, FiCopy, FiEdit2, FiMail, FiPause, FiPlay, FiPlus, FiTrash2 } from "react-icons/fi";
import { einviteApi } from "../../../../services/api/einviteApi";
import CardPicker from "./CardPicker";
import { cardNames, cardViewUrl, copyText, emailUrl, inviteMessage, pickedPageIds, shareLinkUrl, whatsappUrl } from "./shareUtils";

const LABEL_IDEAS = ["Family", "Close friends", "Office colleagues", "Neighbours"];

const notifyError = (text) => Swal.fire({ text, icon: "error" });

// One row per link: where it goes, what it shows, and ways to send it.
const LinkRow = ({ title, subtitle, stats, url, cardName, actions, inactive }) => {
  const [copied, setCopied] = useState(false);
  const message = inviteMessage({ cardName, url });

  const copy = async () => {
    if (await copyText(url)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } else {
      notifyError("Couldn't copy the link. Please copy it by hand.");
    }
  };

  return (
    <div className={`eiv-link-row ${inactive ? "is-inactive" : ""}`}>
      <div className="eiv-link-main">
        <div className="eiv-link-title">
          {title}
          {inactive && <span className="eiv-badge-muted">Paused</span>}
        </div>
        <div className="eiv-link-sub">{subtitle}</div>
        <div className="eiv-link-url" title={url}>{url}</div>
        {stats && <div className="eiv-link-stats">{stats}</div>}
      </div>
      <div className="eiv-link-actions">
        <button type="button" className="eiv-chip-btn" onClick={copy}>
          {copied ? <FiCheck size={15} /> : <FiCopy size={15} />} {copied ? "Copied" : "Copy"}
        </button>
        <a className="eiv-chip-btn is-whatsapp" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp size={15} /> WhatsApp
        </a>
        <a className="eiv-chip-btn" href={emailUrl({ subject: `You're invited: ${cardName}`, body: message })}>
          <FiMail size={15} /> Email
        </a>
        {actions}
      </div>
    </div>
  );
};

const ShareLinksTab = ({ card, pages }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [label, setLabel] = useState("");
  const [selected, setSelected] = useState(pages.map((page) => page.id));
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editSelected, setEditSelected] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    einviteApi
      .getShareLinks(card.id)
      .then((data) => !cancelled && setLinks(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [card.id]);

  const createLink = async (event) => {
    event.preventDefault();
    if (!label.trim()) {
      notifyError("Give the link a name, like Family or Office colleagues.");
      return;
    }
    if (selected.length === 0) {
      notifyError("Pick at least one card for this link.");
      return;
    }
    setSaving(true);
    try {
      const link = await einviteApi.createShareLink(card.id, {
        label: label.trim(),
        pageIds: pickedPageIds(pages, selected),
      });
      setLinks((prev) => [...prev, link]);
      setLabel("");
      setSelected(pages.map((page) => page.id));
    } catch (err) {
      notifyError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateLink = async (link, patch) => {
    try {
      const updated = await einviteApi.updateShareLink(link.id, patch);
      setLinks((prev) => prev.map((item) => (item.id === link.id ? { ...item, ...updated, rsvpCount: item.rsvpCount } : item)));
      return true;
    } catch (err) {
      notifyError(err.message);
      return false;
    }
  };

  const saveCards = async (link) => {
    if (editSelected.length === 0) {
      notifyError("Pick at least one card for this link.");
      return;
    }
    if (await updateLink(link, { pageIds: pickedPageIds(pages, editSelected) })) setEditingId(null);
  };

  const deleteLink = async (link) => {
    const { isConfirmed } = await Swal.fire({
      text: `Delete the "${link.label}" link? Guests who have it won't be able to open the invitation any more.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ed1173",
    });
    if (!isConfirmed) return;
    try {
      await einviteApi.deleteShareLink(link.id);
      setLinks((prev) => prev.filter((item) => item.id !== link.id));
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <div>
      <p className="eiv-status">
        {pages.length > 1
          ? "Send different links to different guests. Each link shows only the cards you pick, and replies come back to your RSVP list."
          : "Send a separate link to each group of guests to see who viewed and replied through it."}
      </p>

      <LinkRow
        title="Everyone"
        subtitle={pages.length > 1 ? "All cards · anyone with this link" : "Anyone with this link"}
        url={cardViewUrl(card.id)}
        cardName={card.name}
      />

      {loading ? (
        <div className="eiv-status py-3">Loading your links...</div>
      ) : error ? (
        <div className="alert alert-danger py-2 mt-3">{error}</div>
      ) : (
        links.map((link) => (
          <div key={link.id}>
            <LinkRow
              title={link.label}
              subtitle={pages.length > 1 ? cardNames(pages, link.pageIds) : null}
              stats={`${link.viewCount || 0} ${link.viewCount === 1 ? "view" : "views"} · ${link.rsvpCount || 0} ${link.rsvpCount === 1 ? "reply" : "replies"}`}
              url={shareLinkUrl(link.token)}
              cardName={card.name}
              inactive={!link.isActive}
              actions={
                <>
                  {pages.length > 1 && (
                    <button
                      type="button"
                      className="eiv-chip-btn"
                      onClick={() => {
                        setEditingId(editingId === link.id ? null : link.id);
                        setEditSelected(Array.isArray(link.pageIds) ? link.pageIds : pages.map((page) => page.id));
                      }}
                    >
                      <FiEdit2 size={15} /> Cards
                    </button>
                  )}
                  <button
                    type="button"
                    className="eiv-chip-btn"
                    title={link.isActive ? "Stop this link working for now" : "Turn this link back on"}
                    onClick={() => updateLink(link, { isActive: !link.isActive })}
                  >
                    {link.isActive ? <FiPause size={15} /> : <FiPlay size={15} />} {link.isActive ? "Pause" : "Resume"}
                  </button>
                  <button type="button" className="eiv-chip-btn is-danger" aria-label={`Delete ${link.label}`} onClick={() => deleteLink(link)}>
                    <FiTrash2 size={15} />
                  </button>
                </>
              }
            />
            {editingId === link.id && (
              <div className="eiv-link-edit">
                <div className="small fw-semibold mb-2">Cards guests with this link will see</div>
                <CardPicker pages={pages} selected={editSelected} onChange={setEditSelected} idPrefix={`edit-${link.id}`} />
                <div className="d-flex gap-2 mt-3">
                  <button type="button" className="eiv-primary-btn eiv-btn-sm" onClick={() => saveCards(link)}>Save</button>
                  <button type="button" className="eiv-outline-btn eiv-btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <form className="eiv-new-link" onSubmit={createLink}>
        <h3 className="eiv-subheading">Create a link for a group</h3>
        <label className="small fw-semibold mb-1" htmlFor="eiv-link-label">Link name</label>
        <input
          id="eiv-link-label"
          className="eiv-text-input"
          placeholder="e.g. Office colleagues"
          value={label}
          maxLength={80}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="d-flex flex-wrap gap-2 mt-2">
          {LABEL_IDEAS.map((idea) => (
            <button key={idea} type="button" className="eiv-suggestion" onClick={() => setLabel(idea)}>
              {idea}
            </button>
          ))}
        </div>
        {pages.length > 1 && (
          <>
            <div className="small fw-semibold mt-3 mb-2">Cards this group will see</div>
            <CardPicker pages={pages} selected={selected} onChange={setSelected} idPrefix="new-link" />
          </>
        )}
        <button type="submit" className="eiv-primary-btn eiv-btn-sm mt-3" disabled={saving}>
          <FiPlus size={16} /> {saving ? "Creating..." : "Create link"}
        </button>
      </form>
    </div>
  );
};

export default ShareLinksTab;
