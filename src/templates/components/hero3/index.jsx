import React, { useState, useEffect } from "react";
import classes from "../../css/BackgroundVideo.module.css";

const BackgroundVideo = ({ images, coupleNames, weddingDate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Default images if none provided
  const defaultImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80",
  ];

  const slideImages = images && images.length > 0 ? images : defaultImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === slideImages.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 800);
    }, 4000);

    return () => clearInterval(interval);
  }, [slideImages.length]);

  return (
    <div className="vedio-area" id="home">
      <div className={classes.Container}>
        {/* Background Images */}
        {slideImages.map((image, index) => (
          <div
            key={index}
            className={`${classes.ImageSlide} ${index === currentImageIndex ? classes.Active : ""
              } ${isTransitioning && index === currentImageIndex
                ? classes.FadeOut
                : ""
              }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Overlay */}
        <div className={classes.Overlay}></div>

        {/* Content */}
        <div className={classes.Content}>
          <div className={classes.ContentInner}>
            <div className={classes.SubTitle}>
              <span className={classes.Divider}></span>
              <h4>WE'RE GETTING MARRIED</h4>
              <span className={classes.Divider}></span>
            </div>
            <div className={classes.MainTitle}>
              <h2>
                {coupleNames?.bride || "Sarah"} <span>&</span>{" "}
                {coupleNames?.groom || "John"}
              </h2>
            </div>
            <div className={classes.DateText}>
              <p>{weddingDate || "25 December 2024"}</p>
            </div>
            <div className={classes.AnimatedCircle}>
              <div className={classes.Circle}></div>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className={classes.ProgressIndicators}>
          {slideImages.map((_, index) => (
            <div
              key={index}
              className={`${classes.Indicator} ${index === currentImageIndex ? classes.ActiveIndicator : ""
                }`}
              onClick={() => setCurrentImageIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundVideo;
