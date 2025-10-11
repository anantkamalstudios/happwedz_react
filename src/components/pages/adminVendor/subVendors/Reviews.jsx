// import React, { useState } from "react";

// const ReplyForm = ({ reviewId, onReplySubmit }) => {
//   const [replyText, setReplyText] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (replyText.trim()) {
//       onReplySubmit(reviewId, replyText);
//       setReplyText("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="reviews__reply-form">
//       <textarea
//         value={replyText}
//         onChange={(e) => setReplyText(e.target.value)}
//         placeholder="Write your reply..."
//         className="form-control"
//         rows="3"
//       ></textarea>
//       <button type="submit" className="btn btn-primary mt-2">
//         Submit Reply
//       </button>
//     </form>
//   );
// };

// const Reviews = ({ reviews, onReplySubmit }) => {
//   const [sortBy, setSortBy] = useState("newest");
//   const [filterRating, setFilterRating] = useState("all");
//   const [replyingTo, setReplyingTo] = useState(null);

//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <span
//         key={index}
//         className={`reviews__star ${index < rating ? "filled" : ""}`}
//       >
//         ★
//       </span>
//     ));
//   };

//   const getAverageRating = () => {
//     if (reviews.length === 0) return 0;
//     const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
//     return (sum / reviews.length).toFixed(1);
//   };

//   const getRatingDistribution = () => {
//     const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     reviews.forEach((review) => {
//       distribution[review.rating]++;
//     });
//     return distribution;
//   };

//   const filteredAndSortedReviews = reviews
//     .filter(
//       (review) =>
//         filterRating === "all" || review.rating === parseInt(filterRating)
//     )
//     .sort((a, b) => {
//       if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
//       if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
//       if (sortBy === "highest") return b.rating - a.rating;
//       if (sortBy === "lowest") return a.rating - b.rating;
//       return 0;
//     });

//   const distribution = getRatingDistribution();

//   return (
//     <div className="reviews">
//       <div className="reviews__header">
//         <div className="row align-items-center">
//           <div className="col-md-6">
//             <h3 className="reviews__title">
//               Customer Reviews ({reviews.length})
//             </h3>
//             <div className="reviews__summary">
//               <div className="reviews__average">
//                 <span className="reviews__average-score">
//                   {getAverageRating()}
//                 </span>
//                 <div className="reviews__average-stars">
//                   {renderStars(Math.round(getAverageRating()))}
//                 </div>
//                 <span className="reviews__average-text">Average Rating</span>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-6">
//             <div className="reviews__rating-breakdown">
//               {[5, 4, 3, 2, 1].map((rating) => (
//                 <div key={rating} className="reviews__rating-row">
//                   <span className="reviews__rating-label">{rating}★</span>
//                   <div className="reviews__rating-bar">
//                     <div
//                       className="reviews__rating-fill"
//                       style={{
//                         width: `${
//                           reviews.length
//                             ? (distribution[rating] / reviews.length) * 100
//                             : 0
//                         }%`,
//                       }}
//                     ></div>
//                   </div>
//                   <span className="reviews__rating-count">
//                     ({distribution[rating]})
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="reviews__filters">
//         <div className="row">
//           <div className="col-md-6">
//             <select
//               value={filterRating}
//               onChange={(e) => setFilterRating(e.target.value)}
//               className="reviews__filter-select form-control"
//             >
//               <option value="all">All Ratings</option>
//               <option value="5">5 Stars</option>
//               <option value="4">4 Stars</option>
//               <option value="3">3 Stars</option>
//               <option value="2">2 Stars</option>
//               <option value="1">1 Star</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="reviews__list">
//         {filteredAndSortedReviews.length > 0 ? (
//           filteredAndSortedReviews.map((review) => (
//             <div key={review.id} className="reviews__item">
//               <div className="reviews__item-header">
//                 <div className="reviews__user-info">
//                   <div className="reviews__avatar">
//                     {review.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="reviews__user-details">
//                     <h5 className="reviews__user-name">
//                       {review.name}
//                       {review.verified && (
//                         <span className="reviews__verified">✓ Verified</span>
//                       )}
//                     </h5>
//                     <div className="reviews__meta">
//                       <span className="reviews__date">{review.date}</span>
//                       {review.serviceType && (
//                         <span className="reviews__service">
//                           {" "}
//                           • {review.serviceType}
//                         </span>
//                       )}
//                       {review.eventDate && (
//                         <span className="reviews__event-date">
//                           {" "}
//                           • Event: {review.eventDate}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="reviews__rating-display">
//                   {renderStars(review.rating)}
//                 </div>
//               </div>

//               {review.title && (
//                 <h6 className="reviews__review-title">{review.title}</h6>
//               )}

//               <p className="reviews__review-text">{review.review}</p>

//               <div className="reviews__reply-section">
//                 {review.reply ? (
//                   <blockquote className="reviews__reply">
//                     <strong>Your Reply:</strong>
//                     <p>{review.reply}</p>
//                   </blockquote>
//                 ) : (
//                   <div>
//                     {replyingTo === review.id ? (
//                       <ReplyForm
//                         reviewId={review.id}
//                         onReplySubmit={(reviewId, replyText) => {
//                           onReplySubmit(reviewId, replyText);
//                           setReplyingTo(null);
//                         }}
//                       />
//                     ) : (
//                       <button
//                         onClick={() => setReplyingTo(review.id)}
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         Reply
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="reviews__empty">
//             <p>No reviews match your current filters.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reviews;

import React, { useState } from "react";

const ReplyForm = ({ reviewId, onReplySubmit }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReplySubmit(reviewId, replyText);
      setReplyText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reviews__reply-form">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write your reply..."
        className="form-control"
        rows="3"
      ></textarea>
      <button type="submit" className="btn btn-primary mt-2">
        Submit Reply
      </button>
    </form>
  );
};

const Reviews = ({ reviews, onReplySubmit, averageRating, totalReviews }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? "⭐" : "☆"}</span>
    ));

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rounded = Math.round(review.rating);
    if (distribution[rounded] !== undefined) distribution[rounded]++;
  });

  return (
    <div className="reviews">
      <div className="reviews__header mb-4">
        <h3>Customer Reviews ({totalReviews})</h3>
        <div className="reviews__average mb-3">
          <span className="reviews__average-score">{averageRating}</span>
          <div className="reviews__average-stars">
            {renderStars(Math.round(averageRating))}
          </div>
          <span className="reviews__average-text">Average Rating</span>
        </div>
      </div>

      <div className="reviews__list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-3 mb-3 border rounded-3 bg-white"
              style={{ fontSize: "0.85rem", lineHeight: "1.4" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{review.name}</strong>{" "}
                  {review.verified && (
                    <span className="text-success">✓ Verified</span>
                  )}
                  <div className="text-muted">{review.date}</div>
                </div>
                <div>{renderStars(Math.round(review.rating))}</div>
              </div>
              {review.review && <p className="mt-2">{review.review}</p>}

              {review.reply ? (
                <blockquote className="border-left ps-3 mt-2">
                  <strong>Your Reply:</strong>
                  <p>{review.reply}</p>
                </blockquote>
              ) : replyingTo === review.id ? (
                <ReplyForm
                  reviewId={review.id}
                  onReplySubmit={(id, text) => {
                    onReplySubmit(id, text);
                    setReplyingTo(null);
                  }}
                />
              ) : (
                <button
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={() => setReplyingTo(review.id)}
                >
                  Reply
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
