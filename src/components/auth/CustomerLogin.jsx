import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUser } from "../../hooks";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/authSlice";
import { useToast } from "../layouts/toasts/Toast";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const dispatch = useDispatch();
  const { login, loading } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      captchaToken: "test-captcha-token",
    };

    const response = await login(payload, rememberMe);

    if (response.success) {
      if (response.user && response.token) {
        dispatch(
          setCredentials({ user: response.user, token: response.token })
        );
      } else if (response.user) {
        dispatch(setCredentials({ user: response.user, token: null }));
      }
      addToast("Login successful!", "success");
      navigate("/user-dashboard", { replace: true });
    } else {
      addToast(response.message || "Login Failed", "danger");
    }
  };

  return (
    <div className="wedding-login-container min-vh-100 d-flex align-items-center justify-content-center my-5">
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
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label className="text-secondary">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3"
                required
              />
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
                to="/user-forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-100 p-3 login-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="mt-5 text-center">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link
                  to="/customer-register"
                  className="text-decoration-none wedding-link fw-semibold"
                >
                  Sign up
                </Link>
              </p>

              <p className="text-muted">
                I am a{" "}
                <Link
                  to="/vendor-login"
                  className="text-decoration-none fw-semibold wedding-link"
                >
                  vendor
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
