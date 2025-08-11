// src/components/FeaturedProfiles.js
import React from "react";
import ProfileCard from "./ProfileCard";

const FeaturedProfiles = () => {
  const profiles = [
    {
      id: 1,
      name: "Priya Sharma",
      age: 27,
      height: "5'4\"",
      education: "MBA, Software Engineer",
      location: "Mumbai, India",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 2,
      name: "Anjali Patel",
      age: 25,
      height: "5'3\"",
      education: "M.Tech, Data Scientist",
      location: "Bangalore, India",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      name: "Neha Gupta",
      age: 28,
      height: "5'5\"",
      education: "Doctor, MBBS",
      location: "Delhi, India",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 4,
      name: "Sneha Singh",
      age: 26,
      height: "5'2\"",
      education: "CA, Finance Professional",
      location: "Chennai, India",
      image: "https://randomuser.me/api/portraits/women/76.jpg",
    },
    {
      id: 5,
      name: "Rajesh Kumar",
      age: 30,
      height: "5'10\"",
      education: "Engineer, Business Owner",
      location: "Hyderabad, India",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 6,
      name: "Vikram Singh",
      age: 32,
      height: "6'0\"",
      education: "MBA, Marketing Director",
      location: "Pune, India",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  ];

  return (
    <section className="featured-profiles">
      <div className="container">
        <div className="section-header">
          <h2>Featured Profiles</h2>
          <p>Handpicked profiles for you</p>
        </div>

        <div className="profiles-grid">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        <div className="view-all">
          <button className="btn btn-view-all">View All Profiles</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfiles;
