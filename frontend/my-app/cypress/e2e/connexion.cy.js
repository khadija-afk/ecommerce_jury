describe('Page de connexion', () => {
    beforeEach(() => {
        cy.visit('/sign'); // Assurez-vous que l'URL correspond à celle de la page de connexion
    });

    it('Affiche correctement le formulaire de connexion', () => {
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.contains('Se connecter').should('be.visible');
    });

    it('Connexion réussie avec les identifiants corrects', () => {
        cy.intercept('POST', '/api/api/user/sign', {
            statusCode: 200,
            body: {
                user: {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'johndoe@example.com',
                    // Autres informations utilisateur si nécessaire
                },
                token: 'fake-token',
            },
        }).as('signInRequest');

        cy.get('input[name="email"]').type('johndoe@example.com', { force: true });
        cy.get('input[name="password"]').type('password123', { force: true });
        cy.contains('Se connecter').click({ force: true });

        cy.wait('@signInRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            expect(localStorage.getItem('token')).to.exist;
            expect(localStorage.getItem('user')).to.exist;
        });

        cy.url().should('eq', `${Cypress.config().baseUrl}/`); // Assurez-vous que l'URL de redirection est correcte
    });

    it('Affiche une erreur avec des identifiants incorrects', () => {
        cy.intercept('POST', '/api/api/user/sign', {
            statusCode: 404,
            body: { message: 'Request failed with status code 404' },
        }).as('signInRequestFailed');
        
        cy.get('input[name="email"]').type('wronguser@example.com', { force: true });
        cy.get('input[name="password"]').type('wrongpassword', { force: true });
        
        cy.contains('Se connecter').click({ force: true });

        cy.wait('@signInRequestFailed').then((interception) => {
            expect(interception.response.statusCode).to.equal(404);
        });

        cy.contains('Request failed with status code 404').should('be.visible');

    });
});
