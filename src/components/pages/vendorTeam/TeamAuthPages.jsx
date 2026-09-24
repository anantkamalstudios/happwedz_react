import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "../../../services/api/axiosInstance";
import { saveTeamSession } from "./teamSession";
import "../adminVendor/crm/crm.css";

// The two doors a team member comes through: the invitation link, and the
// sign-in form afterwards. Neither belongs to the vendor dashboard, so both are
// plain pages of their own.

const PUBLIC = "/crm/public/team";

const message = (error, fallback) => error?.response?.data?.message || fallback;

const Shell = ({ title, subtitle, children, footer }) => (
  <div className="crm-auth">
    <div className="crm-auth-card">
      <div className="crm-auth-brand">HappyWedz</div>
      <h1>{title}</h1>
      {subtitle && <p className="crm-sub">{subtitle}</p>}
      {children}
      {footer && <div className="crm-auth-foot">{footer}</div>}
    </div>
  </div>
);

export const TeamAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    axiosInstance
      .get(`${PUBLIC}/invites/${token}`)
      .then((res) => alive && setInvite(res.data))
      .catch((err) => alive && setError(message(err, "This invitation link is not valid any more.")))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return setError("Choose a password of at least 8 characters.");
    if (password !== again) return setError("The two passwords are not the same.");
    setError("");
    setSaving(true);
    try {
      const res = await axiosInstance.post(`${PUBLIC}/invites/${token}/accept`, { password });
      saveTeamSession(res.data);
      navigate("/vendor-team", { replace: true });
    } catch (err) {
      setError(message(err, "Could not accept this invitation."));
      setSaving(false);
    }
  };

  if (loading) return <Shell title="One moment…" />;

  if (!invite) {
    return (
      <Shell title="This link has expired" subtitle={error}>
        <p className="crm-sub">Ask the studio to invite you again — it only takes them a moment.</p>
      </Shell>
    );
  }

  return (
    <Shell
      title={`Join ${invite.businessName}`}
      subtitle={`You have been added as ${invite.roleLabel}. Choose a password and you are in.`}
      footer={<>Already set one? <Link to="/vendor-team/login">Sign in</Link></>}
    >
      <form onSubmit={submit}>
        <div className="crm-field">
          <label className="crm-label">Your email</label>
          <input className="crm-input" value={invite.email} readOnly disabled />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-pass">Choose a password *</label>
          <input
            id="team-pass"
            type="password"
            className="crm-input"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <div className="crm-muted crm-small" style={{ marginTop: 5 }}>At least 8 characters.</div>
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-pass2">Type it again *</label>
          <input
            id="team-pass2"
            type="password"
            className="crm-input"
            value={again}
            autoComplete="new-password"
            onChange={(e) => setAgain(e.target.value)}
          />
        </div>
        {error && <div className="crm-error">{error}</div>}
        <button type="submit" className="crm-btn crm-btn-primary crm-auth-submit" disabled={saving}>
          {saving ? "Setting up…" : "Set password and start"}
        </button>
      </form>
    </Shell>
  );
};

export const TeamLoginPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(params.get("session") === "expired" ? "Your session has ended. Please sign in again." : "");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await axiosInstance.post(`${PUBLIC}/login`, { email, password });
      saveTeamSession(res.data);
      navigate("/vendor-team", { replace: true });
    } catch (err) {
      setError(message(err, "Could not sign you in."));
      setSaving(false);
    }
  };

  return (
    <Shell
      title="Team sign in"
      subtitle="For people invited to a studio's CRM. Studio owners sign in on the vendor page."
      footer={<>Are you the studio owner? <Link to="/vendor-login">Sign in here</Link></>}
    >
      <form onSubmit={submit}>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-email">Email</label>
          <input
            id="team-email"
            type="email"
            className="crm-input"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="crm-field">
          <label className="crm-label" htmlFor="team-password">Password</label>
          <input
            id="team-password"
            type="password"
            className="crm-input"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="crm-error">{error}</div>}
        <button type="submit" className="crm-btn crm-btn-primary crm-auth-submit" disabled={saving}>
          {saving ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Shell>
  );
};
