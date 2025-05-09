import { render, screen, waitFor } from '@testing-library/react';
import CountryDetails from './CountryDetails';
import { useParams } from 'react-router-dom';
import { getCountryByCode } from '../../services/countryApi';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../../services/countryApi', () => ({
  getCountryByCode: jest.fn(),
}));

describe('CountryDetails Component', () => {
  const mockCountry = {
    name: {
      common: 'United States',
      official: 'United States of America'
    },
    flags: { png: 'https://flagcdn.com/us.png' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    population: 331002651,
    languages: { eng: 'English', spa: 'Spanish' }
  };

  beforeEach(() => {
    useParams.mockReturnValue({ code: 'USA' });
    getCountryByCode.mockResolvedValue([mockCountry]);
  });

  test('renders loading state initially', () => {
    render(<CountryDetails />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders country details after loading', async () => {
    render(<CountryDetails />);
    
    await waitFor(() => expect(screen.getByText('United States')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByAltText('United States')).toHaveAttribute('src', mockCountry.flags.png));
    await waitFor(() => expect(screen.getByText(/Official Name/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(mockCountry.name.official)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Capital/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(mockCountry.capital[0])).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Population/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('331,002,651')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('English')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Spanish')).toBeInTheDocument());
  });

  test('handles missing optional fields', async () => {
    const countryWithoutOptional = {
      ...mockCountry,
      subregion: undefined,
      languages: undefined
    };
    getCountryByCode.mockResolvedValue([countryWithoutOptional]);
    
    render(<CountryDetails />);
    
    await waitFor(() => {
      expect(screen.getByText(/Subregion/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });
});