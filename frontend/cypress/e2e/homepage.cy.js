/// <reference types="cypress" />
/* global cy */

describe('Country App Home Page', () => {
    it('should load the homepage successfully', () => {
      cy.visit('http://localhost:3000'); 
      cy.contains('Explorer'); 
    });
  });
  