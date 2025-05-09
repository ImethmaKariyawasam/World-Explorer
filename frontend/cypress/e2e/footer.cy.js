/// <reference types="cypress" />
/* global cy */

describe('Footer', () => {
    it('should display footer and important links or text', () => {
      cy.visit('http://localhost:3000');
  
      cy.get('footer').should('exist');
      cy.get('footer').contains('©'); 
      
    });
  });
  