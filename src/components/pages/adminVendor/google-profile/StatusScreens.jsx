import React from "react";
import { Spinner } from "react-bootstrap";
import { FiMail } from "react-icons/fi";
import { AsideCard, Callout, FixLink, GrowthosLink, ProfileHead, RefreshButton } from "./GpParts";
import { SETTINGS_PATH, formatClock } from "./gpFormat";

// Screens 2 to 5 and the "email already in GrowthOS" error. Each one is told the
// view, the GrowthOS address, and what to do on its buttons.

const ownerEmail = (view) => view?.growthos?.owner_email || view?.storefront?.email || "your email";
const businessName = (view) =>
  view?.growthos?.profile_title || view?.storefront?.business_name || "Your business";
const profileLine = (view) =>
  view?.growthos?.created_by_growthos
    ? "Created by GrowthOS in your Google account"
    : "Your Google Business Profile, connected to GrowthOS";

/** "Send the email again" / "Send a new link", held back until resend_available_at. */
function ResendButton({ waitUntil, busy, onResend, primary = false, children }) {
  const waiting = Boolean(waitUntil);
  return (
    <button
      type="button"
      className={`gp-btn ${primary ? "gp-btn-primary" : "gp-btn-ghost"}`}
      onClick={onResend}
      disabled={busy || waiting}
      aria-busy={busy || undefined}
    >
      {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiMail size={18} aria-hidden="true" />}
      {waiting ? `You can send it again at ${formatClock(waitUntil)}` : children}
    </button>
  );
}

export function InvitedScreen({ view, busy, resendWait, onRefresh, onResend }) {
  const email = ownerEmail(view);
  const name = view?.storefront?.business_name || "your business";
  return (
    <section className="gp-grid2">
      <div className="gp-card">
        <Callout tone="ok">Your details were sent to GrowthOS.</Callout>
        <h2 className="gp-h2">Check your email to set your password</h2>
        <p className="gp-lead">
          GrowthOS emailed <b>{email}</b>. Open the email, set a password, and you'll go straight to connecting Google.
          The link works for 7 days.
        </p>
        <div className="gp-mail" role="group" aria-label="The email you'll get">
          <span className="gp-muted">From: GrowthOS AI · no-reply@gmb.aslai.cloud</span>
          <span className="gp-mail-subj">Your GrowthOS account for {name} is ready</span>
          <span>HappyWedz set up a GrowthOS account for {name}, with you as the Owner. [Set your password]</span>
        </div>
        <div className="gp-btns">
          <RefreshButton primary busy={busy === "refresh"} disabled={Boolean(busy)} onClick={onRefresh}>
            I've set my password
          </RefreshButton>
          <ResendButton waitUntil={resendWait} busy={busy === "resend"} onResend={onResend}>
            Send the email again
          </ResendButton>
        </div>
        <p className="gp-note">Can't find it? Check spam or promotions. Wrong email? Contact HappyWedz support.</p>
      </div>
      <AsideCard title="What happens next">
        <ol className="gp-next">
          <li>Set your GrowthOS password.</li>
          <li>Sign in with Google.</li>
          <li>Pick your profile, or let GrowthOS create it.</li>
          <li>Google verifies the new profile.</li>
        </ol>
      </AsideCard>
    </section>
  );
}

export function ExpiredScreen({ view, busy, resendWait, onResend }) {
  return (
    <section className="gp-grid2">
      <div className="gp-card">
        <Callout tone="warn">The set-password link expired. Links work for 7 days.</Callout>
        <h2 className="gp-h2">Get a new link</h2>
        <p className="gp-lead">
          We'll ask GrowthOS to email <b>{ownerEmail(view)}</b> again. The old link stops working.
        </p>
        <div className="gp-btns">
          <ResendButton primary waitUntil={resendWait} busy={busy === "resend"} onResend={onResend}>
            Send a new link
          </ResendButton>
        </div>
      </div>
      <AsideCard title="Your details are saved">
        <p className="gp-lead">You don't need to fill anything in again. Only the email link is new.</p>
      </AsideCard>
    </section>
  );
}

const CONNECT_WORDS = {
  yes: {
    lead:
      "You told us you already have a Google Business Profile. In GrowthOS, sign in with the Google account that owns it and pick it. Nothing new is created.",
    asideTitle: "Picking your profile",
    aside:
      "After signing in with Google, GrowthOS lists the profiles in that account. Pick yours and nothing new is created.",
  },
  no: {
    lead:
      "You told us you don't have a Google Business Profile yet. In GrowthOS, sign in with Google. GrowthOS fills in a new profile from your HappyWedz details. You check it, and it's created in your own Google account.",
    asideTitle: "Already have a profile?",
    aside:
      "No problem. After signing in with Google, GrowthOS lists the profiles in that account. Pick yours and nothing new is created.",
  },
  unsure: {
    lead:
      "You weren't sure if you have a Google Business Profile. In GrowthOS, sign in with Google. GrowthOS checks Google for a matching profile before creating a new one, and anything new is created in your own Google account.",
    asideTitle: "Already have a profile?",
    aside:
      "No problem. After signing in with Google, GrowthOS lists the profiles in that account. Pick yours and nothing new is created.",
  },
};

export function ConnectScreen({ view, loginUrl, busy, onRefresh }) {
  const words = CONNECT_WORDS[view?.answer?.has_google_profile] || CONNECT_WORDS.no;
  return (
    <section className="gp-grid2">
      <div className="gp-card gp-card-tint">
        <Callout tone="ok">Your GrowthOS account is ready.</Callout>
        <h2 className="gp-h2">Connect your Google account</h2>
        <p className="gp-lead">{words.lead}</p>
        <div className="gp-btns">
          <GrowthosLink href={loginUrl}>Continue in GrowthOS</GrowthosLink>
          <RefreshButton busy={busy === "refresh"} disabled={Boolean(busy)} onClick={onRefresh}>
            I've connected it
          </RefreshButton>
        </div>
        <p className="gp-note">Use the Google account you want to own the profile. A personal Gmail works.</p>
      </div>
      <AsideCard title={words.asideTitle}>
        <p className="gp-lead">{words.aside}</p>
      </AsideCard>
    </section>
  );
}

export function VerifyScreen({ view, loginUrl, busy, onRefresh }) {
  return (
    <section className="gp-grid2">
      <div className="gp-card">
        <ProfileHead name={businessName(view)} line={profileLine(view)}>
          <span className="gp-chip gp-chip-warn">Google is verifying</span>
        </ProfileHead>
        <p className="gp-lead">
          Google needs to confirm your business before the profile shows on Search and Maps. Google sends a code by
          postcard, phone call, SMS or email. Google chooses which methods it offers. Enter the code in GrowthOS.
        </p>
        <div className="gp-btns">
          <GrowthosLink href={loginUrl}>Enter the code in GrowthOS</GrowthosLink>
          <RefreshButton busy={busy === "refresh"} disabled={Boolean(busy)} onClick={onRefresh}>
            Check again
          </RefreshButton>
        </div>
      </div>
      <AsideCard title="How long does it take?">
        <p className="gp-lead">
          A postcard can take a few days to arrive. Phone, SMS and email codes are usually quicker. Some businesses are
          verified automatically.
        </p>
      </AsideCard>
    </section>
  );
}

const LATER_BOXES = ["Views on Google", "Calls and direction requests", "Rating and new reviews"];

export function LiveScreen({ view, loginUrl }) {
  return (
    <section className="gp-stack">
      <div className="gp-card">
        <div className="gp-live-head">
          <ProfileHead name={businessName(view)} line={profileLine(view)}>
            <div className="gp-chips">
              <span className="gp-chip gp-chip-ok">Verified by Google</span>
              <span className="gp-chip gp-chip-pink">Managed in GrowthOS</span>
            </div>
          </ProfileHead>
          <GrowthosLink href={loginUrl}>Manage in GrowthOS</GrowthosLink>
        </div>
        <Callout tone="ok">
          Your profile can now appear on Google Search and Maps. Reviews, posts and profile edits are handled in
          GrowthOS.
        </Callout>
      </div>
      <div className="gp-card">
        <div className="gp-later-head">
          <h3 className="gp-h3">Google numbers inside HappyWedz</h3>
          <span className="gp-chip gp-chip-warn">Coming later</span>
        </div>
        <div className="gp-later">
          {LATER_BOXES.map((title) => (
            <div key={title} className="gp-later-box">
              <b>{title}</b>
              <span>Coming later</span>
            </div>
          ))}
        </div>
        <p className="gp-note">
          Google numbers will show here in a later update. Until then, you can see them in GrowthOS.
        </p>
      </div>
    </section>
  );
}

export function TakenScreen({ view, loginUrl, onTryAgain }) {
  return (
    <section className="gp-grid2">
      <div className="gp-card">
        <Callout tone="bad" role="alert">
          <b>{ownerEmail(view)} already has a GrowthOS account.</b> HappyWedz can't create a second one with the same
          email.
        </Callout>
        <h2 className="gp-h2">Use your existing GrowthOS account</h2>
        <p className="gp-lead">
          Sign in to GrowthOS with this email and connect Google from there. If you'd like a separate account for this
          business, change your login email in Settings and try again.
        </p>
        <div className="gp-btns">
          <GrowthosLink href={loginUrl}>Sign in to GrowthOS</GrowthosLink>
          <FixLink to={SETTINGS_PATH} className="gp-btn gp-btn-ghost">
            Change email in Settings
          </FixLink>
          <button type="button" className="gp-btn gp-btn-ghost" onClick={onTryAgain}>
            Try again
          </button>
        </div>
      </div>
      <AsideCard title="Why this happens">
        <p className="gp-lead">
          Each GrowthOS account needs its own email. This email was used for GrowthOS before, either directly or through
          another partner.
        </p>
      </AsideCard>
    </section>
  );
}
