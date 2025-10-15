// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import ReviewsCollector from "./subVendors/ReviewsCollector";
// import Reviews from "./subVendors/Reviews";
// import ReviewsSidebar from "./subVendors/ReviewsSidebar";
// import ReviewsDashboard from "./subVendors/ReviewsDashboard";

// const API_BASE_URL = "https://happywedz.com/api";

// const ReviewsPage = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [activeSection, setActiveSection] = useState("reviews");
//   const { token: vendorToken } = useSelector((state) => state.vendorAuth);

//   const [reviews, setReviews] = useState([]);
//   const [stats, setStats] = useState({
//     averageRating: 0,
//     reviewCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!vendorToken) {
//       setError("Vendor not authenticated.");
//       setLoading(false);
//       return;
//     }

//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
//           headers: { Authorization: `Bearer ${vendorToken}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch reviews");
//         const data = await res.json();
//         const formattedReviews = data.reviews.map((r) => ({
//           id: r.id,
//           name: r.user?.name || "Anonymous",
//           rating: r.rating,
//           review: r.comment,
//           date: new Date(r.createdAt).toLocaleDateString(),
//           verified: true, // You can adjust this based on your API
//         }));
//         setReviews(formattedReviews);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     const fetchStats = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/reviews/my-average-rating`, {
//           headers: { Authorization: `Bearer ${vendorToken}` },
//         });
//         if (!res.ok) throw new Error("Failed to fetch stats");
//         const data = await res.json();
//         setStats({
//           averageRating: parseFloat(data.averageRating) || 0,
//           reviewCount: parseInt(data.reviewCount) || 0,
//         });
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     const fetchAll = async () => {
//       setLoading(true);
//       setError(null);
//       await Promise.all([fetchReviews(), fetchStats()]);
//       setLoading(false);
//     };

//     fetchAll();
//   }, [vendorToken]);

//   const totalReviews = stats.reviewCount;
//   const averageRating = stats.averageRating;
//   const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
//   const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <span key={i}>{i < rating ? "⭐" : "☆"}</span>
//     ));
//   };

//   const refetchData = () => {
//     // This function can be called to refresh data after a new review is submitted
//     // For now, we'll just log it. You can implement the fetch logic here again.
//     console.log("Refetching reviews...");
//   };

//   const handleSubmitReview = (newReview) => {
//     setReviews((prev) => [newReview, ...prev]);
//   };

//   const renderContent = () => {
//     if (activeSection === "review-collector") {
//       return (
//         <div>
//           <div className="text-center mb-5">
//             <h1>Collect a Review</h1>
//             <p>Invite customers to share their experience</p>
//           </div>
//           {loading ? (
//             <p>Loading dashboard...</p>
//           ) : error ? (
//             <p className="text-danger">{error}</p>
//           ) : (
//             <ReviewsDashboard
//               totalReviews={totalReviews}
//               averageRating={averageRating}
//               positiveReviews={positiveReviews}
//               negativeReviews={negativeReviews}
//               reviewsData={reviews}
//               renderStars={renderStars}
//             />
//           )}
//         </div>
//       );
//     }

//     if (activeSection === "reviews") {
//       return (
//         <div>
//           <div className="text-center mb-5">
//             <h1>Wedding Reviews</h1>
//             <p>Real experiences from real couples</p>
//           </div>
//           {loading ? (
//             <p>Loading reviews...</p>
//           ) : error ? (
//             <p className="text-danger">{error}</p>
//           ) : (
//             <Reviews reviews={reviews} />
//           )}
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-5">
//         <h2>{activeSection} Section</h2>
//         <p>Content coming soon...</p>
//       </div>
//     );
//   };

//   return (
//     <div className="">
//       <div className="row">
//         {/* Sidebar */}
//         <div className={`col-md-3 ${sidebarCollapsed ? "d-none" : ""}`}>
//           <ReviewsSidebar
//             isCollapsed={sidebarCollapsed}
//             onToggle={() => setSidebarCollapsed((prev) => !prev)}
//             activeSection={activeSection}
//             onSectionChange={setActiveSection}
//           />
//         </div>

//         {/* Main content area */}
//         <div className={`col-md-${sidebarCollapsed ? 12 : 8}`}>
//           <div className="py-4">{renderContent()}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsPage;

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import ReviewsCollector from "./subVendors/ReviewsCollector";
// import Reviews from "./subVendors/Reviews";
// import ReviewsSidebar from "./subVendors/ReviewsSidebar";
// import ReviewsDashboard from "./subVendors/ReviewsDashboard";

// const API_BASE_URL = "https://happywedz.com/api";

// const ReviewsPage = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [activeSection, setActiveSection] = useState("reviews");
//   const { token: vendorToken } = useSelector((state) => state.vendorAuth);

//   const [reviews, setReviews] = useState([]);
//   const [stats, setStats] = useState({
//     averageRating: 0,
//     reviewCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAll = async () => {
//     setLoading(true);
//     setError(null);
//     await Promise.all([fetchReviews(), fetchStats()]);
//     setLoading(false);
//   };

//   const fetchReviews = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
//         headers: { Authorization: `Bearer ${vendorToken}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch reviews");
//       const data = await res.json();
//       const formattedReviews = data.reviews.map((r) => ({
//         id: r.id,
//         name: r.user?.name || "Anonymous",
//         rating: r.rating,
//         review: r.comment,
//         date: new Date(r.createdAt).toLocaleDateString(),
//         verified: true, // You can adjust this based on your API
//         reply: r.vendor_reply, // Assuming the API returns a 'vendor_reply' field
//       }));
//       setReviews(formattedReviews);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/reviews/my-average-rating`, {
//         headers: { Authorization: `Bearer ${vendorToken}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch stats");
//       const data = await res.json();

//       setStats({
//         averageRating: parseFloat(data.averageRating) || 0,
//         reviewCount: parseInt(data.totalReviews) || 0, // ✅ corrected key
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     if (!vendorToken) {
//       setError("Vendor not authenticated.");
//       setLoading(false);
//       return;
//     }

//     fetchAll();
//   }, [vendorToken]);

//   const handleReplySubmit = async (reviewId, replyText) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/reviews/reply/${reviewId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${vendorToken}`,
//         },
//         body: JSON.stringify({ vendor_reply: replyText }),
//       });
//       if (!res.ok) throw new Error("Failed to submit reply");
//       await fetchAll(); // Refetch data to show the new reply
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const totalReviews = stats.reviewCount;
//   const averageRating = stats.averageRating;
//   const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
//   const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <span key={i}>{i < rating ? "⭐" : "☆"}</span>
//     ));
//   };

//   const refetchData = () => {
//     fetchAll();
//   };

//   const handleSubmitReview = (newReview) => {
//     setReviews((prev) => [newReview, ...prev]);
//   };

//   const renderContent = () => {
//     if (activeSection === "review-collector") {
//       return (
//         <div>
//           <div className="text-center mb-5">
//             <h1>Collect a Review</h1>
//             <p>Invite customers to share their experience</p>
//           </div>
//           {loading ? (
//             <p>Loading dashboard...</p>
//           ) : error ? (
//             <p className="text-danger">{error}</p>
//           ) : (
//             <ReviewsDashboard
//               totalReviews={totalReviews}
//               averageRating={averageRating}
//               positiveReviews={positiveReviews}
//               negativeReviews={negativeReviews}
//               reviewsData={reviews}
//               renderStars={renderStars}
//             />
//           )}
//         </div>
//       );
//     }

//     if (activeSection === "reviews") {
//       return (
//         <div>
//           <div className="text-center mb-5">
//             <h1>Wedding Reviews</h1>
//             <p>Real experiences from real couples</p>
//           </div>
//           {loading ? (
//             <p>Loading reviews...</p>
//           ) : error ? (
//             <p className="text-danger">{error}</p>
//           ) : (
//             <Reviews reviews={reviews} onReplySubmit={handleReplySubmit} />
//           )}
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-5">
//         <h2>{activeSection} Section</h2>
//         <p>Content coming soon...</p>
//       </div>
//     );
//   };

//   return (
//     <div className="">
//       <div className="row">
//         {/* Sidebar */}
//         <div className={`col-md-3 ${sidebarCollapsed ? "d-none" : ""}`}>
//           <ReviewsSidebar
//             isCollapsed={sidebarCollapsed}
//             onToggle={() => setSidebarCollapsed((prev) => !prev)}
//             activeSection={activeSection}
//             onSectionChange={setActiveSection}
//           />
//         </div>

//         {/* Main content area */}
//         <div className={`col-md-${sidebarCollapsed ? 12 : 8}`}>
//           <div className="py-4">{renderContent()}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewsPage;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReviewsSidebar from "./subVendors/ReviewsSidebar";
import ReviewsDashboard from "./subVendors/ReviewsDashboard";
import Reviews from "./subVendors/Reviews";

const API_BASE_URL = "https://happywedz.com/api";

const ReviewsPage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("reviews");
  const { vendor, token: vendorToken } = useSelector((state) => state.vendorAuth);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchReviews(), fetchStats()]);
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/my-reviews`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();

      const formattedReviews = data.reviews.map((r) => ({
        id: r.id,
        name: r.user?.name || "Anonymous",
        rating: Number(
          (
            (r.rating_quality +
              r.rating_responsiveness +
              r.rating_professionalism +
              r.rating_value +
              r.rating_flexibility) /
            5
          ).toFixed(1)
        ),
        review: r.comment,
        date: new Date(r.createdAt).toLocaleDateString(),
        verified: true,
        reply: r.vendor_reply,
      }));

      setReviews(formattedReviews);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/my-average-rating`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();

      setStats({
        averageRating: parseFloat(data.averageRating) || 0,
        reviewCount: parseInt(data.totalReviews) || 0,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!vendorToken) {
      setError("Vendor not authenticated.");
      setLoading(false);
      return;
    }
    fetchAll();
  }, [vendorToken]);

  const handleReplySubmit = async (reviewId, replyText) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/reply/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({ vendor_reply: replyText }),
      });
      if (!res.ok) throw new Error("Failed to submit reply");

      setReviews((prev) =>
        prev.map((rev) =>
          rev.id === reviewId ? { ...rev, reply: replyText } : rev
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const totalReviews = stats.reviewCount;
  const averageRating = stats.averageRating;
  const positiveReviews = reviews.filter((r) => r.rating >= 4).length;
  const negativeReviews = reviews.filter((r) => r.rating <= 2).length;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? "⭐" : "☆"}</span>
    ));

  const renderContent = () => {
    if (activeSection === "review-collector") {
      return (
        <div>
          <div className="text-center mb-5">
            <h1>Collect a Review</h1>
            <p>Invite customers to share their experience</p>
          </div>
          {loading ? (
            <p>Loading dashboard...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <ReviewsDashboard
              vendorId={vendor?.id}
              totalReviews={totalReviews}
              averageRating={averageRating}
              positiveReviews={positiveReviews}
              negativeReviews={negativeReviews}
              reviewsData={reviews}
              renderStars={renderStars}
            />
          )}
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
          {loading ? (
            <p>Loading reviews...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <Reviews
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
              onReplySubmit={handleReplySubmit}
            />
          )}
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
          {loading ? (
            <p>Loading reviews...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <Reviews
              reviews={reviews}
              averageRating={averageRating}
              totalReviews={totalReviews}
              onReplySubmit={handleReplySubmit}
            />
          )}
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
    <div className="">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 ${sidebarCollapsed ? "d-none" : ""}`}>
          <ReviewsSidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content */}
        <div className={`col-md-${sidebarCollapsed ? 12 : 8}`}>
          <div className="py-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
