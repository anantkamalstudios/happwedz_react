import React from 'react';
import './CancellationPolicy.css';

const CancellationPolicy = () => {
  return (
    <div className="policy-container">
      <header className="policy-header">
        <div className="policy-nav">
          <div className="policy-logo">
            <i className="fas fa-ring"></i>
            <span>WeddingWire</span>
          </div>
          <ul className="policy-navlinks">
            <li><a href="#">Vendors</a></li>
            <li><a href="#">Planning</a></li>
            <li><a href="#">Registry</a></li>
            <li><a href="#">Wedding Websites</a></li>
          </ul>
          <div className="policy-auth">
            <button className="policy-login">Log In</button>
            <button className="policy-signup">Sign Up</button>
          </div>
        </div>
      </header>

      <div className="policy-hero">
        <h1 className="policy-herotitle">Cancellation Policy</h1>
        <p className="policy-herosubtitle">Understanding our cancellation terms and conditions</p>
      </div>

      <div className="policy-content">
        <div className="policy-main">
          <div className="policy-section">
            <h2 className="policy-sectiontitle">Cancellation & Refund Policy</h2>
            
            <div className="policy-sectioncontent">
              <p className="policy-paragraph">
                Last updated: January 1, 2023
              </p>
              
              <h3 className="policy-subtitle">1. General Information</h3>
              <p className="policy-paragraph">
                Thank you for choosing our services. This Cancellation & Refund Policy outlines our guidelines 
                regarding cancellations and refunds for services purchased through our platform.
              </p>
              
              <h3 className="policy-subtitle">2. Vendor Services Cancellation</h3>
              <p className="policy-paragraph">
                Cancellation policies for vendor services (photographers, caterers, venues, etc.) are set by 
                the individual vendors. Please review each vendor's specific cancellation policy before 
                booking their services.
              </p>
              
              <h3 className="policy-subtitle">3. Premium Membership Cancellation</h3>
              <p className="policy-paragraph">
                You may cancel your premium membership at any time. When you cancel, you will still have access 
                to your premium features until the end of your current billing period.
              </p>
              <ul className="policy-list">
                <li>Monthly subscriptions: Cancel at least 24 hours before your next billing date</li>
                <li>Annual subscriptions: Cancel at least 7 days before your renewal date for a full refund</li>
                <li>No refunds for partial membership periods</li>
              </ul>
              
              <h3 className="policy-subtitle">4. Wedding Website Services</h3>
              <p className="policy-paragraph">
                Wedding website subscriptions can be canceled at any time. Upon cancellation, your website will 
                remain active until the end of your current billing cycle. No refunds are provided for partial 
                months of service.
              </p>
              
              <h3 className="policy-subtitle">5. Registry Services</h3>
              <p className="policy-paragraph">
                Registry services are free to create and maintain. Premium registry features follow the same 
                cancellation policy as premium memberships.
              </p>
              
              <h3 className="policy-subtitle">6. How to Cancel</h3>
              <p className="policy-paragraph">
                To cancel any service:
              </p>
              <ol className="policy-list">
                <li>Log in to your account</li>
                <li>Go to "Account Settings"</li>
                <li>Select "Subscriptions" or "Manage Services"</li>
                <li>Follow the cancellation prompts</li>
              </ol>
              
              <h3 className="policy-subtitle">7. Refund Processing</h3>
              <p className="policy-paragraph">
                Approved refunds will be processed within 7-10 business days. The refund will be issued to the 
                original payment method used for purchase.
              </p>
              
              <h3 className="policy-subtitle">8. Force Majeure</h3>
              <p className="policy-paragraph">
                In cases of force majeure (natural disasters, government restrictions, pandemics, etc.), 
                cancellation policies may be adjusted at our discretion. We will work with both couples and 
                vendors to find reasonable solutions.
              </p>
              
              <h3 className="policy-subtitle">9. Contact Us</h3>
              <p className="policy-paragraph">
                If you have any questions about our Cancellation Policy, please contact us:
              </p>
              <ul className="policy-list">
                <li>Email: support@weddingwire.com</li>
                <li>Phone: +1 (800) 123-4567</li>
                <li>Mail: 123 Wedding Lane, Suite 100, New York, NY 10001</li>
              </ul>
            </div>
          </div>

          <div className="policy-update">
            <h3 className="policy-updatetitle">Policy Updates</h3>
            <p className="policy-updatetext">
              We may update this Cancellation Policy from time to time. We will notify you of any changes by 
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </div>
      </div>

      <footer className="policy-footer">
        <div className="policy-footercontent">
          <div className="policy-footersection">
            <h3 className="policy-footertitle">WeddingWire</h3>
            <ul className="policy-footerlinks">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="policy-footersection">
            <h3 className="policy-footertitle">Help</h3>
            <ul className="policy-footerlinks">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support Center</a></li>
              <li><a href="#">Privacy Settings</a></li>
            </ul>
          </div>
          
          <div className="policy-footersection">
            <h3 className="policy-footertitle">Legal</h3>
            <ul className="policy-footerlinks">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Cancellation Policy</a></li>
            </ul>
          </div>
          
          <div className="policy-footersection">
            <h3 className="policy-footertitle">Connect</h3>
            <div className="policy-socialicons">
              <a href="#" className="policy-socialicon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="policy-socialicon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="policy-socialicon"><i className="fab fa-pinterest-p"></i></a>
              <a href="#" className="policy-socialicon"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
        </div>
        
        <div className="policy-footercopyright">
          <p>© {new Date().getFullYear()} WeddingWire, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CancellationPolicy;