import React from 'react';
import { Form } from 'react-bootstrap';

const regions = [
  { value: '', label: 'All' },
  { value: 'africa', label: 'Africa' },
  { value: 'americas', label: 'Americas' },
  { value: 'asia', label: 'Asia' },
  { value: 'europe', label: 'Europe' },
  { value: 'oceania', label: 'Oceania' },
];

const FilterByRegion = ({ onFilter }) => {
  return (
    <Form.Select 
      onChange={(e) => onFilter(e.target.value)} 
      style={{ width: '200px' }}
      aria-label="Filter by region"
    >
      {regions.map((region) => (
        <option key={region.value} value={region.value}>
          {region.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default FilterByRegion;