import React from "react";
import Swal from "sweetalert2";
import PlanCards from "./PlanCards";
import CenteredModal from "../../../ui/CenteredModal";
import useSubscriptionPlans from "../../../../hooks/useSubscriptionPlans";
import useRazorpayCheckout from "../../../../hooks/useRazorpayCheckout";

/**
 * Choose and buy a plan without leaving the page you were on.
 *
 * Plans are only fetched once the modal actually opens — most visits to Settings never
 * touch it, and the request would otherwise run on every page load.
 */

const INK = "#1d1117";
const MUTED = "#6f5c66";
const LINE = "#e9e1e5";
const PINK = "#c2185b";

const PlanPickerModal = ({ show, onClose, onPurchased }) => {
  const {
    visiblePlans,
    access,
    cycle,
    setCycle,
    showCycleTabs,
    loading,
    error,
    reload,
  } = useSubscriptionPlans(show);

  const { startCheckout, processing, status, activePlanId } = useRazorpayCheckout({
    onSuccess: async () => {
      onClose?.();
      await Swal.fire({
        icon: "success",
        title: "Payment successful",
        text: "Your storefront is unlocked. A receipt is on its way to your email.",
        confirmButtonColor: PINK,
      });
      onPurchased?.();
    },
    onError: (message) => {
      Swal.fire({ icon: "info", title: "Payment not completed", text: message });
      reload();
    },
  });

  // Two plans in a 960px dialog would each be ~450px wide, which reads as a banner
  // rather than a price card. The dialog narrows to suit how many there are.
  const dialogWidth = visiblePlans.length <= 1 ? 460 : visiblePlans.length === 2 ? 720 : 980;

  return (
    <CenteredModal
      show={show}
      onClose={onClose}
      maxWidth={dialogWidth}
      labelledBy="hw-plan-picker-title"
    >
      <div
        className="d-flex align-items-start justify-content-between gap-3"
        style={{ padding: "20px 24px", borderBottom: `1px solid ${LINE}` }}
      >
        <div>
          <h5
            id="hw-plan-picker-title"
            style={{ fontSize: "1.2rem", fontWeight: 700, color: INK, margin: 0 }}
          >
            Choose your plan
          </h5>
          <div style={{ fontSize: ".88rem", color: MUTED, marginTop: 3 }}>
            Every plan unlocks your full storefront. Your listing stays live either way.
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            border: 0,
            background: "transparent",
            fontSize: "1.5rem",
            lineHeight: 1,
            color: MUTED,
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>

      <div style={{ background: "#faf8f9", padding: "24px", overflowY: "auto", flex: 1 }}>
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: PINK }} role="status">
              <span className="visually-hidden">Loading plans</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && visiblePlans.length === 0 && (
          <div className="text-center py-5">
            <p className="fw-bold mb-1" style={{ color: INK }}>
              No plans available right now
            </p>
            <p className="mb-0" style={{ color: MUTED }}>
              Please check back shortly, or contact us and we will help you get set up.
            </p>
          </div>
        )}

        {!loading && !error && visiblePlans.length > 0 && (
          <PlanCards
            plans={visiblePlans}
            cycle={cycle}
            onCycleChange={setCycle}
            showCycleTabs={showCycleTabs}
            onChoose={startCheckout}
            processing={processing}
            processingLabel={status}
            processingPlanId={activePlanId}
            currentPlanId={access.subscription?.planId ?? null}
            canPurchase={access.canPurchase !== false}
            disabledReason="Complete your business verification first"
          />
        )}
      </div>

      <div
        className="d-flex align-items-center justify-content-between gap-3"
        style={{ padding: "14px 24px", borderTop: `1px solid ${LINE}` }}
      >
        <small style={{ color: MUTED }}>Payments are processed securely by Razorpay.</small>
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="btn btn-light"
          style={{ minWidth: 110 }}
        >
          Close
        </button>
      </div>
    </CenteredModal>
  );
};

export default PlanPickerModal;
