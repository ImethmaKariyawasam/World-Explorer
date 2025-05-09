/// <reference types="cypress" />

/* global cy */

describe('Register', () => {
    it('should allow user to register successfully', () => {
      cy.visit('http://localhost:3000/register');
  
      // Fill out the registration form
      cy.get('input[name="username"]').type('newuser2');
      cy.get('input[name="email"]').type('newuser2@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      
      // Submit the registration form
      cy.get('button[type="submit"]').click();
  
      
      cy.wait(2000); 
  
  
      cy.url().should('eq', 'http://localhost:3000/'); 
      
    });
  });
  