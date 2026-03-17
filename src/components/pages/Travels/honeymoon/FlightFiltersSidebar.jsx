import React from 'react';

const FlightFiltersSidebar = ({ filtersMeta, filters, onFilterChange, onClearFilters }) => {
  if (!filtersMeta) return null;

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="mb-0">Filters</h6>

        <button
          className="btn btn-sm d-flex align-items-center justify-content-center gap-1 px-3 flex-fill flex-sm-grow-0 btn-outline-secondary text-nowrap"
          onClick={onClearFilters}
        >
          Clear All
        </button>
      </div>
      <div className="card-body">
        {/* Stops Filter */}
        {filtersMeta.stops && filtersMeta.stops.length > 0 && (
          <div className="mb-4">
            <h6>Stops</h6>
            {filtersMeta.stops.map((stop) => (
              <div className="form-check" key={stop.value}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`stop-${stop.value}`}
                  checked={filters.stops.includes(stop.value)}
                  onChange={() => onFilterChange('stops', stop.value)}
                />
                <label className="form-check-label" htmlFor={`stop-${stop.value}`}>
                  {stop.label} ({stop.count}){typeof stop.min_price === 'number' && (
                    <span className="text-muted ms-1">
                      • from ₹{Math.round(stop.min_price)}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Airlines Filter */}
        {filtersMeta.airlines && filtersMeta.airlines.length > 0 && (
          <div className="mb-4">
            <h6>Airlines</h6>
            {filtersMeta.airlines.map((airline) => (
              <div className="form-check" key={airline.code}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`airline-${airline.code}`}
                  checked={filters.airlines.includes(airline.code)}
                  onChange={() => onFilterChange('airlines', airline.code)}
                />
                <label className="form-check-label" htmlFor={`airline-${airline.code}`}>
                  {airline.logo && (
                    <img
                      src={airline.logo}
                      alt={airline.name}
                      style={{ width: '20px', marginRight: '8px' }}
                    />
                  )}
                  {airline.name} ({airline.count}){typeof airline.min_price === 'number' && (
                    <span className="text-muted ms-1">
                      • from ₹{Math.round(airline.min_price)}
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Departure Time Filter */}
        {filtersMeta.departure_time && filtersMeta.departure_time.length > 0 && (
          <div className="mb-4">
            <h6>Departure Time</h6>
            {filtersMeta.departure_time.map((time) => (
              <div className="form-check" key={time.value}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`time-${time.value}`}
                  checked={filters.departure_time.includes(time.value)}
                  onChange={() => onFilterChange('departure_time', time.value)}
                />
                <label className="form-check-label" htmlFor={`time-${time.value}`}>
                  {time.label} ({time.count})
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Price Range Filter */}
        {filtersMeta.price && (
          <div className="mb-4">
            <h6>Price Range</h6>
            <div>
              <div className="mb-2">
                <small className="text-muted">
                  ₹{Math.round(filtersMeta.price.min)} - ₹{Math.round(filtersMeta.price.max)}
                </small>
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={filters.price_min ?? ''}
                    onChange={(e) =>
                      onFilterChange(
                        'price_min',
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                    min={Math.floor(filtersMeta.price.min)}
                    max={Math.ceil(filtersMeta.price.max)}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={filters.price_max ?? ''}
                    onChange={(e) =>
                      onFilterChange(
                        'price_max',
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                    }
                    min={Math.floor(filtersMeta.price.min)}
                    max={Math.ceil(filtersMeta.price.max)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightFiltersSidebar;

