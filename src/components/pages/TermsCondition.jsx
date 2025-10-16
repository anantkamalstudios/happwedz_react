import React, { useState } from "react";

const TermsCondition = () => {
  const [activeSection, setActiveSection] = useState("terms");

  // const legalSections = {
  //   terms: {
  //     title: "Terms of Service",
  //     content: `Welcome to WeddingWire! These Terms of Service govern your use of our website and services. By accessing or using WeddingWire, you agree to be bound by these Terms.

  //     1. Account Registration
  //     You must create an account to access certain features. You agree to provide accurate information and keep your password secure.

  //     2. User Content
  //     You retain ownership of content you post, but grant WeddingWire a license to use it. You are responsible for your content and agree not to post illegal or infringing material.

  //     3. Prohibited Activities
  //     You agree not to: harass other users, use automated systems, violate laws, or interfere with the service.

  //     4. Termination
  //     We may suspend or terminate your account for violations of these Terms.

  //     5. Disclaimer
  //     WeddingWire provides the service "as is" without warranties.`,
  //   },
  //   privacy: {
  //     title: "Privacy Policy",
  //     content: `Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.

  //     1. Information We Collect
  //     We collect information you provide directly, usage data, and information from cookies.

  //     2. How We Use Information
  //     We use your information to provide services, communicate with you, and improve our platform.

  //     3. Information Sharing
  //     We may share information with vendors and service providers, or when required by law.

  //     4. Your Choices
  //     You can update your account information and communication preferences at any time.

  //     5. Data Security
  //     We implement security measures to protect your information, but no system is completely secure.`,
  //   },
  //   cookies: {
  //     title: "Cookie Policy",
  //     content: `We use cookies and similar technologies to provide and improve our services.

  //     1. What Are Cookies?
  //     Cookies are small text files stored on your device when you visit websites.

  //     2. Types of Cookies We Use
  //     - Essential cookies: Required for basic functions
  //     - Performance cookies: Help us understand how visitors interact
  //     - Functionality cookies: Remember your preferences
  //     - Advertising cookies: Deliver relevant ads

  //     3. Your Choices
  //     Most browsers allow you to control cookies through their settings. However, disabling cookies may affect functionality.`,
  //   },
  //   intellectual: {
  //     title: "Intellectual Property",
  //     content: `All content on WeddingWire is protected by intellectual property laws.

  //     1. Our Content
  //     The WeddingWire name, logos, and all related names are trademarks of WeddingWire. All website content is protected by copyright.

  //     2. Your Content
  //     You retain ownership of content you post but grant us a license to use it.

  //     3. Copyright Complaints
  //     We respect intellectual property rights. Please contact us with any infringement claims.`,
  //   },
  //   disclaimer: {
  //     title: "Disclaimer of Liability",
  //     content: `WeddingWire provides a platform for wedding professionals and couples to connect.

  //     1. No Endorsement
  //     We do not endorse any vendors listed on our site. We are not responsible for the quality of services provided.

  //     2. Third-Party Content
  //     We are not responsible for content posted by users or third parties.

  //     3. Limitation of Liability
  //     To the fullest extent permitted by law, WeddingWire shall not be liable for any indirect, incidental, or consequential damages.`,
  //   },
  // };

  const legalSections = {
    terms: {
      title: "Terms of Services",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Integer euismod lorem ut est feugiat, at scelerisque velit faucibus. 
    Nunc interdum tellus non diam tincidunt, sit amet vulputate elit aliquam.

    1. Vivamus Porta  
    Curabitur euismod, augue vitae iaculis mollis, enim lectus sodales metus, sed suscipit orci ipsum sit amet justo.

    2. Nunc Elementum  
    Aliquam blandit libero ac dui porttitor, a commodo magna convallis. Mauris tincidunt ligula sed turpis commodo, in ultricies leo bibendum.

    3. Sed Consequat  
    Cras facilisis lorem quis dui consequat, sed vulputate ante gravida. Nulla facilisi. Sed vel sem at orci mattis tincidunt.

    4. Donec Amet  
    In rhoncus felis vitae sem facilisis malesuada. Quisque pretium nulla in odio sodales cursus.

    5. Ut Vulputate  
    Etiam tempor arcu id risus viverra, nec viverra risus aliquet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.`,
    },
    privacy: {
      title: "Privacy Policy",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Etiam ut nibh gravida, fringilla odio ac, laoreet sapien. Curabitur sit amet mauris lectus.

    1. Integer Mattis  
    Ut vel lectus sed nulla aliquam ornare. In et orci nec lorem gravida sagittis ac eget turpis.

    2. Fusce Faucibus  
    Pellentesque ullamcorper ex et elit suscipit, vel ornare mauris vulputate. Donec vel arcu ut nibh suscipit hendrerit.

    3. Aliquam Vitae  
    Nam tempor, nulla sit amet vulputate lacinia, nisl urna fermentum eros, nec suscipit erat velit ut leo.

    4. Mauris Blandit  
    Donec porttitor odio at sapien euismod, vel tincidunt felis dictum. Vestibulum sed nisi id lorem porttitor egestas.

    5. Cras Integer  
    Nullam malesuada tortor vel felis cursus, et ultricies nisi condimentum. Sed imperdiet nibh sit amet lacus pulvinar pretium.`,
    },
    cookies: {
      title: "Cookie Policy",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Vestibulum eget augue dapibus, aliquam arcu non, cursus lorem.

    1. Donec Ultrices  
    Proin dictum, mi et vestibulum fringilla, mi metus consequat erat, nec convallis orci nunc non massa.

    2. Suspendisse Potenti  
    - Aenean lacinia risus quis lorem fermentum sagittis.  
    - Morbi ac urna sed libero blandit faucibus.  
    - Integer vel diam quis lorem dignissim tempor.  
    - Nam condimentum purus ac leo varius elementum.

    3. Pellentesque Dictum  
    Vestibulum sit amet arcu quis est viverra pulvinar. Maecenas nec risus ut lectus cursus laoreet sed nec nunc.`,
    },
    intellectual: {
      title: "Intellectual Problem",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Suspendisse pretium urna ac velit aliquet, vitae efficitur nisl volutpat.

    1. Phasellus Odio  
    Integer ut magna non orci tristique vestibulum. Fusce commodo lacus ut est ornare, vitae laoreet nulla tincidunt.

    2. Morbi Efficitur  
    Etiam imperdiet magna in ipsum ullamcorper, in porta sem dignissim. Duis dapibus mi eget neque pulvinar ultricies.

    3. Pellentesque Id  
    Mauris fermentum augue non ligula suscipit, nec tincidunt velit bibendum. Ut varius massa eget orci posuere, in pulvinar risus egestas.`,
    },
    disclaimer: {
      title: "Disclaimer of Liability",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed pharetra nisl ac enim vestibulum, vitae vulputate enim blandit.

    1. Nulla Facilisi  
    Morbi faucibus turpis at sem iaculis, vitae commodo magna dignissim. Curabitur quis nisi in justo congue pretium.

    2. Sed Euismod  
    Donec tincidunt augue in dolor cursus facilisis. Nunc pulvinar, ex in viverra elementum, turpis erat viverra mauris.

    3. Integer Commodo  
    Suspendisse tempor mi non elit egestas, non euismod sem suscipit. Pellentesque sagittis lectus ut ultricies tempus.`,
    },
  };

  return (
    <div className="wedding-legal-container">
      <div className="wedding-legal-hero">
        <h1 className="wedding-legal-herotitle">Legal Terms</h1>
        <p className="wedding-legal-herosubtitle">
          {/* Understanding our policies and terms of service */}
          Lorem, ipsum dolor sit amet consectetur adipisicing.
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
            <h3 className="wedding-legal-updatetitle">Lorem, ipsum.</h3>
            <p className="wedding-legal-updatedate">Lorem, ipsum dolor.</p>
            <p className="wedding-legal-updatetext">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, totam! Blanditiis culpa non iusto atque rem ab nostrum, corporis id!
            </p>
          </div>
          {/* <div className="wedding-legal-update">
            <h3 className="wedding-legal-updatetitle">Last Updated</h3>
            <p className="wedding-legal-updatedate">January 1, 2025</p>
            <p className="wedding-legal-updatetext">
              We may update these terms from time to time. We will notify you of
              any changes by posting the new terms on this page.
            </p>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default TermsCondition;
