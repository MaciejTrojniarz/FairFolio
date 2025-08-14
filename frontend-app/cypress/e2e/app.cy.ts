describe('FairMerchant App', () => {
  it('should display the main title', () => {
    cy.visit('/');
    cy.contains('FairMerchant App');
  });

  it('should increment the counter', () => {
    cy.visit('/');
    cy.contains('Count: 0');
    cy.contains('Increment').click();
    cy.contains('Count: 1');
  });

  it('should increment the counter by 5', () => {
    cy.visit('/');
    cy.contains('Count: 0');
    cy.contains('Increment by 5').click();
    cy.contains('Count: 5');
  });

  it('should increment the counter asynchronously', () => {
    cy.visit('/');
    cy.contains('Count: 0');
    cy.contains('Increment Async').click();
    cy.contains('Count: 0'); // Still 0 immediately
    cy.wait(1100); // Wait for the async operation to complete
    cy.contains('Count: 1');
  });
});