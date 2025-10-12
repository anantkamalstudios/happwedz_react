import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

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
        const response = await axios.get(
          "https://happywedz.com/api/realwedding"
        );
        if (response.data && Array.isArray(response.data)) {
          setWeddings(response.data);
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

  console.log(weddings);

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentWeddings = filteredWeddings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredWeddings.length / itemsPerPage);

  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";
    }
    return `https://happywedzbackend.happywedz.com${path}`;
  };

  const WeddingCard = ({ wedding }) => (
    <div
      className="col-lg-4 col-md-6"
      onClick={() => onPostClick && onPostClick(wedding)}
    >
      <div className="wedding-card h-100 shadow-sm rounded-3 overflow-hidden">
        <div className="position-relative">
          <img
            src={getImageUrl(wedding.coverPhoto)}
            alt={wedding.title}
            className="img-fluid"
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
          <div
            className="position-absolute bottom-0 end-0 text-white p-5 "
            style={{ background: "rgba(195, 17, 98, 0.7)" }}
          >
            {wedding.highlightPhotos?.length || "30"} Photos
          </div>
        </div>
        <div className="p-2">
          <div className="d-flex align-items-center text-center justify-content-center">
            <h2 className="fw-bold mb-0">{wedding.brideName}</h2>
            <h2 className="fw-bold mb-0 mx-2">And</h2>
            <h2 className="fw-bold mb-0">{wedding.groomName}</h2>
          </div>
          <h2 className="mt-3 d-flex align-items-center primary-text justify-content-center">
            <FaMapMarkerAlt className="me-1" />
            {wedding.city}
          </h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="real-weddings">
      {/* Hero Section */}
      <section
        className="hero-section text-center text-white d-flex align-items-center"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1682092632793-c7d75b23718e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "350px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(253, 7, 130, 0.4)",
          }}
        />
        <div className="container position-relative">
          <h1 className="fw-bold">Real Weddings, Real Love</h1>
          <p className="lead mb-4">
            Because every love story deserves to be shared.
          </p>
          {/* <div className="d-flex justify-content-center">
            <div className="input-group" style={{ maxWidth: "500px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by names and location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="btn btn-primary">
                <FaSearch />
              </button>
            </div>
          </div> */}
        </div>
      </section>

      <section className="d-flex justify-content-end align-items-center p-4 w-100">
        <div className="w-50">
          <div className="d-flex w-100">
            <input
              type="text"
              className="form-control"
              placeholder="Search by names and location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                flex: "0 0 60%",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <button
              className="btn btn-primary"
              style={{
                flex: "0 0 25%",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px",
              }}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section py-5">
        <div className="container">
          {/* Results Count */}
          <p className="mb-4">
            Showing {filteredWeddings.length} results in All Cities
          </p>
          <div className="row">
            {loading ? (
              <div className="text-center py-5">
                <p className="text-muted fs-4">Loading weddings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5 text-danger">
                <p className="fs-4">{error}</p>
              </div>
            ) : currentWeddings.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted fs-4">No weddings found.</p>
              </div>
            ) : (
              currentWeddings.map((w) => <WeddingCard key={w.id} wedding={w} />)
            )}
          </div>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination flex-wrap" style={{ gap: "8px" }}>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    style={{
                      color: "black",
                      borderRadius: "6px",
                      minWidth: "40px",
                      minHeight: "40px",
                    }}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page <= 2 ||
                      page > totalPages - 2 ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <li className="page-item disabled">
                            <span
                              className="page-link"
                              style={{ color: "black", border: "none" }}
                            >
                              …
                            </span>
                          </li>
                        )}
                        <li
                          className={`page-item ${
                            currentPage === page ? "active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            style={{
                              color: "black",
                              borderRadius: "6px",
                              minWidth: "40px",
                              minHeight: "40px",
                            }}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      </React.Fragment>
                    );
                  })}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    style={{
                      color: "black",
                      borderRadius: "6px",
                      minWidth: "40px",
                      minHeight: "40px",
                    }}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
};

export default RealWeddings;
