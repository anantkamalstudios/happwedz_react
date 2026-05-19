import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaqQuestions } from "./FaqData.js";

function Faq({ formData, setFormData, onSave }) {
  const { vendor } = useSelector((state) => state.vendorAuth);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(formData.faqs || {});
  const [subcategories, setSubcategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!vendor?.id) return;

    async function fetchAnswers() {
      try {
        const res = await fetch(
          `https://happywedz.com/api/faq-answers/${vendor.id}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const answerMap = {};
        (Array.isArray(data) ? data : []).forEach((a) => {
          const qid = a.faqQuestionId ?? a.faq_question_id ?? a.faq_questionid;
          if (qid == null) return;

          let val = a.answer;
          if (typeof val === "string") {
            const s = val.trim();
            if (
              (s.startsWith("{") && s.endsWith("}")) ||
              (s.startsWith("[") && s.endsWith("]"))
            ) {
              try {
                val = JSON.parse(s);
              } catch {}
            }
          }
          answerMap[qid] = val;
        });
        setAnswers(answerMap);
      } catch (err) {
        // silent fail
      }
    }

    fetchAnswers();
  }, [vendor?.id]);

  const [subcatName, setSubcatName] = useState("");

  useEffect(() => {
    const fetchSubcategory = async () => {
      if (vendor?.vendor_type_id) {
        try {
          const res = await fetch(`https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`);
          if (!res.ok) return;
          const typeData = await res.json();
          const subcategoryId = formData.vendor_subcategory_id || vendor?.vendor_subcategory_id;
          const subcats = typeData.subcategories || [];
          const subcat = subcats.find(s => s.id == subcategoryId);
          if (subcat && subcat.name) {
            setSubcatName(subcat.name);
          } else {
            setSubcatName(typeData.name || "");
          }
        } catch (err) {
          console.error("Error fetching subcategory for FAQs:", err);
        }
      }
    };
    fetchSubcategory();
  }, [vendor?.vendor_type_id, formData.vendor_subcategory_id, vendor?.vendor_subcategory_id]);

  useEffect(() => {
    async function fetchVendorType() {
      if (vendor?.vendor_type_id) {
        try {
          const res = await fetch(`https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`);
          if (res.ok) {
            const data = await res.json();
            setSubcategories(data?.subcategories || []);
          }
        } catch (err) {
          console.error("Error fetching vendor type:", err);
        }
      }
    }
    fetchVendorType();
  }, [vendor?.vendor_type_id]);

  useEffect(() => {
    if (vendor?.vendor_type_id) {
      const activeSubcategoryId = formData?.vendor_subcategory_id || vendor?.vendor_subcategory_id;
      const resolvedSubcategoryName = subcategories.find(
        (s) => String(s.id) === String(activeSubcategoryId)
      )?.name || "";
      const normalizedSub = resolvedSubcategoryName.toLowerCase();

      const isLocMaster = formData?.pre_wedding_location_master && Object.keys(formData.pre_wedding_location_master).length > 0;
      const isPhotoMaster = formData?.pre_wedding_photographer_master && Object.keys(formData.pre_wedding_photographer_master).length > 0;
      const isDjMaster = formData?.dj_master && Object.keys(formData.dj_master).length > 0;
      const isChoreoMaster = formData?.sangeet_choreographer_master && Object.keys(formData.sangeet_choreographer_master).length > 0;
      const isEntMaster = formData?.wedding_entertainer_master && Object.keys(formData.wedding_entertainer_master).length > 0;

      const vendorTypeKey = Object.keys(FaqQuestions).find((key) => {
        const entry = FaqQuestions[key];
        if (entry.vendor_type_id !== vendor.vendor_type_id) return false;
        if (entry.subcategory_keyword === "location") {
          return normalizedSub.includes("location") || isLocMaster;
        }
        if (entry.subcategory_keyword === "photographer") {
          return normalizedSub.includes("photographer") || isPhotoMaster;
        }
        if (entry.subcategory_keyword === "dj") {
          return normalizedSub.includes("dj") || isDjMaster;
        }
        if (entry.subcategory_keyword === "choreographer") {
          return normalizedSub.includes("choreographer") || isChoreoMaster;
        }
        if (entry.subcategory_keyword === "entertainer") {
          return normalizedSub.includes("entertainment") || normalizedSub.includes("entertainer") || isEntMaster;
        }
        return true;
      });

      if (vendorTypeKey) {
        const allQuestions = FaqQuestions[vendorTypeKey].questions || [];
        const normSubcat = (subcatName || "").trim().toLowerCase();

        // 1. Groomwear (vendor_type_id: 11)
        if (vendor.vendor_type_id === 11) {
          const isSherwani = normSubcat.includes("sherwani");
          const isWeddingSuit = normSubcat.includes("suit") || normSubcat.includes("wedding suite");

          const filtered = allQuestions.filter(q => {
            const qid = q.id;
            // Standard questions (401 - 410) are always shown
            if (qid >= 401 && qid <= 410) return true;
            // Sherwani questions (411 - 425)
            if (qid >= 411 && qid <= 425) return isSherwani;
            // Wedding suit questions (426 - 435)
            if (qid >= 426 && qid <= 435) return isWeddingSuit;
            return true;
          });
          setQuestions(filtered);
        }
        // 2. Decorators (vendor_type_id: 4)
        else if (vendor.vendor_type_id === 4) {
          const isDecorator = normSubcat.includes("decorator") || normSubcat.includes("decor") || normSubcat.includes("event styling");
          // Wedding Planners (normSubcat includes "planner" or "planning") has no AI FAQs
          const filtered = allQuestions.filter(q => {
            const qid = q.id;
            // Standard questions (1201 - 1212) are always shown
            if (qid >= 1201 && qid <= 1212) return true;
            // Decorator questions (1213 - 1225)
            if (qid >= 1213 && qid <= 1225) return isDecorator;
            return true;
          });
          setQuestions(filtered);
        }
        // 3. Invites & Gifts (vendor_type_id: 9)
        else if (vendor.vendor_type_id === 9) {
          const isTrousseauPacker = normSubcat.includes("trousseau packer") || normSubcat.includes("trousseau pack");
          const isGift = normSubcat === "gifts" || normSubcat === "gift" || normSubcat.includes("gifting") || normSubcat === "invitation gifts";
          const isFavor = normSubcat.includes("favor") || normSubcat.includes("favour");
          const isInvitation = (normSubcat.includes("invitation") || normSubcat.includes("invite")) && !isGift;

          const filtered = allQuestions.filter(q => {
            const qid = q.id;
            // Standard questions (1501 - 1515) are always shown
            if (qid >= 1501 && qid <= 1515) return true;
            // Trousseau Packer questions (2116 - 2129)
            if (qid >= 2116 && qid <= 2129) return isTrousseauPacker;
            // Gifts questions (2130 - 2144)
            if (qid >= 2130 && qid <= 2144) return isGift;
            // Favors questions (2145 - 2159)
            if (qid >= 2145 && qid <= 2159) return isFavor;
            // Invitations questions (2160 - 2172)
            if (qid >= 2160 && qid <= 2172) return isInvitation;
            return true;
          });
          setQuestions(filtered);
        }
        else {
          setQuestions(allQuestions);
        }
      } else {
        setQuestions([]);
      }
    }
  }, [vendor?.vendor_type_id, subcatName, formData?.vendor_subcategory_id, vendor?.vendor_subcategory_id, subcategories]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, faqs: answers }));
  }, [answers, setFormData]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const flattenOtherRadioAnswers = (raw) => {
    const out = { ...raw };
    const suffix = "_other";
    Object.keys(raw).forEach((key) => {
      if (!String(key).endsWith(suffix)) return;
      const baseId = String(key).slice(0, -suffix.length);
      const detail = raw[key];
      if (out[baseId] === "Other" && detail && String(detail).trim()) {
        out[baseId] = `Other: ${String(detail).trim()}`;
      }
      delete out[key];
    });
    return out;
  };

  // Save answers to backend
  const handleSave = async () => {
    if (!vendor?.id || !vendor?.vendor_type_id) {
      setSaveError("Cannot save: Vendor ID or Vendor Type ID is missing.");
      return;
    }
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    const mergedAnswers = flattenOtherRadioAnswers(answers);
    const payload = {
      vendorId: vendor.id,
      vendorTypeId: vendor.vendor_type_id,
      answers: Object.entries(mergedAnswers).map(([faqQuestionId, answer]) => ({
        faqQuestionId,
        answer,
      })),
    };
    try {
      const res = await fetch("https://happywedz.com/api/faq-answers/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaveSuccess(true);
        if (onSave) onSave();
        setTimeout(() => setSaveSuccess(false), 5000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setSaveError(errData.details || errData.error || "Failed to save FAQ answers. Please try again.");
      }
    } catch (err) {
      setSaveError("Network error: Could not connect to server to save FAQ answers.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!vendor) {
    return (
      <div className="p-3 border rounded bg-white text-muted">
        Loading vendor information...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-3 border rounded bg-white text-muted">
        No FAQ questions are available for this vendor type.
      </div>
    );
  }

  const checkboxAnswerHandler = (questionId, value) => {
    const prevResponses = answers[questionId] || [];
    let newResponses;
    if (prevResponses.includes(value)) {
      newResponses = prevResponses.filter((item) => item !== value);
    } else {
      newResponses = [...prevResponses, value];
    }
    handleAnswerChange(questionId, newResponses);
  };

  const renderQuestionInput = (q) => {
    switch (q.type) {
      case "text":
        return (
          <div className="mb-2">
            {q.label && q.label.length > 0 ? (
              q.label.map((label, index) => (
                <div key={index} className="mb-2">
                  <label className="form-label fw-semibold fs-16">
                    {label}
                  </label>
                  <input
                    type="text"
                    className="form-control fs-14"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                </div>
              ))
            ) : (
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control fs-14"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              </div>
            )}
          </div>
        );
      case "textarea":
        return (
          <div>
            <textarea
              className="form-control fs-14"
              rows={3}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          </div>
        );
      case "range":
        return (
          <div>
            <input
              type="range"
              min={q.min || 0}
              max={q.max || 100}
              className="form-range slider-range-input"
              value={answers[q.id] || 0}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
            <div className="d-flex justify-content-between fs-14">
              <span>₹ {answers[q.id] || 0}</span>
              <span>₹ {q.max}+</span>
            </div>
          </div>
        );
      case "radio":
        return (
          <div>
            <div className="d-flex flex-wrap gap-2">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="form-check d-flex align-items-center gap-2 fs-14 me-3"
                >
                  <input
                    type="radio"
                    name={`radio_${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleAnswerChange(q.id, option)}
                    className="form-check-input me-1"
                  />
                  {option}
                </label>
              ))}
            </div>
            {q.allowOther && answers[q.id] === "Other" && (
              <input
                type="text"
                className="form-control fs-14 mt-2"
                placeholder="Please specify"
                value={answers[`${q.id}_other`] || ""}
                onChange={(e) =>
                  handleAnswerChange(`${q.id}_other`, e.target.value)
                }
              />
            )}
          </div>
        );
      case "checkbox":
        return (
          <div>
            <div className="d-flex flex-wrap gap-2">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="form-check d-flex align-items-center gap-2 fs-14 me-3"
                >
                  <input
                    type="checkbox"
                    name={q.id}
                    value={option}
                    checked={
                      Array.isArray(answers[q.id]) &&
                      answers[q.id].includes(option)
                    }
                    onChange={() => checkboxAnswerHandler(q.id, option)}
                    className="form-check-input me-1"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );
      case "number":
        return (
          <div className="mb-2">
            {q.label && q.label.length > 0 ? (
              q.label.map((label, index) => (
                <div key={index} className="mb-2">
                  <label className="form-label fw-semibold fs-16">
                    {label}
                  </label>
                  <input
                    inputMode="numeric"
                    min="0"
                    type="number"
                    className="form-control fs-14"
                    value={(answers[q.id] && answers[q.id][index]) || ""}
                    onChange={(e) => {
                      const newAnswer = { ...(answers[q.id] || {}) };
                      newAnswer[index] = e.target.value;
                      handleAnswerChange(q.id, newAnswer);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="mb-2">
                <input
                  type="number"
                  className="form-control fs-14"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container my-5">
      <div className="faq-intro-card mb-4 primary-light-bg">
        <div className="intro-inner p-0">
          <div className="d-flex px-3 pt-3 pb-2">
            <div className="col-1">
              <img
                src="/images/vendorsDashboard/faq.png"
                alt="FAQ"
                width={30}
                height={30}
                className="img-fluid faq-image d-block mb-2"
                style={{ marginLeft: 0 }}
              />
            </div>
            <div className="">
              <h5 className="intro-title fs-16 px-2" style={{ color: "red" }}>
                Please provide details about your services.
              </h5>
              <p className="intro-sub fs-14 px-2" style={{ color: "black" }}>
                Add responses to frequently asked questions about your business
                to give couples a better understanding of your offering before
                deciding whether to contact you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {questions.map((q, idx) => (
        <div className="card shadow-sm mb-3 faq-card" key={q.id}>
          <div className="card-body">
            <div className="qa-top">
              {/* <div className="faq-number">{idx + 1}</div> */}
              <p className="question-text fs-16">{q.text}</p>
            </div>
            <div>
              {q.description && (
                <p className="text-muted fs-14">{q.description}</p>
              )}
              <div className="mh-100 mt-3 fs-14">{renderQuestionInput(q)}</div>
            </div>
          </div>
        </div>
      ))}
      {saveSuccess && (
        <div className="alert alert-success text-center mb-3 fs-14 shadow-sm" role="alert">
          FAQ answers saved successfully!
        </div>
      )}
      {saveError && (
        <div className="alert alert-danger text-center mb-3 fs-14 shadow-sm" role="alert">
          {saveError}
        </div>
      )}
      <div className="w-100 fs-14 d-flex justify-content-center align-content-center">
        <button
          type="submit"
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded btn-primary"
        >
          {isSaving ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Faq;
