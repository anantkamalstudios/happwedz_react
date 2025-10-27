import React from "react";
import { useNavigate } from "react-router-dom";
import EinviteHeroSection from "../layouts/einvites/EinviteHeroSection";
import ChooseTemplate from "./ChooseTemplate";
import { useToast } from "../layouts/toasts/Toast";

const EinviteHomePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const categories = [
    {
      id: "wedding_einvite",
      title: "Wedding E-Invitations",
      description: "Beautiful digital wedding invitation cards",
      color: "#ff6b9d",
      image: "./images/einvite/wedding-card.jpg",
    },
    {
      id: "video",
      title: "Video Invitations",
      description: "Dynamic video invitation templates",
      color: "#6366f1",
      image: "./images/commingsoon.jpg",
    },
    {
      id: "save_the_date",
      title: "Save the Date",
      description: "Save the date card templates",
      color: "#10b981",
      image: "./images/einvite/save-the-date.jpg",
    },
  ];

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "video") {
      addToast("Video invitations coming soon!", "info");
      return;
    }

    navigate(`/einvites/category/${categoryId}`);
  };

  return (
    <div className="einvite-home-page">
      <EinviteHeroSection />

      <main className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              Choose Your Invitation Type
            </h2>
            <p className="text-muted fs-5">
              Select from our beautiful collection of invitation templates
            </p>
          </div>

          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-lg-4 col-md-6 col-12">
                <div
                  className="main-category-card rounded-3"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="category-image rounded-3"
                  />
                  <div className="category-info">
                    <h3 className="category-title">{category.title}</h3>
                    <p className="category-description">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ChooseTemplate />

      <style jsx>{`
        .einvite-home-page {
          min-height: 100vh;
        }

        .main-category-card {
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .main-category-card:hover {
          transform: translateY(-6px);
        }

        .category-image {
          width: 100%;
          height: 450px;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .main-category-card:hover .category-image {
          transform: scale(1.01);
        }

        .category-info {
          padding: 1.25rem;
          text-align: center;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .category-description {
          font-size: 1rem;
          color: #666;
          margin-bottom: 0;
          line-height: 1.5;
        }

        @media (max-width: 1199px) {
          .category-image {
            height: 380px;
          }
        }

        @media (max-width: 991px) {
          .category-image {
            height: 340px;
          }
          .category-title {
            font-size: 1.375rem;
          }
        }

        @media (max-width: 767px) {
          .category-image {
            height: 300px;
          }
          .category-title {
            font-size: 1.25rem;
          }
          .category-description {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 575px) {
          .category-image {
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
};

export default EinviteHomePage;
