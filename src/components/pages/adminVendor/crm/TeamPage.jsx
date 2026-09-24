import React, { useCallback, useEffect, useState } from "react";
import { Copy, Info, Mail, Trash2, UserPlus } from "lucide-react";
import { crmApi, errorMessage } from "./crmApi";
import { formatDate } from "./crmFormat";
import { Spinner } from "./crmUi";
import { useToast } from "../../../layouts/toasts/Toast";

// The owner's team screen. Three fixed roles, no permission builder: what each
// one can do is written out below rather than left to the owner to work out.

const ROLE_HELP = {
  manager: "Sees every client and works on all of them. Cannot change the team, the plan or your business details.",
  staff: "Sees only the clients given to them, and does everything with those — quotations, invoices and payments included.",
};

const InviteForm = ({ roles, onDone, onCancel }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", role: "staff" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const result = await crmApi.inviteTeamMember(form);
      addToast(result.message, "success");
      setLink(result.link);
      onDone(result.member);
    } catch (err) {
      setError(errorMessage(err, "Could not invite them."));
    } finally {
      setSaving(false);
    }
  };

  if (link) {
    return (
      <div className="crm-card">
        <div className="crm-panel-title"><span>Invitation sent</span></div>
        <p className="crm-sub" style={{ marginBottom: 10 }}>
          They have an email with a link to set their password. You can also send them this link yourself:
        </p>
        <div className="crm-invite-link">
          <code>{link}</code>
          <button
            type="button"
            className="crm-btn"
            onClick={() => {
              navigator.clipboard?.writeText(link).then(
                () => addToast("Link copied.", "success"),
                () => addToast("Copy it from the box.", "error"),
              );
            }}
          >
            <Copy size={14} /> Copy
          </button>
        </div>
        <div className="crm-actions" style={{ marginTop: 14 }}>
          <button type="button" className="crm-btn crm-btn-primary" onClick={onCancel}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <form className="crm-card" onSubmit={submit}>
      <div className="crm-panel-title"><span>Invite someone</span></div>
      <div className="crm-grid-2" style={{ gap: "0 10px" }}>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-name">Name *</label>
          <input id="team-name" className="crm-input" value={form.name} onChange={set("name")} autoFocus />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-email">Email *</label>
          <input id="team-email" type="email" className="crm-input" value={form.email} onChange={set("email")} />
        </div>
      </div>
      <div className="crm-field">
        <label className="crm-label" htmlFor="team-role">What can they do?</label>
        <select id="team-role" className="crm-input" value={form.role} onChange={set("role")}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
        <div className="crm-muted crm-small" style={{ marginTop: 6 }}>{ROLE_HELP[form.role]}</div>
      </div>
      {error && <div className="crm-error">{error}</div>}
      <div className="crm-actions">
        <button type="button" className="crm-btn" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>
          {saving ? "Sending…" : "Send invitation"}
        </button>
      </div>
    </form>
  );
};

const TeamPage = () => {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await crmApi.team());
    } catch (err) {
      setError(errorMessage(err, "Could not load your team."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = async (member, patch) => {
    setBusyId(member.id);
    try {
      const result = await crmApi.updateTeamMember(member.id, patch);
      addToast(result.message, "success");
      await load();
    } catch (err) {
      addToast(errorMessage(err, "Could not save that."), "error");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (member) => {
    const warning = member.clients
      ? `Remove ${member.name}? Their ${member.clients} client${member.clients === 1 ? "" : "s"} will go back to unassigned.`
      : `Remove ${member.name}?`;
    if (!window.confirm(warning)) return;
    setBusyId(member.id);
    try {
      const result = await crmApi.removeTeamMember(member.id);
      addToast(result.message, "success");
      await load();
    } catch (err) {
      addToast(errorMessage(err, "Could not remove them."), "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading && !data) return <Spinner />;
  if (error) {
    return (
      <div className="crm-card crm-empty">
        <h3>{error}</h3>
        <button className="crm-btn" onClick={load}>Try again</button>
      </div>
    );
  }
  if (!data) return null;

  const full = data.seatsUsed >= data.seatLimit;

  return (
    <div className="crm-analytics">
      <div className="crm-head" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="crm-title" style={{ fontSize: 18 }}>Your team</h2>
          <div className="crm-sub">
            People from your studio who work on clients with you. {data.seatsUsed} of {data.seatLimit} places used.
          </div>
        </div>
        {!inviting && (
          <button className="crm-btn crm-btn-primary" onClick={() => setInviting(true)} disabled={full}>
            <UserPlus size={15} /> Invite someone
          </button>
        )}
      </div>

      {full && !inviting && (
        <div className="crm-note">
          <Info size={15} />
          <span>Your plan includes {data.seatLimit} team members. Remove someone before inviting another.</span>
        </div>
      )}

      {inviting && (
        <InviteForm
          roles={data.roles}
          onDone={() => load()}
          onCancel={() => {
            setInviting(false);
            load();
          }}
        />
      )}

      <div className="crm-card">
        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Can do</th>
                <th className="crm-num">Clients</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {data.members.map((member) => (
                <tr key={member.id}>
                  <td>
                    <div className="crm-strong">
                      {member.name}
                      {member.isOwner && <span className="crm-muted" style={{ fontWeight: 400 }}> (you)</span>}
                    </div>
                    <div className="crm-muted crm-small">{member.email}</div>
                  </td>
                  <td>
                    {member.isOwner ? (
                      <span className="crm-badge crm-tone-violet">Owner</span>
                    ) : (
                      <>
                        <label className="crm-sr-only" htmlFor={`role-${member.id}`}>Role for {member.name}</label>
                        <select
                          id={`role-${member.id}`}
                          className="crm-input"
                          style={{ maxWidth: 140 }}
                          value={member.role}
                          disabled={busyId === member.id}
                          onChange={(e) => change(member, { role: e.target.value })}
                        >
                          {data.roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                        <div className="crm-muted crm-small" style={{ marginTop: 4, maxWidth: 260 }}>{ROLE_HELP[member.role]}</div>
                      </>
                    )}
                  </td>
                  <td className="crm-num">{member.clients}</td>
                  <td>
                    {member.status === "active" && <span className="crm-badge crm-tone-green">Active</span>}
                    {member.status === "invited" && (
                      <>
                        <span className="crm-badge crm-tone-amber">Invited</span>
                        {member.inviteExpiresAt && (
                          <div className="crm-muted crm-small" style={{ marginTop: 4 }}>
                            Link works until {formatDate(member.inviteExpiresAt)}
                          </div>
                        )}
                      </>
                    )}
                    {member.status === "disabled" && <span className="crm-badge crm-tone-grey">Switched off</span>}
                    {member.lastLoginAt && (
                      <div className="crm-muted crm-small" style={{ marginTop: 4 }}>Last in {formatDate(member.lastLoginAt)}</div>
                    )}
                  </td>
                  <td>
                    {!member.isOwner && (
                      <div className="crm-actions">
                        {member.status === "invited" && (
                          <button className="crm-btn crm-btn-sm" disabled={busyId === member.id} onClick={() => setInviting(true)}>
                            <Mail size={13} /> Resend
                          </button>
                        )}
                        {member.status === "active" && (
                          <button className="crm-btn crm-btn-sm" disabled={busyId === member.id} onClick={() => change(member, { status: "disabled" })}>
                            Switch off
                          </button>
                        )}
                        {member.status === "disabled" && (
                          <button className="crm-btn crm-btn-sm" disabled={busyId === member.id} onClick={() => change(member, { status: "active" })}>
                            Switch on
                          </button>
                        )}
                        <button className="crm-btn crm-btn-sm" disabled={busyId === member.id} onClick={() => remove(member)}>
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.unassigned > 0 && (
          <div className="crm-muted crm-small" style={{ marginTop: 12 }}>
            {data.unassigned} client{data.unassigned === 1 ? " is" : "s are"} not assigned to anyone yet. Give them out from the pipeline board.
          </div>
        )}
      </div>

      <div className="crm-note">
        <Info size={15} />
        <span>
          Everyone you invite signs in at <strong>happywedz.com/vendor-team/login</strong> with their own email and password.
          They only ever see the CRM — never your plan, your payouts or your storefront.
        </span>
      </div>
    </div>
  );
};

export default TeamPage;
