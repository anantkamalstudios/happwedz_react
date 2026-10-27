// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Photos tab — built by helper E. The profile's photos as of the last sync; add one with Google's photo category
// (PNG, JPEG or WebP up to 5 MB, checked before sending); delete one with a check.
// API: gpManageApi.photos / addPhoto / deletePhoto. Shape: GrowthOS photosSchema; categories: PHOTO_CATEGORIES.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowUpRight, FiImage, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import { formatWhen } from "../gpFormat";
import { AuthImage, ConfirmBox, EmptyBox, ErrorNote, TabError, TabLoading } from "./ProfileShared";
import { GOOGLE_BLOCK_TEXT, IMAGE_ACCEPT, formatDay, imageFileProblem } from "./ProfileUtils";

// GrowthOS PHOTO_CATEGORIES with GrowthOS's plain labels.
const PHOTO_CATEGORIES = [
  ["COVER", "Cover"],
  ["PROFILE", "Logo"],
  ["EXTERIOR", "Exterior"],
  ["INTERIOR", "Interior"],
  ["PRODUCT", "Product"],
  ["AT_WORK", "At work"],
  ["TEAMS", "Team"],
  ["FOOD_AND_DRINK", "Food and drink"],
  ["MENU", "Menu"],
  ["COMMON_AREA", "Common area"],
  ["ROOMS", "Rooms"],
  ["ADDITIONAL", "Other"],
];
const CATEGORY_LABEL = Object.fromEntries(PHOTO_CATEGORIES);

const dateOf = (iso) => (iso ? formatDay(String(iso).slice(0, 10)) : "");

/** At most this many photos in one go. */
export const PHOTOS_PER_UPLOAD = 10;
/** Cover and Logo are one photo each. */
const SINGLE_CATEGORIES = ["COVER", "PROFILE"];

/**
 * The "Add photos" form: up to PHOTOS_PER_UPLOAD files, one category, send (one by one; each photo's result shows).
 * Also used by "Improve with AI" step 4 (ImprovePhotos). onAdded(count) runs when every photo was sent.
 * 2026-10-27: several photos at once (was one).
 */
export function PhotoUpload({ onAdded, onCancel }) {
  const id = useId();
  const headingRef = useRef(null);
  const [files, setFiles] = useState([]); // [{ key, file, preview, result: null | { ok, message } }]
  const [category, setCategory] = useState("");
  const [problems, setProblems] = useState({});
  const [busy, setBusy] = useState(null); // null | { done, total }
  const [error, setError] = useState(null);
  const urls = useRef(new Set());

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // The local previews are freed when the form closes.
  useEffect(() => {
    const set = urls.current;
    return () => set.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const pick = (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length) return;
    const room = PHOTOS_PER_UPLOAD - files.length;
    const bad = picked.map((f) => imageFileProblem(f)).find(Boolean);
    const usable = picked.filter((f) => !imageFileProblem(f));
    const added = usable.slice(0, Math.max(0, room)).map((file, i) => {
      const preview = URL.createObjectURL(file);
      urls.current.add(preview);
      return { key: `${Date.now()}-${i}-${file.name}`, file, preview, result: null };
    });
    setFiles((list) => [...list, ...added]);
    setProblems((p) => ({
      ...p,
      file: bad
        ? `Some photos were left out: ${bad}`
        : usable.length > room
          ? `At most ${PHOTOS_PER_UPLOAD} photos in one go. Send these, then add more.`
          : undefined,
    }));
  };

  const remove = (key) => setFiles((list) => list.filter((f) => f.key !== key));

  const submit = async (event) => {
    event.preventDefault();
    const waiting = files.filter((f) => !f.result?.ok);
    const found = {};
    if (!waiting.length) found.file = "Choose at least one photo.";
    if (!category) found.category = "Choose a category.";
    else if (SINGLE_CATEGORIES.includes(category) && waiting.length > 1)
      found.category = "Cover and Logo take one photo. Keep one photo, or choose another category.";
    setProblems(found);
    setError(null);
    if (Object.keys(found).length > 0) {
      document.getElementById(`${id}-${found.file ? "file" : "category"}`)?.focus();
      return;
    }
    let sent = 0;
    for (let i = 0; i < waiting.length; i += 1) {
      const item = waiting[i];
      setBusy({ done: i, total: waiting.length });
      let result;
      try {
        await gpManageApi.addPhoto(item.file, category);
        result = { ok: true, message: "" };
        sent += 1;
      } catch (failure) {
        result = { ok: false, message: failure?.response?.data?.message || "Not sent. Please try again." };
      }
      setFiles((list) => list.map((f) => (f.key === item.key ? { ...f, result } : f)));
    }
    setBusy(null);
    if (sent === waiting.length) onAdded(sent);
    else setError({ message: `${sent} of ${waiting.length} photos sent. The others show why; press the button to try them again.` });
  };

  const left = files.filter((f) => !f.result?.ok).length;

  return (
    <form className="gp-e-editor" noValidate onSubmit={submit} aria-labelledby={`${id}-title`}>
      <div className="gp-e-editor-head">
        <h3 className="gp-h3" id={`${id}-title`} tabIndex={-1} ref={headingRef}>
          Add photos to Google
        </h3>
        <p className="gp-note">
          Use real photos of your work or place, up to {PHOTOS_PER_UPLOAD} at a time. Google checks new photos before
          showing them.
        </p>
      </div>
      <div className="gp-e-stack">
        {files.length > 0 && (
          <ul className="gp-e-plain gp-e-upload-list" aria-label="Photos you picked">
            {files.map((f, i) => (
              <li key={f.key} className="gp-e-upload-item">
                <img src={f.preview} alt={`Photo ${i + 1}: ${f.file.name}`} className="gp-e-upload-thumb" />
                {f.result?.ok ? (
                  <span className="gp-chip gp-chip-ok gp-e-upload-state">Sent</span>
                ) : f.result ? (
                  <span className="gp-e-error gp-e-upload-state">{f.result.message}</span>
                ) : (
                  !busy && (
                    <button type="button" className="gp-e-icon-btn gp-e-upload-x" onClick={() => remove(f.key)} aria-label={`Remove photo ${i + 1}`}>
                      <FiTrash2 size={14} aria-hidden="true" />
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="gp-e-field">
          <label className="gp-e-label" htmlFor={`${id}-file`}>
            Photos <span className="gp-e-req">(required)</span>
          </label>
          <input
            id={`${id}-file`}
            type="file"
            accept={IMAGE_ACCEPT}
            multiple
            className="gp-e-file"
            onChange={pick}
            disabled={Boolean(busy) || files.length >= PHOTOS_PER_UPLOAD}
            aria-invalid={Boolean(problems.file) || undefined}
            aria-describedby={`${id}-file-hint${problems.file ? ` ${id}-file-error` : ""}`}
          />
          <span className="gp-note" id={`${id}-file-hint`}>
            PNG, JPEG or WebP, up to 5 MB each, at least 250 × 250 pixels. You can pick several at once.
          </span>
          {problems.file && (
            <span className="gp-e-error" id={`${id}-file-error`}>
              {problems.file}
            </span>
          )}
        </div>
        <div className="gp-e-field">
          <label className="gp-e-label" htmlFor={`${id}-category`}>
            Category <span className="gp-e-req">(required)</span>
          </label>
          <select
            id={`${id}-category`}
            className="gp-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={Boolean(busy)}
            aria-invalid={Boolean(problems.category) || undefined}
            aria-describedby={problems.category ? `${id}-category-error` : undefined}
          >
            <option value="">Choose</option>
            {PHOTO_CATEGORIES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {problems.category && (
            <span className="gp-e-error" id={`${id}-category-error`}>
              {problems.category}
            </span>
          )}
        </div>
      </div>
      <ErrorNote error={error} fallback={error?.message} />
      <div className="gp-btns">
        <button type="submit" className="gp-btn gp-btn-primary" disabled={Boolean(busy)} aria-busy={Boolean(busy) || undefined}>
          {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiUpload size={18} aria-hidden="true" />}
          {busy ? `Sending ${busy.done + 1} of ${busy.total}…` : left > 1 ? `Add ${left} photos` : "Add photo"}
        </button>
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onCancel} disabled={Boolean(busy)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function PhotosTab() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [done, setDone] = useState("");
  const headingRef = useRef(null);
  const addRef = useRef(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const data = await gpManageApi.photos();
      setState({ status: "ready", data, error: null });
    } catch (error) {
      setState((s) => (quiet && s.status === "ready" ? s : { ...s, status: "error", error }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const closeUpload = (message) => {
    setAdding(false);
    if (message) {
      setDone(message);
      load(true);
    }
    window.requestAnimationFrame(() => (addRef.current || headingRef.current)?.focus());
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    setDeleteError(null);
    try {
      await gpManageApi.deletePhoto(deleting.name);
      setDeleting(null);
      setDone("Photo deleted. It is removed from your Google profile too.");
      headingRef.current?.focus();
      await load(true);
    } catch (error) {
      setDeleteError(error);
    } finally {
      setBusy(false);
    }
  };

  const data = state.data;
  const photos = Array.isArray(data?.photos) ? data.photos : [];
  const blocked = data?.google && data.google.available === false;

  const addButton = (
    <button
      type="button"
      ref={addRef}
      className="gp-btn gp-btn-primary"
      onClick={() => {
        setDone("");
        setDeleting(null);
        setAdding(true);
      }}
    >
      <FiPlus size={18} aria-hidden="true" />
      Add a photo
    </button>
  );
  const googleLink = data?.maps_uri ? (
    <a className="gp-btn gp-btn-ghost" href={data.maps_uri} target="_blank" rel="noopener noreferrer">
      See your profile on Google
      <FiArrowUpRight size={18} aria-hidden="true" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  ) : null;

  let body;
  if (state.status === "loading") body = <TabLoading label="Loading your photos…" />;
  else if (state.status === "error") body = <TabError error={state.error} onRetry={() => load()} />;
  else if (blocked)
    body = (
      <Callout tone="warn">
        {GOOGLE_BLOCK_TEXT[data.google.reason] || "Photos from Google are not available right now. Please try again later."}
      </Callout>
    );
  else if (adding)
    body = (
      <PhotoUpload
        onAdded={(n) =>
          closeUpload(n > 1 ? `${n} photos sent to Google. They show here after Google checks them.` : "Photo sent to Google. It shows here after Google checks it.")
        }
        onCancel={() => closeUpload("")}
      />
    );
  else if (photos.length === 0)
    body = (
      <EmptyBox
        icon={FiImage}
        title="No photos on your profile yet"
        action={
          <>
            {addButton}
            {googleLink}
          </>
        }
      >
        Profiles with real photos get more attention. Add your first photo.
      </EmptyBox>
    );
  else
    body = (
      <>
        <div className="gp-e-head">
          <p className="gp-note">
            {typeof data.total === "number" && data.total > photos.length
              ? `Showing ${photos.length} of ${data.total} photos`
              : `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`}
            {data.synced_at ? ` · updated from Google ${formatWhen(data.synced_at)}` : ""}
          </p>
          <div className="gp-btns">
            {addButton}
            {googleLink}
          </div>
        </div>
        <ul className="gp-e-photos">
          {photos.map((photo) => {
            const category = CATEGORY_LABEL[photo.category] || null;
            const date = dateOf(photo.created_at);
            const label = [category, date ? `added ${date}` : null].filter(Boolean).join(", ") || "Profile photo";
            return (
              <li key={photo.name} className="gp-e-photo">
                <AuthImage src={photo.thumbnail_url || photo.url} alt={`Photo: ${label}`} className="gp-e-photo-img" />
                {deleting?.name === photo.name ? (
                  <div className="gp-e-photo-confirm">
                    <ConfirmBox
                      tone="bad"
                      title="Delete this photo?"
                      confirmLabel="Delete"
                      busy={busy}
                      error={deleteError}
                      onConfirm={remove}
                      onCancel={() => {
                        setDeleting(null);
                        setDeleteError(null);
                      }}
                    >
                      It is also removed from your Google profile.
                    </ConfirmBox>
                  </div>
                ) : (
                  <div className="gp-e-photo-foot">
                    <span className="gp-note gp-e-truncate">{[category, date].filter(Boolean).join(" · ") || "Photo"}</span>
                    <button
                      type="button"
                      className="gp-e-icon-btn"
                      onClick={() => {
                        setDone("");
                        setDeleteError(null);
                        setDeleting(photo);
                      }}
                      aria-label={`Delete photo (${label})`}
                    >
                      <FiTrash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </>
    );

  return (
    <div className="gp-e-tab">
      <div className="gp-e-stack-sm">
        <h2 className="gp-h3" tabIndex={-1} ref={headingRef}>
          Photos on Google
        </h2>
        <p className="gp-note">The photos people see on your Google profile.</p>
      </div>
      <div aria-live="polite">{done && <Callout tone="ok">{done}</Callout>}</div>
      {body}
    </div>
  );
}
