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
        cy.intercept('POST', '/api/user/add', {
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

    it('Affiche une erreur lorsque l\'email est déjà utilisé', () => {
        cy.intercept('POST', '/api/user/add', {
            statusCode: 409,
            body: { error: 'Cet email est déjà utilisé' },
        }).as('registerRequestFailed');

        cy.get('input[name="firstName"]').type('Jane', { force: true });
        cy.get('input[name="lastName"]').type('Doe', { force: true });
        cy.get('input[name="email"]').type('janedoe@example.com', { force: true });
        cy.get('input[name="password"]').type('password123', { force: true });
        cy.contains('S\'inscrire').click({ force: true });

        cy.wait('@registerRequestFailed').then((interception) => {
            expect(interception.response.statusCode).to.equal(409);
        });

        // Vérifiez que le message d'erreur compréhensible est affiché
        cy.contains('Cet email est déjà utilisé').should('be.visible');
    });

    it('Affiche une erreur de validation pour le mot de passe', () => {
        cy.intercept('POST', '/api/user/add', {
            statusCode: 400,
            body: { error: 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, un caractère spécial et un chiffre.' },
        }).as('registerPasswordError');

        cy.get('input[name="firstName"]').type('Jane', { force: true });
        cy.get('input[name="lastName"]').type('Doe', { force: true });
        cy.get('input[name="email"]').type('janedoe@example.com', { force: true });
        cy.get('input[name="password"]').type('short', { force: true }); // Mot de passe non conforme
        cy.contains('S\'inscrire').click({ force: true });

        cy.wait('@registerPasswordError').then((interception) => {
            expect(interception.response.statusCode).to.equal(400);
        });

        // Vérifiez que le message d'erreur de validation est affiché
        cy.contains('Le mot de passe doit comporter au moins 8 caractères, une majuscule, un caractère spécial et un chiffre.').should('be.visible');
    });
});
