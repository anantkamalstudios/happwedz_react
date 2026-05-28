import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  CalendarSearch,
  Users,
  Loader2,
  MapPin,
  User,
  RefreshCw,
  Globe,
  Info,
  ScanLine,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchTripSafeInsurance } from '../../../../services/api/tripSafeApi';
import {
  INSURANCE_POPULAR_REGIONS,
  getDefaultInsuranceDestination,
  regionToDestination,
} from '../../../../config/insuranceCountries';
import InsuranceCountrySelect from './InsuranceCountrySelect';

/* ─── date helpers ───────────────────────────────────────────────────────── */
const toISO = (date) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};
const fromISO = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

/* ─── constants ─────────────────────────────────────────────────────────── */

const PLAN_TYPES = [
  { id: 'international', label: 'International', icon: <User size={15} />, ict: null },
  { id: 'student', label: 'Student', icon: <User size={15} />, ict: 'STUDENT' },
  { id: 'amt', label: 'Annual Multi Trip', icon: <RefreshCw size={15} />, ict: 'AMT' },
];

// Coverage durations: 1 month (30 days) → 2 years (730 days)
const COVERAGE_DURATIONS = [
  { value: '30',  label: '1 Month' },
  { value: '60',  label: '2 Months' },
  { value: '90',  label: '3 Months' },
  { value: '120', label: '4 Months' },
  { value: '150', label: '5 Months' },
  { value: '180', label: '6 Months' },
  { value: '210', label: '7 Months' },
  { value: '240', label: '8 Months' },
  { value: '270', label: '9 Months' },
  { value: '300', label: '10 Months' },
  { value: '330', label: '11 Months' },
  { value: '365', label: '1 Year' },
  { value: '730', label: '2 Years' },
];

/** Calculate age in full years from a DOB string (YYYY-MM-DD) relative to a reference date */
const calcAgeFromDOB = (dob, referenceDate) => {
  if (!dob) return '';
  const birth = new Date(dob);
  const ref = referenceDate ? new Date(referenceDate) : new Date();
  if (Number.isNaN(birth.getTime())) return '';
  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) age -= 1;
  return age > 0 ? String(age) : '';
};

const AMT_DURATIONS = [
  { value: '30', label: '30 Days' },
  { value: '45', label: '45 Days' },
  { value: '60', label: '60 Days' },
];

const AMT_DESTINATIONS = [
  { value: 'worldwide', label: 'Worldwide', rkey: 'WW', rt: 'POPULARREGION' },
  { value: 'worldwide_excl', label: 'Worldwide excl US & Canada', rkey: 'WWXUSCA', rt: 'POPULARREGION' },
];

/* ─── helpers ────────────────────────────────────────────────────────────── */

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

/* ─── sub-forms ──────────────────────────────────────────────────────────── */

/** International plan form (original) */
function InternationalForm({ formatSelectedDate, onSearch, loading }) {
  const [destMode, setDestMode] = useState('country');
  const [destination, setDestination] = useState(defaultDestination);
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(defaultEndDate());
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellerAges, setTravellerAges] = useState([30]);
  const [flightBookingId, setFlightBookingId] = useState('');

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

  const handleSubmit = () => {
    if (!startDate || !endDate) return alert('Please select start and end dates');
    if (new Date(endDate) < new Date(startDate)) return alert('End date must be on or after start date');
    if (!destination?.rkey) return alert('Please select a destination country or region');
    onSearch({
      sd: startDate,
      ed: endDate,
      destination,
      travellerAges: travellerAges.slice(0, travellerCount),
      flightBookingId,
      ict: null,
    });
  };

  return (
    <div className="insurance-search-body">
      <div className="ins-dest-mode-tabs">
        <button type="button" className={destMode === 'country' ? 'active' : ''} onClick={() => setDestMode('country')}>Country</button>
        <button type="button" className={destMode === 'region' ? 'active' : ''} onClick={() => { setDestMode('region'); setDestination(regionToDestination(INSURANCE_POPULAR_REGIONS[0])); }}>Popular region</button>
      </div>

      {destMode === 'country' ? (
        <InsuranceCountrySelect value={destination} onChange={setDestination} />
      ) : (
        <>
          <p className="insurance-section-label">Popular regions</p>
          <div className="insurance-dest-grid">
            {INSURANCE_POPULAR_REGIONS.map((region) => {
              const dest = regionToDestination(region);
              return (
                <button key={region.rkey} type="button"
                  className={`insurance-dest-tile ${destination.rkey === dest.rkey && destination.rt === dest.rt ? 'active' : ''}`}
                  onClick={() => setDestination(dest)}>
                  {region.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="search-fields insurance-search-fields">
        <div className="field-box">
          <div className="field-label"><span className="field-label-content"><CalendarSearch size={14} /> Start date</span></div>
          <div className="date-input-wrap ins-dp-wrap">
            <DatePicker
              className="field-input ins-dp-input"
              selected={fromISO(startDate)}
              onChange={(date) => {
                const iso = toISO(date);
                setStartDate(iso);
                if (endDate && iso > endDate) setEndDate(defaultEndDate(iso));
              }}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              popperPlacement="bottom-start"
              popperProps={{ strategy: 'fixed' }}
              portalId="ins-datepicker-portal"
              placeholderText="Pick a date"
            />
          </div>
        </div>

        <div className="field-box">
          <div className="field-label"><span className="field-label-content"><CalendarSearch size={14} /> End date</span></div>
          <div className="date-input-wrap ins-dp-wrap">
            <DatePicker
              className="field-input ins-dp-input"
              selected={fromISO(endDate)}
              onChange={(date) => setEndDate(toISO(date))}
              minDate={fromISO(startDate) || new Date()}
              dateFormat="dd MMM yyyy"
              popperPlacement="bottom-start"
              popperProps={{ strategy: 'fixed' }}
              portalId="ins-datepicker-portal"
              placeholderText="Pick a date"
            />
          </div>
        </div>

        <div className="field-box insurance-travellers-box">
          <div className="field-label"><span className="field-label-content"><Users size={14} /> Travellers</span></div>
          <div className="insurance-traveller-stepper">
            <button type="button" className="traveler-button" onClick={() => syncAges(Math.max(1, travellerCount - 1))} disabled={travellerCount <= 1}>-</button>
            <span className="insurance-traveller-count">{travellerCount}</span>
            <button type="button" className="traveler-button" onClick={() => syncAges(Math.min(6, travellerCount + 1))} disabled={travellerCount >= 6}>+</button>
          </div>
          <div className="insurance-ages-list">
            {travellerAges.slice(0, travellerCount).map((age, index) => (
              <label key={index} className="insurance-age-row">
                <span>Traveller {index + 1} age</span>
                <input type="number" min={1} max={99} value={age} onChange={(e) => updateAge(index, e.target.value)} />
              </label>
            ))}
          </div>
        </div>

        <div className="field-box">
          <div className="field-label"><span className="field-label-content"><MapPin size={14} /> Flight booking ID (optional)</span></div>
          <input className="field-input" type="text" placeholder="TGS… from flight review" value={flightBookingId} onChange={(e) => setFlightBookingId(e.target.value)} />
          <div className="field-sub">Links insurance to an existing flight booking</div>
        </div>

        <button type="button" className={`explore-btn ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <span className="explore-btn-content"><Loader2 size={18} className="spin" />Searching packages...</span>
          ) : (
            <span className="explore-btn-content"><Shield size={18} />View Packages</span>
          )}
        </button>
      </div>
    </div>
  );
}

/** Compute end date string from start date + duration days */
const addDays = (dateStr, days) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
};

/** Compute closest coverage duration (in days) from start → end date diff */
const durationFromDates = (startStr, endStr) => {
  if (!startStr || !endStr) return '180';
  const diff = Math.round((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return '30';
  // Find the closest option
  const closest = COVERAGE_DURATIONS.reduce((prev, cur) =>
    Math.abs(Number(cur.value) - diff) < Math.abs(Number(prev.value) - diff) ? cur : prev
  );
  return closest.value;
};

/** Student plan form */
function StudentForm({ formatSelectedDate, onSearch, loading }) {
  const [flightBookingId, setFlightBookingId] = useState('');
  const [destination, setDestination] = useState(defaultDestination);
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [coverageDuration, setCoverageDuration] = useState('180');
  const [endDate, setEndDate] = useState(() => addDays(defaultStartDate(), 180));
  const [studentCount, setStudentCount] = useState(1);
  const [studentDOBs, setStudentDOBs] = useState(['']);
  const [studentAges, setStudentAges] = useState(['']);

  const syncStudents = (count) => {
    const dobs = [...studentDOBs];
    const ages = [...studentAges];
    while (dobs.length < count) { dobs.push(''); ages.push(''); }
    setStudentDOBs(dobs.slice(0, count));
    setStudentAges(ages.slice(0, count));
    setStudentCount(count);
  };

  /** When DOB changes → auto-calculate age from DOB relative to trip start date */
  const updateDOB = (i, val) => {
    const newDOBs = [...studentDOBs];
    newDOBs[i] = val;
    setStudentDOBs(newDOBs);
    const newAges = [...studentAges];
    newAges[i] = calcAgeFromDOB(val, startDate);
    setStudentAges(newAges);
  };

  /** When age is manually selected → clear DOB for that student */
  const updateAge = (i, val) => {
    const newAges = [...studentAges];
    newAges[i] = val;
    setStudentAges(newAges);
    const newDOBs = [...studentDOBs];
    newDOBs[i] = '';
    setStudentDOBs(newDOBs);
  };

  /** Start date changes → keep duration, recalculate end date + student ages */
  const handleStartDateChange = (val) => {
    setStartDate(val);
    const newEnd = addDays(val, coverageDuration);
    setEndDate(newEnd);
    const newAges = studentDOBs.map((dob, i) =>
      dob ? calcAgeFromDOB(dob, val) : studentAges[i]
    );
    setStudentAges(newAges);
  };

  /** Duration changes → recalculate end date from start + new duration */
  const handleDurationChange = (val) => {
    setCoverageDuration(val);
    setEndDate(addDays(startDate, val));
  };

  /** End date manually changed → recalculate closest duration */
  const handleEndDateChange = (val) => {
    setEndDate(val);
    setCoverageDuration(durationFromDates(startDate, val));
  };

  const handleSubmit = () => {
    if (!startDate) return alert('Please select a start date');
    if (!destination?.rkey) return alert('Please select a destination country');
    const travellerAges = studentAges.slice(0, studentCount).map((a, i) => {
      if (a) return Number(a);
      if (studentDOBs[i]) return Number(calcAgeFromDOB(studentDOBs[i], startDate)) || 22;
      return 22;
    });
    // Student plan: pass coverageDays (cd) — TripJack uses cd inside isq, no ed
    onSearch({
      sd: startDate,
      ed: endDate,           // kept for display purposes in results page
      destination,
      travellerAges,
      flightBookingId,
      ict: 'STUDENT',
      coverageDays: coverageDuration,
    });
  };

  return (
    <div className="insurance-search-body">
      {/* Flight booking row */}
      <div className="ins-student-flight-row">
        <span className="ins-student-flight-label">Have a Flight Booking?</span>
        <input
          className="ins-student-flight-input"
          type="text"
          placeholder="Have a Flight Booking?"
          value={flightBookingId}
          onChange={(e) => setFlightBookingId(e.target.value)}
        />
        <button type="button" className="ins-student-getinfo-btn">Get Info</button>
      </div>

      {/* Where are you travelling */}
      <p className="ins-where-label"><MapPin size={16} /> Where are you travelling?</p>
      <InsuranceCountrySelect value={destination} onChange={setDestination} />

      {/* Start Date + Coverage Duration + End Date — all linked */}
      <div className="ins-student-date-row ins-student-date-row-3">
        {/* Start Date */}
        <div className="ins-student-date-box ins-dp-wrap">
          <span className="ins-student-date-icon"><CalendarSearch size={16} /></span>
          <DatePicker
            className="ins-student-date-input ins-dp-input"
            selected={fromISO(startDate)}
            onChange={(date) => handleStartDateChange(toISO(date))}
            minDate={new Date()}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            placeholderText="Pick a date"
          />
        </div>

        {/* Coverage Duration */}
        <div className="ins-student-duration-box">
          <span className="ins-student-date-icon"><CalendarSearch size={16} /></span>
          <select
            className="ins-student-duration-select"
            value={coverageDuration}
            onChange={(e) => handleDurationChange(e.target.value)}
          >
            {COVERAGE_DURATIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* End Date */}
        <div className="ins-student-date-box ins-dp-wrap">
          <span className="ins-student-date-icon"><CalendarSearch size={16} /></span>
          <DatePicker
            className="ins-student-date-input ins-dp-input"
            selected={fromISO(endDate)}
            onChange={(date) => handleEndDateChange(toISO(date))}
            minDate={fromISO(startDate) || new Date()}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            placeholderText="Pick a date"
          />
        </div>
      </div>

      {/* Students stepper */}
      <div className="ins-traveller-card">
        <div className="ins-traveller-card-header">
          <span className="ins-traveller-card-title"><Users size={18} /> {studentCount} Student{studentCount > 1 ? 's' : ''}</span>
          <div className="ins-traveller-stepper">
            <button type="button" className="ins-stepper-btn" onClick={() => syncStudents(Math.max(1, studentCount - 1))} disabled={studentCount <= 1}>-</button>
            <span className="ins-stepper-count">{studentCount}</span>
            <button type="button" className="ins-stepper-btn" onClick={() => syncStudents(Math.min(6, studentCount + 1))} disabled={studentCount >= 6}>+</button>
          </div>
        </div>

        {Array.from({ length: studentCount }).map((_, i) => (
          <div key={i} className="ins-traveller-row">
            <div className="ins-traveller-info-box">
              <span className="ins-traveller-row-label">Student {i + 1}</span>
              <div className="ins-traveller-dob-age">
                <input
                  className="ins-dob-input"
                  type="date"
                  value={studentDOBs[i] || ''}
                  onChange={(e) => updateDOB(i, e.target.value)}
                />
                <span className="ins-or-text">OR</span>
                <select
                  className="ins-age-select"
                  value={studentAges[i] || ''}
                  onChange={(e) => updateAge(i, e.target.value)}
                >
                  <option value="">Select Age</option>
                  {Array.from({ length: 35 }, (_, k) => k + 16).map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
              {studentDOBs[i] && studentAges[i] && (
                <div className="ins-dob-age-hint">Age: {studentAges[i]} yrs (as on trip start date)</div>
              )}
            </div>
            <button type="button" className="ins-passport-btn">
              <ScanLine size={20} />
              <div>
                <div className="ins-passport-title">Prefer to upload passports?</div>
                <div className="ins-passport-sub">This will auto-fill traveller info</div>
              </div>
            </button>
          </div>
        ))}

        <div className="ins-traveller-hints">
          <span>ℹ Age as on trip start date</span>
          <span>✏ You can edit DOB at a later stage</span>
        </div>
      </div>

      <button type="button" className={`explore-btn ins-view-packages-btn ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <span className="explore-btn-content"><Loader2 size={18} className="spin" />Searching packages...</span>
        ) : (
          <span className="explore-btn-content">View Packages</span>
        )}
      </button>
    </div>
  );
}

/** Annual Multi Trip form */
function AnnualMultiTripForm({ formatSelectedDate, onSearch, loading }) {
  const [amtDest, setAmtDest] = useState('worldwide_excl');
  const [maxDuration, setMaxDuration] = useState('45');
  const [startDate, setStartDate] = useState(defaultStartDate());
  const [endDate, setEndDate] = useState(() => {
    // AMT policy window max = 180 days per TripJack
    const d = new Date(defaultStartDate());
    d.setDate(d.getDate() + 180);
    return d.toISOString().slice(0, 10);
  });
  const [travellerCount, setTravellerCount] = useState(1);
  const [travellerDOBs, setTravellerDOBs] = useState(['']);
  const [travellerAges, setTravellerAges] = useState(['']);

  const syncTravellers = (count) => {
    const dobs = [...travellerDOBs];
    const ages = [...travellerAges];
    while (dobs.length < count) { dobs.push(''); ages.push(''); }
    setTravellerDOBs(dobs.slice(0, count));
    setTravellerAges(ages.slice(0, count));
    setTravellerCount(count);
  };

  const updateDOB = (i, val) => { const n = [...travellerDOBs]; n[i] = val; setTravellerDOBs(n); };
  const updateAge = (i, val) => { const n = [...travellerAges]; n[i] = val; setTravellerAges(n); };

  const handleSubmit = () => {
    if (!startDate) return alert('Please select a start date');

    // Force cap end date to 180 days max (TripJack AMT requirement)
    const maxEnd = (() => { const d = new Date(startDate); d.setDate(d.getDate() + 180); return d.toISOString().slice(0, 10); })();
    const safeEndDate = (!endDate || endDate > maxEnd) ? maxEnd : endDate;
    if (new Date(safeEndDate) < new Date(startDate)) return alert('End date must be on or after start date');

    const amtDestObj = AMT_DESTINATIONS.find((d) => d.value === amtDest) || AMT_DESTINATIONS[1];
    const destination = { rkey: amtDestObj.rkey, rt: amtDestObj.rt, label: amtDestObj.label };

    const ages = travellerAges.slice(0, travellerCount).map((a, i) => {
      if (a) return Number(a);
      if (travellerDOBs[i]) {
        const diff = new Date() - new Date(travellerDOBs[i]);
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      }
      return 30;
    });

    onSearch({ sd: startDate, ed: safeEndDate, destination, travellerAges: ages, flightBookingId: '', ict: 'AMT', maxDuration });
  };

  return (
    <div className="insurance-search-body">
      {/* Where are you travelling */}
      <p className="ins-where-label"><MapPin size={16} /> Where are you travelling?</p>
      <div className="ins-amt-dest-radios">
        {AMT_DESTINATIONS.map((d) => (
          <label key={d.value} className={`ins-amt-radio-label ${amtDest === d.value ? 'active' : ''}`}>
            <input type="radio" name="amt-dest" value={d.value} checked={amtDest === d.value} onChange={() => setAmtDest(d.value)} />
            {d.label}
          </label>
        ))}
      </div>

      {/* Max trip duration */}
      <p className="ins-where-label ins-duration-label">
        What would be the maximum duration of your trips?
        <span className="ins-info-icon" title="Maximum duration per individual trip"><Info size={14} /></span>
      </p>
      <div className="ins-amt-duration-radios">
        {AMT_DURATIONS.map((d) => (
          <label key={d.value} className={`ins-amt-radio-label ${maxDuration === d.value ? 'active' : ''}`}>
            <input type="radio" name="amt-duration" value={d.value} checked={maxDuration === d.value} onChange={() => setMaxDuration(d.value)} />
            {d.label}
          </label>
        ))}
      </div>

      {/* Start + End Date */}
      <div className="ins-student-date-row">
        <div className="ins-student-date-box ins-dp-wrap">
          <span className="ins-student-date-icon"><CalendarSearch size={16} /></span>
          <DatePicker
            className="ins-student-date-input ins-dp-input"
            selected={fromISO(startDate)}
            onChange={(date) => {
              const iso = toISO(date);
              setStartDate(iso);
              const d = new Date(iso);
              d.setDate(d.getDate() + 180);
              const maxEnd = toISO(d);
              if (!endDate || endDate > maxEnd || iso > endDate) {
                setEndDate(maxEnd);
              }
            }}
            minDate={new Date()}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            placeholderText="Pick a date"
          />
        </div>

        <div className="ins-student-date-box ins-dp-wrap">
          <span className="ins-student-date-icon"><CalendarSearch size={16} /></span>
          <DatePicker
            className="ins-student-date-input ins-dp-input"
            selected={fromISO(endDate)}
            onChange={(date) => setEndDate(toISO(date))}
            minDate={fromISO(startDate) || new Date()}
            maxDate={(() => {
              const d = new Date(startDate);
              d.setDate(d.getDate() + 180);
              return d;
            })()}
            dateFormat="dd MMM yyyy"
            popperPlacement="bottom-start"
            placeholderText="Pick a date"
          />
        </div>
      </div>

      {/* Travellers stepper */}
      <div className="ins-traveller-card">
        <div className="ins-traveller-card-header">
          <span className="ins-traveller-card-title"><Users size={18} /> {travellerCount} Traveller{travellerCount > 1 ? 's' : ''}</span>
          <div className="ins-traveller-stepper">
            <button type="button" className="ins-stepper-btn" onClick={() => syncTravellers(Math.max(1, travellerCount - 1))} disabled={travellerCount <= 1}>-</button>
            <span className="ins-stepper-count">{travellerCount}</span>
            <button type="button" className="ins-stepper-btn" onClick={() => syncTravellers(Math.min(6, travellerCount + 1))} disabled={travellerCount >= 6}>+</button>
          </div>
        </div>

        {Array.from({ length: travellerCount }).map((_, i) => (
          <div key={i} className="ins-traveller-row">
            <div className="ins-traveller-info-box">
              <span className="ins-traveller-row-label">Traveller {i + 1}</span>
              <div className="ins-traveller-dob-age">
                <input
                  className="ins-dob-input"
                  type="date"
                  placeholder="DD-MM-YYYY"
                  value={travellerDOBs[i] || ''}
                  onChange={(e) => updateDOB(i, e.target.value)}
                />
                <span className="ins-or-text">OR</span>
                <select
                  className="ins-age-select"
                  value={travellerAges[i] || ''}
                  onChange={(e) => updateAge(i, e.target.value)}
                >
                  <option value="">Select Age</option>
                  {Array.from({ length: 80 }, (_, k) => k + 1).map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="ins-passport-btn">
              <ScanLine size={20} />
              <div>
                <div className="ins-passport-title">Prefer to upload passports?</div>
                <div className="ins-passport-sub">This will auto-fill traveller info</div>
              </div>
            </button>
          </div>
        ))}

        <div className="ins-traveller-hints">
          <span>ℹ Age as on trip start date</span>
          <span>✏ You can edit DOB at a later stage</span>
        </div>
      </div>

      <button type="button" className={`explore-btn ins-view-packages-btn ${loading ? 'loading' : ''}`} onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <span className="explore-btn-content"><Loader2 size={18} className="spin" />Searching packages...</span>
        ) : (
          <span className="explore-btn-content">View Packages</span>
        )}
      </button>
    </div>
  );
}

/* ─── main panel ─────────────────────────────────────────────────────────── */

const InsuranceSearchPanel = ({ formatSelectedDate }) => {
  const navigate = useNavigate();
  const [planTypeId, setPlanTypeId] = useState('international');
  const [loading, setLoading] = useState(false);

  const handleSearch = async ({ sd, ed, destination, travellerAges, flightBookingId, ict, maxDuration, coverageDays }) => {
    // Build isq differently per plan type
    let isq;

    if (ict === 'STUDENT') {
      // Student: ict + cd (coverage days) go INSIDE isq, no ed, no isp
      isq = {
        sd,
        cd: String(coverageDays || '180'),
        isc: { iri: [{ rkey: destination.rkey, rt: destination.rt || 'COUNTRY' }] },
        iti: travellerAges.map((age) => ({ age })),
        isef: false,
        ict: 'STUDENT',
      };
      const embedded = Boolean(flightBookingId?.trim());
      if (embedded) { isq.isef = true; isq.bid = flightBookingId.trim(); }

      const payload = { isq };

      setLoading(true);
      try {
        const response = await searchTripSafeInsurance(payload, { embedded });
        if (!response?.status) { alert(response?.message || 'Insurance search failed'); return; }
        if (!response.data?.length) { alert('No student insurance packages found. Try a different country or duration.'); return; }
        navigate('/honeymoon/insurance', {
          state: {
            searchParams: { ...payload, planType: 'Student', destinationLabel: destination.label || destination.rkey },
            initialResults: response,
          },
        });
      } catch (error) {
        console.error('TripSafe student search error:', error);
        alert(error?.response?.data?.message || error?.message || 'Unable to search insurance.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (ict === 'AMT') {
      // AMT: sd + ed (max 180 days), adr = max trip duration, ict at top level
      isq = {
        sd,
        ed,
        isc: { iri: [{ rkey: destination.rkey, rt: 'POPULARREGION' }] },
        iti: travellerAges.map((age) => ({ age })),
        isp: {},
        adr: parseInt(maxDuration, 10) || 45,
      };

      const payload = { isq, ict: 'AMT' };

      setLoading(true);
      try {
        const response = await searchTripSafeInsurance(payload, {});
        if (!response?.status) { alert(response?.message || 'Insurance search failed'); return; }
        if (!response.data?.length) { alert('No annual multi-trip packages found. Try different settings.'); return; }
        navigate('/honeymoon/insurance', {
          state: {
            searchParams: { ...payload, planType: 'Annual Multi Trip', destinationLabel: destination.label || destination.rkey },
            initialResults: response,
          },
        });
      } catch (error) {
        console.error('TripSafe AMT search error:', error);
        alert(error?.response?.data?.message || error?.message || 'Unable to search insurance.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // International (default)
    isq = {
      sd,
      ed,
      isc: { iri: [{ rkey: destination.rkey, rt: destination.rt || 'COUNTRY' }] },
      iti: travellerAges.map((age) => ({ age })),
      isp: {},
    };

    const embedded = Boolean(flightBookingId?.trim());
    if (embedded) { isq.isef = true; isq.bid = flightBookingId.trim(); }

    const payload = { isq };
    if (embedded) payload.ict = 'API_EMB';

    setLoading(true);
    try {
      const response = await searchTripSafeInsurance(payload, { embedded });
      if (!response?.status) { alert(response?.message || 'Insurance search failed'); return; }
      if (!response.data?.length) { alert('No insurance packages found for the selected criteria. Try different dates or destination.'); return; }
      navigate('/honeymoon/insurance', {
        state: {
          searchParams: { ...payload, planType: 'International', destinationLabel: destination.label || destination.rkey },
          initialResults: response,
        },
      });
    } catch (error) {
      console.error('TripSafe search error:', error);
      alert(error?.response?.data?.message || error?.message || 'Unable to search insurance. Check backend and TRIPJACK_API_KEY.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-card insurance-search-card">
      <div className="insurance-plan-tabs">
        {PLAN_TYPES.map((plan) => (
          <button
            key={plan.id}
            type="button"
            className={`insurance-plan-tab ${planTypeId === plan.id ? 'active' : ''}`}
            onClick={() => setPlanTypeId(plan.id)}
          >
            <span className="ins-tab-icon">{plan.icon}</span>
            {plan.label}
          </button>
        ))}
      </div>

      {planTypeId === 'international' && (
        <InternationalForm formatSelectedDate={formatSelectedDate} onSearch={handleSearch} loading={loading} />
      )}
      {planTypeId === 'student' && (
        <StudentForm formatSelectedDate={formatSelectedDate} onSearch={handleSearch} loading={loading} />
      )}
      {planTypeId === 'amt' && (
        <AnnualMultiTripForm formatSelectedDate={formatSelectedDate} onSearch={handleSearch} loading={loading} />
      )}

      <style>{`
        .ins-dp-wrap { position: relative; }
        .ins-dp-wrap .react-datepicker-wrapper,
        .ins-dp-wrap .react-datepicker__input-container { width: 100%; display: block; }
        .ins-dp-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 0.92rem;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .ins-dp-input:focus,
        .ins-dp-input:hover {
          border-color: #ed1173;
          box-shadow: 0 0 0 3px rgba(237, 17, 115, 0.12);
        }

        /* Popper / calendar container — escape parent overflow */
        #ins-datepicker-portal,
        #ins-datepicker-portal .react-datepicker-popper {
          position: relative;
          z-index: 99999;
        }
        .react-datepicker-popper {
          z-index: 99999 !important;
        }
        .react-datepicker__portal {
          z-index: 99999;
        }
        .react-datepicker {
          font-family: 'Poppins', 'Inter', sans-serif;
          border: none;
          border-radius: 16px;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.18);
          overflow: hidden;
        }
        .react-datepicker__triangle { display: none !important; }

        /* Header */
        .react-datepicker__header {
          background: linear-gradient(135deg, #ed1173, #ff6b9d);
          border-bottom: none;
          padding: 14px 12px 10px;
        }
        .react-datepicker__current-month,
        .react-datepicker-time__header,
        .react-datepicker-year-header {
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .react-datepicker__day-name {
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
          width: 2.1rem;
          margin: 0.18rem;
        }
        .react-datepicker__navigation { top: 16px; }
        .react-datepicker__navigation-icon::before {
          border-color: #fff;
          border-width: 2px 2px 0 0;
          height: 8px;
          width: 8px;
        }

        /* Days */
        .react-datepicker__month { margin: 0.5rem 0.4rem; }
        .react-datepicker__day {
          width: 2.1rem;
          height: 2.1rem;
          line-height: 2.1rem;
          margin: 0.18rem;
          border-radius: 50%;
          color: #1f2937;
          font-weight: 500;
          transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
        }
        .react-datepicker__day:hover {
          background: rgba(237, 17, 115, 0.12);
          color: #c0006a;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background: linear-gradient(135deg, #ed1173, #ff6b9d) !important;
          color: #fff !important;
          box-shadow: 0 6px 14px rgba(237, 17, 115, 0.35);
        }
        .react-datepicker__day--today {
          font-weight: 700;
          color: #ed1173;
          background: rgba(237, 17, 115, 0.08);
        }
        .react-datepicker__day--outside-month { color: #cbd5e1; }
        .react-datepicker__day--disabled {
          color: #e2e8f0 !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default InsuranceSearchPanel;
