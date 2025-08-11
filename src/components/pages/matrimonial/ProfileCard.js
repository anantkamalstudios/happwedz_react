// src/components/ProfileCard.js
import React from "react";

const ProfileCard = ({ profile }) => {
  return (
    <div className="profile-card">
      <div className="profile-image">
        <img src={profile.image} alt={profile.name} />
        <div className="profile-badge">Premium</div>
      </div>
      <div className="profile-details">
        <h3 className="profile-name">{profile.name}</h3>
        <div className="profile-info">
          <span>
            {profile.age} yrs, {profile.height}
          </span>
          <span>{profile.education}</span>
          <span>{profile.location}</span>
        </div>
        <div className="profile-actions">
          <button className="btn btn-express">Express Interest</button>
          <button className="btn btn-view">View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
