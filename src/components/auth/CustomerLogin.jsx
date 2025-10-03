import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUser } from "../../hooks";
import { useDispatch } from "react-redux";
import { setCredentials, loginUser } from "../../redux/authSlice";
import { auth, provider, signInWithPopup } from "../../firebase";
import { useToast } from "../layouts/toasts/Toast";
import { useLoader } from "../context/LoaderContext";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const dispatch = useDispatch();
  const { login, loading } = useUser();

  const handleGoogleLogin = async () => {
    try {
      showLoader();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      const user = {
        id: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        provider: "google",
      };

      dispatch(loginUser({ user, token }));

      addToast("Login successful!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      addToast("Google login failed: " + error.message, "danger");
    } finally {
      hideLoader();
    }
  };

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
        dispatch(loginUser({ user: response.user, token: response.token }));
      } else if (response.user) {
        dispatch(loginUser({ user: response.user, token: null }));
      }
      addToast("Login successful!", "success");
      navigate("/", { replace: true });
    } else {
      addToast(response.message || "Login failed", "danger");
    }
  };

  return (
    <div className="container wedding-login-container min-vh-100 d-flex align-items-center justify-content-center my-5">
      <div className="row w-100 shadow-lg rounded-4 overflow-hidden">
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
              Welcome to <span className="primary-text fw-bold">HappyWedz</span>
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
          </Form>

          <button
            className="btn btn-light btn-lg w-100 d-flex align-items-center justify-content-center shadow-sm border rounded-pill px-4 py-2 mt-5"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google Logo"
              className="me-2"
              width="24"
              height="24"
            />
            <span className="flex-grow-1 text-center">Sign in with Google</span>
          </button>

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
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
