import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPopulation: 0, continents: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check if dark mode is active
  useEffect(() => {
    // Check if dark mode is enabled at the document/html level
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up an observer to watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-bs-theme'],
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchCountryData = async () => {
      if (user?.favoriteCountries?.length > 0) {
        try {
          const responses = await Promise.all(
            user.favoriteCountries.map(code => 
              axios.get(`https://restcountries.com/v3.1/alpha/${code}`)
            )
          );
          
          const countriesData = responses.map(res => res.data[0]);
          setCountryData(countriesData);
          
          // Calculate stats
          const totalPop = countriesData.reduce((sum, country) => sum + country.population, 0);
          const uniqueContinents = new Set(countriesData.map(country => country.region)).size;
          
          setStats({
            totalPopulation: totalPop,
            continents: uniqueContinents
          });
          
        } catch (error) {
          console.error("Error fetching country data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [user]);

  const handleFlagClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Card className={`shadow-lg border-0 rounded-4 p-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
          <Card.Body className="p-5">
            <div className="mb-4">
              <div className="bg-danger bg-opacity-10 mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                <i className="bi bi-person-x fs-1 text-danger"></i>
              </div>
            </div>
            <h1 className="mb-3 fw-bold">Please Login</h1>
            <p className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-4 lead`}>You need to be signed in to access your profile</p>
            <Button 
              size="lg" 
              variant="primary" 
              className="px-5 py-3 rounded-pill shadow-sm fw-bold" 
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Sign In
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  // Get initials for avatar
  const getInitials = () => {
    return user.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format large numbers
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  // Get account age
  const getAccountAge = () => {
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col lg={4} className="mb-4">
          <Card className={`border-0 shadow-lg rounded-4 h-100 position-relative overflow-hidden ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            {/* Profile header background with gradient */}
            <div 
              className="position-absolute w-100" 
              style={{ 
                height: '120px', 
                top: 0, 
                background: 'linear-gradient(135deg, #4568dc, #b06ab3)'
              }}
            ></div>
            
            <Card.Body className="p-4 text-center position-relative">
              <div className="mb-4 mt-3">
                <div 
                  className={`mx-auto rounded-circle d-flex align-items-center justify-content-center border border-4 ${isDarkMode ? 'border-dark' : 'border-white'}`}
                  style={{ 
                    width: '130px', 
                    height: '130px', 
                    zIndex: 2, 
                    background: 'linear-gradient(135deg, #4568dc, #b06ab3)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  <span className="display-4 fw-bold text-white">{getInitials()}</span>
                </div>
              </div>
              
              <h2 className="mb-1 fw-bold">{user.username}</h2>
              <p className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-2`}>
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                {user.email}
              </p>
              <p className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-4 small`}>
                <i className="bi bi-clock-history me-1"></i>
                Member for {getAccountAge()}
              </p>
              
              {/* Stats Cards */}
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <Card className={`border-0 shadow-sm h-100 rounded-4 ${isDarkMode ? 'bg-primary bg-opacity-25' : 'bg-primary bg-opacity-10'}`}>
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center justify-content-center flex-column">
                        <div className="mb-2">
                          <i className="bi bi-bookmark-heart-fill fs-3 text-primary"></i>
                        </div>
                        <h3 className="mb-0 fw-bold">{countryData.length}</h3>
                        <p className={`mb-0 small ${isDarkMode ? 'text-light-emphasis' : 'text-muted'}`}>Favorites</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className={`border-0 shadow-sm h-100 rounded-4 ${isDarkMode ? 'bg-success bg-opacity-25' : 'bg-success bg-opacity-10'}`}>
                    <Card.Body className="p-3">
                      <div className="d-flex align-items-center justify-content-center flex-column">
                        <div className="mb-2">
                          <i className="bi bi-globe-americas fs-3 text-success"></i>
                        </div>
                        <h3 className="mb-0 fw-bold">{stats.continents}</h3>
                        <p className={`mb-0 small ${isDarkMode ? 'text-light-emphasis' : 'text-muted'}`}>Continents</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <hr className={`my-4 ${isDarkMode ? 'border-secondary' : ''}`} />
              
              <div className="d-grid gap-3">
                <Button 
                  variant={isDarkMode ? "outline-light" : "outline-primary"} 
                  size="lg"
                  className="rounded-pill d-flex align-items-center justify-content-center"
                  onClick={() => navigate('/')}
                >
                  <i className="bi bi-house-door-fill me-2"></i> Home
                </Button>
                <Button 
                  variant="danger" 
                  size="lg"
                  className="rounded-pill d-flex align-items-center justify-content-center"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card className={`border-0 shadow-lg rounded-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Header className={`p-4 border-0 ${isDarkMode ? 'bg-dark' : 'bg-white'}`}>
              <div className="d-flex align-items-center">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle me-3" 
                  style={{ 
                    width: '48px', 
                    height: '48px',
                    background: 'linear-gradient(135deg, #4568dc, #b06ab3)'
                  }}
                >
                  <i className="bi bi-bookmark-heart-fill fs-4 text-white"></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">Favorite Countries</h3>
                  <p className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-0 small`}>
                    {countryData.length > 0 ? (
                      <>Representing {formatNumber(stats.totalPopulation)} people across {stats.continents} continents</>
                    ) : (
                      <>Your personal collection of countries</>
                    )}
                  </p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" style={{ color: '#4568dc' }} className="mb-3" />
                  <p className={isDarkMode ? 'text-light-emphasis' : 'text-muted'}>Loading your favorite countries...</p>
                </div>
              ) : countryData.length > 0 ? (
                <Row className="g-4">
                  {countryData.map((country) => (
                    <Col sm={6} md={4} key={country.cca3}>
                      <Card 
                        className={`h-100 border-0 shadow-sm rounded-4 overflow-hidden country-card ${isDarkMode ? 'bg-dark-subtle' : ''}`} 
                        onClick={() => handleFlagClick(country.cca3)}
                        style={{ 
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = `0 15px 30px rgba(0,0,0,${isDarkMode ? '0.2' : '0.1'})`;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `0 .125rem .25rem rgba(0,0,0,${isDarkMode ? '.15' : '.075'})`;
                        }}
                      >
                        <div className="country-flag-container position-relative" style={{ height: '140px', overflow: 'hidden' }}>
                          <Card.Img 
                            variant="top" 
                            src={country.flags.png} 
                            alt={country.name.common}
                            className="country-flag"
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transition: 'transform 0.5s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                          <Badge 
                            bg="primary" 
                            className="position-absolute bottom-0 end-0 mb-2 me-2 rounded-pill"
                            style={{ opacity: 0.9 }}
                          >
                            {country.cca3}
                          </Badge>
                        </div>
                        <Card.Body className="text-center p-3">
                          <Card.Title className={`mb-1 fw-bold ${isDarkMode ? 'text-dark' : ''}`}>{country.name.common}</Card.Title>
                          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                            <i className="bi bi-geo-alt text-primary small"></i>
                            <small className="text-muted">{country.region}</small>
                          </div>
                          <div className="d-flex justify-content-center gap-2">
                            <Badge bg="light" text="dark" className="rounded-pill">
                              <i className="bi bi-people me-1"></i>
                              {formatNumber(country.population)}
                            </Badge>
                            {country.capital && (
                              <Badge bg="light" text="dark" className="rounded-pill">
                                <i className="bi bi-building me-1"></i>
                                {country.capital[0]}
                              </Badge>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center mb-4 rounded-circle" 
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      background: isDarkMode ? 
                        'linear-gradient(135deg, #2c3e50, #4c669f)' : 
                        'linear-gradient(135deg, #f5f7fa, #c3cfe2)'
                    }}
                  >
                    <i className={`bi bi-heart fs-1 ${isDarkMode ? 'text-light' : 'text-secondary'}`}></i>
                  </div>
                  <h3 className="mb-3 fw-bold">No Favorites Yet</h3>
                  <p className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-4 lead`}>Start exploring countries and add them to your favorites</p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="rounded-pill px-5 py-3 fw-bold"
                    onClick={() => navigate('/')}
                    style={{ 
                      background: 'linear-gradient(135deg, #4568dc, #b06ab3)', 
                      border: 'none',
                      boxShadow: '0 10px 20px rgba(69, 104, 220, 0.2)'
                    }}
                  >
                    <i className="bi bi-globe2 me-2"></i>
                    Explore Countries
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;