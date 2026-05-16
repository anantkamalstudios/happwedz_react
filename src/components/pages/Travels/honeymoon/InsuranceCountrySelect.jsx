import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, Globe } from 'lucide-react';
import {
  INSURANCE_COUNTRIES,
  countryToDestination,
} from '../../../../config/insuranceCountries';

const InsuranceCountrySelect = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  const selected = useMemo(() => {
    const match = INSURANCE_COUNTRIES.find((c) => c.code === value?.rkey);
    if (match) return match;
    if (value?.rkey && value?.label) {
      return { code: value.rkey, name: value.label, rt: value.rt };
    }
    return INSURANCE_COUNTRIES[0] || null;
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INSURANCE_COUNTRIES;
    return INSURANCE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pickCountry = (country) => {
    onChange(countryToDestination(country));
    setOpen(false);
    setQuery('');
  };

  return (
    <div className={`ins-country-select-wrap ${className}`} ref={wrapRef}>
      <label className="insurance-section-label mb-2 d-block">
        Destination country
      </label>
      <button
        type="button"
        className="ins-country-select-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe size={18} className="text-primary" />
        <span className="ins-country-select-value">
          {selected ? (
            <>
              <strong>{selected.name}</strong>
              <small className="text-muted ms-2">({selected.code})</small>
            </>
          ) : (
            <span className="text-muted">Select country</span>
          )}
        </span>
        <ChevronDown size={18} className={`ins-country-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="ins-country-dropdown">
          <div className="ins-country-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search country…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="ins-country-list" role="listbox">
            {filtered.length === 0 ? (
              <li className="ins-country-empty">No country found</li>
            ) : (
              filtered.map((country) => (
                <li key={country.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value?.rkey === country.code}
                    className={
                      value?.rkey === country.code ? 'active' : ''
                    }
                    onClick={() => pickCountry(country)}
                  >
                    <span>{country.name}</span>
                    <span className="ins-country-code">{country.code}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <style>{`
        .ins-country-select-wrap {
          position: relative;
          margin-bottom: 16px;
          z-index: 300;
        }
        .ins-country-select-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border: 2px solid #f0e0e8;
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          text-align: left;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .ins-country-select-trigger:hover,
        .ins-country-select-trigger:focus {
          border-color: #ed1173;
          outline: none;
        }
        .ins-country-select-value {
          flex: 1;
          min-width: 0;
        }
        .ins-country-chevron {
          color: #888;
          transition: transform 0.2s;
        }
        .ins-country-chevron.open {
          transform: rotate(180deg);
        }
        .ins-country-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          max-height: 320px;
          display: flex;
          flex-direction: column;
        }
        .ins-country-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-bottom: 1px solid #f0f0f0;
          color: #888;
        }
        .ins-country-search input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 14px;
        }
        .ins-country-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          overflow-y: auto;
          flex: 1;
        }
        .ins-country-list button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          color: #333;
        }
        .ins-country-list button:hover,
        .ins-country-list button.active {
          background: rgba(237, 17, 115, 0.08);
          color: #c0006a;
        }
        .ins-country-code {
          font-size: 12px;
          font-weight: 600;
          color: #999;
        }
        .ins-country-empty {
          padding: 16px;
          text-align: center;
          color: #888;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default InsuranceCountrySelect;
