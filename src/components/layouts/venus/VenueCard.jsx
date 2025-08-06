
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faMapMarkerAlt, faUser, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

const VenueCard = ({ venue }) => {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="position-relative">
                <img src={venue.image} className="card-img-top" alt={venue.name} />
                <button className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle">
                    <FontAwesomeIcon icon={faHeart} />
                </button>
            </div>
            <div className="card-body">
                <h5 className="card-title">{venue.name}</h5>
                <p className="card-text text-muted">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    {venue.location}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                        <FontAwesomeIcon icon={faUser} className="me-1" />
                        Up to {venue.capacity} guests
                    </span>
                    <span className="text-primary fw-bold">
                        <FontAwesomeIcon icon={faRupeeSign} className="me-1" />
                        {venue.price} onwards
                    </span>
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button className="btn btn-outline-primary">View Details</button>
                    <button className="btn btn-primary">Check Availability</button>
                </div>
            </div>
        </div>
    );
};

export default VenueCard;