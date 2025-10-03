// import React, { useState } from "react";
// import { Row, Col, Card, Container } from "react-bootstrap";
// import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const GridView = ({ subVenuesData, handleShow }) => {
//   const [favorites, setFavorites] = useState({});

//   const toggleFavorite = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setFavorites((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   console.log(subVenuesData);

//   return (
//     <Container>
//       <Row>
//         {subVenuesData && subVenuesData.length > 0 ? (
//           subVenuesData.map((venue) => (
//             <Col key={venue.id} xs={12} sm={6} lg={4} className="mb-4">
//               <Card className="border-0 main-grid-cards rounded-4 overflow-hidden p-2 h-100">
//                 {/* Image Section */}
//                 <div className="position-relative" style={{ height: "240px" }}>
//                   <Card.Img
//                     variant="top"
//                     src={
//                       venue.image ||
//                       "https://images.unsplash.com/photo-1519167758481-83f29da8c8d0?w=800&h=600&fit=crop"
//                     }
//                     alt={venue.name || "Venue"}
//                     style={{
//                       objectFit: "cover",
//                       height: "100%",
//                       width: "100%",
//                       borderRadius: "15px",
//                     }}
//                   />
//                   <button
//                     className="btn btn-light position-absolute rounded-circle border-0 shadow-sm"
//                     style={{
//                       top: "12px",
//                       right: "12px",
//                       width: "36px",
//                       height: "36px",
//                       padding: "0",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                     onClick={(e) => toggleFavorite(venue.id, e)}
//                   >
//                     {favorites[venue.id] ? (
//                       <FaHeart className="text-danger" size={18} />
//                     ) : (
//                       <FaRegHeart className="text-secondary" size={18} />
//                     )}
//                   </button>
//                 </div>

//                 {/* Card Body */}
//                 <Card.Body className="p-3">
//                   <Link
//                     to={`/details/info/${venue.id}`}
//                     className="text-decoration-none"
//                   >
//                     {/* Title and Rating Row */}
//                     <div className="d-flex justify-content-between align-items-start mb-2">
//                       <Card.Title className="mb-0 fw-bold text-dark fs-20">
//                         {venue.name || "Venue Name"}
//                       </Card.Title>
//                       <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
//                         <FaStar size={14} className="text-warning" />
//                         <span
//                           className="fw-semibold text-dark"
//                           style={{ fontSize: "13px" }}
//                         >
//                           {venue.rating || "0.0"}
//                         </span>
//                         <span
//                           className="text-muted"
//                           style={{ fontSize: "12px" }}
//                         >
//                           ({venue.reviews || "0"} Review
//                           {venue.reviews !== "1" && "s"})
//                         </span>
//                       </div>
//                     </div>

//                     {/* subtitle */}
//                     <div
//                       className="text-muted mb-3"
//                       style={{ fontSize: "13px" }}
//                     >
//                       {venue.subtitle || "NA"}
//                     </div>

//                     {/* Location */}
//                     <div
//                       className="text-muted mb-3"
//                       style={{ fontSize: "13px" }}
//                     >
//                       {venue.location || "Location not available"}
//                     </div>

//                     {/* Veg/Non-Veg Pills */}
//                     <div className="d-flex gap-2 mb-3">
//                       <span
//                         className="badge px-3 py-2"
//                         style={{
//                           backgroundColor: "#fff",
//                           color: "#666",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           border: "1px solid #e0e0e0",
//                         }}
//                       >
//                         Veg
//                       </span>
//                       <span
//                         className="badge px-3 py-2"
//                         style={{
//                           backgroundColor: "#fff",
//                           color: "#666",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           border: "1px solid #e0e0e0",
//                         }}
//                       >
//                         Non Veg
//                       </span>
//                     </div>

//                     {/* Price Row */}
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <div>
//                         <span
//                           className="fw-bold text-dark"
//                           style={{ fontSize: "16px" }}
//                         >
//                           ₹ {venue.vegPrice || venue.price || "0"}
//                         </span>
//                         <span
//                           className="text-muted ms-1"
//                           style={{ fontSize: "12px" }}
//                         >
//                           per plate
//                         </span>
//                       </div>
//                       <div>
//                         <span
//                           className="fw-bold text-dark"
//                           style={{ fontSize: "16px" }}
//                         >
//                           ₹ {venue.nonVegPrice || venue.price || "0"}
//                         </span>
//                         <span
//                           className="text-muted ms-1"
//                           style={{ fontSize: "12px" }}
//                         >
//                           per plate
//                         </span>
//                       </div>
//                     </div>

//                     {/* Bottom Info Pills */}
//                     <div className="d-flex gap-2 flex-wrap">
//                       <span
//                         className="badge px-3 py-2"
//                         style={{
//                           backgroundColor: "#ffe5f0",
//                           color: "#c2185b",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           border: "none",
//                         }}
//                       >
//                         {venue.capacity || "N/A"}
//                       </span>
//                       <span
//                         className="badge px-3 py-2"
//                         style={{
//                           backgroundColor: "#ffe5f0",
//                           color: "#c2185b",
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           border: "none",
//                         }}
//                       >
//                         {venue.rooms || "0"} Rooms
//                       </span>
//                       {venue.more && (
//                         <span
//                           className="badge px-3 py-2"
//                           style={{
//                             backgroundColor: "#ffe5f0",
//                             color: "#c2185b",
//                             fontSize: "12px",
//                             fontWeight: "500",
//                             border: "none",
//                           }}
//                         >
//                           + {venue.more} more
//                         </span>
//                       )}
//                     </div>
//                   </Link>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col xs={12} className="text-center py-5">
//             <p className="text-muted">No venues available</p>
//           </Col>
//         )}
//       </Row>
//     </Container>
//   );
// };

// export default GridView;

import { Link } from "react-router-dom";
import { useState } from "react";
const GridView = ({ subVenuesData, handleShow }) => {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("Data is", subVenuesData);

  return (
    <div>
      {subVenuesData && subVenuesData.length > 0 ? (
        subVenuesData.map((venue) => (
          <Link
            to={`/details/info/${venue.id}`}
            className="text-decoration-none"
          >
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden p-2"
              style={{ maxWidth: "400px" }}
              key={venue.id}
            >
              <div style={{ position: "relative" }}>
                {/* Top buttons */}
                <div
                  className="w-100 d-flex justify-content-between align-items-center"
                  style={{
                    position: "absolute",
                    padding: "10px",
                  }}
                >
                  <span role="button">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADQElEQVR4nO2YW4hOURTHf+M6mcKMSxj3QWoKo5QHGWLcy2VcXqZoXijlYZBymZgXIo9ueSIp8sALDyiXEnI3xGhoSG4zJiMxYj7tWqdWu32+b853znzzjc6/9ss+/70uZ6+99toLYsSIESNGjBjZjYHAHqAOaANagVvAqhTregKVwA3gJ9AATPDhrhSZrUp+eRTGzwA+AgmfUe2zbgxw38Hf7OAeTCL/QFgH3iYRbsYfoMhaMwR44+A+BUZb3OUp5JuxLIwDj0TIB2AFkAsUADeVgo3WmvPq2y9glzjlwnXFNesGAYOBC2r+WhgHjMAKEapxTCmoUvPTHH8wWUx/V7xhar5QzbcQESYCNcAZCR1PwRzF2ZciHOyYTqhBgG9p4bXDoCdAjuLcDRjTiUw68NLnEC9QnPcBYzqRSQdGAVuAw1Zqva04rQFjOtHRDpi0t0mMt/O8J9xcUh5a1PxIS443/y0EPzDqRMhXYAMwQtJolVJgUqyHK2r+MjAOGO+YT5cfycG1hwkpDwvbwZ8fgh8YJUB9EuHPgAHWmmofbptcaoTkB0aehI+5fb9ITD4Adso3F8qAS8BnGReBuUl0lAXk/9/IkdxuwidbMFVs0pemE2uAxyoOTS2/Fsgn88gH1lmFoykuV7vI/YFzPofJlNRH5DLKFApFp185fxbo55ELJJtoQqMUXsV0PorFlkbLxlr58Ry16vftUvdnG3KBHWKjZ+8h5Jb1JkrJfsxW9jbZDujKMgyKpPAzpUHUWKTsbUZKAR1C24A+EZXeTZICo0AesBv4rew9iRyEWuuAfJLX1aQ0lb2wtjmME5OB/VIFaBvfAUM9Ul9JTa6U9Qo4Lm9jExrd2qG0RAwP6kSO6KiQ5OJXh5lmwHCXAPPwfpiiOvwB3JPtq5GuxFJgurybx0pqLrVSn58TvWW371iPfNeol2ZZ91R/wZS5p+SQJCIcTY4+UmWKNcap08ASoAcB0QuYB+yVh4XOWOkO3YYxmAX8Vd8b5A1tDuxMaVFGCvMHFwPrJYROAFclrJ7LNjdK2d2eHfBu29JOqrl8McU6A83S+OoSKEkzC2UN6rqy8boZ0CWNR1ojW6V/FCNGDDoO/wC6BtvvL7Su+gAAAABJRU5ErkJggg=="
                      alt="360-view"
                      style={{ width: "25px" }}
                    />
                  </span>
                  <span
                    role="button"
                    onClick={(e) => toggleFavorite(venue.id, e)}
                  >
                    {favorites[venue.id] ? (
                      <i
                        className="fa-solid fa-heart"
                        style={{ color: "#e10505" }}
                      ></i>
                    ) : (
                      <i
                        className="fa-regular fa-heart"
                        style={{ color: "#00040a" }}
                      ></i>
                    )}
                  </span>
                </div>
                {/* Main image */}
                <img
                  src={venue.image}
                  className="card-img-top w-100"
                  alt={venue.name}
                  style={{
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                    e.currentTarget.style.objectFit = "contain";
                    e.currentTarget.style.padding = "12px";
                    e.currentTarget.style.background = "#fafafa";
                  }}
                />
              </div>
              {/* Body */}
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">
                    {venue.name || "Venue Name"}
                  </h5>
                  <p className="rating text-warning small mb-0 mt-1">
                    {venue.rating || "0.0"}
                    <span className="text-muted">
                      {" "}
                      ({venue.reviews || "0"} Review{" "}
                      {venue.reviews !== "1" || "s"})
                    </span>
                  </p>
                </div>
                <p
                  className="mb-3"
                  style={{
                    color: "black",
                    fontSize: "12px",
                  }}
                >
                  {venue.location}
                </p>
                {/* Prices */}
                <div className="d-flex gap-4 mb-3">
                  {venue.vegPrice && (
                    <div>
                      <small
                        className="text-muted"
                        style={{ fontSize: "10px" }}
                      >
                        Veg
                      </small>
                      <div className="price">
                        ₹ {safeData.vegPrice}{" "}
                        <small className="text-muted">per plate</small>
                      </div>
                    </div>
                  )}
                  {venue.nonVegPrice && (
                    <div>
                      <small
                        className="text-muted"
                        style={{ fontSize: "10px" }}
                      >
                        Non Veg
                      </small>
                      <div className="price">
                        ₹ {safeData.nonVegPrice}{" "}
                        <small className="text-muted">per plate</small>
                      </div>
                    </div>
                  )}
                </div>
                {/* Tags */}
                <div className="d-flex justify-content-between gap-2">
                  <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <p
                      style={{
                        backgroundColor: "#fdc2daff",
                        fontSize: "12px",
                        padding: "0.25rem 1.25rem",
                        color: "#C31162",
                      }}
                    >
                      {venue.rooms || "0"}
                    </p>
                    <p
                      style={{
                        backgroundColor: "#fdc2daff",
                        fontSize: "12px",
                        padding: "0.25rem 1.25rem",
                        color: "#C31162",
                      }}
                    >
                      {venue.capacity || "N/A"}
                    </p>
                    <p>
                      <span
                        style={{
                          color: "#C31162",
                          fontSize: "12px",
                          borderOffSet: "1px",
                        }}
                      >
                        + {venue.more || "0"} more
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>No venues available</div>
      )}
    </div>
  );
};
export default GridView;
