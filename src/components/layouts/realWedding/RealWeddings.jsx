import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { BsExclamationTriangle } from "react-icons/bs";

const RealWeddings = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef(null);
  const [city, setCity] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedCulture, setSelectedCulture] = useState("All Cultures");
  const [selectedTheme, setSelectedTheme] = useState("All Themes");
  const themes = [
    "Destination",
    "Grand & Luxurious",
    "Pocket Friendly Stunners",
    "Intimate & Minimalist",
    "Modern & Stylish",
    "International",
    "Others",
  ];
  const cultures = ["Maharastrian", "Sindhi", "Tamil", "Christian"];

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: "India" }
        );
        if (response.data && response.data.data) {
          const sortedCities = response.data.data.sort((a, b) =>
            a.localeCompare(b)
          );
          setCity(sortedCities);
        }
      } catch (error) {
      } finally {
      }
    };
    fetchCities();
  }, []);

  const scrollToFilters = () => {
    if (filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const filteredWeddings = weddings.filter((wedding) => {
    // Only show weddings with status "publish"
    const isPublished = wedding.status === "publish";

    const matchesSearch =
      wedding.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const city =
      selectedCity === "All Cities" ||
      wedding.city.toLowerCase() === selectedCity.toLowerCase();

    const culture =
      selectedCulture === "All Cultures" || wedding.culture === selectedCulture;

    const theme = (() => {
      if (selectedTheme === "All Themes") return true;
      const wt = wedding.themes;
      if (!wt) return false;
      if (Array.isArray(wt)) return wt.includes(selectedTheme);
      try {
        return String(wt).toLowerCase() === String(selectedTheme).toLowerCase();
      } catch (e) {
        return false;
      }
    })();

    return isPublished && matchesSearch && city && culture && theme;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedCulture, selectedTheme]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("All Cities");
    setSelectedCulture("All Cultures");
    setSelectedTheme("All Themes");
    setCurrentPage(1);
  };

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
          backgroundImage: "url('/images/real_wedding_hero.png')",
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
            backgroundColor: "rgba(253, 7, 130, 0.2)",
          }}
        />
        <div className="container position-relative">
          <h1 className="fw-bold">Real Weddings, Real Love</h1>
          <p className="lead mb-4">
            Because every love story deserves to be shared.
          </p>

        </div>
      </section>

      <section
        ref={filterRef}
        className="d-flex justify-content-end align-items-center w-100"
        style={{
          padding: "0 30px",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center w-100"
          style={{
            display: "flex",
            gap: "20px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e5e5",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select w-100"
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                color: "#333",
                fontSize: "15px",
                padding: "12px 16px",
                height: "100%",
                borderRadius: "0px",
              }}
              onClick={scrollToFilters}
            >
              <option value={"All Cities"} key={"All Cities"}>
                All Cities
              </option>
              {city.map((c) => (
                <option value={c} key={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              flex: 1,
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={selectedCulture}
              onChange={(e) => {
                setSelectedCulture(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select w-100"
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                color: "#333",
                fontSize: "15px",
                padding: "12px 16px",
                height: "100%",
                borderRadius: "0px",
              }}
              onClick={scrollToFilters}
            >
              <option value={"All Cultures"} key={"All Cultures"}>
                All Cultures
              </option>
              {cultures.map((cul) => (
                <option value={cul} key={cul}>
                  {cul}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              flex: 1,
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <select
              value={selectedTheme}
              onChange={(e) => {
                setSelectedTheme(e.target.value);
                setCurrentPage(1);
              }}
              className="form-select w-100"
              style={{
                backgroundColor: "#f5f5f5",
                border: "1px solid #e0e0e0",
                color: "#333",
                fontSize: "15px",
                padding: "12px 16px",
                height: "100%",
                borderRadius: "0px",
              }}
              onClick={scrollToFilters}
            >
              <option value={"All Themes"} key={"All Themes"}>
                All Themes
              </option>
              {themes.map((the) => (
                <option value={the} key={the}>
                  {the}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              flex: 2,
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              className="form-control w-100"
              placeholder="Search by names and location..."
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                color: "#666",
                fontSize: "15px",
                padding: "12px 16px",
                height: "100%",
                borderRadius: "0px",
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              onClick={scrollToFilters}
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center m-2">
            <p className="mb-4">
              Showing {filteredWeddings.length} results in All Cities
            </p>
            <div className="d-flex gap-2">
              {(searchTerm !== "" ||
                selectedCity !== "All Cities" ||
                selectedCulture !== "All Cultures" ||
                selectedTheme !== "All Themes") && (
                  <button
                    className="btn btn-outline-secondary px-4"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                )}
            </div>
          </div>
          <div className="row justify-content-center">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div
                  className="spinner-border text-pink mb-3"
                  role="status"
                ></div>
                <p className="text-secondary fs-5">
                  Fetching beautiful weddings...
                </p>
              </div>
            ) : error ? (
              <div className="col-12 d-flex flex-column align-items-center py-5">
                <div
                  className="rounded-circle bg-light shadow-sm d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <BsExclamationTriangle size={40} />
                </div>
                <h5 className="text-danger fw-semibold mb-2">
                  Oops! Something went wrong
                </h5>
                <p className="text-muted">
                  {error || "Unable to load weddings right now."}
                </p>
              </div>
            ) : currentWeddings.length === 0 ? (
              <div className="col-12 d-flex flex-column align-items-center py-5">
                <div
                  className="rounded-circle bg-light shadow-sm d-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="bi bi-heart text-pink fs-1"></i>
                </div>
                <h5 className="text-secondary fw-semibold mb-2">
                  No Weddings Found
                </h5>
                <p className="text-muted mb-3">
                  No items match the selected filters.
                </p>
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
                          className={`page-item ${currentPage === page ? "active" : ""
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
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""
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
