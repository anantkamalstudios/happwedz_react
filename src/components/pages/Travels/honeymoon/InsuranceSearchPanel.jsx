import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CalendarSearch, Users, Loader2, MapPin } from 'lucide-react';
import { searchTripSafeInsurance } from '../../../../services/api/tripSafeApi';
import {
  INSURANCE_POPULAR_REGIONS,
  getDefaultInsuranceDestination,
  regionToDestination,
} from '../../../../config/insuranceCountries';
import InsuranceCountrySelect from './InsuranceCountrySelect';

const PLAN_TYPES = [
  { id: 'international', label: 'International', ict: null },
  { id: 'student', label: 'Student', ict: 'STUDENT' },
  { id: 'amt', label: 'Annual Multi Trip', ict: 'AMT' },
];

const defaultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
};

const defaultEndDate = (start) => {
  const d = new Date(start || defaultStartDate());
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
};

const defaultDestination = () => getDefaultInsuranceDestination();

const InsuranceSearchPanel = ({ formatSelectedDate }) => {
  const navigate = useNavigate();
  const [planTypeId, setPlanTypeId] = useState('international');
  const [destMode, setDestMode] = useState('country');
  const [destination, setDestination] = useState(defaultDestination);
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellerAges, setTravellerAges] = useState([30]);
  const [flightBookingId, setFlightBookingId] = useState('');
  const [loading, setLoading] = useState(false);

  const syncAges = (count) => {
    const next = [...travellerAges];
    while (next.length < count) next.push(30);
    setTravellerAges(next.slice(0, count));
    setTravellerCount(count);
  };

  const updateAge = (index, age) => {
    const next = [...travellerAges];
    next[index] = Math.max(1, Math.min(99, Number(age) || 30));
    setTravellerAges(next);
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('End date must be on or after start date');
      return;
    }
    if (!destination?.rkey) {
      alert('Please select a destination country or region');
      return;
    }

    const planType = PLAN_TYPES.find((p) => p.id === planTypeId);
    const isq = {
      sd: startDate,
      ed: endDate,
      isc: {
        iri: [{ rkey: destination.rkey, rt: destination.rt }],
      },
      iti: travellerAges.slice(0, travellerCount).map((age) => ({ age })),
      isp: {},
    };

    const embedded = Boolean(flightBookingId.trim());
    if (embedded) {
      isq.isef = true;
      isq.bid = flightBookingId.trim();
    }

    const payload = { isq };
    if (planType?.ict) {
      payload.ict = planType.ict;
    } else if (embedded) {
      payload.ict = 'API_EMB';
    }

    setLoading(true);
    try {
      const response = await searchTripSafeInsurance(payload, { embedded });

      if (!response?.status) {
        alert(response?.message || 'Insurance search failed');
        return;
      }

      const searchParams = {
        ...payload,
        planType: planType?.label || 'International',
        destinationLabel: destination.label || destination.rkey,
      };

      navigate('/honeymoon/insurance', {
        state: { searchParams, initialResults: response },
      });
    } catch (error) {
      console.error('TripSafe search error:', error);
      alert(
        error?.response?.data?.message ||
          'Unable to search insurance. Check backend and TRIPJACK_API_KEY.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="insurance-plan-tabs mb-3">
        {PLAN_TYPES.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`insurance-plan-tab ${planTypeId === plan.id ? 'active' : ''}`}
            onClick={() => setPlanTypeId(plan.id)}
          >
            {plan.label}
          </button>
        ))}
      </div>

      <div className="ins-dest-mode-tabs mb-2">
        <button
          type="button"
          className={destMode === 'country' ? 'active' : ''}
          onClick={() => setDestMode('country')}
        >
          Country
        </button>
        <button
          type="button"
          className={destMode === 'region' ? 'active' : ''}
          onClick={() => {
            setDestMode('region');
            setDestination(regionToDestination(INSURANCE_POPULAR_REGIONS[0]));
          }}
        >
          Popular region
        </button>
      </div>

      {destMode === 'country' ? (
        <InsuranceCountrySelect value={destination} onChange={setDestination} />
      ) : (
        <>
          <p className="insurance-section-label mb-2">Popular regions</p>
          <div className="insurance-dest-grid mb-4">
            {INSURANCE_POPULAR_REGIONS.map((region) => {
              const dest = regionToDestination(region);
              return (
                <button
                  key={region.rkey}
                  type="button"
                  className={`insurance-dest-tile ${
                    destination.rkey === dest.rkey && destination.rt === dest.rt
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => setDestination(dest)}
                >
                  {region.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="search-fields insurance-search-fields">
        <div className="field-box">
          <div className="field-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <CalendarSearch size={14} /> Start date
            </span>
          </div>
          <div className="date-input-wrap">
            <input
              className="field-input"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (endDate && e.target.value > endDate) {
                  setEndDate(defaultEndDate(e.target.value));
                }
              }}
            />
            <span className="selected-date-pill">
              {formatSelectedDate ? formatSelectedDate(startDate) : startDate}
            </span>
          </div>
        </div>

        <div className="field-box">
          <div className="field-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <CalendarSearch size={14} /> End date
            </span>
          </div>
          <div className="date-input-wrap">
            <input
              className="field-input"
              type="date"
              min={startDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <span className="selected-date-pill">
              {formatSelectedDate ? formatSelectedDate(endDate) : endDate}
            </span>
          </div>
        </div>

        <div className="field-box insurance-travellers-box">
          <div className="field-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Users size={14} /> Travellers
            </span>
          </div>
          <div className="insurance-traveller-stepper mb-2">
            <button
              type="button"
              className="traveler-button"
              onClick={() => syncAges(Math.max(1, travellerCount - 1))}
              disabled={travellerCount <= 1}
            >
              -
            </button>
            <span className="insurance-traveller-count">{travellerCount}</span>
            <button
              type="button"
              className="traveler-button"
              onClick={() => syncAges(Math.min(6, travellerCount + 1))}
              disabled={travellerCount >= 6}
            >
              +
            </button>
          </div>
          <div className="insurance-ages-list">
            {travellerAges.slice(0, travellerCount).map((age, index) => (
              <label key={index} className="insurance-age-row">
                <span>Traveller {index + 1} age</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={age}
                  onChange={(e) => updateAge(index, e.target.value)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="field-box">
          <div className="field-label">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={14} /> Flight booking ID (optional)
            </span>
          </div>
          <input
            className="field-input"
            type="text"
            placeholder="TGS… from flight review"
            value={flightBookingId}
            onChange={(e) => setFlightBookingId(e.target.value)}
          />
          <div className="field-sub">Links insurance to an existing flight booking</div>
        </div>

        <button
          type="button"
          className={`explore-btn ${loading ? 'loading' : ''}`}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Loader2 size={18} className="spin" />
              Searching packages...
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} />
              View Packages
            </span>
          )}
        </button>
      </div>

      <style>{`
        .insurance-plan-tabs,
        .ins-dest-mode-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .insurance-plan-tab,
        .ins-dest-mode-tabs button {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid #f0e0e8;
          background: #fff;
          color: #555;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .insurance-plan-tab.active,
        .ins-dest-mode-tabs button.active {
          background: rgba(237, 17, 115, 0.1);
          border-color: #ed1173;
          color: #c0006a;
        }
        .insurance-section-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #999;
          font-weight: 600;
          margin: 0;
        }
        .insurance-dest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
        }
        .insurance-dest-tile {
          padding: 12px 14px;
          border-radius: 12px;
          border: 2px solid #f0e0e8;
          background: #fff;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }
        .insurance-dest-tile:hover,
        .insurance-dest-tile.active {
          border-color: #ed1173;
          background: rgba(237, 17, 115, 0.06);
          color: #c0006a;
        }
        .insurance-search-fields {
          grid-template-columns: 1fr 1fr 1.2fr 1fr auto;
        }
        @media (max-width: 991px) {
          .insurance-search-fields {
            grid-template-columns: 1fr 1fr;
          }
          .insurance-search-fields .explore-btn {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 575px) {
          .insurance-search-fields {
            grid-template-columns: 1fr;
          }
        }
        .insurance-travellers-box {
          min-width: 200px;
        }
        .insurance-traveller-stepper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .insurance-traveller-count {
          font-size: 18px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }
        .insurance-ages-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .insurance-age-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }
        .insurance-age-row input {
          width: 64px;
          border: 1px solid #f0e0e8;
          border-radius: 8px;
          padding: 4px 8px;
          font-weight: 600;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default InsuranceSearchPanel;
