import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { UserContext } from '../../contexts/user-context/UserContext';
import { InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import './SignUp.css';
import InfoNav from '../../components/info-nav/InfoNav';

const SignUp = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { signupUser } = useContext(UserContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Form validation function
  const validateForm = () => {
    if (!email || !password || !rePassword) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== rePassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await signupUser(email, password);
        navigate('/home');
      } catch (signupError) {
        setError(signupError.message);
      }
    }
  };

  return (
    <>
    <InfoNav/>
    <div className="signup-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <FormControl
            ref={emailRef}
            placeholder="Email"
            aria-label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Password"
            aria-label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Repeat Password"
            aria-label="Repeat Password"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </InputGroup>

        <Button variant="primary" type="submit">Sign Up</Button>
      </form>
    </div>
    </>
  );
};

export default SignUp;
