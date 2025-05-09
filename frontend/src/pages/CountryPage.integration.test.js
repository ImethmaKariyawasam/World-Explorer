import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { useParams, useNavigate } from 'react-router-dom';
import CountryPage from './CountryPage';
import { fetchCountryByCode } from '../services/countryApi';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock the countryApi service
jest.mock('../services/countryApi');
const mockedFetchCountryByCode = fetchCountryByCode;

// Mock FavoriteButton
jest.mock('../components/countries/FavoriteButton', () => () => (
  <button>Favorite Button</button>
));

describe('CountryPage', () => {
  const mockNavigate = jest.fn();
  const mockCountry = {
    cca3: 'DEU',
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany'
    },
    flags: {
      png: 'https://flagcdn.com/w320/de.png'
    },
    capital: ['Berlin'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 83240525,
    languages: {
      deu: 'German'
    },
    currencies: {
      EUR: {
        name: 'Euro',
        symbol: '€'
      }
    },
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE']
  };

  beforeEach(() => {
    useParams.mockReturnValue({ code: 'DEU' });
    useNavigate.mockReturnValue(mockNavigate);
    mockedFetchCountryByCode.mockClear();
    mockNavigate.mockClear();
  });

  it('should render loading state initially', async () => {
    // Delay the mock response
    mockedFetchCountryByCode.mockReturnValue(new Promise(() => {}));

    render(
      <Router>
        <CountryPage />
      </Router>
    );

    // Check loading text and spinner (using test id)
    expect(screen.getByText('Loading country information...')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render country details after loading', async () => {
    mockedFetchCountryByCode.mockResolvedValue([mockCountry]);

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    // Check all country details
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Federal Republic of Germany')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Western Europe')).toBeInTheDocument();
    expect(screen.getByText(/83,240,525/)).toBeInTheDocument();
    expect(screen.getByText('Berlin')).toBeInTheDocument();
    expect(screen.getByText('German')).toBeInTheDocument();
    expect(screen.getByText(/Euro.*€/)).toBeInTheDocument();
    
    // Check border countries
    mockCountry.borders.forEach(border => {
      expect(screen.getByText(border)).toBeInTheDocument();
    });
    
    // Check favorite button
    expect(screen.getByText('Favorite Button')).toBeInTheDocument();
  });

  it('should render error message when country is not found', async () => {
    mockedFetchCountryByCode.mockResolvedValue([]);

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Country not found')).toBeInTheDocument();
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });

  it('should render error message when API call fails', async () => {
    mockedFetchCountryByCode.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load country information')).toBeInTheDocument();
    expect(screen.getByText('Return to Home')).toBeInTheDocument();
  });

  it('should navigate back when back button is clicked', async () => {
    mockedFetchCountryByCode.mockResolvedValue([mockCountry]);

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    const backButton = screen.getByText(/back/i);
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should navigate to border country when border button is clicked', async () => {
    mockedFetchCountryByCode.mockResolvedValue([mockCountry]);

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    const borderButton = screen.getByText('AUT');
    fireEvent.click(borderButton);

    expect(mockNavigate).toHaveBeenCalledWith('/country/AUT');
  });

  it('should handle missing optional fields gracefully', async () => {
    const countryWithMissingFields = {
      ...mockCountry,
      subregion: undefined,
      capital: undefined,
      languages: undefined,
      currencies: undefined,
      borders: undefined
    };
    mockedFetchCountryByCode.mockResolvedValue([countryWithMissingFields]);

    await act(async () => {
      render(
        <Router>
          <CountryPage />
        </Router>
      );
    });

    // Check for N/A values using text content
    const checkNAField = (label) => {
      const elements = screen.getAllByText((content, element) => {
        return element.textContent.includes(`${label}:`) && element.textContent.includes('N/A');
      });
      expect(elements.length).toBeGreaterThan(0);
    };

    checkNAField('Sub Region');
    checkNAField('Capital');
    checkNAField('Languages');
    checkNAField('Currencies');
  });
});