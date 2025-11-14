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
import axios from "axios";

const buttons = ["Shades", "Compare", "Complete Look"];
const BASE_API = "http://69.62.85.170:5000";
const CATALOG_API = `${BASE_API}/api/catalog/items`;
const TRYON_CLOTHES_API = `${BASE_API}/api/tryon/clothes`;
const TRYON_JEWELRY_API = `${BASE_API}/api/tryon/jewelry`;

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
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [tryOnError, setTryOnError] = useState(null);

  const pollRef = useRef(null);
  const lastBlobUrlRef = useRef(null);
  const originalImageRef = useRef(null);

  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const fetchProducts = async () => {
    try {
      const category = localStorage.getItem('tryonCategory');
      if (!category) return;
      
      const response = await axios.get(CATALOG_API, {
        params: { category }
      });
      if (response.data?.ok && Array.isArray(response.data.items)) {
        setProductList(response.data.items);
      } else {
        console.error('Invalid response format:', response.data);
        setProductList([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductList([]);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  useEffect(() => {
    fetchProducts();
  }, []);
  const pollForResult = async (sessionId, apiUrl, maxAttempts = 30, interval = 2000) => {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkStatus = async () => {
        try {
          attempts++;
          const response = await axios.get(`${apiUrl}?session_id=${sessionId}`);
          const data = response.data;
          
          if (data.status === 'completed') {
            clearInterval(pollInterval);
            resolve(data);
          } else if (data.status === 'failed' || attempts >= maxAttempts) {
            clearInterval(pollInterval);
            reject(new Error(data.message || 'Try-on processing failed'));
          }
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      };
      
      const pollInterval = setInterval(checkStatus, interval);
      checkStatus();
    });
  };

  const startTryon = async (person, selectedItem) => {
    const form = new FormData();
    const category = localStorage.getItem('tryonCategory');
    const apiUrl = category === 'jewelry' ? TRYON_JEWELRY_API : TRYON_CLOTHES_API;
    form.append("model_photo", person);
    form.append("item_id", selectedItem.id);
    form.append("item_url", selectedItem.image_url);
    form.append("clothing_type", "onepiece");
    
    try {
      setIsLoading(true);
      setTryOnError(null);
      const response = await axios.post(apiUrl, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const { session_id: sessionId } = response.data;
      if (!sessionId) {
        throw new Error('No session ID received from the server');
      }
      const result = await pollForResult(sessionId, apiUrl);
      
      if (result.ok && result.result) {
        setTryOnResult(result.result);
        return result.result;
      } else {
        throw new Error(result.message || 'Try-on failed');
      }
    } catch (error) {
      console.error('Try-on error:', error);
      setTryOnError(error.message || 'Failed to process try-on');
      throw error;
    } finally {
      setIsLoading(false);
    }
    form.append("clothing_type", "one-piece");
    const res = await axios.post(
      "http://192.168.1.8:5000/api/tryon/clothes",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res);
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

  const handleSelfieSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalUrl(event.target.result);
      originalImageRef.current = file;
      setPreviewUrl(null);
      setSelectedProduct(null);
      setTryOnError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleOutfitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const newOutfit = { 
        id: Date.now(), 
        file, 
        url, 
        name: file.name,
        image_url: url,
        type: 'custom'
      };
      setUploadedOutfits((prev) => [...prev, newOutfit]);
    } catch (err) {
      console.error("Failed to process outfit upload:", err);
      setErrorMsg("Failed to process the uploaded outfit. Please try again.");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  const handleProductSelect = async (product) => {
    if (!originalImageRef.current) {
      setTryOnError('Please upload a selfie first');
      return;
    }
    
    try {
      setSelectedProduct(product);
      const result = await startTryon(originalImageRef.current, product);
      setPreviewUrl(result);
      setTryOnError(null);
    } catch (error) {
      console.error('Error trying on product:', error);
      setTryOnError('Failed to apply the product. Please try again.');
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
    setSelectedProduct(null);
    setTryOnError(null);
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