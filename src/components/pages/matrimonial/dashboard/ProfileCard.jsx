import React from "react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="matrimonial">
      <div className="matrimonial-profile-card">
        <div className="matrimonial-profile-header">
          <div>
            <h3 className="matrimonial-profile-name">
              {profile.name}, {profile.age}
            </h3>
            <p className="matrimonial-profile-meta">
              Last seen at {profile.lastSeen} • ID: {profile.id}
            </p>
          </div>
          <div className="matrimonial-profile-id">{profile.id}</div>
        </div>

        <div className="matrimonial-profile-details">
          <span className="matrimonial-profile-detail">
            <i className="fas fa-ruler"></i> {profile.height}
          </span>
          <span className="matrimonial-profile-detail">
            <i className="fas fa-map-marker-alt"></i> {profile.location}
          </span>
          <span className="matrimonial-profile-detail">{profile.caste}</span>
          <span className="matrimonial-profile-detail">
            <i className="fas fa-briefcase"></i> {profile.profession}
          </span>
          <span className="matrimonial-profile-detail">{profile.income}</span>
          <span className="matrimonial-profile-detail">
            {profile.education}
          </span>
          <span className="matrimonial-profile-detail">
            {profile.maritalStatus}
          </span>
        </div>

        <div className="matrimonial-profile-actions">
          <button className="matrimonial-btn matrimonial-btn-primary">
            <i className="fas fa-heart"></i> Super Interest
          </button>
          <button className="matrimonial-btn matrimonial-btn-outline">
            <i className="fas fa-bookmark"></i> Shortlist
          </button>
          <button className="matrimonial-btn matrimonial-btn-outline">
            <i className="fas fa-comment"></i> Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
