// import React, { useState, useRef, useCallback, useEffect } from "react";
// import { FiUpload, FiX } from "react-icons/fi";

// const PhotoGallery = ({ images = [], onImagesChange, onSave }) => {
//   const [localImages, setLocalImages] = useState(images);
//   const fileInputRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     processFiles(files);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const files = Array.from(e.dataTransfer.files);
//     processFiles(files);
//   };

//   const processFiles = useCallback(
//     (files) => {
//       const newImages = files
//         .filter((file) => file.type.startsWith("image/"))
//         .slice(0, 8 - localImages.length)
//         .map((file) => ({
//           id: Math.random().toString(36).substr(2, 9),
//           file,
//           preview: URL.createObjectURL(file),
//           title: "",
//         }));

//       setLocalImages((prev) => [...prev, ...newImages]);
//     },
//     [localImages]
//   );

//   const handleTitleChange = (id, value) => {
//     setLocalImages((prev) =>
//       prev.map((img) => (img.id === id ? { ...img, title: value } : img))
//     );
//   };

//   const handleRemoveImage = (id) => {
//     setLocalImages((prev) => prev.filter((img) => img.id !== id));
//   };

//   // Sync down from parent when prop changes
//   useEffect(() => {
//     setLocalImages(images || []);
//   }, [images]);

//   // Notify parent on change
//   useEffect(() => {
//     onImagesChange && onImagesChange(localImages);
//   }, [localImages, onImagesChange]);

//   return (
//     <div className="container my-5">
//       {/* Upload Card */}
//       <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
//         <div className="card-body p-4 p-md-5">
//           <h3 className="mb-4 text-center text-gradient">
//             <span className="primary-text">
//               Upload your best photos to showcase your work
//             </span>
//           </h3>

//           {/* Drag & Drop Area */}
//           <div
//             className={`border-2 border-dashed rounded-4 p-5 text-center ${
//               isDragging ? "border-primary bg-blue-10" : "border-gray-300"
//             }`}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//           >
//             {/* <FiUpload className="h1 text-muted mb-3" /> */}
//             <svg
//               width="151px"
//               height="151px"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="h1 text-muted mb-3"
//             >
//               <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//               <g
//                 id="SVGRepo_tracerCarrier"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               ></g>
//               <g id="SVGRepo_iconCarrier">
//                 {" "}
//                 <circle
//                   cx="12"
//                   cy="13"
//                   r="3"
//                   stroke="#1C274C"
//                   strokeWidth="1.5"
//                 ></circle>{" "}
//                 <path
//                   d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.27068 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18"
//                   stroke="#1C274C"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 ></path>{" "}
//                 <path
//                   d="M19 10H18"
//                   stroke="#1C274C"
//                   strokeWidth="1.5"
//                   strokeLinecap="round"
//                 ></path>{" "}
//               </g>
//             </svg>
//             <h5 className="mb-2">Drag & Drop images here</h5>
//             <p className="text-muted mb-3">or</p>

//             <button
//               className="btn btn-primary px-4 rounded-pill fw-medium"
//               style={{
//                 background: "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)",
//               }}
//               onClick={handleButtonClick}
//               disabled={localImages.length >= 8}
//             >
//               Browse Files
//             </button>
//             <p className="small text-muted mt-2 mb-0">
//               JPG, PNG up to 1MB (Max 8 images)
//             </p>

//             {localImages.length >= 8 && (
//               <div className="mt-3 text-danger">
//                 Maximum of 8 images reached
//               </div>
//             )}
//           </div>

//           <input
//             type="file"
//             ref={fileInputRef}
//             multiple
//             accept="image/*"
//             onChange={handleFileChange}
//             className="d-none"
//           />

//           {/* Preview Section */}
//           {localImages.length > 0 && (
//             <div className="mt-5">
//               <h4 className="mb-4">Preview Images</h4>
//               <div className="row g-4">
//                 {localImages.map((image) => (
//                   <div key={image.id} className="col-md-3 col-6">
//                     <div className="card border-0 shadow-sm h-100">
//                       <div className="position-relative">
//                         <img
//                           src={image.preview}
//                           alt="Preview"
//                           className="card-img-top object-fit-cover"
//                           style={{ height: "150px" }}
//                         />
//                         <button
//                           className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
//                           onClick={() => handleRemoveImage(image.id)}
//                         >
//                           <FiX size={16} />
//                         </button>
//                       </div>
//                       <div className="card-body">
//                         <input
//                           type="text"
//                           className="form-control border-0 border-bottom rounded-0 px-0"
//                           placeholder="Image title"
//                           value={image.title}
//                           onChange={(e) =>
//                             handleTitleChange(image.id, e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <button
//         className="btn btn-primary mt-4"
//         onClick={onSave}
//         // disabled={!onSave}
//       >
//         Save Gallery
//       </button>
//     </div>
//   );
// };

// export default PhotoGallery;



import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiX } from "react-icons/fi";

const PhotoGallery = ({ images = [], onImagesChange, onSave }) => {
  const [localImages, setLocalImages] = useState(images);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Browse button click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // File input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // Process uploaded files
  const processFiles = useCallback((files) => {
    setLocalImages((prev) => {
      const newImages = files
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, 8 - prev.length)
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      return [...prev, ...newImages];
    });
  }, []);

  // Remove an image
  const handleRemoveImage = (index) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Sync images from parent prop
  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  // Notify parent on change
  useEffect(() => {
    onImagesChange && onImagesChange(localImages);
  }, [localImages, onImagesChange]);

  // Prepare media array for save
  const handleSave = () => {
    const media = localImages.map((img) => img.file || img.preview || img.url);
    onSave(media);
  };

  return (
    <div className="container my-5">
      {/* Upload Card */}
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h3 className="mb-4 text-center text-gradient">
            <span className="primary-text">
              Upload your best photos to showcase your work
            </span>
          </h3>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-4 p-5 text-center ${isDragging ? "border-primary bg-blue-10" : "border-gray-300"
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h5 className="mb-2">Drag & Drop images here</h5>
            <p className="text-muted mb-3">or</p>

            <button
              className="btn btn-primary px-4 rounded-pill fw-medium"
              style={{ background: "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)" }}
              onClick={handleButtonClick}
              disabled={localImages.length >= 8}
            >
              Browse Files
            </button>
            <p className="small text-muted mt-2 mb-0">
              JPG, PNG up to 1MB (Max 8 images)
            </p>

            {localImages.length >= 8 && <div className="mt-3 text-danger">Maximum of 8 images reached</div>}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />

          {/* Preview Section */}
          {localImages.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-4">Preview Images</h4>
              <div className="row g-4">
                {localImages.map((image, index) => (
                  <div key={index} className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="position-relative">
                        <img
                          src={image.preview || image.url}
                          alt="Preview"
                          className="card-img-top object-fit-cover"
                          style={{ height: "150px" }}
                        />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSave}>
        Save Gallery
      </button>
    </div>
  );
};

export default PhotoGallery;
