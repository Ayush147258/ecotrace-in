describe('User Flow: Sign Up and Take Quiz', () => {
  it('should allow a user to navigate as a guest, take the quiz, and see the dashboard', () => {
    // Start at the landing page
    cy.visit('/');
    cy.contains('Continue as Guest', { matchCase: false }).should('be.visible').click();

    // Verify we are on the quiz page
    cy.url().should('include', '/quiz');
    cy.contains('Transport', { matchCase: false }).should('be.visible');

    // Select answers
    cy.contains('Car', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click();

    cy.contains('LPG', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click();

    cy.contains('Mixed', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click();

    cy.contains('Daily', { matchCase: false }).click();
    cy.contains('Next', { matchCase: false }).click();

    cy.contains('Rarely', { matchCase: false }).click();
    cy.contains('Finish', { matchCase: false }).click();

    // Verify we landed on the dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('EcoScore', { matchCase: false }).should('be.visible');
  });
});
