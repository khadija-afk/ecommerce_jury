import request from 'supertest';
import { app } from 'server.js'; // Assurez-vous que le chemin est correct
import { User } from 'src/models/index.js'; // Importez votre modèle
import { prepareDatabase, teardownDatabase, getUserToken } from 'serverTest.js';

describe('GET /api/user/all', () => {

    beforeAll(async () => {
        await prepareDatabase();
    });
    
    afterAll(async () => {
        await teardownDatabase();
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restaurer les mocks après chaque test
    });

    it('200 ', async () => {

        const allUsers = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
            { id: 2, firstName: 'John2', lastName: 'Doe2', email: 'john2.doe2@example.com' }
        ];

        const response = await request(app).get('/api/user/all'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining(allUsers[0]),
            expect.objectContaining(allUsers[1])
        ]));
    });

    it('500 ', async () => {
        // Mock de User.findAll pour lever une erreur
        User.findAll = jest.fn().mockRejectedValue(new Error('Erreur de réseau'));

        const response = await request(app).get('/api/user/all'); // Assurez-vous que l'URL est correcte
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            error: "Server error while findAll",
        });

        // Vérifier que findAll a bien été appelé
        expect(User.findAll).toHaveBeenCalled();
    });

});
