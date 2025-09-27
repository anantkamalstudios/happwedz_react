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
        const response = await beautyApi.getFilteredProducts("MAKEUP", "BLUSH");
        // Response could be an array or an object with data
        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : [];
        console.log("items", items);
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

    const payload = {
      image_id: Number(uploadedId),
      product_ids: [productId],
      product_id: productId,
    };

    // Map to backend field names per category
    switch (activeCategoryName) {
      case "blush":
        payload.blush_color = colorHex; // keep leading '#'
        payload.blush_intensity = 0.4;
        payload.blush_radius = 60;
        break;
      case "lipstick":
        payload.lipstick_color = colorHex;
        payload.lipstick_intensity = 0.8;
        break;
      case "eyeshadow":
        payload.eyeshadow_color = colorHex;
        payload.eyeshadow_intensity = 0.4;
        payload.eyeshadow_thickness = 25;
        break;
      case "lens":
        payload.lens_color = colorHex;
        payload.lens_intensity = 0.2;
        payload.lens_radius_scale = 1.3;
        break;
      case "foundation":
        payload.foundation_color = colorHex;
        payload.foundation_intensity = 0.6;
        break;
      case "kajal":
        payload.kajal_color = colorHex;
        payload.kajal_intensity = 1.0;
        break;
      case "concealer":
        payload.concealer_color = colorHex;
        payload.concealer_intensity = 0.9;
        break;
      case "contour":
        payload.contour_color = colorHex;
        payload.contour_intensity = 0.3;
        break;
      case "bindi":
        payload.bindi_color = colorHex;
        payload.bindi_size = 6;
        break;
      default:
        // fallback: try lipstick_color key
        payload.lipstick_color = colorHex;
        payload.lipstick_intensity = 0.6;
        break;
    }

    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);
      const nextUrl = res?.data?.url || res?.url || res?.image_url || null;
      if (nextUrl) setPreviewUrl(nextUrl);
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
          <img src={previewUrl} alt="preview" className="preview-img" />
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
              {categories.map((cat, idx) => (
                <button
                  key={`${cat.product_detailed_category_name || "cat"}-${idx}`}
                  type="button"
                  className={`d-flex flex-column align-items-center px-3 py-2 border rounded bg-white ${
                    expandedCatIdx === idx ? "border-primary" : ""
                  }`}
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
                </button>
              ))}
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
                        className={`d-flex flex-column align-items-center px-3 py-2 border rounded bg-white ${
                          expandedProductId === p.id ? "border-primary" : ""
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
    </div>
  );
};

export default FiltersPage;
