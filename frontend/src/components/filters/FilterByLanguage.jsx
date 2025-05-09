import React from 'react';
import { Form } from 'react-bootstrap';

const FilterByLanguage = ({ languages, selectedLanguage, onLanguageChange }) => {
  return (
    <Form.Select 
      aria-label="Select language"
      onChange={(e) => onLanguageChange(e.target.value)}
      value={selectedLanguage}
      style={{ width: '200px' }}
    >
      <option value="">Filter by Language</option>
      {languages.map(language => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </Form.Select>
  );
};

export default FilterByLanguage;