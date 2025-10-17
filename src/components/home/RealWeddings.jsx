import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const RealWeddings = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=400&fit=crop",
      alt: "Wedding rings with pink roses",
    },
    {
      id: 2,
      url: "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Bridal party in pink dresses",
    },
    {
      id: 3,
      url: "https://images.pexels.com/photos/1023233/pexels-photo-1023233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Elegant wedding table setting",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=400&fit=crop",
      alt: "Wedding ceremony",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=400&fit=crop",
      alt: "Wedding bouquet",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (images.length - 2));
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (images.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + (images.length - 2)) % (images.length - 2)
    );
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-lg-5 p-0 m-0 real-wedding-custom-wide-card">
          <div
            className="card border-0 shadow-lg h-100 position-relative"
            style={{
              minHeight: "600px",
              zIndex: 10,
              width: "100%",
            }}
          >
            <div className="card-body p-5 d-flex flex-column justify-content-center">
              <div className="mb-4">
                <img
                  src="/images/home/Flower.png"
                  alt="flower"
                  className="w-20 h-20"
                />
              </div>

              {/* Main Title */}
              <h1
                className="display-5 fw-bold mb-3"
                style={{ color: "#2c2c2c", lineHeight: "1.2" }}
              >
                Real Wedding
                <br />
                Photos
              </h1>

              {/* Subtitle */}
              <p className="text-muted fs-6 mb-4">Real Wedding Stories</p>

              {/* See More Button */}
              <Link to="/real-wedding"
                className="btn btn-link p-0 fw-bold text-decoration-none d-flex align-items-center align-self-start"
                style={{ color: "#e91e63", fontSize: "1.1rem" }}
              >
                SEE MORE
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="ms-2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-7 position-relative overflow-hidden mt-5 d-none d-lg-block">
          <div
            className="carousel-wrapper position-relative overflow-hidden"
            style={{ height: "500px", left: "0" }}
          >
            {/* Carousel Track */}
            <div
              className="carousel-track d-flex position-absolute"
              style={{
                transform: `translateX(-${currentSlide * 20}%)`,
                transition: "transform 0.6s ease-in-out",
                width: `${(images.length / 3) * 100}%`,
                height: "100%",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="carousel-item-wrapper position-relative"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `translateZ(${index * 0}px) scale(${
                      1 - index * 0.02
                    })`,
                    zIndex: images.length - index,
                    transition: "all 0.6s ease-in-out",
                  }}
                >
                  <div
                    className="square-card overflow-hidden"
                    style={{
                      opacity: index < 4 ? 1 : 0.7,
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .square-card {
          width: 450px;
          height: 450px;
          margin: 0 auto;
          border-radius: 0px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .square-card img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .carousel-wrapper {
          perspective: 1000px;
          overflow: visible !important;
        }

        .carousel-wrapper {
          transform: translateX(-10%);
        }

        .btn:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }

        .btn-link:hover {
          color: #c2185b !important;
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2) !important;
        }

        .carousel-item-wrapper {
          transition: all 0.6s ease-in-out;
        }

        .carousel-item-wrapper:hover {
          transform: scale(1.05) !important;
          z-index: 999 !important;
        }

        @media (max-width: 991px) {
          .col-lg-4 {
            margin-bottom: 2rem;
          }

          .carousel-wrapper {
            height: 400px !important;
          }

          .carousel-item-wrapper {
            width: 200px !important;
            margin-left: -20px !important;
          }

          .display-5 {
            font-size: 2rem;
          }
        }

        @media (max-width: 576px) {
          .carousel-item-wrapper {
            width: 180px !important;
            margin-left: -15px !important;
          }

          .carousel-track {
            transform: translateX(-${currentSlide * 120}px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RealWeddings;
