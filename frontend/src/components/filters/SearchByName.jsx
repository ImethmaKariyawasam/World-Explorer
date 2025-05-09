import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { fetchCountryByName } from '../../services/countryApi';

const SearchByName = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // New: This will hold the timeout ID
  const debounceTimeout = React.useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (value.trim() === '') {
        onSearch(null); // Show all countries
        return;
      }

      setIsSearching(true);
      try {
        const results = await fetchCountryByName(value);
        onSearch(results || []);
      } catch (error) {
        console.error("Search error:", error);
        onSearch([]); // Empty results on error
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce delay: 500ms
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  return (
    <InputGroup style={{ width: '300px' }}>
      <Form.Control
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={handleChange}
      />
      {isSearching && (
        <InputGroup.Text>
          <Spinner animation="border" size="sm" />
        </InputGroup.Text>
      )}
    </InputGroup>
  );
};

export default SearchByName;
