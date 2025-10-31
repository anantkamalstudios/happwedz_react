// filters_page_outfit.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaHome } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Download, Heart, Loader, Share } from "lucide-react";
import { MdRestartAlt } from "react-icons/md";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const buttons = ["Shades", "Compare", "Complete Look"];
const TRYON_API = "https://www.happywedz.com/ai/api/outfit_tryon/tryon";
const STATUS_API = (jobId) =>
  `https://www.happywedz.com/ai/api/outfit_tryon/status/${jobId}`;

export default function FiltersPageOutfit() {
  const navigate = useNavigate();
  const [uploadedOutfits, setUploadedOutfits] = useState([]);
  const [appliedOutfit, setAppliedOutfit] = useState(null);
  const outfitFileInputRef = useRef(null);

  const selfieInputRef = useRef(null);

  const [originalUrl, setOriginalUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [activeBtn, setActiveBtn] = useState(buttons[0]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const pollRef = useRef(null);
  const lastBlobUrlRef = useRef(null);

  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPoll();
      if (lastBlobUrlRef.current) {
        try {
          URL.revokeObjectURL(lastBlobUrlRef.current);
        } catch {}
        lastBlobUrlRef.current = null;
      }
      uploadedOutfits.forEach((o) => {
        try {
          if (o.url && o.url.startsWith("blob:")) URL.revokeObjectURL(o.url);
        } catch {}
      });
    };
  }, []);

  const startTryon = async (person, outfitFile) => {
    const form = new FormData();

    form.append("person", person);
    form.append("outfit", outfitFile);
    form.append("person_image", person);
    form.append("garment_image", outfitFile);

    const res = await fetch(TRYON_API, { method: "POST", body: form });
    if (!res.ok) throw new Error(`Try-on request failed (${res.status})`);
    const data = await res.json().catch(() => ({}));
    const jid = data?.job_id || data?.id || data?.jobId || data?.task_id;
    if (!jid) throw new Error("No job id returned by server");
    return jid;
  };

  const pollStatus = async (jid) => {
    const res = await fetch(STATUS_API(jid));
    if (!res.ok) throw new Error(`Status request failed (${res.status})`);

    const contentType = res.headers.get("content-type") || "";

    if (
      contentType.includes("image/") ||
      contentType.includes("octet-stream")
    ) {
      const blob = await res.blob();
      if (lastBlobUrlRef.current) {
        try {
          URL.revokeObjectURL(lastBlobUrlRef.current);
        } catch {}
      }
      const url = URL.createObjectURL(blob);
      lastBlobUrlRef.current = url;
      return { status: "completed", url };
    }

    const data = await res.json().catch(() => ({}));
    return data;
  };

  const handleSelfieSelect = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    try {
      if (originalUrl && originalUrl.startsWith("blob:"))
        URL.revokeObjectURL(originalUrl);
    } catch {}

    const objectUrl = URL.createObjectURL(file);
    setOriginalUrl(objectUrl);
    setPreviewUrl(objectUrl);

    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload/selfie", {
        method: "POST",
        body: form,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        const hostedUrl = data?.url || data?.fileUrl || data?.location;
        if (hostedUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {}
          setOriginalUrl(hostedUrl);
          setPreviewUrl(hostedUrl);
        }
      } else {
        console.warn(
          "Selfie upload endpoint failed or is missing - using local preview"
        );
      }
    } catch (err) {
      console.warn("Selfie upload attempt failed:", err);
    } finally {
      e.target.value = "";
    }
  };

  const handleOutfitUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    if (!originalUrl) {
      Swal.fire({
        icon: "info",
        title: "Selfie required",
        text: "Please upload your selfie first.",
      }).then(() => {
        selfieInputRef.current?.click();
      });
      return;
    }

    try {
      const objectUrl = URL.createObjectURL(file);
      const newOutfit = {
        id: Date.now(),
        file,
        url: objectUrl,
        name: file.name || `Outfit_${uploadedOutfits.length + 1}`,
      };
      setUploadedOutfits((prev) => [...prev, newOutfit]);
    } catch (err) {
      console.error("Failed to stage outfit locally", err);
    } finally {
      if (outfitFileInputRef.current) outfitFileInputRef.current.value = "";
    }
  };

  const fetchPersonFileFromUrl = async (url) => {
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) throw new Error("Could not fetch original selfie");
      const blob = await r.blob();
      try {
        const filename = url.split("/").pop().split("?")[0] || "selfie.jpg";
        return new File([blob], filename, { type: blob.type || "image/jpeg" });
      } catch {
        return blob;
      }
    } catch (err) {
      console.warn("fetchPersonFileFromUrl failed", err);
      return null;
    }
  };

  const handleApplyOutfit = async (outfit) => {
    if (!originalUrl) {
      Swal.fire({
        icon: "info",
        title: "Selfie required",
        text: "Please upload your selfie first.",
      }).then(() => {
        selfieInputRef.current?.click();
      });
      return;
    }

    if (!outfit?.file) {
      Swal.fire({
        icon: "info",
        title: "Select outfit",
        text: "Please upload/select an outfit image.",
      });
      return;
    }

    setErrorMsg("");
    setIsApplying(true);
    setAppliedOutfit(outfit);

    try {
      let personPayload = null;
      if (typeof originalUrl === "string") {
        const maybeFile = await fetchPersonFileFromUrl(originalUrl);
        personPayload = maybeFile || originalUrl;
      } else {
        personPayload = originalUrl;
      }

      const jid = await startTryon(personPayload, outfit.file);

      let attempts = 0;
      clearPoll();
      pollRef.current = setInterval(async () => {
        attempts += 1;
        try {
          const status = await pollStatus(jid);
          const s = (status?.status || status?.state || "").toLowerCase();

          const resultUrl = status?.imageUrl;

          if (s === "completed" || s === "done" || resultUrl) {
            if (resultUrl) {
              setPreviewUrl(resultUrl);
            } else if (status?.url) {
              setPreviewUrl(status.url);
            } else if (
              status?.url === undefined &&
              status?.status === "completed" &&
              status.url
            ) {
              setPreviewUrl(status.url);
            }
            clearPoll();
            setIsApplying(false);
          } else if (s === "failed" || s === "error") {
            clearPoll();
            setIsApplying(false);
            setErrorMsg(status?.message || "Try-on failed");
            setPreviewUrl(outfit.url);
          } else if (attempts > 60) {
            clearPoll();
            setIsApplying(false);
            setErrorMsg("Try-on timed out. Please try again.");
            setPreviewUrl(outfit.url);
          }
        } catch (e) {
          clearPoll();
          setIsApplying(false);
          setErrorMsg(e.message || "Status check failed");
          setPreviewUrl(outfit.url);
        }
      }, 2000);
    } catch (e) {
      clearPoll();
      setIsApplying(false);
      setErrorMsg(e.message || "Try-on request failed");
      setPreviewUrl(outfit.url);
    }
  };

  const handleReset = () => {
    setPreviewUrl(originalUrl);
    setAppliedOutfit(null);
  };

  const handleDelete = async () => {
    const confirmed = await Swal.fire({
      title: "Remove images?",
      text: "This will clear your staged outfits and reset the preview.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ed1173",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, clear",
    });

    if (confirmed.isConfirmed) {
      uploadedOutfits.forEach((o) => {
        try {
          if (o.url && o.url.startsWith("blob:")) URL.revokeObjectURL(o.url);
        } catch {}
      });
      if (lastBlobUrlRef.current) {
        try {
          URL.revokeObjectURL(lastBlobUrlRef.current);
        } catch {}
        lastBlobUrlRef.current = null;
      }
      clearPoll();
      setUploadedOutfits([]);
      setAppliedOutfit(null);
      setPreviewUrl(originalUrl);
      Swal.fire({
        title: "Cleared",
        text: "Staged outfits removed.",
        icon: "success",
        confirmButtonColor: "#ed1173",
      });
    }
  };

  const handleShare = async () => {
    if (!previewUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Outfit Try-on",
          text: "Check out my try-on",
          url: previewUrl,
        });
        setShowShareMenu(false);
      } catch (err) {}
    } else {
      navigator.clipboard?.writeText(previewUrl);
      Swal.fire({
        text: "Link copied to clipboard!",
        icon: "success",
        timer: 1200,
        confirmButtonColor: "#ed1173",
      });
    }
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "final_outfit.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Could not download the image.",
      });
    }
  };

  useEffect(() => {
    if (originalUrl && !appliedOutfit) setPreviewUrl(originalUrl);
  }, [originalUrl, appliedOutfit]);

  return (
    <div style={{ margin: "15px auto 0 auto", maxWidth: 380 }}>
      <style>{`
        .hwz-scrollbar {
          scrollbar-color: #C31162 transparent;
          scrollbar-width: auto;
        }
        .hwz-scrollbar::-webkit-scrollbar {
          height: 10px;
          width: 10px;
        }
        .hwz-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .hwz-scrollbar::-webkit-scrollbar-thumb {
          background-color: #C31162;
          border-radius: 8px;
        }
      `}</style>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 30,
                cursor: "pointer",
                padding: 8,
              }}
              title="Home"
              onClick={() => navigate("/try", { replace: true })}
            >
              <FaHome
                size={30}
                style={{
                  color: "#fff",
                  backgroundColor: "#C31162",
                  borderRadius: "100%",
                  padding: "5px",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 0,
                zIndex: 30,
                padding: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: activeBtn === "Complete Look" ? "55%" : "33%",
              }}
            >
              {activeBtn === "Complete Look" && (
                <div>
                  <Share
                    size={30}
                    style={{
                      color: "#fff",
                      backgroundColor: "#C31162",
                      borderRadius: "100%",
                      padding: "5px",
                    }}
                    title="Share Image"
                    onClick={() => setShowShareMenu(true)}
                  />
                </div>
              )}

              {showShareMenu && (
                <div
                  onClick={() => setShowShareMenu(false)}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: "#fff",
                      padding: "24px 32px",
                      borderRadius: 12,
                      minWidth: 320,
                    }}
                  >
                    <h4 style={{ marginBottom: 12 }}>Share your look</h4>
                    <div style={{ display: "flex", gap: 16 }}>
                      <button
                        onClick={handleShare}
                        style={{
                          background: "#C31162",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "10px 24px",
                          cursor: "pointer",
                        }}
                      >
                        Share
                      </button>
                      <button
                        onClick={() => setShowShareMenu(false)}
                        style={{
                          background: "#eee",
                          color: "#C31162",
                          border: "none",
                          borderRadius: 8,
                          padding: "8px 18px",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeBtn === "Complete Look" && (
                <div title="Download" onClick={handleDownload}>
                  <Download
                    size={30}
                    style={{
                      color: "#fff",
                      backgroundColor: "#C31162",
                      borderRadius: "100%",
                      padding: "5px",
                    }}
                  />
                </div>
              )}

              {/* <div
                onClick={() =>
                  Swal.fire({
                    title: "Favorites",
                    text: "Favorites available in makeup mode.",
                    icon: "info",
                  })
                }
              >
                <Heart
                  size={30}
                  style={{
                    color: "#fff",
                    backgroundColor: "#C31162",
                    borderRadius: "100%",
                    padding: "5px",
                  }}
                />
              </div> */}

              <div onClick={handleReset}>
                <MdRestartAlt
                  size={30}
                  style={{
                    color: "#fff",
                    backgroundColor: "#C31162",
                    borderRadius: "100%",
                    padding: "5px",
                  }}
                />
              </div>

              <div title="Delete" onClick={handleDelete}>
                <IoClose
                  size={30}
                  style={{
                    color: "#fff",
                    backgroundColor: "#C31162",
                    borderRadius: "100%",
                    padding: "5px",
                  }}
                />
              </div>
            </div>

            <div
              className="compare-container"
              style={{
                width: "100%",
                overflow: "hidden",
                borderRadius: 12,
                // aspectRatio: "3 / 4",
                maxHeight: "90vh",
                minHeight: 400,
              }}
            >
              {isCompareMode && originalUrl && previewUrl ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <ReactCompareSlider
                    itemOne={
                      <ReactCompareSliderImage
                        src={originalUrl}
                        alt="Original"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    }
                    itemTwo={
                      <ReactCompareSliderImage
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ) : (
                <div style={{ overflow: "hidden", borderRadius: 12 }}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : originalUrl ? (
                    <img
                      src={originalUrl}
                      alt="original"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 400,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#f7f7f7",
                        color: "#555",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <p>No selfie found. Please upload a selfie.</p>
                        <button
                          onClick={() => selfieInputRef.current?.click()}
                          style={{
                            background: "#C31162",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: 8,
                          }}
                        >
                          Upload Selfie
                        </button>
                      </div>
                    </div>
                  )}

                  {isApplying && (
                    <div
                      className="processing-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 20,
                      }}
                    >
                      {/* <Loader /> */}
                      <div style={{ padding: 12 }}>Applying Outfit...</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          onChange={handleSelfieSelect}
          style={{ display: "none" }}
        />
        <input
          ref={outfitFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleOutfitUpload}
          style={{ display: "none" }}
        />

        <div style={{ width: "100%" }}>
          {(() => {
            switch (activeBtn) {
              case "Shades":
                return (
                  <div style={{ position: "relative", width: "100%" }}>
                    <div
                      style={{
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        width: "100%",
                        padding: "0 10px",
                      }}
                      className="hwz-scrollbar"
                    >
                      <div
                        style={{ display: "inline-block", minWidth: "100%" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            padding: "8px 0",
                            minWidth: "max-content",
                          }}
                        >
                          {uploadedOutfits.map((outfit, idx) => (
                            <button
                              key={outfit.id || idx}
                              type="button"
                              onClick={() => handleApplyOutfit(outfit)}
                              disabled={isApplying}
                              style={{
                                cursor: "pointer",
                                width: 100,
                                height: 100,
                                flexShrink: 0,
                                background: "white",
                                border: "none",
                                borderRadius: 5,
                              }}
                            >
                              <img
                                src={outfit.url}
                                alt={outfit.name || `Outfit_${idx + 1}`}
                                style={{
                                  width: "100%",
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 6,
                                }}
                              />
                              <p style={{ fontSize: 10, fontWeight: 500 }}>
                                {(outfit.name || `Outfit_${idx + 1}`).slice(
                                  0,
                                  10
                                )}
                              </p>
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => outfitFileInputRef.current?.click()}
                            style={{
                              cursor: "pointer",
                              width: 100,
                              height: 100,
                              flexShrink: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "2px dotted #C31162",
                              borderRadius: 8,
                              background: "white",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: 65,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 6,
                                backgroundColor: "#f0f0f0",
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#C31162"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                            </div>
                            <p
                              style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: "#C31162",
                              }}
                            >
                              {uploadedOutfits.length === 0
                                ? "Upload Image"
                                : "Add More"}
                            </p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );

              case "Compare":
                return (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 55,
                        height: 55,
                        backgroundColor: "black",
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 2,
                          height: "100%",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        color: "black",
                        fontWeight: 500,
                        marginTop: 5,
                        fontSize: 12,
                      }}
                    >
                      Before/After
                    </p>
                  </div>
                );

              case "Complete Look":
                return (
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      justifyContent: "start",
                      height: 100,
                    }}
                  >
                    {appliedOutfit && (
                      <div
                        style={{
                          height: 120,
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          width: "100%",
                        }}
                      >
                        <div style={{ display: "flex", gap: 8 }}>
                          <div
                            style={{
                              padding: 8,
                              background: "#fff",
                              borderRadius: 8,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <img
                              src={appliedOutfit.url}
                              alt={appliedOutfit.name || "Applied Outfit"}
                              style={{
                                width: 80,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <p
                              style={{
                                color: "#000",
                                fontSize: 12,
                                textAlign: "center",
                              }}
                            >
                              {appliedOutfit.name || "Outfit"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })()}
        </div>
      </div>
      <div className="w-100 py-2" style={{ background: "#ffb3d3ff" }}>
        <div className="d-flex justify-content-evenly">
          {buttons.map((button, index) => (
            <button
              key={index}
              style={{
                height: "100%",
                background: activeBtn === button ? "#C31162" : "none",
                color: activeBtn === button ? "#fff" : "#C31162",
                padding: "4px clamp(0.6rem, 2vw, 2rem)",
                border: "none",
                borderRadius: "10px",
                fontWeight: "400",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "clamp(8px, 1.5vw, 12px)",
              }}
              onClick={() => {
                setActiveBtn(button);
                switch (button) {
                  case "Complete Look":
                    setIsCompareMode(false);
                    break;
                  case "Compare":
                    setIsCompareMode((p) => !p);
                    break;
                  default:
                    setIsCompareMode(false);
                    break;
                }
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .processing-overlay {
          background: rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </div>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { Home, X, RotateCcw, Upload } from "lucide-react";

// // HappyWedz Outfit Try-On API endpoints
// const TRYON_API = "https://www.happywedz.com/ai/api/outfit_tryon/tryon";
// const STATUS_API = (jobId) =>
//   `https://www.happywedz.com/ai/api/outfit_tryon/status/${jobId}`;

// const OutfitFilterPage = () => {
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(
//     "/images/try/bride-makeup.png"
//   );
//   const [outfitImages, setOutfitImages] = useState([]);
//   const [appliedOutfit, setAppliedOutfit] = useState(null);
//   const [isApplying, setIsApplying] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const pollRef = useRef(null);
//   const lastBlobUrlRef = useRef(null);

//   const selfieInputRef = useRef(null);
//   const outfitInputRef = useRef(null);

//   // Clear polling interval safely
//   const clearPoll = () => {
//     if (pollRef.current) {
//       clearInterval(pollRef.current);
//       pollRef.current = null;
//     }
//   };
//   useEffect(() => () => clearPoll(), []);

//   // Selfie upload
//   const onPickSelfie = () => selfieInputRef.current?.click();
//   const onSelfieSelected = (e) => {
//     const file = e?.target?.files?.[0];
//     if (!file) return;
//     setSelfieFile(file);
//     setSelfiePreview(URL.createObjectURL(file));
//     e.target.value = "";
//   };

//   // Outfit upload
//   const onPickOutfit = () => outfitInputRef.current?.click();
//   const onOutfitSelected = (e) => {
//     const file = e?.target?.files?.[0];
//     if (!file) return;
//     const entry = {
//       file,
//       url: URL.createObjectURL(file),
//       name: file.name || `Outfit_${outfitImages.length + 1}`,
//     };
//     setOutfitImages((prev) => [...prev, entry]);
//     e.target.value = "";
//   };

//   // API calls
//   const startTryon = async (personFile, outfitFile) => {
//     const form = new FormData();
//     form.append("person", personFile);
//     form.append("outfit", outfitFile);
//     form.append("person_image", personFile);
//     form.append("garment_image", outfitFile);

//     const res = await fetch(TRYON_API, { method: "POST", body: form });
//     if (!res.ok) throw new Error(`Try-on request failed (${res.status})`);
//     const data = await res.json().catch(() => ({}));
//     const jid = data?.job_id || data?.id || data?.jobId || data?.task_id;
//     if (!jid) throw new Error("No job id returned by server");
//     return jid;
//   };

//   const pollStatus = async (jid) => {
//     const res = await fetch(STATUS_API(jid));
//     if (!res.ok) throw new Error(`Status request failed (${res.status})`);

//     const contentType = res.headers.get("content-type") || "";

//     // If backend returns the final image directly
//     if (
//       contentType.includes("image/") ||
//       contentType.includes("octet-stream")
//     ) {
//       const blob = await res.blob();
//       if (lastBlobUrlRef.current) {
//         try {
//           URL.revokeObjectURL(lastBlobUrlRef.current);
//         } catch {}
//       }
//       const url = URL.createObjectURL(blob);
//       lastBlobUrlRef.current = url;
//       return { status: "completed", url };
//     }

//     // Otherwise, parse JSON
//     const data = await res.json().catch(() => ({}));
//     return data;
//   };

//   // Apply outfit
//   const handleApply = async (outfit) => {
//     if (!selfieFile) {
//       setErrorMsg("Please upload your selfie image first.");
//       return;
//     }
//     if (!outfit?.file) {
//       setErrorMsg("Please upload/select an outfit image.");
//       return;
//     }

//     setErrorMsg("");
//     setIsApplying(true);
//     setAppliedOutfit(outfit);

//     try {
//       const jid = await startTryon(selfieFile, outfit.file);
//       let attempts = 0;
//       clearPoll();

//       pollRef.current = setInterval(async () => {
//         attempts += 1;
//         try {
//           const status = await pollStatus(jid);
//           const s = (status?.status || status?.state || "").toLowerCase();

//           const resultUrl =
//             status?.imageUrl ||
//             status?.result_url ||
//             status?.output_url ||
//             status?.url ||
//             status?.data?.image_url ||
//             status?.data?.url ||
//             status?.data?.output_url;

//           if (s === "completed" || s === "done" || resultUrl) {
//             if (resultUrl) {
//               setSelfiePreview(resultUrl);
//             } else if (status?.url) {
//               setSelfiePreview(status.url);
//             }
//             clearPoll();
//             setIsApplying(false);
//           } else if (s === "failed" || s === "error") {
//             clearPoll();
//             setIsApplying(false);
//             setErrorMsg(status?.message || "Try-on failed");
//           } else if (attempts > 60) {
//             clearPoll();
//             setIsApplying(false);
//             setErrorMsg("Try-on timed out. Please try again.");
//           }
//         } catch (e) {
//           clearPoll();
//           setIsApplying(false);
//           setErrorMsg(e.message || "Status check failed");
//         }
//       }, 2000);
//     } catch (e) {
//       clearPoll();
//       setIsApplying(false);
//       setErrorMsg(e.message || "Try-on request failed");
//     }
//   };

//   const resetPreview = () => {
//     if (!selfieFile) return;
//     setSelfiePreview(URL.createObjectURL(selfieFile));
//   };

//   const removeAll = () => {
//     clearPoll();
//     setSelfieFile(null);
//     setSelfiePreview("/images/try/bride-makeup.png");
//     setOutfitImages([]);
//     setAppliedOutfit(null);
//     setIsApplying(false);
//     setErrorMsg("");
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "28rem",
//         margin: "1rem auto",
//         padding: "1.5rem",
//         background: "linear-gradient(to bottom, #fce7f3, #ffffff)",
//         borderRadius: "1rem",
//         boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
//         border: "2px solid #fbcfe8",
//       }}
//     >
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         .spinner {
//           animation: spin 1s linear infinite;
//         }
//       `}</style>

//       {/* Image preview area */}
//       <div style={{ position: "relative" }}>
//         {/* Action icons */}
//         <div
//           style={{
//             position: "absolute",
//             top: "1rem",
//             left: "1rem",
//             zIndex: 10,
//           }}
//         >
//           <button
//             style={{
//               background: "#db2777",
//               color: "white",
//               border: "none",
//               padding: "0.625rem",
//               borderRadius: "50%",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               cursor: "pointer",
//               transition: "all 0.3s",
//             }}
//           >
//             <Home size={20} />
//           </button>
//         </div>

//         <div
//           style={{
//             position: "absolute",
//             top: "1rem",
//             right: "1rem",
//             zIndex: 10,
//             display: "flex",
//             gap: "0.75rem",
//           }}
//         >
//           <button
//             onClick={resetPreview}
//             title="Reset"
//             style={{
//               background: "#db2777",
//               color: "white",
//               border: "none",
//               padding: "0.625rem",
//               borderRadius: "50%",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               cursor: "pointer",
//               transition: "all 0.3s",
//             }}
//           >
//             <RotateCcw size={20} />
//           </button>
//           <button
//             onClick={removeAll}
//             title="Delete"
//             style={{
//               background: "#db2777",
//               color: "white",
//               border: "none",
//               padding: "0.625rem",
//               borderRadius: "50%",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               cursor: "pointer",
//               transition: "all 0.3s",
//             }}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Main preview */}
//         <div
//           style={{
//             position: "relative",
//             borderRadius: "1rem",
//             overflow: "hidden",
//             boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
//             aspectRatio: "3/4",
//           }}
//         >
//           <img
//             src={selfiePreview}
//             alt="preview"
//             style={{
//               width: "100%",
//               height: "100%",
//               objectFit: "contain",
//               background: "linear-gradient(to bottom right, #f9fafb, #e5e7eb)",
//               display: "block",
//             }}
//           />
//           {isApplying && (
//             <div
//               style={{
//                 position: "absolute",
//                 inset: 0,
//                 background: "rgba(255,255,255,0.9)",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <div
//                 className="spinner"
//                 style={{
//                   width: "3rem",
//                   height: "3rem",
//                   border: "4px solid #fbcfe8",
//                   borderTopColor: "#db2777",
//                   borderRadius: "50%",
//                   marginBottom: "0.75rem",
//                 }}
//               />
//               <div
//                 style={{
//                   color: "#db2777",
//                   fontWeight: 600,
//                   fontSize: "1.125rem",
//                 }}
//               >
//                 Applying outfit...
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Upload buttons - side by side */}
//       <div className="row mt-4 g-3">
//         <div className="col-6">
//           <button
//             onClick={onPickSelfie}
//             style={{
//               width: "100%",
//               background: "linear-gradient(to right, #db2777, #be185d)",
//               color: "white",
//               border: "none",
//               borderRadius: "0.75rem",
//               padding: "0.75rem 1rem",
//               fontWeight: 600,
//               cursor: "pointer",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               transition: "all 0.3s",
//             }}
//           >
//             Upload Selfie Image
//           </button>
//           <input
//             ref={selfieInputRef}
//             type="file"
//             accept="image/*"
//             onChange={onSelfieSelected}
//             style={{ display: "none" }}
//           />
//         </div>

//         <div className="col-6">
//           <div
//             onClick={onPickOutfit}
//             style={{
//               width: "100%",
//               background: "linear-gradient(to bottom, #ffffff, #fce7f3)",
//               borderRadius: "0.75rem",
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
//               cursor: "pointer",
//               border: "2px solid #fbcfe8",
//               padding: "0.75rem",
//               transition: "all 0.3s",
//             }}
//           >
//             {/* <Upload
//               style={{ color: "#db2777", marginBottom: "0.5rem" }}
//               size={28}
//               strokeWidth={2.5}
//             /> */}
//             <div
//               style={{
//                 fontSize: "0.875rem",
//                 fontWeight: 600,
//                 color: "#374151",
//               }}
//             >
//               Upload Outfit Image
//             </div>
//           </div>
//           <input
//             ref={outfitInputRef}
//             type="file"
//             accept="image/*"
//             onChange={onOutfitSelected}
//             style={{ display: "none" }}
//           />
//         </div>
//       </div>

//       {/* Outfit thumbnails */}
//       {outfitImages.length > 0 && (
//         <div style={{ marginTop: "1.5rem", padding: "0 0.5rem" }}>
//           <div
//             style={{
//               display: "flex",
//               gap: "0.75rem",
//               overflowX: "auto",
//               paddingBottom: "0.5rem",
//             }}
//           >
//             {outfitImages.map((o, idx) => (
//               <button
//                 key={`${o.url}-${idx}`}
//                 type="button"
//                 onClick={() => handleApply(o)}
//                 style={{
//                   flexShrink: 0,
//                   background: "transparent",
//                   border: "none",
//                   padding: 0,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "6rem",
//                     height: "5rem",
//                     borderRadius: "0.75rem",
//                     overflow: "hidden",
//                     background: "#f3f4f6",
//                     outline:
//                       appliedOutfit?.url === o.url
//                         ? "3px solid #db2777"
//                         : "2px solid transparent",
//                     transition: "all 0.3s",
//                   }}
//                 >
//                   <img
//                     src={o.url}
//                     alt={o.name}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//                 <p
//                   style={{
//                     fontSize: "0.75rem",
//                     fontWeight: 500,
//                     marginTop: "0.5rem",
//                     textAlign: "center",
//                     color: "#4b5563",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                     width: "6rem",
//                   }}
//                 >
//                   {o.name?.slice(0, 14)}
//                 </p>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Bottom buttons */}
//       <div
//         style={{
//           background: "linear-gradient(to right, #fbcfe8, #f9a8d4)",
//           borderRadius: "0.75rem",
//           marginTop: "1.5rem",
//           padding: "0.75rem 0.5rem",
//         }}
//       >
//         <div className="d-flex justify-content-around align-items-center gap-2">
//           {["Shades", "Compare", "Complete Looks"].map((button) => (
//             <button
//               key={button}
//               style={{
//                 padding: "0.625rem 1.5rem",
//                 borderRadius: "0.75rem",
//                 fontWeight: 500,
//                 fontSize: "0.875rem",
//                 transition: "all 0.3s",
//                 border: "none",
//                 cursor: "pointer",
//                 background: button === "Shades" ? "#db2777" : "transparent",
//                 color: button === "Shades" ? "white" : "#be185d",
//                 boxShadow:
//                   button === "Shades" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
//               }}
//             >
//               {button}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Error message */}
//       {errorMsg && (
//         <div
//           style={{
//             marginTop: "1rem",
//             padding: "0.75rem",
//             background: "#fce7f3",
//             border: "1px solid #fbcfe8",
//             borderRadius: "0.5rem",
//           }}
//         >
//           <p
//             style={{
//               color: "#be185d",
//               fontSize: "0.875rem",
//               fontWeight: 600,
//               textAlign: "center",
//               margin: 0,
//             }}
//           >
//             {errorMsg}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OutfitFilterPage;
