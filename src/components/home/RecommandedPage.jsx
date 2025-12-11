import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { CiStar, CiLocationOn } from "react-icons/ci";

const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";

const RecommandedPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // If no user, we might want to wait or show login prompt
      // But assuming protected route or handling it in UI
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userId = user.id || user.user_id || user._id;
        const response = await axios.get(
          `https://www.happywedz.com/ai/api/recommendations/recommendations/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Assuming token might be needed, though previous code didn't use it for this endpoint but good practice
            },
          }
        );

        if (response.data && response.data.vendor_categories) {
          const allItems = Object.values(
            response.data.vendor_categories
          ).flatMap((category) => category.items || []);
          setRecommendations(allItems);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, token]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h3>Please login to view your personalized recommendations.</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Login
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Recommended for You</h2>

      {recommendations.length === 0 ? (
        <div className="text-center">
          <p>No recommendations found at the moment.</p>
        </div>
      ) : (
        <div className="row g-4">
          {recommendations.map((item, index) => {
            // Map recommendation fields
            const id = item.id; // Or businessId?
            const name = item.businessName;
            const rating = item.final_score
              ? (item.final_score * 10).toFixed(1)
              : 0;
            const city = item.city;
            const rawImage = item.image || "";
            const imageUrl = rawImage
              ? rawImage.startsWith("http")
                ? rawImage
                : `${IMAGE_BASE_URL}${rawImage}`
              : "/images/imageNotFound.jpg";

            return (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <Link
                    to={`/details/info/${id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div
                      className="position-relative"
                      style={{ height: "200px", overflow: "hidden" }}
                    >
                      <img
                        src={imageUrl}
                        className="card-img-top w-100 h-100 object-fit-cover"
                        alt={name}
                        onError={(e) => {
                          e.target.src = "/images/imageNotFound.jpg";
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-truncate">{name}</h5>
                      <div className="d-flex align-items-center gap-1 mb-2">
                        <CiStar color="orange" size={20} />
                        <span className="fw-bold">{rating}</span>
                      </div>
                      <p className="card-text text-muted small d-flex align-items-center">
                        <CiLocationOn className="me-1" />
                        {city}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommandedPage;
