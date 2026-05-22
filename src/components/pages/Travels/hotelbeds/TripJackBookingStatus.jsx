import { Button, Modal } from "react-bootstrap";

const formatStatusLabel = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (!normalized) return "Booking Processing";
  if (normalized === "PAYMENT_SUCCESS") return "Payment Successful - Awaiting Hotel Confirmation";
  if (normalized === "SUCCESS") return "Booking Confirmed";
  if (normalized === "ON_HOLD") return "Booking On Hold";
  if (normalized === "IN_PROGRESS" || normalized === "PENDING" || normalized === "PAYMENT_PENDING") {
    return "Booking Processing";
  }
  if (normalized === "FAILED" || normalized === "ABORTED" || normalized === "CANCELLED") {
    return "Booking Failed";
  }
  return String(status)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getStatusColor = (status) => {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "SUCCESS" || normalized === "ON_HOLD") return "#198754";
  if (["PAYMENT_SUCCESS", "IN_PROGRESS", "PENDING", "PAYMENT_PENDING"].includes(normalized)) return "#b26a00";
  if (["FAILED", "ABORTED", "CANCELLED"].includes(normalized)) return "#dc3545";
  return "#212529";
};

export default function TripJackBookingStatus({
  show,
  statusState,
  reviewResponse,
  onClose,
  onRefresh,
  formatMoney,
}) {
  const currentStatus = statusState?.orderStatus || statusState?.details?.orderStatus || "";
  const phase = statusState?.phase || "idle";
  const isSuccess = phase === "success";
  const isFailure = phase === "failed";
  const isValidationFailure = phase === "validation_failed";
  const isAlreadyPaid = phase === "already_paid";
  const isDenied = phase === "denied";
  const isTimeout = phase === "timeout";
  const isSubmitting = phase === "submitting";
  const isProcessing = isSubmitting;
  const allowClose = !isSubmitting || statusState?.allowClose;

  return (
    <Modal show={show} onHide={allowClose ? onClose : undefined} centered size="lg" backdrop={allowClose ? true : "static"}>
      <div className="modal-content rounded-4">
        <div className="modal-header border-0">
          <div>
            <h5 className="modal-title">{isDenied ? "Booking Request Denied" : "Booking Status"}</h5>
            <div className="fs-12 text-muted">
              {isSuccess
                ? "TripJack confirmed this booking."
                : isDenied
                  ? "TripJack denied the booking request before booking confirmation started."
                : isAlreadyPaid
                  ? "This booking is already paid. Fetching latest TripJack status."
                : isValidationFailure
                  ? "Booking request validation failed before TripJack booking started."
                : isFailure
                  ? "TripJack returned a terminal failure state."
                : isTimeout
                    ? "Payment is complete and TripJack is still confirming the hotel."
                    : "Payment is complete and TripJack confirmation is in progress."}
            </div>
          </div>
          {allowClose ? <button type="button" className="btn-close" onClick={onClose} /> : null}
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
                  <div className="fw-bold" style={{ color: getStatusColor(currentStatus || phase) }}>
                    {isDenied
                      ? "Failed"
                      : isAlreadyPaid
                        ? "Already Paid - Status Sync"
                        : isValidationFailure
                          ? "Validation Failed"
                          : formatStatusLabel(currentStatus || phase)}
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
                  <div className="text-muted fs-12 mb-1">Check-in / Check-out</div>
                  <div className="fw-bold">
                    {reviewResponse?.searchQuery?.checkInDate || "-"} / {reviewResponse?.searchQuery?.checkoutDate || "-"}
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
          {typeof onRefresh === "function" ? (
            <Button variant="outline-primary" onClick={onRefresh} disabled={!statusState?.bookingId}>
              Refresh Status
            </Button>
          ) : null}
          <Button variant="outline-secondary" onClick={onClose} disabled={!allowClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
