import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiEdit, FiShare, FiArrowLeft } from "react-icons/fi";
import { icons } from "lucide-react";
import { TEMPLATE_LIST } from "../../templates";
import Swal from "sweetalert2";
import { weddingWebsiteApi } from "../../services/api/weddingWebsiteApi";
import { API_BASE_URL } from "../../config/constants";
const WeddingWebsiteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.auth.token);
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [templateLoadError, setTemplateLoadError] = useState("");
  // Expected response fields (example payload structure sent by the form):
  // const formPayload = buildFormData({
  //   userId,
  //   templateId,
  //   weddingDate,
  //   brideData: { name, description },
  //   groomData: { name, description },
  //   loveStory: [{ title, date, description }],
  //   weddingParty: [{ name, relation }],
  //   whenWhere: [{ title, location, description, date }],
  //   sliderImages, brideImage, groomImage, loveStoryImages, weddingPartyImages, whenWhereImages, galleryFiles
  // });
  useEffect(() => {
    const fetchWebsiteData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await weddingWebsiteApi.getWebsiteById(id, token);
        setWebsiteData(data);
      } catch (err) {
        setError("Error loading wedding website");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchWebsiteData();
  }, [token, id]);
  // Load the template component dynamically once websiteData is available
  useEffect(() => {
    if (!websiteData?.templateId) return;
    setTemplateLoadError("");
    setTemplateComponent(null);
    const selected = TEMPLATE_LIST.find(
      (t) =>
        String(t.id).toLowerCase() ===
        String(websiteData.templateId).toLowerCase()
    );
    if (!selected) {
      setTemplateLoadError(`Unknown template: ${websiteData.templateId}`);
      return;
    }
    selected
      .load()
      .then((mod) => {
        setTemplateComponent(() => mod.default || mod);
      })
      .catch(() => {
        setTemplateLoadError("Failed to load selected template");
      });
  }, [websiteData]);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error || !websiteData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="text-danger">Error</h2>
          <p>{error || "Wedding website not found"}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/choose-template")}
          >
            <FiArrowLeft className="me-2" />
            Back to Templates
          </button>
        </div>
      </div>
    );
  }
  const normalizeWebsiteData = (data) => {
    if (!data) return data;
    const sliderArr =
      Array.isArray(data.slider) && data.slider.length > 0
        ? data.slider
        : Array.isArray(data.sliderImages)
        ? data.sliderImages
        : [];
    const galleryArr =
      Array.isArray(data.gallery) && data.gallery.length > 0
        ? data.gallery
        : Array.isArray(data.galleryImages)
        ? data.galleryImages
        : [];
    const toImageUrl = (obj) =>
      obj?.imageUrl || obj?.image_url || obj?.image || null;
    const bride = {
      name:
        data.brideName ||
        data?.bride?.name ||
        data?.bride?.title ||
        data?.brideData?.name ||
        data?.brideData?.title ||
        "",
      description:
        data?.brideDescription ||
        data?.bride?.description ||
        data?.brideData?.description ||
        "",
      imageUrl:
        data.brideImageUrl ||
        toImageUrl(data.bride) ||
        toImageUrl(data.brideData) ||
        null,
    };
    const groom = {
      name:
        data.groomName ||
        data?.groom?.name ||
        data?.groom?.title ||
        data?.groomData?.name ||
        data?.groomData?.title ||
        "",
      description:
        data?.groomDescription ||
        data?.groom?.description ||
        data?.groomData?.description ||
        "",
      imageUrl:
        data.groomImageUrl ||
        toImageUrl(data.groom) ||
        toImageUrl(data.groomData) ||
        null,
    };
    const loveStory =
      Array.isArray(data.loveStory) &&
      data.loveStory.map((s) => ({
        title: s.title || "",
        date: s.date || "",
        description: s.description || "",
        imageUrl: toImageUrl(s),
      }));
    const weddingParty =
      Array.isArray(data.weddingParty) &&
      data.weddingParty.map((m) => ({
        name: m.name || m.title || "",
        relation: m.relation || m.role || "",
        role: m.relation || m.role || "",
        imageUrl: toImageUrl(m),
      }));
    const whenWhere =
      Array.isArray(data.whenWhere) &&
      data.whenWhere.map((w) => ({
        title: w.title || "",
        location: w.location || "",
        description: w.description || "",
        date: w.date || "",
        time: w.time || "",
        imageUrl: toImageUrl(w),
      }));
    return {
      ...data,
      // Provide both aliases so templates depending on either won't break
      slider: sliderArr,
      sliderImages: sliderArr,
      gallery: galleryArr,
      galleryImages: galleryArr,
      bride,
      groom,
      loveStory: loveStory || [],
      weddingParty: weddingParty || [],
      whenWhere: whenWhere || [],
    };
  };

  console.log("websiteData", websiteData);

  const normalizedData = normalizeWebsiteData(websiteData);
  return (
    <div className="wedding-website-view">
      <style>{`
                .wedding-website-view {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #fdfbfb 0%, #f8f4f1 100%);
                }
                
                .website-header {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    padding: 20px 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                .btn-action {
                    background: linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
                    color: white;
                }
                
                .btn-secondary-action {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn-secondary-action:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    color: white;
                }
                
                .website-preview {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                    margin: 30px 0;
                    overflow: hidden;
                }
                
                .preview-frame {
                    width: 100%;
                    height: 80vh;
                    border: none;
                    border-radius: 20px;
                }
                
                .website-info {
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    margin: 20px 0;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }
                
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                
                .info-item:last-child {
                    border-bottom: none;
                }
                
                .info-label {
                    font-weight: 600;
                    color: #333;
                }
                
                .info-value {
                    color: #666;
                }
                
                .status-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .status-published {
                    background: #d4edda;
                    color: #155724;
                }
                
                .status-draft {
                    background: #fff3cd;
                    color: #856404;
                }
            `}</style>
      <div className="website-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">
                {normalizedData?.bride?.name || ""} &{" "}
                {normalizedData?.groom?.name || ""}
              </h3>
              <p className="text-muted mb-0">Wedding Website</p>
            </div>
            <div className="action-buttons">
              <button
                className="btn btn-action"
                onClick={() =>
                  navigate(`/wedding-form/${websiteData.templateId}?edit=${id}`)
                }
              >
                <FiEdit className="me-1" />
                Edit Website
              </button>
              <button
                className="btn btn-secondary-action"
                onClick={() => {
                  if (websiteData.isPublished) {
                    navigator.clipboard.writeText(
                      `${API_BASE_URL}/weddingwebsite/wedding/${websiteData.websiteUrl}`
                    );
                    // alert('Website link copied to clipboard!');
                    Swal.fire({
                      icon: "success",
                      text: "Website link copied to clipboard!",
                      confirmButtonText: "OK",
                      timer: "3000",
                    });
                  } else {
                    // alert('Please publish your website first to share it.');
                    Swal.fire({
                      icon: "warning",
                      text: "Please publish your website first to share it.",
                      confirmButtonText: "OK",
                      timer: "3000",
                    });
                  }
                }}
              >
                <FiShare className="me-1" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="website-preview">
              {templateLoadError && (
                <div className="p-4 text-center text-danger">
                  {templateLoadError}
                </div>
              )}
              {!templateLoadError && !TemplateComponent && (
                <div className="d-flex justify-content-center align-items-center preview-frame">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading template...</span>
                  </div>
                </div>
              )}
              {TemplateComponent && (
                <div
                  style={{
                    minHeight: "80vh",
                    minWidth: "100%",
                    position: "relative",
                  }}
                >
                  <TemplateComponent data={normalizedData} />
                </div>
              )}
            </div>
          </div>
          {/* <div className="col-lg-4">
            <div className="website-info">
              <h5 className="mb-4">Website Information</h5>
              <div className="info-item">
                <span className="info-label">Template:</span>
                <span className="info-value">{websiteData.templateId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Wedding Date:</span>
                <span className="info-value">
                  {new Date(websiteData.weddingDate).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span
                  className={`status-badge ${
                    websiteData.isPublished
                      ? "status-published"
                      : "status-draft"
                  }`}
                >
                  {websiteData.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">
                  {new Date(websiteData.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(websiteData.updatedAt).toLocaleDateString()}
                </span>
              </div>
              {websiteData.isPublished && (
                <div className="info-item">
                  <span className="info-label">Public URL:</span>
                  <span className="info-value">
                    <a
                      href={`/api/wedding/${websiteData.websiteUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      View Website
                    </a>
                  </span>
                </div>
              )}
            </div>
            <div className="website-info">
              <h6 className="mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/choose-template")}
                >
                  Create Another Website
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    // Navigate to user dashboard
                    navigate("/user-dashboard");
                  }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default WeddingWebsiteView;
