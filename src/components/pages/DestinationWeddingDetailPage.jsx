import React, { use } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const DestinationWeddingDetailPage = () => {
  const { name } = useParams();
  return (
    <div>
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: "2rem",
            borderRadius: "10px",
            width: "80%",
          }}
        >
          <h1 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Destination Weddings {name}
          </h1>
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#fff",
              margin: "0.5rem auto",
            }}
          ></div>
        </div>
      </div>

      <Container style={{ padding: "4rem 0" }}>
        <h4
          style={{
            textAlign: "center",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          Everything You Need To Know To Organize A Destination Wedding In Goa
        </h4>

        <div
          style={{
            width: "60px",
            height: "2px",
            backgroundColor: "#f6a5c0",
            margin: "0 auto 2rem",
          }}
        ></div>

        <Row>
          <Col md={7}>
            <h5
              style={{
                fontWeight: "600",
                color: "#c31162",
                marginBottom: "1rem",
              }}
            >
              Everything You Need To Know To Organize A Destination Wedding In
              Goa
            </h5>

            <p
              style={{
                color: "#555",
                lineHeight: "1.7",
                fontSize: "0.95rem",
              }}
            >
              Whether you are planning to organize a destination wedding at a
              gorgeous beach, or planning to host your friends and family on
              your hometown beach, a beach wedding can be a great experience for
              yourself and your guests alike. After all, it is like a mini
              vacation for everybody! What can be more romantic than the soft
              humming of the waves, the sand between your toes and the salty
              winds - a beach wedding is so much more fun than you can imagine!
              And if that is not convincing enough, everybody these days is
              having a beach wedding. So why not figure out what the fuss is
              about?
            </p>

            <ul style={{ color: "#c31162", fontSize: "0.95rem" }}>
              <li>
                Average cost of destination weddings in Goa is: Rs. 30 Lakh to
                50 Lakh
              </li>
              <li>Beach Weddings, Intimate Weddings</li>
            </ul>

            <div style={{ marginTop: "1rem" }}>
              <span
                style={{
                  display: "inline-block",
                  border: "1px dashed #aaa",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  marginRight: "8px",
                  fontSize: "0.85rem",
                  cursor: "default",
                }}
              >
                Intimate weddings
              </span>
              <span
                style={{
                  display: "inline-block",
                  border: "1px dashed #aaa",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "0.85rem",
                  cursor: "default",
                }}
              >
                Beach Weddings
              </span>
            </div>
          </Col>

          <Col md={5}>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                padding: "1.5rem",
              }}
            >
              <h6 style={{ fontWeight: "600", marginBottom: "1rem" }}>
                Need Help?
              </h6>

              <Form>
                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="text" placeholder="Name*" />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="email" placeholder="Email*" />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="tel" placeholder="+91" />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="text" placeholder="Wedding Month*" />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control type="number" placeholder="No of Guests" />
                </Form.Group>

                <Form.Group style={{ marginBottom: "1rem" }}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional Details"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="light"
                  style={{
                    border: "1px solid #000",
                    borderRadius: "50px",
                    padding: "0.6rem 2rem",
                    width: "100%",
                    fontWeight: "500",
                  }}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DestinationWeddingDetailPage;
