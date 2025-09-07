import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { faqssection } from "../../../data/faqssection";

const FaqsSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section container my-5">
      <h2 className="text-center mb-4 faq-heading">
        Frequently Asked Questions
      </h2>
      <div className="accordion">
        {faqssection.map((faq, index) => (
          <div
            key={index}
            className={`faq-card ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-header d-flex justify-content-between align-items-center">
              <h5 className="faq-question">{`${index + 1}. ${
                faq.question
              }`}</h5>
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <p className="faq-answer">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqsSection;
