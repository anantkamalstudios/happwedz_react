import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";
import { useLoader } from "../context/LoaderContext";
import userApi from "../../services/api/userApi";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();

  const from = location.state?.from || "/";
  const [loginCms, setLoginCms] = useState(null);
  const normalizeUrl = (u) =>
    typeof u === "string" ? u.replace(/`/g, "").trim() : null;
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://happywedz.com/api/login-cms");
        const data = await res.json();
        setLoginCms(data?.data || data || null);
      } catch { }
    })();
  }, []);

  const handleGoogleCredential = async (credentialResponse) => {
    try {
      showLoader();
      const tokenId = credentialResponse?.credential;
      if (!tokenId) {
        toast.error("Google did not return an ID token (credential).");
        return;
      }

      const authResponse = await userApi.googleAuth({ tokenId });
      if (
        authResponse &&
        authResponse.success &&
        authResponse.user &&
        authResponse.token
      ) {
        dispatch(
          loginUser({ user: authResponse.user, token: authResponse.token })
        );
        toast.success("Login successful!");
        navigate(from, { replace: true });
        return;
      }

      const msg = authResponse?.message || "Google login failed on server";
      toast.error(msg);
    } catch (err) {
      console.error("Google credential error:", err);
      toast.error("Google login failed: " + (err.message || ""));
    } finally {
      hideLoader();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both email and password fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        password,
        captchaToken: "test-captcha-token",
      };

      const response = await userApi.login(payload);

      if (response.success) {
        dispatch(loginUser({ user: response.user, token: response.token }));
        toast.success("Login successful!");
        navigate(from, { replace: true });
      } else {
        const msg = response.message || "Login failed";

        if (
          msg.toLowerCase().includes("invalid") ||
          msg.toLowerCase().includes("wrong")
        ) {
          toast.error(
            "Invalid credentials. Please check your email and password."
          );
        } else if (
          msg.toLowerCase().includes("already exists") ||
          msg.toLowerCase().includes("email already")
        ) {
          toast.error("Email already exists. Please use a different email.");
        } else {
          toast.error(msg);
        }
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center my-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="row w-100 shadow-lg rounded-4 overflow-hidden">
        <div
          className="col-lg-6 d-none d-lg-block p-0 position-relative"
          style={{
            ...(loginCms?.image
              ? {
                backgroundImage: `url(${normalizeUrl(loginCms?.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "600px",
              }
              : {}),
          }}
        >
          <div className="wedding-image-overlay position-absolute w-100 h-100"></div>
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-5">
            <h2
              className="display-4 fw-light mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {loginCms?.heading ? (
                loginCms.heading
              ) : (
                <>
                  Create Your <span className="gold-text">Dream Wedding</span>
                </>
              )}
            </h2>
            <div className="divider mx-auto my-4"></div>
            <p className="lead text-center">
              {loginCms?.subheading ||
                "The best thing to hold onto in life is each other. Plan your perfect day with us."}
            </p>
          </div>
        </div>

        <div className="col-lg-6 bg-white p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="text-center mb-4">
            <h3 className="mb-2" style={{ color: "#8a5a76" }}>
              {loginCms?.title ? (
                loginCms.title
              ) : (
                <>
                  Welcome to{" "}
                  <span className="primary-text fw-bold">HappyWedz</span>
                </>
              )}
            </h3>
            <p className="text-muted fs-14">
              {loginCms?.description ||
                "Sign in to access your wedding planning dashboard"}
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

            <Form.Group
              controlId="formPassword"
              className="mb-4 position-relative"
            >
              <Form.Label className="text-secondary">Password</Form.Label>

              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 pe-5"
                required
              />

              {/* Eye Icon inside input */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  cursor: "pointer",
                  color: "#6c757d",
                  zIndex: 9999,
                  pointerEvents: "auto",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </span>
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

          <div className="mt-4 justify-content-center align-items-center">
            <GoogleLogin
              onSuccess={handleGoogleCredential}
              onError={() => {
                console.error("Google Login Failed: onError");
                toast.error("Google login failed. Please try again.");
              }}
            />
          </div>

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
