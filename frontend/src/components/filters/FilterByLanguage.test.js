import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterByLanguage from './FilterByLanguage';

describe('FilterByLanguage Component', () => {
  const mockLanguages = ['English', 'Spanish', 'French', 'German'];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default option and language options', () => {
    render(
      <FilterByLanguage 
        languages={mockLanguages} 
        selectedLanguage="" 
        onLanguageChange={mockOnChange} 
      />
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Filter by Language')).toBeInTheDocument();
    mockLanguages.forEach(lang => {
      expect(screen.getByText(lang)).toBeInTheDocument();
    });
  });

  it('shows the selected language', () => {
    render(
      <FilterByLanguage 
        languages={mockLanguages} 
        selectedLanguage="French" 
        onLanguageChange={mockOnChange} 
      />
    );

    expect(screen.getByDisplayValue('French')).toBeInTheDocument();
  });

  it('calls onLanguageChange when selection changes', () => {
    render(
      <FilterByLanguage 
        languages={mockLanguages} 
        selectedLanguage="" 
        onLanguageChange={mockOnChange} 
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Spanish' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Spanish');
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <FilterByLanguage 
        languages={mockLanguages} 
        selectedLanguage="English" 
        onLanguageChange={mockOnChange} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});