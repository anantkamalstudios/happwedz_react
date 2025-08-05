import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const CustomerLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted:", { email, password, rememberMe });
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
                        <div className="floral-divider my-5"></div>
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
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-send-icon lucide-send"
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
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="lucide lucide-shield-icon lucide-shield"
                                    >
                                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                                    </svg>
                                </span>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-3"
                                />
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
                            <a
                                href="#forgot-password"
                                className="text-decoration-none wedding-link"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 p-3 login-btn"
                        >
                            Sign In
                        </Button>

                        <div className="position-relative text-center my-4">
                            <div className="divider-line"></div>
                            <span className="divider-text px-3">or continue with</span>
                        </div>

                        <div className="d-grid gap-2">
                            <Button
                                variant="outline-secondary"
                                className="d-flex align-items-center justify-content-center p-2"
                            >
                                <svg
                                    className="me-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>

                        <div className="mt-5 text-center">
                            <p className="text-muted">
                                Don't have an account?{" "}
                                <link rel="stylesheet" href="" />
                                <Link
                                    to="/customer-register"
                                    className="text-decoration-none wedding-link fw-semibold"
                                >
                                    Sign up
                                </Link>
                            </p>
                            {/* <p className="mt-3 small text-secondary">
                By signing in, you agree to our{" "}
                <a href="#terms" className="wedding-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="wedding-link">
                  Privacy Policy
                </a>
              </p> */}
                        </div>
                    </Form>
                </div>
            </div>

            <div className="floral-decoration top-left">
                <div className="floral-svg"></div>
            </div>
            <div className="floral-decoration bottom-right">
                <div className="floral-svg"></div>
            </div>
        </div>
    );
};

export default CustomerLogin;