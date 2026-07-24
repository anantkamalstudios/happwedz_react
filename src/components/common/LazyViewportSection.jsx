import React, { useState, useEffect, useRef } from "react";

const LazyViewportSection = ({ children, height = "200px" }) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isIntersected) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
        }
      },
      { rootMargin: "200px 0px" } // Preload when 200px from viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isIntersected]);

  return (
    <div ref={containerRef} style={{ minHeight: isIntersected ? "auto" : height }}>
      {isIntersected ? children : null}
    </div>
  );
};

export default LazyViewportSection;
