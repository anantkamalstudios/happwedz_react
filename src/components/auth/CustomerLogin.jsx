import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useUser } from "../../hooks";
import { useDispatch } from "react-redux";
import { setCredentials, loginUser } from "../../redux/authSlice";
import { auth, provider, signInWithPopup } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLoader } from "../context/LoaderContext";

const CustomerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const location = useLocation();

  const dispatch = useDispatch();
  const { login, loading } = useUser();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleLogin = async () => {
    try {
      showLoader();
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      // Try to register/login with backend
      console.log("Attempting to register Firebase user with backend...");
      const registerResponse = await fetch(
        "https://happywedz.com/api/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            password: "firebase-user", // Dummy password for Firebase users
            phone: "0000000000", // Default phone
            weddingVenue: "TBD",
            country: "India",
            city: "Mumbai",
            weddingDate: new Date().toISOString().split("T")[0],
            profile_image: result.user.photoURL || "",
            coverImage: "",
            role: "user",
            provider: "google",
            firebaseUid: result.user.uid,
            captchaToken: "test-captcha-token",
          }),
        }
      );

      const registerData = await registerResponse.json();
      console.log("Registration response:", registerData);

      if (registerData.success && registerData.user && registerData.token) {
        console.log("Registration successful, using backend token");
        dispatch(
          loginUser({ user: registerData.user, token: registerData.token })
        );
        toast.success("Account created and login successful!");
        navigate(from, { replace: true });
      } else if (
        registerData.message &&
        registerData.message.includes("already exists")
      ) {
        // User already exists, try to login with regular login
        console.log("User already exists, attempting regular login...");
        const loginResponse = await fetch(
          "https://happywedz.com/api/user/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: result.user.email,
              password: "firebase-user", // Use the same dummy password
              captchaToken: "test-captcha-token",
            }),
          }
        );

        const loginData = await loginResponse.json();
        console.log("Login response:", loginData);

        if (loginData.success && loginData.user && loginData.token) {
          dispatch(loginUser({ user: loginData.user, token: loginData.token }));
          toast.success("Login successful!");
          navigate(location.state?.from || "/", {
            state: { openPopup: true },
            replace: true,
          });
        } else {
          // Fallback to Firebase-only authentication
          console.log(
            "Backend login failed, falling back to Firebase-only auth"
          );
          const user = {
            id: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            provider: "google",
          };

          dispatch(loginUser({ user, token: firebaseToken }));
          toast.warning(
            "Login successful! (Note: Some features may be limited)"
          );
          navigate(from, { replace: true });
        }
      } else {
        console.log("Registration failed, falling back to Firebase-only auth");
        console.log("Registration error:", registerData);
        const user = {
          id: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: "google",
        };

        dispatch(loginUser({ user, token: firebaseToken }));
        toast.warning("Login successful! (Note: Some features may be limited)");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error("Google login failed: " + error.message);
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
      toast.success("Login successful!");
      navigate(from, { replace: true });
    } else {
      // Custom toast for invalid credentials or email already exists
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
  };

  return (
    <div className="container wedding-login-container min-vh-100 d-flex align-items-center justify-content-center my-5">
      <ToastContainer position="top-center" autoClose={3000} />
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
