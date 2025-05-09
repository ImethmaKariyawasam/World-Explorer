import { render, screen, fireEvent } from '@testing-library/react';
import CountryCard from './CountryCard';
import { useNavigate } from 'react-router-dom';

// Mock the navigate function
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CountryCard Component', () => {
  const mockCountry = {
    cca3: 'USA',
    name: { common: 'United States' },
    flags: { png: 'https://flagcdn.com/us.png' },
    population: 331002651,
    region: 'Americas',
    capital: ['Washington, D.C.'],
  };

  beforeEach(() => {
    useNavigate.mockClear();
  });

  test('renders country information correctly', () => {
    render(<CountryCard country={mockCountry} />);
    
    // Check country name
    expect(screen.getByText('United States')).toBeInTheDocument();
    
    // Check population - using more flexible matching
    expect(screen.getByText(/Population:/i)).toBeInTheDocument();
    expect(screen.getByText('331,002,651')).toBeInTheDocument();
    
    // Check region
    expect(screen.getByText(/Region:/i)).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    
    // Check capital
    expect(screen.getByText(/Capital:/i)).toBeInTheDocument();
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
    
    // Check flag image
    expect(screen.getByAltText('United States')).toHaveAttribute('src', 'https://flagcdn.com/us.png');
  });

  test('navigates to country details when clicked', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    
    render(<CountryCard country={mockCountry} />);
    
    // Click on the card title (more reliable target)
    fireEvent.click(screen.getByText('United States'));
    
    expect(mockNavigate).toHaveBeenCalledWith('/country/USA');
  });

  test('handles missing capital gracefully', () => {
    const countryWithoutCapital = {
      ...mockCountry,
      capital: undefined
    };
    
    render(<CountryCard country={countryWithoutCapital} />);
    
    expect(screen.getByText(/Capital:/i)).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});


