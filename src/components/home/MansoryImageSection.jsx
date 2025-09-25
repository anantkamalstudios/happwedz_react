import React, { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const MansoryImageSection = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sampleImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500",
      title: "Elegant Wedding Venue",
      category: "Venues",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500",
      title: "Wedding Photography",
      category: "Photography",
    },
    // {
    //   id: 4,
    //   url: "https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=500",
    //   title: "Bridal Makeup",
    //   category: "Makeup",
    // },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=500",
      title: "Wedding Cake",
      category: "Catering",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=500",
      title: "Wedding Rings",
      category: "Jewelry",
    },
  ];

  useEffect(() => {
    loadMoreImages();
  }, []);

  const loadMoreImages = () => {
    setTimeout(() => {
      const newImages = [...sampleImages].sort(() => Math.random() - 0.5);
      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage((prevPage) => prevPage + 1);
      if (page > 3) setHasMore(false);
    }, 1500);
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <section className="masonry-section py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark mb-3">Wedding Gallery</h2>
          <p
            className="h6 text-muted mb-3"
            data-aos="fade-up"
            data-aos-delay="50"
          >
            Get inspired by our collection of beautiful wedding moments
          </p>
        </div>

        <InfiniteScroll
          dataLength={images.length}
          next={loadMoreImages}
          hasMore={hasMore}
          loader={<div className="text-center my-4"></div>}
          endMessage={
            <Link to="/photography" className="text-decoration-none">
              <p className="text-center text-danger my-4">
                Lets Show More Images
              </p>
            </Link>
          }
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {images.map((image, index) => (
              <div className="masonry-item" key={`${image.id}-${index}`}>
                <div className="image-card">
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    className="masonry-image"
                  />
                  <div className="image-overlay">
                    <h5 className="image-title">{image.title}</h5>
                    <span className="image-category">{image.category}</span>
                  </div>
                </div>
                <div className="image-meta">
                  <h5 className="image-title mb-1">{image.title}</h5>
                  <span className="image-category">{image.category}</span>
                </div>
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      </Container>
    </section>
  );
};

export default MansoryImageSection;
