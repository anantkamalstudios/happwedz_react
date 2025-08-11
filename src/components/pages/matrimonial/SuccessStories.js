// src/components/SuccessStories.js
import React from "react";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      couple: "Rahul & Priya",
      married: "Married in 2020",
      story:
        "We found each other on Jeevansathi and couldn't be happier. The platform made it easy to connect with like-minded individuals.",
      image: "couple1.jpg",
    },
    {
      id: 2,
      couple: "Vikram & Anjali",
      married: "Married in 2021",
      story:
        "After months of searching, we finally found our perfect match through Jeevansathi. The detailed profiles helped us make the right decision.",
      image: "couple2.jpg",
    },
    {
      id: 3,
      couple: "Amit & Neha",
      married: "Married in 2022",
      story:
        "We are grateful to Jeevansathi for helping us find each other. The verification process gave us confidence in the platform.",
      image: "couple3.jpg",
    },
  ];

  return (
    <section className="success-stories">
      <div className="container">
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>Real couples who found their life partners on Jeevansathi</p>
        </div>

        <div className="stories-grid">
          {stories.map((story) => (
            <div className="story-card" key={story.id}>
              <div className="story-image">
                <div className="couple-image"></div>
              </div>
              <div className="story-content">
                <h3>{story.couple}</h3>
                <p className="married-date">{story.married}</p>
                <p className="story-text">"{story.story}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="share-story">
          <button className="btn btn-share">Share Your Story</button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
