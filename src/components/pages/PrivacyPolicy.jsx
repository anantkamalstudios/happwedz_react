import React, { useState } from "react";
import {
  FaUserShield,
  FaDatabase,
  FaShareAlt,
  FaCookieBite,
  FaCreditCard,
  FaTrashAlt,
  FaBalanceScale,
  FaHeadset,
} from "react-icons/fa";

/**
 * Privacy Policy (/privacy — linked from the footer and the sitemap).
 *
 * The content describes what the product actually does today: the couple's
 * dashboard, the vendor dashboard (profile, KYC, subscriptions, leads), and the
 * honeymoon travel bookings. Keep it in step with the code when those change.
 */
const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const primaryColor = "var(--primary-color)";

  const sections = {
    overview: {
      title: "Overview",
      icon: <FaUserShield />,
      content: `
Last Updated: 23 September 2026

HappyWedz ("HappyWedz", "we", "us") runs happywedz.com and the HappyWedz apps — a wedding planning platform where couples find and book vendors, plan their wedding, and book honeymoon travel, and where vendors list and manage their business.

This policy explains what personal data we collect, why we collect it, who we share it with, how long we keep it, and the choices you have. It applies to everyone who uses HappyWedz:
• Couples and other visitors planning a wedding
• Vendors and venues using the vendor dashboard
• Guests whose details a couple adds to a guest list or invitation

1. Who is responsible for your data
HappyWedz is the data fiduciary for the personal data described here. Vendors you contact or book are separate businesses and are responsible for the data you share directly with them.

2. Your agreement
By using HappyWedz you agree to this policy. If you do not agree, please stop using the platform. Where the law requires your consent — for example to send you marketing messages or to use your photo in an AI feature — we ask for it separately and you can withdraw it at any time.

3. Terms that also apply
This policy sits alongside our Terms & Condition and Cancellation Policy.
`,
    },

    collect: {
      title: "Information We Collect",
      icon: <FaDatabase />,
      content: `
We collect only what the platform needs to work. What that is depends on how you use it.

1. If you are planning a wedding

a) Your account
• Name, email address and mobile number
• Password, or a Google / Apple sign-in identifier if you use social sign-in
• One-time passwords (OTP) used to verify your phone or email
• Profile and cover photos, if you upload them
• Wedding details you enter: wedding date, city, and venue

b) Your planning tools
• Budget entries, estimated and final costs, and payments you record
• Checklists and task notes
• Shortlisted and favourite vendors
• Guest lists and seating plans
• Enquiries, quotation requests and chat messages you exchange with vendors
• Reviews and ratings you write, which are shown publicly with your name

c) Your wedding website, e-invites and photo sharing
• Bride and groom details, your story, events, dates and venues
• Photos and videos you upload for invitations, galleries and event sharing
• Share links and RSVP responses

d) Information about your guests
When you add guests to a guest list or send an invitation, you give us their names and, where you provide them, their phone numbers, email addresses, meal preferences, RSVP replies and your own notes about them. Please add only what you need, and only where the guest would reasonably expect you to share it. We use guest details solely to run your guest list, invitations and RSVPs.

e) AI and try-on features
• The instructions and details you give our AI planning assistants
• If you use the virtual makeup or style try-on, the photo you upload and the image it produces

2. If you book honeymoon travel
Airlines, hotels, cab operators and insurers require traveller details, which we pass to them through our travel supplier. Depending on what you book, this can include:
• Traveller name, title, gender, date of birth and age
• Passport number, issue and expiry date, and nationality for international travel
• PAN, where a hotel or insurer requires it
• Contact email and mobile number, and an emergency contact where the airline requires one
• Pincode and address details where required for insurance
• GST details, if you ask for a GST invoice
• Booking references, PNRs, tickets, vouchers and policy numbers

3. If you are a vendor

a) Business profile
• Business name, contact person, email address and mobile number
• City and service locations, categories and subcategories
• Business description, services, packages and pricing you publish
• Photos, videos and other portfolio media you upload

b) Verification (KYC)
• The documents you upload to get verified: Aadhaar, PAN, and any business documents you add with your own label (for example a GST certificate or shop licence)
• The file name, type and size of each document, and which round of submission it belongs to
• The result of our review, including the reason if a submission is rejected

Verification documents are stored in private storage. They are not public, and our reviewers open them through links that expire within minutes. When you resubmit, the earlier documents are marked superseded and kept as a record of the review.

c) Subscriptions and payments
• Your plan, its start and end dates, trial status and renewal state
• Payment records: amount, status, method, invoice number, and the order and payment identifiers returned by our payment gateway

d) Running your business on HappyWedz
• Enquiries and leads, which include the customer's name, contact details and wedding requirements
• Chat messages between you and customers
• Quotations you send and pricing requests you receive
• Reviews customers leave about your business
• Counts of how many times your profile was viewed
• If you choose to connect Instagram: your Instagram username, account name, account type, profile picture and an access token, used to show your posts on your profile. The connection asks Instagram for permission to read your business account's posts, comments and messages. You can disconnect at any time from the dashboard, which switches the connection off; write to privacy@happywedz.com if you also want the stored token deleted.

e) Your own clients, if you use the vendor CRM
The CRM lets you keep records about your clients on HappyWedz, including people who never used HappyWedz themselves. That can include their name, phone number, email address, location and your notes; event dates and venues; quotations, invoices, payments and balances; your GSTIN, PAN, bank details and UPI id as they appear on those documents; and files you upload against a client.

You decide what goes in, and you remain responsible for it — please add only what you are entitled to hold, and tell your clients how you use it. We store it for you, and on your instruction we email your clients reminders and documents on your behalf. Quotations, invoices and receipts you share are reachable through a secret link: anyone who has the link can open that document, so share links carefully.

f) Exports
When you export leads or CRM clients to a spreadsheet, that copy leaves HappyWedz and our protections no longer apply to it. Keep those files safe and delete them when you no longer need them.

4. Information we collect automatically
• Device and browser type, operating system and device identifiers
• IP address and approximate location derived from it
• Pages viewed, searches, taps and other activity on the platform
• Cookies and similar local storage, described in the Cookies section
• When a vendor profile is viewed, we record the view together with the viewer's IP address, so vendors can see view counts and so we can detect fake traffic

5. Location
If you allow it, we use your device location to show nearby vendors and venues. You can turn this off in your browser or device settings at any time.

6. What we do not collect
• We never receive or store your full card number, CVV, UPI PIN or netbanking password — these go directly to our payment gateway
• We do not ask for caste, religion, health or other sensitive categories of data, beyond details you volunteer in free-text fields such as your wedding requirements
`,
    },

    use: {
      title: "How We Use Your Information",
      icon: <FaUserShield />,
      content: `
We use personal data for the following purposes and no others.

1. To run the platform
• Create and secure your account, and sign you in
• Show you vendors, venues and packages, and let you shortlist and enquire
• Pass your enquiry to the vendors you choose
• Run your planning tools: budget, checklist, guest list, invitations and wedding website
• Complete and manage your travel bookings, and issue tickets, vouchers and invoices
• Give vendors the dashboard they subscribe to, including leads, chats and verification

2. To communicate with you
• Booking confirmations, payment receipts, reminders and service updates
• Replies from our support team
• Offers and newsletters, only where you have opted in. Every marketing message has an unsubscribe option; service messages about a booking will still reach you.

3. To take payments
Process subscription and booking payments, refunds and chargebacks, and keep the records tax law requires.

4. To keep HappyWedz safe and honest
Detect and prevent fraud, fake listings, fake reviews and abuse; verify vendors; enforce our Terms; and protect our users and our rights.

5. To improve the product
Understand which features are used and where people get stuck, fix problems, and build new features. Wherever it is enough for the purpose, we do this with aggregated or de-identified data.

6. To meet legal obligations
Comply with Indian law, including tax and accounting rules, and respond to lawful requests from authorities.
`,
    },

    sharing: {
      title: "When We Share Information",
      icon: <FaShareAlt />,
      content: `
We do not sell your personal data. We share it only in the situations below.

1. With vendors you choose
When you send an enquiry, request a quote or make a booking, the vendor receives your name, contact details and the requirements you shared. What the vendor then does with it is governed by that vendor's own privacy practices.

2. With travel suppliers
For honeymoon bookings we send traveller and contact details to our travel technology partner and, through them, to the airline, hotel, cab operator or insurer you booked. They need it to issue your ticket, booking or policy.

3. With our payment gateway
Payments are handled by our payment gateway (Razorpay). Your card, UPI or banking credentials are entered on their systems, not ours. We receive only the order and payment identifiers, the amount and the status.

4. With service providers who work for us
These providers process data on our instructions and only to provide their service to us:
• Cloud hosting and file storage — photos, videos, invitations and verification documents are stored on Amazon Web Services in India
• Email delivery, for booking confirmations, verification updates and the CRM reminders vendors send to their clients
• Google Sign-In, if you choose to sign in with your Google account
• Map and geocoding services — when a vendor sets a business location, the address is sent to OpenStreetMap to find its coordinates
• AI providers, for the planning assistant and try-on features you choose to use

5. Across HappyWedz services
HappyWedz and the HappyWedz store share a signed-in session across happywedz.com and its subdomains, so you are not asked to sign in twice. Your session details are stored in a cookie readable across those subdomains.

6. With Meta / Instagram
Only if a vendor connects their Instagram account, and only to fetch the posts they chose to display.

7. For legal reasons
Where the law requires it, or to establish, exercise or defend legal claims, or to protect the rights and safety of our users, the public or HappyWedz.

8. In a business transfer
If HappyWedz is involved in a merger, acquisition or sale of assets, personal data may transfer to the acquirer. We will tell you before your data becomes subject to a different privacy policy.

9. What is public by design
Some things you create are meant to be seen by others, and you control whether to publish them:
• Reviews and ratings, shown with your name
• A wedding website once you publish it
• An e-invite once you share its link — anyone with the link can open it and RSVP
• A vendor's business profile, portfolio and packages
`,
    },

    cookies: {
      title: "Cookies & Tracking",
      icon: <FaCookieBite />,
      content: `
We use cookies and similar browser storage, such as localStorage, to run the platform.

1. Types we use
• Essential — signing you in, keeping your session across HappyWedz and the HappyWedz store, security and fraud prevention. The platform cannot work without these.
• Preference — remembering your choices, such as your city, saved filters, favourites and whether you dismissed a banner.
• Analytics — understanding how the platform is used so we can improve it. We do not run advertising or remarketing pixels, and we do not sell what we learn.

2. Your choices
When you first visit we show a cookie notice and remember your choice on that device. You can also clear or block cookies in your browser settings. If you block essential cookies, sign-in and booking will not work.

3. Third-party cookies
Services embedded in our pages — such as Google, Firebase and our payment gateway — may set their own cookies when you use those features. Their own policies govern those cookies.

4. Do Not Track
Browsers send "Do Not Track" signals in different, inconsistent ways, so we do not currently respond to them.
`,
    },

    payments: {
      title: "Payments & Financial Data",
      icon: <FaCreditCard />,
      content: `
1. How payments are handled
All payments — vendor subscriptions, wedding service bookings, and honeymoon flight, hotel, cab and insurance bookings — are processed by our payment gateway. You enter your card, UPI or netbanking details on the gateway's secure screen.

2. What we keep
• The payment gateway's order and payment identifiers
• Amount, currency, status, method and the time of payment
• Invoice numbers and the invoices, receipts, vouchers and tickets issued to you
• For a failed payment, the reason returned by the gateway

3. What we never keep
Full card numbers, CVV, UPI PIN, netbanking passwords or any other payment credential.

4. Refunds
Where a booking fails after a payment is authorised, the refund is made through the same payment method. Refund timelines follow our Cancellation Policy and the gateway's processing times.
`,
    },

    retention: {
      title: "Retention & Deleting Your Account",
      icon: <FaTrashAlt />,
      content: `
1. How long we keep data
• While your account is active, we keep the data needed to provide the service.
• Booking, payment and invoice records are kept for as long as tax and accounting law requires, even after you leave.
• Logs and analytics are kept for a limited period and then deleted or aggregated.

2. Deleting your account
You can delete your account yourself from your profile, or by writing to privacy@happywedz.com. We confirm your identity before an account is deleted, because deletion cannot be undone.

When you delete your account:
• Your personal details — name, email, phone, photos and profile — are removed
• Uploaded try-on photos and their results, sign-in tokens, notifications and saved personal lists are deleted
• Booking, payment and review records are kept for legal and accounting purposes, and are no longer linked to anything that identifies you
• Reviews you posted may stay visible without your personal details, so vendor ratings remain accurate

3. Vendors
The vendor dashboard does not yet have a self-service delete button. Write to privacy@happywedz.com from your registered email and we will close the account and remove the public listing. Verification documents, subscription records and invoices are kept for the period tax and company law requires.

If you used the CRM, tell us what should happen to your client records: we can delete them with your account, or export them to you first.
`,
    },

    rights: {
      title: "Your Rights & Security",
      icon: <FaBalanceScale />,
      content: `
1. Your rights under the Digital Personal Data Protection Act, 2023
• Access — ask what personal data we hold about you and how we use it
• Correction — have inaccurate or incomplete data corrected, or out-of-date data updated
• Erasure — ask us to delete your data, except what we must keep by law
• Withdraw consent — at any time, for anything you consented to. This does not undo what we did before you withdrew it.
• Nominate — name someone to exercise your rights if you die or become incapacitated
• Grievance redressal — complain to us first, and then to the Data Protection Board of India if you are not satisfied

Most of this is available directly in your account: edit your profile, manage your listings, or delete your account. For anything else, write to privacy@happywedz.com. We respond within the timelines the law sets, and we may ask you to confirm your identity first.

2. Your duties
Please give accurate information, keep your password to yourself, and do not impersonate anyone or file false complaints.

3. How we protect your data
• Encrypted connections (HTTPS) between your device and our servers
• Passwords stored only as salted hashes, never in readable form
• Access to personal data restricted to staff who need it for their work
• Payment credentials handled only by our PCI-compliant payment gateway
• Monitoring and logging to detect abuse

No system can be guaranteed completely secure. If a personal data breach affects you, we will notify you and the Data Protection Board as the law requires.

4. Children
HappyWedz is for adults of 18 and over. We do not knowingly collect data from children. If you believe a child has given us personal data, write to privacy@happywedz.com and we will delete it.

5. Where your data is stored
Your data is stored and processed in India. Some of our service providers may process data outside India; where they do, we require safeguards consistent with Indian law.

6. Links to other sites
Our pages link to vendor websites, social media and payment pages that we do not control. Their privacy policies, not ours, govern what they do with your data.
`,
    },

    contact: {
      title: "Contact & Grievances",
      icon: <FaHeadset />,
      content: `
1. Privacy questions and requests
Email: privacy@happywedz.com
General support: support@happywedz.com
Registered address: HappyWedz, Pune, India

Please tell us what you would like us to do and the email or phone number registered with your account, so we can find your records.

2. Grievance Officer
In line with the Information Technology Act, 2000 and the rules under it, and the Digital Personal Data Protection Act, 2023, you can reach our Grievance Officer at:

Grievance Officer, HappyWedz
Email: privacy@happywedz.com
Address: HappyWedz, Pune, India

We acknowledge complaints within 24 hours and aim to resolve them within 15 days. If you are not satisfied with the outcome, you may complain to the Data Protection Board of India.

3. Changes to this policy
We update this policy when the platform or the law changes. The "Last Updated" date at the top of the Overview always shows the current version, and we will tell you about significant changes by email or a notice on the platform. Continuing to use HappyWedz after a change means you accept the updated policy.
`,
    },
  };

  const formatContent = (content) =>
    content
      .trim()
      .split("\n")
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <br key={index} />;

        // Numbered ("1. Title") and lettered ("a) Title") headings
        if (/^\d+\.\s/.test(trimmedLine) || /^[a-z]\)\s/.test(trimmedLine)) {
          return (
            <h5 key={index} className="fw-bold mt-4 mb-2 text-dark">
              {trimmedLine}
            </h5>
          );
        }

        if (trimmedLine.startsWith("•")) {
          return (
            <div key={index} className="d-flex align-items-start mb-2 ms-3">
              <span className="me-2" style={{ color: primaryColor }}>
                •
              </span>
              <span className="text-muted">{trimmedLine.substring(1).trim()}</span>
            </div>
          );
        }

        return (
          <p key={index} className="text-muted mb-2 leading-relaxed">
            {trimmedLine}
          </p>
        );
      });

  return (
    <div className="privacy-policy-page bg-light min-vh-100 py-5">
      <div className="container">
        {/* Hero */}
        <div className="text-center mb-5 mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="display-5 fw-bold text-dark mb-3">Privacy Policy</h3>
          <div className="d-flex justify-content-center mb-3">
            <div
              style={{
                height: "4px",
                width: "80px",
                borderRadius: "2px",
                backgroundColor: primaryColor,
              }}
            ></div>
          </div>
          <p className="text-muted fs-18">
            How HappyWedz collects, uses and protects the personal data of couples,
            their guests and our vendors.
          </p>
        </div>

        <div className="row">
          {/* Section navigation */}
          <div className="col-lg-3 mb-4 mb-lg-0">
            <div
              className="card border-0 shadow-sm rounded-4 sticky-lg-top d-none d-lg-block"
              style={{ top: "100px", zIndex: 1 }}
            >
              <div className="card-body p-2">
                <div className="list-group list-group-flush rounded-3">
                  {Object.keys(sections).map((key) => (
                    <button
                      key={key}
                      className={`list-group-item list-group-item-action d-flex align-items-center p-3 border-0 rounded-3 mb-1 ${
                        activeSection === key
                          ? "text-white shadow-sm"
                          : "bg-transparent text-secondary"
                      }`}
                      onClick={() => {
                        setActiveSection(key);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      style={{
                        transition: "all 0.2s ease",
                        backgroundColor:
                          activeSection === key ? primaryColor : "transparent",
                      }}
                    >
                      <span className="me-2 d-flex align-items-center">
                        {sections[key].icon}
                      </span>
                      <span className="fw-semibold text-start">
                        {sections[key].title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile picker */}
            <div className="d-lg-none mb-3">
              <select
                className="form-select form-select-lg shadow-sm border-0"
                value={activeSection}
                onChange={(event) => setActiveSection(event.target.value)}
                style={{ color: primaryColor, fontWeight: "600" }}
                aria-label="Choose a section"
              >
                {Object.keys(sections).map((key) => (
                  <option key={key} value={key}>
                    {sections[key].title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 p-4 pb-0">
                <div className="d-flex align-items-center">
                  <div
                    className="p-3 rounded-circle me-3"
                    style={{
                      backgroundColor: "rgba(237, 17, 115, 0.1)",
                      color: primaryColor,
                    }}
                  >
                    {sections[activeSection].icon}
                  </div>
                  <h4 className="fw-bold mb-0 text-dark">
                    {sections[activeSection].title}
                  </h4>
                </div>
                <hr className="mt-4 mb-0 text-muted opacity-25" />
              </div>

              <div className="card-body p-4 p-md-5">
                <div className="legal-content-wrapper">
                  {formatContent(sections[activeSection].content)}
                </div>
              </div>

              <div className="card-footer bg-light border-0 p-4 text-center">
                <p className="text-muted small mb-0">
                  Questions about your privacy? Write to
                  <a
                    href="mailto:privacy@happywedz.com"
                    className="text-decoration-none fw-bold ms-1"
                    style={{ color: primaryColor }}
                  >
                    privacy@happywedz.com
                  </a>
                  <span className="mx-1">or</span>
                  <a
                    href="/contact-us"
                    className="text-decoration-none fw-bold"
                    style={{ color: primaryColor }}
                  >
                    contact support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
