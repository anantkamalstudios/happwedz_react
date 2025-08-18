import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Tab,
  Tabs,
  Image,
} from "react-bootstrap";
import {
  FiEdit2,
  FiCamera,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiCheck,
  FiX,
} from "react-icons/fi";
import "../../../../Matrimonialdashboard.css";

const EditProfile = () => {
  const [key, setKey] = useState("basic");
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const [formData, setFormData] = useState({
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 9876543210",
    dob: "1990-05-15",
    height: "5 ft 4 in",
    maritalStatus: "Never Married",
    religion: "Hindu",
    caste: "Brahmin",
    motherTongue: "Hindi",
    location: "Mumbai, India",
    education: "MBA",
    profession: "Marketing Manager",
    income: "15-20 Lakhs",
    about:
      "I am a fun-loving person who enjoys traveling and trying new cuisines. Family means everything to me and I value honesty and loyalty in relationships.",
    hobbies: "Reading, Dancing, Cooking",
  });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const startEditing = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(formData[fieldName]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveEditing = () => {
    setFormData((prev) => ({
      ...prev,
      [editingField]: tempValue,
    }));
    setEditingField(null);
    setTempValue("");
  };

  const renderEditableField = (
    fieldName,
    label,
    icon,
    type = "text",
    options = null
  ) => {
    return (
      <div className="matrimonial">
        <Form.Group className="form-group editable-field">
          <Form.Label>
            {icon} {label}
          </Form.Label>
          <div className="editable-container">
            {editingField === fieldName ? (
              <div className="editing-controls">
                {type === "select" ? (
                  <Form.Control
                    as="select"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    autoFocus
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                ) : type === "textarea" ? (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <Form.Control
                    type={type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    autoFocus
                  />
                )}
                <div className="edit-actions">
                  <Button
                    variant="link"
                    onClick={saveEditing}
                    className="text-success"
                  >
                    <FiCheck />
                  </Button>
                  <Button
                    variant="link"
                    onClick={cancelEditing}
                    className="text-danger"
                  >
                    <FiX />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="display-value">
                <span>{formData[fieldName]}</span>
                <Button
                  variant="link"
                  className="edit-btn"
                  onClick={() => startEditing(fieldName)}
                >
                  <FiEdit2 size={14} />
                </Button>
              </div>
            )}
          </div>
        </Form.Group>
      </div>
    );
  };

  return (
    <Container fluid className="edit-profile-container">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="profile-card">
            <Card.Header className="profile-header">
              <h2>Edit Profile</h2>
              <p>Complete your profile to get better matches</p>
            </Card.Header>

            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <div className="profile-pic-container">
                    <Image
                      src={profilePic}
                      roundedCircle
                      className="profile-pic"
                    />
                    <label htmlFor="profile-upload" className="upload-btn">
                      <FiCamera /> Change Photo
                    </label>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="profile-completion mt-3">
                    <div className="completion-bar">
                      <div className="progress" style={{ width: "75%" }}></div>
                    </div>
                    <p>Profile 75% complete</p>
                  </div>
                </Col>

                <Col md={8}>
                  <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="profile-tabs"
                  >
                    <Tab eventKey="basic" title="Basic Details">
                      <Form className="profile-form">
                        {renderEditableField("name", "Full Name", <FiUser />)}

                        <Row>
                          <Col md={6}>
                            {renderEditableField(
                              "email",
                              "Email",
                              <FiMail />,
                              "email"
                            )}
                          </Col>
                          <Col md={6}>
                            {renderEditableField(
                              "phone",
                              "Phone",
                              <FiPhone />,
                              "tel"
                            )}
                          </Col>
                        </Row>

                        <Row>
                          <Col md={6}>
                            {renderEditableField(
                              "dob",
                              "Date of Birth",
                              <FiCalendar />,
                              "date"
                            )}
                          </Col>
                          <Col md={6}>
                            {renderEditableField(
                              "height",
                              "Height",
                              null,
                              "select",
                              [
                                "Select Height",
                                "5 ft 0 in",
                                "5 ft 2 in",
                                "5 ft 4 in",
                                "5 ft 6 in",
                                "5 ft 8 in",
                              ]
                            )}
                          </Col>
                        </Row>

                        {renderEditableField(
                          "location",
                          "Location",
                          <FiMapPin />
                        )}
                      </Form>
                    </Tab>

                    <Tab eventKey="religious" title="Religious Background">
                      <Form className="profile-form">
                        <Row>
                          <Col md={6}>
                            {renderEditableField(
                              "religion",
                              "Religion",
                              null,
                              "select",
                              ["Hindu", "Muslim", "Christian", "Sikh", "Other"]
                            )}
                          </Col>
                          <Col md={6}>
                            {renderEditableField(
                              "caste",
                              "Caste",
                              null,
                              "select",
                              ["Brahmin", "Rajput", "Baniya", "Other"]
                            )}
                          </Col>
                        </Row>

                        {renderEditableField(
                          "motherTongue",
                          "Mother Tongue",
                          null,
                          "select",
                          ["Hindi", "English", "Marathi", "Bengali", "Other"]
                        )}
                      </Form>
                    </Tab>

                    <Tab eventKey="professional" title="Professional Details">
                      <Form className="profile-form">
                        {renderEditableField(
                          "education",
                          "Education",
                          null,
                          "select",
                          [
                            "Select Education",
                            "B.Tech",
                            "MBA",
                            "MBBS",
                            "B.Com",
                            "Other",
                          ]
                        )}

                        {renderEditableField("profession", "Profession", null)}

                        {renderEditableField(
                          "income",
                          "Annual Income",
                          null,
                          "select",
                          [
                            "Select Income",
                            "5-10 Lakhs",
                            "10-15 Lakhs",
                            "15-20 Lakhs",
                            "20-25 Lakhs",
                            "25+ Lakhs",
                          ]
                        )}
                      </Form>
                    </Tab>

                    <Tab eventKey="personal" title="Personal Info">
                      <Form className="profile-form">
                        {renderEditableField(
                          "about",
                          "About Me",
                          null,
                          "textarea"
                        )}

                        {renderEditableField(
                          "hobbies",
                          "Hobbies & Interests",
                          null
                        )}
                      </Form>
                    </Tab>
                  </Tabs>

                  <div className="form-actions">
                    <Button variant="outline-secondary" className="mr-3 mb-2">
                      Cancel
                    </Button>
                    <Button variant="primary" className="mb-2">
                      <FiSave /> Save Changes
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
