describe('Login Flow - Without data-cy', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should login successfully', () => {
    // Using placeholder
    cy.get('input[placeholder="Email"]').type('test@demo.com');
    
    // Using type attribute
    cy.get('input[type="password"]').type('Test1234!');
    
    // Using text content
    cy.contains('Login Now').click();
    
    // Verify navigation
    cy.url().should('include', '/dashboard');
  });
});