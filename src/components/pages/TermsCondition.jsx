import React, { useState } from "react";

const TermsCondition = () => {
  const [activeSection, setActiveSection] = useState("terms");

  const legalSections = {
    terms: {
      title: "Terms of Service",
      content: `Welcome to WeddingWire! These Terms of Service govern your use of our website and services. By accessing or using WeddingWire, you agree to be bound by these Terms.

      1. Account Registration
      You must create an account to access certain features. You agree to provide accurate information and keep your password secure.

      2. User Content
      You retain ownership of content you post, but grant WeddingWire a license to use it. You are responsible for your content and agree not to post illegal or infringing material.

      3. Prohibited Activities
      You agree not to: harass other users, use automated systems, violate laws, or interfere with the service.

      4. Termination
      We may suspend or terminate your account for violations of these Terms.

      5. Disclaimer
      WeddingWire provides the service "as is" without warranties.`,
    },
    privacy: {
      title: "Privacy Policy",
      content: `Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.

      1. Information We Collect
      We collect information you provide directly, usage data, and information from cookies.

      2. How We Use Information
      We use your information to provide services, communicate with you, and improve our platform.

      3. Information Sharing
      We may share information with vendors and service providers, or when required by law.

      4. Your Choices
      You can update your account information and communication preferences at any time.

      5. Data Security
      We implement security measures to protect your information, but no system is completely secure.`,
    },
    cookies: {
      title: "Cookie Policy",
      content: `We use cookies and similar technologies to provide and improve our services.

      1. What Are Cookies?
      Cookies are small text files stored on your device when you visit websites.

      2. Types of Cookies We Use
      - Essential cookies: Required for basic functions
      - Performance cookies: Help us understand how visitors interact
      - Functionality cookies: Remember your preferences
      - Advertising cookies: Deliver relevant ads

      3. Your Choices
      Most browsers allow you to control cookies through their settings. However, disabling cookies may affect functionality.`,
    },
    intellectual: {
      title: "Intellectual Property",
      content: `All content on WeddingWire is protected by intellectual property laws.

      1. Our Content
      The WeddingWire name, logos, and all related names are trademarks of WeddingWire. All website content is protected by copyright.

      2. Your Content
      You retain ownership of content you post but grant us a license to use it.

      3. Copyright Complaints
      We respect intellectual property rights. Please contact us with any infringement claims.`,
    },
    disclaimer: {
      title: "Disclaimer of Liability",
      content: `WeddingWire provides a platform for wedding professionals and couples to connect.

      1. No Endorsement
      We do not endorse any vendors listed on our site. We are not responsible for the quality of services provided.

      2. Third-Party Content
      We are not responsible for content posted by users or third parties.

      3. Limitation of Liability
      To the fullest extent permitted by law, WeddingWire shall not be liable for any indirect, incidental, or consequential damages.`,
    },
  };

  return (
    <div className="wedding-legal-container">
      <div className="wedding-legal-hero">
        <h1 className="wedding-legal-herotitle">Legal Terms</h1>
        <p className="wedding-legal-herosubtitle">
          Understanding our policies and terms of service
        </p>
      </div>

      <div className="wedding-legal-content">
        <aside className="wedding-legal-sidebar">
          <h2 className="wedding-legal-sidebartitle">Legal Documents</h2>
          <ul className="wedding-legal-sidelinks">
            {Object.keys(legalSections).map((key) => (
              <li key={key}>
                <button
                  className={`wedding-legal-sidelink ${
                    activeSection === key ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(key)}
                >
                  {legalSections[key].title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="wedding-legal-main">
          <div className="wedding-legal-section">
            <h2 className="wedding-legal-sectiontitle">
              {legalSections[activeSection].title}
            </h2>
            <div className="wedding-legal-sectioncontent">
              {legalSections[activeSection].content
                .split("\n")
                .map((paragraph, index) => (
                  <p key={index} className="wedding-legal-paragraph">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          <div className="wedding-legal-update">
            <h3 className="wedding-legal-updatetitle">Last Updated</h3>
            <p className="wedding-legal-updatedate">January 1, 2023</p>
            <p className="wedding-legal-updatetext">
              We may update these terms from time to time. We will notify you of
              any changes by posting the new terms on this page.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsCondition;
