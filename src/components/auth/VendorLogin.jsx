import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginVendor, setVendorCredentials } from "../../redux/vendorAuthSlice";
import vendorsAuthApi from "../../services/api/vendorAuthApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Show toast if fields are empty
    if (!email || !password) {
      toast.error("Please fill in both email and password fields.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await vendorsAuthApi.login({ email, password });

      if (!data) {
        throw new Error("Login failed");
      }

      const token = data?.data?.token || data?.token || data?.accessToken;
      const vendor = data?.data?.vendor || data?.vendor || data?.user;

      if (!token || !vendor) {
        throw new Error("Invalid response from server");
      }

      dispatch(loginVendor({ token, vendor }));

      navigate("/vendor-dashboard/vendor-home", { replace: true });
    } catch (err) {
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "Wrong email or password.";
      toast.error(serverMsg);
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wedding-login-container min-vh-100 d-flex align-items-center justify-content-center my-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div
        className="row w-100 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "1100px" }}
      >
        {/* Left Image Section */}
        <div className="col-lg-6 d-none d-lg-block p-0 position-relative">
          <div className="wedding-image-overlay position-absolute w-100 h-100"></div>
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5">
            <h2
              className="display-4 fw-light mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Create Your <span className="gold-text">Dream Wedding</span>
            </h2>
            <div className="divider mx-auto my-4"></div>
            <p className="lead text-center">
              "The best thing to hold onto in life is each other. Plan your
              perfect day with us."
            </p>
            {/* <div className="floral-divider my-5"></div> */}
          </div>
        </div>

        {/* Right Form Section */}
        <div className="col-lg-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="text-center mb-4">
            <h2 className="fw-light mb-2" style={{ color: "#8a5a76" }}>
              Welcome to <span className="gold-text">HappyWedz</span>
            </h2>
            <p className="text-muted">
              Sign in to access your wedding planning dashboard
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="mt-4">
            <Form.Group controlId="formEmail" className="mb-4">
              <Form.Label className="text-secondary">Email Address</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send-icon lucide-send"
                  >
                    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                    <path d="m21.854 2.147-10.94 10.939" />
                  </svg>
                </span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label className="text-secondary">Password</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield-icon lucide-shield"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                </span>
                <div style={{ position: "relative", flex: "1 1 auto" }}>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-3 w-100"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                      zIndex: "99",
                      pointerEvents: "auto",
                    }}
                  >
                    {showPassword ? (
                      <FaEye size={20} />
                    ) : (
                      <FaEyeSlash size={20} />
                    )}
                  </span>
                </div>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check
                type="checkbox"
                id="rememberMe"
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="text-secondary"
              />
              <Link
                className="text-decoration-none wedding-link"
                to="/vendor-forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              type="submit"
              className="w-100 p-3 login-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="mt-5 text-center">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link
                  to="/vendor-register"
                  className="text-decoration-none wedding-link fw-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>

      <div className="floral-decoration bottom-right">
        <div className="floral-svg"></div>
      </div>
    </div>
  );
};

export default VendorLogin;
