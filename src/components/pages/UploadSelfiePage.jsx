import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { beautyApi } from "../../services/api";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FaHome, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const UploadSelfiePage = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [stream, setStream] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const { role, type } = userInfo;
  const controllerRef = useRef(null);

  let image;
  switch (role) {
    case "bride":
      if (type === "makeup") image = "/images/try/bride-makeup.png";
      else if (type === "jewellary") image = "/images/try/bride-jewellery.png";
      else if (type === "outfit") image = "/images/try/bride-outfit.png";
      break;
    case "groom":
      if (type === "makeup") image = "/images/try/upload-groome-default.png";
      else if (type === "jewellary")
        image = "/images/try/upload-groome-default.png";
      else if (type === "outfit")
        image = "/images/try/upload-groome-default.png";
      break;

    default:
      break;
  }

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (showGuide) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showGuide]);

  const handlePick = () => setShowGuide(true);

  const instructionSets = {
    bride: [
      {
        src: "/images/try/staightFace.png",
        text: "Look straight at the camera",
      },
      { src: "/images/try/putHairBack.png", text: "Put hair back" },
      { src: "/images/try/removeGlasses.png", text: "Remove Glasses" },
      { src: "/images/try/planeBg.png", text: "Use plain background" },
    ],
    groom: [
      {
        src: "/images/try/straightFace.png",
        text: "Look straight at the camera",
      },
      { src: "/images/try/hairBack.png", text: "Put hair back" },
      { src: "/images/try/straightFace.png", text: "Remove glasses" },
      { src: "/images/try/straightFace.png", text: "Plain background" },
    ],
    others: [
      { src: "", text: "Face the camera" },
      { src: "", text: "Avoid shadows" },
      { src: "", text: "Remove accessories" },
      { src: "", text: "Use plain background" },
    ],
  };

  const validateFace = async (imageDataUrl) => {
    const img = new window.Image();
    img.src = imageDataUrl;
    await new Promise((r) => (img.onload = r));
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
    return !!detection;
  };

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
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      const ok = await validateFace(dataUrl);
      if (!ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No face detected. Please choose a clear frontal photo.",
        });
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
        return;
      }
      try {
        controllerRef.current = new AbortController();
        const res = await beautyApi.uploadImage(
          file,
          "ORIGINAL",
          controllerRef.current.signal
        );
        const imageId = res?.data?.id || res?.id || res?.image_id;
        sessionStorage.setItem("try_uploaded_image_id", imageId);
        setShowGuide(false);
        setUploading(false);
        navigate("/try/filters");
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Upload failed. Please try again.",
        });
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
      console.log("Upload aborted by user");
      return;
    }
  };

  const startCamera = async () => {
    try {
      const streamLocal = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = streamLocal;
        await videoRef.current.play();
        setStream(streamLocal);
        setIsCameraReady(true);
      }
    } catch (e) {
      console.error(e);
      setCameraError("Unable to access camera. Check permissions.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks()?.forEach((t) => t.stop());
    setStream(null);
    setIsCameraReady(false);
  };

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const ok = await validateFace(dataUrl);
    if (!ok) {
      // alert("No face detected. Please look straight.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No face detected. Please look straight.",
        confirmButtonText: "OK",
        confirmButtonColor: "#ed1173",
      });

      return;
    }
    // Convert dataURL to Blob for upload
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
    try {
      const res = await beautyApi.uploadImage(file, "ORIGINAL");
      const imageId = res?.data?.id || res?.id || res?.image_id;
      sessionStorage.setItem("try_uploaded_image_id", imageId);
      setShowGuide(false);
      navigate("/try/filters");
    } catch (e) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Upload failed.",
        timer: "3000",
        confirmButtonText: "OK",
        confirmButtonColor: "#ed1173",
      });
    } finally {
      stopCamera();
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
        {/* <div className="col-12 text-center">
          <h2 className="fw-semibold">Upload your image or take a selfie</h2>
          <p className="text-muted">We will guide you for best results</p>
        </div> */}

        <div className="py-2 d-flex flex-column align-items-center justify-content-center">
          <div
            className="card shadow-sm border-0 text-center"
            style={{ maxWidth: 450, width: "100%", overflow: "hidden" }}
          >
            <div className="mb-3">
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
                />
              </div>
            </div>

            <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-4">
              <div className="col-12 text-start w-75">
                <h3 className="fw-semibold">Virtual Try - On</h3>
                <p className="text-muted">We will guide you for best results</p>
              </div>

              <div className="d-flex gap-3 flex-column justify-content-center w-75">
                {/* <button
                  className="btn w-100"
                  style={{
                    background: "linear-gradient(to right, #E83580, #821E48)",
                    color: "#fff",
                    padding: "10px 0",
                  }}
                >
                  Selfie Mode
                </button> */}
                <button
                  className="btn w-100"
                  onClick={handlePick}
                  style={{
                    background: "linear-gradient(to right, #E83580, #821E48)",
                    color: "#fff",
                    padding: "10px 0",
                  }}
                >
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          {/* Hidden file input */}
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

      {showGuide && (
        <>
          {/* Backdrop */}
          <div
            className="modal-backdrop show"
            style={{
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(255,255,255,1)",
            }}
          />

          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ overflow: "hidden" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
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
                    className="btn-close"
                    onClick={() => {
                      setShowGuide(false);
                      handleCancelUpload();
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <ul className="list-unstyled mb-4">
                    {instructionSets[role]?.map((item, i) => (
                      <React.Fragment key={i}>
                        <li className="d-flex align-items-center mb-3 py-2">
                          <img
                            src={item.src}
                            alt={item.text}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "contain",
                              border: "1px solid #ddd",
                              borderRadius: "10px",
                              padding: 4,
                              marginRight: 12,
                            }}
                          />
                          <span>{item.text}</span>
                        </li>
                        {i !== instructionSets[role].length - 1 && <hr />}
                      </React.Fragment>
                    ))}
                  </ul>

                  <div className="d-grid">
                    <button
                      className="btn w-100"
                      onClick={triggerModalUpload}
                      disabled={uploading}
                      style={{
                        background:
                          "linear-gradient(to right, #E83580, #821E48)",
                        color: "#fff",
                        padding: "10px 0",
                      }}
                    >
                      {uploading ? "Uploading..." : "Upload Photo"}
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
