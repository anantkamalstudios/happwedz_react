import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaqQuestions } from "./FaqData.js";

function Faq({ formData, setFormData, onSave }) {
  // For dynamic min/max for range questions
  const [rangeLimits, setRangeLimits] = useState({});
  const { vendor } = useSelector((state) => state.vendorAuth);

  useEffect(() => {
    if (vendor?.vendor_type_id) {
      console.log("Vendor Type ID:", vendor.vendor_type_id);
    }
    // Fetch answers from backend
    async function fetchAnswers() {
      if (vendor?.id) {
        try {
          const res = await fetch(`/faq-answers/${vendor.id}`);
          if (res.ok) {
            const data = await res.json();
            // Convert array to { [faqQuestionId]: answer }
            const answerMap = {};
            data.forEach((a) => {
              answerMap[a.faqQuestionId] = a.answer;
            });
            setAnswers(answerMap);
          }
        } catch (err) {
          // Optionally handle error
        }
      }
    }
    fetchAnswers();
    // eslint-disable-next-line
  }, [vendor?.id]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(formData.faqs || {});

  useEffect(() => {
    if (vendor?.vendor_type_id) {
      const vendorTypeKey = Object.keys(FaqQuestions).find(
        (key) => FaqQuestions[key].vendor_type_id === vendor.vendor_type_id
      );

      if (vendorTypeKey) {
        setQuestions(FaqQuestions[vendorTypeKey].questions);
      } else {
        setQuestions([]);
      }
    }
  }, [vendor?.vendor_type_id]);

  useEffect(() => {
    // When answers change, update the parent formData
    setFormData((prev) => ({ ...prev, faqs: answers }));
  }, [answers, setFormData]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Save answers to backend
  const handleSave = async () => {
    if (!vendor?.id || !vendor?.vendor_type_id) return;
    const payload = {
      vendorId: vendor.id,
      vendorTypeId: vendor.vendor_type_id,
      answers: Object.entries(answers).map(([faqQuestionId, answer]) => ({
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
        // Optionally show success
        if (onSave) onSave();
      } else {
        // Optionally show error
      }
    } catch (err) {
      // Optionally show error
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

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-4 fw-bold">Frequently Asked Questions</h6>
        {questions.map((q) => (
          <div key={q.id} className="mb-4 p-3 border rounded bg-light">
            <label htmlFor={`faq-${q.id}`} className="form-label fw-semibold">
              {q.text}
            </label>
            {q.description && (
              <small className="d-block text-muted mb-2">{q.description}</small>
            )}

            {q.type === "textarea" && (
              <textarea
                id={`faq-${q.id}`}
                className="form-control"
                rows="3"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}

            {q.type === "text" && (
              <input
                id={`faq-${q.id}`}
                type="text"
                className="form-control"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}

            {q.type === "number" && (
              <input
                id={`faq-${q.id}`}
                type="number"
                className="form-control"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}

            {q.type === "radio" &&
              q.options.map((option) => (
                <div className="form-check" key={option}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`faq-${q.id}`}
                    id={`faq-${q.id}-${option}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`faq-${q.id}-${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}

            {/* Render checkboxes if type is 'checkbox' */}
            {q.type === "checkbox" &&
              q.options &&
              q.options.map((option) => (
                <div className="form-check" key={option}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={`faq-${q.id}`}
                    id={`faq-${q.id}-${option}`}
                    value={option}
                    checked={
                      Array.isArray(answers[q.id]) &&
                      answers[q.id].includes(option)
                    }
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAnswers((prev) => {
                        const prevArr = Array.isArray(prev[q.id])
                          ? prev[q.id]
                          : [];
                        if (checked) {
                          return { ...prev, [q.id]: [...prevArr, option] };
                        } else {
                          return {
                            ...prev,
                            [q.id]: prevArr.filter((o) => o !== option),
                          };
                        }
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`faq-${q.id}-${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}

            {/* Render range input if type is 'range' */}
            {q.type === "range" && (
              <>
                <div className="mb-2 d-flex gap-3 align-items-center">
                  <label className="mb-0">Min Price:</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: 90 }}
                    value={rangeLimits[q.id]?.min ?? q.min ?? 0}
                    min={0}
                    onChange={(e) => {
                      const min = Number(e.target.value);
                      setRangeLimits((prev) => ({
                        ...prev,
                        [q.id]: {
                          min,
                          max: prev[q.id]?.max ?? q.max ?? 100,
                        },
                      }));
                    }}
                  />
                  <label className="mb-0 ms-2">Max Price:</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    style={{ width: 90 }}
                    value={rangeLimits[q.id]?.max ?? q.max ?? 100}
                    min={rangeLimits[q.id]?.min ?? q.min ?? 0}
                    onChange={(e) => {
                      const max = Number(e.target.value);
                      setRangeLimits((prev) => ({
                        ...prev,
                        [q.id]: {
                          min: prev[q.id]?.min ?? q.min ?? 0,
                          max,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small">
                    {rangeLimits[q.id]?.min ?? q.min ?? 0}
                  </span>
                  <input
                    id={`faq-${q.id}`}
                    type="range"
                    className="form-range"
                    min={rangeLimits[q.id]?.min ?? q.min ?? 0}
                    max={rangeLimits[q.id]?.max ?? q.max ?? 100}
                    step={q.step ?? 1}
                    value={
                      answers[q.id] || rangeLimits[q.id]?.min || q.min || 0
                    }
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    style={{ width: "150px" }}
                  />
                  <span className="text-muted small">
                    {rangeLimits[q.id]?.max ?? q.max ?? 100}
                  </span>
                  <span className="ms-2 fw-semibold">
                    {answers[q.id] || rangeLimits[q.id]?.min || q.min || 0}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
        <button className="btn btn-primary mt-2" onClick={handleSave}>
          Save FAQs
        </button>
      </div>
    </div>
  );
}

export default Faq;
