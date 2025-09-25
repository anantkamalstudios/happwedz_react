import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import { beautyApi } from "../../services/api";

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

  React.useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    };
    loadModels();
  }, []);

  const handlePick = () => setShowGuide(true);

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
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      const ok = await validateFace(dataUrl);
      if (!ok) {
        alert("No face detected. Please choose a clear frontal photo.");
        return;
      }
      try {
        const res = await beautyApi.uploadImage(file, "ORIGINAL");
        const imageId = res?.data?.id || res?.id || res?.image_id;
        sessionStorage.setItem("try_uploaded_image_id", imageId);
        setShowGuide(false);
        navigate("/try/filters");
      } catch (err) {
        console.error(err);
        alert("Upload failed. Please try again.");
      }
    };
    reader.readAsDataURL(file);
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
      alert("No face detected. Please look straight.");
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
      alert("Upload failed.");
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

  const triggerModalUpload = () => fileRef.current?.click();

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 text-center">
          <h2 className="fw-semibold">Upload your image or take a selfie</h2>
          <p className="text-muted">We will guide you for best results</p>
        </div>

        <div className="container py-5 d-flex flex-column align-items-center justify-content-center text-center">
          <div className="mb-4">
            <img
              src="/images/try/upload-default.png"
              alt="placeholder"
              className="rounded-5"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className="d-flex gap-3 flex-column flex-sm-row justify-content-center">
            <button className="btn btn-primary px-4" onClick={handlePick}>
              Upload Image
            </button>
            {!isCameraReady ? (
              <button
                className="btn btn-outline-primary px-4"
                onClick={startCamera}
              >
                Selfie Mode
              </button>
            ) : (
              <div className="d-flex flex-column align-items-center w-100">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="rounded-3"
                  style={{ width: "100%", maxWidth: 320 }}
                />
                <div className="mt-3 d-flex gap-2">
                  <button className="btn btn-secondary" onClick={stopCamera}>
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={startCountdown}
                    disabled={!!countdown}
                  >
                    {countdown ? countdown : "Capture"}
                  </button>
                </div>
                {cameraError && (
                  <div className="alert alert-danger mt-3 w-100">
                    {cameraError}
                  </div>
                )}
              </div>
            )}
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
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex flex-column">
                  <h5 className="modal-title text-danger">Capture Your Face</h5>
                  <p className="modal-title">
                    For accurate results, please follow these guidelines:
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowGuide(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="list-unstyled mb-4">
                  <li className="d-flex align-items-center mb-3 py-2">
                    <img
                      src="/images/try/staightFace.png"
                      alt="Look straight"
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
                    <span>Look straight at the camera</span>
                  </li>
                  <li className="d-flex align-items-center mb-3 py-2">
                    <img
                      src="/images/try/putHairBack.png"
                      alt="Hair back"
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
                    <span>Put hair back</span>
                  </li>
                  <li className="d-flex align-items-center mb-3 py-2">
                    <img
                      src="/images/try/removeGlasses.png"
                      alt="Remove glasses"
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
                    <span>Remove glasses</span>
                  </li>
                  <li className="d-flex align-items-center py-2">
                    <img
                      src="/images/try/planeBg.png"
                      alt="Plain background"
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
                    <span>Plain background</span>
                  </li>
                </ul>

                <div className="d-grid">
                  <button
                    className="btn btn-primary w-auto"
                    onClick={triggerModalUpload}
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="modal-backdrop show" /> */}
        </div>
      )}
    </div>
  );
};

export default UploadSelfiePage;
