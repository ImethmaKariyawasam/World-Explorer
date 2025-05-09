import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Container, Card, Row, Col } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Passwords must match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    // Destructure to remove confirmPassword from the data
    const { confirmPassword, ...data } = formData;

    try {
      // Call register function (make sure it handles errors like duplicate email/username)
      const result = await register(data);
      
      setLoading(false);
      
      if (result.success) {
        // Successful registration, navigate to the homepage or login page
        navigate('/');
      } else {
        // Set error if registration failed (like duplicate email/username)
        setError(result.error || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      // Handle errors from the server, like network issues or server-side validation errors
      setError(err.message || 'An unexpected error occurred.');
    }
  };

  return (
    <Container className="auth-container py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="auth-card border-0 shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="auth-title fw-bold mb-1">Create Account</h2>
                <p className="text-muted">Get started with Countries App</p>
              </div>
              
              {error && <Alert variant="danger" className="mb-4 text-center">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Username</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person"></i>
                    </div>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Choose a username"
                      className="py-2 border-start-0"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Email Address</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope"></i>
                    </div>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="py-2 border-start-0"
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock"></i>
                    </div>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Create a password"
                      className="py-2 border-start-0"
                    />
                  </div>
                  <Form.Text className="text-muted small">
                    Password must be at least 6 characters
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Confirm Password</Form.Label>
                  <div className="input-group">
                    <div className="input-group-text bg-light border-end-0">
                      <i className="bi bi-shield-lock"></i>
                    </div>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="py-2 border-start-0"
                    />
                  </div>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="w-100 py-2 mt-2 fw-medium"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : 'Sign Up'}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  Already have an account? <a href="/login" className="fw-medium text-decoration-none">Sign In</a>
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-muted small">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
