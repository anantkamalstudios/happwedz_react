import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaqQuestions } from "./FaqData.js";

function Faq({ formData, setFormData, onSave }) {
  const { vendor } = useSelector((state) => state.vendorAuth);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(formData.faqs || {});

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
    if (!vendor?.id || !vendor?.vendor_type_id) {
      console.error("Cannot save: Vendor ID or Vendor Type ID is missing.");
      return;
    }
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
      <div className="w-100 fs-14 d-flex justify-content-center align-content-center">
        <button
          type="submit"
          onClick={handleSave}
          className="px-4 py-2 rounded btn-primary"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Faq;
