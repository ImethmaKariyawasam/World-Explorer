/// <reference types="cypress" />

/* global cy */

describe('Country Card', () => {
    it('should display country cards with proper information', () => {
      cy.visit('http://localhost:3000');
  
      cy.get('.country-card').should('exist');
      cy.get('.country-card').first().within(() => {
        cy.get('img').should('exist'); // Flag image
      });
    });
  });
  