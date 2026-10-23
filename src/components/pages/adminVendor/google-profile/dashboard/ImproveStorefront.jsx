// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" step 1 (helper D): what the vendor's HappyWedz storefront can give (About us, FAQs) and "Use my
// storefront", which copies them to GrowthOS (only when pressed). API: gpManageApi.storefront → { description, faqs,
// photos, service_text }; gpManageApi.useStorefront → the GrowthOS facts { description, faqs, logo_url, cover_url }.
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiArrowUpRight, FiUploadCloud } from "react-icons/fi";
import { gpManageApi } from "../../../../../services/api/googleProfileApi";
import { Callout, FixLink, RefreshButton } from "../GpParts";
import { storefrontSection } from "../gpFormat";
import { TabLoading } from "./ProfileShared";
import { ImproveError } from "./ImproveParts";

const faqWord = (n) => `${n} ${n === 1 ? "FAQ" : "FAQs"}`;

export default function ImproveStorefront({ storefront, facts, onUsed }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  if (storefront.status === "loading") return <TabLoading label="Loading your storefront…" />;
  if (storefront.status === "error") {
    return (
      <div className="gp-e-stack-sm">
        <ImproveError error={storefront.error} fallback="We couldn't load your storefront. Please try again." />
        <div className="gp-btns">
          <RefreshButton onClick={() => storefront.reload()}>Try again</RefreshButton>
        </div>
      </div>
    );
  }

  const description = typeof storefront.data?.description === "string" ? storefront.data.description.trim() : "";
  const faqs = Array.isArray(storefront.data?.faqs) ? storefront.data.faqs : [];
  const used = Boolean(facts?.description);

  if (!description && faqs.length === 0) {
    return (
      <div className="gp-e-stack-sm">
        <Callout tone="warn">
          Your storefront has no About us text or FAQs yet. Add them to your storefront first, then come back here.
        </Callout>
        <div className="gp-btns">
          <FixLink to={storefrontSection("vendor-basic")} className="gp-btn gp-btn-ghost">
            Open my storefront
            <FiArrowUpRight size={18} aria-hidden="true" />
          </FixLink>
        </div>
      </div>
    );
  }

  const use = async () => {
    setBusy(true);
    setError(null);
    setMessage("");
    try {
      const answer = await gpManageApi.useStorefront();
      onUsed(answer);
      const saved = Array.isArray(answer?.faqs) ? answer.faqs.length : null;
      setMessage(
        answer?.description
          ? `Done. GrowthOS now has your description${saved ? ` and ${faqWord(saved)}` : ""}. The AI uses them for your Google profile.`
          : "Sent. GrowthOS has no description from it yet; check your storefront's About us text.",
      );
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="gp-e-stack">
      <p className="gp-note">
        The AI writes a better Google description when it knows your business. This copies your storefront's About us text
        and FAQs to GrowthOS. Nothing is copied until you press the button.
      </p>
      <div className="gp-e-ai-box">
        <p className="gp-e-label">What will be sent</p>
        <div className="gp-e-stack-sm">
          <span className="gp-note">About us</span>
          {description ? <p className="gp-e-summary">{description}</p> : <p className="gp-muted">No About us text</p>}
        </div>
        <p className="gp-note">{faqs.length ? `${faqWord(faqs.length)} from your storefront` : "No FAQs on your storefront"}</p>
      </div>
      <ImproveError error={error} />
      <div aria-live="polite">{message && <Callout tone="ok">{message}</Callout>}</div>
      <div className="gp-btns">
        <button type="button" className="gp-btn gp-btn-primary" onClick={use} disabled={busy} aria-busy={busy || undefined}>
          {busy ? <Spinner animation="border" size="sm" aria-hidden="true" /> : <FiUploadCloud size={18} aria-hidden="true" />}
          {busy ? "Sending…" : used ? "Update from my storefront" : "Use my storefront"}
        </button>
        <FixLink to={storefrontSection("vendor-basic")} className="gp-link">
          Edit my storefront
        </FixLink>
      </div>
    </div>
  );
}
