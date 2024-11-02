describe('Page d\'inscription', () => {
    beforeEach(() => {
        cy.visit('/register'); // Assurez-vous que l'URL est correcte pour la page d'inscription
        cy.get('input[name="firstName"]').should('be.visible'); // Assurez-vous que le formulaire est chargé
    });

    it('Affiche correctement le formulaire d\'inscription', () => {
        cy.get('input[name="firstName"]').should('be.visible');
        cy.get('input[name="lastName"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
        cy.contains('S\'inscrire').should('be.visible');
    });

    it('Envoie une demande d\'inscription avec des données valides', () => {
        cy.intercept('POST', '/api/api/user/add', {
            statusCode: 201,
            body: {
                message: 'Utilisateur créé avec succès',
                user: {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'johndoe@example.com',
                },
            },
        }).as('registerRequest');

        cy.get('input[name="firstName"]').type('John', { force: true });
        cy.get('input[name="lastName"]').type('Doe', { force: true });
        cy.get('input[name="email"]').type('johndoe@example.com', { force: true });
        cy.get('input[name="password"]').type('password123', { force: true });
        cy.contains('S\'inscrire').click({ force: true });

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(201);
        });

        cy.contains('Votre compte a été créé avec succès !').should('be.visible');
        cy.contains('Cliquez ici pour vous connecter').should('be.visible');
    });

    it('Affiche une erreur lors de l\'inscription avec des données invalides', () => {
        cy.intercept('POST', '/api/api/user/add', {
            statusCode: 400,
            body: { error: 'Données invalides' },
        }).as('registerRequestFailed');
    
        cy.get('input[name="firstName"]').type('Jane', { force: true });
        // Assurez-vous que vous ne passez pas de chaîne vide à `cy.type()`
        // Si vous voulez tester un champ vide, ne faites pas `cy.type('')` :
        // cy.get('input[name="lastName"]').type('', { force: true }); <-- ceci est l'erreur
        cy.get('input[name="lastName"]').clear(); // Utilisez `clear()` pour simuler un champ vide
    
        cy.get('input[name="email"]').type('janedoe@example.com', { force: true });
        cy.get('input[name="password"]').type('password123', { force: true });
        cy.contains('S\'inscrire').click({ force: true });
    
        cy.wait('@registerRequestFailed').then((interception) => {
            expect(interception.response.statusCode).to.equal(400);
        });
    
        cy.contains('Données invalides').should('be.visible');
    });
    
});
