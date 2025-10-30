// import React, { useEffect, useRef, useState } from "react";
// import { FaHome } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { MdRestartAlt } from "react-icons/md";

// // HappyWedz Outfit Try-On API endpoints
// const TRYON_API = "https://www.happywedz.com/ai/api/outfit_tryon/tryon";
// const STATUS_API = (jobId) =>
//   `https://www.happywedz.com/ai/api/outfit_tryon/status/${jobId}`;

// const OutfitFilterPage = () => {
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(
//     "/images/try/bride-makeup.png"
//   );
//   const [outfitImages, setOutfitImages] = useState([]); // {file, url, name}
//   const [appliedOutfit, setAppliedOutfit] = useState(null);
//   const [isApplying, setIsApplying] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const pollRef = useRef(null);

//   const selfieInputRef = useRef(null);
//   const outfitInputRef = useRef(null);

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
//     // Include multiple common field names for wider compatibility
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

//   // Keep track of last created blob URL to revoke when replaced
//   const lastBlobUrlRef = useRef(null);

//   const pollStatus = async (jid) => {
//     const res = await fetch(STATUS_API(jid));
//     if (!res.ok) throw new Error(`Status request failed (${res.status})`);

//     const contentType = res.headers.get("content-type") || "";
//     // If backend returns the final image directly (binary), create an ObjectURL
//     if (contentType.includes("image/") || contentType.includes("octet-stream")) {
//       const blob = await res.blob();
//       // Revoke previous blob URL to avoid memory leaks
//       if (lastBlobUrlRef.current) {
//         try { URL.revokeObjectURL(lastBlobUrlRef.current); } catch {}
//       }
//       const url = URL.createObjectURL(blob);
//       lastBlobUrlRef.current = url;
//       return { status: "completed", url };
//     }

//     // Otherwise expect JSON with a result URL or status
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

//       // Poll status
//       let attempts = 0;
//       clearPoll();
//       pollRef.current = setInterval(async () => {
//         attempts += 1;
//         try {
//           const status = await pollStatus(jid);
//           const s = (status?.status || status?.state || "").toLowerCase();
//           const resultUrl =
//             status?.result_url ||
//             status?.url ||
//             status?.image_url ||
//             status?.data?.url;

//           if (s === "completed" || s === "done" || resultUrl) {
//             if (resultUrl) setSelfiePreview(resultUrl);
//             clearPoll();
//             setIsApplying(false);
//           } else if (s === "failed" || s === "error") {
//             clearPoll();
//             setIsApplying(false);
//             setErrorMsg(status?.message || "Try-on failed");
//           } else if (attempts > 60) {
//             // ~2 minutes with 2s interval
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
//         margin: "12px auto 0 auto",
//         maxWidth: 420,
//         padding: 12,
//         border: "2px solid #f7c6d8",
//         borderRadius: 6,
//         background: "#fff",
//       }}
//     >
//       <div
//         className="preview-area"
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <div className="single-image-container" style={{ width: "100%" }}>
//           <div
//             className="image-wrapper"
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//             }}
//           >
//             {/* Home (visual only) */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 16,
//                 left: 16,
//                 zIndex: 30,
//                 padding: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//               title="Home"
//             >
//               <FaHome
//                 size={30}
//                 style={{
//                   color: "#fff",
//                   backgroundColor: "#C31162",
//                   borderRadius: "100%",
//                   padding: "5px",
//                 }}
//               />
//             </div>

//             {/* Actions: Reset, Delete */}
//             <div
//               className="d-flex gap-20 justify-content-between"
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 16,
//                 zIndex: 30,
//                 padding: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 14,
//               }}
//             >
//               <div
//                 onClick={resetPreview}
//                 title="Reset"
//                 style={{ cursor: "pointer" }}
//               >
//                 <MdRestartAlt
//                   size={30}
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#C31162",
//                     borderRadius: "100%",
//                     padding: "5px",
//                   }}
//                 />
//               </div>
//               <div
//                 onClick={removeAll}
//                 title="Delete"
//                 style={{ cursor: "pointer" }}
//               >
//                 <IoClose
//                   size={30}
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#C31162",
//                     borderRadius: "100%",
//                     padding: "5px",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Preview + overlay */}
//             <div
//               style={{
//                 width: "100%",
//                 overflow: "hidden",
//                 borderRadius: 12,
//                 aspectRatio: "3/4",
//                 maxHeight: 640,
//                 minHeight: 440,
//                 position: "relative",
//               }}
//             >
//               <img
//                 src={selfiePreview}
//                 alt="preview"
//                 className="img-fluid"
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                   display: "block",
//                   boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
//                 }}
//               />
//               {isApplying && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: "rgba(255,255,255,0.8)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 40,
//                       height: 40,
//                       border: "4px solid #f3f3f3",
//                       borderTop: "4px solid #ed1173",
//                       borderRadius: "50%",
//                       animation: "spin 1s linear infinite",
//                       marginBottom: 10,
//                     }}
//                   />
//                   <div style={{ color: "#C31162", fontWeight: 600 }}>
//                     Applying outfit...
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Selfie uploader */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
//         <button
//           onClick={onPickSelfie}
//           style={{
//             background: "#C31162",
//             color: "#fff",
//             border: "none",
//             borderRadius: 8,
//             padding: "10px 16px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Upload Selfie Image
//         </button>
//         <input
//           ref={selfieInputRef}
//           type="file"
//           accept="image/*"
//           onChange={onSelfieSelected}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Outfit uploader tile */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
//         <div
//           onClick={onPickOutfit}
//           style={{
//             background: "linear-gradient(180deg, #ffffff 0%, #fde7f1 100%)",
//             borderRadius: 10,
//             width: 230,
//             height: 90,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//             userSelect: "none",
//           }}
//         >
//           <div style={{ marginBottom: 6 }}>
//             <svg
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#C31162"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//               <polyline points="17 8 12 3 7 8" />
//               <line x1="12" y1="3" x2="12" y2="15" />
//             </svg>
//           </div>
//           <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>
//             Upload outfit Image
//           </div>
//         </div>
//         <input
//           ref={outfitInputRef}
//           type="file"
//           accept="image/*"
//           onChange={onOutfitSelected}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Outfit thumbnails list */}
//       {outfitImages.length > 0 && (
//         <div style={{ marginTop: 14, padding: "0 8px" }}>
//           <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
//             {outfitImages.map((o, idx) => (
//               <button
//                 key={`${o.url}-${idx}`}
//                 type="button"
//                 onClick={() => handleApply(o)}
//                 style={{
//                   width: 100,
//                   flex: "0 0 auto",
//                   border: "none",
//                   background: "transparent",
//                   padding: 0,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: 70,
//                     borderRadius: 10,
//                     overflow: "hidden",
//                     background: "#f0f0f0",
//                     outline:
//                       appliedOutfit?.url === o.url
//                         ? "2px solid #C31162"
//                         : "none",
//                   }}
//                 >
//                   <img
//                     src={o.url}
//                     alt={o.name}
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//                 <p
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 500,
//                     marginTop: 6,
//                     textAlign: "center",
//                     color: "#333",
//                   }}
//                 >
//                   {o.name?.slice(0, 14)}
//                 </p>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Progress line */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
//         <div
//           style={{
//             width: "86%",
//             height: 6,
//             background: "#f7c6d8",
//             borderRadius: 8,
//             position: "relative",
//           }}
//         >
//           <div
//             style={{
//               width: "58%",
//               height: 6,
//               background: "#C31162",
//               borderRadius: 8,
//               position: "absolute",
//               left: 0,
//               top: 0,
//             }}
//           />
//         </div>
//       </div>

//       {/* Bottom visual buttons */}
//       <div
//         className="w-100 py-2"
//         style={{ background: "#ffb3d3ff", marginTop: 18 }}
//       >
//         <div className="d-flex justify-content-evenly">
//           {["Shades", "Compare", "Complete Looks"].map((button, index) => (
//             <button
//               key={index}
//               style={{
//                 height: "100%",
//                 background: button === "Shades" ? "#C31162" : "transparent",
//                 color: button === "Shades" ? "#fff" : "#C31162",
//                 padding: "10px clamp(0.8rem, 3vw, 2rem)",
//                 border: "none",
//                 borderRadius: 12,
//                 fontWeight: 400,
//                 cursor: "default",
//                 fontSize: "clamp(11px, 1.6vw, 14px)",
//               }}
//             >
//               {button}
//             </button>
//           ))}
//         </div>
//       </div>

//       {errorMsg && (
//         <div
//           style={{
//             color: "#C31162",
//             fontSize: 12,
//             fontWeight: 600,
//             marginTop: 10,
//             textAlign: "center",
//           }}
//         >
//           {errorMsg}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OutfitFilterPage;

// import React, { useEffect, useRef, useState } from "react";
// import { FaHome } from "react-icons/fa";
// import { IoClose } from "react-icons/io5";
// import { MdRestartAlt } from "react-icons/md";

// // HappyWedz Outfit Try-On API endpoints
// const TRYON_API = "https://www.happywedz.com/ai/api/outfit_tryon/tryon";
// const STATUS_API = (jobId) =>
//   `https://www.happywedz.com/ai/api/outfit_tryon/status/${jobId}`;

// const OutfitFilterPage = () => {
//   const [selfieFile, setSelfieFile] = useState(null);
//   const [selfiePreview, setSelfiePreview] = useState(
//     "/images/try/bride-makeup.png"
//   );
//   const [outfitImages, setOutfitImages] = useState([]); // {file, url, name}
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
//         margin: "12px auto 0 auto",
//         maxWidth: 420,
//         padding: 12,
//         border: "2px solid #f7c6d8",
//         borderRadius: 6,
//         background: "#fff",
//       }}
//     >
//       {/* Image preview area */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <div style={{ width: "100%" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               position: "relative",
//             }}
//           >
//             {/* Home icon */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 16,
//                 left: 16,
//                 zIndex: 30,
//                 padding: 8,
//               }}
//               title="Home"
//             >
//               <FaHome
//                 size={30}
//                 style={{
//                   color: "#fff",
//                   backgroundColor: "#C31162",
//                   borderRadius: "100%",
//                   padding: "5px",
//                 }}
//               />
//             </div>

//             {/* Actions */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 10,
//                 right: 16,
//                 zIndex: 30,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 14,
//               }}
//             >
//               <div
//                 onClick={resetPreview}
//                 title="Reset"
//                 style={{ cursor: "pointer" }}
//               >
//                 <MdRestartAlt
//                   size={30}
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#C31162",
//                     borderRadius: "100%",
//                     padding: "5px",
//                   }}
//                 />
//               </div>
//               <div
//                 onClick={removeAll}
//                 title="Delete"
//                 style={{ cursor: "pointer" }}
//               >
//                 <IoClose
//                   size={30}
//                   style={{
//                     color: "#fff",
//                     backgroundColor: "#C31162",
//                     borderRadius: "100%",
//                     padding: "5px",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Main preview */}
//             <div
//               style={{
//                 width: "100%",
//                 overflow: "hidden",
//                 borderRadius: 12,
//                 aspectRatio: "3/4",
//                 maxHeight: 640,
//                 minHeight: 440,
//                 position: "relative",
//               }}
//             >
//               <img
//                 src={selfiePreview}
//                 alt="preview"
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "contain",
//                   display: "block",
//                   boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
//                 }}
//               />
//               {isApplying && (
//                 <div
//                   style={{
//                     position: "absolute",
//                     inset: 0,
//                     background: "rgba(255,255,255,0.8)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 40,
//                       height: 40,
//                       border: "4px solid #f3f3f3",
//                       borderTop: "4px solid #ed1173",
//                       borderRadius: "50%",
//                       animation: "spin 1s linear infinite",
//                       marginBottom: 10,
//                     }}
//                   />
//                   <div style={{ color: "#C31162", fontWeight: 600 }}>
//                     Applying outfit...
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Selfie uploader */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
//         <button
//           onClick={onPickSelfie}
//           style={{
//             background: "#C31162",
//             color: "#fff",
//             border: "none",
//             borderRadius: 8,
//             padding: "10px 16px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Upload Selfie Image
//         </button>
//         <input
//           ref={selfieInputRef}
//           type="file"
//           accept="image/*"
//           onChange={onSelfieSelected}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Outfit uploader */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
//         <div
//           onClick={onPickOutfit}
//           style={{
//             background: "linear-gradient(180deg, #ffffff 0%, #fde7f1 100%)",
//             borderRadius: 10,
//             width: 230,
//             height: 90,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
//             cursor: "pointer",
//           }}
//         >
//           <div style={{ marginBottom: 6 }}>
//             <svg
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#C31162"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//               <polyline points="17 8 12 3 7 8" />
//               <line x1="12" y1="3" x2="12" y2="15" />
//             </svg>
//           </div>
//           <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>
//             Upload Outfit Image
//           </div>
//         </div>
//         <input
//           ref={outfitInputRef}
//           type="file"
//           accept="image/*"
//           onChange={onOutfitSelected}
//           style={{ display: "none" }}
//         />
//       </div>

//       {/* Outfit thumbnails */}
//       {outfitImages.length > 0 && (
//         <div style={{ marginTop: 14, padding: "0 8px" }}>
//           <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
//             {outfitImages.map((o, idx) => (
//               <button
//                 key={`${o.url}-${idx}`}
//                 type="button"
//                 onClick={() => handleApply(o)}
//                 style={{
//                   width: 100,
//                   flex: "0 0 auto",
//                   border: "none",
//                   background: "transparent",
//                   padding: 0,
//                   cursor: "pointer",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: "100%",
//                     height: 70,
//                     borderRadius: 10,
//                     overflow: "hidden",
//                     background: "#f0f0f0",
//                     outline:
//                       appliedOutfit?.url === o.url
//                         ? "2px solid #C31162"
//                         : "none",
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
//                     fontSize: 10,
//                     fontWeight: 500,
//                     marginTop: 6,
//                     textAlign: "center",
//                     color: "#333",
//                   }}
//                 >
//                   {o.name?.slice(0, 14)}
//                 </p>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Progress line */}
//       <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
//         <div
//           style={{
//             width: "86%",
//             height: 6,
//             background: "#f7c6d8",
//             borderRadius: 8,
//             position: "relative",
//           }}
//         >
//           <div
//             style={{
//               width: "58%",
//               height: 6,
//               background: "#C31162",
//               borderRadius: 8,
//               position: "absolute",
//               left: 0,
//               top: 0,
//             }}
//           />
//         </div>
//       </div>

//       {/* Bottom buttons */}
//       <div
//         className="w-100 py-2"
//         style={{ background: "#ffb3d3ff", marginTop: 18 }}
//       >
//         <div className="d-flex justify-content-evenly">
//           {["Shades", "Compare", "Complete Looks"].map((button, index) => (
//             <button
//               key={index}
//               style={{
//                 height: "100%",
//                 background: button === "Shades" ? "#C31162" : "transparent",
//                 color: button === "Shades" ? "#fff" : "#C31162",
//                 padding: "10px clamp(0.8rem, 3vw, 2rem)",
//                 border: "none",
//                 borderRadius: 12,
//                 fontWeight: 400,
//                 cursor: "default",
//                 fontSize: "clamp(11px, 1.6vw, 14px)",
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
//             color: "#C31162",
//             fontSize: 12,
//             fontWeight: 600,
//             marginTop: 10,
//             textAlign: "center",
//           }}
//         >
//           {errorMsg}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OutfitFilterPage;

import React, { useEffect, useRef, useState } from "react";
import { Home, X, RotateCcw, Upload } from "lucide-react";

// HappyWedz Outfit Try-On API endpoints
const TRYON_API = "https://www.happywedz.com/ai/api/outfit_tryon/tryon";
const STATUS_API = (jobId) =>
  `https://www.happywedz.com/ai/api/outfit_tryon/status/${jobId}`;

const OutfitFilterPage = () => {
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(
    "/images/try/bride-makeup.png"
  );
  const [outfitImages, setOutfitImages] = useState([]); // {file, url, name}
  const [appliedOutfit, setAppliedOutfit] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef(null);
  const lastBlobUrlRef = useRef(null);

  const selfieInputRef = useRef(null);
  const outfitInputRef = useRef(null);

  // Clear polling interval safely
  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };
  useEffect(() => () => clearPoll(), []);

  // Selfie upload
  const onPickSelfie = () => selfieInputRef.current?.click();
  const onSelfieSelected = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setSelfieFile(file);
    setSelfiePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Outfit upload
  const onPickOutfit = () => outfitInputRef.current?.click();
  const onOutfitSelected = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const entry = {
      file,
      url: URL.createObjectURL(file),
      name: file.name || `Outfit_${outfitImages.length + 1}`,
    };
    setOutfitImages((prev) => [...prev, entry]);
    e.target.value = "";
  };

  // API calls
  const startTryon = async (personFile, outfitFile) => {
    const form = new FormData();
    form.append("person", personFile);
    form.append("outfit", outfitFile);
    form.append("person_image", personFile);
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

    // If backend returns the final image directly
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

    // Otherwise, parse JSON
    const data = await res.json().catch(() => ({}));
    return data;
  };

  // Apply outfit
  const handleApply = async (outfit) => {
    if (!selfieFile) {
      setErrorMsg("Please upload your selfie image first.");
      return;
    }
    if (!outfit?.file) {
      setErrorMsg("Please upload/select an outfit image.");
      return;
    }

    setErrorMsg("");
    setIsApplying(true);
    setAppliedOutfit(outfit);

    try {
      const jid = await startTryon(selfieFile, outfit.file);
      let attempts = 0;
      clearPoll();

      pollRef.current = setInterval(async () => {
        attempts += 1;
        try {
          const status = await pollStatus(jid);
          const s = (status?.status || status?.state || "").toLowerCase();

          const resultUrl =
            status?.imageUrl ||
            status?.result_url ||
            status?.output_url ||
            status?.url ||
            status?.data?.image_url ||
            status?.data?.url ||
            status?.data?.output_url;

          if (s === "completed" || s === "done" || resultUrl) {
            if (resultUrl) {
              setSelfiePreview(resultUrl);
            } else if (status?.url) {
              setSelfiePreview(status.url);
            }
            clearPoll();
            setIsApplying(false);
          } else if (s === "failed" || s === "error") {
            clearPoll();
            setIsApplying(false);
            setErrorMsg(status?.message || "Try-on failed");
          } else if (attempts > 60) {
            clearPoll();
            setIsApplying(false);
            setErrorMsg("Try-on timed out. Please try again.");
          }
        } catch (e) {
          clearPoll();
          setIsApplying(false);
          setErrorMsg(e.message || "Status check failed");
        }
      }, 2000);
    } catch (e) {
      clearPoll();
      setIsApplying(false);
      setErrorMsg(e.message || "Try-on request failed");
    }
  };

  const resetPreview = () => {
    if (!selfieFile) return;
    setSelfiePreview(URL.createObjectURL(selfieFile));
  };

  const removeAll = () => {
    clearPoll();
    setSelfieFile(null);
    setSelfiePreview("/images/try/bride-makeup.png");
    setOutfitImages([]);
    setAppliedOutfit(null);
    setIsApplying(false);
    setErrorMsg("");
  };

  return (
    <div
      style={{
        maxWidth: "28rem",
        margin: "1rem auto",
        padding: "1.5rem",
        background: "linear-gradient(to bottom, #fce7f3, #ffffff)",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        border: "2px solid #fbcfe8",
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Image preview area */}
      <div style={{ position: "relative" }}>
        {/* Action icons */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 10,
          }}
        >
          <button
            style={{
              background: "#db2777",
              color: "white",
              border: "none",
              padding: "0.625rem",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <Home size={20} />
          </button>
        </div>

        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={resetPreview}
            title="Reset"
            style={{
              background: "#db2777",
              color: "white",
              border: "none",
              padding: "0.625rem",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={removeAll}
            title="Delete"
            style={{
              background: "#db2777",
              color: "white",
              border: "none",
              padding: "0.625rem",
              borderRadius: "50%",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main preview */}
        <div
          style={{
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            aspectRatio: "3/4",
          }}
        >
          <img
            src={selfiePreview}
            alt="preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "linear-gradient(to bottom right, #f9fafb, #e5e7eb)",
              display: "block",
            }}
          />
          {isApplying && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="spinner"
                style={{
                  width: "3rem",
                  height: "3rem",
                  border: "4px solid #fbcfe8",
                  borderTopColor: "#db2777",
                  borderRadius: "50%",
                  marginBottom: "0.75rem",
                }}
              />
              <div
                style={{
                  color: "#db2777",
                  fontWeight: 600,
                  fontSize: "1.125rem",
                }}
              >
                Applying outfit...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload buttons - side by side */}
      <div className="row mt-4 g-3">
        <div className="col-6">
          <button
            onClick={onPickSelfie}
            style={{
              width: "100%",
              background: "linear-gradient(to right, #db2777, #be185d)",
              color: "white",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "all 0.3s",
            }}
          >
            Upload Selfie Image
          </button>
          <input
            ref={selfieInputRef}
            type="file"
            accept="image/*"
            onChange={onSelfieSelected}
            style={{ display: "none" }}
          />
        </div>

        <div className="col-6">
          <div
            onClick={onPickOutfit}
            style={{
              width: "100%",
              background: "linear-gradient(to bottom, #ffffff, #fce7f3)",
              borderRadius: "0.75rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
              cursor: "pointer",
              border: "2px solid #fbcfe8",
              padding: "0.75rem",
              transition: "all 0.3s",
            }}
          >
            {/* <Upload
              style={{ color: "#db2777", marginBottom: "0.5rem" }}
              size={28}
              strokeWidth={2.5}
            /> */}
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Upload Outfit Image
            </div>
          </div>
          <input
            ref={outfitInputRef}
            type="file"
            accept="image/*"
            onChange={onOutfitSelected}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Outfit thumbnails */}
      {outfitImages.length > 0 && (
        <div style={{ marginTop: "1.5rem", padding: "0 0.5rem" }}>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
            }}
          >
            {outfitImages.map((o, idx) => (
              <button
                key={`${o.url}-${idx}`}
                type="button"
                onClick={() => handleApply(o)}
                style={{
                  flexShrink: 0,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "6rem",
                    height: "5rem",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    background: "#f3f4f6",
                    outline:
                      appliedOutfit?.url === o.url
                        ? "3px solid #db2777"
                        : "2px solid transparent",
                    transition: "all 0.3s",
                  }}
                >
                  <img
                    src={o.url}
                    alt={o.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginTop: "0.5rem",
                    textAlign: "center",
                    color: "#4b5563",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "6rem",
                  }}
                >
                  {o.name?.slice(0, 14)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress line */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1.5rem",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "0.5rem",
            background: "#fbcfe8",
            borderRadius: "9999px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "60%",
              height: "0.5rem",
              background: "linear-gradient(to right, #db2777, #ec4899)",
              borderRadius: "9999px",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          />
        </div>
      </div> */}

      {/* Bottom buttons */}
      <div
        style={{
          background: "linear-gradient(to right, #fbcfe8, #f9a8d4)",
          borderRadius: "0.75rem",
          marginTop: "1.5rem",
          padding: "0.75rem 0.5rem",
        }}
      >
        <div className="d-flex justify-content-around align-items-center gap-2">
          {["Shades", "Compare", "Complete Looks"].map((button) => (
            <button
              key={button}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.75rem",
                fontWeight: 500,
                fontSize: "0.875rem",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
                background: button === "Shades" ? "#db2777" : "transparent",
                color: button === "Shades" ? "white" : "#be185d",
                boxShadow:
                  button === "Shades" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {button}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "#fce7f3",
            border: "1px solid #fbcfe8",
            borderRadius: "0.5rem",
          }}
        >
          <p
            style={{
              color: "#be185d",
              fontSize: "0.875rem",
              fontWeight: 600,
              textAlign: "center",
              margin: 0,
            }}
          >
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
};

export default OutfitFilterPage;
