import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas, Dropdown } from 'react-bootstrap';
import './InfoNav.css';

export default function InfoNav() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
  };

  const toggleOffcanvas = () => setShow(!show);

  return (
    <>
     <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => handleNavigate('/')}>Math4JEM</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" onClick={toggleOffcanvas}>
            📚
          </Navbar.Toggle>
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigate('/')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavigate('/sign-up')}>Sign Up</Nav.Link>
              
              {/* Dropdown Menu for FlashCard */}
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  FlashCards
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleNavigate('/flash-mul')}>Multiplication</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleNavigate('/flash-add')}>Addition</Dropdown.Item>
                  {/* Add more Dropdown.Item here as needed */}
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link onClick={() => handleNavigate('/states')}>Statistics</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Offcanvas show={show} onHide={toggleOffcanvas} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigate('/')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavigate('/sign-up')}>Sign Up</Nav.Link>
              
              {/* Dropdown Menu for FlashCard */}
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic">
                  FlashCards
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleNavigate('/flash-mul')}>Multiplication</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleNavigate('/flash-add')}>Addition</Dropdown.Item>
                  {/* Add more Dropdown.Item here as needed */}
                </Dropdown.Menu>
              </Dropdown>

              <Nav.Link onClick={() => handleNavigate('/states')}>Statistics</Nav.Link>
            </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
