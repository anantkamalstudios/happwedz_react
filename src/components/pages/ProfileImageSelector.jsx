import React, { useState, useRef } from "react";
import { IoCameraOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileImageSelector = () => {
  const navigate = useNavigate();

  // Refs for file inputs
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // State variables for image selection
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  // State variables for makeup styling
  const [selectedCategory, setSelectedCategory] = useState("makeup");
  const [selectedProducts, setSelectedProducts] = useState({
    lipstick: null,
    blush: null,
    eyeshadow: null,
    foundation: null,
  });
  const [selectedDress, setSelectedDress] = useState(null);
  const [selectedLook, setSelectedLook] = useState(null);

  // Color scheme
  const colors = {
    primaryPink: "#ed1173",
    lightPink: "#fce4ec",
    mediumPink: "#f8bbd9",
    darkPink: "#ad1457",
    grey: "#62565b",
    white: "#ffffff",
    lightGrey: "#f8f4f6",
    darkGrey: "#333333",
    primary: "#ed1173",
    lightBg: "#fafafa",
    lightText: "#666666",
    border: "#e0e0e0",
  };

  const makeupProducts = {
    lipstick: [
      {
        id: 1,
        name: "Matte Red",
        color: "#dc3545",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/lipstick/red-lipstick.png",
      },
      {
        id: 2,
        name: "Pink Gloss",
        color: "#e91e63",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/lipstick/pink-lipstick.png",
      },
      {
        id: 3,
        name: "Coral Matte",
        color: "#ff5722",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/lipstick/coral-lipstick.png",
      },
      {
        id: 4,
        name: "Berry Bold",
        color: "#9c27b0",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/lipstick/berry-lipstick.png",
      },
    ],
    blush: [
      {
        id: 1,
        name: "Peachy Glow",
        color: "#ffab91",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/blush/peach-blush.png",
      },
      {
        id: 2,
        name: "Rose Blush",
        color: "#f8bbd9",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/blush/rose-blush.png",
      },
      {
        id: 3,
        name: "Coral Flush",
        color: "#ff8a65",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/blush/coral-blush.png",
      },
      {
        id: 4,
        name: "Pink Pop",
        color: "#f48fb1",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/blush/pink-blush.png",
      },
    ],
    eyeshadow: [
      {
        id: 1,
        name: "Smoky Gray",
        color: "#616161",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/eyeshadow/gray-eyeshadow.png",
      },
      {
        id: 2,
        name: "Gold Shimmer",
        color: "#ffd54f",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/eyeshadow/gold-eyeshadow.png",
      },
      {
        id: 3,
        name: "Rose Gold",
        color: "#ffab91",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/eyeshadow/rosegold-eyeshadow.png",
      },
      {
        id: 4,
        name: "Purple Haze",
        color: "#ba68c8",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/eyeshadow/purple-eyeshadow.png",
      },
    ],
    foundation: [
      {
        id: 1,
        name: "Light Beige",
        color: "#f5deb3",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/foundation/light-foundation.png",
      },
      {
        id: 2,
        name: "Medium Tan",
        color: "#deb887",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/foundation/medium-foundation.png",
      },
      {
        id: 3,
        name: "Warm Honey",
        color: "#d2691e",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/foundation/honey-foundation.png",
      },
      {
        id: 4,
        name: "Deep Caramel",
        color: "#a0522d",
        image:
          "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/foundation/deep-foundation.png",
      },
    ],
  };

  const dresses = [
    {
      id: 1,
      name: "Elegant Evening",
      color: "#000",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/dresses/black-dress.png",
    },
    {
      id: 2,
      name: "Summer Dress",
      color: "#4caf50",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/dresses/green-dress.png",
    },
    {
      id: 3,
      name: "Cocktail Dress",
      color: "#e91e63",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/dresses/pink-dress.png",
    },
    {
      id: 4,
      name: "Blazer",
      color: "#3f51b5",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/dresses/blazer.png",
    },
  ];

  const wholeLooks = [
    {
      id: 1,
      name: "Glamorous Night Out",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/looks/night-out.png",
      description: "Bold makeup + Evening dress",
    },
    {
      id: 2,
      name: "Natural Day Look",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/looks/day-look.png",
      description: "Subtle makeup + Casual wear",
    },
    {
      id: 3,
      name: "Professional Chic",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/looks/professional.png",
      description: "Clean makeup + Business attire",
    },
    {
      id: 4,
      name: "Romantic Date",
      image:
        "https://cdn.jsdelivr.net/gh/afnizarnur/drawish@master/products/looks/romantic.png",
      description: "Soft makeup + Elegant dress",
    },
  ];

  // Image selection handlers
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setShowEditModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    setShowInstructionsModal(false);
    fileInputRef.current.click();
  };

  const triggerEditFileInput = () => editFileInputRef.current.click();

  const openImageOptions = () => {
    setShowInstructionsModal(true);
  };

  // Camera handling functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCameraModal(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Unable to access camera. Please make sure you have given camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      const imageDataURL = canvas.toDataURL("image/jpeg");
      setSelectedImage(imageDataURL);
      stopCamera();
    }
  };

  // Makeup styling handlers
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Reset selections when switching categories
    if (category === "makeup") {
      setSelectedDress(null);
      setSelectedLook(null);
    } else if (category === "dress") {
      setSelectedProducts({
        lipstick: null,
        blush: null,
        eyeshadow: null,
        foundation: null,
      });
      setSelectedLook(null);
    } else if (category === "whole") {
      setSelectedProducts({
        lipstick: null,
        blush: null,
        eyeshadow: null,
        foundation: null,
      });
      setSelectedDress(null);
    }
  };

  const handleProductSelect = (productType, product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productType]: prev[productType]?.id === product.id ? null : product,
    }));
  };

  const hasAnySelection = () => {
    if (selectedCategory === "makeup") {
      return Object.values(selectedProducts).some(
        (product) => product !== null
      );
    } else if (selectedCategory === "dress") {
      return selectedDress !== null;
    } else if (selectedCategory === "whole") {
      return selectedLook !== null;
    }
    return false;
  };

  const handleApply = () => {
    navigate("/finallook", {
      state: {
        selectedImage,
        selectedProducts,
        selectedDress,
        selectedLook,
      },
    });
  };

  return (
    <>
      <div className="msp-container">
        <style jsx>{`
          .msp-container {
            min-height: 100vh;
            background: ${colors.white};
            font-family: "Helvetica Neue", Arial, sans-serif;
            color: ${colors.darkGrey};
            line-height: 1.6;
          }

          .msp-main-wrapper {
            max-width: 1400px;
            margin: 0 auto;
            background: ${colors.white};
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
          }

          .msp-header {
            background: ${colors.white};
            padding: 25px 30px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .msp-header h2 {
            margin: 0;
            font-weight: 500;
            font-size: 1.8rem;
            color: ${colors.darkGrey};
          }

          .msp-content {
            display: flex;
            min-height: calc(100vh - 120px);
          }

          .msp-left-panel {
            flex: 0 0 380px;
            background: ${colors.lightGrey};
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            border-right: 1px solid rgba(0, 0, 0, 0.05);
          }

          .msp-profile-container {
            width: 100%;
          }

          .msp-profile-image {
            width: 100%;
            height: 400px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            background: ${colors.white};
            position: relative;
            margin-bottom: 20px;
          }

          .msp-profile-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .msp-edit-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: ${colors.white};
            color: ${colors.primaryPink};
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10;
            transition: all 0.2s ease;
          }

          .msp-edit-btn:hover {
            transform: scale(1.05);
          }

          .msp-profile-label {
            text-align: center;
            margin-top: 10px;
            color: ${colors.grey};
            font-weight: 500;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .msp-upload-options {
            margin-top: 20px;
            width: 100%;
          }

          .msp-option-card {
            background: ${colors.white};
            border: 1px solid ${colors.border};
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
          }

          .msp-option-card:hover {
            border-color: ${colors.primary};
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
          }

          .msp-option-icon {
            font-size: 24px;
            margin-bottom: 12px;
            color: ${colors.primary};
          }

          .msp-option-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
            color: ${colors.darkText};
          }

          .msp-option-desc {
            font-size: 12px;
            color: ${colors.lightText};
          }

          .msp-right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: ${colors.white};
          }

          .msp-category-tabs {
            display: flex;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            background: ${colors.white};
            padding: 0 30px;
          }

          .msp-category-tab {
            padding: 20px 25px;
            text-align: center;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            font-size: 1rem;
            color: ${colors.grey};
            transition: all 0.2s ease;
            position: relative;
            border-bottom: 2px solid transparent;
          }

          .msp-category-tab:hover {
            color: ${colors.primaryPink};
          }

          .msp-category-tab.active {
            color: ${colors.primaryPink};
            border-bottom: 2px solid ${colors.primaryPink};
          }

          .msp-selection-area {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
            max-height: calc(100vh - 180px);
            overflow-y: auto;
          }

          .msp-section-title {
            color: ${colors.darkGrey};
            font-weight: 500;
            font-size: 1.2rem;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          }

          .msp-products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
          }

          .msp-product-card {
            background: ${colors.white};
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
          }

          .msp-product-image {
            height: 120px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
          }

          .msp-product-image img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
          }

          .msp-product-name {
            font-weight: 500;
            color: ${colors.darkGrey};
            font-size: 0.9rem;
            margin-bottom: 8px;
          }

          .msp-product-color {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 1px solid rgba(0, 0, 0, 0.1);
          }

          .msp-product-card:hover {
            border-color: ${colors.primaryPink};
            box-shadow: 0 5px 15px rgba(237, 17, 115, 0.1);
            transform: translateY(-2px);
          }

          .msp-product-card.selected {
            border-color: ${colors.primaryPink};
            background: rgba(237, 17, 115, 0.03);
            box-shadow: 0 5px 15px rgba(237, 17, 115, 0.1);
          }

          .msp-look-card {
            background: ${colors.white};
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 8px;
            padding: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 15px;
          }

          .msp-look-image {
            width: 80px;
            height: 80px;
            border-radius: 6px;
            overflow: hidden;
            margin-right: 20px;
            flex-shrink: 0;
          }

          .msp-look-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .msp-look-info {
            flex: 1;
          }

          .msp-look-name {
            font-weight: 500;
            color: ${colors.darkGrey};
            font-size: 1rem;
            margin-bottom: 5px;
          }

          .msp-look-description {
            color: ${colors.grey};
            font-size: 0.9rem;
          }

          .msp-look-card:hover {
            border-color: ${colors.primaryPink};
            box-shadow: 0 5px 15px rgba(237, 17, 115, 0.1);
          }

          .msp-look-card.selected {
            border-color: ${colors.primaryPink};
            background: rgba(237, 17, 115, 0.03);
          }

          .msp-apply-button {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors.primaryPink};
            border: none;
            color: ${colors.white};
            padding: 14px 30px;
            border-radius: 6px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 1001;
          }

          /* Apply button is conditionally rendered in React when there is a selection */

          .msp-apply-button:hover {
            background: ${colors.darkPink};
            box-shadow: 0 5px 15px rgba(237, 17, 115, 0.3);
          }

          .msp-apply-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          /* Camera Modal Styles */
          .msp-camera-modal {
            background: #000;
            width: 100%;
            max-width: 640px;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
          }

          .msp-camera-content {
            position: relative;
            aspect-ratio: 4/3;
            background: #000;
          }

          .msp-camera-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .msp-camera-controls {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 20px;
            padding: 0 20px;
          }

          .msp-camera-button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid #fff;
            color: #fff;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .msp-camera-button:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .msp-camera-button.capture {
            background: #fff;
            color: #000;
          }

          .msp-camera-button.capture:hover {
            transform: scale(1.1);
          }

          /* Modal Styles */
          .msp-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .msp-modal {
            background: white;
            padding: 32px;
            border-radius: 12px;
            width: 400px;
            max-width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            text-align: center;
          }

          .msp-modal-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
            color: ${colors.darkGrey};
          }

          .msp-modal-text {
            color: ${colors.grey};
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .msp-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
          }

          .msp-btn-primary,
          .msp-btn-secondary {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
            font-size: 14px;
          }

          .msp-btn-primary {
            background: ${colors.primaryPink};
            color: white;
          }

          .msp-btn-primary:hover {
            background: ${colors.darkPink};
          }

          .msp-btn-secondary {
            background: #f8f9fa;
            color: #495057;
            border: 1px solid #e9ecef;
          }

          .msp-btn-secondary:hover {
            background: #e9ecef;
          }

          .msp-instructions-modal {
            background: white;
            padding: 40px;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          .msp-instructions-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 24px;
            text-align: center;
            color: ${colors.darkText};
          }

          .msp-instructions-content {
            margin-bottom: 32px;
          }

          .msp-instructions-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 32px;
          }

          .msp-instructions-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 24px;
          }

          .msp-tip-item {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .msp-tip-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .msp-tip-check {
            color: #28a745;
          }

          .msp-tip-cross {
            color: #dc3545;
          }

          .msp-tip-text {
            font-size: 14px;
            color: ${colors.darkText};
          }

          /* Responsive Design */
          @media (max-width: 1024px) {
            .msp-left-panel {
              flex: 0 0 320px;
              padding: 20px;
            }

            .msp-profile-image {
              height: 350px;
            }

            .msp-category-tabs {
              padding: 0 20px;
            }

            .msp-category-tab {
              padding: 18px 20px;
            }

            .msp-selection-area {
              padding: 20px;
            }

            .msp-products-grid {
              grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
              gap: 20px;
            }
          }

          @media (max-width: 768px) {
            .msp-content {
              flex-direction: column;
            }

            .msp-left-panel {
              flex: none;
              padding: 20px;
              border-right: none;
              border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }

            .msp-profile-image {
              width: 280px;
              height: 350px;
              margin: 0 auto;
            }

            .msp-category-tabs {
              flex-wrap: wrap;
              padding: 0;
            }

            .msp-category-tab {
              flex: 1;
              min-width: 120px;
              padding: 15px;
              font-size: 0.9rem;
            }

            .msp-products-grid {
              grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
              gap: 15px;
            }

            .msp-product-image {
              height: 100px;
            }
          }

          @media (max-width: 480px) {
            .msp-header {
              padding: 20px;
            }

            .msp-header h2 {
              font-size: 1.5rem;
            }

            .msp-profile-image {
              width: 100%;
              height: 280px;
            }

            .msp-category-tab {
              min-width: 100px;
              padding: 12px 10px;
              font-size: 0.85rem;
            }

            .msp-products-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }

            .msp-product-card {
              padding: 12px;
            }

            .msp-product-image {
              height: 90px;
            }

            .msp-look-card {
              flex-direction: column;
              text-align: center;
            }

            .msp-look-image {
              margin-right: 0;
              margin-bottom: 15px;
            }

            .msp-modal-buttons {
              flex-direction: column;
            }
          }
        `}</style>

        <div className="msp-main-wrapper">
          <div className="msp-header">
            <h2>Create Your Look</h2>
          </div>

          <div className="msp-content">
            <div className="msp-left-panel">
              <div className="msp-profile-container">
                <div className="msp-profile-image">
                  {selectedImage ? (
                    <>
                      <img src={selectedImage} alt="Profile" />
                      <button
                        className="msp-edit-btn"
                        onClick={() => setShowEditModal(true)}
                      >
                        ✏
                      </button>
                    </>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        flexDirection: "column",
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src="/images/npProfile.png"
                        alt="Default Profile"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginBottom: "16px",
                          background: "#eee",
                        }}
                      />
                      <p>Upload your photo to get started</p>
                    </div>
                  )}
                </div>

                <div className="msp-profile-label">Your Style Canvas</div>

                <div className="msp-upload-options">
                  <div className="msp-option-card" onClick={openImageOptions}>
                    <div className="msp-option-icon">
                      <IoCloudUploadOutline />
                    </div>
                    <div className="msp-option-title">Upload Photo</div>
                    <div className="msp-option-desc">
                      Select an image from your device
                    </div>
                  </div>

                  <div className="msp-option-card" onClick={startCamera}>
                    <div className="msp-option-icon">
                      <IoCameraOutline />
                    </div>
                    <div className="msp-option-title">Live Camera</div>
                    <div className="msp-option-desc">
                      Capture a new photo with your camera
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="msp-right-panel">
              <div className="msp-category-tabs">
                <button
                  className={`msp-category-tab ${
                    selectedCategory === "makeup" ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect("makeup")}
                >
                  Makeup
                </button>
                <button
                  className={`msp-category-tab ${
                    selectedCategory === "dress" ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect("dress")}
                >
                  Dress
                </button>
                <button
                  className={`msp-category-tab ${
                    selectedCategory === "whole" ? "active" : ""
                  }`}
                  onClick={() => handleCategorySelect("whole")}
                >
                  Complete Looks
                </button>
              </div>

              <div className="msp-selection-area">
                {selectedCategory === "makeup" && (
                  <>
                    <div className="msp-section-title">Lipstick</div>
                    <div className="msp-products-grid">
                      {makeupProducts.lipstick.map((product) => (
                        <div
                          key={product.id}
                          className={`msp-product-card ${
                            selectedProducts.lipstick?.id === product.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleProductSelect("lipstick", product)
                          }
                        >
                          <div className="msp-product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="msp-product-name">{product.name}</div>
                          <span
                            className="msp-product-color"
                            style={{ backgroundColor: product.color }}
                          ></span>
                        </div>
                      ))}
                    </div>

                    <div className="msp-section-title">Blush</div>
                    <div className="msp-products-grid">
                      {makeupProducts.blush.map((product) => (
                        <div
                          key={product.id}
                          className={`msp-product-card ${
                            selectedProducts.blush?.id === product.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleProductSelect("blush", product)}
                        >
                          <div className="msp-product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="msp-product-name">{product.name}</div>
                          <span
                            className="msp-product-color"
                            style={{ backgroundColor: product.color }}
                          ></span>
                        </div>
                      ))}
                    </div>

                    <div className="msp-section-title">Eyeshadow</div>
                    <div className="msp-products-grid">
                      {makeupProducts.eyeshadow.map((product) => (
                        <div
                          key={product.id}
                          className={`msp-product-card ${
                            selectedProducts.eyeshadow?.id === product.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleProductSelect("eyeshadow", product)
                          }
                        >
                          <div className="msp-product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="msp-product-name">{product.name}</div>
                          <span
                            className="msp-product-color"
                            style={{ backgroundColor: product.color }}
                          ></span>
                        </div>
                      ))}
                    </div>

                    <div className="msp-section-title">Foundation</div>
                    <div className="msp-products-grid">
                      {makeupProducts.foundation.map((product) => (
                        <div
                          key={product.id}
                          className={`msp-product-card ${
                            selectedProducts.foundation?.id === product.id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleProductSelect("foundation", product)
                          }
                        >
                          <div className="msp-product-image">
                            <img src={product.image} alt={product.name} />
                          </div>
                          <div className="msp-product-name">{product.name}</div>
                          <span
                            className="msp-product-color"
                            style={{ backgroundColor: product.color }}
                          ></span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedCategory === "dress" && (
                  <>
                    <div className="msp-section-title">Select Dress</div>
                    <div className="msp-products-grid">
                      {dresses.map((dress) => (
                        <div
                          key={dress.id}
                          className={`msp-product-card ${
                            selectedDress?.id === dress.id ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedDress(
                              selectedDress?.id === dress.id ? null : dress
                            )
                          }
                        >
                          <div className="msp-product-image">
                            <img src={dress.image} alt={dress.name} />
                          </div>
                          <div className="msp-product-name">{dress.name}</div>
                          <span
                            className="msp-product-color"
                            style={{ backgroundColor: dress.color }}
                          ></span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {selectedCategory === "whole" && (
                  <>
                    <div className="msp-section-title">Complete Looks</div>
                    {wholeLooks.map((look) => (
                      <div
                        key={look.id}
                        className={`msp-look-card ${
                          selectedLook?.id === look.id ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSelectedLook(
                            selectedLook?.id === look.id ? null : look
                          )
                        }
                      >
                        <div className="msp-look-image">
                          <img src={look.image} alt={look.name} />
                        </div>
                        <div className="msp-look-info">
                          <div className="msp-look-name">{look.name}</div>
                          <div className="msp-look-description">
                            {look.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {selectedCategory && hasAnySelection() && (
                  <button className="msp-apply-button" onClick={handleApply}>
                    Apply
                    {selectedCategory === "makeup"
                      ? "Makeup"
                      : selectedCategory === "dress"
                      ? "Dress"
                      : "Look"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showEditModal && (
          <div className="msp-modal-overlay">
            <div className="msp-modal">
              <h5 className="msp-modal-title">Edit Photo</h5>
              <p className="msp-modal-text">
                What would you like to do with this photo?
              </p>
              <div className="msp-modal-buttons">
                <button
                  className="msp-btn-primary"
                  onClick={triggerEditFileInput}
                >
                  Choose New Photo
                </button>
                <button
                  className="msp-btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showInstructionsModal && (
          <div className="msp-modal-overlay">
            <div className="msp-instructions-modal">
              <h4 className="msp-instructions-title">Capture Your Face</h4>
              <div className="msp-instructions-content">
                <p className="msp-modal-text">
                  For accurate results, please follow these guidelines:
                </p>
                <div className="msp-instructions-grid">
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">Good lighting</span>
                  </div>
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">Remove glasses</span>
                  </div>
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">Put hair back</span>
                  </div>
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">No makeup face</span>
                  </div>
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">
                      Look straight at camera
                    </span>
                  </div>
                  <div className="msp-tip-item">
                    <span className="msp-tip-icon msp-tip-check">✅</span>
                    <span className="msp-tip-text">Neutral expression</span>
                  </div>
                </div>
              </div>
              <div className="msp-instructions-buttons">
                <button className="msp-btn-primary" onClick={triggerFileInput}>
                  Upload Photo
                </button>
                <button
                  className="msp-btn-secondary"
                  onClick={() => setShowInstructionsModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Modal */}
        {showCameraModal && (
          <div className="msp-modal-overlay">
            <div className="msp-camera-modal">
              <div className="msp-camera-content">
                <video
                  ref={videoRef}
                  className="msp-camera-video"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="msp-camera-controls">
                  <button
                    className="msp-camera-button"
                    onClick={stopCamera}
                    aria-label="Close camera"
                  >
                    ✕
                  </button>
                  <button
                    className="msp-camera-button capture"
                    onClick={captureImage}
                    aria-label="Take photo"
                  >
                    📸
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          style={{ display: "none" }}
        />
        <input
          type="file"
          ref={editFileInputRef}
          onChange={handleEditImage}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    </>
  );
};

export default ProfileImageSelector;
