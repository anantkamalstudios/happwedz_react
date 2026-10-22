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

/** The "Add a photo" form: file, category, send. */
function PhotoUpload({ onAdded, onCancel }) {
  const id = useId();
  const headingRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [problems, setProblems] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  // A local preview of the picked file, revoked when it changes or the form closes.
  useEffect(() => {
    if (!file) return undefined;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (event) => {
    const picked = event.target.files?.[0] || null;
    const problem = picked ? imageFileProblem(picked) : null;
    setProblems((p) => ({ ...p, file: problem || undefined }));
    if (problem) {
      event.target.value = "";
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(picked);
    if (!picked) setPreview(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = {};
    const fileProblem = imageFileProblem(file);
    if (fileProblem) found.file = fileProblem;
    if (!category) found.category = "Choose a category.";
    setProblems(found);
    setError(null);
    if (Object.keys(found).length > 0) {
      document.getElementById(`${id}-${found.file ? "file" : "category"}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      await gpManageApi.addPhoto(file, category);
      onAdded();
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="gp-e-editor" noValidate onSubmit={submit} aria-labelledby={`${id}-title`}>
      <div className="gp-e-editor-head">
        <h3 className="gp-h3" id={`${id}-title`} tabIndex={-1} ref={headingRef}>
          Add a photo to Google
        </h3>
        <p className="gp-note">Use a real photo of your work or place. Google checks new photos before showing them.</p>
      </div>
      <div className="gp-e-upload">
        {preview ? (
          <img src={preview} alt="The photo you picked" className="gp-e-upload-preview" />
        ) : (
          <span className="gp-e-imgph gp-e-upload-preview" aria-hidden="true">
            <FiImage size={26} />
          </span>
        )}
        <div className="gp-e-stack">
          <div className="gp-e-field">
            <label className="gp-e-label" htmlFor={`${id}-file`}>
              Photo <span className="gp-e-req">(required)</span>
            </label>
            <input
              id={`${id}-file`}
              type="file"
              accept={IMAGE_ACCEPT}
              className="gp-e-file"
              onChange={pick}
              aria-invalid={Boolean(problems.file) || undefined}
              aria-describedby={`${id}-file-hint${problems.file ? ` ${id}-file-error` : ""}`}
            />
            <span className="gp-note" id={`${id}-file-hint`}>
              PNG, JPEG or WebP, up to 5 MB, at least 250 × 250 pixels.
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
      </div>
      <ErrorNote error={error} />
      <div className="gp-btns">
        <button type="submit" className="gp-btn gp-btn-primary" disabled={busy} aria-busy={busy || undefined}>
          {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiUpload size={18} aria-hidden="true" />}
          {busy ? "Sending…" : "Add photo"}
        </button>
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onCancel} disabled={busy}>
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
  else if (adding) body = <PhotoUpload onAdded={() => closeUpload("Photo sent to Google. It shows here after Google checks it.")} onCancel={() => closeUpload("")} />;
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
