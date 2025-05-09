import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchByName from './SearchByName';
import axios from 'axios';

jest.mock('axios');

describe('SearchByName Component', () => {
  it('renders search input', () => {
    render(<SearchByName onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument();
  });

  it('triggers search after typing', async () => {
    const mockResponse = [{ name: { common: 'Canada' } }];
    axios.get.mockResolvedValue({ data: mockResponse });
    
    const mockOnSearch = jest.fn();
    render(<SearchByName onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(input, { target: { value: 'Canada' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Canada');
      expect(mockOnSearch).toHaveBeenCalledWith(mockResponse);
    });
  });
});