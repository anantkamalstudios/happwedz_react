import React from "react";
import { useNavigate } from "react-router-dom";
import { beautyApi } from "../../services/api";

const categoryOrder = ["foundation", "lipstick", "blush", "eyeshadow"];

const FiltersPage = () => {
  const navigate = useNavigate();
  const [apiProducts, setApiProducts] = React.useState({
    lipstick: [],
    blush: [],
    eyeshadow: [],
    foundation: [],
  });
  const [expanded, setExpanded] = React.useState(null);
  const [selected, setSelected] = React.useState({
    lipstick: null,
    blush: null,
    eyeshadow: null,
    foundation: null,
  });
  const [isApplying, setIsApplying] = React.useState(false);

  const uploadedId = sessionStorage.getItem("try_uploaded_image_id") || null;
  const uploadedPreview = React.useMemo(() => {
    if (!uploadedId) return null;
    const base = import.meta.env.VITE_API_BASE_URL || "/api";
    return `${base}/images/${uploadedId}`;
  }, [uploadedId]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await beautyApi.getFilteredProducts("Makeup");
        const items = response?.data || [];
        const grouped = {
          lipstick: [],
          blush: [],
          eyeshadow: [],
          foundation: [],
        };
        const inferType = (p) => {
          const dc = (p.detailed_category || "").toLowerCase();
          if (dc.includes("lip")) return "lipstick";
          if (dc.includes("blush")) return "blush";
          if (dc.includes("eye")) return "eyeshadow";
          if (dc.includes("foundation")) return "foundation";
          return null;
        };
        items.forEach((item) => {
          const id = item.id ?? item.product_id ?? item._id;
          const name = item.product_name || `Product ${id}`;
          const color = item.product_color_hex?.startsWith("#")
            ? item.product_color_hex
            : `#${item.product_color_hex || ""}`;
          const image = item.product_real_image || item.image;
          const normalized = { id, name, color, image, raw: item };
          const key = inferType(item);
          if (key && grouped[key]) grouped[key].push(normalized);
        });
        setApiProducts(grouped);
      } catch (e) {
        console.error("Failed to load products", e);
      }
    };
    fetchProducts();
  }, []);

  const toggleExpand = (key) => setExpanded(expanded === key ? null : key);

  const selectItem = (key, item) =>
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key]?.id === item.id ? null : item,
    }));

  const handleApply = async () => {
    if (!uploadedId) {
      alert("Please upload an image first.");
      navigate("/try/upload");
      return;
    }
    const productIds = Object.values(selected)
      .filter(Boolean)
      .map((p) => p.id);
    if (productIds.length === 0) {
      alert("Please select at least one filter.");
      return;
    }
    const payload = {
      image_id: Number(uploadedId),
      product_ids: productIds,
    };
    try {
      setIsApplying(true);
      const res = await beautyApi.applyMakeup(payload);
      navigate("/finallook", {
        state: {
          processedImageId: res?.data?.id,
          processedImageUrl: res?.data?.url,
          selectedProducts: selected,
        },
      });
    } catch (e) {
      console.error(e);
      alert("Failed to apply filters.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="filters-container">
      <div className="preview-area">
        {uploadedPreview ? (
          <img src={uploadedPreview} alt="preview" className="preview-img" />
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

      <div className="filters-bar">
        {categoryOrder.map((key) => (
          <div
            key={key}
            className={`filter-section ${expanded === key ? "expanded" : ""}`}
          >
            <div className="filter-icon" onClick={() => toggleExpand(key)}>
              <img src={`/icons/${key}.svg`} alt={key} />
            </div>
            {expanded === key && (
              <div className="filter-options">
                <div className="options-scroll">
                  {apiProducts[key].map((item) => (
                    <div
                      key={item.id}
                      className={`option-card ${
                        selected[key]?.id === item.id ? "selected" : ""
                      }`}
                      onClick={() => selectItem(key, item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="option-img"
                      />
                      {item.color && (
                        <span
                          className="color-dot"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                    </div>
                  ))}
                  {apiProducts[key].length === 0 && (
                    <div className="text-muted small">No items</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="footer-buttons">
        <button className="btn btn-outline-secondary">Shades</button>
        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            navigate("/finallook", {
              state: {
                selectedImage: uploadedPreview,
                selectedProducts: selected,
              },
            })
          }
        >
          Compare
        </button>
        <button
          className="btn btn-primary"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Complete look"}
        </button>
      </div>
    </div>
  );
};

export default FiltersPage;
