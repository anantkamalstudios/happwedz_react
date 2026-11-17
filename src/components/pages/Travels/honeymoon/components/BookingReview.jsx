import { useState, useMemo } from 'react';
import { FaSuitcase, FaUtensils } from 'react-icons/fa';
import { createFlightPaymentOrder, verifyAndBookFlight, holdFlightBooking } from '../../../../../services/api/flightApi';
import { ssrForTraveller, addOnTotal, addOnBreakdown } from './FlightAddOn';
import FareSummary from './FareSummary';
import FlightSegments from './FlightSegments';
import { shortDob } from './flightFormat';

/** The portal marks each traveller with their type initial after the name. */
const PAX_INITIAL = { ADULT: 'A', CHILD: 'C', INFANT: 'I' };

/** Rupees, two decimals. Signless: the wording says which way a fare moved. */
const money = (n) =>
  `₹${Math.abs(Number(n) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function BookingReview({ 
  markup = 0,
  trip, 
  returnTrip, 
  fare, 
  returnFare, 
  searchParams, 
  travellerInfo, 
  contact,
  gstInfo,
  emergencyContact,
  addOns,
  agentNote,
  bookingId,
  reviewData,
  onBack,
  onPaymentSuccess
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Not a failure, so not an error: closing the Razorpay window left the page
  // looking exactly as it had before Pay was pressed, with nothing to say
  // whether the booking had gone through, been charged, or been lost.
  const [notice, setNotice] = useState(null);


  // SSR meal/baggage options per segment, from the review response.
  // Everything seat/meal/baggage was chosen on the passenger step; the review
  // only has to price it and fold it into the traveller payload.
  const addonsTotal = addOnTotal(addOns);

  // Add-ons are keyed by TripJack's segment id; the review labels each choice
  // by its leg ("BOM-BLR : 2E"), so map ids back to route codes once.
  const segRoute = useMemo(() => {
    const map = {};
    for (const leg of [trip, returnTrip]) {
      for (const s of leg?.sI || []) map[s.id] = `${s.da.code}-${s.aa.code}`;
    }
    return map;
  }, [trip, returnTrip]);

  /**
   * Flatten one passenger's picks for a kind into [{ route, text }].
   * Seats store a single object per leg; meals and baggage store a map of
   * code -> item, so both shapes are handled here.
   */
  const segmentChoices = (bySeg) =>
    Object.entries(bySeg || {})
      .map(([segId, val]) => {
        const route = segRoute[segId] || segId;
        const text = val?.code
          ? val.code
          : Object.values(val || {})
              .filter((i) => i?.qty)
              .map((i) => (i.qty > 1 ? `${i.desc || i.code} × ${i.qty}` : i.desc || i.code))
              .join(', ');
        return { route, text };
      })
      .filter((x) => x.text);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Get confirmed amount from review API response
  const paxCounts = {
    ADULT: Number(searchParams.adults || 1),
    CHILD: Number(searchParams.children || 0),
    INFANT: Number(searchParams.infants || 0),
  };

  /**
   * Sum a fare component across every passenger type.
   *
   * `fd` is keyed by pax type and each amount is per passenger, so reading
   * `fd.ADULT` alone prices the booking for one adult regardless of who is
   * actually travelling.
   */
  const sumAcrossPax = (tripFare, key) =>
    Object.entries(paxCounts).reduce((total, [type, count]) => {
      const amount = tripFare?.fd?.[type]?.fC?.[key];
      return total + (amount ? amount * count : 0);
    }, 0);

  /** Grand total TripJack quoted for this session, across all passengers. */
  const reviewGrandTotal = () =>
    Number(
      reviewData?.totalPriceInfo?.totalFareDetail?.fC?.TF ??
        reviewData?.totalPriceInfo?.totalFareDetail?.fC?.NF ??
        0,
    );

  /**
   * The review response's fare for a leg, matched on TripJack's own price id.
   *
   * Matched by id rather than by position: the review can return the legs in
   * either order, and lining the outbound up against the return would invent a
   * fare change that is not there.
   */
  const reviewedFareFor = (fareOption) => {
    const wanted = fareOption?.id;
    if (!wanted) return null;
    for (const t of reviewData?.tripInfos || []) {
      for (const f of t?.totalPriceList || []) {
        if (f?.id === wanted) return f;
      }
    }
    return null;
  };

  // The fares to price and display by. Where the review re-priced a leg, that
  // is what the traveller pays, so that is what the page must show; where it
  // did not, the search fare stands.
  const pricedFare = reviewedFareFor(fare) || fare;
  const pricedReturnFare = returnTrip ? reviewedFareFor(returnFare) || returnFare : returnFare;

  /** Refundability, baggage and fare type, as the traveller reads them. */
  const fareTerms = (fareOption) => ({
    // rT === 1 is TripJack's refundable flag.
    refundable: fareOption?.fd?.ADULT?.rT === 1,
    baggage: String(fareOption?.fd?.ADULT?.bI?.iB || '').trim(),
    fareType: String(fareOption?.fareIdentifier || '').trim(),
  });

  const fareChange = useMemo(() => {
    const legs = [
      { label: 'Outbound', before: fare, after: reviewedFareFor(fare) },
      ...(returnTrip
        ? [{ label: 'Return', before: returnFare, after: reviewedFareFor(returnFare) }]
        : []),
    ].filter((l) => l.before);

    // Both sides are summed from the per-leg fares, never from totalPriceInfo:
    // that grand total can carry SSR charges the search fare never had, which
    // would read as a price rise the airline never made.
    const priced = legs.filter((l) => l.after);
    const shownTotal = legs.reduce((n, l) => n + sumAcrossPax(l.before, 'TF'), 0);
    const repricedTotal = priced.reduce((n, l) => n + sumAcrossPax(l.after, 'TF'), 0);

    // Prices are only compared when every leg was re-priced; a partial sum
    // would show up as a phantom drop.
    const comparable = priced.length === legs.length && shownTotal > 0 && repricedTotal > 0;
    const difference = comparable ? Math.round((repricedTotal - shownTotal) * 100) / 100 : 0;

    // With nothing to compare, the total on screen stays the one the traveller
    // picked: quoting half a round trip on the Continue button would promise a
    // price we are not going to charge.
    const nowTotal = comparable ? repricedTotal : shownTotal;

    const worseTerms = [];
    for (const { label, before, after } of priced) {
      const was = fareTerms(before);
      const now = fareTerms(after);
      if (was.refundable && !now.refundable) {
        worseTerms.push({ what: `${label} refundability`, from: 'Refundable', to: 'Non-refundable' });
      }
      if (was.baggage && now.baggage && was.baggage !== now.baggage) {
        worseTerms.push({ what: `${label} check-in baggage`, from: was.baggage, to: now.baggage });
      }
      if (was.fareType && now.fareType && was.fareType !== now.fareType) {
        worseTerms.push({ what: `${label} fare type`, from: was.fareType, to: now.fareType });
      }
    }

    // A rupee either way is rounding, not a fare change.
    const dearer = difference > 1;
    const cheaper = difference < -1;
    if (!dearer && !cheaper && !worseTerms.length) return null;

    return {
      shownTotal,
      nowTotal,
      difference,
      worseTerms,
      // Dearer, or worse terms: the traveller agrees before paying. Cheaper
      // and nothing else touched: applied, and simply said.
      blocking: dearer || worseTerms.length > 0,
    };
  }, [fare, returnFare, returnTrip, reviewData, searchParams]);

  // Set by Continue on the modal. A cheaper fare is never blocking, so nothing
  // stands between the traveller and the payment button.
  const [fareChangeAccepted, setFareChangeAccepted] = useState(false);
  const mustAcceptFare = Boolean(fareChange?.blocking) && !fareChangeAccepted;

  const calculateTotalAmount = () => {
    const legs = [pricedFare, pricedReturnFare].filter(Boolean);
    return legs.reduce((n, f) => n + sumAcrossPax(f, 'TF'), 0) + addonsTotal;
  };

  /**
   * What the traveller is charged.
   *
   * `totalPriceInfo.totalFareDetail` is TripJack's own grand total for the
   * session and is authoritative — it already spans every passenger. Deriving
   * it by walking `tripInfos[].fd.ADULT` instead charged for a single adult
   * while TripJack was still paid in full for the whole party.
   */
  const getConfirmedAmount = () => {
    const flightAmount = reviewGrandTotal() || calculateTotalAmount() - addonsTotal;
    // The markup is deliberately excluded from `paymentInfos` below — TripJack
    // validates that against its own session fare and rejects any difference.
    return flightAmount + addonsTotal + Number(markup || 0);
  };

  // Build the TripJack book payload + create_order/hold fields (shared by Pay & Hold).
  const buildPaymentOrderPayload = () => {
    const confirmedAmount = getConfirmedAmount();
    const cleanCountryCode = contact.countryCode.replace(/^\+/, '');
    const fullPhoneNumber = `${cleanCountryCode}${contact.mobile}`;

    // TripJack validates paymentInfos.amount against the session fare (no markup).
    const tripjackFare =
      Number(reviewData?.totalPriceInfo?.totalFareDetail?.fC?.NF) ||
      Number(reviewData?.totalPriceInfo?.totalFareDetail?.fC?.TF) ||
      confirmedAmount;

    // Attach selected seats + meals + baggage (SSR) to each traveller, keyed by segment id.
    const travellerInfoWithSsr = travellerInfo.map((t, idx) => {
      return { ...t, ...ssrForTraveller(addOns, idx, reviewData) };
    });

    // TripJack validates paymentInfos.amount against TF plus every SSR charge.
    const tripjackPaymentAmount = tripjackFare + addonsTotal;

    const payload = {
      bookingId: bookingId,
      paymentInfos: [{ amount: tripjackPaymentAmount }],
      travellerInfo: travellerInfoWithSsr,
      deliveryInfo: { emails: [contact.email], contacts: [fullPhoneNumber] },
      ...(agentNote?.trim() && { remarks: agentNote.trim() }),
      ...(gstInfo && {
        gstInfo: {
          gstNumber: gstInfo.gstNumber,
          email: gstInfo.companyEmail,
          registeredName: gstInfo.companyName,
          mobile: fullPhoneNumber,
          address: '',
        },
      }),
      // Emergency contact (required when review conditions.iecr is true).
      ...(emergencyContact && {
        contactInfo: {
          emails: [emergencyContact.email],
          contacts: [emergencyContact.mobile],
          ecn: emergencyContact.name,
        },
      }),
    };

    return {
      provider: 'tripjack',
      offer_id: bookingId,
      trip_type: returnTrip ? 'round' : 'oneway',
      from: trip?.sI?.[0]?.da?.code || '',
      to: trip?.sI?.[trip.sI.length - 1]?.aa?.code || '',
      departure: trip?.sI?.[0]?.dt || '',
      arrival: trip?.sI?.[trip.sI.length - 1]?.at || '',
      flight_no: `${trip?.sI?.[0]?.fD?.aI?.code || ''}-${trip?.sI?.[0]?.fD?.fN || ''}`,
      airline: trip?.sI?.[0]?.fD?.aI?.name || '',
      cabin_class: fare?.fd?.ADULT?.cc || 'ECONOMY',
      price: confirmedAmount,
      passengers: travellerInfo,
      contact: { email: contact.email, phone: fullPhoneNumber },
      booking_payload: payload,
    };
  };

  // HOLD: block the fare without payment — customer pays & confirms later.
  const handleHold = async () => {
    // The modal covers the page, but a stray call must not slip past it.
    if (mustAcceptFare) return;
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      const res = await holdFlightBooking(buildPaymentOrderPayload());
      if (res?.status) {
        onPaymentSuccess({ ...res, on_hold: true, order_id: res.held_booking_id, amount_paid: 0 });
      } else {
        setError(res?.message || 'Could not hold this fare. Please try again.');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Could not hold this fare. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    // The modal covers the page, but a stray call must not slip past it.
    if (mustAcceptFare) return;
    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) {
        throw new Error('Razorpay SDK failed to load');
      }

      const paymentOrderPayload = buildPaymentOrderPayload();
      // These are local to buildPaymentOrderPayload — re-derive for the Razorpay options/handler below.
      const payload = paymentOrderPayload.booking_payload;
      const fullPhoneNumber = paymentOrderPayload.contact?.phone || '';

      let orderResponse;
      try {
        orderResponse = await createFlightPaymentOrder(paymentOrderPayload);
      } catch (paymentOrderError) {
        const errMsg = paymentOrderError.response?.data?.message || paymentOrderError.message || 'Failed to create payment order';
        console.error('create_order failed:', paymentOrderError.response?.data || paymentOrderError.message);
        throw new Error(errMsg);
      }

      // Support backend response: { razorpay_order_id, key_id, amount, currency }
      const orderId = orderResponse?.razorpay_order_id || orderResponse?.order_id || orderResponse?.order?.id || orderResponse?.id;
      const razorpayKey = orderResponse?.key_id || orderResponse?.key || orderResponse?.razorpay_key || import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      const orderAmount = orderResponse?.amount || orderResponse?.order?.amount || undefined;
      const orderCurrency = orderResponse?.currency || orderResponse?.order?.currency || 'INR';

      if (!orderId || !razorpayKey) {
        throw new Error('Payment order created but Razorpay credentials missing. Please contact support.');
      }

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderCurrency,
        name: 'HappyWedz',
        description: 'Flight Booking Payment',
        order_id: orderId,
        prefill: {
          name: travellerInfo?.[0] ? `${travellerInfo[0].fN || ''} ${travellerInfo[0].lN || ''}`.trim() : '',
          email: contact.email,
          contact: fullPhoneNumber,
        },
        handler: async function (rzpResponse) {
          try {
            const verifyPayload = {
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              booking_payload: payload,
            };
            const verifyResponse = await verifyAndBookFlight(verifyPayload);
            if (verifyResponse && (verifyResponse.status === true || verifyResponse.booking_id || verifyResponse.order_id || verifyResponse.bookingId)) {
              onPaymentSuccess(verifyResponse);
            } else {
              setError('Payment was received but booking confirmation failed. Please contact support with payment ID: ' + rzpResponse.razorpay_payment_id);
            }
          } catch (verifyErr) {
            console.error('Payment verification error:', verifyErr);
            setError(verifyErr.response?.data?.message || 'Payment succeeded but verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setNotice(
              'Payment cancelled — nothing has been charged. Your passengers, seats and add-ons are all still here, so you can pay whenever you are ready.'
            );
          },
        },
        theme: { color: '#ed1173' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoading(false);
        setError(response?.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
      return;
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="booking-card">
          <h4 className="booking-card-title">Review</h4>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {notice && !error && (
            <div className="alert alert-info" role="status">
              {notice}
            </div>
          )}

          {/* A fare that only got cheaper is applied without stopping anyone,
              but it is still said out loud: a total that moves on its own is
              the thing travellers write in to complain about. */}
          {fareChange && !fareChange.blocking && (
            <div className="fare-change-notice" role="status">
              <strong>Good news — this fare has come down.</strong> The airline is now charging{' '}
              {money(fareChange.nowTotal)} instead of {money(fareChange.shownTotal)}. You pay the lower
              amount, and nothing else about the booking has changed.
            </div>
          )}

          {mustAcceptFare && (
            <div className="fare-change-backdrop" role="presentation">
              <div
                className="fare-change-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="fare-change-title"
              >
                <h5 id="fare-change-title">Fare has changed</h5>
                <p className="fare-change-lead">
                  The airline re-priced this itinerary while you were filling in the details. Please
                  check what changed before you pay.
                </p>

                <div className="fare-change-rows">
                  {fareChange.difference > 1 && (
                    <div className="fare-change-row">
                      <span className="fare-change-what">Total fare</span>
                      <span className="fare-change-was">{money(fareChange.shownTotal)}</span>
                      <span className="fare-change-arrow" aria-hidden="true">→</span>
                      <span className="fare-change-now">{money(fareChange.nowTotal)}</span>
                    </div>
                  )}
                  {fareChange.worseTerms.map((t) => (
                    <div className="fare-change-row" key={t.what}>
                      <span className="fare-change-what">{t.what}</span>
                      <span className="fare-change-was">{t.from}</span>
                      <span className="fare-change-arrow" aria-hidden="true">→</span>
                      <span className="fare-change-now">{t.to}</span>
                    </div>
                  ))}
                </div>

                {fareChange.difference > 1 && (
                  <p className="fare-change-delta">
                    That is {money(fareChange.difference)} more than the fare you selected.
                  </p>
                )}

                <div className="fare-change-actions">
                  <button type="button" className="itin-btn itin-btn-back" onClick={onBack}>
                    « Back to results
                  </button>
                  <button
                    type="button"
                    className="itin-btn itin-btn-next"
                    onClick={() => setFareChangeAccepted(true)}
                  >
                    Continue at {money(fareChange.nowTotal)}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <FlightSegments trip={trip} fare={pricedFare} />

          {returnTrip && (
            <FlightSegments trip={returnTrip} fare={pricedReturnFare} className="mt-3" />
          )}

          {/* The portal lays passengers out as a table with their seat and
              per-segment meal and baggage choices beside each name. */}
          <div className="rv-paxblock">
            <h4 className="rv-heading">Passenger Details <span>({travellerInfo.length})</span></h4>

            <div className="rv-table">
              <div className="rv-thead">
                <div>Sr.</div>
                <div>Name, Age &amp; Passport</div>
                <div>Seat Booking</div>
                <div>Meal &amp; Baggage Preference</div>
              </div>

              {travellerInfo.map((t, i) => {
                const seats = segmentChoices(addOns?.seats?.[i]);
                const bags = segmentChoices(addOns?.baggage?.[i]);
                const meals = segmentChoices(addOns?.meals?.[i]);
                return (
                  <div className="rv-trow" key={i}>
                    <div className="rv-td-sr">{i + 1}</div>
                    <div className="rv-td-name">
                      <span className="rv-paxname">
                        {t.ti} {t.fN} {t.lN} ({PAX_INITIAL[t.pt] || 'A'})
                      </span>
                      {t.dob ? <span className="rv-paxdob">{shortDob(t.dob)}</span> : null}
                      {t.pNum ? <span className="rv-paxdob">{t.pNum}</span> : null}
                    </div>
                    <div className="rv-td-seat">
                      {seats.length
                        ? seats.map((s) => <span key={s.route} className="rv-chip">{s.route} : {s.text}</span>)
                        : <span className="rv-chip">NA</span>}
                    </div>
                    <div className="rv-td-ssr">
                      {bags.map((s) => (
                        <div key={`b-${s.route}`} className="rv-ssr-line">
                          <FaSuitcase size={11} /> - <b>{s.route} : </b><span>{s.text}</span>
                        </div>
                      ))}
                      {meals.map((s) => (
                        <div key={`m-${s.route}`} className="rv-ssr-line">
                          <FaUtensils size={11} /> - <b>{s.route} : </b><span>{s.text}</span>
                        </div>
                      ))}
                      {!bags.length && !meals.length ? <span className="rv-none">—</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rv-contact">
            <h4 className="rv-heading">Contact Details</h4>
            <p>email : <span className="rv-contact-value">{contact.email}</span></p>
            <p>mobile : <span className="rv-contact-value">{contact.countryCode} {contact.mobile}</span></p>
          </div>


          {gstInfo && (
            <div className="review-section mt-4">
              <h5 className="review-section-title">GST Details</h5>
              <div className="gst-review">
                <div><strong>Company:</strong> {gstInfo.companyName}</div>
                <div><strong>GST Number:</strong> {gstInfo.gstNumber}</div>
                <div><strong>Email:</strong> {gstInfo.companyEmail}</div>
              </div>

            </div>
          )}
          <div className="rv-footer">
            <div className="rv-footer-left">
              <span className="rv-terms">
                By proceeding, I acknowledge and agree to the{' '}
                <a href="/terms" target="_blank" rel="noreferrer">Terms of Use and Privacy Policy.</a>
              </span>
              <button type="button" className="itin-btn itin-btn-back" onClick={onBack} disabled={loading}>
                « Back
              </button>
            </div>
            <div className="rv-footer-right">
              {/* Blocking is only offered when the fare allows it (conditions.isBA). */}
              {reviewData?.conditions?.isBA && (
                <button type="button" className="itin-btn itin-btn-next" onClick={handleHold} disabled={loading}>
                  {loading ? 'Please wait…' : '⌛ Block'}
                </button>
              )}
              <button type="button" className="itin-btn itin-btn-next" onClick={handleProceedToPayment} disabled={loading}>
                {loading ? 'Processing…' : '» PROCEED TO PAY'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-4">
        {/* The re-priced fares, so the rail adds up to what the card is
            actually charged. Billing the review total while the summary still
            showed the search fare is how a Rs 2,694 gap went unremarked. */}
        <FareSummary
          fare={pricedFare}
          returnFare={pricedReturnFare}
          searchParams={searchParams}
          markup={markup}
          extras={Object.entries(addOnBreakdown(addOns)).map(([label, amount]) => ({ label, amount }))}
        />
      </div>
    </div>
  );
}
