import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { beautyApi } from "../../services/api";
import DragScroll from "../layouts/DragScroll";
import { BarLoader, ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

// Remove static filtering - show all categories dynamically from API

const SLIDER_CATEGORIES = [
  "foundation",
  "concealer",
  "blush",
  "contour",
  "kajal",
  "eyeshadow",
  "lipstick",
  "bindi",
  "mascara",
  // "mangtika",
  "contactlenses",
];

// Default intensity values for each category
const DEFAULT_INTENSITIES = {
  foundation: 0.6,
  concealer: 0.9,
  blush: 0.2,
  contour: 0.3,
  kajal: 1.0,
  eyeshadow: 0.4,
  lipstick: 0.8,
  bindi: 6,
  mascara: 0.8,
  // mangtika: 0.6,
  contactlenses: 0.2,
};

const DEBOUNCE_DELAY = 400;

const FiltersPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [expandedCatIdx, setExpandedCatIdx] = React.useState(null);
  const [expandedProductId, setExpandedProductId] = React.useState(null);
  const [isApplying, setIsApplying] = React.useState(false);
  const [appliedProducts, setAppliedProducts] = React.useState({});
  const [intensity, setIntensity] = useState(0.6);
  const [intensities, setIntensities] = useState(DEFAULT_INTENSITIES);
  const [isLoading, setIsLoading] = useState(true);
  const debounceTimer = useRef();

  const uploadedId = sessionStorage.getItem("try_uploaded_image_id") || null;
  const uploadedPreview = React.useMemo(() => {
    if (!uploadedId) return null;
    const base = import.meta.env.VITE_API_BASE_URL || "/ai/api";
    return `${base}/images/${uploadedId}`;
  }, [uploadedId]);

  const [previewUrl, setPreviewUrl] = React.useState(uploadedPreview);

  React.useEffect(() => {
    setPreviewUrl(uploadedPreview);
  }, [uploadedPreview]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await beautyApi.getFilteredProducts("MAKEUP");
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        // Show all categories dynamically from API - no filtering
        setCategories(items);
      } catch (e) {
        console.error("Failed to load products", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectCategory = (idx) => {
    setExpandedCatIdx((prev) => (prev === idx ? null : idx));
    setExpandedProductId(null);
  };

  const handleBackToMainFilters = () => {
    setExpandedCatIdx(null);
    setExpandedProductId(null);
  };

  const handleSelectProduct = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
    // Don't auto-apply when selecting product, only when color is clicked
  };

  const handleApplyOne = async (productId, colorHex) => {
    if (!uploadedId) {
      alert("Please upload an image first.");
      navigate("/try/upload");
      return;
    }
    const activeCategoryName = (
      categories[expandedCatIdx]?.product_detailed_category_name || ""
    ).toLowerCase();

    // Add or update the product in appliedProducts
    const newAppliedProducts = {
      ...appliedProducts,
      [activeCategoryName]: {
        productId,
        colorHex,
        categoryName: activeCategoryName,
      },
    };
    setAppliedProducts(newAppliedProducts);

    // Build payload with all applied products
    const payload = {
      image_id: Number(uploadedId),
      product_ids: Object.values(newAppliedProducts).map((p) => p.productId),
    };

    Object.values(newAppliedProducts).forEach((product) => {
      const { productId: pid, colorHex: hex, categoryName } = product;
      const intensityValue =
        intensities[categoryName] ?? DEFAULT_INTENSITIES[categoryName] ?? 0.6;

      switch (categoryName) {
        case "foundation":
          payload.foundation_color = hex;
          payload.foundation_intensity = intensityValue;
          break;
        case "concealer":
          payload.concealer_color = hex;
          payload.concealer_intensity = intensityValue;
          break;
        case "blush":
          payload.blush_color = hex;
          payload.blush_intensity = intensityValue;
          payload.blush_radius = 60;
          break;
        case "contour":
          payload.contour_color = hex;
          payload.contour_intensity = intensityValue;
          break;
        case "eyeshadow":
          payload.eyeshadow_color = hex;
          payload.eyeshadow_intensity = intensityValue;
          payload.eyeshadow_thickness = 25;
          break;
        case "lipstick":
          payload.lipstick_color = hex;
          payload.lipstick_intensity = intensityValue;
          break;
        case "bindi":
          payload.bindi_color = hex;
          payload.bindi_size = intensityValue; // Use intensity value directly as size
          break;
        case "kajal":
          payload.kajal_color = hex;
          payload.kajal_intensity = intensityValue;
          break;
        default:
          // fallback for other makeup categories
          payload.lipstick_color = hex;
          payload.lipstick_intensity = intensityValue;
          break;
      }
    });

    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);

      // Extract processed image URL from response
      const processedUrl = res?.url || res?.data?.url || res?.image_url;
      const processedId =
        res?.processed_image_id || res?.data?.processed_image_id;

      if (processedUrl) {
        if (import.meta.env.DEV && processedUrl.includes("www.happywedz.com")) {
          const imageId = processedUrl.split("/").pop();
          const base = import.meta.env.VITE_API_BASE_URL || "/api";
          setPreviewUrl(`${base}/images/${imageId}`);
        } else {
          setPreviewUrl(processedUrl);
        }
      } else if (processedId) {
        // Fallback: construct URL using processed_image_id
        const base = import.meta.env.VITE_API_BASE_URL || "/api";
        const fallbackUrl = `${base}/images/${processedId}`;
        setPreviewUrl(fallbackUrl);
      }
    } catch (e) {
      console.error("applyMakeup failed:", e?.message || e, payload);
      alert(e?.message || "Failed to apply filter.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveProduct = (categoryName) => {
    const newAppliedProducts = { ...appliedProducts };
    delete newAppliedProducts[categoryName];
    setAppliedProducts(newAppliedProducts);

    // If no products left, reset to original image
    if (Object.keys(newAppliedProducts).length === 0) {
      setPreviewUrl(uploadedPreview);
    } else {
      // Re-apply remaining products
      applyAllProducts(newAppliedProducts);
    }
  };

  const applyAllProducts = async (productsToApply) => {
    if (!uploadedId || Object.keys(productsToApply).length === 0) return;

    const payload = {
      image_id: Number(uploadedId),
      product_ids: Object.values(productsToApply).map((p) => p.productId),
    };

    Object.values(productsToApply).forEach((product) => {
      const { colorHex: hex, categoryName } = product;
      const intensityValue =
        intensities[categoryName] ?? DEFAULT_INTENSITIES[categoryName] ?? 0.6;

      switch (categoryName) {
        case "blush":
          payload.blush_color = hex;
          payload.blush_intensity = intensityValue;
          payload.blush_radius = 60;
          break;
        case "lipstick":
          payload.lipstick_color = hex;
          payload.lipstick_intensity = intensityValue;
          break;
        case "eyeshadow":
          payload.eyeshadow_color = hex;
          payload.eyeshadow_intensity = intensityValue;
          payload.eyeshadow_thickness = 25;
          break;
        case "lens":
          payload.lens_color = hex;
          payload.lens_intensity = 0.2;
          payload.lens_radius_scale = 1.3;
          break;
        case "foundation":
          payload.foundation_color = hex;
          payload.foundation_intensity = intensityValue;
          break;
        case "kajal":
          payload.kajal_color = hex;
          payload.kajal_intensity = intensityValue;
          break;
        case "concealer":
          payload.concealer_color = hex;
          payload.concealer_intensity = intensityValue;
          break;
        case "contour":
          payload.contour_color = hex;
          payload.contour_intensity = intensityValue;
          break;
        case "bindi":
          payload.bindi_color = hex;
          payload.bindi_size = intensityValue;
          break;
        default:
          payload.lipstick_color = hex;
          payload.lipstick_intensity = intensityValue;
          break;
      }
    });

    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);

      const processedUrl = res?.url || res?.data?.url || res?.image_url;
      const processedId =
        res?.processed_image_id || res?.data?.processed_image_id;

      if (processedUrl) {
        if (import.meta.env.DEV && processedUrl.includes("www.happywedz.com")) {
          const imageId = processedUrl.split("/").pop();
          const base = import.meta.env.VITE_API_BASE_URL || "/api";
          setPreviewUrl(`${base}/images/${imageId}`);
        } else {
          setPreviewUrl(processedUrl);
        }
      } else if (processedId) {
        const base = import.meta.env.VITE_API_BASE_URL || "/api";
        const fallbackUrl = `${base}/images/${processedId}`;
        setPreviewUrl(fallbackUrl);
      }
    } catch (e) {
      console.error("applyMakeup failed:", e?.message || e, payload);
      alert(e?.message || "Failed to apply filter.");
    } finally {
      setIsApplying(false);
    }
  };

  const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

  // Re-apply makeup when intensity changes for any applied product
  useEffect(() => {
    if (Object.keys(appliedProducts).length > 0) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        applyAllProducts(appliedProducts);
      }, DEBOUNCE_DELAY);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [intensities, appliedProducts]);

  if (isLoading) {
    return (
      <div
        className="filters-container my-5 d-flex align-items-center justify-content-center"
        style={{ minHeight: 400 }}
      >
        <ClipLoader size={60} color="#ed1173" />
      </div>
    );
  }

  return (
    <div
      className="filters-container my-5"
      style={{ margin: "32px auto 0 auto", maxWidth: 650 }}
    >
      <div
        className="preview-area"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          className="single-image-container"
          style={{ width: "100%" }}
          // style={{ width: "100%", maxWidth: 400 }}
        >
          <div
            className="image-wrapper"
            style={{
              minHeight: 340,
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Home"
              onClick={() => navigate("/try")}
            >
              <FaHome className="primary-text" size={30} />
            </div>
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 30,
                cursor: "pointer",
                padding: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Delete"
              onClick={async () => {
                const confirmed = await Swal.fire({
                  title: "Remove image?",
                  text: "Are you sure you want to delete this image and clear all try data?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#ed1173",
                  cancelButtonColor: "#aaa",
                  confirmButtonText: "Yes, delete it",
                });

                if (confirmed.isConfirmed) {
                  sessionStorage.removeItem("try_uploaded_image_id");
                  sessionStorage.removeItem("finalLookImage");
                  sessionStorage.removeItem("finalLookFilters");
                  setPreviewUrl(null);
                  setAppliedProducts({});
                  navigate("/try/upload");

                  Swal.fire({
                    title: "Deleted!",
                    text: "Your image has been removed.",
                    icon: "success",
                    confirmButtonColor: "#ed1173",
                  });
                }
              }}
            >
              <IoClose className="primary-text" size={40} />
            </div>
            <div
              style={{
                width: "100%",
                height: "600px",
                overflow: "hidden",
                borderRadius: "12px",
              }}
            >
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            </div>
            {isApplying && (
              <div className="processing-overlay">
                <BarLoader />
                <p>Applying For The Filters</p>
              </div>
            )}
            {expandedCatIdx !== null &&
              SLIDER_CATEGORIES.includes(
                (
                  categories[expandedCatIdx]?.product_detailed_category_name ||
                  ""
                ).toLowerCase()
              ) &&
              expandedProductId !== null && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: "10px 18px",
                    minWidth: 180,
                    zIndex: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label style={{ fontSize: 13, marginBottom: 4 }}>
                    {(
                      categories[expandedCatIdx]
                        ?.product_detailed_category_name || ""
                    ).toLowerCase() === "bindi"
                      ? "Size"
                      : "Intensity"}
                  </label>
                  <input
                    type="range"
                    min={
                      (
                        categories[expandedCatIdx]
                          ?.product_detailed_category_name || ""
                      ).toLowerCase() === "bindi"
                        ? 1
                        : 0
                    }
                    max={
                      (
                        categories[expandedCatIdx]
                          ?.product_detailed_category_name || ""
                      ).toLowerCase() === "bindi"
                        ? 10
                        : 1
                    }
                    step={
                      (
                        categories[expandedCatIdx]
                          ?.product_detailed_category_name || ""
                      ).toLowerCase() === "bindi"
                        ? 1
                        : 0.01
                    }
                    value={
                      intensities[
                        (
                          categories[expandedCatIdx]
                            ?.product_detailed_category_name || ""
                        ).toLowerCase()
                      ] ??
                      DEFAULT_INTENSITIES[
                        (
                          categories[expandedCatIdx]
                            ?.product_detailed_category_name || ""
                        ).toLowerCase()
                      ] ??
                      0.6
                    }
                    onChange={(e) =>
                      setIntensities({
                        ...intensities,
                        [(
                          categories[expandedCatIdx]
                            ?.product_detailed_category_name || ""
                        ).toLowerCase()]: Number(e.target.value),
                      })
                    }
                    style={{ width: "100%" }}
                  />
                  <span style={{ fontSize: 12 }}>
                    {(
                      categories[expandedCatIdx]
                        ?.product_detailed_category_name || ""
                    ).toLowerCase() === "bindi"
                      ? intensities[
                          (
                            categories[expandedCatIdx]
                              ?.product_detailed_category_name || ""
                          ).toLowerCase()
                        ] ??
                        DEFAULT_INTENSITIES[
                          (
                            categories[expandedCatIdx]
                              ?.product_detailed_category_name || ""
                          ).toLowerCase()
                        ] ??
                        6
                      : Math.round(
                          (intensities[
                            (
                              categories[expandedCatIdx]
                                ?.product_detailed_category_name || ""
                            ).toLowerCase()
                          ] ??
                            DEFAULT_INTENSITIES[
                              (
                                categories[expandedCatIdx]
                                  ?.product_detailed_category_name || ""
                              ).toLowerCase()
                            ] ??
                            0.6) * 100
                        ) + "%"}
                  </span>
                </div>
              )}
          </div>
        </div>
        {!previewUrl && (
          <div className="upload-placeholder">
            <p>No image found. Please upload a photo.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/try/upload")}
            >
              Upload
            </button>
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "0px",
          width: "100%",
          display: "block",
          marginBottom: "8px",
          marginTop: "0px",
          scrollbarWidth: "thin",
          scrollbarColor: "#ed1173 #f1f1f1",
        }}
      >
        <DragScroll>
          <div
            style={{
              display: "flex",
              justifyContent: categories.length <= 4 ? "center" : "flex-start",
              alignItems: "flex-start",
              gap: "8px",
              minWidth: "max-content",
              padding: "0 8px",
            }}
          >
            <div style={{ display: "inline-flex", gap: 8, flexWrap: "nowrap" }}>
              {/* Back button when a category is expanded */}
              {expandedCatIdx !== null && (
                <button
                  type="button"
                  className="d-flex flex-column align-items-center px-2 py-2 border rounded bg-white"
                  onClick={handleBackToMainFilters}
                  style={{
                    cursor: "pointer",
                    minWidth: 70,
                    transition: "all 0.3s ease",
                    borderColor: "#ed1173",
                    flexShrink: 0,
                  }}
                  title="Back to main filters"
                >
                  <IoIosArrowBack style={{ fontSize: 24, color: "#ed1173" }} />
                  <strong
                    style={{ fontSize: 11, marginTop: 2, color: "#ed1173" }}
                  >
                    Back
                  </strong>
                </button>
              )}

              {categories.map((cat, idx) => {
                const categoryName = (
                  cat.product_detailed_category_name || ""
                ).toLowerCase();
                const isApplied = appliedProducts[categoryName];

                // Collapse logic: show only expanded category if one is expanded
                if (expandedCatIdx !== null && expandedCatIdx !== idx) {
                  return null;
                }

                return (
                  <React.Fragment
                    key={`${
                      cat.product_detailed_category_name || "cat"
                    }-${idx}`}
                  >
                    <button
                      type="button"
                      className={`d-flex flex-column align-items-center px-2 py-2 border-0 rounded bg-white position-relative ${
                        expandedCatIdx === idx ? "border-primary" : ""
                      } ${isApplied ? "border-success" : ""}`}
                      onClick={() => handleSelectCategory(idx)}
                      style={{
                        cursor: "pointer",
                        minWidth: 70,
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={cat.product_detailed_image}
                        alt={cat.product_detailed_category_name}
                        style={{
                          width: "100%",
                          height: "90px",
                          objectFit: "cover",
                        }}
                      />
                      <strong style={{ fontSize: 11, marginTop: 2 }}>
                        {cat.product_detailed_category_name || "Category"}
                      </strong>
                      {isApplied && (
                        <div
                          className="position-absolute top-0 end-0 translate-middle rounded-circle"
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: isApplied.colorHex,
                            border: "2px solid white",
                            transform: "translate(50%, -50%)",
                          }}
                          title={`Applied: ${isApplied.colorHex}`}
                        />
                      )}
                    </button>
                    {expandedCatIdx === idx && (
                      <div
                        style={{
                          display: "inline-block",
                          minWidth: 220,
                          maxWidth: 400,
                          borderRadius: 8,
                          whiteSpace: "normal",
                          marginLeft: 8,
                          animation: "slideIn 0.3s ease-out",
                        }}
                      >
                        <div
                          className="border-start"
                          style={{
                            display: "inline-flex",
                            alignItems: "flex-start",
                            gap: 8,
                            overflowX: "auto",
                            maxWidth: "100%",
                          }}
                        >
                          {safeArray(cat.products).map((p) => (
                            <React.Fragment key={p.id}>
                              <button
                                type="button"
                                onClick={() => handleSelectProduct(p.id)}
                                className={`d-flex flex-column align-items-center px-2 py-2 border-0 rounded bg-white ${
                                  expandedProductId === p.id
                                    ? "border-primary"
                                    : ""
                                }`}
                                style={{ cursor: "pointer", minWidth: 80 }}
                              >
                                <img
                                  src={p.product_real_image}
                                  alt={p.product_name}
                                  style={{
                                    borderRadius: 10,
                                    width: "100%",
                                    height: "90px",
                                    objectFit: "cover",
                                  }}
                                />
                                <strong
                                  className="mt-1"
                                  style={{ fontSize: 11 }}
                                >
                                  {p.product_name}
                                </strong>
                              </button>
                              {expandedProductId === p.id && (
                                <div
                                  className="ms-2 px-2 py-2 border rounded bg-white"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    flexDirection: "row",
                                    animation: "fadeIn 0.3s ease-out",
                                  }}
                                >
                                  {/* Colors */}
                                  {safeArray(p.product_colors).length > 0 ? (
                                    safeArray(p.product_colors).map(
                                      (hex, i) => (
                                        <React.Fragment
                                          key={`${p.id}-${hex}-${i}`}
                                        >
                                          <button
                                            type="button"
                                            title={hex}
                                            onClick={() =>
                                              handleApplyOne(p.id, hex)
                                            }
                                            disabled={isApplying}
                                            className="border rounded-circle"
                                            style={{
                                              width: 18,
                                              height: 18,
                                              background: hex,
                                              borderColor: "#ccc",
                                            }}
                                          />
                                          {i <
                                            safeArray(p.product_colors).length -
                                              1 && (
                                            <span className="text-muted">
                                              |
                                            </span>
                                          )}
                                        </React.Fragment>
                                      )
                                    )
                                  ) : (
                                    <span className="small text-muted">
                                      No colors
                                    </span>
                                  )}
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                          {safeArray(cat.products).length === 0 && (
                            <div className="text-muted small">No products</div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </DragScroll>
      </div>

      {/* Applied Products Display */}
      {Object.keys(appliedProducts).length > 0 && (
        <div className="applied-products-section mb-2">
          <h6 className="mb-1" style={{ fontSize: 13 }}>
            Applied Products:
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(appliedProducts).map(([categoryName, product]) => (
              <div
                key={categoryName}
                className="d-flex align-items-center gap-2 px-2 py-1 border rounded bg-light"
                style={{ fontSize: 12 }}
              >
                <div
                  className="rounded-circle"
                  style={{
                    width: 13,
                    height: 13,
                    backgroundColor: product.colorHex,
                    border: "1px solid #ccc",
                  }}
                />
                <span className="text-capitalize">{categoryName}</span>
                <button
                  type="button"
                  className="btn-close btn-close-sm fs-10"
                  onClick={() => handleRemoveProduct(categoryName)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {Object.keys(appliedProducts).length != 0 && (
        <div
          className="footer-buttons"
          style={{ marginTop: 12, textAlign: "center" }}
        >
          <button
            className="btn btn-primary"
            disabled={isApplying}
            onClick={() => {
              sessionStorage.setItem("finalLookImage", previewUrl);
              sessionStorage.setItem(
                "finalLookFilters",
                JSON.stringify(appliedProducts)
              );
              navigate("/finallook");
            }}
          >
            {isApplying ? "Applying..." : "Complete look"}
          </button>
        </div>
      )}

      <style jsx>{`
        .preview-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        .processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #ed1173;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: #6c757d;
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #dee2e6;
        }
        .upload-placeholder p {
          margin: 0 0 15px 0;
          font-size: 1.1rem;
        }
        @media (max-width: 768px) {
          .image-wrapper {
            min-height: 220px;
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        /* Custom scrollbar for filter bar */
        .filters-container ::-webkit-scrollbar {
          height: 6px;
        }
        .filters-container ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .filters-container ::-webkit-scrollbar-thumb {
          background: #ed1173;
          border-radius: 3px;
        }
        .filters-container ::-webkit-scrollbar-thumb:hover {
          background: #c00e5f;
        }
      `}</style>
    </div>
  );
};

export default FiltersPage;
