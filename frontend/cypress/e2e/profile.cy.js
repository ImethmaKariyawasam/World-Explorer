/// <reference types="cypress" />

/* global cy,before */

describe('Profile Page', () => {
    before(() => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type('testuser@example.com');
      cy.get('input[name="password"]').type('testuser');
      cy.get('button[type="submit"]').click();
    });
  
    it('should load the profile page and display user info', () => {
      cy.visit('http://localhost:3000/profile');
  
      cy.contains('Profile'); // Page heading
      cy.get('.profile-username').should('exist');
      cy.get('.profile-email').should('exist');    
    });
  });
  