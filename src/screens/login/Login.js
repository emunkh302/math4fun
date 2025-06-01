// src/screens/login/Login.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user-context/UserContext'; // Adjust path if needed
import { InputGroup, FormControl, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap'; 

const Login = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { state: userState, loginUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userState.error) {
      setError(userState.error);
    }
    setLoading(userState.loggingIn);
  }, [userState.error, userState.loggingIn]);
  
  useEffect(() => {
    // If user is already logged in (e.g. after successful login), redirect
    if (userState.token && userState.userId) {
      navigate('/game'); // Or your main authenticated route
    }
  }, [userState.token, userState.userId, navigate]);


  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await loginUser(email, password);
        // Navigation will be handled by the useEffect watching userState.token
      } catch (loginError) {
        // Error is already set in context, but you can add more specific handling if needed
        // setError(loginError.message || 'Failed to log in. Please check your credentials.');
      }
    }
  };

  return (
    <>
      
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 56px)" }}> {/* Adjust minHeight if InfoNav height differs */}
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card className="p-4 shadow-lg">
              <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <InputGroup className="mb-3">
                    <FormControl
                      ref={emailRef}
                      placeholder="Email"
                      aria-label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Password"
                      aria-label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </InputGroup>

                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Logging In...' : 'Log In'}
                  </Button>
                </form>
                <div className="text-center mt-3">
                  Need an account? <Link to="/signup">Sign Up</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;