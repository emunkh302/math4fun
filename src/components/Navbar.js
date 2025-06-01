// src/components/Navbar.js (or your actual path)
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/user-context/UserContext'; // Adjust path
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';

const AppNavbar = () => {
  const { state: userState, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow">
      <Container>
      <BootstrapNavbar.Brand
  as={Link}
  to="/game"
  style={{
    fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
    fontSize: '1.5rem'
  }}
>
  <img 
    src="/favicon.ico" 
    alt="Math is FUN!" 
    className="h-12 sm:h-16" 
  />
</BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {userState.token && userState.userId ? (
              <>
                {/* You can display user email or name if available */}
                {/* <Nav.Link disabled className="text-light me-2">Hi, {userState.displayName || 'User'}</Nav.Link> */}
                <Nav.Link as={Link} to="/game" className="text-light">Games</Nav.Link>
                <Nav.Link as={Link} to="/history" className="text-light">Results</Nav.Link> {/* <<<< THIS LINE IS NOW ACTIVE */}
                <Button variant="outline-light" onClick={handleLogout} className="ms-lg-2 mt-2 mt-lg-0">Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-light">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default AppNavbar;