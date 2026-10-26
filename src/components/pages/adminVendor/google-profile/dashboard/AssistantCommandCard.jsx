// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.4).
// AI assistant chat — one command's card (helper D), the same behaviour as GrowthOS's Command Center card
// (growthos-web/src/features/ai/command-card.tsx): what will change (before → after), items, notes, the text the
// vendor may edit, the parts of a goal with tick boxes, the photo of a post, Google's questions; several matches →
// choose one; a missing photo → upload it; refused / not allowed / unsupported / failed → why. Nothing changes until
// Apply ("Publish to Google" when it changes Google). After Apply: the result, and Undo when it can be taken back.
// API: assistantApi.apply / choose / cancel / undo / attach + upload.
import { useEffect, useId, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowRight, FiCheck, FiCornerUpLeft, FiEdit2, FiUpload } from "react-icons/fi";
import { assistantApi } from "../../../../../services/api/googleProfileApi";
import { Callout } from "../GpParts";
import { AuthImage } from "./ProfileShared";
import {
  BLOCKED,
  BLOCKED_TITLES,
  PHOTO_ACCEPT,
  UPLOAD_LABELS,
  changesGoogle,
  chatErrorText,
  messageError,
  photoProblem,
  tabOfLink,
} from "./AssistantUtils";

const TAB_NAMES = { profile: "Profile", reviews: "Reviews", posts: "Posts", photos: "Photos" };

const partTextsOf = (parts) => Object.fromEntries(parts.filter((x) => x.editable).map((x) => [x.id, x.editable?.value ?? ""]));
const answersOf = (preview) => Object.fromEntries((preview.attribute_form || []).map((q) => [q.name, q.value]));

/** A button with a spinner while its call runs. */
function ActionButton({ busy, disabled, primary = false, onClick, children }) {
  return (
    <button
      type="button"
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"} gp-a-btn`}
      onClick={onClick}
      disabled={busy || disabled}
      aria-busy={busy || undefined}
    >
      {busy && <Spinner animation="border" size="sm" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Before → after rows. */
function Changes({ changes }) {
  if (!changes?.length) return null;
  return (
    <dl className="gp-a-changes">
      {changes.map((c, i) => (
        <div key={`${c.label}-${i}`} className="gp-a-change">
          <dt className="gp-a-change-label">{c.label}</dt>
          <dd className="gp-a-change-value">
            {c.before !== null && c.before !== undefined && (
              <>
                <span className="gp-a-before">
                  <span className="visually-hidden">Now: </span>
                  {c.before || "Not set"}
                </span>
                <FiArrowRight size={14} className="gp-a-arrow" aria-hidden="true" />
              </>
            )}
            <span className="gp-a-after">
              {c.before !== null && c.before !== undefined && <span className="visually-hidden">Becomes: </span>}
              {c.after ?? "Not set"}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Items (posts, replies, services …), with their photo when they have one. */
function Items({ items, small = false }) {
  if (!items?.length) return null;
  return (
    <ul className={`gp-e-plain gp-a-items${small ? " is-small" : ""}`}>
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="gp-a-item">
          {item.image_url && <AuthImage src={item.image_url} alt="" className="gp-a-item-img" />}
          <div className="gp-a-item-body">
            <span className="gp-a-item-title">{item.title}</span>
            {item.body && <span className="gp-a-item-text">{item.body}</span>}
            {item.meta && <span className="gp-a-item-meta">{item.meta}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The post's photo: one of the library photos, or none. */
function PhotoPicker({ choice, value, onChange }) {
  const name = useId();
  const options = [...(choice.options || []), { id: null, url: null, label: "No photo" }];
  return (
    <fieldset className="gp-a-fieldset">
      <legend className="gp-e-label">Photo for the post</legend>
      <div className="gp-a-picks">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <label key={o.id ?? "none"} className={`gp-a-pick${on ? " is-on" : ""}`}>
              <input
                type="radio"
                name={name}
                className="visually-hidden"
                checked={on}
                onChange={() => onChange(o.id)}
                aria-label={o.label || (o.url ? "Library photo" : "No photo")}
              />
              {o.url ? <AuthImage src={o.url} alt="" className="gp-a-pick-img" /> : <span className="gp-a-pick-none">No photo</span>}
              {on && (
                <span className="gp-a-pick-tick" aria-hidden="true">
                  <FiCheck size={12} />
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Google's questions about the business (attributes): Yes / No / Not sure, or one of Google's options. */
function AttributeForm({ questions, answers, onChange }) {
  const baseId = useId();
  const groups = new Map();
  questions.forEach((q) => {
    const g = q.group || "Other";
    groups.set(g, [...(groups.get(g) || []), q]);
  });
  return (
    <div className="gp-e-stack">
      {[...groups].map(([group, list]) => (
        <fieldset key={group} className="gp-a-fieldset">
          <legend className="gp-e-label">{group}</legend>
          {list.map((q, i) => {
            const v = answers[q.name] ?? null;
            const selectId = `${baseId}-${group}-${i}`;
            return (
              <div key={q.name} className="gp-a-attr">
                {q.type === "bool" ? (
                  <fieldset className="gp-a-fieldset">
                    <legend className="gp-a-attr-label">{q.label}</legend>
                    <div className="gp-a-seg">
                      {[
                        ["yes", "Yes", true],
                        ["no", "No", false],
                        ["unsure", "Not sure", null],
                      ].map(([key, label, value]) => (
                        <label key={key} className={`gp-a-seg-item${v === value ? " is-on" : ""}`}>
                          <input
                            type="radio"
                            className="visually-hidden"
                            name={`${selectId}-bool`}
                            checked={v === value}
                            onChange={() => onChange(q.name, value)}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : (
                  <>
                    <label className="gp-a-attr-label" htmlFor={selectId}>
                      {q.label}
                    </label>
                    <select
                      id={selectId}
                      className="form-select gp-a-select"
                      value={typeof v === "string" ? v : "unsure"}
                      onChange={(e) => onChange(q.name, e.target.value === "unsure" ? null : e.target.value)}
                    >
                      <option value="unsure">Not sure</option>
                      {(q.choices || []).map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}

export default function AssistantCommandCard({ command, onChange, onChanged, onOpenTab }) {
  const id = useId();
  const p = command.preview || {};
  const parts = Array.isArray(p.parts) ? p.parts : [];
  const changes = Array.isArray(p.changes) ? p.changes : [];
  const items = Array.isArray(p.items) ? p.items : [];
  const notes = Array.isArray(p.notes) ? p.notes : [];
  const status = command.status;
  const ready = status === "ready";
  const applied = status === "applied";
  const blocked = BLOCKED.includes(status);

  const choice = p.photo_choice ?? parts.find((x) => x.id === "post")?.photo_choice ?? null;
  const [text, setText] = useState(p.editable?.value ?? "");
  const [editing, setEditing] = useState(false);
  const [ticked, setTicked] = useState(() => parts.map((x) => x.id));
  const [partText, setPartText] = useState(() => partTextsOf(parts));
  const [photo, setPhoto] = useState(choice?.selected ?? null);
  const [answers, setAnswers] = useState(() => answersOf(p));
  // A new preview (after Choose or an upload): start again from what the AI prepared.
  const [seenPreview, setSeenPreview] = useState(command.preview);
  if (seenPreview !== command.preview) {
    setSeenPreview(command.preview);
    setText(p.editable?.value ?? "");
    setEditing(false);
    setTicked(parts.map((x) => x.id));
    setPartText(partTextsOf(parts));
    setPhoto(choice?.selected ?? null);
    setAnswers(answersOf(p));
  }
  const [busy, setBusy] = useState(""); // apply | cancel | undo | upload | choose:<id>
  const [error, setError] = useState(null);
  const statusRef = useRef(null);
  const editRef = useRef(null);
  const fileRef = useRef(null);
  const focusNext = useRef(false);

  // After Apply, Cancel, Undo, Choose or an upload the buttons change: focus moves to the card's new status line.
  useEffect(() => {
    if (focusNext.current) {
      focusNext.current = false;
      statusRef.current?.focus();
    }
  }, [command]);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const run = async (key, call) => {
    setBusy(key);
    setError(null);
    try {
      const next = await call();
      if (next) {
        focusNext.current = true;
        onChange(next);
      }
      return next;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setBusy("");
    }
  };

  /** Shown photo: while choosing, the one chosen; otherwise the prepared one. */
  const imageOf = (c, prepared) => (ready && c ? (c.options || []).find((o) => o.id === photo)?.url ?? null : prepared);
  const shown = imageOf(p.photo_choice, p.image_url ?? null);
  const photoChanged = choice && photo !== (choice.selected ?? null);

  const apply = () => {
    const body = parts.length
      ? {
          parts: ticked,
          edits: Object.fromEntries(
            ["description", "post"].flatMap((k) => {
              const original = parts.find((x) => x.id === k)?.editable?.value;
              const edited = partText[k]?.trim();
              return edited && edited !== original ? [[k, edited]] : [];
            }),
          ),
          ...(photoChanged ? { photo_id: photo ?? "none" } : {}),
        }
      : {
          ...(p.editable && text !== p.editable.value ? { text } : {}),
          ...(photoChanged ? { photo_id: photo ?? "none" } : {}),
          ...(p.attribute_form ? { attributes: Object.entries(answers).map(([name, value]) => ({ name, value })) } : {}),
        };
    return run("apply", async () => {
      const next = await assistantApi.apply(command.id, body);
      onChanged?.();
      return next;
    });
  };

  const undo = () =>
    run("undo", async () => {
      const next = await assistantApi.undo(command.id);
      onChanged?.();
      return next;
    });

  const onFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const problem = photoProblem(file);
    if (problem) {
      setError(messageError(problem));
      return;
    }
    await run("upload", async () => {
      const attachment = await assistantApi.attach(file);
      if (!attachment?.id) throw messageError("The photo did not upload. Please try again.");
      return assistantApi.upload(command.id, attachment.id);
    });
  };

  const google = changesGoogle(command.kind);
  const hasEditable = Boolean(p.editable) || parts.some((x) => x.editable);
  const applyLabel = parts.length
    ? `Apply ${ticked.length} ${ticked.length === 1 ? "step" : "steps"}`
    : google
      ? "Publish to Google"
      : "Apply";
  const applyDisabled = (Boolean(p.editable) && text.trim().length === 0) || (parts.length > 0 && ticked.length === 0);
  const linkTab = p.link ? tabOfLink(p.link.href) : null;

  let statusChip = null;
  if (applied) {
    statusChip = command.undone_at ? (
      <span className="gp-chip gp-e-chip-muted">Undone</span>
    ) : (
      <span className="gp-chip gp-chip-ok">Done</span>
    );
  } else if (status === "cancelled") {
    statusChip = <span className="gp-chip gp-e-chip-muted">Cancelled</span>;
  } else if (ready) {
    statusChip = <span className="gp-chip gp-chip-pink">Waiting for you</span>;
  } else if (status === "needs_choice" || status === "needs_info") {
    statusChip = <span className="gp-chip gp-chip-warn">Needs you</span>;
  }

  const statusWords = applied
    ? command.undone_at
      ? "Undone."
      : "Done."
    : status === "cancelled"
      ? "Cancelled."
      : ready
        ? "Ready. Check it, then press the button."
        : blocked
          ? `${BLOCKED_TITLES[status]}.`
          : "Needs your answer.";

  return (
    <div className="gp-a-card" aria-labelledby={`${id}-status`} role="group">
      <div className="gp-a-card-head">
        <p className="gp-a-card-status" id={`${id}-status`} ref={statusRef} tabIndex={-1}>
          <span className="visually-hidden">{statusWords} </span>
          {statusChip}
        </p>
      </div>

      {command.message && !ready && !applied &&
        (blocked ? (
          <Callout tone={status === "failed" ? "bad" : "warn"}>
            <strong className="gp-a-callout-title">{BLOCKED_TITLES[status]}</strong>
            <span>{command.message}</span>
          </Callout>
        ) : (
          <p className="gp-a-text">{command.message}</p>
        ))}

      {status === "needs_info" && p.upload && (
        <div className="gp-btns gp-a-btns">
          <input
            ref={fileRef}
            type="file"
            accept={PHOTO_ACCEPT}
            className="visually-hidden"
            tabIndex={-1}
            aria-hidden="true"
            onChange={onFile}
          />
          <ActionButton primary busy={busy === "upload"} onClick={() => fileRef.current?.click()}>
            {busy !== "upload" && <FiUpload size={16} aria-hidden="true" />}
            {busy === "upload" ? "Uploading…" : UPLOAD_LABELS[p.upload] || "Upload a photo"}
          </ActionButton>
          <span className="gp-note">PNG, JPEG or WebP, up to 5 MB.</span>
        </div>
      )}

      {status === "needs_choice" && Array.isArray(command.options) && command.options.length > 0 && (
        <ul className="gp-e-plain gp-a-options" aria-label="Choose one">
          {command.options.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                className="gp-btn gp-btn-ghost gp-a-option"
                disabled={Boolean(busy)}
                aria-busy={busy === `choose:${o.id}` || undefined}
                onClick={() => run(`choose:${o.id}`, () => assistantApi.choose(command.id, o.id))}
              >
                {busy === `choose:${o.id}` && <Spinner animation="border" size="sm" aria-hidden="true" />}
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {p.title && (ready || applied || status === "cancelled") && (
        <div className="gp-a-preview">
          <p className="gp-a-preview-title">{p.title}</p>
          {shown && <AuthImage src={shown} alt="The photo that will be used" className="gp-a-preview-img" />}
          {ready && p.photo_choice && <PhotoPicker choice={p.photo_choice} value={photo} onChange={setPhoto} />}
          {ready && p.attribute_form?.length > 0 && (
            <AttributeForm
              questions={p.attribute_form}
              answers={answers}
              onChange={(name, value) => setAnswers((all) => ({ ...all, [name]: value }))}
            />
          )}
          <Changes changes={changes} />
          <Items items={items} />

          {p.editable && ready && (
            <div className="gp-e-stack-sm">
              {editing ? (
                <>
                  <label htmlFor={`${id}-edit`} className="gp-e-label">
                    {p.editable.label}
                  </label>
                  <textarea
                    id={`${id}-edit`}
                    ref={editRef}
                    className="form-control gp-a-textarea"
                    rows={5}
                    maxLength={p.editable.max}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    aria-describedby={`${id}-count`}
                  />
                  <span className="gp-note" id={`${id}-count`}>
                    {text.length} / {p.editable.max}
                  </span>
                </>
              ) : (
                // The text is shown once: here, unless the changes above already show it.
                !changes.some((c) => c.after === text) && (
                  <>
                    <p className="gp-e-label">{p.editable.label}</p>
                    <p className="gp-a-editable">{text}</p>
                  </>
                )
              )}
            </div>
          )}

          {parts.length > 0 && (
            <ul className="gp-e-plain gp-a-parts" aria-label="What the AI will do">
              {parts.map((part) => {
                const on = ticked.includes(part.id);
                const boxId = `${id}-${part.id}`;
                const partImage = imageOf(part.photo_choice, part.image_url ?? null);
                const partChanges = Array.isArray(part.changes) ? part.changes : [];
                return (
                  <li key={part.id} className={`gp-a-part${on && ready ? " is-on" : ""}`}>
                    {ready ? (
                      <label className="gp-e-check gp-a-part-check" htmlFor={boxId}>
                        <input
                          id={boxId}
                          type="checkbox"
                          checked={on}
                          onChange={(e) =>
                            setTicked((list) =>
                              e.target.checked ? [...list, part.id] : list.filter((x) => x !== part.id),
                            )
                          }
                        />
                        {part.title}
                      </label>
                    ) : (
                      <p className="gp-a-item-title">{part.title}</p>
                    )}
                    {partImage && <AuthImage src={partImage} alt="The photo that will be used" className="gp-a-preview-img" />}
                    {ready && on && part.photo_choice && (
                      <PhotoPicker choice={part.photo_choice} value={photo} onChange={setPhoto} />
                    )}
                    {partChanges.length > 0 && !(part.editable && ready && editing) && (
                      <ul className="gp-e-plain gp-a-part-changes">
                        {partChanges.map((c, i) => (
                          <li key={`${c.label}-${i}`}>
                            <span className="gp-a-strong">{c.label}</span>
                            {c.after && c.after !== c.label ? ` — ${c.after}` : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Items items={part.items} small />
                    {part.editable && ready && on && editing && (
                      <textarea
                        aria-label={part.editable.label}
                        className="form-control gp-a-textarea"
                        rows={5}
                        maxLength={part.editable.max}
                        value={partText[part.id] ?? ""}
                        onChange={(e) => setPartText((all) => ({ ...all, [part.id]: e.target.value }))}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {notes.length > 0 && (
            <ul className="gp-e-plain gp-a-notes">
              {notes.map((n) => (
                <li key={n} className="gp-note">
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {applied && command.result && (
        <p className="gp-a-result" role="status">
          <FiCheck size={16} aria-hidden="true" />
          <span>{command.result}</span>
        </p>
      )}

      {error && (
        <Callout tone="bad" role="alert">
          {chatErrorText(error)}
        </Callout>
      )}

      <div className="gp-btns gp-a-btns">
        {ready && (
          <>
            <ActionButton primary busy={busy === "apply"} disabled={applyDisabled || Boolean(busy)} onClick={apply}>
              {busy !== "apply" && <FiCheck size={16} aria-hidden="true" />}
              {applyLabel}
            </ActionButton>
            {hasEditable && !editing && (
              <ActionButton disabled={Boolean(busy)} onClick={() => setEditing(true)}>
                <FiEdit2 size={16} aria-hidden="true" />
                Edit
              </ActionButton>
            )}
            <ActionButton
              busy={busy === "cancel"}
              disabled={Boolean(busy)}
              onClick={() => run("cancel", () => assistantApi.cancel(command.id))}
            >
              Cancel
            </ActionButton>
          </>
        )}
        {command.can_undo && (
          <ActionButton busy={busy === "undo"} disabled={Boolean(busy)} onClick={undo}>
            {busy !== "undo" && <FiCornerUpLeft size={16} aria-hidden="true" />}
            Undo
          </ActionButton>
        )}
        {linkTab && (applied || blocked) && onOpenTab && (
          <ActionButton onClick={() => onOpenTab(linkTab)}>Open {TAB_NAMES[linkTab]}</ActionButton>
        )}
      </div>
      {ready && (
        <p className="gp-note">
          {google || parts.length
            ? "Nothing has changed yet. Check it, then press the button to send it to Google."
            : "Nothing has changed yet. Check it, then press Apply."}
        </p>
      )}
    </div>
  );
}
