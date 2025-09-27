import React from "react";
import { useNavigate } from "react-router-dom";
import { beautyApi } from "../../services/api";
import DragScroll from "../layouts/DragScroll";

const FiltersPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState([]);
  const [expandedCatIdx, setExpandedCatIdx] = React.useState(null);
  const [expandedProductId, setExpandedProductId] = React.useState(null);
  const [isApplying, setIsApplying] = React.useState(false);
  const [appliedProducts, setAppliedProducts] = React.useState({});

  const uploadedId = sessionStorage.getItem("try_uploaded_image_id") || null;
  const uploadedPreview = React.useMemo(() => {
    if (!uploadedId) return null;
    const base = import.meta.env.VITE_API_BASE_URL || "/api";
    return `${base}/images/${uploadedId}`;
  }, [uploadedId]);

  const [previewUrl, setPreviewUrl] = React.useState(uploadedPreview);

  React.useEffect(() => {
    setPreviewUrl(uploadedPreview);
  }, [uploadedPreview]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await beautyApi.getFilteredProducts("MAKEUP");
        // Response could be an array or an object with data
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];
        setCategories(items);
      } catch (e) {
        console.error("Failed to load products", e);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectCategory = (idx) => {
    setExpandedCatIdx((prev) => (prev === idx ? null : idx));
    setExpandedProductId(null);
  };

  const handleSelectProduct = (productId) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
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
        categoryName: activeCategoryName
      }
    };
    setAppliedProducts(newAppliedProducts);

    // Build payload with all applied products
    const payload = {
      image_id: Number(uploadedId),
      product_ids: Object.values(newAppliedProducts).map(p => p.productId),
    };

    // Add all applied product configurations
    Object.values(newAppliedProducts).forEach(product => {
      const { productId: pid, colorHex: hex, categoryName } = product;

      switch (categoryName) {
        case "blush":
          payload.blush_color = hex;
          payload.blush_intensity = 0.4;
          payload.blush_radius = 60;
          break;
        case "lipstick":
          payload.lipstick_color = hex;
          payload.lipstick_intensity = 0.8;
          break;
        case "eyeshadow":
          payload.eyeshadow_color = hex;
          payload.eyeshadow_intensity = 0.4;
          payload.eyeshadow_thickness = 25;
          break;
        case "lens":
          payload.lens_color = hex;
          payload.lens_intensity = 0.2;
          payload.lens_radius_scale = 1.3;
          break;
        case "foundation":
          payload.foundation_color = hex;
          payload.foundation_intensity = 0.6;
          break;
        case "kajal":
          payload.kajal_color = hex;
          payload.kajal_intensity = 1.0;
          break;
        case "concealer":
          payload.concealer_color = hex;
          payload.concealer_intensity = 0.9;
          break;
        case "contour":
          payload.contour_color = hex;
          payload.contour_intensity = 0.3;
          break;
        case "bindi":
          payload.bindi_color = hex;
          payload.bindi_size = 6;
          break;
        default:
          // fallback: try lipstick_color key
          payload.lipstick_color = hex;
          payload.lipstick_intensity = 0.6;
          break;
      }
    });

    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);

      // Extract processed image URL from response
      const processedUrl = res?.url || res?.data?.url || res?.image_url;
      const processedId = res?.processed_image_id || res?.data?.processed_image_id;

      if (processedUrl) {
        // Convert the full URL to use our proxy in development
        if (import.meta.env.DEV && processedUrl.includes('www.happywedz.com')) {
          // Extract just the image ID from the full URL
          const imageId = processedUrl.split('/').pop();
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
      product_ids: Object.values(productsToApply).map(p => p.productId),
    };

    // Add all applied product configurations
    Object.values(productsToApply).forEach(product => {
      const { colorHex: hex, categoryName } = product;

      switch (categoryName) {
        case "blush":
          payload.blush_color = hex;
          payload.blush_intensity = 0.4;
          payload.blush_radius = 60;
          break;
        case "lipstick":
          payload.lipstick_color = hex;
          payload.lipstick_intensity = 0.8;
          break;
        case "eyeshadow":
          payload.eyeshadow_color = hex;
          payload.eyeshadow_intensity = 0.4;
          payload.eyeshadow_thickness = 25;
          break;
        case "lens":
          payload.lens_color = hex;
          payload.lens_intensity = 0.2;
          payload.lens_radius_scale = 1.3;
          break;
        case "foundation":
          payload.foundation_color = hex;
          payload.foundation_intensity = 0.6;
          break;
        case "kajal":
          payload.kajal_color = hex;
          payload.kajal_intensity = 1.0;
          break;
        case "concealer":
          payload.concealer_color = hex;
          payload.concealer_intensity = 0.9;
          break;
        case "contour":
          payload.contour_color = hex;
          payload.contour_intensity = 0.3;
          break;
        case "bindi":
          payload.bindi_color = hex;
          payload.bindi_size = 6;
          break;
        default:
          payload.lipstick_color = hex;
          payload.lipstick_intensity = 0.6;
          break;
      }
    });

    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);

      const processedUrl = res?.url || res?.data?.url || res?.image_url;
      const processedId = res?.processed_image_id || res?.data?.processed_image_id;

      if (processedUrl) {
        if (import.meta.env.DEV && processedUrl.includes('www.happywedz.com')) {
          const imageId = processedUrl.split('/').pop();
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

  return (
    <div className="filters-container my-5">
      <div className="preview-area">
        {previewUrl ? (
          <div className="single-image-container">
            <div className="image-wrapper">
              <img src={previewUrl} alt="preview" className="preview-img" />
              {isApplying && (
                <div className="processing-overlay">
                  <div className="spinner"></div>
                  <p>Processing...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
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

      <div
        style={{
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "10px",
          width: "100%",
          display: "block",
          marginBottom: "1rem",
          marginTop: "auto",
        }}
      >
        <DragScroll>
          <div
            style={{
              display: "inline-flex",
              alignItems: "flex-start",
              gap: "12px",
              minWidth: "max-content",
            }}
          >
            {/* 1) Categories column (as chips) */}
            <div style={{ display: "inline-flex", gap: 12 }}>
              {categories.map((cat, idx) => {
                const categoryName = (cat.product_detailed_category_name || "").toLowerCase();
                const isApplied = appliedProducts[categoryName];
                return (
                  <button
                    key={`${cat.product_detailed_category_name || "cat"}-${idx}`}
                    type="button"
                    className={`d-flex flex-column align-items-center px-3 py-2 border rounded bg-white position-relative ${expandedCatIdx === idx ? "border-primary" : ""
                      } ${isApplied ? "border-success" : ""}`}
                    onClick={() => handleSelectCategory(idx)}
                    style={{ cursor: "pointer", minWidth: 80 }}
                  >
                    <img
                      src={cat.product_detailed_image}
                      alt={cat.product_detailed_category_name}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <strong style={{ fontSize: 12 }}>
                      {cat.product_detailed_category_name || "Category"}
                    </strong>
                    {isApplied && (
                      <div
                        className="position-absolute top-0 end-0 translate-middle rounded-circle"
                        style={{
                          width: 12,
                          height: 12,
                          backgroundColor: isApplied.colorHex,
                          border: "2px solid white",
                          transform: "translate(50%, -50%)"
                        }}
                        title={`Applied: ${isApplied.colorHex}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 2) Products panel for selected category */}
            {expandedCatIdx !== null && categories[expandedCatIdx] && (
              <div
                style={{
                  display: "inline-block",
                  minWidth: 260,
                  maxWidth: 600,
                  borderRadius: 8,
                  whiteSpace: "normal",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "flex-start",
                    gap: 12,
                    overflowX: "auto",
                    maxWidth: 560,
                  }}
                >
                  {safeArray(categories[expandedCatIdx].products).map((p) => (
                    <React.Fragment key={p.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(p.id)}
                        className={`d-flex flex-column align-items-center px-3 py-2 border rounded bg-white ${expandedProductId === p.id ? "border-primary" : ""
                          }`}
                        style={{ cursor: "pointer", minWidth: 100 }}
                      >
                        <img
                          src={p.product_real_image}
                          alt={p.product_name}
                          style={{
                            width: 40,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                        <strong className="mt-1" style={{ fontSize: 12 }}>
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
                          }}
                        >
                          {safeArray(p.product_colors).length > 0 ? (
                            safeArray(p.product_colors).map((hex, i) => (
                              <React.Fragment key={`${p.id}-${hex}-${i}`}>
                                <button
                                  type="button"
                                  title={hex}
                                  onClick={() => handleApplyOne(p.id, hex)}
                                  disabled={isApplying}
                                  className="border rounded-circle"
                                  style={{
                                    width: 20,
                                    height: 20,
                                    background: hex,
                                    borderColor: "#ccc",
                                  }}
                                />
                                {i < safeArray(p.product_colors).length - 1 && (
                                  <span className="text-muted">|</span>
                                )}
                              </React.Fragment>
                            ))
                          ) : (
                            <span className="small text-muted">No colors</span>
                          )}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  {safeArray(categories[expandedCatIdx].products).length ===
                    0 && <div className="text-muted small">No products</div>}
                </div>
              </div>
            )}

            {/* {expandedCatIdx !== null &&
              categories[expandedCatIdx] &&
              expandedProductId && (
                <div
                  style={{
                    display: "inline-block",
                    minWidth: 220,
                    maxWidth: 320,
                    border: "1px solid #dee2e6",
                    borderRadius: 8,
                    whiteSpace: "normal",
                  }}
                >
                  {(() => {
                    const product = safeArray(
                      categories[expandedCatIdx].products
                    ).find((p) => p.id === expandedProductId);
                    const colors = safeArray(product?.product_colors);
                    return (
                      <div
                        className="d-flex align-items-center flex-wrap"
                        style={{ gap: 8 }}
                      >
                        {colors.map((hex, i) => (
                          <button
                            key={`${expandedProductId}-${hex}-${i}`}
                            type="button"
                            className="border rounded-circle"
                            style={{
                              width: 24,
                              height: 24,
                              background: hex,
                              borderColor: "#ccc",
                            }}
                            title={hex}
                            onClick={() =>
                              handleApplyOne(expandedProductId, hex)
                            }
                            disabled={isApplying}
                          />
                        ))}
                        {colors.length === 0 && (
                          <span className="small text-muted">No colors</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )} */}
          </div>
        </DragScroll>
      </div>

      {/* Applied Products Display */}
      {Object.keys(appliedProducts).length > 0 && (
        <div className="applied-products-section mb-3">
          <h6 className="mb-2">Applied Products:</h6>
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(appliedProducts).map(([categoryName, product]) => (
              <div
                key={categoryName}
                className="d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light"
              >
                <div
                  className="rounded-circle"
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: product.colorHex,
                    border: "1px solid #ccc"
                  }}
                />
                <span className="text-capitalize">{categoryName}</span>
                <button
                  type="button"
                  className="btn-close btn-close-sm"
                  onClick={() => handleRemoveProduct(categoryName)}
                  style={{ fontSize: "0.7rem" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="footer-buttons">
        <button className="btn btn-outline-secondary" disabled>
          Shades
        </button>
        <button className="btn btn-outline-secondary" disabled>
          Compare
        </button>
        <button className="btn btn-primary" disabled={isApplying}>
          {isApplying ? "Applying..." : "Complete look"}
        </button>
      </div>

      <style jsx>{`
        .single-image-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .image-wrapper {
          position: relative;
          width: 100%;
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #e9ecef;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
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
            min-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default FiltersPage;
