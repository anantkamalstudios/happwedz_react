import React from "react";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";
import "./moments-quota-banner.css";

/**
 * Tells a vendor, in plain words, that their Moments+ plan has ended or that they are
 * holding more than their current plan allows.
 *
 * The one thing this has to get across is that nothing was deleted. A vendor who sees
 * "over your storage limit" and assumes their clients' photos have been thrown away will
 * panic, so the reassurance is the first line, not a footnote.
 *
 * Renders nothing when there is nothing to say, so it is safe to drop in anywhere.
 *
 * @param {object}   props.quota      the /vendor/me/moments-quota payload
 * @param {Function} props.onUpgrade  optional — shows a button that takes them to plans
 */
const MomentsQuotaBanner = ({ quota, onUpgrade }) => {
  if (!quota) return null;

  const expired = Boolean(quota.expired);
  const over = Array.isArray(quota.overQuotas) ? quota.overQuotas : [];

  if (!expired && !over.length) return null;

  const planName = quota.plan?.name || "your current plan";

  // "Storage and Media files", not "Storage, Media files" — this is read, not scanned.
  const overList =
    over.length === 1
      ? over[0].toLowerCase()
      : `${over.slice(0, -1).join(", ").toLowerCase()} and ${over[
          over.length - 1
        ].toLowerCase()}`;

  return (
    <div className="moments-quota-banner">
      <div className="moments-quota-banner__icon">
        <FiAlertCircle size={20} />
      </div>

      <div className="moments-quota-banner__body">
        <h4 className="moments-quota-banner__title inter">
          {expired
            ? `Your ${quota.expiredFrom || "Moments+"} plan has ended`
            : `You are over the ${planName} limit`}
        </h4>

        <p className="moments-quota-banner__text inter">
          Everything you have already uploaded is safe — no galleries, photos or access
          codes have been removed.{" "}
          {expired
            ? `You are now on ${planName}.`
            : ""}
          {over.length
            ? ` You are currently over the ${overList} allowance${
                over.length > 1 ? "s" : ""
              }, so you cannot add more until you upgrade.`
            : " Renew to get your full allowances back."}
        </p>
      </div>

      {onUpgrade && (
        <button
          type="button"
          className="moments-quota-banner__cta inter"
          onClick={onUpgrade}
        >
          View plans
          <FiArrowRight size={15} />
        </button>
      )}
    </div>
  );
};

export default MomentsQuotaBanner;
