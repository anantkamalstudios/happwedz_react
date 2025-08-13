import React, { useState, useEffect } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import "../../../../Matrimonial.css";

const Hero = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".success-stories-container"
    );
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 50);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="matrimonial-container">
      {/* Login Modal */}
      {isLoginOpen && (
        <div className="login-modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Login to Your Account</h2>
              <button className="close-btn" onClick={toggleLogin}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <FiUser className="input-icon" />
                <input type="text" placeholder="Email or Mobile" />
              </div>
              <div className="form-group">
                <FiLock className="input-icon" />
                <input type="password" placeholder="Password" />
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="/">Forgot Password?</a>
              </div>
              <button className="login-button">Login</button>
              <div className="divider">or</div>
              <button className="signup-button">Create New Account</button>
            </div>
            <div className="modal-footer">
              <p>
                By logging in, you agree to our{" "}
                <a href="/">Terms & Conditions</a> and{" "}
                <a href="/">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Find Your Perfect Life Partner</h1>
              <p>
                Trusted by millions of families to discover meaningful
                connections
              </p>
              <div className="stats">
                <div className="stat-item">
                  <h3>10M+</h3>
                  <p>Registered Users</p>
                </div>
                <div className="stat-item">
                  <h3>500K+</h3>
                  <p>Success Stories</p>
                </div>
                <div className="stat-item">
                  <h3>20+</h3>
                  <p>Years of Experience</p>
                </div>
              </div>
            </div>

            <div className="registration-form">
              <h2>Register for Free</h2>
              <form>
                <div className="form-group">
                  <label>I am looking for</label>
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="gender" defaultChecked /> Bride
                    </label>
                    <label>
                      <input type="radio" name="gender" /> Groom
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" placeholder="Your Full Name" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="Mobile Number" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Email Address" />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Religion</label>
                    <select>
                      <option>Hindu</option>
                      <option>Muslim</option>
                      <option>Christian</option>
                      <option>Sikh</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Community</label>
                    <select>
                      <option>Brahmin</option>
                      <option>Rajput</option>
                      <option>Maratha</option>
                      <option>Baniya</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="Create Password" />
                </div>

                <button type="submit" className="register-btn">
                  Register Now
                </button>

                <p className="terms">
                  By registering, you agree to our <a href="/">Terms</a> and{" "}
                  <a href="/">Privacy Policy</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
