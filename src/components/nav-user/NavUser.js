import React, { useState, useContext } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  Alert,
} from "react-bootstrap";
import { UserContext } from "../../contexts/user-context/UserContext";
import "./NavUser.css"; // Import custom CSS for styling

export default function NavUser() {
  const { loginUser, logout } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await loginUser(username, password);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed: Invalid username or password.");
    }
  };

  const handleLogout = () => {
    logout();
  };

  const isLoginDisabled = !username || !password;
  const userId = localStorage.getItem("userId");

  return (
    <Navbar bg="warning" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src="/images/M4JEM.png"
            width="30"
            height="30"
            className="d-inline-block align-top logo-pill"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll">
        🎲 
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
           
          </Nav>
          {userId ? (
            <Button onClick={handleLogout} variant="outline-danger">
              Logout
            </Button>
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form className="d-flex">
                <FormControl
                  type="text"
                  placeholder="Email"
                  className="me-2"
                  aria-label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FormControl
                  type="password"
                  placeholder="Password"
                  className="me-2"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={handleLogin}
                  variant="outline-success"
                  disabled={isLoginDisabled}
                >
                  Login
                </Button>
              </Form>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
