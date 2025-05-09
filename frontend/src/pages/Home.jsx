import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import CountryCard from '../components/countries/CountryCard';
import SearchByName from '../components/filters/SearchByName';
import FilterByRegion from '../components/filters/FilterByRegion';
import FilterByLanguage from '../components/filters/FilterByLanguage';
import { fetchAllCountries, fetchCountriesByRegion } from '../services/countryApi';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
        setFilteredCountries(data);
        
        const allLanguages = new Set();
        data.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(lang => allLanguages.add(lang));
          }
        });
        setLanguages(Array.from(allLanguages).sort());
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  const handleSearch = (searchResults) => {
    setApiSearchResults(searchResults); // Store API results
    applyFilters(searchResults, selectedLanguage);
  };

  const handleFilter = async (region) => {
    try {
      setLoading(true);
      const data = region ? await fetchCountriesByRegion(region) : countries;
      applyFilters(apiSearchResults || data, selectedLanguage);
    } catch (error) {
      console.error("Filter error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    applyFilters(apiSearchResults || countries, language);
  };

  const applyFilters = (countryList, languageFilter) => {
    let filtered = countryList || countries;
    
    if (languageFilter) {
      filtered = filtered.filter(country => 
        country.languages && 
        Object.values(country.languages).includes(languageFilter)
      );
    }
    
    setFilteredCountries(filtered);
  };

  return (
    <Container>
      <div className="filter-container d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <SearchByName onSearch={handleSearch} />
        <div className="d-flex flex-wrap gap-3">
          <FilterByRegion onFilter={handleFilter} />
          <FilterByLanguage 
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading countries...</p>
        </div>
      ) : (
        <>
          {filteredCountries.length > 0 ? (
            <Row className="country-grid">
              {filteredCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </Row>
          ) : (
            <div className="text-center p-5 bg-light rounded">
              <h4>No countries found matching your filters</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;