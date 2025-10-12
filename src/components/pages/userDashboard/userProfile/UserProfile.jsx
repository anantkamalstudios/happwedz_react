import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

const initialState = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "user",
  weddingVenue: "",
  country: "",
  city: "",
  weddingDate: "",
  profileImage: "",
  coverImage: "",
};

const UserProfile = ({ user, token }) => {
  console.log("user", user);
  const userId = user?.id ?? user?._id ?? user?.user_id;

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Prefill from Redux so UI shows instantly before fetch completes
  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      id: prev.id || userId || "",
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
      country: prev.country || user.country || "",
      city: prev.city || user.city || "",
      weddingVenue: prev.weddingVenue || user.weddingVenue || "",
      weddingDate:
        prev.weddingDate ||
        (user.weddingDate ? String(user.weddingDate).slice(0, 10) : ""),
      profileImage: prev.profileImage || user.profileImage || "",
      coverImage: prev.coverImage || user.coverImage || "",
    }));
  }, [userId, user]);

  const profilePreview = useMemo(() => {
    return formData.profileImage && typeof formData.profileImage !== "string"
      ? URL.createObjectURL(formData.profileImage)
      : typeof formData.profileImage === "string"
      ? formData.profileImage
      : "";
  }, [formData.profileImage]);

  const coverPreview = useMemo(() => {
    return formData.coverImage && typeof formData.coverImage !== "string"
      ? URL.createObjectURL(formData.coverImage)
      : typeof formData.coverImage === "string"
      ? formData.coverImage
      : "";
  }, [formData.coverImage]);

  useEffect(() => {
    let didCancel = false;
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://happywedz.com/api/user/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();

        if (didCancel) return;

        setFormData((prev) => ({
          ...prev,
          id: data?.id ?? userId,
          name: data?.name ?? "",
          email: data?.email ?? "",
          phone: data?.phone ?? "",
          weddingVenue: data?.weddingVenue ?? "",
          country: data?.country ?? "",
          city: data?.city ?? "",
          weddingDate: data?.weddingDate ? data.weddingDate.slice(0, 10) : "",
          profileImage: data?.profileImage ?? "",
          coverImage: data?.coverImage ?? "",
        }));
      } catch (e) {
        if (!didCancel) setError(e.message || "Something went wrong");
      } finally {
        if (!didCancel) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      didCancel = true;
    };
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      // Validate password change if toggled
      if (showChangePassword) {
        if (!passwordFields.currentPassword) {
          throw new Error("Current password is required to change password.");
        }
        if (
          !passwordFields.newPassword ||
          passwordFields.newPassword.length < 8
        ) {
          throw new Error("New password must be at least 8 characters.");
        }
        if (passwordFields.newPassword !== passwordFields.confirmPassword) {
          throw new Error("New password and confirm password do not match.");
        }
      }

      const body = new FormData();
      body.append("id", formData.id || "");
      body.append("name", formData.name || "");
      body.append("email", formData.email || "");
      if (showChangePassword && passwordFields.newPassword) {
        body.append("password", passwordFields.newPassword);
      }
      body.append("phone", formData.phone || "");
      body.append("role", formData.role || "user");
      body.append("weddingVenue", formData.weddingVenue || "");
      body.append("country", formData.country || "");
      body.append("city", formData.city || "");
      body.append("weddingDate", formData.weddingDate || "");
      if (formData.profileImage)
        body.append("profileImage", formData.profileImage);
      if (formData.coverImage) body.append("coverImage", formData.coverImage);

      if (showChangePassword) {
        body.append("currentPassword", passwordFields.currentPassword);
      }

      const res = await axios.put(
        `https://happywedz.com/api/user/${userId}`,
        body,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res || res.status < 200 || res.status >= 300) {
        throw new Error("Failed to save profile");
      }
      setSuccess("Profile saved successfully.");
    } catch (e) {
      setError(
        e?.response?.data?.message || e.message || "Failed to save profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-3 py-md-4">
      <Row className="g-3 g-md-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <div
              style={{
                height: "180px",
                background:
                  coverPreview || formData.coverImage
                    ? `url(${
                        coverPreview || formData.coverImage
                      }) center/cover no-repeat`
                    : "linear-gradient(135deg, #fdf2f8 0%, #e9d5ff 100%)",
                borderTopLeftRadius: "0.375rem",
                borderTopRightRadius: "0.375rem",
              }}
            />
            <Card.Body>
              <Row className="align-items-center">
                <Col xs="auto">
                  <div
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #fff",
                      marginTop: "-72px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}
                  </div>
                </Col>
                <Col>
                  <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                    <div>
                      <h5 className="mb-1">
                        {formData.name || user?.name || "Your Name"}
                      </h5>
                      <div className="text-muted small">
                        {formData.email || user?.email || "your@email"}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <Form.Group controlId="coverImage" className="mb-0">
                        <Form.Label className="btn btn-outline-secondary btn-sm mb-0">
                          Change Cover
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          name="coverImage"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </Form.Group>
                      <Form.Group controlId="profileImage" className="mb-0">
                        <Form.Label className="btn btn-outline-secondary btn-sm mb-0">
                          Change Photo
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          name="profileImage"
                          onChange={handleImageChange}
                          className="d-none"
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              {error ? (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              ) : null}
              {success ? (
                <Alert variant="success" className="mb-3">
                  {success}
                </Alert>
              ) : null}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="phone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="weddingDate">
                      <Form.Label>Wedding Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="weddingDate"
                        value={formData.weddingDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="country">
                      <Form.Label>Country</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="city">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="weddingVenue">
                      <Form.Label>Wedding Venue</Form.Label>
                      <Form.Control
                        type="text"
                        name="weddingVenue"
                        value={formData.weddingVenue}
                        onChange={handleChange}
                        placeholder="Venue"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="mt-2">
                    <span
                      onClick={() => setShowChangePassword((s) => !s)}
                      className="text-danger fs-16 pointer"
                      role="button"
                    >
                      {showChangePassword
                        ? "Cancel password change"
                        : "Change password"}
                    </span>
                  </Col>

                  {showChangePassword ? (
                    <>
                      <Col md={4}>
                        <Form.Group controlId="currentPassword">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={passwordFields.currentPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="Current password"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="newPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={passwordFields.newPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="New password (min 8 chars)"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="confirmPassword">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={passwordFields.confirmPassword}
                            onChange={handlePasswordFieldChange}
                            placeholder="Confirm new password"
                          />
                        </Form.Group>
                      </Col>
                    </>
                  ) : null}

                  <Col
                    xs={12}
                    className="d-flex justify-content-end gap-2 mt-2"
                  >
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setFormData(initialState)}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            size="sm"
                            animation="border"
                            className="me-2"
                          />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
            {loading ? (
              <div className="w-100 d-flex align-items-center justify-content-center py-3">
                <Spinner animation="border" size="sm" className="me-2" />
                Loading profile...
              </div>
            ) : null}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
