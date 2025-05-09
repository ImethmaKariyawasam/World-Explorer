import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Home from './Home';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock axios with proper TypeScript typing
jest.mock('axios');
const mockedAxios = axios;

const mockCountries = [
  { 
    cca3: 'USA', 
    name: { common: 'United States' }, 
    region: 'Americas', 
    languages: { eng: 'English' },
    population: 331000000,
    capital: ['Washington D.C.'],
    flags: { png: 'usa-flag.png' }
  },
  { 
    cca3: 'DEU', 
    name: { common: 'Germany' }, 
    region: 'Europe', 
    languages: { deu: 'German' },
    population: 83000000,
    capital: ['Berlin'],
    flags: { png: 'germany-flag.png' }
  },
  { 
    cca3: 'MEX', 
    name: { common: 'Mexico' }, 
    region: 'Americas', 
    languages: { spa: 'Spanish' },
    population: 126000000,
    capital: ['Mexico City'],
    flags: { png: 'mexico-flag.png' }
  }
];

describe('Home Page Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default mock for initial load (all countries)
    mockedAxios.get.mockResolvedValueOnce({ data: mockCountries });
    
    // Mock implementation for specific cases
    mockedAxios.get.mockImplementation((url) => {
      if (typeof url !== 'string') return Promise.resolve({ data: [] });
      
      if (url.includes('/name/')) {
        const searchTerm = url.split('/name/')[1].toLowerCase();
        const filtered = mockCountries.filter(country => 
          country.name.common.toLowerCase().includes(searchTerm)
        );
        return Promise.resolve({ data: filtered });
      }
      
      if (url.includes('/region/')) {
        const region = url.split('/region/')[1].toLowerCase();
        const filtered = mockCountries.filter(country => 
          country.region.toLowerCase() === region
        );
        return Promise.resolve({ data: filtered });
      }
      
      return Promise.resolve({ data: mockCountries });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderHome = async () => {
    await act(async () => {
      render(
        <Router>
          <Home />
        </Router>
      );
    });
    // Wait for initial load to complete
    await screen.findByText('United States');
  };

  it('should initially load and display all countries', async () => {
    await renderHome();
    
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  it('should filter countries by region', async () => {
    await renderHome();
    
    // Select Europe region
    const regionFilter = screen.getByLabelText(/filter by region/i);
    await act(async () => {
      fireEvent.change(regionFilter, { target: { value: 'europe' } });
    });

    // Wait for filtering to complete
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should search for countries by name', async () => {
    await renderHome();
    
    // Search for 'Germany'
    const searchInput = screen.getByPlaceholderText('Search for a country...');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Germany' } });
    });

    // Wait for search to complete
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should filter countries by language', async () => {
    await renderHome();
    
    // Select Spanish language
    const languageFilter = screen.getByLabelText(/select language/i);
    await act(async () => {
      fireEvent.change(languageFilter, { target: { value: 'Spanish' } });
    });

    // Wait for filtering to complete
    await waitFor(() => {
      expect(screen.getByText('Mexico')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.queryByText('Germany')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});