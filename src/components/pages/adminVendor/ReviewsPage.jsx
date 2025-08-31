import React, { useState } from "react";
import ReviewsCollector from "./subVendors/ReviewsCollector";
import Reviews from "./subVendors/Reviews";
import ReviewsSidebar from "./subVendors/ReviewsSidebar";
import ReviewsDashboard from "./subVendors/ReviewsDashboard";

const ReviewsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("reviews");

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      title: "Outstanding Photography Service!",
      review:
        "The photographer captured every beautiful moment of our wedding day. The quality of photos exceeded our expectations and the team was very professional throughout the event.",
      date: "2024-12-15",
      serviceType: "Photography",
      eventDate: "2024-11-20",
      verified: true,
    },
    {
      id: 2,
      name: "Rahul Kumar",
      rating: 4,
      title: "Great Catering Experience",
      review:
        "Food was delicious and the presentation was excellent. All our guests complimented the menu. The service staff was courteous and efficient.",
      date: "2024-12-10",
      serviceType: "Catering",
      eventDate: "2024-10-25",
      verified: true,
    },
    {
      id: 3,
      name: "Anita Patel",
      rating: 5,
      title: "Perfect Venue for Our Dream Wedding",
      review:
        "The venue was absolutely stunning with beautiful decorations. The management team helped us coordinate everything perfectly. Highly recommended!",
      date: "2024-12-05",
      serviceType: "Venue",
      eventDate: "2024-09-15",
      verified: false,
    },
  ]);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? "⭐" : "☆"}</span>
    ));
  };

  const handleSubmitReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const renderContent = () => {
    if (activeSection === "review-collector") {
      return (
        <div>
          <div className="text-center mb-5">
            <h1>Collect a Review</h1>
            <p>Invite customers to share their experience</p>
          </div>
          <ReviewsDashboard
            totalReviews={totalReviews}
            averageRating={averageRating}
            positiveReviews={positiveReviews}
            negativeReviews={negativeReviews}
            reviewsData={reviews}
            renderStars={renderStars}
            onSubmitReview={handleSubmitReview}
          />
        </div>
      );
    }

    if (activeSection === "reviews") {
      return (
        <div>
          <div className="text-center mb-5">
            <h1>Wedding Reviews</h1>
            <p>Real experiences from real couples</p>
          </div>
          <Reviews reviews={reviews} />
        </div>
      );
    }

    return (
      <div className="text-center py-5">
        <h2>{activeSection} Section</h2>
        <p>Content coming soon...</p>
      </div>
    );
  };

  return (
    <div className="vendor-dashboard">
      <div className="row">
        <div className={`col-md-2 ${sidebarCollapsed ? "d-none" : ""}`}>
          <ReviewsSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        <div className={`col-md-${sidebarCollapsed ? 12 : 9}`}>
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
