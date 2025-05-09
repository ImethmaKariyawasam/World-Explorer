/// <reference types="cypress" />
/* global cy */

describe('Favorites', () => {
    it('should allow logged-in user to add a country to favorites', () => {
      cy.visit('http://localhost:3000/login'); // First visit login page
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('testuser');
      cy.get('button[type="submit"]').click(); // Login
  
      cy.url().should('eq', 'http://localhost:3000/'); 
  
      cy.get('.country-card').first().click(); 
      cy.contains('Add to Favorites').click(); // Click Add to Favorites button
  
      cy.visit('http://localhost:3000/profile'); 
      cy.get('.country-card')
        .should('exist');
    });
  });
  