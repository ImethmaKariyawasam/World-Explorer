import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { fetchCountryByCode } from '../services/countryApi';
import FavoriteButton from '../components/countries/FavoriteButton';

const CountryPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        const data = await fetchCountryByCode(code);
        if (data && data.length > 0) {
          setCountry(data[0]);
        } else {
          setError("Country not found");
        }
      } catch (err) {
        setError("Failed to load country information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCountry();
  }, [code]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" data-testid="loading-spinner" />
          <p className="mt-3">Loading country information...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!country) return null;

  const {
    flags,
    name,
    capital,
    region,
    subregion,
    population,
    languages,
    currencies,
    borders
  } = country;

  return (
    <Container className="py-5">
      <Button 
        variant="outline-primary" 
        onClick={() => navigate(-1)} 
        className="back-btn mb-4"
      >
        <i className="bi bi-arrow-left"></i> Back
      </Button>
      
      <div className="country-detail-container">
        <Row className="gy-5">
          <Col lg={5}>
            <img 
              src={flags.png} 
              alt={`Flag of ${name.common}`} 
              className="country-detail-flag" 
            />
          </Col>
          
          <Col lg={7}>
            <h1 className="mb-4">{name.common}</h1>
            
            <Row className="mb-4">
              <Col md={6}>
                <p><strong>Official Name:</strong> {name.official}</p>
                <p><strong>Population:</strong> {population.toLocaleString()}</p>
                <p><strong>Region:</strong> {region}</p>
                <p><strong>Sub Region:</strong> {subregion || 'N/A'}</p>
                <p><strong>Capital:</strong> {capital?.[0] || 'N/A'}</p>
              </Col>
              
              <Col md={6}>
                <p><strong>Languages:</strong> {languages ? Object.values(languages).join(', ') : 'N/A'}</p>
                <p>
                  <strong>Currencies:</strong>{' '}
                  {currencies
                    ? Object.values(currencies)
                        .map(currency => `${currency.name} (${currency.symbol || 'N/A'})`)
                        .join(', ')
                    : 'N/A'}
                </p>
              </Col>
            </Row>
            
            {borders && borders.length > 0 && (
              <div>
                <strong>Border Countries:</strong>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {borders.map(border => (
                    <Button
                      key={border}
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => navigate(`/country/${border}`)}
                    >
                      {border}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <FavoriteButton countryCode={country.cca3} />
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CountryPage;