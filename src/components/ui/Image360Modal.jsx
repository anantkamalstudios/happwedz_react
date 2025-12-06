import React, { useState, useRef } from "react";
import { Pannellum } from "pannellum-react";
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Image360Modal = ({ images, onClose, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pannellumRef = useRef(null);

  const normalizedImages = React.useMemo(
    () =>
      (Array.isArray(images) ? images : []).filter(Boolean).map((s) =>
        s
          .toString()
          .replace(/^\s*`|`\s*$/g, "")
          .trim()
      ),
    [images]
  );

  const handleZoomIn = () => {
    if (pannellumRef.current) {
      const viewer = pannellumRef.current.getViewer();
      const currentHfov = viewer.getHfov();
      viewer.setHfov(Math.max(30, currentHfov - 10));
    }
  };

  const handleZoomOut = () => {
    if (pannellumRef.current) {
      const viewer = pannellumRef.current.getViewer();
      const currentHfov = viewer.getHfov();
      viewer.setHfov(Math.min(120, currentHfov + 10));
    }
  };

  const handleReset = () => {
    if (pannellumRef.current) {
      const viewer = pannellumRef.current.getViewer();
      viewer.setYaw(0);
      viewer.setPitch(0);
      viewer.setHfov(100);
    }
  };

  const handleFullscreen = () => {
    if (pannellumRef.current) {
      const viewer = pannellumRef.current.getViewer();
      viewer.toggleFullscreen();
    }
  };

  const goToNext = () => {
    if (currentIndex < normalizedImages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#000",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "white" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {title}
            </h2>
            {normalizedImages.length > 1 && (
              <p
                style={{
                  fontSize: "14px",
                  color: "#d1d5db",
                  margin: "4px 0 0 0",
                }}
              >
                Image {currentIndex + 1} of {normalizedImages.length}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X style={{ width: "24px", height: "24px" }} />
          </button>
        </div>
      </div>

      {/* Pannellum Viewer */}
      <Pannellum
        ref={pannellumRef}
        width="100%"
        height="100vh"
        image={normalizedImages[currentIndex]}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad
        showZoomCtrl={false}
        showFullscreenCtrl={false}
        mouseZoom={true}
        autoRotate={0}
        orientationOnByDefault={false}
      />

      {/* Navigation Arrows (if multiple images) */}
      {normalizedImages.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "12px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <ChevronLeft style={{ width: "24px", height: "24px" }} />
            </button>
          )}
          {currentIndex < normalizedImages.length - 1 && (
            <button
              onClick={goToNext}
              style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                padding: "12px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <ChevronRight style={{ width: "24px", height: "24px" }} />
            </button>
          )}
        </>
      )}

      {/* Controls Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
          padding: "24px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleReset}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "12px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
            title="Reset View"
          >
            <RotateCw style={{ width: "20px", height: "20px" }} />
          </button>

          <button
            onClick={handleZoomOut}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "12px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
            title="Zoom Out"
          >
            <ZoomOut style={{ width: "20px", height: "20px" }} />
          </button>

          <button
            onClick={handleZoomIn}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "12px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
            title="Zoom In"
          >
            <ZoomIn style={{ width: "20px", height: "20px" }} />
          </button>

          <button
            onClick={handleFullscreen}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "12px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
            }}
            title="Fullscreen"
          >
            <Maximize2 style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            color: "#d1d5db",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            🖱️ Drag to rotate • Scroll to zoom • Touch & drag on mobile
          </p>
        </div>
      </div>

      {/* Thumbnails (if multiple images) */}
      {normalizedImages.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "8px",
            borderRadius: "8px",
            maxWidth: "90vw",
            overflowX: "auto",
            zIndex: 10,
          }}
        >
          {normalizedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                flexShrink: 0,
                width: "64px",
                height: "64px",
                borderRadius: "4px",
                overflow: "hidden",
                border: `2px solid ${
                  idx === currentIndex ? "#3b82f6" : "#4b5563"
                }`,
                opacity: idx === currentIndex ? 1 : 0.6,
                cursor: "pointer",
                padding: 0,
                background: "none",
              }}
            >
              <img
                src={img}
                alt={`View ${idx + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Image360Modal;
