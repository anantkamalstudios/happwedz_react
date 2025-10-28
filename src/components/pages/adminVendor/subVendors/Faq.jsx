import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaqQuestions } from "./FaqData.js";

function Faq({ formData, setFormData, onSave }) {
  const { vendor } = useSelector((state) => state.vendorAuth);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(formData.faqs || {});

  useEffect(() => {
    if (vendor?.vendor_type_id) { 
    } 
    async function fetchAnswers() {
      if (vendor?.id) {
        try {
          const res = await fetch(`/faq-answers/${vendor.id}`);
          if (res.ok) {
            const data = await res.json(); 
            const answerMap = {};
            data.forEach((a) => {
              answerMap[a.faqQuestionId] = a.answer;
            });
            setAnswers(answerMap);
          }
        } catch (err) { 
        }
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
                <div key={index}>
                  <label>{label}</label>
                  <input
                    type="text"
                    className="form-control w-25"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  />
                </div>
              ))
            ) : (
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control w-25"
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
              className="form-control"
              rows={3}
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          </div>
        );
      case "range":
        return (
          <div className="w-75">
            <input
              type="range"
              min={q.min || 0}
              max={q.max || 100}
              className="form-range slider-range-input"
              value={answers[q.id] || 0}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
            <div className="w-100 d-flex justify-content-between">
              <p>₹ {answers[q.id] || 0}</p>
              <p>₹ {q.max}+</p>
            </div>
          </div>
        );
      case "radio":
        return (
          <div>
            <div className="gap-2 grid-col-3">
              {q.options.map((option, index) => (
                <label key={index} className="me-2 gap-2">
                  <input
                    type="radio"
                    name={`radio_${q.id}`}
                    value={option}
                    checked={answers[q.id] === option}
                    onChange={() => handleAnswerChange(q.id, option)}
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
            <div className="gap-2 grid-col-3">
              {q.options.map((option, index) => (
                <label
                  key={index}
                  className="me-2 d-flex justify-content-center gap-2"
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
                <div key={index}>
                  <label>{label}</label>
                  <input
                    inputMode="numeric"
                    min="0"
                    type="number"
                    className="form-control w-25"
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
                  className="form-control w-25"
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
                src="/images/vendorsDashboard/chat.png"
                alt="FAQ"
                width={30}
                height={30}
                className="img-fluid faq-image d-block mb-2"
                style={{ marginLeft: 0 }}
              />
            </div>
            <div className="">
              <h5 className="intro-title" style={{ color: "red" }}>
                Please provide details about your services.
              </h5>
              <p className="intro-sub" style={{ color: "black" }}>
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
              <p className="question-text">{q.text}</p>
            </div>
            <div>
              {q.description && <p className="text-muted">{q.description}</p>}
              <div className="mh-100 mt-3">{renderQuestionInput(q)}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="w-100  d-flex justify-content-center align-content-center">
        <button
          type="submit"
          onClick={handleSave}
          className="px-4 py-2 rounded btn-pink w-25"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Faq;
