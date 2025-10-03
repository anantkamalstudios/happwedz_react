// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import logo from "../../../../public/happywed_white.png";
// import einviteImage from "../../../../public/images/home/einvite.png";
// import image from "../../../../public/images/home/try.png";

// import {
//   FaHeart,
//   FaEye,
//   FaCalendarAlt,
//   FaShare,
//   FaSearch,
//   FaBars,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import CtaPanel from "../../home/CtaPanel";

// const RealWeddings = ({ onPostClick }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [weddings, setWeddings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [visibleCount, setVisibleCount] = useState(3);

//   useEffect(() => {
//     const fetchWeddings = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           "https://happywedz.com/api/realwedding"
//         );
//         if (response.data && Array.isArray(response.data)) {
//           setWeddings(response.data);
//         } else {
//           setWeddings([]);
//         }
//         setError(null);
//       } catch (err) {
//         setError("Failed to fetch wedding stories. Please try again later.");
//         console.error("Error fetching weddings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWeddings();
//   }, []);

//   const filteredWeddings = weddings.filter(
//     (wedding) =>
//       wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       wedding.city.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleLoadMore = () => {
//     setVisibleCount((prevCount) => prevCount + 3);
//   };

//   const getImageUrl = (path) => {
//     if (!path) {
//       return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";
//     }
//     return `https://happywedzbackend.happywedz.com${path}`;
//   };

//   const WeddingCard = ({ wedding }) => (
//     <div
//       className="col-lg-4 col-md-6 mb-5"
//       onClick={() => onPostClick(wedding)}
//     >
//       <div className="wedding-card h-100">
//         <div className="position-relative overflow-hidden rounded-3 mb-3 main-image-container">
//           <img
//             src={getImageUrl(wedding.coverPhoto)}
//             alt={wedding.title}
//             className="main-image"
//             style={{ objectFit: "cover", width: "100%" }}
//           />
//           <div className="wedding-overlay">
//             <div className="overlay-content">
//               <div className="d-flex justify-content-center gap-3">
//                 <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
//                   <FaHeart />
//                 </button>
//                 <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
//                   <FaEye />
//                 </button>
//                 <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
//                   <FaShare />
//                 </button>
//               </div>
//             </div>
//           </div>
//           {/* <div className="position-absolute top-0 start-0 p-3">
//             <span className="badge bg-white text-dark px-3 py-2 category-badge">
//               {wedding.category}
//             </span>
//           </div> */}
//         </div>

//         <div className="row g-2 mb-3">
//           {wedding.highlightPhotos?.slice(0, 2).map((img, index) => (
//             <div key={index} className="col-6">
//               <div className="position-relative overflow-hidden rounded-2 small-image-container">
//                 <img
//                   src={getImageUrl(img)}
//                   alt={`${wedding.title} ${index + 2}`}
//                   className="img-fluid small-image"
//                   style={{
//                     aspectRatio: "16/10",
//                     objectFit: "cover",
//                     width: "100%",
//                   }}
//                 />
//                 <div className="small-overlay">
//                   <FaEye className="text-white" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="wedding-info">
//           <h5 className="wedding-title mb-2">{wedding.title}</h5>
//           <div className="d-flex justify-content-between align-items-center text-muted small">
//             <span className="d-flex align-items-center">
//               <FaMapMarkerAlt className="me-1" size={12} />
//               {wedding.city}
//             </span>
//             <span className="d-flex align-items-center">
//               <FaCalendarAlt className="me-1" size={12} />
//               {new Date(wedding.weddingDate).toLocaleDateString()}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="wedding-gallery">
//       {/* Filter Bar */}
//       <section className="filter-section py-4 bg-light">
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-md-6">
//               <div className="position-relative">
//                 <input
//                   type="text"
//                   className="form-control form-control-lg hero-search"
//                   placeholder="Search by couple names or location..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
//               </div>
//             </div>
//             <div className="col-md-6 text-md-end">
//               <span className="text-muted">
//                 Showing {filteredWeddings.length} weddings
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Wedding Gallery */}
//       <section className="gallery-section py-5">
//         <div className="container">
//           <div className="row">
//             {loading ? (
//               <div className="text-center py-5">
//                 <p className="text-muted fs-4">Loading weddings...</p>
//               </div>
//             ) : (
//               filteredWeddings
//                 .slice(0, visibleCount)
//                 .map((wedding) => (
//                   <WeddingCard key={wedding.id} wedding={wedding} />
//                 ))
//             )}
//           </div>

//           {!loading && error && (
//             <div className="text-center py-5 text-danger">
//               <p className="fs-4">{error}</p>
//             </div>
//           )}

//           {!loading && !error && filteredWeddings.length === 0 && (
//             <div className="text-center py-5">
//               <p className="text-muted fs-4">
//                 No weddings found matching your search.
//               </p>
//             </div>
//           )}

//           {/* Load More Button */}
//           {!loading && filteredWeddings.length > visibleCount && (
//             <div className="text-center mt-5">
//               <button
//                 className="btn btn btn-primary btn-lg px-5 load-more-btn"
//                 onClick={handleLoadMore}
//               >
//                 Load More Weddings
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default RealWeddings;

import React, { useState, useEffect } from "react";
import {
  FaHeart,
  FaEye,
  FaCalendarAlt,
  FaShare,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";

const RealWeddings = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://happywedz.com/api/realwedding");
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setWeddings(data);
        } else {
          setWeddings([]);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch wedding stories. Please try again later.");
        console.error("Error fetching weddings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWeddings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWeddings = filteredWeddings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";
    }
    return `https://happywedzbackend.happywedz.com${path}`;
  };

  const WeddingCard = ({ wedding }) => (
    <div
      className="wedding-card-wrapper"
      onClick={() => onPostClick && onPostClick(wedding)}
    >
      <div className="wedding-card-image">
        <img src={getImageUrl(wedding.coverPhoto)} alt={wedding.title} />
        <div className="photo-count">30 Photos</div>
      </div>
      <div className="wedding-card-info">
        <h3>{wedding.title}</h3>
        <p className="wedding-location">
          <FaMapMarkerAlt /> {wedding.city}
        </p>
      </div>
    </div>
  );

  return (
    <div className="real-weddings-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .real-weddings-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #fff;
        }

        .hero-section {
          position: relative;
          height: 400px;
          background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=600&fit=crop');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .hero-content {
          text-align: center;
          z-index: 2;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 12px;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        }

        .hero-content p {
          font-size: 18px;
          margin-bottom: 30px;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
        }

        .search-container {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 50px;
          padding: 8px 12px 8px 24px;
          width: 600px;
          max-width: 90%;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .search-container input {
          flex: 1;
          border: none;
          outline: none;
          padding: 8px;
          font-size: 14px;
          color: #333;
        }

        .search-container input::placeholder {
          color: #999;
        }

        .search-btn {
          background: #e91e63;
          color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.3s;
        }

        .search-btn:hover {
          background: #c2185b;
        }

        .results-header {
          padding: 30px 0;
          text-align: center;
          background: #f8f8f8;
        }

        .results-header h2 {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }

        .weddings-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        @media (max-width: 992px) {
          .weddings-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .weddings-grid {
            grid-template-columns: 1fr;
          }
          .hero-content h1 {
            font-size: 32px;
          }
        }

        .wedding-card-wrapper {
          cursor: pointer;
          transition: transform 0.3s;
        }

        .wedding-card-wrapper:hover {
          transform: translateY(-5px);
        }

        .wedding-card-image {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          height: 320px;
          margin-bottom: 15px;
        }

        .wedding-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .wedding-card-wrapper:hover .wedding-card-image img {
          transform: scale(1.05);
        }

        .photo-count {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .wedding-card-info {
          text-align: center;
        }

        .wedding-card-info h3 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .wedding-location {
          font-size: 14px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 40px 0 60px;
        }

        .page-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #ddd;
          background: white;
          color: #666;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .page-btn:hover {
          border-color: #e91e63;
          color: #e91e63;
        }

        .page-btn.active {
          background: #e91e63;
          color: white;
          border-color: #e91e63;
        }

        .page-dots {
          color: #666;
          font-weight: 600;
          padding: 0 8px;
        }

        .loading-state, .error-state, .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #666;
          font-size: 18px;
        }

        .error-state {
          color: #e91e63;
        }
      `}</style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Real Weddings, Real Love</h1>
          <p>Because every love story deserves to be shared.</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by event and location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="search-btn">
              <FaSearch /> Find Weddings
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-header">
        <h2>Showing {filteredWeddings.length} results in All Cities</h2>
      </div>

      {/* Wedding Grid */}
      {loading ? (
        <div className="loading-state">Loading weddings...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : filteredWeddings.length === 0 ? (
        <div className="empty-state">
          No weddings found matching your search.
        </div>
      ) : (
        <>
          <div className="weddings-grid">
            {currentWeddings.map((wedding) => (
              <WeddingCard key={wedding.id} wedding={wedding} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                1
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(2)}
                disabled={currentPage === 2 || totalPages < 2}
              >
                2
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(3)}
                disabled={currentPage === 3 || totalPages < 3}
              >
                3
              </button>
              <button
                className="page-btn"
                onClick={() => setCurrentPage(4)}
                disabled={currentPage === 4 || totalPages < 4}
              >
                4
              </button>
              {totalPages > 5 && <span className="page-dots">...</span>}
              {totalPages > 4 && (
                <>
                  <button
                    className="page-btn"
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    {totalPages > 5 ? totalPages - 2 : 5}
                  </button>
                  <button
                    className="page-btn"
                    onClick={() =>
                      setCurrentPage(Math.min(currentPage + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    {totalPages > 5 ? totalPages - 1 : 6}
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RealWeddings;
