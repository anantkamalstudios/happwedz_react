import { FaPlane, FaCalendarAlt, FaUser, FaEdit } from 'react-icons/fa';
import { IoIosArrowDropdown } from 'react-icons/io';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';

export default function FlightSearchHeader({ searchParams, onModify }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getTripTypeLabel = () => {
    if (searchParams.tripType === 'round') return 'ROUND TRIP';
    if (searchParams.tripType === 'oneway') return 'ONE WAY';
    return 'MULTI CITY';
  };

  const getPassengerCount = () => {
    const adults = searchParams.adults || 1;
    const children = searchParams.children || 0;
    const infants = searchParams.infants || 0;
    const total = adults + children + infants;
    
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  return (
    <div className="flight-search-header">
      <div className="container">
        <div className="flight-search-header-content">
          {/* Route Section */}
          <div className="header-section route-section">
            {/* <div className="section-icon">
              <MdFlightTakeoff size={18} />
            </div> */}
            <div className="section-content">
              <div className="section-label">{getTripTypeLabel()}</div>
              <div className="section-value">
                <span className="route-city">{searchParams.from}</span>
                <FaPlane className="route-arrow" size={20} />
                <span className="route-city">{searchParams.to}</span>
              </div>
            </div>
          </div>

          <div className="header-divider"></div>

          {/* Departure Date Section */}
          <div className="header-section date-section">
            <div className="section-icon">
              <FaCalendarAlt size={16} />
            </div>
            <div className="section-content">
              <div className="section-label">Departure Date</div>
              <div className="section-value">{formatDate(searchParams.departureDate)}</div>
            </div>
          </div>

          {/* Return Date Section (if round trip) */}
          {searchParams.tripType === 'round' && searchParams.returnDate && (
            <>
              <div className="header-divider"></div>
              <div className="header-section date-section">
                <div className="section-icon">
                  <FaCalendarAlt size={16} />
                </div>
                <div className="section-content">
                  <div className="section-label">Return Date</div>
                  <div className="section-value">{formatDate(searchParams.returnDate)}</div>
                </div>
              </div>
            </>
          )}

          <div className="header-divider"></div>

          {/* Passengers Section */}
          <div className="header-section passengers-section">
            <div className="section-icon">
              <FaUser size={16} />
            </div>
            <div className="section-content">
              <div className="section-label">Passengers & Class</div>
              <div className="section-value">
                {getPassengerCount()} | {searchParams.cabinClass?.toUpperCase() || 'ECONOMY'}
              </div>
            </div>
          </div>

          {/* Preferred Airline (if selected) */}
          {searchParams.preferredAirline && searchParams.preferredAirline !== 'All' && (
            <>
              <div className="header-divider"></div>
              <div className="header-section airline-section">
                <div className="section-icon">
                  <MdFlightLand size={18} />
                </div>
                <div className="section-content">
                  <div className="section-label">Preferred Airline</div>
                  <div className="section-value">{searchParams.preferredAirline}</div>
                </div>
              </div>
            </>
          )}

          {/* Modify Search Button */}
          <div className="header-section modify-section">
            <button className="modify-search-btn" onClick={onModify}>
              <IoIosArrowDropdown size={14} className="me-2" />
              MODIFY SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
