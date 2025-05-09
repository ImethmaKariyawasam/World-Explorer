import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Error messages configuration
const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection and try again.',
  server: 'Server error. Please try again later.',
  credentials: 'Invalid email or password.',
  locked: 'Account temporarily locked due to multiple failed attempts. Please try again later or reset your password.',
  default: 'Login failed. Please try again.'
};

// Maximum login attempts before showing account lock warning
const MAX_ATTEMPTS_BEFORE_WARNING = 3;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showLockWarning, setShowLockWarning] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset form errors when component mounts
  useEffect(() => {
    setErrors({ email: '', password: '', form: '' });
  }, []);

  // Show lock warning after certain number of attempts
  useEffect(() => {
    if (loginAttempts >= MAX_ATTEMPTS_BEFORE_WARNING) {
      setShowLockWarning(true);
    }
  }, [loginAttempts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name] || errors.form) {
      setErrors(prev => ({ ...prev, [name]: '', form: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', form: '' };
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: '', password: '', form: '' });
    setShowLockWarning(false);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await login(formData);
      
      if (result.success) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        navigate('/');
      } else {
        // Handle failed login attempt
        setLoginAttempts(prev => prev + 1);
        
        // Handle specific error cases
        if (result.error?.response?.status === 401) {
          setErrors(prev => ({ ...prev, form: ERROR_MESSAGES.credentials }));
        } else if (result.error?.response?.status === 423) {
          setErrors(prev => ({ ...prev, form: ERROR_MESSAGES.locked }));
        } else if (result.error?.response?.status >= 500) {
          setErrors(prev => ({ ...prev, form: ERROR_MESSAGES.server }));
        } else if (result.error?.message === 'Network Error') {
          setErrors(prev => ({ ...prev, form: ERROR_MESSAGES.network }));
        } else {
          setErrors(prev => ({ ...prev, form: result.error?.message || ERROR_MESSAGES.default }));
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginAttempts(prev => prev + 1);
      setErrors(prev => ({ ...prev, form: ERROR_MESSAGES.default }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="auth-container py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="auth-card border-0 shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="auth-title fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted">Sign in to continue to Countries App</p>
              </div>
              
              {/* General form error */}
              {errors.form && (
                <Alert 
                  variant="danger" 
                  className="mb-4 text-center" 
                  dismissible 
                  onClose={() => setErrors(prev => ({ ...prev, form: '' }))}
                >
                  {errors.form}
                </Alert>
              )}
              
              {/* Account lock warning */}
              {showLockWarning && !errors.form && (
                <Alert variant="warning" className="mb-4 text-center">
                  Multiple failed attempts detected. Your account may be locked after more failed attempts.
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-4">
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
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your email"
                      className={`py-2 border-start-0 ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      isInvalid={!!errors.email && touched.email}
                      autoComplete="username"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <div className="d-flex justify-content-between">
                    <Form.Label className="fw-medium">Password</Form.Label>
                    <a href="/forgot-password" className="text-decoration-none small">Forgot password?</a>
                  </div>
                  <div className="input-group">
                    <div className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock"></i>
                    </div>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      placeholder="Enter your password"
                      className={`py-2 border-start-0 ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      isInvalid={!!errors.password && touched.password}
                      autoComplete="current-password"
                    />
                  </div>
                  {errors.password && touched.password && (
                    <Form.Control.Feedback type="invalid" className="d-block">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading} 
                  className="w-100 py-2 mt-3 fw-medium"
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  Don't have an account? <a href="/register" className="fw-medium text-decoration-none">Sign Up</a>
                </p>
              </div>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <p className="text-muted small">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;