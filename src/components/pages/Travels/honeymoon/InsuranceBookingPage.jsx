import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Upload, ChevronDown } from 'lucide-react';
import { bookTripSafeInsurance } from '../../../../services/api/tripSafeApi';

const NOMINEE_RELATIONS = [
  'LEGAL HEIR',
  'SPOUSE',
  'FATHER',
  'MOTHER',
  'SON',
  'DAUGHTER',
  'BROTHER',
  'SISTER',
];

const formatPrice = (value) => {
  const num = Number(value || 0);
  if (!num) return '—';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const splitFullName = (fullName) => {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { fn: '', ln: '' };
  if (parts.length === 1) return { fn: parts[0], ln: parts[0] };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
};

const buildTravellerForms = (searchParams) => {
  const ages = (searchParams?.isq?.iti || []).map((t) => t.age || 30);
  const count = ages.length || 1;
  return ages.slice(0, count).map((age, index) => ({
    id: index + 1,
    age,
    fullName: '',
    gender: 'M',
    dob: '',
    passport: '',
    mobile: '',
    email: '',
    pincode: '',
    nomineeName: 'LEGAL HEIR',
    nomineeRelation: 'LEGAL HEIR',
  }));
};

const InsuranceBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = location.state?.searchParams;
  const selectedPlan = location.state?.selectedPlan;
  const reviewMeta = location.state?.reviewMeta;

  const [travellers, setTravellers] = useState(() => buildTravellerForms(searchParams));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchParams || !selectedPlan || !reviewMeta?.bookingId) {
      navigate('/honeymoon');
    }
  }, [searchParams, selectedPlan, reviewMeta, navigate]);

  const destinationLabel = useMemo(() => {
    const regions = searchParams?.isq?.isc?.iri || [];
    return regions.map((r) => r.rkey).join(', ') || 'Selected destination';
  }, [searchParams]);

  if (!searchParams || !selectedPlan || !reviewMeta?.bookingId) return null;

  const totalPrice = reviewMeta.price || selectedPlan.price;

  const updateTraveller = (index, field, value) => {
    setTravellers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validateForm = () => {
    for (let i = 0; i < travellers.length; i += 1) {
      const t = travellers[i];
      if (!t.fullName.trim()) return `Enter full name for traveller ${i + 1}`;
      if (!t.passport.trim()) return `Enter passport number for traveller ${i + 1}`;
      if (!t.mobile.trim() || t.mobile.length < 10) {
        return `Enter valid mobile for traveller ${i + 1}`;
      }
      if (!t.email.trim() || !t.email.includes('@')) {
        return `Enter valid email for traveller ${i + 1}`;
      }
      if (!t.pincode.trim()) return `Enter pincode for traveller ${i + 1}`;
      if (!t.nomineeName.trim()) return `Enter nominee name for traveller ${i + 1}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const primary = travellers[0];
    const iti = travellers.map((t) => {
      const { fn, ln } = splitFullName(t.fullName);
      return {
        id: t.id,
        age: Number(t.age),
        fn,
        ln,
        eid: t.email.trim(),
        pnum: t.passport.trim(),
        cnum: t.mobile.trim(),
        pincode: t.pincode.trim(),
        gen: t.gender,
        ni: [
          {
            nn: t.nomineeName.trim(),
            nr: t.nomineeRelation,
          },
        ],
      };
    });

    const payload = {
      bookingId: reviewMeta.bookingId,
      paymentInfos: [
        {
          paymentMedium: 'WALLET',
          amount: totalPrice,
        },
      ],
      pli: [
        {
          plid: selectedPlan.plid,
          pi: [
            {
              pid: selectedPlan.pid,
              iti,
            },
          ],
        },
      ],
      deliveryInfo: {
        emails: [primary.email.trim()],
        contacts: [primary.mobile.trim()],
      },
    };

    try {
      const response = await bookTripSafeInsurance(payload);
      if (!response?.status) {
        setError(response?.message || 'Booking failed');
        return;
      }
      const bookedId =
        response?.data?.bookingId ||
        response?.data?.order?.bookingId ||
        reviewMeta.bookingId;
      navigate(`/honeymoon/insurance/booking/${bookedId}`, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Unable to complete booking'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ins-booking-page">
      <div className="container py-4">
        <button
          type="button"
          className="btn btn-link text-decoration-none ps-0 mb-3"
          onClick={() =>
            navigate('/honeymoon/insurance', {
              state: { searchParams, initialResults: location.state?.initialResults },
            })
          }
        >
          ← Back to packages
        </button>

        <div className="row g-4">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {travellers.map((traveller, index) => (
                <div key={traveller.id} className="ins-traveller-card mb-4">
                  <div className="ins-traveller-card-header">
                    Traveller {index + 1} | {traveller.age} Yrs
                  </div>

                  <div className="ins-passport-upload">
                    <Upload size={28} className="text-muted mb-2" />
                    <div className="fw-semibold">Upload Passport</div>
                    <small className="text-muted">PNG, JPG, PDF | Size &lt; 2MB</small>
                    <button type="button" className="btn btn-sm ins-upload-btn mt-2" disabled>
                      UPLOAD
                    </button>
                  </div>

                  <div className="row g-3 p-3 pt-0">
                    <div className="col-12">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Full Name"
                        value={traveller.fullName}
                        onChange={(e) => updateTraveller(index, 'fullName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label d-block">Gender</label>
                      <div className="ins-gender-group">
                        {[
                          ['M', 'Male'],
                          ['F', 'Female'],
                        ].map(([val, label]) => (
                          <label key={val} className="ins-gender-option">
                            <input
                              type="radio"
                              name={`gender-${index}`}
                              checked={traveller.gender === val}
                              onChange={() => updateTraveller(index, 'gender', val)}
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={traveller.dob}
                        onChange={(e) => updateTraveller(index, 'dob', e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Passport Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Number"
                        value={traveller.passport}
                        onChange={(e) => updateTraveller(index, 'passport', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="123456"
                        value={traveller.pincode}
                        onChange={(e) => updateTraveller(index, 'pincode', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Nominee Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={traveller.nomineeName}
                        onChange={(e) => updateTraveller(index, 'nomineeName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Relationship</label>
                      <select
                        className="form-select"
                        value={traveller.nomineeRelation}
                        onChange={(e) =>
                          updateTraveller(index, 'nomineeRelation', e.target.value)
                        }
                      >
                        {NOMINEE_RELATIONS.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Mobile Number (+91)</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="XXXXX XXXXX"
                        value={traveller.mobile}
                        onChange={(e) => updateTraveller(index, 'mobile', e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email ID</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter Email ID"
                        value={traveller.email}
                        onChange={(e) => updateTraveller(index, 'email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {error && <div className="alert alert-danger">{error}</div>}

              <button
                type="submit"
                className="btn ins-submit-btn w-100"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="d-inline-flex align-items-center gap-2">
                    <Loader2 size={18} className="spin" />
                    Booking insurance...
                  </span>
                ) : (
                  `Confirm & Pay ${formatPrice(totalPrice)}`
                )}
              </button>
            </form>
          </div>

          <div className="col-lg-4">
            <div className="ins-plan-summary sticky-top">
              <h5 className="mb-3">Plan Summary</h5>
              <div className="ins-summary-row">
                <span>Destination</span>
                <strong>{destinationLabel}</strong>
              </div>
              <div className="ins-summary-row">
                <span>Start Date</span>
                <strong>{formatDate(searchParams?.isq?.sd)}</strong>
              </div>
              <div className="ins-summary-row">
                <span>End Date</span>
                <strong>{formatDate(searchParams?.isq?.ed)}</strong>
              </div>

              <div className="ins-summary-plan mt-3">
                <small className="text-muted">
                  Plan for: Traveller 1 | {travellers[0]?.age} yrs
                </small>
                <div className="ins-summary-plan-badge mt-2">
                  <div className="ins-summary-plan-name">{selectedPlan.planLabel}</div>
                  <div className="ins-summary-plan-meta">
                    {selectedPlan.coverageAmount} · {selectedPlan.regionName}
                  </div>
                </div>
                <div className="ins-summary-price mt-3">
                  {formatPrice(totalPrice)}
                  <small className="d-block text-muted">Inc. GST</small>
                </div>
              </div>

              <div className="ins-summary-total">
                <span>Total</span>
                <span className="d-flex align-items-center gap-1">
                  {formatPrice(totalPrice)}
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ins-booking-page {
          background: #f8f5f7;
          min-height: 100vh;
        }
        .ins-traveller-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
          overflow: hidden;
        }
        .ins-traveller-card-header {
          background: #f5f5f5;
          padding: 12px 16px;
          font-weight: 600;
          color: #444;
          font-size: 14px;
        }
        .ins-passport-upload {
          margin: 16px;
          padding: 24px;
          border: 2px dashed #ddd;
          border-radius: 8px;
          text-align: center;
          background: #fafafa;
        }
        .ins-upload-btn {
          background: #ff8c42;
          color: #fff;
          border: none;
          font-weight: 700;
        }
        .ins-gender-group {
          display: flex;
          gap: 16px;
        }
        .ins-gender-option {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .ins-submit-btn {
          background: linear-gradient(135deg, #ed1173, #ff6b9d);
          border: none;
          color: #fff;
          font-weight: 700;
          padding: 14px;
        }
        .ins-plan-summary {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
          padding: 20px;
          top: 24px;
        }
        .ins-summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .ins-summary-row span {
          color: #888;
        }
        .ins-summary-plan-badge {
          background: linear-gradient(135deg, #4a4a4a, #2a2a2a);
          color: #fff;
          border-radius: 10px;
          padding: 14px;
        }
        .ins-summary-plan-name {
          font-weight: 700;
          font-size: 16px;
        }
        .ins-summary-plan-meta {
          font-size: 12px;
          opacity: 0.85;
          margin-top: 4px;
        }
        .ins-summary-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ed1173;
        }
        .ins-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .ins-booking-success {
          text-align: center;
          max-width: 480px;
          margin: 0 auto;
          padding: 48px 24px;
          background: #fff;
          border-radius: 16px;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InsuranceBookingPage;
