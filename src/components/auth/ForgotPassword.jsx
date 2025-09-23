// import React, { useState } from "react";
// import { FiMail, FiLock, FiCheck, FiArrowLeft, FiLoader } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const ForgotPassword = () => {
//   const [activeStep, setActiveStep] = useState("forgotPassword");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       setActiveStep("otpVerification");
//       setMessage(`A 6-digit code has been sent to ${email}`);
//     }, 1500);
//   };

//   const handleOtpSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       setActiveStep("success");
//       setMessage("Your password has been reset successfully!");
//     }, 1500);
//   };

//   const handleOtpChange = (index, value) => {
//     if (/^\d*$/.test(value) && value.length <= 1) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Auto focus to next input
//       if (value && index < 5) {
//         document.getElementById(`weddingwire-otp-${index + 1}`).focus();
//       }
//     }
//   };

//   const resendOtp = () => {
//     setIsLoading(true);
//     setMessage("");

//     // Simulate resend OTP
//     setTimeout(() => {
//       setIsLoading(false);
//       setMessage("A new OTP has been sent to your email");
//     }, 1000);
//   };

//   return (
//     <div className="weddingwire-auth-container">
//       <div className="weddingwire-auth-card">
//         <div className="weddingwire-auth-header">
//           <p className="weddingwire-auth-tagline">
//             Your perfect wedding starts here
//           </p>
//         </div>

//         {activeStep === "forgotPassword" && (
//           <div className="weddingwire-auth-form-container">
//             <h2 className="weddingwire-auth-title">Reset Your Password</h2>
//             <p className="weddingwire-auth-subtitle">
//               Enter your email to receive a password reset link
//             </p>

//             <form
//               onSubmit={handleEmailSubmit}
//               className="weddingwire-auth-form"
//             >
//               <div className="weddingwire-auth-input-group">
//                 <label
//                   htmlFor="weddingwire-email"
//                   className="weddingwire-auth-label"
//                 >
//                   Email Address
//                 </label>
//                 <div className="weddingwire-auth-input-wrapper">
//                   <FiMail className="weddingwire-auth-input-icon" />
//                   <input
//                     type="email"
//                     id="weddingwire-email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="weddingwire-auth-input"
//                     placeholder="your.email@example.com"
//                     required
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="weddingwire-auth-button weddingwire-auth-button-primary"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="weddingwire-auth-button-loading">
//                     <FiLoader className="weddingwire-auth-spinner" />
//                     Sending...
//                   </span>
//                 ) : (
//                   "Send Reset Link"
//                 )}
//               </button>
//             </form>

//             <div className="weddingwire-auth-footer">
//               Remember your password?{" "}
//               <Link to="/customer-login" className="weddingwire-auth-link">
//                 Log In
//               </Link>
//             </div>
//           </div>
//         )}

//         {activeStep === "otpVerification" && (
//           <div className="weddingwire-auth-form-container">
//             <h2 className="weddingwire-auth-title">Verify Your Account</h2>
//             <p className="weddingwire-auth-subtitle">
//               We've sent a 6-digit code to {email}
//             </p>

//             {message && (
//               <div className="weddingwire-auth-message weddingwire-auth-message-success">
//                 <FiCheck className="weddingwire-auth-message-icon" /> {message}
//               </div>
//             )}

//             <form onSubmit={handleOtpSubmit} className="weddingwire-auth-form">
//               <div className="weddingwire-auth-input-group">
//                 <label className="weddingwire-auth-label">
//                   Verification Code
//                 </label>
//                 <div className="weddingwire-auth-otp-container">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       id={`weddingwire-otp-${index}`}
//                       type="text"
//                       maxLength="1"
//                       value={digit}
//                       onChange={(e) => handleOtpChange(index, e.target.value)}
//                       className="weddingwire-auth-otp-input"
//                       required
//                     />
//                   ))}
//                 </div>
//                 <button
//                   type="button"
//                   className="weddingwire-auth-resend"
//                   onClick={resendOtp}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Sending..." : "Resend Code"}
//                 </button>
//               </div>

//               <div className="weddingwire-auth-input-group">
//                 <label
//                   htmlFor="weddingwire-password"
//                   className="weddingwire-auth-label"
//                 >
//                   New Password
//                 </label>
//                 <div className="weddingwire-auth-input-wrapper">
//                   <FiLock className="weddingwire-auth-input-icon" />
//                   <input
//                     type="password"
//                     id="weddingwire-password"
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     className="weddingwire-auth-input"
//                     placeholder="Enter new password"
//                     required
//                     minLength="8"
//                   />
//                 </div>
//               </div>

//               <div className="weddingwire-auth-input-group">
//                 <label
//                   htmlFor="weddingwire-confirm-password"
//                   className="weddingwire-auth-label"
//                 >
//                   Confirm New Password
//                 </label>
//                 <div className="weddingwire-auth-input-wrapper">
//                   <FiLock className="weddingwire-auth-input-icon" />
//                   <input
//                     type="password"
//                     id="weddingwire-confirm-password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="weddingwire-auth-input"
//                     placeholder="Confirm your new password"
//                     required
//                     minLength="8"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="weddingwire-auth-button weddingwire-auth-button-primary"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <span className="weddingwire-auth-button-loading">
//                     <FiLoader className="weddingwire-auth-spinner" />
//                     Resetting...
//                   </span>
//                 ) : (
//                   "Reset Password"
//                 )}
//               </button>
//             </form>

//             <div className="weddingwire-auth-footer">
//               <a
//                 href="#"
//                 className="weddingwire-auth-link"
//                 onClick={() => setActiveStep("forgotPassword")}
//               >
//                 <FiArrowLeft className="weddingwire-auth-link-icon" /> Back to
//                 Email
//               </a>
//             </div>
//           </div>
//         )}

//         {activeStep === "success" && (
//           <div className="weddingwire-auth-success-container">
//             <div className="weddingwire-auth-success-icon">
//               <FiCheck />
//             </div>
//             <h2 className="weddingwire-auth-title">Password Changed!</h2>
//             <p className="weddingwire-auth-subtitle">
//               Your password has been reset successfully
//             </p>
//             <div className="weddingwire-auth-success-message">
//               <FiCheck className="weddingwire-auth-message-icon" /> {message}
//             </div>
//             <button
//               className="weddingwire-auth-button weddingwire-auth-button-primary"
//               onClick={() => {
//                 setActiveStep("forgotPassword");
//                 setEmail("");
//                 setOtp(["", "", "", "", "", ""]);
//                 setNewPassword("");
//                 setConfirmPassword("");
//               }}
//             >
//               Back to Login
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
import React, { useState } from "react";
import { FiMail, FiLock, FiCheck, FiArrowLeft, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [activeStep, setActiveStep] = useState("forgotPassword");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storedOtp, setStoredOtp] = useState(""); // store backend OTP for testing

  // ---------------- SEND OTP ----------------
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("https://happywedz.com/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      // store OTP for testing if backend returns it (remove in production)
      if (data.otp) setStoredOtp(data.otp);

      setMessage(data.message || `OTP sent to ${email}`);
      setActiveStep("otpVerification");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("https://happywedz.com/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""), // combine 6 digits
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setMessage(data.message || "Password reset successful");
      setActiveStep("success");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- HANDLE OTP INPUT ----------------
  const handleOtpChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`weddingwire-otp-${index + 1}`).focus();
      }
    }
  };

  // ---------------- RESEND OTP ----------------
  const resendOtp = async () => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://happywedz.com/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
      if (data.otp) setStoredOtp(data.otp);
      setMessage(data.message || "OTP resent successfully");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="weddingwire-auth-container">
      <div className="weddingwire-auth-card">
        <div className="weddingwire-auth-header">
          <p className="weddingwire-auth-tagline">Your perfect wedding starts here</p>
        </div>

        {activeStep === "forgotPassword" && (
          <div className="weddingwire-auth-form-container">
            <h2 className="weddingwire-auth-title">Reset Your Password</h2>
            <p className="weddingwire-auth-subtitle">Enter your email to receive a password reset link</p>

            {message && <p className="text-red-500">{message}</p>}

            <form onSubmit={handleEmailSubmit} className="weddingwire-auth-form">
              <div className="weddingwire-auth-input-group">
                <label htmlFor="weddingwire-email" className="weddingwire-auth-label">Email Address</label>
                <div className="weddingwire-auth-input-wrapper">
                  <FiMail className="weddingwire-auth-input-icon" />
                  <input
                    type="email"
                    id="weddingwire-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="weddingwire-auth-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="weddingwire-auth-button weddingwire-auth-button-primary" disabled={isLoading}>
                {isLoading ? (
                  <span className="weddingwire-auth-button-loading">
                    <FiLoader className="weddingwire-auth-spinner" />
                    Sending...
                  </span>
                ) : "Send Reset Link"}
              </button>
            </form>

            <div className="weddingwire-auth-footer">
              Remember your password?{" "}
              <Link to="/customer-login" className="weddingwire-auth-link">Log In</Link>
            </div>
          </div>
        )}

        {activeStep === "otpVerification" && (
          <div className="weddingwire-auth-form-container">
            <h2 className="weddingwire-auth-title">Verify Your Account</h2>
            <p className="weddingwire-auth-subtitle">We've sent a 6-digit code to {email}</p>

            {message && (
              <div className="weddingwire-auth-message weddingwire-auth-message-success">
                <FiCheck className="weddingwire-auth-message-icon" /> {message}
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="weddingwire-auth-form">
              <div className="weddingwire-auth-input-group">
                <label className="weddingwire-auth-label">Verification Code</label>
                <div className="weddingwire-auth-otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`weddingwire-otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="weddingwire-auth-otp-input"
                      required
                    />
                  ))}
                </div>
                <button type="button" className="weddingwire-auth-resend" onClick={resendOtp} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Resend Code"}
                </button>
              </div>

              <div className="weddingwire-auth-input-group">
                <label htmlFor="weddingwire-password" className="weddingwire-auth-label">New Password</label>
                <div className="weddingwire-auth-input-wrapper">
                  <FiLock className="weddingwire-auth-input-icon" />
                  <input
                    type="password"
                    id="weddingwire-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="weddingwire-auth-input"
                    placeholder="Enter new password"
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <div className="weddingwire-auth-input-group">
                <label htmlFor="weddingwire-confirm-password" className="weddingwire-auth-label">Confirm New Password</label>
                <div className="weddingwire-auth-input-wrapper">
                  <FiLock className="weddingwire-auth-input-icon" />
                  <input
                    type="password"
                    id="weddingwire-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="weddingwire-auth-input"
                    placeholder="Confirm your new password"
                    required
                    minLength="8"
                  />
                </div>
              </div>

              <button type="submit" className="weddingwire-auth-button weddingwire-auth-button-primary" disabled={isLoading}>
                {isLoading ? (
                  <span className="weddingwire-auth-button-loading">
                    <FiLoader className="weddingwire-auth-spinner" />
                    Resetting...
                  </span>
                ) : "Reset Password"}
              </button>
            </form>

            <div className="weddingwire-auth-footer">
              <a
                href="#"
                className="weddingwire-auth-link"
                onClick={() => setActiveStep("forgotPassword")}
              >
                <FiArrowLeft className="weddingwire-auth-link-icon" /> Back to Email
              </a>
            </div>
          </div>
        )}

        {activeStep === "success" && (
          <div className="weddingwire-auth-success-container">
            <div className="weddingwire-auth-success-icon">
              <FiCheck />
            </div>
            <h2 className="weddingwire-auth-title">Password Changed!</h2>
            <p className="weddingwire-auth-subtitle">Your password has been reset successfully</p>
            <div className="weddingwire-auth-success-message">
              <FiCheck className="weddingwire-auth-message-icon" /> {message}
            </div>
            <button
              className="weddingwire-auth-button weddingwire-auth-button-primary"
              onClick={() => {
                setActiveStep("forgotPassword");
                setEmail("");
                setOtp(["", "", "", "", "", ""]);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
