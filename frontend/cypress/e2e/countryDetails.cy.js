/// <reference types="cypress" />
/* global cy */

describe('Country Details', () => {
    it('should navigate to a country details page', () => {
      cy.visit('http://localhost:3000');
      cy.get('.country-card') // Click on the first country
        .first()
        .click();
  
      cy.url().should('include', '/country'); 
      cy.contains('Capital'); 
    });
  });
  