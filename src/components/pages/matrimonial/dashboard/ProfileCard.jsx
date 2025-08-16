import React from "react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="matrimonial">
      <div className="matrimonial-profile-card">
        {/* Header */}
        <div className="matrimonial-profile-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
          <div className="text-left mb-2 mb-md-0">
            <h3 className="matrimonial-profile-name mb-1">
              {profile.name}, {profile.age}
            </h3>
            <p className="matrimonial-profile-meta mb-0">
              Last seen at {profile.lastSeen} • ID: {profile.id}
            </p>
          </div>
          <div className="matrimonial-profile-id">{profile.id}</div>
        </div>

        {/* Details */}
        <div className="matrimonial-profile-details d-flex flex-wrap mt-3">
          <span className="matrimonial-profile-detail me-3 mb-2">
            <i className="fas fa-ruler"></i> {profile.height}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            <i className="fas fa-map-marker-alt"></i> {profile.location}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            {profile.caste}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            <i className="fas fa-briefcase"></i> {profile.profession}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            {profile.income}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            {profile.education}
          </span>
          <span className="matrimonial-profile-detail me-3 mb-2">
            {profile.maritalStatus}
          </span>
        </div>

        {/* Actions */}
        <div className="matrimonial-profile-actions d-flex flex-wrap justify-content-start justify-content-md-end gap-2 mt-3">
          <button className="matrimonial-btn matrimonial-btn-primary w-100 w-md-auto">
            <i className="fas fa-heart"></i> Super Interest
          </button>
          <button className="matrimonial-btn matrimonial-btn-outline w-100 w-md-auto">
            <i className="fas fa-bookmark"></i> Shortlist
          </button>
          <button className="matrimonial-btn matrimonial-btn-outline w-100 w-md-auto">
            <i className="fas fa-comment"></i> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
