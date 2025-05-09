import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterByRegion from './FilterByRegion';

describe('FilterByRegion Component', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it('renders with all region options', () => {
    render(<FilterByRegion onFilter={mockOnFilter} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Oceania')).toBeInTheDocument();
  });

  it('calls onFilter when region is selected', () => {
    render(<FilterByRegion onFilter={mockOnFilter} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'asia' } });
    expect(mockOnFilter).toHaveBeenCalledWith('asia');
  });

  it('defaults to All option', () => {
    render(<FilterByRegion onFilter={mockOnFilter} />);
    
    expect(screen.getByDisplayValue('All')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<FilterByRegion onFilter={mockOnFilter} />);
    expect(asFragment()).toMatchSnapshot();
  });
});