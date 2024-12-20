import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { Categorie } from 'src/models/index.js'; // Importez votre modèle de catégorie
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js'; // Assurez-vous que le chemin est correct

describe('GET /api/categorie/', () => {
    let user_john;

    beforeAll(async () => {
        await prepareDatabase();
        user_john = await getUserToken('john.doe@example.com'); // Récupérer un token valide pour l'utilisateur
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 - should return all categories', async () => {
        // Mock de Categorie.findAll pour simuler la récupération des catégories
        const mockCategories = [
            { id: 1, name: 'Electronics' },
            { id: 2, name: 'Books' }
        ];

        Categorie.findAll = jest.fn().mockResolvedValue(mockCategories); // Simuler la fonction findAll

        const response = await request(app)
            .get('/api/categorie/')
            .set('Authorization', `Bearer ${user_john}`); // Ajout de l'en-tête Authorization pour l'authentification

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockCategories); // Vérifiez que le corps de la réponse contient les catégories simulées

        // Vérifier que findAll a bien été appelé
        expect(Categorie.findAll).toHaveBeenCalled();
    });

    it('500 - should return internal server error', async () => {
        // Mock de Categorie.findAll pour lever une erreur
        Categorie.findAll = jest.fn().mockRejectedValue(new Error('Erreur lors de la récupération des catégories'));

        const response = await request(app)
            .get('/api/categorie/')
            .set('Authorization', `Bearer ${user_john}`); // Ajout de l'en-tête Authorization pour l'authentification

        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: 'Erreur serveur lors de la récupération des catégories'
        });

        // Vérifier que findAll a bien été appelé
        expect(Categorie.findAll).toHaveBeenCalled();
    });
});
