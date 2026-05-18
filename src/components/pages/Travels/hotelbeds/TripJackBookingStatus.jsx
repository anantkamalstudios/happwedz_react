import { Button, Modal } from "react-bootstrap";

const formatStatusLabel = (status) => {
  if (!status) return "Processing";
  return String(status)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function TripJackBookingStatus({
  show,
  statusState,
  reviewResponse,
  onClose,
  formatMoney,
}) {
  const currentStatus = statusState?.orderStatus || statusState?.details?.orderStatus || "";
  const phase = statusState?.phase || "idle";
  const isSuccess = phase === "success";
  const isFailure = phase === "failed";
  const isValidationFailure = phase === "validation_failed";
  const isDenied = phase === "denied";
  const isTimeout = phase === "timeout";
  const isProcessing = phase === "submitting" || phase === "polling";

  return (
    <Modal show={show} onHide={isProcessing ? undefined : onClose} centered size="lg" backdrop={isProcessing ? "static" : true}>
      <div className="modal-content rounded-4">
        <div className="modal-header border-0">
          <div>
            <h5 className="modal-title">{isDenied ? "Booking Request Denied" : "Booking Status"}</h5>
            <div className="fs-12 text-muted">
              {isSuccess
                ? "TripJack confirmed this booking."
                : isDenied
                  ? "TripJack denied the booking request before booking confirmation started."
                : isValidationFailure
                  ? "Booking request validation failed before TripJack booking started."
                : isFailure
                  ? "TripJack returned a terminal failure state."
                  : isTimeout
                    ? "TripJack is still processing this booking."
                    : "Waiting for TripJack booking confirmation."}
            </div>
          </div>
          {!isProcessing ? <button type="button" className="btn-close" onClick={onClose} /> : null}
        </div>

        <div className="modal-body">
          <div className="d-grid gap-3">
            <div className="border rounded-4 p-3 bg-light-subtle">
              <div className="fw-bold mb-1">{reviewResponse?.displayHotelName || reviewResponse?.hotelSummary?.name || "Selected hotel"}</div>
              <div className="fs-14 text-muted">{reviewResponse?.displayRoomName || reviewResponse?.roomSummary?.roomName || "Selected room"}</div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Booking ID</div>
                  <div className="fw-bold">{statusState?.bookingId || reviewResponse?.bookingId || "Unavailable"}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Current Status</div>
                  <div className="fw-bold">
                    {isDenied ? "Failed" : isValidationFailure ? "Validation Failed" : formatStatusLabel(currentStatus || phase)}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Amount</div>
                  <div className="fw-bold">
                    {statusState?.details?.amount
                      ? formatMoney(statusState.details.amount, reviewResponse?.priceSummary?.currency || "INR")
                      : reviewResponse?.priceSummary?.amount
                        ? formatMoney(reviewResponse.priceSummary.amount, reviewResponse.priceSummary.currency || "INR")
                        : "Not available"}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded-4 p-3 h-100">
                  <div className="text-muted fs-12 mb-1">Polling Attempts</div>
                  <div className="fw-bold">
                    {isValidationFailure || isDenied ? "Not started" : statusState?.attempts || 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-4 p-3">
              <div className="fw-semibold mb-2">Status Message</div>
              <div className="fs-14 text-muted">
                {statusState?.message ||
                  "We are waiting for TripJack to return the latest booking status."}
              </div>
            </div>

            {statusState?.errorCode ? (
              <div className="border rounded-4 p-3">
                <div className="fw-semibold mb-2">Error Code</div>
                <div className="fs-14 text-muted">{statusState.errorCode}</div>
              </div>
            ) : null}

            {statusState?.details?.createdOn || statusState?.details?.amount || statusState?.details?.deliveryInfo ? (
              <div className="border rounded-4 p-3">
                <div className="fw-semibold mb-2">Latest Booking Details</div>
                <div className="d-grid gap-2 fs-14 text-muted">
                  {statusState?.details?.createdOn ? (
                    <div className="d-flex justify-content-between gap-3">
                      <span>Created On</span>
                      <strong className="text-dark">{statusState.details.createdOn}</strong>
                    </div>
                  ) : null}
                  {statusState?.details?.deliveryInfo?.emails?.[0] ? (
                    <div className="d-flex justify-content-between gap-3">
                      <span>Contact Email</span>
                      <strong className="text-dark">{statusState.details.deliveryInfo.emails[0]}</strong>
                    </div>
                  ) : null}
                  {statusState?.details?.deliveryInfo?.contacts?.[0] ? (
                    <div className="d-flex justify-content-between gap-3">
                      <span>Contact Phone</span>
                      <strong className="text-dark">{statusState.details.deliveryInfo.contacts[0]}</strong>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="modal-footer border-0">
          <Button variant="outline-secondary" onClick={onClose} disabled={isProcessing}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
