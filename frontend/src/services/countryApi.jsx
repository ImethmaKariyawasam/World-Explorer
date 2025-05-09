import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

export const fetchAllCountries = async () => {
  try {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
} catch (error) {
  console.error('Error fetching countries by language:', error);
  return []; 
  }
};

export const fetchCountryByName = async (name) => {
  try {
  const response = await axios.get(`${API_URL}/name/${name}`);
  return response.data;
} catch (error) {
  console.error('Error fetching countries by language:', error);
  return []; 
  }
};

export const fetchCountriesByRegion = async (region) => {
  try {
  const response = await axios.get(`${API_URL}/region/${region}`);
  return response.data;
} catch (error) {
  console.error('Error fetching countries by language:', error);
  return []; 
  }
};

export const fetchCountryByCode = async (code) => {
  try {
  const response = await axios.get(`${API_URL}/alpha/${code}`);
  return response.data;
  } catch (error) {
  console.error('Error fetching countries by language:', error);
  return []; 
  }
};

export const fetchCountriesByLanguage = async (languageCode) => {
  try {
    const response = await axios.get(`${API_URL}/lang/${languageCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by language:', error);
    return [];
  }
};