import React, { useCallback, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiMapPin, FiWifiOff } from "react-icons/fi";
import googleProfileApi, { errorCode, errorMessage } from "../../../services/api/googleProfileApi";
import { useToast } from "../../layouts/toasts/Toast";
import PlanFeatureNotice from "./PlanFeatureNotice";
import StartScreen from "./google-profile/StartScreen";
import {
  ConnectScreen,
  ExpiredScreen,
  InvitedScreen,
  LiveScreen,
  TakenScreen,
  VerifyScreen,
} from "./google-profile/StatusScreens";
import { StepStrip } from "./google-profile/GpParts";
import { GROWTHOS_LOGIN_FALLBACK, STEP_FOR_SCREEN, formatWhen, msUntil } from "./google-profile/gpFormat";
import "./google-profile/GoogleProfile.css";

// The vendor's Google Business Profile, set up through GrowthOS AI (a HappyWedz partner).
// The HappyWedz server talks to GrowthOS and tells this page which screen to show; the
// Google steps themselves happen in GrowthOS, which these screens link out to.

const NETWORK_MESSAGE = "Could not reach HappyWedz. Check your internet connection and try again.";
const LOCKED_TITLE = "Google Profile";
const LOCKED_TEXT =
  "Show up when couples search on Google and Maps. Available on plans that include Google Profile.";

export default function GoogleProfilePage() {
  const { addToast } = useToast();
  const headingRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | failed | locked | ready
  const [loadError, setLoadError] = useState({ network: false, message: "" });
  const [view, setView] = useState(null);
  const [busy, setBusy] = useState(null); // null | "refresh" | "resend" | "setup"
  const [problem, setProblem] = useState(null); // why the last "Set up" failed
  const [retrying, setRetrying] = useState(false); // "Try again" pressed on the email-taken screen
  const [, setTick] = useState(0);

  // Move the reader to the top of the new screen after a button changed it.
  const showNewScreen = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setStatus("loading");
    try {
      const data = await googleProfileApi.get();
      setView(data);
      setStatus(data ? "ready" : "failed");
    } catch (err) {
      const code = errorCode(err);
      if (code === "PLAN_MODULE_LOCKED") {
        setStatus("locked");
        return;
      }
      if (silent) return;
      setLoadError({
        network: code === "network",
        message:
          code === "network"
            ? NETWORK_MESSAGE
            : errorMessage(err, "Something went wrong. Please try again."),
      });
      setStatus("failed");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Re-draw when the resend wait is over, so the button turns back on by itself.
  const resendAt = view?.resend_available_at;
  useEffect(() => {
    const wait = msUntil(resendAt);
    if (!wait) return undefined;
    const timer = setTimeout(() => setTick((n) => n + 1), Math.min(wait + 500, 2147483647));
    return () => clearTimeout(timer);
  }, [resendAt]);
  const resendWait = msUntil(resendAt) > 0 ? resendAt : null;

  // A failed action: the plan lost the module, the network dropped, or the server said why.
  const actionFailed = (err, fallback) => {
    const code = errorCode(err);
    if (code === "PLAN_MODULE_LOCKED") {
      setStatus("locked");
      return;
    }
    addToast(code === "network" ? NETWORK_MESSAGE : errorMessage(err, fallback), "error");
  };

  const handleRefresh = async () => {
    setBusy("refresh");
    try {
      const next = await googleProfileApi.refresh();
      const changed = next?.screen !== view?.screen;
      setView(next);
      if (changed) {
        addToast("Status updated from GrowthOS.");
        showNewScreen();
      } else {
        addToast("Nothing has changed yet. Finish the step, then check again.");
      }
    } catch (err) {
      actionFailed(err, "Could not check your status. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const handleResend = async () => {
    setBusy("resend");
    try {
      const next = await googleProfileApi.resend();
      setView(next);
      addToast(`A new link was emailed to ${next?.growthos?.owner_email || next?.storefront?.email || "you"}.`);
      if (next?.screen !== view?.screen) showNewScreen();
    } catch (err) {
      const code = errorCode(err);
      const body = err?.response?.data || {};
      if (code === "too_soon") {
        const at = body.resend_available_at || body.data?.resend_available_at;
        if (body.data?.screen) setView(body.data);
        else if (at) setView((current) => (current ? { ...current, resend_available_at: at } : current));
        addToast(errorMessage(err, "Please wait a few minutes before sending it again."), "error");
      } else if (code === "invalid_state") {
        addToast(errorMessage(err, "Your status has moved on. Showing the latest."), "error");
        load({ silent: true });
      } else {
        actionFailed(err, "Could not send the email. Please try again.");
      }
    } finally {
      setBusy(null);
    }
  };

  const handleSetup = async (body) => {
    setBusy("setup");
    setProblem(null);
    try {
      const next = await googleProfileApi.setup(body);
      setView(next);
      setRetrying(false);
      addToast(`Sent to GrowthOS. Check ${next?.growthos?.owner_email || next?.storefront?.email || "your email"}.`);
      showNewScreen();
    } catch (err) {
      const code = errorCode(err);
      const answer = err?.response?.data || {};
      if (code === "PLAN_MODULE_LOCKED") {
        setStatus("locked");
      } else if (code === "email_taken" && answer.data?.screen) {
        setView(answer.data);
        setRetrying(false);
        showNewScreen();
      } else if (code === "network") {
        setProblem({ message: NETWORK_MESSAGE });
      } else {
        setProblem({
          message: errorMessage(err, "Could not send your details. Please try again."),
          fields: code === "validation_error" ? answer.fields : null,
        });
      }
    } finally {
      setBusy(null);
    }
  };

  const tryAgainFromTaken = () => {
    setProblem(null);
    setRetrying(true);
    // Fresh storefront details, in case the email was just changed there.
    load({ silent: true });
    showNewScreen();
  };

  if (status === "locked") {
    return <PlanFeatureNotice title={LOCKED_TITLE} description={LOCKED_TEXT} />;
  }

  const screen = retrying && view?.screen === "taken" ? "start" : view?.screen;
  const loginUrl = view?.growthos_login_url || GROWTHOS_LOGIN_FALLBACK;
  const known = Object.prototype.hasOwnProperty.call(STEP_FOR_SCREEN, screen || "");

  const renderScreen = () => {
    if (status === "loading") {
      return (
        <div className="gp-card gp-state" role="status">
          <Spinner animation="border" size="sm" aria-hidden="true" />
          <span>Loading your Google Profile…</span>
        </div>
      );
    }

    if (status === "failed" || !known) {
      return (
        <div className="gp-card gp-state" role="alert">
          <span className="gp-state-icon" aria-hidden="true">
            {loadError.network ? <FiWifiOff size={26} /> : <FiMapPin size={26} />}
          </span>
          <h2 className="gp-h3">Couldn't load your Google Profile</h2>
          <p className="gp-lead">{loadError.message || "Something went wrong. Please try again."}</p>
          <button type="button" className="gp-btn gp-btn-primary" onClick={() => load()}>
            Try again
          </button>
        </div>
      );
    }

    const common = { view, loginUrl, busy, onRefresh: handleRefresh };
    switch (screen) {
      case "start":
        return (
          <StartScreen
            key={retrying ? "retry" : "first"}
            view={view}
            busy={busy === "setup"}
            problem={problem}
            onSubmit={handleSetup}
          />
        );
      case "invited":
        return <InvitedScreen {...common} resendWait={resendWait} onResend={handleResend} />;
      case "expired":
        return <ExpiredScreen {...common} resendWait={resendWait} onResend={handleResend} />;
      case "connect":
        return <ConnectScreen {...common} />;
      case "verify":
        return <VerifyScreen {...common} />;
      case "live":
        return <LiveScreen {...common} />;
      case "taken":
        return <TakenScreen {...common} onTryAgain={tryAgainFromTaken} />;
      default:
        return null;
    }
  };

  const showSteps = status === "ready" && known;
  const checkedAt = showSteps && screen !== "start" ? formatWhen(view?.checked_at) : "";

  return (
    <div className="gp-page">
      <div className="gp-container">
        <header className="gp-header">
          <h1 className="gp-title" ref={headingRef} tabIndex={-1}>
            Google Business Profile
          </h1>
          <span className="gp-crumbs">
            <b>Dashboard</b> · Google Profile
          </span>
        </header>

        {showSteps && <StepStrip done={STEP_FOR_SCREEN[screen]} />}
        {checkedAt && <p className="gp-note gp-checked">Status last checked {checkedAt}</p>}

        {renderScreen()}
      </div>
    </div>
  );
}
