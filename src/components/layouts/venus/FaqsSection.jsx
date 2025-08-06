import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FaqsSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I find wedding venues in my budget?",
            answer: "Use our budget filter to search venues by price range. Most venues list their starting prices, and you can contact them directly for detailed pricing.",

        },
        {
            question: "What's the ideal time to book a wedding venue?",
            answer: "We recommend booking 9-12 months in advance for peak season weddings. For off-season dates, 6-8 months is usually sufficient.",

        },
        {
            question: "How many guests can wedding venues accommodate?",
            answer: "Venues range from intimate spaces for 50 guests to large banquet halls for 1000+ guests. Use our guest count filter to find perfect matches.",

        },
        {
            question: "Can I see venue availability before contacting?",
            answer: "Many venues display real-time availability on their profiles. For others, you can send inquiries directly through our platform.",

        },
        {
            question: "What areas have the most wedding venues?",
            answer: "Popular areas include Banjara Hills, Gachibowli, and Jubilee Hills. Use our location search to explore venues by area.",

        }
    ];

    return (
        <div className="my-5 py-4 faq-section">
            <Row className="justify-content-center">
                <Col lg={8} className="text-center faqs-content">
                    <h3 className="mb-3  text-semibold text-start">Frequently asked questions regarding Wedding Venues</h3>


                    <div className="accordion">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="accordion-header">
                                    <div className="d-flex align-items-center">
                                        <span className="faq-icon me-3">{faq.icon}</span>
                                        <h5 className="mb-0">{faq.question}</h5>
                                        <span className="ms-auto">
                                            {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="accordion-content"
                                    style={{
                                        maxHeight: activeIndex === index ? '200px' : '0',
                                        opacity: activeIndex === index ? '1' : '0'
                                    }}
                                >
                                    <div className="py-3 ps-5 pe-3">{faq.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>

            <style jsx>{`
        .faq-section {
    
          border-radius: 15px;
          
        }
          .faqs-content{
          width: 150%;
          padding: 20px;}
        .accordion-item {
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .accordion-item.active {
          border-color: var(--bs-primary);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .accordion-header {
          padding: 18px 20px;
          background: white;
        }
        .accordion-content {
          background: white;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .faq-icon {
          font-size: 1.2rem;
        }
        .accordion-item:not(.active):hover {
          background: #f8f9fa;
        }
      `}</style>
        </div>
    );
};

export default FaqsSection;