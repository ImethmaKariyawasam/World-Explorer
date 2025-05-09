import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCountryByCode } from '../../services/countryApi';
import { Box, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

const CountryDetails = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data[0]);
      } catch (error) {
        console.error('Failed to fetch country details:', error);
      }
    };

    fetchCountry();
  }, [code]);

  if (!country) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        {country.name.common}
      </Typography>
      <img src={country.flags.png} alt={country.name.common} style={{ maxWidth: '300px' }} />

      <Typography variant="h5" sx={{ mt: 2 }}>
        Details
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Official Name" secondary={country.name.official} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Capital" secondary={country.capital?.[0] || 'N/A'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Region" secondary={country.region} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Subregion" secondary={country.subregion || 'N/A'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Population" secondary={country.population.toLocaleString()} />
        </ListItem>
      </List>

      <Typography variant="h5" sx={{ mt: 2 }}>
        Languages
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Object.values(country.languages || {}).map((lang) => (
          <Chip key={lang} label={lang} />
        ))}
      </Box>
    </Box>
  );
};

export default CountryDetails;
