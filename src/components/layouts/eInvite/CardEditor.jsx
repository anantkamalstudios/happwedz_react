// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   Download,
//   Type,
//   Image,
//   Palette,
//   RotateCcw,
//   Save,
//   Plus,
// } from "lucide-react";

// const CardEditor = ({ template, onBack }) => {
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const [canvas, setCanvas] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeText, setActiveText] = useState(null);
//   const [textOptions, setTextOptions] = useState({
//     fontSize: 30,
//     fontFamily: "Arial",
//     color: "#333333",
//     text: "Your Text Here",
//     fontWeight: "normal",
//     fontStyle: "normal",
//   });

//   useEffect(() => {
//     let fabricCanvas = null;
//     let timeoutId;

//     const initCanvas = async () => {
//       try {
//         const fabricModule = await import("fabric");
//         const fabric = fabricModule.fabric || fabricModule;

//         if (canvasRef.current && !canvas) {
//           fabricCanvas = new fabric.Canvas(canvasRef.current, {
//             width: 500,
//             height: 700,
//             backgroundColor: "#ffffff",
//             preserveObjectStacking: true,
//           });

//           // Load template background
//           if (template?.image) {
//             fabric.Image.fromURL(
//               template.image,
//               (img) => {
//                 const canvasAspect = fabricCanvas.width / fabricCanvas.height;
//                 const imgAspect = img.width / img.height;

//                 if (imgAspect > canvasAspect) {
//                   img.scaleToWidth(fabricCanvas.width);
//                 } else {
//                   img.scaleToHeight(fabricCanvas.height);
//                 }

//                 img.set({
//                   left: fabricCanvas.width / 2 - img.getScaledWidth() / 2,
//                   top: fabricCanvas.height / 2 - img.getScaledHeight() / 2,
//                   selectable: false,
//                   evented: false,
//                 });

//                 fabricCanvas.setBackgroundImage(
//                   img,
//                   fabricCanvas.renderAll.bind(fabricCanvas)
//                 );
//                 fabricCanvas.renderAll();
//                 setIsLoading(false);
//               },
//               {
//                 crossOrigin: "anonymous",
//                 onError: () => {
//                   console.warn("Failed to load background image");
//                   setIsLoading(false);
//                 },
//               }
//             );
//           } else {
//             setIsLoading(false);
//           }

//           // Add default text elements
//           const titleText = new fabric.IText("Wedding Invitation", {
//             left: 250,
//             top: 150,
//             fontSize: 32,
//             fontFamily: "serif",
//             fill: "#8B4513",
//             textAlign: "center",
//             originX: "center",
//             fontWeight: "bold",
//           });

//           const coupleNames = new fabric.IText("Bride & Groom", {
//             left: 250,
//             top: 300,
//             fontSize: 28,
//             fontFamily: "serif",
//             fill: "#D2691E",
//             textAlign: "center",
//             originX: "center",
//             fontStyle: "italic",
//           });

//           const dateText = new fabric.IText("Date: DD/MM/YYYY", {
//             left: 250,
//             top: 450,
//             fontSize: 20,
//             fontFamily: "sans-serif",
//             fill: "#333333",
//             textAlign: "center",
//             originX: "center",
//           });

//           const venueText = new fabric.IText("Venue: Your Wedding Venue", {
//             left: 250,
//             top: 500,
//             fontSize: 18,
//             fontFamily: "sans-serif",
//             fill: "#333333",
//             textAlign: "center",
//             originX: "center",
//           });

//           fabricCanvas.add(titleText, coupleNames, dateText, venueText);

//           // Object selection handlers
//           fabricCanvas.on("selection:created", (e) => {
//             if (e.selected[0] && e.selected[0].type === "i-text") {
//               const obj = e.selected[0];
//               setActiveText(obj);
//               setTextOptions({
//                 fontSize: obj.fontSize,
//                 fontFamily: obj.fontFamily,
//                 color: obj.fill,
//                 text: obj.text,
//                 fontWeight: obj.fontWeight || "normal",
//                 fontStyle: obj.fontStyle || "normal",
//               });
//             }
//           });

//           fabricCanvas.on("selection:updated", (e) => {
//             if (e.selected[0] && e.selected[0].type === "i-text") {
//               const obj = e.selected[0];
//               setActiveText(obj);
//               setTextOptions({
//                 fontSize: obj.fontSize,
//                 fontFamily: obj.fontFamily,
//                 color: obj.fill,
//                 text: obj.text,
//                 fontWeight: obj.fontWeight || "normal",
//                 fontStyle: obj.fontStyle || "normal",
//               });
//             }
//           });

//           fabricCanvas.on("selection:cleared", () => {
//             setActiveText(null);
//           });

//           // Text editing handler
//           fabricCanvas.on("text:changed", (e) => {
//             if (e.target) {
//               setTextOptions((prev) => ({
//                 ...prev,
//                 text: e.target.text,
//               }));
//             }
//           });

//           setCanvas(fabricCanvas);
//         }
//       } catch (error) {
//         console.error("Failed to initialize canvas:", error);
//         setIsLoading(false);
//       }
//     };

//     initCanvas();

//     timeoutId = setTimeout(() => setIsLoading(false), 5000);

//     return () => {
//       if (fabricCanvas) fabricCanvas.dispose();
//       clearTimeout(timeoutId);
//     };
//   }, [template]);

//   // Add new text
//   const addText = async () => {
//     if (!canvas) return;

//     try {
//       const { fabric } = await import("fabric");
//       const text = new fabric.IText("New Text", {
//         left: 250,
//         top: 200,
//         fontSize: 24,
//         fill: "#333333",
//         textAlign: "center",
//         originX: "center",
//       });
//       canvas.add(text);
//       canvas.setActiveObject(text);
//       canvas.renderAll();
//     } catch (error) {
//       console.error("Error adding text:", error);
//     }
//   };

//   // Update active text properties
//   const updateText = (property, value) => {
//     if (activeText && canvas) {
//       activeText.set(property, value);
//       canvas.renderAll();
//       setTextOptions((prev) => ({ ...prev, [property]: value }));
//     }
//   };

//   // Add image
//   const addImage = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !canvas) return;

//     try {
//       const { fabric } = await import("fabric");
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         fabric.Image.fromURL(event.target.result, (img) => {
//           // Scale image to fit canvas
//           const maxWidth = canvas.width * 0.8;
//           const maxHeight = canvas.height * 0.8;

//           if (img.width > maxWidth) {
//             img.scaleToWidth(maxWidth);
//           }
//           if (img.height * img.scaleY > maxHeight) {
//             img.scaleToHeight(maxHeight);
//           }

//           img.set({
//             left: canvas.width / 2,
//             top: canvas.height / 2,
//             originX: "center",
//             originY: "center",
//           });

//           canvas.add(img);
//           canvas.setActiveObject(img);
//           canvas.renderAll();
//         });
//       };

//       reader.readAsDataURL(file);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }

//     // Reset file input
//     e.target.value = "";
//   };

//   // Export canvas as image
//   const exportCard = () => {
//     if (!canvas) return;

//     try {
//       const dataURL = canvas.toDataURL({
//         format: "png",
//         quality: 1,
//         multiplier: 2,
//       });

//       const link = document.createElement("a");
//       link.href = dataURL;
//       link.download = `wedding-card-${
//         template?.name?.replace(/\s+/g, "-") || "custom"
//       }.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error exporting card:", error);
//       alert("Failed to export card. Please try again.");
//     }
//   };

//   // Drag and Drop image support
//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     if (!canvas) return;

//     try {
//       const files = e.dataTransfer?.files;
//       if (!files || files.length === 0) return;
//       const file = files[0];
//       if (!file.type.startsWith("image/")) return;

//       const { fabric } = await import("fabric");
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         fabric.Image.fromURL(event.target.result, (img) => {
//           const maxWidth = canvas.width * 0.8;
//           const maxHeight = canvas.height * 0.8;

//           if (img.width > maxWidth) {
//             img.scaleToWidth(maxWidth);
//           }
//           if (img.height * img.scaleY > maxHeight) {
//             img.scaleToHeight(maxHeight);
//           }

//           img.set({
//             left: canvas.width / 2,
//             top: canvas.height / 2,
//             originX: "center",
//             originY: "center",
//           });

//           canvas.add(img);
//           canvas.setActiveObject(img);
//           canvas.renderAll();
//         });
//       };
//       reader.readAsDataURL(file);
//     } catch (error) {
//       console.error("Error handling drop:", error);
//     }
//   };

//   // Save project
//   const saveProject = () => {
//     if (!canvas) return;

//     try {
//       const canvasData = canvas.toJSON();
//       const projectData = {
//         template: template,
//         canvasData: canvasData,
//         savedAt: new Date().toISOString(),
//         name: template?.name || "Custom Card",
//       };

//       const projectId = `wedding-card-${Date.now()}`;
//       localStorage.setItem(projectId, JSON.stringify(projectData));

//       // Toast container
//       let toastContainer = document.getElementById("toast-container");
//       if (!toastContainer) {
//         toastContainer = document.createElement("div");
//         toastContainer.id = "toast-container";
//         toastContainer.className =
//           "position-fixed top-0 end-0 p-3 d-flex flex-column align-items-end";
//         document.body.appendChild(toastContainer);
//       }

//       // Toast element
//       const toast = document.createElement("div");
//       toast.className =
//         "toast align-items-center text-black bg-yellow rounded-pill shadow mb-2 show";
//       toast.style.minWidth = "250px";
//       toast.innerHTML = `
//       <div class="d-flex justify-content-between align-items-center px-3 py-2">
//         <span>✅ Project saved successfully!</span>
//         <button type="button" class="btn-close btn-close-dark ms-2" data-bs-dismiss="toast"></button>
//       </div>
//     `;

//       toastContainer.appendChild(toast);

//       setTimeout(() => {
//         toast.remove();
//       }, 3000);
//     } catch (error) {
//       console.error("Error saving project:", error);
//       alert("Failed to save project. Please try again.");
//     }
//   };

//   // Reset canvas
//   const resetCanvas = async () => {
//     if (
//       !canvas ||
//       !window.confirm("Are you sure you want to reset all changes?")
//     )
//       return;

//     try {
//       if (canvas) {
//         canvas.clear();

//         if (template?.image) {
//           fabric.Image.fromURL(
//             template.image,
//             (img) => {
//               img.scaleToWidth(canvas.width);
//               canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
//               setIsLoading(false);
//             },
//             { crossOrigin: "anonymous" }
//           );
//         } else {
//           setIsLoading(false);
//         }
//       }
//     } catch (error) {
//       console.error("Error resetting canvas:", error);
//     }
//   };

//   // Delete selected object
//   const deleteSelected = () => {
//     if (!canvas) return;

//     const activeObject = canvas.getActiveObject();
//     if (activeObject) {
//       canvas.remove(activeObject);
//       canvas.renderAll();
//     }
//   };

//   return (
//     <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
//       {/* Header */}
//       <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
//         <div className="container-fluid">
//           <button
//             className="btn btn-outline-secondary d-flex align-items-center"
//             onClick={() => {
//               navigate(-1);
//             }}
//           >
//             <ArrowLeft className="me-2" size={20} />
//             Back to Templates
//           </button>

//           <h4 className="navbar-brand mb-0 mx-auto">
//             Editing: {template?.name || "Wedding Card"}
//           </h4>

//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-success d-flex align-items-center"
//               onClick={saveProject}
//             >
//               <Save className="me-1" size={16} />
//               Save
//             </button>
//             <button
//               className="btn btn-primary d-flex align-items-center"
//               onClick={exportCard}
//             >
//               <Download className="me-1" size={16} />
//               Export
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="container-fluid py-4">
//         <div className="row">
//           {/* Left Sidebar - Tools */}
//           <div className="col-xl-3 col-lg-4 mb-4">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="card-title mb-0 d-flex align-items-center">
//                   <Type className="me-2" size={20} />
//                   Design Tools
//                 </h5>
//               </div>
//               <div className="card-body">
//                 <div className="d-grid gap-3">
//                   {/* Add Elements */}
//                   <div>
//                     <h6>Add Elements</h6>
//                     <div className="d-grid gap-2">
//                       <button
//                         className="btn btn-outline-primary btn-sm"
//                         onClick={addText}
//                       >
//                         <Plus size={16} className="me-1" />
//                         Add Text
//                       </button>
//                       <button
//                         className="btn btn-outline-secondary btn-sm"
//                         onClick={addImage}
//                       >
//                         <Image size={16} className="me-1" />
//                         Add Image
//                       </button>
//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="d-none"
//                       />
//                     </div>
//                   </div>

//                   {/* Text Editing */}
//                   {activeText && (
//                     <>
//                       <hr />
//                       <div>
//                         <h6>Text Properties</h6>

//                         <div className="mb-3">
//                           <label className="form-label">Text Content</label>
//                           <textarea
//                             className="form-control"
//                             rows="3"
//                             value={textOptions.text}
//                             onChange={(e) => updateText("text", e.target.value)}
//                           />
//                         </div>

//                         <div className="mb-3">
//                           <label className="form-label">
//                             Font Size: {textOptions.fontSize}px
//                           </label>
//                           <input
//                             type="range"
//                             className="form-range"
//                             min="8"
//                             max="72"
//                             value={textOptions.fontSize}
//                             onChange={(e) =>
//                               updateText("fontSize", parseInt(e.target.value))
//                             }
//                           />
//                         </div>

//                         <div className="mb-3">
//                           <label className="form-label">Font Family</label>
//                           <select
//                             className="form-select"
//                             value={textOptions.fontFamily}
//                             onChange={(e) =>
//                               updateText("fontFamily", e.target.value)
//                             }
//                           >
//                             <option value="Arial">Arial</option>
//                             <option value="serif">Serif</option>
//                             <option value="sans-serif">Sans Serif</option>
//                             <option value="cursive">Cursive</option>
//                             <option value="fantasy">Fantasy</option>
//                             <option value="Times New Roman">
//                               Times New Roman
//                             </option>
//                             <option value="Georgia">Georgia</option>
//                             <option value="Helvetica">Helvetica</option>
//                           </select>
//                         </div>

//                         <div className="mb-3">
//                           <label className="form-label">Text Color</label>
//                           <input
//                             type="color"
//                             className="form-control form-control-color w-100"
//                             value={textOptions.color}
//                             onChange={(e) => updateText("fill", e.target.value)}
//                           />
//                         </div>

//                         <div className="mb-3">
//                           <label className="form-label">Style</label>
//                           <div className="d-flex gap-2">
//                             <button
//                               className={`btn btn-sm ${
//                                 textOptions.fontWeight === "bold"
//                                   ? "btn-primary"
//                                   : "btn-outline-primary"
//                               }`}
//                               onClick={() =>
//                                 updateText(
//                                   "fontWeight",
//                                   textOptions.fontWeight === "bold"
//                                     ? "normal"
//                                     : "bold"
//                                 )
//                               }
//                             >
//                               <strong>B</strong>
//                             </button>
//                             <button
//                               className={`btn btn-sm ${
//                                 textOptions.fontStyle === "italic"
//                                   ? "btn-primary"
//                                   : "btn-outline-primary"
//                               }`}
//                               onClick={() =>
//                                 updateText(
//                                   "fontStyle",
//                                   textOptions.fontStyle === "italic"
//                                     ? "normal"
//                                     : "italic"
//                                 )
//                               }
//                             >
//                               <em>I</em>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   <hr />

//                   {/* Actions */}
//                   <div>
//                     <h6>Actions</h6>
//                     <div className="d-grid gap-2">
//                       <button
//                         className="btn btn-warning btn-sm"
//                         onClick={resetCanvas}
//                       >
//                         <RotateCcw className="me-1" size={16} />
//                         Reset Canvas
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={deleteSelected}
//                       >
//                         Delete Selected
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Canvas Area */}
//           <div className="col-xl-6 col-lg-8 mb-4">
//             <div className="card">
//               <div
//                 className="card-body d-flex justify-content-center align-items-center position-relative"
//                 style={{ minHeight: "750px" }}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//               >
//                 <canvas
//                   ref={canvasRef}
//                   style={{
//                     border: "2px solid #dee2e6",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//                     maxWidth: "100%",
//                     height: "auto",
//                   }}
//                 />
//                 {isLoading && (
//                   <div
//                     className="position-absolute top-50 start-50 translate-middle text-center bg-white bg-opacity-75 p-4 rounded"
//                     style={{ zIndex: 2 }}
//                   >
//                     <div
//                       className="spinner-border text-primary mb-3"
//                       role="status"
//                     >
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                     <p className="mb-0">Loading template...</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Sidebar - Info & Quick Actions */}
//           <div className="col-xl-3 d-none d-xl-block">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="card-title mb-0 d-flex align-items-center">
//                   <Palette className="me-2" size={20} />
//                   Template Info
//                 </h5>
//               </div>
//               <div className="card-body">
//                 <div className="mb-3">
//                   <img
//                     src={template?.image}
//                     alt={template?.name}
//                     className="img-fluid rounded"
//                     style={{
//                       maxHeight: "150px",
//                       objectFit: "cover",
//                       width: "100%",
//                     }}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <h6>{template?.name}</h6>
//                   <p className="text-muted small mb-1">
//                     <strong>Theme:</strong> {template?.theme}
//                   </p>
//                   <p className="text-muted small mb-1">
//                     <strong>Culture:</strong> {template?.culture}
//                   </p>
//                   <p className="text-muted small mb-0">
//                     <strong>Rating:</strong> ⭐ {template?.rating}
//                   </p>
//                 </div>

//                 <hr />

//                 <div>
//                   <h6>Quick Tips</h6>
//                   <ul className="small text-muted">
//                     <li>Double-click text to edit directly</li>
//                     <li>Drag objects to reposition</li>
//                     <li>Use corner handles to resize</li>
//                     <li>Select objects to modify properties</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardEditor;

import React, { useState, useEffect, useRef } from "react";
import { Download, Type, ZoomIn, ZoomOut, Save, RotateCcw } from "lucide-react";

// Sample template data (comes from your backend)
const SAMPLE_TEMPLATE = {
  id: "template_001",
  name: "Elegant Wedding Invitation",
  backgroundUrl:
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=700&fit=crop",
  editableFields: [
    {
      id: "field_1",
      label: "Couple Names",
      defaultText: "John & Priya",
      x: 175,
      y: 150,
      fontSize: 36,
      color: "#ffffff",
      fontFamily: "serif",
      minFontSize: 20,
      maxFontSize: 60,
    },
    {
      id: "field_2",
      label: "Wedding Date",
      defaultText: "December 25, 2024",
      x: 175,
      y: 300,
      fontSize: 24,
      color: "#f0e6d2",
      fontFamily: "Georgia",
      minFontSize: 14,
      maxFontSize: 40,
    },
    {
      id: "field_3",
      label: "Venue",
      defaultText: "The Grand Palace, Mumbai",
      x: 175,
      y: 500,
      fontSize: 20,
      color: "#ffffff",
      fontFamily: "Arial",
      minFontSize: 12,
      maxFontSize: 32,
    },
  ],
};

const CardEditor = () => {
  const canvasRef = useRef(null);
  const backgroundImageRef = useRef(null);
  const [template, setTemplate] = useState(SAMPLE_TEMPLATE);
  const [userFields, setUserFields] = useState([]);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, fontSize: 0 });

  // Initialize user fields from template
  useEffect(() => {
    const fields = template.editableFields.map((field) => ({
      ...field,
      text: field.defaultText,
    }));
    setUserFields(fields);
  }, [template]);

  // Load background image
  useEffect(() => {
    if (!template.backgroundUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      backgroundImageRef.current = img;
      renderCanvas();
    };
    img.src = template.backgroundUrl;
  }, [template.backgroundUrl]);

  // Render canvas whenever fields change
  useEffect(() => {
    renderCanvas();
  }, [userFields, selectedFieldIndex]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImageRef.current) {
      ctx.drawImage(
        backgroundImageRef.current,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw all text fields
    userFields.forEach((field, index) => {
      ctx.fillStyle = field.color;
      ctx.font = `${field.fontSize}px ${field.fontFamily}`;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Draw text
      ctx.fillText(field.text, field.x, field.y);

      // Draw selection box if selected
      if (index === selectedFieldIndex) {
        const metrics = ctx.measureText(field.text);
        const textWidth = metrics.width;
        const textHeight = field.fontSize * 1.2;

        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          field.x - 5,
          field.y - 5,
          textWidth + 10,
          textHeight + 10
        );
        ctx.setLineDash([]);

        // Draw resize handle (bottom-right corner)
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(field.x + textWidth + 5, field.y + textHeight - 5, 10, 10);
      }
    });
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getFieldAtPosition = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    for (let i = userFields.length - 1; i >= 0; i--) {
      const field = userFields[i];
      ctx.font = `${field.fontSize}px ${field.fontFamily}`;
      const metrics = ctx.measureText(field.text);
      const textWidth = metrics.width;
      const textHeight = field.fontSize * 1.2;

      if (
        x >= field.x - 5 &&
        x <= field.x + textWidth + 10 &&
        y >= field.y - 5 &&
        y <= field.y + textHeight + 10
      ) {
        return i;
      }
    }
    return null;
  };

  const isOnResizeHandle = (x, y, fieldIndex) => {
    if (fieldIndex === null) return false;
    const field = userFields[fieldIndex];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.font = `${field.fontSize}px ${field.fontFamily}`;
    const metrics = ctx.measureText(field.text);
    const textWidth = metrics.width;
    const textHeight = field.fontSize * 1.2;

    const handleX = field.x + textWidth + 5;
    const handleY = field.y + textHeight - 5;

    return (
      x >= handleX && x <= handleX + 10 && y >= handleY && y <= handleY + 10
    );
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    const fieldIndex = getFieldAtPosition(pos.x, pos.y);

    if (fieldIndex !== null) {
      setSelectedFieldIndex(fieldIndex);

      // Check if clicking on resize handle
      if (isOnResizeHandle(pos.x, pos.y, fieldIndex)) {
        setIsResizing(true);
        setResizeStart({
          x: pos.x,
          fontSize: userFields[fieldIndex].fontSize,
        });
      } else {
        // Start dragging
        setIsDragging(true);
        setDragOffset({
          x: pos.x - userFields[fieldIndex].x,
          y: pos.y - userFields[fieldIndex].y,
        });
      }
    } else {
      setSelectedFieldIndex(null);
    }
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);

    if (isResizing && selectedFieldIndex !== null) {
      const field = userFields[selectedFieldIndex];
      const deltaX = pos.x - resizeStart.x;
      const fontSizeChange = Math.round(deltaX / 5); // 5px mouse movement = 1px font size
      let newFontSize = resizeStart.fontSize + fontSizeChange;

      // Clamp to min/max
      newFontSize = Math.max(
        field.minFontSize,
        Math.min(field.maxFontSize, newFontSize)
      );

      const updated = [...userFields];
      updated[selectedFieldIndex] = { ...field, fontSize: newFontSize };
      setUserFields(updated);
    } else if (isDragging && selectedFieldIndex !== null) {
      const newX = pos.x - dragOffset.x;
      const newY = pos.y - dragOffset.y;

      const updated = [...userFields];
      updated[selectedFieldIndex] = {
        ...updated[selectedFieldIndex],
        x: Math.max(0, Math.min(canvasRef.current.width - 50, newX)),
        y: Math.max(0, Math.min(canvasRef.current.height - 50, newY)),
      };
      setUserFields(updated);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const updateFieldText = (index, newText) => {
    const updated = [...userFields];
    updated[index] = { ...updated[index], text: newText };
    setUserFields(updated);
  };

  const updateFieldFontSize = (index, delta) => {
    const field = userFields[index];
    let newSize = field.fontSize + delta;
    newSize = Math.max(field.minFontSize, Math.min(field.maxFontSize, newSize));

    const updated = [...userFields];
    updated[index] = { ...updated[index], fontSize: newSize };
    setUserFields(updated);
  };

  const resetToDefaults = () => {
    if (window.confirm("Reset all changes to default?")) {
      const fields = template.editableFields.map((field) => ({
        ...field,
        text: field.defaultText,
      }));
      setUserFields(fields);
      setSelectedFieldIndex(null);
    }
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png", 1.0);

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${template.name.replace(/\s+/g, "-")}-customized.png`;
    link.click();
  };

  const saveCustomization = () => {
    // This would send to your backend
    const customizationData = {
      templateId: template.id,
      customFields: userFields.map((f) => ({
        id: f.id,
        text: f.text,
        fontSize: f.fontSize,
        x: f.x,
        y: f.y,
      })),
    };

    alert("Customization saved! (Check console for data)");
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h4">
            <Type className="me-2" size={24} />
            Customize Your Invitation
          </span>
          <div className="d-flex gap-2">
            <button className="btn btn-light btn-sm" onClick={resetToDefaults}>
              <RotateCcw size={16} className="me-1" />
              Reset
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={saveCustomization}
            >
              <Save size={16} className="me-1" />
              Save
            </button>
            <button className="btn btn-warning btn-sm" onClick={exportAsImage}>
              <Download size={16} className="me-1" />
              Download
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Left Panel - Text Editor */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Edit Text Fields</h5>
              </div>
              <div className="card-body">
                {userFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`mb-4 p-3 border rounded ${selectedFieldIndex === index
                        ? "border-primary bg-light"
                        : ""
                      }`}
                    onClick={() => setSelectedFieldIndex(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <label className="form-label fw-bold">{field.label}</label>

                    <textarea
                      className="form-control mb-2"
                      rows="2"
                      value={field.text}
                      onChange={(e) => updateFieldText(index, e.target.value)}
                      placeholder={field.defaultText}
                    />

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFieldFontSize(index, -2);
                        }}
                      >
                        <ZoomOut size={16} />
                      </button>

                      <span className="badge bg-secondary px-3">
                        {field.fontSize}px
                      </span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFieldFontSize(index, 2);
                        }}
                      >
                        <ZoomIn size={16} />
                      </button>

                      <input
                        type="range"
                        className="form-range flex-grow-1"
                        min={field.minFontSize}
                        max={field.maxFontSize}
                        value={field.fontSize}
                        onChange={(e) => {
                          const updated = [...userFields];
                          updated[index] = {
                            ...updated[index],
                            fontSize: parseInt(e.target.value),
                          };
                          setUserFields(updated);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="mt-2 small text-muted">
                      Font: {field.fontFamily} | Color: {field.color}
                    </div>
                  </div>
                ))}

                <div className="alert alert-info small">
                  <strong>💡 Tips:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Click text on canvas to select</li>
                    <li>Drag text to move position</li>
                    <li>Drag blue square to resize</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Canvas Preview */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Live Preview</h5>
              </div>
              <div className="card-body text-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={700}
                  className="border rounded shadow"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    cursor: isDragging
                      ? "grabbing"
                      : isResizing
                        ? "nwse-resize"
                        : "grab",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />

                {selectedFieldIndex !== null && (
                  <div className="alert alert-primary mt-3 text-start">
                    <strong>Selected:</strong>{" "}
                    {userFields[selectedFieldIndex].label}
                    <div className="mt-2 small">
                      Position: ({Math.round(userFields[selectedFieldIndex].x)},{" "}
                      {Math.round(userFields[selectedFieldIndex].y)}) | Size:{" "}
                      {userFields[selectedFieldIndex].fontSize}px
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
