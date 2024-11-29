describe('Cookie Consent Modal', () => {
    beforeEach(() => {
      // Réinitialise localStorage pour forcer l'apparition du modal à chaque test
      cy.clearLocalStorage();
    });

    it('affiche le modal de consentement des cookies', () => {
      cy.visit('/');
      cy.contains('Gérer mes cookies', { timeout: 10000 }).should('be.visible');
    });

    it('ouvre le modal de paramètres en cliquant sur "Paramétrer"', () => {
      cy.visit('/');
      cy.contains('Paramétrer', { timeout: 10000 }).click();

      // Vérifie que le modal de paramètres s'affiche
      cy.contains('Votre choix relatif aux cookies', { timeout: 10000 }).should('be.visible');
    });

    it('accepte les cookies en cliquant sur le bouton "Accepter"', () => {
      cy.visit('/');
      cy.contains('Accepter', { timeout: 10000 }).click();

      // Vérifie que le consentement est dans localStorage
      cy.window().then((win) => {
        const consent = win.localStorage.getItem('userCookieConsent');
        expect(consent).to.contain('"consent":true');
      });
    });
});
