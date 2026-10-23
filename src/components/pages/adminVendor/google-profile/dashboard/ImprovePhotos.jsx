// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" step 4 (helper D): the vendor's storefront photos. The vendor ticks up to 10 and says what each
// is: the cover photo (one), the logo (one) or a photo with Google's category (default Other); "Send to Google" sends
// them (the server takes each photo from the vendor's own storefront by its index) and shows each photo's result.
// API: gpManageApi.storefront → photos [{ index, url }]; gpManageApi.sendStorefrontPhotos(items) → { results }.
import { useId, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowUpRight, FiCheck, FiSend, FiX } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, FixLink, RefreshButton } from "../GpParts";
import { storefrontSection } from "../gpFormat";
import { AuthImage, TabLoading } from "./ProfileShared";
import { ImproveError } from "./ImproveParts";
import { DEFAULT_PHOTO_CATEGORY, PHOTOS_MAX, PHOTO_CATEGORIES } from "./ImproveUtils";

const ROLE_WORDS = { cover: "the cover photo", logo: "the logo" };

/** One storefront photo: the picture, "Send this photo", and what it is. */
function PhotoPick({ photo, number, pick, full, disabled, result, onChange }) {
  const id = useId();
  const name = `Storefront photo ${number}`;
  return (
    <li className={`gp-e-photo gp-i-photo${pick.use ? " is-picked" : ""}`}>
      <AuthImage src={photo.url} alt={name} className="gp-e-photo-img" />
      <div className="gp-i-photo-foot">
        <label className="gp-e-check">
          <input
            type="checkbox"
            checked={pick.use}
            onChange={(e) => onChange({ use: e.target.checked })}
            disabled={disabled || (!pick.use && full)}
          />
          Send<span className="visually-hidden"> {name}</span>
        </label>
        {pick.use && (
          <div className="gp-e-field">
            <label className="gp-note" htmlFor={`${id}-as`}>
              Use as<span className="visually-hidden"> ({name})</span>
            </label>
            <select id={`${id}-as`} className="gp-input gp-i-select" value={pick.as} onChange={(e) => onChange({ as: e.target.value })} disabled={disabled}>
              <option value="cover">Cover photo</option>
              <option value="logo">Logo</option>
              <optgroup label="Photo">
                {PHOTO_CATEGORIES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}
        {result &&
          (result.ok ? (
            <span className="gp-chip gp-chip-ok">
              <FiCheck size={12} aria-hidden="true" /> Sent
            </span>
          ) : (
            <span className="gp-e-error">
              <FiX size={14} aria-hidden="true" /> Not sent{result.message ? `: ${result.message}` : ""}
            </span>
          ))}
      </div>
    </li>
  );
}

export default function ImprovePhotos({ storefront, onSent }) {
  const [picks, setPicks] = useState({}); // index → { use, as }
  const [results, setResults] = useState({}); // index → { ok, message }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // { tone, text }

  if (storefront.status === "loading") return <TabLoading label="Loading your storefront photos…" />;
  if (storefront.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <ImproveError error={storefront.error} fallback="We couldn't load your storefront photos. Please try again." />
        <div className="gp-btns">
          <RefreshButton onClick={() => storefront.reload()}>Try again</RefreshButton>
        </div>
      </div>
    );
  }

  const photos = (Array.isArray(storefront.data?.photos) ? storefront.data.photos : []).filter(
    (p) => p && Number.isInteger(p.index) && typeof p.url === "string" && p.url,
  );

  if (photos.length === 0) {
    return (
      <div className="gp-e-stack-sm">
        <Callout tone="warn">Your storefront has no photos yet. Add real photos of your work to your storefront, then come back here.</Callout>
        <div className="gp-btns">
          <FixLink to={storefrontSection("photos")} className="gp-btn gp-btn-ghost">
            Open my storefront
            <FiArrowUpRight size={18} aria-hidden="true" />
          </FixLink>
        </div>
      </div>
    );
  }

  const pickOf = (index) => picks[index] || { use: false, as: DEFAULT_PHOTO_CATEGORY };
  const chosen = photos.filter((p) => pickOf(p.index).use);
  const full = chosen.length >= PHOTOS_MAX;
  const numberOf = (index) => photos.findIndex((p) => p.index === index) + 1;

  const change = (index, patch) => {
    const next = { ...picks, [index]: { ...pickOf(index), ...patch } };
    let moved = null;
    // Only one cover and one logo: the photo that had the role before becomes a plain photo.
    const role = next[index].as;
    if (patch.as && ROLE_WORDS[role]) {
      Object.keys(next).forEach((key) => {
        if (key !== String(index) && next[key].as === role) {
          next[key] = { ...next[key], as: DEFAULT_PHOTO_CATEGORY };
          moved = Number(key);
        }
      });
    }
    setPicks(next);
    setMessage(moved === null ? null : { tone: "ok", text: `Storefront photo ${numberOf(moved)} is no longer ${ROLE_WORDS[role]}; it is now a photo (Other).` });
  };

  const send = async () => {
    if (!chosen.length) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    const items = chosen.map((p) => {
      const { as } = pickOf(p.index);
      return ROLE_WORDS[as] ? { index: p.index, role: as } : { index: p.index, role: "photo", category: as };
    });
    try {
      const answer = await gpManageApi.sendStorefrontPhotos(items);
      const list = Array.isArray(answer?.results) ? answer.results : [];
      const byIndex = {};
      list.forEach((r) => {
        if (r && Number.isInteger(r.index)) byIndex[r.index] = { ok: Boolean(r.ok), message: typeof r.message === "string" ? r.message : "" };
      });
      setResults((cur) => ({ ...cur, ...byIndex }));
      const sent = Object.values(byIndex).filter((r) => r.ok).length;
      const notSent = Object.values(byIndex).length - sent;
      // Sent photos are unticked, so pressing again only sends the rest.
      setPicks((cur) => {
        const next = { ...cur };
        Object.entries(byIndex).forEach(([key, r]) => {
          if (r.ok && next[key]) next[key] = { ...next[key], use: false };
        });
        return next;
      });
      setMessage({
        tone: notSent ? (sent ? "warn" : "bad") : "ok",
        text: list.length
          ? `${sent} ${sent === 1 ? "photo" : "photos"} sent to Google${notSent ? `, ${notSent} not sent (see each photo)` : ""}. Google checks photos before showing them.`
          : "Sent. Google checks photos before showing them.",
      });
      if (sent > 0 || !list.length) onSent?.();
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gp-e-stack">
      <p className="gp-note">
        Tick up to {PHOTOS_MAX} photos from your storefront. Pick one as your cover photo and one as your logo; the rest go
        to Google as photos. Only real photos of your work: AI never makes fake photos.
      </p>
      <ul className="gp-e-photos gp-i-photos">
        {photos.map((p, i) => (
          <PhotoPick
            key={p.index}
            photo={p}
            number={i + 1}
            pick={pickOf(p.index)}
            full={full}
            disabled={busy}
            result={results[p.index]}
            onChange={(patch) => change(p.index, patch)}
          />
        ))}
      </ul>
      {full && <p className="gp-note">You picked {PHOTOS_MAX}, the most for one go. Send these first, then pick more.</p>}
      <ImproveError error={error} />
      <div aria-live="polite">{message && <Callout tone={message.tone}>{message.text}</Callout>}</div>
      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-primary" onClick={send} disabled={busy || chosen.length === 0} aria-busy={busy || undefined}>
          {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiSend size={18} aria-hidden="true" />}
          {busy ? "Sending to Google…" : chosen.length ? `Send ${chosen.length} to Google` : "Tick at least one photo"}
        </button>
      </div>
    </div>
  );
}
