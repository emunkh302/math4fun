import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import your custom CSS here

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer mt-auto bg-light text-center text-lg-start">
      <Container fluid className="text-dark py-4">
        <Row>
          <Col lg={6} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">About Us</h5>
            <p>
              Learn more about our team, our mission, and the passion behind this project.
            </p>
            <p className="text-center">
              Developed by: 
              <a href="https://www.mikeportfolio.click/" target="_blank" rel="noopener noreferrer" className="footer-link">
                Mike Erdene
              </a>
              <span className="text-center">&copy; {currentYear}</span>
            </p>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/game" className="footer-link">Game</Link></li>
              <li><Link to="/statistics" className="footer-link">Statistics</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Resources</h5>
            <ul className="list-unstyled mb-0">
              <li><Link to="/flash-mul" className="footer-link">FlashCards</Link></li>
              <li><Link to="/sign-up" className="footer-link">Sign Up</Link></li>
              <li><Link to="/login" className="footer-link">Login</Link></li>
              <li><Link to="/*" className="footer-link">NoPage</Link></li>
            </ul>
          </Col>
        </Row>
       
          
                   
      </Container>
    </footer>
  );
};

export default Footer;
