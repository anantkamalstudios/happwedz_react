
import React from 'react';
import VenueCard from "../venus/VenueCard";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const VenuesHeroSection = () => {
    // Sample data - in a real app, you would fetch this from an API
    const venues = [
        {
            id: 1,
            name: 'Taj Krishna',
            location: 'Banjara Hills, Hyderabad',
            capacity: 500,
            price: '1,50,000',
            image: 'https://cdn0.weddingwire.in/vendor/5401/3_2/640/jpg/a7c44b20-d031-484c-93ea-5ec86b69e7d8-768x576_15_485401-175084621555758.webp'
        },
        {
            id: 2,
            name: 'Falaknuma Palace',
            location: 'Falaknuma, Hyderabad',
            capacity: 1000,
            price: '5,00,000',
            image: 'https://cdn0.weddingwire.in/vendor/8156/3_2/640/jpg/dsc00517_15_488156-174713425574582.webp'
        },
        {
            id: 3,
            name: 'Novotel Hyderabad',
            location: 'HITEC City, Hyderabad',
            capacity: 800,
            price: '2,00,000',
            image: 'https://cdn0.weddingwire.in/vendor/0545/3_2/640/jpeg/img-6487_15_480545-172717340473463.webp'
        },
        {
            id: 4,
            name: 'The Park Hyderabad',
            location: 'Somajiguda, Hyderabad',
            capacity: 400,
            price: '1,20,000',
            image: 'https://cdn0.weddingwire.in/vendor/9118/3_2/640/jpeg/whatsapp-image-2024-09-05-at-3-06-18-pm_15_479118-172559822764198.webp'
        },
        {
            id: 5,
            name: 'Radisson Blu Plaza',
            location: 'Banjara Hills, Hyderabad',
            capacity: 600,
            price: '1,80,000',
            image: 'https://cdn0.weddingwire.in/vendor/7932/3_2/640/jpeg/whatsapp-image-2024-08-22-at-12-21-51-pm_15_477932-172439634632888.webp'
        },
        {
            id: 6,
            name: 'Lumbini Convention Center',
            location: 'Gachibowli, Hyderabad',
            capacity: 1200,
            price: '3,50,000',
            image: 'https://cdn0.weddingwire.in/vendor/5401/3_2/640/jpg/a7c44b20-d031-484c-93ea-5ec86b69e7d8-768x576_15_485401-175084621555758.webp'
        }
    ];

    return (
        <Container className="my-5">
            <h1 className="mb-4">Wedding Venues in Hyderabad</h1>

            {/* Search and Filter Section */}
            <div className="bg-light p-4 mb-4 rounded">
                <Form>
                    <Row>
                        <Col md={4}>
                            <Form.Group controlId="formLocation">
                                <Form.Label>Location</Form.Label>
                                <Form.Control as="select">
                                    <option>All Hyderabad</option>
                                    <option>Banjara Hills</option>
                                    <option>Gachibowli</option>
                                    <option>HITEC City</option>
                                    <option>Jubilee Hills</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formCapacity">
                                <Form.Label>Guest Capacity</Form.Label>
                                <Form.Control as="select">
                                    <option>Any</option>
                                    <option>100-300</option>
                                    <option>300-600</option>
                                    <option>600+</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="formBudget">
                                <Form.Label>Budget</Form.Label>
                                <Form.Control as="select">
                                    <option>Any</option>
                                    <option>Under ₹1 Lakh</option>
                                    <option>₹1-3 Lakhs</option>
                                    <option>₹3-5 Lakhs</option>
                                    <option>Over ₹5 Lakhs</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" className="mt-3">Search Venues</Button>
                </Form>
            </div>

            {/* Venues Grid */}
            <Row xs={1} md={2} lg={3} className="g-4">
                {venues.map(venue => (
                    <Col key={venue.id}>
                        <VenueCard venue={venue} />
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <nav className="mt-5">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <span className="page-link">Previous</span>
                    </li>
                    <li className="page-item active"><span className="page-link">1</span></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </Container>
    );
};

export default VenuesHeroSection;