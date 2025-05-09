/// <reference types="cypress" />

/* global cy */

describe('Navbar', () => {
    it('should navigate to Login, Register, and Favorites pages', () => {
      cy.visit('http://localhost:3000');
  
      cy.contains('Login').click();
      cy.url().should('include', '/login');
  
      cy.contains('Register').click();
      cy.url().should('include', '/register');
  
    });
  });
  