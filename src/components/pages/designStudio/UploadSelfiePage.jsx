import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { beautyApi } from "../../../services/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FaHome, FaTimes, FaCamera, FaUpload } from "react-icons/fa";
import "../../../styles/shared.css";

const UploadSelfiePage = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || {};
    } catch {
      return {};
    }
  })();
  const role = userInfo.role || "bride";
  const type = userInfo.type || "makeup";
  const controllerRef = useRef(null);

  const getErrorMessage = (err) => {
    try {
      if (!err) return "Upload failed. Please try again.";

      const resp = err.response || err?.request?.response;
      if (resp) {
        const data =
          typeof resp.data === "string"
            ? (() => {
                try {
                  return JSON.parse(resp.data);
                } catch {
                  return null;
                }
              })()
            : resp.data;
        if (data?.error) return String(data.error);
        if (data?.message) return String(data.message);
        if (typeof resp.statusText === "string" && resp.statusText)
          return resp.statusText;
      }

      if (typeof err.message === "string") {
        const jsonMatch = err.message.match(/{[\s\S]*}/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed?.error) return String(parsed.error);
            if (parsed?.message) return String(parsed.message);
          } catch {}
        }
        const colonIdx = err.message.indexOf(":");
        if (colonIdx !== -1 && colonIdx + 1 < err.message.length) {
          const after = err.message.slice(colonIdx + 1).trim();
          if (after && !after.startsWith("{")) return after;
        }
        return err.message;
      }

      if (typeof err === "string") return err;
      return "Upload failed. Please try again.";
    } catch {
      return "Upload failed. Please try again.";
    }
  };

  let image = "/images/try/bride-makeup.png";
  if (role === "bride") {
    if (type === "makeup") image = "/images/try/bride-makeup.png";
    else if (type === "jewellary") image = "/images/try/bride-jewellery.png";
    else if (type === "outfit") image = "/images/try/bride-outfit.png";
  } else if (role === "groom") {
    image = "/images/try/upload-groome-default.png";
  }

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      } catch (e) {
        console.warn("Face-api models failed to load", e);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (showGuide || showCameraModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showGuide, showCameraModal]);

  const handlePick = () => setShowGuide(true);

  const defaultInstructions = [
    { src: "/images/try/staightFace.png", text: "Look straight at the camera" },
    { src: "/images/try/putHairBack.png", text: "Put hair back" },
    { src: "/images/try/removeGlasses.png", text: "Remove Glasses" },
    { src: "/images/try/planeBg.png", text: "Use plain background" },
  ];

  const instructionSets = {
    bride: {
      makeup: defaultInstructions,
      jewellary: defaultInstructions,
      outfit: [
        {
          src: "/images/try/fullBodyImage.png",
          text: "Capture a full-body image showing the person from head to toe.",
        },
        {
          src: "/images/try/standStraight.png",
          text: "The person should stand straight in a natural, relaxed pose.",
        },
        {
          src: "/images/try/lookStraight.png",
          text: "The person should look straight at the camera with a calm expression.",
        },
        {
          src: "/images/try/flaredDesign.png",
          text: "The outfit should have a flared design (like a gown or dress with flow.)",
        },
      ],
    },
    groom: {
      makeup: defaultInstructions,
      jewellary: defaultInstructions,
      outfit: defaultInstructions,
    },
    others: {
      makeup: defaultInstructions,
      jewellary: defaultInstructions,
      outfit: defaultInstructions,
    },
  };

  const activeInstructions =
    instructionSets[role]?.[type] || defaultInstructions;

  const handleFile = async (e) => {
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select an image file",
      });
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const localUrl = URL.createObjectURL(file);
        sessionStorage.setItem("try_uploaded_outfit_image_url", localUrl);

        if (type === "outfit" || type === "jewellary") {
          setShowGuide(false);
          setUploading(false);
          navigate("/try/outfit-filters");
          return;
        }

        controllerRef.current = new AbortController();
        const res = await beautyApi.uploadImage(
          file,
          "ORIGINAL",
          controllerRef.current.signal
        );
        const imageId = res?.data?.id || res?.id || res?.image_id;
        if (imageId) {
          sessionStorage.setItem("try_uploaded_image_id", imageId);
        }
        setShowGuide(false);
        setUploading(false);
        navigate("/try/filters");
      } catch (err) {
        console.warn("Upload API warning/error, continuing locally:", err);
        setShowGuide(false);
        setUploading(false);
        navigate(type === "outfit" || type === "jewellary" ? "/try/outfit-filters" : "/try/filters");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancelUpload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  const startCamera = async () => {
    setShowGuide(false);
    setShowCameraModal(true);
    setCameraError(null);
    setIsCameraReady(false);
    try {
      const streamLocal = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(streamLocal);
      if (videoRef.current) {
        videoRef.current.srcObject = streamLocal;
        await videoRef.current.play();
        setIsCameraReady(true);
      }
    } catch (e) {
      console.error(e);
      setCameraError("Unable to access camera. Check browser permissions.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks()?.forEach((t) => t.stop());
    setStream(null);
    setIsCameraReady(false);
    setShowCameraModal(false);
  };

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    const localUrl = URL.createObjectURL(file);
    sessionStorage.setItem("try_uploaded_outfit_image_url", localUrl);

    try {
      if (type === "outfit" || type === "jewellary") {
        stopCamera();
        navigate("/try/outfit-filters");
        return;
      }
      const res = await beautyApi.uploadImage(file, "ORIGINAL");
      const imageId = res?.data?.id || res?.id || res?.image_id;
      if (imageId) {
        sessionStorage.setItem("try_uploaded_image_id", imageId);
      }
      stopCamera();
      navigate("/try/filters");
    } catch (e) {
      console.error("Camera upload error:", e);
      stopCamera();
      navigate(type === "outfit" || type === "jewellary" ? "/try/outfit-filters" : "/try/filters");
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((p) => {
        if (p <= 1) {
          clearInterval(timer);
          capture();
          return null;
        }
        return p - 1;
      });
    }, 1000);
  };

  const triggerModalUpload = () => {
    if (fileRef.current) fileRef.current.value = "";
    fileRef.current?.click();
  };

  return (
    <div className="container py-1">
      <div className="row g-4">
        <div className="py-2 d-flex flex-column align-items-center justify-content-center">
          <div
            className="card shadow-sm border-0 text-center"
            style={{ maxWidth: 450, width: "100%", overflow: "hidden" }}
          >
            <div className="mb-3 position-relative">
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 14,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#E0006C",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                title="Home"
                onClick={() => navigate("/try")}
              >
                <FaHome size={18} />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#E0006C",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => navigate(-1)}
              >
                <FaTimes size={18} />
              </div>
              <div>
                <img
                  src={image}
                  alt="placeholder"
                  className="img-fluid"
                  style={{
                    width: "100%",
                    height: "380px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/450x380?text=Virtual+Try-On";
                  }}
                />
              </div>
            </div>

            <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-4">
              <div className="col-12 text-start w-75">
                <h3 className="fw-semibold">Virtual Try - On</h3>
                <p className="text-muted">We will guide you for best results</p>
              </div>

              <div className="d-flex gap-3 flex-column justify-content-center w-75">
                <button
                  className="btn w-100"
                  onClick={handlePick}
                  style={{
                    background: "linear-gradient(to right, #E83580, #821E48)",
                    color: "#fff",
                    padding: "10px 0",
                  }}
                >
                  Upload / Take Photo
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleFile}
          />
        </div>
      </div>

      <canvas ref={canvasRef} className="d-none" />

      {showCameraModal && (
        <>
          <div
            className="modal-backdrop show"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          />
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-3 overflow-hidden text-center bg-dark text-white">
                <div className="modal-header border-0 d-flex justify-content-between align-items-center">
                  <h5 className="modal-title">Take a Selfie</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={stopCamera}
                  />
                </div>
                <div className="modal-body position-relative p-0 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 320 }}>
                  {cameraError ? (
                    <div className="p-4 text-danger">{cameraError}</div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: "100%", maxHeight: 380, objectFit: "cover" }}
                      />
                      {countdown !== null && (
                        <div
                          className="position-absolute display-1 fw-bold text-warning"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                          }}
                        >
                          {countdown}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-danger px-4 rounded-pill d-flex align-items-center gap-2"
                    onClick={capture}
                    disabled={!isCameraReady || countdown !== null}
                  >
                    <FaCamera /> Snap Photo
                  </button>
                  <button
                    className="btn btn-warning px-4 rounded-pill"
                    onClick={startCountdown}
                    disabled={!isCameraReady || countdown !== null}
                  >
                    3s Timer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showGuide && (
        <>
          <div
            className="modal-backdrop show"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          />

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ overflow: "hidden" }}
          >
            <div className="modal-dialog modal-dialog-centered rounded-0">
              <div className="modal-content rounded-0 relative">
                <div className="modal-header border-0 position-relative">
                  <div className="d-flex flex-column">
                    <h4 className="modal-title text-danger fw-bold">
                      Photo Instruction
                    </h4>
                    <p className="modal-title text-dark">
                      For accurate results, please follow these guidelines:
                    </p>
                  </div>
                  <button
                    type="button"
                    className="position-absolute"
                    onClick={() => {
                      setShowGuide(false);
                      handleCancelUpload();
                    }}
                    style={{
                      color: "#C31162",
                      top: 10,
                      right: 10,
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <IoClose size={30} />
                  </button>
                </div>
                <div className="modal-body">
                  <ul className="list-unstyled mb-4">
                    {activeInstructions.map((item, i) => (
                      <React.Fragment key={i}>
                        <li className="d-flex align-items-center mb-3 py-2">
                          {item.src ? (
                            <img
                              src={item.src}
                              alt={item.text}
                              style={{
                                width: 70,
                                height: 70,
                                objectFit: "contain",
                                padding: 4,
                                marginRight: 12,
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : null}
                          <span>{item.text}</span>
                        </li>
                        {i !== activeInstructions.length - 1 && <hr />}
                      </React.Fragment>
                    ))}
                  </ul>

                  <div className="d-grid gap-2">
                    <button
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={triggerModalUpload}
                      disabled={uploading}
                      style={{
                        background:
                          "linear-gradient(to right, #E83580, #821E48)",
                        color: "#fff",
                        padding: "10px 0",
                      }}
                    >
                      <FaUpload /> {uploading ? "Uploading..." : "Upload Photo from Device"}
                    </button>

                    <button
                      className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                      onClick={startCamera}
                      style={{ padding: "10px 0" }}
                    >
                      <FaCamera /> Take Photo with Camera
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadSelfiePage;
