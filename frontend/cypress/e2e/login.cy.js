/// <reference types="cypress" />
/* global cy */

describe('Login Page', () => {
    it('should allow user to login', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('testuser');
      cy.get('button[type="submit"]').click();
      
      cy.url().should('eq', 'http://localhost:3000/'); 
    });
  });
  