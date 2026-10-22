// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// The "Write a post" editor of the Posts tab (GrowthOS PRD §24 post fields: type, topic, text, button and link, dates,
// offer and coupon, image, schedule). Save draft keeps it in GrowthOS; Publish now and Schedule save it first, then put
// it on Google (now, or at the schedule time). A post already on Google is saved there directly ("Save on Google").
// API: gpManageApi.createPost / updatePost / generatePost / uploadImage / publishPost / schedulePost.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiCalendar, FiImage, FiSend, FiStar, FiTrash2 } from "react-icons/fi";
import { errorCode, gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import { AuthImage, ConfirmBox, ErrorNote } from "./ProfileShared";
import { IMAGE_ACCEPT, POST_CTA_LABELS, POST_LIMITS, POST_TYPE_LABELS, fieldErrorsOf, imageFileProblem, isHttpUrl, localParts, toIsoTime } from "./ProfileUtils";

const blankForm = () => ({
  post_type: "update",
  topic: "",
  description: "",
  cta: "",
  cta_url: "",
  start_date: "",
  end_date: "",
  offer: "",
  coupon: "",
  image_upload_id: null,
  image_url: null,
  schedule_date: "",
  schedule_time: "",
  ai_generated: false,
});

const formOf = (post) => {
  if (!post) return blankForm();
  const when = localParts(post.schedule_at);
  return {
    post_type: post.post_type || "update",
    topic: post.topic || "",
    description: post.description || "",
    cta: post.cta || "",
    cta_url: post.cta_url || "",
    start_date: post.start_date || "",
    end_date: post.end_date || "",
    offer: post.offer || "",
    coupon: post.coupon || "",
    image_upload_id: post.image_upload_id || null,
    image_url: post.image_url || null,
    schedule_date: when.date,
    schedule_time: when.time,
    ai_generated: Boolean(post.ai_generated),
  };
};

/** The request body GrowthOS's postInputSchema expects (blanks → null; fields the type does not use → null). */
const bodyOf = (v) => {
  const dated = v.post_type !== "update";
  const offer = v.post_type === "offer";
  return {
    post_type: v.post_type,
    topic: v.topic.trim(),
    description: v.description.trim() || null,
    cta: v.cta || null,
    cta_url: v.cta && v.cta !== "call" ? v.cta_url.trim() || null : null,
    start_date: dated ? v.start_date || null : null,
    end_date: dated ? v.end_date || null : null,
    offer: offer ? v.offer.trim() || null : null,
    coupon: offer ? v.coupon.trim() || null : null,
    image_upload_id: v.image_upload_id || null,
    location_id: null,
    schedule_at: toIsoTime(v.schedule_date, v.schedule_time),
    ai_generated: v.ai_generated,
  };
};

/** The same checks as GrowthOS's postInputSchema, in plain words. `forSchedule` also needs a future time. */
const problemsOf = (v, forSchedule) => {
  const out = {};
  if (!v.post_type) out.post_type = "Choose a post type.";
  if (!v.topic.trim()) out.topic = "Write what the post is about.";
  else if (v.topic.trim().length > POST_LIMITS.topic) out.topic = `Keep it to ${POST_LIMITS.topic} characters.`;
  if (v.description.length > POST_LIMITS.description) out.description = `Keep it to ${POST_LIMITS.description} characters.`;
  if (v.cta && v.cta !== "call") {
    if (!v.cta_url.trim()) out.cta_url = "Add the web address the button opens.";
    else if (!isHttpUrl(v.cta_url)) out.cta_url = "Enter a web address starting with https://";
  }
  if (v.post_type !== "update" && v.start_date && v.end_date && v.end_date < v.start_date) {
    out.end_date = "The end date must be on or after the start date.";
  }
  if (v.post_type === "offer") {
    if (v.offer.length > POST_LIMITS.offer) out.offer = `Keep it to ${POST_LIMITS.offer} characters.`;
    if (v.coupon.length > POST_LIMITS.coupon) out.coupon = `Keep it to ${POST_LIMITS.coupon} characters.`;
  }
  if (v.schedule_date && !v.schedule_time) out.schedule_time = "Add a time, or clear the date.";
  if (v.schedule_time && !v.schedule_date) out.schedule_date = "Add a date, or clear the time.";
  if (forSchedule) {
    const at = toIsoTime(v.schedule_date, v.schedule_time);
    if (!v.schedule_date && !v.schedule_time) out.schedule_date = "Choose when the post should go live.";
    else if (at && new Date(at).getTime() < Date.now() + 5 * 60 * 1000) out.schedule_time = "Choose a time at least 5 minutes from now.";
  }
  return out;
};

// Server field paths that have a box here (the rest are shown in the error box).
const FIELD_PATHS = ["post_type", "topic", "description", "cta", "cta_url", "start_date", "end_date", "offer", "coupon", "image_upload_id", "schedule_at"];

/** One labelled box with its hint and error. */
function Field({ id, label, hint, error, required, children }) {
  return (
    <div className="gp-e-field">
      <label className="gp-e-label" htmlFor={id}>
        {label}
        {required && <span className="gp-e-req"> (required)</span>}
      </label>
      {children}
      {hint && (
        <span className="gp-note" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="gp-e-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

const describedBy = (id, hint, error) => [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;

/**
 * `post` is the post being edited (null = a new one). `onDone(kind, post)` is called after a save
 * (kind = draft | published | scheduled | updated); `onCancel` closes the editor.
 */
export default function PostEditor({ post, onDone, onCancel }) {
  const id = useId();
  const headingRef = useRef(null);
  const fileRef = useRef(null);
  const [form, setForm] = useState(() => formOf(post));
  const [savedId, setSavedId] = useState(post?.id || null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(null); // save | publish | schedule | ai | upload
  const [error, setError] = useState(null);
  const [aiNote, setAiNote] = useState("");
  const [imageProblem, setImageProblem] = useState(null);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const live = post?.status === "published";

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));
  const err = (name) => errors[name];
  const working = Boolean(busy);

  const fail = (failure) => {
    const fields = fieldErrorsOf(failure);
    const mapped = Object.fromEntries(Object.entries(fields).filter(([path]) => FIELD_PATHS.includes(path)));
    if (mapped.schedule_at) {
      mapped.schedule_time = mapped.schedule_at;
      delete mapped.schedule_at;
    }
    setErrors(mapped);
    setError(failure);
  };

  /** Checks the form; true when it can be sent. */
  const check = (forSchedule = false) => {
    const found = problemsOf(form, forSchedule);
    setErrors(found);
    setError(null);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return false;
    }
    return true;
  };

  /** Saves the post (new → create, else update) and returns it. */
  const save = async () => {
    const body = bodyOf(form);
    const saved = savedId ? await gpManageApi.updatePost(savedId, body) : await gpManageApi.createPost(body);
    if (saved?.id) setSavedId(saved.id);
    return saved;
  };

  const onSaveDraft = async (event) => {
    event?.preventDefault();
    if (working || !check()) return;
    setBusy("save");
    try {
      const saved = await save();
      onDone(live ? "updated" : "draft", saved);
    } catch (failure) {
      fail(failure);
    } finally {
      setBusy(null);
    }
  };

  const onPublish = async () => {
    setConfirmPublish(false);
    if (working || !check()) return;
    setBusy("publish");
    try {
      const saved = await save();
      const done = await gpManageApi.publishPost(saved?.id || savedId);
      onDone("published", done || saved);
    } catch (failure) {
      fail(failure);
    } finally {
      setBusy(null);
    }
  };

  const onSchedule = async () => {
    if (working || !check(true)) return;
    setBusy("schedule");
    try {
      const saved = await save();
      const done = await gpManageApi.schedulePost(saved?.id || savedId);
      onDone("scheduled", done || saved);
    } catch (failure) {
      fail(failure);
    } finally {
      setBusy(null);
    }
  };

  const onWriteWithAi = async () => {
    if (working) return;
    const found = {};
    if (!form.post_type) found.post_type = "Choose a post type.";
    if (!form.topic.trim()) found.topic = "Write what the post is about first. The AI writes from it.";
    setErrors(found);
    setError(null);
    setAiNote("");
    if (Object.keys(found).length > 0) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    const b = bodyOf(form);
    setBusy("ai");
    try {
      const result = await gpManageApi.generatePost({
        post_type: b.post_type,
        topic: b.topic,
        location_id: null,
        offer: b.offer,
        coupon: b.coupon,
        start_date: b.start_date,
        end_date: b.end_date,
      });
      if (result?.description) {
        set({ description: result.description.slice(0, POST_LIMITS.description), ai_generated: true, ...(result.cta ? { cta: result.cta } : {}) });
        setAiNote("The AI wrote the text below. Read it and change anything before you save.");
        document.getElementById(`${id}-description`)?.focus();
      }
    } catch (failure) {
      fail(failure);
    } finally {
      setBusy(null);
    }
  };

  const onPickImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = imageFileProblem(file);
    setImageProblem(problem);
    if (problem) return;
    setBusy("upload");
    setError(null);
    try {
      const uploaded = await gpManageApi.uploadImage(file);
      if (uploaded?.id) set({ image_upload_id: uploaded.id, image_url: uploaded.url || null });
    } catch (failure) {
      setImageProblem(null);
      setError(failure);
    } finally {
      setBusy(null);
    }
  };

  const dated = form.post_type !== "update";
  const isOffer = form.post_type === "offer";
  const needsUrl = form.cta && form.cta !== "call";
  const blocked = errorCode(error) === "google_unverified";

  return (
    <form className="gp-e-editor" noValidate onSubmit={onSaveDraft} aria-labelledby={`${id}-title`}>
      <div className="gp-e-editor-head">
        <h3 className="gp-h3" id={`${id}-title`} tabIndex={-1} ref={headingRef}>
          {post ? "Edit post" : "Write a post"}
        </h3>
        <p className="gp-note">
          {live
            ? "This post is on Google. Save on Google changes it there at once."
            : "Save draft keeps it here. Publish now puts it on Google at once; Schedule puts it there at the time you choose."}
        </p>
      </div>

      {post?.publish_error && !error && (
        <Callout tone="alert">
          <b>The last publish did not go through.</b> {post.publish_error}
        </Callout>
      )}

      <div className="gp-e-grid2">
        <Field id={`${id}-post_type`} label="Post type" error={err("post_type")} hint={live ? "A post on Google keeps its type." : undefined} required>
          <select
            id={`${id}-post_type`}
            className="gp-input"
            value={form.post_type}
            disabled={live}
            onChange={(e) => set({ post_type: e.target.value })}
            aria-invalid={Boolean(err("post_type")) || undefined}
            aria-describedby={describedBy(`${id}-post_type`, live, err("post_type"))}
          >
            {Object.entries(POST_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-topic`} label="Topic" hint="What the post is about, in a few words." error={err("topic")} required>
          <input
            id={`${id}-topic`}
            className="gp-input"
            value={form.topic}
            maxLength={POST_LIMITS.topic}
            onChange={(e) => set({ topic: e.target.value })}
            aria-invalid={Boolean(err("topic")) || undefined}
            aria-describedby={describedBy(`${id}-topic`, true, err("topic"))}
          />
        </Field>
      </div>

      <div className="gp-e-ai">
        <button type="button" className="gp-btn gp-btn-ghost" onClick={onWriteWithAi} disabled={working} aria-busy={busy === "ai" || undefined}>
          {busy === "ai" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiStar size={18} aria-hidden="true" />}
          {busy === "ai" ? "Writing…" : "Write with AI"}
        </button>
        <span className="gp-note">Uses the post type, topic and your confirmed business details. Check the text before you save.</span>
        <span className="gp-note" role="status">
          {aiNote}
        </span>
      </div>

      <Field
        id={`${id}-description`}
        label="Text"
        hint={`${form.description.length} of ${POST_LIMITS.description} characters. No phone numbers or email addresses; Google rejects them.`}
        error={err("description")}
      >
        <textarea
          id={`${id}-description`}
          className="gp-input gp-e-textarea"
          rows={6}
          value={form.description}
          maxLength={POST_LIMITS.description}
          onChange={(e) => set({ description: e.target.value })}
          aria-invalid={Boolean(err("description")) || undefined}
          aria-describedby={describedBy(`${id}-description`, true, err("description"))}
        />
      </Field>

      <div className="gp-e-grid2">
        <Field
          id={`${id}-cta`}
          label="Button"
          hint={form.cta === "call" ? "Call now uses your business phone number." : isOffer ? "Google shows an offer's link instead of a button." : undefined}
          error={err("cta")}
        >
          <select
            id={`${id}-cta`}
            className="gp-input"
            value={form.cta}
            onChange={(e) => set({ cta: e.target.value })}
            aria-describedby={describedBy(`${id}-cta`, form.cta === "call" || isOffer, err("cta"))}
          >
            <option value="">No button</option>
            {Object.entries(POST_CTA_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        {needsUrl && (
          <Field id={`${id}-cta_url`} label="Button link" error={err("cta_url")} required>
            <input
              id={`${id}-cta_url`}
              className="gp-input"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={form.cta_url}
              onChange={(e) => set({ cta_url: e.target.value })}
              aria-invalid={Boolean(err("cta_url")) || undefined}
              aria-describedby={describedBy(`${id}-cta_url`, false, err("cta_url"))}
            />
          </Field>
        )}
      </div>

      {dated && (
        <div className="gp-e-grid2">
          <Field id={`${id}-start_date`} label="Start date" hint="An offer or event needs both dates on Google." error={err("start_date")}>
            <input
              id={`${id}-start_date`}
              className="gp-input"
              type="date"
              value={form.start_date}
              onChange={(e) => set({ start_date: e.target.value })}
              aria-invalid={Boolean(err("start_date")) || undefined}
              aria-describedby={describedBy(`${id}-start_date`, true, err("start_date"))}
            />
          </Field>
          <Field id={`${id}-end_date`} label="End date" error={err("end_date")}>
            <input
              id={`${id}-end_date`}
              className="gp-input"
              type="date"
              value={form.end_date}
              min={form.start_date || undefined}
              onChange={(e) => set({ end_date: e.target.value })}
              aria-invalid={Boolean(err("end_date")) || undefined}
              aria-describedby={describedBy(`${id}-end_date`, false, err("end_date"))}
            />
          </Field>
        </div>
      )}

      {isOffer && (
        <div className="gp-e-grid2">
          <Field id={`${id}-offer`} label="Offer terms" error={err("offer")}>
            <input
              id={`${id}-offer`}
              className="gp-input"
              value={form.offer}
              maxLength={POST_LIMITS.offer}
              onChange={(e) => set({ offer: e.target.value })}
              aria-describedby={describedBy(`${id}-offer`, false, err("offer"))}
            />
          </Field>
          <Field id={`${id}-coupon`} label="Coupon code" error={err("coupon")}>
            <input
              id={`${id}-coupon`}
              className="gp-input"
              value={form.coupon}
              maxLength={POST_LIMITS.coupon}
              onChange={(e) => set({ coupon: e.target.value })}
              aria-describedby={describedBy(`${id}-coupon`, false, err("coupon"))}
            />
          </Field>
        </div>
      )}

      <fieldset className="gp-fieldset">
        <legend className="gp-e-label">Image (optional)</legend>
        <div className="gp-e-image-row">
          {form.image_url ? (
            <AuthImage src={form.image_url} alt="The post's image" className="gp-e-post-img" loading="eager" />
          ) : (
            <span className="gp-e-imgph gp-e-post-img" aria-hidden="true">
              <FiImage size={22} />
            </span>
          )}
          <div className="gp-e-stack-sm">
            <input ref={fileRef} id={`${id}-image`} type="file" accept={IMAGE_ACCEPT} className="visually-hidden" onChange={onPickImage} tabIndex={-1} />
            <div className="gp-btns">
              <button type="button" className="gp-btn gp-btn-ghost" onClick={() => fileRef.current?.click()} disabled={working} aria-busy={busy === "upload" || undefined}>
                {busy === "upload" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiImage size={18} aria-hidden="true" />}
                {busy === "upload" ? "Uploading…" : form.image_upload_id ? "Change image" : "Add an image"}
              </button>
              {form.image_upload_id && (
                <button type="button" className="gp-btn gp-btn-ghost" onClick={() => set({ image_upload_id: null, image_url: null })} disabled={working}>
                  <FiTrash2 size={18} aria-hidden="true" />
                  Remove image
                </button>
              )}
            </div>
            <span className="gp-note">PNG, JPEG or WebP, up to 5 MB.</span>
            {(imageProblem || err("image_upload_id")) && (
              <span className="gp-e-error" role="alert">
                {imageProblem || err("image_upload_id")}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {!live && (
        <fieldset className="gp-fieldset">
          <legend className="gp-e-label">Schedule (optional)</legend>
          <div className="gp-e-grid2">
            <Field id={`${id}-schedule_date`} label="Date" error={err("schedule_date")}>
              <input
                id={`${id}-schedule_date`}
                className="gp-input"
                type="date"
                value={form.schedule_date}
                onChange={(e) => set({ schedule_date: e.target.value })}
                aria-invalid={Boolean(err("schedule_date")) || undefined}
                aria-describedby={describedBy(`${id}-schedule_date`, false, err("schedule_date"))}
              />
            </Field>
            <Field id={`${id}-schedule_time`} label="Time" error={err("schedule_time")}>
              <input
                id={`${id}-schedule_time`}
                className="gp-input"
                type="time"
                value={form.schedule_time}
                onChange={(e) => set({ schedule_time: e.target.value })}
                aria-invalid={Boolean(err("schedule_time")) || undefined}
                aria-describedby={describedBy(`${id}-schedule_time`, false, err("schedule_time"))}
              />
            </Field>
          </div>
          <span className="gp-note">When the post should go live on Google, in your own time. Then press Schedule.</span>
        </fieldset>
      )}

      <ErrorNote error={error} />
      {blocked && <p className="gp-note">You can still save it as a draft.</p>}

      {confirmPublish ? (
        <ConfirmBox
          title="Publish this post on Google now?"
          confirmLabel="Publish now"
          onConfirm={onPublish}
          onCancel={() => setConfirmPublish(false)}
        >
          It is saved first and then shown on your Google profile. Google may take a few minutes to show it.
        </ConfirmBox>
      ) : (
        <div className="gp-btns gp-e-editor-actions">
          {live ? (
            <button type="submit" className="gp-btn gp-btn-primary" disabled={working} aria-busy={busy === "save" || undefined}>
              {busy === "save" && <Spinner animation="border" size="sm" aria-hidden="true" />}
              Save on Google
            </button>
          ) : (
            <>
              <button type="submit" className="gp-btn gp-btn-primary" disabled={working} aria-busy={busy === "save" || undefined}>
                {busy === "save" && <Spinner animation="border" size="sm" aria-hidden="true" />}
                Save draft
              </button>
              <button
                type="button"
                className="gp-btn gp-btn-ghost"
                disabled={working}
                aria-busy={busy === "publish" || undefined}
                onClick={() => {
                  if (check()) setConfirmPublish(true);
                }}
              >
                {busy === "publish" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiSend size={18} aria-hidden="true" />}
                Publish now
              </button>
              <button type="button" className="gp-btn gp-btn-ghost" disabled={working} aria-busy={busy === "schedule" || undefined} onClick={onSchedule}>
                {busy === "schedule" ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiCalendar size={18} aria-hidden="true" />}
                Schedule
              </button>
            </>
          )}
          <button type="button" className="gp-btn gp-btn-ghost" onClick={onCancel} disabled={working}>
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
