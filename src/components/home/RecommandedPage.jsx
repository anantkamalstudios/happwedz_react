import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import GridView from "../layouts/Main/GridView";

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

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  // Transform recommendations to match GridView expected format
  const transformedData = recommendations.map((item) => {
    const rawImage = item.image || "";
    const imageUrl = rawImage
      ? rawImage.startsWith("http")
        ? rawImage
        : `${IMAGE_BASE_URL}${rawImage}`
      : "/images/imageNotFound.jpg";

    return {
      ...item,
      id: item.id, // Ensure ID is passed
      name: item.businessName, // Map businessName to name

      image: imageUrl, // Use processed image URL
      city: item.city, // Keep city
      priceRange: item.priceRange || "N/A",
      review_count: item.review_count || 0,
    };
  });

  return (
    <div className="container py-5">
      <h3 className="mb-4">Recommended for You</h3>

      {recommendations.length === 0 ? (
        <div className="text-center">
          <p>No recommendations found at the moment.</p>
        </div>
      ) : (
        <GridView subVenuesData={transformedData} />
      )}
    </div>
  );
};

export default RecommandedPage;
