import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CountryCard = ({ country }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <Card className="h-100 shadow-sm border-0 country-card" onClick={handleCardClick}>
        <div className="country-flag-container">
          <Card.Img
            variant="top"
            src={country.flags.png}
            alt={country.name.common}
            className="country-flag"
          />
        </div>
        <Card.Body>
          <Card.Title className="fw-bold text-truncate">{country.name.common}</Card.Title>
          <div className="d-flex flex-column gap-1">
            <div>
              <span className="fw-medium">Population:</span> {country.population.toLocaleString()}
            </div>
            <div>
              <span className="fw-medium">Region:</span> {country.region}
            </div>
            <div>
              <span className="fw-medium">Capital:</span> {country.capital?.[0] || 'N/A'}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CountryCard;
